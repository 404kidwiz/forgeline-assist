import { NextResponse } from "next/server";
import { executeProposal } from "@/lib/executor";
import { currentUser } from "@/lib/identity";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (!b.proposalId) return NextResponse.json({ error: "proposalId required" }, { status: 400 });
  const r = await executeProposal(String(b.proposalId), currentUser(req).id);
  return NextResponse.json(r, { status: r.ok ? 200 : 409 });
}
