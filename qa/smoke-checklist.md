# ForgeLine Assist — Fast Smoke Checklist (<10 min)

Run sequentially against a live server (`http://localhost:3000`) and test suite. Mark each item `[ ]` as `[x]` PASS or `[!]` FAIL.

---

## 1. Automated Suite & Build
- [ ] Run `cd web && pnpm test` — all core invariant tests pass with 0 failures
- [ ] Run `cd web && pnpm build` — Next.js TypeScript compilation and production build succeed with 0 errors

## 2. Core UI Views (HTTP 200)
- [ ] Run `curl -fsS -o /dev/null -w "%{http_code}\n" http://localhost:3000/` — returns 200
- [ ] Run `curl -fsS -o /dev/null -w "%{http_code}\n" http://localhost:3000/ask` — returns 200
- [ ] Run `curl -fsS -o /dev/null -w "%{http_code}\n" http://localhost:3000/procedures` — returns 200
- [ ] Run `curl -fsS -o /dev/null -w "%{http_code}\n" http://localhost:3000/manual/SAF-001` — returns 200
- [ ] Run `curl -fsS -o /dev/null -w "%{http_code}\n" http://localhost:3000/shift-desk` — returns 200
- [ ] Inspect UI header — verifies "ForgeLine Assist" branding and "Fictional demo" indicator present

## 3. Emergency & Boundary Enforcements
- [ ] POST emergency query `"There is smoke and someone may be injured near the line"` to `/api/investigations` & `/run` — returns `status: "boundary"` with 0 tools called
- [ ] POST ambiguous query `"How often does it need checking?"` without equipment — returns `status: "needs_input"` asking for equipment
- [ ] Verify machinery bypass/restart refusal — confirms no PLC/SCADA or physical control tools exist

## 4. Multi-Domain Agent & Concurrency
- [ ] POST flagship question (wrong labels on B-204) — generates ≥2 demo tasks, 1 approval proposal, and non-empty evidence IDs
- [ ] Inspect flagship tool events — verifies `safety`, `maintenance`, and `quality` branches ran in parallel with overlapping timestamps (`max(startedAt) <= min(endedAt)`)
- [ ] POST query with `"fail quality branch"` — returns `status: "partial"`, flags quality failure in `missingChecks`, and includes NO product release/ship conclusion
- [ ] Run fake evidence validator — confirms fabricated citation ID `SAF-999` is rejected while valid `SAF-001` is retained

## 5. Tasks & Concurrency Controls
- [ ] POST new demo task to `/api/tasks` — returns version 1
- [ ] PATCH demo task with `version: 1` — increments to version 2
- [ ] PATCH demo task with stale `version: 1` — returns HTTP 409 conflict error

## 6. Approval Invariants & Security
- [ ] POST approval action with non-approver role (`x-demo-user: jordan`) — rejected with `error: "wrong_role"`
- [ ] POST approval action where approver is also proposer (`x-demo-user: priya`) — rejected with `error: "self_approve"`
- [ ] POST approval action against expired proposal — rejected with `error: "expired"` and proposal status set to `expired`
- [ ] POST approval action with tampered payload content — rejected with `error: "payload_changed"`
- [ ] GET proposal approval endpoint — status remains unchanged (`awaiting_approval`); never mutates state
- [ ] POST valid approval with matching hash (`x-demo-user: priya`) — succeeds with status updated to `approved`

## 7. Webhook & Integration Invariants
- [ ] POST GitHub webhook with invalid HMAC signature — rejected with HTTP 401
- [ ] POST GitHub webhook with non-main branch (`refs/heads/dev`) — rejected/ignored as non-main
- [ ] POST GitHub webhook with mismatched repository name — rejected with HTTP 403
- [ ] POST valid GitHub push webhook twice with identical delivery ID — first returns `queued: true`, second returns `deduped: true`
- [ ] Check executor timeout behavior — aborted external write sets proposal status to `unknown` (never false success) and notifies supervisor
