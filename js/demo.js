/* WAYOF v7 — animated exercise demonstrations (side-view figure, forward kinematics)
   Angles are absolute, in degrees. Limbs: 0 = pointing straight down, 90 = forward (+x), 180 = up, -90 = backward.
   Torso: 0 = upright, +90 = leaning forward horizontal, -90 = lying on back (head to the left). */
window.WAYOF_DEMO = (function () {
  const LEN = { torso: 52, thigh: 34, shin: 34, upper: 26, fore: 24 };
  const GROUND = 180;
  const rad = d => d * Math.PI / 180;
  const limb = (a, l) => [Math.sin(rad(a)) * l, Math.cos(rad(a)) * l];
  const add = (p, v) => [p[0] + v[0], p[1] + v[1]];
  const stand = { t: 0, l1: [0, 0], l2: [0, 0], a1: [0, 0], a2: [0, 0] };
  const P = (o) => Object.assign({}, stand, o);

  // pattern: { keys:[pose...], ms, anchor:[x,y] | null, prop, cues[] }
  const patterns = {
    squat: { keys: [P({ a1: [20, 20], a2: [18, 18] }), P({ t: 35, l1: [80, -25], l2: [78, -23], a1: [90, 90], a2: [88, 88] })], ms: 1700, anchor: [100, GROUND], cues: ['Feet shoulder-width, toes slightly out', 'Sit hips back and down, chest proud', 'Drive through mid-foot to stand'] },
    lunge: { keys: [P({ l1: [25, 0], l2: [-25, -25] }), P({ l1: [80, 0], l2: [-10, -80] })], ms: 1800, anchor: [118, GROUND], cues: ['Long stance, torso tall', 'Lower the back knee toward the floor', 'Push through the front heel to rise'] },
    pushup: { keys: [P({ t: 65, l1: [-65, -65], l2: [-65, -65], a1: [0, 0], a2: [0, 0] }), P({ t: 80, l1: [-80, -80], l2: [-80, -80], a1: [-60, 73], a2: [-58, 73] })], ms: 1600, anchor: [35, GROUND], cues: ['Hands under shoulders, body in one line', 'Lower chest with elbows ~45° from body', 'Press the floor away; keep hips level'] },
    plank: { keys: [P({ t: 75, l1: [-75, -75], l2: [-75, -75], a1: [0, 90], a2: [0, 90] }), P({ t: 73, l1: [-73, -73], l2: [-73, -73], a1: [0, 90], a2: [0, 90] })], ms: 2400, anchor: [30, GROUND], cues: ['Elbows under shoulders', 'Squeeze glutes, brace your belly', 'Breathe slowly — don\'t let hips sag'] },
    bridge: { keys: [P({ t: -90, l1: [150, -15], l2: [148, -15], a1: [95, 95], a2: [95, 95] }), P({ t: -110, l1: [115, -10], l2: [113, -10], a1: [100, 100], a2: [100, 100] })], ms: 1800, anchor: [130, GROUND], cues: ['Feet flat, knees bent', 'Squeeze glutes to lift hips', 'Pause at the top, lower with control'] },
    hinge: { keys: [P({ l1: [3, 0], l2: [3, 0] }), P({ t: 70, l1: [20, 5], l2: [19, 5] })], ms: 1900, anchor: [100, GROUND], prop: 'weight', cues: ['Soft knees, flat back', 'Push hips back — weight slides down the legs', 'Squeeze glutes to stand tall'] },
    row: { keys: [P({ t: 60, l1: [20, 5], l2: [19, 5], a1: [0, 0], a2: [0, 0] }), P({ t: 60, l1: [20, 5], l2: [19, 5], a1: [-100, 5], a2: [0, 0] })], ms: 1500, anchor: [100, GROUND], prop: 'weight', cues: ['Hinge forward with a flat back', 'Pull elbow toward your hip', 'Squeeze shoulder blade, lower slowly'] },
    press: { keys: [P({ a1: [30, 170], a2: [28, 170] }), P({ a1: [178, 180], a2: [176, 180] })], ms: 1600, anchor: [100, GROUND], prop: 'weight', cues: ['Ribs down, glutes tight', 'Press straight overhead', 'Lower to shoulder height with control'] },
    chest: { keys: [P({ t: -90, l1: [90, 0], l2: [88, 0], a1: [30, 175], a2: [28, 175] }), P({ t: -90, l1: [90, 0], l2: [88, 0], a1: [180, 180], a2: [178, 180] })], ms: 1600, pelvis: [118, 140], prop: 'bench', cues: ['Feet planted, shoulder blades pinned', 'Lower to mid-chest', 'Press up and slightly back'] },
    curl: { keys: [P({ a1: [0, 0], a2: [2, 2] }), P({ a1: [0, 165], a2: [2, 160] })], ms: 1500, anchor: [100, GROUND], prop: 'weight', cues: ['Elbows pinned to your sides', 'Curl without swinging', 'Lower all the way down'] },
    pull: { keys: [P({ l1: [10, -60], l2: [8, -58], a1: [180, 180], a2: [178, 178] }), P({ l1: [10, -60], l2: [8, -58], a1: [60, 150], a2: [58, 150] })], ms: 1900, pelvis: [100, 142], pelvisB: [100, 112], prop: 'bar', cues: ['Start from a dead hang', 'Drive elbows down to your ribs', 'Lower slowly to full stretch'] },
    march: { keys: [P({ l1: [45, -35], l2: [-15, 0], a1: [-35, 60], a2: [35, 80] }), P({ l1: [-15, 0], l2: [45, -35], a1: [35, 80], a2: [-35, 60] })], ms: 900, pelvis: [100, 113], cues: ['Stay tall and relaxed', 'Drive knees, swing arms naturally', 'Breathe rhythmically — you should be able to talk'] },
    jump: { keys: [P({ l1: [5, -5], l2: [-5, 5], a1: [40, 110], a2: [30, 100] }), P({ l1: [8, -20], l2: [-8, -20], a1: [60, 130], a2: [50, 120] })], ms: 600, pelvis: [100, 113], pelvisB: [100, 104], cues: ['Light, quick bounces on the balls of your feet', 'Wrists do the work', 'Land softly'] },
    bike: { keys: [P({ t: 40, l1: [70, -15], l2: [20, 15], a1: [70, 70], a2: [68, 68] }), P({ t: 40, l1: [20, 15], l2: [70, -15], a1: [70, 70], a2: [68, 68] })], ms: 900, pelvis: [92, 112], prop: 'bike', cues: ['Saddle at hip height', 'Smooth circles, light grip', 'Alternate hard and easy intervals'] },
    swim: { keys: [P({ t: 90, l1: [-90, -95], l2: [-85, -80], a1: [90, 90], a2: [-80, -80] }), P({ t: 90, l1: [-85, -80], l2: [-90, -95], a1: [-80, -80], a2: [90, 90] })], ms: 1400, pelvis: [85, 120], prop: 'water', cues: ['Long body, face down', 'Reach forward, pull back to the hip', 'Steady kick from the hips'] },
    fold: { keys: [P({ a1: [180, 180], a2: [178, 178] }), P({ t: 80, a1: [10, 10], a2: [12, 12] })], ms: 2600, anchor: [100, GROUND], prop: 'mat', cues: ['Reach tall on the inhale', 'Hinge and fold on the exhale', 'Move slowly — stretch, don\'t strain'] },
    deadbug: { keys: [P({ t: -90, l1: [180, 90], l2: [178, 90], a1: [180, 180], a2: [178, 178] }), P({ t: -90, l1: [180, 90], l2: [100, 100], a1: [-100, -100], a2: [178, 178] })], ms: 1800, pelvis: [112, 172], prop: 'mat', cues: ['Lower back pressed into the floor', 'Extend opposite arm and leg slowly', 'Exhale as you reach'] },
    birddog: { keys: [P({ t: 82, l1: [0, -90], l2: [0, -90], a1: [0, 0], a2: [0, 0] }), P({ t: 82, l1: [0, -90], l2: [-92, -92], a1: [0, 0], a2: [92, 92] })], ms: 2000, pelvis: [82, 146], prop: 'mat', cues: ['Hands under shoulders, knees under hips', 'Reach opposite arm and leg long', 'Keep hips square — no twisting'] },
    slam: { keys: [P({ a1: [180, 180], a2: [178, 178] }), P({ t: 50, l1: [45, -15], l2: [44, -14], a1: [35, 35], a2: [33, 33] })], ms: 1000, anchor: [100, GROUND], prop: 'ball', cues: ['Reach the ball overhead', 'Slam down using your whole body', 'Squat to pick it up — back flat'] },
    swing: { keys: [P({ t: 65, l1: [25, 5], l2: [24, 5], a1: [-30, -30], a2: [-28, -28] }), P({ a1: [95, 95], a2: [93, 93] })], ms: 1100, anchor: [100, GROUND], prop: 'weight', cues: ['Hike the bell back between your legs', 'Snap hips forward — arms just guide', 'Float to chest height, never lift with arms'] }
  };

  const demoFor = {
    'Bodyweight squat': 'squat', 'Goblet squat': 'squat', 'Barbell back squat': 'squat', 'Leg press': 'squat', 'Reverse lunge': 'lunge', 'Hip flexor stretch': 'lunge', 'Glute bridge': 'bridge',
    'Incline push-up': 'pushup', 'Push-up': 'pushup', 'Pike push-up': 'press', 'Prone Y-T raise': 'fold', 'Forearm plank': 'plank', 'Dead bug': 'deadbug', 'Bird dog': 'birddog',
    'Brisk walking intervals': 'march', 'Low-impact cardio circuit': 'march', 'Standing mobility flow': 'fold', 'Yoga flow': 'fold', 'Cat-cow & thoracic rotation': 'birddog',
    'Dumbbell Romanian deadlift': 'hinge', 'Dumbbell floor press': 'chest', 'Dumbbell shoulder press': 'press', 'One-arm dumbbell row': 'row', 'Dumbbell curl': 'curl',
    'Band pull-apart': 'row', 'Band seated row': 'row', 'Band chest press': 'chest', 'Kettlebell deadlift': 'hinge', 'Kettlebell swing': 'swing', 'Barbell deadlift': 'hinge', 'Bench press': 'chest',
    'Pull-up / assisted pull-up': 'pull', 'Cable row': 'row', 'Treadmill incline walk': 'march', 'Bike intervals': 'bike', 'Rowing intervals': 'row', 'Elliptical steady state': 'march', 'Stair climber': 'march',
    'Jump rope intervals': 'jump', 'Battle rope waves': 'jump', 'Swimming laps': 'swim', 'Outdoor walk': 'march', 'Easy run': 'march', 'Run intervals': 'march', 'Stationary bike steady ride': 'bike', 'Spin bike intervals': 'bike', 'Smart trainer ride': 'bike', 'Outdoor bike ride': 'bike', 'Foam roller release': 'bridge', 'Stability ball dead bug': 'deadbug', 'Suspension row': 'row', 'Medicine ball slam': 'slam'
  };
  const patternOf = name => patterns[demoFor[name] || 'fold'];

  function solve(pose, pat, k) {
    const legVec = (l) => add(limb(l[0], LEN.thigh), limb(l[1], LEN.shin));
    let p;
    if (pat.pelvis) { const A = pat.pelvis, B = pat.pelvisB || pat.pelvis; p = [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k]; }
    else { const v = legVec(pose.l1); p = [pat.anchor[0] - v[0], pat.anchor[1] - v[1]]; }
    const tv = [Math.sin(rad(pose.t)) * LEN.torso, -Math.cos(rad(pose.t)) * LEN.torso];
    const s = add(p, tv), u = [tv[0] / LEN.torso, tv[1] / LEN.torso];
    const head = add(s, [u[0] * 15, u[1] * 15]);
    const leg = l => { const kn = add(p, limb(l[0], LEN.thigh)); return [kn, add(kn, limb(l[1], LEN.shin))]; };
    const arm = a => { const el = add(s, limb(a[0], LEN.upper)); return [el, add(el, limb(a[1], LEN.fore))]; };
    return { p, s, head, L1: leg(pose.l1), L2: leg(pose.l2), A1: arm(pose.a1), A2: arm(pose.a2), u };
  }
  const lerp = (a, b, k) => typeof a === 'number' ? a + (b - a) * k : a.map((x, i) => x + (b[i] - x) * k);
  function blend(A, B, k) { const o = {}; for (const key in A) o[key] = lerp(A[key], B[key], k); return o; }
  const ease = x => 0.5 - Math.cos(Math.PI * x) / 2;
  const f = n => n.toFixed(1);

  /* ---------- illustrated athlete renderer ----------
     Volumetric, shaded limbs (tapered capsules), clothing, skin tone, hair, face, shoes and floor shadow.
     Each coach persona has its own look; WAYOF_DEMO.setLook() switches it. */
  const LOOKS = {
    guide: { skin: '#c68642', hair: '#2b1d14', hairStyle: 'locs', shirt: '#6d5bd0', pants: '#262838', shoe: '#f4f4f7', sole: '#6d5bd0', name: 'Guide' },
    motivator: { skin: '#7a4a24', hair: '#17110d', hairStyle: 'short', shirt: '#e0662e', pants: '#1f2130', shoe: '#f4f4f7', sole: '#e0662e', name: 'Motivator' },
    strategist: { skin: '#f0c8a0', hair: '#a9a9ad', hairStyle: 'short', beard: true, shirt: '#24262f', pants: '#2f3341', shoe: '#e9e9ee', sole: '#24262f', name: 'Strategist' },
    companion: { skin: '#e8b98f', hair: '#4a3020', hairStyle: 'pony', shirt: '#1b9478', pants: '#232533', shoe: '#f4f4f7', sole: '#1b9478', name: 'Companion' }
  };
  let LOOK = LOOKS.guide;
  const setLook = key => { LOOK = LOOKS[key] || LOOKS.guide; };
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (h, t, a) => { const A = hex(h), B = hex(t); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * a).toString(16).padStart(2, '0')).join(''); };
  const dark = (h, a = .22) => mix(h, '#000000', a), light = (h, a = .28) => mix(h, '#ffffff', a);
  // tapered capsule from a (radius ra) to b (radius rb) with a soft highlight and shaded edge
  const lerpP = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  function capsule(a, b, ra, rb, col, shade = true) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 0.001, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const P = (q, r, s) => `${f(q[0] + nx * r * s)},${f(q[1] + ny * r * s)}`;
    let o = `<path d="M${P(a, ra, 1)} L${P(b, rb, 1)} A${f(rb)} ${f(rb)} 0 0 0 ${P(b, rb, -1)} L${P(a, ra, -1)} A${f(ra)} ${f(ra)} 0 0 0 ${P(a, ra, 1)}Z" fill="${col}" stroke="${dark(col, .28)}" stroke-width=".7"/>`;
    if (shade && L > 6) {
      // soft highlight along the lit side, kept inside the limb so joints stay clean
      const t0 = Math.min(.3, ra / L), t1 = Math.max(.7, 1 - rb / L), A = lerpP(a, b, t0), B = lerpP(a, b, t1);
      o += `<line x1="${f(A[0] + nx * ra * .42)}" y1="${f(A[1] + ny * ra * .42)}" x2="${f(B[0] + nx * rb * .42)}" y2="${f(B[1] + ny * rb * .42)}" stroke="${light(col, .55)}" stroke-width="${f((ra + rb) * .2)}" stroke-linecap="round" opacity=".38"/>`;
    }
    return o;
  }
  function shoe(kn, an, col, sole) {
    const d = [an[0] - kn[0], an[1] - kn[1]], l = Math.hypot(d[0], d[1]) || 1, n = [-d[1] / l, d[0] / l], dir = n[0] >= 0 ? n : [-n[0], -n[1]];
    const toe = add(an, [dir[0] * 10.5, dir[1] * 10.5]), heel = add(an, [-dir[0] * 2, -dir[1] * 2]);
    const down = [d[0] / l, d[1] / l];
    return capsule(heel, toe, 5.2, 4.2, col, false) + `<line x1="${f(heel[0] + down[0] * 4.3)}" y1="${f(heel[1] + down[1] * 4.3)}" x2="${f(toe[0] + down[0] * 3.2)}" y2="${f(toe[1] + down[1] * 3.2)}" stroke="${sole}" stroke-width="1.8" stroke-linecap="round" opacity=".85"/>`;
  }
  function headSVG(h, u, lk) {
    const ang = Math.atan2(u[0], -u[1]) * 180 / Math.PI; // rotate local "up" to torso direction
    const sk = lk.skin, hr = lk.hair;
    let hair = '';
    if (lk.hairStyle === 'locs') hair = `<path d="M-11,3 A11.4,11.4 0 0 1 9,-8.5 Q4,-6.5 -1,-5.5 Q-6,-3 -8,4 Q-9,12 -6,19 L-11,18 Q-14,10 -11,3Z" fill="${hr}"/><path d="M-9,6 Q-11,13 -9,19 M-6,5 Q-7,12 -5,18" stroke="${light(hr, .25)}" stroke-width="1.2" fill="none"/>`;
    else if (lk.hairStyle === 'pony') hair = `<path d="M-11,2 A11.3,11.3 0 0 1 9.5,-7.5 Q3,-6.8 -2,-5 Q-7,-2 -10.5,4Z" fill="${hr}"/><path d="M-10,-1 Q-17,2 -16,12 Q-14,7 -10,4Z" fill="${hr}"/>`;
    else hair = `<path d="M-10.8,1 A11.2,11.2 0 0 1 9.8,-6.8 Q3,-7.2 -2,-6 Q-7,-4.5 -10.8,1Z" fill="${hr}"/>`;
    const beard = lk.beard ? `<path d="M2,3 Q6,10.5 10,4.5 Q10.6,7.5 7.5,9.6 Q3.8,11 1,7Z" fill="${hr}" opacity=".9"/>` : '';
    return `<g transform="translate(${f(h[0])} ${f(h[1])}) rotate(${f(ang)})">
      <ellipse cx="0" cy="0.5" rx="10.6" ry="11.4" fill="${sk}"/><ellipse cx="-3" cy="2" rx="7" ry="8.5" fill="${dark(sk, .12)}" opacity=".55"/>
      <path d="M9.6,-1 Q12.4,1.6 10,3.6Z" fill="${sk}"/>${hair}${beard}
      <ellipse cx="-1.6" cy="1.6" rx="2.1" ry="3" fill="${dark(sk, .2)}"/><circle cx="5.6" cy="-1.2" r="1.15" fill="#1d1b29"/><path d="M4,-3.6 L7.6,-3.4" stroke="${dark(hr, .1)}" stroke-width="1" stroke-linecap="round"/>
      <path d="M5.6,5.6 Q7.4,6.6 8.8,5.6" stroke="${dark(sk, .45)}" stroke-width=".9" fill="none" stroke-linecap="round"/></g>`;
  }
  function athlete(J, lk, side) {
    // side: 'far' draws the far arm+leg in a slightly darker tone (depth), 'near' the near ones, 'body' torso/head
    const far = side === 'far', sk = far ? dark(lk.skin, .18) : lk.skin, sh = far ? dark(lk.shirt, .2) : lk.shirt, pa = far ? dark(lk.pants, .25) : lk.pants, so = far ? dark(lk.shoe, .12) : lk.shoe;
    const L = far ? J.L2 : J.L1, A = far ? J.A2 : J.A1;
    if (side === 'body') {
      const fwd = [-J.u[1], J.u[0]], neckTop = add(J.s, [J.u[0] * 7, J.u[1] * 7]);
      return capsule(J.s, neckTop, 4.6, 4.2, lk.skin, false)
        + capsule(add(J.p, [-fwd[0] * 1.5, -fwd[1] * 1.5]), add(J.p, [fwd[0] * 1.5, fwd[1] * 1.5]), 10.2, 10, lk.pants, false)
        + capsule(add(J.p, [J.u[0] * 5, J.u[1] * 5]), add(J.s, [-J.u[0] * 1, -J.u[1] * 1]), 9.8, 11.6, lk.shirt)
        + `<path d="M${f(J.s[0] + fwd[0] * 9)},${f(J.s[1] + fwd[1] * 9)} Q${f(J.s[0] + fwd[0] * 4 + J.u[0] * 4)},${f(J.s[1] + fwd[1] * 4 + J.u[1] * 4)} ${f(J.s[0] - fwd[0] * 2 + J.u[0] * 5)},${f(J.s[1] - fwd[1] * 2 + J.u[1] * 5)}" stroke="${dark(lk.shirt, .35)}" stroke-width="1.4" fill="none"/>`
        + headSVG(J.head, J.u, lk);
    }
    const legs = capsule(J.p, L[0], 9.6, 7.2, pa) + capsule(L[0], L[1], 7, 4.8, pa) + shoe(L[0], L[1], so, far ? dark(lk.sole, .2) : lk.sole);
    const sleeveEnd = lerpP(J.s, A[0], .55);
    const arms = capsule(J.s, A[0], 5.6, 4.6, sk) + capsule(J.s, sleeveEnd, 6.3, 5.7, sh) + capsule(A[0], A[1], 4.6, 3.5, sk) + `<circle cx="${f(A[1][0])}" cy="${f(A[1][1])}" r="4.3" fill="${sk}"/>`;
    return legs + arms;
  }
  function equipment(pat, J, gear, top) {
    let g = '';
    const h = J.A1[1], h2 = J.A2[1];
    const db = (p, s = 1) => `<g transform="translate(${f(p[0])} ${f(p[1])}) scale(${s})"><rect x="-9" y="-1.6" width="18" height="3.2" rx="1.5" fill="#8a8d99"/><rect x="-12" y="-6.5" width="5" height="13" rx="1.6" fill="#2a2c36"/><rect x="7" y="-6.5" width="5" height="13" rx="1.6" fill="#2a2c36"/><rect x="-11.2" y="-5.6" width="1.4" height="11" rx=".7" fill="#555866"/><rect x="7.8" y="-5.6" width="1.4" height="11" rx=".7" fill="#555866"/></g>`;
    if (!top) {
      if (pat.prop === 'bar') { const y = Math.min(J.A1[1][1], J.A2[1][1]); g += `<rect x="58" y="-14" width="4" height="${f(y + 14)}" fill="#3a3d4a"/><rect x="138" y="-14" width="4" height="${f(y + 14)}" fill="#3a3d4a"/><line x1="40" y1="${f(y)}" x2="160" y2="${f(y)}" stroke="#9aa0ad" stroke-width="4.5" stroke-linecap="round"/><line x1="40" y1="${f(y - 1)}" x2="160" y2="${f(y - 1)}" stroke="#d9dce4" stroke-width="1.2" stroke-linecap="round"/>`; }
      if (pat.prop === 'bench') g += `<rect x="50" y="146" width="80" height="9" rx="4" fill="#2a2c36"/><rect x="52" y="146" width="76" height="3" rx="1.5" fill="#4a4d5c"/><rect x="58" y="155" width="5" height="25" fill="#555866"/><rect x="117" y="155" width="5" height="25" fill="#555866"/><rect x="52" y="178" width="18" height="3" rx="1.5" fill="#555866"/><rect x="110" y="178" width="18" height="3" rx="1.5" fill="#555866"/>`;
      if (pat.prop === 'bike') g += `<g stroke="#3a3d4a" stroke-width="3.5" fill="none" stroke-linejoin="round" stroke-linecap="round"><circle cx="62" cy="160" r="19"/><circle cx="150" cy="160" r="19"/><path d="M62 160 L95 118 L140 118 L150 160 M95 118 L105 158 L62 160 M140 118 L146 100 M146 100 h10"/></g><circle cx="62" cy="160" r="3" fill="#3a3d4a"/><circle cx="150" cy="160" r="3" fill="#3a3d4a"/><rect x="84" y="113" width="20" height="5" rx="2.5" fill="#1d1b29"/>`;
      if (pat.prop === 'water') g += `<rect x="-20" y="112" width="240" height="90" fill="#3b82e6" opacity=".14"/><path d="M-20 112 Q 5 106 30 112 T 80 112 T 130 112 T 180 112 T 230 112" stroke="#3b82e6" stroke-width="1.6" fill="none" opacity=".5"/>`;
      if (pat.prop === 'mat') g += `<rect x="16" y="178" width="168" height="5" rx="2.5" fill="${LOOK.sole}" opacity=".35"/>`;
      return g;
    }
    const weighted = pat.prop === 'weight' && gear && !/bodyweight|band|mat|suspension|cable|rowing|machine/i.test(gear);
    if (weighted) {
      if (/kettlebell/i.test(gear)) g += `<g transform="translate(${f(h[0])} ${f(h[1] + 9)})"><path d="M-6,-6 Q0,-14 6,-6" stroke="#2a2c36" stroke-width="3" fill="none"/><circle r="9" fill="#2a2c36"/><ellipse cx="-3" cy="-3" rx="3" ry="2" fill="#6b6e7c" opacity=".7"/></g>`;
      else if (/barbell|squat rack/i.test(gear)) g += `<line x1="${f(h[0] - 34)}" y1="${f(h[1])}" x2="${f(h[0] + 34)}" y2="${f(h[1])}" stroke="#9aa0ad" stroke-width="3"/><rect x="${f(h[0] - 38)}" y="${f(h[1] - 13)}" width="7" height="26" rx="2" fill="#2a2c36"/><rect x="${f(h[0] + 31)}" y="${f(h[1] - 13)}" width="7" height="26" rx="2" fill="#2a2c36"/>`;
      else g += db(h) + (pat.keys.length && /curl|press/i.test(pat.cues.join(' ')) ? '' : '');
    }
    if (pat.prop === 'ball') g += `<circle cx="${f(h[0] + 4)}" cy="${f(h[1] - 5)}" r="10.5" fill="#d0682e"/><path d="M${f(h[0] - 5)},${f(h[1] - 8)} Q${f(h[0] + 4)},${f(h[1] - 1)} ${f(h[0] + 13)},${f(h[1] - 8)}" stroke="#8f3f16" stroke-width="1.2" fill="none"/><circle cx="${f(h[0])}" cy="${f(h[1] - 9)}" r="2.5" fill="#fff" opacity=".35"/>`;
    if (/band/i.test(gear || '')) g += `<path d="M${f(h[0])} ${f(h[1])} Q ${f((h[0] + 175) / 2)} ${f(h[1] + 12)} 175 ${f(J.s[1] + 10)}" stroke="#1b9478" stroke-width="3.2" fill="none" stroke-linecap="round"/><rect x="172" y="${f(J.s[1] - 4)}" width="8" height="28" rx="3" fill="#3a3d4a"/>`;
    return g;
  }
  function frame(pat, k, gear) {
    const A = pat.keys[0], B = pat.keys[1], pose = blend(A, B, ease(k));
    const J = solve(pose, pat, ease(k));
    let g = '';
    // floor + soft contact shadow
    if (!['bar', 'water'].includes(pat.prop)) {
      g += `<rect x="-20" y="${GROUND + 1}" width="240" height="30" fill="var(--line)" opacity=".45"/><line x1="-20" y1="${GROUND + 1}" x2="220" y2="${GROUND + 1}" stroke="var(--line)" stroke-width="1.5"/>`;
      const xs = [J.L1[1][0], J.L2[1][0], J.p[0], J.s[0]], cx = (Math.min(...xs) + Math.max(...xs)) / 2, w = (Math.max(...xs) - Math.min(...xs)) / 2 + 16;
      g += `<ellipse cx="${f(cx)}" cy="${GROUND + 2.5}" rx="${f(w)}" ry="4.5" fill="#000" opacity=".13"/>`;
    }
    g += equipment(pat, J, gear, false);
    g += athlete(J, LOOK, 'far') + athlete(J, LOOK, 'body') + athlete(J, LOOK, 'near');
    g += equipment(pat, J, gear, true);
    return g;
  }

  /* ---------- optional real video demos ----------
     Drop MP4/WebM clips into media/demos/<slug>.mp4 and list the slugs in media/demos/index.json
     (["bodyweight-squat", ...]). Any exercise with a clip plays the video; everything else uses the illustrated athlete. */
  const slug = name => name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  let videos = null;
  const videoReady = fetch('media/demos/index.json', { cache: 'no-cache' }).then(r => r.ok ? r.json() : []).then(a => { videos = new Set(Array.isArray(a) ? a : []); }).catch(() => { videos = new Set(); });
  const hasVideo = name => !!(videos && videos.has(slug(name)));

  // Mounts a looping demo into a container (selected avatar video if available, else animated athlete); returns controller
  function mount(el, name, opts = {}) {
    const ex = (window.WAYOF_DATA.exercises.find(x => x.name === name) || {});
    const pat = patternOf(name);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, start = performance.now(), paused = false, lastRep = -1, alive = true, vid = null;
    el.innerHTML = '';
    if (hasVideo(name) && (opts.look || 'guide') === 'guide') {
      vid = document.createElement('video');
      Object.assign(vid, { src: `media/demos/${slug(name)}.mp4`, muted: true, loop: true, autoplay: true, playsInline: true });
      vid.setAttribute('playsinline', ''); vid.setAttribute('aria-label', `Video demonstration of ${name}`); vid.className = 'demovideo';
      const v = vid; let reps = 0, lastT = 0;
      v.addEventListener('timeupdate', () => { if (v.duration && v.currentTime < lastT) { reps++; if (opts.onRep) opts.onRep(reps); } lastT = v.currentTime; }); // each loop = one rep
      v.addEventListener('error', () => { if (alive && vid === v) { videos.delete(slug(name)); vid = null; v.removeAttribute('src'); const c = mount(el, name, opts); Object.assign(ctl, c); } });
      el.appendChild(vid); vid.play().catch(() => { });
    }
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 -14 200 206'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', `Animated demonstration of ${name}`);
    svg.style.width = '100%'; svg.style.height = '100%';
    const tick = now => {
      if (!alive || !el.isConnected) { alive = false; return; }
      if (!paused) {
        const cyc = (now - start) / pat.ms, ph = cyc % 2, k = ph < 1 ? ph : 2 - ph;
        svg.innerHTML = frame(pat, reduce ? 1 : k, ex.gear);
        const rep = Math.floor(cyc / 2);
        if (rep !== lastRep) { lastRep = rep; if (opts.onRep && rep > 0) opts.onRep(rep); }
      }
      if (!reduce) raf = requestAnimationFrame(tick);
    };
    if (!vid) { el.appendChild(svg); raf = requestAnimationFrame(tick); }
    const ctl = { stop() { alive = false; cancelAnimationFrame(raf); if (vid) { vid.pause(); vid.removeAttribute('src'); vid.load(); } }, pause(v) { paused = v; if (vid) v ? vid.pause() : vid.play().catch(() => { }); if (!v) { start = performance.now(); lastRep = 0; } }, cycleMs: pat.ms * 2, video: !!vid };
    return ctl;
  }
  // Static thumbnail (mid-movement)
  function still(name, k = 0.8) { const ex = (window.WAYOF_DATA.exercises.find(x => x.name === name) || {}); return `<svg viewBox="0 -14 200 206" aria-hidden="true">${frame(patternOf(name), k, ex.gear)}</svg>`; }
  const cues = name => patternOf(name).cues;
  // Illustrated head-and-shoulders portrait for a coach persona
  function portrait(key) {
    const prev = LOOK; LOOK = LOOKS[key] || LOOKS.guide;
    const J = solve(Object.assign({}, stand, { a1: [8, 4], a2: [-6, -4] }), { anchor: [100, GROUND] }, 0);
    const out = `<svg viewBox="73 16 54 54" aria-hidden="true"><circle cx="100" cy="43" r="27" fill="${light(LOOK.shirt, .78)}"/>${athlete(J, LOOK, 'body')}${capsule(J.s, J.A1[0], 6.3, 5.7, LOOK.shirt)}</svg>`;
    LOOK = prev; return out;
  }
  return { mount, still, cues, demoFor, setLook, LOOKS, slug, videoReady, hasVideo, portrait };
})();
