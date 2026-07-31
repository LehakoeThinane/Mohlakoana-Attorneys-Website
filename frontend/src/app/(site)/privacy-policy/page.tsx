import type { Metadata } from "next";
import { FIRM } from "@/lib/firm";

export const metadata: Metadata = {
  title: "Privacy Policy | Mohlakoana Attorneys",
  description: "How Mohlakoana Attorneys collects, uses, and protects personal information under POPIA.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <div className="rounded-md border border-amber-300 bg-amber-100 px-4 py-3 text-sm text-amber-900">
        <strong>Draft: pending director and legal review.</strong> This policy has not yet been signed off per
        the firm&apos;s own compliance checklist and should not be relied on as final until reviewed by Mr
        Mohlakoana.
      </div>

      <h1 className="text-3xl font-semibold text-stone-900">Privacy Policy</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-stone-900">1. Introduction</h2>
        <p className="text-stone-700">
          {FIRM.name} (&quot;the firm&quot;, &quot;we&quot;, &quot;us&quot;) is committed to protecting your personal information in
          accordance with the Protection of Personal Information Act, 4 of 2013 (POPIA). This policy explains
          what information we collect through this website and the client portal, how we use it, and your
          rights.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-stone-900">2. Information We Collect</h2>
        <p className="text-stone-700">
          When you submit our contact form, we collect your name, email address, and phone number (if
          provided). When you become a client, we hold further information necessary to open and manage your
          matter, which may include identifying information such as your ID number, depending on the nature of
          the matter.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-stone-900">3. How We Use Your Information</h2>
        <p className="text-stone-700">
          We use your information to respond to enquiries, open and manage matters, communicate with you about
          your matter, and meet our legal and regulatory obligations as attorneys.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-stone-900">4. Third-Party Processing</h2>
        <p className="text-stone-700">
          We use a third-party practice management system for administrative functions such as task tracking,
          document handling, and invoicing. Only the limited information necessary for those functions, such
          as your name, email address, and administrative task or invoice details, is shared with that system.
          Identifying information such as ID numbers, and the substantive details of your matter, are never
          shared with any third-party system and are held solely within the firm&apos;s own secure records.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-stone-900">5. Your Rights</h2>
        <p className="text-stone-700">Under POPIA, you have the right to:</p>
        <ul className="list-disc pl-5 text-stone-700">
          <li>Request access to the personal information we hold about you;</li>
          <li>Request correction of inaccurate or outdated information;</li>
          <li>Request deletion of your information, subject to our legal and professional record-keeping obligations;</li>
          <li>Object to the processing of your information; and</li>
          <li>Lodge a complaint with the Information Regulator of South Africa.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-stone-900">6. Security &amp; Retention</h2>
        <p className="text-stone-700">
          We take reasonable technical and organisational measures to protect your information against loss,
          unauthorised access, and disclosure. We retain client records for the period required by the Legal
          Practice Act, 28 of 2014 and applicable LPC Rules.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-stone-900">7. Contact Us</h2>
        <p className="text-stone-700">
          For questions about this policy or to exercise your rights, contact us at{" "}
          <a href={`mailto:${FIRM.emails[0]}`} className="underline">
            {FIRM.emails[0]}
          </a>
          .
        </p>
      </section>
    </div>
  );
}
