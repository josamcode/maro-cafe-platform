# Public branch discovery

September 27, 2026. Phase-one presentation: homepage → branch selection → branch details/directions, with explicit inside entry.

## Routes and navigation

- `/branches` lists the three source-listed locations in the shared bilingual shell.
- `/branches/faisal`, `/branches/sahl-hamza` and `/branches/main-haram` provide address information, direct Maps directions, the shared menu with branch context, the general MARO contact number and links to other locations. Unknown slugs show a localized recovery page.
- The homepage branch section links to details and retains a separate immediate directions action. Desktop and mobile Locations navigation now opens the directory; homepage visit anchors still reach the branch section.
- “At MARO right now?” is an optional control on the homepage branch section, directory and public menu. It opens an accessible branch-choice dialog. With an explicit branch already selected, the same prompt links directly to that inside menu. Menu search/category parameters are retained; arbitrary table/session parameters are not propagated. No popup opens automatically.
- General entry remains outside even after inside navigation. Picks retain their existing browser/origin storage. Preferences reuse the current locale/theme controls.

## Shared data and components

`features/branches/data.ts` is the single preview registry for branch names, areas, source-listed addresses, Maps destinations and the general contact number. Home, directory, details, menu context, inside selector and QR labels resolve this registry. It replaces repeated branch names in the menu adapter and homepage. `assets/maro/metadata/branches.json` retains source evidence and conflicts; it is not a second runtime source.

BranchList, BranchActions, BranchMood and AtMaroPrompt are feature components composed from existing shared UI primitives. BranchActions reuses one Maps link policy and menu-context convention. Customer journeys continue to use one menu and picks implementation.

The directory places its branch list before the atmosphere photograph on mobile, keeping location selection and directions close to the introduction. Desktop places the photograph beside the introduction, with the shared divided list below. Branch details keep directions and menu actions beside each other on narrow screens.

The previous `/branches` API demonstration has been replaced with the source-listed preview, just as the inside route was in D018. The typed API client, database branch module and API endpoints remain intact. The next shared-data phase must introduce a common authoritative adapter and stable identities across public and inside experiences.

## Content evidence and limits

- Faisal: the collected website lists 6 Al-Omara Street, Al-Taawon, Faisal; Sahl Hamza: 13 Sahl Hamza Street, Haram, Giza. Displayed translations follow that evidence and remain pending owner confirmation.
- Main Haram has conflicting 427/430 street numbers across the archived website/social/Maps sources. Display the area-level address and the supplied Maps destination, without selecting an unverified street number.
- The collected general phone is not presented as a branch-specific number.
- Opening hours and specific amenities are unconfirmed. The visit information asks customers to call about hours/seating/services; it does not claim 24-hour service, current open status, Wi-Fi, parking, bookings or delivery availability.
- Existing MARO barista photography is reused as a general atmosphere image with an explicit non-branch-specific caption. No photo is represented as verified footage of an individual branch.
- Attempts to reopen the published website and supplied Maps link through web retrieval during this implementation were unavailable. No new independent verification was inferred from those attempts. The private-preview footer now covers menu and branch data confirmation.

## Remaining phase-one scope

Branch discovery and explicit context switching are implemented. Product curation, approved pairing data, offers, shared authoritative content management and intent measurement remain separate work. No confirmed visit, purchase or entitlement is inferred from navigation or Maps clicks. Public launch still needs owner-approved details, branch-specific photography where available and browser/device release checks.
