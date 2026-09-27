# My Picks

September 27, 2026. Available from the product details and menu at `/menu`.

## Customer journey

Choose a published product size and select Add to My Picks. The detail dialog closes, focus returns to the product and an accessible live message announces the addition. Identical product/variant pairs merge into one line; different sizes remain separate.

After the first addition, a compact fixed action shows the total quantity and estimated amount. It includes safe-area spacing and the page reserves bottom room for it. An empty My Picks action remains available beside the result count. Opening the list allows quantity changes (1–99 per variant) and removal. Removing the final item displays an empty state; closing returns focus to the launcher.

Show to cashier changes the same dialog into a readable list of item names, sizes, quantities, unit prices and line totals. It removes editing controls and photographs, retains the estimated total and explicitly states that nothing has been submitted. Edit your picks returns to the editable list. No checkout, payment, kitchen ticket or API order is created.

Arabic and English share product identities and stored data. Theme and locale changes retain the list. Lists are local to this browser/origin, without accounts or cross-device synchronization. Branch parameters do not attach the list to a verified visit or branch inventory.

## Storage and catalog integrity

- `features/picks/model.ts` validates the versioned payload, resolves current catalog entries and derives prices. The storage payload contains only item ID, English source identity, variant label and quantity; saved prices are never trusted.
- `features/picks/use-picks.ts` owns localStorage persistence at `maro:picks:v1`, hydration-safe reads and same-origin tab notifications. Mutations read the latest stored list. Concurrent writes use normal localStorage last-write behavior; this is not a transactional cart.
- Unknown items, changed source identities, unsupported variants, invalid quantities and unsupported payload versions are discarded. Duplicate recovered variants are merged and capped. The English identity check reduces the risk of reusing snapshot index IDs for a different product; production catalog integration still requires stable identifiers.
- When device storage fails, the current tab continues with memory storage and a visible session-only notice. A reload cannot recover that memory-only list.
- There is no local consent, account or marketing collection. Production totals, tax, modifiers, availability and order submission remain server responsibilities in later work.

## Reuse and boundaries

`@maro/ui` owns the new QuantityControl and the existing Dialog, Price and actions. The design workbench includes a live quantity example. Product pictures reuse the existing media registry. Catalog and persistence logic stay outside the shared UI package.

Tests cover invalid or stale data, duplicate normalization, trusted price derivation, variant merging, refresh persistence, quantity edits, deletion, cashier presentation, localization, theme changes, tab synchronization and blocked storage.
