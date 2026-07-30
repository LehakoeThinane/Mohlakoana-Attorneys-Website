"use client";

import { useActionState } from "react";
import { initialFormState, type FormState } from "./form-state";

type Props = {
  token: string;
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
};

export function PasswordSetForm({ token, action, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, initialFormState);

  if (!token) {
    return <p className="max-w-sm text-center text-red-700">This link is missing its token. Please use the link exactly as sent.</p>;
  }

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-stone-700">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="rounded-md border border-stone-300 px-3 py-2 text-stone-900 focus:border-amber-700 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-stone-900 px-4 py-2 font-medium text-amber-50 transition-colors hover:bg-stone-800 disabled:opacity-60"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
      {state.status === "error" && (
        <p role="status" className="text-sm text-red-700">
          {state.message}
        </p>
      )}
    </form>
  );
}
