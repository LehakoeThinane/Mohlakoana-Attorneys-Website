import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPracticeAreaBySlug, PRACTICE_AREAS } from "@/lib/practice-areas";
import { Reveal } from "../../reveal";

export function generateStaticParams() {
  return PRACTICE_AREAS.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getPracticeAreaBySlug(slug);
  if (!area) return {};
  return {
    title: `${area.title} | Mohlakoana Attorneys`,
    description: area.summary,
  };
}

export default async function PracticeAreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = getPracticeAreaBySlug(slug);
  if (!area) notFound();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-16">
      <Link href="/practice-areas" className="text-sm text-stone-600 underline">
        ← All practice areas
      </Link>
      <Reveal className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold text-stone-900">{area.title}</h1>
          <p className="text-stone-700">{area.summary}</p>
        </div>
        <ul className="glow-gold-static glass flex flex-col gap-3 rounded-md p-6">
          {area.items.map((item) => (
            <li key={item} className="flex gap-3 text-stone-700">
              <span aria-hidden className="text-amber-700">
                •
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/contact"
          className="glow-gold w-fit rounded-md bg-stone-900 px-5 py-3 font-medium text-amber-50 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-stone-800"
        >
          Discuss your matter
        </Link>
      </Reveal>
    </div>
  );
}
