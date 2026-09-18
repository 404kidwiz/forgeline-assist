import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() { return NextResponse.json([...store.tasks.values()]); }

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (!b.title) return NextResponse.json({ error: "title required" }, { status: 400 });
  return NextResponse.json(store.createTask({ title: String(b.title), assignee: String(b.assignee ?? "maya"), equipment: b.equipment, due: b.due, origin: b.origin }), { status: 201 });
}
