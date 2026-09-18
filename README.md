# ForgeLine Assist

> **The plant supervisor's workspace that answers from approved documents and acts only with human approval.**  
> A full-stack agentic assistant demo for safety, maintenance, and quality on the manufacturing floor.

---

## Recruiter & Reviewer Quick Links

| Resource | Live Link | Repository Path |
|---|---|---|
| 📊 **Investor & Architecture Pitch Deck** | **[Launch Interactive Deck (GitHub Pages)](https://404kidwiz.github.io/forgeline-assist/__deck/)** | [`__deck/`](__deck/) |
| 🌐 **Live Web Application (Vercel)** | **[Open Live App (`forgeline-assist-app.vercel.app`)](https://forgeline-assist-app.vercel.app)** | [`web/`](web/) |
| 📄 **Product Landing Page (Vercel)** | **[Open Landing Page (`forgeline-assist.vercel.app`)](https://forgeline-assist.vercel.app)** | [`landing/`](landing/) |
| 🧪 **QA Verification & Smoke Test Report** | **[View Verification Report](qa/qa-report.md)** (31 tests passed) | [`qa/qa-report.md`](qa/qa-report.md) |
| 🎥 **90-Second Demo Video Script** | **[Read Video Script](pitch/video-script.md)** | [`pitch/video-script.md`](pitch/video-script.md) |
| 🎬 **Companion Visual Storyboard** | **[Read Storyboard](pitch/storyboard.md)** | [`pitch/storyboard.md`](pitch/storyboard.md) |

---

## Project Overview

ForgeLine Assist solves three core operational problems on the plant floor:
1. **Time lost searching for procedures**: Answers are grounded in versioned, approved plant documents (safety, maintenance, quality) with exact document, revision, and section citations.
2. **Stale paper revisions in circulation**: An automated monitoring loop detects approved revisions, stages/indexes them, and notifies supervisors via in-app and email digests.
3. **Untracked verbal handovers**: Follow-up tasks are created within the workspace, shift handovers are drafted automatically, and external integrations (e.g. GitHub Issues) require explicit supervisor review and cryptographic payload-hash approval before execution.

---

## The Four Connected Views

- **Ask (`/ask`)**: Natural-language incident investigation with parallel document searches, step-by-step reasoning feed, and cited answers.
- **Procedures (`/procedures`)**: Full-text search and filtering across the approved six-document plant corpus with live revision tags.
- **Manual (`/manual/[docId]`)**: Side-by-side exact document inspection with section-level "Ask about this section" investigation triggers.
- **Shift Desk (`/shift-desk`)**: Attention queue for active incidents, assigned demo follow-up tasks, document revision update notices, and the action approval inbox.

---

## Technical Stack & Architecture

- **Web Frontend & API**: Next.js 16 (App Router), TypeScript, Vanilla CSS design tokens following [`DESIGN.md`](DESIGN.md).
- **Test Suite**: Vitest automated invariant suite (15 unit/integration tests verifying approval hashes, stale versions, evidence validation, role boundaries, and webhook HMAC verification).
- **Deployment**:
  - Web App: Deployed on Vercel at `https://forgeline-assist-app.vercel.app`.
  - Landing Page: Deployed on Vercel at `https://forgeline-assist.vercel.app`.
  - Pitch Deck: GitHub Pages & Static assets at `https://404kidwiz.github.io/forgeline-assist/__deck/`.
- **Integrations**:
  - Dify Cloud agent runtime adapter (with deterministic mock fallback).
  - External Action Executor (simulated receipts and real GitHub Issues target).
  - GitHub Webhook push listener with SHA-256 HMAC signature verification and replay deduplication.

---

## Key Project Documentation

- [`DESIGN.md`](DESIGN.md) — Comprehensive visual design system tokens, layout contracts, component hierarchy, and acceptance criteria.
- [`tasks/plan.md`](tasks/plan.md) — Authoritative v2 implementation plan and system specification.
- [`PROJECT_REPORT.md`](PROJECT_REPORT.md) — In-depth architectural decisions, risk register, and milestone record.
- [`LANDING_REPORT.md`](LANDING_REPORT.md) — Landing page deployment verification and design audit.
- [`qa/smoke-test-plan.md`](qa/smoke-test-plan.md) & [`qa/qa-report.md`](qa/qa-report.md) — Comprehensive smoke test plan and 31-point live verification report.
