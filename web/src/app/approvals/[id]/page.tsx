import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { store } from "@/lib/store";
import { ApprovalActions } from "@/components/ApprovalActions";

export const dynamic = "force-dynamic";

export default async function ApprovalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = store.proposals.get(id);
  if (!p) notFound();
  const h = await headers(); const c = await cookies();
  const me = store.getUser(h.get("x-demo-user")) ?? store.getUser(c.get("demo_user")?.value) ?? store.users[0];
  const receipt = store.receipts.get(`RCP-${p.id}`);
  const configured = !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
  const canAct = me.role === "approver" && me.id !== p.proposerId && p.status === "awaiting_approval";
  return (
    <div className="two-col">
      <article>
        <h1 tabIndex={-1}>Action review — {p.actionType === "github.issue.create" ? "GitHub issue creation" : p.actionType}</h1>
        <div className="topbar"><span className="mono">{p.id} · v{p.version}</span><span className={`badge ${p.status === "succeeded" ? "ok" : p.status === "awaiting_approval" ? "" : p.status === "rejected" || p.status === "failed" ? "bad" : "neutral"}`}>{p.status}</span><span>Expires {new Date(p.expiresAt).toLocaleTimeString()}</span><Link href={`/investigations/${p.investigationId}`}>Return to investigation</Link></div>
        {!configured && <div className="status-line partial">Test repository not connected. Approval will execute a clearly labelled simulated write; no GitHub issue is created.</div>}
        <table><tbody>
          <tr><th>Target system</th><td>{p.target.system} · account <span className="mono">{p.target.account}</span> · repository <span className="mono">{p.target.repo}</span> · {p.target.resource}</td></tr>
          <tr><th>Proposed by</th><td>{store.getUser(p.proposerId)?.name ?? p.proposerId}</td></tr>
          <tr><th>Reason</th><td>{p.reason}</td></tr>
          <tr><th>Evidence</th><td>{p.evidenceIds.map((e) => { const [d, r, s] = e.split(":"); return <Link key={e} className="mono" style={{ display: "block" }} href={`/manual/${d}?revision=${r.slice(1)}&section=${encodeURIComponent(s)}`}>{d} · {r} · {s}</Link>; })}</td></tr>
          <tr><th>Payload hash</th><td className="mono">{p.payloadHash.slice(0, 16)}…</td></tr>
        </tbody></table>
        <h2>Exact payload</h2>
        <pre className="payload">{JSON.stringify(p.payload, null, 2)}</pre>
        {receipt && (
          <section className={`status-line ${receipt.kind === "real" ? "completed" : "partial"}`}>
            <strong>{receipt.label}</strong><br />
            {receipt.kind === "real" ? <>Issue #{receipt.number} in {receipt.repo}: <a href={receipt.url} target="_blank" rel="noreferrer">{receipt.url}</a></> : receipt.note}
            <div className="muted">{new Date(receipt.at).toLocaleString()}</div>
          </section>
        )}
      </article>
      <aside className="panel">
        <h2 style={{ marginTop: 0 }}>Decision</h2>
        <p className="muted">Signed in as {me.name} ({me.role}). Only an approver who is not the proposer can decide. Opening this page, or an email link to it, never approves anything; approval is an explicit POST checked server-side.</p>
        {canAct ? <ApprovalActions id={p.id} payloadHash={p.payloadHash} /> : p.status === "awaiting_approval" ? <div className="status-line partial">Awaiting authorized approver.</div> : <div className="muted">No action available in state “{p.status}”.</div>}
        {p.status === "approved" && <ApprovalActions id={p.id} payloadHash={p.payloadHash} executeOnly />}
      </aside>
    </div>
  );
}
