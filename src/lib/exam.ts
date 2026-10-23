import type { ExamPart, Question } from "@/lib/content/types";
import { mulberry32, percent, shuffle, uniqueBy } from "@/lib/utils";

export interface MockConfig {
  partA: number;
  partB: number;
  seed?: number;
}

export interface MockAnswer {
  selected: string;
  elapsedMs: number;
}

export interface MockResult {
  total: number;
  answered: number;
  correct: number;
  accuracy: number;
  byPart: Record<ExamPart, { total: number; correct: number; accuracy: number }>;
  byTopic: Array<{
    topicId: string;
    total: number;
    correct: number;
    accuracy: number;
  }>;
  byDifficulty: Array<{
    difficulty: string;
    total: number;
    correct: number;
    accuracy: number;
  }>;
  totalElapsedMs: number;
  averageElapsedMs: number;
  unanswered: number;
  questions: Array<{
    questionId: string;
    part: ExamPart;
    selected: string | null;
    correctOptionId: string;
    correct: boolean;
    elapsedMs: number;
  }>;
  weakTopicIds: string[];
}

function selectBalanced(
  questions: Question[],
  count: number,
  rng: () => number,
): Question[] {
  if (questions.length <= count) return [...questions];
  const groups = new Map<string, Question[]>();
  for (const question of shuffle(questions, rng)) {
    const key = question.topicIds[0] ?? "other";
    const group = groups.get(key) ?? [];
    group.push(question);
    groups.set(key, group);
  }
  const buckets = shuffle([...groups.values()], rng);
  const selected: Question[] = [];
  let cursor = 0;
  while (selected.length < count && buckets.some((bucket) => bucket.length > 0)) {
    const bucket = buckets[cursor % buckets.length];
    const next = bucket.shift();
    if (next) selected.push(next);
    cursor += 1;
  }
  return selected;
}

export function composeMockExam(
  questions: Question[],
  config: MockConfig = { partA: 48, partB: 12 },
): Question[] {
  const random = mulberry32(config.seed ?? Math.floor(Math.random() * 2 ** 31));
  const partA = uniqueBy(
    questions.filter((question) => question.part === "A"),
    (question) => question.id,
  );
  const partB = uniqueBy(
    questions.filter((question) => question.part === "B"),
    (question) => question.id,
  );
  const pickedA = selectBalanced(partA, Math.min(config.partA, partA.length), random);
  const pickedB = selectBalanced(partB, Math.min(config.partB, partB.length), random);
  const extras = uniqueBy(
    questions.filter(
      (question) => !pickedA.some((item) => item.id === question.id) && !pickedB.some((item) => item.id === question.id),
    ),
    (question) => question.id,
  );
  const target = config.partA + config.partB;
  const result = [...pickedA, ...pickedB];
  if (result.length < target) {
    result.push(...selectBalanced(extras, target - result.length, random));
  }
  return shuffle(result, random);
}

export function gradeQuestion(question: Question, selected: string | undefined): boolean {
  return Boolean(selected && selected === question.correctOptionId);
}

export function scoreMock(
  questionIds: string[],
  answers: Record<string, MockAnswer>,
  questionMap: Map<string, Question>,
): MockResult {
  const byPart: MockResult["byPart"] = {
    A: { total: 0, correct: 0, accuracy: 0 },
    B: { total: 0, correct: 0, accuracy: 0 },
  };
  const topicTotals = new Map<string, { total: number; correct: number }>();
  const difficultyTotals = new Map<string, { total: number; correct: number }>();
  let correct = 0;
  let answered = 0;
  let totalElapsedMs = 0;

  const details: MockResult["questions"] = [];
  for (const id of questionIds) {
    const question = questionMap.get(id);
    if (!question) continue;
    const answer = answers[id];
    const selected = answer?.selected ?? null;
    const isCorrect = selected === question.correctOptionId;
    const elapsed = Math.max(0, answer?.elapsedMs ?? 0);
    if (selected) answered += 1;
    if (isCorrect) correct += 1;
    totalElapsedMs += elapsed;

    byPart[question.part].total += 1;
    if (isCorrect) byPart[question.part].correct += 1;

    for (const topicId of question.topicIds) {
      const entry = topicTotals.get(topicId) ?? { total: 0, correct: 0 };
      entry.total += 1;
      if (isCorrect) entry.correct += 1;
      topicTotals.set(topicId, entry);
    }
    const difficulty = difficultyTotals.get(question.difficulty) ?? { total: 0, correct: 0 };
    difficulty.total += 1;
    if (isCorrect) difficulty.correct += 1;
    difficultyTotals.set(question.difficulty, difficulty);

    details.push({
      questionId: id,
      part: question.part,
      selected,
      correctOptionId: question.correctOptionId,
      correct: isCorrect,
      elapsedMs: elapsed,
    });
  }

  const byPartResult = Object.fromEntries(
    (Object.keys(byPart) as ExamPart[]).map((part) => [
      part,
      {
        ...byPart[part],
        accuracy: percent(byPart[part].correct, byPart[part].total),
      },
    ]),
  ) as MockResult["byPart"];

  const byTopic = [...topicTotals.entries()]
    .map(([topicId, entry]) => ({
      topicId,
      total: entry.total,
      correct: entry.correct,
      accuracy: percent(entry.correct, entry.total),
    }))
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total);

  const difficultyOrder: Record<string, number> = { easy: 0, medium: 1, hard: 2 };
  const byDifficulty = [...difficultyTotals.entries()]
    .map(([difficulty, entry]) => ({
      difficulty,
      total: entry.total,
      correct: entry.correct,
      accuracy: percent(entry.correct, entry.total),
    }))
    .sort((a, b) => (difficultyOrder[a.difficulty] ?? 9) - (difficultyOrder[b.difficulty] ?? 9));

  const total = details.length;
  return {
    total,
    answered,
    correct,
    accuracy: percent(correct, total),
    byPart: byPartResult,
    byTopic,
    byDifficulty,
    totalElapsedMs,
    averageElapsedMs: total ? Math.round(totalElapsedMs / total) : 0,
    unanswered: total - answered,
    questions: details,
    weakTopicIds: byTopic.filter((row) => row.accuracy < 70).map((row) => row.topicId),
  };
}

export function estimatedReadiness(input: {
  lessonCoverage: number;
  recentAccuracy: number;
  topicBreadth: number;
  mockAccuracy: number;
  totalAttempts: number;
}): { score: number; confidence: "low" | "medium" | "high"; note: string } {
  const score = Math.round(
    input.lessonCoverage * 25 +
      input.recentAccuracy * 35 +
      input.topicBreadth * 20 +
      input.mockAccuracy * 20,
  );
  const confidence =
    input.totalAttempts >= 120 && input.mockAccuracy > 0
      ? "high"
      : input.totalAttempts >= 40
        ? "medium"
        : "low";
  return {
    score,
    confidence,
    note: "本サイト独自の暫定指標です。IPAのIRT評価点・合否判定ではありません。",
  };
}
