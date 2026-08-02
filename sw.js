const CACHE_NAME = "handstand-v13"; // bump on every deploy
const ASSETS = [
  ".", "index.html", "style.css", "app.js", "exercises.js", "sync.js", "config.js",
  "vendor/supabase.js",
  "manifest.json", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  // never intercept API / CDN traffic — sync must always hit the network
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
