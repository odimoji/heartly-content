// Zara, the lead of "30 days to the wedding". 2D-built with depth: every form is shaded from one key light
// (upper left, warm) with a rim light on the far side. Two style options for the character sheet:
//   "soft"    rounder, bigger head and eyes, blended painted shading
//   "graphic" taller and more adult, hard-edged two-tone shadow shapes, crisper rim
// drawZara(ctx, x, yFeet, H, style, expr, pose): H is her standing height in px.
(function (g) {
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, k) => { const A = hex(a), B = hex(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, "0")).join(""); };
  const lite = (c, k) => mix(c, "#fff1d6", k), dark = (c, k) => mix(c, "#1a0f0c", k);
  const C = { skin: "#a8694a", hair: "#2b1a17", cardi: "#d9a23a", tee: "#f1e6d2", trousers: "#33405a", shoe: "#efe4d2", band: "#c65a3a", gold: "#f0cc72", rim: "#ffb27a", white: "#fbf4e8", ink: "#1c1210" };
  g.ZC = C; g.zmix = mix; g.zlite = lite; g.zdark = dark;

  // one shaded form: base gradient from the key light, a shadow on the far-lower side, a rim on the far edge
  function form(ctx, path, base, box, o = {}) {
    const [x, y, w, h] = box, st = o.style || "soft", rimC = o.rim || C.rim;
    ctx.save();
    ctx.beginPath(); path(ctx);
    const gr = ctx.createLinearGradient(x, y, x + w, y + h);
    gr.addColorStop(0, lite(base, o.hi ?? 0.2)); gr.addColorStop(0.45, base); gr.addColorStop(1, dark(base, o.lo ?? 0.3));
    ctx.fillStyle = gr; ctx.fill(); ctx.clip();
    if (o.shadow !== false) {
      // shadow shape: the form itself, slid towards the light, cut out of a dark wash
      ctx.save();
      ctx.globalAlpha = st === "soft" ? 0.34 : 0.4;
      if (st === "soft") ctx.filter = `blur(${Math.max(2, w * 0.07)}px)`;
      ctx.fillStyle = dark(base, 0.62);
      ctx.beginPath(); ctx.rect(x - w, y - h, w * 3, h * 3);
      ctx.translate(-w * (o.sx ?? 0.2), -h * (o.sy ?? 0.1)); path(ctx);
      ctx.fill("evenodd");
      ctx.restore();
    }
    if (o.rimW !== 0) {
      const rg = ctx.createLinearGradient(x + w * 0.55, y, x + w, y);
      rg.addColorStop(0, "rgba(255,178,122,0)"); rg.addColorStop(1, rimC);
      ctx.strokeStyle = rg; ctx.lineWidth = (o.rimW ?? w * 0.07) * 2; ctx.globalAlpha = st === "soft" ? 0.75 : 0.95;
      if (st === "soft") ctx.filter = `blur(${Math.max(1, w * 0.012)}px)`;
      ctx.beginPath(); path(ctx); ctx.stroke();
    }
    ctx.restore();
  }
  g.zform = form;
  const ell = (cx, cy, rx, ry, rot = 0) => (c) => c.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), rot, 0, 6.2832);
  const capsule = (x1, y1, x2, y2, r) => (c) => {
    const a = Math.atan2(y2 - y1, x2 - x1);
    c.arc(x1, y1, r, a + Math.PI / 2, a - Math.PI / 2); c.arc(x2, y2, r, a - Math.PI / 2, a + Math.PI / 2); c.closePath();
  };
  const rrect = (x, y, w, h, r) => (c) => c.roundRect(x, y, w, h, r);

  // expressions: brows [inner lift, outer lift, height], eye openness, pupil offset and size, mouth kind
  const EX = {
    neutral:  { name: "neutral",        bi: 0,    bo: 0,    bh: 0,    open: 0.86, px: 0,    py: 0,    ps: 1,    mouth: "flat" },
    frozen:   { name: "frozen smile",   bi: 0.5,  bo: 0.5,  bh: 0.5,  open: 1.12, px: 0,    py: 0,    ps: 0.8,  mouth: "grin", sweat: true },
    dread:    { name: "dread",          bi: 1.0,  bo: -0.3, bh: 0.35, open: 1.15, px: 0,    py: 0.1,  ps: 0.62, mouth: "wobble", pale: true },
    caught:   { name: "caught out",     bi: 0.2,  bo: 0.6,  bh: 0.4,  open: 1.0,  px: 0.75, py: 0.05, ps: 0.85, mouth: "o", browL: 0.9 },
    plotting: { name: "plotting",       bi: -0.9, bo: 0.5,  bh: -0.25, open: 0.55, px: -0.5, py: 0,   ps: 1,    mouth: "smirk" },
    hiding:   { name: "hiding",         bi: 0.9,  bo: -0.2, bh: 0.1,  open: 0.7,  px: 0,    py: 0.35, ps: 0.9,  mouth: "none", cushion: true },
    raw:      { name: "raw",            bi: 0.8,  bo: -0.4, bh: -0.05, open: 0.6, px: -0.15, py: 0.45, ps: 1.05, mouth: "down", wet: true },
    smile:    { name: "small real smile", bi: 0.15, bo: 0.1, bh: 0.1, open: 0.72, px: 0,    py: 0.05, ps: 1.05, mouth: "smile", blush: 1.5, happy: true },
  };
  g.ZEXPR = EX;

  const SHAPE = {
    soft:    { head: [0, -0.795], hr: [0.150, 0.158], neckW: 0.05, shY: -0.632, shW: 0.118, waistW: 0.105, hipY: -0.385, hipW: 0.118, armL: 0.25, armR: 0.043, legR: 0.05, legGap: 0.058, eyeDx: 0.064, eyeY: 0.022, eyeR: [0.034, 0.044], browW: 0.05, mouthY: 0.092, hairR: 0.062, foot: [0.07, 0.03], shin: 0.2 },
    graphic: { head: [0, -0.868], hr: [0.092, 0.108], neckW: 0.034, shY: -0.752, shW: 0.105, waistW: 0.078, hipY: -0.5, hipW: 0.096, armL: 0.3, armR: 0.03, legR: 0.038, legGap: 0.046, eyeDx: 0.04, eyeY: 0.012, eyeR: [0.025, 0.024], browW: 0.04, mouthY: 0.062, hairR: 0.04, foot: [0.058, 0.022], shin: 0.27 },
  };

  // when she sits, her feet are this far (as a share of H) above the yFeet you pass: add it to keep them on the floor
  g.zSitLift = (style) => -(SHAPE[style].hipY + 0.09 + SHAPE[style].shin);
  g.drawZara = function (ctx, x, yFeet, H, style = "soft", expr = "neutral", pose = {}) {
    const S = SHAPE[style], E = EX[expr] || EX.neutral, o = { style };
    const u = (v) => v * H;
    const lw = (v) => Math.max(1, u(v));
    ctx.save(); ctx.translate(x, yFeet); ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (pose.lean) ctx.rotate(pose.lean);
    const sit = !!pose.sit, drop = sit ? u(0.0) : 0;
    const hx = u(S.head[0]) + u(pose.headX || 0), hy = u(S.head[1]), rx = u(S.hr[0]), ry = u(S.hr[1]);
    const shY = u(S.shY), hipY = u(S.hipY), shW = u(S.shW), hipW = u(S.hipW);
    const tilt = pose.tilt || 0;

    // ---- hair behind the head: a big curly puff
    const curls = (front) => {
      const n = 13, R = u(S.hairR);
      for (let i = 0; i < n; i++) {
        const a = Math.PI * (1.02 + (i / (n - 1)) * 0.96), k = 1.02 + 0.07 * Math.sin(i * 2.3);
        const cx = hx + Math.cos(a) * rx * k * (front ? 0.86 : 1.08), cy = hy + Math.sin(a) * ry * k * (front ? 0.9 : 1.1) - (front ? 0 : ry * 0.06);
        const r = R * (front ? 0.78 : 1.25) * (1 + 0.16 * Math.sin(i * 1.7 + 1));
        form(ctx, ell(cx, cy, r, r), C.hair, [cx - r, cy - r, r * 2, r * 2], { ...o, hi: 0.12, lo: 0.2, rimW: r * 0.16, shadow: front });
      }
    };
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(tilt); ctx.translate(-hx, -hy);
    curls(false);
    // the puff on top, held by the band
    [[0, -1.52, 1.0], [-0.52, -1.36, 0.82], [0.52, -1.36, 0.82], [-0.2, -1.84, 0.74], [0.26, -1.82, 0.72], [0, -1.2, 0.9]].forEach(([dx, dy, s], i) => {
      const cx = hx + dx * rx, cy = hy + dy * ry, r = rx * 0.46 * s;
      form(ctx, ell(cx, cy, r, r), C.hair, [cx - r, cy - r, r * 2, r * 2], { ...o, hi: 0.14, lo: 0.2, rimW: r * 0.14, shadow: i % 2 === 0 });
    });
    ctx.restore();

    // ---- legs
    const legTop = hipY - u(0.02);
    [-1, 1].forEach((s) => {
      const lx = s * u(S.legGap);
      if (sit) {
        const kx = lx + s * u(0.014), ky = hipY + u(0.09), fy = ky + u(S.shin);
        form(ctx, capsule(kx, ky, kx, fy - u(0.045), u(S.legR) * 0.92), C.trousers, [kx - u(0.05), ky, u(0.1), u(S.shin)], { ...o, rimW: u(0.008) });
        form(ctx, ell(lx + s * u(0.006), hipY + u(0.05), u(S.legR) * 1.45, u(0.07)), C.trousers, [lx - u(0.08), hipY - u(0.03), u(0.16), u(0.15)], { ...o, rimW: u(0.008), hi: 0.3 });
      } else {
        const sw = s * (pose.stance ?? 0.012);
        form(ctx, capsule(lx, legTop, lx + u(sw), -u(0.05), u(S.legR)), C.trousers, [lx - u(0.06), legTop, u(0.12), -legTop], { ...o, rimW: u(0.008) });
      }
      const fx = lx + (sit ? s * u(0.014) : u(s * (pose.stance ?? 0.012))) + s * u(0.012), fy0 = sit ? hipY + u(0.09) + u(S.shin) : 0;
      form(ctx, ell(fx, fy0 - u(S.foot[1]) * 0.9, u(S.foot[0]) * 0.62, u(S.foot[1])), C.shoe, [fx - u(0.05), fy0 - u(0.06), u(0.1), u(0.06)], { ...o, rimW: u(0.006), lo: 0.4 });
    });

    // ---- torso: cream tee, then the mustard cardigan open over it
    const torso = (inset) => (c) => {
      const a = shW - inset, b = u(S.waistW) - inset * 0.6, h = hipW - inset * 0.4;
      c.moveTo(-a, shY + u(0.012)); c.quadraticCurveTo(0, shY - u(0.03), a, shY + u(0.012));
      c.bezierCurveTo(a + u(0.012), shY + u(0.1), b, (shY + hipY) / 2, h, hipY + u(0.02));
      c.quadraticCurveTo(0, hipY + u(0.055), -h, hipY + u(0.02));
      c.bezierCurveTo(-b, (shY + hipY) / 2, -a - u(0.012), shY + u(0.1), -a, shY + u(0.012)); c.closePath();
    };
    const tb = [-shW - u(0.02), shY - u(0.03), (shW + u(0.02)) * 2, hipY - shY + u(0.09)];
    form(ctx, torso(u(0.012)), C.tee, tb, { ...o, lo: 0.34 });
    // neck
    form(ctx, rrect(-u(S.neckW) / 2, hy + ry * 0.7, u(S.neckW), shY - hy - ry * 0.55, u(0.012)), C.skin, [-u(S.neckW), hy + ry * 0.7, u(S.neckW) * 2, shY - hy], { ...o, rimW: 0, sx: 0.02, sy: -0.35 });
    // cardigan halves
    [-1, 1].forEach((s) => {
      const half = (c) => {
        const a = shW + u(0.006), h = hipW + u(0.014), open = u(S.neckW) * 0.62;
        c.moveTo(s * open, shY - u(0.012)); c.quadraticCurveTo(s * a * 0.7, shY - u(0.03), s * a, shY + u(0.014));
        c.bezierCurveTo(s * (a + u(0.016)), shY + u(0.12), s * (u(S.waistW) + u(0.012)), (shY + hipY) / 2, s * h, hipY + u(0.05));
        c.lineTo(s * u(0.018), hipY + u(0.062)); c.quadraticCurveTo(s * u(0.05), (shY + hipY) / 2, s * open, shY - u(0.012)); c.closePath();
      };
      form(ctx, half, C.cardi, tb, { ...o, lo: 0.36, rimW: s > 0 ? u(0.012) : 0 });
      // knit texture: fine ribs clipped to the half
      ctx.save(); ctx.beginPath(); half(ctx); ctx.clip(); ctx.globalAlpha = 0.13; ctx.strokeStyle = dark(C.cardi, 0.7); ctx.lineWidth = lw(0.0022);
      for (let i = -30; i < 30; i++) { ctx.beginPath(); ctx.moveTo(i * u(0.011), shY - u(0.05)); ctx.lineTo(i * u(0.011) + u(0.02), hipY + u(0.08)); ctx.stroke(); }
      ctx.restore();
    });
    // buttons: three gold, one odd red one
    [0.2, 0.42, 0.64, 0.86].forEach((k, i) => {
      const by = shY + (hipY - shY) * k + u(0.03), bx = u(0.034) + u(0.006) * k;
      form(ctx, ell(bx, by, u(0.0085), u(0.0085)), i === 2 ? C.band : C.gold, [bx - u(0.01), by - u(0.01), u(0.02), u(0.02)], { ...o, rimW: 0 });
    });

    // ---- arms: [angle from straight down (rad, + is outward), bend]
    const arm = (s, ang, bend, hold) => {
      const sx = s * (shW - u(0.004)), sy = shY + u(0.03), L = u(S.armL) / 2, r = u(S.armR);
      const a1 = Math.PI / 2 - s * ang, ex = sx + Math.cos(a1) * L, ey = sy + Math.sin(a1) * L;
      const a2 = a1 - s * bend, wx = ex + Math.cos(a2) * L, wy = ey + Math.sin(a2) * L;
      const bb = [Math.min(sx, wx) - r * 2, Math.min(sy, wy) - r * 2, Math.abs(wx - sx) + r * 4, Math.abs(wy - sy) + r * 4];
      form(ctx, capsule(sx, sy, ex, ey, r * 1.12), C.cardi, bb, { ...o, lo: 0.36, rimW: s > 0 ? r * 0.3 : 0 });
      form(ctx, capsule(ex, ey, wx, wy, r), C.cardi, bb, { ...o, lo: 0.36, rimW: s > 0 ? r * 0.3 : 0 });
      form(ctx, ell(wx + Math.cos(a2) * r * 0.9, wy + Math.sin(a2) * r * 0.9, r * 1.05, r * 1.05), C.skin, [wx - r * 1.5, wy - r * 1.5, r * 3.4, r * 3.4], { ...o, rimW: s > 0 ? r * 0.25 : 0 });
      return [wx + Math.cos(a2) * r, wy + Math.sin(a2) * r];
    };
    const aL = pose.armL || [0.14, 0.1], aR = pose.armR || [0.14, 0.1];
    const handR = arm(1, aR[0], aR[1]);
    const handL = arm(-1, aL[0], aL[1]);

    // ---- head
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(tilt); ctx.translate(-hx, -hy);
    // ears and hoops
    [-1, 1].forEach((s) => {
      const ex = hx + s * rx * 0.98, ey = hy + ry * 0.14, er = rx * 0.17;
      form(ctx, ell(ex, ey, er, er * 1.25), C.skin, [ex - er, ey - er, er * 2, er * 2.5], { ...o, rimW: 0 });
      ctx.strokeStyle = C.gold; ctx.lineWidth = lw(0.0075); ctx.beginPath(); ctx.arc(ex + s * er * 0.2, ey + er * 2.3, rx * 0.2, 0, 6.2832); ctx.stroke();
      ctx.strokeStyle = "rgba(255,250,225,.8)"; ctx.lineWidth = lw(0.0025); ctx.beginPath(); ctx.arc(ex + s * er * 0.2, ey + er * 2.3, rx * 0.2, 3.6, 4.6); ctx.stroke();
    });
    const face = style === "soft"
      ? ell(hx, hy, rx, ry)
      : (c) => { c.moveTo(hx - rx, hy - ry * 0.2); c.bezierCurveTo(hx - rx, hy - ry * 1.15, hx + rx, hy - ry * 1.15, hx + rx, hy - ry * 0.2); c.bezierCurveTo(hx + rx, hy + ry * 0.55, hx + rx * 0.45, hy + ry * 1.04, hx, hy + ry * 1.04); c.bezierCurveTo(hx - rx * 0.45, hy + ry * 1.04, hx - rx, hy + ry * 0.55, hx - rx, hy - ry * 0.2); c.closePath(); };
    form(ctx, face, E.pale ? mix(C.skin, "#8f8a9a", 0.16) : C.skin, [hx - rx, hy - ry, rx * 2, ry * 2], { ...o, hi: 0.24, lo: 0.26, rimW: rx * 0.1, sx: style === "soft" ? 0.2 : 0.1, sy: 0.05 });
    if (pose.glow) { // phone light from below
      ctx.save(); ctx.beginPath(); face(ctx); ctx.clip(); const gg = ctx.createRadialGradient(hx, hy + ry * 1.5, 0, hx, hy + ry * 1.5, ry * 2.2);
      gg.addColorStop(0, `rgba(190,215,255,${0.55 * pose.glow})`); gg.addColorStop(1, "rgba(190,215,255,0)"); ctx.fillStyle = gg; ctx.globalCompositeOperation = "screen"; ctx.fillRect(hx - rx, hy - ry, rx * 2, ry * 2); ctx.restore();
    }
    // blush
    [-1, 1].forEach((s) => { ctx.save(); ctx.globalAlpha = 0.3 * (E.blush || 1); ctx.filter = `blur(${rx * 0.06}px)`; ctx.fillStyle = "#e2674c"; ctx.beginPath(); ctx.ellipse(hx + s * rx * 0.6, hy + ry * 0.42, rx * 0.2, ry * 0.12, 0, 0, 6.2832); ctx.fill(); ctx.restore(); });

    // eyes
    const ey = hy + u(S.eyeY), erx = u(S.eyeR[0]), ery = u(S.eyeR[1]) * Math.min(1.15, E.open);
    [-1, 1].forEach((s) => {
      const ex = hx + s * u(S.eyeDx);
      ctx.save();
      const shape = (c) => { if (style === "soft") c.ellipse(ex, ey, erx, ery, 0, 0, 6.2832); else { c.moveTo(ex - erx * 1.25, ey + ery * 0.15); c.quadraticCurveTo(ex, ey - ery * 1.5, ex + erx * 1.25, ey + ery * 0.15); c.quadraticCurveTo(ex, ey + ery * 1.2, ex - erx * 1.25, ey + ery * 0.15); c.closePath(); } };
      if (E.happy && style === "soft") { ctx.strokeStyle = C.ink; ctx.lineWidth = lw(0.011); ctx.beginPath(); ctx.arc(ex, ey + ery * 0.5, erx * 0.95, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke(); ctx.restore(); return; }
      ctx.beginPath(); shape(ctx); ctx.fillStyle = C.white; ctx.fill(); ctx.clip();
      const ir = erx * (style === "soft" ? 0.9 : 0.86) * E.ps, ix = ex + E.px * erx * 0.4, iy = ey + E.py * ery * 0.5;
      ctx.fillStyle = "#3a2218"; ctx.beginPath(); ctx.arc(ix, iy, ir, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#120a08"; ctx.beginPath(); ctx.arc(ix, iy, ir * 0.58, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ix - ir * 0.36, iy - ir * 0.4, ir * 0.3, 0, 6.2832); ctx.fill();
      if (E.wet) { ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.beginPath(); ctx.ellipse(ix + ir * 0.3, iy + ir * 0.55, ir * 0.42, ir * 0.2, 0, 0, 6.2832); ctx.fill(); }
      // upper lid shadow
      ctx.fillStyle = "rgba(60,25,15,.28)"; ctx.fillRect(ex - erx * 1.4, ey - ery * 1.6, erx * 2.8, ery * 0.85);
      ctx.restore();
      // lash line
      ctx.strokeStyle = C.ink; ctx.lineWidth = lw(style === "soft" ? 0.0085 : 0.0065);
      ctx.beginPath(); if (style === "soft") ctx.ellipse(ex, ey, erx, ery, 0, Math.PI * 1.05, Math.PI * 1.95); else { ctx.moveTo(ex - erx * 1.25, ey + ery * 0.15); ctx.quadraticCurveTo(ex, ey - ery * 1.5, ex + erx * 1.25, ey + ery * 0.15); }
      ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ex + s * erx * 0.95, ey - ery * 0.35); ctx.lineTo(ex + s * erx * 1.3, ey - ery * 0.7); ctx.stroke();
      if (E.wet) { ctx.strokeStyle = "rgba(200,225,255,.85)"; ctx.lineWidth = lw(0.004); ctx.beginPath(); ctx.arc(ex, ey + ery * 0.25, erx * 0.8, 0.5, 2.6); ctx.stroke(); }
      // brow
      const bw = u(S.browW), by = ey - ery - u(0.02) - u(0.014) * (E.bh + (s < 0 && E.browL ? E.browL : 0));
      ctx.strokeStyle = C.hair; ctx.lineWidth = lw(style === "soft" ? 0.0125 : 0.0095);
      ctx.beginPath(); ctx.moveTo(ex - s * bw * 0.55, by - u(0.011) * E.bi); ctx.quadraticCurveTo(ex, by - u(0.008), ex + s * bw * 0.6, by - u(0.011) * E.bo + u(0.004)); ctx.stroke();
    });
    // nose
    ctx.strokeStyle = dark(C.skin, 0.4); ctx.lineWidth = lw(0.005); ctx.beginPath(); ctx.arc(hx, hy + ry * 0.36, rx * 0.085, 0.25, Math.PI - 0.25); ctx.stroke();
    // mouth
    const my = hy + u(S.mouthY), mw = rx * 0.3; ctx.strokeStyle = "#5a2418"; ctx.fillStyle = "#5a2418"; ctx.lineWidth = lw(0.0085);
    ctx.beginPath();
    if (E.mouth === "flat") { ctx.moveTo(hx - mw * 0.6, my); ctx.quadraticCurveTo(hx, my + u(0.003), hx + mw * 0.6, my); ctx.stroke(); }
    else if (E.mouth === "smile") { ctx.moveTo(hx - mw * 0.75, my - u(0.004)); ctx.quadraticCurveTo(hx, my + u(0.02), hx + mw * 0.75, my - u(0.004)); ctx.stroke(); }
    else if (E.mouth === "down") { ctx.moveTo(hx - mw * 0.55, my + u(0.006)); ctx.quadraticCurveTo(hx, my - u(0.008), hx + mw * 0.55, my + u(0.006)); ctx.stroke(); }
    else if (E.mouth === "smirk") { ctx.moveTo(hx - mw * 0.6, my + u(0.003)); ctx.quadraticCurveTo(hx + mw * 0.2, my + u(0.01), hx + mw * 0.8, my - u(0.012)); ctx.stroke(); }
    else if (E.mouth === "o") { ctx.ellipse(hx + mw * 0.1, my + u(0.003), mw * 0.26, mw * 0.32, 0, 0, 6.2832); ctx.fill(); }
    else if (E.mouth === "wobble") { ctx.moveTo(hx - mw * 0.6, my + u(0.004)); ctx.bezierCurveTo(hx - mw * 0.3, my - u(0.01), hx - mw * 0.1, my + u(0.012), hx + mw * 0.15, my); ctx.bezierCurveTo(hx + mw * 0.3, my - u(0.008), hx + mw * 0.5, my + u(0.008), hx + mw * 0.62, my + u(0.002)); ctx.stroke(); }
    else if (E.mouth === "grin") { ctx.roundRect(hx - mw, my - u(0.012), mw * 2, u(0.032), u(0.014)); ctx.fill(); ctx.fillStyle = C.white; ctx.beginPath(); ctx.roundRect(hx - mw * 0.86, my - u(0.008), mw * 1.72, u(0.015), u(0.004)); ctx.fill(); ctx.strokeStyle = "rgba(90,36,24,.5)"; ctx.lineWidth = lw(0.002); for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(hx + i * mw * 0.3, my - u(0.008)); ctx.lineTo(hx + i * mw * 0.3, my + u(0.007)); ctx.stroke(); } }
    if (E.sweat) { const sx = hx + rx * 0.78, sy = hy - ry * 0.5; ctx.fillStyle = "rgba(190,225,255,.92)"; ctx.beginPath(); ctx.moveTo(sx, sy - u(0.022)); ctx.quadraticCurveTo(sx + u(0.014), sy + u(0.004), sx, sy + u(0.012)); ctx.quadraticCurveTo(sx - u(0.014), sy + u(0.004), sx, sy - u(0.022)); ctx.fill(); }

    // hairline curls over the forehead, and the band
    curls(true);
    ctx.save(); ctx.beginPath(); ctx.ellipse(hx, hy - ry * 0.08, rx * 1.1, ry * 1.12, 0, Math.PI * 1.13, Math.PI * 1.87); ctx.ellipse(hx, hy + ry * 0.2, rx * 1.16, ry * 1.2, 0, Math.PI * 1.84, Math.PI * 1.16, true); ctx.closePath();
    const bg = ctx.createLinearGradient(hx - rx, 0, hx + rx, 0); bg.addColorStop(0, lite(C.band, 0.2)); bg.addColorStop(1, dark(C.band, 0.3)); ctx.fillStyle = bg; ctx.fill(); ctx.restore();
    ctx.restore(); // head tilt

    // ---- things in front of her
    if (E.cushion || pose.cushion) {
      const cw = rx * 2.9, ch = ry * 1.5, cy = hy + ry * 0.2;
      form(ctx, rrect(hx - cw / 2, cy, cw, ch, ch * 0.3), "#e9d8bd", [hx - cw / 2, cy, cw, ch], { ...o, lo: 0.34, rimW: u(0.01) });
      [-1, 1].forEach((s) => form(ctx, ell(hx + s * cw * 0.36, cy + ch * 0.5, rx * 0.3, rx * 0.3), C.skin, [hx + s * cw * 0.36 - rx * 0.3, cy + ch * 0.2, rx * 0.6, rx * 0.6], { ...o, rimW: 0 }));
    }
    if (pose.phone) {
      const [px, py] = pose.phone === "L" ? handL : handR, pw = u(0.052), ph = u(0.1);
      ctx.save(); ctx.translate(px, py - ph * 0.3); ctx.rotate(pose.phone === "L" ? 0.18 : -0.18);
      form(ctx, rrect(-pw / 2, -ph / 2, pw, ph, pw * 0.2), "#221815", [-pw / 2, -ph / 2, pw, ph], { ...o, rimW: 0, shadow: false });
      ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = "screen"; const pg = ctx.createRadialGradient(px, py - ph * 0.5, 0, px, py - ph * 0.5, u(0.2)); pg.addColorStop(0, "rgba(170,200,255,.5)"); pg.addColorStop(1, "rgba(170,200,255,0)"); ctx.fillStyle = pg; ctx.fillRect(px - u(0.2), py - ph * 0.5 - u(0.2), u(0.4), u(0.4)); ctx.restore();
    }
    ctx.restore();
  };
})(globalThis);
