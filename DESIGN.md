# ForgeLine Assist — interface design specification

Version 1 • 2026-09-18 • Planning artifact, not an implemented or accessibility-certified interface.

Companion to the [central-agent implementation plan](tasks/plan.md). That plan governs capabilities, architecture and action authority. This file governs visual design, navigation and interaction behavior. It supersedes earlier generic visual suggestions. The user-selected SchoolAI reference supplies the primary visual direction; the four earlier references supply useful task patterns within one shared shell.

## 1. Design intent

A supervisor should be able to ask a question, inspect the exact approved source, and understand what the agent has done or still needs. The first screen feels approachable and quiet. Working screens prioritize legible evidence, stable context and explicit action status.

Use **a light conversational workspace with editorial typography**: warm neutral canvas, charcoal copy, a restrained blue accent, a serif welcome, a generous white composer, flat suggestion rows and a right context panel. Keep the same visual language across Ask, Procedures, Manual and Shift Desk. These are connected views of one product, not four competing themes.

The fictional company is ForgeLine Manufacturing; the working product name is ForgeLine Assist. Keep “Fictional demo” visible in the shell. A live GitHub integration may coexist with fictional plant information: label external writes separately as “Real GitHub action · test repository.” Do not imply that a demo badge means all effects are simulated.

## 2. Reference and adaptation

