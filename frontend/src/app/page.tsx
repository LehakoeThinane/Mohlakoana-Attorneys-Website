import { ContactForm } from "./contact-form";

const PRACTICE_AREAS = [
  "Labour & Employment Law",
  "CCMA Disputes",
  "Commercial Litigation",
  "Contract Drafting & Review",
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <header className="border-b border-stone-200 bg-stone-900 px-6 py-6 text-amber-50">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-semibold tracking-tight">Mohlakoana Attorneys</h1>
          <p className="text-sm text-amber-100">Attorneys, Notaries &amp; Conveyancers</p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-16">
        <section className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold text-stone-900">
            Clear guidance. Fee certainty. Real answers.
          </h2>
          <p className="max-w-2xl text-stone-700">
            This is a placeholder homepage — practice-area copy, firm bio, and full site content are part
            of Phase 2 and haven&apos;t been written yet. The contact form below is fully wired to the
            backend.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold text-stone-900">Practice areas</h3>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PRACTICE_AREAS.map((area) => (
              <li
                key={area}
                className="rounded-md border border-stone-200 bg-white px-4 py-3 text-stone-800"
              >
                {area}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4" id="contact">
          <h3 className="text-xl font-semibold text-stone-900">Get in touch</h3>
          <ContactForm />
        </section>
      </main>

      <footer className="border-t border-stone-200 px-6 py-6 text-sm text-stone-500">
        <div className="mx-auto max-w-5xl">© Mohlakoana Attorneys. All rights reserved.</div>
      </footer>
    </div>
  );
}
