import { NextResponse } from "next/server";
import { getProfileId } from "@/lib/session";
import { recordStudySession, updateQuizAttempt } from "@/lib/db/store";

export async function POST(request: Request) {
  const profileId = await getProfileId();
  const body = (await request.json().catch(() => null)) as
    | { attemptId?: string; answered?: number; correct?: number; minutes?: number }
    | null;
  if (!body?.attemptId) {
    return NextResponse.json({ error: "attemptId が必要です" }, { status: 400 });
  }
  const answered = Math.max(0, Math.round(body.answered ?? 0));
  const correct = Math.max(0, Math.round(body.correct ?? 0));
  await updateQuizAttempt(body.attemptId, answered, correct);
  if (body.minutes && body.minutes > 0) {
    await recordStudySession({
      profileId,
      minutes: Math.min(300, Math.round(body.minutes)),
      source: "quiz",
    });
  }
  return NextResponse.json({ ok: true });
}
