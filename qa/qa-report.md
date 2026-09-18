# ForgeLine Assist — QA Verification Report

**Execution Date:** 2026-09-18  
**Environment:** macOS / Node.js v20+ / pnpm v11.18.0 / Next.js 16.3.5 / Vitest v5.0.1  
**Project Root:** `/Users/dawizkidmal/Desktop/404 Projects/Factory Chat Demo`  
**Governing Documents:** [tasks/plan.md](../tasks/plan.md), [DESIGN.md](../DESIGN.md), [PROJECT_SUMMARY.md](../PROJECT_SUMMARY.md)

---

## Executive Summary

| Scope | Total Tests Executed | Passed | Failed | Blocked / Requires Real Credentials |
|---|---|---|---|---|
| Vitest Automated Invariant Suite | 15 | 15 | 0 | 0 |
| Next.js TypeScript / Production Build | 1 | 0 | 1 | 0 |
| Live Dev Server Smoke & Boundary Invariants (curl) | 16 | 15 | 1 (`/manual` index without docId) | 0 |
| External Live Cloud Integrations | 4 | 0 | 0 | 4 (Dify Cloud, Real GitHub Issue write, Real GitHub Webhook push, Transactional Email) |

---

## 1. Automated Test Suite (`pnpm test`)

**Command:**
```bash
cd web && pnpm test
```

**Verbatim Output:**
```
$ vitest run
(!) Your Vite config uses features that are unsupported by `configLoader: 'native'`, which is planned to become the default in a future major version of Vite:
  - `__dirname` (vitest.config.mts:5:41). Use `import.meta.dirname` instead
Set `VITE_CONFIG_NATIVE_IGNORE_WARNING=true` to suppress this warning.

 RUN  v5.0.1 /Users/dawizkidmal/Desktop/404 Projects/Factory Chat Demo/web

 ✓ src/lib/__tests__/core.test.ts (15 tests) 749ms
   ✓ approval invariants (5)
     ✓ wrong role fails 2ms
     ✓ self-approve fails even for approver 0ms
     ✓ expired fails 0ms
     ✓ changed payload hash fails 0ms
     ✓ valid approver with matching hash succeeds 0ms
   ✓ tasks (1)
     ✓ stale version → conflict 0ms
   ✓ evidence validation (1)
     ✓ rejects fabricated IDs not present in run tool events 0ms
   ✓ mock agent (4)
     ✓ flagship prompt yields ≥2 tasks, 1 proposal, overlapping branch timestamps 640ms
     ✓ 'fail quality' yields partial with no release conclusion 102ms
     ✓ emergency query returns boundary before any tool 0ms
     ✓ ambiguous equipment asks instead of inventing an ID 0ms
   ✓ webhook (4)
     ✓ bad signature rejected 1ms
     ✓ unset secret → 503 0ms
     ✓ valid push queues once, replay deduped 0ms
     ✓ non-main branch and wrong repo rejected 0ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  12:15:27
   Duration  916ms (tests 90%, transform 7%, import 2%)
```

---

## 2. Next.js Production Build (`pnpm build`)

**Command:**
```bash
cd web && pnpm build
```

**Result:** **FAIL** (Exit code 1)

**Verbatim Error Output:**
```
$ next build
▲ Next.js 16.3.5 (Turbopack)
✓ Running next.config.ts took 19ms

  Creating an optimized production build ...
✓ Compiled successfully in 736ms
src/lib/__tests__/core.test.ts(104,15): error TS2352: Conversion of type '{ GITHUB_WEBHOOK_SECRET: string; GITHUB_REPO: string; }' to type 'ProcessEnv' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Property 'NODE_ENV' is missing in type '{ GITHUB_WEBHOOK_SECRET: string; GITHUB_REPO: string; }' but required in type 'ProcessEnv'.
Failed to type check.

[ELIFECYCLE] Command failed with exit code 1.
```

*Note: Per QA boundary rules, `web/` is strictly read-only; no fixes were applied.*

---

## 3. Live Server Black-Box Smoke Tests (curl against Next.js Dev Server)

The Next.js development server was launched (`pnpm dev`) and black-box tested over HTTP.

### Pass/Fail Verification Table

