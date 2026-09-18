import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { currentUser } from "@/lib/identity";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = store.investigations.get(id);
  if (!inv) return NextResponse.json({ error: "not_found" }, { status: 404 });
  inv.cancelRequested = true;
  store.log(currentUser(req).id, "investigation.cancel_requested", id);
  // Completed effects are retained; the run checks the flag before each new tool call.
  return NextResponse.json({ ok: true, status: inv.status, cancelRequested: true });
}
