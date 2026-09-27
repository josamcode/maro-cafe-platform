# 1. My New Understanding of the Role of MARO's Website

**MARO needs one platform, but not one experience imposed on every visitor.**

The foundation I propose:

> **The same products, prices, and branches, with the presentation and next step adapting to the customer's context.**

A customer at a table goes straight to the menu. Someone considering a visit sees the products, the venue, and practical information. A visitor arriving from an ad lands on the relevant product or offer. Returning customers reach their selections and rewards without starting over every time.

The platform gradually develops three layers:

| Layer | Role |
|---|---|
| **Discovery and selection** | Menu, products, branches, offers, images, and information that supports decisions. |
| **Service and purchasing** | Ordering, pickup, table service, payment, status tracking, and handling problems. |
| **Relationship and return visits** | Account, rewards, preferences, referrals, and relevant communication. |

**An important decision:** Build the first layer completely now and prepare a foundation that can accommodate the rest, without displaying unavailable functionality or building a huge system before proving the need for it.

The following proposal uses the audit as a reference for problems, rather than reassessing it. All dimensions and quantities below are **initial design specifications to test**, not current website measurements or promises of business results.

---

# 2. User Contexts & Intent Matrix

| User Type | Where Are They? | Why Did They Visit? | Most Important Information | Main Action | Shortest Possible Journey |
|---|---|---|---|---|---|
| Customer inside the café | At a table | Choose an order | Products, price, size, availability | Choose, then order from staff; digitally later | QR → Branch menu → Selection |
| Customer wanting delivery | Home or work | Order now | Products, delivery channel, available branch | Go to the ordering channel | Ad/link → Product or menu → Order |
| Customer wanting pickup | Away from the venue | Collect at a specific time | Branch, readiness time, total | Confirm pickup | Menu → Branch and time → Confirmation |
| First-time visitor | Looking for a place | Decide whether to visit | Photos, price level, location, hours | Directions | Products and venue → Branch → Directions |
| Customer who knows a specific item | Anywhere | Find it quickly | Whether it is offered, its price, and availability | Reach the item | Search → Product → Appropriate action |
| Returning customer | Anywhere | Repeat a good experience | Previous selections, availability, rewards | Select again or reorder | My Selections/Last order → Review → Confirm |
| Campaign visitor | Instagram, QR, or influencer | Explore a specific promise | Product or offer and its terms | Campaign-related action | Campaign page → Product/branch/order |

### How Do We Identify the Context?

I do not want a mandatory entry screen asking everyone, "Where are you and what do you want?"

We use **the entry link and explicit selection**:

- A table QR code identifies the branch and table.
- A product campaign opens the product page.
- A branch link opens its details.
- General entry opens the homepage.
- Customers can clearly change their context or branch.

**The customer's current choice takes precedence over saved preferences.** A QR code or location alone is not sufficient evidence to authorize sensitive orders; details are covered in the table ordering section.

---

# 3. Design Principles for the New Project

## A. The Task Comes First, and Visual Personality Supports It

The menu is not a section within a marketing presentation; it is a standalone experience. The identity appears through images, typography, and tone of voice, rather than forcing users through the brand story.

## B. Essential Information Does Not Require Opening Details

Product name, price, image, and distinguishing description appear during browsing. Details are for sizes, customization, and ingredients, not for discovering the price for the first time.

## C. One Primary Action for Each State

There may be multiple paths, but not five equally prominent buttons. We distinguish the primary action, the alternative, and supporting information.

## D. Do Not Make Promises That Operations Cannot Fulfill

"Ready for pickup," "Available," "Best seller," "Free from…," and "Open now" require reliable data sources. Without them, we use more precise wording or omit the claim.

## E. Premium Simplicity

Proposed identity decisions:

| Element | Decision |
|---|---|
| Background | Warm black rather than identical black across all layers; for example, `#0F0E0C`. |
| Surfaces | Slightly lighter shades for cards and sheets; for example, `#191713` and `#232019`. |
| Gold | For the primary action, highlighted price, and selected state; not every border and text element. |
| Text | Clear ivory for headings and a readable secondary color, rather than faint gray. |
| Fonts | A clear Arabic typeface for the interface and menu; expressive personality is reserved for short headings. |
| Sizes | Body text around 16px, product names 17–18px, section headings 22–26px, and hero text around 30–36px on mobile. |
| Spacing | A 4/8px-based system; 16px mobile margins, with section spacing usually 32–48px. |
| Corners | 12–16px for cards and 20–24px for sheets, rather than excessive rounding everywhere. |
| Icons | A consistent set instead of emojis, with labels when the meaning is unclear. |
| Motion | Short transitions that support understanding, without parallax, autoplay, or effects that delay use. |

We target WCAG-compliant contrast: **4.5:1 for normal text and 3:1 for large text**, with visible focus and no obscured focused elements. I suggest 44–48px touch targets as a comfortable design choice, not as a claim that this is the minimum across all WCAG criteria. :chatgpt-content-reference{index="0"}

## F. Images Are Part of the Product, Not Advertising Files

Photograph the actual product in its real size, cup, and presentation, with consistent lighting. One clear image is better than a text-heavy poster. Venue photos should show seating, the bar, and the entrance, rather than only the logo.

## G. Speed Has a Clear Budget

Launch target: **LCP ≤ 2.5 seconds, INP ≤ 200ms, CLS ≤ 0.1 at the 75th percentile**, separating mobile and desktop measurements. These are performance targets, not confirmed results before measurement. :chatgpt-content-reference{index="1"}

Use responsive image sizes, reserved dimensions, and lazy loading below the fold. **The hero image likely to become the LCP element must not be lazy-loaded**; give it appropriate priority. :chatgpt-content-reference{index="2"}

---

# 4. The New Information Architecture

## Proposed Structure

| Destination | Function |
|---|---|
| **Home** | Quickly discover products and the venue, then choose a path. |
| **Menu** | Search, browse, and compare without lengthy marketing content. |
| **Product** | Shareable details with direct access. |
| **Branches** | Choose the right location and decide to visit or order. |
| **Branch page** | Its photos, hours, services, menu, and contact channels. |
| **Offers** | Active offers with clear terms, rather than a poster gallery. |
| **About MARO** | The story, people, and details worth exploring further. |
| **Campaign pages** | Short experiences connected to a product, occasion, or branch. |
| **My Selections** | A simple list that helps customers choose; not a submitted order. |
| **My Account — later** | Orders, rewards, preferences, and receipts. |
| **My Orders — later** | Cart, confirmation, status, and help. |

**Primary Navigation:** Menu, branches, offers, and the ordering channel when available.

**Secondary Navigation:** About MARO, contact, language, policies, and social media.

I would not make Stories a primary destination. Relevant video belongs inside the product, branch, or campaign page, where it supports a clear decision.

