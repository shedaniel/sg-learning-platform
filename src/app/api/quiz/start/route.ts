import { NextResponse } from "next/server";
import { ALL_QUESTIONS } from "@/content";
import type { Difficulty, ExamPart } from "@/lib/content/types";
import { getProfileId } from "@/lib/session";
import { createQuizAttempt } from "@/lib/db/store";
import { selectQuizQuestions, type QuizConfig } from "@/lib/quiz";

interface StartBody {
  topicIds?: string[];
  lessonIds?: string[];
  part?: ExamPart | "both";
  difficulty?: Difficulty | "mixed";
  count?: number;
  mode?: string;
  includeOfficial?: boolean;
  questionIds?: string[];
  officialYear?: number;
}

export async function POST(request: Request) {
  const profileId = await getProfileId();
  const body = (await request.json().catch(() => null)) as StartBody | null;
  const count = Math.max(1, Math.min(60, Math.round(body?.count ?? 10)));
  const config: QuizConfig = {
    topicIds: body?.topicIds,
    lessonIds: body?.lessonIds,
    part: body?.part ?? "both",
    difficulty: body?.difficulty ?? "mixed",
    count,
    includeOfficial: body?.includeOfficial ?? true,
    questionIds: body?.questionIds,
    officialYear: body?.officialYear,
  };
  const selection = selectQuizQuestions(ALL_QUESTIONS, config);
  if (selection.questions.length === 0) {
    return NextResponse.json({ error: "条件に合う問題がありません" }, { status: 404 });
  }
  const attemptId = createQuizAttempt({
    profileId,
    mode: body?.mode ?? "custom",
    topicId: body?.topicIds?.[0],
    total: selection.questions.length,
    config,
  });
  return NextResponse.json({
    attemptId,
    questions: selection.questions,
    count: selection.questions.length,
  });
}
