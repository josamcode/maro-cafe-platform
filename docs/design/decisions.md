# Design decision log

## D001 — Preserve colors, rebuild hierarchy

Date: 2026-09-27. Status: implemented, awaiting visual review.

The existing MARO identity remains ink, cream and muted gold. A paper surface and readable functional neutrals support the interface. Gold is restrained; imagery and whitespace establish quality. This follows the user's explicit direction and the reference analysis, rather than copying the current site's presentation problems.

## D002 — One shared UI library

Date: 2026-09-27. Status: implemented.

Tokens, layouts, typography, controls and reusable product patterns belong to `@maro/ui`. Feature-specific composition remains in `apps/web/src/features`. Business rules never enter the UI package. This supports future clients and administration without coupling API/database/workers to a visual framework.

Reuse means one definition for repeated behavior and design. It does not mean speculative generic components for every HTML element. New needs should extend existing variants or compositions first.

## D003 — Custom appearance with accessible semantics

Date: 2026-09-27. Status: implemented.

Native form semantics are retained under authored styles. Select, Dialog and Tabs use Radix primitives for complex interaction behavior, with MARO-owned visuals. Unstyled browser widgets and inaccessible div-based replacements are both unacceptable. Styling lives beside the shared components, not scattered through feature pages.

## D004 — Arabic is a first-class layout

Date: 2026-09-27. Status: foundation implemented; full locale routing deferred.

Arabic uses IBM Plex Sans Arabic; English uses DM Sans and Newsreader. Logical CSS and explicit portal direction support RTL. Copy lives in typed dictionaries; prices use locale formatting and bidi isolation. The workbench demonstrates both languages without claiming the whole scaffold has been localized.

## D005 — Editorial hospitality, practical conversion

Date: 2026-09-27. Status: foundation implemented.

Outside guests need desire and a clear visit/menu action. Inside guests need immediate product discovery, prices and choices. Both experiences share controls and tokens, while composition and density differ. Retention is a later lifecycle, not another homepage persona.

## D006 — Calm Egyptian voice

Date: 2026-09-27. Status: examples implemented.

Arabic should be familiar to Egyptian guests, respectful and concise. Avoid street slang, inflated exclusivity, fake urgency and excessive punctuation. Product and offer claims require real evidence. English matches the intention in natural language.

## D007 — Workbench before page expansion

Date: 2026-09-27. Status: implemented.

A dedicated `/design-system` route exposes the visual direction and real component interactions before the complete landing page is assembled. Prices and selections are demonstrative. This keeps review focused and makes the shared foundation concrete.

## D008 — Softer photography and an outside homepage

Date: 2026-09-27. Status: implemented for private preview.

The user rejected the rigid half-width rectangular hero image. Introduce shared `HeroMedia` with an arch, a rounded overlapping drink detail and asymmetric page proportions. Update both the workbench and outside homepage. Keep imagery calm and legible; no animated ornaments or decorative badges.

The outside page now composes menu discovery, atmosphere and directions from the shared design system. A reusable menu browser serves navigation, hero and collection entry points. Source-listed collection prices replace demonstrative prices on the homepage; the workbench remains explicitly demonstrative.

## D009 — Persisted bilingual presentation

Date: 2026-09-27. Status: implemented; locale URL routing deferred.

Extend D004 with server-rendered document language/direction, translated homepage metadata and a functional preference cookie. Default to Arabic. A cookie-driven dynamic route is appropriate for the private preview; indexable locale URLs remain a launch requirement. Existing English scaffold routes are marked explicitly rather than presented as fully translated journeys.

See [outside homepage handoff](outside-homepage.md) for source provenance, data boundaries and next integration steps.

## D010 — Compact discovery, visible prices and mobile navigation

Date: 2026-09-27. Status: implemented for review.

Following user review, move each collection action beside its name and description. Use a labelled circular icon button with an arrow that mirrors in RTL. Present the source-derived starting price in an opaque paper panel over the photograph, with a larger amount and an explicit “From” qualifier. This is a collection minimum, not the price of the pictured item.

Add shared `CollectionCard`, `SummaryRow` and `StartingPrice` patterns; use the same summary layout in the locations section and demonstrate them in the workbench. `IconButton` gains a round variant and `Dialog` supports controlled open state.

Replace the sparse three-column locations section with a dark, rounded panel: a short introduction beside three compact location rows. Each entire row opens its existing Maps destination. No approximate map, invented hours, travel times or branch-specific photographs are introduced.

On mobile, use a single sticky header row with a centered wordmark, a compact language action and a labelled navigation control. Navigation uses the shared accessible dialog, closes after choosing a section and retains keyboard dismissal. Section scroll offsets account for the sticky header. Desktop navigation remains directly visible.

The landing page is still under design/content review. Completion percentages communicated in conversation are subjective presentation-readiness estimates, not production acceptance criteria. Release still needs verified content, locale SEO, performance/accessibility review and conversion instrumentation.

## D011 — Device defaults, persistent choices and a smaller mobile scale

Date: 2026-09-27. Status: implemented for review. Supersedes D009's Arabic-by-default behavior and D008's deep arch treatment.

