import { store, hashPayload, type Proposal } from "./store";

export type ApprovalError = "not_found" | "wrong_role" | "self_approve" | "expired" | "payload_changed" | "bad_state";

/** Server-side approval policy. Every check must pass; GET never reaches this. */
export function decideProposal(
  proposalId: string,
  actorId: string | undefined,
  decision: "approved" | "rejected",
  presentedHash?: string,
): { ok: true; proposal: Proposal } | { ok: false; error: ApprovalError } {
  const p = store.proposals.get(proposalId);
  if (!p) return { ok: false, error: "not_found" };
  const actor = store.getUser(actorId);
  if (!actor || actor.role !== "approver") return { ok: false, error: "wrong_role" };
  if (actor.id === p.proposerId) return { ok: false, error: "self_approve" };
  if (p.status !== "awaiting_approval") return { ok: false, error: "bad_state" };
  if (Date.now() > Date.parse(p.expiresAt)) { p.status = "expired"; return { ok: false, error: "expired" }; }
  const currentHash = hashPayload(p.payload);
  if (currentHash !== p.payloadHash || (presentedHash && presentedHash !== currentHash)) return { ok: false, error: "payload_changed" };
  p.status = decision;
  store.approvals.set(`${p.id}:${actor.id}`, { id: `${p.id}:${actor.id}`, proposalId: p.id, approverId: actor.id, decision, payloadHash: currentHash, at: new Date().toISOString() });
  store.log(actor.id, `proposal.${decision}`, p.id);
  return { ok: true, proposal: p };
}
