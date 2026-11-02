import { createDatabase, ensureMigrated, resolveDbConfig } from "../src/lib/db";

async function main() {
  const config = resolveDbConfig();
  const db = createDatabase(config);
  await ensureMigrated(db);
  const rows = await db.all<{ version: number; name: string }>(
    "SELECT version, name FROM schema_migrations ORDER BY version",
  );
  const target = config.url.startsWith("file:") ? config.url : config.url.replace(/\/\/[^@]*@/, "//");
  console.log(`database ready: ${target}`);
  console.log(`migrations applied: ${rows.map((row) => `${row.version}:${row.name}`).join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
