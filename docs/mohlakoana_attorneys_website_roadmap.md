# Mohlakoana Attorneys — Website & Client Portal Build Roadmap

**Stack:** Next.js (frontend) · FastAPI (backend) · PostgreSQL (own database) · BiznizFlowPilot (external CRM/ERP, via API adapter)

---

## Phase 0 — Discovery & sign-off
*Goal: nothing gets built until these are answered. This is the phase most projects skip and regret.*

- [x] Get BFP API documentation from MM Nexus — endpoints, auth method (JWT vs API key), rate limits, whether webhooks exist
- [ ] Confirm hosting region for your own Postgres/FastAPI stack (South Africa or an EU region with proper safeguards — do not default to "wherever's cheapest") — **placeholder: South Africa, pending director sign-off**
- [ ] Written confirmation from MM Nexus on BFP's data-handling safeguards for cross-border transfer (Redis on Azure US, Postgres on Supabase/AWS)
- [ ] Director sign-off on the POPIA boundary: ID numbers and matter substance never leave your own database
- [ ] Define the Matter status lifecycle with Mr Mohlakoana (e.g. Opened → In Progress → Awaiting Client → Closed) — **placeholder: using this exact lifecycle, pending his approval**
- [ ] Confirm client portal signup flow: does the firm invite clients, or do clients self-register against a matter reference number? — **placeholder: firm-invited, since self-registration by matter reference number is a guessable-credential risk**
- [ ] Budget ceiling, target launch date, and expected traffic/uptime expectations

**Exit criteria:** you have BFP's API docs in hand and a written data-boundary decision. Don't start Phase 1 without both.

