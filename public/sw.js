const VERSION = 'v1';
const STATIC = 'static-' + VERSION;
const PAGES = 'pages-' + VERSION;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== STATIC && k !== PAGES).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;
  if (req.headers.has('range')) return;
  if (/\.(pdf|mp4)$/i.test(url.pathname)) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          if (res.ok) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(req, copy));
          }
          return res;
        } catch (err) {
          const hit = (await caches.match(req)) || (await caches.match('/'));
          if (hit) return hit;
          throw err;
        }
      })()
    );
    return;
  }

  if (url.pathname.startsWith('/assets/') || url.pathname === '/manifest.webmanifest' || /\.(png|jpe?g|webp|svg|woff2?|ico)$/i.test(url.pathname)) {
    e.respondWith(
      caches.open(STATIC).then(async (cache) => {
        const hit = await cache.match(req);
        const net = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => hit);
        return hit || net;
      })
    );
  }
});
