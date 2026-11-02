import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getProfile, ensureProfile } from "@/lib/db/store";
import {
  PROFILE_CODE_HINT,
  PROFILE_COOKIE,
  PROFILE_COOKIE_OPTIONS,
  normalizeProfileCode,
  isValidProfileCode,
  parseProfileCode,
} from "@/lib/profile";

export const dynamic = "force-dynamic";

/** Which profile is selected on this device (used by the app shell). */
export async function GET() {
  const cookieStore = await cookies();
  const code = parseProfileCode(cookieStore.get(PROFILE_COOKIE)?.value);
  return NextResponse.json({ code });
}

/** Select a profile by code. Unknown codes are only created after explicit confirmation. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { code?: unknown; create?: unknown } | null;
  const code = typeof body?.code === "string" ? normalizeProfileCode(body.code) : "";
  if (!isValidProfileCode(code)) {
    return NextResponse.json({ error: "invalid_code", message: `コードの形式が正しくありません。${PROFILE_CODE_HINT}` }, { status: 400 });
  }

  const existing = await getProfile(code);
  if (!existing && body?.create !== true) {
    return NextResponse.json({ error: "not_found", code }, { status: 404 });
  }
  if (!existing) await ensureProfile(code, code);

  const cookieStore = await cookies();
  cookieStore.set(PROFILE_COOKIE, code, PROFILE_COOKIE_OPTIONS);
  return NextResponse.json({ ok: true, code, created: !existing });
}

/** Forget the selected profile on this device. The data stays in the database. */
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(PROFILE_COOKIE);
  return NextResponse.json({ ok: true });
}
