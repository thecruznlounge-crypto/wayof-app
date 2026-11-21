/* WAYOF v7 — on-device habit learning + nudge engine.
   Learns from timestamped events (water, meals, workouts, steps, weight, sleep).
   Runs fully offline; when Supabase AI is connected, this summary is sent to the AI as context. */
window.WAYOF_COACH = (function () {
  const pad = n => String(n).padStart(2, '0');
  const dkey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const dow = d => (d.getDay() + 6) % 7;
  const DAYS = ['Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Sundays'];
  const median = a => { if (!a.length) return null; const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  const hr12 = h => { const H = Math.round(h); return `${((H + 11) % 12) + 1}${H < 12 || H === 24 ? 'am' : 'pm'}`; };
  const totals = l => (l.meals || []).reduce((a, m) => ({ kcal: a.kcal + m.kcal, p: a.p + m.p }), { kcal: 0, p: 0 });

  function habits(S, days = 28) {
    const today = new Date(), out = { days: 0, insights: [], stats: {} };
    const wHours = [], waterBy2 = [], dowCount = [0, 0, 0, 0, 0, 0, 0], prot = [], kcal = [], sleep = [], stepsWk = [], stepsWe = [];
    let planned = 0, done = 0, lateMeals = 0, mealDays = 0, noBreakfast = 0, logged = 0;
    for (let i = 0; i < days; i++) {
      const d = addDays(today, -i), k = dkey(d), l = S.log[k];
      const ses = S.plan.week.find(s => s.dow === dow(d));
      if (ses && i > 0) planned++;
      if (!l) continue;
      const any = l.water || l.steps || l.meals.length || l.workouts.length || l.sleep || l.weight; if (!any) continue;
      logged++;
      if (ses && i > 0 && l.workouts.some(w => w.pid === ses.id)) done++;
      (l.ev || []).forEach(([type, t]) => { const h = new Date(t).getHours() + new Date(t).getMinutes() / 60; if (type === 'workout') wHours.push(h); if (type === 'meal' && h >= 21) lateMeals++; });
      l.workouts.forEach(() => dowCount[dow(d)]++);
      const wEv = (l.ev || []).filter(e => e[0] === 'water'); if (wEv.length && i > 0) waterBy2.push(wEv.filter(e => new Date(e[1]).getHours() < 14).length);
      if (l.meals.length) { mealDays++; const t = totals(l); prot.push(t.p); kcal.push(t.kcal); if (!l.meals.some(m => m.slot === 'breakfast')) noBreakfast++; }
      if (l.sleep != null) sleep.push(l.sleep);
      if (l.steps) (dow(d) >= 5 ? stepsWe : stepsWk).push(l.steps);
    }
    // streak (consecutive days with any log ending today or yesterday)
    let streak = 0; for (let i = 0; i < 365; i++) { const l = S.log[dkey(addDays(today, -i))]; const any = l && (l.water || l.steps || l.meals.length || l.workouts.length || l.sleep != null || l.weight != null); if (any) streak++; else if (i === 0) continue; else break; }
    const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
    const st = out.stats = {
      logged, streak, workoutHour: median(wHours), adherence: planned ? done / planned : null, planned, done,
      bestDay: dowCount.some(Boolean) ? dowCount.indexOf(Math.max(...dowCount)) : null,
      waterBy2: avg(waterBy2), protein: avg(prot), kcal: avg(kcal), sleep: avg(sleep), stepsWeekday: avg(stepsWk), stepsWeekend: avg(stepsWe),
      lateMealRate: mealDays ? lateMeals / mealDays : 0, skipBreakfastRate: mealDays ? noBreakfast / mealDays : 0
    };
    out.days = logged;
    const p = S.profile, I = out.insights;
    if (st.workoutHour != null && wHours.length >= 3) I.push({ icon: 'clock', text: `You usually train around ${hr12(st.workoutHour)}.`, key: 'time' });
    if (st.bestDay != null && dowCount[st.bestDay] >= 2) I.push({ icon: 'spark', text: `${DAYS[st.bestDay]} are your most consistent workout day.`, key: 'day' });
    if (st.adherence != null && st.planned >= 3) I.push({ icon: 'check', text: `You've completed ${Math.round(st.adherence * 100)}% of planned sessions in the last 4 weeks.`, key: 'adh' });
    if (st.protein != null && st.protein < p.protein * 0.8) I.push({ icon: 'utensils', text: `Protein averages ${Math.round(st.protein)}g — about ${Math.round(p.protein - st.protein)}g under your target.`, key: 'protein' });
    if (st.waterBy2 != null && st.waterBy2 < p.water * 0.35) I.push({ icon: 'drop', text: `Most of your water happens after 2pm. Front-loading 2–3 glasses helps.`, key: 'water' });
    if (st.sleep != null && st.sleep < p.sleep - 0.5) I.push({ icon: 'moon', text: `Sleep averages ${st.sleep.toFixed(1)}h, short of your ${p.sleep}h goal.`, key: 'sleep' });
    if (st.stepsWeekday && st.stepsWeekend && st.stepsWeekend < st.stepsWeekday * 0.75) I.push({ icon: 'steps', text: `Weekend steps drop ${Math.round((1 - st.stepsWeekend / st.stepsWeekday) * 100)}% vs weekdays.`, key: 'weekend' });
    if (st.skipBreakfastRate > 0.5 && mealDays >= 4) I.push({ icon: 'sun', text: `Breakfast is missing on most days you log food.`, key: 'breakfast' });
    if (st.lateMealRate > 0.4 && mealDays >= 4) I.push({ icon: 'moon', text: `You often log food after 9pm.`, key: 'late' });
    if (st.streak >= 3) I.push({ icon: 'flame', text: `${st.streak}-day logging streak. Keep it alive!`, key: 'streak' });
    return out;
  }

  const tone = {
    guide: { hi: 'A gentle nudge:', yes: 'Nice work.', go: 'When you\'re ready' },
    motivator: { hi: 'Let\'s go!', yes: 'YES! Crushed it!', go: 'Get after it' },
    strategist: { hi: 'Next action:', yes: 'Target hit.', go: 'Execute' },
    companion: { hi: 'Hey, just checking in —', yes: 'So proud of you.', go: 'Whenever it feels right' }
  };

  // Rule-based nudges for "right now". Each id is unique per day so it's only sent once.
  function nudges(S, now = new Date(), ctx = {}) {
    const k = dkey(now), L = S.log[k] || { water: 0, steps: 0, meals: [], workouts: [] }, p = S.profile, h = now.getHours() + now.getMinutes() / 60;
    const T = tone[p.style] || tone.guide, H = habits(S, 28).stats, name = p.name ? `${p.name}, ` : '';
    const list = [], push = (type, title, body, action) => list.push({ id: `${type}-${k}`, type, title, body, action, at: Date.now() });
    const ses = S.plan.week.find(s => s.dow === dow(now)), done = ses && L.workouts.some(w => w.pid === ses.id);
    const wh = H.workoutHour != null ? H.workoutHour : 18;
    if (ses && !done && h >= wh - 0.75 && h < wh + 2) {
      const wx = ctx.window ? ` ${ctx.window}` : '';
      push('workout', `${T.go}: ${ses.title}`, `${name}your ${ses.minutes}-minute session is up next.${wx}`, 'train');
    }
    if (ses && !done && h >= 20 && h < 21.5) push('workout-late', 'Still time for a short one', `${name}even 10 minutes of your ${ses.title.toLowerCase()} keeps the habit alive.`, 'train');
    const expectedWater = Math.round(p.water * Math.min(1, Math.max(0, (h - 8) / 12)));
    if (h >= 11 && h < 20 && L.water < expectedWater - 1) push('water', 'Hydration check', `${T.hi} you're at ${L.water} of ${p.water} glasses — have one now?`, 'water');
    const prot = (L.meals || []).reduce((a, m) => a + m.p, 0);
    if (h >= 16 && h < 20 && prot < p.protein * 0.45) push('protein', 'Protein is running low', `${prot}g so far vs ${p.protein}g goal. A protein-forward dinner gets you there.`, 'nourish');
    if (h >= 19.5 && h < 22 && !(L.meals || []).length && !L.water && !L.steps) push('checkin', 'Quick check-in', `${name}no entries today yet — want to log anything before bed?`, 'today');
    if (ctx.expiring && ctx.expiring.length && h >= 15 && h < 19) push('fridge', 'Use it before you lose it', `${ctx.expiring.slice(0, 2).join(' and ')} ${ctx.expiring.length > 1 ? 'expire' : 'expires'} soon — tap for a recipe that uses ${ctx.expiring.length > 1 ? 'them' : 'it'}.`, 'nourish');
    if (L.steps >= p.steps && h < 23) push('steps-goal', T.yes, `${L.steps.toLocaleString()} steps — daily goal reached.`, 'today');
    if (H.streak && [3, 7, 14, 30, 60, 100].includes(H.streak) && h >= 9) push('streak', `${H.streak}-day streak`, `${T.yes} Showing up is the whole game.`, 'progress');
    if (dow(now) === 6 && h >= 18 && h < 21) push('weekly', 'Your week in review', 'See what moved this week and set one focus for next week.', 'coach');
    return list;
  }

  // Offline coach reply (used when the AI backend isn't connected or fails)
  function reply(text, S, extra = {}) {
    const t = text.toLowerCase(), H = habits(S, 28), p = S.profile, now = new Date(), k = dkey(now), L = S.log[k] || { meals: [], water: 0, steps: 0, workouts: [] };
    const ses = S.plan.week.find(s => s.dow === dow(now)), T = tone[p.style] || tone.guide;
    if (/pain|chest|dizz|faint|injur|hurt|sharp/.test(t)) return 'If you have chest pain, fainting, trouble breathing or a sudden injury, stop and contact a doctor or emergency services. For aches or soreness, swap today for gentle mobility and check in with a clinician if it persists.';
    if (/eat|meal|hungry|dinner|lunch|breakfast|recipe|fridge|cook/.test(t)) {
      const r = extra.fridgeRecipe; const left = p.kcal - (L.meals || []).reduce((a, m) => a + m.kcal, 0);
      return `You have about ${Math.max(0, left)} kcal left today.${r ? ` From what's in your fridge, try **${r.name}** (${r.kcal} kcal, ${r.p}g protein).` : ' Add a few fridge items in Nourish and I\'ll match recipes to them.'}`;
    }
    if (/workout|train|exercise|gym|session|today/.test(t)) {
      if (!S.plan.week.length) return 'You don\'t have a plan yet. Open Train, pick a goal and I\'ll build your week around your equipment.';
      if (!ses) return `Today's a recovery day. A walk or the mobility flow is perfect.${extra.window ? ' ' + extra.window : ''}`;
      return `${T.go}: **${ses.title}**, ${ses.minutes} min — ${ses.ex.join(', ')}. Tap "Start workout" and I'll demo each move and count your reps.`;
    }
    if (/tired|sore|stress|motivat|lazy|skip/.test(t)) return `${T.hi} on low-energy days, the win is just starting. Do 10 minutes — if you feel better, keep going; if not, you still kept the habit.${H.stats.sleep && H.stats.sleep < p.sleep ? ` Your sleep has averaged ${H.stats.sleep.toFixed(1)}h, which could be part of it.` : ''}`;
    if (/water|hydrat|drink/.test(t)) return `You're at ${L.water} of ${p.water} glasses today.${H.stats.waterBy2 != null ? ` Before 2pm you average ${H.stats.waterBy2.toFixed(1)}.` : ''}`;
    if (/sleep/.test(t)) return H.stats.sleep ? `You average ${H.stats.sleep.toFixed(1)}h of sleep vs your ${p.sleep}h goal. A consistent wind-down time helps most.` : 'Log your sleep for a few nights and I\'ll spot patterns.';
    if (/progress|how am i|doing|week|summary/.test(t)) return H.insights.length ? 'Here\'s what I\'ve learned: ' + H.insights.slice(0, 3).map(i => i.text).join(' ') : 'Log for a few days and I\'ll start spotting patterns — workout times, hydration pace, protein and sleep.';
    return `I'm your offline coach right now, so I can answer questions about your plan, meals, water, sleep and progress.${H.insights[0] ? ' One thing I\'ve noticed: ' + H.insights[0].text : ''}`;
  }

  // Compact context sent to the AI backend
  function context(S, extra = {}) {
    const today = new Date(), days = [];
    for (let i = 6; i >= 0; i--) { const d = addDays(today, -i), k = dkey(d), l = S.log[k]; if (!l) continue; const t = totals(l); days.push({ day: k, steps: l.steps, water: l.water, sleep: l.sleep, weight: l.weight, kcal: t.kcal, protein: t.p, workouts: l.workouts.map(w => w.title), meals: l.meals.map(m => m.name) }); }
    const ses = S.plan.week.find(s => s.dow === dow(today));
    return {
      now: today.toString(), name: S.profile.name || null, coach_style: S.profile.style, units: S.profile.units,
      goals: { kcal: S.profile.kcal, protein: S.profile.protein, carbs: S.profile.carbs, fat: S.profile.fat, steps: S.profile.steps, water_glasses: S.profile.water, sleep_h: S.profile.sleep },
      plan: { goal: S.plan.goal, level: S.plan.level, days_per_week: S.plan.days, today: ses ? { title: ses.title, minutes: ses.minutes, exercises: ses.ex } : null },
      equipment: S.equipment, habits: habits(S).insights.map(i => i.text), habit_stats: habits(S).stats, last7: days,
      fridge: (S.fridge || []).map(f => f.name + (f.exp ? ` (exp ${f.exp})` : '')), weather: extra.weather || null,
      body: { goal_weight: S.body && S.body.goalWeight, focus: S.body && S.body.focus }, ...(extra.more || {})
    };
  }
  return { habits, nudges, reply, context, hr12 };
})();
