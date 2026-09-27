# API deployment

MARO uses Vercel for the web application and the existing Coolify VPS for the API, PostgreSQL and Redis. The first remote deployment is being prepared; verify the live environment before treating it as available.

## Coolify

Create a separate MARO project using the existing GitHub integration and `josamcode/maro-cafe-platform`, branch `main`.

| Setting                 | Value                                                      |
| ----------------------- | ---------------------------------------------------------- |
| Build Pack              | Docker Compose                                             |
| Base Directory          | `/`                                                        |
| Docker Compose Location | `/infrastructure/deployment/compose.yaml`                  |
| API service domain      | An HTTPS hostname with `:4000` as the internal target port |
| `WEB_ORIGIN`            | The exact Vercel frontend origin                           |

The Compose build context is the repository root. Coolify generates separate `SERVICE_PASSWORD_POSTGRES` and `SERVICE_PASSWORD_REDIS` values and persists them across deployments. Never replace an existing database password by merely editing the environment: PostgreSQL initializes credentials only on an empty volume.

Only the API gets a public domain through the existing Coolify proxy. No database, Redis or API host ports are published. Keep the application on its isolated Compose network; do not enable access to other projects' networks. PostgreSQL, Redis and uploads each have a persistent volume. The API runs as UID/GID 1000 and requires write access to `/data/uploads`.

The API starts after both data services pass health checks, applies pending migrations, and then starts the HTTP server. A failed migration prevents startup. This is intentionally a single-replica preview stack: do not scale it before moving migrations into a serialized release job, using shared media storage and shared rate limiting. Logs rotate at 10 MB, with three files per service. A worker is not started because the current catalog, offers and intent features do not enqueue jobs.

For manual Compose validation, pass `--project-directory .` from the repository root and use a private env file based on `.env.example`. Never print rendered Compose configuration containing real secrets.

## Container

```sh
docker build -f infrastructure/deployment/api.Dockerfile -t maro-api .
```

The multi-stage image uses Node 24 and pnpm 11.17.0, compiles the API dependency graph, and ships production dependencies. It excludes local credentials, environment files, collected asset archives and the web build.

For a standalone deployment, supply `DATABASE_URL`, `REDIS_URL`, `WEB_ORIGIN` and persistent `/data` storage. `PORT` overrides the fallback `API_PORT=4000`. The image sets `NODE_ENV=production` and `API_HOST=0.0.0.0`. Run migrations as a release task when not using the supplied Compose startup command:

```sh
node node_modules/@maro/database/dist/migrate.js
```

Readiness is `/health/ready` (PostgreSQL and Redis); liveness is `/health/live`. The API hostname must have a valid HTTPS certificate before sending staff credentials or session tokens. Vercel needs that HTTPS origin in `API_BASE_URL` and its own origin in `WEB_ORIGIN`.

## Initial staff account

Supply temporary secret variables `MARO_ADMIN_USERNAME` and `MARO_ADMIN_PASSWORD` to a one-off command inside the API container. Use a new 16–128 character password, not the local development credential.

```sh
node scripts/provision-admin.mjs
```

The command hashes the password, never prints it and never overwrites an existing account. Remove the bootstrap variables afterward; the running API does not need them. The script also works from the built repository root against a hosted database.

## Presentation catalog

An empty hosted database does not contain local products or staff accounts. To populate a presentation environment explicitly, run this once inside the API container:

```sh
node scripts/import-catalog.mjs --allow-hosted-preview
```

The flag acknowledges that the source-listed preview catalog has not received commercial launch approval. Without the flag, the importer refuses `NODE_ENV=production`. It imports only the catalog and preserves existing product edits. It does not copy local staff, sessions, test offers or intent counters, and does not run automatically at startup. Images referenced under `/home` and `/menu` ship with the Vercel web application; staff uploads are served by the API.

## Verification and operation

Before connecting Vercel, verify readiness, 126 source products and three branches, staff authentication and authorization, image upload and persistence after restart. Do not interpret deployment checks as real customer visits.

Back up PostgreSQL and the uploads volume off-host and test a restore before commercial launch. Keep Redis persistent with no eviction. Confirm current prices, media, branch information and offers with MARO. HTTPS, staff authorization and catalog audit records are implemented; shared rate limiting, branch-scoped roles, external monitoring, backups and a multi-replica release process need their own operational setup.

See [catalog administration](../../docs/architecture/catalog-administration.md) for the data and permission model.
