# MARO

A TypeScript monorepo for MARO's outside experience, in-store menu, HTTP API, and background workers.

## Stack

- pnpm workspaces + Turborepo
- Next.js 16 + React 19 + Tailwind CSS 4
- Fastify 5 + Zod + generated OpenAPI documentation
- PostgreSQL + Drizzle ORM/migrations
- Redis + BullMQ worker
- Shared UI primitives using Radix Slot, class-variance-authority, and Lucide icons
- ESLint, Prettier, Vitest, Playwright, and GitHub Actions

## Requirements

Node.js 24, pnpm 11.17.0, and Docker Desktop with a working Linux container engine. Local ports: web 3100, API 4000, PostgreSQL 15432, Redis 16379. Database and queue ports are isolated from common local service defaults. Project research, product strategy, and technical documentation are indexed in [docs](docs/README.md).

## First run

```sh
pnpm install --frozen-lockfile
pnpm env:setup
pnpm infra:up
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Environment setup creates `.env` only when it does not already exist. The sample credentials are for local development only. Shell-provided environment variables take precedence over the local file. Seed data is fictional and never overwrites existing records.

`pnpm dev` builds workspace dependencies and starts all application and library watchers. PostgreSQL and Redis must be started separately. If ports are occupied, adjust Compose and `.env` together.

| URL                                | Purpose                                |
| ---------------------------------- | -------------------------------------- |
| http://localhost:3100              | Outside experience foundation          |
| http://localhost:3100/branches     | Bilingual public branch directory     |
| http://localhost:3100/branches/faisal | Branch details and directions      |
| http://localhost:3100/menu         | Public menu and local My Picks        |
| http://localhost:3100/in/faisal     | Branch-context menu preview           |
| http://localhost:3100/preview/qr    | Branch QR downloads and walkthrough   |
| http://127.0.0.1:4000/docs         | API documentation in development       |
| http://127.0.0.1:4000/health/live  | Process liveness                       |
| http://127.0.0.1:4000/health/ready | PostgreSQL and Redis readiness         |

## Structure

```text
apps/
  web/                 Outside, inside, and future administration routes
  api/                 HTTP boundary and server lifecycle
  worker/              Background processing and smoke check
packages/
  backend/             Branch and catalog business modules
  database/            Schema, migrations, pool, and development seed
  contracts/           Public request/response validation
  api-client/          Typed HTTP client
  jobs/                Queue and job contracts
  ui/                  Shared UI components
  config/              Shared TypeScript configurations
infrastructure/
  docker/              Local PostgreSQL and Redis
  deployment/          Deployment runbook
tests/
  integration/         Real database and queue checks
  e2e/                 Browser journey checks
docs/
  architecture/        Technical decisions and verification
  product/             Product strategy and direction
  research/            UX audit and cafe references
```

## Development commands

| Command                             | Purpose                                                       |
| ----------------------------------- | ------------------------------------------------------------- |
| `pnpm check`                        | Lint, typecheck, unit/API tests, and production build         |
| `pnpm format` / `pnpm format:check` | Format or verify source formatting                            |
| `pnpm test:integration`             | Real PostgreSQL and Redis tests; requires migrated services   |
| `pnpm test:e2e`                     | Homepage browser smoke test; requires Chrome                  |
| `pnpm jobs:smoke`                   | Enqueue a read-only database check and await a running worker |
| `pnpm db:generate`                  | Generate a migration after schema changes                     |
| `pnpm db:migrate`                   | Apply committed migrations                                    |
| `pnpm infra:down`                   | Stop local containers without deleting data volumes           |

The browser smoke test starts the web app automatically; build workspace packages first with `pnpm build`. Run `pnpm exec playwright install chrome` if Chrome is unavailable. CI provisions PostgreSQL/Redis and includes integration and browser checks.

## Scope

This is a working customer presentation on an executable platform foundation. Public and inside menus currently share a source-derived snapshot; branch discovery uses one source-listed registry pending owner confirmation. The authoritative integration path remains PostgreSQL -> API -> web, with API/database packages already scaffolded. The worker runs a non-customer-facing maintenance check. Authentication, staff management, orders, payment, loyalty, POS, messaging, and object storage are not represented as finished features. Current QR destinations use WEB_ORIGIN; localhost codes cannot be opened from a different phone without a reachable preview origin.

Read [the architecture](docs/architecture/README.md) and [deployment notes](infrastructure/deployment/README.md) before extending the system. All project documentation and source copy are in English.