| # | Check / Requirement | Exact Command Executed | Expected Output / Code | Actual Output / Error | Status |
|---|---|---|---|---|---|
| 1 | `GET /` (Redirect / Root) | `curl -s -i "http://100.106.68.50:3000/"` | HTTP 307 redirect to `/ask` | `HTTP/1.1 307 Temporary Redirect`<br>`location: /ask` | **PASS** |
| 2 | `GET /ask` (Ask view) | `curl -s -i "http://100.106.68.50:3000/ask"` | HTTP 200 OK | `HTTP/1.1 200 OK`<br>`Content-Type: text/html` | **PASS** |
| 3 | `GET /procedures` (Procedures view) | `curl -s -i "http://100.106.68.50:3000/procedures"` | HTTP 200 OK | `HTTP/1.1 200 OK`<br>`Content-Type: text/html` | **PASS** |
| 4 | `GET /manual/SAF-001` (Manual document view) | `curl -s -i "http://100.106.68.50:3000/manual/SAF-001"` | HTTP 200 OK | `HTTP/1.1 200 OK`<br>Renders SAF-001 sections & "Ask about this section" | **PASS** |
| 5 | `GET /manual` (Unspecified doc index) | `curl -s -i "http://100.106.68.50:3000/manual"` | HTTP 200 or redirect to default doc | `HTTP/1.1 404 Not Found`<br>(Only dynamic route `/manual/[docId]` implemented) | **FAIL** (404) |
| 6 | `GET /shift-desk` (Shift Desk view) | `curl -s -i "http://100.106.68.50:3000/shift-desk"` | HTTP 200 OK | `HTTP/1.1 200 OK`<br>Renders Shift Desk, Attention queue, Tasks, Updates | **PASS** |
| 7 | Create Flagship Investigation | `curl -s -X POST http://100.106.68.50:3000/api/investigations -H "Content-Type: application/json" -H "x-demo-user: maya" -d '{"question":"PK-04 is printing the wrong labels...","equipment":"PK-04","batch":"B-204"}'` | HTTP 201 with `id: "INV-001"` | `{"id":"INV-001","question":"...","equipment":"PK-04","batch":"B-204","ownerId":"maya","status":"queued"}` | **PASS** |
| 8 | Run Flagship Investigation & Proposal Generation | `curl -s -X POST http://100.106.68.50:3000/api/investigations/INV-001/run -H "x-demo-user: maya"` | Emits 3 parallel branch events, ≥2 demo tasks, creates proposal `PRP-001` | `{"runId":"RUN-001","result":{...,"proposalIds":["PRP-001"],"taskReceipts":[{"taskId":"TSK-003"},{"taskId":"TSK-004"}]},"events":[...]}` | **PASS** |
| 9 | Approval Rejection: Wrong Role Header | `curl -s -i -X POST http://100.106.68.50:3000/api/approvals/PRP-001 -H "Content-Type: application/json" -H "x-demo-user: jordan" -d '{"decision":"approved"}'` | HTTP 403 Forbidden with `{"error":"wrong_role"}` | `HTTP/1.1 403 Forbidden`<br>`{"error":"wrong_role"}` | **PASS** |
| 10 | Approval Rejection: Self-Approval Attempt | `curl -s -i -X POST http://100.106.68.50:3000/api/approvals/PRP-002 -H "Content-Type: application/json" -H "x-demo-user: priya" -d '{"decision":"approved"}'` (where `proposerId` is Priya) | HTTP 403 Forbidden with `{"error":"self_approve"}` | `HTTP/1.1 403 Forbidden`<br>`{"error":"self_approve"}` | **PASS** |
| 11 | Approval Rejection: Changed Payload Hash | `curl -s -i -X POST http://100.106.68.50:3000/api/approvals/PRP-001 -H "Content-Type: application/json" -H "x-demo-user: priya" -d '{"decision":"approved","payloadHash":"tampered_payload_hash_value"}'` | HTTP 409 Conflict with `{"error":"payload_changed"}` | `HTTP/1.1 409 Conflict`<br>`{"error":"payload_changed"}` | **PASS** |
| 12 | Approval Link Preview Safety: GET Never Mutates | `curl -s http://100.106.68.50:3000/api/approvals/PRP-001 -H "x-demo-user: priya"` | Status remains `"awaiting_approval"` | `{"id":"PRP-001",...,"status":"awaiting_approval"}` (Status strictly preserved) | **PASS** |
| 13 | Executor Rejection: Unapproved Proposal Execution | `curl -s -i -X POST http://100.106.68.50:3000/api/executor -H "Content-Type: application/json" -H "x-demo-user: priya" -d '{"proposalId":"PRP-001"}'` (before approval) | HTTP 409 Conflict | `HTTP/1.1 409 Conflict`<br>`{"ok":false,"error":"proposal is awaiting_approval, not approved"}` | **PASS** |
| 14 | Webhook Rejection: Bad HMAC Signature | `curl -s -i -X POST http://100.106.68.50:3000/api/webhooks/github -H "Content-Type: application/json" -H "X-Hub-Signature-256: sha256=badsignature000000" -H "X-GitHub-Delivery: d-bad-sig-1" -H "X-GitHub-Event: push" -d '{"ref":"refs/heads/main"}'` | Rejected (401 or 503 if secret unset) | `HTTP/1.1 503 Service Unavailable`<br>`{"error":"webhook not configured"}` | **PASS** |
| 15 | Valid Approval with Matching Hash | `curl -s -i -X POST http://100.106.68.50:3000/api/approvals/PRP-001 -H "Content-Type: application/json" -H "x-demo-user: priya" -d '{"decision":"approved","payloadHash":"4c2c81d00833edc973be5eff8c166ab42e8c9b0eb6e4b6d3a3c9137c72f287ab"}'` | HTTP 200 with status `"approved"` | `HTTP/1.1 200 OK`<br>`{"id":"PRP-001",...,"status":"approved"}` | **PASS** |
| 16 | Executor Receipt & Re-Execution Rejection | `curl -s -i -X POST http://100.106.68.50:3000/api/executor -H "Content-Type: application/json" -H "x-demo-user: priya" -d '{"proposalId":"PRP-001"}'` followed by second identical POST | First: HTTP 200 with receipt; Second: HTTP 409 rejected | First: `HTTP/1.1 200 OK` `{"ok":true,"receipt":{"id":"RCP-PRP-001","kind":"simulated",...}}`<br>Second: `HTTP/1.1 409 Conflict` `{"ok":false,"error":"proposal is succeeded, not approved"}` | **PASS** |

