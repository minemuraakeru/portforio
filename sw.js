const CACHE_NAME = 'akeru-min-portfolio-v2';

function getBase() {
  const path = self.location.pathname.replace(/\/sw\.js$/, '');
  return self.location.origin + (path.endsWith('/') ? path : path + '/');
}

self.addEventListener('install', (event) => {
  const base = getBase();
  const urls = [
    base,
    base + 'index.html',
    base + 'stylesheet.css',
    base + 'sub-stylesheet.css',
    base + 'script.js',
    base + 'text-animation.js',
    base + 'images/icon.png',
    base + 'images/favicon_orange.svg',
    base + 'manifest.json'
  ];
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        urls.map((url) => cache.add(url).catch(() => {}))
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (!url.startsWith(self.location.origin)) return;
  if (event.request.mode === 'cors') return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((res) => {
          if (res.status === 200 && /^(document|script|style|image|font)$/.test(event.request.destination)) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            const base = getBase();
            return caches.match(base + 'index.html').then((fallback) => fallback || caches.match(base));
          }
          throw new Error('offline');
        });
    })
  );
});
