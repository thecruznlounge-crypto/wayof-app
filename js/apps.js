/* WAYOF v8 — connected apps: Kayaos.space, RepliPlate.app, Pedalz.app
   When the apps share one Supabase project, signing in once gives WAYOF access to the user's own rows in each app
   (their own Row Level Security still applies). Without a shared project, data moves by share links. */
window.WAYOF_APPS = (function () {
  const C = window.WAYOF_CONFIG || {}, CL = () => window.WAYOF_CLOUD;
  const db = () => CL().db(), me = () => CL().auth.user();
  const pad = n => String(n).padStart(2, '0');
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const at = (dateStr, hm) => { const [y, m, d] = dateStr.split('-').map(Number), [h, mi] = String(hm || '0:0').split(':').map(Number); return new Date(y, m - 1, d, h || 0, mi || 0); };
  const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));

  /* ---------- does the shared project have this app's table? ---------- */
  const avail = {};
  async function has(table) {
    if (!db() || !me()) return false;
    if (avail[table] != null) return avail[table];
    const { error } = await db().from(table).select('*', { head: true, count: 'exact' }).limit(1);
    avail[table] = !error; if (error) console.info(`[apps] ${table} not available:`, error.message);
    return avail[table];
  }
  const resetDetect = () => Object.keys(avail).forEach(k => delete avail[k]);

  /* ======================= KAYAOS ======================= */
  const kayaos = {
    url: (C.KAYAOS_URL || 'https://kayaos.space').replace(/\/$/, ''),
    // Work shifts from Kayaos Work cards (table work_data: one record per account {jobs, shifts, pays})
    async shifts() {
      if (!(await has('work_data'))) return null;
      const { data, error } = await db().from('work_data').select('data,updated_at').eq('user_id', me().id).maybeSingle();
      if (error) throw new Error(error.message);
      const d = (data && data.data) || {}, jobs = d.jobs || [];
      return { at: data && data.updated_at, shifts: (d.shifts || []).filter(s => s.date).map(s => ({ date: s.date, start: s.start || '', end: s.end || '', brk: +s.brk || 0, job: (jobs.find(j => j.id === s.job) || {}).name || 'Work', note: s.note || '' })) };
    },
    // Health + Appointments cards
    async appointments() {
      if (!(await has('tasks'))) return null;
      const { data, error } = await db().from('tasks').select('id,title,description,category,target_date,target_time,is_completed,raw_address_or_venue,user_id')
        .in('category', ['Health', 'Appointments']).eq('is_completed', false).gte('target_date', ymd(addDays(new Date(), -1))).order('target_date', { ascending: true }).limit(40);
      if (error) throw new Error(error.message);
      return (data || []).map(r => ({ id: r.id, title: r.title, cat: r.category, date: r.target_date, time: (r.target_time || '').slice(0, 5), place: r.raw_address_or_venue || '', notes: r.description || '' }));
    },
    // Creates a Kayaos card (it shows up in Kayaos with its normal chime/voice reminders)
    async addCard({ title, category = 'Health', date, time = '09:00', notes = '', reminder = 30, place = '' }) {
      if (!(await has('tasks'))) throw new Error('Kayaos isn\'t on this account yet — open Kayaos and sign in with the same email');
      const row = { id: uuid(), user_id: me().id, title: String(title).slice(0, 120), description: notes ? String(notes).slice(0, 1000) : null, category, target_date: date, target_time: time, repeat_type: 'none', reminder_minutes: reminder, alert_style: 'both', nag_minutes: 0, is_completed: false, is_location_dependent: !!place, raw_address_or_venue: place || null, search_term_for_maps_api: place || null };
      const { error } = await db().from('tasks').insert(row);
      if (error) throw new Error(error.message);
      return row.id;
    }
  };

  /* Sleep planner: recommends bedtime/wake from upcoming shifts.
     opt: { goalH, prepMin (wake → leave), usualBed 'HH:MM', days } */
  function sleepPlan(shifts, opt = {}) {
    const goal = opt.goalH || 8, prep = opt.prepMin != null ? opt.prepMin : 75, wind = 30, days = opt.days || 7;
    const usual = opt.usualBed || '22:30';
    const now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate()), out = [];
    const list = (shifts || []).filter(s => s.start).map(s => {
      const st = at(s.date, s.start); let en = s.end ? at(s.date, s.end) : new Date(+st + 8 * 3600e3); if (en <= st) en = new Date(+en + 864e5);
      return { ...s, st, en };
    }).sort((a, b) => a.st - b.st);
    for (let i = 0; i < days; i++) {
      const eve = addDays(today, i), next = addDays(eve, 1), nk = ymd(next);
      const morning = list.find(s => ymd(s.st) === nk && s.st.getHours() < 12);       // a shift tomorrow morning
      const nightShift = list.find(s => ymd(s.st) === ymd(eve) && (s.st.getHours() >= 18 || s.en.getDate() !== s.st.getDate())); // working tonight
      const prevEnd = list.filter(s => s.en <= at(ymd(eve), '23:59')).map(s => s.en).pop();
      if (nightShift) {
        const nap = new Date(+nightShift.st - 3.5 * 3600e3), sleepAfter = new Date(+nightShift.en + 45 * 60e3);
        out.push({ night: ymd(eve), kind: 'night', bed: sleepAfter, wake: new Date(+sleepAfter + goal * 3600e3), nap, shift: nightShift,
          text: `Night shift ${fmtT(nightShift.st)}–${fmtT(nightShift.en)}: nap 90 min around ${fmtT(nap)}, then sleep ${fmtT(sleepAfter)}–${fmtT(new Date(+sleepAfter + goal * 3600e3))}. Use blackout curtains.` });
        continue;
      }
      let wake, bed, kind = 'off', text;
      if (morning) {
        wake = new Date(+morning.st - prep * 60e3); bed = new Date(+wake - goal * 3600e3); kind = 'work';
        let ub = at(ymd(eve), usual); if (ub.getHours() < 12) ub = new Date(+ub + 864e5);
        if (bed > ub) bed = ub; // never later than your usual bedtime — later shifts just mean extra sleep
        text = `${morning.job} at ${fmtT(morning.st)} — lights out by ${fmtT(bed)}, wake ${fmtT(wake)}. Start winding down at ${fmtT(new Date(+bed - wind * 60e3))}.`;
      } else {
        bed = at(ymd(eve), usual); if (bed.getHours() < 12) bed = new Date(+bed + 864e5); wake = new Date(+bed + goal * 3600e3);
        const later = list.find(s => ymd(s.st) === nk);
        if (later && wake > new Date(+later.st - prep * 60e3)) { wake = new Date(+later.st - prep * 60e3); bed = new Date(+wake - goal * 3600e3); kind = 'work'; }
        text = later ? `${later.job} at ${fmtT(later.st)} tomorrow — keep your usual ${fmtT(bed)} bedtime.` : `Day off tomorrow — keep bedtime within an hour of ${fmtT(bed)} so your body clock stays steady.`;
      }
      let warn = '';
      if (prevEnd && prevEnd > new Date(+bed - 3600e3) && prevEnd < bed) warn = 'Short wind-down after work — skip screens and caffeine.';
      if (prevEnd && prevEnd > bed) { warn = `Shift ends ${fmtT(prevEnd)} — you'll get about ${Math.max(0, ((wake - prevEnd) / 3600e3) - 0.75).toFixed(1)}h of sleep.`; bed = new Date(+prevEnd + 45 * 60e3); }
      out.push({ night: ymd(eve), kind, bed, wake, text, warn, shift: morning || null });
    }
    return out.filter(p => +p.wake > Date.now());
  }
  const fmtT = d => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(':00', '').replace(' ', '').toLowerCase();

  /* ======================= PEDALZ ======================= */
  const pedalz = {
    url: (C.PEDALZ_URL || 'https://pedalz.app').replace(/\/$/, ''),
    async rides(days = 45) {
      if (!(await has('rides'))) return null;
      const { data, error } = await db().from('rides').select('id,ts,dur_s,dist_m,avg_ms,max_ms,gain_m,mode').eq('user_id', me().id).gte('ts', new Date(Date.now() - days * 864e5).toISOString()).order('ts', { ascending: false }).limit(200);
      if (error) throw new Error(error.message);
      return data || [];
    },
    // Saves a WAYOF cardio session as a Pedalz ride (shows in the Pedalz archive and feed)
    async pushRide(s) {
      if (!(await has('rides'))) return false;
      const row = { id: uuid(), user_id: me().id, ts: new Date(s.startedAt).toISOString(), dur_s: Math.round(s.durS), dist_m: Math.round(s.distM), avg_ms: +(s.avgMs || 0).toFixed(3), max_ms: +(s.maxMs || 0).toFixed(3), gain_m: Math.round(s.gainM || 0), mode: s.mode === 'run' ? 'run' : s.mode === 'walk' || s.mode === 'treadmill' ? 'walk' : 'bike', path: s.path && s.path.length ? s.path : null, series: s.series || null };
      const { error } = await db().from('rides').insert(row);
      if (error) throw new Error(error.message);
      return row.id;
    },
    async group() { if (!(await has('profiles'))) return null; const { data } = await db().from('profiles').select('grp').eq('id', me().id).maybeSingle(); return data && data.grp || null; },
    async listings() {
      if (!(await has('listings'))) return null;
      const { data, error } = await db().from('listings').select('id,user_id,seller_name,title,price,cond,scope,grp,img,created_at').order('created_at', { ascending: false }).limit(80);
      if (error) throw new Error(error.message);
      return data || [];
    },
    async addListing({ title, price, cond, scope, img, seller }) {
      if (!(await has('listings'))) throw new Error('Pedalz Gear Shop isn\'t on this account yet');
      const grp = scope === 'group' ? await this.group() : null;
      if (scope === 'group' && !grp) throw new Error('Set a group code in Pedalz (Profile → Settings) to post to your group');
      const row = { id: uuid(), user_id: me().id, seller_name: seller || 'WAYOF member', title: String(title).slice(0, 80), price: Math.max(0, +price || 0), cond: cond || 'Good', scope: scope === 'group' ? 'group' : 'public', grp, img: img || null };
      const { error } = await db().from('listings').insert(row);
      if (error) throw new Error(error.message);
      return row;
    },
    async removeListing(id) { const { error } = await db().from('listings').delete().eq('id', id).eq('user_id', me().id); if (error) throw new Error(error.message); }
  };

  /* ======================= REPLIPLATE ======================= */
  const AISLE_ART = [['rice', /rice/], ['pasta', /pasta|fettuccine|noodle|spaghetti|lo mein|mac/], ['bread', /bun|bread|tortilla|wrap|roll|pita/], ['chicken', /chicken|wing/], ['beef', /beef|steak|burger|patty|pork|chorizo/], ['shrimp', /shrimp/], ['salmon', /salmon|fish|tuna/], ['tofu', /tofu/], ['beans', /bean/], ['chickpea', /chickpea|falafel|hummus/], ['egg', /egg/], ['broccoli', /broccoli/], ['tomato', /tomato|salsa/], ['greens', /lettuce|romaine|spinach|kale|cilantro|greens/], ['avocado', /avocado|guac/], ['carrot', /carrot/], ['pepper', /pepper|onion/], ['feta', /cheese|parmesan|cream|feta/], ['yogurt', /milk|yogurt|coffee/], ['potato', /potato|fries/]];
  function toWayof(m, idPrefix = 'rp-') {
    const n = (v, d = 0) => Number.isFinite(+v) ? +v : d;
    const text = ((m.item || '') + ' ' + (m.ingredients || []).map(i => i.name).join(' ')).toLowerCase();
    const art = AISLE_ART.filter(([, re]) => re.test(text)).map(([k]) => k).slice(0, 5);
    const kcal = Math.round(n(m.homeCal, 600)), p = Math.round(n(m.protein, 25)), rest = Math.max(0, kcal - p * 4);
    const name = String(m.item || 'Copycat clone');
    return { id: idPrefix + (m.id && !String(m.id).startsWith('ai') ? m.id : uuid().slice(0, 8)), style: (m.restaurant ? m.restaurant.replace(/-style$/i, '') + '-style' : 'Restaurant-style'), name: name.charAt(0).toUpperCase() + name.slice(1),
      slot: /drink/i.test(m.category || '') ? 'snack' : 'dinner', min: Math.round(n(m.minutes, 30)), kcal, p, c: Math.round(rest * .55 / 4), f: Math.round(rest * .45 / 9), macroEst: true, cost: 1,
      restPrice: n(m.restaurantPrice), homePrice: n(m.homePrice), restCal: Math.round(n(m.restaurantCal)), score: Math.round(n(m.score, 80)), art: art.length ? art : ['grain', 'greens', 'tomato'],
      ing: (m.ingredients || []).slice(0, 20).map(i => [String(i.name || ''), String(i.qty || ''), n(i.cost)]), steps: (m.steps || []).map(String).slice(0, 12),
      swaps: (m.swaps || []).map(s => Array.isArray(s) ? `${s[0]}: ${s[1]}` : String(s)).slice(0, 6), diets: m.diets || [], fromRepli: true, ai: m.source === 'ai' || m.source === 'photo' };
  }
  function toRepli(c) {
    return { restaurant: String(c.style || 'Restaurant').replace(/-style$/i, ''), item: c.name, emoji: '🍽️', category: 'Bowls', restaurantPrice: +c.restPrice || 0, homePrice: +c.homePrice || 0, restaurantCal: +c.restCal || c.kcal, homeCal: c.kcal, protein: c.p, minutes: c.min, score: c.score || 80, diets: c.diets || [], tags: [],
      ingredients: (c.ing || []).map(i => ({ name: i[0], qty: i[1] || '', cost: +i[2] || 0, aisle: 'pantry' })), steps: c.steps || [], swaps: (c.swaps || []).map(s => { const [a, ...b] = String(s).split(':'); return [a.trim(), b.join(':').trim() || a.trim()]; }) };
  }
  const b64u = bytes => { let s = ''; bytes.forEach(b => (s += String.fromCharCode(b))); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const unb64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
  async function pipe(bytes, Stream, mode) { const s = new Blob([bytes]).stream().pipeThrough(new Stream(mode)); return new Uint8Array(await new Response(s).arrayBuffer()); }
  async function encode(obj) { const bytes = new TextEncoder().encode(JSON.stringify(obj)); if ('CompressionStream' in window) { try { return 'z' + b64u(await pipe(bytes, CompressionStream, 'deflate-raw')); } catch (e) { } } return 'j' + b64u(bytes); }
  async function decode(str) { const kind = str[0], bytes = unb64u(str.slice(1)); const out = kind === 'z' ? await pipe(bytes, DecompressionStream, 'deflate-raw') : bytes; return JSON.parse(new TextDecoder().decode(out)); }
  const repli = {
    url: (C.REPLIPLATE_URL || 'https://repliplate.app').replace(/\/$/, ''),
    api: C.REPLIPLATE_API || '',
    toWayof, toRepli, encode, decode,
    // RepliPlate's own AI (api/ai.php). Add https://thewayof.health to allowed_origins in RepliPlate's api/config.php.
    async clone({ query, image }) {
      if (!this.api) throw new Error('offline');
      const r = await fetch(this.api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'clone', query: (query || '').slice(0, 200), image: image || undefined }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.error || !j.meal) throw new Error(j.error || `RepliPlate AI returned ${r.status}`);
      return toWayof({ ...j.meal, source: image ? 'photo' : 'ai' }, 'ai-');
    },
    async link(c) { if (c.rpId) return `${this.url}/#/meal/${c.rpId}`; return `${this.url}/#/m/${await encode(toRepli(c))}`; },
    searchLink(q) { return `${this.url}/?text=${encodeURIComponent(q || '')}`; },
    // Accepts a RepliPlate share link (…/#/m/<code> or …/#/meal/<id>) or a WAYOF import code
    async parse(link, library) {
      const s = String(link || '').trim();
      let m = s.match(/#\/m\/([A-Za-z0-9_-]+)/); if (m) return toWayof({ ...(await decode(m[1])), source: 'ai' }, 'rpx-');
      m = s.match(/#\/meal\/([a-z0-9-]+)/i); if (m) { const hit = (library || []).find(c => c.rpId === m[1]); if (hit) return hit; }
      throw new Error('That doesn\'t look like a RepliPlate recipe link');
    }
  };

  /* ======================= cardio meters: GPS + Bluetooth ======================= */
  const R = 6371000, toRad = d => d * Math.PI / 180;
  const hav = (a, b) => { const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lng - a.lng), x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); };
  function gps(onFix, onErr) {
    if (!navigator.geolocation) { onErr && onErr(new Error('GPS not available on this device')); return () => { }; }
    const id = navigator.geolocation.watchPosition(p => onFix({ lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy, alt: p.coords.altitude, speed: p.coords.speed, t: p.timestamp }), e => onErr && onErr(e), { enableHighAccuracy: true, maximumAge: 1000, timeout: 20000 });
    return () => navigator.geolocation.clearWatch(id);
  }
  // Heart Rate Measurement (0x2A37)
  function parseHR(dv) { const flags = dv.getUint8(0); return flags & 1 ? dv.getUint16(1, true) : dv.getUint8(1); }
  // FTMS Indoor Bike Data (0x2AD2) — speed km/h, cadence rpm, distance m, resistance, power W, kcal, HR, elapsed s
  function parseBike(dv) {
    const f = dv.getUint16(0, true); let o = 2; const out = {};
    if (!(f & 1)) { out.speed = dv.getUint16(o, true) / 100; o += 2; }
    if (f & 2) { out.avgSpeed = dv.getUint16(o, true) / 100; o += 2; }
    if (f & 4) { out.cadence = dv.getUint16(o, true) / 2; o += 2; }
    if (f & 8) { out.avgCadence = dv.getUint16(o, true) / 2; o += 2; }
    if (f & 16) { out.distance = dv.getUint16(o, true) | (dv.getUint8(o + 2) << 16); o += 3; }
    if (f & 32) { out.resistance = dv.getInt16(o, true); o += 2; }
    if (f & 64) { out.power = dv.getInt16(o, true); o += 2; }
    if (f & 128) { out.avgPower = dv.getInt16(o, true); o += 2; }
    if (f & 256) { out.kcal = dv.getUint16(o, true); o += 5; }
    if (f & 512) { out.hr = dv.getUint8(o); o += 1; }
    if (f & 1024) { o += 1; }
    if (f & 2048) { out.elapsed = dv.getUint16(o, true); o += 2; }
    return out;
  }
  async function bt(services, charUUID, parse, onData, optional = []) {
    if (!navigator.bluetooth) throw new Error('Bluetooth sensors need Chrome on Android or a desktop computer (not supported on iPhone browsers)');
    const dev = await navigator.bluetooth.requestDevice({ filters: [{ services }], optionalServices: optional });
    const srv = await dev.gatt.connect(), svc = await srv.getPrimaryService(services[0]), ch = await svc.getCharacteristic(charUUID);
    await ch.startNotifications(); ch.addEventListener('characteristicvaluechanged', e => { try { onData(parse(e.target.value)); } catch (x) { } });
    return { name: dev.name || 'Sensor', stop() { try { dev.gatt.disconnect(); } catch (e) { } } };
  }
  const connectHR = onHR => bt(['heart_rate'], 'heart_rate_measurement', parseHR, onHR);
  const connectBike = onData => bt([0x1826], 0x2ad2, parseBike, onData, ['heart_rate']);
  // MET estimates (Compendium of Physical Activities, approximate)
  function met(mode, kmh, watts) {
    if (mode === 'indoor') return watts ? Math.max(3.5, watts / 25) : kmh ? (kmh < 20 ? 5.5 : kmh < 26 ? 7 : 8.8) : 6.8;
    if (mode === 'ride') return kmh < 16 ? 4 : kmh < 19 ? 6.8 : kmh < 22 ? 8 : kmh < 26 ? 10 : 12;
    if (mode === 'run') return Math.max(6, kmh * 1.0);
    return kmh < 4 ? 2.8 : kmh < 5.5 ? 3.5 : kmh < 6.5 ? 4.3 : 5; // walk / treadmill
  }
  const kcal = (m, kg, hours) => Math.round(m * (kg || 75) * hours);
  const meters = { gps, hav, parseHR, parseBike, connectHR, connectBike, met, kcal, btSupported: () => !!navigator.bluetooth };

  /* ---------- extra fields for the Kayaos health summary ---------- */
  let lastPlan = [], lastAppts = [];
  const setPlan = p => { lastPlan = p || []; }, setAppts = a => { lastAppts = a || []; };
  const summaryExtra = () => ({ sleep_plan: lastPlan.slice(0, 3).map(p => ({ night: p.night, bed: p.bed.toISOString(), wake: p.wake.toISOString(), note: p.text })) });

  return { has, resetDetect, kayaos, sleepPlan, pedalz, repli, meters, setPlan, setAppts, summaryExtra, fmtT, uuid };
})();
