import { cookies, headers } from "next/headers";
import { ensureProfile } from "@/lib/db/store";

export async function getProfileId(): Promise<string> {
  const headerStore = await headers();
  const fromHeader = headerStore.get("x-sg-profile");
  if (fromHeader) return fromHeader;
  const cookieStore = await cookies();
  return cookieStore.get("sg_profile")?.value ?? "local-learner";
}

export async function getLearner() {
  const id = await getProfileId();
  await ensureProfile(id);
  return { id };
}