Every product, branch, and offer should have a stable link from the start, such as:

`/menu` — `/products/iced-latte` — `/branches/faisal` — `/offers/...`

These are proposed routes, not pages I claim currently exist.

---

# 5. The New Homepage in Detail

The homepage serves **discovery and choosing a path**, rather than trying to contain every platform function.

### Part One: A Quick Introduction + a Clear Route to the Menu

A small header followed by a compact hero that communicates the nature of the café and shows a real product. The "View menu and prices" button appears before users need to scroll far.

### Part Two: Actual Products, Not Promotional Categories

A heading such as **"Start with MARO's Picks"**, followed by 3–4 real products with images and prices.

This is not a second version of the menu. It is a curated selection from **the same product catalog**, and every card opens the same product details.

With verified sales data, this can become "Best Sellers." Until then, use "MARO's Picks."

### Part Three: One Important Offer — When Available

A relevant active offer with clear content and a direct action. The section does not appear when there is no valid offer.

### Part Four: "Visit MARO"

One block combines what visitors need to decide on a visit: actual photos, branch selection, hours, services, appropriate trust evidence, and a directions button.

Do not split this information across four long sections.

### Part Five: A Brief Brand Touch

A photo of people or drink preparation, with a very short paragraph and a "MARO's Story" link. Those interested can continue; everyone else can move on without interruption.

### Part Six: A Practical Ending

A footer with the shortest routes to the menu, branches, and contact, plus an appropriate CTA.

**Table QR visitors skip this journey entirely and go straight to the menu.**

---

# 6. Header / Navbar

## Mobile — Public Website

Target height: **56–64px**, excluding the device's safe area.

Elements: one small brand mark on the right in Arabic, a clear menu button, and a More button. Language is clearly available at the first level within More; it can appear directly if screen width allows without crowding.

Inside More: branches, offers, available ordering methods, About MARO, contact, and language. Social links belong in the secondary area, away from the primary action.

**I would not place Menu and Order as two competing filled buttons in the mobile header.** In the general context, the menu is the primary entry point, and ordering appears where appropriate.

## Desktop

Height around 72px, with primary links visible. A separate Order CTA can appear when the ordering channel is clearly defined.

## Sticky Behavior

The header is fixed and small from the outset; it does not need a shrinking animation during scrolling.

Inside the menu, a compact search and category toolbar sits underneath. We aim for a combined fixed height of approximately **104–116px** in the usual state.

## Inside the Café

Use a different, functional header:

**MARO — Faisal Branch · Table 12 — Language/More**

No social icons, hero, or delivery prompt. Branch and table information are visible, without a confirmation step blocking item browsing.

---

# 7. Hero Section

## Concept

A real photo of a signature drink incorporating an element of the venue's identity, rather than an autoplay video.

**Suggested copy:**

> **Coffee your way. A place to make your own.**

> Explore drinks, desserts, and prices, then choose to visit or order.

**Primary CTA:** View menu and prices.  
**Secondary CTA:** View branches.

The café's name is already clear in its identity, so it does not need to occupy the screen again.

## On Mobile

I prefer a heading, short text, and buttons, followed by an image with a suitable landscape ratio, or an integrated composition depending on the photography. The aim is for users to see **the value, CTA, and the beginning of a real product image** within a typical first screen, without forcing a full-screen height.

## Should We Show the Price, Offer, or Nearest Branch?

Do not combine all of them.

The photographed product's name and price can be shown from the catalog. A price range should appear only when clearly calculated and representative of the category, rather than using the café's lowest price as bait.

"Nearest branch" must not rely on a guess. Show it after area selection or location permission. An offer should not compete with the hero unless this is a campaign page dedicated to that offer.

---

# 8. Complete Menu Redesign

## When the Menu First Opens

The order:

**Branch/service context → Search and category tools → Products.**

No large marketing introduction or instructions such as "Tap the buttons to browse."

For general entry, users can browse immediately without mandatory branch selection **if prices are shared across branches**. If they differ, identify the reference clearly: "Prices shown are for… branch," or display a genuine range and require branch selection before any commitment.

With a QR entry, the branch is known, so its data appears immediately.

## Default View

A unified menu with consecutive sections and small headings. Users can jump to any category or search across all items.

"MARO's Picks" is a small, skippable entry point, not another screen before the menu. If a customer enters a specific category, do not send them back to the picks.

## Important States

Returning from a product restores the same scroll position, search, and filters.

When changing branches, explain any price or availability changes without silently deleting selections.

Unavailable items remain understandable, with a suitable alternative instead of a nonfunctional button. Closed branches allow browsing but do not promise immediate ordering.

**The absence of digital ordering does not prevent launching an excellent menu.** Customers can choose items and then order from staff, with that process made clear.

---

# 9. Product Card

## The Best Mobile Format: A Horizontal Card

A square image around **96–112px**, with information beside it. Typical height around **136–160px**, expanding with the text rather than truncating the product name.

Visual order:

| Element | Presentation |
|---|---|
| Image | Real, clear, and consistently proportioned across items. |
| Name | Complete and readable, without ambiguous abbreviations. |
| Badge | One when needed: Signature, New, or Barista's Pick. |
| Description | One or two lines explaining differences that affect the decision. |
| Price | Always visible, with the currency beside it. |
| Sizes | A short summary; "From" pricing only when there is a clear reason. |
| Action | Open details; later, direct add or customization depending on the item. |

**Formatting example, not an approved MARO recipe or price:**

> Iced Spanish Latte  
> Coffee with milk and a creamy texture, with an accurate description of sweetness.  
> **Approved price EGP** · Available sizes

After the menu tools, aim to show **around 2–3 complete products** on a typical mobile screen, depending on text length and device size. Do not compress content merely to hit a cosmetic number.

Calories appear only with approved data. Favorites should not compete with price; they can initially live inside product details.

**Important:** Do not force a long description onto a simple product. A description is needed when it adds a meaningful distinction, not merely to fill space.

---

# 10. Product Detail

## Decision: Hybrid

**A standalone product page with a permanent link, opening from the menu as a large bottom sheet on mobile.**

This combines easy return to browsing with sharing and direct ad entry. Opening the link directly displays a full page.

On desktop, the same content can appear in an appropriate dialog without creating a separate data version.

## MVP Now

The order:

**Image → Name and description → Price and sizes → Important information → Context-appropriate action.**

Ingredients and allergens appear when approved. Sizes, where available, clearly update the displayed price. Branch information or availability differences appear before the action, not afterward.

### Inside the Café

Customers can add an item to **"My Selections"**: a simple local list to show staff, not a submitted order.

The wording is clear:

> Your selections are saved here only. Place your order with a staff member.

Do not use "Order placed" or "Add to cart" before a system exists to receive orders.

### Outside the Café

