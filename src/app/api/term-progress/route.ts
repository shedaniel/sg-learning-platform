import { NextResponse } from "next/server";
import { TERM_BY_ID } from "@/content";
import { getProfileId } from "@/lib/session";
import { markTermLearned, scheduleReview } from "@/lib/db/store";

export async function POST(request: Request) {
  const profileId = await getProfileId();
  const body = (await request.json().catch(() => null)) as
    | { termId?: string; learned?: boolean }
    | null;
  if (!body?.termId || !TERM_BY_ID.has(body.termId)) {
    return NextResponse.json({ error: "用語が見つかりません" }, { status: 404 });
  }
  await markTermLearned(profileId, body.termId, body.learned ?? true);
  if (body.learned !== false) {
    await scheduleReview(profileId, "term", body.termId, 2);
  }
  return NextResponse.json({ ok: true });
}
