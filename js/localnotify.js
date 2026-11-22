/* LocalNotify: reminders that arrive while the app is closed and with no server (WAYOF + RepliPlate share this file).
   Page:   LocalNotify.schedule(items, { app, quietStart, quietEnd, max }) saves upcoming reminders where the service worker can read them,
           and asks the browser for background wake-ups (Periodic Background Sync).
   Worker: importScripts('js/localnotify.js') — on each wake-up it shows reminders that are due, once each, outside quiet hours.
   Item:   { id, at: ms, until?: ms, title, body, url?, tag? }

   Limits (browser rules, not ours): wake-ups need an installed app on Chrome/Edge (Android, Windows, Mac, ChromeOS).
   The browser picks the timing (roughly every few hours, more often for apps used daily), so reminders land close to their time,
   not to the minute. Safari/iPhone has no background wake-ups: there, only server push (WAYOF's AI nudges) works while closed. */
(function (G) {
  'use strict';
  const CACHE = 'localnotify', KEY = './__localnotify.json', SHOWN = './__localnotify-shown.json';
  const read = async k => { try { const c = await caches.open(CACHE), r = await c.match(k); return r ? await r.json() : null; } catch (e) { return null; } };
  const write = async (k, v) => { try { const c = await caches.open(CACHE); await c.put(k, new Response(JSON.stringify(v), { headers: { 'Content-Type': 'application/json' } })); } catch (e) { /* storage blocked */ } };
  const inQuiet = (h, a, b) => a == null || b == null || a === b ? false : a > b ? (h >= a || h < b) : (h >= a && h < b);

  async function due(opts = {}) {
    const snap = await read(KEY); if (!snap || !Array.isArray(snap.items)) return [];
    const now = Date.now(), d = new Date(now), shown = (await read(SHOWN)) || {};
    if (inQuiet(d.getHours(), snap.quietStart, snap.quietEnd) && !opts.force) return [];
    const day = d.toDateString(); let today = Object.entries(shown).filter(([, v]) => v.day === day).length;
    const out = [];
    for (const it of snap.items.sort((a, b) => a.at - b.at)) {
      if (shown[it.id] || it.at > now || (it.until || it.at + 6 * 36e5) < now) continue;
      if (snap.max && today >= snap.max) break;
      out.push(it); shown[it.id] = { at: now, day }; today++;
    }
    for (const k of Object.keys(shown)) if (now - shown[k].at > 14 * 864e5) delete shown[k];
    await write(SHOWN, shown);
    return out.map(it => ({ ...it, icon: snap.icon, badge: snap.badge }));
  }

  if (typeof window === 'undefined' && typeof registration !== 'undefined') {
    /* ---------- service worker side ---------- */
    async function check() {
      for (const it of await due()) {
        await registration.showNotification(it.title, { body: it.body || '', tag: it.tag || it.id, icon: it.icon || 'icon-192.png', badge: it.badge || it.icon || 'icon-192.png', data: { url: it.url || './' }, renotify: false });
      }
    }
    G.addEventListener('periodicsync', e => { if (String(e.tag).startsWith('localnotify')) e.waitUntil(check()); });
    G.addEventListener('message', e => { if (e.data && e.data.type === 'localnotify-check') e.waitUntil(check()); });
    G.LocalNotify = { check, due };
    return;
  }

  /* ---------- page side ---------- */
  const support = () => ({
    notifications: 'Notification' in G,
    granted: 'Notification' in G && Notification.permission === 'granted',
    background: 'serviceWorker' in navigator && 'periodicSync' in (G.ServiceWorkerRegistration ? ServiceWorkerRegistration.prototype : {}),
    exact: 'showTrigger' in (G.Notification ? Notification.prototype : {}) && typeof G.TimestampTrigger === 'function',
    installed: matchMedia('(display-mode: standalone)').matches || navigator.standalone === true || document.referrer.startsWith('android-app://'),
  });
  let last = '';
  async function schedule(items, o = {}) {
    const snap = { app: o.app || 'app', quietStart: o.quietStart, quietEnd: o.quietEnd, max: o.max || 0, icon: o.icon || 'icon-192.png', badge: o.badge,
      items: (items || []).filter(i => i && i.id && i.at && i.title).slice(0, 60) };
    const json = JSON.stringify(snap); if (json === last) return support(); last = json;
    await write(KEY, snap);
    const s = support();
    if (s.granted && 'serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        if (s.background) {
          let ok = true; try { const p = await navigator.permissions.query({ name: 'periodic-background-sync' }); ok = p.state === 'granted'; } catch (e) { /* not queryable: try anyway */ }
          if (ok) await reg.periodicSync.register('localnotify-' + snap.app, { minInterval: 60 * 60 * 1000 });
        }
        if (s.exact) { // exact-time triggers, where a browser supports them
          for (const it of snap.items) if (it.at > Date.now() && !(o.quietStart != null && inQuiet(new Date(it.at).getHours(), o.quietStart, o.quietEnd)))
            await reg.showNotification(it.title, { body: it.body || '', tag: it.tag || it.id, icon: snap.icon, data: { url: it.url || './' }, showTrigger: new G.TimestampTrigger(it.at) });
        }
      } catch (e) { /* the browser said no; in-app reminders still work */ }
    }
    return s;
  }
  async function status() {
    const s = support(); s.registered = false;
    try { if (s.background) { const reg = await navigator.serviceWorker.ready; s.registered = (await reg.periodicSync.getTags()).some(t => t.startsWith('localnotify')); } } catch (e) { }
    return s;
  }
  async function enable(app) {
    if (!('Notification' in G)) return support();
    if (Notification.permission === 'default') { try { await Notification.requestPermission(); } catch (e) { } }
    last = ''; const snap = await read(KEY); if (snap) await schedule(snap.items, { ...snap, app: app || snap.app });
    return status();
  }
  /** Ask the service worker to show anything due right now (used when the app comes back to the foreground). */
  async function checkNow() { try { const reg = await navigator.serviceWorker.ready; if (reg.active) reg.active.postMessage({ type: 'localnotify-check' }); } catch (e) { } }
  /** Mark reminders as already seen (e.g. shown inside the open app) so the worker doesn't repeat them later. */
  async function markShown(ids) { const shown = (await read(SHOWN)) || {}, now = Date.now(), day = new Date().toDateString(); [].concat(ids).forEach(id => { if (id && !shown[id]) shown[id] = { at: now, day }; }); await write(SHOWN, shown); }
  G.LocalNotify = { schedule, status, enable, support, checkNow, due, markShown };
})(typeof self !== 'undefined' ? self : this);
