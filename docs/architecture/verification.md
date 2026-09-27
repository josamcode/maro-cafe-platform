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

## Blocked locally

Docker Desktop's Linux engine returned HTTP 500 for engine/image operations despite Desktop reporting a running status. The MARO PostgreSQL and Redis containers could not be started. Real database migration application, sample seeding, and queue integration could therefore not be verified locally. The integration test preflight fails clearly when these services are unreachable.

MARO uses dedicated host ports 15432 and 16379 to avoid an existing PostgreSQL service on the standard port. The web app uses port 3100 because port 3000 was already occupied. Existing services were not stopped or reconfigured.

The Playwright smoke test and GitHub Actions workflow are configured but have not been executed in this local verification. HTTP verification is not a substitute for browser interaction testing.

## Once Docker is healthy

```sh
pnpm infra:up
pnpm db:migrate
pnpm db:seed
pnpm test:integration
pnpm test:e2e
pnpm dev
```

In a second terminal, `pnpm jobs:smoke` should complete through the running worker. Do not interpret a successful process build as proof of a working external integration.
