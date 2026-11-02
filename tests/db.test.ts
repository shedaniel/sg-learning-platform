import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createClient } from "@libsql/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createDatabase, resolveDbConfig, type Db } from "@/lib/db";
import { MIGRATIONS } from "@/lib/db/migrations";

let dir: string;
beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "sg-db-"));
});
afterEach(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

function open(name = "test.db"): { db: Db; url: string } {
  const url = `file:${path.join(dir, name)}`;
  return { db: createDatabase({ url }), url };
}

describe("database migrations", () => {
  it("creates the expected schema and records every migration", async () => {
    const { db } = open();
    const tables = (await db.all<{ name: string }>("SELECT name FROM sqlite_master WHERE type = 'table'")).map(
      (row) => row.name,
    );
    for (const table of [
      "profiles",
      "lesson_progress",
      "question_attempts",
      "quiz_attempts",
      "mock_attempts",
      "review_items",
      "bookmarks",
      "schema_migrations",
    ]) {
      expect(tables).toContain(table);
    }
    expect(tables).not.toContain("study_plans");
    const versions = (await db.all<{ version: number }>("SELECT version FROM schema_migrations ORDER BY version")).map(
      (row) => row.version,
    );
    expect(versions).toEqual(MIGRATIONS.map((migration) => migration.version));
  });

  it("is idempotent across reopen and does not re-run applied migrations", async () => {
    const first = open();
    await first.db.run("INSERT INTO profiles (id, name, created_at) VALUES (?, ?, ?)", ["p1", "L", "2026-01-01"]);
    const second = createDatabase({ url: first.url });
    const row = await second.get<{ n: number }>("SELECT COUNT(*) AS n FROM profiles");
    expect(Number(row?.n)).toBe(1);
    const count = await second.get<{ n: number }>("SELECT COUNT(*) AS n FROM schema_migrations");
    expect(Number(count?.n)).toBe(MIGRATIONS.length);
  });

  it("adopts databases created before versions moved out of PRAGMA user_version", async () => {
    const url = `file:${path.join(dir, "legacy.db")}`;
    const raw = createClient({ url });
    for (const statement of MIGRATIONS[0].statements) await raw.execute(statement);
    await raw.execute("PRAGMA user_version = 2");
    await raw.execute("INSERT INTO profiles (id, name, created_at) VALUES ('legacy', 'L', '2026-01-01')");
    raw.close();

    const db = createDatabase({ url });
    const profile = await db.get<{ id: string }>("SELECT id FROM profiles WHERE id = 'legacy'");
    expect(profile?.id).toBe("legacy");
    const versions = (await db.all<{ version: number }>("SELECT version FROM schema_migrations ORDER BY version")).map(
      (row) => row.version,
    );
    expect(versions).toEqual([1, 2]);
  });

  it("enforces uniqueness on lesson progress", async () => {
    const { db } = open();
    const insert = () =>
      db.run(
        "INSERT INTO lesson_progress (profile_id, lesson_id, started_at, last_viewed_at) VALUES (?, ?, ?, ?)",
        ["p1", "security/cia-and-design", "2026-01-01", "2026-01-01"],
      );
    await insert();
    await expect(insert()).rejects.toThrow();
  });
});

describe("batch", () => {
  it("rolls everything back when one statement fails", async () => {
    const { db } = open();
    await expect(
      db.batch([
        { sql: "INSERT INTO profiles (id, name, created_at) VALUES (?, ?, ?)", args: ["a", "A", "2026-01-01"] },
        { sql: "INSERT INTO no_such_table (x) VALUES (1)" },
      ]),
    ).rejects.toThrow();
    const row = await db.get<{ n: number }>("SELECT COUNT(*) AS n FROM profiles");
    expect(Number(row?.n)).toBe(0);
  });
});

describe("resolveDbConfig", () => {
  it("prefers SG_DB_URL, then Turso variables, then SG_DB_PATH", () => {
    expect(
      resolveDbConfig({ SG_DB_URL: "libsql://x.turso.io", SG_DB_AUTH_TOKEN: "t", SG_DB_PATH: "/tmp/a.db" } as never),
    ).toEqual({ url: "libsql://x.turso.io", authToken: "t" });
    expect(
      resolveDbConfig({ TURSO_DATABASE_URL: "libsql://y.turso.io", TURSO_AUTH_TOKEN: "u" } as never),
    ).toEqual({ url: "libsql://y.turso.io", authToken: "u" });
    expect(resolveDbConfig({ SG_DB_PATH: "/tmp/a.db" } as never)).toEqual({ url: "file:/tmp/a.db" });
    expect(resolveDbConfig({ SG_DB_PATH: "file:/tmp/b.db" } as never)).toEqual({ url: "file:/tmp/b.db" });
  });
});
