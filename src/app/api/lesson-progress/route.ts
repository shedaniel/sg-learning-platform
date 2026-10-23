import { NextResponse } from "next/server";
import { LESSON_BY_ID } from "@/content";
import { getProfileId } from "@/lib/session";
import { recordStudySession, setLessonCompleted, touchLesson } from "@/lib/db/store";

export async function POST(request: Request) {
  const profileId = await getProfileId();
  const body = (await request.json().catch(() => null)) as
    | { lessonId?: string; completed?: boolean; minutes?: number }
    | null;
  if (!body?.lessonId) {
    return NextResponse.json({ error: "lessonId が必要です" }, { status: 400 });
  }
  if (!LESSON_BY_ID.has(body.lessonId)) {
    return NextResponse.json({ error: "レッスンが見つかりません" }, { status: 404 });
  }
  if (typeof body.completed === "boolean") {
    setLessonCompleted(profileId, body.lessonId, body.completed);
  } else {
    touchLesson(profileId, body.lessonId);
  }
  if (body.minutes && body.minutes > 0) {
    recordStudySession({ profileId, minutes: Math.min(240, body.minutes), source: "lesson" });
  }
  return NextResponse.json({ ok: true });
}
