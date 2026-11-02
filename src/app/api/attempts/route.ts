import { NextResponse } from "next/server";
import { QUESTION_BY_ID } from "@/content";
import { getProfileId } from "@/lib/session";
import { recordQuestionAttempt, scheduleReview } from "@/lib/db/store";

export async function POST(request: Request) {
  const profileId = await getProfileId();
  const body = (await request.json().catch(() => null)) as
    | {
        questionId?: string;
        selected?: string;
        elapsedMs?: number;
        mode?: string;
        quizAttemptId?: string;
        mockAttemptId?: string;
      }
    | null;
  if (!body?.questionId || !body.selected) {
    return NextResponse.json({ error: "questionId と selected が必要です" }, { status: 400 });
  }
  const question = QUESTION_BY_ID.get(body.questionId);
  if (!question) return NextResponse.json({ error: "問題が見つかりません" }, { status: 404 });
  if (!question.options.some((option) => option.id === body.selected)) {
    return NextResponse.json({ error: "選択肢が不正です" }, { status: 400 });
  }
  const correct = body.selected === question.correctOptionId;
  await recordQuestionAttempt({
    profileId,
    questionId: question.id,
    selected: body.selected,
    correct,
    mode: body.mode ?? "quiz",
    elapsedMs: body.elapsedMs,
    quizAttemptId: body.quizAttemptId,
    mockAttemptId: body.mockAttemptId,
  });
  if (!correct) {
    await scheduleReview(profileId, "question", question.id, 0);
  } else if (body.mode === "review") {
    await scheduleReview(profileId, "question", question.id, 2);
  }
  return NextResponse.json({ correct, correctOptionId: question.correctOptionId });
}
