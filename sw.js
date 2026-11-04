const CACHE_NAME = 'countdown-pro-v1';
const ASSETS = [
    './',
    './index.html',
    './age_calculator.html',
    './about.html',
    './contact.html',
    './privacy.html',
    './terms.html',
    './style.css',
    './age_calculator.css',
    './script.js',
    './age_calculator.js',
    './theme.js',
    './manifest.json',
    './icon.svg',
    './notification.mp3'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
});
