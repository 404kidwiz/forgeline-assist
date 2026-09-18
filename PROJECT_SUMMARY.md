# Project summary — Factory Chat Demo

Updated: 2026-09-18. Product working name: ForgeLine Assist.

## Latest delivery — demo web app deployment (2026-09-18)

The Next.js demonstration application (`web/`) is now deployed and verified live on Vercel as an independent project at https://forgeline-assist-app.vercel.app. See [qa/qa-report.md](qa/qa-report.md) for live verification results. All four interface views (`/ask`, `/procedures`, `/manual`, `/shift-desk`) and core boundary invariants are live and functional. Dify model calls, real GitHub Issue writes, and transactional email remain fully simulated and mocked in this release pending real credentials; plan.md stages 4 and 5 are not complete.

## Previous delivery — landing page

The user authorized implementation and Vercel deployment of the generated landing mockup. `landing/` now contains the deployed static site at https://forgeline-assist.vercel.app. See [LANDING_REPORT.md](LANDING_REPORT.md). The existing in-progress `web/` app was preserved and excluded from this deployment. The landing preview does not call Dify or execute GitHub actions. Earlier planning-only statements below describe the prior milestone, not the current landing-page authorization.

## Earlier planning status

Planning package complete and relocated to the user-selected project root. No application code, Git initialization, model calls, indexing, integrations, monitoring or deployment performed. Current authority remains planning-only. The latest request adds a SchoolAI-inspired DESIGN.md using relevant frontend/UI/UX skills; it does not authorize application implementation.

## Confirmed requirements

- Dify is the agent framework; one central definition with isolated concurrent investigations.
- Combine Ask, Procedures, Manual and Shift Desk in one workspace.
- Answer from current safety, maintenance and quality documentation with inspectable sources.
- Create/update fictional tasks; real GitHub issue writes require exact-action approval.
- Monitor fictional documents in the dedicated GitHub repository.
- Deliver notifications in the application and through email.
- GitHub source control and eventual Vercel interface deployment.
- Original one-hour constraint removed; provisional full-demo estimate is 18–30 focused hours.

## Proposed architecture

Next.js interface/API; authenticated roles; Postgres case/job/approval records; durable worker; central Dify Workflow with bounded Agent tools; deterministic approved-action executor. Dify Workflow runs are stateless, so application state supplies scoped conversation/case context. Dify Cloud is proposed, not confirmed. Database/worker/email providers remain unselected.

## Artifacts

The [design contract](DESIGN.md) and [local visual reference](assets/design-reference/schoolai-mobbin.png) now accompany the authoritative [plan](tasks/plan.md), [checklist](tasks/todo.md), [detailed report](PROJECT_REPORT.md), and preserved [mock corpus/reference](tasks/plan-v1-reference.md). Six current document specifications, one archived revision and 15 baseline cases remain in the reference; v2 adds agent, concurrency, approval, monitoring and recovery acceptance tests.

## Next setup inputs

Implementation instruction; GitHub owner/name/access; Dify workspace and chat/embedding access; database/worker hosting; verified email sender/provider and test recipients; designated approver and document approval rule. Do not ask for secret values in chat.

## Important boundaries

All future project files stay in this folder. No plant machinery control, bypass instructions, restart/product-release authorization or emergency dispatch. Email review links do not execute actions. No success without a persisted or external receipt. Staged documents are not active until ingestion and approval checks pass.
