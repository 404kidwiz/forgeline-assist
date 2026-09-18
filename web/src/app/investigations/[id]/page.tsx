import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { InvestigationView, type InvData } from "@/components/InvestigationView";

export const dynamic = "force-dynamic";

// ponytail: read via our own API route instead of the in-memory `store` singleton
// directly. On Vercel, this page's server-render and the API route it calls are
// not guaranteed to land on the same serverless instance as the request that
// created the investigation, so a direct `store.investigations.get(id)` here was
// 404ing on every fresh investigation (confirmed: the API route itself is
// reliable, the direct in-process read from this page was not). Real fix is
// wiring up db/schema.sql for shared persistence; this restores correctness
// today without a new dependency.
async function fetchInvestigation(id: string): Promise<InvData | null> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  const res = await fetch(`${proto}://${host}/api/investigations/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`investigation fetch failed: ${res.status}`);
  return res.json();
}

export default async function InvestigationPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ autorun?: string }> }) {
  const { id } = await params; const { autorun } = await searchParams;
  const data = await fetchInvestigation(id);
  if (!data) notFound();
  return <InvestigationView key={id} initial={data} autoRun={autorun === "1"} />;
}