"Order via Talabat" if the appropriate channel is available, or "View available branches." Sharing is a secondary action.

## In the Future

Add sizes, extras, quantity, notes, and permitted customization, followed by:

**Add to order — Current total**

Do not add a Hot/Cold choice if a product is sold in only one form. Do not allow notes that imply any modification can be fulfilled.

## Interaction Details

Closing is clear, and Back restores the previous state. Content scrolls without moving the background, and focus returns to the element that opened the details. The action bar does not cover the last piece of information and accommodates the keyboard and safe area.

Closing the sheet must not lose customization without a warning when meaningful changes have been made.

---

# 11. Search / Categories / Recommendations

## Categories: The Selected Solution

**A persistent "Categories" button opens a bottom sheet with a complete short list**, while the current category name remains visible in the toolbar.

Selecting a category jumps directly to it and closes the list. All categories appear with understandable names, instead of forcing users to swipe horizontally to discover them.

On desktop, the list becomes a fixed sidebar.

A few shortcuts to the most frequently used paths can be added, but **complete navigation does not depend on them**.

The final classification is approved after catalog inventory. The principle: use customers' familiar category names, avoiding long compound names or unnecessary overlapping categories.

## Search

A clear field: **"What are you looking for?"**

Live search while typing, using Arabic and English names, aliases, and approved ingredients.

`Spanish` and its Arabic spelling lead to the same related items. The same applies to `Matcha` and its Arabic spelling, provided they exist in the catalog.

Normalize spelling variations only for search, without changing original product names. Exact matches take priority over approximate ones.

Search results show prices and images, not just a list of names. When there are no results, retain the typed query and suggest a related path rather than silently substituting an unrelated result.

## Filters Now

Start with a few filters backed by reliable data: hot/cold, with/without coffee, and price.

Additional filters live inside a sheet, with an active-filter count and a "Clear" button. Do not keep ten chips permanently visible.

"Low sugar" is not merely a marketing tag; do not use it without a clear definition and data. "Sugar can be adjusted" can be shown instead when true.

## Recommendations

The sequence:

**Barista's picks now → Best sellers once data is available → Personalization later.**

For undecided customers, add an optional entry point:

> Not sure? Let's choose together.

Three questions at most: Hot or cold? With or without coffee? Your budget? Then three suggestions with clear reasons.

**This can be implemented with simple rules before AI.**

---

# 12. Offers

An offer becomes **structured data**, rather than an image containing all the information.

The card includes: what customers get, price, savings if genuine, duration, branches, redemption channel, the key condition, and the action.

Less important details live under "Terms," but any condition affecting the customer's decision appears before the click, such as pickup-only availability or restriction to a specific branch.

## Where Does It Appear?

On the homepage: one selected offer.  
In the menu: beside related products or in a short offers group.  
On the offers page: all active offers.  
In a campaign: the offer itself is the main page.

All of this comes from **one offer record**, so prices and dates do not differ across screens.

When an offer expires, its campaign link should not lead to an error page; show an expiry message and an available alternative. No resetting countdowns or unverified crossed-out prices.

Tapping a card opens the offer rather than advancing a carousel. I would prefer to remove the primary carousel altogether in favor of a clear static offer.

---

# 13. Branches

## Branch Card

A practical card, usually around **180–230px** depending on content, without imposing a fixed height.

It contains the branch name, area and short address, today's hours, key services, and a **Directions** button. Calling is a clear secondary action.

A thumbnail is useful if it distinguishes the branch, but must not displace its information.

## Branch Page

Includes photos of seating and the entrance, full address, hours, phone, WhatsApp if actively used, confirmed services, the branch menu, and ordering channels.

Do not assume amenities such as parking, Wi-Fi, or outdoor seating.

**"Open now"** comes after establishing regular hours, holiday exceptions, and temporary closures using the correct branch time zone. An old weekly schedule is not enough.

Distinguish between:

> The branch is open.

And:

> Digital ordering is temporarily paused.

## Finding the Nearest Branch

The branch list is available without location permission. Offer an optional "Use my location" action, with manual area selection as an alternative.

Do not request location immediately upon entry or describe a branch as the nearest without supporting information.

---

# 14. About / Social Proof

## About on the Homepage

A short paragraph and a real photo. The full story lives on a separate page, built around tangible details: people, preparation, products, and the experience inside branches.

Every claim needs support. "We select our coffee beans carefully" becomes useful when linked to accurate details about the beans or preparation, rather than being another generic statement.

## Social Proof

I prefer evidence close to the decision:

On the branch page, show that branch's rating, review count, and source. The homepage can show two short quotes or customer photos used with permission, rather than a wall of reviews.

When using Google Places, comply with content attribution, reviewer information, source links, and storage/display restrictions, rather than copying reviews into an independent database without reviewing the terms. :chatgpt-content-reference{index="3"}

If review integration is not ready, provide a direct link to branch reviews instead of a stale number that appears live.

**I would not tie a reward to writing a Google review.** Google's policy prohibits incentives for reviews and selectively soliciting only positive reviews. Genuine feedback can be requested without influencing its content or rating. :chatgpt-content-reference{index="4"}

Instagram content should be curated and displayed lightly, rather than as a heavy auto-loading feed that competes with the menu.

---

# 15. Footer

The footer is more than a link area; it is **a final decision point**.

On the public website:

> Ready to choose?

The menu button is primary, with branches as a clear alternative. Then contact details, short links, social media, and policies.

On a branch page, the ending is closer to:

> Visit our… branch.

Directions become the primary action.

In the QR experience, use a compact footer for help and branch information; do not market the venue again to someone already sitting in it.

Do not repeat lengthy details already available. Developer credit, if agreed, should be small and visually neutral.

---

# 16. CTA Strategy by Context

| Context | Primary Action Now | Alternative | Future Development |
|---|---|---|---|
| General homepage | View menu and prices | View branches | Direct ordering when ready |
| QR inside the café | Browse and choose | Staff assistance | Add to order |
| Product inside the café | Add to My Selections | Back to menu | Customize, then add |
| Menu outside the café | Choose a product | Select branch | Cart based on fulfillment method |
| Product for a delivery customer | Order via Talabat | View branches | Choose an available delivery channel |
| Branch page | Directions | Call branch | Pick up from this branch |
| Offer page | Redeem through the specified method | Terms | Automatically apply in cart |
| Returning customer | Open saved selections | Explore what's new | Review and reorder |
| Customer with an active order | Track order | Help | Additional order when allowed |

**A filled button is not required on every card.** Sometimes the best action is to let users choose freely, with a combined selection button appearing only after items have been selected.

---

# 17. Talabat Strategy

**Talabat is an external ordering channel, not the center of the website's visual identity.**

The decision now:

