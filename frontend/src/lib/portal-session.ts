import "server-only";
import { cookies } from "next/headers";

export const ACCESS_COOKIE = "portal_access_token";
export const REFRESH_COOKIE = "portal_refresh_token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/portal",
};

export async function setSessionCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, accessToken, cookieOptions);
  cookieStore.set(REFRESH_COOKIE, refreshToken, cookieOptions);
}

export async function clearSessionCookies() {
  // .delete(name) alone sets Set-Cookie with the default path ("/"), which
  // does NOT match — and therefore does not clear — a cookie set with
  // path: "/portal". The path must be passed explicitly here too.
  const cookieStore = await cookies();
  cookieStore.delete({ name: ACCESS_COOKIE, path: "/portal" });
  cookieStore.delete({ name: REFRESH_COOKIE, path: "/portal" });
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE)?.value;
}
