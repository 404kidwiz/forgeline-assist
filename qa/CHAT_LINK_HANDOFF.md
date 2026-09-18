# Chat-link handoff for parallel agents

Scope: landing/index.html CTA hrefs and new landing/chat/ files only. Existing web/ application code was read but not modified. No shared root planning documents updated in this pass.

Both View demo and Explore the demo navigate to /chat/ on the landing deployment. This separate static chat is a temporary, explicitly labelled deterministic document-search demo. It quotes a snapshot of web/src/lib/fixtures.ts, supports source inspection, new conversations and browser-local history. It is not the Dify runtime and must not be described as live AI. Unsupported questions receive an explicit limitation message; external writes are unavailable.

When the app team deploys the real workspace, replace the two CTA hrefs in landing/index.html with that workspace URL (or route /chat/ to it). The standalone files do not need to be merged into web/. Keep the existing landing design intact.

Local verification: View demo navigation, E17 question, source dialog, Escape, history after reload, no page errors, no horizontal overflow at 320/390/768px. Screenshots: chat-desktop.png and chat-mobile.png. Public checks recorded separately in chat-live-verification.json.
