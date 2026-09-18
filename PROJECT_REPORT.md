# Factory Chat Demo — detailed planning and handoff report

Prepared: 2026-09-18. Working product name: ForgeLine Assist.

## 1. Delivery outcome

All three existing project planning files were moved from the 404-technologies workspace into `/Users/dawizkidmal/Desktop/404 Projects/Factory Chat Demo/tasks`. The destination was empty before the move. Each copied file was compared with its original using SHA-256 before the original was removed. The current plan was then updated to identify the new project root and link to this report. The archived reference and checklist retained their transferred contents.

This delivery is a self-contained planning package. It is not a built application, a configured Dify agent or a deployed demonstration. No unrelated marketing-site files were moved. No GitHub repository or Vercel project was created.

## 2. File inventory

| Path | Contents and authority |
|---|---|
| DESIGN.md | Current SchoolAI-inspired visual and interaction specification |
| assets/design-reference/schoolai-mobbin.png | Unmodified user-supplied visual reference; not a production asset |
| README.md | Package navigation, status and intended hosting arrangement |
| PROJECT_SUMMARY.md | Compact continuity record and next setup inputs |
| PROJECT_REPORT.md | This detailed report |
| tasks/plan.md | Authoritative central-agent architecture and full agreed scope |
| tasks/todo.md | Ordered build stages, dependencies and acceptance criteria |
| tasks/plan-v1-reference.md | Historical initial plan with reusable fictional corpus and baseline evaluation cases |

No package manifest, lockfile, environment file, application code, database migration, workflow export or build output exists yet. Future implementation files belong within this root. The proposed remote repository name, forgeline-assist, is not an existing verified repository.

## 3. Requirements confirmed through clarification

| Decision | Confirmed direction |
|---|---|
| Framework | Dify, using the previously provided langgenius/dify project |
| Interface | Combine all four directions into one agent workspace |
| Agent authority | Investigate/draft, manage fictional tasks, execute approved real-system actions |
| Concurrency | Parallel evidence gathering, multiple investigations and proactive monitoring |
| First real integration | Dedicated GitHub Issues test repository |
| Monitored source | Fictional documents in the dedicated GitHub repository |
| Notifications | In-app plus email |
| Source/deployment path | GitHub, then eventual Vercel interface deployment |
| Time constraint | One-hour limit removed in favor of fuller scope |
| Local location | Factory Chat Demo folder named by the user |

The current work remains planning-only. Choosing product capabilities does not mean those capabilities have been configured or exercised.

## 4. User experience and design references

