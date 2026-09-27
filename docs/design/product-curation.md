# Product curation and optional pairings

September 27, 2026. Private preview, pending MARO's editorial and operational approval.

## Customer journey

The homepage's MARO Picks section now shows Espresso, Iced Spanish Latte and Strawberry Matcha Latte, replacing category-level cards. Names, starting prices, variant choices and photographs resolve from the same menu adapters as Inside and Outside. Full-card details and separate quick-add buttons reuse MenuProduct and the existing shared ProductCard; no second purchase or selection flow is introduced.

Desktop uses three restrained photograph-led columns. Mobile uses flat thumbnail rows with dividers, avoiding nested cards and a long photographic feed. The full-menu action sits next to the introduction and precedes the products on mobile. The existing My Picks launcher works on the homepage, including cashier presentation and persisted selections.

Product details for explicitly selected coffees offer water as a separately priced optional extra before the main product action. Both published water sizes are exposed with their own prices and plus buttons. The recommendation has no enclosing card or nested dialog. Adding it retains the chosen coffee size and keyboard focus, announces the actual item added, and never silently adds the coffee. The guest can skip it entirely. Each addition uses the existing quantity, storage and validation rules.

## Content boundaries

- Featured selections are editorial demonstration content, not verified bestsellers, new launches, branch availability or personalized recommendations.
- The captured catalog has beverages only. It does not provide priced dessert products. Do not create a cheesecake, croissant or waffle SKU from a photograph or invent its price.
- Water is a modest demonstration complement for explicitly listed coffees. No recommendation is shown for unrelated or unconfigured products. The current maximum is one complementary product, avoiding a second menu inside the dialog.
- Product photographs remain the same labelled development references. The pairing row uses text and actual prices rather than an unrelated photograph of a drink pretending to depict water.
- Source-listed prices and this editorial selection still require owner approval before public launch. Add priced dessert records to the authoritative catalog before extending the pairing list.

## Shared data and administration

Ordered homepage placement and pairing relationships now live in PostgreSQL and can be edited in `/admin`. `features/curation/catalog.ts` resolves stable product UUIDs from the shared API catalog, omitting unavailable and self references. Prices and photos are never duplicated in curation rules. Initial demonstration selections are archived under `scripts/catalog-source/curation.ts` for import only.

`MenuProduct`, `QuickAdd`, `ProductPairing` and `usePickActions` share presentation and selection behavior. Publication validates translations, positive prices and catalog references; staff explicitly confirms photo identity. No learning algorithm, sales tracking, discount bundle or submitted order is implied. Owner approval remains required.
