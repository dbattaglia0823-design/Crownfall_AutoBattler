# Crownfall Auto Battler

A medieval roguelike auto-battler built with browser JavaScript, CSS and HTML. The repository also includes a PWA service worker and an Electron desktop wrapper.

## Run locally

- **Browser:** `npm run serve` (local server defaults to port 4173)
- **Desktop development:** `npm run start:electron`
- **Windows package:** `npm run package:win` (requires packaging dependencies and a supported build host)

See `package.json` for the definitive scripts. Browser and Electron behavior must be verified directly; the repository does not currently define an automated `npm test` command.

## Development reference

Start with [docs/INDEX.md](docs/INDEX.md) and [AGENTS.md](AGENTS.md). Game-specific mechanics, save rules and test limitations belong here, not in the shared [Game-Dev-Toolkit knowledge hub](https://github.com/dbattaglia0823-design/Game-Dev-Toolkit/tree/main/knowledge).
