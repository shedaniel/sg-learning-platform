import { cookies, headers } from "next/headers";
import { ensureProfile } from "@/lib/db/store";
import { PROFILE_COOKIE, parseProfileCode } from "@/lib/profile";

/** The profile chosen on this device, or null when none has been selected yet. */
export async function getCurrentProfileCode(): Promise<string | null> {
  const headerStore = await headers();
  const fromHeader = parseProfileCode(headerStore.get("x-sg-profile"));
  if (fromHeader) return fromHeader;
  const cookieStore = await cookies();
  return parseProfileCode(cookieStore.get(PROFILE_COOKIE)?.value);
}

export async function getProfileId(): Promise<string> {
  const code = await getCurrentProfileCode();
  // The proxy redirects or rejects requests without a profile, so this is a guard, not a flow.
  if (!code) throw new Error("プロフィールが選択されていません");
  return code;
}

export async function getLearner() {
  const id = await getProfileId();
  await ensureProfile(id);
  return { id };
}
