import Link from "next/link";
import { FIRM } from "@/lib/firm";
import { PRACTICE_AREAS } from "@/lib/practice-areas";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-amber-500/20 bg-stone-900 text-amber-100">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 px-6 py-12 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold">{FIRM.name}</p>
          <p className="text-sm">
            {FIRM.address.line1}
            <br />
            {FIRM.address.line2}
            <br />
            {FIRM.address.city}, {FIRM.address.postalCode}
          </p>
          <p className="text-sm">{FIRM.phoneIntl}</p>
          <p className="text-sm">{FIRM.emails[0]}</p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-amber-50">Practice Areas</span>
          <ul className="flex flex-col gap-1 text-sm">
            {PRACTICE_AREAS.slice(0, 5).map((area) => (
              <li key={area.slug}>
                <Link href={`/practice-areas/${area.slug}`} className="hover:text-amber-300">
                  {area.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/practice-areas" className="hover:text-amber-300">
                View all →
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-amber-50">Firm</span>
          <ul className="flex flex-col gap-1 text-sm">
            <li>
              <Link href="/about" className="hover:text-amber-300">
                About &amp; Director
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-amber-300">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/portal/login" className="hover:text-amber-300">
                Client Portal
              </Link>
            </li>
          </ul>
          <p className="mt-2 text-xs text-amber-200">Registered with the Legal Practice Council, Firm No: {FIRM.firmNumber}</p>
        </div>
      </div>
      <div className="border-t border-stone-800 px-6 py-4 text-center text-xs text-amber-200">
        © {new Date().getFullYear()} {FIRM.name}. All rights reserved.
      </div>
    </footer>
  );
}
