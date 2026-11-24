# Crownfall — development guidance

This is an **existing browser/PWA/Electron game**, not a toolkit demo. Keep game-specific decisions in this repository.

1. Start at `docs/INDEX.md`; read the one relevant subsystem note and inspect actual JavaScript and HTML. Source code and observed tests override documentation.
2. `index.html` loads classic scripts in a deliberate dependency order. Preserve globals and load order when editing or splitting files.
3. `js/state.js` owns persisted account/run state, normalization and saves. Preserve `SAVE_KEY`, `SAVE_SCHEMA_VERSION`, backups, exported save compatibility and player progress unless a migration is explicitly planned and tested.
4. Combat, character progression, run map, Gauntlet, leaderboard and UI work must preserve existing behavior; check PWA offline/cache paths and Electron startup when relevant.
5. Before making changes, inspect `package.json` and existing scripts. There is **no automated test suite or CI configured as of the 2026-11-24 documentation survey**. Do not claim `npm test` passed. Capture manual browser/Electron tests and add focused tests when modifying behavior.
6. Use `docs/ARCHITECTURE.md`, `docs/TESTING.md` and the specific code. After a verified change, update the affected document and short `docs/HANDOFF.md` with exact files, results, risks and next action.
7. Shared patterns and opt-in skills: [Game-Dev-Toolkit](https://github.com/dbattaglia0823-design/Game-Dev-Toolkit/tree/main/knowledge). A GitHub link is not automatic workspace access; local skills are snapshots, not live dependencies.
8. Do not commit credentials, player saves, local Obsidian settings or third-party code/assets without licensing review.
