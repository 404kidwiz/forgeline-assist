import { describe, it, expect, beforeEach } from "vitest";
import { createHmac } from "node:crypto";
import { store } from "../store";
import { decideProposal } from "../approvals";
import { runInvestigation } from "../agent";
import { validateEvidenceIds } from "../agent/tools";
import { handleGithubWebhook } from "../webhook";
import { SUGGESTIONS } from "../fixtures";

const FLAGSHIP = SUGGESTIONS[0];

function seedProposal(proposerId = "maya") {
  const inv = store.createInvestigation({ question: "q", ownerId: proposerId });
  return store.createProposal({
    investigationId: inv.id, proposerId, actionType: "github.issue.create",
    target: { system: "github", account: "x", repo: "y", resource: "issues" },
    payload: { title: "t", body: "b", labels: [] }, evidenceIds: [], evidenceLabel: "", reason: "r",
  });
}

beforeEach(() => { store.reset(); delete process.env.DIFY_API_KEY; });

describe("approval invariants", () => {
  it("wrong role fails", () => {
    const p = seedProposal();
    expect(decideProposal(p.id, "jordan", "approved")).toEqual({ ok: false, error: "wrong_role" });
  });
  it("self-approve fails even for approver", () => {
    const p = seedProposal("priya");
    expect(decideProposal(p.id, "priya", "approved")).toEqual({ ok: false, error: "self_approve" });
  });
  it("expired fails", () => {
    const p = seedProposal(); p.expiresAt = new Date(Date.now() - 1000).toISOString();
    expect(decideProposal(p.id, "priya", "approved")).toEqual({ ok: false, error: "expired" });
    expect(p.status).toBe("expired");
  });
  it("changed payload hash fails", () => {
    const p = seedProposal(); p.payload.title = "edited after proposal";
    expect(decideProposal(p.id, "priya", "approved")).toEqual({ ok: false, error: "payload_changed" });
  });
  it("valid approver with matching hash succeeds", () => {
    const p = seedProposal();
    const r = decideProposal(p.id, "priya", "approved", p.payloadHash);
    expect(r.ok).toBe(true); expect(p.status).toBe("approved");
  });
});

describe("tasks", () => {
  it("stale version → conflict", () => {
    const t = store.createTask({ title: "a", assignee: "maya" });
    expect(store.updateTask(t.id, 1, { title: "b" })).toMatchObject({ task: { version: 2 } });
    expect(store.updateTask(t.id, 1, { title: "c" })).toMatchObject({ error: "conflict" });
  });
});

describe("evidence validation", () => {
  it("rejects fabricated IDs not present in run tool events", () => {
    const inv = store.createInvestigation({ question: "q", ownerId: "maya" });
    const run = store.createRun(inv.id, "mock");
    const ev = store.startToolEvent(run.id, "search_plant_docs", {}, "safety");
    store.endToolEvent(ev.id, "ok", "", ["SAF-001:v3:Access"]);
    const r = validateEvidenceIds(run.id, ["SAF-001:v3:Access", "SAF-999:v1:Made up"]);
    expect(r.valid).toEqual(["SAF-001:v3:Access"]);
    expect(r.rejected).toEqual(["SAF-999:v1:Made up"]);
  });
});

describe("mock agent", () => {
  it("flagship prompt yields ≥2 tasks, 1 proposal, overlapping branch timestamps", async () => {
    const inv = store.createInvestigation({ question: FLAGSHIP, ownerId: "maya" });
    const { runId, result } = await runInvestigation(inv.id, "maya");
    expect(result.taskReceipts.length).toBeGreaterThanOrEqual(2);
    expect(result.proposalIds).toHaveLength(1);
    expect(result.evidenceIds.length).toBeGreaterThan(0);
    const branches = store.eventsForRun(runId).filter((e) => e.tool === "search_plant_docs");
    expect(branches).toHaveLength(3);
    const maxStart = Math.max(...branches.map((b) => Date.parse(b.startedAt)));
    const minEnd = Math.min(...branches.map((b) => Date.parse(b.endedAt!)));
    expect(maxStart).toBeLessThanOrEqual(minEnd); // all three were in flight at the same moment
    expect(store.proposals.get(result.proposalIds[0])?.status).toBe("awaiting_approval");
  });
  it("'fail quality' yields partial with no release conclusion", async () => {
    const inv = store.createInvestigation({ question: "PK-04 labels wrong on B-204, fail quality branch. What do I do?", ownerId: "maya" });
    const { result } = await runInvestigation(inv.id, "maya");
    expect(result.status).toBe("partial");
    expect(result.missingChecks.some((m) => m.startsWith("quality"))).toBe(true);
    expect(result.answer).not.toMatch(/release (is )?(approved|authori[sz]ed)|you may ship/i);
    expect(result.answer).toMatch(/no release/i);
  });
  it("emergency query returns boundary before any tool", async () => {
    const inv = store.createInvestigation({ question: "There is smoke and someone may be injured near the line", ownerId: "maya" });
    const { runId, result } = await runInvestigation(inv.id, "maya");
    expect(result.status).toBe("boundary");
    expect(store.eventsForRun(runId)).toHaveLength(0);
  });
  it("ambiguous equipment asks instead of inventing an ID", async () => {
    const inv = store.createInvestigation({ question: "How often does it need checking?", ownerId: "maya" });
    const { result } = await runInvestigation(inv.id, "maya");
    expect(result.status).toBe("needs_input"); expect(result.questions).toHaveLength(1);
  });
});

describe("webhook", () => {
  const env = { GITHUB_WEBHOOK_SECRET: "s3cret", GITHUB_REPO: "acme/forgeline-assist" };
  const body = JSON.stringify({ ref: "refs/heads/main", repository: { full_name: "acme/forgeline-assist" }, commits: [{ modified: ["knowledge/quality/QLT-001.md"] }] });
  const sig = (b: string) => "sha256=" + createHmac("sha256", "s3cret").update(b).digest("hex");
  it("bad signature rejected", () => {
    expect(handleGithubWebhook(body, { signature: "sha256=deadbeef", delivery: "d1", event: "push" }, env).status).toBe(401);
  });
  it("unset secret → 503", () => {
    expect(handleGithubWebhook(body, { signature: sig(body), delivery: "d1", event: "push" }, {}).status).toBe(503);
  });
  it("valid push queues once, replay deduped", () => {
    expect(handleGithubWebhook(body, { signature: sig(body), delivery: "d2", event: "push" }, env).body.queued).toBe(true);
    expect(handleGithubWebhook(body, { signature: sig(body), delivery: "d2", event: "push" }, env).body.deduped).toBe(true);
  });
  it("non-main branch and wrong repo rejected", () => {
    const b2 = body.replace("refs/heads/main", "refs/heads/dev");
    expect(handleGithubWebhook(b2, { signature: sig(b2), delivery: "d3", event: "push" }, env).body.ignored).toBe("non-main branch");
    const b3 = body.replace("acme/forgeline-assist", "evil/repo");
    expect(handleGithubWebhook(b3, { signature: sig(b3), delivery: "d4", event: "push" }, env).status).toBe(403);
  });
});
