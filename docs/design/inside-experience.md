# Inside MARO and branch QR preview

September 27, 2026. Private presentation preview; no operational order submission.

## Entry and customer journey

- `/in/faisal`, `/in/sahl-hamza` and `/in/main-haram` open the shared bilingual catalog immediately. The route owns the branch label. A branch selector allows correction while retaining search, category and local picks. Unknown slugs show a localized recovery page rather than invent a branch.
- The compact sticky header provides a menu anchor, search focus, My Picks count, theme toggle and language switch. My Picks stays in the header in this experience; its dialog retains totals, quantities and the cashier presentation. The outside menu retains its floating summary. Both consume the same storage and business logic.
- Mobile categories remain closed initially. Search is the only sticky catalog tool beneath the header. The footer links clearly to the public website. A short viewport uses normal header/search flow to preserve usable space.
- Language and theme retain the existing device defaults and explicit cookie choices. No English-only inner layout overrides document direction. Locale changes preserve the current route and query.

The QR selects a browsing context only. It establishes no verified physical presence, purchase, visit count, stock availability, table assignment or reward. There is no account prompt. The catalog and prices remain source-derived preview data awaiting owner confirmation.

## QR preparation

Open `/preview/qr` for the three branch links, QR images, downloadable SVGs and a short presentation walkthrough. This is an English internal demonstration page with no customer navigation entry and no indexing. It is not access-controlled; do not put confidential data there.

QR codes are generated server-side with `qrcode`, use a four-module white quiet zone and medium error correction, and contain the branch URL only. Their destination comes from the existing `WEB_ORIGIN` environment setting, never an arbitrary request host. SVG responses use no-store caching so restarting with a new origin yields fresh codes. Unknown branch downloads return 404.

For a phone demonstration, set `WEB_ORIGIN` in the environment to the reachable HTTPS preview origin (or an appropriate LAN HTTP origin), restart the app and download fresh QR files. With `http://localhost:3100`, links work on the development computer but a phone scan points at the phone itself. The preview page states this limitation. Do not print permanent materials before the final domain and branch details are approved. Confirm actual scanning on target phones and physical print size before release.

## Presentation walkthrough

1. Open the public homepage and show the menu discovery, product prices and branch directions.
2. Open the QR preview and choose a branch, or scan its code from a phone once the origin is reachable.
3. Add a single-price item or a specific size directly from its card.
4. Change the branch, switch language, and show that selections remain available on the same browser.
5. Open My Picks, change quantity, then show the cashier view and its explicit unsent status.
6. Return to the public site through the footer link.

Picks do not transfer between the presentation computer and a phone. Reuse is per browser/origin; changing the origin is a different storage scope.

## Architecture and next boundaries

The inside route replaces the original plain API-backed scaffold with the same snapshot adapter used by the outside menu. It deliberately does not mix snapshot IDs/prices with API variant IDs. API, database and worker packages remain intact; the API menu endpoint continues to own authoritative branch availability and prices for future integration. Connect both customer experiences through one authoritative catalog adapter when stable bilingual product/variant identities are ready.

`features/inside` owns the compact navigation, branch selection and QR generation. Shared site preferences were extracted once; menu rendering, quick-add behavior, product details and picks are reused. This phase introduces no separate menu tree, cart store or commerce rules in `@maro/ui`.

Before operational ordering: confirm prices, photographs and branch names with MARO; agree how staff receive/acknowledge requests; connect server-authoritative catalog and stable identifiers; then implement actual order state and fulfillment. Retention and rewards need verified purchases later.
