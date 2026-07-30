import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "portal_access_token";
const REFRESH_COOKIE = "portal_refresh_token";
const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";

const PUBLIC_PORTAL_PATHS = ["/portal/login", "/portal/forgot-password", "/portal/reset-password", "/portal/accept-invite"];

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/portal",
};

// Only checks the token's own exp claim, unverified — this is an
// optimistic pre-render check to decide whether to refresh proactively.
// The backend is the only thing that ever verifies the signature.
function isExpiredOrMissing(token: string | undefined): boolean {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { exp?: number };
    return typeof payload.exp !== "number" || payload.exp * 1000 < Date.now() + 5000;
  } catch {
    return true;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_PORTAL_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!isExpiredOrMissing(accessToken)) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/portal/login", request.url));
  }

  const refreshResponse = await fetch(`${API_BASE_URL}/api/v1/auth/client/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!refreshResponse.ok) {
    // path must match the original set() (see portal-session.ts's
    // clearSessionCookies for the same gotcha) or the browser keeps the
    // still-live cookie and this "logout" silently does nothing.
    const response = NextResponse.redirect(new URL("/portal/login", request.url));
    response.cookies.delete({ name: ACCESS_COOKIE, path: "/portal" });
    response.cookies.delete({ name: REFRESH_COOKIE, path: "/portal" });
    return response;
  }

  const tokens = (await refreshResponse.json()) as { access_token: string; refresh_token: string };
  const response = NextResponse.next();
  response.cookies.set(ACCESS_COOKIE, tokens.access_token, cookieOptions);
  response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, cookieOptions);
  return response;
}

export const config = {
  matcher: ["/portal/:path*"],
};
