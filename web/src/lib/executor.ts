import { store, type Receipt } from "./store";

/** Executes an approved proposal exactly once. Real GitHub write only if env is set; otherwise a clearly simulated receipt. */
export async function executeProposal(proposalId: string, actorId: string): Promise<{ ok: true; receipt: Receipt } | { ok: false; error: string }> {
  const p = store.proposals.get(proposalId);
  if (!p) return { ok: false, error: "not_found" };
  if (p.status !== "approved") return { ok: false, error: `proposal is ${p.status}, not approved` };
  if (Date.now() > Date.parse(p.expiresAt)) { p.status = "expired"; return { ok: false, error: "expired" }; }
  p.status = "executing";
  const token = process.env.GITHUB_TOKEN, repo = process.env.GITHUB_REPO;
  const at = new Date().toISOString();
  if (token && repo) {
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json" },
        body: JSON.stringify(p.payload), signal: AbortSignal.timeout(20_000),
      });
      if (!res.ok) { p.status = "failed"; return { ok: false, error: `GitHub ${res.status}: ${(await res.text()).slice(0, 200)}` }; }
      const j = await res.json() as { number: number; html_url: string };
      const receipt: Receipt = { id: `RCP-${p.id}`, proposalId: p.id, kind: "real", label: "Real GitHub action · test repository", repo, number: j.number, url: j.html_url, at };
      store.receipts.set(receipt.id, receipt); p.status = "succeeded";
      store.log(actorId, "proposal.executed.real", p.id, j.html_url);
      return { ok: true, receipt };
    } catch (e) {
      // Timeout after a possible write → unknown, never "failed" or "succeeded" without evidence.
      p.status = "unknown"; store.notify("integration_failure", `Outcome unknown for ${p.id} — check GitHub`, p.id);
      return { ok: false, error: `Outcome unknown: ${e instanceof Error ? e.message : String(e)}` };
    }
  }
  const receipt: Receipt = { id: `RCP-${p.id}`, proposalId: p.id, kind: "simulated", label: "Simulated — no external write (GITHUB_TOKEN/GITHUB_REPO not configured)", at, note: "No issue was created anywhere." };
  store.receipts.set(receipt.id, receipt); p.status = "succeeded";
  store.log(actorId, "proposal.executed.simulated", p.id);
  return { ok: true, receipt };
}
