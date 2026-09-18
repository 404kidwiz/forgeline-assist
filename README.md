# Factory Chat Demo

ForgeLine Assist is the working product name for a fictional manufacturing supervisor assistant built around Dify. Its planned workspace combines Ask, Procedures, Manual and Shift Desk, with cited answers, concurrent investigations, persisted demo tasks, approved GitHub Issues actions, document monitoring, and in-app/email notifications.

**Current status: planning package only. No application is implemented or running.**

## Read this package

| File | Purpose |
|---|---|
| [DESIGN.md](DESIGN.md) | SchoolAI-inspired visual system, four-view UX, component/state contracts and acceptance criteria |
| [PROJECT_REPORT.md](PROJECT_REPORT.md) | Detailed delivery report, decisions, architecture, risks, estimates and verification status |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Compact project state for the next work session |
| [tasks/plan.md](tasks/plan.md) | Current v2 implementation plan; authoritative scope |
| [tasks/todo.md](tasks/todo.md) | Ordered implementation checklist and acceptance gates |
| [tasks/plan-v1-reference.md](tasks/plan-v1-reference.md) | Superseded initial plan; preserved fictional source content and original 15 evaluation cases |

The v1 architecture and one-hour estimate are historical. The current plan combines all four views and includes background execution and approved actions. Use v2 for scope and architecture; use DESIGN.md for the current visual and interaction contract.

## Local workspace

`/Users/dawizkidmal/Desktop/404 Projects/Factory Chat Demo`

All future project files belong inside this folder. No Git repository, dependencies, environment file, API keys or runtime commands have been initialized. There is no installation or start command yet.

## Intended deployment

Dedicated GitHub repository → eventual Vercel Next.js interface/API, with Dify and a persistent worker/database on appropriate separate services. GitHub also holds the fictional source documents and provides the approved issue integration. Hosting providers and email sender remain setup choices.

## Next milestone

Begin the foundation stage only when implementation is requested: verify accounts, establish identity and persistent case/run state, and prove a real Dify tool/evidence round-trip. Planning approval and runtime proof are distinct; no checks in the implementation checklist are marked complete.
