// Service worker for full offline support.
// Strategy:
//   - Pre-cache the app shell on install (best-effort).
//   - HTML navigations: network-first with cache fallback (prevents stale UI
//     while still working when offline).
//   - Static assets under /assets/: cache-first (immutable hashed builds).
//   - Supabase/API requests: network-only (never cached — they require auth).
//   - On install / activate we skipWaiting + claim so the new SW takes over
//     immediately.

const VERSION = 'v3-offline';
const APP_CACHE = `hse-app-${VERSION}`;
const ASSET_CACHE = `hse-assets-${VERSION}`;
const PRECACHE_URLS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) =>
      Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((n) => n !== APP_CACHE && n !== ASSET_CACHE)
          .map((n) => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

function isHTMLNavigation(request) {
  return request.mode === 'navigate' ||
    (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
}

function isAsset(url) {
  return url.pathname.startsWith('/assets/') ||
    /\.(?:js|css|woff2?|ttf|otf|png|jpg|jpeg|svg|webp|ico)$/i.test(url.pathname);
}

function isApi(url) {
  return url.hostname.includes('supabase.co') ||
    url.hostname.includes('supabase.in') ||
    url.pathname.startsWith('/functions/');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never touch API / auth requests — they need fresh network and credentials.
  if (isApi(url)) return;

  // HTML navigations: network-first.
  if (isHTMLNavigation(request)) {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(APP_CACHE).then((c) => c.put(request, copy)).catch(() => {});
          return resp;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/index.html'))
        )
    );
    return;
  }

  // Hashed assets: cache-first.
  if (isAsset(url) && url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((resp) => {
          if (resp.ok) {
            const copy = resp.clone();
            caches.open(ASSET_CACHE).then((c) => c.put(request, copy)).catch(() => {});
          }
          return resp;
        }).catch(() => cached);
      })
    );
    return;
  }

  // Everything else: stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((resp) => {
        if (resp.ok) {
          const copy = resp.clone();
          caches.open(ASSET_CACHE).then((c) => c.put(request, copy)).catch(() => {});
        }
        return resp;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});
