# ForgeLine Assist v2 — implementation checklist

Planning only; nothing below is implemented. See [plan.md](plan.md) and the preserved [v1 source pack](plan-v1-reference.md). Confirmed: Dify; all four views; demo writes; approved GitHub Issues actions; concurrent investigations; GitHub document monitoring; in-app plus email. One-hour limit removed.

## 1. Foundation and access — 2–3 hours

- [ ] Verify actual Dify/model/tool compatibility, dedicated GitHub destination, hosting and email-provider readiness.
- [ ] Establish authenticated roles, Postgres case/job schema and durable workflow invocation.

Acceptance: scoped authenticated case invokes a real Dify run and can reload its state. Verification: actual API response and cross-session permission check. Dependencies: later implementation authorization and access. Files: identity, schema/migrations, run contracts and environment template without values.

## 2. Evidence and central agent — 3–5 hours

- [ ] Build six current source files plus archive; configure version/plant filters.
- [ ] Implement search/read tools, parallel domain results, bounded agent execution and validated source output.
- [ ] Verify adaptive follow-up, mixed-topic coverage and explicit partial failure.

Acceptance: actual tool choice leads to supported answers with exact revisions. Verification: tool records, source assertions, parallel timestamps and limit tests. Dependencies: 1. Files: knowledge corpus, Dify exports, evidence contracts and focused tests.

## Checkpoint: evidence loop

- [ ] Real question → agent tool selection → evidence → adaptive next step → supported result works before UI expansion.

## 3. Unified interface and persisted demo tasks — 4–6 hours

Follow [DESIGN.md](../DESIGN.md) for the SchoolAI-inspired shell and its state/responsive/accessibility acceptance matrix. Design documentation is complete; all implementation checks below remain pending. Re-estimate after the first responsive shell.

- [ ] Implement Ask, Procedures, Manual and Shift Desk using shared investigation state.
- [ ] Add fictional observations, draft handovers and actual persisted demo task tools with version checks and receipt IDs.
- [ ] Verify phone/desktop layouts, focus, source opening and isolated supervisor sessions.

Acceptance: all views show the same case/evidence/task state; draft and executed records differ visibly. Verification: browser flows, persistence after refresh, duplicate-write and stale-update tests. Dependencies: 2. Files: shared state, four view modules, task service and fixtures. Break each view/service into its own small implementation task.

## 4. Durable execution and approved GitHub actions — 4–7 hours

- [ ] Add worker leases, recovery, concurrency budgets and cancellation.
- [ ] Add approval records bound to exact payload/version/actor/expiry; reject unauthorized or changed proposals.
- [ ] Implement GitHub issue create/update in the dedicated test repository; store real receipts and reconcile unknown outcomes.

Acceptance: approved action is observed once in the test; retries, stale approvals and restarts do not duplicate or silently lose work. Verification: actual authorized connector test, recovery and replay cases. Dependencies: 3 plus specific repository access. Files: workers, approval service/UI, GitHub connector and tests; implement these as separate bounded slices.

## 5. Monitoring, email, evaluation and handoff — 5–9 hours

- [ ] Verify signed GitHub source events, queue/deduplicate them, stage/index approved revisions and reconcile missed events.
- [ ] Add in-app notifications and email outbox/provider delivery tracking; approval email opens authenticated review, never executes via a link.
- [ ] Run original 15 cases plus v2 concurrency/approval/monitoring/recovery tests; record results, latency and skipped checks.
- [ ] Run build/type checks; export actual tested Dify configuration and document rebinding/secrets setup.
- [ ] Prepare dedicated GitHub handoff in the later authorized build scope; keep eventual Vercel release separate until requested.

Acceptance: approved source revision activates only after indexing checks; one meaningful event yields one applicable alert; unchanged state stays silent; all in-scope tests pass. Verification: controlled source commit, email test to agreed recipients, failed-ingestion recovery, webhook replay and application checks. Dependencies: 4 plus source approval rule, sender/provider and recipient setup. Files: ingestion, monitors, notifications, evals and setup notes; split into individual bounded tasks at implementation.

## Eventual Vercel release

- [ ] Configure app, database, Dify endpoint, worker and server-only integration credentials.
- [ ] Verify authenticated deployed investigations, source opening, approval, task persistence, GitHub events and email status.
- [ ] Publish when requested and report the exact verified revision and live URL.

Full demonstration estimate: 18–30 focused hours, dependent on ready accounts/services. No plant-control actions, voice, extra connector platforms or independent specialist-agent fleet in the first release.
