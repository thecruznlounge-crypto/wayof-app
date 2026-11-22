/* ShopKit: shared budget grocery planner + Instacart helpers for WAYOF (thewayof.health) and RepliPlate (repliplate.app).
   One file, used unchanged by both apps. It's a plain script: WAYOF loads it with <script>, RepliPlate with `import './shopkit.js'`.
   It sets globalThis.SHOPKIT.

   How budgeting works (Instacart's API doesn't share prices):
   - Every ingredient is matched to a typical US grocery package and price (PRICES below, Nov 2026 estimates).
   - A plan buys whole packages, so meals that share ingredients cost less together. The planner rewards that.
   - Fridge items and basic pantry staples cost $0.
   - Your receipts teach it (one price factor per store), and you can set your own price for any item.
   - It plans to the budget minus a cushion (12% by default), so real store prices don't push you over. */
(function (G) {
  'use strict';
  const VERSION = '1.0.0';

  // [match regex, Instacart search term, package label, est. price USD, servings per package, aisle, flags]
  // flags: 'p' = basic pantry staple (skipped when "I have the basics" is on)
  const PRICES = [
    // protein
    ['chicken thigh', 'boneless skinless chicken thighs', '2 lb pack', 6.99, 5, 'protein'],
    ['chicken tender', 'chicken breast tenderloins', '1.5 lb pack', 7.49, 4, 'protein'],
    ['chicken wing', 'chicken wings', '2 lb pack', 8.99, 3, 'protein'],
    ['ground chicken', 'ground chicken', '1 lb pack', 5.49, 3, 'protein'],
    ['cooked chicken|rotisserie', 'rotisserie chicken', '1 whole', 7.99, 4, 'protein'],
    ['chicken', 'boneless skinless chicken breast', '2 lb pack', 8.49, 5, 'protein'],
    ['ground turkey', 'ground turkey 93% lean', '1 lb pack', 5.29, 3, 'protein'],
    ['ground beef|plant patty|beef patt', 'ground beef 80/20', '1 lb pack', 5.99, 3, 'protein'],
    ['sirloin|steak', 'sirloin steak', '1 lb', 10.99, 3, 'protein'],
    ['roast pork|pork', 'pork shoulder', '2 lb', 7.98, 6, 'protein'],
    ['ham', 'sliced deli ham', '9 oz pack', 4.99, 4, 'protein'],
    ['salmon', 'salmon fillets', '1 lb', 10.99, 3, 'protein'],
    ['shrimp', 'frozen raw shrimp', '1 lb bag', 8.99, 3, 'frozen'],
    ['tilapia', 'tilapia fillets', '1 lb', 6.99, 3, 'protein'],
    ['tuna', 'canned tuna', '4 cans', 5.49, 4, 'pantry'],
    ['tofu', 'firm tofu', '14 oz', 2.49, 3, 'protein'],
    ['egg', 'large eggs', '1 dozen', 3.99, 6, 'dairy'],
    // dairy
    ['greek yogurt', 'plain greek yogurt', '32 oz tub', 5.49, 5, 'dairy'],
    ['yogurt', 'plain yogurt', '32 oz tub', 3.99, 5, 'dairy'],
    ['half-and-half|half and half', 'half and half', '1 pint', 2.79, 8, 'dairy'],
    ['heavy cream|whipped cream', 'heavy whipping cream', '1 pint', 4.29, 6, 'dairy'],
    ['evaporated milk', 'evaporated milk', '12 oz can', 1.59, 3, 'pantry'],
    ['buttermilk', 'buttermilk', '1 quart', 2.99, 6, 'dairy'],
    ['oat milk', 'oat milk', '64 oz', 4.49, 8, 'dairy'],
    ['milk', 'whole milk', '1 gallon', 4.29, 16, 'dairy'],
    ['butter', 'unsalted butter', '1 lb (4 sticks)', 5.49, 16, 'dairy', 'p'],
    ['sour cream', 'sour cream', '16 oz', 2.79, 8, 'dairy'],
    ['parmesan', 'grated parmesan', '8 oz', 4.99, 10, 'dairy'],
    ['feta', 'crumbled feta', '6 oz', 3.99, 4, 'dairy'],
    ['goat cheese', 'goat cheese', '4 oz', 3.99, 3, 'dairy'],
    ['swiss', 'sliced swiss cheese', '8 oz', 4.29, 6, 'dairy'],
    ['american cheese', 'american cheese slices', '16 slices', 3.99, 8, 'dairy'],
    ['nacho cheese', 'nacho cheese sauce', '15 oz jar', 3.29, 6, 'pantry'],
    ['cheddar|monterey|cheese', 'shredded cheese', '8 oz bag', 3.49, 6, 'dairy'],
    ['hummus', 'hummus', '10 oz', 3.99, 4, 'dairy'],
    // produce
    ['avocado', 'avocados', '4 pack', 4.99, 6, 'produce'],
    ['baby spinach|spinach', 'baby spinach', '5 oz box', 3.49, 4, 'produce'],
    ['kale', 'kale', '1 bunch', 2.29, 4, 'produce'],
    ['romaine|iceberg|butter lettuce|lettuce', 'romaine hearts', '3 pack', 3.99, 6, 'produce'],
    ['coleslaw|cabbage', 'coleslaw mix', '14 oz bag', 2.49, 4, 'produce'],
    ['cherry tomato', 'cherry tomatoes', '1 pint', 3.49, 4, 'produce'],
    ['crushed tomato|diced tomato', 'canned diced tomatoes', '28 oz can', 2.29, 4, 'pantry'],
    ['tomato', 'roma tomatoes', '1 lb', 1.99, 4, 'produce'],
    ['broccoli|mixed veg', 'broccoli crowns', '1 lb', 2.49, 3, 'produce'],
    ['green bean', 'green beans', '1 lb', 2.99, 3, 'produce'],
    ['zucchini', 'zucchini', '2 each', 1.98, 3, 'produce'],
    ['bell pepper|pepper strips', 'bell peppers', '3 pack', 3.99, 4, 'produce'],
    ['shredded carrot|carrot', 'carrots', '2 lb bag', 1.99, 10, 'produce'],
    ['celery', 'celery', '1 bunch', 1.99, 8, 'produce'],
    ['cucumber', 'cucumbers', '2 each', 1.98, 4, 'produce'],
    ['sweet potato', 'sweet potatoes', '3 lb bag', 3.99, 6, 'produce'],
    ['potato', 'russet potatoes', '5 lb bag', 4.49, 10, 'produce'],
    ['shiitake|mushroom', 'mushrooms', '8 oz', 2.99, 3, 'produce'],
    ['green onion|scallion', 'green onions', '1 bunch', 0.99, 6, 'produce'],
    ['red onion|pickled red onion', 'red onions', '2 each', 1.98, 6, 'produce'],
    ['onion', 'yellow onions', '3 lb bag', 3.49, 12, 'produce'],
    ['garlic', 'garlic', '3 heads', 1.99, 15, 'produce', 'p'],
    ['ginger', 'fresh ginger root', '1 piece', 1.29, 6, 'produce'],
    ['cilantro', 'cilantro', '1 bunch', 0.99, 6, 'produce'],
    ['parsley', 'parsley', '1 bunch', 1.29, 6, 'produce'],
    ['lime', 'limes', '5 each', 1.99, 5, 'produce'],
    ['lemon', 'lemons', '3 each', 2.29, 3, 'produce'],
    ['banana', 'bananas', '1 bunch (~6)', 1.79, 6, 'produce'],
    ['apple', 'apples', '3 lb bag', 4.99, 8, 'produce'],
    ['berr', 'frozen mixed berries', '16 oz bag', 3.99, 4, 'frozen'],
    ['orange juice', 'orange juice', '52 oz', 4.49, 8, 'dairy'],
    // frozen
    ['frozen corn|corn salsa|corn', 'frozen corn', '12 oz bag', 1.49, 4, 'frozen'],
    // bakery
    ['tortilla chip|tostada', 'tostada shells', '12 count', 2.99, 4, 'bakery'],
    ['corn tortilla', 'corn tortillas', '30 count', 2.49, 10, 'bakery'],
    ['tortilla', 'flour tortillas', '8 count', 2.99, 8, 'bakery'],
    ['bun|brioche', 'hamburger buns', '8 count', 2.99, 8, 'bakery'],
    ['texas toast', 'texas toast', '8 slices', 3.29, 4, 'frozen'],
    ['cuban|french bread', 'cuban bread', '1 loaf', 2.99, 4, 'bakery'],
    ['bread|toast', 'whole grain bread', '1 loaf', 3.49, 10, 'bakery'],
    ['pita chip', 'pita chips', '7 oz bag', 3.79, 5, 'pantry'],
    // pantry
    ['wild rice', 'wild rice blend', '1 lb', 4.49, 8, 'pantry'],
    ['brown rice', 'brown rice', '2 lb bag', 2.99, 20, 'pantry'],
    ['rice|cilantro lime rice', 'long grain white rice', '2 lb bag', 2.49, 20, 'pantry'],
    ['quinoa', 'quinoa', '1 lb', 4.49, 8, 'pantry'],
    ['oat', 'old fashioned rolled oats', '42 oz', 4.99, 25, 'pantry'],
    ['granola', 'granola', '12 oz', 3.99, 6, 'pantry'],
    ['fettuccine|pasta|spaghetti|penne', 'pasta', '1 lb box', 1.79, 4, 'pantry'],
    ['lentil', 'dry lentils', '1 lb bag', 1.99, 8, 'pantry'],
    ['chickpea', 'canned chickpeas', '15 oz can', 1.19, 2, 'pantry'],
    ['kidney bean', 'canned kidney beans', '15 oz can', 1.19, 2, 'pantry'],
    ['black bean|bean', 'canned black beans', '15 oz can', 1.19, 2, 'pantry'],
    ['broth|stock', 'chicken broth', '32 oz carton', 2.79, 4, 'pantry'],
    ['peanut butter', 'peanut butter', '16 oz jar', 2.99, 12, 'pantry'],
    ['tahini', 'tahini', '16 oz jar', 6.99, 16, 'pantry'],
    ['almond', 'sliced almonds', '6 oz', 4.29, 6, 'pantry'],
    ['chia', 'chia seeds', '12 oz', 5.99, 20, 'pantry'],
    ['water chestnut', 'canned water chestnuts', '8 oz can', 1.49, 3, 'pantry'],
    ['chipotle in adobo', 'chipotle peppers in adobo', '7 oz can', 1.99, 6, 'pantry'],
    ['salsa', 'salsa', '16 oz jar', 2.99, 6, 'pantry'],
    ['hoisin', 'hoisin sauce', '8 oz', 2.99, 8, 'pantry'],
    ['caramel', 'caramel sauce', '12 oz', 3.49, 10, 'pantry'],
    ['cold brew|coffee', 'cold brew concentrate', '32 oz', 6.99, 8, 'pantry'],
    ['protein powder|vanilla protein', 'vanilla protein powder', '2 lb tub', 29.99, 30, 'pantry'],
    ['pickle|relish', 'dill pickle chips', '24 oz jar', 2.99, 12, 'pantry'],
    ['orange sauce', 'orange sauce', '12 oz bottle', 3.49, 6, 'pantry'],
    // basics (skipped when "I have the basics" is on)
    ['olive oil|peanut oil|oil', 'olive oil', '16.9 oz bottle', 6.99, 30, 'pantry', 'p'],
    ['soy sauce|mirin', 'low sodium soy sauce', '15 oz bottle', 2.99, 20, 'pantry', 'p'],
    ['vinegar', 'vinegar', '16 oz', 2.49, 20, 'pantry', 'p'],
    ['mayo', 'mayonnaise', '30 oz', 4.99, 30, 'pantry', 'p'],
    ['ketchup|mustard|house sauce|sauce', 'ketchup', '20 oz', 2.49, 20, 'pantry', 'p'],
    ['honey', 'honey', '12 oz', 4.49, 20, 'pantry', 'p'],
    ['flour|seasoned flour', 'all purpose flour', '5 lb bag', 3.49, 30, 'pantry', 'p'],
    ['sugar', 'sugar', '4 lb bag', 3.49, 40, 'pantry', 'p'],
    ['cornstarch|xanthan|baking powder', 'cornstarch', '16 oz', 1.99, 30, 'pantry', 'p'],
    ['taco seasoning|lemon pepper|chili|spice|seasoning|cumin|paprika|salt|pepper', 'taco seasoning', '1 packet', 0.99, 3, 'pantry', 'p'],
  ].map(([re, search, pkg, price, serv, aisle, flags]) => ({ re: new RegExp('\\b(?:' + re + ')', 'i'), key: re.split('|')[0], search, pkg, price, serv, aisle, pantry: flags === 'p' }));

  // Cheaper swaps the planner suggests when the plan is over budget (or to save more)
  const SWAPS = [
    ['chicken', 'chicken thigh', 'Chicken thighs instead of breast: juicier and cheaper per pound'],
    ['salmon', 'tilapia', 'Tilapia or frozen salmon instead of fresh salmon'],
    ['sirloin', 'ground beef', 'Ground beef instead of steak for bowls and tacos'],
    ['baby spinach', 'kale', 'Kale or frozen spinach instead of fresh baby spinach'],
    ['berr', 'banana', 'Bananas instead of berries for breakfast'],
    ['quinoa', 'brown rice', 'Brown rice instead of quinoa'],
    ['greek yogurt', 'yogurt', 'Store-brand yogurt (strain it for thicker texture)'],
    ['shrimp', 'chicken thigh', 'Chicken thighs instead of shrimp'],
    ['avocado', 'sour cream', 'Skip the avocado or use a little sour cream'],
  ];

  /* ---------- storage: price edits + receipt calibration (per device) ---------- */
  const LS = 'shopkit.v1';
  const st = (() => { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; } })();
  st.prices = st.prices || {}; st.receipts = st.receipts || []; st.factor = st.factor || {};
  const save = () => { try { localStorage.setItem(LS, JSON.stringify(st)); } catch (e) { /* private mode */ } };
  const r2 = n => Math.round(n * 100) / 100;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  const norm = s => String(s || '').toLowerCase().replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9/&+ -]+/g, ' ').replace(/\s+/g, ' ').trim();
  function match(name) {
    // the longest matching phrase wins: "cornstarch" beats "corn", "lemon pepper" beats "lemon"
    const n = norm(name); let best = null, len = 0;
    for (const p of PRICES) { const m = n.match(p.re); if (m && m[0].length > len) { best = p; len = m[0].length; } }
    return best;
  }
  const keyOf = name => { const m = match(name); return m ? m.key : 'x:' + norm(name); };
  /** Current price factor: a store's own (from its receipts) or the all-store average. */
  function factor(store) {
    const f = store && st.factor[store.toLowerCase()];
    if (f) return f.v;
    const all = Object.values(st.factor); if (!all.length) return 1;
    const n = all.reduce((a, b) => a + b.n, 0);
    return all.reduce((a, b) => a + b.v * b.n, 0) / n;
  }
  function unitPrice(key, fallback) { return st.prices[key] != null ? st.prices[key] : fallback; }

  /* ---------- cost a set of meals ---------- */
  /** meals: [{ id, name, ingredients:[{name, qty, cost?, aisle?}] }] with `times` (servings) each.
      opts: { have(name)→bool (fridge), basics:true, store } */
  function costList(picks, opts = {}) {
    const f = factor(opts.store), items = new Map(), pantryCheck = new Set();
    for (const { meal, times } of picks) {
      for (const ing of meal.ingredients || []) {
        const m = match(ing.name), key = m ? m.key : 'x:' + norm(ing.name);
        if (/^pantry$|^optional/i.test(ing.qty || '') || /optional/i.test(ing.name)) { if (!m || m.pantry) { pantryCheck.add(ing.name); continue; } }
        let it = items.get(key);
        if (!it) {
          it = { key, name: m ? cap(m.search) : ing.name, search: m ? m.search : norm(ing.name), aisle: (m && m.aisle) || ing.aisle || 'pantry', pkg: m ? m.pkg : '', matched: !!m,
            serv: m ? m.serv : 0, base: m ? m.price : 0, per: 0, uses: 0, from: [], qtys: [], have: false, pantry: !!(m && m.pantry) };
          items.set(key, it);
        }
        it.uses += times;
        if (!m) it.per = Math.max(it.per, Number(ing.cost) || 1);
        if (!it.from.includes(meal.id)) it.from.push(meal.id);
        if (ing.qty && !it.qtys.includes(ing.qty)) it.qtys.push(ing.qty);
      }
    }
    let total = 0;
    for (const it of items.values()) {
      if (opts.have && opts.have(it.name, it.key)) it.have = true;
      if (it.pantry && opts.basics !== false) { it.have = true; it.basic = true; }
      if (it.matched) { it.pkgs = Math.max(1, Math.ceil(it.uses / it.serv)); it.unit = r2(unitPrice(it.key, it.base) * f); it.cost = r2(it.pkgs * it.unit); }
      else { it.pkgs = 0; it.unit = r2(unitPrice(it.key, it.per) * f); it.cost = r2(it.unit * it.uses); }
      it.left = it.matched ? Math.max(0, it.pkgs * it.serv - it.uses) : 0; // servings left over for later
      if (!it.have) total += it.cost;
    }
    const list = [...items.values()].sort((a, b) => a.aisle.localeCompare(b.aisle) || a.name.localeCompare(b.name));
    return { items: list, total: r2(total), pantryCheck: [...pantryCheck], factor: f };
  }
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  /* ---------- the budget planner ---------- */
  const SLOT_SHARE = { breakfast: 0.25, lunch: 0.3, dinner: 0.35, snack: 0.1 };
  const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  /** opts: { budget, days, slots:['lunch','dinner'], household, pool:[meal], goals:{kcal, protein}, goal:'balanced'|'save'|'protein'|'lighter'|'quick',
              have(name,key), basics, store, cushion:0.12, startDay:0 }
      meal: { id, name, slot?, kcal, protein, minutes?, restPrice?, ingredients:[...] , weight? (extra score from the app, e.g. fridge use) } */
  function plan(opts) {
    const days = clamp(opts.days | 0 || 7, 1, 14), H = clamp(opts.household | 0 || 1, 1, 12);
    const slots = (opts.slots && opts.slots.length ? opts.slots : ['dinner']);
    const budget = Math.max(5, +opts.budget || 75), cushion = opts.cushion == null ? 0.12 : clamp(+opts.cushion, 0, 0.4);
    const target = r2(budget * (1 - cushion)), goals = opts.goals || {}, goal = opts.goal || 'balanced';
    const pool = (opts.pool || []).filter(m => m && m.ingredients && m.ingredients.length);
    const N = days * slots.length, costOpts = { have: opts.have, basics: opts.basics, store: opts.store };
    const grid = []; for (let d = 0; d < days; d++) for (const s of slots) grid.push({ d, slot: s, meal: null });
    if (!pool.length) return finish();

    const fits = (m, slot) => !m.slot || m.slot === slot || (slot === 'lunch' && m.slot === 'dinner') || (slot === 'dinner' && m.slot === 'lunch') || slots.length === 1;
    function quality(m, slot) {
      const share = SLOT_SHARE[slot] || 0.3, kT = (goals.kcal || 2000) * share, pT = (goals.protein || 120) * share;
      let q = 1 - Math.min(1, Math.abs((m.kcal || kT) - kT) / kT) * 0.8;            // calories near this meal's share
      q += Math.min(1.2, (m.protein || 0) / pT) * (goal === 'protein' ? 1.6 : 1);   // protein toward the goal
      if (goal === 'lighter') q += (kT - (m.kcal || kT)) / kT;
      if (goal === 'quick') q += ((40 - (m.minutes || 30)) / 30);
      return q + (m.weight || 0) + (m.score ? (m.score - 80) / 100 : 0);
    }
    const picksOf = () => { const c = new Map(); for (const g of grid) if (g.meal) c.set(g.meal.id, { meal: g.meal, times: (c.get(g.meal.id) || { times: 0 }).times + H }); return [...c.values()]; };
    const totalWith = () => costList(picksOf(), costOpts).total;
    const maxUse = Math.max(2, Math.ceil(N / pool.length) + 1), uses = m => grid.filter(x => x.meal && x.meal.id === m.id).length;
    const costW = goal === 'save' ? 1.4 : 0.55; // money matters most through the pace check below
    const variety = (m, g) => {
      let pen = 0;
      for (const x of grid) {
        if (!x.meal || x.meal.id !== m.id || x === g) continue;
        if (x.d === g.d) pen += 1.6;                                          // never the same dish twice in a day
        else if (Math.abs(x.d - g.d) === 1) pen += x.slot === 'dinner' && g.slot === 'lunch' && x.d < g.d ? 0.15 : slots.length === 1 ? 1.2 : 0.7; // last night's dinner → today's lunch is fine
        else pen += 0.35;
      }
      return pen;
    };

    // 1) greedy fill, day by day, weighing quality against what each meal ADDS to the bill (shared packages are cheap)
    let spent = 0;
    grid.forEach((g, gi) => {
      const pace = target * (gi + 1) / N;
      let best = null;
      for (const m of pool) {
        if (!fits(m, g.slot)) continue;
        if (uses(m) >= maxUse) continue;
        g.meal = m; const t = totalWith(); g.meal = null;
        const marginal = t - spent, per = target / N;
        let u = quality(m, g.slot) - costW * marginal / Math.max(1, per) - variety(m, g);
        if (t > pace * 1.12) u -= (t - pace * 1.12) / Math.max(1, per) * 2;
        if (!best || u > best.u) best = { m, u, t };
      }
      if (best) { g.meal = best.m; spent = best.t; }
    });

    // 2) over target? swap the meals that save the most money for the least quality lost
    for (let guard = 0; guard < 40 && spent > target; guard++) {
      let best = null;
      grid.forEach(g => {
        if (!g.meal) return; const cur = g.meal, q0 = quality(cur, g.slot) - variety(cur, g);
        for (const m of pool) {
          if (m.id === cur.id || !fits(m, g.slot) || uses(m) >= maxUse) continue;
          g.meal = m; const t = totalWith(), q1 = quality(m, g.slot) - variety(m, g); g.meal = cur;
          const saved = spent - t; if (saved <= 0.01) continue;
          const score = saved / (0.3 + Math.max(0, q0 - q1));
          if (!best || score > best.score) best = { g, m, t, score };
        }
      });
      if (!best) break; best.g.meal = best.m; spent = best.t;
    }
    // 3) money left over? upgrade meals (more protein, better calorie fit, more variety) while staying under the target
    for (let guard = 0; guard < 30 && spent < target * 0.9; guard++) {
      let best = null;
      grid.forEach(g => {
        if (!g.meal) return; const cur = g.meal, q0 = quality(cur, g.slot) - variety(cur, g);
        for (const m of pool) {
          if (m.id === cur.id || !fits(m, g.slot) || uses(m) >= maxUse) continue;
          g.meal = m; const q1 = quality(m, g.slot) - variety(m, g), t = totalWith(); g.meal = cur;
          if (t > target || q1 - q0 < 0.08) continue;
          const score = (q1 - q0) / (0.5 + Math.max(0, t - spent) / Math.max(1, target / N));
          if (!best || score > best.score) best = { g, m, t, score };
        }
      });
      if (!best) break; best.g.meal = best.m; spent = best.t;
    }
    return finish();

    function finish() {
      const c = costList(picksOf(), costOpts);
      const used = grid.filter(g => g.meal);
      const kcal = used.reduce((a, g) => a + (g.meal.kcal || 0), 0) / days, protein = used.reduce((a, g) => a + (g.meal.protein || 0), 0) / days;
      const out = used.reduce((a, g) => a + (g.meal.restPrice || 0) * H, 0);
      const outCount = used.filter(g => g.meal.restPrice).length;
      return {
        v: 1, created: Date.now(), budget, target, cushion, days, household: H, slots, goal, store: opts.store || '',
        meals: grid.map(g => ({ day: DAY_NAMES[((opts.startDay || 0) + g.d) % 7], d: g.d, slot: g.slot, id: g.meal ? g.meal.id : null })),
        items: c.items, pantryCheck: c.pantryCheck, total: c.total, factor: c.factor, over: c.total > budget, underTarget: c.total <= target,
        perDay: { kcal: Math.round(kcal), protein: Math.round(protein) },
        eatingOut: outCount ? r2(out) : 0, outMeals: outCount,
        swaps: swapsFor(c.items, c.total > target),
        empty: !pool.length,
      };
    }
  }
  function swapsFor(items, needed) {
    const out = [];
    for (const [fromKey, toKey, note] of SWAPS) {
      const it = items.find(i => !i.have && i.key === fromKey); if (!it) continue;
      const to = PRICES.find(p => p.key === toKey); if (!to) continue;
      const newCost = Math.max(1, Math.ceil(it.uses / to.serv)) * to.price * factor();
      const save = r2(it.cost - newCost); if (save >= 0.5) out.push({ from: it.name, to: cap(to.search), save, note });
    }
    out.push({ from: 'Name brands', to: 'Store brand', save: r2(items.filter(i => !i.have).reduce((a, i) => a + i.cost, 0) * 0.12), note: 'Store brands (Publix, Great Value, Kirkland) usually run 10–25% cheaper' });
    return out.sort((a, b) => b.save - a.save).slice(0, needed ? 5 : 3);
  }

  /** Re-cost a saved plan after edits (prices, fridge, swapped meal). */
  function recost(planObj, mealsById, opts = {}) {
    const c = new Map();
    for (const s of planObj.meals) { const m = s.id && mealsById(s.id); if (m) c.set(m.id, { meal: m, times: (c.get(m.id) || { times: 0 }).times + planObj.household }); }
    const r = costList([...c.values()], { have: opts.have, basics: opts.basics, store: planObj.store });
    return Object.assign(planObj, { items: r.items, pantryCheck: r.pantryCheck, total: r.total, factor: r.factor, over: r.total > planObj.budget, underTarget: r.total <= planObj.target, swaps: swapsFor(r.items, r.total > planObj.target) });
  }

  /* ---------- learning from receipts and your own prices ---------- */
  function logReceipt(estimate, actual, store) {
    estimate = +estimate; actual = +actual; if (!(estimate > 0 && actual > 0)) return null;
    const ratio = clamp(actual / (estimate / factor(store)), 0.5, 2), k = (store || 'any store').toLowerCase().slice(0, 40);
    const f = st.factor[k] || { v: 1, n: 0 };
    f.v = r2(f.n ? f.v * 0.6 + ratio * 0.4 : ratio); f.n = Math.min(20, f.n + 1); st.factor[k] = f;
    st.receipts.unshift({ at: Date.now(), store: store || '', estimate: r2(estimate), actual: r2(actual) }); st.receipts = st.receipts.slice(0, 30);
    save(); return f.v;
  }
  function setPrice(key, price) { if (price === '' || price == null || isNaN(+price)) delete st.prices[key]; else st.prices[key] = r2(+price); save(); }
  function reset() { st.prices = {}; st.receipts = []; st.factor = {}; save(); }

  /* ---------- Instacart ---------- */
  const UNITS = { oz: 'ounce', ounce: 'ounce', ounces: 'ounce', lb: 'pound', lbs: 'pound', pound: 'pound', cup: 'cup', cups: 'cup', tbsp: 'tablespoon', tablespoon: 'tablespoon', tablespoons: 'tablespoon',
    tsp: 'teaspoon', teaspoon: 'teaspoon', teaspoons: 'teaspoon', g: 'gram', kg: 'kilogram', can: 'can', cans: 'can', clove: 'each', cloves: 'each', slice: 'each', slices: 'each', bunch: 'bunch', head: 'head', package: 'package', pack: 'package' };
  const FRAC = { '½': 0.5, '⅓': 0.33, '⅔': 0.67, '¼': 0.25, '¾': 0.75, '⅛': 0.125 };
  function measure(qty, times) {
    const s = String(qty || '').trim().toLowerCase(); const m = s.match(/^(\d+(?:\.\d+)?)?\s*([½⅓⅔¼¾⅛])?(?:\s*-\s*\d+)?\s*([a-z]+)?/);
    if (!m || (!m[1] && !m[2])) return null;
    const n = (m[1] ? +m[1] : 0) + (m[2] ? FRAC[m[2]] : 0); const unit = UNITS[m[3]] || (m[3] ? null : 'each');
    if (!unit || !n) return null;
    return { quantity: r2(n * (times || 1)), unit };
  }
  const HEALTH = ['ORGANIC', 'GLUTEN_FREE', 'FAT_FREE', 'VEGAN', 'KOSHER', 'SUGAR_FREE', 'LOW_FAT'];
  const filt = f => { const h = (f || []).filter(x => HEALTH.includes(x)); return h.length ? { health_filters: h } : undefined; };
  /** Shopping-list page from planner items (skips what you already have). */
  function listPayload(title, items, o = {}) {
    const line_items = items.filter(i => !i.have && !i.checked).slice(0, 100).map(i => {
      const li = { name: i.search || i.name, display_text: i.pkgs ? `${i.name} (${i.pkgs > 1 ? i.pkgs + ' × ' : ''}${i.pkg})` : i.name };
      if (i.pkgs) li.line_item_measurements = [{ quantity: i.pkgs, unit: 'package' }];
      const f = filt(o.filters); if (f) li.filters = f; return li;
    });
    return { action: 'list', title: String(title).slice(0, 120), line_items, instructions: o.instructions ? [].concat(o.instructions).slice(0, 5) : undefined, linkback: o.linkback };
  }
  /** Recipe page for one dish. */
  function recipePayload(meal, o = {}) {
    const servings = o.servings || 1;
    return { action: 'recipe', title: String(meal.name).slice(0, 120), servings, cooking_time: meal.minutes || undefined, author: o.author, image_url: o.image,
      instructions: (meal.steps || []).slice(0, 20),
      ingredients: (meal.ingredients || []).filter(i => !/^pantry$/i.test(i.qty || '')).slice(0, 40).map(i => {
        const mm = match(i.name), li = { name: mm ? mm.search : norm(i.name), display_text: `${i.name}${i.qty ? ' · ' + i.qty : ''}` };
        const ms = measure(i.qty, servings); if (ms) li.measurements = [ms];
        const f = filt(o.filters); if (f) li.filters = f; return li;
      }), linkback: o.linkback, pantry: true };
  }
  /** Sends a payload to your shop endpoint and opens Instacart. Opens the tab first so phones don't block it as a pop-up. */
  async function openInstacart(api, payload) {
    const w = G.open ? G.open('about:blank', '_blank') : null;
    try {
      if (!api) throw new Error('not configured');
      const r = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.url) throw new Error(j.error || 'Instacart is unavailable right now');
      if (w) w.location.href = j.url; else G.location.href = j.url;
      return { ok: true, url: j.url };
    } catch (e) {
      if (w) w.close();
      return { ok: false, error: e.message, text: textOf(payload) };
    }
  }
  function textOf(p) {
    if (p.action === 'recipe') return `${p.title}\n` + p.ingredients.map(i => '• ' + i.display_text).join('\n');
    return `${p.title}\n` + p.line_items.map(i => '• ' + i.display_text).join('\n');
  }
  const listText = (title, items) => `${title}\n` + items.filter(i => !i.have).map(i => `☐ ${i.name}${i.pkgs ? ` (${i.pkgs > 1 ? i.pkgs + ' × ' : ''}${i.pkg})` : ''} · ~$${i.cost.toFixed(2)}`).join('\n');

  G.SHOPKIT = { VERSION, PRICES, HEALTH, match, keyOf, norm, costList, plan, recost, logReceipt, setPrice, reset, factor, state: st, listPayload, recipePayload, openInstacart, listText, textOf, measure, DAY_NAMES };
})(typeof window !== 'undefined' ? window : globalThis);
