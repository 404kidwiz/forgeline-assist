import { AskComposer } from "@/components/AskComposer";
import { store } from "@/lib/store";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AskPage() {
  const recent = [...store.investigations.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  return (
    <div className="two-col">
      <section className="welcome">
        <h1>Good morning, Maya.</h1>
        <p className="lede">What needs your attention on the floor?</p>
        <AskComposer />
        <p className="muted" style={{ marginTop: 16 }}>Answers use fictional approved documents. Open sources to verify.</p>
      </section>
      <aside className="panel">
        <h2 style={{ marginTop: 0 }}>Recent investigations</h2>
        {recent.length === 0 && <div className="muted">None yet.</div>}
        {recent.map((i) => <div key={i.id} className="row"><Link className="title" href={`/investigations/${i.id}`}>{i.question.slice(0, 60)}</Link><span className="badge neutral">{i.status}</span></div>)}
      </aside>
    </div>
  );
}
