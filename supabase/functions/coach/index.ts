// WAYOF AI coach — Supabase Edge Function (Deno).
// Actions: chat · nudge · clone (RepliPlate-style copycat from text or photo) · fridge (recipe from fridge items)
// Secrets (Supabase → Edge Functions → Secrets): ANTHROPIC_API_KEY (required)
//   optional: COACH_MODEL (default claude-haiku-5-5), COACH_MODEL_SMART (default claude-sonnet-5-5), COACH_DAILY_LIMIT (default 60)
// SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are provided automatically.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
const MODEL = Deno.env.get('COACH_MODEL') ?? 'claude-haiku-5-5';
const MODEL_SMART = Deno.env.get('COACH_MODEL_SMART') ?? 'claude-sonnet-5-5';
const DAILY_LIMIT = Number(Deno.env.get('COACH_DAILY_LIMIT') ?? 60);
const URL_ = Deno.env.get('SUPABASE_URL')!, ANON = Deno.env.get('SUPABASE_ANON_KEY')!, SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const PERSONAS: Record<string, string> = {
  guide: 'The Guide — calm, thoughtful, encouraging. Short reflective sentences.',
  motivator: 'The Motivator — upbeat, energetic, celebratory. Punchy and positive, never pushy.',
  strategist: 'The Strategist — direct, focused, numbers-first. Clear next actions.',
  companion: 'The Companion — warm, supportive, kind. Gentle and reassuring.'
};
const SAFETY = `Safety rules (always follow):
- You are a general wellness coach, not a doctor or dietitian. Never diagnose or prescribe medication.
- If the user mentions chest pain, fainting, trouble breathing, a serious injury, pregnancy complications or thoughts of self-harm, tell them to stop and contact a medical professional or emergency services (988 in the US for crisis support).
- Never recommend fewer than 1,200 kcal/day, extreme fasting, dehydration or punishing exercise. Recommend weight change of at most ~1% of body weight per week.
- If the user shows signs of disordered eating, avoid numbers and targets, respond with care, and suggest talking to a professional.
- Never shame the user about food, weight or missed workouts.`;

function systemPrompt(ctx: any) {
  const style = PERSONAS[ctx?.coach_style] ?? PERSONAS.guide;
  return `You are the WAYOF AI coach inside the WAYOF wellness app (thewayof.health).
Persona: ${style}
${SAFETY}
Style: reply in plain text, under 120 words unless the user asks for detail. You may use **bold** for emphasis and short line breaks. Use the user's units (${ctx?.units === 'metric' ? 'kg, km, °C' : 'lb, miles, °F'}). Address them by name occasionally if known.
Use the real data below to personalize: their goals, plan, today's session, recent days, learned habits, fridge contents and weather. When suggesting a workout, prefer exercises from their equipment list and plan. When suggesting food, prefer what's in their fridge.
USER CONTEXT (JSON): ${JSON.stringify(ctx ?? {}).slice(0, 9000)}`;
}

