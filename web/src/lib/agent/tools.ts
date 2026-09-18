// Server-side tools. Filters are enforced HERE, not by the model.
import { DOC_CHUNKS, SHIFT, type DocChunk, type Domain } from "../fixtures";
import { store } from "../store";

const terms = (q: string) => q.toLowerCase().split(/[^a-z0-9-]+/).filter((t) => t.length > 2);

/** Only current approved revisions are ever returned here. */
export function searchPlantDocs(query: string, domain: Domain, equipment?: string): DocChunk[] {
  const ts = terms(query);
  return DOC_CHUNKS.filter((d) => d.approval_status === "approved" && d.category === domain)
    .filter((d) => !equipment || d.equipment.length === 0 || d.equipment.includes(equipment))
    .map((d) => ({ d, score: ts.filter((t) => (d.excerpt + " " + d.title + " " + d.section + " " + d.equipment.join(" ")).toLowerCase().includes(t)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.d);
}

export function readProcedure(docId: string, section?: string): DocChunk[] {
  return DOC_CHUNKS.filter((d) => d.doc_id === docId && d.approval_status === "approved" && (!section || d.section === section));
}

/** The only tool allowed to read superseded revisions. */
export function compareDocumentVersions(docId: string) {
  const all = DOC_CHUNKS.filter((d) => d.doc_id === docId);
  const current = all.filter((d) => d.approval_status === "approved");
  const archived = all.filter((d) => d.approval_status === "superseded");
  return { current, archived };
}

export function getShiftSnapshot() { return SHIFT; }

export function createDemoTask(input: { title: string; equipment?: string; assignee: string; due?: string; origin?: string }) {
  return store.createTask(input);
}

export function proposeExternalAction(input: {
  investigationId: string; proposerId: string; title: string; body: string; labels: string[]; evidenceIds: string[]; evidenceLabel: string; reason: string;
}) {
  const repo = process.env.GITHUB_REPO;
  const [account = "not-configured", name = "test-repository"] = (repo ?? "").split("/");
  return store.createProposal({
    investigationId: input.investigationId, proposerId: input.proposerId, actionType: "github.issue.create",
    target: { system: "github", account, repo: name, resource: "issues" },
    payload: { title: input.title, body: input.body, labels: input.labels },
    evidenceIds: input.evidenceIds, evidenceLabel: input.evidenceLabel, reason: input.reason,
  });
}

/** Evidence IDs a result cites must be present in this run's tool events. Unknown IDs are dropped and reported. */
export function validateEvidenceIds(runId: string, ids: string[]) {
  const known = new Set(store.eventsForRun(runId).flatMap((e) => e.evidenceIds ?? []));
  const valid = ids.filter((id) => known.has(id));
  const rejected = ids.filter((id) => !known.has(id));
  return { valid, rejected };
}

export const chunkLabel = (d: DocChunk) => `${d.doc_id} · v${d.revision} · ${d.section}`;
