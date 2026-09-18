import Link from "next/link";
import { DOC_CHUNKS, EQUIPMENT } from "@/lib/fixtures";

export default async function ProceduresPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").toLowerCase(), domain = sp.domain ?? "", equipment = sp.equipment ?? "", archived = sp.archived === "1", kase = sp.case;
  const rows = DOC_CHUNKS.filter((d) => archived || d.approval_status === "approved")
    .filter((d) => !domain || d.category === domain).filter((d) => !equipment || d.equipment.includes(equipment))
    .filter((d) => !q || `${d.doc_id} ${d.title} ${d.section} ${d.excerpt}`.toLowerCase().includes(q));
  return (
    <div>
      <h1>Procedures</h1>
      <form className="panel" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "end" }}>
        <input type="search" name="q" defaultValue={sp.q} placeholder="Search approved documents" aria-label="Search" style={{ flex: "1 1 240px" }} />
        <select name="domain" defaultValue={domain} aria-label="Domain" style={{ width: "auto" }}><option value="">All domains</option><option value="safety">Safety</option><option value="maintenance">Maintenance</option><option value="quality">Quality</option></select>
        <select name="equipment" defaultValue={equipment} aria-label="Equipment" style={{ width: "auto" }}><option value="">All equipment</option>{EQUIPMENT.map((e) => <option key={e.id} value={e.id}>{e.id}</option>)}</select>
        <label className="muted"><input type="checkbox" name="archived" value="1" defaultChecked={archived} /> Include archived</label>
        {kase && <input type="hidden" name="case" value={kase} />}
        <button className="btn primary" type="submit">Search</button>
      </form>
      <div className="panel" style={{ marginTop: 16, padding: 0 }}>
        {rows.length === 0 && <div className="row muted">No results. Clear filters or try another term.</div>}
        {rows.map((d) => (
          <div key={d.id} className="row" style={{ flexWrap: "wrap" }}>
            <Link className="title" href={`/manual/${d.doc_id}?revision=${d.revision}&section=${encodeURIComponent(d.section)}${kase ? `&case=${kase}` : ""}`}>{d.title} — {d.section}</Link>
            <span className="mono muted">{d.doc_id} · v{d.revision}</span>
            <span className="badge neutral">{d.category}</span>
            {d.equipment.map((e) => <span key={e} className="mono muted">{e}</span>)}
            <span className="muted">effective {d.effective_date}</span>
            <span className={`badge ${d.approval_status === "approved" ? "ok" : "bad"}`}>{d.approval_status === "approved" ? "Approved" : "Archived"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
