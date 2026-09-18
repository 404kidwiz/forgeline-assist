import { store, type User } from "./store";

/** Demo identity: `x-demo-user` header wins, then `demo_user` cookie, then Maya. Not authentication. */
export function currentUser(req: Request): User {
  const h = req.headers.get("x-demo-user");
  const cookie = req.headers.get("cookie")?.match(/(?:^|;\s*)demo_user=([^;]+)/)?.[1];
  return store.getUser(h) ?? store.getUser(cookie) ?? store.users[0];
}
