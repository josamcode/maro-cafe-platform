# Shared catalog and product administration

September 27, 2026. Implemented for the development presentation; source data still requires MARO approval.

## A short staff journey

Open `/admin`, sign in, search by Arabic/English name or category, and open a product. One form contains the two names, category, photo, pricing method and visibility. Single-price products show one price field; sized products show their two fields. Prices accept Arabic digits and up to two decimal places. Validation appears beside the relevant fields, without native browser validation popups.

Branch availability, homepage placement and the optional complementary product sit inside a closed disclosure. Existing images can be reused or a JPG/PNG/WebP uploaded. Matching a photograph to a product requires an explicit checkbox. Cancel/back prompts before discarding changes; closing/reloading a dirty tab uses the browser's unload protection. Saving disables the form and returns to the searchable list. Concurrent edits return a conflict instead of silently overwriting another staff member.

The editor reuses `@maro/ui` controls, overlays, typography and semantic colors, plus the existing language/theme preferences. It supports Arabic RTL, English LTR and compact mobile layouts. No separate UI component library was introduced.

## Local setup

```sh
pnpm infra:up
pnpm db:migrate
pnpm exec turbo run build --filter=./packages/*
pnpm catalog:import
pnpm admin:setup
pnpm dev
```

The importer loads 126 source-listed preview products, six categories and three branches from `scripts/catalog-source`. Stable deterministic product UUIDs replace positional snapshot identities. Re-running the import preserves existing edits. The separate `db:seed` command supplies fictional integration-test records, which have no content DTO and are excluded from the customer catalog.

Local setup creates an owner account and writes its generated password to `.local/admin-access.txt`, excluded from Git. It never prints the password or replaces an existing account. The importer and local account generator refuse production mode. Production provisioning and account recovery require a secured operational process; there is no public registration or password-reset flow.

## Runtime ownership

`PostgreSQL -> packages/backend -> apps/api -> apps/web` serves both customer experiences. The web app imports contracts and the typed API client, never database/backend packages. Products use stable UUIDs; variants retain identities when their labels are edited away and restored. Prices are integer minor units in storage. This editor applies one set of product prices across selected branches; it does not offer independent branch prices.

The new catalog endpoint exposes only active products with at least one selected active branch. Inside browsing further filters by branch. Hidden products remain editable. Recommendations resolve by stable IDs and omit unavailable/self references. Homepage placement is editorial, not a verified popularity claim.

The customer provider refreshes at navigation, tab focus, visibility return and every 30 seconds while visible. Initial page reads and API responses are uncached. On refresh failure, previously displayed data may remain visible, but additions are disabled and the menu explains the outage. There is no fallback to the archived snapshot. An already-open page can take up to 30 seconds to reflect a save.

My Picks stores identities and quantities, never trusted prices. Current prices and names come from the shared catalog. Valid old snapshot IDs migrate using their original name guard. Stable unavailable selections remain stored, are explained in My Picks, and are excluded from its total; switching back to an available branch restores them. This is still an unsent shortlist, not an order or proof of a visit.

## Authentication and writes

Passwords use salted scrypt. Random opaque sessions expire after eight hours; only SHA-256 token hashes are stored. Next keeps the bearer token in an HttpOnly, SameSite=Strict cookie scoped to `/admin`, Secure in production. Next Server Actions provide the same-origin mutation boundary; the API independently authenticates every staff read/write. Logout revokes the database session. Disabling a staff account invalidates access on the next request.

Every current staff account is an owner-level editor across branches. Branch-scoped employee roles are not implemented. Writes validate shared contracts, resolve catalog references, compare the product version, and atomically persist product content, variants, availability, pairing and actor-linked before/after audit records. An audit viewer and rollback UI are not included.

Public reads have a separate rate budget because requests are aggregated through the web server. Login has a stricter budget. The limiter is per API process; production replicas need a shared limiter or gateway policy.

## Images and deployment

Uploads require authentication and have a 5 MB decoded limit. Sharp accepts JPEG/PNG/WebP, limits decoded pixels, rotates, resizes to at most 1600px, strips metadata and re-encodes WebP under a random filename. File content is checked independently of the browser MIME type. Arbitrary URLs, SVG and user-supplied filesystem paths are not accepted. Abandoned uploads can remain unreferenced; storage cleanup is a later operational job.

`UPLOAD_DIR` defaults to `../../.local/uploads` relative to the API working directory. The API serves validated media filenames; Next proxies `/media/*`. Development storage is not a cloud deployment solution. Use a durable volume with backups for one API instance, or shared/object storage for multiple instances. Do not deploy uploads to an ephemeral serverless filesystem.

## Boundaries and next work

This step manages products, pricing, photographs, visibility and editorial relationships. Branch addresses and category metadata are shared database content but do not yet have editing screens. Offers and intent measurement now have separate staff screens; see [their handoff](offers-and-intent.md). Customer accounts, purchases, stamps and POS integration remain later work. Product prices, imagery and branch facts still need owner approval before launch.

Tests cover authentication and revocation, invalid uploads, database persistence, stale writes, audit records, real browser image upload, both menus, current-price picks, branch visibility, localized mobile layouts and discard protection. Run the normal unit/integration/browser suites after building workspace dependencies and importing the catalog.
