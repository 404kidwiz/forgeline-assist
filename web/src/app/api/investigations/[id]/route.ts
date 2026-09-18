import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = store.investigations.get(id);
  if (!inv) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const runs = inv.runIds.map((rid) => {
    const run = store.runs.get(rid)!;
    return { ...run, events: store.eventsForRun(rid), evidence: store.evidenceForRun(rid) };
  });
  const proposals = [...store.proposals.values()].filter((p) => p.investigationId === id);
  const tasks = [...store.tasks.values()].filter((t) => t.origin === id);
  return NextResponse.json({ ...inv, runs, proposals, tasks });
}
