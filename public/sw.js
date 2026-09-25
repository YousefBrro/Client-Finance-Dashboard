/* Tibr service worker: caches the app shell only. Financial data is never cached. */
const CACHE = 'tibr-shell-v1';
const SHELL_KEY = 'shell-html';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Data (Excel files, API calls) always goes to the network.
  if (/\.(xlsx|xlsm|csv|json)$/i.test(url.pathname) || url.pathname.includes('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(SHELL_KEY, copy));
          return response;
        })
        .catch(() => caches.match(SHELL_KEY).then((hit) => hit || Response.error())),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ||
        fetch(request).then((response) => {
          if (response.ok && (url.pathname.includes('/assets/') || /\.(png|svg|woff2?)$/i.test(url.pathname))) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
