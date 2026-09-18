import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() { return NextResponse.json([...store.notifications.values()].sort((a, b) => b.at.localeCompare(a.at))); }

/** Mark read. Marking read never approves anything. */
export async function PATCH(req: Request) {
  const b = await req.json().catch(() => ({}));
  const n = store.notifications.get(String(b.id));
  if (!n) return NextResponse.json({ error: "not_found" }, { status: 404 });
  n.read = true; return NextResponse.json(n);
}