Remove the dominant sitewide banner and floating button. Keep clearly labeled buttons such as "Order via Talabat" in the context of customers outside the venue, branch pages, and relevant product details.

It is not a primary prompt inside the table QR experience.

## Important Boundaries

Do not label a button "Order this product" if the link only opens the restaurant page. Do not build a local cart that suggests it will transfer to Talabat without an actual integration.

Talabat provides partner integrations for managing orders, menus, and branches, but access requires an application and qualification. The existence of documentation does not mean MARO has access, nor does it establish that a website cart can be transferred to the customer app. :chatgpt-content-reference{index="5"}

Also identify the channel associated with the displayed price when branch prices differ from delivery-platform prices.

## Future Transition

Under the "Order" button, show only fulfillment methods that are genuinely available:

**Dine-in / Pickup / Delivery**

Each method uses the same catalog, with channel-specific prices and availability where needed. Talabat can remain a delivery option even after direct pickup launches.

There is no need to remove a commercially successful channel simply because MARO has its own system.

---

# 18. In-store Customer Journey

## Now

**Scan QR**  
↓  
**Open the branch menu directly, with the table number**  
↓  
**Search, choose a category, or use a relevant suggestion**  
↓  
**Compare images and prices**  
↓  
**Choose a size or review details when needed**  
↓  
**My Selections — optional**  
↓  
**Show selections to staff and confirm the order with them**

No login, no repeated branch selection, and no detour to the homepage.

## In the Future

The same journey, but its ending becomes:

**Add to order → Review → Submit → Receipt acknowledgment → Track preparation → Order served → Payment/receipt → Optional reward**

The function changes without requiring users to relearn the menu.

---

# 19. At-home Customer Journey

**Google / Instagram / Direct**  
↓  
**The relevant page: product, offer, branch, or homepage**  
↓  
**Actual products, prices, and photos**  
↓  
**Choose intent when needed**

The journey then branches:

**Visit:** Suitable branch → Hours and services → Directions.  
**Delivery:** Available ordering channel → Clear handoff.  
**Future pickup:** Branch → Available time → Order and payment/confirmation → Collection.  
**Still deciding:** Save the product or share a clear link.

Do not require a home address before customers decide they want delivery.

---

# 20. First-time Visitor Journey

This journey should progressively answer four questions:

**Are the products right for me? Are the prices suitable? Is the place suitable? How do I get there?**

Proposed sequence:

**Selected products with prices → Venue photos → Branch and services → Trust evidence → Directions.**

Add practical information based on the branch's actual conditions: Is it suitable for a short stay? Are tables available? Is pickup quick? Do not write "Suitable for working" without knowing the actual seating and service conditions.

For customers hesitant about budget, offer real suggestions such as "A drink and dessert within your budget," based on current prices rather than a vague marketing range.

The goal is not the longest website session; it is **a clear, early decision to visit or rule the venue out**.

---

# 21. Returning Customer Journey

## Before Accounts

Favorites and the last branch can be saved locally on the device, with a clear explanation that they will not automatically transfer to another device.

Do not infer a previous order merely from viewing a product.

## After Accounts

Customers see a small entry point:

**Last Order — Your Favorites — Your Rewards**

If they have an active order, tracking it takes priority over any marketing campaign.

Reordering means:

**Open previous order → Recheck prices, availability, and customization → Review changes → Confirm.**

It is not blind resubmission at an old price.

Ask for an account when it provides value: saving a reward, tracking orders across devices, or saving preferences. Phone registration with a verification code is a suitable option, with protection against repeated attempts, account recovery, and phone-number changes.

**Browsing and choosing do not require an account, and ordering can remain available to guests when the fulfillment method allows.**

---

# 22. Beyond the Website — MARO Digital Ecosystem

The vision is not a feature list. It is a connected cycle:

**Relevant discovery → Easier selection → Reliable service → Understanding customer preferences with consent → A meaningful reason to return.**

I see five main opportunities:

| Opportunity | Value |
|---|---|
| **Better selection** | Make the menu help customers discover what suits them. |
| **Less wasted time** | Clear pickup, genuine order status, and less repetitive communication. |
| **Meaningful return visits** | Save successful experiences and reward actual purchases. |
| **Relevant communication** | Offers tied to interests and branches, rather than constant mass messaging. |
| **Smarter operations** | Consistent availability, prices, and campaigns, with data-informed decisions. |

Any feature that does not clearly serve one of these opportunities is deferred.

**I would not start with a native app, floating chatbot, or complex loyalty-tier system.** Start with a fast website and dependable service.

---

# 23. Ordering / Table Ordering / Pickup

## A. Table Ordering

### Technical Concept

A static QR code identifies **the entry point**: branch and table. A separate **visit session** is then tied to the current visit, rather than remaining accessible forever to anyone who photographed the QR code.

Orders go to one operational source: an approved POS or a receiving dashboard with clearly assigned responsibility. Sending scattered notifications does not constitute an ordering system.

### Staff Workflow

Staff see the order, table number, and customizations, then accept or reject it with a reason. The bar sees accepted tickets. Service staff know what is ready to serve.

States must reflect reality:

**Submitted → Received by branch/Accepted → In preparation → Ready to serve → Served.**

"Paid" is a separate state; payment does not prove that the bar has started preparation.

### Risks That Must Be Addressed

A photographed QR code does not prove that the customer is present. Options include staff-activated sessions, a short rotating visit code, or approval of the first order. Location or Wi-Fi must not be the sole protection.

New arrivals must not see the order history of previous occupants of the table. Double-tapping or retrying after a network interruption must not create two orders.

If the connection drops, display "Checking whether your order was received," rather than "Failed," which could prompt unverified resubmission.

### Appropriate MVP

One branch, a limited set of tables, separate orders per customer, staff acceptance, and the existing payment method.

**Defer shared carts, split bills, and group payments.** These are broader operational scenarios than simply providing a QR code.

### Business Value

Hypotheses to test: fewer transcription errors, easier additional ordering, and improved service time. I would not assume these benefits will materialize if the system merely adds a screen that nobody monitors.

---

## B. Pickup / Takeaway

**I recommend piloting this before rolling out table ordering** if there is genuine demand from nearby customers and the ability to honor pickup times.

The journey:

**Choose branch → Products → Available time → Total → Confirmation/payment → Order number and ready time → Collection.**

Do not ask for a home address. Do not allow time slots beyond operational capacity.

We need order limits per time slot, preparation time, temporary pausing, and policies for delays and uncollected orders.

Start with one branch and specific hours. Later, add quick reordering and workplace team orders.

**Before the digital system:** Preordering can be tested through a channel actively managed by staff, but call it "Request confirmation from the branch," rather than automatically guaranteed pickup.

---

# 24. Loyalty

**Start with a simple, understandable program, not points, tiers, badges, and vouchers all at once.**

