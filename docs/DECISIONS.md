# Crownfall — observed design decisions

**Status:** Observations from the 2026-11-24 repository snapshot, not claims about historical intent.

| Existing choice | Evidence | Change implication |
|---|---|---|
| Classic browser scripts and global initialization | `index.html`, `js/main.js` | Preserve load order and global names unless migrating deliberately |
| Local persisted account with explicit schema and backup paths | `js/state.js` | Test migrations and preserve player data |
| Browser/PWA and Electron packaging from the same web assets | `package.json`, `service-worker.js`, `electron/main.js` | Check both runtimes after shared UI/path changes |
| Separate data/state/UI/combat/map modules | `js/*.js` | Follow existing responsibility boundaries |
| Game-specific notes stay with game; reusable techniques live in toolkit | This documentation onboarding | Avoid mirrored notes and conflicting sources of truth |

For new decisions include date, alternatives, rationale, linked PR/commit, verification and save compatibility implications. Mark outdated entries superseded rather than erasing them.
