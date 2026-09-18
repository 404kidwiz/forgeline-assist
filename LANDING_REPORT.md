# Landing page delivery

Implemented the generated landing-page composition in `landing/` using semantic HTML, CSS, local fonts and a small interaction script. Existing work in `web/` was preserved and is not included in this deployment.

Production URL: https://forgeline-assist.vercel.app

This is a branded Vercel subdomain, not a separately purchased custom domain. No domain purchase or DNS changes were made. Deployment is scoped to `landing/`; planning documents and unfinished APIs are not published. The landing page is a close coded reproduction, not a pixel-identical raster copy. Fonts, individual icons and responsive reflow differ from the generated image.

## Delivered

- Hero, navigation, subtle background wash, three-column workspace preview, source card, process sections and footer.
- Working anchors, native accessible dialogs for documentation/source/equipment/notifications, answer copy and local feedback.
- Mobile reflow and reduced-motion support.
- Clear preview boundary when submitting a question. Dify inference and GitHub actions are not connected to this landing page.
- Stable Vercel production project: `forgeline-assist` in `404kidwizs-projects`.

## Verification

Public HTTP and rendered browser checks; desktop/mobile screenshots; source dialog and Escape; documentation; question submission boundary; local/remote asset byte comparisons. Final detailed result is in `qa/landing-live-verification.json`. Screenshots are `qa/landing-live-1086.png` and `qa/landing-live-390.png`. Browser emulation does not establish real-device or complete screen-reader acceptance.

## Development and deployment

Serve `landing/` with any static server. Example from project root: `python3 -m http.server 4173 --directory landing`.

From `landing/`, redeploy using `vercel deploy --prod --scope 404kidwizs-projects`. Vercel linkage is local in `.vercel/` and ignored by Git. No GitHub push was performed in this task. The existing `web/` app can later replace the landing deployment when its own readiness checks pass.

## Skills

- image-to-code: translated the already generated, user-approved visual reference. No new design generation was needed.
- deployments-cicd: scoped Vercel production deployment and public verification.
