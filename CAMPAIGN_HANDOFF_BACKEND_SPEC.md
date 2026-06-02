# Campaign Handoff - Backend API Specification

## Overview

AI outbound campaigns (voice/SMS) contact drivers and produce a per-target
`campaignCallSummary` with an `outcome` of `positive | negative | neutral | unclear`.
A **handoff** routes a campaign target to a human owner — a company user or
designated recruiter — who takes over the follow-up.

Handoffs are created two ways:

- **Automatic** — once the AI conversation for a target completes, a campaign's
  handoff rule (stored in `campaign.config.handoff`) is evaluated and, when matched,
  a handoff is created and the assignee is emailed.
- **Manual** — a user creates a handoff from the campaign target list in the dashboard.

The assignee then works the handoff from a dedicated **Handoffs inbox** in the
frontend (`/dashboard/company/handoffs`).

This document specifies the backend (table, endpoints, auto-trigger, email) the
frontend is already built against. The frontend types are the contract:
- `models/campaigns/campaign-handoff.entity.ts`
- `models/campaigns/{create,update}-handoff.dto.ts`, `handoff-query.dto.ts`
- `enums/campaigns/campaign-handoff-{status,trigger,outcome-rule}.enum.ts`
- API client: `pages/api/campaign-handoffs.ts`

## Database Schema

### Table: `campaign_handoffs`

```sql
CREATE TABLE campaign_handoffs (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  campaign_target_id INTEGER NOT NULL REFERENCES campaign_targets(id) ON DELETE CASCADE,
  assigned_user_id INTEGER NOT NULL REFERENCES users(id),

  status VARCHAR(20) NOT NULL DEFAULT 'pending',   -- pending | accepted | completed | dismissed
  trigger VARCHAR(20) NOT NULL,                    -- automatic | manual
  reason VARCHAR(255),                             -- rule name (auto) or label (manual)
  notes TEXT,                                      -- free text for the assignee

  -- Denormalized snapshot so the inbox renders without joins
  target_type VARCHAR(20),                         -- applicant | employee | lead
  target_id INTEGER,                               -- underlying applicant/employee/lead id
  target_name VARCHAR(255),
  target_phone VARCHAR(50),
  target_email VARCHAR(255),
  campaign_name VARCHAR(255),
  communication_type VARCHAR(10),                  -- voice | sms
  call_summary JSONB,                              -- copy of CampaignCallSummary

  accepted_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_handoff_company (company_id),
  INDEX idx_handoff_assignee (assigned_user_id),
  INDEX idx_handoff_status (status),
  INDEX idx_handoff_campaign (campaign_id)
);

-- At most one active (pending/accepted) handoff per target.
CREATE UNIQUE INDEX uniq_active_handoff_per_target
  ON campaign_handoffs (campaign_target_id)
  WHERE status IN ('pending', 'accepted');
```

### Campaign config (no schema change)

Per-campaign handoff rules live in the existing free-form `campaigns.config` JSON
under the `handoff` key (`CampaignHandoffConfig`):

```jsonc
{
  "handoff": {
    "enabled": true,
    "outcomeRule": "positive",            // none | positive | positive_or_neutral | any_completed
    "defaultAssigneeUserId": 42,          // optional explicit default
    "autoAssign": false,                  // distribute across recruiters instead of a single default
    "autoAssignMethod": "round_robin"     // round_robin | weighted
  }
}
```

### `CampaignTarget` response change

Include the active handoff on target responses so the dashboard target list can
render handoff status without an extra call:

```jsonc
{ "id": 1, "name": "John Doe", "...": "...", "handoff": { /* CampaignHandoffEntity or null */ } }
```

## API Endpoints

All endpoints are authenticated (JWT) and company-scoped. They live under the
existing `campaigns` controller to match the FE API client base URL.

### 1. Create handoff

**Endpoint:** `POST /campaigns/:campaignId/handoffs`

**Body** (`CreateHandoffDto`):
```json
{ "campaignTargetId": 10, "assignedUserId": 42, "notes": "Interested in regional", "reason": "manual" }
```

