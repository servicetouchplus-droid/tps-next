const CACHE_NAME = 'touchplus-cache-v2';

// URLs statiques à mettre en cache
const STATIC_CACHE_URLS = [
  '/',
  '/style.css',
  '/script.js',
  '/db.js',
  '/config.js',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// Pages HTML à toujours refetcher (pas de cache forcé, mais fallback possible)
const DYNAMIC_PAGES = [
  '/index_raw.html',
  '/login_raw.html',
  '/register_raw.html',
  '/dashboard-admin_raw.html',
  '/dashboard-client_raw.html',
  '/services_raw.html',
  '/blog_raw.html',
  '/contact_raw.html',
  '/about_raw.html',
  '/realisations_raw.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cache ouvert - Installation v2');
        // On cache les assets statiques en ignorant les erreurs individuelles
        return Promise.allSettled(
          STATIC_CACHE_URLS.map(url => cache.add(url).catch(err => {
            console.warn('[SW] Impossible de mettre en cache:', url, err);
          }))
        );
      })
      .then(() => self.skipWaiting()) // Forcer l'activation immédiate
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    // Nettoyer les anciens caches
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Prendre le contrôle immédiatement
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ne pas intercepter les requêtes non-GET
  if (request.method !== 'GET') return;

  // Ne pas intercepter les requêtes vers des services externes (Supabase, etc.)
  if (url.hostname !== location.hostname && !url.hostname.includes('fonts.')) return;

  // Stratégie pour les pages HTML dynamiques : Network First
  const isDynamicPage = DYNAMIC_PAGES.some(p => url.pathname.includes(p) || url.pathname === p);
  
  if (isDynamicPage || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Mettre en cache la réponse fraîche
          if (response.ok) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
          }
          return response;
        })
        .catch(() => {
          // En cas d'échec réseau → servir depuis le cache
          return caches.match(request)
            .then(cached => {
              if (cached) return cached;
              // Fallback vers la page d'accueil
              if (request.mode === 'navigate') {
                return caches.match('/') || caches.match('/index_raw.html');
              }
            });
        })
    );
    return;
  }

  // Stratégie pour les assets statiques : Cache First
  event.respondWith(
    caches.match(request)
      .then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
          }
          return response;
        }).catch(() => {
          // Asset non disponible - retourner null silencieusement
          return new Response('', { status: 503, statusText: 'Service Unavailable' });
        });
      })
  );
});

// Gérer les messages depuis l'application
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});