My first proposal: **digital stamps on qualifying purchases**, with a defined reward customers can immediately understand.

An example to evaluate:

> After a specified number of paid qualifying drinks, receive a drink from a clearly defined reward menu.

Do not finalize the number of stamps or reward value before understanding product costs and margins.

## Program Cycle

**Verified purchase → Earn → View progress → Optional relevant reminder → Return → Redeem → Record transaction.**

The receipt shows what customers earned and how much remains. The reward specifies products, branches, duration, and exclusions.

## Core Rules

A free product must not generate endless additional rewards. Returns and cancellations reverse the related entitlement. Redemption is an authorized cashier transaction, not a screenshot of a balance.

Do not reward merely scanning a public QR code. Do not make marketing-message consent a condition for receiving an earned purchase reward.

## Economics

Measure:

**Margin from incremental purchases − Reward costs − Operations and messaging − Fraud.**

An increase in registered users alone is not success. Nor does a higher return rate among members prove the program caused the increase; they may already have been the most loyal customers.

The program can start before online ordering, **but only after a reliable sales source exists**.

---

# 25. QR Marketing & Transaction Rewards

Your idea is strong, but two QR types must be distinguished:

| Type | What Does It Do? |
|---|---|
| **Public product or campaign QR** | Opens content or a menu; shareable and does not prove a purchase. |
| **Transaction-specific QR** | Allows a claim for an entitlement linked to a real sale. |

## Proposed Journey

**Complete a qualifying sale**  
↓  
**Create an entitlement linked to the transaction number and items**  
↓  
**Provide a private QR on the receipt or cashier screen**  
↓  
**Open a page explaining the reward**  
↓  
**Link it to the customer's account when needed**  
↓  
**Confirm a one-time claim**  
↓  
**Add the reward and update the record**

## How Do We Prevent Reuse?

Design a strong random token with a short validity period governed by a clear policy, linked to a specific transaction. Validation and consumption happen on the server in a single operation that prevents simultaneous claims.

A "signed" token is not enough; we need to record that it has been used. Relevant OWASP principles include server-side authorization enforcement, transaction-state validation, limited validity, and preventing reuse of authorization data. :chatgpt-content-reference{index="6"}

## The Most Important Point

**A one-time QR prevents everyone from receiving the reward, but does not prevent someone else from stealing it and claiming it first.**

We therefore have two levels:

**MVP:** Private receipt, one claim, limited duration, low reward value, and review of suspicious cases. This reduces risk without eliminating it.

**Stronger level:** The cashier links the sale to the customer's account at payment, for example by scanning the customer's membership code. The reward then belongs specifically to that account, even if the transaction QR is photographed.

An OTP proves control of a phone number; **it does not by itself prove that its owner made the purchase on the receipt**.

## Details That Must Not Be Forgotten

Opening the link does not consume the reward; claiming requires a confirmation action. Do not expose phone numbers or sales details inside the token. Do not send claim tokens to analytics tools or third parties.

Cancellations and partial returns are handled at item level. Reissuing a token invalidates the old one. Any staff adjustment requires permissions and an audit trail.

Without a POS API, start with verified sales imports or a cashier tool tied to a unique receipt number. **I do not consider uploading a receipt photo alone to be a ready-made proof-of-purchase system.**

---

# 26. Gamification

I recommend only three ideas as a future starting point:

**Coffee Passport:** Try an approved set of items across different visits, with a clear reward.

**Seasonal Collection:** Discover a seasonal range without forcing customers to buy several drinks in a short time.

**Taste Profile:** After trying items, customers save what they liked, improving future choices.

Premium design: understated progress and elegant cards, without prize wheels and confetti on every screen.

I do not favor a daily streak for a café; it may encourage unnecessary repetition and penalize absence. Flexible progress over a reasonable period is better.

The Mystery Reward idea can be simplified into **a visual reveal of a guaranteed reward with defined economics**, rather than paying for a chance or implying an enormous prize. Any chance-based campaign requires an independent review before launch.

---

# 27. Referral

Proposed mechanism:

**An eligible customer shares a link → A new friend accepts the invitation → Makes a qualifying purchase → Rewards for the friend and referrer activate according to the terms.**

No reward merely for signing up. Do not use screenshots as proof of referral or purchase.

Economic conditions: a clear purchase threshold, a reward cap, restrictions on combining certain offers, and a maximum campaign budget.

Define "new customer" precisely: not just a new phone number, but based on what can be verified in the available sales data.

Review self-referrals, duplicates, and returns. A shared device or network is a review signal, not an automatic reason to penalize members of the same household.

Ideally, the reward is **tied to a worthwhile future visit**, rather than an unrestricted discount that consumes the margin on the first transaction.

---

# 28. Personalized Marketing / CRM

Start with understandable rule-based personalization rather than an opaque model.

| Segment | Appropriate Experience |
|---|---|
| Customer after a first purchase | Receipt and thanks, followed by a clear benefit of returning. |
| Customer who buys a specific drink | Select it again or discover a similar product. |
| Customer interested in matcha | An approved new item in the same category, rather than unrelated offers. |
| Customer absent for a while | One message with a useful reason to return, based on their visit cycle. |
| Customer of a specific branch | An update relevant only to that branch. |
| Customer with a service issue | Resolve the issue before sending another sales campaign. |
| Highly active customer | Recognition or early access, rather than unnecessary repeated discounts. |

## Controls

Separate marketing consent, channel choice, easy opt-out, quiet hours, and sending limits. Start conservatively and learn from engagement and complaints rather than sending every offer to everyone.

Do not infer diseases or health conditions from orders. A simple birthday reward does not require a full date of birth; collect the minimum necessary data.

The account brings together orders, rewards, favorites, receipts, and preferences, but is not required to access the menu.

Before launching messaging and data programs, review local privacy requirements and channel terms. This is an operational step, not simply writing a privacy page.

---

# 29. AI Assistant

**I would not include AI in Phase 1.**

Initially, good search, categorization, and a three-question selector cover most of the examples you mentioned.

AI becomes useful when there is a rich catalog with reliable updates, and search or customer-service evidence shows that natural language adds value.

## Appropriate Use

A customer types:

> Something cold, not too sweet, and within EGP 80.

The system extracts constraints, searches currently available products, and displays a small number of results with **price and the reason for each recommendation**.

If there is no match, it says so and asks which condition can change. It must not invent a product or silently exceed the budget.

## Clear Boundaries

Prices, availability, and terms come from system data, not model memory. The assistant does not submit an order or make a payment without review and confirmation.

For allergies, an ingredient's absence from a description does not guarantee safety; handling, preparation, and cross-contact also matter. Display approved information without generating "allergen-free" claims, and refer unresolved cases to staff. :chatgpt-content-reference{index="7"}

## Implementation Decision Gate

