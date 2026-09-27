// Service Worker da Azevedo Vidros - PWA
const CACHE_NAME = 'azevedo-vidros-' + Date.now();

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// ESSENCIAL: sem isso o Chrome não libera a instalação do PWA
self.addEventListener('fetch', (event) => {
  // Deixa o navegador cuidar de tudo, apenas passa adiante
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});