const CACHE_NAME = "sbp-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/11.png",
  "/2.png"
];

// INSTALL SW — Cache essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// ACTIVATE SW — Remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH — Serve from cache first, then fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return (
        resp ||
        fetch(event.request).catch(() =>
          caches.match("/index.html") // offline fallback
        )
      );
    })
  );
});
