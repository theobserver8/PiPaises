// IMPORTANTE: Cada vez que hagas un cambio en tu web, 
// cambia este nombre (ej: pipaises-v3, pipaises-v4...)
const CACHE_NAME = 'pipaises-v5';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instala el service worker y guarda los archivos en caché
self.addEventListener('install', event => {
  // 1. Fuerza la actualización inmediata sin esperar a que se cierren las pestañas
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. NUEVO: Evento Activate para borrar la caché antigua
self.addEventListener('activate', event => {
  // Toma el control de la página inmediatamente
  event.waitUntil(clients.claim());

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Si el nombre de la caché no coincide con el actual, la borramos
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
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