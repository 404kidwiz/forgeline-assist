import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { runInvestigation } from "@/lib/agent";
import { currentUser } from "@/lib/identity";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = store.investigations.get(id);
  if (!inv) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (inv.status === "running") return NextResponse.json({ error: "already running" }, { status: 409 });
  const user = currentUser(req);
  const out = await runInvestigation(id, user.id);
  return NextResponse.json({ ...out, events: store.eventsForRun(out.runId) });
}
