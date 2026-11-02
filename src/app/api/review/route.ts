import { NextResponse } from "next/server";
import { getProfileId } from "@/lib/session";
import { scheduleReview } from "@/lib/db/store";

export async function POST(request: Request) {
  const profileId = await getProfileId();
  const body = (await request.json().catch(() => null)) as
    | { itemType?: "question" | "term" | "lesson"; itemId?: string; grade?: number }
    | null;
  if (!body?.itemType || !body.itemId) {
    return NextResponse.json({ error: "itemType と itemId が必要です" }, { status: 400 });
  }
  const grade = Math.max(0, Math.min(3, Math.round(body.grade ?? 2)));
  const row = await scheduleReview(profileId, body.itemType, body.itemId, grade as 0 | 1 | 2 | 3);
  return NextResponse.json({ dueAt: row.dueAt, intervalDays: row.intervalDays });
}
