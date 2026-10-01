// Service Worker da Azevedo Vidros - PWA
const CACHE_NAME = 'azevedo-vidros-v1';
const CACHE_FOTOS = 'azevedo-vidros-fotos-v14';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME && key !== CACHE_FOTOS)
            .map((key) => caches.delete(key))
      );
    }).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // 🖼️ FOTOS: cache primeiro (depois da 1ª vez, vêm do celular - instantâneo)
  if (url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
    event.respondWith(
      caches.open(CACHE_FOTOS).then((cache) => {
        return cache.match(event.request).then((resposta) => {
          return resposta || fetch(event.request).then((res) => {
            cache.put(event.request, res.clone());
            return res;
          });
        });
      })
    );
    return;
  }

  // 📄 HTML, JSON, JS: rede primeiro, cache como reserva
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});