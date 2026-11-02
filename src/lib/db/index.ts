import fs from "node:fs";
import path from "node:path";
import { createClient, type Client, type InValue } from "@libsql/client";
import { MIGRATIONS } from "./migrations";

export type SqlArgs = InValue[];
export interface SqlStatement {
  sql: string;
  args?: SqlArgs;
}

/** Thin async facade over a libSQL client. Works for local files and remote Turso. */
export interface Db {
  all<T = Record<string, unknown>>(sql: string, args?: SqlArgs): Promise<T[]>;
  get<T = Record<string, unknown>>(sql: string, args?: SqlArgs): Promise<T | undefined>;
  run(sql: string, args?: SqlArgs): Promise<{ rowsAffected: number }>;
  /** Runs all statements atomically in one round trip. */
  batch(statements: SqlStatement[]): Promise<void>;
}

export interface DbConfig {
  /** `libsql://…`, `https://…`, or `file:path/to.db`. */
  url: string;
  authToken?: string;
}

const globalForDb = globalThis as unknown as {
  __sgDb?: Db;
};

function isLocalFile(url: string): boolean {
  return url.startsWith("file:");
}

/**
 * Resolution order:
 * 1. SG_DB_URL (+ SG_DB_AUTH_TOKEN) — also accepts Turso's TURSO_DATABASE_URL / TURSO_AUTH_TOKEN
 * 2. SG_DB_PATH — a local file path, kept for backwards compatibility
 * 3. ./data/sg.db
 */
export function resolveDbConfig(env: NodeJS.ProcessEnv = process.env): DbConfig {
  const url = env.SG_DB_URL ?? env.TURSO_DATABASE_URL;
  if (url) {
    return { url, authToken: env.SG_DB_AUTH_TOKEN ?? env.TURSO_AUTH_TOKEN };
  }
  const configuredPath = env.SG_DB_PATH;
  if (configuredPath) {
    return { url: configuredPath.startsWith("file:") ? configuredPath : `file:${path.resolve(configuredPath)}` };
  }
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  return { url: `file:${path.join(dir, "sg.db")}` };
}

function toRows<T>(rows: ArrayLike<Record<string, unknown>>): T[] {
  return Array.from(rows, (row) => ({ ...row }) as T);
}

function wrap(client: Client, config: DbConfig): Db {
  let ready: Promise<void> | null = null;

  function ensureReady(): Promise<void> {
    if (!ready) {
      ready = migrate(client, config).catch((error) => {
        ready = null; // allow a retry on the next call
        throw error;
      });
    }
    return ready;
  }

  return {
    async all<T>(sql: string, args: SqlArgs = []) {
      await ensureReady();
      const result = await client.execute({ sql, args });
      return toRows<T>(result.rows as unknown as ArrayLike<Record<string, unknown>>);
    },
    async get<T>(sql: string, args: SqlArgs = []) {
      await ensureReady();
      const result = await client.execute({ sql, args });
      const row = result.rows[0] as unknown as Record<string, unknown> | undefined;
      return row ? ({ ...row } as T) : undefined;
    },
    async run(sql: string, args: SqlArgs = []) {
      await ensureReady();
      const result = await client.execute({ sql, args });
      return { rowsAffected: result.rowsAffected };
    },
    async batch(statements: SqlStatement[]) {
      await ensureReady();
      if (statements.length === 0) return;
      await client.batch(
        statements.map((statement) => ({ sql: statement.sql, args: statement.args ?? [] })),
        "write",
      );
    },
  };
}

export async function migrate(client: Client, config?: DbConfig): Promise<void> {
  if (!config || isLocalFile(config.url)) {
    // WAL keeps readers and the single writer from blocking each other on local files.
    await client.execute("PRAGMA journal_mode = WAL");
  }
  await client.execute(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
       version INTEGER PRIMARY KEY,
       name TEXT NOT NULL,
       applied_at TEXT NOT NULL
     )`,
  );
  const appliedRows = await client.execute("SELECT version FROM schema_migrations");
  const applied = new Set(appliedRows.rows.map((row) => Number(row.version)));

  if (applied.size === 0) {
    // Databases created before libSQL tracked versions in PRAGMA user_version.
    let legacyVersion = 0;
    try {
      const legacy = await client.execute("PRAGMA user_version");
      legacyVersion = Number(legacy.rows[0]?.user_version ?? 0);
    } catch {
      legacyVersion = 0;
    }
    if (legacyVersion > 0) {
      const now = new Date().toISOString();
      const known = MIGRATIONS.filter((migration) => migration.version <= legacyVersion);
      if (known.length > 0) {
        await client.batch(
          known.map((migration) => ({
            sql: "INSERT OR IGNORE INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)",
            args: [migration.version, migration.name, now],
          })),
          "write",
        );
        for (const migration of known) applied.add(migration.version);
      }
    }
  }

  for (const migration of MIGRATIONS) {
    if (applied.has(migration.version)) continue;
    // Statements are idempotent and the version row is written in the same batch,
    // so concurrent cold starts racing on a fresh remote database stay safe.
    await client.batch(
      [
        ...migration.statements.map((sql) => ({ sql, args: [] as InValue[] })),
        {
          sql: "INSERT OR IGNORE INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)",
          args: [migration.version, migration.name, new Date().toISOString()],
        },
      ],
      "write",
    );
    applied.add(migration.version);
  }
}

/** Creates an independent database handle; migrations run lazily on first use. */
export function createDatabase(config: DbConfig = resolveDbConfig()): Db {
  const client = createClient({ url: config.url, authToken: config.authToken });
  return wrap(client, config);
}

export function getDb(): Db {
  if (!globalForDb.__sgDb) {
    globalForDb.__sgDb = createDatabase();
  }
  return globalForDb.__sgDb;
}

/** Applies migrations now (used by scripts and tests); normal requests migrate lazily. */
export async function ensureMigrated(db: Db = getDb()): Promise<void> {
  await db.get("SELECT 1 AS ok");
}
