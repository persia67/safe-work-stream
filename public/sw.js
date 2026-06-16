// Service worker for full offline support (local-first build).
// - Pre-cache the app shell on install.
// - HTML navigations: network-first → cache fallback.
// - Static assets: cache-first.
// - Any request to a remote API host (supabase.*) is ignored — the app no
//   longer talks to Supabase at runtime.

const VERSION = 'v4-local-first';
const APP_CACHE = `hse-app-${VERSION}`;
const ASSET_CACHE = `hse-assets-${VERSION}`;
const PRECACHE_URLS = ['/', '/index.html', '/manifest.json', '/seed/seed.json'];

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
    /\.(?:js|css|woff2?|ttf|otf|png|jpg|jpeg|svg|webp|ico|json)$/i.test(url.pathname);
}

function isRemoteApi(url) {
  return url.hostname.includes('supabase.co') || url.hostname.includes('supabase.in');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Don't intercept remote API calls — let the browser handle the (likely
  // failing) request; in local mode the app shouldn't make any.
  if (isRemoteApi(url)) return;

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
