import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json().catch(() => ({}));
  const expectedVersion = Number(b.expectedVersion);
  if (!Number.isInteger(expectedVersion)) return NextResponse.json({ error: "expectedVersion required" }, { status: 400 });
  const r = store.updateTask(id, expectedVersion, { title: b.title, assignee: b.assignee, due: b.due, state: b.state });
  if ("error" in r) return NextResponse.json(r, { status: r.error === "conflict" ? 409 : 404 });
  return NextResponse.json(r.task);
}