`assignedUserId` is optional. When omitted, resolve the assignee:
1. `config.handoff.defaultAssigneeUserId` if set, else
2. if `config.handoff.autoAssign`, pick via round-robin / weighted-by-recruiter-score
   (mirror `utils/auto-assign.ts`), else
3. `400` — no assignee could be resolved.

On create: snapshot the target fields + `callSummary` into the row, set
`trigger = manual` (or `automatic` for the auto path), and send the assignee email
(see below). Return the created `CampaignHandoffEntity` with `assignedUser` hydrated.

**Response:** `201 Created` → `CampaignHandoffEntity`

Reject (`409`) if the target already has an active handoff (unless reassigning via PATCH).

### 2. List handoffs (inbox)

**Endpoint:** `GET /campaigns/handoffs`

**Query** (`HandoffQueryDto`): `assignedUserId`, `status` (single or repeated),
`campaignId`, `page`, `limit`, `sortBy`, `sortOrder`.

Defaults to `assignedUserId = current user`. Company admins may pass another
`assignedUserId` (or omit to see the whole company — implementer's choice, scope to
company either way). `assignedUser` must be hydrated.

**Response:** `200 OK`
```json
{ "handoffs": [ /* CampaignHandoffEntity[] */ ], "total": 12, "page": 1, "limit": 20 }
```

### 3. List handoffs for a campaign

**Endpoint:** `GET /campaigns/:campaignId/handoffs`

**Response:** `200 OK` → `CampaignHandoffEntity[]`

### 4. Update handoff (accept / complete / dismiss / reassign)

**Endpoint:** `PATCH /campaigns/handoffs/:handoffId`

**Body** (`UpdateHandoffDto`): any of `status`, `assignedUserId`, `notes`.

- Setting `status = accepted` stamps `accepted_at`; `completed` stamps `completed_at`.
- Setting `assignedUserId` reassigns (and may re-send the email — implementer's choice).

**Response:** `200 OK` → updated `CampaignHandoffEntity`

### 5. Handoff stats

**Endpoint:** `GET /campaigns/handoffs/stats`

Counts for the current user's (or company's) handoffs, keyed by status. Used for the
inbox filter badges.

**Response:** `200 OK`
```json
{ "pending": 4, "accepted": 2, "completed": 9, "dismissed": 1 }
```

## Automatic handoff trigger

Where the AI call-summary pipeline writes `campaign_target.metadata.campaignCallSummary`
and marks the target processed, evaluate `campaign.config.handoff`:

1. Skip if `!handoff.enabled` or `handoff.outcomeRule === 'none'`.
2. Skip if the target already has an active handoff.
3. Match outcome against the rule:
   - `positive` → `outcome === 'positive'`
   - `positive_or_neutral` → `outcome ∈ {positive, neutral}`
   - `any_completed` → any target whose conversation completed
4. Resolve the assignee (default → auto-assign, as in endpoint 1).
5. Create the handoff with `trigger = automatic`, `reason = 'ai_outcome:<rule>'`.
6. Send the assignee email.

## Email notification

The assignee is notified on handoff creation.

- **Manual** handoffs: the frontend already calls `POST /api/send-handoff-email`
  (a Next.js route, `pages/api/send-handoff-email.ts`, SendGrid SMTP) after a
  successful create. The backend does **not** need to email on the manual path.
- **Automatic** handoffs: the backend must send the email itself (the FE is not in
  the loop). Reuse the same template/fields: assignee name/email, driver name/phone/
  email, campaign name, AI summary + outcome, and a link to
  `/dashboard/company/handoffs`.

## Notes for implementer

- Keep all queries company-scoped; a user must never see another company's handoffs.
- The denormalized snapshot fields are intentional: the inbox must render fast and
  remain meaningful even if the underlying target/applicant changes later.
- The unique partial index enforces "one active handoff per target"; manual reassign
  goes through PATCH on the existing row rather than creating a new one.
