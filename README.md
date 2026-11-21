# WAYOF v8 (thewayof.health): connected apps

## What's in this zip
| Folder | What to do with it |
|---|---|
| `upload-to-public_html/` | Upload **the contents** to your cPanel `public_html` for thewayof.health, replacing v7 files. |
| `supabase/` | WAYOF's database and AI functions. Use it in the Supabase dashboard (steps below), not cPanel. |
| `kayaos-patch/` | Changed files for **kayaos.space** (build 2026.11.03-103). See its README. |
| `repliplate-patch/` | Changed files for **repliplate.app** (2.0.1). See its README. |
| `pedalz-patch/` | A re-run-safe `supabase/schema.sql` for **Pedalz**. See its README. |

**Before uploading,** delete the old `index.html`, `sw.js`, `manifest.webmanifest`, `css/` and `js/` in `public_html`, then hard-refresh. The Train Library offers four selectable coach avatars, a realistic bodyweight-squat video where available, and spoken form cues for every exercise using the device's speech voice. For future updates, bump the asset query version in `index.html` and `trainer.html`, and `CACHE` in `sw.js`.

## New in v8
### One account for four apps
- **Sign up / Log in** from the header, the first-run welcome screen, or Profile → Account. It includes **Forgot password** (email link → set a new password in the app), **Change password**, and an optional **Continue with Google** (`GOOGLE_SIGNIN: true` in `config.js` after you enable Google in Supabase → Auth → Providers).
- When WAYOF, Kayaos and Pedalz use the **same Supabase project**, one login works in all three, and they read each other's data directly. Row Level Security keeps every row private to its owner. RepliPlate needs no account, because WAYOF talks to it through share links and its AI endpoint.
- The new **Apps** tab (side rail on tablet; Profile → Connected apps → Manage on phone) shows each app's status and tools.

### Kayaos.space
- **Sleep plan from your work schedule:** WAYOF reads your Kayaos Work shifts and recommends bed and wake times for the next nights. It uses your sleep goal, how long you need from waking to leaving, and your usual bedtime, so it never pushes bedtime later on days off. Early shifts, night shifts and days off each get their own advice.
- It shows up on Today ("Tonight: bed 9:15 → 4:45"), in the AI coach's context, and as a **bedtime wind-down nudge**.
- **Appointments:** Kayaos Health and Appointments cards appear on Today and in Apps. "Add appointment" in WAYOF creates a real Kayaos card, with Kayaos's own chime and voice alerts. "Send today's workout" adds the session to Kayaos as a card.
- **Health sharing:** WAYOF writes a daily summary (steps, water, sleep, workouts, sleep plan; kcal and weight only if you allow them). In Kayaos, **More → WAYOF Health** shows it, with one tap to turn reminders and bedtimes into cards.
- **No shared account?** In Kayaos, tap More → WAYOF Health → "Send my schedule to WAYOF". In WAYOF, tap Apps → Kayaos → "Send snapshot".

