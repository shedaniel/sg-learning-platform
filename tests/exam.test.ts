import { describe, expect, it } from "vitest";
import type { Question } from "@/lib/content/types";
import { composeMockExam, scoreMock, estimatedReadiness, type MockAnswer } from "@/lib/exam";

function question(index: number, part: "A" | "B"): Question {
  return {
    id: `q-${part}-${index}`,
    part,
    topicIds: [`topic-${index % 4}`],
    lessonIds: ["lesson/x"],
    difficulty: index % 3 === 0 ? "hard" : index % 2 === 0 ? "medium" : "easy",
    type: part === "B" ? "scenario" : "knowledge",
    stem: `問題 ${index}`,
    options: [
      { id: "a", text: "ア" },
      { id: "i", text: "イ" },
      { id: "u", text: "ウ" },
      { id: "e", text: "エ" },
    ],
    correctOptionId: "i",
    explanation: { correct: "イ", why: ["理由"], optionNotes: { a: "違う", u: "違う", e: "違う" }, termIds: [] },
    source: { kind: "original", attribution: "test" },
    tags: [],
  };
}

const questions = [
  ...Array.from({ length: 60 }, (_, index) => question(index, "A")),
  ...Array.from({ length: 20 }, (_, index) => question(index + 100, "B")),
];

describe("composeMockExam", () => {
  it("selects exactly 48 A and 12 B without duplicates", () => {
    const exam = composeMockExam(questions, { partA: 48, partB: 12, seed: 42 });
    expect(exam).toHaveLength(60);
    expect(exam.filter((item) => item.part === "A")).toHaveLength(48);
    expect(exam.filter((item) => item.part === "B")).toHaveLength(12);
    expect(new Set(exam.map((item) => item.id)).size).toBe(60);
  });

  it("is deterministic for a seed", () => {
    const first = composeMockExam(questions, { partA: 48, partB: 12, seed: 7 }).map((item) => item.id);
    const second = composeMockExam(questions, { partA: 48, partB: 12, seed: 7 }).map((item) => item.id);
    expect(first).toEqual(second);
  });

  it("does not duplicate when bank has extra questions", () => {
    const exam = composeMockExam(questions, { partA: 10, partB: 5, seed: 3 });
    expect(exam).toHaveLength(15);
    expect(new Set(exam.map((item) => item.id)).size).toBe(15);
  });
});

describe("scoreMock", () => {
  it("scores answered, unanswered, parts, topics and time", () => {
    const map = new Map(questions.map((item) => [item.id, item]));
    const ids = ["q-A-0", "q-A-1", "q-B-100"];
    const answers: Record<string, MockAnswer> = {
      "q-A-0": { selected: "i", elapsedMs: 30_000 },
      "q-A-1": { selected: "a", elapsedMs: 20_000 },
    };
    const result = scoreMock(ids, answers, map);
    expect(result.total).toBe(3);
    expect(result.answered).toBe(2);
    expect(result.correct).toBe(1);
    expect(result.unanswered).toBe(1);
    expect(result.accuracy).toBe(33);
    expect(result.byPart.A).toEqual({ total: 2, correct: 1, accuracy: 50 });
    expect(result.byPart.B).toEqual({ total: 1, correct: 0, accuracy: 0 });
    expect(result.totalElapsedMs).toBe(50_000);
    expect(result.questions.find((row) => row.questionId === "q-B-100")?.selected).toBeNull();
  });

  it("handles an empty answer map", () => {
    const map = new Map(questions.map((item) => [item.id, item]));
    const result = scoreMock(["q-A-0"], {}, map);
    expect(result.correct).toBe(0);
    expect(result.unanswered).toBe(1);
    expect(result.averageElapsedMs).toBe(0);
  });
});

describe("estimatedReadiness", () => {
  it("weights coverage, accuracy, breadth and mock", () => {
    const result = estimatedReadiness({
      lessonCoverage: 1,
      recentAccuracy: 1,
      topicBreadth: 1,
      mockAccuracy: 1,
      totalAttempts: 200,
    });
    expect(result.score).toBe(100);
    expect(result.confidence).toBe("high");
  });
  it("treats accuracy as a 0-1 fraction and never exceeds 100", () => {
    const onlyAccuracy = estimatedReadiness({
      lessonCoverage: 0,
      recentAccuracy: 1,
      topicBreadth: 0,
      mockAccuracy: 0,
      totalAttempts: 1,
    });
    expect(onlyAccuracy.score).toBe(35);
    const overscaled = estimatedReadiness({
      lessonCoverage: 0,
      recentAccuracy: 100,
      topicBreadth: 0,
      mockAccuracy: 0,
      totalAttempts: 1,
    });
    expect(overscaled.score).toBe(100);
  });
  it("keeps a low confidence with little data", () => {
    expect(
      estimatedReadiness({
        lessonCoverage: 0.2,
        recentAccuracy: 0.5,
        topicBreadth: 0.1,
        mockAccuracy: 0,
        totalAttempts: 4,
      }).confidence,
    ).toBe("low");
  });
});
