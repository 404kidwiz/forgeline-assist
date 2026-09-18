import { NextResponse } from "next/server";
import { currentUser } from "@/lib/identity";
import { store } from "@/lib/store";

export async function GET(req: Request) { return NextResponse.json({ user: currentUser(req), users: store.users }); }

/** Demo user switcher: sets the demo_user cookie. Not authentication. */
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const u = store.getUser(b.userId);
  if (!u) return NextResponse.json({ error: "unknown user" }, { status: 400 });
  const res = NextResponse.json(u);
  res.cookies.set("demo_user", u.id, { path: "/", sameSite: "lax" });
  return res;
}
