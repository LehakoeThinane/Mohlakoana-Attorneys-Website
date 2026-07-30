import type { Metadata } from "next";
import { FIRM } from "@/lib/firm";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us | Mohlakoana Attorneys",
  description: "Get in touch with Mohlakoana Attorneys in Pretoria.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16 sm:flex-row sm:gap-16">
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-stone-900">Get in touch</h1>
          <p className="text-stone-700">Tell us about your matter and we&apos;ll respond as soon as possible.</p>
        </div>
        <ContactForm />
      </div>

      <div className="flex w-full flex-col gap-4 sm:w-64">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">Address</h2>
          <p className="text-sm text-stone-700">
            {FIRM.address.line1}
            <br />
            {FIRM.address.line2}
            <br />
            {FIRM.address.city}, {FIRM.address.postalCode}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-stone-900">Phone</h2>
          <p className="text-sm text-stone-700">{FIRM.phoneIntl}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-stone-900">Email</h2>
          {FIRM.emails.map((email) => (
            <p key={email} className="text-sm text-stone-700">
              {email}
            </p>
          ))}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-stone-900">Business Hours</h2>
          <p className="text-sm text-stone-700">{FIRM.businessHours}</p>
          <p className="text-sm text-stone-500">{FIRM.weekendNote}</p>
        </div>
      </div>
    </div>
  );
}
