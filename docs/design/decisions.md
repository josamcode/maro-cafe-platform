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

## Change protocol

Append a dated decision when changing identity, typography, reusable behavior, locale strategy or component ownership. Update the workbench and relevant verification. Supersede previous records explicitly instead of silently overwriting rationale.
