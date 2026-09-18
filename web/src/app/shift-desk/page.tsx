import Link from "next/link";
import { store } from "@/lib/store";
import { CHANGES, SHIFT } from "@/lib/fixtures";
import { TaskEditor } from "@/components/TaskEditor";

export const dynamic = "force-dynamic";

export default function ShiftDesk() {
  const proposals = [...store.proposals.values()];
  const pending = proposals.filter((p) => p.status === "awaiting_approval");
  const unknown = proposals.filter((p) => p.status === "unknown" || p.status === "failed");
  const needsInput = [...store.investigations.values()].filter((i) => i.status === "needs_input" || i.status === "partial");
  const attention = pending.length + unknown.length + needsInput.length;
  const invs = [...store.investigations.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const tasks = [...store.tasks.values()];
  const notes = [...store.notifications.values()].sort((a, b) => b.at.localeCompare(a.at));
  return (
    <div>
      <div className="topbar"><span>Plant {SHIFT.plant} · {SHIFT.name} · {SHIFT.date}</span><span>Supervisor {SHIFT.supervisor}</span></div>
      <h1>Shift Desk</h1>
      <h2>Attention queue {attention > 0 && <span className="badge">{attention} pending</span>}</h2>
      <div className="panel" style={{ padding: 0 }}>
        {attention === 0 && <div className="row muted">Nothing needs attention.</div>}
        {pending.map((p) => <div key={p.id} className="row"><span className="badge">approval needed</span><Link className="title" href={`/approvals/${p.id}`}>{p.payload.title}</Link><span className="mono muted">{p.id}</span></div>)}
        {unknown.map((p) => <div key={p.id} className="row"><span className="badge bad">{p.status}</span><Link className="title" href={`/approvals/${p.id}`}>{p.payload.title}</Link></div>)}
        {needsInput.map((i) => <div key={i.id} className="row"><span className="badge">{i.status}</span><Link className="title" href={`/investigations/${i.id}`}>{i.question.slice(0, 80)}</Link></div>)}
      </div>
      <h2>Investigations</h2>
      <div className="panel" style={{ padding: 0 }}>
        {invs.length === 0 && <div className="row muted">No investigations yet. <Link href="/ask">Ask something.</Link></div>}
        {invs.map((i) => <div key={i.id} className="row" style={{ flexWrap: "wrap" }}><Link className="title" href={`/investigations/${i.id}`}>{i.question.slice(0, 80)}</Link>{i.equipment && <span className="mono muted">{i.equipment}</span>}<span className="muted">{store.getUser(i.ownerId)?.name ?? i.ownerId}</span><span className="badge neutral">{i.status}</span><span className="muted">{new Date(i.updatedAt).toLocaleTimeString()}</span></div>)}
      </div>
      <h2>Tasks</h2>
      <TaskEditor initial={tasks} users={store.users} />
      <h2>Updates</h2>
      <div className="panel" style={{ padding: 0 }}>
        {CHANGES.map((c) => <div key={c.id} className="row" style={{ flexWrap: "wrap" }}><span className="mono">{c.id}</span><span>{c.summary}</span><span className="mono muted">{c.doc_id} v{c.from} → v{c.to}</span><span className="badge ok">{c.ingestion}</span><Link href={`/manual/${c.doc_id}`}>Review change</Link></div>)}
        {SHIFT.observations.map((o) => <div key={o.id} className="row" style={{ flexWrap: "wrap" }}><span className="mono">{o.id}</span><span className="mono muted">{o.equipment} · {o.batch} · {o.time}</span><span>{o.note}</span><span className="badge">{o.status}</span></div>)}
        {notes.map((n) => <div key={n.id} className="row"><span className="badge neutral">{n.category}</span><span>{n.title}</span>{!n.read && <span className="badge info">unread</span>}</div>)}
      </div>
    </div>
  );
}
