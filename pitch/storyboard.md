# ForgeLine Assist — 90-second demo storyboard

Companion to [video-script.md](video-script.md). Maps its 8 voiceover beats to 16 shots.

**No footage exists yet.** This is a screen-recording demo, not live-action — every shot below is a planned UI state derived from [../DESIGN.md](../DESIGN.md) screen specifications and the fixtures in [../tasks/plan.md](../tasks/plan.md), not a description of an existing recording. Actual capture requires the ForgeLine Assist web app to be built and running first (see Production notes).

## Shots

**1 — 0:00–0:04**
Visual: Shift Desk queue, cold open. A single attention row is in frame: "OBS-001 · PK-04 label mismatch · Batch B-204 · reported 10:15." The persistent "Fictional demo" badge is visible in the shell header.
Camera/motion: Static hold, slow 5% zoom-in on the row.
VO: "PK-04 just printed the wrong label on batch B-204."

**2 — 0:04–0:08**
Visual: Hard cut to the Ask view, empty composer. Top bar shows plant/context: "FL-01 · Shift 08:00–16:00" with equipment chip "PK-04" pre-selected.
Camera/motion: Hard cut, no motion.
VO: "Maintenance, quality, and safety all need answers — right now."

**3 — 0:08–0:13**
Visual: Sidebar navigation rail with four items — Ask, Procedures, Manual, Shift Desk — each briefly highlighted in sequence.
Camera/motion: Slow pan left-to-right across the nav rail.
VO: "This is ForgeLine Assist: one agentic workspace for plant supervisors, built around Ask, Procedures, Manual, and Shift Desk."

**4 — 0:13–0:18**
Visual: Back on the Ask composer. Text appears as if typed live: "PK-04 is printing the wrong labels on B-204. Check maintenance, quality and safety requirements; create the demo follow-up tasks; draft the handover; and prepare an issue for my approval." Send control highlighted.
Camera/motion: Slow push-in on the composer as the text completes.
VO: "Maya just asks, in her own words."

**5 — 0:18–0:24**
Visual: Activity timeline appears below the question — three labelled parallel rows: "Searching maintenance documents," "Searching quality documents," "Searching safety documents," with overlapping progress states (not an animated fiction — timestamps genuinely overlap).
Camera/motion: Cut in, then slow vertical scroll as rows populate.
VO: "Watch it think out loud. The agent searches maintenance, quality, and safety documentation in parallel, live in the activity feed —"

**6 — 0:24–0:30**
Visual: Rows update to "Reading MNT-001 v4," "Reading QLT-001 v3," "Reading SAF-002 v2," each landing a checkmark at nearly the same timestamp.
Camera/motion: Zoom-in on the row timestamps to make the overlap legible.
VO: "— every step visible, nothing hidden."

**7 — 0:30–0:37**
Visual: Cut to the rendered answer in the conversation, with inline source chips beside each claim: "MNT-001 · v4 · Inspection," "QLT-001 · v3 · Sampling."
Camera/motion: Cut, then slow scroll down the answer.
VO: "The answer comes back grounded in the exact approved source — document, revision, section."

**8 — 0:37–0:44**
Visual: Maya clicks a source chip; the Manual view opens showing the exact document page, a revision banner ("QLT-001 · v3 · current · effective 2026-09-01"), and the highlighted excerpt in full surrounding context.
Camera/motion: Cut to Manual view, brief pan down the excerpt.
VO: "Maya opens the citation herself and reads the real page before she trusts a word of it."

**9 — 0:44–0:49**
Visual: Cut to Shift Desk. A new row animates in: "Demo task · Recheck PK-04 print head · Owner: Maya," carrying the "Demo task" label.
Camera/motion: Cut, quick zoom on the new row.
VO: "ForgeLine Assist creates the follow-up tasks right there,"

**10 — 0:49–0:54**
Visual: A "Draft handover" panel opens showing a structured summary — what changed, evidence used, open items.
Camera/motion: Cut, slow pan across the draft text.
VO: "and drafts the shift handover — so the next supervisor isn't starting from zero."

**11 — 0:54–1:00**
Visual: Action-review screen opens: header "Approve GitHub issue creation," target label "Real GitHub action · test repository," exact issue title/body text, Reject and Return-to-investigation controls visible.
Camera/motion: Cut, push-in on the header label.
VO: "When it's time to touch a real system, it drafts a GitHub issue — but never sends it."

**12 — 1:00–1:06**
Visual: Cursor clicks "Approve GitHub issue creation." Status changes to "Creating issue…," then settles on a receipt: "Issue #— created · [returned URL] · [time]."
Camera/motion: Cut, hold on the receipt.
VO: "Maya reviews the exact text and gives the one approval that fires it."

**13 — 1:06–1:12**
Visual: Two-up callout card fades in over a dimmed Shift Desk background: "Human approval required" and "Emergency response excluded by design," each with a check mark.
Camera/motion: Static card, fade-in only.
VO: "That approval step, and a hard line it won't cross in an emergency, are the design, not an afterthought."

**14 — 1:12–1:18**
Visual: Shift Desk "Updates" row: "QLT-001 revision 2 → 3 · Review change," with a notification bell and a small "In-app + email" label beside it.
Camera/motion: Cut, slight zoom on the bell icon.
VO: "When a source changes, ForgeLine Assist notices — and alerts her, in-app and by email."

**15 — 1:18–1:24**
Visual: Wide shot of the full Shift Desk queue — demo tasks, the approved issue, and the update all visible together — with the "Fictional demo — ForgeLine Manufacturing" badge legible in the shell header.
Camera/motion: Slow zoom-out to reveal the full screen.
VO: "ForgeLine Manufacturing is a fictional plant — built to prove a real workflow."

**16 — 1:24–1:30**
Visual: Static end card — ForgeLine Assist wordmark, tagline "Ask. Investigate. Approve." and a CTA line, "Let's bring it to your floor."
Camera/motion: Cut to end card, gentle fade.
VO: "ForgeLine Assist: ask, investigate, approve. Let's bring it to your floor."

## Production notes

Script and storyboard only — no video file, screen recording, TTS audio or edited clip was produced in this task.

- **Screen capture (later):** This session has an in-app browser (the Browser pane / `mcp__Claude_Browser__*` tools) that can open the built ForgeLine Assist web app and capture draft screen-recording footage or screenshots once it exists — it cannot record a UI that hasn't been implemented yet. A separate browser-automation tool in this environment also exposes explicit `browser_start_recording` / `browser_stop_recording` calls if a lower-level capture is preferred.
- **Voice narration / TTS:** This environment has access to voice-generation tools (e.g., voice-cloning/TTS services surfaced through the connected media MCPs). None of them should be called to produce narration audio without the user's explicit go-ahead in chat, since that dispatches to an external service.
- **Video assembly/export:** Assembling the captured clips with the VO track, adding on-screen text overlays, and exporting a final video file would use a video-generation/editing tool available in this environment. As with TTS, this also requires the user's explicit go-ahead before any external service is invoked — it was not done here.
- **Sequencing:** build the app screens the storyboard depends on (Ask composer, activity timeline, source card/Manual view, Shift Desk queue, approval screen) before attempting real capture; recording against a partially built app will not match the shots above.
