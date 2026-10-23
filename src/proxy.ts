import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const existing = request.cookies.get("sg_profile")?.value;
  const profileId = existing ?? crypto.randomUUID();
  const headers = new Headers(request.headers);
  headers.set("x-sg-profile", profileId);

  const response = NextResponse.next({ request: { headers } });
  response.cookies.set("sg_profile", profileId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 2,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
