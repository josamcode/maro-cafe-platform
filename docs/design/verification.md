# Foundation verification

September 27, 2026.

- Production web build completed successfully.
- Five Playwright checks passed: existing outside entry, component interaction journey, and bilingual overflow checks at 360px, 768px and 1440px.
- Interaction coverage includes keyboard opening of Select, branch selection, unchecked consent by default, checkbox keyboard toggle, switch, radio selection, modal Escape and restored trigger focus, language switching, tabs, category filtering, local pick state, validation association and disabled controls.
- Live Chrome review covered English desktop, Arabic mobile at 390px, the custom RTL select and modal placement. No browser errors were reported during the inspected state.
- Contrast calculations: primary text/paper 15.84:1; muted text/paper 6.12:1; muted text/cream 5.53:1; control boundary/paper 3.78:1; focus/paper 5.58:1; error/paper 6.66:1; success/success surface 6.52:1.
- Initial E2E failures were caused by using 127.0.0.1 against a localhost development origin. The runner now uses localhost consistently; the rerun passed. Browser evaluation callbacks require the DOM library in the test TypeScript configuration.

This is not a complete accessibility certification. Screen-reader behavior, Safari/iOS, real-device text scaling, nested overlay combinations and final customer journeys need checks as those features are built. Full site localization and verified commerce data remain future integration work.

## Outside homepage and softened hero

September 27, 2026, subsequent implementation.

- Homepage and workbench share the arched `HeroMedia` composition. Live Chrome visual review covered desktop Arabic/English, the Arabic hero at 390px and the mobile menu dialog.
- Lint, workspace type checking and production web compilation passed.
- The expanded eight-test Playwright suite covers the existing component journey plus homepage Arabic default, persistent English selection, document direction, localized modal direction, Arabic/English menu search, an empty result, collection preselection, Escape/focus restoration and source-linked branch directions.
- Both homepage/menu and workbench are checked at 360px, 768px and 1440px in both languages, including horizontal overflow. Long-menu scrolling retains a visible close button.
- A workbench test exposed a timing race between Radix returning focus to the Select trigger and the next keyboard action. The test now awaits popup closure and restored focus before moving to the checkbox; it retains keyboard interaction coverage.
- The homepage uses source-listed menu data pending owner confirmation. The QR/ordering experience and commerce integrations have not been validated by these presentation checks.

## Discovery and mobile navigation refinement

- Nine Playwright checks passed after introducing the compact collection action, prominent starting price, location rows and controlled mobile navigation dialog.
- New coverage checks navigation dismissal, Escape/focus restoration, branch-anchor visibility beneath the sticky header and the Maps destination in both languages at 390px. Existing bilingual layout checks at 360px, 768px and 1440px continue to pass.
- Lint, workspace type checking and production web build passed.
- Live Chrome review inspected Arabic desktop collection cards and the locations panel, plus the 390px centered header, navigation overlay and Arabic/English location rows. The revised shared patterns are also demonstrated in the workbench.
- Source-listed prices and operational details remain pending owner confirmation; visual polish does not establish launch readiness.

## Device preferences and responsive refinement

- Twelve E2E scenarios are covered. Existing nine layout/navigation scenarios passed; the three new preference/card scenarios passed on targeted rerun after making theme selection optimistic and awaiting locale persistence before reload.
- New checks cover English/Arabic browser defaults, live OS color-scheme changes, manual light/dark persistence, explicit language persistence, resetting both preferences, activating a category from its image area and keyboard, and same-row hero actions at 360px in both languages.
- Lint, workspace type checking and the production web build passed. Live Chrome review covered Arabic/English mobile dark mode, the light appearance dialog, compact hero sizing, modest media corners and social footer controls.
- Theme colors are applied in CSS on first paint; no localStorage hydration step or client theme flash is introduced. Browser language is resolved server-side from Accept-Language, with explicit cookies taking priority.
- CSS light-dark support, remaining browser/device coverage and final accessibility/performance review remain part of release verification. The menu dialog is still a discovery preview, not the final menu product.

## Direct theme toggle follow-up

The appearance dialog and reset control were removed at the user's request. Preference tests now exercise a single click in both directions, ensure no dialog opens, verify the pressed state and confirm persistence after reload. Device scheme remains the initial fallback and language behavior is unchanged.

