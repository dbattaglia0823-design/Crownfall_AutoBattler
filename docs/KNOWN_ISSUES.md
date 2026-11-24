# Crownfall — verification watchlist

**Not a confirmed-defect list.** This review did not execute a game. Record an issue as open only after reproducing against a specific SHA.

| Risk to check | Code/evidence to inspect | Status |
|---|---|---|
| Older saved account/run versions still load and export without data loss | `js/state.js`, `SAVE_SCHEMA_VERSION`, backup keys | Unverified in this review |
| Offline PWA cache references resolve after asset changes | `service-worker.js` | Unverified in this review |
| Browser and Electron screen navigation/assets behave alike | `index.html`, `electron/main.js` | Unverified in this review |
| Run, Gauntlet and leaderboard state remain separate and stable | `js/state.js`, `js/gauntlet.js`, `js/leaderboard.js` | Unverified in this review |
| Mobile layout and input work on devices | `css/style.css`, `js/ui.js` | Unverified in this review |

When validated, add reproduction, expected/actual behavior, tested SHA, mitigation, test reference and linked PR. Remove a risk only with evidence.
