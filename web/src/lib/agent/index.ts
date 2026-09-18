import { store } from "../store";
import { mockAdapter } from "./mock";
import { difyAdapter } from "./dify";
import type { AgentAdapter, AgentResult } from "./types";

export function pickAdapter(): AgentAdapter {
  return process.env.DIFY_API_KEY && process.env.DIFY_BASE_URL ? difyAdapter : mockAdapter;
}

/** Runs the agent for an investigation and persists run + result. */
export async function runInvestigation(investigationId: string, userId: string): Promise<{ runId: string; result: AgentResult }> {
  const inv = store.investigations.get(investigationId);
  if (!inv) throw new Error("not_found");
  const adapter = pickAdapter();
  const run = store.createRun(inv.id, adapter.name);
  store.updateInvestigation(inv.id, { status: "running", cancelRequested: false });
  try {
    const result = await adapter.run({
      investigationId: inv.id, runId: run.id, question: inv.question, equipment: inv.equipment, batch: inv.batch, userId,
      isCancelled: () => !!store.investigations.get(inv.id)?.cancelRequested,
    });
    const status = result.status === "boundary" ? "completed" : result.status;
    Object.assign(run, { status, endedAt: new Date().toISOString(), result });
    store.updateInvestigation(inv.id, { status });
    if (status === "needs_input") store.notify("investigation_needs_input", `Needs input: ${inv.question.slice(0, 60)}`, inv.id);
    return { runId: run.id, result };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const status = msg === "cancelled" ? "cancelled" : "failed";
    Object.assign(run, { status, endedAt: new Date().toISOString(), error: msg });
    store.updateInvestigation(inv.id, { status });
    return { runId: run.id, result: { status: "failed", answer: status === "cancelled" ? "Run cancelled." : `Run failed: ${msg}`, evidenceIds: [], missingChecks: [], questions: [], taskReceipts: [], proposalIds: [] } };
  }
}
