const CACHE_VERSION = "crownfall-v2";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/style.css",
  "./js/data.js",
  "./js/state.js",
  "./js/ui.js",
  "./js/combat.js",
  "./js/map.js",
  "./js/devtools.js",
  "./js/main.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-192.png",
  "./assets/icons/maskable-512.png",
  "./assets/heroes/knight-sheet.svg",
  "./assets/heroes/rogue-sheet.svg",
  "./assets/heroes/wizard-sheet.svg",
  "./assets/heroes/knight-sheet.png",
  "./assets/enemies/goblin-sheet.svg",
  "./assets/enemies/skeleton-sheet.svg",
  "./assets/enemies/orc-sheet.svg",
  "./assets/enemies/wolf-sheet.svg",
  "./assets/enemies/bandit-sheet.svg",
  "./assets/enemies/cultist-sheet.svg",
  "./assets/enemies/dark-archer-sheet.svg",
  "./assets/enemies/plague-rat-sheet.svg",
  "./assets/enemies/armored-knight-sheet.svg",
  "./assets/enemies/fallen-knight-sheet.svg",
  "./assets/enemies/necromancer-sheet.svg",
  "./assets/enemies/wraith-sheet.svg",
  "./assets/enemies/troll-sheet.svg",
  "./assets/enemies/raider-sheet.svg",
  "./assets/enemies/boss-sheet.svg",
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
