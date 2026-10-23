import { NextResponse } from "next/server";
import type { StudyPlanInput } from "@/lib/content/types";
import { getProfileId } from "@/lib/session";
import { saveStudyPlan } from "@/lib/db/store";
import { getProgressSnapshot } from "@/lib/progress";
import { generateStudyPlan } from "@/lib/study-plan";

export async function POST(request: Request) {
  const profileId = await getProfileId();
  const body = (await request.json().catch(() => null)) as Partial<StudyPlanInput> | null;
  if (!body?.examDate) return NextResponse.json({ error: "試験日を指定してください" }, { status: 400 });
  const exam = new Date(`${body.examDate}T00:00:00`);
  if (Number.isNaN(exam.getTime())) {
    return NextResponse.json({ error: "試験日の形式が不正です" }, { status: 400 });
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (exam.getTime() < today.getTime()) {
    return NextResponse.json({ error: "試験日は今日以降の日付を指定してください" }, { status: 400 });
  }
  const input: StudyPlanInput = {
    examDate: body.examDate,
    minutesPerDay: Math.min(240, Math.max(20, Math.round(body.minutesPerDay ?? 60))),
    daysPerWeek: Math.min(7, Math.max(1, Math.round(body.daysPerWeek ?? 5))),
    familiarity:
      body.familiarity === "beginner" || body.familiarity === "confident"
        ? body.familiarity
        : "basic",
    japaneseConfidence:
      body.japaneseConfidence === "low" || body.japaneseConfidence === "high"
        ? body.japaneseConfidence
        : "medium",
  };
  const snapshot = getProgressSnapshot(profileId);
  const plan = generateStudyPlan(input, {
    weakTopicIds: snapshot.weakTopics.map((topic) => topic.topic.id),
    completedLessonIds: snapshot.completedLessonIds,
  });
  saveStudyPlan(profileId, input, plan);
  return NextResponse.json({ plan });
}
