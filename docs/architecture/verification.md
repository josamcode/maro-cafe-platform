# Foundation verification

Local environment: Windows, Node.js 24.18.0, pnpm 11.17.0.

## Verified

- Workspace dependencies installed and lockfile generated.
- No unresolved peer dependency issues.
- ESLint and application/shared-package TypeScript checks passed.
- Test code TypeScript checks passed.
- Thirteen automated tests passed across API boundaries, API client validation, and worker processing.
- Production builds passed for the web app, API, worker, and compiled workspace packages.
- Initial SQL migration generated from the Drizzle schema.
- Docker Compose configuration parsed successfully.
- Live HTTP smoke checks returned 200 for the homepage, API liveness, and development OpenAPI documentation.
- Readiness returned 503 while required services were unavailable.
- Production dependency audit reported no known vulnerabilities at verification time.

## Historical foundation blocker (resolved by the catalog implementation)

Docker Desktop's Linux engine returned HTTP 500 for engine/image operations despite Desktop reporting a running status. The MARO PostgreSQL and Redis containers could not be started. Real database migration application, sample seeding, and queue integration could therefore not be verified locally. The integration test preflight fails clearly when these services are unreachable.

MARO uses dedicated host ports 15432 and 16379 to avoid an existing PostgreSQL service on the standard port. The web app uses port 3100 because port 3000 was already occupied. Existing services were not stopped or reconfigured.

The Playwright smoke test and GitHub Actions workflow are configured but have not been executed in this local verification. HTTP verification is not a substitute for browser interaction testing.

## Original recovery commands

```sh
pnpm infra:up
pnpm db:migrate
pnpm db:seed
pnpm test:integration
pnpm test:e2e
pnpm dev
```

In a second terminal, `pnpm jobs:smoke` should complete through the running worker. Do not interpret a successful process build as proof of a working external integration.

## Shared catalog and administration verification

September 27, 2026. This supersedes the earlier local infrastructure blocker.

- PostgreSQL and Redis started successfully. Local Redis uses the Debian bookworm image after the Alpine image failed to execute on this machine. Both database migrations applied successfully.
- Imported 126 source-listed products; repeated import inserted zero products and preserved existing edits. Local owner access was provisioned without printing credentials; `.local/admin-access.txt` is Git-ignored.
- Lint, workspace/test type checking, formatting and production build passed. Nineteen unit/API checks and three real PostgreSQL/Redis integration checks passed.
- All 36 browser scenarios passed together against the production web build and API, including product creation, image upload, typed decimal pricing, current-price picks, branch visibility, editorial placement/pairing, Arabic/dark mobile editing, discard protection and logout.
- Initial development-server runs exposed aggregate API rate limiting, horizontal form overflow and rounded fractional prices; these were corrected. Concurrent cold development compilation also delayed hydration/navigation, so the browser suite now tests the production build with four workers. The 36-scenario production run completed in 1.2 minutes. Next logged two early-closed response streams during navigation; no scenario failed in that run.
- Deployment-specific hosting, durable shared image storage, broader staff roles and owner approval of content remain outside this verification. There is no verified purchase, order, reward or POS connection.

# Offers and intent verification - September 28, 2026

- Migration `0002_dashing_morbius` applied to local PostgreSQL. No real promotional records were seeded.
- Nineteen unit/API checks and four real service integration checks passed. Growth coverage includes draft exclusion, valid calendar dates, approval requirements, context/branch filtering, scheduled/expired exclusion, stale saves, unauthorized staff access, strict event fields and event-ID deduplication.
- All 38 production-build browser scenarios passed together in 1.3 minutes. The new journey verifies staff draft/save/publish, day/month/year numeric typing, public and inside eligibility, actual event collection, staff filters, Arabic/dark reporting and Do Not Track suppression.
- Lint, workspace/test type checking, formatting and production build passed. An existing layout assertion was stabilized by reading both hero-button coordinates in the same animation frame; separate reads were racing smooth scrolling after a locale change.
- Next still occasionally logs an early-closed response stream during automated navigation. The final suite passed; this is not represented as resolved infrastructure behavior.
- Temporary offer fixtures and test staff accounts were cleaned up. Public browser tests can contribute anonymous preview counters; production reporting must use an isolated environment. See [offers and intent](offers-and-intent.md) for operational boundaries.
