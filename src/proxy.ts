import { NextResponse, type NextRequest } from "next/server";
import { PROFILE_COOKIE, parseProfileCode } from "@/lib/profile";

/**
 * Every page and API call needs a profile. The cookie only remembers which sync
 * code was chosen on this device; it never invents an identity.
 */
export function proxy(request: NextRequest) {
  const code = parseProfileCode(request.cookies.get(PROFILE_COOKIE)?.value);
  const { pathname, search } = request.nextUrl;

  if (!code) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "プロフィールが選択されていません" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    url.search = "";
    if (pathname !== "/") url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  const headers = new Headers(request.headers);
  headers.set("x-sg-profile", code);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|profile|api/profile).*)"],
};
