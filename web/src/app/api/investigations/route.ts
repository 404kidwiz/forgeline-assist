import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { currentUser } from "@/lib/identity";

export async function GET() {
  return NextResponse.json([...store.investigations.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function POST(req: Request) {
  const user = currentUser(req);
  const body = await req.json().catch(() => ({}));
  const question = String(body.question ?? "").trim();
  if (!question || question.length > 2000) return NextResponse.json({ error: "question required (≤2000 chars)" }, { status: 400 });
  const inv = store.createInvestigation({ question, equipment: body.equipment || undefined, batch: body.batch || undefined, ownerId: user.id });
  return NextResponse.json(inv, { status: 201 });
}
