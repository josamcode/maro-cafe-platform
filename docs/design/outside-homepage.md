# Outside homepage preview

September 27, 2026. Route: `/`. Shared patterns: `/design-system`.

## Visitor journey

The homepage moves from a welcoming first impression to menu discovery, atmosphere and branch discovery. The primary hero action links to the standalone searchable `/menu` page; the secondary action leads to the branch section. Whole category cards link to that page with the relevant category selected. Branch rows now link to individual detail pages and retain a separate immediate Maps action. Public navigation opens `/branches`; an optional inside-entry prompt is available in the branch section. See the [menu handoff](menu-experience.md) and [branch discovery](branch-experience.md). Contact and social links are functional.

After UI review, collection actions sit beside the name/description and starting prices appear on opaque panels over the photographs. The locations section uses a dark rounded panel with reusable branch summaries and separate direction links. A single-row sticky mobile header centers the wordmark between navigation and language actions; navigation opens in the shared dialog. The original D010 treatment is superseded for branches by D019.

The hero uses the shared `HeroMedia` component: a main photograph with modest rounded corners, a smaller rounded detail photograph, a plain caption and space between imagery and copy. It replaces the previous edge-to-edge rectangular split in both the homepage and workbench. Rounded media does not change the compact shape of functional controls.

No active offer, bestseller ranking, customer review or opening-hours claim is displayed without supporting business data. Photography illustrates collections, not a verified SKU-to-photo mapping. The page is a private presentation preview, with search indexing disabled.

## Sources and content boundaries

The menu snapshot at `apps/web/src/content/menu.snapshot.json` contains 126 bilingual items in six categories, extracted as literal data from the public [MARO menu source](https://maro-cafe-3.vercel.app/MARO.js), captured September 27, 2026. The source script was parsed without execution. Prices remain subject to owner confirmation; the visible menu communicates this. Collection starting prices are derived from this snapshot, not repeated manually. Snapshot index IDs must not become ordering or database identifiers.

The published branch links are recorded in `assets/maro/metadata/branches.json`. Main Haram has conflicting street numbers across sources; the preview uses the general street/area and a Maps link. Other branch cards also use area-level descriptions consistently.

Selected local photo copies retain these sources:

| Public asset                   | Source                                                                                  |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| `/design-system/maro-mood.jpg` | [MARO Facebook 1355933763419483](https://www.facebook.com/photo/?fbid=1355933763419483) |
| `/home/iced-coffee.jpg`        | [MARO Facebook 1077973387882190](https://www.facebook.com/photo/?fbid=1077973387882190) |
| `/home/milkshake.jpg`          | [MARO Facebook 1077974971215365](https://www.facebook.com/photo/?fbid=1077974971215365) |
| `/home/coffee-moment.jpg`      | [MARO Facebook 969136968765833](https://www.facebook.com/photo/?fbid=969136968765833)   |

The mood image is reused from its existing public path to avoid duplicating the binary. The archive and manifest remain the source evidence. Final publication still requires brand approval of asset use and current menu details.

## Implementation ownership

- `@maro/ui`: visual tokens, typography, layout primitives, controls, `HeroMedia` and accessible dialogs. Dialog content scrolls separately so the close control remains reachable on long menus.
- `features/home`: outside composition and preference actions. Shared header/footer composition lives in `features/site`; menu browsing lives in `features/menu`.
- `content/menu.snapshot.json`: temporary source-listed content adapter for the presentation. No checkout, inventory or pricing authority is implied.
- API, database and workers retain their existing independent architecture. Replace the snapshot at the feature/data boundary with validated catalog responses when content is approved. Do not move business logic into shared UI.

## Language and future work

Language follows the browser's highest-priority supported Accept-Language entry unless a valid `maro-locale` preference exists. Arabic is the unsupported-language fallback. Theme follows device color scheme unless a light/dark `maro-theme` preference exists. Server actions persist explicit choices. A single button toggles light/dark directly; device default is automatic before an explicit choice and is not a third UI option. Document language, direction and homepage metadata follow the resolved language. Routes remain dynamic during the preview. Dialog portals receive language and direction explicitly. The workbench shell has an explicit English region; customer journeys use the resolved locale.

Before a public launch, introduce addressable locale URLs and hreflang/canonical metadata, verified operational data, real product photography mappings and visit-conversion analytics. QR entry, My Picks, public branch details and explicit inside entry are implemented for preview. Product curation, approved pairings, offers and shared content administration remain phase-one work. Purchase/loyalty integrations are later phases; the POS provider remains unknown.
