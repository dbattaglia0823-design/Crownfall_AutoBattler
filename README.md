# Crownfall Auto Battler

Crownfall is a browser-based HTML/CSS/JS game. This project keeps one shared game codebase and adds:

- normal browser play
- mobile-installable PWA support
- offline caching
- Electron desktop support for Windows

## Project Structure

```text
Crownfall/
  index.html
  manifest.webmanifest
  service-worker.js
  package.json
  README.md

  css/
    style.css

  js/
    data.js
    state.js
    ui.js
    combat.js
    map.js
    devtools.js
    main.js

  assets/
    audio/
      Main New.ceol
      Side Slow.ceol
    icons/
      icon-192.png
      icon-512.png
      maskable-192.png
      maskable-512.png
    heroes/
    enemies/

  electron/
    main.js

  scripts/
    serve.js
```

## Run In Browser Locally

You can open `index.html` directly for quick browser testing.

For the best local test, especially for PWA/service worker behavior:

```bash
npm run serve
```

Then open:

```text
http://localhost:4173
```

You can also use:

```bash
npm start
```

## Run As PWA Locally

Service workers do not run from `file://`, so use the local server:

```bash
npm run serve
```

Then open `http://localhost:4173` in Chrome, Edge, or Safari. The manifest and service worker are loaded from relative paths, so the game can also work from a GitHub Pages-style subpath or an itch.io HTML5 upload.

## Install On iPhone

1. Host the game on HTTPS, such as GitHub Pages, itch.io, Netlify, or another web host.
2. Open the hosted game in Safari.
3. Tap Share.
4. Tap Add to Home Screen.
5. Launch Crownfall from the new home screen icon.

## Install On Android

1. Host the game on HTTPS.
2. Open the hosted game in Chrome or Edge.
3. Use Install app, or Add to Home Screen from the browser menu.
4. Launch Crownfall from the installed icon.

## Run Electron Desktop App

Install dependencies first:

```bash
npm install
```

Start the desktop app:

```bash
npm run start:electron
```

The Electron app loads the same `index.html` and assets as the browser/PWA version. DevTools can be toggled with `F12` or `Ctrl+Shift+I` during development.

## Build Windows Desktop App

Install dependencies:

```bash
npm install
```

Build Windows packages:

```bash
npm run package:win
```

Output goes to:

```text
dist-electron/
```

For an unpacked local build:

```bash
npm run package:dir
```

## Clear Service Worker/Cache During Development

If old files appear after edits:

1. Open browser DevTools.
2. Go to Application.
3. Open Service Workers and click Unregister.
4. Open Storage and click Clear site data.
5. Reload the page.

The service worker uses a versioned cache name in `service-worker.js`. When cached files change, bump `CACHE_VERSION` to force clients to install a fresh cache.

## Asset Notes

Sprite paths live in:

```text
js/data.js
```

Look for:

```js
const SPRITE_SHEETS = { ... }
```

Sprite sheets may be SVG or PNG. The current renderer expects six frames in one horizontal row and uses:

```css
background-size: 600% 100%;
```

Recommended PNG sheet sizes:

- `384x64` for six `64x64` frames
- `288x48` for six `48x48` frames
- `576x96` for six `96x96` frames

Install icons live in:

```text
assets/icons/
```

Audio files can be placed in:

```text
assets/audio/
```

The current music source is:

```text
assets/audio/Main New.ceol
```

It is loaded by the WebAudio music player in `js/ui.js` and cached for offline play by `service-worker.js`. If you rename or move it, update `musicState.source` in `js/ui.js` and the matching path in `CORE_ASSETS` in `service-worker.js`.

If more audio files become required for offline play, add their paths to `CORE_ASSETS` in `service-worker.js`.

## Hosting Notes

- Use relative paths for new assets.
- `manifest.webmanifest`, `service-worker.js`, `index.html`, `css/`, `js/`, and `assets/` should be uploaded together.
- For GitHub Pages subpaths, keep `start_url` and `scope` as `./`.
- For itch.io HTML5 uploads, zip the project with `index.html` at the zip root.
