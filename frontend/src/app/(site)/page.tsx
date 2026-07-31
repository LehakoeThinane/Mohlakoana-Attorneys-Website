import Link from "next/link";
import { FIRM } from "@/lib/firm";
import { PRACTICE_AREAS } from "@/lib/practice-areas";
import { Hero } from "./hero";
import { Reveal } from "./reveal";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16">
        <Reveal>
          <h2 className="text-2xl font-semibold text-stone-900">Our approach</h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FIRM.approach.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.08}>
              <div className="glow-gold glass h-full rounded-md p-5">
                <h3 className="font-semibold text-stone-900">{pillar.title}</h3>
                <p className="mt-1 text-sm text-stone-600">{pillar.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16">
          <Reveal>
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-semibold text-stone-900">Practice areas</h2>
              <Link href="/practice-areas" className="text-sm font-medium text-stone-700 underline">
                View all
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRACTICE_AREAS.map((area, i) => (
              <Reveal key={area.slug} delay={(i % 3) * 0.08}>
                <Link
                  href={`/practice-areas/${area.slug}`}
                  className="glow-gold flex h-full flex-col gap-2 rounded-md border border-stone-200 bg-white p-5 transition-transform duration-300 hover:-translate-y-1"
                >
                  <h3 className="font-semibold text-stone-900">{area.title}</h3>
                  <p className="text-sm text-stone-600">{area.summary}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-16">
        <Reveal>
          <h2 className="text-2xl font-semibold text-stone-900">About the firm</h2>
          <p className="mt-4 max-w-3xl text-stone-700">
            {FIRM.name} is a commercial law firm based in the heart of Pretoria, Gauteng Province, led by director{" "}
            {FIRM.director.name}. The firm maintains a focused practice across corporate, commercial, contract,
            labour, insolvency, immigration, family, and pension law, alongside governance risk and compliance
            services and Court appearances.
          </p>
          <Link href="/about" className="mt-4 inline-block w-fit text-sm font-medium text-stone-900 underline">
            Read more about the firm and our director →
          </Link>
        </Reveal>
      </section>
    </>
  );
}
