# MARO architecture

## Runtime boundaries

MARO is a modular backend with separate web, HTTP API, and worker processes, maintained in a pnpm/Turborepo monorepo. This provides independent deployment and scaling of API requests and background work without introducing a network service for each business module.

```text
Web / administration -> API -> PostgreSQL
                               |
                               +-> Queue -> Worker -> PostgreSQL / future providers
```

The Next.js application reads the PostgreSQL-backed catalog through the API for customer presentation and authenticated product administration. Shared contracts provide stable product UUIDs, bilingual content, prices, images, branch availability and editorial relationships. The web app never imports database/backend packages. ESLint enforces this boundary. The source snapshot now lives under `scripts/catalog-source` for initial import only. See [catalog administration](catalog-administration.md).

`packages/backend` owns business use cases and repositories. `apps/api` owns HTTP validation, serialization, CORS, rate limiting, and error translation. `apps/worker` owns queue processing and lifecycle management. Server processes use explicit constructors and injected dependencies; importing a shared module does not open a database connection.

## Packages

| Package      | Responsibility                                             |
| ------------ | ---------------------------------------------------------- |
| `config`     | Shared strict TypeScript configurations                    |
| `contracts`  | Zod request/response schemas and inferred types            |
| `api-client` | HTTP calls, timeout, and runtime response validation       |
| `database`   | Drizzle schema, migrations, connection pool, local seed    |
| `backend`    | Branch and catalog repositories and menu use case          |
| `jobs`       | Queue connection factories, job names, and payload schemas |
| `ui`         | Shared React components and class utilities                |

Workspace libraries compile to `dist` and publish explicit entry points internally. Turborepo builds dependencies first; development watches libraries as well as applications. Only UI/API-safe packages can be imported into the web application. Avoid cross-package relative imports in production source.

## Initial domain model

Branches have independent active status and time zones. Products belong to categories and have variants. A branch-variant record owns availability and a nonnegative price in integer minor units. Currency is currently constrained to EGP. Inactive branches, inactive products, and unavailable branch variants are excluded from the public menu.

The optional demo seed is fictional development data. The separate catalog importer loads source-listed preview content. It is idempotent, does not overwrite existing records, and refuses to run when NODE_ENV is production. Real names, menus, prices, hours, and imagery require approval from MARO.

## Growth path

Offers and anonymous intent reporting are implemented in the growth module. Add customers, orders and loyalty when their operational prerequisites are agreed. Orders must snapshot purchased descriptions and prices. Loyalty must use an auditable transaction ledger; phone verification alone is not proof of purchase. Authenticated owner-level catalog endpoints are implemented. Introduce branch-scoped roles before granting branch employees access; current staff accounts manage the entire catalog.

When orders begin emitting durable business events, implement a transactional outbox and idempotent handlers. Catalog edits and audit records commit in one database transaction, without queue events. The maintenance job does not implement an outbox. A successful database commit followed by a queue write is not sufficient delivery protection.

POS, payment, messaging, and object storage providers remain undecided. Their adapters belong in server-side packages, with provider credentials confined to the API or worker environment. No emails, SMS messages, notifications, or external purchases are triggered by the foundation.

The maintenance job currently performs a read-only database check. It exercises queue wiring, retries, and worker execution without pretending to implement customer communication.

## Operational decisions

- Database and Redis are independent services. Docker Compose is a local setup, not a production deployment specification.
- Redis uses persistence and `noeviction` for queues. Producers fail within a bounded request period; worker connections can reconnect.
- API liveness is separate from dependency readiness. Readiness checks PostgreSQL and Redis without leaking their connection details.
- API and worker use structured logs and graceful shutdown. API errors redact internal failure details.
- Public API routes are read-only; staff writes require an active server-validated session. CORS is not authentication. The current rate limiter is per API process; use a shared store or gateway when deploying multiple replicas.
- API documentation is enabled outside production. The development site disables search indexing until approved for launch.
- The current connection pool is per process. Set connection budgets or use a pooler before scaling replicas.

## Dependency policy

Direct dependencies and the lockfile are pinned for reproducible installs. TypeScript 5.9 is retained for compatibility with the current lint toolchain. ESLint 9 is required by React/import/accessibility plugins bundled with the installed Next.js lint configuration; the registry reports its support deprecation. Upgrade that toolchain together rather than suppressing incompatible peer ranges. Drizzle Kit also brings deprecated upstream esbuild-kit packages; monitor its releases.

Do not add payment, authentication, messaging, or cloud SDKs until a provider and concrete integration are selected.

## Official references

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [Next.js workspace transpilation](https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages)
- [Fastify TypeScript](https://fastify.dev/docs/latest/Reference/TypeScript/)
- [Drizzle PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [BullMQ connections](https://docs.bullmq.io/guide/connections)
- [pnpm workspace settings](https://pnpm.io/settings)
