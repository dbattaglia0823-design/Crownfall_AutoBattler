# Crownfall — architecture and save boundaries

**Verified:** file mapping and selected implementation on 2026-11-24; no runtime executed.

| File | Responsibility |
|---|---|
| `index.html` | Screen markup, script loading order and events |
| `css/style.css` | Styles and responsive UI |
| `js/data.js` | Game constants, classes, opponents, abilities and progression data |
| `js/state.js` | Player save, normalization, backups and current run/battle state |
| `js/combat.js` | Battle simulation and combat flow |
| `js/map.js` | Run stage/map flow, crossroads, shops and stage navigation |
| `js/ui.js` | Screen DOM references, rendering and interactions |
| `js/gauntlet.js` | Gauntlet/challenge mode |
| `js/leaderboard.js` | Local leaderboard entries and normalization |
| `js/devtools.js` | Development tooling |
| `js/main.js` | Startup, browser event wiring and PWA registration |
| `service-worker.js` | Offline asset caching |
| `electron/main.js` | Desktop shell |

## Critical save contract

`js/state.js` defines `SAVE_KEY = "crownfall_autobattler_save_v5"`, `SAVE_SCHEMA_VERSION = 2`, temporary/backup keys, normalization routines and account/run state. Do **not** rename keys, drop fields, overwrite saves or bypass migration handling while making unrelated changes. Verify fresh saves, loading old saves, export/import, mid-run state and recovery when persistence changes.

## Browser loading

`index.html` includes classic scripts in this order: data, leaderboard, state, UI, combat, gauntlet, map, devtools, main. Globals are shared intentionally; `js/main.js` calls `initGame()`. Keep dependencies and ordering intact unless converting to modules with a tested migration.

**Verification boundary:** Code ownership is a map of inspected source, not an assurance that every behavior is correct.
