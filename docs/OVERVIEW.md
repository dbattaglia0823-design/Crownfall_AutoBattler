# Crownfall — verified overview

**Status:** Verified from source files on 2026-11-24; runtime behavior untested in this review.

- Medieval roguelike auto-battler with difficulty and hero selection, stage routes, auto-combat, rewards and permanent Essence progression (menu and screens in `index.html`).
- Character selection and persistent equipment, talents, relics, achievements/records, unlock pools, leaderboards, Gauntlet mode and settings are represented in the UI and corresponding `js/` modules.
- Delivery options: local browser via `scripts/serve.js`, PWA assets in `manifest.webmanifest` / `service-worker.js`, Electron desktop bootstrap in `electron/main.js`.

**Scope boundary:** Features visible in source or screens are not proof of complete gameplay or device testing. Before changing balancing or player progression, inspect `js/data.js`, `js/combat.js` and `js/state.js`; preserve existing saves.
