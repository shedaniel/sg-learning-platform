/**
 * Copies one learner's progress from one database into another, optionally
 * renaming the profile to a readable sync code.
 *
 *   SG_DB_URL=libsql://… SG_DB_AUTH_TOKEN=… \
 *     npm run db:import-profile -- --profile <id-in-source> --as <sync-code> [--from file:data/sg.db] [--dry-run]
 *
 * The destination is whatever the usual environment variables point at.
 * Re-running is safe: rows that already exist are left untouched.
 */
import path from "node:path";
import { createDatabase, ensureMigrated, resolveDbConfig, type Db, type DbConfig } from "../src/lib/db";
import { isValidProfileCode, normalizeProfileCode } from "../src/lib/profile";

const PROFILE_TABLES = [
  "lesson_progress",
  "term_progress",
  "quiz_attempts",
  "question_attempts",
  "mock_attempts",
  "bookmarks",
  "review_items",
  "study_sessions",
] as const;

function argValue(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function toConfig(value: string): DbConfig {
  if (/^(libsql|https?|wss?|file):/.test(value)) return { url: value, authToken: process.env.SG_SOURCE_AUTH_TOKEN };
  return { url: `file:${path.resolve(value)}` };
}

async function countFor(db: Db, table: string, column: string, id: string): Promise<number> {
  const row = await db.get<{ n: number }>(`SELECT COUNT(*) AS n FROM ${table} WHERE ${column} = ?`, [id]);
  return Number(row?.n ?? 0);
}

async function main() {
  const sourceId = argValue("profile");
  const targetId = normalizeProfileCode(argValue("as") ?? sourceId ?? "");
  const dryRun = process.argv.includes("--dry-run");
  if (!sourceId) throw new Error("--profile <id in the source database> is required");
  if (!isValidProfileCode(targetId)) throw new Error(`"${targetId}" is not a valid sync code`);

  const sourceConfig = toConfig(argValue("from") ?? "data/sg.db");
  const destinationConfig = resolveDbConfig();
  if (sourceConfig.url === destinationConfig.url) throw new Error("Source and destination are the same database");

  const source = createDatabase(sourceConfig);
  const destination = createDatabase(destinationConfig);
  await ensureMigrated(source);
  await ensureMigrated(destination);

  const profile = await source.get<Record<string, unknown>>("SELECT * FROM profiles WHERE id = ?", [sourceId]);
  if (!profile) throw new Error(`Profile ${sourceId} was not found in ${sourceConfig.url}`);

  const host = destinationConfig.url.replace(/\/\/[^@]*@/, "//");
  console.log(`${dryRun ? "[dry run] " : ""}${sourceId}  ->  ${targetId}`);
  console.log(`  from ${sourceConfig.url}\n  to   ${host}`);

  const statements: Array<{ sql: string; args: Array<string | number | null> }> = [];
  const insert = (table: string, row: Record<string, unknown>, overrides: Record<string, unknown>) => {
    const merged = { ...row, ...overrides };
    const columns = Object.keys(merged);
    statements.push({
      sql: `INSERT OR IGNORE INTO ${table} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
      args: columns.map((column) => merged[column] as string | number | null),
    });
  };

  insert("profiles", profile, { id: targetId, name: String(profile.name ?? targetId) });
  const planned: Record<string, number> = {};
  for (const table of PROFILE_TABLES) {
    const rows = await source.all<Record<string, unknown>>(`SELECT * FROM ${table} WHERE profile_id = ?`, [sourceId]);
    planned[table] = rows.length;
    for (const row of rows) insert(table, row, { profile_id: targetId });
  }

  const before: Record<string, number> = {};
  for (const table of PROFILE_TABLES) before[table] = await countFor(destination, table, "profile_id", targetId);

  if (!dryRun) {
    for (let index = 0; index < statements.length; index += 100) {
      await destination.batch(statements.slice(index, index + 100));
    }
  }

  console.log("\n  table               in source   already there   now there");
  for (const table of PROFILE_TABLES) {
    const after = dryRun ? before[table] : await countFor(destination, table, "profile_id", targetId);
    console.log(`  ${table.padEnd(18)}  ${String(planned[table]).padStart(9)}   ${String(before[table]).padStart(13)}   ${String(after).padStart(9)}`);
  }
  console.log(dryRun ? "\nDry run only: nothing was written." : `\nDone. Open the site and enter the sync code "${targetId}".`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
