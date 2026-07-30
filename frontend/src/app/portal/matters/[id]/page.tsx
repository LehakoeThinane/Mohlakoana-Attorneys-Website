import { notFound } from "next/navigation";
import Link from "next/link";
import { portalFetch } from "@/lib/portal-api";
import { PortalHeader } from "../../portal-header";
import { STATUS_LABELS, type Matter } from "../../types";

export default async function MatterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await portalFetch(`/api/v1/matters/mine/${id}`);
  if (response.status === 404) notFound();
  const matter: Matter = await response.json();

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <PortalHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
        <div className="flex flex-col gap-1">
          <Link href="/portal" className="text-sm text-stone-600 underline">
            ← Back to your matters
          </Link>
          <h1 className="text-2xl font-semibold text-stone-900">{matter.title}</h1>
          <p className="text-stone-600">
            {matter.reference} — <span className="font-medium">{STATUS_LABELS[matter.status]}</span>
          </p>
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-stone-900">Documents</h2>
          <p className="rounded-md border border-dashed border-stone-300 bg-white px-4 py-3 text-sm text-stone-500">
            Document access is not yet available — this section will show documents once the BFP integration
            (Phase 3) is complete.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-stone-900">Invoices</h2>
          <p className="rounded-md border border-dashed border-stone-300 bg-white px-4 py-3 text-sm text-stone-500">
            Invoice and payment status is not yet available — this section will show invoices once the BFP
            integration (Phase 3) is complete.
          </p>
        </section>
      </main>
    </div>
  );
}
