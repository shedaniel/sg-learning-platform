import { NextResponse } from "next/server";
import { getProfileId } from "@/lib/session";
import { toggleBookmark } from "@/lib/db/store";

export async function POST(request: Request) {
  const profileId = await getProfileId();
  const body = (await request.json().catch(() => null)) as
    | { itemType?: "question" | "term" | "lesson"; itemId?: string }
    | null;
  if (!body?.itemType || !body.itemId) {
    return NextResponse.json({ error: "itemType と itemId が必要です" }, { status: 400 });
  }
  if (!["question", "term", "lesson"].includes(body.itemType)) {
    return NextResponse.json({ error: "itemType が不正です" }, { status: 400 });
  }
  const bookmarked = toggleBookmark(profileId, body.itemType, body.itemId);
  return NextResponse.json({ bookmarked });
}
