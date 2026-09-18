// Real Dify Workflow adapter. Stateless: case context is passed as inputs each call.
// Selected only when DIFY_API_KEY + DIFY_BASE_URL are set. Not exercised in tests.
import { store } from "../store";
import type { AgentAdapter, AgentContext, AgentResult } from "./types";
import { EMERGENCY_BOUNDARY, isEmergency } from "./types";
import { validateEvidenceIds, searchPlantDocs } from "./tools";
import type { Domain } from "../fixtures";

export const difyAdapter: AgentAdapter = {
  name: "dify",
  async run(ctx: AgentContext): Promise<AgentResult> {
    if (isEmergency(ctx.question)) return { status: "boundary", answer: EMERGENCY_BOUNDARY, evidenceIds: [], missingChecks: [], questions: [], taskReceipts: [], proposalIds: [] };
    const base = process.env.DIFY_BASE_URL!.replace(/\/$/, "");
    // ponytail: we pre-retrieve server-side and hand Dify the approved chunks as inputs, so the
    // workflow never needs its own knowledge base and cannot cite anything we didn't return.
    const domains: Domain[] = ["safety", "maintenance", "quality"];
    const retrieved = await Promise.all(domains.map(async (domain) => {
      const ev = store.startToolEvent(ctx.runId, "search_plant_docs", { query: ctx.question, domain, equipment: ctx.equipment }, domain);
      const hits = searchPlantDocs(ctx.question, domain, ctx.equipment);
      const ids = hits.map((h) => { store.addEvidence(ctx.runId, h); return h.id; });
      store.endToolEvent(ev.id, "ok", `${hits.length} chunk(s)`, ids);
      return hits;
    }));
    const ev = store.startToolEvent(ctx.runId, "dify.workflows.run", { mode: "blocking" }, "main");
    const res = await fetch(`${base}/v1/workflows/run`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.DIFY_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        response_mode: "blocking", user: `forgeline-${ctx.userId}`,
        inputs: { question: ctx.question, equipment: ctx.equipment ?? "", batch: ctx.batch ?? "", investigation_id: ctx.investigationId, evidence: JSON.stringify(retrieved.flat()) },
      }),
      signal: AbortSignal.timeout(45_000),
    });
    if (!res.ok) { store.endToolEvent(ev.id, "failed", `HTTP ${res.status}`); return { status: "failed", answer: `Dify error ${res.status}`, evidenceIds: [], missingChecks: ["dify"], questions: [], taskReceipts: [], proposalIds: [] }; }
    const json = await res.json() as { data?: { outputs?: Record<string, unknown> } };
    const out = json.data?.outputs ?? {};
    store.endToolEvent(ev.id, "ok", "Workflow finished");
    const claimed = Array.isArray(out.evidenceIds) ? (out.evidenceIds as string[]) : [];
    const { valid, rejected } = validateEvidenceIds(ctx.runId, claimed);
    return {
      status: rejected.length ? "partial" : "completed",
      answer: String(out.answer ?? ""), evidenceIds: valid,
      missingChecks: rejected.length ? [`Rejected ${rejected.length} unverifiable evidence id(s)`] : [],
      questions: Array.isArray(out.questions) ? (out.questions as string[]) : [], taskReceipts: [], proposalIds: [],
    };
  },
};
