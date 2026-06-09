// Updated cache version forces fresh download
const CACHE = 'mbrc-estimator-v3';
const CORE = [
  '/mbrc-estimator/',
  '/mbrc-estimator/index.html',
  '/mbrc-estimator/view.html',
  '/mbrc-estimator/icon-192.png',
  '/mbrc-estimator/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(res => {
      if(e.request.method === 'GET' && e.request.url.startsWith(self.location.origin)){
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
