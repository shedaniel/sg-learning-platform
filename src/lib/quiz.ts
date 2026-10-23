import type { Difficulty, ExamPart, Question } from "@/lib/content/types";
import { mulberry32, percent, shuffle } from "@/lib/utils";

export interface QuizConfig {
  topicIds?: string[];
  lessonIds?: string[];
  part?: ExamPart | "both";
  difficulty?: Difficulty | "mixed";
  count: number;
  seed?: number;
  preferWeak?: string[];
  includeOfficial?: boolean;
}

export interface QuizSelection {
  questions: Question[];
  skipped: number;
}

export function selectQuizQuestions(
  questions: Question[],
  config: QuizConfig,
): QuizSelection {
  const random = mulberry32(config.seed ?? Math.floor(Math.random() * 2 ** 31));
  let pool = questions.filter((question) => {
    if (config.topicIds?.length) {
      if (!question.topicIds.some((topicId) => config.topicIds?.includes(topicId))) return false;
    }
    if (config.lessonIds?.length) {
      if (!question.lessonIds.some((lessonId) => config.lessonIds?.includes(lessonId))) return false;
    }
    if (config.part && config.part !== "both" && question.part !== config.part) return false;
    if (config.difficulty && config.difficulty !== "mixed") {
      if (question.difficulty !== config.difficulty) return false;
    }
    if (config.includeOfficial === false && question.source.kind === "official") return false;
    return true;
  });

  if (config.preferWeak?.length) {
    pool = [...pool].sort((a, b) => {
      const aWeak = a.topicIds.some((id) => config.preferWeak?.includes(id)) ? 0 : 1;
      const bWeak = b.topicIds.some((id) => config.preferWeak?.includes(id)) ? 0 : 1;
      return aWeak - bWeak;
    });
  } else {
    pool = shuffle(pool, random);
  }

  const selected = pool.slice(0, Math.max(0, config.count));
  return { questions: selected, skipped: pool.length - selected.length };
}

export function gradeQuiz(
  questions: Question[],
  answers: Record<string, string>,
): { correct: number; total: number; accuracy: number; details: Array<{ questionId: string; correct: boolean }> } {
  const details = questions.map((question) => ({
    questionId: question.id,
    correct: answers[question.id] === question.correctOptionId,
  }));
  const correct = details.filter((detail) => detail.correct).length;
  return {
    correct,
    total: questions.length,
    accuracy: percent(correct, questions.length),
    details,
  };
}
