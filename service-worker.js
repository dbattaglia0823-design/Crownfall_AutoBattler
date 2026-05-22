const CACHE_VERSION = "crownfall-v36";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/style.css",
  "./js/data.js",
  "./js/leaderboard.js",
  "./js/state.js",
  "./js/ui.js",
  "./js/combat.js",
  "./js/gauntlet.js",
  "./js/map.js",
  "./js/devtools.js",
  "./js/main.js",
  "./assets/icons/Crownfall.png",
  "./assets/heroes/knight-sheet.png",
  "./assets/heroes/rogue-sheet.png",
  "./assets/heroes/wizard-sheet.png",
  "./assets/enemies/goblin-sheet.png",
  "./assets/enemies/skeleton-sheet.png",
  "./assets/enemies/orc-sheet.png",
  "./assets/enemies/wolf-sheet.png",
  "./assets/enemies/bandit-sheet.png",
  "./assets/enemies/cultist-sheet.png",
  "./assets/enemies/dark-archer-sheet.png",
  "./assets/enemies/plague-rat-sheet.png",
  "./assets/enemies/armored-knight-sheet.png",
  "./assets/enemies/fallen-knight-sheet.png",
  "./assets/enemies/necromancer-sheet.png",
  "./assets/enemies/wraith-sheet.png",
  "./assets/enemies/troll-sheet.png",
  "./assets/enemies/raider-sheet.png",
  "./assets/enemies/boss-sheet.png",
  "./assets/enemies/eternal-crown-sheet.png",
  "./assets/skills/wizard_curse.png",
  "./assets/skills/wizard_iceball.png",
  "./assets/skills/wizard_lightning.png",
  "./assets/skills/rogue_poison.png",
  "./assets/audio/Main%20New.ceol",
  "./assets/audio/Side%20Slow.ceol"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_VERSION).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
