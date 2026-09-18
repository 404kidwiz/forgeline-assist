// Deterministic mock runtime. Emits real tool events with real overlapping timestamps
// so the UI activity timeline and the parallel-read gate are honest, not animated.
import { store } from "../store";
import type { Domain } from "../fixtures";
import type { AgentAdapter, AgentContext, AgentResult } from "./types";
import { EMERGENCY_BOUNDARY, isEmergency, requestsForbiddenAction } from "./types";
import { searchPlantDocs, readProcedure, compareDocumentVersions, getShiftSnapshot, createDemoTask, proposeExternalAction, validateEvidenceIds, chunkLabel } from "./tools";

const MAX_ITER = 5, MAX_TOOLS = 8;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const EQUIP_RE = /\b(CV-12|PK-04|PX-20)\b/i;
const BATCH_RE = /\b(B-\d{3})\b/i;

export const mockAdapter: AgentAdapter = {
  name: "mock",
  async run(ctx: AgentContext): Promise<AgentResult> {
    const q = ctx.question;
    const empty: AgentResult = { status: "completed", answer: "", evidenceIds: [], missingChecks: [], questions: [], taskReceipts: [], proposalIds: [] };

    // 1. Emergency boundary before any tool.
    if (isEmergency(q)) return { ...empty, status: "boundary", answer: EMERGENCY_BOUNDARY };

    let toolCalls = 0;
    const call = async <T,>(tool: string, args: Record<string, unknown>, fn: () => Promise<T> | T, branch?: Domain | "main"): Promise<{ ok: true; value: T; eventId: string } | { ok: false; eventId: string; error: string }> => {
      if (toolCalls >= MAX_TOOLS) throw new Error("tool budget exhausted");
      if (ctx.isCancelled()) throw new Error("cancelled");
      toolCalls++;
      const ev = store.startToolEvent(ctx.runId, tool, args, branch);
      try {
        await sleep(40 + Math.floor(Math.random() * 120)); // ponytail: fake latency so branches visibly overlap
        // Demo hook: force one branch to fail to show partial status.
        if (tool === "search_plant_docs" && branch === "quality" && /fail quality/i.test(q)) throw new Error("quality index timeout (forced by query)");
        const value = await fn();
        return { ok: true, value, eventId: ev.id };
      } catch (e) {
        const error = e instanceof Error ? e.message : String(e);
        store.endToolEvent(ev.id, "failed", error);
        return { ok: false, eventId: ev.id, error };
      }
    };

    // 2. Resolve equipment: explicit context > mention in question > ask. Never invent.
    const equipment = ctx.equipment ?? q.match(EQUIP_RE)?.[1]?.toUpperCase();
    const batch = ctx.batch ?? q.match(BATCH_RE)?.[1]?.toUpperCase();
    const compare = /compare|old and current|previous (revision|version)|120 minutes/i.test(q);
    const generic = /how often|inspect|check|maintenance|fault|code/i.test(q) && !/px-20|cv-12|pk-04|sampling/i.test(q);
    if (!equipment && !compare && generic) {
      return { ...empty, status: "needs_input", answer: "Which equipment or product do you mean? I only answer from approved documents tied to a specific ID.", questions: ["Which equipment: CV-12, PK-04, or PX-20?"] };
    }

    // 3. Iteration 1 — three parallel domain branches via Promise.all (real overlapping timestamps).
    const domains: Domain[] = ["safety", "maintenance", "quality"];
    const branchResults = await Promise.all(domains.map((domain) =>
      call("search_plant_docs", { query: q, domain, equipment }, () => {
        const hits = searchPlantDocs(q, domain, equipment);
        return hits;
      }, domain).then((r) => {
        if (r.ok) {
          const ids = r.value.map((h) => { store.addEvidence(ctx.runId, h); return h.id; });
          store.endToolEvent(r.eventId, "ok", r.value.length ? `${r.value.length} approved chunk(s): ${r.value.map(chunkLabel).join("; ")}` : "No approved source found", ids);
        }
        return { domain, ...r };
      }),
    ));

    const evidenceIds: string[] = [];
    const missingChecks: string[] = [];
    const lines: string[] = [];
    for (const b of branchResults) {
      if (!b.ok) { missingChecks.push(`${b.domain} evidence unavailable: ${b.error}`); continue; }
      for (const h of b.value) { evidenceIds.push(h.id); lines.push(`- ${chunkLabel(h)}: ${h.excerpt}`); }
    }

    // 4. Iteration 2 — adaptive follow-up: a retrieved MNT-001 fault report references SAF-001 §Jam escalation → read it.
    let iter = 2;
    if (evidenceIds.some((id) => id.startsWith("MNT-001:v4:Fault")) && !evidenceIds.some((id) => id.startsWith("SAF-001:v3:Jam")) && iter <= MAX_ITER) {
      const r = await call("read_procedure", { doc_id: "SAF-001", section: "Jam escalation" }, () => readProcedure("SAF-001", "Jam escalation"), "main");
      if (r.ok) { const ids = r.value.map((h) => { store.addEvidence(ctx.runId, h); lines.push(`- ${chunkLabel(h)}: ${h.excerpt}`); return h.id; }); store.endToolEvent(r.eventId, "ok", `Read ${ids.join(", ")}`, ids); evidenceIds.push(...ids); }
      iter++;
    }
    if (compare) {
      const r = await call("compare_document_versions", { doc_id: "QLT-001" }, () => compareDocumentVersions("QLT-001"), "main");
      if (r.ok) {
        const cur = r.value.current.find((c) => c.section === "Sampling"); const old = r.value.archived.find((c) => c.section === "Sampling");
        const ids = [cur, old].filter(Boolean).map((h) => { store.addEvidence(ctx.runId, h!); return h!.id; });
        store.endToolEvent(r.eventId, "ok", `Compared v${old?.revision} (archived) with v${cur?.revision} (current)`, ids);
        evidenceIds.push(...ids);
        lines.push(`- Current ${cur ? chunkLabel(cur) : "?"} (effective ${cur?.effective_date}): every 60 minutes.`, `- Archived ${old ? chunkLabel(old) : "?"} (superseded, effective ${old?.effective_date}): every 120 minutes. Not authoritative.`);
      }
      iter++;
    }

    // 5. Flagship: multi-domain incident → shift snapshot, demo tasks, handover, proposal.
    const wantsTasks = /task/i.test(q), wantsHandover = /handover/i.test(q), wantsIssue = /issue|approval/i.test(q);
    const taskReceipts: AgentResult["taskReceipts"] = [], proposalIds: string[] = [];
    let handoverDraft: string | undefined;
    if (wantsTasks || wantsHandover || wantsIssue) {
      const snap = await call("get_shift_snapshot", {}, () => getShiftSnapshot(), "main");
      if (snap.ok) store.endToolEvent(snap.eventId, "ok", `${snap.value.id}: ${snap.value.observations.length} observation(s)`);
      const qualityOk = branchResults.find((b) => b.domain === "quality")?.ok;
      if (wantsTasks) {
        const specs = [
          { title: `Request maintenance review of ${equipment ?? "equipment"} label mismatch (${batch ?? "batch"})`, assignee: "maya", origin: ctx.investigationId },
          { title: `Record ${batch ?? "batch"} on QH-01 and place on quality hold pending Quality Lead review`, assignee: "jordan", origin: ctx.investigationId },
        ];
        for (const s of specs) {
          if (toolCalls >= MAX_TOOLS) break;
          const r = await call("create_demo_task", s, () => createDemoTask({ ...s, equipment, due: "2026-09-18" }), "main");
          if (r.ok) { store.endToolEvent(r.eventId, "ok", `Created ${r.value.id}`); taskReceipts.push({ taskId: r.value.id, title: r.value.title }); }
        }
      }
      if (wantsHandover) {
        handoverDraft = `Handover draft (${snap.ok ? snap.value.id : "shift"}): ${equipment ?? "Equipment"} ${batch ? `batch ${batch}` : ""} — label mismatch reported; maintenance review requested per MNT-002; affected product to be held per QLT-002 pending Quality Lead; no guard access without authorized technician per SAF-001. Release not authorized by this assistant.`;
      }
      if (wantsIssue && toolCalls < MAX_TOOLS) {
        const evLabel = evidenceIds.slice(0, 3).join(", ");
        const r = await call("propose_external_action", { actionType: "github.issue.create" }, () => proposeExternalAction({
          investigationId: ctx.investigationId, proposerId: ctx.userId,
          title: `[Demo] ${equipment ?? "Equipment"} label mismatch on ${batch ?? "batch"} — maintenance review`,
          body: `Fictional demo. Observed label mismatch on ${equipment} for ${batch}.\n\nRequired per approved sources: ${evLabel}.\n\n${qualityOk ? "Product on quality hold pending Quality Lead review." : "Quality evidence unavailable at proposal time — hold status unconfirmed."}`,
          labels: ["demo", "maintenance"], evidenceIds: evidenceIds.slice(0, 3), evidenceLabel: evLabel,
          reason: "Supervisor requested an issue for approval; requires approver role before any external write.",
        }), "main");
        if (r.ok) { store.endToolEvent(r.eventId, "ok", `Proposal ${r.value.id} awaiting approval`); proposalIds.push(r.value.id); }
      }
    }

    // 6. Compose answer. Evidence IDs validated against this run's tool events.
    const { valid, rejected } = validateEvidenceIds(ctx.runId, evidenceIds);
    if (rejected.length) missingChecks.push(`Rejected ${rejected.length} unverifiable evidence id(s)`);
    const partial = missingChecks.length > 0;
    let answer: string;
    if (requestsForbiddenAction(q)) {
      answer = "I can't provide bypass, restart, override or release steps. SAF-001 v3 reserves guard access for authorized maintenance technicians and restart/release for the maintenance and quality leads.";
    } else if (valid.length === 0) {
      return { ...empty, status: partial ? "partial" : "completed", answer: "I couldn't find an approved source for this in the fictional FL-01 corpus. Try Procedures, or ask the relevant document owner.", missingChecks };
    } else {
      answer = [
        partial
          ? `Partial result. ${missingChecks.join("; ")}. Conclusions below are limited to the evidence found; no release or hold conclusion is drawn for the missing domain.`
          : `Supported by ${valid.length} approved source section(s).`,
        "", ...lines,
        "", "Next steps: record the required fields, refer to the named owner, and do not act on anything not in an approved revision. This assistant cannot authorize restart, release or shipment.",
      ].join("\n");
    }
    return { status: partial ? "partial" : "completed", answer, evidenceIds: valid, missingChecks, questions: [], taskReceipts, proposalIds, handoverDraft };
  },
};