Compare the assistant with the simple rules-based experience: Does it improve finding a suitable choice? Does it make mistakes? Does it cost more than the value it provides?

If there is no clear benefit, do not launch it merely because it looks attractive in a presentation.

---

# 30. Innovative Marketing Ideas and Digital Experiences

| Idea | Customer Experience | Value and Condition |
|---|---|---|
| **Build Your Break** | Set a budget and receive a drink + dessert suggestion. | More useful comparison and higher average order value without pressure selling. |
| **MARO Tasting Flight** | A small tasting selection, followed by preference feedback. | Product discovery, subject to preparation capacity and sensible pricing. |
| **Saved Visit Plan** | Share a branch, proposed time, and selections with a friend. | Easier visit decisions; not a confirmed reservation. |
| **Office Coffee Round** | Colleagues choose through a link, with one person reviewing the order. | Group-order opportunity after pickup and operational capacity mature. |
| **Back-in-stock Interest** | Request a one-time alert when an item returns. | Genuine demand instead of generic notifications; requires reliable availability. |
| **Digital Gift Drink** | Gift an item or limited credit through a secure code. | New customer acquisition; requires redemption and financial controls. |
| **Barista's Monthly Pick** | A monthly product with a short story about its taste and preparation. | Continuous discovery without relying on discounts. |
| **Private Taste Feedback** | After a verified purchase, respond with "Sweeter/Less sweet/Just right." | Improve products and preferences; separate from public reviews. |
| **Limited Drop Page** | A seasonal product page with branches and actual availability. | Direct campaign without artificial scarcity. |
| **Influencer Route** | A link to a product or selection associated with the campaign. | Measure source and verified sales, not merely visits. |
| **Quiet-hour Experience** | An experience or bundle at an operationally suitable time. | Spread demand after confirming the timing benefits both sides. |
| **Service Recovery Pass** | Controlled compensation after a documented problem. | Restore trust rather than giving everyone a random discount. |

**Secret Menu** can work as a discovery experience, but allergens, prices, and terms must not be hidden behind the "secret."

**Student offers** should be considered only if the audience and margins fit, using the minimum necessary verification rather than collecting ID photos unnecessarily.

There is also a less showy foundational opportunity: strong branch pages, direct menu links, and accurate structured data. Google supports defining business information such as hours, address, and menu through `LocalBusiness`, but this does not guarantee ranking or special search-result visibility. :chatgpt-content-reference{index="8"}

---

# 31. Internal System Concept

**I would not start by building a new POS.** Start with a unified source for the information customers need.

| Module | Responsibility |
|---|---|
| Catalog | Products, translations, images, descriptions, ingredients, and sizes. |
| Branches | Hours, services, and contact channels. |
| Pricing & Availability | Prices and availability by branch and channel. |
| Offers | Duration, terms, branches, items, and limits. |
| Orders — later | Orders, states, customizations, and fulfillment. |
| Customers & Consent | Account, preferences, and consent. |
| Loyalty Ledger | Earning, redeeming, and canceling rewards. |
| Campaigns & QR | Campaign links and transaction codes. |
| Analytics | Menu usage, conversion, and return visits. |
| Integrations | Connections to the POS, ordering channels, and messaging. |

Simple mobile management for authorized staff: "Item sold out," "Branch has paused orders," "Update today's hours."

Prices, offers, and rewards require higher permissions and a change log. Publishing an expensive offer must not be available to every employee.

Every piece of information has an owner responsible for updates. Every external source has a clear role: Who is the source of truth for prices? Who confirms sales? Do not allow ambiguous bidirectional synchronization that overwrites changes.

**An "Available/Unavailable" flag is enough initially; a detailed inventory system is not a prerequisite for launching the menu.**

---

# 32. Analytics

## Core Events

| Stage | Suggested Events | What Do We Learn? |
|---|---|---|
| Entry | `menu_opened`, `qr_entry`, `campaign_landing_viewed` | Why and from where do customers arrive? |
| Browsing | `category_viewed`, `view_item_list`, `select_item`, `view_item` | What gets seen, then opened? |
| Search | `search_used`, `search_no_results`, `filter_applied` | What do customers want but fail to find? |
| Selection | `shortlist_added`, `favorite_saved`, `product_shared` | What merits attention or a return visit? |
| Visit intent | `branch_selected`, `directions_clicked`, `call_clicked` | Which branches attract visit intent? |
| External ordering | `ordering_channel_clicked` | What prompts a move to Talabat? |
| Offers | `view_promotion`, `select_promotion` | Which offer attracts attention, and in which placement? |
| Direct ordering later | `add_to_cart`, `begin_checkout`, `purchase`, `refund` | Where does purchasing stop, and what is actual revenue? |
| Rewards | `reward_claimed`, `reward_redeemed`, `referral_qualified` | Does the program produce worthwhile return visits? |

When using GA4, standard ecommerce event names can be used instead of inventing unnecessary alternatives, together with product, currency, and transaction data. :chatgpt-content-reference{index="9"}

## Rules to Prevent Misleading Numbers

**A directions click is not a confirmed visit. A Talabat click is not a purchase. A shortlist is not a cart.**

Send `purchase` only for a confirmed sale, preventing duplicates through transaction IDs and handling returns.

Count a product view when the product is actually displayed under an agreed measurement definition, not merely loaded on the page.

Retain branch, channel, campaign, language, and placement context. Do not send phone numbers, reward tokens, or sensitive text to analytics.

## Metrics Worth Attention

Speed of reaching a useful menu, search success, progression from browsing to selection or visit intent, and completed-order rate when available.

Later: return visits within a defined period, reward cost, order margin after incentives, and service errors.

Compare experiences by context; do not mix QR customers with ad visitors. With low traffic, start with usability testing and operational comparisons rather than claiming conclusive A/B results from a small sample.

---

# 33. Future-proof Product / UX Architecture

**Scalability comes from stable concepts, not exposing every function early.**

### 1. A Product Is More Than a Price and an Image

It is a stable entity with variants/sizes, channel-specific prices, branch-specific availability, and permitted customizations.

### 2. The Presentation Adapts to Available Capabilities

Today, a card opens details. When ordering is enabled, it may show "Add." If the item requires choices, it shows "Customize."

Do not display empty placeholders for Points, Add, or Loyalty before they exist.

### 3. State Is Preserved and Understandable

Branch, ordering method, search, category, and selections must not be scattered across pages. Changing branches rechecks only what is affected and explains the changes.

### 4. General Navigation Is Separate from the Service Journey

During checkout or order tracking, do not surround the task with the entire homepage. When a cart exists, show a clear cart bar rather than adding five floating buttons.

### 5. The Account Becomes a Stable Destination When Launched

Rewards, receipts, and referrals live inside "My Account," rather than each having a separate primary tab.

### 6. Replaceable Integrations

