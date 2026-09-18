import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { decideProposal } from "@/lib/approvals";
import { currentUser } from "@/lib/identity";

/** GET is read-only by design: opening a link (e.g. from email) never approves. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = store.proposals.get(id);
  if (!p) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ ...p, proposer: store.getUser(p.proposerId), receipt: store.receipts.get(`RCP-${p.id}`) ?? null, approvals: [...store.approvals.values()].filter((a) => a.proposalId === id) });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json().catch(() => ({}));
  const decision = b.decision === "rejected" ? "rejected" : b.decision === "approved" ? "approved" : null;
  if (!decision) return NextResponse.json({ error: "decision must be approved|rejected" }, { status: 400 });
  const r = decideProposal(id, currentUser(req).id, decision, b.payloadHash);
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.error === "not_found" ? 404 : r.error === "wrong_role" || r.error === "self_approve" ? 403 : 409 });
  return NextResponse.json(r.proposal);
}
