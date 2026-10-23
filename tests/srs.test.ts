import { describe, expect, it } from "vitest";
import { nextSchedule } from "@/lib/db/store";
import { createDatabase } from "@/lib/db";

describe("nextSchedule", () => {
  it("resets interval after a lapse", () => {
    const result = nextSchedule({ intervalDays: 20, ease: 2.5, reps: 3, lapses: 1 }, 0);
    expect(result.intervalDays).toBe(0);
    expect(result.lapses).toBe(2);
    expect(result.reps).toBe(0);
    expect(result.ease).toBeLessThan(2.5);
  });

  it("expands interval on good and easy grades", () => {
    const good = nextSchedule({ intervalDays: 4, ease: 2.5, reps: 2, lapses: 0 }, 2);
    expect(good.intervalDays).toBeGreaterThan(4);
    const easy = nextSchedule({ intervalDays: 4, ease: 2.5, reps: 2, lapses: 0 }, 3);
    expect(easy.intervalDays).toBeGreaterThan(good.intervalDays);
  });

  it("starts at one day for a first correct answer", () => {
    expect(nextSchedule(null, 2).intervalDays).toBe(1);
    expect(nextSchedule(null, 3).intervalDays).toBe(2);
    expect(nextSchedule(null, 0).intervalDays).toBe(0);
  });

  it("never drops ease below the floor", () => {
    let state = { intervalDays: 10, ease: 2.5, reps: 3, lapses: 0 };
    for (let i = 0; i < 20; i += 1) state = nextSchedule(state, 0);
    expect(state.ease).toBeGreaterThanOrEqual(1.3);
  });

  it("caps the interval at 180 days", () => {
    const state = { intervalDays: 170, ease: 3, reps: 3, lapses: 0 };
    expect(nextSchedule(state, 3).intervalDays).toBeLessThanOrEqual(180);
  });
});

describe("database migrations", () => {
  it("creates the expected schema", () => {
    const db = createDatabase(":memory:");
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
      .all()
      .map((row) => String((row as { name: string }).name));
    for (const table of [
      "profiles",
      "lesson_progress",
      "question_attempts",
      "quiz_attempts",
      "mock_attempts",
      "review_items",
      "bookmarks",
      "study_plans",
    ]) {
      expect(tables).toContain(table);
    }
    const version = db.prepare("PRAGMA user_version").get() as { user_version: number };
    expect(version.user_version).toBe(1);
  });

  it("enforces profile-backed uniqueness", () => {
    const db = createDatabase(":memory:");
    db.prepare("INSERT INTO profiles (id, name, created_at) VALUES (?, ?, ?)").run("p1", "L", new Date().toISOString());
    const insert = db.prepare(
      "INSERT INTO lesson_progress (profile_id, lesson_id, started_at, last_viewed_at) VALUES (?, ?, ?, ?)",
    );
    insert.run("p1", "security/cia-and-design", "2026-01-01", "2026-01-01");
    expect(() => insert.run("p1", "security/cia-and-design", "2026-01-02", "2026-01-02")).toThrow();
  });
});
