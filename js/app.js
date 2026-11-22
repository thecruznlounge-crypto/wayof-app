/* WAYOF v7 — app logic (vanilla JS, no build step). Assembled from build/parts. */
(function () {
  'use strict';
  const D = window.WAYOF_DATA, DEMO = window.WAYOF_DEMO, COACH = window.WAYOF_COACH, CLOUD = window.WAYOF_CLOUD, APPS = window.WAYOF_APPS;
  const KEY = 'wayof-v6';
  const US = /^en-US/i.test(navigator.language || 'en-US');
  /* ---------- icons ---------- */
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    dumbbell: '<path d="M6 6v12M18 6v12M3 9v6M21 9v6M6 12h12"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 12-4 16-9 16z"/><path d="M4 20c4-6 8-8 12-10"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    cloud: '<path d="M7 18a5 5 0 1 1 1.6-9.7A6 6 0 0 1 20 11a4 4 0 0 1-1 7.9z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
    drop: '<path d="M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12z"/>',
    flame: '<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-5 5-5 8a7 7 0 0 0 7 7z"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z"/>',
    scale: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M8 9a5 5 0 0 1 8 0l-3 3"/>',
    steps: '<path d="M8 3c2 0 3 2.5 3 5s-1 4-3 4-3-1.5-3-4 1-5 3-5zM16 9c2 0 3 2.5 3 5s-1 4-3 4-3-1.5-3-4 1-5 3-5zM6 15h4v3a2 2 0 0 1-4 0zM14 21h4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
    play: '<path d="M7 4v16l13-8z" fill="currentColor"/>', stop: '<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>',
    check: '<path d="m5 12 5 5L20 7"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
    left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    heart: '<path d="M12 20s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.5-8 11-8 11z"/>',
    heartf: '<path d="M12 20s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.5-8 11-8 11z" fill="currentColor"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>', share: '<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
    pin: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>', data: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    legs: '<path d="M9 3v7l-3 11M15 3v7l3 11M9 10h6"/>', push: '<path d="M4 16h16M7 16l3-7h4l3 7M12 9V5"/>', pull: '<path d="M4 4h16M8 4v6a4 4 0 0 0 8 0V4M12 14v7"/>',
    core: '<rect x="7" y="4" width="10" height="16" rx="5"/><path d="M7 10h10M7 14h10M12 4v16"/>', run: '<circle cx="15" cy="4" r="2"/><path d="m8 21 3-6 3 2v5M6 11l3-4h5l2 4 3 1M11 15l-1-5"/>',
    stretch: '<circle cx="12" cy="4" r="2"/><path d="M4 9h16M12 9v6l-4 6M12 15l4 6"/>', bike: '<circle cx="6" cy="16" r="4"/><circle cx="18" cy="16" r="4"/><path d="M6 16l4-7h5l3 7M10 9l2 7"/>', swim: '<path d="M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M8 13l4-6 5 4"/><circle cx="18" cy="6" r="2"/>',
    utensils: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 3-3 7h3v11"/>', spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    pulse: '<path d="M3 12h4l2.5-6 4 12L16 12h5"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>', users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.4 0 4 1.6 4.5 4.5"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>', fridge: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M6 10h12M9 5v2M9 13v3"/>',
    grid: '<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>', copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    send: '<path d="M4 12 20 4l-6 16-3-7z"/>', trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M9 17h6"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.7-4M4 4v4h4M4 13a8 8 0 0 0 14.7 4M20 20v-4h-4"/>', ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>', skip: '<path d="M5 5v14l10-7zM19 5v14"/>', pause: '<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/>',
    wind: '<path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8"/>', umbrella: '<path d="M3 12a9 9 0 0 1 18 0zM12 12v7a2 2 0 0 0 4 0"/>', thermo: '<path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z"/>',
    leafy: '<path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14zM5 19 13 11"/>', star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>', hand: '<path d="M7 11V6a1.5 1.5 0 0 1 3 0v4M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V12M16 12V8.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-3l-2.5-4a1.5 1.5 0 0 1 2.5-1.6L7 14"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12 20 3M16 7l3 3M14 9l2 2"/>', logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>', cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L22 7H6"/>', receipt: '<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2zM9 8h6M9 12h6M9 16h3"/>', tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="8" cy="8" r="1.5"/>'
  };
  const I = (n, s = 20, sw = 2) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

  /* ---------- utils ---------- */
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n, d = 0) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: 0 });
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const pad = n => String(n).padStart(2, '0');
  const dkey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const weekStart = d => addDays(d, -((d.getDay() + 6) % 7));
  const dow = d => (d.getDay() + 6) % 7; // 0 = Monday
  const TODAY = () => dkey(new Date());
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const DAYS_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const uid = () => Math.random().toString(36).slice(2, 9);


  /* ---------- state ---------- */
  const defaults = () => ({
    v: 7,
    profile: { name: '', style: 'guide', kcal: 2000, protein: 120, carbs: 220, fat: 65, steps: 8000, water: 8, sleep: 8, units: US ? 'imperial' : 'metric', theme: 'auto' },
    voice: { uri: '', speed: '1', speakName: false, countReps: true },
    reminders: { workout: false, nutrition: false, privateSpeech: true },
    plan: { goal: 'strength', days: 4, minutes: 30, level: 'beginner', week: [] },
    equipment: ['Bodyweight', 'Exercise mat'], custom: [], favorites: [], budget: 75,
    body: { goalWeight: null, targetDate: '', focus: [], startWeight: null, heightCm: null, birthYear: null, sex: '', activity: 'light', goalBy: 'weight' },
    fridge: [], myClones: [],
    city: '', surface: 'unknown', geo: null, wx: null, prefOutdoor: true,
    nudge: { enabled: true, quietStart: 22, quietEnd: 7, max: 4, types: { workout: true, water: true, protein: true, checkin: true, fridge: true, celebrate: true, weekly: true, sleep: true }, sent: {} },
    feed: [], chat: [], apptsLocal: [],
    links: { kayaos: { prepMin: 75, usualBed: '22:30', shifts: [], appts: [], at: 0, importedAt: 0 }, pedalz: { imported: [] } },
    share: { kayaos: false, kayaosFields: { nutrition: true, weight: false, reminders: true } },
    log: {}, ui: { hideInstall: false }
  });
  let S = load();
  function load() {
    const base = defaults();
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (raw) {
        const o = { ...base, ...raw };
        ['profile', 'voice', 'reminders', 'plan', 'ui', 'nudge', 'share', 'body', 'links'].forEach(k => (o[k] = { ...base[k], ...(raw[k] || {}) }));
        o.links.kayaos = { ...base.links.kayaos, ...((raw.links || {}).kayaos || {}) }; o.links.pedalz = { ...base.links.pedalz, ...((raw.links || {}).pedalz || {}) };
        if (raw.v && raw.v < 8 && o.ui.onboarded == null) o.ui.onboarded = true; // existing users skip the welcome screen
        o.nudge.types = { ...base.nudge.types, ...((raw.nudge || {}).types || {}) };
        o.share.kayaosFields = { ...base.share.kayaosFields, ...((raw.share || {}).kayaosFields || {}) };
        if (raw.weather && !raw.wx) delete o.weather;
        return o;
      }
      const v5 = JSON.parse(localStorage.getItem('wayof-v5') || 'null');
      if (v5) {
        base.profile.name = v5.name || ''; base.profile.style = v5.style || 'guide';
        Object.assign(base.plan, { goal: v5.goal || 'strength', days: +v5.days || 4, minutes: +v5.minutes || 30, level: v5.level || 'beginner' });
        if (Array.isArray(v5.equipment)) base.equipment = v5.equipment;
        if (Array.isArray(v5.custom)) base.custom = v5.custom;
        Object.assign(base.voice, { uri: v5.voice || '', speed: v5.speed || '1', speakName: !!v5.speakName });
        base.city = v5.city || ''; base.surface = v5.surface || 'unknown'; base.budget = +v5.budget || 75;
        base._migrate = Array.isArray(v5.week) && v5.week.length > 0;
      }
    } catch (e) { /* fall through */ }
    return base;
  }
  // save(dayKey?) persists locally and queues a cloud sync when signed in
  const save = (dayKey) => {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Could not save on this device'); }
    if (CLOUD.enabled) CLOUD.markDirty(dayKey || null, () => S);
  };

  const emptyLog = () => ({ water: 0, steps: 0, sleep: null, weight: null, meals: [], workouts: [], ev: [] });
  const getLog = k => S.log[k] ? { ...emptyLog(), ...S.log[k] } : emptyLog();
  const mutLog = k => (S.log[k] = S.log[k] ? { ...emptyLog(), ...S.log[k] } : emptyLog());
  const track = (k, type) => { const L = mutLog(k); if (k === TODAY()) { L.ev.push([type, Date.now()]); if (L.ev.length > 80) L.ev.splice(0, L.ev.length - 80); } return L; };
  const hasData = k => { const l = S.log[k]; return !!l && !!(l.water || l.steps || l.sleep != null || l.weight != null || (l.meals || []).length || (l.workouts || []).length); };
  const totals = k => getLog(k).meals.reduce((a, m) => ({ kcal: a.kcal + m.kcal, p: a.p + m.p, c: a.c + m.c, f: a.f + m.f }), { kcal: 0, p: 0, c: 0, f: 0 });

  const ui = { view: 'today', date: TODAY(), trainTab: 'plan', libFocus: 'all', eqSearch: '', filter: 'all', kitchen: '', progTab: 'activity', range: 7, weekMetric: 'steps', planDay: null, nTab: 'recipes', covTab: 'basics', group: null, groupMetric: 'steps', cloneQ: '', cloneBusy: false, aiClone: null, chatBusy: false, cov: null };
  const imperial = () => S.profile.units === 'imperial';
  const wUnit = () => imperial() ? 'lb' : 'kg';
  const signedIn = () => CLOUD.enabled && !!CLOUD.auth.user();
  const FOCUS_AREAS = [['fat', 'Lose fat'], ['muscle', 'Build muscle'], ['strength', 'Get stronger'], ['endurance', 'Endurance'], ['mobility', 'Mobility & flexibility'], ['core', 'Core'], ['upper', 'Upper body'], ['lower', 'Legs & glutes'], ['posture', 'Posture & back'], ['heart', 'Heart health'], ['stress', 'Stress & sleep'], ['energy', 'More energy']];
  // latest weigh-in on or before a day
  function latestWeight(k = TODAY()) { const base = parseKey(k); for (let i = 0; i < 400; i++) { const w = (S.log[dkey(addDays(base, -i))] || {}).weight; if (w != null) return w; } return null; }
  function firstWeight() { const ks = Object.keys(S.log).filter(k => S.log[k].weight != null).sort(); return ks.length ? S.log[ks[0]].weight : null; }
  function goalProgress() {
    const g = S.body.goalWeight, cur = latestWeight(); if (g == null || cur == null) return null;
    const start = S.body.startWeight != null ? S.body.startWeight : firstWeight();
    const total = start - g, doneAmt = start - cur, pct = total === 0 ? 1 : clamp(doneAmt / total, 0, 1);
    return { start, cur, goal: g, left: Math.abs(cur - g), pct, dir: g < start ? 'lose' : g > start ? 'gain' : 'maintain', reached: (g <= start && cur <= g) || (g >= start && cur >= g) };
  }
  /* physical stats: BMI + calorie estimate (Mifflin-St Jeor) */
  const toKg = w => w == null ? null : imperial() ? w * 0.453592 : w;
  const fromKg = kg => imperial() ? kg / 0.453592 : kg;
  function bmiOf(w) { const h = S.body.heightCm; if (!h || w == null) return null; return toKg(w) / Math.pow(h / 100, 2); }
  const weightForBmi = b => S.body.heightCm ? fromKg(b * Math.pow(S.body.heightCm / 100, 2)) : null;
  const bmiCat = b => b == null ? null : b < 18.5 ? ['Underweight', 'warn'] : b < 25 ? ['Healthy range', 'good'] : b < 30 ? ['Overweight', 'warn'] : ['Obesity range', 'bad'];
  const ACTIVITY = [['sedentary', 'Mostly sitting', 1.2], ['light', 'Light (1–3 workouts/wk)', 1.375], ['moderate', 'Moderate (3–5/wk)', 1.55], ['active', 'Very active (6–7/wk)', 1.725], ['athlete', 'Athlete / physical job', 1.9]];
  function energyEstimate() {
    const b = S.body, w = toKg(latestWeight()); if (!b.heightCm || !b.birthYear || w == null) return null;
    const age = new Date().getFullYear() - b.birthYear; if (age < 18 || age > 100) return { minor: age < 18 };
    const sexAdj = b.sex === 'male' ? 5 : b.sex === 'female' ? -161 : -78; // average when not specified
    const bmr = 10 * w + 6.25 * b.heightCm - 5 * age + sexAdj;
    const tdee = bmr * (ACTIVITY.find(a => a[0] === b.activity) || ACTIVITY[1])[2];
    const g = goalProgress(); let target = tdee, note = 'to maintain your weight';
    const floor = b.sex === 'male' ? 1500 : 1200;
    if (g && !g.reached && g.dir === 'lose') { target = Math.max(floor, tdee - 500, bmr); note = 'for steady loss (about 0.5–1 lb / 0.25–0.5 kg a week)'; }
    if (g && !g.reached && g.dir === 'gain') { target = tdee + 300; note = 'for a gradual, lean gain'; }
    const round = x => Math.round(x / 10) * 10;
    return { age, bmr: round(bmr), tdee: round(tdee), target: round(target), note, protein: Math.round(w * (g && g.dir === 'gain' ? 1.8 : 1.6)) };
  }
  /* ---------- plan ---------- */
  // focus-area id → exercise focus bucket used by the plan builder
  const FOCUS_MAP = { fat: 'cardio', muscle: 'push', strength: 'lower', endurance: 'cardio', mobility: 'mobility', core: 'core', upper: 'pull', lower: 'lower', posture: 'pull', heart: 'cardio', stress: 'mobility', energy: 'cardio' };
  function available() { return D.exercises.filter(x => x.gear === 'Bodyweight' || S.equipment.includes(x.gear)); }
  function buildWeek() {
    const p = S.plan, n = +p.days;
    const offs = { 2: [0, 3], 3: [0, 2, 4], 4: [0, 1, 3, 5], 5: [0, 1, 2, 4, 5], 6: [0, 1, 2, 3, 4, 5] }[n] || [0, 2, 4];
    const tpl = D.sessionTemplates[p.goal] || D.sessionTemplates.general;
    const av = available();
    p.week = offs.map((d, i) => {
      const [title, baseFoci] = tpl[i % tpl.length];
      // Focus areas (Profile → Body & goals) add one targeted move per session, rotating through the user's picks.
      const fx = (S.body && S.body.focus || []).map(f => FOCUS_MAP[f]).filter(Boolean);
      const foci = fx.length && baseFoci.length < 5 ? [...baseFoci, fx[i % fx.length]] : baseFoci;
      const used = new Set(), ex = [];
      foci.forEach((f, j) => {
        let pool = av.filter(x => x.focus === f && !used.has(x.name));
        const geared = pool.filter(x => x.gear !== 'Bodyweight');
        if (geared.length && (i + j) % 3 !== 2) pool = geared;
        if (!pool.length) pool = av.filter(x => x.focus === 'mobility' && !used.has(x.name));
        const pick = pool[(i * 3 + j * 2) % Math.max(1, pool.length)];
        if (pick) { used.add(pick.name); ex.push(pick.name); }
      });
      return { id: 's' + i + uid(), dow: d, title, minutes: +p.minutes, ex };
    });
    save();
  }
  if (S._migrate) { delete S._migrate; buildWeek(); }
  function rx(name) {
    const e = D.exercises.find(x => x.name === name) || { focus: 'lower' };
    const L = { beginner: 0, intermediate: 1, advanced: 2 }[S.plan.level] || 0, g = S.plan.goal;
    if (e.focus === 'cardio') return `${Math.max(8, Math.round(S.plan.minutes * 0.45))} min`;
    if (e.focus === 'mobility') return ['2 × 40 s', '3 × 45 s', '3 × 60 s'][L];
    if (e.focus === 'core') return ['3 × 30 s', '3 × 40 s', '4 × 45 s'][L];
    if (g === 'strength') return ['3 × 8', '4 × 6', '5 × 5'][L];
    if (g === 'muscle') return ['3 × 10', '4 × 10', '4 × 12'][L];
    return ['2 × 12', '3 × 12', '3 × 15'][L];
  }
  const sessionFor = k => S.plan.week.find(s => s.dow === dow(parseKey(k)));
  const isDone = (k, sid) => getLog(k).workouts.some(w => w.pid === sid);

  /* ---------- food art ---------- */
  const FOOD = {
    grain: ['#e8d6a6', ['#c9a86a', '#f3e6c4'], 'dot', 1.6, 26], rice: ['#f4efe2', ['#ddd2b8'], 'dot', 1.8, 22], oats: ['#e6d3b3', ['#c4a87f'], 'dot', 2.2, 18],
    salmon: ['#f08a5d', ['#f9c9ad'], 'stripe', 0, 7], chicken: ['#d8a064', ['#b07a42'], 'stripe', 0, 7], shrimp: ['#f39c7a', ['#ffd4c0'], 'stripe', 0, 6],
    beef: ['#8e4a3a', ['#6d3528', '#b5654f'], 'dot', 3, 10], egg: ['#fff7e6', ['#f5b82e'], 'yolk'], avocado: ['#b5d36b', ['#7aa83e'], 'slice', 0, 3],
    tomato: ['#e4572e', ['#ff8c6b'], 'circle', 6, 4], carrot: ['#f28c28', ['#ffb35c'], 'stripe', 0, 7], greens: ['#4f8a3c', ['#77b255', '#3b6e2c'], 'leaf', 0, 10],
    broccoli: ['#3f7d3a', ['#5ea152'], 'circle', 5, 6], berries: ['#4b3a7a', ['#c0392b', '#2e2160', '#8e44ad'], 'circle', 3.6, 10], yogurt: ['#f6f2ec', ['#e6dfd4'], 'dot', 2, 6],
    banana: ['#f6d55c', ['#e2b836'], 'circle', 5, 4], beans: ['#7a4b3a', ['#5a3326', '#9c624d'], 'dot', 2.6, 16], chickpea: ['#e1b56b', ['#c8984f'], 'circle', 3.4, 12],
    lentil: ['#c47a3a', ['#a35f28'], 'dot', 1.8, 24], tofu: ['#f1e3b5', ['#d9c48a'], 'cube', 0, 6], pepper: ['#e74c3c', ['#f39c12'], 'stripe', 0, 6],
    cucumber: ['#9bc472', ['#e3f0c8'], 'circle', 5, 5], feta: ['#f7f5ef', ['#e2ddd0'], 'cube', 0, 6], cabbage: ['#8e6bb8', ['#c0a5df'], 'stripe', 0, 7],
    potato: ['#e98b3a', ['#c96f22'], 'cube', 0, 6], pasta: ['#f0c66b', ['#d9a845'], 'stripe', 0, 9], hummus: ['#d8b88a', ['#b8935e', '#a7c957'], 'dot', 1.6, 14],
    bread: ['#c98a4b', ['#e7b97f'], 'dot', 1.5, 14], pancake: ['#d9a25e', ['#f3c98a'], 'circle', 7, 3], wrap: ['#ead1a1', ['#c9a46a'], 'dot', 2, 10]
  };
  let artN = 0;
  function rng(seed) { let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function foodArt(art, seed, label) {
    const r = rng(seed), n = art.length, id = 'fa' + (artN++), R = 40, C = 50;
    const pt = (a, rad) => [C + rad * Math.cos(a), C + rad * Math.sin(a)];
    let defs = '', body = '';
    art.forEach((k, i) => {
      const f = FOOD[k] || FOOD.grain;
      const a0 = -Math.PI / 2 + (i / n) * 2 * Math.PI + 0.3, a1 = a0 + (2 * Math.PI) / n;
      const [x0, y0] = pt(a0, R), [x1, y1] = pt(a1, R);
      const wedge = n === 1 ? `M${C - R},${C}a${R},${R} 0 1,0 ${2 * R},0a${R},${R} 0 1,0 ${-2 * R},0` : `M${C},${C}L${x0.toFixed(2)},${y0.toFixed(2)}A${R},${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(2)},${y1.toFixed(2)}Z`;
      defs += `<clipPath id="${id}-${i}"><path d="${wedge}"/></clipPath>`;
      let det = '';
      const rp = () => { const a = a0 + 0.12 + r() * (a1 - a0 - 0.24), d = 9 + Math.sqrt(r()) * 28; return [...pt(a, d), a]; };
      const col = () => f[1][Math.floor(r() * f[1].length)];
      const mid = (a0 + a1) / 2;
      const cnt = f[4] || 8;
      if (f[2] === 'yolk') { const [x, y] = pt(mid, 22); det = `<circle cx="${x}" cy="${y}" r="9" fill="${f[1][0]}"/><circle cx="${x - 2.5}" cy="${y - 2.5}" r="2.5" fill="#fff" opacity=".6"/>`; }
      else for (let j = 0; j < cnt; j++) {
        const [x, y, a] = rp(), c = col();
        if (f[2] === 'dot') det += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${f[3]}" fill="${c}"/>`;
        else if (f[2] === 'circle') det += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${f[3]}" fill="${c}" stroke="rgba(0,0,0,.12)" stroke-width=".8"/>`;
        else if (f[2] === 'stripe') det += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="7" ry="1.5" fill="${c}" transform="rotate(${((a + Math.PI / 2) * 180 / Math.PI).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
        else if (f[2] === 'leaf') det += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="6" ry="3" fill="${c}" transform="rotate(${Math.round(r() * 180)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
        else if (f[2] === 'cube') det += `<rect x="${(x - 3.5).toFixed(1)}" y="${(y - 3.5).toFixed(1)}" width="7" height="7" rx="1.5" fill="${c}" transform="rotate(${Math.round(r() * 90)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
        else if (f[2] === 'slice') { const [sx, sy] = pt(a0 + (j + .5) * (a1 - a0) / cnt, 26); det += `<ellipse cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" rx="10" ry="4.5" fill="#d4e79a" stroke="${c}" stroke-width="2" transform="rotate(${Math.round((a0 + (j + .5) * (a1 - a0) / cnt) * 180 / Math.PI)} ${sx.toFixed(1)} ${sy.toFixed(1)})"/>`; }
      }
      body += `<g clip-path="url(#${id}-${i})"><path d="${wedge}" fill="${f[0]}"/>${det}</g>`;
      if (n > 1) body += `<path d="${wedge}" fill="none" stroke="#fffaf3" stroke-width="1.4" opacity=".9"/>`;
    });
    return `<svg viewBox="0 0 100 100" role="img" aria-label="${esc(label || 'Meal illustration')}"><defs>${defs}</defs><circle cx="50" cy="52" r="48" fill="rgba(40,20,60,.10)"/><circle cx="50" cy="50" r="48" fill="#fffdf8" stroke="rgba(0,0,0,.06)"/><circle cx="50" cy="50" r="43" fill="#f3ede4"/>${body}</svg>`;
  }
  const recipeById = id => D.recipes.find(r => r.id === id);
  const mealArt = m => { const r = m.rid && recipeById(m.rid); return foodArt(r ? r.art : ['greens', 'grain', 'tomato'], m.rid || m.name, m.name); };

  /* ---------- charts ---------- */
  let charts = [];
  const niceMax = v => { if (v <= 0) return 1; const e = Math.pow(10, Math.floor(Math.log10(v))), m = v / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * e; };
  const short = v => v >= 1000 ? (v / 1000).toFixed(v % 1000 ? 1 : 0).replace('.0', '') + 'k' : fmt(v, 1);
  const roundTop = (x, y, w, h, r) => `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
  function chartSlot(spec) { charts.push(spec); return `<div class="chart" data-chart="${charts.length - 1}" style="min-height:${spec.h || 200}px"></div>`; }
  function drawCharts() {
    document.querySelectorAll('[data-chart]').forEach(el => {
      const spec = charts[+el.dataset.chart]; if (!spec) return;
      const W = Math.max(260, el.clientWidth);
      el.innerHTML = spec.type === 'line' ? lineSVG(spec, W) : barSVG(spec, W);
    });
  }
  function barSVG({ data, goal, color, h = 200, goalLabel, label }, W) {
    const H = h, L = 40, R = 6, T = 18, B = 26, iw = W - L - R, ih = H - T - B;
    const raw = Math.max(goal || 0, ...data.map(d => d.value || 0)) * 1.08 || 1;
    const step = niceMax(raw / 4), mx = step * Math.ceil(raw / step), nt = Math.round(mx / step);
    const n = data.length, band = iw / n, bw = Math.min(30, band * 0.58), every = Math.ceil(n / Math.max(4, Math.floor(iw / 44)));
    let g = '', hits = '';
    for (let i = 0; i <= nt; i++) { const y = T + ih - ih * i / nt; g += `<line class="gridl" x1="${L}" x2="${W - R}" y1="${y}" y2="${y}"/><text class="axis" x="${L - 8}" y="${y + 4}" text-anchor="end">${short(step * i)}</text>`; }
    data.forEach((d, i) => {
      const x = L + band * i + band / 2, v = d.value || 0, bh = v ? Math.max(4, ih * v / mx) : 0, y = T + ih - bh;
      if (bh) g += `<path d="${roundTop(x - bw / 2, y, bw, bh, Math.min(5, bw / 2, bh))}" fill="${color}"${d.dim ? ' opacity=".5"' : ''}/>`;
      if (i % every === 0 || d.bold) g += `<text class="axis" x="${x}" y="${H - 6}" text-anchor="middle"${d.bold ? ' style="fill:var(--ink);font-weight:800"' : ''}>${esc(d.label)}</text>`;
      hits += `<rect class="hit" x="${L + band * i}" y="${T}" width="${band}" height="${ih}" data-tip="${esc(d.tip)}"/>`;
    });
    if (goal) { const y = T + ih - ih * goal / mx; g += `<line class="goal" x1="${L}" x2="${W - R}" y1="${y}" y2="${y}"/><text class="goallbl" x="${W - R}" y="${y - 6}" text-anchor="end">${esc(goalLabel || 'Goal')}</text>`; }
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label || 'Bar chart')}">${g}${hits}</svg>`;
  }
  function lineSVG({ data, color, h = 200, label, fmtV, goal, goalLabel }, W) {
    const H = h, L = 44, R = 10, T = 18, B = 26, iw = W - L - R, ih = H - T - B;
    const vals = data.map(d => d.value).filter(v => v != null);
    if (!vals.length) return `<div class="emptystate small">No entries in this range yet.</div>`;
    const dom = goal != null ? [...vals, goal] : vals; let lo = Math.min(...dom), hi = Math.max(...dom); const padv = Math.max(1, (hi - lo) * 0.25); lo = Math.floor(lo - padv); hi = Math.ceil(hi + padv);
    const n = data.length, band = iw / n, X = i => L + band * i + band / 2, Y = v => T + ih - ih * (v - lo) / (hi - lo);
    const every = Math.ceil(n / Math.max(4, Math.floor(iw / 44)));
    let g = '', hits = '', pts = [];
    for (let i = 0; i <= 3; i++) { const v = lo + (hi - lo) * i / 3, y = Y(v); g += `<line class="gridl" x1="${L}" x2="${W - R}" y1="${y}" y2="${y}"/><text class="axis" x="${L - 8}" y="${y + 4}" text-anchor="end">${fmt(v, 1)}</text>`; }
    data.forEach((d, i) => {
      if (i % every === 0 || d.bold) g += `<text class="axis" x="${X(i)}" y="${H - 6}" text-anchor="middle"${d.bold ? ' style="fill:var(--ink);font-weight:800"' : ''}>${esc(d.label)}</text>`;
      if (d.value != null) pts.push([X(i), Y(d.value)]);
      hits += `<rect class="hit" x="${L + band * i}" y="${T}" width="${band}" height="${ih}" data-cx="${X(i)}" data-tip="${esc(d.tip)}"/>`;
    });
    const path = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('');
    const area = pts.length > 1 ? `<path d="${path}L${pts[pts.length - 1][0]},${T + ih}L${pts[0][0]},${T + ih}Z" fill="${color}" opacity=".10"/>` : '';
    g += area + `<path d="${path}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    g += pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${color}" stroke="var(--card)" stroke-width="2"/>`).join('');
    if (goal != null) { const gy = Y(goal); g += `<line class="goal" x1="${L}" x2="${W - R}" y1="${gy}" y2="${gy}"/><text class="goallbl" x="${W - R}" y="${gy - 6}" text-anchor="end">${esc(goalLabel || 'Goal')}</text>`; }
    g += `<line class="cross" x1="0" x2="0" y1="${T}" y2="${T + ih}" visibility="hidden"/>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label || 'Line chart')}">${g}${hits}</svg>`;
  }
  // tooltip
  const tipEl = () => $('#tooltip');
  document.addEventListener('pointerover', e => {
    const t = e.target.closest && e.target.closest('[data-tip]');
    const tip = tipEl();
    document.querySelectorAll('.chart .cross').forEach(c => c.setAttribute('visibility', 'hidden'));
    if (!t || !t.dataset.tip) { tip.hidden = true; return; }
    const [a, b] = t.dataset.tip.split('|');
    tip.innerHTML = `${esc(a)}${b ? `<b>${esc(b)}</b>` : ''}`;
    const rc = t.getBoundingClientRect();
    tip.style.left = clamp(rc.left + rc.width / 2, 70, innerWidth - 70) + 'px';
    tip.style.top = Math.max(60, rc.top + 4) + 'px';
    tip.hidden = false;
    if (t.dataset.cx) { const svg = t.ownerSVGElement, c = svg && svg.querySelector('.cross'); if (c) { c.setAttribute('x1', t.dataset.cx); c.setAttribute('x2', t.dataset.cx); c.setAttribute('visibility', 'visible'); } }
  });
  window.addEventListener('scroll', () => { const t = tipEl(); if (t) t.hidden = true; }, { passive: true });

  function ring(pct, size, sw, color, track = 'var(--card2)') {
    const r = (size - sw) / 2, c = 2 * Math.PI * r, p = clamp(pct, 0, 1);
    return `<svg viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${track}" stroke-width="${sw}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${(c * p).toFixed(1)} ${c.toFixed(1)}" style="transition:stroke-dasharray .6s ease"/></svg>`;
  }


  /* ---------- one-click install ---------- */
  // index.html captures `beforeinstallprompt` in <head> (window.__bip) so the prompt is never missed.
  const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafariMac = /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(navigator.userAgent) && !isIOS;
  let installedElsewhere = false;
  const canShowInstall = () => !isStandalone() && !installedElsewhere;
  window.addEventListener('wayof-installable', () => renderChrome());
  window.addEventListener('appinstalled', () => { window.__bip = null; installedElsewhere = true; toast('WAYOF installed — open it from your home screen or app list'); closeSheet(); renderChrome(); render(); });
  if (navigator.getInstalledRelatedApps) navigator.getInstalledRelatedApps().then(a => { if (a && a.length) { installedElsewhere = true; renderChrome(); render(); } }).catch(() => { });
  async function install() {
    let bip = window.__bip;
    if (!bip && !isIOS && !isSafariMac) {
      // The browser may still be preparing its install offer — wait briefly (stays inside the tap's user-activation window).
      toast('Preparing install…');
      bip = await new Promise(res => { const t = setTimeout(() => res(window.__bip), 2500); window.addEventListener('wayof-installable', () => { clearTimeout(t); res(window.__bip); }, { once: true }); });
    }
    if (bip) {
      try { await bip.prompt(); const { outcome } = await bip.userChoice; window.__bip = null; if (outcome === 'accepted') toast('Installing WAYOF…'); } catch (e) { window.__bip = null; }
      renderChrome(); return;
    }
    const inApp = /FBAN|FBAV|Instagram|Line\/|GSA\/|TikTok/i.test(navigator.userAgent);
    const steps = inApp ? ['Open this page in Safari or Chrome (tap ⋯ → <b>Open in browser</b>)', 'Tap <b>Install</b> again — it\'s one tap there']
      : isIOS ? ['Tap <b>Share</b> in Safari\'s toolbar', 'Choose <b>Add to Home Screen</b>', 'Tap <b>Add</b> — WAYOF opens full-screen like an app']
        : isSafariMac ? ['In Safari\'s menu bar choose <b>File → Add to Dock</b>', 'Click <b>Add</b>']
          : ['Click the install icon in the address bar, or open the browser menu (⋮)', 'Choose <b>Install WAYOF</b>'];
    openSheet(`<div class="sh"><h2>Install WAYOF</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div>
      <p class="muted small">${isIOS ? 'Apple only allows installing from Safari\'s Share menu — no website can do it in one tap on iPhone or iPad.' : isSafariMac ? 'Safari on Mac installs web apps from its menu.' : inApp ? 'In-app browsers can\'t install apps.' : 'Your browser didn\'t offer one-tap install on this visit (it can need HTTPS and a page reload). Install from the menu:'}</p>
      <div class="ios-steps">${steps.map((s, i) => `<div><span>${i + 1}</span><p style="margin:0">${s}</p></div>`).join('')}</div>
      <button class="btn brand block" data-a="close">Got it</button>`);
  }

  /* ---------- toast & sheet ---------- */
  function toast(s) { document.querySelectorAll('.toast').forEach(t => t.remove()); const n = document.createElement('div'); n.className = 'toast'; n.setAttribute('role', 'status'); n.textContent = s; document.body.append(n); setTimeout(() => n.remove(), 2800); }
  let sheetCtx = {}, sheetCleanup = null;
  function openSheet(html, ctx = {}, cls = '') {
    if (sheetCleanup) { const f = sheetCleanup; sheetCleanup = null; f(); }
    sheetCtx = ctx;
    $('#sheetRoot').innerHTML = `<div class="overlay" data-a="backdrop"><div class="sheet ${cls}" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div></div>`;
    const f = $('#sheetRoot').querySelector('[autofocus]'); if (f) setTimeout(() => f.focus(), 60);
  }
  function closeSheet() { if (sheetCleanup) { const f = sheetCleanup; sheetCleanup = null; f(); } $('#sheetRoot').innerHTML = ''; sheetCtx = {}; }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
  function numSheet({ title, label, value, unit, step = 1, min = 0, max = 100000, onSave, hint }) {
    openSheet(`<div class="sh"><h2>${esc(title)}</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div>
      <div class="field"><label for="numIn">${esc(label)}${unit ? ` (${esc(unit)})` : ''}</label><input id="numIn" type="number" inputmode="decimal" step="${step}" min="${min}" max="${max}" value="${value == null ? '' : value}" autofocus></div>
      ${hint ? `<p class="note">${esc(hint)}</p>` : ''}<div class="row" style="margin-top:16px"><button class="btn ghost" data-a="num-clear">Clear</button><button class="btn brand" style="flex:1" data-a="num-save">Save</button></div>`, { onSave, min, max });
  }
  const copyText = async (t, msg = 'Copied') => { try { await navigator.clipboard.writeText(t); toast(msg); } catch (e) { prompt('Copy this:', t); } };
  const shareOrCopy = async (title, text, url) => { if (navigator.share) { try { await navigator.share({ title, text, url }); return; } catch (e) { if (e.name === 'AbortError') return; } } copyText(url || text, 'Link copied'); };

  /* ---------- speech ---------- */
  function speak(s, opts = {}) {
    if (!('speechSynthesis' in window)) { if (!opts.quiet) toast('Speech is not supported in this browser'); return; }
    if (!opts.queue) speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(s); u.rate = +S.voice.speed;
    const v = speechSynthesis.getVoices().find(v => v.voiceURI === S.voice.uri); if (v) u.voice = v; speechSynthesis.speak(u);
  }
  function coachLine(i = 0) { const c = D.coach[S.profile.style] || D.coach.guide; const n = S.voice.speakName && S.profile.name ? S.profile.name + ', ' : ''; const l = c.lines[i % c.lines.length]; return n ? n + l : l.charAt(0).toUpperCase() + l.slice(1); }
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');

  /* ---------- chrome: sidebar, header, dock ---------- */
  const VIEWS = [['today', 'home', 'Today'], ['coach', 'chat', 'Coach'], ['train', 'dumbbell', 'Train'], ['nourish', 'leaf', 'Nourish'], ['together', 'users', 'Together'], ['progress', 'chart', 'Progress'], ['atmosphere', 'cloud', 'Atmosphere'], ['apps', 'link', 'Apps'], ['coverage', 'shield', 'Coverage'], ['profile', 'user', 'Profile']];
  const TITLES = { coach: ['Coach', 'Learns your habits, keeps you moving'], train: ['Train', 'A plan with purpose'], nourish: ['Nourish', 'Eat well, your way'], together: ['Together', 'Partners, groups & challenges'], progress: ['Progress', 'Your trends at a glance'], atmosphere: ['Atmosphere', 'Weather-smart workouts'], apps: ['Connected apps', 'Kayaos · RepliPlate · Pedalz'], coverage: ['Coverage', 'Health coverage, made clearer'], profile: ['Profile', 'Make it yours'] };
  function greeting() { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; }
  const initials = () => (S.profile.name || 'You').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const unreadFeed = () => S.feed.filter(f => !f.read).length;
  function renderChrome() {
    $('#sideNav').innerHTML = VIEWS.map(v => `<button data-a="go" data-v="${v[0]}" class="${ui.view === v[0] ? 'active' : ''}" aria-label="${v[2]}"${ui.view === v[0] ? ' aria-current="page"' : ''}>${I(v[1])}<span>${v[2]}</span>${v[0] === 'coach' && unreadFeed() ? `<i class="dot" aria-label="${unreadFeed()} new"></i>` : ''}</button>`).join('');
    const dockBtn = v => `<button data-a="go" data-v="${v[0]}" class="${ui.view === v[0] ? 'active' : ''}" aria-label="${v[2]}">${I(v[1], 22)}${v[0] === 'coach' && unreadFeed() ? '<i class="dot"></i>' : ''}</button>`;
    $('#dock').innerHTML = [VIEWS[0], VIEWS[2]].map(dockBtn).join('') + `<button class="fab" data-a="quick" aria-label="Quick log">${I('plus', 26, 2.4)}</button>` + [VIEWS[3], VIEWS[1]].map(dockBtn).join('');
    $('#sideInstall').hidden = !canShowInstall();
    renderHeader();
  }
  function renderHeader() {
    const d = parseKey(ui.date), isToday = ui.date === TODAY();
    const left = ui.view === 'today'
      ? `<button class="avatar" data-a="go" data-v="profile" aria-label="Profile">${esc(initials())}</button><div style="min-width:0"><div class="sub">${isToday ? 'Today · ' : ''}${d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div><h1>${greeting()}${S.profile.name ? ', ' + esc(S.profile.name) : ''}</h1></div>`
      : `<div style="min-width:0"><div class="sub">${TITLES[ui.view][1]}</div><h1>${TITLES[ui.view][0]}</h1></div>`;
    const dark = document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
    $('#top').innerHTML = `<div class="who">${left}</div><div class="actions">
      ${canShowInstall() ? `<button class="btn install sm" data-a="install" aria-label="Install app">${I('download', 16)}<span class="hide-m">Install app</span></button>` : ''}
      ${CLOUD.enabled ? (signedIn() ? `<span class="cloudpill on hide-m" title="Synced to your account">${I('cloud', 14)} Synced</span>` : `<button class="btn ghost sm" data-a="auth" data-m="in">${I('user', 14)}<span class="hide-m">Log in</span></button>`) : ''}
      <button class="iconbtn" data-a="theme" aria-label="Toggle light or dark mode">${I(dark ? 'sun' : 'moon', 19)}</button>
      <button class="iconbtn more-btn" data-a="more" aria-label="All sections">${I('grid', 19)}</button>
      ${ui.view !== 'today' ? `<button class="avatar sm-av hide-m" data-a="go" data-v="profile" aria-label="Profile">${esc(initials())}</button>` : ''}</div>`;
  }
  function moreSheet() {
    openSheet(`<div class="sh"><h2>All sections</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div>
      <div class="qgrid">${VIEWS.map(v => `<button class="qbtn ${ui.view === v[0] ? 'on' : ''}" data-a="go" data-v="${v[0]}"><span class="ic" style="background:var(--brand)">${I(v[1], 22)}</span>${v[2]}</button>`).join('')}</div>`);
  }
  function applyTheme() {
    const t = S.profile.theme, el = document.documentElement;
    if (t === 'auto') delete el.dataset.theme; else el.dataset.theme = t;
    const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.querySelector('meta[name=theme-color]').setAttribute('content', dark ? '#0e0c15' : '#f3f0f8');
  }
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { applyTheme(); renderHeader(); render(); });

  function installBar() {
    if (!canShowInstall() || S.ui.hideInstall || ui.view !== 'today') return '';
    return `<div class="installbar"><div class="ic">${I('phone', 22)}</div><div><strong>Get WAYOF on your home screen</strong><p>${isIOS ? 'Add it from Safari — opens full-screen, works offline.' : 'One click. Opens full-screen, works offline.'}</p></div>
      <button class="btn sm" data-a="install">${I('download', 16)} Install</button><button class="x" data-a="install-dismiss" aria-label="Dismiss">${I('x', 18)}</button></div>`;
  }
  function dateStrip() {
    const ws = weekStart(parseKey(ui.date)), t = TODAY();
    let h = `<div class="datestrip"><button class="nav" data-a="week" data-n="-7" aria-label="Previous week">${I('left', 18)}</button>`;
    for (let i = 0; i < 7; i++) { const d = addDays(ws, i), k = dkey(d); h += `<button class="d ${k === ui.date ? 'sel' : ''} ${k === t ? 'today' : ''} ${hasData(k) ? 'has' : ''}" data-a="day" data-k="${k}" aria-label="${d.toDateString()}">${DAYS[i]}<b>${d.getDate()}</b><i></i></button>`; }
    return h + `<button class="nav" data-a="week" data-n="7" aria-label="Next week">${I('right', 18)}</button></div>`;
  }
  const glassSVG = () => `<svg viewBox="0 0 26 34"><path d="M3 3h20l-2.4 27a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8z" fill="currentColor" opacity=".9"/><path d="M5 10h16" stroke="rgba(255,255,255,.5)" stroke-width="1.5"/></svg>`;
  // Coach avatar: real photo if configured (config.js COACH_PHOTOS), otherwise the illustrated coach portrait
  const COACH_BLURB = { guide: 'Calm & thoughtful', motivator: 'High energy', strategist: 'Direct & data-driven', companion: 'Warm & supportive' };
  function coachPic(style, cls = '') { const src = ((CLOUD.config.COACH_PHOTOS || {})[style] || '').trim(); return `<span class="coachpic ${cls}">${src ? `<img src="${esc(src)}" alt="" loading="lazy">` : DEMO.portrait(style)}</span>`; }
  function exRow(name, opts = {}) {
    const e = D.exercises.find(x => x.name === name) || { icon: 'stretch', focus: 'mobility', gear: 'Bodyweight' };
    return `<button class="exrow" data-a="demo" data-n="${esc(name)}" aria-label="Open ${esc(name)} demo and spoken instructions"><div class="ico thumb">${DEMO.still(name, .85)}</div><div style="min-width:0;text-align:left"><strong>${esc(name)}</strong><small>${D.focusNames[e.focus]} · ${esc(e.gear)}${opts.note ? ' · ' + esc(opts.note) : ''}</small></div><span class="rx num">${rx(name)}</span></button>`;
  }

  /* ---------- Today ---------- */
  function vToday() {
    const k = ui.date, L = getLog(k), T = totals(k), p = S.profile;
    const left = p.kcal - T.kcal, over = left < 0;
    const macro = (name, v, goal, color) => `<div class="macro"><div class="row"><span><span class="mdot" style="background:${color}"></span>${name}</span><span class="num"><b>${fmt(v)}</b> / ${fmt(goal)} g</span></div><div class="bar"><div style="width:${clamp(v / goal * 100, 0, 100)}%;background:${color}"></div></div></div>`;
    const stepPct = L.steps / p.steps;
    const dist = imperial() ? `≈ ${fmt(L.steps * 0.000473, 1)} mi` : `≈ ${fmt(L.steps * 0.000762, 1)} km`;
    let prevW = null; for (let i = 1; i < 60 && prevW == null; i++) { const w = getLog(dkey(addDays(parseKey(k), -i))).weight; if (w != null) prevW = w; }
    const wDelta = L.weight != null && prevW != null ? L.weight - prevW : null;
    const sl = L.sleep, ses = sessionFor(k), done = ses && isDone(k, ses.id);
    const glasses = Array.from({ length: Math.max(p.water, L.water) }, (_, i) => `<button class="glass ${i < L.water ? 'full' : ''}" data-a="water-set" data-n="${i + 1}" aria-label="Set ${i + 1} glasses">${glassSVG()}</button>`).join('');
    const slots = [['breakfast', 'Breakfast'], ['lunch', 'Lunch'], ['dinner', 'Dinner'], ['snack', 'Snacks']];
    const ws = weekStart(parseKey(k)), metric = ui.weekMetric;
    const wdata = Array.from({ length: 7 }, (_, i) => { const kk = dkey(addDays(ws, i)), l = getLog(kk), v = metric === 'steps' ? l.steps : metric === 'kcal' ? totals(kk).kcal : l.water; return { label: DAYS[i], value: v, bold: kk === k, tip: `${DAYS_LONG[i]}|${fmt(v)} ${metric === 'steps' ? 'steps' : metric === 'kcal' ? 'kcal' : 'glasses'}` }; });
    const wgoal = metric === 'steps' ? p.steps : metric === 'kcal' ? p.kcal : p.water;
    const nud = S.feed.find(f => !f.dismissed && Date.now() - f.at < 6 * 3600e3);
    const bw = bestWindow();

    return `${installBar()}
    ${nud && k === TODAY() ? `<div class="nudgebar"><div class="ic">${I(nudgeIcon(nud.type), 20)}</div><div style="min-width:0"><strong>${esc(nud.title)}</strong><p>${esc(nud.body)}</p></div><button class="btn sm brand" data-a="nudge-go" data-id="${nud.id}">${nudgeCta(nud.action)}</button><button class="x" data-a="nudge-dismiss" data-id="${nud.id}" aria-label="Dismiss">${I('x', 16)}</button></div>` : ''}
    ${dateStrip()}
    ${(() => { const ap = allAppts().filter(a => a.date <= dkey(addDays(new Date(), 3))).slice(0, 3); return ap.length && k === TODAY() ? `<div class="apptstrip">${ap.map(a => `<button class="apptchip" data-a="go" data-v="apps">${I('clock', 14)}<span><b>${esc(a.title)}</b><small>${a.date === TODAY() ? 'Today' : new Date(a.date + 'T12:00').toLocaleDateString(undefined, { weekday: 'short' })}${a.time ? ' · ' + APPS.fmtT(new Date(`${a.date}T${a.time}`)) : ''}</small></span></button>`).join('')}</div>` : ''; })()}
    <div class="grid">
      <section class="card s5" aria-label="Energy">
        <div class="ch"><h2>Energy</h2><span class="pill">${I('flame', 14)} Goal ${fmt(p.kcal)} kcal</span></div>
        <div class="energy">
          <div class="ring">${ring(T.kcal / p.kcal, 180, 16, over ? 'var(--bad)' : 'var(--brand)')}<div class="center"><span class="muted tiny">${over ? 'kcal over' : 'kcal remaining'}</span><span class="big num">${fmt(Math.abs(left))}</span><span class="muted tiny">eaten ${fmt(T.kcal)}</span></div></div>
          <div class="macros">${macro('Protein', T.p, p.protein, 'var(--protein)')}${macro('Carbs', T.c, p.carbs, 'var(--carbs)')}${macro('Fat', T.f, p.fat, 'var(--fat)')}</div>
        </div>
        <div class="minirings"><div class="m"><b class="num">${L.meals.length}</b>items logged</div><div class="m"><b class="num">${Math.round(T.kcal / p.kcal * 100)}%</b>of goal</div><div class="m"><b class="num">${L.workouts.length}</b>workouts</div></div>
      </section>
      <section class="card hi s4" aria-label="Daily activity">
        <div class="ch"><span class="label" style="color:inherit;opacity:.7">Daily activity</span><button class="btn sm" data-a="steps-edit">Edit</button></div>
        <div class="row between" style="align-items:center">
          <div><div class="big num">${fmt(L.steps)}</div><div class="muted small" style="margin-top:6px">of ${fmt(p.steps)} steps · ${dist}</div></div>
          <div class="stepsring">${ring(stepPct, 92, 9, 'var(--hi-ink)', 'rgba(0,0,0,.1)')}<span class="num">${Math.round(stepPct * 100)}%</span></div>
        </div>
        <div class="row" style="margin-top:18px"><button class="btn sm" data-a="steps-add" data-n="500">+500</button><button class="btn sm" data-a="steps-add" data-n="1000">+1,000</button><button class="btn sm" data-a="steps-add" data-n="2500">+2,500</button></div>
        <p class="note" style="color:inherit;opacity:.65">Enter steps from your phone or watch — browsers can't read Apple Health or Health Connect directly.</p>
      </section>
      <div class="s3 minis">
        <button class="card tile" data-a="sleep-edit" style="text-align:left;width:100%"><div class="ic" style="color:var(--sleep)">${I('moon')}</div><span class="label">Sleep</span>
          <div class="val num">${sl == null ? '—' : `${Math.floor(sl)}h ${pad(Math.round((sl % 1) * 60))}m`}</div><span class="muted tiny">${sl == null ? 'Tap to log last night' : `${Math.round(sl / p.sleep * 100)}% of ${p.sleep}h goal`}</span>${(() => { const tp = k === TODAY() && tonightPlan(); return tp ? `<span class="tiny sleepnext">${I('clock', 11)} Tonight: bed ${APPS.fmtT(tp.bed)} → ${APPS.fmtT(tp.wake)}</span>` : ''; })()}</button>
        <button class="card tile" data-a="body-edit" style="text-align:left;width:100%"><div class="ic">${I('scale')}</div><span class="label">Weight${S.body.goalWeight != null ? ` · goal ${fmt(S.body.goalWeight, 1)}` : ''}</span>
          <div class="val num">${L.weight == null ? (latestWeight(k) != null ? `${fmt(latestWeight(k), 1)} <small>${wUnit()}</small>` : '—') : `${fmt(L.weight, 1)} <small>${wUnit()}</small>`}</div>
          ${(() => { const g = goalProgress(); if (!g) return `<span class="muted tiny">${L.weight == null && latestWeight(k) == null ? 'Tap to add weight & goal' : S.body.goalWeight == null ? 'Tap to set a goal weight' : (wDelta == null ? 'First weigh-in' : `${wDelta > 0 ? '+' : ''}${fmt(wDelta, 1)} ${wUnit()} since last`)}</span>`; return `<div class="bar" style="margin-top:2px"><div style="width:${Math.round(g.pct * 100)}%;background:var(--fat)"></div></div><span class="muted tiny">${g.reached ? 'Goal reached — nice work' : `${fmt(g.left, 1)} ${wUnit()} to go · ${Math.round(g.pct * 100)}%`}</span>`; })()}</button>
      </div>

      <section class="card s7" aria-label="Training">
        <div class="ch"><div><span class="label">${k === TODAY() ? "Today's training" : DAYS_LONG[dow(parseKey(k))] + "'s training"}</span><h2 style="margin:4px 0 0">${ses ? esc(ses.title) : S.plan.week.length ? 'Rest & recover' : 'No plan yet'}</h2></div>
          ${ses ? `<span class="pill ${done ? 'good' : ''}">${I(done ? 'check' : 'clock', 14)} ${done ? 'Completed' : ses.minutes + ' min'}</span>` : ''}</div>
        ${ses ? `<div class="session">${ses.ex.slice(0, 4).map(n => exRow(n)).join('')}</div>
          <div class="row" style="margin-top:14px">${done ? `<button class="btn soft" data-a="workout" data-k="${k}" data-pid="${ses.id}">${I('check', 16)} Completed — undo</button>` : `<button class="btn brand" data-a="player" data-k="${k}" data-pid="${ses.id}">${I('play', 14)} Start workout</button><button class="btn ghost" data-a="workout" data-k="${k}" data-pid="${ses.id}">${I('check', 16)} Mark done</button>`}</div>
          ${bw && k === TODAY() && !done ? `<p class="note">${I('cloud', 13)} ${esc(bw.text)}</p>` : ''}`
        : S.plan.week.length ? `<p class="muted">No session scheduled. A short walk or the mobility flow keeps you loose.</p>${exRow('Standing mobility flow')}<div class="row" style="margin-top:14px"><button class="btn ghost" data-a="go" data-v="train">View week</button></div>`
          : `<div class="emptystate"><div class="ic">${I('dumbbell', 26)}</div><p>Pick a goal and the days you can train — WAYOF builds your week around your equipment.</p><button class="btn brand" data-a="go" data-v="train">Build my plan</button></div>`}
        <div class="cardiorow"><span class="muted tiny">Quick cardio</span>${CARDIO_MODES.slice(0, 4).map(m => `<button class="chip" data-a="cardio" data-m="${m[0]}">${I(m[2], 13)} ${({ ride: 'Ride', indoor: 'Indoor bike' })[m[0]] || m[1]}</button>`).join('')}</div>
      </section>
      <section class="card s5" aria-label="Hydration">
        <div class="ch"><div><span class="label">Hydration</span><h2 style="margin:4px 0 0" class="num">${L.water} <span class="muted" style="font-size:15px;font-weight:600">/ ${p.water} glasses</span></h2></div><span class="pill">${I('drop', 14)} ${imperial() ? '8 oz' : '250 ml'} each</span></div>
        <div class="glasses" role="group" aria-label="Water glasses">${glasses}</div>
        <div class="row between small" style="margin-top:16px"><span class="muted">${imperial() ? `${L.water * 8} of ${p.water * 8} oz` : `${fmt(L.water * 0.25, 2)} of ${fmt(p.water * 0.25, 2)} L`}</span><b class="num" style="color:var(--water)">${Math.round(L.water / p.water * 100)}%</b></div>
        <div class="bar" style="margin:8px 0 4px"><div style="width:${clamp(L.water / p.water * 100, 0, 100)}%;background:var(--water)"></div></div>
        <p class="note" style="margin-top:8px">${L.water >= p.water ? 'Goal reached — nice work.' : `${p.water - L.water} more to reach today's goal.${S.wx && S.wx.cur && feelsF(S.wx.cur.feels) >= 88 ? ' It\'s hot out — drink a little extra.' : ''}`}</p>
        <div class="row" style="margin-top:14px"><button class="circ" data-a="water-add" data-n="-1" aria-label="Remove a glass">${I('minus', 18)}</button><button class="btn brand" style="flex:1" data-a="water-add" data-n="1">${I('drop', 16)} Add a glass</button></div>
      </section>

      <section class="s12" aria-label="Meals">
        <div class="section-title" style="margin-top:12px"><h2>Meals</h2><div class="row"><button class="btn soft sm" data-a="ntab-go" data-t="fridge">${I('fridge', 14)} From my fridge</button><button class="btn ghost sm" data-a="go" data-v="nourish">Recipes</button></div></div>
        <div class="meals">${slots.map(([s, n]) => { const items = L.meals.filter(m => m.slot === s), kc = items.reduce((a, m) => a + m.kcal, 0); return `<div class="slot"><div class="ch"><div><h3 style="margin:0">${n}</h3><span class="kc">${kc ? fmt(kc) + ' kcal' : ''}</span></div><button class="add" data-a="meal-add" data-slot="${s}" aria-label="Add to ${n}">${I('plus', 16)}</button></div>
          ${items.length ? items.map(m => `<button class="item" data-a="meal-item" data-id="${m.id}"><span class="art">${mealArt(m)}</span><span><b>${esc(m.name)}</b><small>${fmt(m.kcal)} kcal${m.qty && m.qty !== 1 ? ` · ×${m.qty}` : ''}</small></span></button>`).join('') : `<p class="empty">Nothing logged yet</p>`}</div>`; }).join('')}</div>
      </section>

      <section class="card s7" aria-label="This week">
        <div class="ch"><h2>This week</h2><div class="seg">${[['steps', 'Steps'], ['kcal', 'Calories'], ['water', 'Water']].map(m => `<button class="${metric === m[0] ? 'on' : ''}" data-a="wmetric" data-m="${m[0]}">${m[1]}</button>`).join('')}</div></div>
        ${chartSlot({ data: wdata, goal: wgoal, goalLabel: `Goal ${short(wgoal)}`, color: metric === 'water' ? 'var(--water)' : metric === 'kcal' ? 'var(--carbs)' : 'var(--brand)', h: 210, label: 'This week ' + metric })}
      </section>
      <div class="s5 stack">
        <section class="card brandcard" aria-label="Coach">
          <div class="row" style="gap:12px;flex-wrap:nowrap">${coachPic(S.profile.style)}<div><span class="label" style="color:rgba(255,255,255,.8)">Your coach</span><div style="font-weight:800">${esc((D.coach[S.profile.style] || D.coach.guide).name)}</div></div></div>
          <p style="font-size:17px;font-weight:650;line-height:1.4;margin:10px 0 14px">“${esc(todayCoachLine())}”</p>
          <div class="row"><button class="btn sm" style="background:#fff;color:#2a2340" data-a="coach-speak">${I('play', 14)} Hear it</button><button class="btn sm" style="background:rgba(255,255,255,.18);color:#fff" data-a="go" data-v="coach">${I('chat', 14)} Talk to coach</button></div>
        </section>
        ${wxCard()}
      </div>
    </div>`;
  }
  function todayCoachLine() {
    const H = COACH.habits(S, 28); const ins = H.insights.find(i => ['protein', 'water', 'sleep', 'weekend', 'streak', 'time'].includes(i.key));
    return ins && H.days >= 4 ? ins.text : coachLine(new Date().getDate());
  }
  const nudgeIcon = t => ({ workout: 'dumbbell', 'workout-late': 'dumbbell', water: 'drop', protein: 'utensils', checkin: 'chat', fridge: 'fridge', 'steps-goal': 'trophy', streak: 'flame', weekly: 'chart', weather: 'cloud', sleep: 'moon' }[t] || 'spark');
  const nudgeCta = a => ({ train: 'Start', water: 'Add glass', nourish: 'Open', today: 'Log', progress: 'View', coach: 'Review', atmosphere: 'View' }[a] || 'Open');

  /* ---------- Coach: AI chat, learned habits, nudges, notifications ---------- */
  const aiReady = () => signedIn();
  function vCoach() {
    const H = COACH.habits(S, 28), c = D.coach[S.profile.style] || D.coach.guide, N = S.nudge;
    const perm = 'Notification' in window ? Notification.permission : 'unsupported';
    const chat = S.chat.slice(-30);
    const prompts = ['What should I eat tonight?', 'Plan my workout around the weather', 'How was my week?', 'I\'m sore today — what should I do?', 'Give me a 10-minute workout'];
    return `<div class="grid">
      <section class="card s7 chatcard" aria-label="Chat with your coach">
        <div class="ch"><div class="row" style="gap:12px">${coachPic(S.profile.style)}<div><h2 style="margin:0">${esc(c.name)}</h2><span class="muted small">${aiReady() ? `${I('spark', 12)} AI coach · knows your logs, plan, fridge & weather` : 'Offline coach · connect your account for full AI'}</span></div></div>
          <div class="row">${S.chat.length ? `<button class="btn ghost sm" data-a="chat-clear">Clear</button>` : ''}</div></div>
        <div class="chatlog" id="chatlog" aria-live="polite">${chat.length ? chat.map(m => `<div class="msg ${m.role}">${m.role === 'assistant' ? `<div class="bub">${md(m.text)}${m.offline ? '<small class="muted">offline coach</small>' : ''}</div><button class="say" data-a="say" data-t="${esc(m.text)}" aria-label="Read aloud">${I('play', 12)}</button>` : `<div class="bub">${esc(m.text)}</div>`}</div>`).join('') : `<div class="emptystate" style="padding:20px 6px"><div class="ic">${I('chat', 26)}</div><p>Ask anything about training, meals, your fridge, recovery or the weather. I use your real data to answer.</p></div>`}
          ${ui.chatBusy ? '<div class="msg assistant"><div class="bub typing"><i></i><i></i><i></i></div></div>' : ''}</div>
        <div class="scroller" style="margin:10px 0">${prompts.map(p => `<button class="chip" data-a="chat-prompt" data-t="${esc(p)}">${esc(p)}</button>`).join('')}</div>
        <form class="chatform" data-form="chat"><label for="chatIn" class="sr">Message your coach</label><input id="chatIn" maxlength="600" placeholder="Message your coach…" autocomplete="off" ${ui.chatBusy ? 'disabled' : ''}><button class="btn brand" type="submit" aria-label="Send" ${ui.chatBusy ? 'disabled' : ''}>${I('send', 16)}</button></form>
        <p class="note">General wellness guidance, not medical advice. For pain, injury or health conditions, talk to a clinician.</p>
      </section>
      <div class="s5 stack">
        <section class="card"><div class="ch"><h2>What I've learned</h2><span class="pill">${H.days} days of data</span></div>
          ${H.insights.length ? `<div class="stack" style="gap:8px">${H.insights.map(i => `<div class="insight"><span class="ic">${I(i.icon, 16)}</span><span>${esc(i.text)}</span></div>`).join('')}</div>` : `<p class="muted small" style="margin:0">Log water, meals, workouts and sleep for a few days. I'll learn when you train, how you hydrate and where you slip — then nudge at the right moments.</p>`}
          <button class="btn soft sm" style="margin-top:14px" data-a="weekly-review">${I('chart', 14)} ${aiReady() ? 'AI weekly review' : 'Weekly review'}</button></section>
        <section class="card"><div class="ch"><h2>Nudges</h2>${S.feed.length ? `<button class="btn ghost sm" data-a="feed-clear">Clear</button>` : ''}</div>
          ${S.feed.length ? `<div class="stack" style="gap:8px">${S.feed.slice(0, 8).map(f => `<button class="feeditem ${f.read ? '' : 'new'}" data-a="nudge-go" data-id="${f.id}"><span class="ic">${I(nudgeIcon(f.type), 16)}</span><span style="min-width:0;text-align:left"><b>${esc(f.title)}</b><small>${esc(f.body)}</small><em>${timeAgo(f.at)}</em></span></button>`).join('')}</div>` : `<p class="muted small" style="margin:0">Personalized nudges show up here — hydration pace, your usual workout time, protein, expiring fridge food, streaks and weekly reviews.</p>`}</section>
        <section class="card"><h2>Notifications</h2>
          <label class="check"><input type="checkbox" data-bind="nudge.enabled" ${N.enabled ? 'checked' : ''}> Personalized nudges</label>
          <div class="chips" style="margin:6px 0 10px">${[['workout', 'Workouts'], ['water', 'Water'], ['protein', 'Nutrition'], ['fridge', 'Fridge'], ['sleep', 'Bedtime'], ['checkin', 'Check-ins'], ['celebrate', 'Wins'], ['weekly', 'Weekly review']].map(([k, n]) => `<button class="chip ${N.types[k] ? 'on' : ''}" data-a="ntype" data-k="${k}" aria-pressed="${!!N.types[k]}">${n}</button>`).join('')}</div>
          <div class="three"><div class="field"><label for="qs">Quiet from</label><select id="qs" data-bind="nudge.quietStart">${hourOpts(N.quietStart)}</select></div><div class="field"><label for="qe">Until</label><select id="qe" data-bind="nudge.quietEnd">${hourOpts(N.quietEnd)}</select></div><div class="field"><label for="qm">Max / day</label><select id="qm" data-bind="nudge.max">${[2, 3, 4, 6, 8].map(n => `<option ${+N.max === n ? 'selected' : ''}>${n}</option>`).join('')}</select></div></div>
          <div class="row">${perm === 'granted' ? `<span class="status good">${I('check', 14)} Device alerts on</span>` : perm === 'denied' ? `<span class="status bad">${I('bell', 14)} Blocked in browser settings</span>` : perm === 'unsupported' ? `<span class="status warn">${I('bell', 14)} ${isIOS ? 'Install to Home Screen to enable' : 'Not supported here'}</span>` : `<button class="btn brand sm" data-a="notif-perm">${I('bell', 14)} Allow device alerts</button>`}
            ${aiReady() ? `<button class="btn soft sm" data-a="push-sub">${I('cloud', 14)} Background AI nudges</button>` : ''}</div>
          <p class="note">${aiReady() ? 'Background nudges are written by your AI coach and arrive even when WAYOF is closed.' : 'Without an account, nudges are delivered while WAYOF is open or recently used. Sign in for AI-written background notifications.'}</p>
          ${closedAlertsCard()}</section>
      </div></div>`;
  }
  function closedAlertsCard() {
    const st = ui.lnStatus; if (!st) { closedAlertsStatus().then(() => ui.view === 'coach' && render()); return ''; }
    const line = !st.notifications ? (isIOS ? 'On iPhone and iPad, add WAYOF to your Home Screen and sign in: AI nudges then arrive by push while it\'s closed.' : 'This browser can\'t show notifications.')
      : !st.granted ? (Notification.permission === 'denied' ? 'Notifications are blocked for WAYOF. Allow them in your browser\'s site settings to get reminders while it\'s closed.' : 'Turn on device alerts above to get reminders while WAYOF is closed.')
      : st.registered ? 'On: WAYOF wakes up in the background a few times a day and shows workouts, bedtime, fridge, appointment and shopping reminders, even offline. Your phone picks the exact moment, so they land close to the time.'
      : st.background ? (st.installed ? 'Almost there: tap below so the browser lets WAYOF wake up in the background.' : 'Install WAYOF (one tap, top of the screen) so it can remind you while it\'s closed, even offline.')
      : isIOS ? 'iPhone and iPad don\'t allow background wake-ups for web apps. Sign in for AI nudges by push, which do arrive while WAYOF is closed.' : 'This browser doesn\'t allow background wake-ups. Use Chrome or Edge, or sign in for push nudges.';
    return `<div class="insight" style="margin-top:10px"><span class="ic">${I('bell', 16)}</span><span><b>When WAYOF is closed</b><br><small>${line}</small>${st.granted && st.background && !st.registered ? `<br><button class="btn soft sm" style="margin-top:8px" data-a="ln-enable">${I('bell', 13)} Allow background reminders</button>` : ''}</span></div>`;
  }
  const hourOpts = sel => Array.from({ length: 24 }, (_, h) => `<option value="${h}" ${+sel === h ? 'selected' : ''}>${COACH.hr12(h)}</option>`).join('');
  function timeAgo(t) { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'just now' : m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`; }
  function scrollChat() { const c = $('#chatlog'); if (c) c.scrollTop = c.scrollHeight; }
  async function sendChat(text) {
    text = String(text || '').trim(); if (!text || ui.chatBusy) return;
    S.chat.push({ role: 'user', text, at: Date.now() }); ui.chatBusy = true; save(); render(); scrollChat();
    let reply, offline = false;
    try {
      if (!aiReady()) throw new Error('offline');
      const msgs = S.chat.slice(-12).map(m => ({ role: m.role, content: m.text }));
      const r = await CLOUD.coach('chat', { messages: msgs, context: COACH.context(S, { weather: wxSummary(), more: appsContext() }) });
      reply = r.reply;
    } catch (e) {
      offline = true; reply = COACH.reply(text, S, { fridgeRecipe: fridgeIdeas()[0], window: (bestWindow() || {}).text });
      if (e.message !== 'offline') reply += `\n\n(${e.message})`;
    }
    S.chat.push({ role: 'assistant', text: reply, at: Date.now(), offline }); if (S.chat.length > 60) S.chat.splice(0, S.chat.length - 60);
    ui.chatBusy = false; save(); render(); scrollChat();
  }
  function appsContext() {
    const plan = kShifts().length ? sleepPlanNow().slice(0, 3).map(p => ({ night: p.night, bed: APPS.fmtT(p.bed), wake: APPS.fmtT(p.wake), note: p.text })) : [];
    const shifts = kShifts().filter(s => s.date >= TODAY()).slice(0, 7).map(s => `${s.date} ${s.start}-${s.end} ${s.job}`);
    return { work_shifts_next: shifts, sleep_plan: plan, appointments_next: allAppts().slice(0, 5).map(a => `${a.date} ${a.time || ''} ${a.title}`), recent_cardio: recentCardio(5).map(c => `${c.k} ${c.w.title} ${c.w.minutes}min ${c.w.cardio.distM ? (c.w.cardio.distM / 1000).toFixed(1) + 'km' : ''}`) };
  }
  function wxSummary() { if (!S.wx) return null; const bw = bestWindow(); return { location: S.wx.label, now: `${Math.round(S.wx.cur.temp)}° feels ${Math.round(S.wx.cur.feels)}°, ${wxDesc(S.wx.cur.code)}, score ${wxScore(S.wx.cur)}/100`, best_window: bw ? bw.text : null, units: S.wx.units }; }

  /* nudge scheduler — runs every minute while the app is open */
  const inQuiet = (h, N) => N.quietStart > N.quietEnd ? (h >= N.quietStart || h < N.quietEnd) : (h >= N.quietStart && h < N.quietEnd);
  const typeKey = t => ({ 'workout-late': 'workout', 'steps-goal': 'celebrate', streak: 'celebrate' }[t] || t);
  async function runNudges() {
    scheduleReminders();
    const N = S.nudge; if (!N.enabled) return;
    const now = new Date(); if (inQuiet(now.getHours(), N)) return;
    const today = TODAY(); Object.keys(N.sent).forEach(k => { if (!k.endsWith(today)) delete N.sent[k]; });
    const sentToday = Object.keys(N.sent).length; if (sentToday >= +N.max) return;
    const bw = bestWindow();
    const list = COACH.nudges(S, now, { window: bw && bw.score >= 55 ? bw.text + '.' : '', expiring: expiringSoon().map(f => f.name) }).filter(n => !N.sent[n.id] && N.types[typeKey(n.type)] !== false);
    const tp = N.types.sleep !== false && tonightPlan();
    if (tp) { const mins = (tp.bed - now) / 60000, id = 'sleep-' + tp.night; if (mins > 20 && mins <= 75 && !N.sent[id]) list.unshift({ id, type: 'sleep', title: 'Time to wind down', body: `${tp.shift ? tp.shift.job + ' at ' + APPS.fmtT(tp.shift.st) + '. ' : ''}Lights out by ${APPS.fmtT(tp.bed)} for ${S.profile.sleep}h of sleep — screens off, dim the lights.`, action: 'apps', at: Date.now() }); }
    const n = list[0]; if (!n) return;
    N.sent[n.id] = 1; if (LN) LN.markShown(n.id); S.feed.unshift({ ...n, read: false }); if (S.feed.length > 40) S.feed.length = 40; save();
    if ('Notification' in window && Notification.permission === 'granted' && document.visibilityState !== 'visible') {
      try { const reg = await navigator.serviceWorker.getRegistration(); if (reg) reg.showNotification(n.title, { body: n.body, tag: n.id, icon: 'icon-192.png', badge: 'icon-192.png', data: { url: './index.html#' + (n.action === 'water' ? 'today' : n.action) } }); } catch (e) { }
    } else if (document.visibilityState === 'visible') toast(`${n.title} — ${n.body}`);
    renderChrome(); if (ui.view === 'today' || ui.view === 'coach') render();
  }
  async function weeklyReview() {
    if (aiReady()) { ui.view !== 'coach' && go('coach'); return sendChat('Give me my weekly review: what went well, what slipped, and one focus for next week.'); }
    const H = COACH.habits(S, 7), st = H.stats;
    openSheet(`<div class="sh"><h2>Your week</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div>
      <div class="kpis" style="margin-bottom:14px"><div class="kpi"><span>Days logged</span><b class="num">${st.logged}/7</b></div><div class="kpi"><span>Workouts</span><b class="num">${st.done}/${st.planned || 0}</b></div><div class="kpi"><span>Avg sleep</span><b class="num">${st.sleep ? st.sleep.toFixed(1) + 'h' : '—'}</b></div></div>
      ${H.insights.length ? `<div class="stack" style="gap:8px">${H.insights.map(i => `<div class="insight"><span class="ic">${I(i.icon, 16)}</span><span>${esc(i.text)}</span></div>`).join('')}</div>` : '<p class="muted">Not enough data this week yet.</p>'}
      <p class="note">Connect your account for an AI-written review with a focus for next week.</p>`);
  }
  /* ---------- reminders that arrive while WAYOF is closed (LocalNotify + the browser's background wake-ups) ---------- */
  const LN = window.LocalNotify;
  const at = (d, h, m = 0) => { const x = new Date(d); x.setHours(h, m, 0, 0); return +x; };
  function upcomingReminders() {
    const N = S.nudge, T = N.types, out = [], now = new Date(), H = COACH.habits(S, 21).stats;
    if (!N.enabled) return out;
    const wh = H.workoutHour != null ? H.workoutHour : 18, wH = Math.floor(wh), wM = Math.round((wh - wH) * 60);
    for (let i = 0; i < 3; i++) {
      const day = addDays(now, i), k = dkey(day), dayName = i === 0 ? 'today' : i === 1 ? 'tomorrow' : day.toLocaleDateString(undefined, { weekday: 'long' });
      // workout: 30 min before your usual training time
      const ses = T.workout !== false && sessionFor(k);
      if (ses && !isDone(k, ses.id)) out.push({ id: `lw-${k}`, tag: `workout-${k}`, at: at(day, wH, wM) - 30 * 6e4, until: at(day, wH, wM) + 2 * 36e5, url: './index.html#train',
        title: `${ses.title} in 30 min`, body: `${ses.minutes} min${ses.ex && ses.ex.length ? ' · ' + ses.ex.slice(0, 3).join(', ') : ''}. Tap to start.` });
      // fridge: the morning an item hits its use-by date
      if (T.fridge !== false) (S.fridge || []).filter(f => f.exp === k).forEach(f => out.push({ id: `lf-${k}-${f.name}`, tag: `fridge-${k}`, at: at(day, 9), until: at(day, 20), url: './index.html#nourish',
        title: `Use your ${f.name.toLowerCase()} ${dayName}`, body: 'It hits its use-by date. Tap for recipes that use it.' }));
      // appointments: 1 hour before (or 9 AM for all-day ones)
      allAppts().filter(a => a.date === k).forEach(a => { const [h, m] = (a.time || '09:00').split(':').map(Number), when = at(day, h, m);
        out.push({ id: `la-${a.id || a.title}-${k}`, at: a.time ? when - 36e5 : at(day, 8), until: when + 18e5, url: './index.html#apps', title: a.title, body: `${a.time ? 'At ' + COACH.hr12(h + m / 60) : dayName}${a.place ? ' · ' + a.place : ''}` }); });
    }
    // bedtime wind-down from your Kayaos shifts (same tag as the in-app nudge, so it never shows twice)
    if (T.sleep !== false && kShifts().length) sleepPlanNow().slice(0, 3).forEach(p => { const bed = +new Date(p.bed); if (bed > +now)
      out.push({ id: 'sleep-' + p.night, tag: 'sleep-' + p.night, at: bed - 45 * 6e4, until: bed, url: './index.html#today', title: 'Time to wind down',
        body: `Bed by ${APPS.fmtT(new Date(p.bed))}${p.shift ? ` for ${p.shift.job || 'work'} at ${APPS.fmtT(p.shift.st)}` : ''}. Screens off and lights low.` }); });
    // shopping day: your budget list, the morning you usually shop
    const sp = S.shop; if (sp && sp.plan && sp.plan.items) {
      const left = sp.plan.items.filter(i => !i.have && !sp.checked[i.key]).length;
      if (left) { let d = new Date(now); while (d.getDay() !== (sp.day ?? 6)) d = addDays(d, 1);
        out.push({ id: `ls-${dkey(d)}`, tag: 'shop', at: at(d, sp.hour ?? 10), until: at(d, 20), url: './index.html#nourish', title: 'Shopping day', body: `${left} items on your ${'$' + Math.round(sp.plan.total)} list. Tap to send it to Instacart.` }); }
    }
    // weekly review, Sunday evening
    if (T.weekly !== false) { let d = new Date(now); while (d.getDay() !== 0) d = addDays(d, 1);
      out.push({ id: `lr-${dkey(d)}`, tag: 'weekly', at: at(d, 19), until: at(d, 22), url: './index.html#coach', title: 'Your week in review', body: 'See what went well and pick one focus for next week.' }); }
    return out.filter(i => i.until > +now);
  }
  let remT = 0;
  function scheduleReminders(soon) {
    if (!LN) return; clearTimeout(remT);
    remT = setTimeout(() => LN.schedule(upcomingReminders(), { app: 'wayof', quietStart: +S.nudge.quietStart, quietEnd: +S.nudge.quietEnd, max: +S.nudge.max + 2, icon: 'icon-192.png' }).then(s => { ui.lnSupport = s; }), soon ? 50 : 1500);
  }
  async function closedAlertsStatus() { if (!LN) return null; ui.lnStatus = await LN.status(); return ui.lnStatus; }

  /* ---------- Train ---------- */
  const cc = { links: null, notes: null, groups: null, board: null, feed: null, loading: {} }; // cloud cache
  async function loadOnce(key, fn) { if (cc.loading[key]) return; cc.loading[key] = true; try { cc[key] = await fn(); } catch (e) { cc[key] = { error: e.message }; } cc.loading[key] = false; render(); }
  function vTrain() {
    const tabs = `<div class="seg" style="margin-bottom:18px">${[['plan', 'Weekly plan'], ['cardio', 'Ride · Walk · Run'], ['library', 'Library'], ['equipment', 'Equipment'], ['trainer', 'My trainer']].map(t => `<button class="${ui.trainTab === t[0] ? 'on' : ''}" data-a="ttab" data-t="${t[0]}">${t[1]}${t[0] === 'trainer' && Array.isArray(cc.notes) && cc.notes.some(n => !n.read) ? ' •' : ''}</button>`).join('')}</div>`;
    if (ui.trainTab === 'library') {
      const av = new Set(available().map(x => x.name));
      const list = D.exercises.filter(x => ui.libFocus === 'all' || x.focus === ui.libFocus).sort((a, b) => av.has(b.name) - av.has(a.name));
      return tabs + `<div class="scroller" style="margin-bottom:16px">${[['all', 'All'], ...Object.entries(D.focusNames)].map(([k, n]) => `<button class="chip ${ui.libFocus === k ? 'on' : ''}" data-a="lfocus" data-f="${k}">${n}</button>`).join('')}</div>
        <div class="libgrid">${list.map(x => `<button class="libcard ${av.has(x.name) ? '' : 'off'}" data-a="demo" data-n="${esc(x.name)}"><div class="demo-still">${DEMO.still(x.name, .85)}</div><b>${esc(x.name)}</b><small>${D.focusNames[x.focus]} · ${esc(x.gear)}${av.has(x.name) ? '' : ' · not in your setup'}</small><span class="pill">${I('play', 11)} Demo</span></button>`).join('')}</div>
        <p class="note">Tap any move for an animated demo with coaching cues. Choose intensity and modifications that suit you; check with a clinician if you have a health condition.</p>`;
    }
    if (ui.trainTab === 'equipment') {
      const term = ui.eqSearch.toLowerCase();
      const all = [...new Set([...D.equipment, ...S.custom])].filter(x => x.toLowerCase().includes(term));
      return tabs + `<div class="grid"><section class="card s8"><h2>Your equipment</h2><div class="field"><label for="eqs">Find equipment</label><input id="eqs" data-in="eqsearch" value="${esc(ui.eqSearch)}" placeholder="Search dumbbells, bands, machines…"></div>
        <div class="chips">${all.map(x => `<button class="eqchip ${S.equipment.includes(x) ? 'on' : ''}" data-a="eq" data-x="${esc(x)}" aria-pressed="${S.equipment.includes(x)}">${S.equipment.includes(x) ? I('check', 14) : ''}${esc(x)}${S.custom.includes(x) ? ' ✦' : ''}</button>`).join('') || '<p class="muted">No matches — add it on the right.</p>'}</div></section>
        <section class="card s4"><h2>Add your own</h2><p class="muted small">${S.equipment.length} selected · ${S.custom.length} custom</p><div class="field"><label for="eqc">Equipment name</label><input id="eqc" maxlength="55" placeholder="e.g. Adjustable kettlebell"></div><button class="btn brand block" data-a="eq-add">Add equipment</button>
        <p class="note">Rebuild your plan after changing equipment to refresh exercise picks.</p><button class="btn soft block" style="margin-top:10px" data-a="generate">Rebuild my week</button></section></div>`;
    }
    if (ui.trainTab === 'trainer') return tabs + vTrainer();
    if (ui.trainTab === 'cardio') { if (signedIn()) refreshApps(); const rc = recentCardio(8), wk = rc.filter(c => c.k >= dkey(weekStart(new Date()))); const tot = wk.reduce((a, c) => ({ d: a.d + (c.w.cardio.distM || 0), m: a.m + c.w.minutes, k: a.k + (c.w.cardio.kcal || 0) }), { d: 0, m: 0, k: 0 });
      return tabs + `<div class="grid"><section class="card s12"><div class="ch"><h2>Start a session</h2><span class="pill">${I('link', 13)} Pedalz meters</span></div><div class="modegrid">${CARDIO_MODES.map(m => `<button class="modecard" data-a="cardio" data-m="${m[0]}"><span class="mic">${I(m[2], 22)}</span><b>${m[1]}</b><small>${m[3]}</small></button>`).join('')}</div>
        <div class="row" style="margin-top:12px"><button class="btn soft sm" data-a="meter">${I('timer', 14)} Enter machine meter reading</button><button class="btn ghost sm" data-a="gear">${I('trophy', 14)} Gear shop</button></div></section>
        <section class="card s4"><h2>This week</h2><div class="kpis" style="grid-template-columns:1fr"><div class="kpi"><span>Distance</span><b class="num">${fmt(km(tot.d), 1)} ${dU()}</b></div><div class="kpi"><span>Active minutes</span><b class="num">${tot.m}</b></div><div class="kpi"><span>Calories</span><b class="num">${fmt(tot.k)}</b></div></div></section>
        <section class="card s8"><h2>Recent sessions</h2>${rc.length ? `<div class="stack" style="gap:6px">${rc.map(c => `<div class="exrow"><div class="ico">${I(c.w.cardio.mode === 'ride' || c.w.cardio.mode === 'indoor' ? 'bike' : 'run', 18)}</div><div style="min-width:0"><strong>${esc(c.w.title)}</strong><small>${parseKey(c.k).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} · ${c.w.minutes} min${c.w.cardio.distM ? ` · ${fmt(km(c.w.cardio.distM), 2)} ${dU()}` : ''}${c.w.cardio.avgMs ? ` · ${c.w.cardio.mode === 'walk' || c.w.cardio.mode === 'run' ? paceStr(c.w.cardio.avgMs) + '/' + dU() : fmt(spd(c.w.cardio.avgMs), 1) + ' ' + sU()}` : ''}${c.w.cardio.cad ? ` · ${c.w.cardio.cad} rpm` : ''}${c.w.cardio.hr ? ` · ${c.w.cardio.hr} bpm` : ''}</small></div><span class="rx num">${c.w.cardio.kcal || ''} kcal</span></div>`).join('')}</div>` : '<p class="muted small">No cardio yet. Pick a mode above. Outdoor modes use GPS, and the stationary bike can connect to a Bluetooth smart bike or take meter readings.</p>'}
        ${signedIn() ? `<p class="note">${ax.rides === false ? 'Pedalz isn\'t on this account yet — rides won\'t sync.' : 'Rides you record in Pedalz appear here automatically.'}</p>` : ''}</section></div>`; }
    const p = S.plan, ws = weekStart(new Date()), t = TODAY();
    const doneCount = p.week.filter(s => isDone(dkey(addDays(ws, s.dow)), s.id)).length;
    const selDow = ui.planDay != null ? ui.planDay : dow(new Date());
    const sel = p.week.find(s => s.dow === selDow);
    const selKey = dkey(addDays(ws, selDow));
    return tabs + `<div class="grid">
      <section class="card s5"><h2>Build your plan</h2>
        <div class="field"><label>Primary goal</label><div class="chips">${Object.entries(D.goals).map(([k, n]) => `<button class="chip ${p.goal === k ? 'on' : ''}" data-a="pgoal" data-g="${k}">${n}</button>`).join('')}</div></div>
        <div class="two"><div class="field"><label for="pdays">Days per week</label><select id="pdays" data-bind="plan.days">${[2, 3, 4, 5, 6].map(n => `<option ${+p.days === n ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
        <div class="field"><label for="pmin">Minutes per session</label><select id="pmin" data-bind="plan.minutes">${[15, 20, 30, 45, 60].map(n => `<option ${+p.minutes === n ? 'selected' : ''}>${n}</option>`).join('')}</select></div></div>
        <div class="field"><label for="plev">Experience</label><select id="plev" data-bind="plan.level">${['beginner', 'intermediate', 'advanced'].map(n => `<option value="${n}" ${p.level === n ? 'selected' : ''}>${n[0].toUpperCase() + n.slice(1)}</option>`).join('')}</select></div>
        <button class="btn brand block" data-a="generate">${p.week.length ? 'Rebuild my week' : 'Generate my week'}</button>
        <p class="note">Rule-based starter plan using ${S.equipment.length} pieces of your equipment${p.trainerEdited ? ' · last edited by your trainer' : ''}. Not a medical prescription.</p>
      </section>
      <section class="card s7"><div class="ch"><h2>This week</h2><span class="pill ${doneCount && doneCount === p.week.length ? 'good' : ''}">${doneCount} of ${p.week.length} done</span></div>
        ${p.week.length ? `<div class="bar" style="margin-bottom:14px"><div style="width:${doneCount / p.week.length * 100}%;background:var(--brand)"></div></div><div class="days">${DAYS_LONG.map((name, i) => {
          const s = p.week.find(x => x.dow === i), k = dkey(addDays(ws, i)), d = addDays(ws, i), dn = s && isDone(k, s.id);
          const wx = S.wx && S.wx.daily && S.wx.daily.find(x => x.d === k);
          return `<div class="dayrow ${k === t ? 'today' : ''} ${dn ? 'done' : ''} ${s ? '' : 'rest'} ${selDow === i ? 'sel' : ''}"><div class="dbox">${DAYS[i]}<b>${d.getDate()}</b></div><button class="grow" style="background:none;border:0;text-align:left;padding:0" data-a="pday" data-d="${i}"><strong>${s ? esc(s.title) : 'Rest day'}</strong><small class="muted">${s ? `${s.minutes} min · ${s.ex.length} exercises` : 'Recover, walk, stretch'}${wx ? ` · ${I(wxIcon(wx.code), 12)} ${Math.round(wx.tmax)}°` : ''}</small></button>
            ${s ? (dn ? `<button class="btn sm soft" data-a="workout" data-k="${k}" data-pid="${s.id}">${I('check', 14)} Done</button>` : `<button class="btn sm" data-a="player" data-k="${k}" data-pid="${s.id}" aria-label="Start ${esc(s.title)}">${I('play', 12)} Start</button>`) : ''}</div>`; }).join('')}</div>`
        : `<div class="emptystate"><div class="ic">${I('spark', 26)}</div><p>Choose your goal and tap <b>Generate my week</b>.</p></div>`}
      </section>
      ${sel ? `<section class="card s12" id="sessionDetail"><div class="ch"><div><span class="label">${DAYS_LONG[sel.dow]} session</span><h2 style="margin:4px 0 0">${esc(sel.title)}</h2></div><div class="row"><span class="pill">${I('clock', 14)} ${sel.minutes} min</span><button class="btn brand sm" data-a="player" data-k="${selKey}" data-pid="${sel.id}">${I('play', 12)} Start workout</button></div></div>
        <div class="grid" style="gap:10px">${sel.ex.map(e => `<div class="s6">${exRow(e)}</div>`).join('')}</div>
        ${sel.note ? `<p class="trainernote">${I('user', 14)} <b>Trainer note:</b> ${esc(sel.note)}</p>` : ''}
        <p class="note">Warm up for 5 minutes first. Rest 60–90 s between strength sets; stop if anything feels sharp or painful.</p></section>` : ''}
    </div>`;
  }

  function vTrainer() {
    const intro = `<section class="card s5"><span class="label">Hybrid coaching</span><h2 style="margin-top:4px">Bring your own trainer</h2><p class="muted">Your AI coach handles daily nudges and form demos. Your human trainer gets a private link to see your plan and recent progress, then sends back notes and plan changes — no trainer account needed.</p>
      <ul class="ticks"><li>${I('check', 14)} You choose what they see: plan, workouts, steps, sleep, nutrition totals</li><li>${I('check', 14)} Revoke access any time</li><li>${I('check', 14)} Their edits appear here for you to accept</li></ul></section>`;
    if (!CLOUD.enabled) return `<div class="grid">${intro}<section class="card s7 emptystate"><div class="ic">${I('link', 26)}</div><h2>Needs your WAYOF account</h2><p>Trainer links use your Supabase backend. Add your keys to <code>config.js</code> (see README) and sign in under Profile.</p></section></div>`;
    if (!signedIn()) return `<div class="grid">${intro}<section class="card s7 emptystate"><div class="ic">${I('user', 26)}</div><h2>Sign in to connect a trainer</h2><button class="btn brand" data-a="go" data-v="profile">Sign in</button></section></div>`;
    if (cc.links == null) loadOnce('links', CLOUD.trainer.links);
    if (cc.notes == null) loadOnce('notes', CLOUD.trainer.notes);
    const links = Array.isArray(cc.links) ? cc.links.filter(l => l.active) : [], notes = Array.isArray(cc.notes) ? cc.notes : [];
    const base = location.origin + location.pathname.replace(/[^/]*$/, '') + 'trainer.html#t=';
    return `<div class="grid">${intro}
      <section class="card s7"><h2>Trainer access</h2>
        ${links.length ? links.map(l => `<div class="exrow"><div class="ico">${I('user', 18)}</div><div style="min-width:0"><strong>${esc(l.trainer_name || 'Trainer')}</strong><small class="muted">Created ${new Date(l.created_at).toLocaleDateString()}</small></div><div class="row" style="margin-left:auto"><button class="btn sm soft" data-a="tl-share" data-u="${esc(base + l.token)}">${I('share', 13)} Send link</button><button class="btn sm ghost" data-a="tl-revoke" data-id="${l.id}">Revoke</button></div></div>`).join('') : `<p class="muted small">No trainer connected yet.</p>`}
        <div class="row" style="margin-top:12px"><input id="tname" maxlength="60" placeholder="Trainer's name" style="flex:1;min-width:160px"><button class="btn brand" data-a="tl-create">${I('link', 15)} Create private link</button></div>
        ${cc.links && cc.links.error ? `<p class="note" style="color:var(--bad)">${esc(cc.links.error)}</p>` : ''}</section>
      <section class="card s12"><div class="ch"><h2>Notes from your trainer</h2>${notes.some(n => !n.read) ? `<button class="btn ghost sm" data-a="tn-read">Mark all read</button>` : ''}</div>
        ${notes.length ? notes.map(n => `<div class="trainernote ${n.read ? '' : 'new'}"><div class="row between"><b>${new Date(n.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</b>${n.plan_patch ? `<button class="btn brand sm" data-a="tn-apply" data-id="${n.id}">${I('check', 13)} Apply plan changes</button>` : ''}</div><p style="margin:6px 0 0">${md(n.note || '')}</p></div>`).join('') : `<p class="muted small">When your trainer sends feedback or adjusts your plan, it shows up here.</p>`}</section></div>`;
  }

  /* ---------- workout player: full-screen coach mode + camera form check ---------- */
  let PL = null;
  const VISION = window.WAYOF_VISION;
  function parseRx(name) {
    const r = rx(name), m = r.match(/(\d+)\s*×\s*(\d+)\s*(s)?/), mm = r.match(/(\d+)\s*min/);
    if (m) return { sets: +m[1], reps: m[3] ? 0 : +m[2], secs: m[3] ? +m[2] : 0, rest: D.exercises.find(e => e.name === name)?.focus === 'core' ? 30 : 60 };
    if (mm) return { sets: 1, reps: 0, secs: +mm[1] * 60, rest: 30 };
    return { sets: 3, reps: 10, secs: 0, rest: 60 };
  }
  function openPlayer(k, pid) {
    const s = S.plan.week.find(x => x.id === pid); if (!s) return;
    PL = { k, pid, s, i: 0, set: 1, phase: 'work', left: 0, timer: null, demo: null, startedAt: Date.now(), fs: innerWidth < 760, cam: null, camOn: false, results: {}, tips: {}, camReps: 0, facing: 'user', rpe: null };
    renderPlayer();
    if (S.voice.countReps) speak(`Let's start ${s.title}. First up: ${s.ex[0]}.`, { quiet: true });
  }
  async function toggleFullscreen(on) {
    PL.fs = on; const sh = $('.sheet.player'); if (sh) sh.classList.toggle('fs', on);
    try { if (on && document.documentElement.requestFullscreen && !document.fullscreenElement) await document.documentElement.requestFullscreen({ navigationUI: 'hide' }); else if (!on && document.fullscreenElement) await document.exitFullscreen(); } catch (e) { /* iOS: CSS full-viewport mode is used instead */ }
    try { if (on && screen.orientation && screen.orientation.lock && innerWidth > innerHeight) await screen.orientation.lock('landscape'); } catch (e) { }
  }
  async function startCam() {
    if (!VISION.supported()) { toast('Camera needs HTTPS and a supported browser'); return; }
    try {
      if (!PL.cam) { PL.cam = { stream: null, tracker: null }; }
      const v = $('#camV'); if (!v) return;
      if (!PL.cam.stream) PL.cam.stream = await VISION.openCamera(v, PL.facing);
      else { v.srcObject = PL.cam.stream; v.setAttribute('playsinline', ''); v.muted = true; await v.play().catch(() => { }); }
      attachTracker();
    } catch (e) { PL.camOn = false; toast(e.name === 'NotAllowedError' ? 'Camera permission was denied' : (e.message || 'Camera unavailable')); renderPlayer(); }
  }
  function attachTracker() {
    if (!PL || !PL.cam || !PL.camOn) return;
    if (PL.cam.tracker) PL.cam.tracker.stop();
    const name = PL.s.ex[PL.i], R = parseRx(name), pat = DEMO.demoFor[name] || 'fold';
    PL.camReps = 0;
    PL.cam.tracker = VISION.start({
      video: $('#camV'), canvas: $('#camC'), pattern: pat,
      onStatus: (t, lvl) => { const el = $('#camS'); if (el) { el.textContent = t; el.className = 'camstatus ' + lvl; } if (lvl === 'bad' && PL) { PL.camFail = true; const sub = $('#plSub'), big = $('#plBig'); if (sub && !R.secs) sub.textContent = 'Rep counting is off — tap Set done when you finish'; if (big && !R.secs) big.textContent = `${R.reps} reps`; } },
      onRep: (n, tip) => {
        if (!PL || PL.phase !== 'work') return;
        PL.camReps = n; const el = $('#camR'); if (el) el.textContent = n; const big = $('#plBig'); if (big && !R.secs) big.textContent = `${n} / ${R.reps}`;
        (PL.tips[name] = PL.tips[name] || []).push(tip);
        if (S.voice.countReps) speak(n === R.reps ? `${n}. Set complete.` : String(n), { quiet: true });
        if (R.reps && n >= R.reps) setTimeout(() => PL && PL.phase === 'work' && plSetDone(), 700);
      }
    });
  }
  function stopCam() { if (PL && PL.cam) { if (PL.cam.tracker) PL.cam.tracker.stop(); VISION.stopStream(PL.cam.stream); PL.cam = null; } }
  function renderPlayer() {
    const s = PL.s, name = s.ex[PL.i], R = parseRx(name), cues = DEMO.cues(name), finished = PL.phase === 'done';
    if (PL.demo) { PL.demo.stop(); PL.demo = null; }
    if (PL.cam && PL.cam.tracker) { PL.cam.tracker.stop(); PL.cam.tracker = null; }
    sheetCleanup = null; // re-rendering the player must not end the session
    if (finished) {
      stopCam();
      const logged = Object.entries(PL.results);
      openSheet(`<div class="playerdone"><div class="emptystate"><div class="ic" style="background:var(--good);color:#fff">${I('trophy', 28)}</div><h2>Session complete!</h2><p>${esc(s.title)} · ${s.ex.length} exercises · ${Math.max(1, Math.round((Date.now() - PL.startedAt) / 60000))} min</p></div>
        ${logged.length ? `<div class="stack" style="gap:6px;margin-bottom:12px">${logged.map(([n, sets]) => `<div class="exrow"><div class="ico thumb">${DEMO.still(n, .85)}</div><div style="min-width:0;text-align:left"><strong>${esc(n)}</strong><small>${sets.map(x => x + ' reps').join(' · ')}${PL.tips[n] && PL.tips[n].length ? ' · ' + esc(mostCommon(PL.tips[n])) : ''}</small></div></div>`).join('')}</div>` : ''}
        <div class="field"><label>How hard did that feel?</label><div class="chips">${['Easy', 'Just right', 'Hard', 'Too hard'].map(x => `<button class="chip ${PL.rpe === x ? 'on' : ''}" data-a="rpe" data-v="${x}">${x}</button>`).join('')}</div></div>
        <button class="btn brand block" data-a="player-finish">${I('check', 16)} Save workout</button></div>`, { player: true }, 'player' + (PL.fs ? ' fs' : ''));
      sheetCleanup = playerCleanup; return;
    }
    const camReady = PL.camOn;
    openSheet(`<div class="sh plhead"><div style="min-width:0"><span class="label">${esc(s.title)} · ${PL.i + 1} of ${s.ex.length}</span><h2 style="margin:2px 0 0">${esc(name)}</h2></div>
        <div class="row" style="flex-wrap:nowrap;gap:6px"><button class="iconbtn ${PL.camOn ? 'on' : ''}" data-a="pl-cam" aria-label="${PL.camOn ? 'Turn off' : 'Turn on'} camera form check" title="Camera form check">${I('camera', 18)}</button><button class="iconbtn" data-a="pl-fs" aria-label="${PL.fs ? 'Exit full screen' : 'Full screen'}" title="Full screen">${I(PL.fs ? 'x' : 'ext', 17)}</button>${PL.fs ? '' : `<button class="iconbtn" data-a="close" aria-label="Exit workout">${I('x', 18)}</button>`}</div></div>
      <div class="playergrid ${camReady ? 'withcam' : ''}">
        <div class="demobox" id="demoBox" aria-live="off"><span class="demotag">${I('spark', 12)} ${DEMO.hasVideo(name) ? 'Video demo' : esc((D.coach[S.profile.style] || D.coach.guide).name.replace('The ', '')) + ' demo'}</span></div>
        ${camReady ? `<div class="cambox ${PL.facing === 'user' ? 'mirror' : ''}"><video id="camV" playsinline muted></video><canvas id="camC"></canvas><div class="camreps"><b id="camR">${PL.camReps || 0}</b><small>reps</small></div><div class="camstatus info" id="camS">Starting camera…</div><button class="flipcam" data-a="pl-flip" aria-label="Switch camera">${I('refresh', 16)}</button></div>` : ''}
        <div class="playerinfo">
          <div class="progressdots">${s.ex.map((_, i) => `<i class="${i < PL.i ? 'd' : i === PL.i ? 'c' : ''}"></i>`).join('')}</div>
          <div class="setline"><span class="label">${PL.phase === 'rest' ? 'Rest' : `Set ${PL.set} of ${R.sets}`}</span><div class="bignum num" id="plBig">${PL.phase === 'rest' ? fmtSec(PL.left) : R.secs ? fmtSec(PL.left || R.secs) : camReady ? `${PL.camReps || 0} / ${R.reps}` : `${R.reps} reps`}</div><span class="muted small" id="plSub">${PL.phase === 'rest' ? `Next: ${PL.set <= R.sets ? 'set ' + PL.set : esc(s.ex[PL.i + 1] || 'finish')}` : R.secs ? 'Timer starts when you tap Start' : camReady ? 'Camera is counting — the set completes automatically' : 'Follow the demo tempo'}</span></div>
          <ul class="cues">${cues.map(c => `<li>${I('check', 13)} ${esc(c)}</li>`).join('')}</ul>
          ${(D.exercises.find(e => e.name === name) || {}).track ? `<button class="btn soft sm" data-a="cardio" data-m="${(D.exercises.find(e => e.name === name) || {}).track}">${I('timer', 13)} Track with live meters</button>` : ''}
          <div class="row playerbtns">
            <button class="iconbtn" data-a="pl-prev" aria-label="Previous exercise" ${PL.i === 0 ? 'disabled' : ''}>${I('left', 18)}</button>
            ${PL.phase === 'rest' ? `<button class="btn brand" style="flex:1" data-a="pl-skiprest">${I('skip', 14)} Skip rest</button>` : R.secs && !PL.timer ? `<button class="btn brand" style="flex:1" data-a="pl-timer">${I('play', 14)} Start ${fmtSec(PL.left || R.secs)}</button>` : `<button class="btn brand" style="flex:1" data-a="pl-setdone">${I('check', 15)} ${PL.set >= R.sets ? 'Exercise done' : 'Set done'}</button>`}
            <button class="iconbtn" data-a="pl-next" aria-label="Next exercise">${I('right', 18)}</button></div>
          <div class="row between"><label class="check small" style="padding:4px 0"><input type="checkbox" data-bind="voice.countReps" ${S.voice.countReps ? 'checked' : ''}> Voice coaching</label>${PL.fs ? `<button class="btn ghost sm" data-a="close">End workout</button>` : ''}</div>
        </div></div>`, { player: true }, 'player' + (PL.fs ? ' fs' : ''));
    sheetCleanup = playerCleanup;
    const box = $('#demoBox');
    if (box) { const tag = box.innerHTML; PL.demo = DEMO.mount(box, name, { onRep: n => { if (PL && PL.phase === 'work' && !R.secs && !PL.camOn && S.voice.countReps && n <= R.reps) speak(String(n), { quiet: true }); } }); box.insertAdjacentHTML('beforeend', tag); }
    if (camReady) startCam();
  }
  const mostCommon = a => { const c = {}; a.forEach(x => (c[x] = (c[x] || 0) + 1)); return Object.entries(c).sort((x, y) => y[1] - x[1])[0][0]; };
  const fmtSec = s => `${Math.floor(s / 60)}:${pad(s % 60)}`;
  function playerCleanup() { if (PL) { clearInterval(PL.timer); if (PL.demo) PL.demo.stop(); stopCam(); PL = null; } if ('speechSynthesis' in window) speechSynthesis.cancel(); if (document.fullscreenElement) document.exitFullscreen().catch(() => { }); }
  function plTick(onEnd) {
    clearInterval(PL.timer);
    PL.timer = setInterval(() => {
      if (!PL) return; PL.left--; const b = $('#plBig'); if (b) b.textContent = fmtSec(Math.max(0, PL.left));
      if (S.voice.countReps && [10, 3].includes(PL.left)) speak(PL.left === 10 ? '10 seconds' : '3, 2, 1', { quiet: true });
      if (PL.left <= 0) { clearInterval(PL.timer); PL.timer = null; onEnd(); }
    }, 1000);
  }
  function plSetDone() {
    const name = PL.s.ex[PL.i], R = parseRx(name);
    if (!R.secs) (PL.results[name] = PL.results[name] || []).push(PL.camOn && PL.camReps ? PL.camReps : R.reps);
    PL.camReps = 0;
    if (PL.set >= R.sets) return plNextEx();
    PL.set++; PL.phase = 'rest'; PL.left = R.rest; renderPlayer();
    if (S.voice.countReps) speak(`Nice. Rest ${R.rest} seconds.`, { quiet: true });
    plTick(() => { PL.phase = 'work'; PL.left = 0; renderPlayer(); if (S.voice.countReps) speak(`Set ${PL.set}. Go.`, { quiet: true }); });
  }
  function plNextEx() {
    clearInterval(PL.timer); PL.timer = null;
    if (PL.i >= PL.s.ex.length - 1) { PL.phase = 'done'; renderPlayer(); if (S.voice.countReps) speak('Workout complete. Great work!', { quiet: true }); return; }
    PL.i++; PL.set = 1; PL.phase = 'work'; PL.left = 0; PL.camReps = 0; renderPlayer();
    if (S.voice.countReps) speak(`Next: ${PL.s.ex[PL.i]}.`, { quiet: true });
  }
  function demoSheet(name) {
    const e = D.exercises.find(x => x.name === name) || {};
    const avatars = Object.entries(D.coach), style = S.profile.style || 'guide';
    DEMO.setLook(style);
    const realClip = DEMO.hasVideo(name) && style === 'guide';
    openSheet(`<div class="sh"><div><span class="label">${D.focusNames[e.focus] || ''} · ${esc(e.gear || '')}</span><h2 style="margin:2px 0 0">${esc(name)}</h2></div><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div>
      <div class="demobox" id="demoBox"></div><div class="row between" style="margin:10px 0"><span class="pill">${I('timer', 13)} ${rx(name)}</span><span class="pill">${realClip ? 'Realistic video demo' : `${esc((D.coach[style] || D.coach.guide).name.replace('The ', ''))} avatar`}</span><button class="btn soft sm" data-a="say" data-t="${esc(name + '. ' + DEMO.cues(name).join('. '))}" aria-label="Play spoken coaching for ${esc(name)}">${I('play', 12)} Play voice instructions</button></div>
      <div class="label" style="margin:14px 0 7px">Choose your demo avatar</div><div class="coachpick avatarpick">${avatars.map(([key, c]) => `<button class="coachopt ${style === key ? 'on' : ''}" data-a="avatar" data-style="${key}" data-n="${esc(name)}" aria-pressed="${style === key}">${coachPic(key)}${esc(c.name.replace('The ', ''))}<small>${style === key ? 'Selected for all exercises' : 'Tap to switch'}</small></button>`).join('')}</div>
      <p class="note" style="margin:10px 0">The Guide uses realistic exercise videos where available. Other avatar choices use the matching animated coach across the library. Spoken form cues use your device’s voice settings.</p><ul class="cues">${DEMO.cues(name).map(c => `<li>${I('check', 13)} ${esc(c)}</li>`).join('')}</ul>`, {}, 'demo-sheet');
    const d = DEMO.mount($('#demoBox'), name, { look: style }); sheetCleanup = () => d.stop();
  }

  /* ---------- Nourish: recipes · fridge · copycat ---------- */
  const PANTRY = ['olive oil', 'oil', 'salt', 'pepper', 'spices', 'honey', 'soy sauce', 'chili', 'garlic', 'pantry', 'ice', 'water', 'butter', 'cornstarch', 'mustard', 'vinegar', 'cilantro', 'chia'];
  const daysUntil = d => d ? Math.round((parseKey(d) - parseKey(TODAY())) / 864e5) : null;
  const expiringSoon = () => (S.fridge || []).filter(f => f.exp && daysUntil(f.exp) <= 2).sort((a, b) => a.exp.localeCompare(b.exp));
  function fridgeHave(ingName) {
    const n = D.normalize(ingName);
    if (PANTRY.some(p => n.includes(p))) return 'pantry';
    return (S.fridge || []).find(f => { const fn = D.normalize(f.name); if (!fn) return false; return n.includes(fn) || fn.split(' ').some(w => w.length >= 4 && n.includes(w.replace(/s$/, ''))) || n.split(' ').some(w => w.length >= 4 && fn.includes(w.replace(/s$/, ''))); }) ? 'fridge' : null;
  }
  function fridgeMatch(r) {
    const ings = r.ing.map(i => i[0]); const st = ings.map(fridgeHave);
    const have = st.filter(Boolean).length, fromFridge = st.filter(x => x === 'fridge').length;
    const exp = expiringSoon().filter(f => ings.some(i => D.normalize(i).includes(D.normalize(f.name).split(' ').pop().replace(/s$/, '')))).length;
    return { have, total: ings.length, fromFridge, exp, missing: ings.filter((_, i) => !st[i]), pct: have / ings.length };
  }
  function fridgeIdeas() {
    if (!(S.fridge || []).length) return [];
    return [...D.recipes, ...D.clones].map(r => ({ r, m: fridgeMatch(r) })).filter(x => x.m.fromFridge > 0).sort((a, b) => (b.m.exp - a.m.exp) || (b.m.pct - a.m.pct) || (b.m.fromFridge - a.m.fromFridge)).map(x => x.r);
  }
  function recipeCard(r) {
    const fm = (S.fridge || []).length ? fridgeMatch(r) : null, kit = kitchenMatch(r);
    return `<button class="rcard" data-a="recipe" data-id="${r.id}"><div class="artwrap">${foodArt(r.art, r.id, r.name)}${S.favorites.includes(r.id) ? `<span class="fav">${I('heartf', 18)}</span>` : ''}${fm && fm.fromFridge ? `<span class="match pill dark">${I('fridge', 11)} ${fm.have}/${fm.total} on hand</span>` : kit ? `<span class="match pill dark">${kit} from your kitchen</span>` : ''}${r.style ? `<span class="clonetag">${esc(r.style)}</span>` : ''}</div>
      <h3>${esc(r.name)}</h3><div class="meta"><span>${I('clock', 13)}</span>${r.min} min · ${r.kcal} kcal · ${r.homePrice ? '$' + r.homePrice.toFixed(2) : '$'.repeat(r.cost)}</div>
      <div class="mstrip"><span><b>${r.p}g</b>Protein</span><span><b>${r.c}g</b>Carbs</span><span><b>${r.f}g</b>Fat</span></div></button>`;
  }
  function kitchenMatch(r) {
    const terms = ui.kitchen.toLowerCase().split(/[,\n]+/).map(s => s.trim()).filter(s => s.length > 1);
    if (!terms.length) return 0;
    return r.ing.filter(([n]) => terms.some(t => n.toLowerCase().includes(t) || t.includes(n.toLowerCase().split(' ').pop()))).length;
  }
  const findRecipe = id => D.recipes.find(r => r.id === id) || D.clones.find(r => r.id === id) || (D.clonesLegacy || []).find(r => r.id === id) || (S.myClones || []).find(r => r.id === id) || (ui.aiClone && ui.aiClone.id === id ? ui.aiClone : null);

  function vNourish() {
    const k = ui.date, T = totals(k), p = S.profile;
    const tabs = `<div class="row between" style="margin-bottom:16px"><div class="seg">${[['recipes', 'Recipes'], ['fridge', 'My fridge'], ['copycat', 'Copycat'], ['shop', 'Shop']].map(t => `<button class="${ui.nTab === t[0] ? 'on' : ''}" data-a="ntab" data-t="${t[0]}">${t[1]}${t[0] === 'fridge' && expiringSoon().length ? ` <span class="badge">${expiringSoon().length}</span>` : ''}</button>`).join('')}</div>
      <button class="btn brand sm" data-a="meal-add" data-slot="${guessSlot()}">${I('plus', 15)} Log food</button></div>`;
    const summary = `<section class="card s12 nsum"><div class="row between"><div><span class="label">${k === TODAY() ? 'Today' : parseKey(k).toLocaleDateString(undefined, { weekday: 'long' })}</span><h2 style="margin:2px 0 0">${fmt(Math.max(0, p.kcal - T.kcal))} kcal left</h2></div>
      <div class="three nmac">${[['Protein', T.p, p.protein, 'var(--protein)'], ['Carbs', T.c, p.carbs, 'var(--carbs)'], ['Fat', T.f, p.fat, 'var(--fat)']].map(m => `<div><div class="row between small"><span><span class="mdot" style="background:${m[3]}"></span>${m[0]}</span><b class="num">${fmt(m[1])}/${m[2]}g</b></div><div class="bar" style="margin-top:6px"><div style="width:${clamp(m[1] / m[2] * 100, 0, 100)}%;background:${m[3]}"></div></div></div>`).join('')}</div></div></section>`;
    if (ui.nTab === 'fridge') return tabs + `<div class="grid">${summary}${vFridge()}</div>`;
    if (ui.nTab === 'copycat') return tabs + `<div class="grid">${summary}${vCopycat()}</div>`;
    if (ui.nTab === 'shop') return tabs + `<div class="grid">${vShop()}</div>`;
    let list = D.recipes.filter(r => ui.filter === 'all' || (ui.filter === 'fav' ? S.favorites.includes(r.id) : r.slot === ui.filter));
    if (ui.kitchen.trim()) list = list.map(r => [r, kitchenMatch(r)]).sort((a, b) => b[1] - a[1]).map(x => x[0]);
    if (ui.cheap) list = list.filter(r => r.cost === 1);
    return tabs + `<div class="grid">${summary}
      <section class="card s8"><div class="field" style="margin-top:0"><label for="kit">Search by ingredient</label><input id="kit" data-in="kitchen" value="${esc(ui.kitchen)}" placeholder="eggs, rice, spinach, chicken…"></div><p class="note" style="margin-top:0">Tip: keep <b>My fridge</b> up to date and recipes match automatically.</p></section>
      <section class="card s4" style="background:var(--bg2)"><span class="label">Grocery budget</span><div class="big num" style="margin:8px 0 4px">$${fmt(S.budget)}</div><div class="muted small">per week · about $${fmt(S.budget / 7, 2)} a day</div>
        <div class="row" style="margin-top:14px"><button class="btn sm" data-a="budget-edit">Edit</button><button class="btn ${ui.cheap ? 'brand' : 'ghost'} sm" data-a="cheap">${ui.cheap ? I('check', 14) + ' ' : ''}Budget-friendly</button></div></section></div>
      <div class="section-title"><h2>Recipes</h2><span class="muted small">${list.length} ideas</span></div>
      <div class="scroller" style="margin-bottom:16px">${[['all', 'All'], ['breakfast', 'Breakfast'], ['lunch', 'Lunch'], ['dinner', 'Dinner'], ['snack', 'Snacks'], ['fav', '♥ Favorites']].map(([kk, n]) => `<button class="chip ${ui.filter === kk ? 'on' : ''}" data-a="nfilter" data-f="${kk}">${n}</button>`).join('')}</div>
      ${list.length ? `<div class="recipes">${list.map(recipeCard).join('')}</div>` : `<div class="card emptystate"><div class="ic">${I('heart', 26)}</div><p>No recipes here yet — tap the heart on any recipe to save it.</p></div>`}`;
  }

  function vFridge() {
    const items = (S.fridge || []).slice().sort((a, b) => (a.exp || '9999').localeCompare(b.exp || '9999'));
    const ideas = fridgeIdeas().slice(0, 8), exp = expiringSoon();
    return `<section class="card s5"><div class="ch"><h2>What's in my fridge</h2><span class="pill">${items.length} items</span></div>
        <form class="row" data-form="fridge" style="gap:8px"><input id="fItem" list="fridgeList" maxlength="40" placeholder="Add an item…" style="flex:2;min-width:140px" autocomplete="off"><input id="fExp" type="date" aria-label="Use by date (optional)" style="flex:1;min-width:130px"><button class="btn brand" type="submit">${I('plus', 15)}</button></form>
        <datalist id="fridgeList">${D.fridgeStarters.map(x => `<option value="${esc(x)}">`).join('')}</datalist>
        <div class="scroller" style="margin:10px 0">${D.fridgeStarters.filter(x => !items.some(i => i.name.toLowerCase() === x.toLowerCase())).slice(0, 14).map(x => `<button class="chip" data-a="fridge-quick" data-n="${esc(x)}">+ ${esc(x)}</button>`).join('')}</div>
        ${items.length ? `<div class="fridgelist">${items.map(f => { const d = daysUntil(f.exp); const cls = d == null ? '' : d < 0 ? 'bad' : d <= 2 ? 'warn' : ''; return `<div class="fitem"><span>${esc(f.name)}</span>${f.exp ? `<span class="status ${cls}" style="padding:3px 9px;font-size:11.5px">${d < 0 ? 'expired' : d === 0 ? 'use today' : d === 1 ? 'tomorrow' : d + ' days'}</span>` : ''}<button class="x" data-a="fridge-del" data-id="${f.id}" aria-label="Remove ${esc(f.name)}">${I('x', 15)}</button></div>`; }).join('')}</div>
          <div class="row" style="margin-top:12px"><button class="btn ghost sm" data-a="fridge-clear">Clear all</button></div>` : `<p class="muted small">Add what you have and WAYOF ranks recipes by what you can cook right now — using expiring food first.</p>`}
      </section>
      <section class="card s7"><div class="ch"><h2>Cook from your fridge</h2>${exp.length ? `<span class="status warn">${I('clock', 13)} ${exp.length} expiring soon</span>` : ''}</div>
        ${ideas.length ? `<div class="stack" style="gap:8px">${ideas.map(r => { const m = fridgeMatch(r); return `<button class="exrow" data-a="recipe" data-id="${r.id}"><span style="width:48px;height:48px;flex-shrink:0">${foodArt(r.art, r.id, r.name)}</span><div style="min-width:0;text-align:left"><strong>${esc(r.name)}</strong><small>${m.have}/${m.total} on hand${m.missing.length ? ' · need ' + esc(m.missing.slice(0, 2).join(', ')) + (m.missing.length > 2 ? '…' : '') : ' · nothing to buy'}${m.exp ? ' · uses expiring food' : ''}</small></div><span class="rx num">${r.kcal} kcal</span></button>`; }).join('')}</div>`
        : `<div class="emptystate" style="padding:14px"><div class="ic">${I('fridge', 26)}</div><p>Add a few items to see what you can make.</p></div>`}
        <div class="aibox"><div><b>${I('spark', 14)} Ask the AI chef</b><p class="muted small" style="margin:2px 0 0">Invents a recipe from exactly what's in your fridge, sized to your remaining calories and protein.</p></div><button class="btn brand sm" data-a="ai-fridge" ${ui.cloneBusy || !items.length ? 'disabled' : ''}>${ui.cloneBusy ? 'Thinking…' : 'Create recipe'}</button></div>
      </section>`;
  }

  function vCopycat() {
    const c = ui.aiClone;
    return `<section class="card s12 copyhero"><div><span class="label">Copycat · powered by RepliPlate</span><h2 style="margin:4px 0 6px">Your restaurant favorites, rebuilt healthier at home</h2><p class="muted small" style="margin:0">Type a menu item or snap a photo of a plate or menu. WAYOF clones it, compares price and calories, and uses your fridge first.</p></div>
        <form class="row" data-form="clone" style="gap:8px;margin-top:14px"><input id="cloneQ" maxlength="120" value="${esc(ui.cloneQ)}" placeholder="Burrito bowl, orange chicken, Cuban sandwich…" style="flex:1;min-width:180px"><button class="btn brand" type="submit" ${ui.cloneBusy ? 'disabled' : ''}>${ui.cloneBusy ? 'Cloning…' : 'Clone it'}</button>
          <label class="btn soft" style="cursor:pointer">${I('camera', 16)}<span class="hide-m"> Photo</span><input type="file" accept="image/*" capture="environment" id="clonePhoto" hidden></label></form>
        <div class="row" style="margin-top:10px"><label class="btn ghost sm" style="cursor:pointer">${I('utensils', 14)} Log a meal I ate from a photo<input type="file" accept="image/*" capture="environment" id="mealPhoto" hidden></label></div>
        <p class="note">${APPS.repli.api ? 'AI cloning by RepliPlate: text, menu photos and plate photos.' : aiReady() ? 'AI cloning is on: text, menu photos and plate photos.' : 'Offline: matches from the clone library below. Sign in for AI cloning of any dish or photo.'}</p></section>
      ${c ? `<section class="card s12">${cloneDetail(c, true)}</section>` : ''}
      <div class="s12"><div class="section-title" style="margin-top:4px"><h2>Popular clones</h2><a class="btn ghost sm" href="${esc((CLOUD.config.REPLIPLATE_URL || 'https://repliplate.app'))}" target="_blank" rel="noopener">${I('ext', 13)} Open RepliPlate</a></div>
      <div class="recipes">${[...(S.myClones || []), ...D.clones].map(r => `<button class="rcard" data-a="recipe" data-id="${r.id}"><div class="artwrap">${foodArt(r.art || ['grain', 'chicken', 'greens'], r.id, r.name)}<span class="clonetag">${esc(r.style || 'Clone')}</span></div><h3>${esc(r.name)}</h3>
        <div class="savebar"><span><small>Restaurant</small><b>$${(+r.restPrice || 0).toFixed(2)}</b><em>${r.restCal || '—'} cal</em></span><span class="win"><small>Home</small><b>$${(+r.homePrice || 0).toFixed(2)}</b><em>${r.kcal} cal</em></span></div>
        <div class="meta">Save $${Math.max(0, (r.restPrice || 0) - (r.homePrice || 0)).toFixed(2)} · ${Math.max(0, (r.restCal || r.kcal) - r.kcal)} fewer cal · ${r.score || '—'}% match</div></button>`).join('')}</div></div>`;
  }
  function cloneDetail(r, fresh) {
    const save = Math.max(0, (r.restPrice || 0) - (r.homePrice || 0));
    return `<div class="ch"><div><span class="label">${esc(r.style || 'Clone')}</span><h2 style="margin:2px 0 0">${esc(r.name)}</h2></div><span class="pill dark">${r.score || '—'}% clone score</span></div>
      <div class="kpis" style="margin-bottom:14px"><div class="kpi"><span>Restaurant</span><b class="num">$${(+r.restPrice || 0).toFixed(2)}</b><small class="muted">${r.restCal || '—'} cal</small></div><div class="kpi win"><span>Homemade</span><b class="num">$${(+r.homePrice || 0).toFixed(2)}</b><small class="muted">${r.kcal} cal · P${r.p} C${r.c} F${r.f}</small></div><div class="kpi"><span>You save</span><b class="num">$${save.toFixed(2)}</b><small class="muted">${Math.max(0, (r.restCal || r.kcal) - r.kcal)} fewer cal</small></div></div>
      ${fresh ? `<div class="row"><button class="btn brand" data-a="recipe" data-id="${r.id}">${I('utensils', 15)} Open recipe & log</button><button class="btn ghost" data-a="repli-open" data-id="${r.id}">${I('ext', 14)} Open in RepliPlate</button>${!(S.myClones || []).some(x => x.id === r.id) ? `<button class="btn soft" data-a="clone-save" data-id="${r.id}">${I('heart', 15)} Save clone</button>` : ''}</div>` : ''}`;
  }
  function guessSlot() { const h = new Date().getHours(); return h < 11 ? 'breakfast' : h < 15 ? 'lunch' : h < 20 ? 'dinner' : 'snack'; }

  // AI helpers (Supabase Edge Function) with offline fallbacks
  function normalizeAIRecipe(x, prefix) {
    const n = v => Math.max(0, Math.round(+v || 0));
    return { id: prefix + uid(), name: String(x.name || 'Custom recipe').slice(0, 80), style: x.style || x.restaurant || '', slot: ['breakfast', 'lunch', 'dinner', 'snack'].includes(x.slot) ? x.slot : guessSlot(), min: n(x.minutes || x.min || 20), kcal: n(x.kcal || x.homeCal), p: n(x.protein || x.p), c: n(x.carbs || x.c), f: n(x.fat || x.f), cost: 1,
      restPrice: +x.restaurantPrice || +x.restPrice || 0, homePrice: +x.homePrice || 0, restCal: n(x.restaurantCal || x.restCal), score: n(x.score), art: Array.isArray(x.art) ? x.art.filter(a => FOOD[a]).slice(0, 5) : ['grain', 'chicken', 'greens', 'tomato'],
      ing: (x.ingredients || []).slice(0, 14).map(i => Array.isArray(i) ? [String(i[0]), String(i[1] || ''), +i[2] || 0] : [String(i.name || ''), String(i.amount || ''), +i.price || 0]), steps: (x.steps || []).slice(0, 10).map(String), swaps: (x.swaps || []).slice(0, 6).map(String), ai: true };
  }
  async function aiClone(text, image, opts = {}) {
    ui.cloneBusy = true; ui.cloneQ = text || ui.cloneQ; render();
    try {
      let done = false;
      if (APPS.repli.api) { try { ui.aiClone = await APPS.repli.clone({ query: text, image: image && image.data }); done = true; } catch (x) { if (!aiReady()) throw x; } }
      if (!done) {
        if (!aiReady()) throw new Error('offline');
        const r = await CLOUD.coach('clone', { text, image, fridge: (S.fridge || []).map(f => f.name), goals: { kcal: S.profile.kcal, protein: S.profile.protein }, units: S.profile.units });
        ui.aiClone = normalizeAIRecipe(r.clone || r, 'ai-');
      }
      if (opts.log) { S.myClones = [ui.aiClone, ...(S.myClones || [])].slice(0, 40); save(); ui.cloneBusy = false; render(); sheetCtx = {}; recipeSheet(ui.aiClone.id, guessSlot(), { asRest: true }); return; }
    } catch (e) {
      const q = (text || '').toLowerCase(); const words = q.split(/\W+/).filter(w => w.length > 2);
      const best = D.clones.map(c => ({ c, s: words.filter(w => (c.name + ' ' + c.style + ' ' + c.cat).toLowerCase().includes(w)).length })).sort((a, b) => b.s - a.s)[0];
      ui.aiClone = best && best.s ? best.c : null;
      toast(e.message === 'offline' ? (ui.aiClone ? 'Closest match from the clone library' : 'No offline match — sign in for AI cloning') : e.message);
    }
    ui.cloneBusy = false; if (ui.aiClone && ui.view !== 'nourish') { ui.nTab = 'copycat'; go('nourish'); } else render();
  }
  async function aiFridge() {
    ui.cloneBusy = true; render();
    try {
      if (!aiReady()) throw new Error('Sign in to use the AI chef — showing your best fridge match instead.');
      const T = totals(TODAY());
      const r = await CLOUD.coach('fridge', { fridge: (S.fridge || []).map(f => ({ name: f.name, expires: f.exp || null })), remaining: { kcal: Math.max(250, S.profile.kcal - T.kcal), protein: Math.max(15, S.profile.protein - T.p) }, slot: guessSlot(), units: S.profile.units, equipment_kitchen: 'standard home kitchen' });
      const rec = normalizeAIRecipe(r.recipe || r, 'ai-'); S.myClones = [rec, ...(S.myClones || [])].slice(0, 30); save(); ui.cloneBusy = false; render(); recipeSheet(rec.id);
      return;
    } catch (e) { toast(e.message); const f = fridgeIdeas()[0]; ui.cloneBusy = false; render(); if (f) recipeSheet(f.id); }
  }
  function resizeImage(file, max = 1024) {
    return new Promise((res, rej) => { const img = new Image(), url = URL.createObjectURL(file); img.onload = () => { const k = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.82).split(',')[1]); }; img.onerror = rej; img.src = url; });
  }
  /* ---------- Nourish → Shop: budget grocery planner + Instacart (shared ShopKit, same as RepliPlate) ---------- */
  const SK = window.SHOPKIT;
  const money = n => '$' + (Math.round((+n || 0) * 100) / 100).toFixed(2);
  const SHOP_SLOTS = { dinner: ['dinner'], both: ['lunch', 'dinner'], day: ['breakfast', 'lunch', 'dinner'] };
  const SHOP_FILTERS = [['ORGANIC', 'Organic'], ['GLUTEN_FREE', 'Gluten-free'], ['VEGAN', 'Vegan'], ['LOW_FAT', 'Low-fat'], ['KOSHER', 'Kosher']];
  const MEAT = /chicken|beef|turkey|pork|ham|steak|sirloin|salmon|shrimp|tuna|tilapia|wing|bacon|sausage/i;
  const ANIMAL = /egg|milk|cheese|yogurt|butter|cream|feta|parmesan|honey|mayo/i;
  const STORES = ['Publix', 'Aldi', 'Walmart', 'Target', 'Costco', "Sedano's", 'Winn-Dixie', 'Whole Foods', 'Sprouts', "BJ's"];
  function shopPrefs() {
    S.shop = Object.assign({ budget: S.budget || 75, days: 7, meals: 'both', people: 1, goal: 'balanced', filters: [], basics: true, fridge: true, store: '', plan: null, checked: {}, extra: [], day: 6, hour: 10 }, S.shop || {});
    return S.shop;
  }
  const asMeal = r => r && ({ id: r.id, name: r.name, slot: r.slot, kcal: r.kcal, protein: r.p, minutes: r.min, restPrice: r.restPrice, steps: r.steps || [], ingredients: (r.ing || []).map(([name, qty, cost]) => ({ name, qty, cost })) });
  function shopPool(sp) {
    const vegan = sp.filters.includes('VEGAN');
    return [...D.recipes, ...D.clones, ...(S.myClones || [])].filter(r => r && r.ing && r.ing.length && !(vegan && r.ing.some(([n]) => MEAT.test(n) || ANIMAL.test(n))))
      .map(r => { const m = asMeal(r); if (sp.fridge && (S.fridge || []).length) { const fm = fridgeMatch(r); m.weight = fm.fromFridge * 0.25 + fm.exp * 0.6; } return m; });
  }
  // in the fridge? same grocery item (ShopKit key) or the fridge name appears in the ingredient ("Rice" → "long grain white rice")
  const shopHave = sp => (name, key) => { if (!sp.fridge) return false; const n = D.normalize(name);
    return (S.fridge || []).some(f => { const fn = D.normalize(f.name); return fn && (SK.keyOf(f.name) === key || n.includes(fn) || (fn.length > 3 && n.includes(fn.replace(/s$/, '')))); }); };
  const mealById = id => asMeal(findRecipe(id));
  function buildShop() {
    const sp = shopPrefs();
    if (!(sp.budget > 0)) return toast('Enter a budget first');
    const p = SK.plan({ budget: sp.budget, days: sp.days, slots: SHOP_SLOTS[sp.meals], household: sp.people, pool: shopPool(sp), goal: sp.goal,
      goals: { kcal: S.profile.kcal, protein: S.profile.protein }, have: shopHave(sp), basics: sp.basics, store: sp.store, startDay: (new Date().getDay() + 6) % 7 });
    sp.plan = p; sp.checked = {}; save(); render(); scheduleReminders();
    toast(p.over ? 'That budget is tight. See the cheapest plan and the savings tips.' : `Planned: about ${money(p.total)} of ${money(sp.budget)}`);
  }
  function recostShop() { const sp = shopPrefs(); if (sp.plan) { SK.recost(sp.plan, mealById, { have: shopHave(sp), basics: sp.basics }); save(); } render(); }
  function swapShopMeal(i) {
    const sp = shopPrefs(), p = sp.plan, s = p && p.meals[i]; if (!s) return;
    const used = new Set(p.meals.map(m => m.id));
    const opts = shopPool(sp).filter(m => m.id !== s.id && (!m.slot || m.slot === s.slot || (s.slot !== 'breakfast' && m.slot !== 'breakfast' && m.slot !== 'snack')));
    if (!opts.length) return toast('No other meals fit this slot');
    // try each option, keep the one that fits the budget best with the most protein; prefer ones not already in the plan
    let best = null;
    for (const m of opts) { const keep = s.id; s.id = m.id; const t = SK.recost(JSON.parse(JSON.stringify(p)), mealById, { have: shopHave(sp), basics: sp.basics }).total; s.id = keep;
      const u = (m.protein || 0) / 10 - Math.max(0, t - p.target) - (used.has(m.id) ? 2 : 0) + Math.random(); if (!best || u > best.u) best = { m, u }; }
    s.id = best.m.id; recostShop(); toast(`Swapped in ${best.m.name}`);
  }
  async function shopInstacart(kind, id) {
    const sp = shopPrefs(), api = CLOUD.config.SHOP_API || '';
    let payload;
    if (kind === 'recipe') { const m = mealById(id); if (!m) return; payload = SK.recipePayload(m, { servings: Math.max(1, Math.round((sheetCtx.serv || 1) * (sp.people || 1))), filters: sp.filters, author: 'WAYOF', linkback: 'https://thewayof.health/#nourish' }); }
    else {
      const p = sp.plan; if (!p) return toast('Plan your groceries first');
      const items = p.items.filter(i => !i.have && !sp.checked[i.key]).concat((sp.extra || []).map(x => ({ name: x, search: x })));
      if (!items.length) return toast('Everything is checked off');
      payload = SK.listPayload(`WAYOF groceries · ${p.days} days · ~${money(p.total)}`, items, { filters: sp.filters, linkback: 'https://thewayof.health/#nourish', instructions: `Budget ${money(p.budget)} · estimated ${money(p.total)}${sp.store ? ' at ' + sp.store : ''}` });
    }
    toast('Opening Instacart…');
    const r = await SK.openInstacart(api, payload);
    if (!r.ok) { copyText(r.text, api ? `${r.error}. List copied instead.` : 'Instacart isn\'t connected yet, so the list was copied. Paste it anywhere.'); }
  }
  function receiptSheet() {
    const sp = shopPrefs(), p = sp.plan;
    openSheet(`<div class="sh"><h2>Log my receipt</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div>
      <p class="muted small" style="margin-top:0">Type what you actually paid. WAYOF compares it with its estimate and adjusts prices for that store, so next week's plan is closer.</p>
      <form data-form="shop-receipt" class="stack">
        <div class="field"><label for="rcStore">Store</label><input id="rcStore" list="rcStores" maxlength="40" value="${esc(sp.store)}" placeholder="Publix, Aldi, Walmart…"><datalist id="rcStores">${STORES.map(s => `<option value="${esc(s)}">`).join('')}</datalist></div>
        <div class="two"><div class="field"><label for="rcEst">WAYOF estimate</label><input id="rcEst" type="number" step="any" min="1" value="${p ? p.total.toFixed(2) : ''}"></div>
        <div class="field"><label for="rcAct">I paid</label><input id="rcAct" type="number" step="any" min="1" required placeholder="0.00" inputmode="decimal"></div></div>
        <p class="note">Leave out things that weren't on the list (snacks, household items) for the best match.</p>
        <button class="btn brand" data-a="shop-receipt-save">${I('check', 15)} Save and update prices</button></form>
      ${SK.state.receipts.length ? `<h3>Past receipts</h3>${SK.state.receipts.slice(0, 5).map(r => `<div class="row between small" style="padding:6px 0;border-top:1px solid var(--line)"><span>${new Date(r.at).toLocaleDateString()} · ${esc(r.store || 'Any store')}</span><span>est ${money(r.estimate)} → <b>${money(r.actual)}</b></span></div>`).join('')}` : ''}`);
  }
  function saveReceipt() {
    const est = +$('#rcEst').value, act = +$('#rcAct').value, store = $('#rcStore').value.trim();
    if (!(act > 0 && est > 0)) return toast('Enter both amounts');
    const f = SK.logReceipt(est, act, store); const sp = shopPrefs(); if (store) sp.store = store;
    closeSheet(); recostShop();
    toast(f ? `Got it. ${store || 'Your store'} runs ${Math.abs(Math.round((f - 1) * 100))}% ${f >= 1 ? 'above' : 'below'} the starting estimates.` : 'Saved');
  }
  function priceSheet(key) {
    const sp = shopPrefs(), it = sp.plan && sp.plan.items.find(i => i.key === key); if (!it) return;
    numSheet({ title: it.name, label: it.pkg ? `My price for ${it.pkg}` : 'My price per serving', unit: '$', step: 0.01, max: 500, value: +(it.unit / (it.unit && SK.factor(sp.store) || 1)).toFixed(2),
      hint: 'Set what you pay at your store. Clear it to go back to the estimate.', onSave: v => { SK.setPrice(key, v || ''); recostShop(); } });
  }

  function vShop() {
    const sp = shopPrefs(), p = sp.plan, fridgeN = (S.fridge || []).length;
    const segB = (field, val, opts) => `<div class="seg">${opts.map(([v, l]) => `<button type="button" class="${String(val) === String(v) ? 'on' : ''}" data-a="shop-set" data-f="${field}" data-v="${v}">${l}</button>`).join('')}</div>`;
    const form = `<section class="card s5"><div class="ch"><h2>Shop to a budget</h2>${I('cart', 20)}</div>
      <p class="muted small" style="margin-top:0">Enter what you want to spend. WAYOF plans meals that hit your ${fmt(S.profile.kcal)} kcal and ${S.profile.protein} g protein targets, uses your fridge first, and builds one list for Instacart.</p>
      <div class="two"><div class="field"><label for="shB">Budget ($)</label><input id="shB" type="number" min="5" max="2000" step="5" inputmode="decimal" data-bind="shop.budget" value="${sp.budget}"></div>
        <div class="field"><label>People</label><div class="stepper"><button type="button" data-a="shop-people" data-n="-1" aria-label="Fewer people">−</button><b class="num">${sp.people}</b><button type="button" data-a="shop-people" data-n="1" aria-label="More people">+</button></div></div></div>
      <div class="field"><label>Days</label>${segB('days', sp.days, [[3, '3 days'], [5, '5 days'], [7, '7 days']])}</div>
      <div class="field"><label>Meals</label>${segB('meals', sp.meals, [['dinner', 'Dinners'], ['both', 'Lunch + dinner'], ['day', 'All day']])}</div>
      <div class="field"><label>Focus</label>${segB('goal', sp.goal, [['balanced', 'Balanced'], ['save', 'Save most'], ['protein', 'More protein'], ['quick', 'Quick']])}</div>
      <div class="field"><label for="shS">Store <span class="muted">(optional, for price learning)</span></label><input id="shS" list="shStores" maxlength="40" data-bind="shop.store" value="${esc(sp.store)}" placeholder="Publix, Aldi, Walmart…"><datalist id="shStores">${STORES.map(s => `<option value="${esc(s)}">`).join('')}</datalist></div>
      <div class="field"><label>Instacart filters</label><div class="chips">${SHOP_FILTERS.map(([v, l]) => `<button type="button" class="chip ${sp.filters.includes(v) ? 'on' : ''}" data-a="shop-filter" data-v="${v}">${sp.filters.includes(v) ? I('check', 12) + ' ' : ''}${l}</button>`).join('')}</div></div>
      <label class="check"><input type="checkbox" data-bind="shop.fridge" ${sp.fridge ? 'checked' : ''}> Use my fridge first ${fridgeN ? `<span class="muted">(${fridgeN} items)</span>` : `<button type="button" class="btn ghost sm" data-a="ntab" data-t="fridge">Add items</button>`}</label>
      <label class="check" style="padding-top:0"><input type="checkbox" data-bind="shop.basics" ${sp.basics ? 'checked' : ''}> I have the basics (oil, salt, spices, sauces)</label>
      <div class="two"><div class="field"><label for="shD">Shopping day reminder</label><select id="shD" data-bind="shop.day">${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d, i) => `<option value="${i}" ${+sp.day === i ? 'selected' : ''}>${d}</option>`).join('')}</select></div>
        <div class="field"><label for="shH">At</label><select id="shH" data-bind="shop.hour">${[7, 8, 9, 10, 11, 12, 14, 16, 17, 18, 19].map(h => `<option value="${h}" ${+sp.hour === h ? 'selected' : ''}>${COACH.hr12(h)}</option>`).join('')}</select></div></div>
      <button class="btn brand" style="width:100%" data-a="shop-plan">${I('spark', 15)} ${p ? 'Re-plan my groceries' : 'Plan my groceries'}</button>
      ${!CLOUD.config.SHOP_API ? '<p class="note">Instacart isn\'t connected in config.js yet. You can still plan, and the list copies to paste anywhere.</p>' : ''}</section>`;
    if (!p) return form + `<section class="card s7 emptystate"><div class="ic">${I('cart', 26)}</div><h3>Your budget plan shows up here</h3><p>Meals for each day, the grocery list with estimated prices, and a button to fill your Instacart cart. Prices are estimates; your store's real total shows at checkout, so WAYOF keeps a cushion.</p></section>`;

    const pct = Math.min(100, p.total / p.budget * 100), color = p.over ? 'var(--bad, #e5484d)' : p.underTarget ? 'var(--good)' : 'var(--warn, #f5a524)';
    const goalsDay = { kcal: S.profile.kcal, protein: S.profile.protein }, share = SHOP_SLOTS[sp.meals].reduce((a, s) => a + ({ breakfast: .25, lunch: .3, dinner: .35 })[s], 0);
    const byDay = []; p.meals.forEach((m, i) => { (byDay[m.d] ||= { day: m.day, rows: [] }).rows.push({ ...m, i }); });
    const toBuy = p.items.filter(i => !i.have), have = p.items.filter(i => i.have);
    const aisles = {}; toBuy.forEach(i => (aisles[i.aisle] ||= []).push(i));
    const AISLE = { produce: 'Produce', protein: 'Meat & seafood', dairy: 'Dairy & eggs', bakery: 'Bread & bakery', pantry: 'Pantry', frozen: 'Frozen' };
    const outSave = p.eatingOut ? p.eatingOut - p.total * (p.outMeals / Math.max(1, p.meals.filter(m => m.id).length)) : 0;
    const result = `<section class="card s7">
        <div class="row between"><span class="label">${p.days}-day plan · ${p.household} ${p.household === 1 ? 'person' : 'people'}${p.store ? ' · ' + esc(p.store) : ''}</span><span class="pill">${p.over ? 'Over budget' : p.underTarget ? 'On budget' : 'Close to budget'}</span></div>
        <div class="row" style="align-items:baseline;gap:8px;margin:6px 0"><span class="big num">${money(p.total)}</span><span class="muted">estimated of ${money(p.budget)}</span></div>
        <div class="bar"><div style="width:${pct}%;background:${color}"></div></div>
        <p class="muted small" style="margin:8px 0 0">${p.over ? `The cheapest plan from your recipes is ${money(p.total - p.budget)} over. Try fewer days or meals, or the swaps below.` : `Kept under ${money(p.target)}, so ${money(p.budget - p.target)} of your budget stays free for real store prices.`}${p.factor !== 1 ? ` Prices adjusted ${p.factor > 1 ? '+' : ''}${Math.round((p.factor - 1) * 100)}% from your receipts.` : ''}</p>
        <div class="three" style="margin-top:12px">
          <div class="kpi"><span class="label">Per day</span><b class="num">${fmt(p.perDay.kcal)}</b><small class="muted">of ~${fmt(Math.round(goalsDay.kcal * share))} kcal</small></div>
          <div class="kpi"><span class="label">Protein</span><b class="num">${p.perDay.protein} g</b><small class="muted">of ~${Math.round(goalsDay.protein * share)} g</small></div>
          <div class="kpi"><span class="label">${outSave > 0 ? 'Saved' : 'Per meal'}</span><b class="num">${outSave > 0 ? money(outSave) : money(p.total / Math.max(1, p.meals.filter(m => m.id).length * p.household))}</b><small class="muted">${outSave > 0 ? 'vs eating out' : 'per serving'}</small></div></div>
        <div class="row" style="margin-top:14px;flex-wrap:wrap"><button class="btn brand" data-a="shop-ic">${I('cart', 15)} Shop on Instacart</button><button class="btn soft sm" data-a="shop-copy">${I('copy', 13)} Copy list</button><button class="btn ghost sm" data-a="shop-receipt">${I('receipt', 13)} Log receipt</button></div>
      </section>
      <section class="card s7"><div class="ch"><h2>Meals</h2><span class="muted small">Tap ↻ to swap</span></div><div class="stack" style="gap:12px">${byDay.filter(Boolean).map(d => `<div><span class="label">${d.day}</span><div class="stack" style="gap:6px;margin-top:6px">${d.rows.map(r => { const m = r.id && findRecipe(r.id); return m ? `<div class="exrow"><button class="ico thumb" data-a="recipe" data-id="${esc(m.id)}" aria-label="Open ${esc(m.name)}" style="border:0;padding:0">${foodArt(m.art, m.id, m.name)}</button><button data-a="recipe" data-id="${esc(m.id)}" style="all:unset;cursor:pointer;flex:1;min-width:0"><strong>${esc(m.name)}</strong><small>${r.slot[0].toUpperCase() + r.slot.slice(1)} · ${m.kcal} kcal · ${m.p} g protein</small></button><button class="iconbtn" data-a="shop-swap" data-i="${r.i}" aria-label="Swap ${esc(m.name)}">${I('refresh', 16)}</button></div>` : `<div class="exrow"><small>${r.slot}: no recipe fits</small></div>`; }).join('')}</div></div>`).join('')}</div></section>
      <section class="card s5"><div class="ch"><h2>Grocery list</h2><span class="pill">${toBuy.length} items</span></div>
        ${Object.entries(aisles).map(([a, list]) => `<span class="label" style="display:block;margin:12px 0 4px">${AISLE[a] || a}</span>${list.map(i => `<div class="row between" style="padding:7px 0;border-top:1px solid var(--line);gap:8px">
          <label class="check" style="padding:0;flex:1;min-width:0;${sp.checked[i.key] ? 'opacity:.5;text-decoration:line-through' : ''}"><input type="checkbox" data-a="shop-check" data-k="${esc(i.key)}" ${sp.checked[i.key] ? 'checked' : ''}><span>${esc(i.name)}<br><small class="muted">${i.pkg ? (i.pkgs > 1 ? i.pkgs + ' × ' : '') + esc(i.pkg) : esc(i.qtys.join(', '))}${i.left && i.left >= 2 ? ` · ${i.left} servings left over` : ''}</small></span></label>
          <button class="btn ghost sm" data-a="shop-price" data-k="${esc(i.key)}" title="Set my price">${money(i.cost)}</button></div>`).join('')}`).join('')}
        ${have.length ? `<span class="label" style="display:block;margin:14px 0 4px">Already have</span><p class="small muted" style="margin:0">${have.map(i => esc(i.name) + (i.basic ? '' : ' (fridge)')).join(', ')}</p>` : ''}
        ${p.pantryCheck.length ? `<p class="note">Check your pantry for: ${p.pantryCheck.map(esc).join(', ')}.</p>` : ''}</section>
      ${p.swaps.length ? `<section class="card s5"><div class="ch"><h2>${p.over ? 'Get under budget' : 'Save even more'}</h2>${I('tag', 18)}</div><div class="stack" style="gap:8px">${p.swaps.map(s => `<div class="exrow"><div style="flex:1"><strong>${esc(s.note)}</strong></div><span class="rx">−${money(s.save)}</span></div>`).join('')}</div>
        <p class="note">Prices are estimates for a typical US store and get closer each time you log a receipt or set your own price. The real total shows at checkout.</p></section>` : ''}`;
    return form + result;
  }

  /* ---------- Together: partners & groups ---------- */
  function vTogether() {
    const intro = (cta) => `<div class="grid"><section class="card s12 together-hero"><div><span class="label">Better together</span><h2 style="margin:4px 0 6px">Train with a partner, a family, or a crew</h2>
      <p class="muted" style="margin:0">Create a partner pair or a group, share a code, and see each other's steps, workouts and water. Run weekly challenges, cheer each other on, and post check-ins. You choose exactly what each group sees — weight and meals are never shared.</p></div>${cta}</section>
      <section class="card s4"><div class="ic tile-ic">${I('users')}</div><h3>Partner mode</h3><p class="muted small">Two people, one shared goal. Great for couples, roommates or a workout buddy.</p></section>
      <section class="card s4"><div class="ic tile-ic">${I('trophy')}</div><h3>Group challenges</h3><p class="muted small">Weekly leaderboards for steps, workouts or hydration — family, office or team.</p></section>
      <section class="card s4"><div class="ic tile-ic">${I('hand')}</div><h3>Cheers & check-ins</h3><p class="muted small">Post a quick check-in or send a cheer when someone finishes a workout.</p></section></div>`;
    if (!CLOUD.enabled) return intro(`<p class="note" style="margin-top:14px">Groups need your WAYOF backend. Add your Supabase keys to <code>config.js</code> (see README), then sign in under Profile.</p>`);
    if (!signedIn()) return intro(`<div class="row" style="margin-top:14px"><button class="btn brand" data-a="auth">${I('user', 15)} Sign in to start</button></div>`);
    if (cc.groups == null) loadOnce('groups', CLOUD.groups.mine);
    const groups = Array.isArray(cc.groups) ? cc.groups : [];
    if (!ui.group && groups.length) ui.group = groups[0].id;
    const g = groups.find(x => x.id === ui.group);
    if (g && (!cc.board || cc.board.gid !== g.id)) loadBoard(g.id);
    const board = cc.board && cc.board.gid === (g && g.id) ? cc.board : null, metric = ui.groupMetric;
    const rows = board && Array.isArray(board.rows) ? board.rows.slice().sort((a, b) => (b[metric] || 0) - (a[metric] || 0)) : [];
    const max = Math.max(1, ...rows.map(r => r[metric] || 0));
    const unit = { steps: 'steps', workouts: 'workouts', water: 'glasses', active_min: 'active min' }[metric];
    return `<div class="grid">
      <section class="card s4"><h2>Your groups</h2>
        ${groups.length ? `<div class="stack" style="gap:8px">${groups.map(x => `<button class="grouprow ${x.id === ui.group ? 'on' : ''}" data-a="grp" data-id="${x.id}"><span class="ic">${I(x.kind === 'partner' ? 'users' : 'trophy', 16)}</span><span style="text-align:left;min-width:0"><b>${esc(x.name)}</b><small>${x.kind === 'partner' ? 'Partner' : 'Group'} · ${x.members} member${x.members === 1 ? '' : 's'}</small></span></button>`).join('')}</div>` : `<p class="muted small">You're not in a group yet.</p>`}
        <hr class="hr"><h3>Create</h3><div class="field" style="margin-top:6px"><input id="gName" maxlength="40" placeholder="e.g. Martin & Kayla, Office steps"></div>
        <div class="row"><button class="btn brand sm" data-a="grp-create" data-k="partner">${I('users', 14)} Partner</button><button class="btn soft sm" data-a="grp-create" data-k="group">${I('trophy', 14)} Group</button></div>
        <h3 style="margin-top:16px">Join with a code</h3><div class="row"><input id="gCode" maxlength="8" placeholder="ABC123" style="flex:1;text-transform:uppercase"><button class="btn ghost sm" data-a="grp-join">Join</button></div>
        ${cc.groups && cc.groups.error ? `<p class="note" style="color:var(--bad)">${esc(cc.groups.error)}</p>` : ''}</section>
      ${g ? `<section class="card s8"><div class="ch"><div><span class="label">${g.kind === 'partner' ? 'Partner' : 'Group'} · this week</span><h2 style="margin:2px 0 0">${esc(g.name)}</h2></div><button class="btn soft sm" data-a="grp-invite" data-c="${esc(g.invite_code)}" data-n="${esc(g.name)}">${I('share', 14)} Invite · ${esc(g.invite_code)}</button></div>
        <div class="seg" style="margin-bottom:14px">${[['steps', 'Steps'], ['workouts', 'Workouts'], ['water', 'Water'], ['active_min', 'Active min']].map(m => `<button class="${metric === m[0] ? 'on' : ''}" data-a="gmetric" data-m="${m[0]}">${m[1]}</button>`).join('')}</div>
        ${board ? (rows.length ? `<div class="board">${rows.map((r, i) => `<div class="brow ${r.is_me ? 'me' : ''}"><span class="rank">${i + 1}</span><span class="who"><span class="avatar xs">${esc((r.display_name || '?').slice(0, 1).toUpperCase())}</span>${esc(r.display_name || 'Member')}${r.is_me ? ' (you)' : ''}</span><div class="bar"><div style="width:${(r[metric] || 0) / max * 100}%;background:var(--brand)"></div></div><b class="num">${r[metric] == null ? '<span class="muted small">hidden</span>' : fmt(r[metric])}</b>${!r.is_me ? `<button class="iconbtn cheer" data-a="cheer" data-n="${esc(r.display_name || 'Member')}" aria-label="Cheer ${esc(r.display_name || '')}">${I('hand', 15)}</button>` : ''}</div>`).join('')}</div><p class="note">${unit}, Monday to today. Members choose what they share.</p>` : '<p class="muted">No activity yet this week.</p>') : `<p class="muted">Loading…</p>`}
      </section>
      <section class="card s7"><div class="ch"><h2>Check-ins</h2></div>
        <form class="row" data-form="checkin" style="gap:8px"><input id="ciText" maxlength="280" placeholder="How did today go?" style="flex:1"><button class="btn brand" type="submit">${I('send', 15)}</button></form>
        <div class="stack" style="gap:8px;margin-top:12px">${cc.feed && cc.feed.gid === g.id ? (cc.feed.items.length ? cc.feed.items.map(f => `<div class="feedpost"><span class="avatar xs">${esc((f.display_name || '?').slice(0, 1).toUpperCase())}</span><div><b>${esc(f.display_name || 'Member')}</b> <span class="muted tiny">${timeAgo(new Date(f.created_at).getTime())}</span><p style="margin:2px 0 0">${f.kind === 'cheer' ? I('hand', 13) + ' ' : f.kind === 'workout' ? I('dumbbell', 13) + ' ' : ''}${esc(f.text)}</p></div></div>`).join('') : '<p class="muted small">No posts yet — say hi!</p>') : '<p class="muted small">Loading…</p>'}</div></section>
      <section class="card s5"><h2>What I share here</h2>${['steps', 'workouts', 'water', 'active_min'].map(k => `<label class="check"><input type="checkbox" data-a="gshare" data-k="${k}" ${!(g.share && g.share[k] === false) ? 'checked' : ''}> ${{ steps: 'Steps', workouts: 'Completed workouts', water: 'Water', active_min: 'Active minutes' }[k]}</label>`).join('')}
        <label class="check"><input type="checkbox" data-a="gshare" data-k="post_workouts" ${g.share && g.share.post_workouts ? 'checked' : ''}> Auto-post when I finish a workout</label>
        <p class="note">Weight, meals, sleep and chats are never shared with groups.</p><button class="btn ghost sm" style="color:var(--bad);margin-top:6px" data-a="grp-leave" data-id="${g.id}">Leave ${g.kind === 'partner' ? 'partnership' : 'group'}</button></section>` : `<section class="card s8 emptystate"><div class="ic">${I('users', 26)}</div><p>Create a partner pair or group, or join one with a code.</p></section>`}
    </div>`;
  }
  async function loadBoard(gid) {
    if (cc.loading.board) return; cc.loading.board = true;
    try {
      const since = dkey(weekStart(new Date()));
      const [rows, feed] = await Promise.all([CLOUD.groups.board(gid, since), CLOUD.groups.feed(gid)]);
      cc.board = { gid, rows: rows || [] }; cc.feed = { gid, items: feed || [] };
    } catch (e) { cc.board = { gid, rows: [], error: e.message }; toast(e.message); }
    cc.loading.board = false; if (ui.view === 'together') render();
  }
  function vProgress() {
    const n = ui.range, end = parseKey(TODAY()), p = S.profile;
    const keys = Array.from({ length: n }, (_, i) => dkey(addDays(end, i - n + 1)));
    const lab = k => { const d = parseKey(k); return n <= 7 ? DAYS[dow(d)] : `${d.getMonth() + 1}/${d.getDate()}`; };
    const any = keys.some(hasData);
    const tabs = `<div class="row between" style="margin-bottom:18px"><div class="seg">${[['activity', 'Activity'], ['body', 'Body'], ['nutrition', 'Nutrition'], ['photos', 'Photos']].map(t => `<button class="${ui.progTab === t[0] ? 'on' : ''}" data-a="ptab" data-t="${t[0]}">${t[1]}</button>`).join('')}</div>
      <div class="seg">${[7, 14, 30].map(r => `<button class="${n === r ? 'on' : ''}" data-a="prange" data-n="${r}">${r}D</button>`).join('')}</div></div>`;
    if (ui.progTab === 'photos') return tabs + vPhotos();
    if (!any) return tabs + `<div class="card emptystate"><div class="ic">${I('chart', 26)}</div><h2>Your trends appear here</h2><p>Log steps, water, meals, sleep or weight on the Today screen and the charts fill in.</p><div class="row" style="justify-content:center"><button class="btn brand" data-a="go" data-v="today">Start logging</button><button class="btn ghost" data-a="sample">Preview with sample data</button></div></div>`;
    const L = keys.map(getLog), avg = a => { const v = a.filter(x => x != null && x !== 0); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : 0; };
    if (ui.progTab === 'body') {
      const ws = L.map(l => l.weight), have = ws.filter(w => w != null);
      const first = have[0], last = have[have.length - 1];
      return tabs + `<div class="grid"><section class="card s7"><div class="ch"><h2>Weight</h2><span class="pill">${wUnit()}</span></div>
        <div class="kpis" style="margin-bottom:16px"><div class="kpi"><span>Latest</span><b class="num">${last != null ? fmt(last, 1) : '—'}</b></div><div class="kpi"><span>Change</span><b class="num">${have.length > 1 ? (last - first > 0 ? '+' : '') + fmt(last - first, 1) : '—'}</b></div><div class="kpi"><span>Lowest</span><b class="num">${have.length ? fmt(Math.min(...have), 1) : '—'}</b></div></div>
        ${chartSlot({ type: 'line', goal: S.body.goalWeight, goalLabel: S.body.goalWeight != null ? `Goal ${fmt(S.body.goalWeight, 1)}` : '', data: keys.map((k, i) => ({ label: lab(k), value: ws[i], tip: `${parseKey(k).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}|${ws[i] != null ? fmt(ws[i], 1) + ' ' + wUnit() : 'No weigh-in'}` })), color: 'var(--brand)', h: 230, label: 'Weight trend' })}</section>
        <section class="card s5"><div class="ch"><h2>Sleep</h2><span class="pill">avg ${fmt(avg(L.map(l => l.sleep)), 1)} h</span></div>
        ${chartSlot({ data: keys.map((k, i) => ({ label: lab(k), value: L[i].sleep || 0, tip: `${parseKey(k).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}|${L[i].sleep != null ? fmt(L[i].sleep, 1) + ' h' : 'Not logged'}` })), goal: p.sleep, goalLabel: `Goal ${p.sleep}h`, color: 'var(--sleep)', h: 280, label: 'Sleep hours' })}</section>
        ${(() => { const cur = latestWeight(), b = bmiOf(cur), gp = goalProgress(); if (!b && !gp) return `<section class="card s12"><div class="row between"><div><h2 style="margin:0">Add your stats & goal</h2><p class="muted small" style="margin:4px 0 0">Height, goal weight and focus areas unlock BMI tracking, goal progress and calorie estimates.</p></div><button class="btn brand sm" data-a="body-edit">Set up</button></div></section>`;
          return `<section class="card s12"><div class="ch"><h2>Goal & BMI</h2><button class="btn soft sm" data-a="body-edit">Edit</button></div><div class="grid" style="gap:14px"><div class="s6">${gp ? `<div class="kpis"><div class="kpi"><span>Start</span><b class="num">${fmt(gp.start, 1)}</b></div><div class="kpi"><span>Now</span><b class="num">${fmt(gp.cur, 1)}</b></div><div class="kpi"><span>Goal</span><b class="num">${fmt(gp.goal, 1)}</b></div></div><div class="bar" style="margin-top:12px"><div style="width:${gp.pct * 100}%;background:var(--fat)"></div></div><p class="small" style="margin:6px 0 0"><b>${Math.round(gp.pct * 100)}%</b> of the way${S.body.targetDate ? ` · target ${parseKey(S.body.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : ''}</p>` : '<p class="muted small">Set a goal weight to track progress.</p>'}</div><div class="s6">${b ? bmiScale(b, bmiOf(S.body.goalWeight)) : '<p class="muted small">Add your height to see BMI.</p>'}</div></div></section>`; })()}
      </div>`;
    }
    if (ui.progTab === 'nutrition') {
      const kc = keys.map(k => totals(k)), logged = kc.filter(t => t.kcal > 0);
      const onT = logged.filter(t => Math.abs(t.kcal - p.kcal) <= p.kcal * 0.1).length;
      const am = key => logged.length ? logged.reduce((s, t) => s + t[key], 0) / logged.length : 0;
      return tabs + `<div class="grid"><section class="card s7"><div class="ch"><h2>Calories</h2><span class="pill">${onT} of ${logged.length} logged days within ±10%</span></div>
        <div class="kpis" style="margin-bottom:16px"><div class="kpi"><span>Daily average</span><b class="num">${fmt(am('kcal'))}</b></div><div class="kpi"><span>Goal</span><b class="num">${fmt(p.kcal)}</b></div><div class="kpi"><span>Days logged</span><b class="num">${logged.length}</b></div></div>
        ${chartSlot({ data: keys.map((k, i) => ({ label: lab(k), value: kc[i].kcal, tip: `${parseKey(k).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}|${fmt(kc[i].kcal)} kcal` })), goal: p.kcal, goalLabel: `Goal ${fmt(p.kcal)}`, color: 'var(--carbs)', h: 220, label: 'Calories per day' })}</section>
        <section class="card s5"><h2>Average macros</h2><p class="muted small" style="margin-top:-6px">Per logged day vs your targets</p><div class="macros" style="margin:14px 0 20px">${[['Protein', am('p'), p.protein, 'var(--protein)'], ['Carbs', am('c'), p.carbs, 'var(--carbs)'], ['Fat', am('f'), p.fat, 'var(--fat)']].map(m => `<div class="macro"><div class="row"><span><span class="mdot" style="background:${m[3]}"></span>${m[0]}</span><span class="num"><b>${fmt(m[1])}</b> / ${m[2]} g</span></div><div class="bar"><div style="width:${clamp(m[1] / m[2] * 100, 0, 100)}%;background:${m[3]}"></div></div></div>`).join('')}</div>
        <h3>Water</h3>${chartSlot({ data: keys.map((k, i) => ({ label: lab(k), value: L[i].water, tip: `${parseKey(k).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}|${L[i].water} glasses` })), goal: p.water, goalLabel: `Goal ${p.water}`, color: 'var(--water)', h: 160, label: 'Water glasses' })}</section></div>`;
    }
    const steps = L.map(l => l.steps), wk = L.reduce((s, l) => s + l.workouts.length, 0), mins = L.reduce((s, l) => s + l.workouts.reduce((a, w) => a + (w.minutes || 0), 0), 0);
    const best = Math.max(...steps);
    const recent = keys.slice().reverse().flatMap(k => getLog(k).workouts.map(w => ({ ...w, k }))).slice(0, 6);
    return tabs + `<div class="grid"><section class="card s8"><div class="ch"><h2>Steps</h2><span class="pill dark">${fmt(avg(steps))} avg / day</span></div>
      <div class="kpis" style="margin-bottom:16px"><div class="kpi"><span>Best day</span><b class="num">${fmt(best)}</b></div><div class="kpi"><span>Days at goal</span><b class="num">${steps.filter(s => s >= p.steps).length}/${n}</b></div><div class="kpi"><span>Total</span><b class="num">${short(steps.reduce((a, b) => a + b, 0))}</b></div></div>
      ${chartSlot({ data: keys.map((k, i) => ({ label: lab(k), value: steps[i], bold: k === TODAY(), tip: `${parseKey(k).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}|${fmt(steps[i])} steps` })), goal: p.steps, goalLabel: `Goal ${short(p.steps)}`, color: 'var(--brand)', h: 240, label: 'Steps per day' })}</section>
      <section class="card s4"><h2>Workouts</h2><div class="kpis" style="grid-template-columns:1fr 1fr;margin-bottom:14px"><div class="kpi"><span>Completed</span><b class="num">${wk}</b></div><div class="kpi"><span>Active min</span><b class="num">${fmt(mins)}</b></div></div>
        <div class="stack">${recent.length ? recent.map(w => `<div class="exrow"><div class="ico">${I('check', 18)}</div><div><strong>${esc(w.title)}</strong><small>${parseKey(w.k).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} · ${w.minutes} min</small></div></div>`).join('') : '<p class="muted small">Complete a session from your plan to see it here.</p>'}</div></section></div>`;
  }


  /* ---------- progress photos (device-only IndexedDB, optional cloud backup) ---------- */
  let photoCache = null, photoURLs = {}, cmpSel = [];
  async function loadPhotos() { try { photoCache = await VISION.photos.list(); } catch (e) { photoCache = []; } Object.values(photoURLs).forEach(u => URL.revokeObjectURL(u)); photoURLs = {}; photoCache.forEach(p => (photoURLs[p.id] = URL.createObjectURL(p.blob))); if (ui.view === 'progress') render(); }
  function vPhotos() {
    if (photoCache == null) { loadPhotos(); return `<div class="card emptystate"><p>Loading photos…</p></div>`; }
    const byDay = {}; photoCache.forEach(p => (byDay[p.day] = byDay[p.day] || []).push(p));
    return `<div class="grid"><section class="card s12 photohero"><div><h2 style="margin:0 0 4px">Progress photos</h2><p class="muted small" style="margin:0">Same spot, same light, same pose each time. Photos stay private on this device${signedIn() ? ' — back up to your account if you like' : ''}.</p></div>
        <div class="row"><button class="btn brand" data-a="photo-cam">${I('camera', 16)} Take photo</button><label class="btn soft" style="cursor:pointer">${I('download', 15)} Upload<input type="file" accept="image/*" id="photoFile" hidden></label>${signedIn() ? `<label class="check small" style="padding:0 6px"><input type="checkbox" data-bind="share.photoBackup" ${S.share.photoBackup ? 'checked' : ''}> Back up to my account</label>` : ''}${photoCache.length >= 2 ? `<button class="btn ghost" data-a="photo-compare">${I('copy', 15)} Compare${cmpSel.length ? ` (${cmpSel.length}/2)` : ''}</button>` : ''}</div></section>
      ${photoCache.length ? Object.keys(byDay).sort().reverse().map(d => `<section class="s12"><div class="section-title" style="margin:6px 0 10px"><h3 style="margin:0">${parseKey(d).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</h3>${getLog(d).weight != null ? `<span class="pill">${fmt(getLog(d).weight, 1)} ${wUnit()}</span>` : ''}</div>
        <div class="photogrid">${byDay[d].map(p => `<div class="ph ${cmpSel.includes(p.id) ? 'sel' : ''}"><button data-a="photo-pick" data-id="${p.id}" aria-label="Select photo for comparison"><img src="${photoURLs[p.id]}" alt="${esc(p.pose)} progress photo" loading="lazy"></button><span class="pill dark">${esc(p.pose)}</span><button class="x" data-a="photo-del" data-id="${p.id}" aria-label="Delete photo">${I('x', 14)}</button></div>`).join('')}</div></section>`).join('')
        : `<section class="card s12 emptystate"><div class="ic">${I('camera', 26)}</div><p>Take a front, side and back photo every 2–4 weeks. The scale doesn't show everything — photos do.</p></section>`}</div>`;
  }
  let camStream = null;
  async function photoCamSheet(pose = 'front', facing = 'user', timer = 3) {
    if (camStream) { VISION.stopStream(camStream); camStream = null; }
    openSheet(`<div class="sh"><h2>Progress photo</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div>
      <div class="seg" style="margin-bottom:10px">${['front', 'side', 'back'].map(p => `<button class="${pose === p ? 'on' : ''}" data-a="ppose" data-p="${p}">${p[0].toUpperCase() + p.slice(1)}</button>`).join('')}</div>
      <div class="photocam ${facing === 'user' ? 'mirror' : ''}"><video id="pcV" playsinline muted></video><svg class="guide" viewBox="0 0 100 160" aria-hidden="true"><path d="${pose === 'side' ? 'M50 14a9 9 0 1 1 0 18a9 9 0 1 1 0-18M44 34h12l3 30-2 36 3 44h-8l-4-40-4 40h-8l3-44-2-36z' : 'M50 14a9 9 0 1 1 0 18a9 9 0 1 1 0-18M36 34h28l8 34-6 2-6-24v32l4 70h-9l-5-58-5 58h-9l4-70V46l-6 24-6-2z'}" fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="3 3" opacity=".85"/></svg><div class="count" id="pcCount"></div></div>
      <div class="row between" style="margin-top:12px"><div class="seg">${[0, 3, 10].map(t => `<button class="${timer === t ? 'on' : ''}" data-a="ptimer" data-t="${t}">${t ? t + 's' : 'Now'}</button>`).join('')}</div><button class="iconbtn" data-a="pflip" aria-label="Switch camera">${I('refresh', 18)}</button></div>
      <button class="btn brand block" style="margin-top:12px" data-a="psnap">${I('camera', 16)} Capture</button>
      <p class="note">Tip: stand 6–8 ft from the camera in even light. Photos are saved on this device only.</p>`, { pose, facing, timer }, 'camsheet');
    sheetCleanup = () => { if (camStream) { VISION.stopStream(camStream); camStream = null; } };
    try { camStream = await VISION.openCamera($('#pcV'), facing); } catch (e) { toast(e.name === 'NotAllowedError' ? 'Camera permission was denied — use Upload instead' : (e.message || 'Camera unavailable')); }
  }
  async function snapPhoto() {
    const v = $('#pcV'); if (!v || !v.videoWidth) return toast('Camera not ready');
    const t = sheetCtx.timer || 0, cnt = $('#pcCount');
    for (let i = t; i > 0; i--) { if (cnt) cnt.textContent = i; if (S.voice.countReps) speak(String(i), { quiet: true }); await new Promise(r => setTimeout(r, 1000)); if (!$('#pcV')) return; }
    if (cnt) cnt.textContent = '';
    const c = document.createElement('canvas'), k = Math.min(1, 1280 / Math.max(v.videoWidth, v.videoHeight)); c.width = v.videoWidth * k; c.height = v.videoHeight * k;
    const x = c.getContext('2d'); if (sheetCtx.facing === 'user') { x.translate(c.width, 0); x.scale(-1, 1); } x.drawImage(v, 0, 0, c.width, c.height);
    const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.85));
    await savePhoto(blob, sheetCtx.pose);
    const next = { front: 'side', side: 'back', back: null }[sheetCtx.pose];
    if (next) { toast(`Saved. Now the ${next} view`); photoCamSheet(next, sheetCtx.facing, sheetCtx.timer); } else { toast('Photos saved'); closeSheet(); go('progress'); }
  }
  async function savePhoto(blob, pose) {
    const rec = { id: uid() + Date.now().toString(36), day: TODAY(), ts: Date.now(), pose: pose || 'front', blob };
    await VISION.photos.add(rec); photoCache = null;
    if (signedIn() && S.share.photoBackup) CLOUD.uploadPhoto(rec).catch(e => toast('Backup failed: ' + e.message));
    if (ui.view === 'progress') loadPhotos();
  }
  function compareSheet() {
    const [a, b] = cmpSel.map(id => photoCache.find(p => p.id === id)).sort((x, y) => x.ts - y.ts);
    openSheet(`<div class="sh"><h2>Before & after</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div>
      <div class="compare" id="cmp"><img src="${photoURLs[a.id]}" alt="Earlier photo"><div class="after" id="cmpAfter"><img src="${photoURLs[b.id]}" alt="Later photo"></div><div class="handle" id="cmpH"></div></div>
      <input type="range" min="0" max="100" value="50" id="cmpR" aria-label="Comparison slider" style="margin-top:10px">
      <div class="row between small muted"><span>${parseKey(a.day).toLocaleDateString()}${getLog(a.day).weight != null ? ' · ' + fmt(getLog(a.day).weight, 1) + ' ' + wUnit() : ''}</span><span>${parseKey(b.day).toLocaleDateString()}${getLog(b.day).weight != null ? ' · ' + fmt(getLog(b.day).weight, 1) + ' ' + wUnit() : ''}</span></div>`, {}, 'tall');
    const upd = v => { $('#cmpAfter').style.clipPath = `inset(0 0 0 ${v}%)`; $('#cmpH').style.left = v + '%'; };
    upd(50); $('#cmpR').addEventListener('input', e => upd(e.target.value));
  }

  /* ---------- Atmosphere: weather-smart workout tracker ---------- */
  const feelsF = v => v == null ? null : (S.wx && S.wx.units === 'metric' ? v * 9 / 5 + 32 : v);
  const windMph = v => S.wx && S.wx.units === 'metric' ? v / 1.609 : v;
  const rainIn = v => S.wx && S.wx.units === 'metric' ? v / 25.4 : v;
  const STORM = [95, 96, 99];
  function wxScore(h) {
    if (STORM.includes(h.code)) return 0;
    let s = 100; const f = feelsF(h.feels);
    if (f > 80) s -= (f - 80) * 2.2; if (f > 95) s -= (f - 95) * 3; if (f < 45) s -= (45 - f) * 2;
    s -= (h.pp || 0) * 0.5; if (rainIn(h.pr || 0) > 0.01) s -= 35;
    const w = windMph(h.wind || 0); if (w > 15) s -= (w - 15) * 2;
    if (h.day && h.uv >= 8) s -= 15; else if (h.day && h.uv >= 6) s -= 7;
    if (h.aqi > 150) s -= 50; else if (h.aqi > 100) s -= 25; else if (h.aqi > 50) s -= 5;
    if (!h.day) s -= 12;
    return Math.round(clamp(s, 0, 100));
  }
  const scoreLabel = s => s >= 75 ? ['Great', 'good', 'check'] : s >= 55 ? ['Good', 'good', 'check'] : s >= 35 ? ['Caution', 'warn', 'shield'] : ['Go indoor', 'bad', 'home'];
  function wxReasons(h) {
    const r = [], f = feelsF(h.feels), deg = S.wx.units === 'metric' ? '°C' : '°F';
    if (STORM.includes(h.code)) r.push('Thunderstorms');
    if (f >= 88) r.push(`Feels ${Math.round(h.feels)}${deg}`); if (f < 45) r.push(`Feels ${Math.round(h.feels)}${deg}`);
    if ((h.pp || 0) >= 40) r.push(`${h.pp}% rain chance`); if (rainIn(h.pr || 0) > 0.01) r.push('Raining');
    if (windMph(h.wind || 0) > 15) r.push(`Wind ${Math.round(h.wind)} ${S.wx.units === 'metric' ? 'km/h' : 'mph'}`);
    if (h.day && h.uv >= 6) r.push(`UV ${Math.round(h.uv)}`); if (h.aqi > 50) r.push(`AQI ${Math.round(h.aqi)}`); if (!h.day) r.push('Dark out');
    return r;
  }
  const hourLbl = t => new Date(t).toLocaleTimeString([], { hour: 'numeric' }).replace(' ', '').toLowerCase();
  function bestWindow() {
    if (!S.wx || !S.wx.hours) return null;
    const now = Date.now(), today = TODAY();
    let pool = S.wx.hours.filter(h => h.t >= now - 3600e3 && dkey(new Date(h.t)) === today && new Date(h.t).getHours() >= 5 && new Date(h.t).getHours() <= 21);
    let when = 'today';
    if (!pool.length) { const tm = dkey(addDays(new Date(), 1)); pool = S.wx.hours.filter(h => dkey(new Date(h.t)) === tm && new Date(h.t).getHours() >= 5 && new Date(h.t).getHours() <= 21); when = 'tomorrow'; }
    if (!pool.length) return null;
    pool = pool.map(h => ({ ...h, score: wxScore(h) }));
    let best = pool.reduce((a, b) => b.score > a.score ? b : a);
    const hh = COACH.habits(S, 28).stats.workoutHour;
    if (hh != null) { const pref = pool.find(h => Math.abs(new Date(h.t).getHours() - hh) < 1); if (pref && pref.score >= best.score - 8) best = pref; }
    const [lbl] = scoreLabel(best.score);
    const text = best.score < 35 ? `Outdoor conditions are poor ${when} — plan an indoor session.` : `Best outdoor window ${when}: ${hourLbl(best.t)}–${hourLbl(best.t + 3600e3)} · ${lbl} (${best.score})`;
    return { ...best, when, text };
  }
  let wxBusy = false;
  async function fetchWx(lat, lon, label, silent) {
    if (wxBusy) return; wxBusy = true; if (!silent) toast('Checking the atmosphere…');
    const units = imperial() ? '&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch' : '';
    const fu = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,is_day,uv_index&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,precipitation_probability_max,uv_index_max,sunrise,sunset&past_hours=6&forecast_days=7&timezone=auto${units}`;
    const au = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi&hourly=us_aqi&forecast_days=2&timezone=auto`;
    try {
      const [fr, ar] = await Promise.allSettled([fetch(fu).then(r => { if (!r.ok) throw Error('Weather service unavailable'); return r.json(); }), fetch(au).then(r => r.ok ? r.json() : null)]);
      if (fr.status !== 'fulfilled') throw fr.reason;
      const j = fr.value, aq = ar.status === 'fulfilled' ? ar.value : null, H = j.hourly, toMs = s => new Date(s).getTime();
      const aqMap = {}; if (aq && aq.hourly) aq.hourly.time.forEach((t, i) => (aqMap[t] = aq.hourly.us_aqi[i]));
      const nowMs = Date.now();
      const hours = H.time.map((t, i) => ({ t: toMs(t), temp: H.temperature_2m[i], feels: H.apparent_temperature[i], hum: H.relative_humidity_2m[i], pp: H.precipitation_probability[i], pr: H.precipitation[i], code: H.weather_code[i], wind: H.wind_speed_10m[i], uv: H.uv_index[i], day: H.is_day[i], aqi: aqMap[t] }));
      const recentRain = hours.filter(h => h.t <= nowMs && h.t > nowMs - 6 * 3600e3).reduce((a, h) => a + (h.pr || 0), 0);
      const c = j.current, Dd = j.daily;
      S.wx = { at: nowMs, label, lat, lon, units: imperial() ? 'imperial' : 'metric', recentRain,
        cur: { temp: c.temperature_2m, feels: c.apparent_temperature, hum: c.relative_humidity_2m, code: c.weather_code, wind: c.wind_speed_10m, uv: c.uv_index, day: c.is_day, pr: c.precipitation, pp: 0, aqi: aq && aq.current ? aq.current.us_aqi : undefined },
        hours: hours.filter(h => h.t >= nowMs - 3600e3).slice(0, 48),
        daily: Dd.time.map((d, i) => ({ d, code: Dd.weather_code[i], tmax: Dd.temperature_2m_max[i], tmin: Dd.temperature_2m_min[i], fmax: Dd.apparent_temperature_max[i], pp: Dd.precipitation_probability_max[i], uv: Dd.uv_index_max[i], sunrise: Dd.sunrise[i], sunset: Dd.sunset[i] })) };
      S.geo = { lat, lon, label }; save(); render();
    } catch (e) { if (!silent) toast((e && e.message) || 'Could not get weather — don\'t assume it\'s safe outside'); }
    finally { wxBusy = false; }
  }
  function maybeRefreshWx() { if (S.geo && navigator.onLine !== false && (!S.wx || Date.now() - S.wx.at > 45 * 60e3 || (S.wx.units === 'metric') === imperial())) fetchWx(S.geo.lat, S.geo.lon, S.geo.label, true); }
  const wxIcon = code => STORM.includes(code) ? 'umbrella' : code >= 51 ? 'umbrella' : code >= 3 ? 'cloud' : 'sun';
  const wxDesc = code => STORM.includes(code) ? 'Thunderstorms' : code >= 80 ? 'Showers' : code >= 61 ? 'Rain' : code >= 51 ? 'Drizzle' : code >= 45 ? 'Fog' : code >= 3 ? 'Overcast' : code >= 1 ? 'Partly cloudy' : 'Clear';
  function nowAdvice() {
    const c = S.wx.cur, sc = wxScore(c), rain = rainIn(S.wx.recentRain) >= 0.02;
    if (STORM.includes(c.code)) return ['bad', 'Thunderstorms are indicated. Avoid outdoor exercise.'];
    if (rainIn(c.pr || 0) > 0) return ['bad', 'It\'s raining now — choose an indoor session.'];
    if (S.surface === 'wet') return ['bad', 'You reported wet or slippery ground — go indoor today.'];
    if (rain) return ['warn', 'Rain fell in the last six hours. Paths may still be slippery.'];
    if (feelsF(c.feels) >= 100) return ['bad', 'Dangerous heat. Train indoors or before sunrise, and hydrate.'];
    if (feelsF(c.feels) >= 90) return ['warn', 'High heat index. Go early or late, slow your pace, bring water.'];
    if (c.aqi > 100) return ['warn', 'Air quality is unhealthy for sensitive groups. Consider indoor cardio.'];
    if (S.surface !== 'dry') return [sc >= 55 ? 'good' : 'warn', 'Weather looks workable. Ground conditions are unverified — check before you head out.'];
    return ['good', 'Conditions look good and you confirmed dry ground.'];
  }
  function atmosphereIdeas(outdoor) {
    const eq = S.equipment, ins = ['Treadmill', 'Exercise bike', 'Rowing machine', 'Elliptical', 'Stair climber', 'Jump rope'].filter(x => eq.includes(x));
    const inside = ins.length ? ins.map(x => D.exercises.find(e => e.gear === x)).filter(Boolean).map(e => e.name).slice(0, 3) : ['Low-impact cardio circuit', 'Standing mobility flow'];
    const outside = ['Brisk walking intervals', ...(eq.includes('Bicycle') ? ['Outdoor bike ride'] : []), ...(eq.includes('Swimming pool') ? ['Swimming laps'] : [])];
    return outdoor ? outside : inside;
  }
  function wxCard() {
    if (!S.wx) return `<section class="card" aria-label="Atmosphere"><div class="ch"><span class="label">Atmosphere</span><button class="btn soft sm" data-a="go" data-v="atmosphere">Set up</button></div><p class="muted" style="margin:0">Add your location and WAYOF picks the best time to train outside — heat index, rain, UV and air quality included.</p></section>`;
    const c = S.wx.cur, sc = wxScore(c), [lbl, cls, ic] = scoreLabel(sc), bw = bestWindow(), deg = S.wx.units === 'metric' ? 'C' : 'F';
    return `<section class="card" aria-label="Atmosphere"><div class="ch"><span class="label">Atmosphere · ${esc(S.wx.label)}</span><button class="btn soft sm" data-a="go" data-v="atmosphere">Forecast</button></div>
      <div class="wxbig"><div class="t num">${Math.round(c.temp)}°</div><div><span class="status ${cls}">${I(ic, 14)} ${lbl} now · ${sc}</span><div class="muted tiny" style="margin-top:6px">Feels ${Math.round(c.feels)}°${deg} · ${wxDesc(c.code)}${c.aqi != null ? ` · AQI ${Math.round(c.aqi)}` : ''}</div></div></div>
      ${bw ? `<p class="small" style="margin:12px 0 0"><b>${esc(bw.text)}</b></p>` : ''}</section>`;
  }
  function vAtmosphere() {
    const geoRow = `<section class="card s12"><div class="ch"><h2>Your conditions</h2>${S.wx ? `<span class="muted small">Updated ${new Date(S.wx.at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} <button class="iconbtn" style="width:34px;height:34px;display:inline-grid;vertical-align:middle;margin-left:6px" data-a="wx-refresh" aria-label="Refresh">${I('refresh', 16)}</button></span>` : ''}</div>
      <div class="wxform"><div class="field" style="margin:0"><label for="city">City</label><input id="city" value="${esc(S.city)}" placeholder="e.g. Miami" autocomplete="address-level2"></div>
      <div class="field" style="margin:0"><label for="surface">Ground you observe</label><select id="surface" data-bind="surface"><option value="unknown" ${S.surface === 'unknown' ? 'selected' : ''}>Haven't checked</option><option value="wet" ${S.surface === 'wet' ? 'selected' : ''}>Wet or slippery</option><option value="dry" ${S.surface === 'dry' ? 'selected' : ''}>Dry and clear</option></select></div>
      <div class="row" style="align-self:end"><button class="btn brand" data-a="wx-city">${I('search', 16)} Check</button><button class="btn soft" data-a="wx-loc">${I('pin', 16)} My location</button></div></div>
      <p class="note">Live forecast and air quality from Open-Meteo. WAYOF re-checks automatically when you open the app. Location is only requested when you tap “My location”.</p></section>`;
    if (!S.wx) return `<div class="grid">${geoRow}<section class="card s12 emptystate"><div class="ic">${I('cloud', 26)}</div><h2>Weather-smart workouts</h2><p>Every hour gets a workout score from feels-like temperature, rain, wind, UV, air quality and daylight — then WAYOF tells you the best window and lines it up with your plan.</p></section></div>`;
    const c = S.wx.cur, sc = wxScore(c), [lbl, cls, ic] = scoreLabel(sc), [acls, adv] = nowAdvice(), bw = bestWindow(), deg = S.wx.units === 'metric' ? 'C' : 'F';
    const hrs = S.wx.hours.filter(h => h.t >= Date.now() - 3600e3).slice(0, 24).map(h => ({ ...h, score: wxScore(h) }));
    const outdoor = sc >= 55 && acls !== 'bad';
    const days = S.wx.daily.map(d => {
      const dd = parseKey(d.d), ses = S.plan.week.find(s => s.dow === dow(dd)), f = feelsF(d.fmax);
      const rec = STORM.includes(d.code) || d.pp >= 70 ? ['bad', 'Plan indoor'] : f >= 100 ? ['bad', 'Indoor or sunrise only'] : f >= 92 ? ['warn', 'Go early, before 9am'] : d.pp >= 40 ? ['warn', 'Watch for showers'] : d.uv >= 9 ? ['warn', 'Avoid midday sun'] : ['good', 'Outdoor-friendly'];
      return `<div class="wxday"><div class="dname"><b>${dkey(dd) === TODAY() ? 'Today' : DAYS[dow(dd)]}</b><small class="muted">${dd.getDate()}</small></div><div class="dic">${I(wxIcon(d.code), 20)}</div><div class="dtemp num"><b>${Math.round(d.tmax)}°</b> <span class="muted">${Math.round(d.tmin)}°</span></div><div class="dmeta muted small">${d.pp}% rain · UV ${Math.round(d.uv)}</div><div class="dplan small">${ses ? `${I('dumbbell', 13)} ${esc(ses.title)}` : '<span class="muted">Rest day</span>'}</div><span class="status ${rec[0]}">${rec[1]}</span></div>`;
    }).join('');
    return `<div class="grid">${geoRow}
      <section class="card s5 t-s12"><span class="label">Right now · ${esc(S.wx.label)}</span>
        <div class="row" style="margin:12px 0;gap:18px;align-items:center"><div class="stepsring" style="width:104px;height:104px">${ring(sc / 100, 104, 10, `var(--${cls})`)}<span class="num" style="flex-direction:column;display:grid;place-items:center;line-height:1"><b style="font-size:26px">${sc}</b><small class="muted" style="font-size:10px;font-weight:700">SCORE</small></span></div>
          <div><div class="wxbig"><div class="t num" style="font-size:40px">${Math.round(c.temp)}°${deg}</div></div><span class="status ${cls}">${I(ic, 14)} ${lbl}</span><div class="muted small" style="margin-top:6px">Feels ${Math.round(c.feels)}° · ${c.hum}% humidity · ${wxDesc(c.code)}</div></div></div>
        <div class="kpis"><div class="kpi"><span>Wind</span><b class="num">${Math.round(c.wind)}<small class="muted" style="font-size:11px"> ${S.wx.units === 'metric' ? 'km/h' : 'mph'}</small></b></div><div class="kpi"><span>UV index</span><b class="num">${c.day ? Math.round(c.uv) : '—'}</b></div><div class="kpi"><span>Air quality</span><b class="num">${c.aqi != null ? Math.round(c.aqi) : '—'}</b></div></div>
        <p class="advice ${acls}">${I(acls === 'good' ? 'check' : 'shield', 16)} ${esc(adv)}</p></section>
      <section class="card s7"><div class="ch"><h2>Next 24 hours</h2>${bw ? `<span class="pill">${I('star', 14)} Best ${hourLbl(bw.t)}</span>` : ''}</div>
        <div class="hourstrip" role="list">${hrs.map(h => { const [l, cl] = scoreLabel(h.score); const best = bw && h.t === bw.t; return `<div class="hr ${best ? 'best' : ''}" role="listitem" data-tip="${esc(`${new Date(h.t).toLocaleTimeString([], { weekday: 'short', hour: 'numeric' })} · ${l} ${h.score}|${Math.round(h.temp)}° (feels ${Math.round(h.feels)}°)${wxReasons(h).length ? ' · ' + wxReasons(h).join(', ') : ''}`)}"><span class="sc num">${h.score}</span><div class="col"><div class="fill ${cl}" style="height:${Math.max(6, h.score)}%"></div></div><span class="t">${hourLbl(h.t)}</span><span class="tp num">${Math.round(h.temp)}°</span></div>`; }).join('')}</div>
        <div class="legend" style="margin-top:12px"><span><span class="mdot" style="background:var(--good)"></span>Great / Good ≥55</span><span><span class="mdot" style="background:var(--warn)"></span>Caution 35–54</span><span><span class="mdot" style="background:var(--bad)"></span>Go indoor &lt;35</span></div>
        ${bw ? `<p class="small" style="margin:12px 0 0"><b>${esc(bw.text)}.</b> ${wxReasons(bw).length ? 'Watch for: ' + esc(wxReasons(bw).join(', ')) + '.' : ''}</p>` : ''}</section>
      <section class="card s12"><div class="ch"><h2>Workout atmosphere</h2><span class="status ${outdoor ? 'good' : 'warn'}">${I(outdoor ? 'sun' : 'home', 14)} ${outdoor ? 'Outdoor recommended' : 'Indoor recommended'}</span></div>
        <div class="grid" style="gap:10px">${atmosphereIdeas(outdoor).map(n => `<div class="s4">${exRow(n)}</div>`).join('')}</div>
        <p class="note">${outdoor ? 'Bring water and sun protection. ' : 'Your indoor picks come from your equipment list. '}Weather data can lag local conditions.</p></section>
      <section class="card s12"><div class="ch"><h2>7-day outlook vs your plan</h2></div><div class="wxdays">${days}</div></section>
    </div>`;
  }

  /* ---------- Coverage: in-app guide + cost comparer ---------- */
  function vCoverage() {
    const C = D.coverage, tab = ui.covTab;
    const tabs = `<div class="seg" style="margin-bottom:18px">${[['basics', 'Basics'], ['compare', 'Compare costs'], ['dates', 'Key dates'], ['glossary', 'Glossary'], ['official', 'Official sites']].map(t => `<button class="${tab === t[0] ? 'on' : ''}" data-a="covtab" data-t="${t[0]}">${t[1]}</button>`).join('')}</div>`;
    const disclaimer = `<p class="note">WAYOF doesn't sell insurance, check eligibility, or collect insurance details. This guide is general information — confirm details with HealthCare.gov, Medicare.gov, your state, or a licensed agent.</p>`;
    if (tab === 'compare') {
      if (!ui.cov) ui.cov = [{ name: 'Plan A', prem: 350, ded: 6000, oop: 9000, co: 30 }, { name: 'Plan B', prem: 480, ded: 2500, oop: 7000, co: 20 }, { name: 'Plan C', prem: 610, ded: 500, oop: 4500, co: 10 }];
      const scen = [['Low use', 'checkups + a few visits', 800], ['Medium use', 'ongoing care or a minor procedure', 8000], ['High use', 'surgery or hospital stay', 60000]];
      const cost = (p, bill) => { const oop = Math.min(p.oop, bill <= p.ded ? bill : p.ded + (bill - p.ded) * p.co / 100); return p.prem * 12 + oop; };
      const res = scen.map(s => ui.cov.map(p => cost(p, s[2])));
      return tabs + `<div class="grid"><section class="card s12"><h2>Compare plans by total yearly cost</h2><p class="muted small" style="margin-top:-4px">The cheapest premium isn't always the cheapest plan. Enter numbers from plan summaries to see what you'd really pay in a year.</p>
        <div class="covgrid">${ui.cov.map((p, i) => `<div class="covplan"><input class="covname" data-cov="${i}" data-f="name" value="${esc(p.name)}" maxlength="24" aria-label="Plan name">
          ${[['prem', 'Monthly premium', '$'], ['ded', 'Deductible', '$'], ['oop', 'Out-of-pocket max', '$'], ['co', 'Coinsurance', '%']].map(([f, l, u]) => `<label class="covf"><span>${l}</span><span class="inwrap">${u === '$' ? '<i>$</i>' : ''}<input type="number" inputmode="decimal" min="0" data-cov="${i}" data-f="${f}" value="${p[f]}">${u === '%' ? '<i>%</i>' : ''}</span></label>`).join('')}</div>`).join('')}</div></section>
        <section class="card s12"><h2>Estimated yearly cost</h2><div class="tablewrap"><table class="covtable"><thead><tr><th>Scenario</th>${ui.cov.map(p => `<th>${esc(p.name)}</th>`).join('')}</tr></thead><tbody>${scen.map((s, si) => { const min = Math.min(...res[si]); return `<tr><td><b>${s[0]}</b><small>${s[1]} · ~$${fmt(s[2])} in bills</small></td>${res[si].map(v => `<td class="${v === min ? 'best' : ''}">$${fmt(Math.round(v))}${v === min ? `<span class="status good" style="padding:2px 8px;font-size:11px;margin-left:6px">${I('check', 11)} Lowest</span>` : ''}</td>`).join('')}</tr>`; }).join('')}</tbody></table></div>
        <p class="note">Simplified estimate: premiums × 12 + deductible + coinsurance, capped at the out-of-pocket max. Copays, networks and drug costs vary by plan. Premium tax credits lower Marketplace premiums for many people.</p></section></div>`;
    }
    if (tab === 'dates') return tabs + `<div class="grid"><section class="card s12"><h2>Key enrollment dates</h2><div class="stack">${C.dates.map(d => `<div class="daterow"><div class="ic">${I('clock', 18)}</div><div><b>${esc(d.title)}</b><div class="dwhen">${esc(d.when)}</div><p class="muted small" style="margin:2px 0 0">${esc(d.note)}</p></div></div>`).join('')}</div>${disclaimer}</section></div>`;
    if (tab === 'glossary') return tabs + `<div class="grid"><section class="card s12"><h2>Plain-English glossary</h2><div class="gloss">${C.glossary.map(([t, d]) => `<div><b>${esc(t)}</b><p class="muted small" style="margin:2px 0 0">${esc(d)}</p></div>`).join('')}</div></section></div>`;
    if (tab === 'official') return tabs + `<div class="grid"><section class="card s12"><h2>Official sites</h2><p class="muted small">Government sites don't allow being embedded inside other apps, so they open in a window on top of WAYOF — close it to come right back.</p>
      <div class="offgrid">${[['HealthCare.gov', 'https://www.healthcare.gov/', 'Marketplace plans, tax credits, applications'], ['Window shop plans', 'https://www.healthcare.gov/see-plans/', 'Preview 2027 plans and prices without an account'], ['Medicare.gov plan finder', 'https://www.medicare.gov/plan-compare/', 'Compare Medicare Advantage and drug plans'], ['Medicaid & CHIP', 'https://www.medicaid.gov/', 'Find your state\'s Medicaid program'], ['Find local help', 'https://localhelp.healthcare.gov/', 'Free certified assisters and agents near you']].map(([n, u, d]) => `<button class="offcard" data-a="open-ext" data-u="${u}"><span class="ic">${I('shield', 18)}</span><span style="text-align:left"><b>${n}</b><small>${d}</small></span>${I('ext', 16)}</button>`).join('')}</div>${disclaimer}</section></div>`;
    return tabs + `<div class="grid">
      <section class="card s7"><h2>Types of coverage</h2><div class="stack" style="gap:10px">${C.types.map(([t, d]) => `<div class="covtype"><b>${esc(t)}</b><p class="muted small" style="margin:2px 0 0">${esc(d)}</p></div>`).join('')}</div></section>
      <div class="s5 stack"><section class="card brandcard"><span class="label" style="color:rgba(255,255,255,.8)">Open enrollment is on</span><h2 style="margin:4px 0">Marketplace: Nov 1 – Jan 15</h2><p style="margin:0;opacity:.9">Enroll by <b>Dec 15</b> for coverage starting Jan 1. Some states run different dates.</p><button class="btn sm" style="background:#fff;color:#2a2340;margin-top:12px" data-a="covtab" data-t="dates">All key dates</button></section>
        <section class="card"><h2>Metal tiers</h2><div class="stack" style="gap:6px">${C.tiers.map(([t, p, d]) => `<div class="tierrow"><span class="tier t-${t.toLowerCase()}">${t}</span><span class="num"><b>${p}</b></span><small class="muted">${d}</small></div>`).join('')}</div><p class="note">% = share of typical costs the plan pays on average.</p></section></div>
      <section class="card s12"><h2>Before you choose a plan</h2><ul class="ticks">${C.checklist.map(c => `<li>${I('check', 14)} ${esc(c)}</li>`).join('')}</ul><button class="btn brand sm" style="margin-top:8px" data-a="covtab" data-t="compare">${I('chart', 14)} Compare plan costs</button>${disclaimer}</section></div>`;
  }

  /* ---------- Profile ---------- */
  function vProfile() {
    const p = S.profile, b = S.body, num = (path, label, val, unit, step = 1) => `<div class="field"><label for="f-${path}">${label}${unit ? ` <span class="muted">(${unit})</span>` : ''}</label><input id="f-${path}" type="number" inputmode="decimal" step="${step}" min="0" data-bind="${path}" value="${val}"></div>`;
    const tog = (path, label, v) => `<label class="check"><input type="checkbox" data-bind="${path}" ${v ? 'checked' : ''}> ${label}</label>`;
    const cur = latestWeight(), bmi = bmiOf(cur), cat = bmiCat(bmi), gBmi = bmiOf(b.goalWeight), est = energyEstimate(), gp = goalProgress();
    const user = CLOUD.enabled && CLOUD.auth.user();
    return `<div class="grid">
      <section class="card s6"><div class="row" style="margin-bottom:8px"><div class="avatar" style="width:60px;height:60px;font-size:20px">${esc(initials())}</div><div><h2 style="margin:0">${esc(p.name || 'Your profile')}</h2><span class="muted small">${user ? esc(user.email) : 'Stored on this device'}</span></div></div>
        <div class="field"><label for="f-name">Preferred name</label><input id="f-name" maxlength="45" data-bind="profile.name" value="${esc(p.name)}" placeholder="What should your coach call you?"></div>
        <div class="field"><label>Your coach <span class="muted">(personality, voice style & demo athlete)</span></label><div class="coachpick">${Object.entries(D.coach).map(([k, c]) => `<button class="coachopt ${p.style === k ? 'on' : ''}" data-a="style" data-s="${k}" aria-pressed="${p.style === k}">${coachPic(k, 'lg')}${c.name.replace('The ', '')}<small>${COACH_BLURB[k]}</small></button>`).join('')}</div></div>
        <div class="field"><label>Appearance</label><div class="seg">${[['light', 'Light'], ['dark', 'Dark'], ['auto', 'Auto']].map(t => `<button class="${p.theme === t[0] ? 'on' : ''}" data-a="settheme" data-t="${t[0]}">${t[1]}</button>`).join('')}</div></div>
        <div class="field"><label>Units</label><div class="seg">${[['imperial', 'lb · ft · °F'], ['metric', 'kg · cm · °C']].map(t => `<button class="${p.units === t[0] ? 'on' : ''}" data-a="units" data-t="${t[0]}">${t[1]}</button>`).join('')}</div></div></section>
      <section class="card s6"><div class="ch"><h2>Body & goals</h2><button class="btn brand sm" data-a="body-edit">Edit</button></div>
        <div class="kpis"><div class="kpi"><span>Current</span><b class="num">${cur != null ? fmt(cur, 1) : '—'}</b><small class="muted">${wUnit()}</small></div><div class="kpi"><span>Goal</span><b class="num">${b.goalWeight != null ? fmt(b.goalWeight, 1) : '—'}</b><small class="muted">${b.targetDate ? 'by ' + parseKey(b.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : wUnit()}</small></div><div class="kpi"><span>BMI</span><b class="num">${bmi ? bmi.toFixed(1) : '—'}</b><small class="muted">${gBmi ? 'goal ' + gBmi.toFixed(1) : b.heightCm ? '' : 'add height'}</small></div></div>
        ${bmi ? bmiScale(bmi, gBmi) : ''}
        ${gp ? `<div class="row between small" style="margin-top:12px"><span class="muted">${gp.reached ? 'Goal reached' : `${fmt(gp.left, 1)} ${wUnit()} to go`}</span><b>${Math.round(gp.pct * 100)}%</b></div><div class="bar" style="margin-top:6px"><div style="width:${gp.pct * 100}%;background:var(--fat)"></div></div>` : ''}
        <div class="field"><label>Focus areas</label><div class="chips">${b.focus.length ? b.focus.map(f => `<span class="chip on" style="cursor:default">${esc((FOCUS_AREAS.find(x => x[0] === f) || [, f])[1])}</span>`).join('') : '<span class="muted small">None yet — tap Edit to choose</span>'}</div></div>
        ${est && !est.minor ? `<div class="estbox"><div><span class="label">Estimated daily energy</span><div class="row" style="gap:16px;margin-top:4px"><span><b class="num">${fmt(est.target)}</b> <small class="muted">kcal ${esc(est.note)}</small></span></div><small class="muted">Maintenance ≈ ${fmt(est.tdee)} kcal · protein ≈ ${est.protein} g</small></div>${Math.abs(est.target - p.kcal) > 40 || Math.abs(est.protein - p.protein) > 5 ? `<button class="btn soft sm" data-a="apply-est">Use these targets</button>` : `<span class="status good">${I('check', 13)} In use</span>`}</div>` : est && est.minor ? `<p class="note">Calorie estimates are designed for adults. Ask a doctor or dietitian for guidance.</p>` : ''}</section>
      <section class="card s6"><h2>Daily targets</h2><div class="two">${num('profile.kcal', 'Calories', p.kcal, 'kcal', 50)}${num('profile.steps', 'Steps', p.steps, '', 500)}</div>
        <div class="three">${num('profile.protein', 'Protein', p.protein, 'g')}${num('profile.carbs', 'Carbs', p.carbs, 'g')}${num('profile.fat', 'Fat', p.fat, 'g')}</div>
        <div class="two">${num('profile.water', 'Water', p.water, 'glasses')}${num('profile.sleep', 'Sleep', p.sleep, 'hours', .5)}</div>
        <p class="note">General wellness targets you choose — not medical or dietetic advice.</p></section>
      ${accountCard()}
      ${canShowInstall() ? `<section class="card brandcard s12"><div class="row between"><div><h2 style="margin:0 0 4px">Install WAYOF</h2><p class="muted" style="margin:0">${isIOS ? 'Add to your Home Screen from Safari — full-screen and offline.' : 'One click — full-screen, fast, works offline.'}</p></div><button class="btn" style="background:#fff;color:#2a2340" data-a="install">${I('download', 16)} Install app</button></div></section>` : ''}
      <section class="card s6"><div class="ch"><h2>Connected apps</h2><button class="btn soft sm" data-a="go" data-v="apps">Manage</button></div>
        ${[['k', 'Kayaos.space', 'Work schedule → sleep plan, appointments, health sharing'], ['r', 'RepliPlate.app', 'Restaurant clones and meal photos'], ['p', 'Pedalz.app', 'Rides, walks, runs, meter readings, gear shop']].map(([c, n, d]) => `<div class="appconn" style="margin-bottom:10px"><div class="appic ${c}">${n[0]}</div><div><b>${n}</b><small class="muted">${d}</small></div></div>`).join('')}
        <p class="note">${signedIn() ? 'Apps on the same login connect automatically.' : 'Sign in with the same email you use in those apps to connect them.'}</p></section>
      <section class="card s6"><span class="label">Voice studio</span><h2 style="margin-top:4px">A voice that feels familiar</h2>
        <div class="field"><label for="vsel">Device voice</label><select id="vsel" data-bind="voice.uri"><option value="">Device default</option>${voices().map(v => `<option value="${esc(v.voiceURI)}" ${S.voice.uri === v.voiceURI ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')}</select></div>
        <div class="field"><label for="vspd">Speech speed</label><select id="vspd" data-bind="voice.speed">${[['0.85', 'Relaxed'], ['1', 'Natural'], ['1.15', 'Upbeat']].map(o => `<option value="${o[0]}" ${S.voice.speed === o[0] ? 'selected' : ''}>${o[1]}</option>`).join('')}</select></div>
        ${tog('voice.speakName', 'Say my preferred name aloud', S.voice.speakName)}${tog('voice.countReps', 'Count reps & cue sets during workouts', S.voice.countReps)}
        <div class="row"><button class="btn brand" data-a="coach-speak">${I('play', 14)} Preview voice</button><button class="btn ghost" data-a="stopvoice">${I('stop', 14)} Stop</button></div></section>
      <section class="card s6"><div class="row" style="margin-bottom:8px"><div class="tile"><div class="ic">${I('data')}</div></div><h2 style="margin:0">Your data</h2></div><p class="muted">${signedIn() ? 'Backed up to your account and stored on this device.' : 'Stored in this browser only. Sign in to back up and sync across devices.'}</p>
        <div class="row"><button class="btn soft sm" data-a="export">${I('download', 14)} Export JSON</button><button class="btn ghost sm" data-a="sample">Load sample data</button><button class="btn ghost sm" data-a="reset" style="color:var(--bad)">Reset all</button></div></section>
    </div>`;
  }
  function bmiScale(b, g) {
    const pos = v => clamp((v - 15) / (40 - 15) * 100, 0, 100);
    return `<div class="bmiscale" aria-label="BMI ${b.toFixed(1)}, ${bmiCat(b)[0]}"><div class="bands"><span style="width:${pos(18.5)}%" class="b-under"></span><span style="width:${pos(25) - pos(18.5)}%" class="b-ok"></span><span style="width:${pos(30) - pos(25)}%" class="b-over"></span><span style="flex:1" class="b-ob"></span></div>
      <i class="mk" style="left:${pos(b)}%" title="You"></i>${g ? `<i class="mk goal" style="left:${pos(g)}%" title="Goal"></i>` : ''}<div class="row between tiny muted" style="margin-top:4px"><span>18.5</span><span>25</span><span>30</span></div>
      <div class="tiny" style="margin-top:4px"><b>${bmiCat(b)[0]}</b>${g ? ` · goal ${g.toFixed(1)} (${bmiCat(g)[0].toLowerCase()})` : ''}</div></div>`;
  }
  function accountCard() {
    if (!CLOUD.enabled) return `<section class="card s6"><h2>Account & sync</h2><p class="muted">Running in local mode. Connect your Supabase project in <code>config.js</code> to turn on accounts, cross-device sync, the AI coach, groups, trainer links and Kayaos sharing.</p><span class="status warn">${I('cloud', 14)} Backend not configured</span></section>`;
    const u = CLOUD.auth.user();
    if (!u) return `<section class="card s6"><h2>Account & sync</h2><p class="muted">One free account unlocks the AI coach, background nudges, partners & groups, trainer links, connected apps, and sync across phone, tablet and computer.</p><div class="row"><button class="btn brand" data-a="auth" data-m="up">${I('user', 15)} Create account</button><button class="btn ghost" data-a="auth" data-m="in">Log in</button></div></section>`;
    const ls = CLOUD.lastSync();
    return `<section class="card s6"><h2>Account & sync</h2><div class="row"><span class="status good">${I('check', 14)} Signed in</span><span class="muted small">${esc(u.email)}</span></div><p class="muted small">${ls ? `Last synced ${ls.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'Changes sync automatically.'}</p>
      <div class="row"><button class="btn soft sm" data-a="sync-now">${I('refresh', 14)} Sync now</button><button class="btn ghost sm" data-a="pw-change">${I('key', 14)} Change password</button><button class="btn ghost sm" data-a="signout">${I('logout', 14)} Sign out</button></div></section>`;
  }
  const voices = () => ('speechSynthesis' in window ? speechSynthesis.getVoices() : []);
  if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => { if (ui.view === 'profile') render(); };

  /* ---------- sheets ---------- */
  function quickSheet() {
    const q = [['meal', 'Log meal', 'utensils', 'var(--carbs)'], ['water', 'Add water', 'drop', 'var(--water)'], ['steps', 'Steps', 'steps', 'var(--brand)'], ['weight', 'Weight', 'scale', 'var(--fat)'], ['sleep', 'Sleep', 'moon', 'var(--sleep)'], ['workout', 'Workout', 'dumbbell', 'var(--ink)'], ['photo', 'Progress photo', 'camera', '#c2569b'], ['fridge', 'Fridge item', 'fridge', '#3a8f7a'], ['coach', 'Ask coach', 'chat', 'var(--brand)']];
    openSheet(`<div class="sh"><h2>Quick log</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div><p class="muted small" style="margin-top:0">For ${parseKey(ui.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
      <div class="qgrid">${q.map(x => `<button class="qbtn" data-a="q" data-q="${x[0]}"><span class="ic" style="background:${x[3]}">${I(x[2], 22)}</span>${x[1]}</button>`).join('')}</div>`);
  }
  function addMealSheet(slot) {
    const all = [...(S.myClones || []), ...D.recipes, ...D.clones];
    const list = all.slice().sort((a, b) => (b.slot === slot) - (a.slot === slot) || ((S.fridge || []).length ? fridgeMatch(b).pct - fridgeMatch(a).pct : 0));
    openSheet(`<div class="sh"><h2>Add to ${slot[0].toUpperCase() + slot.slice(1)}</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div>
      <div class="field"><label for="msearch" class="sr">Search recipes</label><input id="msearch" data-in="msearch" placeholder="Search recipes & clones…"></div>
      <div class="stack" id="mlist" style="gap:8px;max-height:38dvh;overflow:auto">${list.map(r => `<button class="exrow" style="width:100%" data-a="recipe" data-id="${r.id}" data-slot="${slot}" data-name="${esc((r.name + ' ' + (r.style || '')).toLowerCase())}"><span style="width:44px;height:44px;flex-shrink:0">${foodArt(r.art, r.id, r.name)}</span><div style="text-align:left"><strong>${esc(r.name)}</strong><small>${r.kcal} kcal · P ${r.p} · C ${r.c} · F ${r.f}${r.style ? ' · ' + esc(r.style) : ''}</small></div><span class="rx">${I('plus', 18)}</span></button>`).join('')}</div>
      <label class="btn soft block" style="cursor:pointer;margin-top:10px">${I('camera', 15)} Snap my meal — estimate it from a photo<input type="file" accept="image/*" capture="environment" id="mealPhoto" hidden></label>
      <hr class="hr"><h3>Or add your own</h3>
      <div class="field"><label for="cf-name">Food name</label><input id="cf-name" maxlength="60" placeholder="e.g. Turkey sandwich"></div>
      <div class="three" style="grid-template-columns:repeat(4,1fr)"><div class="field"><label for="cf-k">kcal</label><input id="cf-k" type="number" inputmode="numeric" min="0"></div><div class="field"><label for="cf-p">Protein g</label><input id="cf-p" type="number" inputmode="numeric" min="0"></div><div class="field"><label for="cf-c">Carbs g</label><input id="cf-c" type="number" inputmode="numeric" min="0"></div><div class="field"><label for="cf-f">Fat g</label><input id="cf-f" type="number" inputmode="numeric" min="0"></div></div>
      <button class="btn brand block" data-a="custom-log" data-slot="${slot}">Add food</button>`);
  }
  function recipeSheet(id, slot, o = {}) {
    const r = findRecipe(id); if (!r) return;
    const q = sheetCtx.rid === id ? sheetCtx.q : 1; slot = slot || sheetCtx.slot || r.slot || guessSlot();
    const asRest = sheetCtx.rid === id && sheetCtx.asRest != null ? sheetCtx.asRest : !!o.asRest;
    const fav = S.favorites.includes(id), hasFridge = (S.fridge || []).length > 0, isClone = r.restPrice != null && r.restPrice > 0;
    openSheet(`<div class="sh"><button class="iconbtn" data-a="close" aria-label="Close">${I('left', 18)}</button><h2 style="text-align:center;flex:1;font-size:17px">${esc(r.name)}</h2><button class="iconbtn" data-a="fav" data-id="${id}" aria-label="${fav ? 'Remove from' : 'Add to'} favorites" style="color:var(--bad)">${I(fav ? 'heartf' : 'heart', 18)}</button></div>
      <div class="recipehero"><div style="width:min(200px,52vw)">${foodArt(r.art, r.id, r.name)}</div>${r.style ? `<span class="clonetag">${esc(r.style)}</span>` : ''}</div>
      <div class="row" style="justify-content:center;gap:18px;font-weight:700;font-size:14px"><span class="row" style="gap:6px">${I('clock', 16)} ${r.min} min</span><span class="row" style="gap:6px">${I('flame', 16)} ${Math.round(r.kcal * q)} kcal</span><span>${r.homePrice ? '$' + (r.homePrice * q).toFixed(2) : '$'.repeat(r.cost || 1)}</span></div>
      ${isClone ? `<div class="savebar big" style="margin-top:12px"><span><small>Restaurant</small><b>$${r.restPrice.toFixed(2)}</b><em>${r.restCal} cal</em></span><span class="win"><small>Home</small><b>$${(+r.homePrice).toFixed(2)}</b><em>${r.kcal} cal</em></span><span><small>Clone score</small><b>${r.score}%</b><em>save $${Math.max(0, r.restPrice - r.homePrice).toFixed(2)}</em></span></div>` : ''}
      ${isClone ? `<div class="field" style="margin:12px 0 0"><label>Log it as</label><div class="seg logas"><button class="${!asRest ? 'on' : ''}" data-a="logas" data-v="0">Made at home<small>${r.kcal} kcal</small></button><button class="${asRest ? 'on' : ''}" data-a="logas" data-v="1">Ate it out<small>${r.restCal} kcal</small></button></div></div>` : ''}
      <div class="mstrip" style="margin:14px 0">${(() => { const k = asRest && isClone && r.kcal ? r.restCal / r.kcal : 1; return [['Protein', r.p, 'var(--protein)'], ['Carbs', r.c, 'var(--carbs)'], ['Fat', r.f, 'var(--fat)']].map(m => `<span style="border-top:3px solid ${m[2]}"><b>${Math.round(m[1] * q * k)}g</b>${m[0]}</span>`).join(''); })()}</div>
      ${r.macroEst ? '<p class="note" style="margin-top:-8px">Carbs and fat are estimated from calories and protein.</p>' : ''}
      <div class="row between" style="padding:8px 0"><b>Servings</b><div class="stepper"><button data-a="serv" data-n="-0.5" aria-label="Fewer servings">−</button><b class="num">×${q}</b><button data-a="serv" data-n="0.5" aria-label="More servings">+</button></div></div>
      <h3 style="margin-top:12px">Ingredients <span class="muted small">(1 serving${hasFridge ? ' · ✓ = in your fridge' : ''})</span></h3><ul class="ing">${r.ing.map(i => { const h = hasFridge ? fridgeHave(i[0]) : null; return `<li class="${h ? 'have' : ''}"><span>${h === 'fridge' ? I('check', 13) + ' ' : ''}${esc(i[0])}</span><span class="muted">${esc(i[1])}${i[2] ? ' · $' + (+i[2]).toFixed(2) : ''}</span></li>`; }).join('')}</ul>
      <div class="row" style="margin-top:8px;flex-wrap:wrap"><button class="btn soft sm" data-a="shop-recipe" data-id="${id}">${I('cart', 13)} Shop this recipe</button>${hasFridge && fridgeMatch(r).missing.length ? `<button class="btn ghost sm" data-a="shoplist" data-id="${id}">${I('copy', 13)} Copy shopping list (${fridgeMatch(r).missing.length})</button>` : ''}</div>
      <h3 style="margin-top:16px">Method</h3><ol class="steps">${r.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      ${isClone ? `<div class="row" style="margin-top:12px"><button class="btn ghost sm" data-a="repli-open" data-id="${id}">${I('ext', 13)} Open in RepliPlate</button><button class="btn ghost sm" data-a="repli-share" data-id="${id}">${I('share', 13)} Share recipe</button></div>` : ''}
      ${r.swaps && r.swaps.length ? `<h3 style="margin-top:12px">Diet swaps</h3><div class="chips">${r.swaps.map(s => `<span class="pill">${esc(s)}</span>`).join('')}</div>` : ''}
      <div class="row stickybar"><select id="rslot" style="width:auto;flex:1" aria-label="Meal">${['breakfast', 'lunch', 'dinner', 'snack'].map(s => `<option value="${s}" ${s === slot ? 'selected' : ''}>${s[0].toUpperCase() + s.slice(1)}</option>`).join('')}</select><button class="btn brand" style="flex:1.4" data-a="recipe-log" data-id="${id}">${I('plus', 16)} Add to log</button></div>
      <p class="note">${r.ai ? 'AI-generated recipe — nutrition and prices are estimates.' : 'Nutrition values are estimates per serving.'}</p>`, { rid: id, q, slot, asRest: isClone ? asRest : false });
  }
  function bodySheet() {
    const b = S.body, cur = latestWeight(), imp = imperial();
    const ft = b.heightCm ? Math.floor(b.heightCm / 2.54 / 12) : '', inch = b.heightCm ? Math.round(b.heightCm / 2.54 - ft * 12) : '';
    const gBmi = bmiOf(b.goalWeight);
    openSheet(`<div class="sh"><h2>Body & goals</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div>
      <h3>Physical stats</h3>
      <div class="two"><div class="field"><label for="bW">Current weight (${wUnit()})</label><input id="bW" type="number" inputmode="decimal" step="0.1" min="40" max="1400" value="${cur != null ? cur : ''}" placeholder="Saved as today's weigh-in"></div>
        ${imp ? `<div class="field"><label>Height</label><div class="row" style="gap:8px;flex-wrap:nowrap"><input id="bFt" type="number" inputmode="numeric" min="3" max="8" value="${ft}" placeholder="ft" aria-label="Feet"><input id="bIn" type="number" inputmode="numeric" min="0" max="11" value="${inch}" placeholder="in" aria-label="Inches"></div></div>` : `<div class="field"><label for="bCm">Height (cm)</label><input id="bCm" type="number" inputmode="numeric" min="100" max="250" value="${b.heightCm ? Math.round(b.heightCm) : ''}"></div>`}</div>
      <div class="three"><div class="field"><label for="bY">Birth year</label><input id="bY" type="number" inputmode="numeric" min="1920" max="${new Date().getFullYear()}" value="${b.birthYear || ''}"></div>
        <div class="field"><label for="bSex">Sex <span class="muted">(for estimates)</span></label><select id="bSex"><option value="" ${!b.sex ? 'selected' : ''}>Prefer not to say</option><option value="female" ${b.sex === 'female' ? 'selected' : ''}>Female</option><option value="male" ${b.sex === 'male' ? 'selected' : ''}>Male</option></select></div>
        <div class="field"><label for="bAct">Activity</label><select id="bAct">${ACTIVITY.map(a => `<option value="${a[0]}" ${b.activity === a[0] ? 'selected' : ''}>${a[1]}</option>`).join('')}</select></div></div>
      <h3 style="margin-top:10px">Goal</h3>
      <div class="seg" style="margin-bottom:6px">${[['weight', 'By weight'], ['bmi', 'By BMI']].map(t => `<button class="${(b.goalBy || 'weight') === t[0] ? 'on' : ''}" data-a="goalby" data-t="${t[0]}">${t[1]}</button>`).join('')}</div>
      <div class="two">${(b.goalBy || 'weight') === 'bmi' ? `<div class="field"><label for="bGB">Goal BMI</label><input id="bGB" type="number" inputmode="decimal" step="0.1" min="16" max="40" value="${gBmi ? gBmi.toFixed(1) : ''}" placeholder="18.5–24.9 is the healthy range"></div>` : `<div class="field"><label for="bG">Goal weight (${wUnit()})</label><input id="bG" type="number" inputmode="decimal" step="0.1" min="40" max="1400" value="${b.goalWeight != null ? b.goalWeight : ''}"></div>`}
        <div class="field"><label for="bD">Target date <span class="muted">(optional)</span></label><input id="bD" type="date" value="${esc(b.targetDate || '')}"></div></div>
      <p class="note" style="margin-top:0">BMI is a rough screening number — it doesn't account for muscle, age or body shape. A safe pace is about 0.5–1% of body weight per week.</p>
      <h3 style="margin-top:12px">Focus areas</h3><div class="chips" id="focusChips">${FOCUS_AREAS.map(([k, n]) => `<button class="chip ${b.focus.includes(k) ? 'on' : ''}" data-a="focus" data-k="${k}" aria-pressed="${b.focus.includes(k)}">${n}</button>`).join('')}</div>
      <p class="note">Your plan adds a targeted move for these areas when you rebuild your week, and your coach tailors nudges to them.</p>
      <div class="row stickybar"><button class="btn brand block" data-a="body-save">${I('check', 16)} Save</button></div>`, { focus: b.focus.slice() }, 'tall');
  }
  function authSheet(mode = 'in') {
    openSheet(`<div class="sh"><h2>${mode === 'up' ? 'Create your account' : 'Sign in'}</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div>
      <p class="muted small" style="margin-top:0">${mode === 'up' ? 'One account for WAYOF, Kayaos, Pedalz and RepliPlate. Works on your phone, tablet and computer.' : 'Use the email you signed up with in WAYOF, Kayaos or Pedalz.'}</p>
      <form data-form="auth" data-mode="${mode}">${mode === 'up' ? `<div class="field"><label for="aName">Name</label><input id="aName" maxlength="45" value="${esc(S.profile.name)}" autocomplete="name"></div>` : ''}
        <div class="field"><label for="aEmail">Email</label><input id="aEmail" type="email" required autocomplete="email" autofocus></div>
        <div class="field"><label for="aPw">Password</label><input id="aPw" type="password" minlength="8" autocomplete="${mode === 'up' ? 'new-password' : 'current-password'}" ${mode === 'up' ? 'required' : ''}></div>
        <button class="btn brand block" type="submit">${mode === 'up' ? 'Create account' : 'Sign in'}</button></form>
      <div class="row" style="justify-content:center;margin-top:12px">${mode === 'up' ? `<button class="btn ghost sm" data-a="auth" data-m="in">I have an account</button>` : `<button class="btn ghost sm" data-a="auth" data-m="up">Create account</button><button class="btn ghost sm" data-a="forgot">Forgot password?</button><button class="btn ghost sm" data-a="magic">${I('send', 13)} Email me a link</button>`}</div>
      ${CLOUD.config.GOOGLE_SIGNIN ? `<div class="orline"><span>or</span></div><button class="btn ghost block" data-a="google">${I('user', 15)} Continue with Google</button>` : ''}
      <p class="note" style="text-align:center">By continuing you agree to the Terms and Privacy Policy. WAYOF gives general wellness information, not medical advice.</p>`);
  }

  /* ---------- Connected apps: Kayaos · RepliPlate · Pedalz ---------- */
  const ax = { loading: {}, kayaos: null, appts: null, rides: null, listings: null, err: {} }; // async cache
  async function axLoad(key, fn) { if (ax.loading[key]) return; ax.loading[key] = true; try { ax[key] = await fn(); ax.err[key] = null; } catch (e) { ax.err[key] = e.message; ax[key] = ax[key] || null; } ax.loading[key] = false; afterAppsLoad(key); render(); }
  function afterAppsLoad(key) {
    if (key === 'kayaos' && ax.kayaos) { S.links.kayaos.shifts = ax.kayaos.shifts; S.links.kayaos.at = Date.now(); save(); }
    if (key === 'appts' && ax.appts) { S.links.kayaos.appts = ax.appts; save(); }
    if (key === 'rides' && ax.rides) importRides(ax.rides);
  }
  function refreshApps(force) {
    if (!signedIn()) return;
    if (force) { APPS.resetDetect(); ax.kayaos = ax.appts = ax.rides = ax.listings = null; }
    if (ax.kayaos == null) axLoad('kayaos', () => APPS.kayaos.shifts().then(r => r || false));
    if (ax.appts == null) axLoad('appts', () => APPS.kayaos.appointments().then(r => r || false));
    if (ax.rides == null) axLoad('rides', () => APPS.pedalz.rides().then(r => r || false));
  }
  // shifts & appointments: live from Kayaos when available, else the last import/link copy
  const kShifts = () => (S.links.kayaos.shifts || []);
  const allAppts = () => [...(S.links.kayaos.appts || []).map(a => ({ ...a, src: 'kayaos' })), ...(S.apptsLocal || []).map(a => ({ ...a, src: 'wayof' }))]
    .filter(a => a.date && a.date >= TODAY()).sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));
  function sleepPlanNow() {
    const usual = S.links.kayaos.usualBed || '22:30';
    const p = APPS.sleepPlan(kShifts(), { goalH: S.profile.sleep, prepMin: +S.links.kayaos.prepMin || 75, usualBed: usual, days: 7 });
    APPS.setPlan(p); return p;
  }
  function tonightPlan() { const p = kShifts().length ? sleepPlanNow() : []; return p[0] || null; }
  // import Pedalz rides as WAYOF cardio workouts (once each)
  function importRides(rides) {
    if (!Array.isArray(rides)) return; const seen = new Set(S.links.pedalz.imported || []); let n = 0;
    rides.forEach(r => {
      if (seen.has(r.id)) return; const d = new Date(r.ts), k = dkey(d); const L = mutLog(k), mode = r.mode === 'run' ? 'run' : r.mode === 'walk' ? 'walk' : 'ride';
      if (L.workouts.some(w => w.cardio && w.cardio.src === r.id)) { seen.add(r.id); return; }
      L.workouts.push({ pid: 'pz-' + r.id, title: { ride: 'Bike ride', run: 'Run', walk: 'Walk' }[mode] + ' (Pedalz)', minutes: Math.round((r.dur_s || 0) / 60), cardio: { mode, src: r.id, distM: +r.dist_m || 0, durS: +r.dur_s || 0, avgMs: +r.avg_ms || 0, maxMs: +r.max_ms || 0, gainM: +r.gain_m || 0, kcal: APPS.meters.kcal(APPS.meters.met(mode, (+r.avg_ms || 0) * 3.6), toKg(latestWeight()), (r.dur_s || 0) / 3600) } });
      seen.add(r.id); n++;
    });
    S.links.pedalz.imported = [...seen].slice(-500); if (n) { save(); toast(`${n} ride${n === 1 ? '' : 's'} imported from Pedalz`); }
  }
  const km = m => imperial() ? m / 1609.34 : m / 1000, dU = () => imperial() ? 'mi' : 'km', spd = ms => imperial() ? ms * 2.23694 : ms * 3.6, sU = () => imperial() ? 'mph' : 'km/h';
  const paceStr = ms => { if (!ms || ms < 0.3) return '—'; const secPer = (imperial() ? 1609.34 : 1000) / ms; return `${Math.floor(secPer / 60)}:${pad(Math.round(secPer % 60))}`; };

  function appStatus(table) { return !CLOUD.enabled ? 'local' : !signedIn() ? 'signedout' : APPS.has && ax[table] === false ? 'missing' : 'on'; }
  function vApps() {
    const u = CLOUD.enabled && CLOUD.auth.user();
    if (signedIn()) refreshApps();
    const plan = kShifts().length ? sleepPlanNow() : [], appts = allAppts().slice(0, 6), K = S.links.kayaos;
    const kState = !signedIn() ? null : ax.kayaos === false ? 'missing' : ax.kayaos ? 'on' : 'loading';
    const pState = !signedIn() ? null : ax.rides === false ? 'missing' : ax.rides ? 'on' : 'loading';
    const badge = st => st === 'on' ? `<span class="status good">${I('check', 13)} Connected</span>` : st === 'missing' ? `<span class="status warn">${I('link', 13)} Not on this account</span>` : st === 'loading' ? `<span class="status">${I('refresh', 13)} Checking…</span>` : `<span class="status">${I('user', 13)} Sign in to link</span>`;
    const cardioLog = recentCardio(5);
    return `<div class="grid">
      <section class="card s12 appshero"><div><span class="label">One account · four apps</span><h2 style="margin:4px 0 6px">WAYOF works with Kayaos, RepliPlate and Pedalz</h2>
        <p class="muted small" style="margin:0">${u ? `Signed in as <b>${esc(u.email)}</b>. Apps that use the same login share your schedule, meals and rides automatically.` : CLOUD.enabled ? 'Create one account and use it in every app — your work schedule, meals and rides flow into WAYOF automatically.' : 'Running on this device only. Add your Supabase keys to config.js to turn on accounts and app linking. Share links still work.'}</p></div>
        <div class="row">${u ? `<button class="btn ghost sm" data-a="apps-refresh">${I('refresh', 14)} Refresh</button>` : CLOUD.enabled ? `<button class="btn brand" data-a="auth" data-m="up">${I('user', 15)} Create account</button><button class="btn ghost" data-a="auth" data-m="in">Log in</button>` : ''}</div></section>

      <section class="card s6 appcard"><div class="apphead"><div class="appic k">K</div><div><h2 style="margin:0">Kayaos.space</h2><span class="muted small">Work schedule → sleep plan · appointments · health sharing</span></div>${badge(kState)}</div>
        <h3 style="margin-top:14px">${I('moon', 15)} Sleep plan from your work schedule</h3>
        ${plan.length ? `<div class="stack" style="gap:6px">${plan.slice(0, 4).map(p => `<div class="sleeprow ${p.kind}"><div class="sd"><b>${new Date(p.night + 'T12:00').toLocaleDateString(undefined, { weekday: 'short' })}</b><small>${p.kind === 'night' ? 'Night shift' : p.kind === 'work' ? 'Work next day' : 'Off next day'}</small></div><div class="st"><b class="num">${APPS.fmtT(p.bed)} → ${APPS.fmtT(p.wake)}</b><small>${esc(p.text)}${p.warn ? ` <span style="color:var(--warn)">${esc(p.warn)}</span>` : ''}</small></div></div>`).join('')}</div>`
          : `<p class="muted small">${kState === 'missing' ? 'Kayaos isn\'t on this login yet. Sign in to Kayaos with the same email, then log a Work card with start and end times.' : signedIn() ? 'Add Work cards with start and end times in Kayaos. WAYOF works out when to sleep and wake for each shift.' : 'Sign in with the same account you use in Kayaos, or send your schedule from Kayaos → More → WAYOF Health.'}</p>`}
        <div class="two" style="margin-top:6px"><div class="field" style="margin:6px 0"><label for="kPrep">Wake-up to leaving <span class="muted">(min)</span></label><input id="kPrep" type="number" min="15" max="240" step="5" data-bind="links.kayaos.prepMin" value="${K.prepMin}"></div>
          <div class="field" style="margin:6px 0"><label for="kBed">Usual bedtime</label><input id="kBed" type="time" data-bind="links.kayaos.usualBed" value="${esc(K.usualBed)}"></div></div>
        <h3 style="margin-top:12px">${I('clock', 15)} Health & appointments</h3>
        ${appts.length ? `<div class="stack" style="gap:6px">${appts.map(a => `<div class="apptrow"><div class="ad"><b>${new Date(a.date + 'T12:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</b><small>${a.time ? APPS.fmtT(new Date(`${a.date}T${a.time}`)) : 'Any time'}</small></div><div style="min-width:0"><b>${esc(a.title)}</b><small class="muted">${esc(a.place || a.cat || '')}${a.src === 'kayaos' ? ' · from Kayaos' : ''}</small></div></div>`).join('')}</div>` : '<p class="muted small">No upcoming appointments.</p>'}
        <div class="row" style="margin-top:12px"><button class="btn brand sm" data-a="appt-add">${I('plus', 14)} Add appointment</button><button class="btn soft sm" data-a="kayaos-workout">${I('dumbbell', 14)} Send today's workout</button><a class="btn ghost sm" href="${esc(APPS.kayaos.url)}" target="_blank" rel="noopener">${I('ext', 13)} Open Kayaos</a>${!signedIn() || ax.kayaos === false ? `<button class="btn ghost sm" data-a="kayaos-link">${I('share', 13)} Send snapshot</button>` : ''}</div>
        <label class="check small" style="margin-top:6px"><input type="checkbox" data-a="kayaos-toggle" ${S.share.kayaos ? 'checked' : ''}> Share my health summary with Kayaos (steps, water, sleep, workouts, sleep plan)</label>
        ${K.importedAt ? `<p class="note">Schedule imported from Kayaos ${timeAgo(K.importedAt)}.</p>` : ''}
        ${ax.err.kayaos && kState !== 'missing' ? `<p class="note" style="color:var(--bad)">${esc(ax.err.kayaos)}</p>` : ''}</section>

      <section class="card s6 appcard"><div class="apphead"><div class="appic r">R</div><div><h2 style="margin:0">RepliPlate.app</h2><span class="muted small">Clone restaurant dishes · meal photos · share recipes</span></div>${APPS.repli.api ? `<span class="status good">${I('spark', 13)} AI on</span>` : aiReady() ? `<span class="status good">${I('spark', 13)} AI via WAYOF</span>` : `<span class="status">${I('cloud', 13)} Library</span>`}</div>
        <form class="row" data-form="clone" style="gap:8px;margin-top:14px"><input id="cloneQ" maxlength="120" value="${esc(ui.cloneQ)}" placeholder="Clone a dish: Crunchwrap, wings, Cava bowl…" style="flex:1;min-width:170px"><button class="btn brand" type="submit" ${ui.cloneBusy ? 'disabled' : ''}>${ui.cloneBusy ? 'Cloning…' : 'Clone'}</button></form>
        <div class="row" style="margin-top:10px"><label class="btn soft sm" style="cursor:pointer">${I('camera', 14)} Photo of a plate or menu<input type="file" accept="image/*" capture="environment" id="clonePhoto" hidden></label><label class="btn soft sm" style="cursor:pointer">${I('utensils', 14)} Log a meal from a photo<input type="file" accept="image/*" capture="environment" id="mealPhoto" hidden></label></div>
        <form class="row" data-form="repli-import" style="gap:8px;margin-top:12px"><input id="rpLink" placeholder="Paste a RepliPlate share link" style="flex:1;min-width:170px"><button class="btn ghost sm" type="submit">Import</button></form>
        <p class="muted small" style="margin:12px 0 4px">${D.clones.length} clones in your library${(S.myClones || []).length ? ` · ${(S.myClones || []).length} saved` : ''}</p>
        <div class="row"><button class="btn ghost sm" data-a="ntab-go" data-t="copycat">${I('leaf', 13)} Browse clones</button><a class="btn ghost sm" href="${esc(APPS.repli.url)}" target="_blank" rel="noopener">${I('ext', 13)} Open RepliPlate</a></div>
        <p class="note">${APPS.repli.api ? 'Cloning uses RepliPlate\'s AI.' : aiReady() ? 'Cloning uses your WAYOF AI coach.' : 'Offline: matches the library. Sign in, or set REPLIPLATE_API in config.js, for AI cloning of any dish or photo.'}</p></section>

      <section class="card s12 appcard"><div class="apphead"><div class="appic p">P</div><div><h2 style="margin:0">Pedalz.app</h2><span class="muted small">Ride, stationary bike, walk & run with live meters · rides sync · gear shop</span></div>${badge(pState)}</div>
        <div class="modegrid">${CARDIO_MODES.map(m => `<button class="modecard" data-a="cardio" data-m="${m[0]}"><span class="mic">${I(m[2], 22)}</span><b>${m[1]}</b><small>${m[3]}</small></button>`).join('')}</div>
        <div class="row" style="margin-top:12px"><button class="btn soft sm" data-a="meter">${I('timer', 14)} Enter machine meter reading</button><button class="btn ghost sm" data-a="gear">${I('trophy', 14)} Gear shop</button><a class="btn ghost sm" href="${esc(APPS.pedalz.url)}" target="_blank" rel="noopener">${I('ext', 13)} Open Pedalz</a></div>
        <h3 style="margin-top:16px">Recent cardio</h3>
        ${cardioLog.length ? `<div class="stack" style="gap:6px">${cardioLog.map(c => `<div class="exrow"><div class="ico">${I(c.w.cardio.mode === 'ride' || c.w.cardio.mode === 'indoor' ? 'bike' : 'run', 18)}</div><div style="min-width:0"><strong>${esc(c.w.title)}</strong><small>${parseKey(c.k).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} · ${c.w.minutes} min${c.w.cardio.distM ? ` · ${fmt(km(c.w.cardio.distM), 2)} ${dU()}` : ''}${c.w.cardio.kcal ? ` · ${c.w.cardio.kcal} kcal` : ''}</small></div></div>`).join('')}</div>` : '<p class="muted small">Track a ride, walk or run, or log a reading from a gym machine. Rides from Pedalz show up here when you use the same login.</p>'}
      </section></div>`;
  }
  const CARDIO_MODES = [['ride', 'Outdoor ride', 'bike', 'GPS speed, distance, climb'], ['indoor', 'Stationary bike', 'bike', 'Smart bike / meter readings'], ['walk', 'Walk', 'run', 'GPS pace & distance'], ['run', 'Run', 'run', 'GPS pace, splits'], ['treadmill', 'Treadmill', 'run', 'Machine meter readings']];
  function recentCardio(n) { const out = []; Object.keys(S.log).sort().reverse().some(k => { (S.log[k].workouts || []).slice().reverse().forEach(w => { if (w.cardio) out.push({ k, w }); }); return out.length >= n; }); return out.slice(0, n); }

  /* ---------- cardio tracker with live meters ---------- */
  let TR = null;
  function openTracker(mode) {
    if (TR) stopTracker(true);
    TR = { mode, state: 'ready', startedAt: 0, elapsed: 0, lastTick: 0, distM: 0, gainM: 0, maxMs: 0, speedMs: 0, last: null, path: [], series: [], hr: null, cad: null, power: null, res: null, kcalDev: null, gpsAcc: null, stopGps: null, hrDev: null, bikeDev: null, timer: null };
    renderTracker();
  }
  function trStats() {
    const T = TR, h = T.elapsed / 3600, avgMs = T.elapsed ? T.distM / T.elapsed : 0;
    const m = APPS.meters.met(T.mode === 'treadmill' ? 'walk' : T.mode, (T.speedMs || avgMs) * 3.6, T.power);
    return { avgMs, kcal: T.kcalDev != null ? T.kcalDev : APPS.meters.kcal(m, toKg(latestWeight()), h) };
  }
  function renderTracker() {
    const T = TR, st = trStats(), gpsMode = ['ride', 'walk', 'run'].includes(T.mode), label = CARDIO_MODES.find(m => m[0] === T.mode)[1];
    const ringPct = Math.min(1, spd(T.speedMs) / (T.mode === 'ride' || T.mode === 'indoor' ? (imperial() ? 25 : 40) : (imperial() ? 9 : 15)));
    const bigVal = T.mode === 'walk' || T.mode === 'run' ? paceStr(T.speedMs || st.avgMs) : fmt(spd(T.speedMs), 1), bigUnit = T.mode === 'walk' || T.mode === 'run' ? `min/${dU()}` : sU();
    sheetCleanup = null; // redrawing must not end the session
    openSheet(`<div class="sh plhead"><div><span class="label">${esc(label)}${gpsMode ? ` · GPS <span id="mGps">${T.gpsAcc ? '±' + Math.round(T.gpsAcc) + 'm' : 'waiting'}</span>` : ''}</span><h2 style="margin:2px 0 0">${T.state === 'ready' ? 'Ready' : T.state === 'paused' ? 'Paused' : 'Tracking'}</h2></div><div class="row" style="flex-wrap:nowrap;gap:6px"><button class="iconbtn" data-a="tr-fs" aria-label="Full screen">${I('ext', 17)}</button><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div></div>
      <div class="meters">
        <div class="bigmeter"><div class="stepsring" style="width:min(240px,60vw);height:min(240px,60vw)">${ring(ringPct, 240, 16, 'var(--brand)')}<span style="flex-direction:column;display:grid;place-items:center;line-height:1"><b class="num" id="mBig" style="font-size:clamp(40px,10vw,64px)">${bigVal}</b><small class="muted" style="font-size:13px;font-weight:700">${bigUnit}</small></span></div></div>
        <div class="metergrid">
          <div class="mt"><span>Time</span><b class="num" id="mTime">${fmtDur(T.elapsed)}</b></div>
          <div class="mt"><span>Distance</span><b class="num" id="mDist">${fmt(km(T.distM), 2)}</b><small>${dU()}</small></div>
          ${T.mode === 'indoor' ? `<div class="mt"><span>Cadence</span><b class="num" id="mCad">${T.cad != null ? Math.round(T.cad) : '—'}</b><small>rpm</small></div><div class="mt"><span>Power</span><b class="num" id="mPow">${T.power != null ? Math.round(T.power) : '—'}</b><small>W</small></div>`
            : `<div class="mt"><span>Avg ${T.mode === 'walk' || T.mode === 'run' ? 'pace' : 'speed'}</span><b class="num" id="mAvg">${T.mode === 'walk' || T.mode === 'run' ? paceStr(st.avgMs) : fmt(spd(st.avgMs), 1)}</b><small>${T.mode === 'walk' || T.mode === 'run' ? '/' + dU() : sU()}</small></div><div class="mt"><span>Climb</span><b class="num" id="mGain">${Math.round(imperial() ? T.gainM * 3.281 : T.gainM)}</b><small>${imperial() ? 'ft' : 'm'}</small></div>`}
          <div class="mt"><span>Heart rate</span><b class="num" id="mHr">${T.hr || '—'}</b><small>bpm</small></div>
          <div class="mt"><span>Calories</span><b class="num" id="mKcal">${st.kcal}</b><small>kcal</small></div>
        </div></div>
      <div class="row" style="margin:12px 0 4px">${T.state === 'running' ? `<button class="btn soft" style="flex:1" data-a="tr-pause">${I('pause', 14)} Pause</button><button class="btn" style="flex:1;background:var(--bad);color:#fff" data-a="tr-stop">${I('stop', 14)} Finish</button>` : T.state === 'paused' ? `<button class="btn brand" style="flex:1" data-a="tr-start">${I('play', 14)} Resume</button><button class="btn" style="flex:1;background:var(--bad);color:#fff" data-a="tr-stop">${I('stop', 14)} Finish</button>` : `<button class="btn brand block" data-a="tr-start">${I('play', 14)} Start ${esc(label.toLowerCase())}</button>`}</div>
      <div class="row">${APPS.meters.btSupported() ? `<button class="btn ghost sm" data-a="tr-hr">${I('heart', 13)} ${T.hrDev ? esc(T.hrDev.name) : 'Connect heart-rate strap'}</button>${T.mode === 'indoor' ? `<button class="btn ghost sm" data-a="tr-bike">${I('bike', 13)} ${T.bikeDev ? esc(T.bikeDev.name) : 'Connect smart bike / trainer'}</button>` : ''}` : `<span class="muted tiny">Bluetooth sensors work in Chrome on Android and desktop.</span>`}</div>
      <p class="note">${gpsMode ? 'Keep WAYOF open on screen while tracking — browsers pause GPS in the background. ' : T.mode === 'indoor' ? 'No smart bike? Ride with the timer, then type the bike\'s meter readings when you finish. ' : 'Run the timer, then type the treadmill\'s meter readings when you finish. '}${signedIn() && ax.rides !== false ? 'Saved sessions also go to your Pedalz ride archive.' : ''}</p>`, { tracker: true }, 'player tracker' + (T.fs ? ' fs' : ''));
    sheetCleanup = () => stopTracker(true);
  }
  const fmtDur = s => { s = Math.round(s); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return h ? `${h}:${pad(m)}:${pad(x)}` : `${m}:${pad(x)}`; };
  function trUpdate() {
    if (!TR) return; const T = TR, st = trStats(), set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('mTime', fmtDur(T.elapsed)); set('mDist', fmt(km(T.distM), 2)); set('mHr', T.hr || '—'); set('mKcal', st.kcal);
    set('mBig', T.mode === 'walk' || T.mode === 'run' ? paceStr(T.speedMs || st.avgMs) : fmt(spd(T.speedMs), 1));
    set('mAvg', T.mode === 'walk' || T.mode === 'run' ? paceStr(st.avgMs) : fmt(spd(st.avgMs), 1)); set('mGain', Math.round(imperial() ? T.gainM * 3.281 : T.gainM));
    if (T.gpsAcc) set('mGps', '±' + Math.round(T.gpsAcc) + 'm');
    set('mCad', T.cad != null ? Math.round(T.cad) : '—'); set('mPow', T.power != null ? Math.round(T.power) : '—');
  }
  function trStart() {
    const T = TR; if (T.state === 'running') return;
    if (!T.startedAt) T.startedAt = Date.now();
    T.state = 'running'; T.lastTick = Date.now();
    T.timer = setInterval(() => { if (!TR || TR.state !== 'running') return; const now = Date.now(); TR.elapsed += (now - TR.lastTick) / 1000; TR.lastTick = now; if (Math.round(TR.elapsed) % 10 === 0) TR.series.push([Math.round(TR.elapsed), +TR.speedMs.toFixed(2), TR.hr || null]); trUpdate(); }, 1000);
    if (['ride', 'walk', 'run'].includes(T.mode) && !T.stopGps) T.stopGps = APPS.meters.gps(fix => {
      if (!TR) return; const t = TR; t.gpsAcc = fix.acc; if (fix.acc > 35 || t.state !== 'running') { t.last = t.state === 'running' ? t.last : null; return; }
      if (t.last) { const d = APPS.meters.hav(t.last, fix), dt = (fix.t - t.last.t) / 1000; const v = dt > 0 ? d / dt : 0;
        if (v < 30 && d > 1.5) { t.distM += d; t.speedMs = fix.speed != null && fix.speed >= 0 ? fix.speed : v; t.maxMs = Math.max(t.maxMs, t.speedMs); if (fix.alt != null && t.last.alt != null && fix.alt - t.last.alt > 2) t.gainM += fix.alt - t.last.alt; t.path.push([+fix.lat.toFixed(5), +fix.lng.toFixed(5)]); }
        else if (d <= 1.5 && dt > 6) t.speedMs = 0; }
      if (!t.last || APPS.meters.hav(t.last, fix) > 1.5) t.last = fix; trUpdate();
    }, e => toast(e.code === 1 ? 'Location permission is needed to track distance' : 'GPS signal lost — keep the screen on'));
    renderTracker(); if (S.voice.countReps) speak('Tracking started', { quiet: true });
  }
  function stopTracker(silent) {
    if (!TR) return; clearInterval(TR.timer); if (TR.stopGps) TR.stopGps(); if (TR.hrDev) TR.hrDev.stop(); if (TR.bikeDev) TR.bikeDev.stop();
    if (!silent) return; TR = null; if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
  }
  function trFinish() {
    const T = TR; clearInterval(T.timer); T.state = 'paused';
    const st = trStats(), manual = T.mode === 'indoor' && !T.bikeDev || T.mode === 'treadmill';
    sheetCleanup = null;
    openSheet(`<div class="sh"><h2>Save ${esc(CARDIO_MODES.find(m => m[0] === T.mode)[1].toLowerCase())}</h2><button class="iconbtn" data-a="close" aria-label="Discard">${I('x', 18)}</button></div>
      <div class="kpis" style="margin-bottom:10px"><div class="kpi"><span>Time</span><b class="num">${fmtDur(T.elapsed)}</b></div><div class="kpi"><span>Distance</span><b class="num">${fmt(km(T.distM), 2)} ${dU()}</b></div><div class="kpi"><span>Calories</span><b class="num">${st.kcal}</b></div></div>
      ${manual ? `<p class="muted small">Copy the numbers from the machine's display (leave any blank):</p>${meterFields(T)}` : ''}
      <div class="row" style="margin-top:12px"><button class="btn ghost" data-a="close">Discard</button><button class="btn brand" style="flex:1" data-a="tr-save">${I('check', 15)} Save workout</button></div>`, { tracker: true }, 'tall');
    sheetCleanup = () => stopTracker(true);
  }
  function meterFields(T = {}) {
    const isBike = T.mode !== 'treadmill';
    return `<div class="three"><div class="field"><label for="mrMin">Minutes</label><input id="mrMin" type="number" inputmode="decimal" min="1" value="${T.elapsed ? Math.round(T.elapsed / 60) : ''}"></div>
      <div class="field"><label for="mrDist">Distance (${dU()})</label><input id="mrDist" type="number" inputmode="decimal" step="0.01" min="0" value="${T.distM ? km(T.distM).toFixed(2) : ''}"></div>
      <div class="field"><label for="mrKcal">Calories</label><input id="mrKcal" type="number" inputmode="numeric" min="0"></div></div>
      <div class="three"><div class="field"><label for="mrHr">Avg heart rate</label><input id="mrHr" type="number" inputmode="numeric" min="30" max="230"></div>
      ${isBike ? `<div class="field"><label for="mrCad">Avg cadence (rpm)</label><input id="mrCad" type="number" inputmode="numeric" min="0" max="200"></div><div class="field"><label for="mrRes">Resistance / level</label><input id="mrRes" type="number" inputmode="numeric" min="0" max="100"></div>`
        : `<div class="field"><label for="mrInc">Incline (%)</label><input id="mrInc" type="number" inputmode="decimal" step="0.5" min="0" max="30"></div><div class="field"><label for="mrSpd">Avg speed (${sU()})</label><input id="mrSpd" type="number" inputmode="decimal" step="0.1" min="0"></div>`}</div>`;
  }
  function meterSheet() {
    openSheet(`<div class="sh"><h2>Machine meter reading</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div>
      <div class="field"><label for="mrMode">Machine</label><select id="mrMode">${[['indoor', 'Stationary / spin bike'], ['treadmill', 'Treadmill'], ['elliptical', 'Elliptical'], ['rower', 'Rowing machine'], ['stair', 'Stair climber']].map(o => `<option value="${o[0]}">${o[1]}</option>`).join('')}</select></div>
      ${meterFields({ mode: 'indoor' })}
      <button class="btn brand block" data-a="meter-save">${I('check', 15)} Save to today</button>
      <p class="note">Logged as a completed cardio workout${signedIn() ? ' and added to your Pedalz archive when it\'s a bike or walk' : ''}.</p>`, {}, 'tall');
  }
  async function saveCardio({ mode, title, minutes, distM, kcal: kc, hr, cad, res, incline, avgMs, maxMs, gainM, path, series, startedAt }) {
    const k = TODAY(), L = track(k, 'workout');
    const durS = Math.max(60, minutes * 60);
    const cardio = { mode, distM: Math.round(distM || 0), durS, avgMs: avgMs != null ? avgMs : (distM ? distM / durS : 0), maxMs: maxMs || 0, gainM: Math.round(gainM || 0), kcal: kc || APPS.meters.kcal(APPS.meters.met(mode === 'treadmill' ? 'walk' : ['elliptical', 'rower', 'stair'].includes(mode) ? 'indoor' : mode, (avgMs || (distM ? distM / durS : 0)) * 3.6), toKg(latestWeight()), durS / 3600), hr: hr || null, cad: cad || null, res: res || null, incline: incline || null };
    const ses = sessionFor(k), cardioSes = ses && ses.ex.some(n => (D.exercises.find(e => e.name === n) || {}).focus === 'cardio') && !isDone(k, ses.id);
    L.workouts.push({ pid: cardioSes ? ses.id : 'cardio-' + uid(), title: cardioSes ? ses.title : title, minutes: Math.round(minutes), cardio });
    if ((mode === 'walk' || mode === 'run' || mode === 'treadmill') && distM) L.steps += Math.round(distM / (mode === 'run' ? 1.1 : 0.76)); // estimated steps from distance
    save(k); toast(`${title} saved — ${cardio.kcal} kcal`);
    if (signedIn() && ['ride', 'indoor', 'walk', 'run', 'treadmill'].includes(mode)) APPS.pedalz.pushRide({ mode: mode === 'indoor' ? 'bike' : mode === 'ride' ? 'bike' : mode, startedAt: startedAt || Date.now() - durS * 1000, durS, distM: distM || 0, avgMs: cardio.avgMs, maxMs: maxMs || 0, gainM: gainM || 0, path, series }).then(id => { if (id) { S.links.pedalz.imported = [...(S.links.pedalz.imported || []), id]; L.workouts[L.workouts.length - 1].cardio.src = id; save(k); toast('Also saved to Pedalz'); } }).catch(() => { });
    groupAutoPost({ title });
    render();
  }
  const readMeter = () => { const n = id => { const e = $('#' + id); return e && e.value !== '' ? +e.value : null; }; return { min: n('mrMin'), dist: n('mrDist'), kcal: n('mrKcal'), hr: n('mrHr'), cad: n('mrCad'), res: n('mrRes'), inc: n('mrInc'), spd: n('mrSpd') }; };
  const fromDistU = v => v == null ? 0 : (imperial() ? v * 1609.34 : v * 1000);

  /* ---------- gear shop (Pedalz listings) + shops near me ---------- */
  function gearSheet() {
    if (signedIn() && ax.listings == null) axLoad('listings', () => APPS.pedalz.listings().then(r => r || false)).then(() => { if (sheetCtx.gear) gearSheet(); });
    const L = Array.isArray(ax.listings) ? ax.listings : [], mine = CLOUD.auth.user() && CLOUD.auth.user().id;
    const geo = S.geo, near = q => geo ? `https://www.google.com/maps/search/${encodeURIComponent(q)}/@${geo.lat},${geo.lon},13z` : `https://www.google.com/maps/search/${encodeURIComponent(q + ' near me')}`;
    openSheet(`<div class="sh"><h2>Gear shop</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div>
      <h3>Shops near you</h3><div class="chips" style="margin-bottom:12px">${[['Bike shops', 'bike shop'], ['Running stores', 'running store'], ['Fitness equipment', 'fitness equipment store'], ['Sporting goods', 'sporting goods store'], ['Bike repair', 'bike repair']].map(([n, q]) => `<button class="chip" data-a="open-ext" data-u="${esc(near(q))}">${I('pin', 12)} ${n}</button>`).join('')}</div>
      <div class="row between"><h3 style="margin:0">Pedalz community listings</h3>${signedIn() && ax.listings !== false ? `<button class="btn brand sm" data-a="gear-post">${I('plus', 13)} Sell gear</button>` : ''}</div>
      ${!signedIn() ? `<p class="muted small">Sign in with your Pedalz account to see and post listings.</p>` : ax.listings === false ? `<p class="muted small">The Pedalz Gear Shop isn't on this account yet. Use the same Supabase project for both apps (see README).</p>` : ax.listings == null ? '<p class="muted small">Loading…</p>'
        : L.length ? `<div class="gearlist">${L.map(g => `<div class="gearitem">${g.img ? `<img src="${esc(g.img)}" alt="" loading="lazy">` : `<div class="gimg">${I('bike', 26)}</div>`}<div style="min-width:0"><b>${esc(g.title)}</b><small class="muted">${esc(g.cond || '')} · ${esc(g.seller_name || 'Rider')}${g.scope === 'group' ? ' · group' : ''}</small></div><b class="num gprice">$${fmt(g.price, 2)}</b>${g.user_id === mine ? `<button class="x" data-a="gear-del" data-id="${g.id}" aria-label="Remove listing">${I('x', 14)}</button>` : ''}</div>`).join('')}</div>` : '<p class="muted small">No listings yet — be the first.</p>'}
      <div class="row" style="margin-top:12px"><a class="btn ghost sm" href="${esc(APPS.pedalz.url)}" target="_blank" rel="noopener">${I('ext', 13)} Open Pedalz Gear Shop</a></div>
      <p class="note">Meet in a public place and inspect gear before paying. WAYOF and Pedalz don't process payments.</p>`, { gear: true }, 'tall');
  }
  function gearPostSheet() {
    openSheet(`<div class="sh"><h2>Sell gear</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div>
      <div class="field"><label for="gT">What are you selling?</label><input id="gT" maxlength="80" placeholder="e.g. Road bike 56cm, Peloton shoes size 10" autofocus></div>
      <div class="two"><div class="field"><label for="gP">Price ($)</label><input id="gP" type="number" inputmode="decimal" min="0" step="1"></div><div class="field"><label for="gC">Condition</label><select id="gC">${['New', 'Like New', 'Good', 'Fair'].map(c => `<option>${c}</option>`).join('')}</select></div></div>
      <div class="field"><label for="gS">Who can see it</label><select id="gS"><option value="public">Everyone on Pedalz</option><option value="group">My Pedalz group</option></select></div>
      <div class="field"><label>Photo (optional)</label><label class="btn soft sm" style="cursor:pointer;width:max-content">${I('camera', 14)} Add photo<input type="file" accept="image/*" id="gImg" hidden></label><span class="muted tiny" id="gImgNote"></span></div>
      <button class="btn brand block" data-a="gear-save">${I('check', 15)} Post listing</button>`, { img: null }, 'tall');
  }

  /* ---------- appointments ---------- */
  function apptSheet() {
    openSheet(`<div class="sh"><h2>Add appointment</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div>
      <div class="field"><label for="apT">What</label><input id="apT" maxlength="100" placeholder="e.g. Physical with Dr. Lee, dentist cleaning" autofocus></div>
      <div class="two"><div class="field"><label for="apD">Date</label><input id="apD" type="date" value="${dkey(addDays(new Date(), 1))}"></div><div class="field"><label for="apH">Time</label><input id="apH" type="time" value="09:00"></div></div>
      <div class="field"><label for="apP">Place <span class="muted">(optional)</span></label><input id="apP" maxlength="120" placeholder="Clinic name or address"></div>
      <div class="two"><div class="field"><label for="apC">Type</label><select id="apC"><option value="Appointments">Appointment</option><option value="Health">Health (meds, labs, therapy…)</option></select></div><div class="field"><label for="apR">Remind me</label><select id="apR">${[[15, '15 min before'], [30, '30 min before'], [60, '1 hour before'], [120, '2 hours before'], [1440, '1 day before']].map(([v, l]) => `<option value="${v}" ${v === 60 ? 'selected' : ''}>${l}</option>`).join('')}</select></div></div>
      <div class="field"><label for="apN">Notes <span class="muted">(optional, stays private)</span></label><input id="apN" maxlength="300" placeholder="Bring insurance card, fasting since midnight…"></div>
      <button class="btn brand block" data-a="appt-save">${I('check', 15)} ${signedIn() && ax.appts !== false ? 'Save & add to Kayaos' : 'Save'}</button>
      <p class="note">${signedIn() && ax.appts !== false ? 'Kayaos will chime and speak a reminder on your phone.' : 'Saved in WAYOF. Sign in with your Kayaos account to get Kayaos reminders too.'}</p>`, {}, 'tall');
  }

  /* ---------- welcome / sign-up / login ---------- */
  function welcomeSheet() {
    openSheet(`<div class="welcome"><div class="logo" style="justify-content:center;font-size:24px"><div class="mark" style="width:48px;height:48px;border-radius:16px">${I('pulse', 28, 2.4)}</div></div>
      <h2 style="text-align:center;margin:14px 0 4px;font-size:24px">Welcome to WAYOF</h2><p class="muted" style="text-align:center;margin:0 0 16px">Your health, your way — coaching, workouts, meals and sleep in one place.</p>
      <ul class="ticks"><li>${I('check', 14)} AI coach that learns your habits</li><li>${I('check', 14)} Guided workouts with form check</li><li>${I('check', 14)} Sleep plan from your Kayaos work schedule</li><li>${I('check', 14)} RepliPlate clones & Pedalz rides in your log</li></ul>
      ${CLOUD.enabled ? `<button class="btn brand block" data-a="auth" data-m="up">${I('user', 15)} Create free account</button><button class="btn ghost block" style="margin-top:8px" data-a="auth" data-m="in">I already have an account</button>` : ''}
      <button class="btn ${CLOUD.enabled ? 'ghost' : 'brand'} block" style="margin-top:8px" data-a="welcome-skip">${CLOUD.enabled ? 'Continue without an account' : 'Get started'}</button>
      <p class="note" style="text-align:center">${CLOUD.enabled ? 'Use the same email you use for Kayaos, Pedalz or RepliPlate.' : 'Your data stays on this device.'}</p></div>`, { welcome: true });
  }
  function resetPwSheet() {
    openSheet(`<div class="sh"><h2>Set a new password</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div>
      <form data-form="newpw"><div class="field"><label for="npw">New password</label><input id="npw" type="password" minlength="8" autocomplete="new-password" required autofocus></div><div class="field"><label for="npw2">Confirm</label><input id="npw2" type="password" minlength="8" autocomplete="new-password" required></div><button class="btn brand block" type="submit">Save password</button></form>`);
  }
  function forgotSheet() {
    openSheet(`<div class="sh"><h2>Reset your password</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div>
      <p class="muted small" style="margin-top:0">We'll email you a link. Open it on this device to choose a new password.</p>
      <form data-form="forgot"><div class="field"><label for="fEmail">Email</label><input id="fEmail" type="email" required autocomplete="email" autofocus></div><button class="btn brand block" type="submit">${I('send', 14)} Send reset link</button></form>
      <div class="row" style="justify-content:center;margin-top:10px"><button class="btn ghost sm" data-a="auth" data-m="in">Back to log in</button></div>`);
  }

  /* ---------- incoming links: #import=kayaos:<b64> · #import=repli:<RepliPlate code> ---------- */
  async function handleImport() {
    const m = location.hash.match(/import=(kayaos|repli):([A-Za-z0-9_\-+/=%]+)/); if (!m) return false;
    history.replaceState(null, '', location.pathname + (m[1] === 'repli' ? '#nourish' : '#apps'));
    try {
      if (m[1] === 'kayaos') {
        const p = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(m[2])))));
        if (p.schema !== 'kayaos.wayof.v1') throw new Error('Unknown Kayaos data');
        S.links.kayaos.shifts = (p.shifts || []).filter(s => s.date).slice(0, 200); S.links.kayaos.appts = (p.appointments || []).slice(0, 60); S.links.kayaos.importedAt = Date.now(); save();
        { const a = S.links.kayaos.shifts.length, b = S.links.kayaos.appts.length; toast(`Imported ${a} shift${a === 1 ? '' : 's'} and ${b} appointment${b === 1 ? '' : 's'} from Kayaos`); }
      } else {
        const c = await APPS.repli.parse('#/m/' + decodeURIComponent(m[2]), D.clones);
        S.myClones = [c, ...(S.myClones || []).filter(x => x.name !== c.name)].slice(0, 40); save();
        ui.view = 'nourish'; ui.nTab = 'copycat'; ui.aiClone = c; toast(`${c.name} imported from RepliPlate`);
        setTimeout(() => { if (!sheetCtx.player) recipeSheet(c.id, guessSlot(), { asRest: true }); }, 450); // ready to log as eaten out or cooked at home
      }
    } catch (e) { toast('Could not read that link: ' + e.message); }
    return true;
  }

  /* ---------- sample data ---------- */
  function sampleData() {
    if (!S.plan.week.length) buildWeek();
    const today = new Date(); const imp = imperial(); let w = imp ? 184 : 83.5;
    const r = rng('sample' + TODAY());
    const pick = s => { const l = D.recipes.filter(x => x.slot === s); return l[Math.floor(r() * l.length)]; };
    for (let i = 20; i >= 0; i--) {
      const d = addDays(today, -i), k = dkey(d); if (hasData(k)) continue;
      const L = mutLog(k), base = new Date(d); base.setHours(7, 0, 0, 0);
      L.steps = Math.round((4500 + r() * 8000 - (dow(d) >= 5 ? 2000 : 0)) / 10) * 10; L.water = 4 + Math.floor(r() * 5); L.sleep = Math.round((6 + r() * 2.2) * 4) / 4;
      w -= (imp ? 0.12 : 0.055) + (r() - .5) * (imp ? .5 : .22); if (i % 2 === 0 || i < 3) L.weight = Math.round(w * 10) / 10;
      ['breakfast', 'lunch', 'dinner', 'snack'].forEach((s, j) => { if (i === 0 && j > 1) return; L.meals.push(mealFrom(pick(s), s, 1)); L.ev.push(['meal', +base + [1, 5.5, 12, 8][j] * 3600e3]); });
      for (let g = 0; g < L.water; g++) L.ev.push(['water', +base + (5 + g * 1.6) * 3600e3]);
      const ses = S.plan.week.find(s => s.dow === dow(d)); if (ses && r() > .25 && i > 0) { L.workouts.push({ pid: ses.id, title: ses.title, minutes: ses.minutes }); L.ev.push(['workout', +base + 11 * 3600e3 + r() * 1800e3]); }
    }
    if (S.body.goalWeight == null) { S.body.goalWeight = imp ? 170 : 77; S.body.heightCm = S.body.heightCm || 178; S.body.birthYear = S.body.birthYear || 1981; }
    if (!(S.fridge || []).length) S.fridge = [['Eggs', 6], ['Spinach', 1], ['Chicken breast', 2], ['Rice', 30], ['Greek yogurt', 4], ['Avocado', 2], ['Tomatoes', 3]].map(([n, dd]) => ({ id: uid(), name: n, exp: dkey(addDays(today, dd)) }));
    save(); toast('Sample data loaded — reset any time in Profile'); render();
  }
  const mealFrom = (r, slot, q) => ({ id: uid(), rid: r.id, slot, name: r.name, qty: q, kcal: Math.round(r.kcal * q), p: Math.round(r.p * q), c: Math.round(r.c * q), f: Math.round(r.f * q) });

  /* ---------- actions ---------- */
  const A = {
    go: el => { closeSheet(); go(el.dataset.v); },
    close: () => closeSheet(),
    backdrop: (el, e) => { if (e.target === el && !sheetCtx.player) closeSheet(); },
    more: () => moreSheet(),
    install: () => install(),
    'install-dismiss': () => { S.ui.hideInstall = true; save(); render(); },
    theme: () => { const dark = document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches); S.profile.theme = dark ? 'light' : 'dark'; save(); applyTheme(); renderChrome(); render(); },
    settheme: el => { S.profile.theme = el.dataset.t; save(); applyTheme(); renderChrome(); render(); },
    units: el => {
      if (S.profile.units === el.dataset.t) return; const toImp = el.dataset.t === 'imperial', f = toImp ? 2.20462 : 1 / 2.20462;
      Object.values(S.log).forEach(l => { if (l.weight != null) l.weight = Math.round(l.weight * f * 10) / 10; });
      ['goalWeight', 'startWeight'].forEach(k => { if (S.body[k] != null) S.body[k] = Math.round(S.body[k] * f * 10) / 10; });
      S.profile.units = el.dataset.t; S.wx = null; save(); render(); maybeRefreshWx(); toast('Units updated — weights converted');
    },
    day: el => { ui.date = el.dataset.k; renderHeader(); render(); },
    week: el => { ui.date = dkey(addDays(parseKey(ui.date), +el.dataset.n)); renderHeader(); render(); },
    'steps-add': el => { const L = track(ui.date, 'steps'); L.steps = Math.max(0, L.steps + +el.dataset.n); save(ui.date); render(); },
    'steps-edit': () => numSheet({ title: 'Steps', label: 'Total steps', value: getLog(ui.date).steps || '', step: 100, max: 100000, hint: 'Copy the number from your phone or watch.', onSave: v => { track(ui.date, 'steps').steps = Math.round(v || 0); } }),
    'sleep-edit': () => numSheet({ title: 'Sleep', label: 'Hours slept', unit: 'hours', value: getLog(ui.date).sleep, step: .25, max: 24, onSave: v => { track(ui.date, 'sleep').sleep = v; } }),
    'weight-edit': () => numSheet({ title: 'Weigh-in', label: 'Weight', unit: wUnit(), value: getLog(ui.date).weight, step: .1, max: 1500, onSave: v => { track(ui.date, 'weight').weight = v; } }),
    'budget-edit': () => numSheet({ title: 'Grocery budget', label: 'Weekly budget', unit: '$', value: S.budget, step: 5, max: 10000, onSave: v => { S.budget = v || 0; } }),
    'num-save': () => { const inp = $('#numIn'); if (inp.value !== '' && isNaN(+inp.value)) return toast('Enter a number'); const v = inp.value === '' ? null : clamp(+inp.value, sheetCtx.min, sheetCtx.max); sheetCtx.onSave(v); save(ui.date); closeSheet(); render(); },
    'num-clear': () => { sheetCtx.onSave(null); save(ui.date); closeSheet(); render(); },
    'water-set': el => { const L = track(ui.date, 'water'), n = +el.dataset.n; L.water = L.water === n ? n - 1 : n; save(ui.date); render(); },
    'water-add': el => { const L = track(ui.date, 'water'); L.water = clamp(L.water + +el.dataset.n, 0, 30); save(ui.date); render(); if (+el.dataset.n > 0 && L.water === S.profile.water) toast('Hydration goal reached'); },
    workout: el => {
      const k = el.dataset.k, pid = el.dataset.pid, s = S.plan.week.find(x => x.id === pid), L = mutLog(k);
      if (L.workouts.some(w => w.pid === pid)) L.workouts = L.workouts.filter(w => w.pid !== pid);
      else { track(k, 'workout'); L.workouts.push({ pid, title: s ? s.title : 'Workout', minutes: s ? s.minutes : 30 }); toast('Session complete — nice work'); groupAutoPost(s); }
      save(k); render();
    },
    player: el => openPlayer(el.dataset.k, el.dataset.pid),
    'pl-setdone': () => plSetDone(), 'pl-next': () => plNextEx(),
    'pl-prev': () => { if (!PL || PL.i === 0) return; clearInterval(PL.timer); PL.timer = null; PL.i--; PL.set = 1; PL.phase = 'work'; PL.left = 0; renderPlayer(); },
    'pl-skiprest': () => { clearInterval(PL.timer); PL.timer = null; PL.phase = 'work'; PL.left = 0; renderPlayer(); },
    'pl-timer': () => { const R = parseRx(PL.s.ex[PL.i]); PL.left = PL.left || R.secs; renderPlayer(); if (S.voice.countReps) speak('Go', { quiet: true }); plTick(() => { if (S.voice.countReps) speak('Time', { quiet: true }); plSetDone(); }); const b = $('[data-a="pl-timer"]'); if (b) b.outerHTML = `<button class="btn brand" style="flex:1" data-a="pl-setdone">${I('check', 15)} Done early</button>`; },
    'pl-fs': () => { toggleFullscreen(!PL.fs); },
    'pl-cam': () => { PL.camOn = !PL.camOn; if (!PL.camOn) stopCam(); else toast('Prop your phone up side-on, about 6–8 ft away'); renderPlayer(); },
    'pl-flip': () => { PL.facing = PL.facing === 'user' ? 'environment' : 'user'; stopCam(); PL.camOn = true; renderPlayer(); },
    rpe: el => { PL.rpe = el.dataset.v; document.querySelectorAll('[data-a=rpe]').forEach(b => b.classList.toggle('on', b === el)); },
    'player-finish': () => {
      const { k, pid, s } = PL, L = mutLog(k);
      if (!L.workouts.some(w => w.pid === pid)) { track(k, 'workout'); L.workouts.push({ pid, title: s.title, minutes: Math.max(5, Math.round((Date.now() - PL.startedAt) / 60000)), reps: PL.results, rpe: PL.rpe, tips: Object.fromEntries(Object.entries(PL.tips).map(([n, t]) => [n, mostCommon(t)])) }); groupAutoPost(s); }
      save(k); closeSheet(); toast('Workout saved'); render();
    },
    demo: el => demoSheet(el.dataset.n),
    avatar: el => { S.profile.style = el.dataset.style; save(); demoSheet(el.dataset.n); },
    say: el => speak(el.dataset.t),
    'meal-add': el => addMealSheet(el.dataset.slot),
    'meal-item': el => {
      const m = getLog(ui.date).meals.find(x => x.id === el.dataset.id); if (!m) return;
      openSheet(`<div class="sh"><h2>${esc(m.name)}</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div><div style="width:120px;margin:6px auto 12px">${mealArt(m)}</div>
        <div class="mstrip"><span><b>${m.kcal}</b>kcal</span><span><b>${m.p}g</b>Protein</span><span><b>${m.c}g</b>Carbs</span><span><b>${m.f}g</b>Fat</span></div>
        <div class="row" style="margin-top:18px">${m.rid && findRecipe(m.rid) ? `<button class="btn soft" style="flex:1" data-a="recipe" data-id="${m.rid}">View recipe</button>` : ''}<button class="btn ghost" style="flex:1;color:var(--bad)" data-a="meal-remove" data-id="${m.id}">Remove</button></div>`);
    },
    'meal-remove': el => { const L = mutLog(ui.date); L.meals = L.meals.filter(m => m.id !== el.dataset.id); save(ui.date); closeSheet(); render(); toast('Removed'); },
    recipe: el => { sheetCtx = {}; recipeSheet(el.dataset.id, el.dataset.slot); },
    serv: el => { sheetCtx.q = clamp((sheetCtx.q || 1) + +el.dataset.n, 0.5, 6); const sc = $('.sheet').scrollTop; recipeSheet(sheetCtx.rid, $('#rslot').value); $('.sheet').scrollTop = sc; },
    fav: el => { const id = el.dataset.id; S.favorites = S.favorites.includes(id) ? S.favorites.filter(x => x !== id) : [...S.favorites, id]; save(); const sc = $('.sheet').scrollTop; recipeSheet(id, $('#rslot') && $('#rslot').value); $('.sheet').scrollTop = sc; render(); },
    'recipe-log': el => { const r = findRecipe(el.dataset.id), slot = $('#rslot').value, q = sheetCtx.q || 1; const m = mealFrom(r, slot, q); if (sheetCtx.asRest && r.restCal && r.kcal) { const k = r.restCal / r.kcal; m.kcal = Math.round(r.restCal * q); m.p = Math.round(m.p * k); m.c = Math.round(m.c * k); m.f = Math.round(m.f * k); m.name = r.name + ' (restaurant)'; } track(ui.date, 'meal').meals.push(m); save(ui.date); closeSheet(); toast(`Added to ${slot}`); render(); },
    logas: el => { sheetCtx.asRest = el.dataset.v === '1'; const sc = $('.sheet').scrollTop; recipeSheet(sheetCtx.rid, $('#rslot').value); $('.sheet').scrollTop = sc; },
    'repli-open': async el => { const c = findRecipe(el.dataset.id); if (!c) return; const w = window.open('about:blank', '_blank'); const u = await APPS.repli.link(c); if (w) w.location = u; else location.href = u; },
    'repli-share': async el => { const c = findRecipe(el.dataset.id); if (!c) return; shareOrCopy(`${c.name} at home`, `${c.style} ${c.name}: $${(+c.homePrice || 0).toFixed(2)} at home vs $${(+c.restPrice || 0).toFixed(2)} out.`, await APPS.repli.link(c)); },
    cardio: el => { closeSheet(); openTracker(el.dataset.m); },
    'tr-start': () => trStart(),
    'tr-pause': () => { TR.state = 'paused'; clearInterval(TR.timer); renderTracker(); },
    'tr-stop': () => { if (TR.elapsed < 20 && !['indoor', 'treadmill'].includes(TR.mode)) { toast('Too short to save'); return; } trFinish(); },
    'tr-fs': async () => { TR.fs = !TR.fs; const sh = $('.sheet'); if (sh) sh.classList.toggle('fs', TR.fs); try { if (TR.fs && document.documentElement.requestFullscreen && !document.fullscreenElement) await document.documentElement.requestFullscreen(); else if (!TR.fs && document.fullscreenElement) await document.exitFullscreen(); } catch (e) { } },
    'tr-hr': async () => { try { TR.hrDev = await APPS.meters.connectHR(v => { if (TR) { TR.hr = v; trUpdate(); } }); toast('Heart-rate strap connected'); renderTracker(); } catch (e) { if (e.name !== 'NotFoundError') toast(e.message); } },
    'tr-bike': async () => { try { TR.bikeDev = await APPS.meters.connectBike(d => { if (!TR) return; if (d.speed != null) TR.speedMs = d.speed / 3.6; if (d.cadence != null) TR.cad = d.cadence; if (d.power != null) TR.power = d.power; if (d.distance != null) TR.distM = d.distance; if (d.kcal != null) TR.kcalDev = d.kcal; if (d.hr) TR.hr = d.hr; TR.maxMs = Math.max(TR.maxMs, TR.speedMs); trUpdate(); }); toast('Smart bike connected'); renderTracker(); } catch (e) { if (e.name !== 'NotFoundError') toast(e.message); } },
    'tr-save': () => {
      const T = TR, mr = $('#mrMin') ? readMeter() : {}; const label = CARDIO_MODES.find(m => m[0] === T.mode)[1];
      const minutes = mr.min || Math.max(1, Math.round(T.elapsed / 60)), distM = mr.dist != null ? fromDistU(mr.dist) : T.distM;
      const avgMs = mr.spd ? mr.spd / (imperial() ? 2.23694 : 3.6) : (distM ? distM / (minutes * 60) : 0);
      saveCardio({ mode: T.mode, title: label, minutes, distM, kcal: mr.kcal || trStats().kcal, hr: mr.hr || T.hr, cad: mr.cad || (T.cad != null ? Math.round(T.cad) : null), res: mr.res, incline: mr.inc, avgMs, maxMs: T.maxMs, gainM: T.gainM, path: T.path.slice(0, 2000), series: T.series, startedAt: T.startedAt });
      closeSheet();
    },
    meter: () => meterSheet(),
    'meter-save': () => { const mr = readMeter(), mode = $('#mrMode').value; if (!mr.min) return toast('Enter the minutes'); const names = { indoor: 'Stationary bike', treadmill: 'Treadmill', elliptical: 'Elliptical', rower: 'Rowing machine', stair: 'Stair climber' }; const distM = fromDistU(mr.dist); saveCardio({ mode, title: names[mode], minutes: mr.min, distM, kcal: mr.kcal, hr: mr.hr, cad: mr.cad, res: mr.res, incline: mr.inc, avgMs: mr.spd ? mr.spd / (imperial() ? 2.23694 : 3.6) : null }); closeSheet(); },
    gear: () => gearSheet(),
    'gear-post': () => gearPostSheet(),
    'gear-save': async () => { const t = $('#gT').value.trim(), p = +$('#gP').value; if (!t) return toast('Describe the item'); if (!(p >= 0) || $('#gP').value === '') return toast('Enter a price'); try { await APPS.pedalz.addListing({ title: t, price: p, cond: $('#gC').value, scope: $('#gS').value, img: sheetCtx.img, seller: S.profile.name || 'WAYOF member' }); ax.listings = null; toast('Listed in the Pedalz Gear Shop'); gearSheet(); } catch (e) { toast(e.message); } },
    'gear-del': async el => { try { await APPS.pedalz.removeListing(el.dataset.id); ax.listings = null; gearSheet(); } catch (e) { toast(e.message); } },
    'appt-add': () => apptSheet(),
    'appt-save': async () => {
      const title = $('#apT').value.trim(), date = $('#apD').value, time = $('#apH').value || '09:00'; if (!title || !date) return toast('Add what and when');
      const a = { id: uid(), title, date, time, place: $('#apP').value.trim(), cat: $('#apC').value, notes: $('#apN').value.trim() };
      let toK = false;
      if (signedIn()) { try { await APPS.kayaos.addCard({ title, category: a.cat, date, time, notes: a.notes, reminder: +$('#apR').value, place: a.place }); toK = true; ax.appts = null; } catch (e) { toast(e.message); } }
      if (!toK) S.apptsLocal = [...(S.apptsLocal || []), a].slice(-60);
      save(); closeSheet(); toast(toK ? 'Added — Kayaos will remind you' : 'Appointment saved'); render();
    },
    'kayaos-workout': async () => { const s = sessionFor(TODAY()); if (!s) return toast('No workout scheduled today'); if (!signedIn()) return toast('Sign in with your Kayaos account first'); const bw = bestWindow(); const hh = COACH.habits(S, 28).stats.workoutHour; const h = bw && bw.score >= 55 ? new Date(bw.t).getHours() : hh != null ? Math.round(hh) : 18; try { await APPS.kayaos.addCard({ title: `Workout: ${s.title} (${s.minutes} min)`, category: 'Health', date: TODAY(), time: `${pad(h)}:00`, notes: s.ex.join(', '), reminder: 15 }); toast(`Added to Kayaos for ${COACH.hr12(h)}`); } catch (e) { toast(e.message); } },
    'apps-refresh': () => { refreshApps(true); toast('Checking your apps…'); },
    forgot: () => forgotSheet(),
    google: async () => { try { await CLOUD.auth.google(); } catch (e) { toast(e.message); } },
    'pw-change': () => resetPwSheet(),
    'welcome-skip': () => { S.ui.onboarded = true; save(); closeSheet(); },
    shoplist: el => { const r = findRecipe(el.dataset.id); copyText(`${r.name} — shopping list\n` + fridgeMatch(r).missing.map(x => '• ' + x).join('\n'), 'Shopping list copied'); },
    'custom-log': el => {
      const name = $('#cf-name').value.trim(), k = +$('#cf-k').value;
      if (!name) return toast('Give the food a name'); if ($('#cf-k').value === '' || !(k >= 0)) return toast('Enter the calories');
      track(ui.date, 'meal').meals.push({ id: uid(), slot: el.dataset.slot, name: name.slice(0, 60), qty: 1, kcal: Math.round(k), p: Math.round(+$('#cf-p').value || 0), c: Math.round(+$('#cf-c').value || 0), f: Math.round(+$('#cf-f').value || 0) });
      save(ui.date); closeSheet(); toast('Food added'); render();
    },
    wmetric: el => { ui.weekMetric = el.dataset.m; render(); },
    ttab: el => { ui.trainTab = el.dataset.t; render(); },
    lfocus: el => { ui.libFocus = el.dataset.f; render(); },
    pgoal: el => { S.plan.goal = el.dataset.g; save(); render(); },
    pday: el => { ui.planDay = +el.dataset.d; render(); setTimeout(() => { const c = $('#sessionDetail'); if (c && innerWidth < 1180) c.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30); },
    generate: () => { buildWeek(); S.plan.trainerEdited = false; ui.trainTab = 'plan'; save(); render(); toast('Your weekly plan is ready'); },
    eq: el => { const x = el.dataset.x; S.equipment = S.equipment.includes(x) ? S.equipment.filter(y => y !== x) : [...S.equipment, x]; save(); render(); },
    'eq-add': () => { const x = $('#eqc').value.trim(); if (!x) return toast('Type an equipment name'); if (![...D.equipment, ...S.custom].some(y => y.toLowerCase() === x.toLowerCase())) S.custom.push(x); if (!S.equipment.includes(x)) S.equipment.push(x); save(); render(); toast('Equipment added'); },
    ntab: el => { ui.nTab = el.dataset.t; render(); },
    'shop-plan': () => buildShop(),
    'shop-set': el => { const sp = shopPrefs(), f = el.dataset.f, v = el.dataset.v; sp[f] = f === 'days' ? +v : v; save(); render(); },
    'shop-people': el => { const sp = shopPrefs(); sp.people = Math.max(1, Math.min(10, sp.people + +el.dataset.n)); save(); render(); },
    'shop-filter': el => { const sp = shopPrefs(), v = el.dataset.v; sp.filters = sp.filters.includes(v) ? sp.filters.filter(x => x !== v) : [...sp.filters, v]; save(); render(); },
    'shop-check': el => { const sp = shopPrefs(); sp.checked[el.dataset.k] = el.checked; save(); render(); },
    'shop-swap': el => swapShopMeal(+el.dataset.i),
    'shop-ic': () => shopInstacart('list'),
    'shop-recipe': el => shopInstacart('recipe', el.dataset.id),
    'shop-copy': () => { const p = shopPrefs().plan; if (p) copyText(SK.listText(`WAYOF groceries (~${money(p.total)} of ${money(p.budget)})`, p.items.filter(i => !shopPrefs().checked[i.key])), 'Grocery list copied'); },
    'shop-receipt': () => receiptSheet(),
    'shop-receipt-save': () => saveReceipt(),
    'shop-price': el => priceSheet(el.dataset.k),
    'ntab-go': el => { ui.nTab = el.dataset.t; go('nourish'); },
    nfilter: el => { ui.filter = el.dataset.f; render(); },
    cheap: () => { ui.cheap = !ui.cheap; render(); },
    'fridge-quick': el => { addFridge(el.dataset.n); },
    'fridge-del': el => { S.fridge = S.fridge.filter(f => f.id !== el.dataset.id); save(); render(); },
    'fridge-clear': () => { S.fridge = []; save(); render(); },
    'ai-fridge': () => aiFridge(),
    'clone-save': el => { const c = findRecipe(el.dataset.id); if (c) { S.myClones = [c, ...(S.myClones || []).filter(x => x.id !== c.id)].slice(0, 30); save(); toast('Clone saved'); render(); } },
    ptab: el => { ui.progTab = el.dataset.t; render(); },
    prange: el => { ui.range = +el.dataset.n; render(); },
    'photo-cam': () => photoCamSheet(),
    ppose: el => photoCamSheet(el.dataset.p, sheetCtx.facing, sheetCtx.timer),
    ptimer: el => { sheetCtx.timer = +el.dataset.t; document.querySelectorAll('[data-a=ptimer]').forEach(b => b.classList.toggle('on', b === el)); },
    pflip: () => photoCamSheet(sheetCtx.pose, sheetCtx.facing === 'user' ? 'environment' : 'user', sheetCtx.timer),
    psnap: () => snapPhoto(),
    'photo-pick': el => { const id = el.dataset.id; cmpSel = cmpSel.includes(id) ? cmpSel.filter(x => x !== id) : [...cmpSel, id].slice(-2); render(); if (cmpSel.length === 2) toast('Two selected — tap Compare'); },
    'photo-compare': () => { if (cmpSel.length < 2) return toast('Tap two photos to compare'); compareSheet(); },
    'photo-del': async el => { await VISION.photos.del(el.dataset.id); cmpSel = cmpSel.filter(x => x !== el.dataset.id); photoCache = null; render(); toast('Photo deleted'); },
    'wx-city': async () => {
      const city = $('#city').value.trim(); if (!city) return toast('Enter a city'); S.city = city; save();
      try { const r = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(city) + '&count=1'); const j = await r.json(); if (!j.results || !j.results.length) throw Error('City not found'); const x = j.results[0]; await fetchWx(x.latitude, x.longitude, `${x.name}${x.admin1 ? ', ' + x.admin1 : ''}`); }
      catch (e) { toast(e.message || 'Could not look up that city'); }
    },
    'wx-loc': () => { if (!navigator.geolocation) return toast('Location not supported'); navigator.geolocation.getCurrentPosition(p => fetchWx(+p.coords.latitude.toFixed(3), +p.coords.longitude.toFixed(3), 'Your location'), () => toast('Location permission denied or unavailable'), { timeout: 12000, maximumAge: 300000 }); },
    'wx-refresh': () => { if (S.geo) fetchWx(S.geo.lat, S.geo.lon, S.geo.label); },
    'coach-speak': () => speak(todayCoachLine()),
    stopvoice: () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); },
    style: el => { S.profile.style = el.dataset.s; save(); render(); },
    'chat-prompt': el => sendChat(el.dataset.t),
    'chat-clear': () => { S.chat = []; save(); render(); },
    'weekly-review': () => weeklyReview(),
    'feed-clear': () => { S.feed = []; save(); renderChrome(); render(); },
    'nudge-go': el => { const f = S.feed.find(x => x.id === el.dataset.id); if (!f) return; f.read = true; f.dismissed = true; save(); renderChrome(); if (f.action === 'water') A['water-add']({ dataset: { n: 1 } }); else if (f.action === 'train') { const s = sessionFor(TODAY()); s ? openPlayer(TODAY(), s.id) : go('train'); } else if (f.action === 'nourish') { ui.nTab = f.type === 'fridge' ? 'fridge' : 'recipes'; go('nourish'); } else if (f.action === 'coach' && f.type === 'weekly') weeklyReview(); else go(f.action || 'today'); },
    'nudge-dismiss': el => { const f = S.feed.find(x => x.id === el.dataset.id); if (f) { f.dismissed = true; f.read = true; } save(); renderChrome(); render(); },
    ntype: el => { const k = el.dataset.k; S.nudge.types[k] = !S.nudge.types[k]; save(); render(); },
    'notif-perm': async () => { try { const p = await Notification.requestPermission(); if (p === 'granted') { toast('Device alerts on'); if (LN) LN.enable('wayof').then(s => { ui.lnStatus = s; render(); }); const reg = await navigator.serviceWorker.getRegistration(); if (reg) reg.showNotification('WAYOF nudges are on', { body: 'I\'ll check in at the right moments — never during quiet hours.', icon: 'icon-192.png', tag: 'welcome' }); } } catch (e) { toast('Notifications unavailable here'); } render(); },
    'ln-enable': async () => { if (!LN) return; scheduleReminders(true); ui.lnStatus = await LN.enable('wayof'); toast(ui.lnStatus.registered ? 'Background reminders on' : 'Your browser didn\'t allow it yet. Use WAYOF for a few days and try again.'); render(); },
    'push-sub': async () => { try { if (Notification.permission !== 'granted' && (await Notification.requestPermission()) !== 'granted') return toast('Allow notifications first'); await CLOUD.subscribePush({ quietStart: +S.nudge.quietStart, quietEnd: +S.nudge.quietEnd, max: +S.nudge.max, types: S.nudge.types, style: S.profile.style }); toast('Background AI nudges on'); } catch (e) { toast(e.message); } },
    'body-edit': () => bodySheet(),
    goalby: el => { const b = S.body; if (collectBody() === false) return; b.focus = sheetCtx.focus.slice(); b.goalBy = el.dataset.t; save(TODAY()); bodySheet(); },
    focus: el => { const k = el.dataset.k, f = sheetCtx.focus; const i = f.indexOf(k); i >= 0 ? f.splice(i, 1) : f.push(k); el.classList.toggle('on', i < 0); el.setAttribute('aria-pressed', i < 0); },
    'body-save': () => { if (collectBody() === false) return; S.body.focus = sheetCtx.focus.slice(); save(TODAY()); closeSheet(); toast(S.plan.week.length && S.body.focus.length ? 'Saved — rebuild your week in Train to apply focus areas' : 'Body & goals saved'); render(); },
    'apply-est': () => { const e = energyEstimate(); if (!e || e.minor) return; S.profile.kcal = e.target; S.profile.protein = e.protein; const fatG = Math.round(e.target * 0.28 / 9); S.profile.fat = fatG; S.profile.carbs = Math.max(50, Math.round((e.target - e.protein * 4 - fatG * 9) / 4)); save(); render(); toast('Daily targets updated'); },
    auth: el => authSheet(el.dataset.m || 'in'),
    magic: async () => { const e = $('#aEmail').value.trim(); if (!e) return toast('Enter your email first'); try { await CLOUD.auth.magic(e); toast('Check your email for a sign-in link'); closeSheet(); } catch (x) { toast(x.message); } },
    signout: async () => { await CLOUD.auth.signOut(); Object.keys(cc).forEach(k => k !== 'loading' && (cc[k] = null)); toast('Signed out — your data stays on this device'); renderChrome(); render(); },
    'sync-now': async () => { try { await CLOUD.pushAll(S); toast('Synced'); render(); } catch (e) { toast(e.message); } },
    'tl-create': async () => { try { const n = ($('#tname') || {}).value || ''; const r = await CLOUD.trainer.create(n.trim()); cc.links = null; const base = location.origin + location.pathname.replace(/[^/]*$/, '') + 'trainer.html#t='; shareOrCopy('My WAYOF plan', `Here's my WAYOF training plan — you can review it and send notes:`, base + (r.token || r)); render(); } catch (e) { toast(e.message); } },
    'tl-share': el => shareOrCopy('My WAYOF plan', 'Here\'s my WAYOF training plan — review it and send notes:', el.dataset.u),
    'tl-revoke': async el => { try { await CLOUD.trainer.revoke(el.dataset.id); cc.links = null; toast('Access revoked'); render(); } catch (e) { toast(e.message); } },
    'tn-read': async () => { try { await CLOUD.trainer.markRead(cc.notes.filter(n => !n.read).map(n => n.id)); cc.notes = null; render(); } catch (e) { toast(e.message); } },
    'tn-apply': el => {
      const n = (cc.notes || []).find(x => x.id === el.dataset.id); const wk = n && n.plan_patch && n.plan_patch.week;
      if (!Array.isArray(wk)) return toast('No plan changes in this note');
      const valid = wk.filter(s => s && Number.isInteger(+s.dow) && s.dow >= 0 && s.dow < 7 && Array.isArray(s.ex)).map((s, i) => ({ id: 't' + i + uid(), dow: +s.dow, title: String(s.title || 'Session').slice(0, 60), minutes: clamp(+s.minutes || 30, 5, 180), ex: s.ex.map(String).filter(x => D.exercises.some(e => e.name === x)).slice(0, 8), note: s.note ? String(s.note).slice(0, 280) : '' }));
      if (!valid.length) return toast('Plan changes were empty');
      S.plan.week = valid; S.plan.trainerEdited = true; save(); CLOUD.trainer.markRead([n.id]).catch(() => { }); cc.notes = null; toast('Trainer plan applied'); ui.trainTab = 'plan'; render();
    },
    grp: el => { ui.group = el.dataset.id; cc.board = null; render(); },
    gmetric: el => { ui.groupMetric = el.dataset.m; render(); },
    'grp-create': async el => { const n = $('#gName').value.trim(); if (!n) return toast('Name your group'); try { const r = await CLOUD.groups.create(n, el.dataset.k); cc.groups = null; ui.group = r.id || r; toast('Created — share the invite code'); render(); } catch (e) { toast(e.message); } },
    'grp-join': async () => { const c = $('#gCode').value.trim(); if (c.length < 4) return toast('Enter the invite code'); try { const r = await CLOUD.groups.join(c, S.profile.name); cc.groups = null; ui.group = r.id || r; toast('Joined!'); render(); } catch (e) { toast(e.message); } },
    'grp-invite': el => shareOrCopy('Join me on WAYOF', `Join "${el.dataset.n}" on WAYOF with code ${el.dataset.c}`, location.origin + location.pathname + '#together?join=' + el.dataset.c),
    'grp-leave': async el => { try { await CLOUD.groups.leave(el.dataset.id); cc.groups = null; ui.group = null; cc.board = null; render(); } catch (e) { toast(e.message); } },
    gshare: async el => { const g = (cc.groups || []).find(x => x.id === ui.group); if (!g) return; g.share = { ...(g.share || {}), [el.dataset.k]: el.checked }; try { await CLOUD.groups.setShare(g.id, g.share); cc.board = null; render(); } catch (e) { toast(e.message); } },
    cheer: async el => { try { await CLOUD.groups.post(ui.group, 'cheer', `cheered ${el.dataset.n}!`, S.profile.name || 'Member'); cc.board = null; toast('Cheer sent'); render(); } catch (e) { toast(e.message); } },
    'kayaos-toggle': el => { S.share.kayaos = el.checked; save(); render(); if (el.checked && signedIn()) CLOUD.pushHealthSummary(S).then(() => toast('Shared with Kayaos')).catch(e => toast(e.message)); },
    'kayaos-field': el => { const k = el.dataset.k; S.share.kayaosFields[k] = !S.share.kayaosFields[k]; save(); render(); },
    'kayaos-sync': async () => { try { await CLOUD.pushHealthSummary(S); toast('Kayaos health updated'); } catch (e) { toast(e.message); } },
    'kayaos-link': () => { const u = (CLOUD.config.KAYAOS_URL || 'https://kayaos.space').replace(/\/$/, '') + '/#health-import=' + encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(CLOUD.healthSummary(S)))))); window.open(u, '_blank', 'noopener'); },
    covtab: el => { ui.covTab = el.dataset.t; render(); },
    'open-ext': el => { const w = window.open(el.dataset.u, 'wayof-ext', 'noopener'); if (!w) location.href = el.dataset.u; },
    export: () => { const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' }), url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'wayof-data.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); },
    reset: () => openSheet(`<div class="sh"><h2>Reset all data?</h2><button class="iconbtn" data-a="close" aria-label="Close">${I('x', 18)}</button></div><p class="muted">Deletes your profile, plan, logs, photos and favorites from this device${signedIn() ? ' (your cloud copy stays until you delete your account)' : ''}. Export first if you want a copy.</p><div class="row"><button class="btn ghost" style="flex:1" data-a="close">Cancel</button><button class="btn" style="flex:1;background:var(--bad);color:#fff" data-a="reset-yes">Delete everything</button></div>`),
    'reset-yes': async () => { localStorage.removeItem(KEY); localStorage.removeItem('wayof-v5'); try { await VISION.photos.clear(); } catch (e) { } location.reload(); },
    sample: () => sampleData(),
    quick: () => quickSheet(),
    q: el => {
      const q = el.dataset.q; closeSheet();
      if (q === 'meal') addMealSheet(guessSlot());
      else if (q === 'water') { const L = track(ui.date, 'water'); L.water++; save(ui.date); render(); toast(`Water: ${L.water} of ${S.profile.water} glasses`); }
      else if (q === 'steps') A['steps-edit'](); else if (q === 'weight') A['body-edit'](); else if (q === 'sleep') A['sleep-edit']();
      else if (q === 'photo') photoCamSheet(); else if (q === 'fridge') { ui.nTab = 'fridge'; go('nourish'); setTimeout(() => $('#fItem') && $('#fItem').focus(), 80); } else if (q === 'coach') go('coach');
      else if (q === 'workout') { const s = sessionFor(ui.date); if (s && !isDone(ui.date, s.id)) openPlayer(ui.date, s.id); else { ui.trainTab = 'plan'; go('train'); toast(s ? 'Already completed' : S.plan.week.length ? 'No session scheduled for this day' : 'Build your plan first'); } }
    }
  };
  function collectBody() {
    const b = S.body, num = id => { const e = $('#' + id); return e && e.value !== '' ? +e.value : null; };
    const w = num('bW'); if (w != null) { if (w < 40 || w > 1400) { toast('Check the weight value'); return false; } const L = track(TODAY(), 'weight'); L.weight = Math.round(w * 10) / 10; if (b.startWeight == null) b.startWeight = firstWeight(); }
    if ($('#bFt')) { const ft = num('bFt'), inch = num('bIn') || 0; b.heightCm = ft ? Math.round((ft * 12 + inch) * 2.54 * 10) / 10 : b.heightCm; } else if ($('#bCm')) { const cm = num('bCm'); if (cm) b.heightCm = cm; }
    const y = num('bY'); if (y) b.birthYear = y; if ($('#bSex')) b.sex = $('#bSex').value; if ($('#bAct')) b.activity = $('#bAct').value;
    if ($('#bG')) { const g = num('bG'); b.goalWeight = g; } else if ($('#bGB')) { const gb = num('bGB'); if (gb != null) { if (!b.heightCm) { toast('Add your height to set a BMI goal'); return false; } b.goalWeight = Math.round(weightForBmi(gb) * 10) / 10; } }
    if ($('#bD')) b.targetDate = $('#bD').value || '';
    if (b.goalWeight != null && b.startWeight == null) b.startWeight = latestWeight();
    return true;
  }
  function addFridge(name, exp) { name = String(name || '').trim().slice(0, 40); if (!name) return; if ((S.fridge || []).some(f => f.name.toLowerCase() === name.toLowerCase())) return toast('Already in your fridge'); S.fridge = [...(S.fridge || []), { id: uid(), name, exp: exp || '' }]; save(); render(); }
  function groupAutoPost(s) { if (!signedIn() || !Array.isArray(cc.groups)) return; cc.groups.filter(g => g.share && g.share.post_workouts).forEach(g => CLOUD.groups.post(g.id, 'workout', `finished ${s ? s.title : 'a workout'}`, S.profile.name || 'Member').catch(() => { })); }

  /* ---------- events ---------- */
  document.addEventListener('click', e => { const el = e.target.closest('[data-a]'); if (!el) return; const fn = A[el.dataset.a]; if (fn) { if (el.tagName === 'A') return; if (el.tagName === 'INPUT' && el.type === 'checkbox') { fn(el, e); return; } e.preventDefault(); fn(el, e); } });
  document.addEventListener('change', async e => {
    const el = e.target;
    if (el.id === 'clonePhoto' && el.files[0]) { try { const b64 = await resizeImage(el.files[0]); aiClone('', { media_type: 'image/jpeg', data: b64 }); } catch (x) { toast('Could not read that photo'); } el.value = ''; return; }
    if (el.id === 'mealPhoto' && el.files[0]) { closeSheet(); try { const b64 = await resizeImage(el.files[0]); ui.nTab = 'copycat'; if (ui.view !== 'nourish' && ui.view !== 'apps') go('nourish'); toast('Reading your meal…'); aiClone('', { media_type: 'image/jpeg', data: b64 }, { log: true }); } catch (x) { toast('Could not read that photo'); } el.value = ''; return; }
    if (el.id === 'gImg' && el.files[0]) { try { sheetCtx.img = 'data:image/jpeg;base64,' + await resizeImage(el.files[0], 640); const n = $('#gImgNote'); if (n) n.textContent = ' Photo added'; } catch (x) { toast('Could not read that photo'); } return; }
    if (el.id === 'photoFile' && el.files[0]) { await savePhoto(el.files[0], 'front'); toast('Photo saved'); el.value = ''; return; }
    if (el.dataset.cov != null) { const p = ui.cov[+el.dataset.cov], f = el.dataset.f; p[f] = f === 'name' ? el.value.slice(0, 24) : Math.max(0, +el.value || 0); render(); return; }
    const path = el.dataset.bind; if (!path) return;
    const parts = path.split('.'); let o = S; for (let i = 0; i < parts.length - 1; i++) o = o[parts[i]];
    const key = parts[parts.length - 1];
    let v = el.type === 'checkbox' ? el.checked : el.type === 'number' ? Math.max(0, +el.value || 0) : el.value;
    if (['plan.days', 'plan.minutes', 'nudge.quietStart', 'nudge.quietEnd', 'nudge.max', 'shop.day', 'shop.hour'].includes(path)) v = +v;
    if (path.startsWith('shop.') || path.startsWith('nudge.')) scheduleReminders();
    if (path === 'profile.name') v = String(v).trim().slice(0, 45);
    o[key] = v; save();
    if (path === 'profile.name') renderHeader();
    else if (path.startsWith('profile.')) toast('Target updated');
    if (path === 'surface') render();
    if (path === 'nudge.enabled' || path === 'share.photoBackup') render();
  });
  let inputT;
  document.addEventListener('input', e => {
    const el = e.target, k = el.dataset.in; if (!k) return;
    if (k === 'msearch') { const t = el.value.toLowerCase(); document.querySelectorAll('#mlist [data-name]').forEach(b => (b.hidden = !b.dataset.name.includes(t))); return; }
    clearTimeout(inputT);
    inputT = setTimeout(() => {
      if (k === 'eqsearch') ui.eqSearch = el.value; if (k === 'kitchen') ui.kitchen = el.value;
      const id = el.id, pos = el.selectionStart; render(); const n = document.getElementById(id); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (x) { } }
    }, 220);
  });
  document.addEventListener('submit', async e => {
    const f = e.target.closest('[data-form]'); if (!f) return; e.preventDefault();
    const kind = f.dataset.form;
    if (kind === 'repli-import') { try { const c = await APPS.repli.parse($('#rpLink').value, D.clones); S.myClones = [c, ...(S.myClones || []).filter(x => x.name !== c.name)].slice(0, 40); save(); ui.aiClone = c; ui.nTab = 'copycat'; toast(`${c.name} imported`); go('nourish'); } catch (x) { toast(x.message); } }
    if (kind === 'forgot') { try { await CLOUD.auth.reset($('#fEmail').value.trim()); toast('Check your email for the reset link'); closeSheet(); } catch (x) { toast(x.message); } }
    if (kind === 'newpw') { const a = $('#npw').value, b = $('#npw2').value; if (a.length < 8) return toast('Use at least 8 characters'); if (a !== b) return toast('Passwords don\'t match'); try { await CLOUD.auth.updatePassword(a); toast('Password updated'); closeSheet(); } catch (x) { toast(x.message); } }
    if (kind === 'shop-receipt') return saveReceipt();
    if (kind === 'chat') { const i = $('#chatIn'); const t = i.value; i.value = ''; sendChat(t); }
    if (kind === 'fridge') { addFridge($('#fItem').value, $('#fExp').value); setTimeout(() => $('#fItem') && $('#fItem').focus(), 30); }
    if (kind === 'clone') { const q = $('#cloneQ').value.trim(); if (q) aiClone(q); }
    if (kind === 'checkin') { const t = $('#ciText').value.trim(); if (!t) return; try { await CLOUD.groups.post(ui.group, 'checkin', t, S.profile.name || 'Member'); cc.board = null; render(); } catch (x) { toast(x.message); } }
    if (kind === 'auth') {
      const mode = f.dataset.mode, email = $('#aEmail').value.trim(), pw = $('#aPw').value;
      try {
        if (mode === 'up') { if (pw.length < 8) return toast('Use at least 8 characters'); const nm = ($('#aName') || {}).value || ''; if (nm) { S.profile.name = nm.trim(); save(); } const r = await CLOUD.auth.signUp(email, pw, nm); toast(r.session ? 'Account created' : 'Check your email to confirm your account'); }
        else { if (!pw) return A.magic(); await CLOUD.auth.signIn(email, pw); toast('Signed in'); }
        S.ui.onboarded = true; save(); closeSheet();
      } catch (x) { toast(x.message); }
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'city') A['wx-city'](); if (e.key === 'Enter' && e.target.id === 'eqc') A['eq-add'](); if (e.key === 'Enter' && e.target.id === 'numIn') A['num-save'](); });

  /* ---------- router ---------- */
  function go(v) { if (!VIEWS.some(x => x[0] === v)) v = 'today'; if (location.hash.slice(1).split('?')[0] !== v) location.hash = v; else { ui.view = v; renderChrome(); render(); scrollTo(0, 0); } }
  function route() {
    const [v, qs] = location.hash.slice(1).split('?'); ui.view = VIEWS.some(x => x[0] === v) ? v : 'today';
    const join = qs && new URLSearchParams(qs).get('join');
    if (join && ui.view === 'together') setTimeout(() => { const i = $('#gCode'); if (i) { i.value = join; toast('Tap Join to accept the invite'); } }, 300);
  }
  window.addEventListener('hashchange', async () => { if (/import=/.test(location.hash)) { await handleImport(); } route(); if (!sheetCtx.player) closeSheet(); if (ui.view === 'coach') { S.feed.forEach(f => (f.read = true)); save(); } renderChrome(); render(); scrollTo(0, 0); });
  function render() {
    charts = []; artN = 0; DEMO.setLook(S.profile.style);
    const v = { today: vToday, coach: vCoach, train: vTrain, nourish: vNourish, together: vTogether, progress: vProgress, atmosphere: vAtmosphere, apps: vApps, coverage: vCoverage, profile: vProfile }[ui.view] || vToday;
    $('#view').innerHTML = v();
    drawCharts();
    document.title = (ui.view === 'today' ? 'Today' : VIEWS.find(x => x[0] === ui.view)[2]) + ' · WAYOF';
    if (ui.view === 'coach') scrollChat();
  }
  let rT; window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(drawCharts, 120); });
  let lastDay = TODAY();
  setInterval(() => { if (TODAY() !== lastDay) { if (ui.date === lastDay) ui.date = TODAY(); lastDay = TODAY(); renderHeader(); render(); } runNudges(); }, 60000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { maybeRefreshWx(); runNudges(); } else scheduleReminders(true); });
  if (navigator.serviceWorker) navigator.serviceWorker.addEventListener('message', e => { if (e.data && e.data.type === 'nav' && e.data.view) go(e.data.view); });

  /* ---------- cloud: auth + sync ---------- */
  async function mergeFromCloud() {
    try {
      const { state, logs } = await CLOUD.pull(S);
      if (state) { ['profile', 'plan', 'equipment', 'custom', 'favorites', 'fridge', 'budget', 'city', 'geo', 'voice', 'reminders', 'nudge', 'share', 'body', 'links', 'apptsLocal', 'myClones', 'shop'].forEach(k => { if (state[k] != null) S[k] = Array.isArray(state[k]) ? state[k] : (typeof state[k] === 'object' ? { ...S[k], ...state[k] } : state[k]); }); }
      (logs || []).forEach(r => { const local = S.log[r.day]; if (!local || !hasData(r.day)) S.log[r.day] = { ...emptyLog(), ...r.data }; });
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { }
      await CLOUD.pushAll(S);
    } catch (e) { console.warn('merge', e); }
    applyTheme(); renderChrome(); render();
  }
  CLOUD.ready.then(ok => { if (!ok) return; CLOUD.auth.onChange(u => { Object.keys(cc).forEach(k => k !== 'loading' && (cc[k] = null)); if (u) { mergeFromCloud(); refreshApps(true); } else { renderChrome(); render(); } }); CLOUD.auth.onRecovery(() => setTimeout(resetPwSheet, 300)); if (CLOUD.auth.user()) mergeFromCloud(); else { renderChrome(); render(); } });

  // init
  applyTheme();
  handleImport().then(imp => { route(); renderChrome(); render(); if (!imp && !S.ui.onboarded && !/access_token|type=recovery/.test(location.hash)) setTimeout(welcomeSheet, 400); });
  route();
  renderChrome(); render();
  maybeRefreshWx(); setTimeout(runNudges, 4000);
  window.WAYOF = { state: () => S, render, go, runNudges };
})();
