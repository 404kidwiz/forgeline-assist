# ForgeLine Assist — Investor & Recruiter Pitch Deck

Welcome to the presentation deck for **ForgeLine Assist**, an agentic workspace designed for manufacturing plant supervisors to investigate incidents across approved documents, draft follow-up work, and safely execute approved external actions.

---

## Quick Links

- 📊 **[Open Live Interactive Deck (GitHub Pages)](https://404kidwiz.github.io/forgeline-assist/__deck/)**
- 📊 **[Alternative Live Deck (Vercel App)](https://forgeline-assist-app.vercel.app/__deck/)**
- 🌐 **[Live Web Application](https://forgeline-assist-app.vercel.app)**
- 📄 **[Product Landing Page](https://forgeline-assist.vercel.app)**
- 🧪 **[Full QA Verification & Smoke Report](../qa/qa-report.md)**
- 🎥 **[90-Second Demo Video Script](../pitch/video-script.md)**
- 🎬 **[Companion Storyboard](../pitch/storyboard.md)**

---

## Deck Overview (12 Slides)

1. **Title**: The plant supervisor's workspace that answers from approved documents and acts only with your approval.
2. **Problem**: Shift supervisors hunting across disconnected silos, stale paper revisions, and untracked verbal handovers.
3. **Why Now**: Production-ready agentic tool-calling with deterministic guardrails and versioned Git-backed procedures.
4. **Product**: 4 unified views around a shared investigation object (**Ask**, **Procedures**, **Manual**, and **Shift Desk**).
5. **Live Demo**: Flagship scenario — *PK-04 printing wrong labels on batch B-204* (live production captures from the deployed Vercel app).
6. **How It Works**: End-to-end architecture diagram: browser → Next.js API → Postgres/worker → Dify agent workflow → bounded tools, paired with an out-of-model approval executor and webhook monitoring loop.
7. **Trust & Safety**: Core invariants: exact-action approval, cryptographic payload hashing, provenance checking, and hard emergency boundaries.
8. **Keeping Current**: Document change lifecycle (CHG-001) — revision staging, smoke checking, promotion, and honest email notifications.
9. **Go-to-Market**: Initial target, pilot structure, and transparent boundary disclosures.
10. **Roadmap**: 18–30 hour milestone progression from foundation to verified live production deployment and plant pilots.
11. **Team & Ask**: Transparent seed-stage disclosures and funding objectives.
12. **Closing**: Contact, demo access links, and final summary.

---

## Local Viewing

To view the deck locally on your machine, simply open [`index.html`](index.html) or [`deck.html`](deck.html) in any standard web browser:

```bash
# macOS
open __deck/index.html

# Linux
xdg-open __deck/index.html

# Windows
start __deck/index.html
```

### Deck Navigation Controls
- `→` / `Space` / `PageDown` / Click right side: Advance slide
- `←` / `PageUp` / Click left side: Previous slide
- `Home` / `End`: Jump to first / last slide
- `F`: Toggle fullscreen presentation mode
- **Touch / Mobile**: Horizontal swipe left/right to navigate slides
