# Deployment boundaries

Deployment is not configured for a hosting provider yet. Do not expose the local Compose setup directly to the internet.

1. Build the repository with the pinned Node/pnpm versions and `pnpm install --frozen-lockfile`, then `pnpm build`.
2. Run database migrations once as a release task, using a dedicated migration credential. Do not run the demo seed in production.
3. Deploy web, API, and worker as separate processes. Keep compiled workspace packages alongside their application dependencies.
4. Set NODE_ENV=production. Inject secrets through the host's secret manager. API/worker need DATABASE_URL and REDIS_URL; web needs only API_BASE_URL for the current server-side reads.
5. Bind API_HOST=0.0.0.0 inside an API container, configure WEB_ORIGIN to the exact deployed frontend origin, and expose the API through HTTPS. API_BASE_URL must be reachable from the web server.
6. Use managed PostgreSQL with backups and an appropriate connection pool, and private authenticated Redis with persistence and no eviction. Apply TLS according to the provider's connection requirements.
7. Route readiness probes to `/health/ready` and liveness probes to `/health/live`. Monitor failed jobs and database/Redis errors. The worker's maintenance smoke command requires a running worker.

Commands from the repository root:

```sh
pnpm start:web
pnpm start:api
pnpm start:worker
```

Authentication, staff authorization, production observability, storage, transaction outbox, and provider-specific deployment manifests are subsequent milestones, not completed features of this scaffold.
