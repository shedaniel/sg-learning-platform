/**
 * A profile is identified by a sync code the learner types, not by a random
 * browser session. Anyone who knows a code can open that profile, so there is
 * no secret beyond it: it is meant for a private deployment.
 */
export const PROFILE_COOKIE = "sg_profile";

export const PROFILE_CODE_HINT =
  "半角の英小文字・数字・ハイフン・アンダースコアで3〜40文字（先頭は英数字）";

const PROFILE_CODE_PATTERN = /^[a-z0-9][a-z0-9_-]{2,39}$/;

export function normalizeProfileCode(input: string): string {
  return input.trim().toLowerCase();
}

export function isValidProfileCode(code: string): boolean {
  return PROFILE_CODE_PATTERN.test(code);
}

/** Returns the normalized code, or null when the value is missing or malformed. */
export function parseProfileCode(input: string | null | undefined): string | null {
  if (!input) return null;
  const code = normalizeProfileCode(input);
  return isValidProfileCode(code) ? code : null;
}

/** Only same-site absolute paths are allowed as a post-login destination. */
export function safeNextPath(input: string | null | undefined): string {
  if (!input || !input.startsWith("/") || input.startsWith("//") || input.startsWith("/\\")) return "/";
  if (input.startsWith("/profile") || input.startsWith("/api/")) return "/";
  return input;
}

export const PROFILE_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365 * 2,
  secure: process.env.NODE_ENV === "production",
};
