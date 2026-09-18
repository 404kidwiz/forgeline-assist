# ForgeLine Assist — demo slice

Fictional plant-supervisor workspace (ForgeLine Components, plant FL-01). Next.js app router + TypeScript, plain CSS with DESIGN.md tokens. **Fictional demo — not for operational use.**

## Run

```bash
pnpm install
pnpm dev        # http://localhost:3000 → redirects to /ask
pnpm test       # vitest (approval invariants, task versioning, evidence validation, mock agent, webhook)
pnpm build
```

Try the flagship prompt on `/ask` (first suggestion): it runs three parallel domain searches, follows a cross-reference, creates two demo tasks, drafts a handover and proposes a GitHub issue. Switch the demo user to **Priya (approver)** in the sidebar footer to approve it at `/approvals/PRP-001`. Add `fail quality` to any question to force a failed branch and a partial result.

## Env vars (`.env.example`)

| Var | Effect when set |
|---|---|
| `DIFY_API_KEY`, `DIFY_BASE_URL` | Agent adapter switches from the mock to `POST {DIFY_BASE_URL}/v1/workflows/run` (blocking, stateless; case context and server-retrieved approved chunks passed as `inputs`). Expected outputs: `answer`, `evidenceIds`, `questions`. |
| `GITHUB_TOKEN`, `GITHUB_REPO` | Executor creates a real issue via GitHub REST after approval; receipt labelled “Real GitHub action · test repository” with real repo/number/URL. |
| `GITHUB_WEBHOOK_SECRET` | Enables `/api/webhooks/github` (HMAC over raw body, main-branch pushes to `knowledge/**.md` only, delivery-id dedupe). Unset → 503. |

Keys are server-only. Nothing is `NEXT_PUBLIC_`.

## What is mocked vs real

| Mocked / simulated | Real |
|---|---|
| Agent reasoning (`src/lib/agent/mock.ts`, deterministic) — but tool events, timestamps, evidence and budgets are real | Approval policy (role, self-approve, expiry, payload hash) enforced server-side |
| Storage: in-memory singleton (`src/lib/store.ts`) — resets on restart / per serverless instance | GitHub issue creation and webhook verification when env is set |
| Identity: `x-demo-user` header / `demo_user` cookie — not authentication | Optimistic task versioning (409 on stale) |
| Executor without GitHub env: receipt says “Simulated — no external write”; no fake URL | Evidence-ID validation against the run’s own tool events |
| Activity timeline polls the store every 150 ms instead of SSE | Emergency boundary returns before any tool call |

Shortcuts are marked `// ponytail:` in source.

## Vercel

Import the `web/` directory as the project root. Set the env vars above as server variables. The in-memory store does not persist across serverless invocations or instances — a demo run may span instances and lose state; swap `store.ts` for Postgres before any shared deployment. Dify must be reachable from Vercel (Dify Cloud or a public host), not localhost.
