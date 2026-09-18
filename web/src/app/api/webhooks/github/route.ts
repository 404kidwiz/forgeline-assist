import { NextResponse } from "next/server";
import { handleGithubWebhook } from "@/lib/webhook";

export async function POST(req: Request) {
  const raw = await req.text(); // raw body: HMAC must be computed over the exact bytes
  const out = handleGithubWebhook(raw, {
    signature: req.headers.get("x-hub-signature-256"),
    delivery: req.headers.get("x-github-delivery"),
    event: req.headers.get("x-github-event"),
  });
  return NextResponse.json(out.body, { status: out.status });
}
