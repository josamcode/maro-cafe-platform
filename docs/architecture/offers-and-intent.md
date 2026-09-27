# Offers and intent measurement

Implemented September 2026 as the remaining phase-one feature foundation. No real promotion is seeded or approved by this implementation.

## Staff workflow

`/admin/offers` lists drafts, scheduled, active and ended offers. A short form contains Arabic/English titles and terms, start/end dates, participating branches and Inside/Outside/Both placement. Dates use day/month/year entry, accept Arabic digits, and are stored as ISO dates. The period is inclusive by calendar day in Africa/Cairo, including daylight-saving changes. Invalid calendar dates and reversed periods are rejected.

Save as a draft with publication off. Publishing requires explicit confirmation that MARO approved the content, dates and branches. Every subsequent published edit requires reconfirmation. Authenticated staff can withdraw an offer by turning publication off. An actor-linked before/after audit record and version comparison protect every write. Conflicts require reloading the latest version; there is no silent overwrite.

Product and offer editors reuse a shared cancel/discard interaction, browser unload protection, existing bilingual fields, custom controls, overlays and preferences. The administration navigation links Products, Offers and Engagement.

## Customer presentation

Homepage and public menu show eligible Outside offers; branch QR menus show eligible Inside offers for that branch. A quiet, flat section displays the title, full terms, dates and participating branch names. Outside actions lead to branch information; Inside actions return to the menu. Empty, unavailable, draft, future and ended results produce no promotional placeholder. The API decides eligibility; the browser refreshes at focus and every 30 seconds while visible, so already-open content can lag a change by up to 30 seconds.

Offers are informational. They do not change My Picks prices, apply a coupon, reserve stock, redeem a benefit or create an order. A visible note explains that My Picks still uses menu prices and staff confirms offer applicability at the cashier. No fabricated discounts, scarcity, bestseller claims or live promotion were added.

## Intent events

The first-party endpoint accepts only strict typed events: menu opens, branch-detail opens, directions clicks, product-detail opens, successful My Picks additions, successful complementary additions, searches, offer impressions and offer interactions. Searches are debounced and send only whether results exist. Offer impressions require at least half the offer to intersect the viewport. A pairing addition is also a My Picks addition; these are overlapping measures and must not be summed as a funnel.

An event contains a fresh random event UUID, kind, Inside/Outside context, optional branch/product/offer references and an optional search-result boolean. The server supplies its timestamp, validates references/offer eligibility, and deduplicates retries with the same UUID. There are no analytics cookies, persistent visitor IDs, account IDs, raw search queries, full URLs, referrers, fingerprint fields, IP or user-agent columns in the intent table. Standard infrastructure request logs remain separate.

Do Not Track and Global Privacy Control prevent browser collection; DNT/GPC request headers also suppress the web endpoint. Browser contexts without secure UUID support skip measurement. Tracking failures never block browsing or additions. Staff/design-system/QR-preview pages do not emit browsing metrics, but deliberately opening the public site for testing does. Staging data must be kept separate from production reporting.

The public collection endpoint is rate-limited, body-limited and rejects cross-site browser requests at the web boundary. It is still an untrusted input: bots, repeat actions, blockers, offline browsing and failed requests affect counts. No unique customer, confirmed visit, purchase, revenue, AOV or causal attribution is claimed.

## Reporting and ownership

`/admin/insights` is staff-only. It displays counts for the last 7 or 30 rolling days, filterable by experience and branch. Empty periods display zeros and an explanatory empty state. Search counts and searches with results are separate values. Unscoped Outside interactions appear in All branches, not arbitrarily assigned to a location. No customer profiles or person-level drill-down exist.

Contracts belong to `packages/contracts`, business rules and aggregation to `packages/backend`, and PostgreSQL stores offers, offer audit records and intent events. API staff authorization is shared with catalog management. Presentation and collection stay in web feature modules. No third-party tracking SDK or new queue dependency was introduced.

The indexed event table is suitable for this preview. Before a public launch, configure environment isolation, an explicit retention/cleanup policy, production rate limiting shared across API replicas, and operational monitoring. The current release does not automatically delete historical intent events or claim production-scale analytics. An aggregate warehouse/queue can be introduced when traffic warrants it, without changing the event contract.

## Next acceptance step

Phase-one feature foundations are present. Review the connected journey with MARO, confirm prices/photos/branch facts and approve any actual offer before publishing it. Establish the sales-verification source and pilot branch before implementing customer accounts, stamps or ordering. The POS provider remains unknown.
