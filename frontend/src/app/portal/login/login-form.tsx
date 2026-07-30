"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "../actions";
import { initialFormState } from "../form-state";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialFormState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-stone-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-md border border-stone-300 px-3 py-2 text-stone-900 focus:border-amber-700 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-stone-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="rounded-md border border-stone-300 px-3 py-2 text-stone-900 focus:border-amber-700 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-stone-900 px-4 py-2 font-medium text-amber-50 transition-colors hover:bg-stone-800 disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
      {state.status === "error" && (
        <p role="status" className="text-sm text-red-700">
          {state.message}
        </p>
      )}
      <Link href="/portal/forgot-password" className="text-sm text-stone-600 underline">
        Forgot your password?
      </Link>
    </form>
  );
}
