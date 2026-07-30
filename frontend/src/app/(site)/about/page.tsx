import type { Metadata } from "next";
import { FIRM } from "@/lib/firm";

export const metadata: Metadata = {
  title: "About Us | Mohlakoana Attorneys",
  description: "Learn about Mohlakoana Attorneys, our director, and our approach to legal practice in Pretoria.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-16 px-6 py-16">
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-stone-900">About the Firm</h1>
        <p className="text-stone-700">
          {FIRM.name} is a commercial law firm based in the heart of Pretoria, Gauteng Province. The firm
          provides conservative, risk-conscious legal services, among others, to individuals (members of the
          community), directors, shareholders, SMEs, corporate clients, and government departments.
        </p>
        <p className="text-stone-700">
          Our practice is founded on the principle that legal risk must be identified early, managed prudently,
          and resolved efficiently. We act for clients who value compliance, procedural correctness, and the
          protection of their personal information and corporate interests.
        </p>
        <p className="text-stone-700">
          The firm maintains a focused practice in corporate, commercial, contract, labour, insolvency law,
          immigration, family and matrimonial law, governance risk and compliance services, and Court
          appearances.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-stone-900">Director</h2>
        <div className="rounded-md border border-stone-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-stone-900">{FIRM.director.name}</h3>
          <p className="mt-1 text-sm text-stone-600">
            Admitted Attorney of the High Court of South Africa — LPC number: {FIRM.director.lpcNumber}
          </p>

          <h4 className="mt-4 text-sm font-semibold text-stone-900">Qualifications</h4>
          <ul className="mt-2 list-disc pl-5 text-sm text-stone-700">
            {FIRM.director.qualifications.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>

          <p className="mt-4 text-sm text-stone-700">
            Mr Mohlakoana supervises all matters undertaken by the firm. His practice focus includes{" "}
            {FIRM.director.focus.toLowerCase()} All instructions are executed with direct oversight to ensure
            consistency and compliance with the Legal Practice Act and Rules of the Court.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-stone-900">Support Staff</h2>
        <p className="text-stone-700">
          In order to ensure that the mandates of clients are executed expeditiously and with due diligence, Mr
          Mohlakoana works hand in hand with {FIRM.officeManager.name} as {FIRM.name}&apos;s office manager.
        </p>
        <p className="text-stone-700">
          Mrs Mohlakoana ensures that all mandates and instructions are brought to Mr Mohlakoana&apos;s attention
          without delay, treated with urgency, and that clients are kept abreast of developments in their cases.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-stone-900">Our Approach</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FIRM.approach.map((pillar) => (
            <div key={pillar.title} className="rounded-md border border-stone-200 bg-white p-5">
              <h3 className="font-semibold text-stone-900">{pillar.title}</h3>
              <p className="mt-1 text-sm text-stone-600">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-stone-900">Compliance &amp; Accreditation</h2>
        <ul className="list-disc pl-5 text-stone-700">
          {FIRM.compliance.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
