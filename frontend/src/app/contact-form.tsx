"use client";

import { useActionState } from "react";
import { submitContactForm } from "./actions";

const initialState = { status: "idle" as const, message: "" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="full_name" className="text-sm font-medium text-stone-700">
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          className="rounded-md border border-stone-300 px-3 py-2 text-stone-900 focus:border-amber-700 focus:outline-none"
        />
      </div>
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
        <label htmlFor="phone" className="text-sm font-medium text-stone-700">
          Phone (optional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="rounded-md border border-stone-300 px-3 py-2 text-stone-900 focus:border-amber-700 focus:outline-none"
        />
      </div>
      <p className="text-xs text-stone-500">
        By submitting this form you consent to Mohlakoana Attorneys contacting you about your enquiry, in
        accordance with our privacy policy.
      </p>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-stone-900 px-4 py-2 font-medium text-amber-50 transition-colors hover:bg-stone-800 disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send enquiry"}
      </button>
      {state.status !== "idle" && (
        <p
          role="status"
          className={state.status === "success" ? "text-sm text-green-700" : "text-sm text-red-700"}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
