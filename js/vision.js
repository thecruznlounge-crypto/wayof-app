/* WAYOF v7 — camera form check (on-device pose tracking) + private progress photo store.
   Pose tracking uses Google MediaPipe Pose Landmarker running in the browser. Video frames never leave the device. */
window.WAYOF_VISION = (function () {
  const VER = '0.10.14';
  const LIB = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VER}/vision_bundle.mjs`;
  const WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VER}/wasm`;
  const MODEL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
  let landmarker = null, loading = null;

  const supported = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && window.isSecureContext;
  async function load() {
    if (landmarker) return landmarker;
    if (!loading) loading = (async () => {
      const { FilesetResolver, PoseLandmarker } = await import(/* webpackIgnore: true */ LIB);
      const fs = await FilesetResolver.forVisionTasks(WASM);
      const make = delegate => PoseLandmarker.createFromOptions(fs, { baseOptions: { modelAssetPath: MODEL, delegate }, runningMode: 'VIDEO', numPoses: 1 });
      try { landmarker = await make('GPU'); } catch (e) { landmarker = await make('CPU'); }
      return landmarker;
    })().catch(e => { loading = null; throw e; });
    return loading;
  }
  async function openCamera(video, facing = 'user') {
    if (!supported()) throw new Error('Camera needs HTTPS and a supported browser');
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
    video.srcObject = stream; video.setAttribute('playsinline', ''); video.muted = true; await video.play();
    return stream;
  }
  const stopStream = s => s && s.getTracks().forEach(t => t.stop());

  // geometry
  const ang = (a, b, c) => { const ab = [a.x - b.x, a.y - b.y], cb = [c.x - b.x, c.y - b.y]; const d = (ab[0] * cb[0] + ab[1] * cb[1]) / (Math.hypot(...ab) * Math.hypot(...cb) || 1); return Math.acos(Math.max(-1, Math.min(1, d))) * 180 / Math.PI; };
  const SIDE = { L: { sh: 11, el: 13, wr: 15, hip: 23, kn: 25, an: 27 }, R: { sh: 12, el: 14, wr: 16, hip: 24, kn: 26, an: 28 } };
  // rules per demo pattern: joint angle used for counting, thresholds, start position, form checks
  const RULES = {
    squat: { joint: 'knee', lo: 105, hi: 155, start: 'hi', form: (m, s) => m.min > 118 ? 'Go a little deeper' : s.torso > 55 ? 'Keep your chest up' : 'Good depth' },
    lunge: { joint: 'knee', lo: 105, hi: 155, start: 'hi', form: m => m.min > 118 ? 'Lower the back knee more' : 'Nice lunge' },
    slam: { joint: 'knee', lo: 120, hi: 160, start: 'hi', form: () => 'Strong slam' },
    pushup: { joint: 'elbow', lo: 95, hi: 150, start: 'hi', form: (m, s) => s.line < 152 ? 'Keep hips in line with shoulders' : m.min > 110 ? 'Lower your chest further' : 'Solid push-up' },
    chest: { joint: 'elbow', lo: 95, hi: 150, start: 'hi', form: m => m.min > 110 ? 'Bring it lower' : 'Good press' },
    hinge: { joint: 'hip', lo: 120, hi: 160, start: 'hi', form: (m, s) => s.knee < 120 ? 'Less knee bend — push hips back' : 'Good hinge' },
    swing: { joint: 'hip', lo: 120, hi: 160, start: 'hi', form: () => 'Snap the hips' },
    row: { joint: 'elbow', lo: 100, hi: 150, start: 'hi', form: m => m.min > 110 ? 'Pull the elbow further back' : 'Good row' },
    press: { joint: 'elbow', lo: 100, hi: 160, start: 'lo', form: m => m.max < 165 ? 'Lock out fully overhead' : 'Good press' },
    curl: { joint: 'elbow', lo: 60, hi: 145, start: 'hi', form: (m, s) => s.swing > 35 ? 'Keep elbows pinned — no swinging' : m.min > 70 ? 'Curl all the way up' : 'Clean curl' },
    pull: { joint: 'elbow', lo: 85, hi: 150, start: 'hi', form: m => m.min > 95 ? 'Pull higher' : 'Strong pull' },
    bridge: { joint: 'hip', lo: 140, hi: 165, start: 'lo', form: m => m.max < 165 ? 'Squeeze glutes to lift higher' : 'Great bridge' },
    fold: { joint: 'hip', lo: 100, hi: 160, start: 'hi', form: () => 'Smooth and slow' },
    march: { joint: 'kneeLift', lo: 125, hi: 155, start: 'hi', form: () => 'Keep it up' },
    jump: { joint: 'knee', lo: 150, hi: 165, start: 'hi', form: () => 'Light and quick' },
    plank: { hold: true, form: s => s.line < 155 ? 'Lift your hips into a straight line' : s.line > 185 ? 'Lower your hips slightly' : 'Perfect line — hold it' },
    birddog: { hold: true, form: () => 'Keep hips square' }, deadbug: { hold: true, form: () => 'Back flat to the floor' }, bike: { hold: true, form: () => 'Steady cadence' }, swim: { hold: true, form: () => '' }
  };

  function start({ video, canvas, pattern, mirror, onRep, onStatus, onFrame }) {
    let alive = true, raf = 0, reps = 0, phase = null, ema = null, cur = { min: 999, max: 0 }, lastT = -1, side = 'L', holdGood = 0, lastTip = '', lastStatusAt = 0;
    const rule = RULES[pattern] || RULES.squat;
    const ctx = canvas.getContext('2d');
    const status = (t, lvl) => { const now = performance.now(); if (t !== lastTip || now - lastStatusAt > 4000) { lastTip = t; lastStatusAt = now; onStatus && onStatus(t, lvl); } };
    status('Loading form tracker…', 'info');
    load().then(() => { if (alive) { status('Step back so your whole body is in view — side-on works best', 'info'); loop(); } }).catch(e => { status(navigator.onLine === false ? 'Form tracker needs internet the first time it loads' : 'Form tracker couldn\'t load on this device', 'bad'); });
    function draw(lm) {
      const w = canvas.width = video.videoWidth || 640, h = canvas.height = video.videoHeight || 480;
      ctx.clearRect(0, 0, w, h); if (!lm) return;
      const P = i => [lm[i].x * w, lm[i].y * h], seg = [[11, 12], [11, 13], [13, 15], [12, 14], [14, 16], [11, 23], [12, 24], [23, 24], [23, 25], [25, 27], [24, 26], [26, 28]];
      ctx.lineWidth = Math.max(3, w / 160); ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(138,121,236,.95)';
      seg.forEach(([a, b]) => { if (lm[a].visibility > .4 && lm[b].visibility > .4) { ctx.beginPath(); ctx.moveTo(...P(a)); ctx.lineTo(...P(b)); ctx.stroke(); } });
      ctx.fillStyle = '#efe77a'; [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28].forEach(i => { if (lm[i].visibility > .4) { ctx.beginPath(); ctx.arc(...P(i), ctx.lineWidth * 1.3, 0, 7); ctx.fill(); } });
    }
    function loop() {
      if (!alive) return;
      if (video.readyState >= 2 && video.currentTime !== lastT) {
        lastT = video.currentTime;
        let res; try { res = landmarker.detectForVideo(video, performance.now()); } catch (e) { res = null; }
        const lm = res && res.landmarks && res.landmarks[0];
        draw(lm);
        if (!lm) status('Step into the frame', 'warn');
        else {
          const vis = s => [SIDE[s].sh, SIDE[s].hip, SIDE[s].kn, SIDE[s].an, SIDE[s].el].reduce((a, i) => a + (lm[i].visibility || 0), 0);
          side = vis('L') >= vis('R') ? 'L' : 'R'; const J = SIDE[side], p = i => lm[i];
          const visOK = [J.sh, J.hip].every(i => p(i).visibility > .5);
          if (!visOK) status('Step back so your shoulders and hips are visible', 'warn');
          else {
            const s = {
              knee: ang(p(J.hip), p(J.kn), p(J.an)), elbow: ang(p(J.sh), p(J.el), p(J.wr)), hip: ang(p(J.sh), p(J.hip), p(J.kn)),
              line: ang(p(J.sh), p(J.hip), p(J.an)), torso: Math.abs(Math.atan2(p(J.sh).x - p(J.hip).x, p(J.hip).y - p(J.sh).y) * 180 / Math.PI), swing: ang(p(J.hip), p(J.sh), p(J.el))
            };
            s.kneeLift = Math.min(ang(p(SIDE.L.sh), p(SIDE.L.hip), p(SIDE.L.kn)), ang(p(SIDE.R.sh), p(SIDE.R.hip), p(SIDE.R.kn)));
            onFrame && onFrame(s);
            if (rule.hold) { const tip = rule.form(s); if (tip) status(tip, /Perfect|Steady|square|flat/.test(tip) ? 'good' : 'warn'); }
            else {
              const a = s[rule.joint]; ema = ema == null ? a : ema * 0.6 + a * 0.4;
              cur.min = Math.min(cur.min, ema); cur.max = Math.max(cur.max, ema);
              if (phase == null) phase = rule.start;
              if (rule.start === 'hi') {
                if (phase === 'hi' && ema < rule.lo) phase = 'lo';
                else if (phase === 'lo' && ema > rule.hi) { reps++; const tip = rule.form(cur, s); onRep && onRep(reps, tip); status(tip, /Good|Nice|Solid|Clean|Strong|Great|Smooth|Keep it|Light/.test(tip) ? 'good' : 'warn'); phase = 'hi'; cur = { min: 999, max: 0 }; }
              } else {
                if (phase === 'lo' && ema > rule.hi) phase = 'hi';
                else if (phase === 'hi' && ema < rule.lo) { reps++; const tip = rule.form(cur, s); onRep && onRep(reps, tip); status(tip, /Good|Great/.test(tip) ? 'good' : 'warn'); phase = 'lo'; cur = { min: 999, max: 0 }; }
              }
            }
          }
        }
      }
      raf = requestAnimationFrame(loop);
    }
    return { stop() { alive = false; cancelAnimationFrame(raf); ctx.clearRect(0, 0, canvas.width, canvas.height); }, reset() { reps = 0; phase = null; cur = { min: 999, max: 0 }; }, get reps() { return reps; }, hold: !!rule.hold };
  }

  /* progress photos — IndexedDB (device-only) */
  const DB = 'wayof', STORE = 'photos';
  function db() { return new Promise((res, rej) => { const r = indexedDB.open(DB, 1); r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE, { keyPath: 'id' }).createIndex('day', 'day'); }; r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
  const tx = (mode, fn) => db().then(d => new Promise((res, rej) => { const t = d.transaction(STORE, mode), st = t.objectStore(STORE), out = fn(st); t.oncomplete = () => res(out && out.result !== undefined ? out.result : out); t.onerror = () => rej(t.error); }));
  const photos = {
    add: rec => tx('readwrite', st => st.put(rec)),
    del: id => tx('readwrite', st => st.delete(id)),
    list: () => tx('readonly', st => st.getAll()).then(a => (a || []).sort((x, y) => y.ts - x.ts)),
    clear: () => tx('readwrite', st => st.clear())
  };
  return { supported, load, openCamera, stopStream, start, photos, RULES };
})();
