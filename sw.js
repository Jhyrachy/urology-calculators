/**
 * Service Worker — PWA offline support
 * Strategies:
 *   - Static assets (CSS, JS, fonts): cache-first, update in background
 *   - Navigation (index.html): network-first with cache fallback
 *   - External resources: network-only
 *
 * Maintenance: Add new calculator/flowchart JS files to the CACHE list only if
 * you need them available offline on first install. The network-first strategy
 * means new files are fetched on demand and cached automatically.
 */
const CACHE_VERSION = 'v3';
const CACHE = `uro-calc-${CACHE_VERSION}`;
const BASE = '/urology-calculators';

/** Core shell files — cached on install, never stale */
const SHELL = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/manifest.json`,
  `${BASE}/css/style.css`,
  `${BASE}/js/app.js`,
  `${BASE}/sw.js`,
];

/** Calculator modules — network-first, cached on success */
const CALCULATORS = [
  'psa-doubling-time', 'psa-velocity', 'fpsa', 'psa-density',
  'nlr', 'plr', 'pni', 'egfr', 'renal-nephrometry',
  'nmibc-risk', 'eau-risk-groups', 'eau-bcr-risk', 'capra-s',
  'phi', 'cpsa', 'briganti', 'gandaglia',
  'erspc-risk-calculator', 'pcptrc-20', 'epsi',
];

/** Flowcharts */
const FLOWCHARTS = [
  'pc-screening', 'pc-active-surveillance', 'pc-bcr-followup', 'pc-adt-monitoring',
];

function calculatorUrls() {
  return CALCULATORS.map(id => `${BASE}/js/calculators/${id}.js`);
}
function flowchartUrls() {
  return FLOWCHARTS.map(id => `${BASE}/js/flowcharts/${id}.js`);
}
function allAssets() {
  return [...SHELL, ...calculatorUrls(), ...flowchartUrls()];
}

/** Install: cache shell only */
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

/** Activate: delete old caches */
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/** Fetch: route-based strategy */
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // External resources: network only
  if (!url.pathname.startsWith(BASE)) return;

  const pathname = url.pathname;

  // Navigation (index.html): network-first
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(`${BASE}/index.html`)
        .then((res) => { if (res.ok) caches.open(CACHE).then(c => c.put(`${BASE}/index.html`, res.clone())); return res; })
        .catch(() => caches.match(`${BASE}/index.html`))
    );
    return;
  }

  // Static assets (CSS, JS with hash or in our lists): cache-first
  const isStatic = pathname.endsWith('.css') ||
                   pathname.includes('/js/app.js') ||
                   pathname.endsWith('.js') ||
                   pathname.endsWith('.json') ||
                   pathname.includes('data:image');

  if (isStatic) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        const networkFetch = fetch(e.request).then((res) => {
          if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          return res;
        }).catch(() => cached || new Response('', { status: 504 }));
        return cached || networkFetch;
      })
    );
    return;
  }

  // Everything else (calculator JS, flowchart JS): network-first with cache fallback
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