### RepliPlate.app
- **Clone restaurant dishes** by typing a name or snapping a **menu or plate photo**. WAYOF uses RepliPlate's own AI first (`REPLIPLATE_API`), then falls back to WAYOF's coach AI and then to the offline library. The library now has RepliPlate's 13 clones alongside WAYOF's.
- **Log a meal you ate from a photo:** it's identified, then logged as **"Ate it out"** (restaurant calories) or **"Made at home"** (the clone's calories), with macros scaled to match.
- **Open in RepliPlate**, **Share** (RepliPlate's own link format) and **paste a RepliPlate link** to import. In RepliPlate (patched), **Log in WAYOF** opens the meal in WAYOF, ready to log.

### Pedalz.app: ride, walk, run, meters, gear
- **Train → Ride · Walk · Run** tab, plus quick-cardio chips on Today, cover five modes: outdoor ride, stationary bike, walk, run and treadmill.
- New equipment: spin bike, smart bike trainer, running shoes, heart rate monitor and GPS watch. New moves (each with an illustrated demo) include outdoor walk, easy run, run intervals, stationary steady ride, spin intervals and smart trainer ride. Their workout player has a "Track with live meters" button.
- **Live meters:**
  - GPS distance, speed or pace, climb and a route trace; it filters out bad fixes.
  - **Bluetooth heart rate** straps and watches in broadcast mode.
  - **Bluetooth smart bikes and trainers** (standard FTMS: speed, cadence, power, resistance).
  - Calories from MET and heart rate; full-screen mode.
- **Enter machine meter reading** for any gym machine: time, distance, calories, cadence, watts, resistance and incline.
- Cardio is saved to your log, the weekly totals and the AI coach. It **syncs to Pedalz ride history** on the same account, and rides recorded in Pedalz show up in WAYOF.
- **Gear shops & listings:** "Shops near me" (bike shops, running stores, fitness equipment, bike repair) opens maps. On a shared account you also see the **Pedalz Gear Shop** listings, and can post or remove your own.

### Also
- The AI coach now knows your body goals, focus areas, work shifts, sleep plan, upcoming appointments and recent cardio.
- Existing v7 users skip the welcome screen, and all their data carries over.

## Setup (Supabase, about 20 minutes, same as v7 plus step 2)
1. **Use one Supabase project** for WAYOF, Kayaos and Pedalz (whichever Kayaos uses now). Put the same `SUPABASE_URL` and **anon** key in all three `config.js` files.
2. **SQL Editor:** run `supabase/schema.sql` (WAYOF). Also run Kayaos's and Pedalz's schemas if they're not in the project yet (use `pedalz-patch/supabase/schema.sql`).
   - All three scripts work in **any order** and can be re-run.
   - WAYOF's helper names are prefixed `wayof_` so they don't clash, and the shared `profiles` table gets both apps' columns.
3. **Auth → URL Configuration:** set the Site URL to `https://thewayof.health`, and add `https://thewayof.health`, `https://kayaos.space` and `https://pedalz.app` to the Redirect URLs (needed for password-reset and Google links).
4. **Edge Functions** (Supabase CLI: `npm i -g supabase`, `supabase login`, `supabase link --project-ref YOUR_REF`):
   ```
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...      # from console.anthropic.com
   supabase functions deploy coach
   ```
   Optional: `COACH_MODEL` (default `claude-haiku-5-5`), `COACH_MODEL_SMART` (default `claude-sonnet-5-5`), `COACH_DAILY_LIMIT` (default 60/day).
5. **`config.js`:**
   - Required: `SUPABASE_URL` and the anon key.
   - Optional: `REPLIPLATE_API: 'https://repliplate.app/api/ai.php'`, after adding `https://thewayof.health` to RepliPlate's `allowed_origins` (see `repliplate-patch/`).
   - Never put the Anthropic key or service-role key in this file.
6. **Background AI notifications (optional, unchanged from v7):**
   ```
   npx web-push generate-vapid-keys
   supabase secrets set VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=... VAPID_SUBJECT=mailto:you@thewayof.health CRON_SECRET=long-random-string
   supabase functions deploy nudge-cron --no-verify-jwt
   ```
   Then put the public VAPID key in `config.js`, and schedule the job hourly:
   ```sql
   create extension if not exists pg_cron; create extension if not exists pg_net;
   select cron.schedule('wayof-nudges', '7 * * * *', $$
     select net.http_post(url := 'https://YOUR_REF.supabase.co/functions/v1/nudge-cron',
       headers := jsonb_build_object('Content-Type','application/json','x-cron-secret','YOUR_CRON_SECRET'), body := '{}'::jsonb) $$);
   ```

## Good to know
- **Bluetooth meters** work in Chrome and Edge on Android, Windows, Mac and ChromeOS. Safari on iPhone and iPad doesn't support Web Bluetooth, so use GPS or enter the machine reading there.
- **GPS tracking** runs while WAYOF is open on screen. Browsers pause it in the background, so keep the screen on during a ride or run, or record in Pedalz.
- On a shared project, **Pedalz profiles are publicly readable** (Pedalz's own policy, needed for its rider map). The only WAYOF field in that table is your display name. Weights, logs, meals and photos are in WAYOF's own owner-only tables.
- **Kayaos health sharing** is off until you turn it on in WAYOF (Apps → Kayaos → "Share my health summary").

## Tested before delivery
- **Shared database:** Kayaos, Pedalz and WAYOF schemas run together on Postgres 16 with Supabase stubs, in three different orders and re-run.
  - WAYOF groups, leaderboards, trainer links and RLS all pass on the shared `profiles` table.
  - Cross-app reads were checked as a signed-in user: WAYOF reading Kayaos `work_data` and `tasks`, and writing Pedalz `rides` and `listings`. Other users see none of it, except public gear listings.
- **WAYOF in the browser** (phone and tablet), with no page errors:
  - welcome and sign-in sheets, Apps view, sleep plan and appointments;
  - cardio tracker with simulated GPS, and machine meter entry;
  - photo-meal logging as restaurant vs. homemade;
  - RepliPlate link round-trip.
- **Bridges:**
  - Kayaos (patched): More → WAYOF Health, the snapshot link, and "+ Card" pre-filling the Kayaos card form.
  - Kayaos → WAYOF schedule link imports the shifts.
  - RepliPlate (patched) → "Log in WAYOF" opens the meal ready to log.
- **Not testable here** (no internet): live Supabase/Claude calls, RepliPlate's live AI, real Bluetooth devices and real GPS. Do a quick check after deploying.

*WAYOF gives general wellness information, not medical advice.*
