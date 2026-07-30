"use server";

import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/lib/portal-api";
import { clearSessionCookies, setSessionCookies } from "@/lib/portal-session";
import type { FormState } from "./form-state";

export async function loginAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { status: "error", message: "Please enter your email and password." };
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/client/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return { status: "error", message: "Incorrect email or password." };
  }

  const tokens = (await response.json()) as { access_token: string; refresh_token: string };
  await setSessionCookies(tokens.access_token, tokens.refresh_token);
  redirect("/portal");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookies();
  redirect("/portal/login");
}

export async function requestPasswordResetAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get("email");
  if (typeof email !== "string" || !email) {
    return { status: "error", message: "Please enter your email." };
  }

  await fetch(`${API_BASE_URL}/api/v1/auth/client/request-password-reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return {
    status: "success",
    message: "If an account exists for that email, a reset link has been sent.",
  };
}

async function consumeActionToken(endpoint: string, formData: FormData): Promise<FormState> {
  const token = formData.get("token");
  const password = formData.get("password");
  if (typeof token !== "string" || typeof password !== "string" || !token || !password) {
    return { status: "error", message: "This link is missing required information." };
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invite_token: token, password }),
  });

  if (!response.ok) {
    return { status: "error", message: "This link is invalid or has expired. Please request a new one." };
  }

  const tokens = (await response.json()) as { access_token: string; refresh_token: string };
  await setSessionCookies(tokens.access_token, tokens.refresh_token);
  redirect("/portal");
}

export async function acceptInviteAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  return consumeActionToken("/api/v1/auth/client/accept-invite", formData);
}

export async function resetPasswordAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  return consumeActionToken("/api/v1/auth/client/reset-password", formData);
}
