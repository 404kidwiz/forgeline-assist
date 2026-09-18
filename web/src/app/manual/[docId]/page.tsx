import Link from "next/link";
import { notFound } from "next/navigation";
import { DOC_CHUNKS, CHANGES } from "@/lib/fixtures";

export default async function ManualPage({ params, searchParams }: { params: Promise<{ docId: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { docId } = await params; const sp = await searchParams;
  const all = DOC_CHUNKS.filter((d) => d.doc_id === docId);
  if (!all.length) notFound();
  const currentRev = Math.max(...all.filter((d) => d.approval_status === "approved").map((d) => d.revision));
  const rev = sp.revision ? Number(sp.revision) : currentRev;
  const sections = all.filter((d) => d.revision === rev);
  if (!sections.length) notFound();
  const meta = sections[0]; const archived = meta.approval_status !== "approved";
  const change = CHANGES.find((c) => c.doc_id === docId);
  const otherRev = all.map((d) => d.revision).filter((r) => r !== rev)[0];
  const askHref = `/ask?q=${encodeURIComponent(`About ${docId} v${rev} ${sp.section ? `§${sp.section}` : ""}: `)}${meta.equipment[0] ? `&equipment=${meta.equipment[0]}` : ""}`;
  return (
    <div className="two-col">
      <article>
        <div className="topbar">
          <span className="mono">{docId} · v{rev}</span>
          <span className={`badge ${archived ? "bad" : "ok"}`}>{archived ? "Archived — superseded" : "Current approved"}</span>
          <span>Effective {meta.effective_date}</span><span>Owner: {meta.owner}</span><span className="badge neutral">{meta.category}</span>
          {sp.case && <Link href={`/investigations/${sp.case}`}>Back to {sp.case}</Link>}
        </div>
        <h1>{meta.title}</h1>
        {archived && <div className="status-line partial">This revision is archived and cannot be the source for a current operational answer. Current revision is v{currentRev}.</div>}
        {sections.map((s) => (
          <section key={s.id} id={s.section} className="doc-section" style={sp.section === s.section ? { outline: "3px solid var(--accent)" } : undefined}>
            <h2 style={{ marginTop: 0 }}>{s.section}</h2>
            <p>{s.excerpt}</p>
            <div className="muted mono">{s.id}</div>
          </section>
        ))}
        {change && (
          <section className="panel">
            <h2 style={{ marginTop: 0 }}>Version comparison — {change.id}</h2>
            <table><thead><tr><th>Old (v{change.from})</th><th>New (v{change.to}, effective {change.effective_date})</th></tr></thead>
              <tbody><tr>
                <td>[−] {all.find((d) => d.revision === change.from && d.section === "Sampling")?.excerpt}</td>
                <td>[+] {all.find((d) => d.revision === change.to && d.section === "Sampling")?.excerpt}</td>
              </tr></tbody></table>
            <p className="muted">{change.summary} Ingestion: {change.ingestion}. {otherRev !== undefined && <Link href={`/manual/${docId}?revision=${otherRev}${sp.case ? `&case=${sp.case}` : ""}`}>Open v{otherRev}</Link>}</p>
          </section>
        )}
      </article>
      <aside className="panel">
        <h2 style={{ marginTop: 0 }}>Ask about this section</h2>
        <p className="muted">Asking about {docId} v{rev}{meta.equipment[0] ? ` · ${meta.equipment[0]}` : ""}. {sp.case ? `Tied to case ${sp.case}.` : "Opens a new case with this source attached."}</p>
        <Link className="btn primary" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }} href={askHref}>Ask about this section</Link>
      </aside>
    </div>
  );
}
