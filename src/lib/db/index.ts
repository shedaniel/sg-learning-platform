import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { MIGRATIONS } from "./migrations";

const globalForDb = globalThis as unknown as {
  __sgDb?: DatabaseSync;
};

function resolveDbPath(): string {
  const configured = process.env.SG_DB_PATH;
  if (configured) return configured;
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, "sg.db");
}

export function migrate(db: DatabaseSync): void {
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA foreign_keys = ON");
  const row = db.prepare("PRAGMA user_version").get() as { user_version: number };
  let current = Number(row?.user_version ?? 0);
  for (const migration of MIGRATIONS) {
    if (migration.version <= current) continue;
    db.exec("BEGIN IMMEDIATE");
    try {
      for (const statement of migration.statements) db.exec(statement);
      db.exec(`PRAGMA user_version = ${migration.version}`);
      db.exec("COMMIT");
      current = migration.version;
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
}

export function createDatabase(filename = resolveDbPath()): DatabaseSync {
  const db = new DatabaseSync(filename);
  migrate(db);
  return db;
}

export function getDb(): DatabaseSync {
  if (!globalForDb.__sgDb) {
    globalForDb.__sgDb = createDatabase();
  }
  return globalForDb.__sgDb;
}

export function inTransaction<T>(db: DatabaseSync, fn: () => T): T {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
