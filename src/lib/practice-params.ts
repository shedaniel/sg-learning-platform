import type { Difficulty, ExamPart } from "@/lib/content/types";

export interface ParsedPracticeParams {
  topicId: string | null;
  lessonId: string | null;
  questionIds: string[] | null;
  part: ExamPart | "both";
  difficulty: Difficulty | "mixed";
  count: number;
  feedback: "instant" | "end";
  mode: string;
  includeOfficial: boolean;
  weak: boolean;
}

export function parsePracticeSearchParams(
  raw: Record<string, string | string[] | undefined>,
): ParsedPracticeParams {
  const one = (key: string) => {
    const value = raw[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const count = Math.max(1, Math.min(60, Number(one("count") ?? 10) || 10));
  const partRaw = one("part");
  const difficultyRaw = one("difficulty");
  const feedbackRaw = one("feedback");
  const ids = one("questionIds");
  return {
    topicId: one("topicId") ?? null,
    lessonId: one("lessonId") ?? null,
    questionIds: ids ? ids.split(",").filter(Boolean) : null,
    part: partRaw === "A" || partRaw === "B" ? partRaw : "both",
    difficulty:
      difficultyRaw === "easy" || difficultyRaw === "medium" || difficultyRaw === "hard"
        ? difficultyRaw
        : "mixed",
    count,
    feedback: feedbackRaw === "end" ? "end" : "instant",
    mode: one("mode") ?? "custom",
    includeOfficial: one("official") !== "0",
    weak: one("weak") === "1",
  };
}
