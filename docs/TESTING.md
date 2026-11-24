# Crownfall — testing and validation

**Status at 2026-11-24:** `package.json` defines `serve`, `start:electron` and packaging commands, but **no `test` or build verification script**. No `.github/workflows/` files or tests were found in the inspected `main` tree. This documentation change did not run a game session.

## Manual validation before gameplay changes

1. Start `npm run serve` and open the local site; check browser console for script errors.
2. Start a new game, choose difficulty/hero, progress through battle and rewards, interact with crossroads/shop and end a run.
3. Refresh and reload existing progress; test save export/import, backup recovery, settings persistence and equipment. Back up important saves before any migration test.
4. Verify responsive browser/mobile viewports, keyboard/touch where supported, and screen navigation.
5. When changing offline assets, check service worker caching/offline reload, not just a live page.
6. For desktop-related edits, start `npm run start:electron` and verify startup, asset loading and persistence in Electron.

**Automated test gap:** Add focused Node/browser tests and CI in a future behavior-change PR, with test commands and observed results recorded here. A static syntax check or startup success alone does not prove combat/save correctness.

## Evidence to capture

Commit SHA, exact command/device/browser, expected vs observed behavior, passed/failed checks, save fixtures used, and any unrun checks. Do not record invented CI status.