Design addendum, 2026-09-18: [DESIGN.md](DESIGN.md) now supplies the implementation-ready frontend contract. The user-selected [SchoolAI home](https://mobbin.com/screens/8f1c26d3-5f7a-4a37-96cf-abacae6803f0) is the primary visual reference; the four references below inform task patterns within that shell. The design specifies tokens, responsive geometry, all four views, source provenance, exact-action approval, failure/recovery states, notifications, component responsibilities and acceptance scenarios. A related SchoolAI conversation was retrieved and inspected with Mobbin MCP; it is explicitly distinguished from the user-supplied image. Six materially relevant design/frontend/accessibility skills were applied selectively, with conflicts resolved in favor of the user reference and operational needs. See DESIGN.md section 12 for the mapping.

The four views share investigation, equipment/batch, conversation, evidence, task and approval state.

- **Ask:** central conversation, coordinated investigation and supported follow-ups. Reference: [Dropbox Dash on Mobbin](https://mobbin.com/screens/fc54be30-29ff-430c-9554-7858c47373e8).
- **Procedures:** approved-document search and filtering by domain, equipment and revision. Reference: [Zendesk on Mobbin](https://mobbin.com/screens/f509f55c-98e7-4a4e-9e5e-f6ff7cc515d6).
- **Manual:** exact source section beside contextual questions. Reference: [Fabric on Mobbin](https://mobbin.com/screens/61d7d915-b6d3-4f7b-8544-ed2701fdce96).
- **Shift Desk:** investigations, tasks, document changes, handovers and pending approvals. Reference: [ClickUp on Mobbin](https://mobbin.com/screens/1ce8a341-0753-4b7c-bbb6-5aed549f3084).

These references were retrieved and visually inspected using Mobbin MCP in the original planning work. They are not original mockups or an implemented interface. The design proposal uses readable neutral surfaces, restrained semantic color, explicit document revisions and responsive source panels.

## 5. Architecture and rationale

The proposed interface/API is Next.js on Vercel. Postgres stores users, investigations, jobs, evidence versions, tasks, approvals and notification state. A persistent worker coordinates Dify runs, monitoring and approved connector execution. Dify supplies the central agent and retrieval workflows. It is hosted separately, with Dify Cloud proposed for initial convenience.

One central agent definition can be instantiated for separate cases. Shared identity does not mean shared conversation across supervisors. Independent lookups and investigations can run concurrently; dependent operations and conflicting record updates are ordered.

The revised plan uses Dify Workflow executions and stores conversational context in the application because those runs do not retain conversation state themselves. Tools expose narrow operations and return structured evidence. Approval and external execution occur outside model discretion. These are engineering proposals, not features automatically installed by importing a template. [Dify Workflow API](https://docs.dify.ai/en/api-reference/guides/workflow), [Agent node](https://docs.dify.ai/en/cloud/use-dify/nodes/agent).

The background worker and database add infrastructure compared with a simple chat demonstration. They are justified by the requested restart recovery, concurrent work, persistent tasks and unattended monitoring. A browser session or ordinary request-bound function cannot serve as the entire durable execution system.

## 6. Planned capabilities and evidence of completion

| Capability | What must exist before claiming it works |
|---|---|
| Adaptive investigation | Real tool logs show the agent choosing a needed follow-up based on a prior result |
| Cross-domain answers | Relevant current evidence from every necessary domain, or an explicit missing-domain state |
| Source inspection | Exact returned document/revision/section opens from the answer |
| Demo task management | Persisted task IDs, permitted updates and audit records |
| Approved GitHub action | Exact payload approval plus actual returned issue number/URL |
| Multiple investigations | Separate user/case contexts and correct concurrent results |
| Source monitoring | Verified source event, successful staged ingestion, approved activation and update record |
| In-app/email delivery | Notification record and distinct provider acceptance/delivery/failure state |
| Recovery | Interrupted work resumes or becomes explicitly uncertain without blind duplicate writes |

The agent will not control machinery, authorize restart/product release or dispatch emergency responders. These actions are outside the selected demonstration tools.

## 7. Fictional data prepared in the specification

Company: ForgeLine Components. Plant: FL-01. Equipment: CV-12 conveyor and PK-04 packing station. Product: PX-20 spacer kits.

The preserved reference contains actual proposed seed text for six documents: SAF-001 guarding/intervention, SAF-002 reporting/emergency boundaries, MNT-001 conveyor maintenance, MNT-002 packing-station service requests, QLT-001 dimensional inspection, and QLT-002 hold/release authority. An older QLT-001 revision deliberately differs from the current sampling interval.

The v2 plan adds a fictional shift snapshot, label-mismatch observation, E17 observation, revision-change event, supervisor/approver roles and task/action fixtures. These are specifications awaiting conversion into individual source/fixture files and indexing. They are not measurements, real personnel or operational instructions for a real facility.

## 8. Approval, monitoring and email design

Real issue creation/update is reviewed in the application. The approval binds to the exact repository, fields, proposal version, actor and evidence. Material changes invalidate approval. Only the connector executor holds credentials. A timeout after submission is reconciled before retrying because the external operation might already have succeeded.

GitHub document changes are restricted to approved paths/branch and verified signed events. Ingestion stages the new revision and tests retrieval before activation. Failed ingestion retains previous usable content with a stale/update-failed indication. Events are deduplicated; unchanged checks produce no alert. [GitHub webhook validation](https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries).

Email uses a verified sender and a persistent outbox. Approval emails link to authenticated review; a GET request or email preview cannot approve or execute an action. Sender, provider, recipients and test scope must be established during implementation. No outbound messages have been sent.

## 9. Implementation stages and estimate

| Stage | Planning estimate | Completion gate |
|---|---|---|
| Foundation/contracts | 2–3 hours | Authenticated case and real Dify run with reloadable state |
| Evidence and central agent | 3–5 hours | Grounded cross-domain answer, adaptive tool choice and exact sources |
| Four views and demo tasks | 4–6 hours | Shared context and actual persisted task receipts |
| Durable execution/GitHub approval | 4–7 hours | Recovery, permission checks, approved connector receipt and duplicate prevention |
| Monitoring/email/evaluation/handoff | 5–9 hours | Controlled source update, notifications and all required checks |

Total: **18–30 focused engineering hours**, provisionally spread over 3–5 working days. This is an estimate, not a guarantee. It assumes ready accounts, provider access and ordinary integrations. Initial access checks may change it. A smaller read-only slice can be shown earlier, but would not fulfill the entire scope. Actual Vercel go-live remains a subsequent authorized step.

## 10. Remaining setup inputs

1. An instruction to begin implementation; the current boundary is planning-only.
2. GitHub owner/repository identity and access to the dedicated test repository.
3. Dify workspace/hosting selection and working chat/embedding model access with quota.
4. Database, worker-hosting and authentication-provider choices/access.
5. Email provider, verified sender and agreed test recipients.
6. Named approver role, document-approval process and configured notification policy.
7. Eventual Vercel project/account and production-release timing.

No secret values should be pasted into project documents or chat. Configure them through the selected providers' secure environment/credential mechanisms during implementation.

## 11. Risks and planned responses

| Risk | Planned response |
|---|---|
| Agent returns believable unsupported guidance | Evidence validation, exact revisions, missing-evidence states and adversarial evaluation |
| Tool results lose citation metadata | Explicit structured provenance contract and real API round-trip test |
| A required domain fails | Mark answer partial and block unsupported conclusions |
| Duplicate GitHub write after timeout/retry | Operation records, provider mechanisms where available and reconciliation |
| New document is indexed incorrectly | Stage/check before activation; preserve last usable revision |
| Concurrent users share state | Server-enforced identity/case scope and cross-session tests |
| Worker stops mid-job | Leased jobs, heartbeats, recovery and uncertain-outcome handling |
| Notification noise or duplicate sends | Meaningful-change policy, deduplication, bounded retry and delivery tracking |
| Setup consumes estimated build time | Verify access first and revise estimate using observed constraints |

## 12. Verification and limits

Completed for this file handoff: destination inspected as empty; three copied source files compared byte-for-byte using SHA-256 before originals were removed; only the named planning originals removed; current plan updated for the new location. The initial handoff verified six Markdown files. The design addition brings the package to seven Markdown files and one PNG reference. The PNG was verified unchanged against the supplied original using SHA-256. Seven specified color pairs were calculated; this is design-token evidence, not rendered accessibility proof. Local Markdown links were checked after the design additions.

Earlier research verified documented Dify/GitHub capabilities and inspected Mobbin references. It did not prove a working agent. No model execution, retrieval indexing, application build, runtime tests, browser acceptance, authenticated connector test, email delivery or deployed smoke test has run. The application does not yet exist, so application build/test commands are not applicable to this documentation handoff.

The baseline plan contains 15 question/failure cases; v2 adds adaptive tool use, concurrent users, approvals, source injection, recovery, version activation and notification replay. These remain pending acceptance work.

## 13. Skills and working method

This handoff used documentation-and-adrs to record decisions, status and verification without implying implementation. Prior planning used planning-and-task-breakdown, idea-refine and minimalist-ui; Mobbin MCP supplied inspected interface references. The Dify CLI skill was reviewed earlier but not executed. No subagents were needed for this file organization/report task.
