// ponytail: in-memory module singleton. Resets on restart / per serverless instance.
// Swap for Postgres later; every accessor here is the seam.
import { createHash, randomUUID } from "node:crypto";
import { SEED_TASKS, USERS, EQUIPMENT, type Domain } from "./fixtures";

export type Role = "supervisor" | "approver";
export interface User { id: string; name: string; role: Role }
export interface Investigation {
  id: string; question: string; equipment?: string; batch?: string; ownerId: string;
  status: "queued" | "running" | "completed" | "partial" | "failed" | "cancelled" | "needs_input";
  createdAt: string; updatedAt: string; runIds: string[]; cancelRequested?: boolean;
}
export interface ToolEvent {
  id: string; runId: string; tool: string; branch?: Domain | "main"; args: Record<string, unknown>;
  startedAt: string; endedAt?: string; status: "running" | "ok" | "failed"; summary?: string; evidenceIds?: string[];
}
export interface Run {
  id: string; investigationId: string; adapter: "mock" | "dify"; status: Investigation["status"];
  startedAt: string; endedAt?: string; result?: unknown; error?: string;
}
export interface Evidence { id: string; runId: string; chunkId: string; doc_id: string; revision: number; section: string; category: Domain }
export interface Task {
  id: string; title: string; equipment?: string; assignee: string; due?: string; state: "open" | "in_progress" | "done";
  origin?: string; version: number; kind: "demo"; createdAt: string; updatedAt: string;
}
export type ProposalStatus = "draft" | "awaiting_approval" | "approved" | "rejected" | "expired" | "executing" | "succeeded" | "failed" | "unknown";
export interface Proposal {
  id: string; investigationId: string; proposerId: string; actionType: "github.issue.create";
  target: { system: "github"; account: string; repo: string; resource: string };
  payload: { title: string; body: string; labels: string[] }; payloadHash: string; version: number;
  evidenceIds: string[]; evidenceLabel: string; reason: string; status: ProposalStatus; createdAt: string; expiresAt: string;
}
export interface Approval { id: string; proposalId: string; approverId: string; decision: "approved" | "rejected"; payloadHash: string; at: string }
export interface Receipt {
  id: string; proposalId: string; kind: "real" | "simulated"; label: string; repo?: string; number?: number; url?: string; at: string; note?: string;
}
export interface Notification { id: string; category: string; title: string; refId?: string; read: boolean; at: string }
export interface AuditEvent { id: string; actorId: string; action: string; refId?: string; at: string; detail?: string }

const now = () => new Date().toISOString();
export const hashPayload = (p: unknown) => createHash("sha256").update(JSON.stringify(p)).digest("hex");

class Store {
  users: User[] = USERS.map((u) => ({ ...u }));
  equipment = EQUIPMENT;
  investigations = new Map<string, Investigation>();
  runs = new Map<string, Run>();
  toolEvents = new Map<string, ToolEvent>();
  evidence = new Map<string, Evidence>();
  tasks = new Map<string, Task>();
  proposals = new Map<string, Proposal>();
  approvals = new Map<string, Approval>();
  receipts = new Map<string, Receipt>();
  notifications = new Map<string, Notification>();
  audit: AuditEvent[] = [];
  webhookDeliveries = new Set<string>();
  private counters: Record<string, number> = {};

  constructor() {
    SEED_TASKS.forEach((t) => this.createTask(t));
  }

  private nextId(prefix: string) {
    this.counters[prefix] = (this.counters[prefix] ?? 0) + 1;
    return `${prefix}-${String(this.counters[prefix]).padStart(3, "0")}`;
  }
  reset() {
    const fresh = new Store();
    Object.assign(this, fresh);
  }
  getUser(id: string | undefined | null) { return this.users.find((u) => u.id === id); }
  log(actorId: string, action: string, refId?: string, detail?: string) {
    this.audit.push({ id: randomUUID(), actorId, action, refId, at: now(), detail });
  }