Primary reference: [SchoolAI home supplied by the user](https://mobbin.com/screens/8f1c26d3-5f7a-4a37-96cf-abacae6803f0). The supplied image was visually inspected and copied unchanged to [the local reference](assets/design-reference/schoolai-mobbin.png). It is reference material, not a shipped application asset or original ForgeLine mockup. The school branding, educational labels and Mobbin attribution footer are not product elements.

A Mobbin MCP search also returned [a SchoolAI conversation screen](https://mobbin.com/screens/ff04823f-fea5-4d3f-a79c-e025290250c3), which was visually inspected. It supports a constrained reading column and persistent composer. It is a different screen from the supplied home reference; its dark theme and voice control are not adopted.

| Before: reference pattern | After: manufacturing application | Reason |
|---|---|---|
| Centered “Hi, Alex.” | “Good morning, Maya.” with “What needs your attention on the floor?” | Welcoming start without obscuring the task |
| Pastel sphere and diffuse background | Small static abstract mark; faint blue/sage wash only on empty Ask | Retain warmth with limited distraction |
| Left education navigation | Ask, Procedures, Manual, Shift Desk; account/settings at bottom | Preserve a predictable workspace |
| Files, Standards, PowerUps | Equipment, Batch, Sources | Controls correspond to approved capabilities |
| Generic prompt ideas | Four realistic questions tied to seeded documents | Make the first successful task obvious |
| Empty chat history rail | Recent investigations initially; Sources/Activity during a case | Put useful context beside the task |
| Pale send control | Strong blue Send with accessible focus/contrast | Improve legibility and action recognition |
| Broad privacy reassurance | “Answers use fictional approved documents. Open sources to verify.” | Avoid unsupported privacy promises |

Supporting references remain [Dropbox Dash](https://mobbin.com/screens/fc54be30-29ff-430c-9554-7858c47373e8) for cited conversation, [Zendesk](https://mobbin.com/screens/f509f55c-98e7-4a4e-9e5e-f6ff7cc515d6) for source discovery, [Fabric](https://mobbin.com/screens/61d7d915-b6d3-4f7b-8544-ed2701fdce96) for contextual reading, and [ClickUp](https://mobbin.com/screens/1ce8a341-0753-4b7c-bbb6-5aed549f3084) for work status. These were inspected during the earlier planning pass.

## 3. Information architecture and shared context

| View | Primary job | Main content | Right panel |
|---|---|---|---|
| Ask | Investigate a question | Welcome/composer or active conversation | Recent investigations, then Sources or Activity |
| Procedures | Find approved documentation | Search, domain/equipment filters, document rows | Selected document preview |
| Manual | Read the exact evidence | Document title, revision, section and full text | Ask about this section, tied to current case |
| Shift Desk | Follow work and changes | Attention queue, investigations, tasks and updates | Selected item details or action review |

Navigation order stays fixed. Shift Desk uses a labelled count for pending attention, not an undifferentiated red dot. A count of zero does not display a badge. The top bar carries plant FL-01, shift, current equipment/batch context, notifications and “New investigation.” User and role appear in the sidebar footer. Only Owner/Admin sees integration and corpus settings; server authorization remains authoritative.

Case identity persists across views. Opening a citation does not start another investigation. Switching cases changes all associated evidence, draft actions and context together. Changing equipment during an existing case creates an explicit context change and requires a new run; it never silently relabels previous answers. A new investigation starts empty; offer an explicit “Use current equipment” choice.

Proposed shareable routes: `/ask`, `/investigations/{id}`, `/procedures`, `/manual/{documentId}?revision={id}&section={id}`, `/shift-desk`, `/approvals/{id}`. Preserve filters in the URL where useful. Deep links require authentication and plant/case authorization. Unauthorized links show a safe access message, not source excerpts.

## 4. Layout contract

At 1440px wide, use a 232px sidebar, flexible main pane and optional 320px right panel. With both side panes open, main content gets 888px before its 32px horizontal gutters. Conversation copy maxes at 72 characters; the welcome composer maxes at 760px. At 1920px, let outer whitespace grow rather than expanding text indefinitely.

| Viewport | Navigation | Main pane | Context/evidence |
|---|---|---|---|
| 1280px and up | 232px sidebar; optional 72px collapsed mode | 32px gutters, fluid height | 320px rail; can close |
| 768–1279px | 72px rail with labels on focus/hover; expanded navigation as overlay | 24px gutters | Overlay drawer, never a squeezed third column |
| 320–767px | Header menu plus four labelled bottom destinations | 16px gutters | Full-screen source/detail view with Back |

Use a 64px desktop header and 56px phone header, with content allowed to grow under text zoom. Mobile navigation is at least 64px plus safe-area inset. Mobile composer sits above it and respects the software keyboard. Use dynamic viewport sizing; avoid a rigid screen height that clips content. At 320px, toolbar actions wrap and context is a labelled summary button rather than three compressed chips.

Ask welcome uses top spacing between 48 and 112px depending on viewport height; it is not vertically centered in a fixed-height box. Short screens prioritize the prompt over decorative space. Once submitted, replace the welcome with a case header and readable conversation; pin the composer to the bottom of the available main pane. The right rail has a clear title and close control. It is non-modal on desktop and modal as an overlay on tablet; opening desktop evidence preserves conversation focus until the user chooses to read it.

Only the active main pane and an open desktop source rail need independent scrolling. Phone screens use one primary scroll area. Sticky headers/composers must not cover focused elements or the last message. Returning from a source restores message and document scroll positions.

## 5. Visual tokens

Values below are deliberate project choices, not measured pixel extractions from the screenshot. Start light-only. Dark mode is a later design task rather than an unverified inversion.

| Token | Value | Use |
|---|---|---|
| canvas | `#F7F8F6` | App background |
| surface | `#FFFFFF` | Composer, dialogs, document page |
| surface-subtle | `#EEF1EE` | Hover, selected row backdrop |
| ink | `#252928` | Main text |
| muted | `#5B6460` | Metadata and helper text |
| divider | `#DDE2DE` | Nonessential layout separators |
| control-border | `#7C8580` | Necessary input boundaries |
| accent / focus | `#285CC4` | Primary action, links, focus outline |
| accent-soft | `#EAF0FC` | Selected navigation |
| success ink / fill | `#276344` / `#EAF4ED` | Confirmed completion |
| warning ink / fill | `#805414` / `#FFF3DA` | Partial evidence, approval needed |
| danger ink / fill | `#A32D36` / `#FCEEF0` | Failed operation or source conflict |

Calculated solid-color contrast: ink/canvas 13.82:1; muted/canvas 5.74:1; accent/white 6.14:1; success pair 6.32:1; warning pair 5.97:1; danger pair 6.24:1; control-border/white 3.80:1. These checks cover these pairs only, not rendered interface compliance. Decorative dividers must not be the sole cue identifying a control. Never lower text opacity to create disabled or muted text without checking the resulting pair.

Typography: Geist Sans for interface and answers; Newsreader for the welcome greeting only; Geist Mono for equipment identifiers and compact technical values when useful. Use system sans/Georgia/monospace fallbacks and verify font availability/licensing during implementation. Do not introduce proprietary fonts from the reference.

| Role | Size / line height | Weight |
|---|---|---|
| Welcome | 44/50px desktop; 32/38px phone | Serif 400 |
| Page title | 28/36px | Sans 600 |
| Section title | 20/28px | Sans 600 |
| Answer/procedure text | 16/26px | Sans 400 |
| Navigation/control | 15/22px | Sans 500 |
| Metadata | 14/20px | Sans 400 |
| Compact badge | 12/18px | Sans 600; never sole important instruction |

Use sentence case, balanced short headings, wrapping long filenames and URLs, and tabular numerals for changing counts/timers. Avoid uppercase paragraphs and thin body weights.

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px. Controls have at least 44×44px hit areas, 48px for primary touch actions, and at least 8px between adjacent compact targets. Rows are normally at least 56px high and grow with content.

Radii: 8px for nav selections; 10px for inputs/buttons; 12px for task/evidence containers; 16px for dialogs; 28px desktop / 20px phone for the welcome composer. Only small badges and the 48px send button are circular/pill shaped. Use concentric radii when closely nesting surfaces. Composer gets one soft shadow, approximately 0 12px 32px rgba(37,41,40,0.06); ordinary document rows are flat.

Choose one consistent icon family, proposed Phosphor regular at 20px with explicit labels. Use stronger weight for selected navigation if needed. No emoji status codes, decorative factory photography, charts with invented live readings, animated avatar or 3D renderer. The faint welcome wash stays behind the composer, never behind evidence, text fields or approval content.

## 6. Screen specifications

### Ask — welcome and conversation

Welcome fixture: “Good morning, Maya.” followed by “What needs your attention on the floor?” Greeting reflects actual user/time when connected; fall back to “How can I help with this shift?” rather than inventing a name. Maya Chen is a proposed fictional supervisor fixture.

Visible composer label: “Ask ForgeLine.” Placeholder: “Ask about safety, maintenance or quality…” Toolbar: Equipment, Batch, Sources; show selected values and clear controls. Sources defaults to “Approved sources” and permits narrowing by domain without claiming a forced category is adequate. The agent can identify a related domain and explain why additional evidence is needed.

Suggested rows fill the composer without submitting immediately:

- “What does E17 mean for conveyor CV-12?”
- “How often should we inspect PX-20 dimensions?”
- “Compare the old and current quality sampling intervals.”
- “Draft a maintenance task for the CV-12 observation.”

No microphone, arbitrary file upload or PowerUps button in this scope. Reference affordances do not create new capabilities. Enter submits when not composing an IME character; Shift+Enter adds a line; on touch, Send is explicit. Preserve unsent text per investigation. Disable duplicate submission for the same pending request and identify the reason. A new independent case remains available while another runs.

Answers lead with the supported conclusion, then relevant evidence and next steps. Place claim-linked source links next to operational assertions. Each source label includes document ID, revision and section, for example “QLT-001 · v3 · Sampling.” A “View sources” control opens full metadata/excerpts. Separate missing information and proposals from supported facts. No fabricated confidence percentages or “Verified” badge inferred from fluent text.

Show concise observed activity such as “Searching maintenance documents” and “Reading MNT-001 v4.” This is tool status, not hidden reasoning. Three parallel branches can appear as labelled compact rows; do not animate a fictitious sequence. Keep streaming content readable, announce milestones rather than every token, and stop auto-scroll if the reader scrolls upward. Offer “Jump to latest.”

### Procedures — discover approved sources

Search field, domain filters (All, Safety, Maintenance, Quality), equipment filter and revision visibility. Default to active approved revisions. Results are flat rows containing title, ID, revision, equipment, effective date and approval status. Search empty state suggests clearing filters. A request failure is not “No results.”

Selecting a row previews it; “Open manual” opens the complete document with the same case context. Archived documents are behind an explicit “Include archived” option and carry a persistent Archived label. An archived result cannot silently become the source for a current operational answer.

### Manual — read and compare

Header: document title, ID/version, current/archived status, effective date and source link pinned to the recorded commit. Body: readable headings, anchored sections, exact excerpt highlight and complete surrounding text. A selected citation opens its recorded revision, not whatever happens to be current today.

The contextual assistant is scoped visibly: “Asking about MNT-001 v4 · CV-12.” Other necessary domain evidence remains discoverable and identified. At narrower widths, use Document/Conversation tabs and preserve both positions. If entered without a case, “Ask about this section” opens an explicit new case with the source attached.

Version comparison shows old/new labels, commit/revision identifiers and textual change markers; color alone is insufficient. For QLT-001, demonstrate archived 120-minute and current 60-minute sampling. If a source has changed since an answer, retain its snapshot and show “A newer revision is available” with “Recheck answer.” Failed ingestion must not make a staged revision appear current.

### Shift Desk — work, updates and approvals

Order the default view by actionable attention: pending approvals, failed/unknown external outcomes, source conflicts, then active investigations and routine updates. Provide labelled filters for Investigations, Tasks and Updates. Use a list/table on desktop and labelled stacked rows on phone. No dashboard metric unless it derives from persisted records.

An investigation row shows question, equipment/batch, owner, run state, last update and attention needed. A task row shows task ID, title, assignee, due date, state and origin case. Fictional app tasks show “Demo task.” An external issue shows GitHub/test-repository label and actual returned URL. Editing task fields saves explicitly with a pending state and a recoverable error; stale edits prompt refresh/merge rather than overwriting others.

An update includes what changed, affected document/equipment, previous/current revision, ingestion state and “Review change.” “Read” and “Acknowledged” are separate where acknowledgment is required. Email state belongs to notification delivery, not to the document's approval status.

### Action review — exact external effect

Open from a case or Shift Desk into a dedicated review panel/page. Show action type, configured repository owner/name, issue number for updates, exact title/body/labels, proposed changes, reason, evidence and proposing user. Before configuration, display “Test repository not connected”; never invent a destination or working approval button.

Show the action proposal version, approval expiry and authorizing role. Primary label is “Approve GitHub issue creation” or “Approve GitHub issue update,” not “Continue.” Provide Reject and Return to investigation. An authorized approver explicitly submits approval; this dispatches execution once through the server policy. A supervisor without the role sees “Awaiting authorized approver,” not a hidden route to execute.

Editing a proposal invalidates prior approval and returns it to review. On execution, show “Creating issue…” then a persisted receipt with actual issue URL/time. On uncertain timeout, show “Outcome unknown — checking GitHub”; do not offer blind retry. On failure, show the reason and a safe next action. Revocation or expiry disables execution with explanatory copy. Email links open this authenticated review, and merely opening the link never approves.

## 7. State and feedback contract

Run state, evidence completeness, task state and external-action state are separate fields. A completed answer may still have an action awaiting approval. Successful email delivery is not supervisor acknowledgment.

| Situation | What the user sees | Available recovery |
|---|---|---|
| Initial loading | Stable skeleton, labelled loading region | Wait; retry only after failure |
| Queued/running | Queue/run status and actual tool milestones | Open another case; request cancellation |
| Partial evidence | “Maintenance evidence found; safety source unavailable” | Inspect available evidence; retry missing read |
| Needs input | One specific equipment/batch question | Submit answer within same case |
| No supporting source | “I couldn't find an approved source for this” | Adjust question or open Procedures |
| Conflicting sources | Both source identities and conflict explanation | Request document-owner review |
| Run failed | Plain reason, retained question, run reference | Retry as a new run, keep prior history |
| Connection lost | “Connection lost. Reconnecting to investigation…” | Reload persisted status; don't claim worker stopped |
| Cancellation requested | Pending cancellation status | Await server acknowledgment; retain completed effects |
| Source stale/sync failed | Last successful sync and affected source | Read clearly labelled prior revision; owner retries sync |
| Approval expired/changed | “Review required again” | Open the new exact payload |
| External outcome unknown | Reconciliation status | Inspect details; no duplicate create action |
| Email failed | In-app notification remains, delivery error separate | Owner retries via delivery workflow |
| Access denied | Safe explanation and return action | Sign in with authorized account |

Toasts may confirm reversible local actions, but important failures, approvals and receipts remain inline and in case history. Do not optimistically mark GitHub writes, approvals or monitoring activation successful.

## 8. Notifications and email experience

Notification center uses the same event IDs/state as Shift Desk. Categories: action needs review, source changed, investigation needs input, integration failure. Marking an alert read does not approve its action. Routine unchanged monitor checks are silent; duplicate events do not create duplicate badges.

Proposed email subject: “ForgeLine demo: review a maintenance issue for CV-12.” Body contains a short event summary, fictional-data notice and “Review in ForgeLine” link. Use actual configured recipients and sender only during implementation. Avoid copying entire source documents into email. Link expiry/sign-in failures explain how to return through the app. “Queued,” “Sent” and “Delivered” depend on actual provider evidence; opening is not equivalent to acknowledgment. No email has been sent in this design task.

## 9. Accessibility, responsive behavior and motion

Target WCAG 2.2 AA; this document is not a certification. Normal text needs at least 4.5:1 contrast and large text 3:1. [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

The project chooses 44px minimum interactive targets and 48px primary touch controls. These exceed the WCAG 2.2 AA 24px minimum target criterion, which has defined exceptions; do not mislabel 44px as the AA minimum. [W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

Use semantic landmarks, a skip-to-main link, one page heading, actual buttons and links, labelled inputs and visible text labels where practical. Selection uses text/icon cues as well as color. Focus is a 3px accent outline with 2px offset, visible on all surfaces and never clipped by sticky regions. Tabs support the expected arrow-key pattern; Escape closes temporary overlays.

Modal drawers/dialogs trap focus, make the background inert, have a visible close action, and restore focus to the invoking control. Initial focus for lengthy action review goes to its heading, not the approval button. [W3C modal-dialog guidance](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

Use polite live announcements for run milestones, completion and pending approval. Reserve assertive announcements for immediate errors. Do not steal focus for background updates. Source links have meaningful accessible names, not bare “[1]”. Citations, tooltips and controls work without hover. When evidence opens as a phone page, focus its heading; Back restores focus to the source link.

Support text zoom, 320px reflow, long user names, long equipment identifiers, keyboard-only operation and forced-color modes. Maintain a readable document when decoration disappears. Localize dates with visible timezone where ambiguity matters. Validate on a real touch device before claiming floor usability; glove support is not established by target dimensions alone.

Motion is restrained: 120ms control feedback, 180ms panel fade/slide with at most 8px translation, no animation delaying access to content. Use interruptible transitions for actual state changes, explicitly naming transformed/opacity properties. No pulsing orb, scroll choreography, magnetic buttons, staggered evidence paragraphs or essential animated status. Reduced-motion mode removes translation and nonessential animation. Avoid broad backdrop blur, heavy shadows and a new animation dependency just for polish.

## 10. Frontend handoff and implementation sequence

Build the shell once. Proposed component responsibilities:

| Component | Responsibility |
|---|---|
| WorkspaceShell / PrimaryNavigation | Responsive frame, plant/demo context, view navigation |
| InvestigationHeader / ContextSelector | Case identity and explicit equipment/batch scope |
| QuestionComposer / SuggestedQuestionList | Accessible input, pending state, realistic entry points |
| AnswerMessage / CitationLink / EvidencePanel | Supported claims and exact source inspection |
| RunActivity / InvestigationList | Observable milestones and concurrent case status |
| ProcedureSearch / DocumentReader / RevisionComparison | Discovery, reading and changes |
| TaskList / TaskEditor | Persisted fictional task operations |
| ActionReview / ActionReceipt | Exact approval payload and confirmed external result |
| NotificationCenter / DeliveryStatus | Event attention and separate delivery lifecycle |

Use URL state for shareable view/filter selection, local state for transient panels and unsent drafts, and server state for cases/runs/tasks/approvals. Authentication/plant scope comes from the server. Dify and connector keys never enter the browser. A stream reconnect refreshes authoritative status; client-side timers do not manufacture completion. Sanitize rendered model/document content and limit links to allowed schemes. Do not expose internal prompts or hidden reasoning.

Implementation order, within the existing stages:

1. Establish tokens, shell, navigation, mobile layout and component states using named fictional fixtures.
2. Implement Ask welcome and one investigation with exact citations; prove source navigation and restoration.
3. Implement Procedures and Manual; prove archived/current behavior and version comparison.
4. Implement Shift Desk, durable run state and task editing; exercise concurrent case isolation.
5. Implement exact action review, receipt and failure/unknown states against the test repository.
6. Implement update/notification surfaces and provider-backed email statuses.
7. Complete accessibility, responsive and visual acceptance using the scenario matrix below.

This spec refines the prior 4–6-hour UI workstream; it does not prove that estimate. Approval edge cases and accessibility verification may require more time. Re-estimate after the evidence round-trip and first responsive shell. The overall 18–30 focused-hour estimate remains provisional. No additional theme variants, voice, arbitrary attachments, charts or 3D features are added.

## 11. Demonstration and acceptance matrix

All rows below are future tests, not completed claims. Capture desktop and phone evidence of the finished interface when implementation exists.

| Scenario | Acceptance condition |
|---|---|
| Empty Ask at 1440×900 | Greeting, composer and useful suggestions visible; source reference recognizable without copied branding |
| CV-12 E17 question | Correct case/equipment; MNT-001 v4 citation opens exact section; no reset authorization invented |
| PX-20 quality question | QLT-001 v3 evidence; 60-minute interval distinguished from archived 120-minute revision |
| Multi-domain question | Relevant source domains identified; partial branch failure visible; supported conclusions distinguished |
| Three concurrent cases | Separate questions, drafts, evidence and run states; no cross-case leakage |
| Procedure search | Domain/equipment filters persist; loading, empty and failed search are distinct |
| Source changes mid-case | Historical answer preserved; newer revision notice offers recheck |
| Demo task save/reload | Persisted task ID visible after refresh; failed save does not claim success |
| GitHub create/update review | Exact repository/payload/diff visible; unauthorized or stale approval blocked server-side |
| GitHub timeout/replay | Unknown state reconciles; no duplicate issue or premature success |
| Monitor/email failure | Last good source remains identifiable; in-app event survives email failure |
| 320/390/768/1024/1440px layouts | No page-level horizontal overflow; no clipped controls, evidence or approval actions |
| Mobile keyboard/zoom | Composer, Send and focused input remain reachable; no bottom-nav obstruction |
| Keyboard and screen reader | Complete ask→source→review journey; correct names, order, announcements and restored focus |
| Reduced motion/forced colors | No essential info disappears; statuses remain understandable |
| Long content and refresh | Long titles wrap; draft/context behavior intentional; persisted work recovers |

Automated checks later should cover contrast/semantic violations, route access, approval state transitions and meaningful integration failures. Manual checks must include keyboard navigation, VoiceOver or NVDA, text zoom and real-device touch. A screenshot review or automated accessibility scan alone is insufficient.

## 12. Skill synthesis and deliberate choices

The available catalog was reviewed for material relevance. “All available frontend UI/UX skills” is applied as comprehensive coverage of the task, not simultaneous adoption of contradictory visual systems or unrelated graphics workflows.

| Skill read and applied | Contribution here |
|---|---|
| design-taste-frontend | Concrete hierarchy, context-specific content, complete states and responsive constraints |
| minimalist-ui | Warm neutral palette, editorial welcome, restrained semantic accents and flat document rows |
| make-interfaces-feel-better, including typography/surfaces/animations/performance references | Typographic wrapping, tabular counts, concentric radii, optical consistency, target sizing and interruptible feedback |
| frontend-ui-engineering | Component responsibilities, state ownership, accessible controls and responsive verification |
| accessibility-wcag | Keyboard/focus semantics, labelled forms, contrast and assistive-technology acceptance |
| high-end-visual-design | Selective refinement of soft surfaces, typographic contrast and performance-conscious decoration |

The gpt-taste skill was read and considered, but its marketing/cinematic approach was not applied to this operational workspace. Shader, 3D, GSAP storytelling, image-generation and image-to-code workflows do not materially help this Markdown-only deliverable and were not executed.

Generic skill directives conflict in several places. The user-selected reference and product task take precedence: retain the centered welcome and serif greeting; allow one faint static wash and the larger composer radius; use restrained blue; keep functional borders; show operational content immediately. Do not apply mandatory scroll reveals, randomized layouts, exaggerated whitespace, all-card double bezels or heavyweight animation. Apply normal 44–48px interaction targets rather than ultra-small aesthetic controls. These are deliberate design decisions, not unnoticed inconsistencies.

## 13. Evidence and remaining decisions

Completed for this design delivery: inspected supplied screenshot, inspected one related Mobbin MCP result, read the applied skills, verified selected W3C guidance, calculated seven specified color pairs, copied the reference without alteration, and wrote the design contract. File/link validation is recorded in the project report.

Not completed: Figma mockups, interactive prototype, browser rendering, assistive-technology testing, font/package setup, Dify runs, live integrations or deployment. Existing provider/repository/approver setup questions remain in the implementation plan. The design can proceed using the defaults above; no new aesthetic decision is required to make it buildable.
