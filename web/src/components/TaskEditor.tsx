"use client";
import { useState } from "react";
import type { Task, User } from "@/lib/store";

export function TaskEditor({ initial, users }: { initial: Task[]; users: User[] }) {
  const [tasks, setTasks] = useState(initial);
  const [msg, setMsg] = useState<Record<string, string>>({});
  const save = async (t: Task, patch: Partial<Task>) => {
    setMsg((m) => ({ ...m, [t.id]: "Saving…" }));
    const r = await fetch(`/api/tasks/${t.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ expectedVersion: t.version, ...patch }) });
    if (r.status === 409) { const j = await r.json(); setTasks((ts) => ts.map((x) => (x.id === t.id ? j.current : x))); setMsg((m) => ({ ...m, [t.id]: "Stale version — refreshed with the latest; re-apply your edit." })); return; }
    if (!r.ok) { setMsg((m) => ({ ...m, [t.id]: "Save failed." })); return; }
    const saved = await r.json(); setTasks((ts) => ts.map((x) => (x.id === t.id ? saved : x))); setMsg((m) => ({ ...m, [t.id]: `Saved v${saved.version}` }));
  };
  return (
    <div className="panel" style={{ padding: 0 }}>
      <table><thead><tr><th>ID</th><th>Title</th><th>Assignee</th><th>Due</th><th>State</th><th>Origin</th><th></th></tr></thead>
        <tbody>{tasks.map((t) => (
          <tr key={t.id}>
            <td className="mono">{t.id}<br /><span className="badge neutral">Demo task</span></td>
            <td>{t.title}</td>
            <td><select aria-label={`Assignee for ${t.id}`} value={t.assignee} onChange={(e) => save(t, { assignee: e.target.value })}>{users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></td>
            <td>{t.due}</td>
            <td><select aria-label={`State for ${t.id}`} value={t.state} onChange={(e) => save(t, { state: e.target.value as Task["state"] })}><option value="open">open</option><option value="in_progress">in progress</option><option value="done">done</option></select></td>
            <td className="mono muted">{t.origin ?? "—"}</td>
            <td className="muted">v{t.version}{msg[t.id] && <><br />{msg[t.id]}</>}</td>
          </tr>
        ))}</tbody></table>
    </div>
  );
}