All three targeted preference/card tests passed, along with lint and the production build. The toggle stays disabled until the browser preference is available during hydration so an early click cannot be lost or invert an assumed scheme.

## Standalone menu and product details

September 27, 2026.

- All 17 Playwright scenarios passed after updating homepage entry points and adding menu coverage. Tests exercise Arabic/English search, diacritics, empty-state recovery, category links, history/reload persistence, locale changes, valid/invalid branch context, whole-card activation, actual variant price changes, single-price products, Escape and restored focus.
- Menu, detail dialogs, homepage and workbench fit 360px, 768px and 1440px in both languages. Menu coverage also toggles appearances; existing preference tests continue to verify initial device defaults and manual persistence.
- Lint, workspace type checking, test TypeScript checking and the final production web build passed. The initial suite run exposed an incorrectly encoded dash in a test locator; correcting that locator restored the directions check.
- Live Chrome review covered Arabic dark-mode menu and product details at 390px and English light-mode desktop. The review prompted automatic horizontal positioning of the active category and a themed scrollbar. The temporary viewport override was reset afterward.
- Development runs logged an interrupted response during rapid navigation; it did not fail the completed journeys. Checks do not establish POS integration, verified branch availability, authoritative prices or release-wide performance/accessibility acceptance.
- The production preview is available at `/menu`. See the [menu handoff](menu-experience.md) for data ownership and remaining scope.

## Development photography

- Ten affected menu, homepage-entry and workbench scenarios passed with photographs enabled. Coverage includes whole-card activation, variant selection, focus restoration and both languages at 360px, 768px and 1440px, including dark/light menu layouts.
- Lint and production compilation/type checking passed. The first product image loads eagerly; remaining catalog images load lazily at responsive sizes. Detail images load when the dialog mounts.
- Live Chrome review inspected Arabic dark-mode mobile thumbnails and the strawberry-matcha candidate inside its product dialog. Detail spacing was tightened to preserve room for price options alongside the photograph. Image sources and temporary mappings are recorded in [menu photography](menu-photography.md).

## Mobile category disclosures

- All 18 E2E scenarios passed. New coverage verifies six initially closed mobile categories, Enter/Space toggling, hidden products staying out of the visible view, automatically expanded search matches, reset-to-closed behavior, and expanded desktop layout after resizing in both languages.
- The mobile sticky search area is asserted below 75px high. Existing direct-category links, product detail focus restoration, theme preferences and 360/768/1440px layouts remain covered.
- Lint and the production build/type check passed. Shared Disclosure is demonstrated in the workbench. Page and overlay scrollbars now share thin neutral styling; rendering details remain browser-dependent.

## Local My Picks

- All 21 Playwright scenarios passed, including adding separate sizes, merging repeated selections, quantity changes, removal, reload persistence, cross-tab updates, locale/theme changes, cashier presentation and unavailable browser storage. Four model tests passed for malformed storage, obsolete identities, duplicate quantities and current-catalog price resolution.
- Lint, workspace type checking and production compilation passed. Web model tests use the web application's Bundler TypeScript configuration; the root NodeNext test configuration excludes those files to avoid applying the backend module resolver to frontend imports. They remain included in web type checking and Vitest execution.
- Live Chrome review at 390px inspected the Arabic launcher, editable list, quantity/total updates and cashier view. The list uses divided rows without nested card surfaces. The fixed launcher has matching bottom document space, and the dialog keeps its close control accessible.
- My Picks is a local planning list, not an order or a verified visit. Prices and availability require branch confirmation; storage may be cleared by the browser and concurrent tab edits are last-write-wins. See [My Picks](my-picks.md) for boundaries and future integration.

## Direct card additions

- The 22-scenario E2E suite now covers keyboard addition of single-price products and direct addition of exact sizes without opening a dialog, in both languages with a theme change. The new journey also verifies merged quantities and continued whole-card detail access.
- Nineteen scenarios passed in the full run. Three existing responsive scenarios initially used an ambiguous button locator after the cards gained multiple actions; naming the details trigger explicitly restored all three on targeted rerun at 360px, 768px and 1440px in both languages and appearances.
- Lint, workspace type checking and the production build passed. Live Chrome review at 390px confirmed side-by-side Arabic size actions without duplicated size text or a details arrow. Product details and quick additions remain separate sibling controls with shared styling and no nested buttons.
