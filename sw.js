const CACHE_NAME = 'vshdongyduoc-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/gioi-thieu.html',
  '/du-an-noi-bat.html',
  '/dang-ky-thu-nghiem.html',
  '/lien-he.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  // Thêm các trang chi tiết dự án và bài viết kiến thức vào đây nếu cần caching
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        return networkResponse;
      })
    )
  );
});
