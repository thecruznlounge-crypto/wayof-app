/* WAYOF service worker — offline shell, push notifications, closed-app reminders (LocalNotify), notification taps */
importScripts('js/localnotify.js?v=8.1.0');
const CACHE = 'wayof-v8-1-0';
const V = '?v=8.1.0';
const ASSETS = ['./', './index.html', './trainer.html', './config.js' + V, './css/app.css' + V, './js/data.js' + V, './js/content.js' + V, './js/demo.js' + V, './js/coach.js' + V, './js/vision.js' + V, './js/cloud.js' + V, './js/apps.js' + V, './js/shopkit.js' + V, './js/localnotify.js' + V, './js/app.js' + V, './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const cdn = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net', 'storage.googleapis.com'].includes(url.hostname);
  if (url.origin !== self.location.origin && !cdn) return; // APIs (weather, Supabase) always live
  if (/\.(mp4|webm)$/i.test(url.pathname) || req.headers.has('range')) return; // stream video straight from the network
  if (cdn) { // cache-first: fonts, Supabase SDK, pose model
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return r; })));
    return;
  }
  e.respondWith(fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return r; })
    .catch(() => caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))));
});
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: 'WAYOF', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'WAYOF', { body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: d.tag || 'wayof', data: { url: d.url || './index.html#today' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './index.html#today', self.location.href).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const c = list.find(w => w.url.startsWith(self.location.origin));
    if (c) { c.postMessage({ type: 'nav', view: url.split('#')[1] || 'today' }); return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