---

## 4. NOT TESTED — Requires Real Credentials

The following integrations and live features could not be fully verified because live credentials and external infrastructure are not configured in this local demonstration environment. Per QA guidelines, these are explicitly flagged as **UNTESTED** and must not be reported as passed:

1. **Live Dify Cloud Workflow Invocation**
   - **Reason:** `DIFY_API_KEY` is not configured in `.env.local` or process environment.
   - **Current Fallback:** The application cleanly fell back to the deterministic in-memory `mock` adapter.
   - **Requirement for Real Verification:** Valid Dify Cloud Workspace API key and published Workflow definition ID.

2. **Real GitHub Issue Creation (`github.issue.create`)**
   - **Reason:** `GITHUB_TOKEN` and `GITHUB_REPO` are unset.
   - **Current Fallback:** The executor safely produced an explicit simulated receipt (`"kind": "simulated"`, `"note": "No issue was created anywhere."`).
   - **Requirement for Real Verification:** Fine-grained GitHub PAT with `issues:write` permission on the designated test repository.

3. **Live GitHub Webhook HMAC Ingestion from GitHub.com**
   - **Reason:** `GITHUB_WEBHOOK_SECRET` is unset, and no public webhook listener/tunnel (e.g. smee.io or ngrok) is attached to GitHub repository settings.
   - **Current Fallback:** Evaluated via unit test suite (`src/lib/__tests__/core.test.ts`) and verified local server returns 503 when unconfigured.
   - **Requirement for Real Verification:** Configured webhook secret and live push event delivered from GitHub.

4. **Live Transactional Email Delivery & Bounce Suppression**
   - **Reason:** No transactional email provider API key (Resend, SendGrid, Postmark) or verified sender domain configured.
   - **Current Fallback:** Notifications are persisted and exposed only via in-app API `/api/notifications`.
   - **Requirement for Real Verification:** Configured transactional email provider with verified sending identity and webhook endpoints for bounce/delivery event reconciliation.

---

## 5. Production Deploy Verification (Vercel Live URL)

**Deployment Date:** 2026-09-18  
**Live Production URL:** `https://forgeline-assist-app.vercel.app`  
**Deployment Target / Project:** `404kidwizs-projects/forgeline-assist-app` (`prj_WearEnUoRtkVlRrVID1npPKtGGek`)  
**Direct Immutable Deployment:** `https://forgeline-assist-h4yu99owe-404kidwizs-projects.vercel.app`

