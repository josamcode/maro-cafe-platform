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
