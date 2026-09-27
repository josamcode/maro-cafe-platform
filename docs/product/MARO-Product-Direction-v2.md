# MARO — Product Direction and Implementation v2

> Outside MARO → Bring them in. Inside MARO → Make choosing easier and increase the value of their experience. After the visit → Maintain the relationship and bring them back.

This document records the direction defined by the project owner: **only two digital experiences, plus a relationship lifecycle after the visit**. It is the latest reference wherever the experience segmentation in the previous strategy document conflicts with it. The audit remains the reference for problems, and earlier details remain valid where they align with this direction.

These are proposed implementation specifications, not a description of features already built or data currently available.

## 1. The Approved Model

| Component | Goal | Journey |
|---|---|---|
| Outside Experience | Convert interest into a visit | Discover → Desire → Trust → Choose branch → Visit |
| Inside Experience | Make purchasing easier and increase order value | Discover → Choose → Relevant upsell → Order → Optional relationship capture |
| After-visit lifecycle | Increase return visits and repeat purchases | Verified purchase → Customer relationship → Relevant communication → Return → Purchase |

Retention is not a third website mode. When launched, the account is a shared function accessible from the customer's current experience, rather than a separate experience of its own.

Products, branches, prices, and images come from one catalog. Presentation, navigation, and the primary action differ between Inside and Outside.

## 2. Outside Experience — Bring Them In

### Entry

General entry from Google, Instagram, or the website link opens the outside experience. A product, offer, or branch link opens that destination within this experience, without requiring a detour through the homepage.

### Homepage Order

1. A compact header with MARO branding and primary navigation.
2. A hero with a real product photo and a short statement; the primary action is "Choose a branch and visit us," with "View menu and prices" as the alternative.
3. MARO Picks: selected products with images and prices.
4. An active visit offer, when available, with its terms and participating branches.
5. Photos of the venue, seating, and preparation.
6. Branches: area, hours, services, and directions.
7. Social proof from an identified source; branch-specific trust evidence can also appear within the branch card or page to bring it closer to the decision.
8. A practical ending for visiting and contacting the café, with a brief link to MARO's story.

The general visit button leads to branch selection. Once a branch is selected, the action becomes "Directions" for that branch. Do not call a branch "nearest" without an area selection or location data shared with the customer's permission.

### Navigation

Menu — Branches — Offers — About MARO — Visit/Directions.

Ordering through Talabat remains a secondary channel available in the appropriate context, without becoming a third experience or competing with the primary goal of a visit.

### Success Criterion

Customers understand what we offer, the price level, and the seating experience, and can easily find a suitable branch and its directions.

## 3. Inside Experience — Make Purchasing Easier

### Entry

The branch QR opens the menu directly with branch context. Table context can be added when the codes are configured for it.

Initial screen order:

**Small brand mark + branch/table name → Search and categories → Products with images and prices.**

No marketing hero or brand-story introduction. Products stay close to the start of the screen, even when recommendations or offers are present.

### Content and Actions

- MARO Picks, Signature, and New labels based on approved data.
- Best Sellers once sufficient sales data exists, with its scope and period defined internally; until then, use "MARO Picks."
- Clear search and categories, with the browsing position restored when returning from a product.
- Images, prices, sizes, and descriptions that support comparison.
- Product details with one relevant pairing suggestion, including its price, that is easy to skip.
- In-store offers with clear terms and availability.
- My Picks now; Cart/Order once order receiving and operations are ready.
- Add-ons and customization when supported by the product and operations can fulfill them.

### My Picks in the First Release

A local selection list that lets customers review items, sizes, and quantities and see the sum of known prices. Any total is based on the displayed branch data and is reviewed with staff; it is not presented as payment or order confirmation.

Persistent copy within the list:

> These are your selections to show a staff member. Your order has not been sent yet.

When digital ordering is enabled, prices and availability are rechecked before submission, and receipt and preparation states become clear.

### Navigation

Menu — Search and categories — My Picks/Cart — Branch offers — Help.

Search and categories are tools within the menu; each function does not need a separate tab. The My Picks summary appears after selections exist, with reserved space so it does not obscure products.

### Success Criterion

Customers find what suits them, compare easily, understand the cost of additions, and know how to complete the order. Increases in order value are measured from confirmed purchases while monitoring margin and ease of use.

## 4. Identifying and Changing Context

Proposed routes, not implemented links:

| Destination | Example |
|---|---|
| Outside homepage | `/` |
| Outside menu | `/menu` |
| Product | `/products/iced-latte` |
| Branch page | `/branches/faisal` |
| In-store QR entry | `/in/faisal` |
| Table entry | `/in/faisal?table=12` |

- The current link context and explicit choice take precedence over previously saved context.
- General entry does not switch to Inside merely because the customer scanned a QR during an earlier visit.
- The outside experience includes an unobtrusive "Are you at MARO now?" option, allowing branch selection without a mandatory popup.
- The inside experience allows branch changes or an "I'm outside the branch" selection through a small menu.
- Internal navigation to a product preserves context. Public sharing does not expose the table number or visit session.
- A QR code identifies the display context; it does not by itself prove presence or purchase. A table number alone does not authorize submitting an order to that table.

## 5. After the Visit — Link the Purchase to the Customer

The right moment to identify a customer comes in exchange for a clear benefit, after a confirmed purchase or when they request a saved feature that requires an account.

Example:

> Claim your first stamp on your account, and keep working toward your reward on future visits.

Proposed journey:

**Confirmed qualifying transaction → Invitation to save the reward → Phone number and OTP when needed → Link transaction to account → Grant the entitlement once.**