The customer interface is not directly tied to one POS provider or Talabat. Channels connect to the approved order model and catalog.

### 7. A Resilient Core

The public menu can load quickly without loading account, ordering, or AI libraries. External failures do not prevent users from viewing items.

A cached version displayed during weak connectivity shows its last update. An order must not be submitted with stale prices or availability without live validation.

**What we build now:** A structured catalog, stable identifiers, clear context, a design system, basic permissions, and shareable links. Not microservices or a huge campaign engine.

---

# 34. Feature Roadmap by Priority

I will use your phase structure while clarifying an important dependency:

**Loyalty can precede online ordering, but it cannot precede sales verification.**

## Assessment of Main Features

| Feature | User Value | Business Value | Complexity | Dependency | When? |
|---|---|---|---|---|---|
| Menu with images, prices, and descriptions | Very high | Very high | Medium | Approved catalog | Phase 1 |
| Search and clear categories | High | High | Medium | Good names and classification | Phase 1 |
| Shareable product pages | High | High | Medium | Catalog | Phase 1 |
| Branch-specific QR menu | High | High | Small–Medium | Branch definitions | Phase 1 |
| Branch and contact information | High | High | Small | Approved data | Phase 1 |
| Local My Selections | Medium–High | Medium | Small–Medium | Products and sizes | Phase 1 |
| Content, price, and availability management | Indirectly high | Very high | Medium | Responsibilities and permissions | Phase 1 |
| Basic analytics | Indirect | High | Small–Medium | Correct event definitions | Phase 1 |
| Rule-based pairings and Taste Finder | High for undecided customers | Medium–High | Medium | Approved taste data | Phase 2 |
| Campaign and offer pages | High when relevant | High | Medium | Terms and availability | Phase 2 |
| Favorites and visit-plan sharing | Medium | Medium | Small–Medium | Local storage and links | Phase 2 |
| Social proof from a valid source | High for new visitors | Medium–High | Medium | Appropriate permission/integration | Basic in Phase 1, then Phase 2 |
| Accounts and purchase rewards | High for repeat customers | Potentially high | Medium–Large | Sales verification and security | Phase 3 |
| Secure transaction QR | High | High | Medium–Large | Trusted transaction source | Phase 3 |
| Referral | Medium | Depends on economics | Medium | Accounts and verified purchases | Late Phase 3 |
| Rule-based CRM with consent | Medium–High | Potentially high | Medium | Purchase history and consent | Phase 3 |
| Direct pickup | High for a specific segment | Potentially high | Large | Operations, orders, and payment | Phase 4, pilot first |
| Table ordering | High when implemented well | Potentially high | Large | Sessions, service, and order receiving | Phase 4 |
| POS integration | Indirect | High | Large/Variable | Provider and permissions | Phase 4; earlier if needed for sales verification |
| Group orders | High for a small segment | Potentially high | Large | Stable pickup | Late Phase 4 |
| AI recommendations | Not yet proven | Not yet proven | Medium–Large | Data and clear demand | Phase 5 |
| Advanced gamification | Optional | Requires testing | Medium–Large | Successful loyalty | Phase 5 |
| Gift codes | High for occasions | Potentially high | Medium–Large | Payment, redemption, and controls | Phase 4–5 |

## Transition Gates

### Phase 1 — Fix the Core

Launch the menu, products, branches, QR, identity, performance, and measurement.

**Exit gate:** A new customer can find an item, compare two prices, and reach contact information or directions without explanation. Prices and branch data are approved, and iPhone behavior, Back navigation, and sheets are tested.

Photography can be rolled out gradually, but the image issue is not considered fully resolved until the required coverage is complete.

### Phase 2 — Conversion

Direct campaigns, structured offers, pairings, favorites, and selection based on taste and budget.

**Exit gate:** Evidence of actual usage and intent measurement, without sacrificing clarity or increasing marketing pressure.

### Phase 3 — Retention

Optional account, one rewards program, transaction QR codes, then CRM and referrals.

**Exit gate:** Sales can be reconciled, rewards are not duplicated, and the economics are understood.

### Phase 4 — Platform

Pilot pickup, then table ordering, payment, integrations, and operations.

**Exit gate:** No lost or duplicate orders in testing, clearly assigned staff responsibility, and handling for delays, failures, and refunds.

### Phase 5 — Differentiation

AI and advanced experiences only after a worthwhile use case emerges.

**There is no obligation to reach Phase 5.** MARO's best economic position may be Phase 3 with a good external ordering channel.

---

# 35. Keep / Change / Remove / Add

## KEEP

Black and gold, the café's warm personality, Arabic and English, offers and branches, and Talabat as a useful channel.

Keep ideas that serve customers, not a format simply because it already exists.

## CHANGE

Product presentation, page structure, header, product details, branch and offer presentation, photography, information density, and the role of the brand story.

## REMOVE

Hidden prices, repetitive tapping instructions, artificial spacing, the obstructive floating button, repeated branding in the same place, posters as the primary presentation system, and Stories as a destination competing with core tasks.

Removing emojis here is a visual consistency decision, not a claim that they are a functional mistake on every website.

## ADD

Clear search, standalone product and branch links, understandable prices and sizes, approved operational data, QR context, saved selections, appropriate trust evidence, content management, and measurement.

Accounts, ordering, and rewards are added when their value and operations are ready.

---

# 36. Final Homepage Structure

| Order | Section | Purpose and Content | CTA | Reason for Placement |
|---|---|---|---|---|
| 1 | Compact Header | One brand mark and primary navigation | Menu | Persistent access to the main task. |
| 2 | Compact Hero | A real product and quick introduction | View menu and prices | Understand the value and choose a path immediately. |
| 3 | MARO's Picks | 3–4 actual products with prices | Product / Full menu | Turn interest into a tangible choice. |
| 4 | Active Offer — optional | One offer with brief terms | Redeem through the available method | After products are understood, without obstructing entry. |
| 5 | Visit MARO | Venue photos, branches, hours, and trust evidence | Directions | Help customers move from products to a visit decision. |
| 6 | A Touch of the Story | Image and short paragraph | About MARO | Build personality without interrupting selection. |
| 7 | Conversion Footer | Contact, links, and a final decision | Menu or branches depending on page | End the journey with a clear action. |

**There is no full menu at the bottom of the homepage.** The menu has its own page; homepage product content is simply a curated selection from the same source.

---

# 37. All 45 Problems → Corresponding Solutions

**This maps proposed solutions; it does not claim that the website has already been implemented or tested.**

