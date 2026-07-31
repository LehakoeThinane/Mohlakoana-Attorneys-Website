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
    <header className="glass-dark header-text-shadow sticky top-0 z-50 border-b border-amber-500/20 text-amber-50">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-lg font-semibold tracking-tight">{FIRM.name}</span>
          <span className="text-xs text-amber-200">Attorneys, Notaries &amp; Conveyancers</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="group relative py-1">
              {link.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-amber-400 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
          <Link
            href="/portal/login"
            className="glow-gold rounded-md border border-amber-200/60 px-3 py-1.5 transition-colors hover:border-amber-300 hover:text-amber-300"
          >
            Client Portal
          </Link>
        </nav>
      </div>
    </header>
  );
}
