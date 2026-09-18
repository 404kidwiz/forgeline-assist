"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApprovalActions({ id, payloadHash, executeOnly = false }: { id: string; payloadHash: string; executeOnly?: boolean }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const decide = async (decision: "approved" | "rejected") => {
    setBusy(decision); setErr(null);
    const r = await fetch(`/api/approvals/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decision, payloadHash }) });
    if (!r.ok) { setErr(`Rejected by server: ${(await r.json()).error}`); setBusy(null); return; }
    if (decision === "approved") await execute(); else { setBusy(null); router.refresh(); }
  };
  const execute = async () => {
    setBusy("Creating issue…");
    const r = await fetch("/api/executor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ proposalId: id }) });
    const j = await r.json();
    if (!j.ok) setErr(j.error);
    setBusy(null); router.refresh();
  };
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {!executeOnly && <>
        <button className="btn primary" disabled={!!busy} onClick={() => decide("approved")}>{busy === "approved" || busy === "Creating issue…" ? busy === "approved" ? "Approving…" : busy : "Approve GitHub issue creation"}</button>
        <button className="btn danger" disabled={!!busy} onClick={() => decide("rejected")}>Reject</button>
      </>}
      {executeOnly && <button className="btn primary" disabled={!!busy} onClick={execute}>{busy ?? "Execute approved action"}</button>}
      {err && <div className="status-line failed">{err}</div>}
    </div>
  );
}
