import "server-only";
import { redirect } from "next/navigation";
import { getAccessToken } from "./portal-session";

export const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";

/**
 * Server Components can't set cookies, so a mid-render token refresh would
 * be silently discarded. proxy.ts refreshes the access token before a
 * portal page ever renders; if a call still comes back 401 here, the
 * session is genuinely gone and the only correct move is back to login.
 */
export async function portalFetch(path: string, init?: RequestInit): Promise<Response> {
  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/portal/login");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (response.status === 401) redirect("/portal/login");
  return response;
}
