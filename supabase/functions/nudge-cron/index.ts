// WAYOF background nudges — Supabase Edge Function (Deno), run hourly by Supabase Cron.
// For each push subscription it checks quiet hours and daily limits, asks the AI coach for at most one
// personalized nudge based on the user's recent logs, and sends it as a web push notification.
// Secrets: ANTHROPIC_API_KEY, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (e.g. mailto:you@thewayof.health), CRON_SECRET
// Deploy with:  supabase functions deploy nudge-cron --no-verify-jwt   (it checks the x-cron-secret header instead)
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import webpush from 'npm:web-push@3.6.7';

const URL_ = Deno.env.get('SUPABASE_URL')!, SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
const MODEL = Deno.env.get('COACH_MODEL') ?? 'claude-haiku-5-5';
const CRON_SECRET = Deno.env.get('CRON_SECRET') ?? '';
const MAX_USERS_PER_RUN = Number(Deno.env.get('NUDGE_MAX_USERS') ?? 300);
webpush.setVapidDetails(Deno.env.get('VAPID_SUBJECT') ?? 'mailto:hello@thewayof.health', Deno.env.get('VAPID_PUBLIC_KEY')!, Deno.env.get('VAPID_PRIVATE_KEY')!);

const localParts = (tz: string) => {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: tz || 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false }).formatToParts(new Date());
  const g = (t: string) => p.find(x => x.type === t)?.value ?? '00';
  return { day: `${g('year')}-${g('month')}-${g('day')}`, hour: Number(g('hour')) % 24 };
};
const inQuiet = (h: number, s: number, e: number) => s > e ? (h >= s || h < e) : (h >= s && h < e);

async function aiNudge(context: unknown) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', headers: { 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: MODEL, max_tokens: 220, system: `You are the WAYOF wellness coach writing ONE short, kind, specific push notification. Never shame, never give medical advice, no extreme diet or exercise advice. Use the persona in coach_style (guide=calm, motivator=upbeat, strategist=direct, companion=warm). If nothing is genuinely useful right now, skip.`,
      messages: [{ role: 'user', content: `Context: ${JSON.stringify(context).slice(0, 7000)}\nRespond with JSON only: {"skip":boolean,"title":string (max 40 chars),"body":string (max 110 chars),"action":"today"|"train"|"nourish"|"coach"|"atmosphere"}` }] })
  });
  if (!r.ok) throw new Error('anthropic ' + r.status);
  const j = await r.json(); const t = (j.content ?? []).map((b: any) => b.text ?? '').join('');
  return JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1));
}

Deno.serve(async (req) => {
  if (!CRON_SECRET || req.headers.get('x-cron-secret') !== CRON_SECRET) return new Response('forbidden', { status: 403 });
  const db = createClient(URL_, SERVICE);
  const { data: subs, error } = await db.from('push_subscriptions').select('*').limit(MAX_USERS_PER_RUN * 2);
  if (error) return new Response(error.message, { status: 500 });
  let sent = 0, skipped = 0; const seenUsers = new Set<string>();
  for (const s of subs ?? []) {
    try {
      const prefs = s.prefs ?? {}; const { day, hour } = localParts(s.tz);
      if (inQuiet(hour, prefs.quietStart ?? 22, prefs.quietEnd ?? 7)) { skipped++; continue; }
      const sentToday = s.sent_day === day ? (s.sent_today ?? 0) : 0;
      if (sentToday >= Math.min(prefs.max ?? 4, 8)) { skipped++; continue; }
      if (s.last_sent_at && Date.now() - new Date(s.last_sent_at).getTime() < 3 * 3600e3) { skipped++; continue; }
      if (seenUsers.has(s.user_id)) continue; // one nudge per user per run, even with several devices
      if (seenUsers.size >= MAX_USERS_PER_RUN) break;
      seenUsers.add(s.user_id);
      const since = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
      const [{ data: st }, { data: logs }] = await Promise.all([
        db.from('app_state').select('data').eq('user_id', s.user_id).maybeSingle(),
        db.from('daily_logs').select('day,data').eq('user_id', s.user_id).gte('day', since)
      ]);
      const S = st?.data ?? {}; const dow = (new Date(day + 'T12:00:00').getDay() + 6) % 7;
      const today = (logs ?? []).find((l: any) => l.day === day)?.data ?? {};
      const context = {
        local_time: `${day} ${hour}:00`, coach_style: prefs.style ?? S.profile?.style, name: S.profile?.name, units: S.profile?.units,
        enabled_types: prefs.types, goals: { steps: S.profile?.steps, water: S.profile?.water, protein: S.profile?.protein, kcal: S.profile?.kcal },
        today: { steps: today.steps ?? 0, water: today.water ?? 0, workouts: (today.workouts ?? []).map((w: any) => w.title), meals: (today.meals ?? []).length, protein: (today.meals ?? []).reduce((a: number, m: any) => a + (m.p ?? 0), 0) },
        planned_today: (S.plan?.week ?? []).find((w: any) => w.dow === dow)?.title ?? null,
        last7: (logs ?? []).map((l: any) => ({ day: l.day, steps: l.data.steps, water: l.data.water, workouts: (l.data.workouts ?? []).length })),
        fridge_expiring: (S.fridge ?? []).filter((f: any) => f.exp && f.exp <= day).map((f: any) => f.name).slice(0, 5), body_focus: S.body?.focus
      };
      const n = await aiNudge(context);
      if (n.skip || !n.title) { skipped++; continue; }
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify({ title: String(n.title).slice(0, 60), body: String(n.body ?? '').slice(0, 160), url: `./index.html#${n.action ?? 'today'}`, tag: `ai-${day}-${hour}` }));
      await db.from('push_subscriptions').update({ sent_day: day, sent_today: sentToday + 1, last_sent_at: new Date().toISOString() }).eq('user_id', s.user_id);
      sent++;
    } catch (e: any) {
      if (e?.statusCode === 404 || e?.statusCode === 410) await db.from('push_subscriptions').delete().eq('id', s.id); // expired subscription
      else console.error('nudge', s.id, e?.message ?? e);
    }
  }
  return new Response(JSON.stringify({ sent, skipped }), { headers: { 'Content-Type': 'application/json' } });
});
