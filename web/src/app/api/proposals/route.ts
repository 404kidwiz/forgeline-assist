import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  return NextResponse.json([...store.proposals.values()].map((p) => ({ ...p, receipt: store.receipts.get(`RCP-${p.id}`) ?? null })));
}
