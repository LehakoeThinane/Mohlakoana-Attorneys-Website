import Image from "next/image";
import Link from "next/link";
import { logoutAction } from "./actions";

export function PortalHeader() {
  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-stone-900 px-6 py-4 text-amber-50">
      <Link href="/portal" className="flex items-center gap-3 text-lg font-semibold tracking-tight">
        <Image src="/logo-mark.png" alt="" width={44} height={31} className="h-8 w-auto" />
        Mohlakoana Attorneys: Client Portal
      </Link>
      <form action={logoutAction}>
        <button type="submit" className="text-sm underline hover:no-underline">
          Sign out
        </button>
      </form>
    </header>
  );
}
