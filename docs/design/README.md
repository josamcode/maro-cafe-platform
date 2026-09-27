# MARO design system

Status: foundation v1, September 27, 2026. Open `/design-system` in the web app for the interactive Arabic/English workbench. This foundation precedes the final homepage.

## Direction: Quiet Hospitality

The physical reference is a warm contemporary coffee bar: cream walls, dark counters and small brass details. The intended first impression is relaxed confidence. Editorial hospitality photography meets the clarity of a well-organized printed menu.

The user's direction supplies the aesthetic brief: preserve MARO's colors, learn from the collected cafe references, avoid excessive ornament, support Arabic and English, and use a coherent component system. No additional aesthetic questionnaire is necessary.

A generous split composition lets an actual MARO photograph and short copy carry the first impression. The small unexpected detail is the intimacy of real barista/service photography beside precise product decisions. Use it selectively; product photography must still show what the guest can buy.

## Evidence and interpretation

Reviewed the existing [twelve-site research](../research/MARO-Cafe-Website-References.md), reopened four official websites, and visually revisited WatchHouse and Blank Street on September 27, 2026. Maman's live page remained in an introductory transition during this revisit; use the prior documented review for its product-photography observations.

| Reference                                                               | Lesson applied                                                                  | MARO boundary                                                     |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [WatchHouse](https://watchhouse.com/)                                   | Large architectural photography, cream surfaces and restrained hierarchy        | Keep menu and visit routes visible; avoid retail-heavy navigation |
| [Maman](https://mamannyc.com/)                                          | Prior review: appetizing imagery and a recognizable atmosphere                  | No decorative floral language or introductory loader              |
| [Blank Street](https://www.blankstreet.com/en-GB)                       | One seasonal narrative with identifiable products and a next action             | No video prerequisite for finding a menu                          |
| [The Grounds Cafe](https://thegrounds.com.au/dine-in/the-grounds-cafe/) | Reopened content: menu, visit details and directions answer practical questions | Only offer operationally supported actions                        |

These are design inferences, not evidence of measured conversion uplift. Competitor assets and trade dress are not copied into MARO.

## Foundations

The executable source is [tokens.css](../../packages/ui/src/tokens.css). Styles consume those tokens in [styles.css](../../packages/ui/src/styles.css).

- Preserve identity anchors: ink `#0C0B0A`, cream `#F4ECDF`, gold `#C9A876`. Add paper `#FBF8F2` for spacious surfaces.
- Use ink for primary actions and text. Gold is an accent on dark surfaces or a small decorative detail. It is not small text on cream.
- Muted text `#655D51`, control borders `#8B7D69` and focus `#79603A` are functional colors. Subtle dividers are not control boundaries.
- Color roles distinguish surfaces, text, actions, focus, feedback and borders. Keep error/success meanings consistent.
- Typical light page balance: roughly 75–85% paper/cream, 10–20% ink/photography, under 5% gold decoration. This is a composition guide, not a literal pixel quota.
- English interface: DM Sans. English editorial headings: Newsreader. Arabic: IBM Plex Sans Arabic, including headings. Equal hierarchy does not require identical font metrics.
- Arabic has no letter spacing or forced uppercase. Use more generous line height and allow labels to wrap.
- Body text is 16px. Main controls are 48px high; compact controls and chip targets are at least 44px.
- Spacing uses a 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96px.
- Controls have 4px corners; surfaces 8px; circular icon actions and filter/switch pills are explicit variants. Hero imagery now uses modest 24–32px corners rather than a deep arch.
- Shadows identify floating layers only. Avoid shadows around every card.
- Motion is limited to 160ms color/state transitions. No scroll hijacking, confetti, looping ornaments or animated counts. Respect reduced motion.

Fonts are loaded through Next's Google font integration, served locally by the built app. A fresh build requires font download access. Font choices are based on [IBM Plex Sans Arabic](https://fonts.google.com/specimen/IBM+Plex+Sans+Arabic), [DM Sans](https://fonts.google.com/specimen/DM+Sans) and [Newsreader](https://fonts.google.com/specimen/Newsreader).

## Component ownership

`packages/ui` owns presentation. Feature folders own orchestration and content. Server packages own business rules. The same presentational primitives can serve the outside experience, inside menu and future administration with appropriate density.

| Layer                 | Implemented components                                                                  |
| --------------------- | --------------------------------------------------------------------------------------- |
| Layout                | Container, Stack, Inline, Grid, Section, Surface, Divider                               |
| Type and data         | Heading, Text, Label, Badge, Price                                                      |
| Actions               | Button, IconButton, FilterChip                                                          |
| Forms                 | Field, Input, Textarea, Select, Checkbox, Switch, RadioGroup                            |
| Complex interactions  | Dialog, Tabs                                                                            |
| Patterns and feedback | ProductCard, CollectionCard, SummaryRow, StartingPrice, HeroMedia, EmptyState, Skeleton |

Button keeps its existing `default`, `outline` and `asChild` API; `quiet` and size variants extend it. ProductCard and CollectionCard accept image and action slots, allowing Next Image and routing without coupling the shared package to Next. CollectionCard places a round, labelled action beside its summary and a prominent StartingPrice on its photograph; this price is a collection minimum. SummaryRow also supports compact branch entries. Dialog supports controlled navigation dismissal as well as uncontrolled menu triggers.

Use native labels, buttons, inputs, fieldsets and landmarks under custom visuals. A styled native checkbox remains preferable to a clickable div. Radix handles select keyboard/typeahead behavior, tabs and modal focus management; MARO supplies their appearance. See [Select](https://www.radix-ui.com/primitives/docs/components/select) and [Dialog](https://www.radix-ui.com/primitives/docs/components/dialog).

Do not add every conceivable component now. Date pickers, data tables, toasts, comboboxes and pagination should extend this system when a real feature requires them. Shared abstractions should encode repeated behavior or design, not merely rename HTML.

## Localization

The workbench has an English editorial shell and an explicitly localized Arabic/English region. Portal direction and language must be explicit because portals leave that region. The outside homepage now has document-level `lang/dir`, translated metadata and a persisted preference; locale URLs and full application localization remain future work. See the [homepage handoff](outside-homepage.md).

The first visit follows supported browser language preferences and device color scheme. Explicit selections take priority and persist in cookies. Theme changes use one light/dark toggle; device preference is only the automatic initial state, with no third UI choice. Shared semantic color tokens use CSS `light-dark()` with `color-scheme`; brand ink/cream/gold anchors remain constant. Review controls, menus and overlays in both appearances. Mobile typography uses a smaller responsive scale; native text inputs remain 16px for usability.

- Keep UI copy outside component implementations in typed dictionaries.
- Use logical properties: inline/block, start/end. Do not manually reverse array order to simulate RTL.
- Mirror directional navigation arrows. Do not mirror logos, photographs, play icons or other nondirectional symbols.
- Isolate prices and identifiers with `bdi`. Phone inputs use LTR independently of page direction.
- Format prices with `Intl.NumberFormat` for ar-EG/en-EG. Production totals must derive from authoritative server data.
- Test real Arabic phrases and English expansion, including long product names and validation messages.

## Voice

The voice is welcoming, calm and specific: natural Egyptian Arabic without street slang, excessive familiarity, forced jokes or claims about social class. English conveys the same intent rather than translating word for word.

Use short action labels and explain what happens next. Describe taste and texture only when the recipe is known. Error copy should name the problem and offer a next step without blaming the customer. Offers must have real eligibility and validity.

The Arabic/English examples live in [messages.ts](../../apps/web/src/features/design-system/messages.ts). This keeps authored documentation in English and localized copy in its proper home.

## Workbench and review

The preview includes live filtering, saving a local pick, branch selection, radio sizes, independent consent and preference controls, form states, tabs, and a modal. These are local interaction demonstrations; no checkout, account, marketing consent or persistence is wired.

Preview image provenance:

- `maro-mood.jpg`: [MARO Facebook photo 1355933763419483](https://www.facebook.com/photo/?fbid=1355933763419483).
- `maro-drink.jpg`: [MARO Facebook photo 1078060874540108](https://www.facebook.com/photo/?fbid=1078060874540108).

Sample product identity and EGP 85 price are explicitly marked as demonstration content; the photograph does not establish its recipe. Only selected preview copies are placed in public assets; the source archive remains separate.

Before accepting a component change, check focus, keyboard behavior, accessible naming, error association, disabled state, empty/loading behavior where relevant, long text, both directions, 360px mobile and desktop. Ensure overlays inherit typography and direction. Automated checks supplement a real visual review.

The outside homepage is now composed from these foundations, including the shared arched `HeroMedia` pattern. Next: review the page, confirm catalog details and product photography mapping, then build the QR inside journey on the same components.

See [verification results](verification.md) for completed checks and remaining coverage.
