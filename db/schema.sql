-- ForgeLine Assist — Postgres schema (design artifact, not yet wired to the app)
--
-- web/src/lib/store.ts is an in-memory placeholder (see its `// ponytail:` comment).
-- This file is the real persistence target described in tasks/plan.md's
-- "State, roles and job behavior" section. It has not been run against a real
-- database or connected to the app; treat it as a reviewed starting migration,
-- not a verified one. Plain SQL, no ORM — run with any Postgres client/migration tool.

-- ============================================================ users & equipment
create table users (
  id            text primary key,
  name          text not null,
  role          text not null check (role in ('supervisor', 'owner_admin', 'approver')),
  created_at    timestamptz not null default now()
);

create table equipment (
  id            text primary key,       -- e.g. 'PK-04'
  name          text not null,
  plant         text not null,          -- e.g. 'FL-01'
  created_at    timestamptz not null default now()
);

-- ============================================================ knowledge corpus
-- One row per approved-or-archived document revision/section chunk.
-- Current operational answers must only read approval_status = 'approved'.
create table doc_chunks (
  id              text primary key,      -- e.g. 'SAF-001:v3:Jam escalation'
  doc_id          text not null,         -- e.g. 'SAF-001'
  revision        int not null,
  section         text not null,
  category        text not null check (category in ('safety', 'maintenance', 'quality')),
  effective_date  date not null,
  approval_status text not null check (approval_status in ('approved', 'archived', 'pending')),
  excerpt         text not null,
  source_url      text,                 -- controlled/allowlisted, not model-written
  equipment_ids   text[] not null default '{}',
  unique (doc_id, revision, section)
);
create index doc_chunks_doc_id_idx on doc_chunks (doc_id, approval_status);

-- Document-level change tracking, feeds the monitoring workflow.
create table source_revisions (
  doc_id          text not null,
  revision        int not null,
  approved_by     text references users(id),
  approved_at     timestamptz,
  effective_date  date not null,
  commit_sha      text,                 -- GitHub commit that introduced this revision
  primary key (doc_id, revision)
);

-- ============================================================ investigations & runs
create table investigations (
  id              text primary key,      -- e.g. 'INV-001'
  plant           text not null,
  creator_id      text not null references users(id),
  equipment_id    text references equipment(id),
  batch           text,
  question        text not null,
  status          text not null default 'open' check (status in ('open', 'resolved', 'cancelled')),
  version         int not null default 1,   -- optimistic concurrency
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table runs (
  id                text primary key,     -- e.g. 'RUN-001'
  investigation_id  text not null references investigations(id),
  workflow_version  text,                 -- pinned Dify published-workflow version
  inputs            jsonb not null,
  dataset_revision  text,
  budget            jsonb not null default '{"maxIterations":5,"maxToolCalls":8,"deadlineSeconds":90}',
  status            text not null check (status in ('queued','running','completed','partial','needs_input','failed','cancelled')),
  started_at        timestamptz not null default now(),
  ended_at          timestamptz
);
create index runs_investigation_idx on runs (investigation_id);

-- Observable tool activity only — never private model reasoning traces.
create table tool_events (
  id            uuid primary key default gen_random_uuid(),
  run_id        text not null references runs(id),
  tool          text not null,           -- search_plant_docs | read_procedure | ...
  branch        text,                    -- safety | maintenance | quality | main
  args          jsonb not null default '{}',
  status        text not null check (status in ('ok', 'empty', 'error')),
  summary       text,
  evidence_ids  text[] not null default '{}',
  started_at    timestamptz not null,
  ended_at      timestamptz
);
create index tool_events_run_idx on tool_events (run_id, started_at);

-- ============================================================ tasks (fictional demo writes)
create table tasks (
  id              text primary key,      -- e.g. 'TSK-003'
  investigation_id text references investigations(id),
  title           text not null,
  assignee        text references users(id),
  status          text not null default 'open' check (status in ('open', 'in_progress', 'done')),
  version         int not null default 1,   -- update requires matching expected_version -> 409 on mismatch
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================ approvals & connector receipts
create table action_proposals (
  id              text primary key,       -- e.g. 'PRP-001'
  investigation_id text not null references investigations(id),
  proposer_id     text not null references users(id),
  action_type     text not null,          -- e.g. 'github.issue.create'
  target          jsonb not null,         -- {system, account, resource}
  payload         jsonb not null,         -- exact fields/message shown on the approval screen
  evidence_ids    text[] not null default '{}',
  payload_hash    text not null,          -- invalidated if payload/target/evidence revision changes
  version         int not null default 1,
  status          text not null default 'draft'
                  check (status in ('draft','awaiting_approval','approved','rejected','expired','executing','succeeded','failed','unknown')),
  created_at      timestamptz not null default now(),
  expires_at      timestamptz not null
);

create table approvals (
  id              uuid primary key default gen_random_uuid(),
  proposal_id     text not null references action_proposals(id),
  approver_id     text not null references users(id),
  decision        text not null check (decision in ('approved', 'rejected')),
  payload_hash_at_decision text not null,   -- must match action_proposals.payload_hash at decision time
  decided_at      timestamptz not null default now(),
  -- server-enforced, never trust a model-provided approval:
  constraint approver_not_proposer check (approver_id <> (select proposer_id from action_proposals where id = proposal_id))
);

create table connector_receipts (
  id              text primary key,       -- e.g. 'RCP-PRP-001'
  proposal_id     text not null references action_proposals(id),
  kind            text not null check (kind in ('real', 'simulated', 'unknown')),
  external_id     text,                   -- e.g. GitHub issue number
  external_url    text,
  note            text,
  created_at      timestamptz not null default now()
);

-- ============================================================ monitoring & notifications
create table monitor_subscriptions (
  id              uuid primary key default gen_random_uuid(),
  user_id         text not null references users(id),
  scope           text not null,          -- knowledge path / doc category being watched
  channel         text not null check (channel in ('in_app', 'email')),
  quiet_hours     jsonb,
  created_at      timestamptz not null default now()
);

create table notification_deliveries (
  id              uuid primary key default gen_random_uuid(),
  subscription_id uuid references monitor_subscriptions(id),
  event_type      text not null,          -- revision_activated | ingestion_failed | needs_input | approval_requested
  dedupe_key      text not null,          -- source revision/event id, prevents replay duplicates
  channel         text not null,
  status          text not null check (status in ('queued', 'sent', 'delivered', 'bounced', 'failed')),
  delivered_at    timestamptz,
  unique (dedupe_key, channel)
);

-- Signed GitHub push events, deduped by delivery id before they enqueue ingestion.
create table webhook_deliveries (
  delivery_id     text primary key,
  repo            text not null,
  branch          text not null,
  event           text not null,
  received_at     timestamptz not null default now()
);

-- ============================================================ audit
create table audit_events (
  id              uuid primary key default gen_random_uuid(),
  actor_id        text references users(id),
  action          text not null,
  target_type     text not null,
  target_id       text not null,
  payload         jsonb,
  created_at      timestamptz not null default now()
);
create index audit_events_target_idx on audit_events (target_type, target_id);
