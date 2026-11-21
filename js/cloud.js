/* WAYOF v7 — Supabase layer: auth, sync, AI coach, groups/partners, trainer links, Kayaos health share, web push.
   Everything is optional: with an empty config.js the app runs in local mode. */
window.WAYOF_CLOUD = (function () {
  const C = window.WAYOF_CONFIG || {};
  const enabled = !!(C.SUPABASE_URL && C.SUPABASE_ANON_KEY);
  let sb = null, user = null, listeners = [], recovery = [];
  const SDK = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';

  function loadSDK() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    return new Promise((res, rej) => { const s = document.createElement('script'); s.src = SDK; s.onload = res; s.onerror = () => rej(new Error('Could not load Supabase (offline?)')); document.head.appendChild(s); });
  }
  const ready = !enabled ? Promise.resolve(false) : loadSDK().then(async () => {
    sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    const { data } = await sb.auth.getSession(); user = data.session ? data.session.user : null;
    sb.auth.onAuthStateChange((ev, session) => { const was = user && user.id; user = session ? session.user : null; if (ev === 'PASSWORD_RECOVERY') recovery.forEach(f => f()); if ((user && user.id) !== was) listeners.forEach(f => f(user)); });
    return true;
  }).catch(e => { console.warn(e); return false; });

  const need = () => { if (!sb) throw new Error('Cloud not connected — add your Supabase keys to config.js'); if (!user) throw new Error('Sign in first'); };
  const chk = ({ data, error }) => { if (error) throw new Error(error.message || 'Request failed'); return data; };

  /* auth */
  const auth = {
    onChange: f => listeners.push(f),
    user: () => user,
    async signUp(email, password, name) { if (!sb) throw new Error('Cloud not connected'); const r = await sb.auth.signUp({ email, password, options: { data: { display_name: name || '' }, emailRedirectTo: location.origin + location.pathname } }); chk(r); return r.data; },
    async signIn(email, password) { if (!sb) throw new Error('Cloud not connected'); return chk(await sb.auth.signInWithPassword({ email, password })); },
    async magic(email) { if (!sb) throw new Error('Cloud not connected'); return chk(await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + location.pathname } })); },
    async signOut() { if (sb) await sb.auth.signOut(); user = null; listeners.forEach(f => f(null)); },
    onRecovery: f => recovery.push(f),
    async reset(email) { if (!sb) throw new Error('Cloud not connected'); return chk(await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname })); },
    async updatePassword(password) { if (!sb) throw new Error('Cloud not connected'); return chk(await sb.auth.updateUser({ password })); },
    async updateName(name) { if (!sb || !user) return; await sb.auth.updateUser({ data: { display_name: name } }); await sb.from('profiles').update({ display_name: name }).eq('id', user.id); },
    async google() { if (!sb) throw new Error('Cloud not connected'); return chk(await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + location.pathname } })); }
  };

  /* sync — app state + daily logs (last-write-wins per day) */
  let dirtyDays = new Set(), stateDirty = false, timer = null, lastSync = null;
  const pickState = S => ({ profile: S.profile, plan: S.plan, equipment: S.equipment, custom: S.custom, favorites: S.favorites, fridge: S.fridge, budget: S.budget, city: S.city, geo: S.geo, voice: S.voice, reminders: S.reminders, nudge: S.nudge, share: S.share, body: S.body, links: S.links, apptsLocal: S.apptsLocal, myClones: S.myClones });
  function markDirty(dayKey, getS) { if (!sb || !user) return; if (dayKey) dirtyDays.add(dayKey); stateDirty = true; clearTimeout(timer); timer = setTimeout(() => flush(getS()).catch(e => console.warn('sync', e)), 1500); }
  async function flush(S) {
    if (!sb || !user) return;
    const days = [...dirtyDays]; dirtyDays.clear();
    if (stateDirty) { stateDirty = false; chk(await sb.from('app_state').upsert({ user_id: user.id, data: pickState(S), updated_at: new Date().toISOString() })); }
    if (days.length) chk(await sb.from('daily_logs').upsert(days.map(d => ({ user_id: user.id, day: d, data: S.log[d] || {}, updated_at: new Date().toISOString() }))));
    lastSync = new Date();
    if (S.share && S.share.kayaos) await pushHealthSummary(S).catch(() => { });
  }
  async function pull(S) {
    need();
    const st = chk(await sb.from('app_state').select('data,updated_at').eq('user_id', user.id).maybeSingle());
    const since = new Date(Date.now() - 120 * 864e5).toISOString().slice(0, 10);
    const logs = chk(await sb.from('daily_logs').select('day,data').eq('user_id', user.id).gte('day', since));
    return { state: st && st.data, logs: logs || [] };
  }
  async function pushAll(S) { need(); Object.keys(S.log).forEach(d => dirtyDays.add(d)); stateDirty = true; await flush(S); }

  /* AI coach (Supabase Edge Function "coach" → Claude) */
  async function coach(action, payload) {
    need();
    const { data, error } = await sb.functions.invoke('coach', { body: { action, ...payload } });
    if (error) { let msg = error.message; try { const b = await error.context.json(); msg = b.error || msg; } catch (e) { } throw new Error(msg); }
    return data;
  }

  /* groups & partners */
  const groups = {
    async mine() { need(); return chk(await sb.rpc('my_groups')); },
    async create(name, kind) { need(); return chk(await sb.rpc('create_group', { p_name: name, p_kind: kind })); },
    async join(code, displayName) { need(); return chk(await sb.rpc('join_group', { p_code: code.trim().toUpperCase(), p_display_name: displayName || '' })); },
    async leave(gid) { need(); chk(await sb.from('group_members').delete().eq('group_id', gid).eq('user_id', user.id)); },
    async board(gid, since) { need(); return chk(await sb.rpc('group_board', { p_group: gid, p_since: since })); },
    async feed(gid) { need(); return chk(await sb.from('group_feed').select('id,user_id,display_name,kind,text,created_at').eq('group_id', gid).order('created_at', { ascending: false }).limit(40)); },
    async post(gid, kind, text, displayName) { need(); return chk(await sb.from('group_feed').insert({ group_id: gid, user_id: user.id, display_name: displayName || 'Member', kind, text: String(text).slice(0, 280) })); },
    async setShare(gid, share) { need(); chk(await sb.from('group_members').update({ share }).eq('group_id', gid).eq('user_id', user.id)); }
  };

  /* trainer links */
  const trainer = {
    async create(trainerName) { need(); return chk(await sb.rpc('create_trainer_link', { p_trainer_name: trainerName || '' })); },
    async links() { need(); return chk(await sb.from('trainer_links').select('id,token,trainer_name,active,created_at').eq('user_id', user.id).order('created_at', { ascending: false })); },
    async revoke(id) { need(); chk(await sb.from('trainer_links').update({ active: false }).eq('id', id).eq('user_id', user.id)); },
    async notes() { need(); return chk(await sb.from('trainer_notes').select('id,note,plan_patch,created_at,read,link_id').eq('user_id', user.id).order('created_at', { ascending: false }).limit(30)); },
    async markRead(ids) { need(); if (ids.length) chk(await sb.from('trainer_notes').update({ read: true }).in('id', ids)); },
    // used by trainer.html (no account needed — the secret token is the key)
    async view(token) { if (!sb) throw new Error('Cloud not connected'); return chk(await sb.rpc('trainer_view', { p_token: token })); },
    async send(token, note, plan) { if (!sb) throw new Error('Cloud not connected'); return chk(await sb.rpc('trainer_send', { p_token: token, p_note: note, p_plan: plan || null })); }
  };

  /* Kayaos health section — writes a compact summary Kayaos can read (same Supabase project) */
  function healthSummary(S) {
    const pad = n => String(n).padStart(2, '0'), d = new Date(), key = x => `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
    const days = []; for (let i = 6; i >= 0; i--) { const dd = new Date(d); dd.setDate(d.getDate() - i); const k = key(dd), l = S.log[k] || {}; const kc = (l.meals || []).reduce((a, m) => a + m.kcal, 0); days.push({ day: k, steps: l.steps || 0, water: l.water || 0, sleep: l.sleep == null ? null : l.sleep, kcal: S.share.kayaosFields.nutrition ? kc : null, workouts: (l.workouts || []).map(w => w.title), weight: S.share.kayaosFields.weight ? (l.weight == null ? null : l.weight) : null }); }
    const dowi = (d.getDay() + 6) % 7, ses = S.plan.week.find(s => s.dow === dowi);
    const extra = window.WAYOF_APPS ? window.WAYOF_APPS.summaryExtra() : {};
    return {
      ...extra,
      schema: 'wayof.health.v1', source: 'thewayof.health', generated_at: new Date().toISOString(), units: S.profile.units,
      goals: { steps: S.profile.steps, water_glasses: S.profile.water, sleep_h: S.profile.sleep, kcal: S.share.kayaosFields.nutrition ? S.profile.kcal : null },
      today: days[6], last7: days,
      reminders: S.share.kayaosFields.reminders ? [ses ? { title: `Workout: ${ses.title}`, minutes: ses.minutes, when: 'today' } : null, { title: `Drink water (${S.profile.water} glasses)`, when: 'daily' }].filter(Boolean) : []
    };
  }
  async function pushHealthSummary(S) { need(); return chk(await sb.from('health_summaries').upsert({ user_id: user.id, summary: healthSummary(S), updated_at: new Date().toISOString() })); }

  /* web push (needs VAPID public key + nudge-cron function) */
  const b64ToU8 = b => { const p = '='.repeat((4 - b.length % 4) % 4), s = atob((b + p).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from([...s].map(c => c.charCodeAt(0))); };
  async function subscribePush(prefs) {
    need();
    if (!C.VAPID_PUBLIC_KEY) throw new Error('Add VAPID_PUBLIC_KEY to config.js for background notifications');
    if (!('PushManager' in window)) throw new Error('This browser does not support push. On iPhone, install the app to your Home Screen first.');
    const reg = await navigator.serviceWorker.ready;
    const sub = (await reg.pushManager.getSubscription()) || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToU8(C.VAPID_PUBLIC_KEY) });
    const j = sub.toJSON();
    chk(await sb.from('push_subscriptions').upsert({ user_id: user.id, endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth, tz: Intl.DateTimeFormat().resolvedOptions().timeZone, prefs }, { onConflict: 'endpoint' }));
    return true;
  }

  /* progress photo backup — private Storage bucket "progress-photos", path <user_id>/<photo_id>.jpg */
  async function uploadPhoto(rec) { need(); const r = await sb.storage.from('progress-photos').upload(`${user.id}/${rec.id}.jpg`, rec.blob, { contentType: 'image/jpeg', upsert: true }); if (r.error) throw new Error(r.error.message); return true; }

  return { db: () => sb, uploadPhoto, enabled, ready, auth, markDirty, flush, pull, pushAll, coach, groups, trainer, healthSummary, pushHealthSummary, subscribePush, lastSync: () => lastSync, config: C };
})();