  createInvestigation(input: { question: string; equipment?: string; batch?: string; ownerId: string }) {
    const inv: Investigation = { id: this.nextId("INV"), ...input, status: "queued", createdAt: now(), updatedAt: now(), runIds: [] };
    this.investigations.set(inv.id, inv);
    this.log(input.ownerId, "investigation.create", inv.id);
    return inv;
  }
  updateInvestigation(id: string, patch: Partial<Investigation>) {
    const inv = this.investigations.get(id); if (!inv) return undefined;
    Object.assign(inv, patch, { updatedAt: now() }); return inv;
  }
  createRun(investigationId: string, adapter: Run["adapter"]) {
    const run: Run = { id: this.nextId("RUN"), investigationId, adapter, status: "running", startedAt: now() };
    this.runs.set(run.id, run);
    this.investigations.get(investigationId)?.runIds.push(run.id);
    return run;
  }
  startToolEvent(runId: string, tool: string, args: Record<string, unknown>, branch?: ToolEvent["branch"]) {
    const ev: ToolEvent = { id: randomUUID(), runId, tool, branch, args, startedAt: now(), status: "running" };
    this.toolEvents.set(ev.id, ev); return ev;
  }
  endToolEvent(id: string, status: "ok" | "failed", summary: string, evidenceIds?: string[]) {
    const ev = this.toolEvents.get(id); if (!ev) return;
    Object.assign(ev, { status, summary, endedAt: now(), evidenceIds });
  }
  eventsForRun(runId: string) { return [...this.toolEvents.values()].filter((e) => e.runId === runId).sort((a, b) => a.startedAt.localeCompare(b.startedAt)); }
  addEvidence(runId: string, chunk: { id: string; doc_id: string; revision: number; section: string; category: Domain }) {
    const ev: Evidence = { id: chunk.id, runId, chunkId: chunk.id, doc_id: chunk.doc_id, revision: chunk.revision, section: chunk.section, category: chunk.category };
    this.evidence.set(`${runId}:${chunk.id}`, ev); return ev;
  }
  evidenceForRun(runId: string) { return [...this.evidence.values()].filter((e) => e.runId === runId); }

  createTask(input: Omit<Task, "id" | "version" | "kind" | "createdAt" | "updatedAt" | "state"> & { state?: Task["state"] }) {
    const t: Task = { id: this.nextId("TSK"), state: "open", ...input, version: 1, kind: "demo", createdAt: now(), updatedAt: now() };
    this.tasks.set(t.id, t); return t;
  }
  /** Optimistic concurrency: caller supplies expectedVersion; stale → conflict. */
  updateTask(id: string, expectedVersion: number, patch: Partial<Pick<Task, "title" | "assignee" | "due" | "state">>) {
    const t = this.tasks.get(id);
    if (!t) return { error: "not_found" as const };
    if (t.version !== expectedVersion) return { error: "conflict" as const, current: t };
    Object.assign(t, patch, { version: t.version + 1, updatedAt: now() });
    return { task: t };
  }

  createProposal(input: Omit<Proposal, "id" | "payloadHash" | "version" | "status" | "createdAt" | "expiresAt">) {
    const p: Proposal = {
      id: this.nextId("PRP"), ...input, payloadHash: hashPayload(input.payload), version: 1,
      status: "awaiting_approval", createdAt: now(), expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
    };
    this.proposals.set(p.id, p);
    this.notify("action_needs_review", `Approval needed: ${p.payload.title}`, p.id);
    return p;
  }
  notify(category: string, title: string, refId?: string) {
    // dedupe on category+refId
    if ([...this.notifications.values()].some((n) => n.category === category && n.refId === refId)) return;
    const n: Notification = { id: randomUUID(), category, title, refId, read: false, at: now() };
    this.notifications.set(n.id, n); return n;
  }
}

declare global { var __forgeline_store: Store | undefined }
export const store: Store = globalThis.__forgeline_store ?? (globalThis.__forgeline_store = new Store());
export type { Store };
