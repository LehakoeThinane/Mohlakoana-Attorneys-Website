# Mohlakoana Attorneys — Website & Client Portal

See [docs/mohlakoana_attorneys_website_roadmap.md](docs/mohlakoana_attorneys_website_roadmap.md) for the phased build plan and [docs/full_system_architecture.svg](docs/full_system_architecture.svg) for the system diagram.

## Architecture, in one paragraph

Two front doors (public site, client portal) talk to one FastAPI backend — the only choke point in the system. The backend owns its own Postgres database, which holds every sensitive field (ID numbers, matter substance) and has **no outgoing connection to anything** — that boundary is deliberate, not a gap to fill in later. A separate BFP sync adapter is the only thing that talks to BiznizFlowPilot (the firm's external CRM/ERP), and it only ever forwards what BFP's CRM/task/invoice modules need: names, emails, task descriptions, invoice line items. Nothing else reaches BFP, ever.

## Repo layout

```
backend/     FastAPI + Postgres + Alembic — Clients, Staff, Matters, dual JWT auth
frontend/    Next.js public site (App Router, TypeScript, Tailwind)
docs/        Roadmap and architecture diagram
docker-compose.yml   Local Postgres for development and tests
```

## Local setup

### Backend

```bash
cd backend
python -m venv .venv && .venv/Scripts/activate   # or source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in real secrets before anything but local dev

docker compose up -d          # starts Postgres (from repo root)
alembic upgrade head
python scripts/seed_admin.py you@mohlakoana.co.za "a-strong-password" "Your Name"

uvicorn app.main:app --reload
```

Tests run against a separate `mohlakoana_test` database (created automatically by the Postgres container):

```bash
pytest
ruff check .
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Where things stand (Phase 1)

- [x] Postgres + FastAPI backend scaffolded
- [x] `Clients`, `Staff`, `Matters` tables + initial Alembic migration
- [x] Dual JWT auth — separate signing secrets and token audiences for staff vs. client-portal logins
- [x] CI running `pytest` + `ruff` against a real Postgres service container
- [x] Next.js public site skeleton
- [ ] Staging environment
- [ ] Phase 2 content and pages (contact form is wired up; practice-area pages are not written yet)

**Not yet started:** Phase 3 (BFP sync adapter) is blocked on BFP's base URL and a dedicated integration/service-account login — see the roadmap's Phase 0 notes.

## Auth model

Staff and client-portal logins are two separate flows, each with its own JWT secret and audience claim (`aud: "staff"` / `aud: "client"`) — a leaked secret for one can't be used to forge tokens for the other. Client portal access is **invite-only**: staff create a `Client` record and issue an invite token (`POST /api/v1/clients/{id}/invite`), the client sets a password against that token (`POST /api/v1/auth/client/accept-invite`), and only then can they log in. There is no client self-registration endpoint — a guessable matter reference number is not a credential.

Staff accounts have no creation endpoint at all; the first (and any subsequent) staff account is created via `scripts/seed_admin.py` with direct database access.