### BFP API documentation (confirmed, 2026-07-29)
- **Auth:** JWT bearer only (HS256, python-jose). No API-key auth exists. Token readable from `Authorization: Bearer` header or httpOnly cookie. Access tokens last 24h, refresh tokens 7 days. MM Nexus's internal admin console uses a completely separate signing key/claims — irrelevant to this integration.
- **Endpoints:** ~30 tenant-scoped routers under `/api/v1/...` (customers, leads, tasks, documents, invoices, and others we don't need — inventory, HR, finance, sales/purchase orders, messaging, meetings, workflows). All require the JWT above plus an active subscription. A few public unauthenticated routes exist (trial signup, marketing lead capture, PayFast webhook, token-based share links) — not relevant to our adapter.
- **Rate limits:** only on auth/public routes (login 10/min, signup 5/hr, password reset 5/min). No rate limit on authenticated business-data endpoints — pacing is self-imposed, not enforced by BFP.
- **Webhooks:** none for third parties. One inbound webhook (PayFast, irrelevant). No outbound event subscription system — **the adapter must poll, not subscribe, for anything BFP-side changes need to reach us.**
- **Known vendor exposure (flag to MM Nexus, not ours to fix):** BFP's `/docs` and `/openapi.json` are live and unauthenticated in production; the entire API schema is publicly enumerable.
- **Still needed before Phase 3 starts:** BFP base domain/URL (to pull the real OpenAPI schema for accurate adapter models) and a dedicated integration/service-account login for the adapter.

---

## Phase 1 — Foundation
*Goal: a working skeleton, no BFP integration yet, nothing client-facing.*

- [ ] Provision Postgres + FastAPI backend on the chosen hosting region
- [ ] Build `Clients`, `Staff`, `Matters` tables (schema already sketched — three entities, no Documents/Invoices duplicated)
- [ ] JWT auth for staff and a separate JWT auth for client-portal logins (two distinct auth flows, per earlier finding that BFP's auth isn't pluggable)
- [ ] Basic Alembic migrations set up, CI running tests on push (mirror BFP's own pattern — pytest + ruff)
- [ ] Set up staging environment separate from production

**Exit criteria:** you can create a Client, a Matter, and log in as staff and as a client via API calls (Postman/curl), with nothing public-facing yet.

---

## Phase 2 — Public website
*Goal: the marketing site goes live, independent of the portal build.*

- [ ] Next.js site with headless CMS (Sanity or Contentful) for practice-area pages, about, approach sections
- [ ] Content written: 8 practice-area pages, director bio, firm approach (pull directly from the existing business profile — most of this copy already exists)
- [ ] Contact form wired to FastAPI backend — creates a `Client` record
- [ ] POPIA consent checkbox and firm privacy policy published
- [ ] Mobile-responsive, brand palette applied (gold/charcoal/cream from the existing profile)
- [ ] Basic SEO: meta tags, sitemap, practice-area page titles targeting realistic search terms (e.g. "CCMA attorney Pretoria")

**Exit criteria:** the public site is live and taking real inquiries, even before the portal or BFP integration exist.

---

## Phase 3 — BFP sync adapter
*Goal: the highest-risk integration piece, built and tested in isolation before the portal depends on it.*

- [ ] Build the adapter as a standalone service (recommend mirroring BFP's own Celery/Redis pattern for background jobs, rather than bolting sync calls into request/response cycles)
- [ ] Contact form submission → creates a BFP Customer/Lead (name, email, phone only — no ID numbers)
- [ ] Matter opened → creates a BFP Task assigned to the relevant staff member
- [ ] Define the exact JSONB metadata key convention for tagging BFP Documents and Invoices with your `matter_id`
- [ ] Error handling and retry logic for when BFP's API is unreachable — the adapter should queue and retry, never silently drop data
- [ ] Logging/alerting so a failed sync is visible, not discovered a week later
- [ ] Adapter owns its own BFP service-account session lifecycle (login → cache access token → refresh before 24h expiry → re-login when the 7-day refresh token lapses) since there is no API-key alternative
- [ ] No outbound webhooks exist on BFP's side — any "react to a BFP-side change" behavior (e.g. invoice marked paid in BFP) must be a scheduled poll, not a subscription

**Exit criteria:** a test Matter created in your system correctly produces a linked Customer and Task in BFP, and a manually-added BFP Document tagged with that `matter_id` is retrievable from your side.

---

## Phase 4 — Client portal
*Goal: clients can log in and see real information about their matter.*

- [ ] Wireframes/mockups reviewed and approved (matter list, matter detail, document view, invoice view) — don't skip this even if it feels slow; it's cheaper to change a mockup than rebuilt UI
- [ ] Client login, password reset, session handling
- [ ] Matter list and detail views, pulling status from your own database
- [ ] Document list — read-through display of BFP Documents tagged with the matter's `matter_id` (not duplicated storage)
- [ ] Invoice list and status — same read-through pattern against BFP Invoices
- [ ] Client-facing notifications (email at minimum) on matter status changes

**Exit criteria:** a real client can log in, see their matter status, view their documents, and see what they owe — all sourced correctly across both systems.

---

## Phase 5 — Payments & e-signature
*Goal: close the loop on the "fee certainty" promise already in the firm's brand.*

- [ ] PayFast integration for invoice payment through the portal
- [ ] E-signature provider selected (DocuSign or Adobe Sign) for retainer agreements
- [ ] Retainer agreement template digitised and wired into the client onboarding flow

**Exit criteria:** a client can pay an invoice and sign a retainer without leaving the portal.

---

## Phase 6 — Compliance & launch readiness
*Goal: the legal and operational checks before real client data flows through the system.*

- [ ] Data processing agreement or written safeguards confirmation from MM Nexus, filed alongside the firm's own compliance records
- [ ] Firm privacy policy finalised and covering both the public site and the portal
- [ ] Backup and disaster recovery plan for your own database (this is the system of record for sensitive data — it needs a real backup policy, not an assumption)
- [ ] Load/uptime testing against expected traffic
- [ ] Security review: rate limiting on public endpoints (contact form, login), password hashing confirmed (bcrypt or equivalent), HTTPS everywhere

**Exit criteria:** you'd be comfortable if the director asked "what happens to a client's ID number, end to end" and had a clean answer at every step.

---

## Phase 7 — Post-launch
*Goal: what "scales with the firm" actually looks like once this is live.*

- [ ] Blog/insights section for SEO (CCMA guidance, POPIA compliance for SMEs, retrenchment rights — content the director is qualified to write)
- [ ] Monitor BFP sync failures and adjust retry/alerting based on real-world patterns
- [ ] Revisit multi-tenant question if the firm brings on associates or a second office
- [ ] Automated workflows — CCMA hearing reminders, matter status nudges — once the core system has proven stable

---

## What blocks what — dependency summary

| Phase | Blocked by |
|---|---|
| 1 (Foundation) | Phase 0 hosting + data-boundary decision |
| 2 (Public site) | Nothing — can start in parallel with Phase 1 |
| 3 (BFP adapter) | Phase 0 API docs, Phase 1 backend/database |
| 4 (Client portal) | Phase 1 auth, Phase 3 working adapter |
| 5 (Payments/e-sign) | Phase 4 portal shell |
| 6 (Compliance) | Runs alongside all phases, not a final gate — but must complete before real client data enters production |
| 7 (Post-launch) | Everything else live and stable |

**The one phase that can't be estimated yet:** Phase 3, until BFP's actual base URL and a service-account login are in hand. Everything else on this roadmap can be scoped and quoted today.
