/* Offline: cache the app shell, serve cache-first, refresh in the background. */
const CACHE = 'newday-v4';
const ASSETS = ['./', 'index.html', 'styles.css', 'manifest.webmanifest',
  'js/i18n.js', 'js/i18n-extra.js', 'js/store.js', 'js/logic.js', 'js/ui-common.js', 'js/habit-form.js', 'js/onboarding.js',
  'js/view-today.js', 'js/view-week.js', 'js/view-stats.js', 'js/view-notes.js', 'js/view-rewards.js', 'js/view-settings.js', 'js/challenges.js', 'js/ai.js', 'js/app.js',
  'fonts/cairo-arabic.woff2', 'fonts/cairo-latin.woff2', 'fonts/cairo-latin-ext.woff2', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => {
    const net = fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; }).catch(() => hit);
    return hit || net;
  }));
});
