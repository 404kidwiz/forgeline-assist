"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { AgentResult } from "@/lib/agent/types";

type Ev = { id: string; tool: string; branch?: string; startedAt: string; endedAt?: string; status: string; summary?: string; args: Record<string, unknown> };
type Run = { id: string; status: string; result?: AgentResult; error?: string; events: Ev[] };
export type InvData = { id: string; question: string; equipment?: string; batch?: string; status: string; runs: Run[]; proposals: { id: string; status: string; payload: { title: string } }[]; tasks: { id: string; title: string; assignee: string; state: string }[] };

const t = (iso?: string) => (iso ? new Date(iso).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit", fractionalSecondDigits: 3 } as Intl.DateTimeFormatOptions) : "…");

export function InvestigationView({ initial, autoRun }: { initial: InvData; autoRun?: boolean }) {
  const [inv, setInv] = useState<InvData>(initial);
  const [running, setRunning] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const started = useRef(false);
  const refresh = async () => setInv(await (await fetch(`/api/investigations/${initial.id}`)).json());

  const run = async () => {
    setRunning(true); setErr(null);
    const poll = setInterval(refresh, 150); // ponytail: poll instead of SSE; events still carry real timestamps
    try {
      const r = await fetch(`/api/investigations/${initial.id}/run`, { method: "POST" });
      if (!r.ok) setErr((await r.json()).error ?? `HTTP ${r.status}`);
    } catch (e) { setErr(String(e)); }
    clearInterval(poll); await refresh(); setRunning(false);
  };
  // Run exactly once on mount when arriving from the composer; deps intentionally empty.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (autoRun && !started.current && inv.runs.length === 0) { started.current = true; run(); } }, []);

  const last = inv.runs[inv.runs.length - 1];
  const res = last?.result;
  const evidence = res?.evidenceIds ?? [];
  return (
    <div className="two-col">
      <section className="conversation" aria-live="polite">
        <div className="topbar">
          <span>Plant FL-01 · Day shift</span>
          <span className="mono">{inv.id}</span>
          {inv.equipment && <span className="badge info mono">{inv.equipment}</span>}
          {inv.batch && <span className="badge info mono">{inv.batch}</span>}
          <span className={`badge ${inv.status === "completed" ? "ok" : inv.status === "failed" ? "bad" : ""}`}>{inv.status}</span>
          {running && <button className="btn danger" onClick={() => fetch(`/api/investigations/${inv.id}/cancel`, { method: "POST" })}>Stop</button>}
          {!running && last && <button className="btn" onClick={run}>Re-run</button>}
          <Link href="/ask" style={{ marginLeft: "auto" }}>New investigation</Link>
        </div>
        <div className="msg user"><strong>You</strong><div>{inv.question}</div></div>
        {err && <div className="status-line failed">Run failed: {err}. Your question is retained.</div>}
        {running && !res && <div className="status-line" style={{ background: "var(--surface-subtle)" }}>Running… tool activity appears on the right.</div>}
        {res && (
          <div className="msg">
            <strong>ForgeLine Assist</strong>
            <div className={`status-line ${res.status}`}>
              {res.status === "partial" && "Partial evidence — some checks unavailable."}
              {res.status === "completed" && "Answer supported by approved sources."}
              {res.status === "boundary" && "Emergency boundary."}
              {res.status === "needs_input" && "Needs one detail before continuing."}
              {res.status === "failed" && "Run failed."}
            </div>
            <div className="answer">{res.answer}</div>
            {res.questions.length > 0 && <ul>{res.questions.map((q) => <li key={q}>{q}</li>)}</ul>}
            {res.missingChecks.length > 0 && <div className="muted" style={{ marginTop: 8 }}>Missing: {res.missingChecks.join("; ")}</div>}
            {res.handoverDraft && <><h2>Handover draft</h2><div className="panel">{res.handoverDraft}</div></>}
            {res.taskReceipts.length > 0 && <><h2>Demo tasks created</h2>{res.taskReceipts.map((r) => <div key={r.taskId} className="row"><span className="mono">{r.taskId}</span> {r.title} <span className="badge neutral">Demo task</span></div>)}</>}
            {res.proposalIds.length > 0 && <><h2>Awaiting your approval</h2>{res.proposalIds.map((p) => <div key={p} className="row"><Link href={`/approvals/${p}`}>Review GitHub issue proposal {p}</Link><span className="badge">approval needed</span></div>)}</>}
          </div>
        )}
      </section>
      <aside className="panel">
        <h2 style={{ marginTop: 0 }}>Sources</h2>
        {evidence.length === 0 && <div className="muted">No sources yet.</div>}
        {evidence.map((id) => { const [doc, rev, sec] = id.split(":"); return <Link key={id} className="source-card" href={`/manual/${doc}?revision=${rev.slice(1)}&section=${encodeURIComponent(sec)}&case=${inv.id}`}><span className="mono">{doc} · {rev} · {sec}</span></Link>; })}
        <h2>Activity</h2>
        <ul className="timeline" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {(last?.events ?? []).map((e) => (
            <li key={e.id}>
              <span className="mono">{t(e.startedAt)}</span>
              <span>
                <span className={`badge ${e.status === "ok" ? "ok" : e.status === "failed" ? "bad" : "neutral"}`}>{e.status}</span>{" "}
                <strong>{e.tool}</strong>{e.branch && e.branch !== "main" ? ` · ${e.branch}` : ""}
                <div className="muted">{e.summary ?? "running…"}{e.endedAt && ` · ended ${t(e.endedAt)}`}</div>
              </span>
            </li>
          ))}
          {last && last.events.length === 0 && <li><span /><span className="muted">No tools were called.</span></li>}
        </ul>
      </aside>
    </div>
  );
}
