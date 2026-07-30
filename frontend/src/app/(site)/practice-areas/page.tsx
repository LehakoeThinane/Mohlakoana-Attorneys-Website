import type { Metadata } from "next";
import Link from "next/link";
import { PRACTICE_AREAS } from "@/lib/practice-areas";

export const metadata: Metadata = {
  title: "Practice Areas | Mohlakoana Attorneys",
  description: "Corporate, commercial, labour, pension, family, immigration, insolvency, and litigation services.",
};

export default function PracticeAreasPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-stone-900">Practice Areas</h1>
        <p className="max-w-2xl text-stone-700">
          {"We maintain a focused practice across the following areas, each conducted with the same conservative, procedurally sound approach."}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PRACTICE_AREAS.map((area) => (
          <Link
            key={area.slug}
            href={`/practice-areas/${area.slug}`}
            className="flex flex-col gap-2 rounded-md border border-stone-200 bg-white p-5 transition-colors hover:border-stone-400"
          >
            <h2 className="font-semibold text-stone-900">{area.title}</h2>
            <p className="text-sm text-stone-600">{area.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
