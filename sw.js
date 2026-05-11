const CACHE_NAME = 'pipaises-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instala el service worker y guarda los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepta las peticiones y devuelve la versión en caché si no hay internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el archivo del caché si existe, si no, lo pide a internet
        return response || fetch(event.request);
      })
  );
});