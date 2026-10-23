import { describe, expect, it } from "vitest";
import { ALL_QUESTIONS } from "@/content";
import { gradeQuiz, selectQuizQuestions } from "@/lib/quiz";

describe("selectQuizQuestions", () => {
  it("filters by part and difficulty", () => {
    const selection = selectQuizQuestions(ALL_QUESTIONS, {
      part: "B",
      difficulty: "hard",
      count: 5,
      seed: 1,
      includeOfficial: false,
    });
    expect(selection.questions.length).toBeLessThanOrEqual(5);
    for (const question of selection.questions) {
      expect(question.part).toBe("B");
      expect(question.difficulty).toBe("hard");
      expect(question.source.kind).toBe("original");
    }
  });

  it("returns unique questions and respects count", () => {
    const selection = selectQuizQuestions(ALL_QUESTIONS, { count: 10, seed: 2 });
    expect(selection.questions).toHaveLength(Math.min(10, ALL_QUESTIONS.length));
    expect(new Set(selection.questions.map((question) => question.id)).size).toBe(
      selection.questions.length,
    );
  });

  it("filters by topic", () => {
    const topicId = ALL_QUESTIONS[0]?.topicIds[0];
    if (!topicId) return;
    const selection = selectQuizQuestions(ALL_QUESTIONS, { topicIds: [topicId], count: 20 });
    expect(selection.questions.length).toBeGreaterThan(0);
    for (const question of selection.questions) {
      expect(question.topicIds).toContain(topicId);
    }
  });
});

describe("gradeQuiz", () => {
  it("grades correct and missing answers", () => {
    const sample = ALL_QUESTIONS.slice(0, 3);
    if (sample.length < 2) return;
    const answers = {
      [sample[0].id]: sample[0].correctOptionId,
      [sample[1].id]: sample[1].options.find((option) => option.id !== sample[1].correctOptionId)?.id ?? "a",
    };
    const result = gradeQuiz(sample, answers);
    expect(result.total).toBe(3);
    expect(result.correct).toBe(1);
    expect(result.details.filter((detail) => !detail.correct)).toHaveLength(2);
  });
});
