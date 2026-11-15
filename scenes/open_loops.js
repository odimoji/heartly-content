// Format (a) mechanism explainer, "open loops": why you can't stop thinking about them.
// A loop with a gap, a dot that keeps running it. One loop -> four -> a head full of them ->
// a pen writes it out, the gap closes, the dot comes to rest -> "what's your open loop?"
// All helpers are local to this file (clean luminous line art, world + camera).
const OL = (() => {
  const TAU = Math.PI * 2, A = d => d * Math.PI / 180;
  const EMBER = '#E2683C', HOT = '#FFC9A6', CALM = '#F3DDB8', DIM = '#A99882';
  const fract = v => v - Math.floor(v);
  const mix = (c1, c2, k) => { const p = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); const a = p(c1), b = p(c2); return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], k))).join(',')})`; };

  // ---- timeline (scene seconds; narration segments tile these) ----
  const T = { s2: 4.6, s3: 8.4, s4: 15.2, s5: 18.0, s6: 25.0, end: 29.4, close: 23.9 };

  // ---- world ----
  // gap runs g0..g1 (degrees, clockwise, y down); the dot runs the arc from g1 round to g0
  const LOOPS = [
    { x: 0, y: 0, r: 230, g0: 30, g1: 70, T: 1.5, off: -0.1, born: -0.5, main: 'the breakup', sub: 'no explanation', ms: 70, ss: 33, tm: 5.0, ts: 5.9 },
    { x: 640, y: -30, r: 205, g0: 285, g1: 325, T: 1.25, off: 0.3, born: 8.8, main: 'the argument', sub: 'never finished', ms: 62, ss: 37, tm: 9.2, ts: 9.6 },
    { x: -20, y: 690, r: 210, g0: 160, g1: 200, T: 1.7, off: 0.9, born: 10.6, main: 'the text', sub: 'left on read', ms: 68, ss: 37, tm: 11.0, ts: 11.4 },
    { x: 630, y: 660, r: 220, g0: 80, g1: 120, T: 1.4, off: 0.5, born: 12.4, main: 'the words', sub: 'never said', ms: 68, ss: 37, tm: 12.8, ts: 13.3 },
  ];
  const HC = [312, 335], RH = 1400; // head centre + cranium radius (world)
  const EXTRA = (() => { // unlabelled loops that fill the head
    const g = rng(41), out = [];
    let guard = 0;
    while (out.length < 13 && guard++ < 6000) {
      const a = g() * TAU, d = 640 + g() * 520, r = 120 + g() * 110;
      const x = HC[0] + Math.cos(a) * d, y = HC[1] + Math.sin(a) * d * .98;
      if (Math.hypot(x - HC[0], y - HC[1]) + r > RH * .86) continue;
      if ([...LOOPS, ...out].some(o => Math.hypot(o.x - x, o.y - y) < o.r + r + 70)) continue;
      const gc = g() * 360;
      out.push({ x, y, r, g0: gc, g1: gc + 42, T: 1.1 + g() * .9, off: g() * 2, born: 0 });
    }
    out.sort((p, q) => Math.hypot(p.x - HC[0], p.y - HC[1]) - Math.hypot(q.x - HC[0], q.y - HC[1]));
    out.forEach((o, i) => o.born = 15.7 + i * .11);
    return out;
  })();

  // ---- camera: [t, worldX, worldY, zoom, screenX, screenY, eased?] ----
  const KEYS = [
    [0, 0, 0, 1.08, 520, 940, 0], [4.4, 0, 0, 1.15, 520, 940, 1],
    [5.5, 0, 0, 1.40, 520, 900, 0], [8.2, 0, 0, 1.46, 520, 900, 1],
    [9.5, 312, 335, .66, 500, 900, 0], [15.0, 312, 335, .63, 500, 900, 1],
    [16.6, HC[0] - 40, HC[1] + 200, .262, 470, 915, 0], [17.9, HC[0] - 40, HC[1] + 200, .25, 470, 915, 1],
    [19.5, 0, 150, 1.05, 520, 900, 0], [24.8, 0, 150, 1.09, 520, 900, 1],
    [26.4, 312, 335, .62, 500, 1030, 0], [T.end, 312, 335, .595, 500, 1030, 0],
  ];
  function cam(t) {
    let i = 0; while (i < KEYS.length - 2 && t > KEYS[i + 1][0]) i++;
    const a = KEYS[i], b = KEYS[i + 1]; let k = seg(t, a[0], b[0]);
    if (b[6]) k = k * k * k * (k * (k * 6 - 15) + 10); // smootherstep for moves, linear for slow drifts
    const z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), k));
    // pan follows zoom progress so zoom-outs don't swing
    const kz = b[3] === a[3] ? k : (z - a[3]) / (b[3] - a[3]);
    const kp = b[6] ? lerp(k, kz, .6) : k;
    return { x: lerp(a[1], b[1], kp), y: lerp(a[2], b[2], kp), z, sx: lerp(a[4], b[4], k), sy: lerp(a[5], b[5], k) };
  }

  // ---- drawing ----
  function bg(t) {
    const g = cx.createRadialGradient(520, 900, 60, 520, 900, 1250);
    g.addColorStop(0, '#2B1E16'); g.addColorStop(.45, '#1A130F'); g.addColorStop(1, '#0B0806');
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    const d = rng(7); // slow drifting dust
    for (let i = 0; i < 46; i++) {
      const x = d() * W, y0 = d() * H, s = 1 + d() * 2.2, sp = 6 + d() * 14, ph = d() * TAU;
      const y = ((y0 - t * sp) % H + H) % H, a = .05 + .09 * (0.5 + 0.5 * Math.sin(t * .8 + ph));
      cx.fillStyle = `rgba(241,214,180,${a})`; cx.beginPath(); cx.arc(x + Math.sin(t * .3 + ph) * 14, y, s, 0, TAU); cx.fill();
    }
  }
  function vignette() {
    const g = cx.createRadialGradient(540, 930, 520, 540, 930, 1180);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)');
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
  }
  function label(s, x, y, size, alpha, font, weight, col, spacing = 0) {
    if (alpha <= 0) return;
    cx.save(); cx.globalAlpha *= alpha; cx.fillStyle = col; cx.font = `${weight} ${size}px ${font}`; cx.letterSpacing = spacing + 'px';
    cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(s, x, y); cx.restore();
  }
  // one loop: arc with a gap, running dot with a comet trail, a spark where it hits the open end
  function drawLoop(L, t, c, o = {}) {
    const alpha = o.alpha ?? 1; if (alpha <= 0.003) return;
    const reveal = easeOut(seg(t, L.born, L.born + .8)); if (reveal <= 0) return;
    const z = c.z, zk = clamp((z - .25) / .85);
    const lw = lerp(3.4, 7, zk) / z, a0 = A(L.g1), span = A(L.g0 + 360 - L.g1);
    const closed = o.closed || 0, calm = o.calm || 0, col = mix(EMBER, CALM, calm);
    cx.save(); cx.globalAlpha = alpha; cx.lineCap = 'round';
    // soft halo + line
    cx.shadowColor = col; cx.shadowBlur = lerp(10, 26, zk) * (1 + (o.flash || 0) * 1.6);
    cx.strokeStyle = col; cx.lineWidth = lw;
    cx.beginPath(); cx.arc(L.x, L.y, L.r, a0, a0 + span * reveal); cx.stroke();
    if (closed > 0) { cx.strokeStyle = mix(C.CREAM, CALM, calm); cx.shadowColor = C.CREAM; cx.beginPath(); cx.arc(L.x, L.y, L.r, a0, a0 - A(L.g1 - L.g0) * closed, true); cx.stroke(); }
    cx.shadowBlur = 0;
    // dot
    let ang, da = 1, sparkAge = 9, trail = 1;
    if (o.rest != null) { ang = o.rest.ang; trail = o.rest.trail; }
    else { const u = fract((t - L.off) / L.T); ang = a0 + u * span; da = Math.min(1, u / .05, (1 - u) / .04); sparkAge = u * L.T; }
    da *= seg(t, L.born + .25, L.born + .6);
    const dotR = Math.min(lerp(6, 15, zk) / z, L.r * .13);
    if (da > 0) {
      const tl = 1.0 * trail, n = 16;
      for (let i = 0; i < n; i++) {
        const s0 = ang - tl * (1 - i / n), s1 = ang - tl * (1 - (i + 1) / n) + .01;
        if (o.rest == null && s0 < a0) continue;
        cx.strokeStyle = HOT; cx.globalAlpha = alpha * da * Math.pow((i + 1) / n, 2) * .8; cx.lineWidth = lw * lerp(1, 1.5, i / n);
        cx.beginPath(); cx.arc(L.x, L.y, L.r, Math.max(s0, o.rest == null ? a0 : -1e9), s1); cx.stroke();
      }
      const dx = L.x + Math.cos(ang) * L.r, dy = L.y + Math.sin(ang) * L.r;
      cx.globalAlpha = alpha * da; cx.shadowColor = calm > .5 ? CALM : '#FF8A55'; cx.shadowBlur = lerp(14, 40, zk);
      cx.fillStyle = mix('#FFE3CF', '#FFF6E6', calm); cx.beginPath(); cx.arc(dx, dy, dotR, 0, TAU); cx.fill(); cx.fill();
      cx.shadowBlur = 0;
    }
    // spark at the open end each time the dot runs out of line
    if (o.rest == null && sparkAge < .38 && t > L.born + 1 && !closed) {
      const k = sparkAge / .38, ex = L.x + Math.cos(a0 + span) * L.r, ey = L.y + Math.sin(a0 + span) * L.r;
      cx.globalAlpha = alpha * (1 - k) * .9; cx.strokeStyle = HOT; cx.lineWidth = lw * .55;
      cx.beginPath(); cx.arc(ex, ey, dotR * (1 + k * 2.6), 0, TAU); cx.stroke();
    }
    cx.restore();
    // labels (inside the loop)
    if (L.main) {
      const far = clamp((z - .33) / .2) * alpha;
      const km = seg(t, L.tm, L.tm + .45), ks = seg(t, L.ts, L.ts + .45);
      label(L.main, L.x, L.y - 14 + (1 - easeOut(km)) * 14, L.ms, km * far, 'Caveat', 700, C.CREAM);
      const sw = o.subSwap || 0;
      label(L.sub, L.x, L.y + L.ms * .62, L.ss, ks * far * .78 * (1 - seg(sw, 0, .5)), 'Inter', 400, DIM, 1.5);
      if (sw > .5) label(o.subAlt, L.x, L.y + L.ms * .62, L.ss, far * .95 * seg(sw, .5, 1), 'Inter', 500, CALM, 1.5);
    }
  }
  // head in profile (facing right), one continuous luminous line
  function head(t, c, alpha) {
    if (alpha <= 0) return; const k = ease(seg(t, T.s4 + .1, T.s4 + 1.5)); if (k <= 0) return;
    cx.save(); cx.translate(HC[0], HC[1]); cx.scale(RH, RH); cx.globalAlpha = alpha;
    cx.beginPath(); cx.moveTo(-.33, 1.5); cx.quadraticCurveTo(-.33, 1.12, -.5, .866);
    cx.arc(0, 0, 1, A(120), A(352));
    cx.quadraticCurveTo(1.06, 0, 1.03, .13); cx.quadraticCurveTo(1.09, .30, 1.21, .42);
    cx.quadraticCurveTo(1.22, .50, 1.07, .50); cx.quadraticCurveTo(1.04, .56, 1.085, .61);
    cx.lineTo(1.035, .655); cx.quadraticCurveTo(1.09, .71, 1.04, .77);
    cx.quadraticCurveTo(1.10, .95, .93, 1.0); cx.quadraticCurveTo(.66, 1.05, .46, .95); cx.quadraticCurveTo(.40, 1.22, .44, 1.5);
    cx.restore(); cx.save(); cx.globalAlpha = alpha;
    cx.strokeStyle = C.CREAM; cx.lineWidth = 4.6 / c.z; cx.lineCap = 'round'; cx.lineJoin = 'round';
    cx.shadowColor = 'rgba(241,230,214,.8)'; cx.shadowBlur = 16;
    const Ltot = RH * 9.6; cx.setLineDash([Ltot * k, Ltot * 2]); cx.stroke(); cx.restore();
  }
  // "handwriting": three lines of scribbled words under the first loop
  const WRITE = (() => {
    const g = rng(12), lines = [[-185, 185, 345], [-185, 185, 420], [-185, 60, 495]], strokes = [];
    lines.forEach(([x0, x1, y], li) => {
      let x = x0;
      while (x < x1 - 30) {
        const wl = Math.min(45 + g() * 85, x1 - x), ph = g() * 9, f1 = .13 + g() * .06, pts = [];
        for (let i = 0; i <= wl; i += 3) { const e = Math.sin(Math.PI * Math.min(1, i / 10)) * .0 + 1; pts.push([x + i + Math.sin(i * f1 * 2 + ph) * 3, y - Math.abs(Math.sin(i * f1 + ph)) * 15 * e + Math.sin(i * .41 + ph) * 4]); }
        strokes.push({ li, pts }); x += wl + 26;
      }
    });
    return { strokes, lines };
  })();
  const W0 = 20.75, WD = .62, WG = .12; // line i is written during [W0+i*(WD+WG), +WD]
  const GAP_A = 23.15, GAP_B = 23.8;    // pen closes the gap
  function writing(t, c) {
    let tip = null; const fade = 1 - seg(t, 24.5, 25.3); if (t < W0 || fade <= 0) return tip;
    cx.save(); cx.strokeStyle = C.CREAM; cx.lineWidth = 4 / c.z; cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.globalAlpha = .92 * fade;
    cx.shadowColor = 'rgba(241,230,214,.6)'; cx.shadowBlur = 8;
    for (let li = 0; li < 3; li++) {
      const k = seg(t, W0 + li * (WD + WG), W0 + li * (WD + WG) + WD); if (k <= 0) continue;
      const ss = WRITE.strokes.filter(s => s.li === li), tot = ss.reduce((n, s) => n + s.pts.length, 0); let left = Math.floor(tot * k);
      for (const s of ss) { if (left <= 1) break; const n = Math.min(left, s.pts.length); cx.beginPath(); for (let i = 0; i < n; i++) i ? cx.lineTo(s.pts[i][0], s.pts[i][1]) : cx.moveTo(s.pts[i][0], s.pts[i][1]); cx.stroke(); left -= n; if (k < 1) tip = s.pts[n - 1]; }
    }
    cx.restore(); return tip;
  }
  function penTip(t, wt) {
    const L = LOOPS[0], P = a => [L.x + Math.cos(A(a)) * L.r, L.y + Math.sin(A(a)) * L.r];
    const first = WRITE.strokes[0].pts[0], lastS = WRITE.strokes[WRITE.strokes.length - 1].pts, last = lastS[lastS.length - 1];
    const tEnd = W0 + 3 * WD + 2 * WG;
    if (t < W0) { const k = easeOut(seg(t, W0 - .55, W0)); return { p: [first[0] + (1 - k) * 260, first[1] + (1 - k) * 200], a: k, lift: 1 - k }; }
    if (t < tEnd) {
      if (wt) return { p: wt, a: 1, lift: 0 };
      for (let li = 0; li < 2; li++) { // hop between lines
        const e = W0 + li * (WD + WG) + WD; if (t >= e && t < e + WG) {
          const a = WRITE.strokes.filter(s => s.li === li).pop().pts.slice(-1)[0], b = WRITE.strokes.find(s => s.li === li + 1).pts[0], k = ease(seg(t, e, e + WG));
          return { p: [lerp(a[0], b[0], k), lerp(a[1], b[1], k)], a: 1, lift: Math.sin(k * Math.PI) };
        }
      }
      return { p: last, a: 1, lift: 0 };
    }
    if (t < GAP_A) { const k = ease(seg(t, tEnd, GAP_A)), b = P(L.g1); return { p: [lerp(last[0], b[0], k), lerp(last[1], b[1], k)], a: 1, lift: Math.sin(k * Math.PI) }; }
    if (t < GAP_B) { const k = ease(seg(t, GAP_A, GAP_B)); return { p: P(lerp(L.g1, L.g0, k)), a: 1, lift: 0 }; }
    const k = ease(seg(t, GAP_B, GAP_B + .7)), b = P(L.g0); return { p: [b[0] + k * 200, b[1] - k * 60], a: 1 - k, lift: k };
  }
  function pen(pt, c) {
    if (!pt || pt.a <= 0) return;
    cx.save(); cx.globalAlpha = pt.a; cx.translate(pt.p[0], pt.p[1] - pt.lift * 16); cx.rotate(A(-52 - pt.lift * 5));
    const s = 1.15; cx.scale(s, s);
    cx.lineJoin = 'round'; cx.lineCap = 'round'; cx.lineWidth = 3.6 / (c.z * s); cx.strokeStyle = C.CREAM; cx.fillStyle = '#17110D';
    cx.shadowColor = 'rgba(241,230,214,.55)'; cx.shadowBlur = 10;
    cx.beginPath(); cx.moveTo(0, 0); cx.lineTo(40, -13); cx.lineTo(236, -13); cx.arc(236, 0, 13, -Math.PI / 2, Math.PI / 2); cx.lineTo(40, 13); cx.closePath(); cx.fill(); cx.stroke();
    cx.shadowBlur = 0;
    cx.beginPath(); cx.moveTo(40, -13); cx.lineTo(40, 13); cx.moveTo(200, -13); cx.lineTo(200, 13); cx.moveTo(214, -13); cx.lineTo(214, 13); cx.stroke();
    cx.fillStyle = EMBER; cx.beginPath(); cx.moveTo(0, 0); cx.lineTo(14, -4.6); cx.lineTo(14, 4.6); cx.closePath(); cx.fill();
    cx.restore();
  }
  function hud(t) {
    const cap = (s, y, size, a, b, col = C.CREAM, x = 510) => { const fi = seg(t, a, a + .4), fo = 1 - seg(t, b - .35, b); label(s, x, y + (1 - easeOut(fi)) * 22, size, Math.min(fi, fo), 'Caveat', 700, col); };
    // hook: on screen from frame 0
    cap('why you can’t stop', 392, 104, -1, 4.5); cap('thinking about them', 500, 104, -1, 4.5, HOT);
    cap('you', 1462, 120, 16.0, 18.0, C.CREAM, 500);
    cap('they might never close it', 400, 88, 18.5, 20.5);
    cap('but you can', 400, 104, 20.7, 24.9, HOT);
    cap('what’s your', 392, 124, 27.0, 99); cap('open loop?', 512, 124, 27.15, 99, HOT);
  }

  function render(t) {
    const c = cam(t);
    bg(t);
    cx.save(); cx.translate(c.sx, c.sy); cx.scale(c.z, c.z); cx.translate(-c.x, -c.y);
    // head + the loops that fill it
    const headA = seg(t, T.s4, T.s4 + .3) * (1 - seg(t, T.s5 + .3, T.s5 + 1.0));
    head(t, c, headA);
    const othersA = t < T.s5 ? 1 : t < T.s6 ? lerp(1, .045, seg(t, T.s5 + .2, T.s5 + 1.2)) : lerp(.045, .92, seg(t, T.s6, T.s6 + 1.2));
    if (headA > 0) for (const L of EXTRA) drawLoop(L, t, c, { alpha: headA * .9 });
    const wt = writing(t, c);
    for (let i = 1; i < LOOPS.length; i++) drawLoop(LOOPS[i], t, c, { alpha: othersA });
    // the first loop: runs, gets closed by the pen, the dot coasts to rest
    const L = LOOPS[0], o = { alpha: 1 };
    o.closed = ease(seg(t, GAP_A, GAP_B));
    if (t >= T.close) {
      const span = A(L.g0 + 360 - L.g1), sp = span / L.T, D = A(240), d = 3 * D / sp, k = seg(t, T.close, T.close + d);
      o.rest = { ang: A(L.g0) + D * easeOut(k), trail: Math.pow(1 - k, 2) };
      o.calm = ease(seg(t, T.close, T.close + 1.2)); o.flash = Math.max(0, 1 - (t - T.close) / .9);
      o.subSwap = seg(t, T.close + .5, T.close + 1.5); o.subAlt = 'finished';
      // release ripple
      for (const dl of [0, .28]) { const rk = seg(t, T.close + dl, T.close + dl + 1.5); if (rk > 0 && rk < 1) { cx.save(); cx.globalAlpha = (1 - rk) * .5; cx.strokeStyle = CALM; cx.lineWidth = 3 / c.z; cx.beginPath(); cx.arc(L.x, L.y, L.r * (1 + easeOut(rk) * .55), 0, TAU); cx.stroke(); cx.restore(); } }
    }
    drawLoop(L, t, c, o);
    if (t > W0 - .6 && t < GAP_B + .8) pen(penTip(t, wt), c);
    cx.restore();
    vignette();
    hud(t);
  }
  return { render, T };
})();
window.SCENE = { duration: OL.T.end, render: t => OL.render(t) };
