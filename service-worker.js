const CACHE_NAME = 'home-workout-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/home_workout_assets/bent-over-row.png',
  '/home_workout_assets/farmers-walk.png',
  '/home_workout_assets/forearm-plank.png',
  '/home_workout_assets/goblet-squat.png',
  '/home_workout_assets/kegel-exercise.png',
  '/home_workout_assets/kettlebell-swing.png',
  '/home_workout_assets/lateral-lunge.png',
  '/home_workout_assets/overhead-press.png',
  '/home_workout_assets/plank-kettlebell-drag.png',
  '/home_workout_assets/russian-twist.png',
  '/home_workout_assets/side-plank.png',
  '/home_workout_assets/single-arm-forward-lunge.png',
  '/home_workout_assets/single-leg-rdl.png',
  '/home_workout_assets/weighted-glute-bridge.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('/index.html', copy));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      });
    })
  );
});