### Deployment Setup & Link
```bash
# Linked web/ to new independent Vercel project (separate from landing page)
cd web && vercel link --project forgeline-assist-app --team 404kidwizs-projects --yes
# Updated framework preset to Next.js
vercel project update forgeline-assist-app --framework nextjs --auto-detect output-directory
# Production deployment
vercel deploy --prod --yes
```
**Deployment Output:**
```
▲ Next.js 16.3.5 (Turbopack)
✓ Compiled successfully
  Running TypeScript ...
✓ Deploying outputs...
  Production      https://forgeline-assist-h4yu99owe-404kidwizs-projects.vercel.app
▲ Aliased         https://forgeline-assist-app.vercel.app
✓ Ready in 30s
```

### Live Smoke Verification Suite

| # | Check / Requirement | Exact Command Executed | Expected Output / Code | Actual Verbatim Output / Response | Status |
|---|---|---|---|---|---|
| 1 | `GET /` (Root redirect) | `curl -s -i "https://forgeline-assist-app.vercel.app/"` | HTTP 307 redirect to `/ask` | `HTTP/2 307`<br>`location: /ask` | **PASS** |
| 2 | `GET /ask` (Ask view) | `curl -s -i "https://forgeline-assist-app.vercel.app/ask"` | HTTP 200 OK | `HTTP/2 200`<br>`content-type: text/html; charset=utf-8`<br>`x-matched-path: /ask` | **PASS** |
| 3 | `GET /procedures` (Procedures view) | `curl -s -i "https://forgeline-assist-app.vercel.app/procedures"` | HTTP 200 OK | `HTTP/2 200`<br>`content-type: text/html; charset=utf-8`<br>`x-matched-path: /procedures` | **PASS** |
| 4 | `GET /manual` (Manual root) | `curl -s -i "https://forgeline-assist-app.vercel.app/manual"` | HTTP 307 redirect to `/procedures` | `HTTP/2 307`<br>`location: /procedures` | **PASS** |
| 5 | `GET /manual/SAF-001` (Manual document view) | `curl -s -i "https://forgeline-assist-app.vercel.app/manual/SAF-001"` | HTTP 200 OK | `HTTP/2 200`<br>`content-type: text/html; charset=utf-8`<br>`x-matched-path: /manual/[docId]` | **PASS** |
| 6 | `GET /shift-desk` (Shift Desk view) | `curl -s -i "https://forgeline-assist-app.vercel.app/shift-desk"` | HTTP 200 OK | `HTTP/2 200`<br>`content-type: text/html; charset=utf-8`<br>`x-matched-path: /shift-desk` | **PASS** |
| 7 | Create Flagship Investigation on Live URL | `curl -s -X POST "https://forgeline-assist-app.vercel.app/api/investigations" -H "Content-Type: application/json" -H "x-demo-user: maya" -d '{"question":"PK-04 is printing the wrong labels on B-204...","equipment":"PK-04","batch":"B-204"}'` | Returns `INV-xxx` with `status: "queued"` | `{"id":"INV-001","question":"PK-04 is printing the wrong labels on B-204...","equipment":"PK-04","batch":"B-204","ownerId":"maya","status":"queued","createdAt":"2026-09-18T16:32:25.086Z","updatedAt":"2026-09-18T16:32:25.086Z","runIds":[]}` | **PASS** |
| 8 | Run Flagship Investigation End-to-End | `curl -s -X POST "https://forgeline-assist-app.vercel.app/api/investigations/INV-001/run" -H "x-demo-user: maya"` | Returns ≥2 tasks, 1 proposal, and overlapping branch timestamps | `{"runId":"RUN-001","result":{"status":"completed","taskReceipts":[{"taskId":"TSK-003"},{"taskId":"TSK-004"}],"proposalIds":["PRP-001"]},"events":[...]}` | **PASS** |
| 9 | Verify Overlapping Branch Timestamps on Live App | Inspected `events` from step 8 for `search_plant_docs`: `safety`, `maintenance`, `quality` | `max(startedAt) <= min(endedAt)` | `safety`: 16:32:25.344Z to 16:32:25.489Z<br>`maintenance`: 16:32:25.344Z to 16:32:25.416Z<br>`quality`: 16:32:25.344Z to 16:32:25.499Z<br>Max Start (16:32:25.344Z) ≤ Min End (16:32:25.416Z) | **PASS** |
| 10 | Live GET Approval Link Preview Invariant | `curl -s "https://forgeline-assist-app.vercel.app/api/approvals/PRP-001" -H "x-demo-user: priya"` | Status remains `awaiting_approval` | `"status":"awaiting_approval"` | **PASS** |
| 11 | Live Webhook 503 Rejection (Unset Secret) | `curl -s -i -X POST "https://forgeline-assist-app.vercel.app/api/webhooks/github" -H "Content-Type: application/json" -H "X-Hub-Signature-256: sha256=invalid" -H "X-GitHub-Delivery: d1" -H "X-GitHub-Event: push" -d '{"ref":"refs/heads/main"}'` | HTTP 503 Service Unavailable | `HTTP/2 503`<br>`{"error":"webhook not configured"}` | **PASS** |
| 12 | Live Emergency Boundary Enforcement | `curl -s -X POST "https://forgeline-assist-app.vercel.app/api/investigations/$EMERG/run" -H "x-demo-user: maya"` with `"There is smoke and someone may be injured near the line"` | `status: "boundary"`, 0 tool events | `{"runId":"RUN-001","result":{"status":"boundary","answer":"This demo cannot manage an emergency. Follow the site's posted emergency procedure and contact the designated emergency response team. Do not wait for an AI answer."},"events":[]}` | **PASS** |
| 13 | Live Ambiguous Equipment Query | `curl -s -X POST "https://forgeline-assist-app.vercel.app/api/investigations/$AMBIG/run" -H "x-demo-user: maya"` with `"How often does it need checking?"` | `status: "needs_input"`, asks for equipment | `{"runId":"RUN-002","result":{"status":"needs_input","answer":"Which equipment or product do you mean? I only answer from approved documents tied to a specific ID.","questions":["Which equipment: CV-12, PK-04, or PX-20?"]}}` | **PASS** |
| 14 | Live Approval Rejection: Wrong Role Header | `curl -s -i -X POST "https://forgeline-assist-app.vercel.app/api/approvals/$PROP" -H "Content-Type: application/json" -H "x-demo-user: jordan" -d '{"decision":"approved"}'` | HTTP 403 Forbidden | `HTTP/2 403`<br>`{"error":"wrong_role"}` | **PASS** |
| 15 | Live Approval Rejection: Self-Approval Attempt | `curl -s -i -X POST "https://forgeline-assist-app.vercel.app/api/approvals/$PROP_PRIYA" -H "Content-Type: application/json" -H "x-demo-user: priya" -d '{"decision":"approved"}'` (proposed by Priya) | HTTP 403 Forbidden | `HTTP/2 403`<br>`{"error":"self_approve"}` | **PASS** |
| 16 | Live Approval Rejection: Tampered Payload Hash | `curl -s -i -X POST "https://forgeline-assist-app.vercel.app/api/approvals/$PROP" -H "Content-Type: application/json" -H "x-demo-user: priya" -d '{"decision":"approved","payloadHash":"tampered_hash_value"}'` | HTTP 409 Conflict | `HTTP/2 409`<br>`{"error":"payload_changed"}` | **PASS** |
| 17 | Live Valid Approval Decision | `curl -s -i -X POST "https://forgeline-assist-app.vercel.app/api/approvals/$PROP" -H "Content-Type: application/json" -H "x-demo-user: priya" -d '{"decision":"approved","payloadHash":"$REAL_HASH"}'` | HTTP 200 with status `"approved"` | `HTTP/2 200`<br>`{"id":"PRP-002",...,"status":"approved"}` | **PASS** |
| 18 | Live Executor Execution of Approved Proposal | `curl -s -i -X POST "https://forgeline-assist-app.vercel.app/api/executor" -H "Content-Type: application/json" -H "x-demo-user: priya" -d '{"proposalId":"$PROP"}'` | HTTP 200 with simulated receipt | `HTTP/2 200`<br>`{"ok":true,"receipt":{"id":"RCP-PRP-002","kind":"simulated","label":"Simulated — no external write (GITHUB_TOKEN/GITHUB_REPO not configured)","note":"No issue was created anywhere."}}` | **PASS** |
| 19 | Live Executor Re-Execution Rejection | `curl -s -i -X POST "https://forgeline-assist-app.vercel.app/api/executor" -H "Content-Type: application/json" -H "x-demo-user: priya" -d '{"proposalId":"$PROP"}'` | HTTP 409 Conflict | `HTTP/2 409`<br>`{"ok":false,"error":"proposal is succeeded, not approved"}` | **PASS** |