async function claude(model: string, system: string, messages: any[], max_tokens = 700) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model, max_tokens, system, messages })
  });
  if (!r.ok) { const t = await r.text(); console.error('anthropic', r.status, t); throw new Error(r.status === 429 ? 'The coach is busy — try again in a minute' : 'AI service error'); }
  const j = await r.json();
  return (j.content ?? []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('\n').trim();
}
function parseJSON(text: string) {
  const s = text.indexOf('{'), e = text.lastIndexOf('}');
  if (s < 0 || e < s) throw new Error('AI returned an unexpected format');
  return JSON.parse(text.slice(s, e + 1));
}
const ART = 'grain,rice,oats,salmon,chicken,shrimp,beef,egg,avocado,tomato,carrot,greens,broccoli,berries,yogurt,banana,beans,chickpea,lentil,tofu,pepper,cucumber,feta,cabbage,potato,pasta,hummus,bread,pancake,wrap';
const RECIPE_SCHEMA = `{"name":string,"style":string (e.g. "Chipotle-style" or "" ),"slot":"breakfast"|"lunch"|"dinner"|"snack","minutes":number,"kcal":number,"protein":number,"carbs":number,"fat":number,
"restaurantPrice":number (typical restaurant price USD, 0 if not a restaurant dish),"restaurantCal":number (typical restaurant calories, 0 if unknown),"homePrice":number (estimated home cost per serving USD),"score":number (0-100 how close the clone tastes),
"ingredients":[{"name":string,"amount":string,"price":number}],"steps":[string],"swaps":[string] (vegan / lower-calorie / higher-protein options),"art":[up to 5 of: ${ART}] (main visible components for an illustration)}`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);
  if (!ANTHROPIC_API_KEY) return json({ error: 'AI coach is not configured (missing ANTHROPIC_API_KEY)' }, 500);

  // who is calling?
  const auth = req.headers.get('Authorization') ?? '';
  const userClient = createClient(URL_, ANON, { global: { headers: { Authorization: auth } } });
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return json({ error: 'Sign in to use the AI coach' }, 401);

  // per-user daily limit
  const admin = createClient(URL_, SERVICE);
  const { data: used, error: uErr } = await admin.rpc('bump_coach_usage', { p_user: user.id });
  if (uErr) console.error(uErr);
  if ((used ?? 0) > DAILY_LIMIT) return json({ error: `Daily AI limit reached (${DAILY_LIMIT}). It resets tomorrow.` }, 429);

  let body: any; try { body = await req.json(); } catch { return json({ error: 'Bad JSON' }, 400); }
  const action = String(body.action ?? 'chat');

  try {
    if (action === 'chat') {
      // keep a clean alternating history that starts with the user
      const msgs = (Array.isArray(body.messages) ? body.messages : []).slice(-12)
        .filter((m: any) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
        .map((m: any) => ({ role: m.role, content: m.content.slice(0, 2000) }));
      while (msgs.length && msgs[0].role !== 'user') msgs.shift();
      const merged: any[] = [];
      for (const m of msgs) { if (merged.length && merged[merged.length - 1].role === m.role) merged[merged.length - 1].content += '\n' + m.content; else merged.push(m); }
      if (!merged.length) return json({ error: 'Empty message' }, 400);
      const reply = await claude(MODEL, systemPrompt(body.context), merged, 700);
      return json({ reply });
    }

    if (action === 'nudge') {
      const text = await claude(MODEL, systemPrompt(body.context) + '\nYou write ONE short push notification for right now.', [{ role: 'user', content: 'Write the single most useful nudge for this moment, or skip if nothing is worth interrupting for. Respond with JSON only: {"skip":boolean,"title":string (max 40 chars),"body":string (max 110 chars),"action":"today"|"train"|"nourish"|"coach"|"atmosphere"}' }], 200);
      return json(parseJSON(text));
    }

    if (action === 'clone') {
      const content: any[] = [];
      if (body.image?.data) content.push({ type: 'image', source: { type: 'base64', media_type: body.image.media_type || 'image/jpeg', data: String(body.image.data) } });
      const fridge = (body.fridge ?? []).slice(0, 40).join(', ');
      content.push({ type: 'text', text: `${body.image ? 'This photo shows a restaurant plate or menu. Identify the dish (if a menu, pick the most popular item).' : `Dish to clone: "${String(body.text ?? '').slice(0, 120)}".`}
Create a healthier homemade copycat ("clone") that tastes as close as possible to the restaurant version, sized as one serving that fits roughly ${body.goals?.kcal ? Math.round(body.goals.kcal / 3) : 600} kcal with plenty of protein.
Prefer ingredients the user already has: ${fridge || 'none listed'}. Units: ${body.units === 'metric' ? 'metric' : 'US'}.
Respond with JSON only, matching: ${RECIPE_SCHEMA}` });
      const text = await claude(MODEL_SMART, 'You are a chef who reverse-engineers restaurant dishes into healthier home recipes. Estimates must be realistic. ' + SAFETY, [{ role: 'user', content }], 1400);
      return json({ clone: parseJSON(text) });
    }

    if (action === 'fridge') {
      const items = (body.fridge ?? []).slice(0, 60).map((f: any) => `${f.name}${f.expires ? ` (use by ${f.expires})` : ''}`).join(', ');
      const text = await claude(MODEL_SMART, 'You are a practical home chef and nutrition coach. ' + SAFETY, [{
        role: 'user', content: `Fridge: ${items}.
Create ONE ${body.slot ?? 'dinner'} recipe that uses mostly these items (prioritize anything expiring soon), assuming basic pantry staples (oil, salt, pepper, spices). Aim for about ${body.remaining?.kcal ?? 600} kcal and ${body.remaining?.protein ?? 35}g protein. Units: ${body.units === 'metric' ? 'metric' : 'US'}.
Respond with JSON only, matching: ${RECIPE_SCHEMA}` }], 1200);
      return json({ recipe: parseJSON(text) });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (e) {
    return json({ error: (e as Error).message || 'Coach error' }, 500);
  }
});
