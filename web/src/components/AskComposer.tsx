"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SUGGESTIONS, EQUIPMENT } from "@/lib/fixtures";

export function AskComposer() {
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [equipment, setEquipment] = useState(sp.get("equipment") ?? "");
  const [batch, setBatch] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const submit = async () => {
    if (!q.trim() || busy) return;
    setBusy(true); setErr(null);
    const r = await fetch("/api/investigations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, equipment, batch }) });
    if (!r.ok) { setErr((await r.json()).error); setBusy(false); return; }
    const inv = await r.json();
    router.push(`/investigations/${inv.id}?autorun=1`);
  };
  return (
    <div>
      <div className="composer">
        <label htmlFor="ask" className="muted">Ask ForgeLine</label>
        <textarea id="ask" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about safety, maintenance or quality…"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); } }} />
        <div className="bar">
          <select aria-label="Equipment" value={equipment} onChange={(e) => setEquipment(e.target.value)}>
            <option value="">Equipment: any</option>
            {EQUIPMENT.map((e) => <option key={e.id} value={e.id}>{e.id}</option>)}
          </select>
          <input type="text" aria-label="Batch" placeholder="Batch (e.g. B-204)" value={batch} onChange={(e) => setBatch(e.target.value)} />
          <span className="muted">Sources: Approved sources</span>
          <button className="send" onClick={submit} disabled={busy || !q.trim()} aria-label="Send">{busy ? "…" : "→"}</button>
        </div>
      </div>
      {err && <div className="status-line failed">{err}</div>}
      <div className="suggest" role="list">
        {SUGGESTIONS.map((s) => <button key={s} role="listitem" onClick={() => setQ(s)}>{s}</button>)}
      </div>
    </div>
  );
}