| Audit Problem | Proposed Solution | Where Is It Addressed? | Phase |
|---|---|---|---|
| **1. Hidden prices** | Visible price on every card, with sizes and pricing reference clarified. | Menu and card | 1 |
| **2. Product list does not support sales** | Image, name, distinguishing description, price, and understandable action. | Product Card | 1 |
| **3. Sparse product details** | Hybrid detail with actual information and a context-appropriate action. | Product Detail | 1 |
| **4. Missing product images** | Consistent real photography and optimized sizes; complete coverage is part of resolution. | Catalog, cards, and details | 1 |
| **5. Menu does not support decisions** | Approved picks, then Taste Finder and best-seller data. | Recommendations | 1–2 |
| **6. Long homepage journey** | Short homepage, standalone menu, and direct QR entry. | IA and journeys | 1 |
| **7. Duplicated preview and full menu** | One product selection linked to a standalone menu, rather than two competing sections. | Homepage / Menu | 1 |
| **8. Empty hero space** | Content-driven height, with image and CTA appearing early. | Hero | 1 |
| **9. No image that creates desire** | Clear photography of a real product in the first general-entry experience. | Hero | 1 |
| **10. Oversized navbar** | Compact header and a clear height limit for fixed layers. | Navigation | 1 |
| **11. Social prioritized above menu** | Move social links to a secondary level and emphasize the menu. | Header / Footer | 1 |
| **12. Duplicated logo** | One appropriately sized brand mark. | Header | 1 |
| **13. Talabat's visual dominance** | A contextual channel within MARO's identity, rather than a dominant banner. | CTA / Talabat | 1 |
| **14. Floating button obscures content** | Remove it; reserve space for any future service bar. | Mobile layout | 1 |
| **15. Ambiguous Talabat icon** | Explicit text identifying the channel and destination. | Ordering links | 1 |
| **16. Inconsistent CTA priority** | A defined primary action for each context. | CTA Strategy | 1 |
| **17. No next step after a product** | Selections to show staff, an ordering channel, or a branch; direct ordering later. | Product Detail | 1, then 4 |
| **18. Horizontally truncated categories** | A complete category list in a sheet, without relying on clipping and swiping. | Categories | 1 |
| **19. Long category names** | Customer-friendly classification and short, fully displayed labels. | Category model | 1 |
| **20. Category heading outweighs product information** | Small functional headings, prioritizing name and price. | Menu hierarchy | 1 |
| **21. Large empty rows** | Horizontal cards with appropriate information density and flexible height. | Product Card | 1 |
| **22. Repeated "Tap to view price"** | Remove the sentence and show prices directly. | Product Card | 1 |
| **23. Weak contrast** | Approved text colors, contrast measurement, and readability testing. | Design System | 1 |
| **24. Text duplicated inside and outside artwork** | Images without essential embedded text; content appears as interface text. | Offers | 1 |
| **25. Offers effectively larger than the screen** | Suitable image ratios and compact cards without forcing tall posters. | Offers / Photography | 1 |
| **26. Carousel requires many instructions** | Static presentation or a short list with a clear conventional action. | Offers interaction | 1 |
| **27. Unclear offer validity** | Start, end, terms, branches, channel, and expired state. | Offer model | 1 |
| **28. Oversized branch cards** | Compact cards, with details on the branch page. | Branch listing | 1 |
| **29. Missing practical branch information** | Hours, services, and contact methods; live status once data is ready. | Branch Detail | 1, then 2 |
| **30. No clear direct contact** | Phone and an approved contact method for each branch. | Branches / Footer | 1 |
| **31. About section longer than its journey value warrants** | Short paragraph and a link to a standalone page. | Homepage / About | 1 |
| **32. About image does not show the venue** | Real branch, barista, and preparation photos. | Visit MARO / About | 1 |
| **33. Generic brand-story claims** | Verified details, images, and evidence instead of general promises. | Content / About | 1–2 |
| **34. Emojis inconsistent with identity** | Consistent icons and product photos as the main visual element. | Design System | 1 |
| **35. Excessive empty space** | A spacing system and content-driven heights. | All templates | 1 |
| **36. Low mobile information density** | Adjust header, cards, and headings; avoid stacking sticky bars. | Mobile system | 1 |
| **37. Missing search** | Arabic/English search, aliases, and results with images and prices. | Menu Search | 1 |
| **38. Missing cross-selling** | One relevant optional pairing without blocking the action. | Detail / Cart later | 2 |
| **39. Missing social proof** | Real source links first, then approved display of reviews and content. | Branch / Homepage | 1–2 |
| **40. Visible Vercel address** | Brand-owned domain, with old links redirected and tested. | Website launch | 1 |
| **41. Developer highlighted in a competing color** | Small neutral credit as agreed. | Footer | 1 |
| **42. Footer is not a conversion point** | Appropriate closing action and practical contact options. | Footer | 1 |
| **43. Unsuitable Arabic letter spacing** | Adjust Arabic typography without unnecessary decorative tracking. | Text tokens | 1 |
| **44. Oversized headings** | Defined hierarchy, with text wrapping and zoom testing. | Design System | 1 |
| **45. Experience feels more like a landing page than a menu platform** | Independent destinations, usage context, a unified catalog, and scalable service channels. | Entire product structure | 1, then phased expansion |

---

# 38. The 10 Most Important Changes on a Limited Budget

| Rank | What We Implement | Why Start Here? |
|---|---|---|
| 1 | Approved catalog with visible prices and sizes | The foundation for decisions and all later development. |
| 2 | Standalone menu page and direct QR entry | The shortest route to the core task. |
| 3 | Readable product cards with distinguishing descriptions | Compare and choose without repeated opening. |
| 4 | Clear search and categories | Serves both customers seeking a specific item and general browsers. |
| 5 | Small header and removal of obstructive floating elements | Continuous improvement across all screens. |
| 6 | Real photos, starting with signature items and expanding | Build desire without delaying price publication. |
| 7 | Useful product details and contextual action | The journey does not end at reading a price. |
| 8 | Approved branch, contact, and hours information | Turn interest into a visit or contact. |
| 9 | Compact homepage and branded domain | A clear entry point and independent, shareable presence. |
| 10 | Performance, accessibility, measurement, and device testing | Confirm that improvements actually work, rather than merely look better. |

**At this budget level, I would not spend on AI, gamification, or advanced CRM.**

I consider content data and photography part of implementation, not side tasks to leave until after the interface is built.

---

# 39. My Final Vision

MARO should become:

> **A place where customers discover what suits them, access service easily, and find a real reason to return.**

Today: an excellent menu, clear prices and images, understandable branch information, and an ordering channel that does not confuse customers.

Next: saved selections, campaigns that land on the right page, and rewards tied to actual purchases.

Then, when operations are ready: pickup, table ordering, reliable tracking, and integration with the café's systems.

**The most important strategic decision: build the data and journey foundations now, and add complexity only when it provides value and can be operated effectively.**

This makes MARO a platform that can grow, while customers continue to see a simple experience: **choose, order or visit, and return easily.**
