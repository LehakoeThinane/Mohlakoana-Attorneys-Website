import type { Metadata } from "next";
import { FIRM } from "@/lib/firm";
import { GlowOrbs } from "../glow-orbs";
import { Reveal } from "../reveal";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us | Mohlakoana Attorneys",
  description: "Get in touch with Mohlakoana Attorneys in Pretoria.",
};

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden">
      <GlowOrbs variant="light" />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16 sm:flex-row sm:gap-16">
        <Reveal className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold text-stone-900">Get in touch</h1>
            <p className="text-stone-700">Tell us about your matter and we&apos;ll respond as soon as possible.</p>
          </div>
          <div className="glow-gold glass rounded-md p-6">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="flex w-full flex-col gap-4 sm:w-64">
          <div className="glass rounded-md p-5">
            <h2 className="text-sm font-semibold text-stone-900">Address</h2>
            <p className="mt-1 text-sm text-stone-700">
              {FIRM.address.line1}
              <br />
              {FIRM.address.line2}
              <br />
              {FIRM.address.city}, {FIRM.address.postalCode}
            </p>

            <h2 className="mt-4 text-sm font-semibold text-stone-900">Phone</h2>
            <p className="mt-1 text-sm text-stone-700">{FIRM.phoneIntl}</p>

            <h2 className="mt-4 text-sm font-semibold text-stone-900">Email</h2>
            {FIRM.emails.map((email) => (
              <p key={email} className="mt-1 text-sm text-stone-700">
                {email}
              </p>
            ))}

            <h2 className="mt-4 text-sm font-semibold text-stone-900">Business Hours</h2>
            <p className="mt-1 text-sm text-stone-700">{FIRM.businessHours}</p>
            <p className="text-sm text-stone-500">{FIRM.weekendNote}</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
