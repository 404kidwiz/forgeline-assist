import { createHmac, timingSafeEqual } from "node:crypto";
import { store } from "./store";

export function verifySignature(rawBody: string, header: string | null, secret: string) {
  if (!header?.startsWith("sha256=")) return false;
  const expected = "sha256=" + createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected), b = Buffer.from(header);
  return a.length === b.length && timingSafeEqual(a, b);
}

export type WebhookOutcome = { status: number; body: Record<string, unknown> };

export function handleGithubWebhook(rawBody: string, headers: { signature: string | null; delivery: string | null; event: string | null }, env: Record<string, string | undefined> = process.env): WebhookOutcome {
  const secret = env.GITHUB_WEBHOOK_SECRET;
  if (!secret) return { status: 503, body: { error: "webhook not configured" } };
  if (!verifySignature(rawBody, headers.signature, secret)) return { status: 401, body: { error: "bad signature" } };
  let payload: { repository?: { full_name?: string }; ref?: string; commits?: { modified?: string[]; added?: string[] }[] };
  try { payload = JSON.parse(rawBody); } catch { return { status: 400, body: { error: "bad json" } }; }
  if (env.GITHUB_REPO && payload.repository?.full_name !== env.GITHUB_REPO) return { status: 403, body: { error: "wrong repository" } };
  if (headers.event !== "push") return { status: 202, body: { ignored: headers.event } };
  if (payload.ref !== "refs/heads/main") return { status: 202, body: { ignored: "non-main branch" } };
  const delivery = headers.delivery ?? "";
  if (!delivery || store.webhookDeliveries.has(delivery)) return { status: 200, body: { deduped: true } };
  store.webhookDeliveries.add(delivery);
  const files = (payload.commits ?? []).flatMap((c) => [...(c.modified ?? []), ...(c.added ?? [])]).filter((f) => /^knowledge\/.*\.md$/.test(f));
  if (!files.length) return { status: 200, body: { queued: false, reason: "no document changes" } };
  const inv = store.createInvestigation({ question: `Document change detected: ${files.join(", ")}. Re-check affected answers.`, ownerId: "system" });
  store.notify("source_changed", `Source changed: ${files[0]}`, inv.id);
  return { status: 202, body: { queued: true, investigationId: inv.id } };
}
