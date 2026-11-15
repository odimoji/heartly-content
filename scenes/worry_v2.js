// "her little guy called worry", v2: the worry_guy story rebuilt as an illustrated storybook
// animation (painted sets, lamp light, parallax, a properly animated Worry). Same beats as worry_guy.js:
// 0 street · 3.4 work · 6.4 brunch · 9.0 3am presentation · 12.0 heartly · 15.8 crossing out · 17.6 pocket-sized.
// All helpers live in this file; only generic bits (rng, wline, text, wrapLines, seg, ease…) come from engine/lib.js.
const K = {
  ink: '#2B2330', cream: '#FBF1DF', ember: '#D9643A',
  worry: '#5E5A66', worryD: '#3B3842', worryL: '#8A8592',
  her: { skin: '#EDB896', hair: '#4B2A2C', bun: 1, jump: '#E3A33B', jumpD: '#C98A2B', jumpL: '#EDB24C', trou: '#3E5A68', trouD: '#314A56', shoe: '#3A2828' },
  pal: { skin: '#B9805E', hair: '#2E2A33', bun: 0, jump: '#E9B3A6', jumpD: '#D0958A', jumpL: '#F1C2B6', trou: '#6B4A5E', trouD: '#573B4C', shoe: '#2E2428' },
};
const FLOOR = 1290, TAU = 6.2832;

