"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type U = { id: string; name: string; role: string };

export function UserSwitcher() {
  const [me, setMe] = useState<U | null>(null);
  const [users, setUsers] = useState<U[]>([]);
  const router = useRouter();
  useEffect(() => { fetch("/api/me").then((r) => r.json()).then((j) => { setMe(j.user); setUsers(j.users); }); }, []);
  if (!me) return <div className="muted">Loading user…</div>;
  return (
    <label className="muted" style={{ display: "block" }}>
      Demo user · <span className="badge neutral">{me.role}</span>
      <select value={me.id} aria-label="Switch demo user" style={{ marginTop: 4 }}
        onChange={async (e) => { await fetch("/api/me", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: e.target.value }) }); const j = await (await fetch("/api/me")).json(); setMe(j.user); router.refresh(); }}>
        {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
      </select>
    </label>
  );
}
