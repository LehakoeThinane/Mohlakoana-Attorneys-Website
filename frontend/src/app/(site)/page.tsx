import Link from "next/link";
import { FIRM } from "@/lib/firm";
import { PRACTICE_AREAS } from "@/lib/practice-areas";

export default function Home() {
  return (
    <>
      <section className="border-b border-stone-200 bg-stone-900 text-amber-50">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-20">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Conservative, risk-conscious legal counsel in Pretoria.
          </h1>
          <p className="max-w-xl text-lg text-amber-100">
            {FIRM.name} advises individuals, directors, SMEs, corporate clients, and government departments —
            with legal risk identified early, managed prudently, and resolved efficiently.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-md bg-amber-50 px-5 py-3 font-medium text-stone-900 transition-colors hover:bg-amber-100"
            >
              Get in touch
            </Link>
            <Link
              href="/practice-areas"
              className="rounded-md border border-amber-100 px-5 py-3 font-medium text-amber-50 transition-colors hover:border-amber-300 hover:text-amber-300"
            >
              View practice areas
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16">
        <h2 className="text-2xl font-semibold text-stone-900">Our approach</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FIRM.approach.map((pillar) => (
            <div key={pillar.title} className="rounded-md border border-stone-200 bg-white p-5">
              <h3 className="font-semibold text-stone-900">{pillar.title}</h3>
              <p className="mt-1 text-sm text-stone-600">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold text-stone-900">Practice areas</h2>
            <Link href="/practice-areas" className="text-sm font-medium text-stone-700 underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRACTICE_AREAS.map((area) => (
              <Link
                key={area.slug}
                href={`/practice-areas/${area.slug}`}
                className="flex flex-col gap-2 rounded-md border border-stone-200 p-5 transition-colors hover:border-stone-400"
              >
                <h3 className="font-semibold text-stone-900">{area.title}</h3>
                <p className="text-sm text-stone-600">{area.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-16">
        <h2 className="text-2xl font-semibold text-stone-900">About the firm</h2>
        <p className="max-w-3xl text-stone-700">
          {FIRM.name} is a commercial law firm based in the heart of Pretoria, Gauteng Province, led by director{" "}
          {FIRM.director.name}. The firm maintains a focused practice across corporate, commercial, contract,
          labour, insolvency, immigration, family, and pension law, alongside governance risk and compliance
          services and Court appearances.
        </p>
        <Link href="/about" className="w-fit text-sm font-medium text-stone-900 underline">
          Read more about the firm and our director →
        </Link>
      </section>
    </>
  );
}