// ---------- small drawing kit ----------
const fillC = c => { cx.fillStyle = c; cx.fill(); };
function rect(x, y, w, h, c, r = 0) { cx.beginPath(); r ? cx.roundRect(x, y, w, h, r) : cx.rect(x, y, w, h); fillC(c); }
function ell(x, y, rx, ry, c, rot = 0) { cx.beginPath(); cx.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), rot, 0, TAU); fillC(c); }
function poly(p, c) { cx.beginPath(); p.forEach((q, i) => i ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1])); cx.closePath(); fillC(c); }
function vgrad(y0, y1, stops) { const g = cx.createLinearGradient(0, y0, 0, y1); stops.forEach(([k, c]) => g.addColorStop(k, c)); return g; }
function cap(a, b, w, c) { cx.strokeStyle = c; cx.lineWidth = w; cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(b[0], b[1]); cx.stroke(); }
function limb(a, j, b, w, c) { cx.strokeStyle = c; cx.lineWidth = w; cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.beginPath(); cx.moveTo(a[0], a[1]); cx.quadraticCurveTo(j[0], j[1], b[0], b[1]); cx.stroke(); }
function line(pts, w, c, a = 1) { cx.save(); cx.globalAlpha = a; cx.strokeStyle = c; cx.lineWidth = w; cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.beginPath(); pts.forEach((q, i) => i ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1])); cx.stroke(); cx.restore(); }
function glow(x, y, r, rgb, a, mode = 'screen') { cx.save(); cx.globalCompositeOperation = mode; const g = cx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); cx.fillStyle = g; cx.fillRect(x - r, y - r, 2 * r, 2 * r); cx.restore(); }
function shadow(x, y, rx, ry, a = .28, rgb = '40,22,30') { cx.save(); cx.translate(x, y); cx.scale(1, ry / rx); const g = cx.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(.6, `rgba(${rgb},${a * .55})`); g.addColorStop(1, `rgba(${rgb},0)`); cx.fillStyle = g; cx.fillRect(-rx, -rx, 2 * rx, 2 * rx); cx.restore(); }
const hsh = i => { const v = Math.sin(i * 127.1 + 11.7) * 43758.5453; return v - Math.floor(v); };
function mixC(a, b, k) { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return 'rgb(' + A.map((v, i) => Math.round(lerp(v, B[i], k))).join(',') + ')'; }
const backOut = k => { k = clamp(k); const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
function cam(s, ax, ay, dx = 0, dy = 0) { cx.save(); cx.translate(ax + dx, ay + dy); cx.scale(s, s); cx.translate(-ax, -ay); }
function tiles(scroll, par, period, fn, margin) { margin = margin || period; const s = scroll * par; for (let i = Math.floor((s - margin) / period); i * period - s < W + margin; i++) fn(i * period - s, i); }

// paper grain + watercolour blotches, built once and laid over every frame
const TEX = (() => {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); const r = rng(4242);
  const n = document.createElement('canvas'); n.width = W / 2; n.height = H / 2; const ng = n.getContext('2d');
  const id = ng.createImageData(W / 2, H / 2), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const v = r(); if (v < .5) { d[i] = 70; d[i + 1] = 45; d[i + 2] = 30; d[i + 3] = v * 2 * 24; } else { d[i] = 255; d[i + 1] = 248; d[i + 2] = 232; d[i + 3] = (v - .5) * 2 * 24; } }
  ng.putImageData(id, 0, 0); g.imageSmoothingEnabled = false; g.drawImage(n, 0, 0, W, H);
  for (let i = 0; i < 80; i++) { const x = r() * W, y = r() * H, rad = 120 + r() * 380, gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, r() < .4 ? 'rgba(80,45,25,.03)' : 'rgba(255,246,226,.06)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
  g.lineWidth = 1.5; g.lineCap = 'round';
  for (let i = 0; i < 700; i++) { const x = r() * W, y = r() * H, a = r() * TAU, l = 14 + r() * 50; g.strokeStyle = r() < .6 ? 'rgba(80,55,35,.06)' : 'rgba(255,250,240,.07)'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  return c;
})();
function finish(vig = .3, rgb = '45,22,18') {
  cx.drawImage(TEX, 0, 0);
  const g = cx.createRadialGradient(540, 900, 520, 540, 900, 1300); g.addColorStop(0, `rgba(${rgb},0)`); g.addColorStop(1, `rgba(${rgb},${vig})`); cx.fillStyle = g; cx.fillRect(0, 0, W, H);
}
function motes(t, n, rgb, a = .5, seed = 5) { // drifting dust in the light
  for (let i = 0; i < n; i++) { const x = (hsh(i + seed) * W + Math.sin(t * .5 + i) * 30 + t * 12 * (hsh(i * 3) - .3)) % W, y = 300 + ((hsh(i * 7 + seed) * 1000 - t * (10 + hsh(i) * 16)) % 1000 + 1000) % 1000; ell(x, y, 2 + hsh(i * 5) * 3, 2 + hsh(i * 5) * 3, `rgba(${rgb},${a * (.4 + .6 * Math.abs(Math.sin(t * 1.3 + i * 2)))})`); }
}
function steam(x, y, t, col = 'rgba(255,255,255,.55)') {
  for (let j = 0; j < 2; j++) { const pts = []; for (let i = 0; i <= 8; i++) { const k = i / 8; pts.push([x + j * 16 - 8 + Math.sin(k * 5 + t * 2.4 + j * 2) * 8 * k, y - k * 70]); } cx.save(); cx.globalAlpha = .9; line(pts, 5, col); cx.restore(); }
}

// ---------- label card + speech bubble ----------
function card(t, a, b, lines, o = {}) {
  if (t < a || t > b) return; const size = o.size || 68, x = o.x || 500, y = o.y || 1420;
  const kin = a < 0 ? 1 : seg(t, a + .12, a + .5), kout = o.hold ? 1 : 1 - seg(t, b - .22, b - .05); const al = Math.min(1, kin * 1.6, kout);
  cx.font = `700 ${size}px Caveat`; const w = Math.max(...lines.map(l => cx.measureText(l).width)) + 96, h = lines.length * size * .98 + 56;
  cx.save(); cx.globalAlpha = al; cx.translate(x, y + (1 - backOut(kin)) * 40); cx.rotate(-.018); const sc = .9 + .1 * backOut(kin); cx.scale(sc, sc);
  rect(-w / 2 + 6, -h / 2 + 12, w, h, 'rgba(30,15,20,.28)', 20);
  rect(-w / 2, -h / 2, w, h, '#FCF4E4', 20);
  cx.strokeStyle = 'rgba(43,35,48,.16)'; cx.lineWidth = 3; cx.beginPath(); cx.roundRect(-w / 2 + 9, -h / 2 + 9, w - 18, h - 18, 13); cx.stroke();
  cx.save(); cx.translate(-w / 2 + 64, -h / 2 - 2); cx.rotate(-.12); rect(-48, -15, 96, 30, 'rgba(217,100,58,.82)', 3); cx.restore(); // tape
  lines.forEach((l, i) => text(l, 0, -h / 2 + 30 + size * .5 + i * size * .98, size, al, 'Caveat', 700, K.ink));
  cx.restore();
}
function say(x, y, msg, k, tail, size = 58) {
  if (k <= 0) return; const sc = backOut(k);
  cx.font = `700 ${size}px Caveat`; const w = cx.measureText(msg).width + 76, h = size + 50;
  cx.save(); cx.globalAlpha = Math.min(1, k * 2.5); cx.translate(x, y); cx.scale(sc, sc); cx.rotate(Math.sin(k * 3) * .0);
  const tx = (tail[0] - x), ty = (tail[1] - y), bx = clamp(tx * .5, -w / 2 + 60, w / 2 - 60);
  const shape = (ox, oy, c) => { cx.beginPath(); cx.roundRect(-w / 2 + ox, -h / 2 + oy, w, h, h / 2); fillC(c); poly([[bx - 24 + ox, h / 2 - 6 + oy], [bx + 24 + ox, h / 2 - 6 + oy], [tx * .82 + ox, ty * .82 + oy]], c); };
  shape(5, 9, 'rgba(30,15,20,.25)'); shape(0, 0, '#FFFAEF');
  text(msg, 0, 2, size, Math.min(1, k * 2.5), 'Caveat', 700, K.ink); cx.restore();
}

// ---------- Worry ----------
const blinkAt = (t, ph = 0) => { const p = ((t + ph) % 2.3 + 2.3) % 2.3; return p < .16 ? Math.abs(p - .08) / .08 : 1; };
// (x,y) = where his feet touch down. r = body radius. o: look[dx,dy], mood, talk, sx/sy squash, tilt, hands{l,r} (local px from feet), tie, shadow, gy
function worry(x, y, r, t, o = {}) {
  const look = o.look || [0, 0], mood = o.mood || 'neutral', sx = o.sx || 1, sy = o.sy || 1;
  if (o.shadow !== 0) shadow(x, (o.gy === undefined ? y : o.gy) + 3, r * 1.15 * sx, r * .22, o.shadow || .3);
  cx.save(); cx.translate(x, y); cx.rotate(o.tilt || 0); cx.scale(sx, sy);
  const cy = -r * 1.1, lw = Math.max(2.5, r * .07);
  for (const s of [-1, 1]) { cap([s * r * .34, cy + r * .8], [s * r * .36, -r * .07], lw, K.worryD); ell(s * r * .4, -r * .06, r * .19, r * .1, K.worryD); }
  const hd = o.hands || {}; const hl = hd.l || [-r * 1.12, cy + r * .62], hr = hd.r || [r * 1.12, cy + r * .62];
  for (const [s, h] of [[-1, hl], [1, hr]]) { limb([s * r * .86, cy + r * .22], [(s * r * .86 + h[0]) / 2 + s * r * .08, (cy + r * .22 + h[1]) / 2 + r * .12], h, lw, o.armC || K.worryD); ell(h[0], h[1], r * .1, r * .1, o.armC || K.worryD); }
  // fuzz: swirly tufts that boil at 8 fps
  const fr = rng(31 + (Math.floor(t * 8) % 4) * 977), N = 34;
  cx.beginPath();
  for (let i = 0; i < N; i++) { const a = i / N * TAU + (fr() - .5) * .07, a2 = (i + .62) / N * TAU + (fr() - .5) * .1, r2 = r * (1.1 + fr() * .17); const p = [Math.cos(a) * r * .94, cy + Math.sin(a) * r * .94], q = [Math.cos(a2) * r2, cy + Math.sin(a2) * r2]; i ? cx.lineTo(p[0], p[1]) : cx.moveTo(p[0], p[1]); cx.lineTo(q[0], q[1]); }
  cx.closePath(); fillC(K.worry);
  const g = cx.createRadialGradient(-r * .35, cy - r * .45, r * .1, 0, cy, r * 1.05); g.addColorStop(0, '#77727F'); g.addColorStop(.6, K.worry); g.addColorStop(1, '#4A4652');
  cx.beginPath(); cx.arc(0, cy, r * .99, 0, TAU); fillC(g);
  // scribble yarn inside
  cx.save(); cx.beginPath(); cx.arc(0, cy, r * 1.04, 0, TAU); cx.clip();
  const sr = rng(77 + (Math.floor(t * 8) % 2) * 131);
  for (const [col, al, n] of [[K.worryD, .5, 46], [K.worryL, .26, 26]]) {
    cx.strokeStyle = col; cx.globalAlpha = al; cx.lineWidth = Math.max(1.5, r * .032); cx.lineCap = 'round'; cx.beginPath(); let ang = sr() * 6, px = 0, py = 0;
    for (let i = 0; i < n; i++) { ang += .7 + sr() * .9; const rr = r * (.62 + sr() * .42), nx = Math.cos(ang) * rr, ny = cy + Math.sin(ang) * rr; if (!i) cx.moveTo(nx, ny); else cx.quadraticCurveTo(px * .55 + (sr() - .5) * r * .3, cy + (py - cy) * .55 + (sr() - .5) * r * .3, nx, ny); px = nx; py = ny; }
    cx.stroke();
  }
  cx.restore();
  // eyes
  const big = mood === 'shock' ? 1.16 : 1, ex = r * .37, ey = cy - r * .12, erx = r * .27 * big, ery = r * .32 * big, eb = o.blink === undefined ? blinkAt(t, o.bph || 0) : o.blink;
  for (const s of [-1, 1]) {
    if (mood === 'happy') { cx.strokeStyle = K.ink; cx.lineWidth = Math.max(3, r * .09); cx.lineCap = 'round'; cx.beginPath(); cx.arc(s * ex, ey + ery * .35, erx * .8, Math.PI * 1.12, Math.PI * 1.88); cx.stroke(); continue; }
    ell(s * ex, ey + r * .02, erx * 1.08, ery * Math.max(.1, eb) + r * .025, 'rgba(40,36,48,.5)');
    cx.save(); cx.beginPath(); cx.ellipse(s * ex, ey, erx, ery * Math.max(.07, eb), 0, 0, TAU); cx.clip(); cx.fillStyle = '#FFFDF6'; cx.fillRect(-r * 2, cy - r * 2, r * 4, r * 4);
    const pr = r * (mood === 'shock' ? .085 : .15), px = s * ex + look[0] * (erx - pr) * .75, py = ey + look[1] * (ery - pr) * .7;
    ell(px, py, pr, pr, K.ink); ell(px - pr * .35, py - pr * .4, pr * .34, pr * .34, '#FFFDF6');
    if (mood === 'smug') { cx.fillStyle = K.worry; cx.fillRect(s * ex - erx * 1.2, ey - ery * 1.2, erx * 2.4, ery * .78); }
    if (mood === 'sheepish') { cx.fillStyle = K.worry; cx.fillRect(s * ex - erx * 1.2, ey + ery * .55, erx * 2.4, ery); }
    cx.restore();
  }
  // brows
  const bw = Math.max(2.5, r * .075), by = ey - ery * 1.28;
  for (const s of [-1, 1]) {
    if (mood === 'worried' || mood === 'shock' || mood === 'sheepish') cap([s * (ex + erx * .8), by + r * .1], [s * (ex - erx * .55), by - r * .1], bw, K.ink);
    else if (mood === 'smug') cap([s * (ex + erx * .8), by - r * .04], [s * (ex - erx * .6), by + r * .1], bw, K.ink);
    else if (mood === 'keen') cap([s * (ex + erx * .7), by - r * .02], [s * (ex - erx * .5), by - r * .1], bw, K.ink);
  }
  // mouth
  const my = cy + r * .44;
  if (o.talk) { const m = Math.abs(Math.sin(t * 15)) * .75 + Math.abs(Math.sin(t * 9.3 + 1)) * .25; ell(0, my, r * (.15 - m * .03), r * (.04 + m * .13), K.ink); if (m > .5) ell(0, my + r * .07, r * .08, r * .05, '#D9796A'); }
  else if (mood === 'shock') ell(0, my + r * .02, r * .09, r * .12, K.ink);
  else { cx.strokeStyle = K.ink; cx.lineWidth = bw; cx.lineCap = 'round'; cx.beginPath();
    if (mood === 'happy' || mood === 'sheepish' || mood === 'glad') cx.arc(0, my - r * .12, r * .2, Math.PI * .16, Math.PI * .84);
    else if (mood === 'worried') { cx.moveTo(-r * .13, my + r * .02); cx.quadraticCurveTo(-r * .04, my - r * .07, 0, my); cx.quadraticCurveTo(r * .05, my + r * .07, r * .13, my - r * .01); }
    else if (mood === 'smug') { cx.moveTo(-r * .1, my); cx.quadraticCurveTo(r * .04, my + r * .08, r * .16, my - r * .06); }
    else cx.arc(0, my - r * .05, r * .1, Math.PI * .2, Math.PI * .8);
    cx.stroke(); }
  if (mood === 'happy' || mood === 'sheepish' || mood === 'glad') for (const s of [-1, 1]) ell(s * r * .6, cy + r * .28, r * .15, r * .09, 'rgba(233,120,110,.5)');
  if (o.tie) { const ty = cy + r * .78; poly([[-r * .09, ty], [r * .09, ty], [r * .05, ty + r * .1], [-r * .05, ty + r * .1]], '#B94A2C'); poly([[-r * .05, ty + r * .1], [r * .05, ty + r * .1], [r * .11, ty + r * .42], [0, ty + r * .54], [-r * .11, ty + r * .42]], K.ember); }
  cx.restore();
  return { cy: y + cy * sy, top: y + (cy - r * 1.2) * sy, hl: [x + hl[0] * sx, y + hl[1] * sy], hr: [x + hr[0] * sx, y + hr[1] * sy] };
}
// hop cycle: returns lift, squash/stretch
function hop(t, freq, h) { const p = ((t * freq) % 1 + 1) % 1; if (p < .62) { const k = p / .62, up = Math.sin(k * Math.PI); return { lift: up * h, sx: 1 - .1 * up + (k < .12 ? .0 : 0), sy: 1 + .13 * up }; } const k = (p - .62) / .38, sq = Math.sin(k * Math.PI); return { lift: 0, sx: 1 + .16 * sq, sy: 1 - .2 * sq }; }

// ---------- the woman (faceless, soft shapes). All drawn facing right; use mirror() to flip ----------
function mirror(X, fn) { cx.save(); cx.translate(2 * X, 0); cx.scale(-1, 1); fn(); cx.restore(); }
function wHead(x, y, c, rot = 0) {
  cx.save(); cx.translate(x, y); cx.rotate(rot);
  ell(-8, -6, 57, 57, c.hair); if (c.bun) { ell(-42, -58, 27, 27, c.hair); ell(-46, -64, 10, 10, 'rgba(255,220,200,.12)'); }
  ell(11, 9, 43, 43, c.skin);
  cx.beginPath(); cx.ellipse(2, -12, 55, 42, -.12, Math.PI * .93, Math.PI * 2.06); cx.closePath(); fillC(c.hair);
  if (!c.bun) { ell(-34, 22, 26, 34, c.hair); }
  ell(34, 26, 11, 7, 'rgba(222,105,90,.42)');
  cx.restore();
}
function wArm(sh, hand, col, c, bend = 1) { const a = [sh[0], sh[1] + 20], m = [(a[0] + hand[0]) / 2 - 20 * bend, (a[1] + hand[1]) / 2 + 40 * bend]; limb(a, m, hand, 40, col); ell(hand[0], hand[1], 19, 19, c.skin); }
function wUpper(hip, lean, hands, c, o = {}) {
  const sh = [hip[0] + lean, hip[1] - 185];
  if (hands[0]) wArm(sh, hands[0], c.jumpD, c, o.bend0 === undefined ? 1 : o.bend0);
  cap([hip[0], hip[1] - 14], [sh[0], sh[1] + 10], 122, c.jump);
  cap([hip[0] - 34, hip[1] - 10], [sh[0] - 34, sh[1] + 20], 44, 'rgba(120,60,20,.13)'); // back shade
  if (o.behind) o.behind(sh);
  wHead(sh[0] + 10, sh[1] - 110 + (o.headDy || 0), c, o.headRot || 0);
  if (hands[1]) { const a = [sh[0], sh[1] + 20], h = hands[1], b = o.bend1 === undefined ? 1 : o.bend1, m = [(a[0] + h[0]) / 2 - 20 * b, (a[1] + h[1]) / 2 + 40 * b]; limb(a, m, h, 48, 'rgba(120,60,20,.16)'); wArm(sh, h, c.jumpL, c, b); }
  return sh;
}
function wLegsSit(hip, c) {
  limb(hip, [hip[0] + 150, hip[1] - 8], [hip[0] + 128, hip[1] + 186], 46, c.trouD); ell(hip[0] + 146, hip[1] + 190, 34, 15, c.shoe);
  limb([hip[0], hip[1] + 6], [hip[0] + 165, hip[1]], [hip[0] + 144, hip[1] + 188], 48, c.trou); ell(hip[0] + 162, hip[1] + 192, 35, 16, c.shoe);
}
function wWalk(x, G, ph, c, o = {}) {
  const bob = Math.abs(Math.sin(ph)) * -10, hip = [x, G - 236 + bob];
  shadow(x + 6, G + 4, 120, 22, .26);
  const leg = (side, col) => { const p = ph + (side > 0 ? Math.PI : 0), fx = x + Math.sin(p) * 74, fy = G - 12 - Math.max(0, Math.cos(p)) * 34; limb(hip, [(hip[0] + fx) / 2 + 30, hip[1] + 130], [fx, fy], 46, col); cx.save(); cx.translate(fx + 14, fy + 4); cx.rotate(-Math.max(0, Math.cos(p)) * .35); ell(0, 0, 35, 15, c.shoe); cx.restore(); };
  leg(-1, c.trouD); leg(1, c.trou);
  const sw = Math.sin(ph + Math.PI) * 1, sh = [hip[0] + 8, hip[1] - 185];
  const far = [sh[0] - sw * 70 + 4, sh[1] + 190 - Math.abs(sw) * 14];
  const near = o.near || [sh[0] + sw * 70 - 4, sh[1] + 190 - Math.abs(sw) * 14];
  wUpper(hip, 8, [far, near], c, { headRot: Math.sin(ph * 2) * .015 + (o.headRot || 0), behind: o.behind, bend1: o.bend1, bend0: .5 });
  return { hip, sh };
}

// ---------- sets ----------
function street(scroll, t, o = {}) {
  cx.fillStyle = vgrad(0, 1200, [[0, o.sky0 || '#F6C196'], [.5, o.sky1 || '#FBDDB3'], [1, '#FDEFD6']]); cx.fillRect(0, 0, W, 1200);
  const sunX = o.sunX || 800, sunY = o.sunY || 560;
  glow(sunX, sunY, 620, '255,246,215', .95, 'source-over'); ell(sunX, sunY, 84, 84, 'rgba(255,250,232,.55)'); ell(sunX, sunY, 64, 64, '#FFFAEA');
  tiles(scroll + t * 30, .06, 620, (x, i) => { const y = 300 + hsh(i) * 200; cx.save(); cx.globalAlpha = .8; rect(x, y, 250, 56, '#FFF3E0', 28); rect(x + 60, y - 30, 130, 60, '#FFF3E0', 30); cx.restore(); });
  // far roofs
  tiles(scroll, .16, 210, (x, i) => { const top = 760 + hsh(i * 3) * 110, c = ['#EBB698', '#E9C3A2', '#E4AB90'][((i % 3) + 3) % 3]; rect(x, top, 196, 1000 - top + 200, c); poly([[x - 12, top], [x + 98, top - 70], [x + 208, top]], '#D99A80'); rect(x + 140, top - 86, 22, 50, '#D99A80'); for (let k = 0; k < 2; k++) rect(x + 36 + k * 76, top + 46, 40, 54, 'rgba(255,240,205,.75)', 4); });
  cx.fillStyle = 'rgba(250,225,190,.35)'; cx.fillRect(0, 700, W, 500); // haze
  // mid: trees + a couple of houses
  tiles(scroll, .45, 520, (x, i) => {
    const kind = ((i % 3) + 3) % 3;
    if (kind === 1) { const c = ['#D9825B', '#8FA7B5'][Math.abs(i) % 2], top = 700; rect(x, top, 330, 520, c); poly([[x - 22, top], [x + 165, top - 120], [x + 352, top]], '#8E4A38'); rect(x + 44, top + 60, 90, 120, '#FCE9B8', 8); rect(x + 196, top + 60, 90, 120, '#FCE9B8', 8); rect(x + 86, top + 60, 6, 120, c); rect(x + 238, top + 60, 6, 120, c); rect(x + 120, top + 260, 96, 230, '#5E7F6E', 8); ell(x + 196, top + 380, 6, 6, '#F5D79A'); }
    else { const fc = [['#8FA57A', '#A4B88C'], ['#D9914E', '#E8AB66']][kind / 2 | 0], tx = x + 170 + hsh(i) * 80, sway = Math.sin(t * 1.2 + i) * 6; rect(tx - 13, 900, 26, 300, '#7A5340', 8); for (const [dx, dy, rr, ci] of [[0, -40, 120, 0], [-80, 30, 86, 0], [84, 24, 92, 0], [-30, -70, 70, 1], [50, -50, 56, 1]]) ell(tx + dx + sway * (1 - dy / 200), 840 + dy, rr, rr * .92, fc[ci]); }
  });
  // near: brick garden wall with hedge, lamp posts, a cat
  cx.fillStyle = vgrad(960, 1190, [[0, '#C97D59'], [1, '#B96B4A']]); cx.fillRect(0, 985, W, 205);
  tiles(scroll, 1, 96, (x, i) => { for (let r = 0; r < 4; r++) rect(x + (r % 2) * 48, 1000 + r * 46, 4, 46, 'rgba(110,50,30,.28)'); });
  for (let r = 1; r < 4; r++) rect(0, 998 + r * 46, W, 4, 'rgba(110,50,30,.28)');
  rect(0, 968, W, 26, '#F3DFC2'); rect(0, 990, W, 8, 'rgba(110,50,30,.25)');
  tiles(scroll, 1, 1180, (x, i) => {
    for (let k = 0; k < 6; k++) ell(x + 90 + k * 78, 930 - hsh(i * 9 + k) * 26, 66, 54, k % 2 ? '#6E8B62' : '#7C9870'); // hedge
    for (let k = 0; k < 9; k++) ell(x + 70 + hsh(k + i) * 440, 890 + hsh(k * 4 + i) * 60, 9, 9, '#F0B9A8');
    const lx = x + 800; rect(lx - 9, 520, 18, 680, '#3E3A48', 6); rect(lx - 20, 1150, 40, 44, '#3E3A48', 6); rect(lx - 36, 470, 72, 16, '#3E3A48', 6); poly([[lx - 30, 486], [lx + 30, 486], [lx + 20, 560], [lx - 20, 560]], '#FBE6B4'); rect(lx - 26, 556, 52, 10, '#3E3A48', 3);
    const cxp = x + 1010; ell(cxp, 940, 40, 30, '#3B3440'); ell(cxp + 34, 906, 22, 20, '#3B3440'); poly([[cxp + 18, 896], [cxp + 24, 872], [cxp + 36, 890]], '#3B3440'); poly([[cxp + 38, 890], [cxp + 50, 872], [cxp + 54, 898]], '#3B3440'); limb([cxp - 36, 950], [cxp - 80, 960], [cxp - 70, 900 + Math.sin(t * 3) * 10], 10, '#3B3440');
  });
  // pavement + road
  cx.fillStyle = vgrad(1180, 1360, [[0, '#E3CDAC'], [1, '#D6BD98']]); cx.fillRect(0, 1186, W, 180);
  rect(0, 1186, W, 16, 'rgba(110,60,40,.2)');
  tiles(scroll, 1, 210, x => poly([[x, 1200], [x + 5, 1200], [x - 25, 1362], [x - 30, 1362]], 'rgba(120,85,55,.22)'));
  rect(0, 1362, W, 24, '#BFA380'); cx.fillStyle = vgrad(1386, 1920, [[0, '#8E7C78'], [1, '#75656A']]); cx.fillRect(0, 1386, W, 540);
  tiles(scroll, 1.25, 420, x => rect(x, 1640, 220, 16, 'rgba(255,240,215,.4)', 8));
}
function leaves(t, scroll) { for (let i = 0; i < 7; i++) { const x = ((hsh(i) * 1400 - scroll * .9 - t * 40) % 1300 + 1300) % 1300 - 100, y = 500 + ((hsh(i * 3) * 760 + t * (60 + hsh(i) * 50)) % 760); cx.save(); cx.translate(x, y); cx.rotate(t * 2 + i); ell(0, 0, 15, 7, ['#D9914E', '#C9694A', '#E8AB66'][i % 3]); cx.restore(); } }

function office(t) {
  cx.fillStyle = vgrad(0, FLOOR, [[0, '#EBCB9C'], [1, '#E2BC8A']]); cx.fillRect(0, 0, W, FLOOR);
  for (let i = 0; i < 9; i++) rect(60 + i * 130, 0, 3, FLOOR, 'rgba(160,110,60,.07)');
  rect(0, FLOOR - 30, W, 30, '#F5E4C8'); rect(0, FLOOR - 34, W, 5, 'rgba(120,70,40,.2)');
  cx.fillStyle = vgrad(FLOOR, H, [[0, '#B98058'], [1, '#9C6746']]); cx.fillRect(0, FLOOR, W, H - FLOOR);
  for (let i = 0; i < 6; i++) rect(0, FLOOR + 50 + i * 110, W, 4, 'rgba(80,40,20,.16)');
  // window
  rect(52, 340, 396, 480, '#FBF1DF', 14); cx.save(); cx.beginPath(); cx.rect(72, 360, 356, 440); cx.clip();
  cx.fillStyle = vgrad(360, 800, [[0, '#BFE0E4'], [1, '#F6E7C9']]); cx.fillRect(72, 360, 356, 440);
  ell(330, 450, 46, 46, 'rgba(255,250,230,.9)');
  [[80, 620, 70], [150, 560, 60], [215, 640, 80], [300, 590, 64], [366, 660, 70]].forEach(([x, y, w], i) => { rect(x, y, w, 300, i % 2 ? '#9DBBC0' : '#89AAB2'); for (let k = 0; k < 6; k++) rect(x + 10 + (k % 2) * 26, y + 16 + (k >> 1) * 40, 14, 20, 'rgba(255,245,215,.6)'); });
  cx.restore(); rect(244, 360, 12, 440, '#FBF1DF'); rect(72, 570, 356, 12, '#FBF1DF'); rect(36, 812, 428, 26, '#FFF7E8', 8); rect(36, 836, 428, 8, 'rgba(120,70,40,.2)');
  // plant on the sill
  rect(96, 760, 64, 54, '#C9694A', 8); for (const [dx, dy, a] of [[-26, -50, -.6], [0, -70, 0], [28, -52, .6], [-10, -30, -.3], [14, -34, .35]]) ell(128 + dx, 760 + dy, 15, 36, '#6E8B62', a + Math.sin(t * 1.5) * .03);
  // shelf + books + trailing plant
  rect(540, 520, 440, 18, '#8C5B3D', 4); rect(540, 538, 440, 8, 'rgba(80,40,20,.2)');
  let bx = 566; [['#C9694A', 30, 120], ['#5E7F6E', 24, 100], ['#F3DFC2', 34, 132], ['#3E5A68', 26, 110], ['#E3A33B', 22, 94]].forEach(([c, w, h]) => { rect(bx, 520 - h, w, h, c, 3); rect(bx + 5, 520 - h + 14, w - 10, 5, 'rgba(255,255,255,.3)'); bx += w + 4; });
  cx.save(); cx.translate(bx + 30, 520); cx.rotate(-.28); rect(-14, -104, 28, 104, '#8FA7B5', 3); cx.restore();
  rect(848, 462, 72, 58, '#F5E4C8', 8); for (let k = 0; k < 4; k++) { const sx = 858 + k * 18, sw = Math.sin(t * 1.4 + k) * 5; line([[sx, 470], [sx + sw * .5, 560 + k * 16], [sx + sw, 610 + k * 30]], 5, '#6E8B62'); for (let j = 0; j < 4; j++) ell(sx + sw * (j / 4) + (j % 2 ? 9 : -9), 520 + j * (26 + k * 6), 11, 7, '#7C9870', j % 2 ? .5 : -.5); }
  // sticky notes on the wall
  [[840, 690, '#F6D365', -.08], [912, 706, '#F2A7A0', .1], [868, 770, '#BFE0C8', .04]].forEach(([x, y, c, a]) => { cx.save(); cx.translate(x, y); cx.rotate(a); rect(-30, -30, 60, 60, c, 3); rect(-18, -10, 36, 4, 'rgba(43,35,48,.35)'); rect(-18, 4, 24, 4, 'rgba(43,35,48,.35)'); cx.restore(); });
  // sunlight through the window
  glow(300, 600, 700, '255,236,190', .3);
  // wall clock + framed print
  ell(640, 250, 66, 66, '#3E5A68'); ell(640, 250, 54, 54, '#FBF1DF'); cap([640, 250], [640 + Math.sin(t * .4) * 34, 250 - Math.cos(t * .4) * 34], 5, K.ink); cap([640, 250], [662, 262], 6, K.ink); ell(640, 250, 6, 6, K.ember);
  rect(800, 170, 170, 210, '#8C5B3D', 6); rect(814, 184, 142, 182, '#F7E8CF', 3); ell(885, 300, 46, 34, '#D9825B'); ell(860, 250, 22, 22, '#E3A33B'); rect(814, 320, 142, 46, '#8FA57A');
}
function desk(t) {
  shadow(730, FLOOR + 6, 380, 34, .25);
  rect(446, 1060, 26, 232, '#7C4F36', 4); rect(860, 1064, 230, 228, '#8A5A3C', 6); for (let k = 0; k < 2; k++) { rect(876, 1084 + k * 100, 200, 84, '#9A6644', 6); ell(976, 1126 + k * 100, 9, 9, '#F3DFC2'); }
  rect(400, 1036, 700, 30, '#A26C48', 8); rect(400, 1036, 700, 7, 'rgba(255,230,190,.35)', 4); rect(400, 1062, 700, 8, 'rgba(60,25,15,.25)');
  // monitor
  ell(664, 1034, 78, 12, '#322C38'); rect(648, 960, 32, 76, '#3A3340'); rect(536, 748, 256, 226, '#3A3340', 20); rect(550, 762, 228, 190, '#F8F1E4', 8);
  rect(550, 762, 228, 34, '#E3A33B', 8); rect(550, 782, 228, 14, '#E3A33B'); ell(570, 779, 6, 6, '#FBF1DF'); ell(590, 779, 6, 6, '#FBF1DF');
  for (let k = 0; k < 4; k++) rect(568, 816 + k * 24, [180, 150, 190, 110][k], 9, 'rgba(43,35,48,.28)', 4);
  rect(660, 908, 104, 34, '#5E7F6E', 17); text('sent ✓', 712, 926, 24, 1, 'Inter', 600, '#FBF1DF');
  cx.save(); cx.translate(770, 752); cx.rotate(.1); rect(-24, -22, 48, 48, '#F6D365', 3); cx.restore();
  rect(430, 1020, 150, 16, '#EFE3D0', 5); rect(436, 1023, 138, 5, 'rgba(43,35,48,.18)', 2);
  rect(600, 990, 44, 46, '#C9694A', 8); cx.strokeStyle = '#C9694A'; cx.lineWidth = 8; cx.beginPath(); cx.arc(646, 1012, 13, -1.3, 1.3); cx.stroke(); steam(622, 982, t);
}
function officeChair() { shadow(250, FLOOR + 4, 130, 20, .25); rect(240, 1120, 20, 150, '#3A3340'); rect(170, 1262, 160, 16, '#3A3340', 8); ell(180, 1284, 12, 12, '#2B2330'); ell(320, 1284, 12, 12, '#2B2330'); rect(150, 880, 34, 250, '#4F7C74', 16); rect(160, 1106, 200, 30, '#4F7C74', 14); }

function cafe(t) {
  cx.fillStyle = vgrad(0, FLOOR, [[0, '#5B8778'], [1, '#4E776A']]); cx.fillRect(0, 0, W, FLOOR);
  rect(0, 1000, W, 290, '#3F6659'); rect(0, 990, W, 16, '#F3DFC2'); for (let i = 0; i < 8; i++) rect(40 + i * 150, 1030, 110, 230, 'rgba(255,255,255,.045)', 6);
  // arched window onto the street
  const wx = 520, wb = 940, ww = 250, ay = 610;
  const arch = (g, c) => { cx.beginPath(); cx.moveTo(wx - ww - g, wb + g); cx.lineTo(wx - ww - g, ay); cx.arc(wx, ay, ww + g, Math.PI, 0); cx.lineTo(wx + ww + g, wb + g); cx.closePath(); if (c) fillC(c); };
  arch(22, '#F7E8CF'); cx.save(); arch(0); cx.clip();
  cx.fillStyle = vgrad(360, wb, [[0, '#FBE4B4'], [1, '#FDF1D8']]); cx.fillRect(wx - ww, 340, ww * 2, 620);
  rect(300, 700, 150, 260, '#F0CFA2'); rect(450, 660, 170, 300, '#EDC594'); rect(620, 720, 160, 240, '#F0CFA2'); for (let k = 0; k < 6; k++) rect(320 + k * 76, 760, 30, 44, 'rgba(255,255,255,.5)', 4);
  ell(330, 860, 70, 80, '#C8D4A6'); rect(322, 880, 14, 80, '#B59870');
  for (let k = 0; k < 8; k++) { const sx = wx - ww + k * 64; rect(sx, 360, 64, 118, k % 2 ? '#F7E8CF' : '#D9643A'); ell(sx + 32, 478, 32, 22, k % 2 ? '#F7E8CF' : '#D9643A'); }
  cx.restore(); rect(wx - 7, 380, 14, wb - 380, '#F7E8CF'); rect(wx - ww, 700, ww * 2, 12, '#F7E8CF'); rect(wx - ww - 40, wb, ww * 2 + 80, 26, '#FFF7E8', 8);
  // chalkboard menu
  rect(52, 560, 190, 250, '#8C5B3D', 10); rect(66, 574, 162, 222, '#2F3E3B', 6); text('brunch', 147, 618, 46, 1, 'Caveat', 700, '#F7E8CF'); for (let k = 0; k < 4; k++) { rect(86, 662 + k * 32, 84 - (k % 2) * 20, 5, 'rgba(247,232,207,.6)', 2); rect(190, 662 + k * 32, 20, 5, 'rgba(227,163,59,.8)', 2); }
  // shelf of cups
  rect(820, 640, 240, 16, '#8C5B3D', 4); for (let k = 0; k < 3; k++) { rect(846 + k * 66, 598, 40, 42, ['#F7E8CF', '#E9B3A6', '#E3A33B'][k], 7); }
  rect(820, 760, 240, 16, '#8C5B3D', 4); rect(850, 700, 46, 60, '#C9694A', 8); for (const a of [-.5, 0, .5]) ell(873 + a * 40, 676, 13, 32, '#8FB38A', a); rect(930, 716, 70, 44, '#F7E8CF', 6);
  // pendant lamps
  for (const [lx, ly] of [[200, 400], [860, 440]]) { const s = Math.sin(t * .9 + lx) * 5; rect(lx - 2, 0, 4, ly - 60, '#2B2330'); cx.beginPath(); cx.arc(lx + s * .3, ly, 78, Math.PI, 0); cx.closePath(); fillC('#E3A33B'); rect(lx - 78 + s * .3, ly - 4, 156, 10, '#C98A2B', 5); ell(lx + s * .3, ly + 12, 26, 18, '#FFF1C4'); glow(lx, ly + 30, 420, '255,214,140', .5); }
  // floor tiles
  cx.fillStyle = '#E2B58C'; cx.fillRect(0, FLOOR, W, H - FLOOR); for (let r = 0; r < 6; r++) { const y = FLOOR + r * 100 + r * r * 4, hh = 100 + r * 9; for (let k = -1; k < 9; k++) if ((k + r) % 2) poly([[k * 140 + r * 14, y], [k * 140 + 140 + r * 14, y], [k * 140 + 154 + r * 14, y + hh], [k * 140 + 14 + r * 14, y + hh]], '#D39C74'); }
  rect(0, FLOOR, W, 10, 'rgba(40,20,10,.22)');
}
function cafeChair(x, dir) { cx.save(); cx.translate(x, 0); cx.scale(dir, 1); shadow(60, FLOOR + 4, 120, 18, .25); rect(-70, 860, 22, 430, '#C9694A', 10); rect(-70, 860, 26, 150, '#D9825B', 12); rect(-70, 1118, 190, 22, '#C9694A', 10); rect(96, 1130, 18, 160, '#B25A3E', 8); cx.restore(); }
function cafeTable(t) {
  shadow(520, FLOOR + 6, 190, 24, .3); rect(506, 1080, 28, 200, '#3A3340'); ell(520, 1284, 96, 15, '#3A3340');
  ell(520, 1090, 246, 30, '#C9B291'); ell(520, 1076, 246, 30, '#FAEBD2'); ell(520, 1076, 226, 23, 'rgba(255,255,255,.35)');
  // pancakes
  ell(524, 1070, 76, 15, '#EADBC2'); for (let k = 0; k < 3; k++) { ell(524, 1062 - k * 13, 56, 13, '#C98A45'); ell(524, 1058 - k * 13, 56, 12, '#E8B565'); } ell(524, 1030, 40, 8, '#9A4F2A'); limb([550, 1032], [566, 1040], [562, 1056], 9, '#9A4F2A'); ell(516, 1022, 9, 8, '#C0392B'); ell(534, 1024, 8, 7, '#7A3E6E'); rect(506, 1010, 20, 10, '#FFF3C4', 3);
  for (const x of [382, 668]) { ell(x, 1072, 44, 9, '#EADBC2'); rect(x - 26, 1030, 52, 42, '#FFFDF6', 9); ell(x, 1032, 26, 7, '#8A5A3C'); cx.strokeStyle = '#FFFDF6'; cx.lineWidth = 7; cx.beginPath(); cx.arc(x + (x < 500 ? -28 : 28), 1050, 11, 0, TAU); cx.stroke(); steam(x, 1020, t + x); }
}

function bedroom(t, dawn = 0) {
  const wall0 = mixC('#2C3052', '#6B5A7E', dawn), wall1 = mixC('#232646', '#5A4C70', dawn);
  cx.fillStyle = vgrad(0, FLOOR, [[0, wall0], [1, wall1]]); cx.fillRect(0, 0, W, FLOOR);
  for (let i = 0; i < 12; i++) for (let j = 0; j < 8; j++) ell(70 + i * 96 + (j % 2) * 48, 120 + j * 150, 5, 5, 'rgba(255,255,255,.035)');
  rect(0, FLOOR - 28, W, 28, mixC('#3A4068', '#8A7A9A', dawn));
  cx.fillStyle = vgrad(FLOOR, H, [[0, mixC('#1D2038', '#4A3A52', dawn)], [1, mixC('#15172B', '#3A2C42', dawn)]]); cx.fillRect(0, FLOOR, W, H - FLOOR);
  ell(640, 1356, 430, 62, mixC('#343466', '#8A5A6E', dawn)); ell(640, 1356, 380, 48, mixC('#3E3E78', '#A06C78', dawn));
  // window: moon, stars, curtains
  rect(86, 320, 340, 470, mixC('#444B78', '#9C8AA8', dawn), 12); cx.save(); cx.beginPath(); cx.rect(104, 338, 304, 434); cx.clip();
  cx.fillStyle = vgrad(338, 772, [[0, mixC('#27376E', '#8FA0D0', dawn)], [1, mixC('#3F5290', '#F6C9A0', dawn)]]); cx.fillRect(104, 338, 304, 434);
  for (let i = 0; i < 16; i++) ell(110 + hsh(i) * 290, 345 + hsh(i * 5) * 300, 2.5, 2.5, `rgba(255,250,230,${(.4 + .5 * Math.abs(Math.sin(t * 2 + i))) * (1 - dawn)})`);
  glow(310, 440, 150, '240,235,255', .5 * (1 - dawn * .7)); cx.globalAlpha = 1 - dawn * .8; ell(310, 440, 40, 40, '#F7EFD6'); cx.globalAlpha = 1; ell(326, 430, 34, 34, mixC('#2B3D75', '#93A2CF', dawn));
  rect(104, 690, 90, 90, mixC('#1D2748', '#6E6A90', dawn)); rect(194, 720, 110, 60, mixC('#222D52', '#7A7498', dawn)); rect(304, 670, 104, 110, mixC('#1D2748', '#6E6A90', dawn)); rect(330, 700, 14, 18, 'rgba(255,214,140,.7)');
  cx.restore(); rect(250, 338, 12, 434, mixC('#444B78', '#9C8AA8', dawn)); rect(70, 782, 372, 22, mixC('#50588A', '#B09CB6', dawn), 8);
  for (const [x0, d] of [[52, 1], [460, -1]]) { cx.beginPath(); cx.moveTo(x0, 290); for (let i = 0; i <= 10; i++) cx.lineTo(x0 + d * (74 + Math.sin(i * 1.9) * 12 + Math.sin(t * .8 + i) * 3), 290 + i * 54); cx.lineTo(x0, 830); cx.closePath(); fillC(mixC('#5A4480', '#B07A8E', dawn)); for (let k = 1; k < 3; k++) rect(x0 + d * k * 24 - 2, 300, 4, 520, 'rgba(20,10,40,.18)'); }
  rect(40, 280, 440, 14, mixC('#2B2330', '#4B3A4A', dawn), 7);
  cx.save(); cx.globalCompositeOperation = 'screen'; const mp = `rgba(${dawn > .5 ? '255,200,150' : '150,175,235'},${.11 + dawn * .08})`; for (const [a, b] of [[0, .47], [.53, 1]]) poly([[430 + a * 300, 1320], [430 + b * 300, 1320], [520 + b * 330, 1400], [520 + a * 330, 1400]], mp); cx.restore();
  // clock on the sill
  rect(118, 724, 126, 58, '#1B1A26', 10);
  const colon = Math.sin(t * 6) > 0 ? ':' : ' '; glow(181, 752, 130, '255,120,80', .4 * (1 - dawn)); text(dawn > 0 ? `6${colon}40` : `3${colon}00`, 181, 755, 38, 1, 'Inter', 700, '#FF8A5B');
  // fairy lights
  cx.strokeStyle = 'rgba(20,14,30,.7)'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(480, 250); cx.quadraticCurveTo(780, 360, 1090, 230); cx.stroke();
  for (let i = 0; i < 9; i++) { const k = (i + .5) / 9, x = lerp(lerp(480, 780, k), lerp(780, 1090, k), k), y = lerp(lerp(250, 360, k), lerp(360, 230, k), k) + 10, tw = .55 + .45 * Math.sin(t * 2.2 + i * 1.7); glow(x, y, 60, '255,205,130', .5 * tw); ell(x, y, 8, 10, `rgba(255,226,170,${.6 + .4 * tw})`); }
}
// the bed; sit = 0 lying awake, 1 sitting up with her phone
function bed(t, sit, dawn = 0) {
  shadow(250, FLOOR + 6, 300, 26, .4, '8,6,20');
  rect(20, 900, 44, 392, mixC('#6B4F78', '#9A6A70', dawn), 16); rect(40, 1200, 440, 60, mixC('#5A4468', '#8A5E66', dawn), 10); rect(54, 1255, 22, 40, '#2B2330'); rect(440, 1255, 22, 40, '#2B2330');
  rect(48, 1126, 430, 84, mixC('#B9B4D6', '#F1E3D8', dawn), 20);
  cx.save(); cx.translate(140, 1096); cx.rotate(sit ? -.5 : -.06); rect(-84, -36, 168, 72, mixC('#D8D4EE', '#FFF6EA', dawn), 30); cx.restore();
  const duvet = mixC('#8A5E8E', '#D98A7A', dawn), duvetL = mixC('#A274A4', '#EAA490', dawn);
  if (!sit) {
    wHead(150, 1070, K.her, -1.25 + Math.sin(t * 1.1) * .02);
    cx.beginPath(); cx.moveTo(196, 1104); cx.bezierCurveTo(240, 1030, 330, 1040, 400, 1070); cx.bezierCurveTo(470, 1090, 500, 1150, 496, 1236); cx.lineTo(196, 1236); cx.closePath(); fillC(duvet);
    cx.beginPath(); cx.moveTo(196, 1104); cx.bezierCurveTo(230, 1058, 280, 1052, 300, 1070); cx.bezierCurveTo(260, 1076, 230, 1100, 214, 1130); cx.closePath(); fillC(duvetL);
    ell(206, 1092 + Math.sin(t * 9) * 1.5, 14, 14, K.her.skin); ell(232, 1082 + Math.sin(t * 9 + 1) * 1.5, 14, 14, K.her.skin);
  } else {
    const hip = [226, 1150]; wUpper(hip, 30, [[360, 1040], [372, 1052]], K.her, { headRot: .12, bend0: .8, bend1: .8 });
    cx.save(); cx.translate(382, 1010); cx.rotate(.25); rect(-22, -40, 44, 80, '#17120E', 9); cx.restore(); glow(360, 1000, 150, '255,225,190', .35);
    cx.beginPath(); cx.moveTo(150, 1150); cx.bezierCurveTo(240, 1100, 380, 1060, 440, 1090); cx.bezierCurveTo(490, 1110, 500, 1160, 496, 1236); cx.lineTo(150, 1236); cx.closePath(); fillC(duvet);
    cx.beginPath(); cx.moveTo(150, 1150); cx.bezierCurveTo(220, 1112, 300, 1090, 350, 1086); cx.bezierCurveTo(300, 1112, 240, 1140, 200, 1170); cx.closePath(); fillC(duvetL);
  }
}
const CHART = { x: 370, y: 540, w: 400, h: 450, rows: [[692, '1. you get fired', 250], [760, '2. that mole', 190], [828, '3. everyone’s', 210], [888, '    annoyed with you', 290]] };
function flipchart(t, reveal, crossed, dawn = 0) {
  const { x, y, w, h } = CHART, mx = x + w / 2;
  for (const bx of [x + 30, x + w - 30]) line([[mx, y - 30], [bx - (bx < mx ? 40 : -40), FLOOR]], 14, '#7A5340'); line([[mx, y - 30], [mx + 30, FLOOR - 40]], 12, '#5E3E30');
  rect(x + 8, y + 10, w, h, 'rgba(10,8,25,.3)', 6); rect(x, y, w, h, '#FBF4E6', 6); rect(x, y, w, 30, '#D9643A', 6); for (let k = 0; k < 5; k++) ell(x + 50 + k * 75, y + 15, 7, 7, '#FBF4E6');
  rect(x - 14, y + h - 4, w + 28, 18, '#7A5340', 6);
  text('what if:', x + 34, y + 84, 62, 1, 'Caveat', 700, K.ember, 'left');
  CHART.rows.forEach(([ry, s, cw], i) => { const k = reveal[Math.min(i, 2)] - (i === 3 ? .5 : 0) * 0; const kk = i === 3 ? seg(reveal[2], .5, 1) : (i === 2 ? seg(reveal[2], 0, .5) : k); if (kk <= 0) return; cx.save(); cx.beginPath(); cx.rect(x, ry - 34, 40 + (w - 40) * kk, 68); cx.clip(); text(s, x + 34, ry, 47, 1, 'Caveat', 700, K.ink, 'left'); cx.restore(); });
  const sav = R; R = rng(5);
  crossed.forEach((c, i) => { if (c <= 0) return; const rows = i === 2 ? [CHART.rows[2], CHART.rows[3]] : [CHART.rows[i]]; rows.forEach(([ry, s, cw], j) => { const k = rows.length > 1 ? seg(c, j * .5, j * .5 + .5) : c; if (k > 0) wline([[x + (j ? 62 : 28), ry + 4], [x + (j ? 62 : 28) + cw * k, ry + 2]], 2, 8, '#C8452B'); }); });
  R = sav;
  // clip lamp
  line([[mx + 120, y - 6], [mx + 150, y - 70], [mx + 96, y - 96]], 8, '#2B2330'); cx.save(); cx.translate(mx + 84, y - 92); cx.rotate(-.5); poly([[-34, -22], [20, -16], [20, 16], [-34, 26]], '#E3A33B'); cx.restore();
  
}

// ---------- the phone (drawn, inside the story) ----------
function phone(t, t0) {
  const px = 190, py = 356, pw = 660, ph = 916;
  rect(px + 14, py + 22, pw, ph, 'rgba(5,4,15,.45)', 70);
  rect(px, py, pw, ph, '#0F0C0B', 70); rect(px + 4, py + 4, pw - 8, ph - 8, '#2A2320', 66); rect(px + 16, py + 16, pw - 32, ph - 32, '#1B1512', 56);
  rect(px + pw / 2 - 64, py + 34, 128, 30, '#0A0808', 15);
  text('heartly', px + pw / 2, py + 118, 58, 1, 'Caveat', 700, '#F6E9D6'); rect(px + 60, py + 162, pw - 120, 2, 'rgba(246,233,214,.12)');
  const L = px + 62, mw = pw - 124, size = 40, lh = size * 1.42; let y = py + 212;
  const entry = 'what if i get fired. what if everyone’s annoyed with me. what if i’m not doing enough.';
  const reply = 'these are all “what ifs”. which one is actually happening right now?';
  text('you', L, y, 26, seg(t, t0, t0 + .2), 'Inter', 600, '#9C8E80', 'left'); y += 52;
  const typeDur = 1.25, n = Math.floor(seg(t, t0 + .15, t0 + .15 + typeDur) * entry.length), eL = wrapLines(entry, mw, size); let left = n, curX = L, curY = y;
  eL.forEach((l, i) => { const s = l.slice(0, Math.max(0, left)); if (left > 0) { cx.font = `500 ${size}px Inter`; curX = L + cx.measureText(s).width; curY = y + i * lh; } left -= l.length + 1; text(s, L, y + i * lh, size, 1, 'Inter', 500, '#F6E9D6', 'left'); });
  const r0 = t0 + .45 + typeDur;
  if (t < r0 && Math.sin(t * 10) > -.3) rect(curX + 4, curY - size * .55, 4, size * 1.05, K.ember);
  y += eL.length * lh + 34;
  if (t > r0) {
    const rL = wrapLines(reply, mw - 56, size, 500), k = seg(t, r0, r0 + .35), bh = rL.length * lh + 96;
    cx.save(); cx.globalAlpha = k; cx.translate(0, (1 - easeOut(k)) * 24);
    rect(L - 14, y, mw + 28, bh, 'rgba(217,100,58,.16)', 26); rect(L - 14, y + 26, 6, bh - 52, K.ember, 3);
    ell(L + 28, y + 38, 8, 8, K.ember); text('heartly', L + 46, y + 38, 26, 1, 'Inter', 600, '#D9A58C', 'left');
    cx.restore();
    rL.forEach((l, i) => text(l, L + 20, y + 96 + i * lh, size, seg(t, r0 + .15 + i * .22, r0 + .5 + i * .22), 'Inter', 500, '#FFC9A8', 'left'));
  }
}

// ---------- scenes ----------
window.SCENE = {
  duration: 19.5,
  render(t) {
    boil(t);
    cx.save(); cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over';
    if (t < 3.4) { // S1 the street: she walks, he hops along behind
      const scroll = t * 215, k = t / 3.4;
      cam(1.2 + .04 * k, 470, FLOOR);
      street(scroll, t);
      const hp = hop(t + .12, 2.1, 70), r = 56 + t * 3;
      const wx = 270 + Math.sin(t * 2.1) * 8;
      worry(wx, FLOOR - hp.lift, r, t, { look: [.8, hp.lift > 20 ? -.3 : .1], mood: 'keen', sx: hp.sx, sy: hp.sy, gy: FLOOR, shadow: .3 - hp.lift * .002 });
      if (hp.lift === 0) for (const s of [-1, 1]) ell(wx + s * (r + 24), FLOOR - 6, 9, 5, 'rgba(255,245,225,.6)');
      wWalk(600, FLOOR, t * 7.2 + 1.2, K.her);
      leaves(t, scroll);
      // "worry" name tag with a hand-drawn arrow
      const nk = seg(t, 1.3, 1.6);
      if (nk > 0) { cx.save(); cx.globalAlpha = nk; cx.translate(196, 900 + (1 - backOut(nk)) * 20); cx.rotate(-.07); text('worry', 0, 0, 78, 1, 'Caveat', 700, K.ink); cx.restore(); const sav = R; R = rng(9); wline([[214, 946], [228, 990], [250, 1024]], 2, 5, K.ink, nk); wline([[226, 1016], [252, 1028], [258, 1000]], 1, 5, K.ink, seg(t, 1.5, 1.7)); R = sav; }
      cx.restore();
      glow(800, 500, 900, '255,225,170', .16);
      finish(.16);
      card(t, -1, 3.36, ['she has a little guy.', 'his name is worry.'], { size: 72 });
    } else if (t < 6.4) { // S2 work
      const k = (t - 3.4) / 3, said = t > 4.05;
      cam(1.02 + .05 * ease(k), 640, 950);
      office(t);
      officeChair();
      const hip = [262, 1100], slump = ease(seg(t, 4.1, 4.6));
      wLegsSit(hip, K.her);
      desk(t);
      const ty = said ? 0 : Math.sin(t * 22) * 5;
      wUpper(hip, 34 + slump * 14, [[500, 1014 - Math.max(0, ty)], [468, 1016 + Math.min(0, ty)]], K.her, { headRot: .1 + slump * .22, headDy: slump * 8 });
      const lean = ease(seg(t, 3.9, 4.3)), b = Math.sin(t * 5) * .02;
      const w = worry(866, 1038, 76, t, { look: [-.9, .25], mood: said ? 'smug' : 'neutral', talk: said && t < 5.6, tilt: -lean * .16, sx: 1 + b, sy: 1 - b, hands: said ? { l: [-96, -150 + Math.sin(t * 8) * 6] } : undefined });
      motes(t, 14, '255,240,200', .5);
      cx.restore();
      say(640, 690, 'they hated that email.', seg(t, 4.05, 4.4), [840, 880]);
      finish(.28);
      card(t, 3.4, 6.36, ['he comes to work.']);
    } else if (t < 9.0) { // S3 brunch
      const k = (t - 6.4) / 2.6, said = t > 7.0;
      cam(1.02 + .05 * ease(k), 520, 950);
      cafe(t);
      cafeChair(190, 1); cafeChair(850, -1);
      const hip = [240, 1100], slump = ease(seg(t, 7.05, 7.5));
      // Worry, bigger now, squeezed in at the table between them
      const b = Math.sin(t * 4.5) * .02;
      worry(520, 1052, 118, t, { look: [-.9, .15], mood: said ? 'smug' : 'neutral', talk: said && t < 8.4, sx: 1 + b, sy: 1 - b, tilt: -ease(seg(t, 6.9, 7.3)) * .1, shadow: 0, bph: .9 });
      wLegsSit(hip, K.her);
      mirror(520, () => wLegsSit(hip, K.pal));
      cafeTable(t);
      const wave = said ? 0 : 1, g = Math.sin(t * 9);
      wUpper(hip, 30 - slump * 26, [[370, 1052], [lerp(388, 408 + g * 16, wave), lerp(1048, 960 + Math.cos(t * 9) * 14, wave)]], K.her, { headRot: -.06 * wave + slump * .2, headDy: slump * 10, bend1: wave ? .2 : 1 });
      mirror(520, () => { wUpper(hip, 26, [[372, 1050], [356, 990]], K.pal, { headRot: .04 + Math.sin(t * 2) * .02, bend1: .6 }); rect(338, 950, 44, 40, '#FFFDF6', 8); });
      motes(t, 12, '255,230,180', .45, 9);
      cx.restore();
      say(520, 660, 'you’re talking too much.', seg(t, 7.0, 7.35), [520, 800]);
      finish(.3, '25,30,25');
      card(t, 6.4, 8.96, ['he comes to brunch.']);
    } else if (t < 12.0) { // S4 3am: the presentation
      const k = (t - 9.0) / 3;
      cam(1.02 + .04 * ease(k), 560, 900);
      bedroom(t, 0);
      const rv = [seg(t, 9.5, 9.9), seg(t, 10.25, 10.65), seg(t, 11.0, 11.7)];
      flipchart(t, rv, [0, 0, 0]);
      bed(t, 0);
      const row = t < 10.2 ? 0 : t < 10.95 ? 1 : 2, tapT = [9.5, 10.25, 11.0][row], tap = Math.sin(seg(t, tapT - .15, tapT + .2) * Math.PI);
      const b = Math.sin(t * 5) * .025, tip = [CHART.x + CHART.w - 60 - tap * 26, CHART.rows[row][0] + 4 + tap * 4];
      const w = worry(826, FLOOR, 128, t, { look: [-.75, t % 1.5 < .9 ? -.55 : .5], mood: 'keen', talk: 1, tie: 1, sx: 1 + b, sy: 1 - b, tilt: -.05 - tap * .05, hands: { l: [-150 - tap * 12, -250 - row * -20] }, armC: '#77727F', shadow: .45 });
      line([w.hl, tip], 7, '#C9A27A'); ell(tip[0], tip[1], 7, 7, K.ember);
      glow(600, 760, 520, '255,205,140', .26);
      cx.restore();
      // tiny sleepless zzz-that-aren't: floating "?" from her
      finish(.42, '8,6,24');
      card(t, 9.0, 11.96, ['3am. he gives a little', 'presentation.']);
    } else if (t < 15.8) { // S5 the turn: she writes it all down
      const k = (t - 12.0) / 3.8, rT = 12.2 + .45 + 1.25, hit = seg(t, rT, rT + .5);
      cx.fillStyle = vgrad(0, H, [[0, '#262A4C'], [1, '#191B33']]); cx.fillRect(0, 0, W, H);
      for (let i = 0; i < 12; i++) for (let j = 0; j < 9; j++) ell(70 + i * 96 + (j % 2) * 48, 120 + j * 150, 5, 5, 'rgba(255,255,255,.03)');
      cam(1 + .03 * ease(k), 520, 820);
      // duvet hills
      cx.beginPath(); cx.moveTo(-40, 1300); cx.bezierCurveTo(200, 1180, 420, 1250, 620, 1300); cx.bezierCurveTo(800, 1340, 980, 1240, 1140, 1280); cx.lineTo(1140, 1960); cx.lineTo(-40, 1960); cx.closePath(); fillC('#7E5684');
      cx.beginPath(); cx.moveTo(-40, 1420); cx.bezierCurveTo(260, 1330, 520, 1440, 760, 1400); cx.bezierCurveTo(900, 1380, 1000, 1400, 1140, 1440); cx.lineTo(1140, 1960); cx.lineTo(-40, 1960); cx.closePath(); fillC('#8F6394');
      glow(520, 800, 800, '255,200,150', .22);
      // Worry peeks round the phone, reading over her shoulder; the reply rattles him
      const pk = backOut(seg(t, 12.5, 13.0)), sh = Math.sin(t * 40) * 3 * hit * (1 - seg(t, rT + .5, rT + 1.2));
      worry(lerp(280, 150, pk) + sh, 960 + hit * 26, 112 - hit * 14, t, { look: [.9, .1], mood: hit > 0 ? 'shock' : 'worried', shadow: 0, tilt: -.14, bph: .5 });
      // arms + thumbs
      for (const s of [-1, 1]) { const X = v => 520 + s * v; cap([X(470), 1560], [X(380), 1330], 120, K.her.jump); cap([X(380), 1330], [X(372), 1318], 126, K.her.jumpD); ell(X(352), 1238, 58, 84, K.her.skin, s * -.25); }
      phone(t, 12.2);
      for (const s of [-1, 1]) { const X = v => 520 + s * v, ty = s < 0 && t < rT ? Math.sin(t * 20) * 6 : 0; cap([X(352), 1222], [X(262), 1176 + ty], 46, K.her.skin); }
      cx.restore();
      finish(.42, '8,6,24');
      card(t, 12.0, 15.76, ['so she wrote down', 'everything he said.'], { y: 1432 });
    } else if (t < 17.6) { // S6a none of it is happening: crossed out, he deflates
      const k = (t - 15.8) / 1.8, dawn = .25 + .55 * ease(k);
      cam(1.04, 600, 950);
      bedroom(t, dawn);
      const cr = [easeOut(seg(t, 15.95, 16.2)), easeOut(seg(t, 16.3, 16.55)), easeOut(seg(t, 16.65, 17.05))];
      flipchart(t, [1, 1, 1], cr, dawn);
      bed(t, 1, dawn);
      const sk = ease(seg(t, 15.95, 17.2)), r = lerp(128, 46, sk), wob = Math.sin(t * 26) * .09 * Math.sin(sk * Math.PI);
      // puffs of air as he deflates
      for (let i = 0; i < 6; i++) { const pk = seg(t, 16.0 + i * .16, 16.5 + i * .16); if (pk > 0 && pk < 1) ell(826 + (i % 2 ? 1 : -1) * (r + 30 + pk * 70), FLOOR - r - 40 - pk * 90 - i * 12, 14 * (1 - pk) + 4, 14 * (1 - pk) + 4, `rgba(255,245,235,${.5 * (1 - pk)})`); }
      const drop = ease(seg(t, 16.0, 16.6));
      cx.save(); cx.translate(lerp(690, 700, drop), lerp(1040, FLOOR - 6, drop)); cx.rotate(lerp(-.9, -.04, drop)); rect(-150, -4, 200, 8, '#C9A27A', 4); ell(-150, 0, 7, 7, K.ember); cx.restore();
      worry(826, FLOOR, r, t, { look: [-.7, sk > .6 ? .3 : -.3], mood: sk < .35 ? 'shock' : 'sheepish', tie: 1, sx: 1 + wob, sy: 1 - wob, shadow: .4 });
      glow(600, 760, 520, '255,205,140', .2 * (1 - dawn));
      glow(250, 560, 900, '255,190,140', .22 * dawn);
      cx.restore();
      finish(.36, '20,10,26');
      card(t, 15.8, 17.56, ['none of it was happening.']);
    } else { // S6b morning: still around, pocket-sized
      const u = t - 17.6, scroll = 900 + u * 200;
      cam(1.6 + .05 * ease(u / 1.9), 560, FLOOR, -40, 0);
      street(scroll, t, { sky0: '#F9D2A2', sky1: '#FCE8C6', sunX: 250, sunY: 640 });
      const ph = t * 6.6, bobv = Math.abs(Math.sin(ph)) * -10;
      const pop = backOut(seg(u, .15, .6)), wv = Math.sin(t * 12) * 14;
      wWalk(560, FLOOR, ph, K.her, {
        near: [560 + 86, FLOOR - 236 + bobv - 150], bend1: 1.5,
        behind: sh => {
          const px = sh[0] - 6, py = sh[1] + 104;
          worry(px, py + 44 - pop * 22, 40, t, { mood: 'glad', look: [.5, -.3], shadow: 0, sy: 1 + Math.sin(ph * 2) * .05, hands: { r: [56, -66 + wv * .6], l: [-38, -22] }, tilt: Math.sin(ph) * .06 });
          cx.beginPath(); cx.roundRect(px - 48, py - 2, 96, 70, [6, 6, 28, 28]); fillC(K.her.jumpD); rect(px - 48, py - 2, 96, 12, '#B67A22', 5);
          cx.setLineDash([7, 7]); cx.strokeStyle = 'rgba(255,235,190,.6)'; cx.lineWidth = 3; cx.beginPath(); cx.roundRect(px - 39, py + 16, 78, 44, [3, 3, 22, 22]); cx.stroke(); cx.setLineDash([]);
        }
      });
      // her coffee
      const hx = 560 + 86, hy = FLOOR - 236 + bobv - 150; rect(hx - 6, hy - 54, 40, 60, '#FFFDF6', 6); rect(hx - 9, hy - 60, 46, 12, '#8A5A3C', 5); rect(hx - 6, hy - 34, 40, 20, '#D9643A'); ell(hx - 2, hy, 19, 19, K.her.skin);
      leaves(t, scroll);
      cx.restore();
      for (let i = 0; i < 3; i++) { const sp = (u * 1.2 + i * .33) % 1, a = Math.sin(sp * Math.PI); cx.save(); cx.translate(330 + i * 60 - (i % 2) * 150, 840 - sp * 80 - i * 40); cx.rotate(sp * 2); cx.globalAlpha = a * .9; poly([[0, -16], [4, -4], [16, 0], [4, 4], [0, 16], [-4, 4], [-16, 0], [-4, -4]], '#FFF6DA'); cx.restore(); }
      glow(300, 480, 1000, '255,230,170', .2);
      finish(.16);
      card(t, 17.6, 99, ['he’s still around.', 'just pocket-sized.'], { size: 72, hold: 1 });
    }
    cx.restore();
    for (const b of [3.4, 6.4, 9.0, 12.0, 15.8, 17.6]) { const d = 1 - Math.abs(t - b) / .11; if (d > 0) { cx.fillStyle = `rgba(28,18,24,${ease(d) * .9})`; cx.fillRect(0, 0, W, H); } }
  }
};
