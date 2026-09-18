# Dify workflow — design notes, not a verified export

Status: unexecuted design artifact. No Dify workspace has been created or
tested against this. Read [tasks/plan.md](../tasks/plan.md)'s "Tool contracts"
and "Agent instructions and result validation" sections first — this file is
the operational checklist for actually building what that plan describes.

## Honest gap this file does not close

[`tools-openapi.yaml`](tools-openapi.yaml) describes seven tool endpoints
(`/api/tools/search_plant_docs`, etc.) shaped after the real functions in
[`web/src/lib/agent/tools.ts`](../web/src/lib/agent/tools.ts). **Those HTTP
routes do not exist yet.** Today the app calls those functions in-process —
directly from `web/src/lib/agent/mock.ts`, and `web/src/lib/agent/dify.ts` does
its own server-side pre-retrieval before ever calling out to Dify (so Dify
can't cite an evidence ID the app didn't already fetch). Before this OpenAPI
schema can actually be imported as a Dify custom tool, someone needs to add
thin `app/api/tools/*/route.ts` wrappers around those same functions. That's a
real, small implementation task, not a config step — do not treat importing
the YAML as sufficient on its own.

## What a real setup pass needs, in order

1. **Workspace and model.** Create a Dify workspace (Cloud or self-hosted).
   Confirm which model backs function-calling — the plan requires the
   *classic* Agent node specifically, because the newer Agent node has
   different availability/API constraints per Dify's own docs
   ([docs.dify.ai/en/cloud/use-dify/nodes/agent](https://docs.dify.ai/en/cloud/use-dify/nodes/agent)).
   Verify the classic node is available in the actual instance before
   committing to it.
2. **Tool routes.** Implement the four API-route wrappers described above,
   then import `tools-openapi.yaml` as a Custom Tool (Workspace → Tools →
   Custom → Import from schema), pointed at the deployed app's real origin.
3. **Workflow graph.** One Workflow containing: input node (question +
   scoped case context, since the Workflow API is stateless per
   [docs.dify.ai/en/api-reference/guides/workflow](https://docs.dify.ai/en/api-reference/guides/workflow))
   → classic Agent node with the seven tools attached → output node returning
   the structured result shape in `web/src/lib/agent/types.ts` (status,
   answer, evidenceIds, missingChecks, questions, taskReceipts, proposalIds).
   `search_plant_docs` should be modeled as three parallel branches (safety /
   maintenance / quality) joined before the Agent continues, per the plan's
   "Orchestration" reference
   ([docs.dify.ai/en/cloud/use-dify/build/orchestrate-node](https://docs.dify.ai/en/cloud/use-dify/build/orchestrate-node)) —
   `web/src/lib/agent/mock.ts` already does this with `Promise.all` and real
   overlapping timestamps; the real Dify graph should produce the same
   observable behavior, not just claim it.
4. **Bounds.** Configure the 5-iteration / 8-tool-call cap and a 90-second
   deadline directly in the Agent node's own settings where Dify exposes them;
   enforce anything Dify doesn't expose (the deadline, most likely) in the
   worker/tool gateway instead, matching `mock.ts`'s caps.
5. **Publish and pin.** Publish the workflow, note its version, and set that
   as the pinned version the app records per run — the plan explicitly warns
   against re-resolving "latest" silently.
6. **Env wiring.** Set `DIFY_API_KEY` and `DIFY_BASE_URL` on the deployed
   app (Vercel project env vars, not committed to git). `web/src/lib/agent/index.ts`
   already switches to the real adapter the moment `DIFY_API_KEY` is present —
   no code change needed there, only configuration.
7. **Re-run the acceptance gates.** Everything in `qa/smoke-test-plan.md` that
   currently passes against the mock adapter must be re-run against the real
   one before calling this stage done — a passing mock is not evidence the
   real integration behaves the same way.

## What stays true either way

Regardless of the adapter, `web/src/lib/agent/tools.ts` is the single place
that enforces "approved revision only" and equipment scoping — never delegate
that filtering to model judgment, in the mock path or the real one.
