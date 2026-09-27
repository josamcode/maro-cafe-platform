# Menu discovery preview

September 27, 2026. Route: `/menu`.

## Implemented journey

Homepage navigation, hero actions and whole collection cards now link to a standalone menu. A category entry such as `/menu?category=iced` opens that category directly. The former full-menu dialog is removed; dialogs now contain one product's actual published price options.

Search matches both language names, ignores Arabic diacritics and tatweel, and matches every entered word within the selected category. Search and category selection live in URL parameters so reloads, shared links and language changes retain the selection. Category changes add browser history entries; typing replaces the current entry. Clearing all filters preserves branch context. Invalid category parameters fall back to all categories.

Cards use the shared compact ProductCard presentation with the item name, a prominent price and published option labels. Multiple-price items show an explicit starting-price qualifier. One semantic button stretches across each card, with keyboard focus, Escape dismissal and focus restoration. The detail dialog lists every published option and updates the selected price. A single published price does not imply a verified physical size.

On mobile the unfiltered menu starts with closed category rows. Each row includes its thumbnail, name, item count and expansion control. Search matches and direct category entry open the relevant groups automatically. Only the labelled search field stays fixed below the header; its label is visually hidden and category chips are replaced by the collapsible list. Desktop keeps expanded categories and its filter strip. Small-height screens use normal document flow. Arabic/English and light/dark use the same shared shell and preference behavior as the homepage.

## Data and integration boundary

`features/menu/catalog.ts` adapts the existing local snapshot: 126 bilingual items, six categories and 198 price entries. All prices await owner confirmation. This is a menu presentation, not branch inventory or an operational ordering system. Indexed snapshot IDs must not become transaction identifiers.

`/menu?branch=faisal`, `?branch=sahl-hamza` and `?branch=main-haram` support branch-labelled preview links suitable for a future QR entry. Unknown branch values display no branch label. A supplied branch parameter is context only: it proves neither a physical visit nor branch-specific availability. The existing API-backed `/in/[branchSlug]` scaffold is unchanged; replacing that journey with authoritative catalog data is later integration work.

At the user's request, products now use temporary illustrative photography, including repeated category images. Some item-specific visual candidates are mapped, with verification status retained in the central media registry. See the [photography mapping](menu-photography.md). Ingredient descriptions, availability and recommendations are not fabricated. The source's unusual Avocado entry under Hot Coffee is preserved for owner review. A launch-ready catalog needs confirmed item identities, classifications, variants, prices and photo mapping.

[My Picks](my-picks.md) now saves product/variant choices locally, supports quantity editing and presents an unsent list to the cashier. Pairing recommendations, accounts, checkout, rewards and POS integrations remain later phases. No order action is simulated here.

## Ownership

- `@maro/ui`: ProductCard presentation, Price, controls and accessible Dialog. RadioGroup accepts a rendered label so option prices reuse Price formatting.
- `features/site`: one shared homepage/menu header and footer; no duplicated preference forms or social controls.
- `features/menu`: catalog adapter, URL filtering, messages and product-detail composition.
- `content/menu.snapshot.json`: unchanged source evidence, replaceable by an authoritative adapter.

Before connecting commerce, map stable API item/variant identifiers and server-authoritative prices; keep ordering and branch rules outside the UI package.
