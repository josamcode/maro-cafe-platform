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

## Ownership and future administration

`features/curation/data.ts` owns ordered product references and explicit pairing relationships; it contains no duplicated prices or image URLs. `features/curation/catalog.ts` resolves these references through `getMenuItem`, removes duplicates/self-references and omits missing or mismatched identities. The name guard protects the current positional snapshot IDs; production needs stable catalog identities.

`MenuProduct`, `QuickAdd`, `ProductPairing` and `usePickActions` share presentation and selection behavior between the homepage and both menu contexts. `@maro/ui` remains presentation-only; no shared primitive API changes were necessary. Existing workbench ProductCard examples remain valid.

The shared-data/admin phase should replace these preview references with ordered, publishable relationships to authoritative products. Publication must validate prices, variants, translations, image provenance and branch availability. Selection approval and availability must not be inferred from a valid snapshot reference. No learning algorithm, sales tracking, discount bundle or submitted order is introduced here.
