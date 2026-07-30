import Link from "next/link";
import { FIRM } from "@/lib/firm";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/practice-areas", label: "Practice Areas" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-stone-900 text-amber-50">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-lg font-semibold tracking-tight">{FIRM.name}</span>
          <span className="text-xs text-amber-200">Attorneys, Notaries &amp; Conveyancers</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-amber-300">
              {link.label}
            </Link>
          ))}
          <Link
            href="/portal/login"
            className="rounded-md border border-amber-200 px-3 py-1.5 hover:border-amber-300 hover:text-amber-300"
          >
            Client Portal
          </Link>
        </nav>
      </div>
    </header>
  );
}
