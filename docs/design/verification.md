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