The OTP proves control of the phone number. The transaction source proves the purchase. Creating an account or saving selections is not recorded as a visit or purchase.

The source of sales verification is determined after identifying the current cashier system: a POS integration if available, or an approved staff workflow linked to a unique receipt number, with permissions and an audit trail. Scanning a public QR code is not a basis for awarding stamps.

The unit that earns a reward must be clearly defined: a qualifying visit, qualifying drink, or purchase value. Do not display "One visit to go" if the program counts drinks.

Claiming a reward does not require marketing consent. Messaging consent is separate, and customers choose their channels.

## 6. Customer Communication Engine

Start with simple rules that are easy to understand and adjust. Message selection and its reason are separate from the delivery channel, with the required channels implemented gradually.

Every communication follows these steps:

**Confirmed event → Check customer eligibility → Check consent and channel → Apply frequency and timing limits → Send → Record outcome.**

| Situation | Goal | Example Action |
|---|---|---|
| First purchase | Encourage a second visit | Explain progress toward an understandable reward |
| Regular customer | Maintain a successful experience | Relevant new products or recognition without constant discounts |
| Lapsed visits | Provide a relevant reason to return | Contact after an interval that reflects the customer's previous visit pattern |
| Repeated interest in a category | Make a relevant suggestion | A new product from the same category |
| Close to a reward | Make redemption easier to reach | Explain what remains under the program rules |
| An item returns to stock | Fulfill an explicit request | An alert the customer requested for that item and branch |
| Open service issue | Restore trust | Resolve the issue before a new sales campaign |

New, Regular, Lapsed, High-value, and Coffee/Matcha interests are analytical segments, not additional experiences. They are defined using internally documented criteria, and customers may belong to more than one segment; prioritize messages to prevent duplication.

Push, email, WhatsApp, and SMS are possible channels. The first release does not require implementing all of them or building a large campaign engine. Choose the first channel based on customer usage, consent, cost, and operations.

## 7. Shared Data

| Domain | Required Data |
|---|---|
| Catalog | Products, sizes, images, translations, and approved recommendations |
| Branches and channels | Hours, services, prices, and availability |
| Offers | Terms, duration, branches, and Inside/Outside context |
| Transactions | Source, transaction number, branch, time, items, value, and cancellation/return status |
| Customers | Account identifier, necessary contact details, and preferences provided with permission |
| Consent | Channel, purpose, and time of consent or withdrawal |
| Rewards | Entitlement, earning, redemption, reversal, and source of every entry |
| Communication | Message reason, channel, sending status, and frequency |

Last purchase, average spending, and recurring categories are derived from linked transactions. "Last confirmed visit" requires a reliable visit definition; multiple receipts in one session do not automatically mean multiple visits.

## 8. Measurement

| Goal | Measurement Now | Measurement When Operational Data Is Ready |
|---|---|---|
| Get them | Branch views, directions clicks, and engagement with visit offers | Visits/purchases attributable through a documented mechanism |
| Sell them | Search success, product selection, and adding a pairing to My Picks | Average order value, item count, add-on purchase rate, and margin |
| Keep them | Cannot be inferred from menu engagement alone | Transactions linked to accounts, reward earning, and redemption |
| Bring them back | Interest in a message or offer, once enabled | Repeat purchases within a defined period and customer value after incentive costs |

Directions are not confirmed visits. My Picks are not sales. Average My Picks value is not average order value. Intent indicators are reported separately from actual outcomes.

## 9. Implementation Sequence

### Phase One: The Two Experiences and the Catalog

An interactive prototype of the menu, product details, and My Picks, followed by the homepage and branch page. Use real products and approved prices, then build the shared source, administration interface, search, offers, QR entry, and measurement.

Acceptance criteria: Scanning a QR opens the correct menu directly; general entry opens the visit experience; an explicit choice clearly changes context. Products can be compared and revisited without losing state. Approved data changes reach both experiences.

### Phase Two: Purchase Verification and the Relationship

Once the sales source is established: an optional account, transaction linking, one stamp program, and an auditable rewards ledger. Limited communication rules begin on one suitable channel when consent and operations are ready.

Acceptance criteria: Every entitlement has a qualifying transaction, earning and redemption cannot be duplicated, and cancellations and returns are reflected according to the rules.

### Phase Three: Ordering and Optimization

A limited pilot for in-store digital ordering, with a responsible staff member, actual order states, and duplicate prevention. Recommendations, segmentation, and communication expand based on real data. Pickup can be added later as a service method within Outside if it becomes an approved business goal, without creating a third primary experience.

AI, multiple communication channels, and advanced gamification are later decisions based on demonstrated value.

## 10. First Reviewable Delivery

A connected experience using 10–15 actual products:

1. Outside: Homepage → Choose branch → Branch details and directions.
2. Inside: Branch QR → Menu → Product details → Optional pairing → My Picks.
3. A prototype of the invitation to save a stamp after a confirmed transaction; it does not issue an actual reward before the sales source is ready.

Review ease of selection, price clarity, switching between contexts, and whether customers understand the state of their selections. Once the design is established, complete the remaining catalog and functionality.

## 11. Decisions Needed Before Dependent Implementation

- The name of the current cashier system and whether sales can be exported or integrated.
- The branch responsible for the first trial and the staff member responsible for data updates.
- Approved menu, prices, and images, including any differences between branches.
- Rewards program rules after reviewing product economics.
- The first communication channel after assessing usage, consent, and cost.

These details do not prevent designing and building the foundation of the two experiences; they are resolved before enabling the functions that depend on them.