Resolve language on the server from a valid explicit cookie first, then the highest-priority supported language in the browser's Accept-Language header. Arabic remains the fallback when no supported language is supplied. Detect theme using CSS color-scheme and light-dark tokens from the first paint; an explicit light/dark cookie overrides the device preference. The appearance control includes a device-default choice, and the footer can reset both preferences. Server actions validate and persist choices without adding localStorage or a competing client-side source of truth.

Full-card collection activation uses a stretched semantic button hit area, with one keyboard stop, no nested interactive elements and a card-level focus outline. Keep the compact visible arrow beside the title. Move the full-menu CTA below the collection grid, centered with its supporting note.

Reduce the mobile type scale, spacing and photo height while retaining 44px action targets and 16px input text. Hero actions share two equal columns at common phone widths. Replace the deep arch with modest rounded corners on the shared hero media. The footer now groups branded social/contact icons with labels and separates preview information from preference reset.

The menu dialog remains a functional discovery preview. A final menu experience, verified item imagery/details and operational ordering are separate work, not implied by landing-page visual polish.

## D012 — Direct light/dark toggle

Date: 2026-09-27. Status: implemented. Supersedes D011's three-choice appearance dialog and preference reset control.

The user requested a single-click toggle with only light and dark outcomes. Before an explicit choice, CSS follows the device scheme. The toggle reads that effective scheme, switches to its opposite and persists the result. Subsequent device changes do not override an explicit choice. A labelled sun/moon icon button exposes its dark-mode state with aria-pressed; no appearance dialog or device-default choice is presented. Language continues to follow the browser initially and retains manual changes.

## D013 — A standalone menu with focused product details

Date: 2026-09-27. Status: implemented for private preview. Supersedes the full-menu modal described in D008 and D011.

Route all homepage menu entry points to `/menu`, preserving collection selection in the URL. Keep category and bilingual search state shareable and persistent through locale changes. Use focused accessible dialogs for published product sizes and prices. Extend ProductCard with optional media and a compact presentation, rather than create a second card system; demonstrate it in the workbench. Extract the existing header/footer into one shared site composition.

Use typographic cards until item photography can be reliably mapped. Do not reuse a category photograph as evidence of a specific recipe. A branch query parameter supplies preview context only, not verified presence or stock. My Picks and operational ordering remain later stages. See [menu handoff](menu-experience.md).

## D014 — Illustrative photography during development

Date: 2026-09-27. Status: implemented for preview. Supersedes D013's decision to keep unmatched product cards text-only.

The user explicitly requested images on categories and products and authorized repeating suitable temporary photographs. Use existing MARO archive images, item-specific visual candidates where available, and category fallbacks elsewhere. Keep sources and verification status in a central feature mapping; do not misclassify a plausible match as an approved SKU photograph. Extend the existing ProductCard's compact media layout and demonstrate it in the workbench. Mobile uses side thumbnails to protect browsing density; desktop uses landscape images. See [photography mapping](menu-photography.md).

## D015 — Collapsed mobile categories and a compact search bar

Date: 2026-09-27. Status: implemented for preview.

The unfiltered mobile menu starts with six closed category disclosures. Each photo/title/count row toggles its own products. Direct category links and search matches open the relevant sections automatically; clearing the filters returns to the closed overview. Desktop keeps its expanded catalog and category chips. One product tree serves both layouts.

The shared Disclosure component uses labelled semantic buttons with expanded state and controlled panel IDs. CSS applies the mobile-only behavior from the first paint, without viewport hydration changes. The menu demonstrates it alongside an interactive workbench example.

Follow-up review rejected nested cards. Category disclosures therefore use flat thumbnail/title rows with a bottom divider, without an enclosing border or surface; the product cards appear beneath the row when opened.

On mobile only the search input remains sticky below the header. Its label remains accessible but visually hidden; the hint and duplicate category chips no longer take vertical space. Shared scrollbars use slim rounded neutral thumbs, transparent tracks and no arrow buttons where the browser supports custom scrollbar styling; Firefox retains its thin native implementation.

## D016 — Local picks before operational ordering

Date: 2026-09-27. Status: implemented for private preview.

Give guests a persistent shortlist of exact product/variant selections without requiring an account. Use one floating summary after the first addition, a shared quantity control and a focused editable dialog. A cashier view presents the same selections without editing controls and explicitly identifies them as unsent choices.

Store validated identities and quantities locally, derive current prices from the catalog adapter, and retain selections through language/theme changes. Recover safely from invalid data and explain actual device-storage failures. No order or visit is inferred from the list. See [My Picks handoff](my-picks.md).

## D017 — Direct addition from menu cards

Date: 2026-09-27. Status: implemented for preview.

Remove the menu card's redundant details arrow. Single-price products expose a plus action; multi-size products expose a separate plus action with each published size name. Both paths use the same picks mutation as the detail dialog, retain keyboard focus and provide brief visual confirmation. Quantity-limit failures appear beside the actions.

Extend ProductCard with a separate details slot for its full-card semantic trigger. Quick actions are sibling buttons layered above that trigger, never nested buttons or whole-card click handlers. Keep the existing dialog accessible from the image, title and remaining card area. Demonstrate the split interaction in the shared workbench.

## Record maintenance

Append a dated decision when changing identity, typography, reusable behavior, locale strategy or component ownership. Update the workbench and relevant verification. Supersede previous records explicitly instead of silently overwriting rationale.
