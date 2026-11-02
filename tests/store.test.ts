import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sg-store-"));
process.env.SG_DB_URL = process.env.SG_TEST_DB_URL ?? `file:${path.join(dir, "store.db")}`;
delete process.env.SG_DB_PATH;

type Store = typeof import("@/lib/db/store");
let store: Store;

beforeAll(async () => {
  store = await import("@/lib/db/store");
});
afterAll(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

describe("store against libSQL", () => {
  it("records attempts and reads them back in order", async () => {
    await store.recordQuestionAttempt({ profileId: "u1", questionId: "q1", selected: "a", correct: true, mode: "quiz" });
    await store.recordQuestionAttempt({ profileId: "u1", questionId: "q2", selected: "b", correct: false, mode: "quiz" });
    const attempts = await store.getAllAttempts("u1");
    expect(attempts.map((attempt) => attempt.questionId)).toEqual(["q1", "q2"]);
    expect(attempts.map((attempt) => attempt.correct)).toEqual([true, false]);
    expect(typeof attempts[0].elapsedMs).toBe("number");
  });

  it("toggles bookmarks and keeps lesson completion reversible", async () => {
    expect(await store.toggleBookmark("u2", "question", "q9")).toBe(true);
    expect(await store.isBookmarked("u2", "question", "q9")).toBe(true);
    expect(await store.toggleBookmark("u2", "question", "q9")).toBe(false);
    expect(await store.isBookmarked("u2", "question", "q9")).toBe(false);

    await store.setLessonCompleted("u2", "security/cia-and-design", true);
    expect(await store.getCompletedLessonIds("u2")).toEqual(["security/cia-and-design"]);
    await store.setLessonCompleted("u2", "security/cia-and-design", false);
    expect(await store.getCompletedLessonIds("u2")).toEqual([]);
    expect(await store.getStartedLessonIds("u2")).toEqual(["security/cia-and-design"]);
  });

  it("schedules reviews and counts what is due", async () => {
    const lapse = await store.scheduleReview("u3", "question", "q1", 0);
    expect(lapse.lapses).toBe(1);
    const counts = await store.getReviewCounts("u3");
    expect(counts).toEqual({ due: 1, total: 1 });
    const good = await store.scheduleReview("u3", "question", "q1", 2);
    expect(good.intervalDays).toBeGreaterThan(0);
    expect((await store.getReviewCounts("u3")).due).toBe(0);
  });

  it("submits a mock exam atomically with its attempt rows", async () => {
    const id = await store.createMockAttempt({ profileId: "u4", questionIds: ["q1", "q2"], durationSec: 7200 });
    const before = await store.getMockAttempt(id, "u4");
    expect(before?.submittedAt).toBeNull();
    expect(await store.getMockAttempt(id, "someone-else")).toBeNull();

    await store.submitMockAttempt(id, "u4", {
      answers: { q1: { selected: "a", elapsedMs: 1000 } },
      flags: [],
      currentIndex: 1,
      correct: 1,
      result: { accuracy: 50 },
      attemptRecords: [
        { questionId: "q1", selected: "a", correct: true, elapsedMs: 1000 },
        { questionId: "q2", selected: "b", correct: false, elapsedMs: 2000 },
      ],
    });
    const after = await store.getMockAttempt(id, "u4");
    expect(after?.submittedAt).not.toBeNull();
    expect(after?.correct).toBe(1);
    expect(after?.result).toEqual({ accuracy: 50 });
    expect((await store.getAllAttempts("u4")).length).toBe(2);
    const history = await store.getMockHistory("u4");
    expect(history).toHaveLength(1);
    expect(history[0].correct).toBe(1);
  });

  it("resets only the requested profile", async () => {
    await store.recordQuestionAttempt({ profileId: "keep", questionId: "q1", selected: "a", correct: true, mode: "quiz" });
    await store.recordQuestionAttempt({ profileId: "wipe", questionId: "q1", selected: "a", correct: true, mode: "quiz" });
    await store.resetProgress("wipe");
    expect(await store.getAllAttempts("wipe")).toHaveLength(0);
    expect(await store.getAllAttempts("keep")).toHaveLength(1);
  });

  it("stores and updates content metadata", async () => {
    await store.setMeta("k", "v1");
    await store.setMeta("k", "v2");
    expect(await store.getMeta("k")).toBe("v2");
    expect(await store.getMeta("missing")).toBeNull();
  });
});
