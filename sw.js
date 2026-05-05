// Service Worker — enables offline PWA support
const CACHE = 'uro-calc-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/js/app.js',
  '/js/calculators/psa-doubling-time.js',
  '/js/calculators/briganti.js',
  '/js/calculators/gandaglia.js',
  '/js/calculators/epsi.js',
  '/js/calculators/phi.js',
  '/js/calculators/cpsa.js',
  '/js/calculators/psa-density.js',
  '/js/calculators/psa-velocity.js',
  '/js/calculators/nlr.js',
  '/js/calculators/plr.js',
  '/js/calculators/pni.js',
  '/js/calculators/capra-s.js',
  '/js/calculators/fpsa.js',
  '/js/calculators/egfr.js',
  '/js/calculators/renal-nephrometry.js',
  '/js/calculators/nmibc-risk.js',
  '/js/calculators/eau-risk-groups.js',
  '/js/calculators/eau-bcr-risk.js',
  '/js/calculators/erspc-risk-calculator.js',
  '/js/calculators/pcptrc-20.js',
  '/js/flowcharts/pc-screening.js',
  '/js/flowcharts/pc-active-surveillance.js',
  '/js/flowcharts/pc-bcr-followup.js',
  '/js/flowcharts/pc-adt-monitoring.js',
];

// Install: cache core assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first, fallback to cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((cache) => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
