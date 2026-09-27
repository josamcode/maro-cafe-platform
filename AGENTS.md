# MARO project conventions

Read [the design system](docs/design/README.md) and [the decision log](docs/design/decisions.md) before changing customer-facing UI.

- Preserve MARO's ink, cream and muted gold identity. Premium means restraint, strong photography and clear hierarchy.
- Use shared components from `@maro/ui` and semantic tokens. Extend existing components before creating new ones.
- Build recurring layout, typography and interaction patterns once. Do not wrap every one-off semantic element in a meaningless component.
- Browser-default visual controls are not acceptable. Retain semantic HTML and accessible native behavior; style it through the shared library. Use Radix for complex interactions.
- Arabic and English are equal design requirements. Use logical CSS, localized message dictionaries, explicit language/direction on localized regions and portals, and locale-aware number formatting.
- Arabic customer copy should sound natural to Egyptians, warm and respectful. Avoid slang, shouting, fake urgency and exaggerated luxury claims.
- Author documentation, code identifiers, comments and decision records in English. Arabic belongs in localized UI content.
- Document significant design decisions and update the interactive workbench at `/design-system` when shared patterns change.
- Verify keyboard use, focus, validation, disabled states, RTL/LTR and mobile widths for affected interactions.
- Keep business rules and data fetching out of `@maro/ui`. API, database and workers remain independent of presentation.
- Asset and price collection is evidence, not launch approval. Never invent availability, verified reviews, active offers or completed orders.
