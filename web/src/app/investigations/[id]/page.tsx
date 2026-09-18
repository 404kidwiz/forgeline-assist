import { notFound } from "next/navigation";
import { store } from "@/lib/store";
import { InvestigationView, type InvData } from "@/components/InvestigationView";

export const dynamic = "force-dynamic";

export default async function InvestigationPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ autorun?: string }> }) {
  const { id } = await params; const { autorun } = await searchParams;
  const inv = store.investigations.get(id);
  if (!inv) notFound();
  const data: InvData = {
    ...inv,
    runs: inv.runIds.map((rid) => { const r = store.runs.get(rid)!; return { id: r.id, status: r.status, result: r.result as InvData["runs"][number]["result"], error: r.error, events: store.eventsForRun(rid) }; }),
    proposals: [...store.proposals.values()].filter((p) => p.investigationId === id),
    tasks: [...store.tasks.values()].filter((t) => t.origin === id),
  };
  return <InvestigationView key={id} initial={JSON.parse(JSON.stringify(data))} autoRun={autorun === "1"} />;
}
