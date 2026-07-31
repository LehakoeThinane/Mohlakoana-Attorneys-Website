import Link from "next/link";
import { portalFetch } from "@/lib/portal-api";
import { PortalHeader } from "./portal-header";
import { STATUS_LABELS, type Matter } from "./types";

export default async function PortalMattersPage() {
  const response = await portalFetch("/api/v1/matters/mine");
  const matters: Matter[] = response.ok ? await response.json() : [];

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <PortalHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
        <h1 className="text-2xl font-semibold text-stone-900">Your matters</h1>
        {matters.length === 0 ? (
          <p className="text-stone-600">You don&apos;t have any matters on file yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {matters.map((matter) => (
              <li key={matter.id}>
                <Link
                  href={`/portal/matters/${matter.id}`}
                  className="flex flex-col gap-1 rounded-md border border-stone-200 bg-white px-4 py-3 transition-colors hover:border-stone-400"
                >
                  <span className="font-medium text-stone-900">{matter.title}</span>
                  <span className="text-sm text-stone-600">
                    {matter.reference} ({STATUS_LABELS[matter.status]})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
