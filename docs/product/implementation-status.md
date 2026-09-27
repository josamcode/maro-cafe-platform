# Implementation status

September 28, 2026. Use [Product Direction v2](MARO-Product-Direction-v2.md) for product intent and this record for progress. A working preview is not production acceptance.

## Phase one

| Capability                                                      | Current state                                                                                                                          |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Shared visual system, Arabic/English and appearance preferences | Implemented and exercised in the workbench and customer journeys                                                                       |
| Outside homepage                                                | Implemented preview with three actual curated products, prices, sizes and direct additions                                             |
| Searchable menu, photos, actual published variants              | Implemented using source-listed data and labelled illustrative photos                                                                  |
| My Picks and cashier presentation                               | Implemented locally; no submitted order                                                                                                |
| QR inside entry and branch correction                           | Implemented with downloadable preview codes; needs a reachable origin for phone scanning                                               |
| Public directory and branch details                             | Implemented with source-listed addresses, immediate directions, general contact and honest content limits                              |
| Explicit outside-to-inside entry                                | Implemented via optional branch choice, preserving menu filters and local selections                                                   |
| Curated products and relevant pairings                          | Implemented editorial preview; coffee/water pairing uses catalog prices. Selection approval and priced dessert data remain pending     |
| Active offers                                                   | Offer management and context/date/branch eligibility implemented; no real offer approved or published                                  |
| Authoritative shared catalog and administration                 | Implemented: database/API catalog, authenticated product editor, image upload, prices, availability, recommendations and audit records |
| Intent measurement                                              | Implemented anonymous intent counts, search-result signals and staff filters; no sales/visit claims                                    |

## Next work

The phase-one feature foundation is implemented, including offers and intent reporting. Next is a connected review with MARO, confirmation of catalog/branch facts and actual offer terms, plus deployment readiness. Product/offer administration is available; branch-address/category editing and branch-scoped staff roles remain optional management extensions. A production rollout still needs durable image storage, analytics environment isolation/retention and hosting configuration. Source-listed prices, photography and operational facts require owner confirmation.

Do not begin purchase-linked accounts, stamps or ordering until the sales-verification source and pilot operating process are agreed. See [offers and intent](../architecture/offers-and-intent.md).

## Later phases

Purchase verification, optional accounts, stamps and a single communication channel depend on an agreed sales-verification source. Digital ordering is a later controlled operational pilot. The POS provider remains unknown. No preview feature grants a reward, submits an order or records a verified visit.
