// Zara, the lead of "30 days to the wedding" (look B, Odi's pick, restyled 16 Nov).
// By day: long bone-straight hair, tailored cream blazer, gold jewellery, completely put together.
// At 1am: old t-shirt, hair tied up. That contrast is the comedy. Glamorous, never sexualised.
// Every form is shaded from one key light (upper left) with a warm rim on the far side.
// drawZara(ctx, x, yFeet, H, expr, pose): H is her standing height in px. pose.look: "day" | "night" | "dress".
(function (g) {
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, k) => { const A = hex(a), B = hex(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, "0")).join(""); };
  const lite = (c, k) => mix(c, "#fff1d6", k), dark = (c, k) => mix(c, "#1a0f0c", k);
  const C = { skin: "#b0714f", hair: "#1d1210", blazer: "#efe2cc", top: "#1f1614", trousers: "#2a1f1d", heel: "#c0452f", tee: "#d8ccbc", pj: "#cdbfad", dress: "#c0392b", gold: "#f0cc72", lip: "#a43a40", rim: "#ffb27a", white: "#fbf4e8", ink: "#1c1210" };
  g.ZC = C; g.zmix = mix; g.zlite = lite; g.zdark = dark;

  function form(ctx, path, base, box, o = {}) {
    const [x, y, w, h] = box;
    ctx.save(); ctx.beginPath(); path(ctx);
    const gr = ctx.createLinearGradient(x, y, x + w, y + h);
    gr.addColorStop(0, lite(base, o.hi ?? 0.2)); gr.addColorStop(0.45, base); gr.addColorStop(1, dark(base, o.lo ?? 0.3));
    ctx.fillStyle = gr; ctx.fill(); ctx.clip();
    if (o.shadow !== false) {
      ctx.save(); ctx.globalAlpha = 0.34; ctx.filter = `blur(${Math.max(1.5, w * 0.035)}px)`; ctx.fillStyle = dark(base, 0.62);
      ctx.beginPath(); ctx.rect(x - w, y - h, w * 3, h * 3); ctx.translate(-w * (o.sx ?? 0.16), -h * (o.sy ?? 0.08)); path(ctx); ctx.fill("evenodd"); ctx.restore();
    }
    if (o.rimW !== 0) {
      const rg = ctx.createLinearGradient(x + w * 0.55, y, x + w, y); rg.addColorStop(0, "rgba(255,178,122,0)"); rg.addColorStop(1, o.rim || C.rim);
      ctx.strokeStyle = rg; ctx.lineWidth = (o.rimW ?? w * 0.07) * 2; ctx.globalAlpha = 0.9; ctx.beginPath(); path(ctx); ctx.stroke();
    }
    ctx.restore();
  }
  g.zform = form;
  const ell = (cx, cy, rx, ry, rot = 0) => (c) => c.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), rot, 0, 6.2832);
  const capsule = (x1, y1, x2, y2, r) => (c) => { const a = Math.atan2(y2 - y1, x2 - x1); c.arc(x1, y1, r, a + Math.PI / 2, a - Math.PI / 2); c.arc(x2, y2, r, a - Math.PI / 2, a + Math.PI / 2); c.closePath(); };

  // brows: inner lift, outer lift, height. eyes: openness, pupil offset. mouth kind.
  const EX = {
    neutral:  { name: "composed",         bi: 0,    bo: 0.1,  bh: 0,    open: 0.9,  px: 0,    py: 0,    mouth: "soft" },
    frozen:   { name: "too-bright smile", bi: 0.5,  bo: 0.7,  bh: 1.0,  open: 1.2,  px: 0,    py: 0,    mouth: "bright", sweat: true },
    slip:     { name: "the smile slips",  bi: 1.2,  bo: -0.3, bh: 0.35, open: 1.0,  px: 0.6,  py: 0.35, mouth: "slip" },
    dread:    { name: "dread",            bi: 1.1,  bo: -0.3, bh: 0.5,  open: 1.25, px: 0,    py: 0.1,  mouth: "wobble", pale: true },
    caught:   { name: "caught out",       bi: 0.4,  bo: 0.5,  bh: 0.6,  open: 1.1,  px: 0.7,  py: 0.05, mouth: "o" },
    plotting: { name: "plotting",         bi: -0.8, bo: 0.5,  bh: -0.2, open: 0.62, px: -0.5, py: 0,    mouth: "smirk" },
    hiding:   { name: "hiding",           bi: 0.9,  bo: -0.2, bh: 0.2,  open: 0.8,  px: 0,    py: 0.3,  mouth: "none", cushion: true },
    raw:      { name: "raw",              bi: 1.0,  bo: -0.4, bh: 0.15, open: 0.85, px: -0.15, py: 0.4, mouth: "down", wet: true },
    smile:    { name: "small real smile", bi: 0.15, bo: 0.1,  bh: 0.1,  open: 0.8,  px: 0,    py: 0.05, mouth: "smile", blush: 1.4 },
  };
  g.ZEXPR = EX;
  const S = { head: [0, -0.89], hr: [0.09, 0.106], neckW: 0.03, shY: -0.752, shW: 0.108, waistW: 0.074, hipY: -0.5, hipW: 0.092, armL: 0.3, armR: 0.027, legR: 0.036, legGap: 0.044, eyeDx: 0.04, eyeY: 0.01, eyeR: [0.027, 0.025], browW: 0.042, mouthY: 0.062, shin: 0.2 };
  g.zSitLift = () => -(S.hipY + 0.09 + S.shin);

  // pose.pal swaps colours for the length of one drawing (other people are built on the same figure); pose.hair: "long" | "low" | "buns"
  g.drawZara = function (ctx, x, yFeet, H, expr = "neutral", pose = {}) { const keep = Object.assign({}, C); if (pose.pal) Object.assign(C, pose.pal); try { draw0(ctx, x, yFeet, H, expr, pose); } finally { Object.assign(C, keep); } };
  function draw0(ctx, x, yFeet, H, expr, pose) {
    const E = EX[expr] || EX.neutral, look = pose.look || "day", night = look === "night", dress = look === "dress", hair = pose.hair || (night ? "low" : "long"), up = hair !== "long";
    const u = (v) => v * H, lw = (v) => Math.max(1, u(v));
    ctx.save(); ctx.translate(x, yFeet); ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (pose.lean) ctx.rotate(pose.lean);
    const sit = !!pose.sit, hx = 0, hy = u(S.head[1]), rx = u(S.hr[0]), ry = u(S.hr[1]);
    const shY = u(S.shY), hipY = u(S.hipY), shW = u(S.shW) * 1.04, hipW = u(S.hipW), tilt = pose.tilt || 0;
    const jacket = dress ? C.dress : night ? C.tee : C.blazer, legC = night ? C.pj : C.trousers;
    const headRot = (fn) => { ctx.save(); ctx.translate(hx, hy); ctx.rotate(tilt); ctx.translate(-hx, -hy); fn(); ctx.restore(); };

    // ---- hair behind her: long and bone-straight by day, tied up at night
    headRot(() => {
      if (!up) {
        const hl = (c) => { c.moveTo(-rx * 1.16, hy - ry * 0.3); c.bezierCurveTo(-rx * 1.2, hy - ry * 1.3, rx * 1.2, hy - ry * 1.3, rx * 1.16, hy - ry * 0.3); c.lineTo(rx * 1.5, shY + u(0.2)); c.quadraticCurveTo(0, shY + u(0.235), -rx * 1.5, shY + u(0.2)); c.closePath(); };
        form(ctx, hl, C.hair, [-rx * 1.5, hy - ry * 1.2, rx * 3, u(0.42)], { hi: 0.16, lo: 0.1, rimW: rx * 0.07, sx: 0.05, sy: 0 });
      } else {
        form(ctx, ell(hx, hy - ry * 0.12, rx * 1.12, ry * 1.1), C.hair, [-rx * 1.12, hy - ry * 1.2, rx * 2.24, ry * 2.2], { hi: 0.14, lo: 0.1, rimW: rx * 0.07 });
        if (hair === "low") { // one loose bun low at the nape, a few strands out
          form(ctx, ell(hx + rx * 0.82, hy + ry * 0.98, rx * 0.56, ry * 0.44), C.hair, [hx + rx * 0.26, hy + ry * 0.54, rx * 1.12, ry * 0.88], { hi: 0.2, lo: 0.1, rimW: rx * 0.04 });
          form(ctx, ell(hx + rx * 1.06, hy + ry * 0.78, rx * 0.3, ry * 0.26), C.hair, [hx + rx * 0.76, hy + ry * 0.52, rx * 0.6, ry * 0.52], { hi: 0.2, lo: 0.1, rimW: rx * 0.03 });
          ctx.strokeStyle = C.hair; ctx.lineWidth = lw(0.005); [[1.25, 0.72, 1.46, 0.6], [1.28, 1.12, 1.44, 1.3]].forEach(([a, b2, c, d]) => { ctx.beginPath(); ctx.moveTo(hx + a * rx, hy + b2 * ry); ctx.quadraticCurveTo(hx + (a + c) / 2 * rx + rx * 0.1, hy + (b2 + d) / 2 * ry - ry * 0.06, hx + c * rx, hy + d * ry); ctx.stroke(); });
        } else {
        [[0.05, -1.42, 0.62, 0.46], [-0.4, -1.3, 0.4, 0.34], [0.5, -1.28, 0.4, 0.32]].forEach(([dx, dy, a, b2]) => form(ctx, ell(hx + dx * rx, hy + dy * ry, rx * a, ry * b2), C.hair, [hx + (dx - a) * rx, hy + (dy - b2) * ry, rx * a * 2, ry * b2 * 2], { hi: 0.18, lo: 0.1, rimW: rx * 0.05 }));
        ctx.strokeStyle = C.hair; ctx.lineWidth = lw(0.006); [[-0.5, -1.6, -0.9, -1.9], [0.6, -1.6, 1.0, -1.8], [0.15, -1.8, 0.3, -2.1]].forEach(([a, b2, c, d]) => { ctx.beginPath(); ctx.moveTo(hx + a * rx, hy + b2 * ry); ctx.quadraticCurveTo(hx + (a + c) / 2 * rx + rx * 0.2, hy + (b2 + d) / 2 * ry, hx + c * rx, hy + d * ry); ctx.stroke(); });
        form(ctx, (c) => c.roundRect(hx - rx * 0.34, hy - ry * 1.22, rx * 0.68, ry * 0.2, ry * 0.06), "#8a5a34", [hx - rx * 0.34, hy - ry * 1.22, rx * 0.68, ry * 0.2], { rimW: 0 }); // the claw clip
        }
      }
    });

    // ---- legs, shoes
    [-1, 1].forEach((s) => {
      const lx = s * u(S.legGap) + (pose.stride ? s * u(0.03) : 0), swing = pose.stride ? -s * 0.22 : 0;
      const skinLeg = dress, col = skinLeg ? C.skin : legC;
      let fx, fy;
      if (sit) { // legs crossed: one shin straight down, the other swung across it
        const kx = lx + s * u(0.012), ky = hipY + u(0.085), top = s > 0;
        fx = top ? kx - u(0.12) : kx + u(0.01); fy = top ? ky + u(S.shin) * 0.82 : ky + u(S.shin);
        form(ctx, capsule(top ? kx - u(0.02) : kx, ky, fx, fy - u(0.04), u(S.legR) * 0.92), col, [Math.min(kx, fx) - u(0.05), ky, Math.abs(kx - fx) + u(0.1), u(S.shin)], { rimW: u(0.007) });
        form(ctx, ell(lx + (top ? -u(0.03) : 0), hipY + u(0.05), u(S.legR) * (top ? 2.0 : 1.4), u(0.062)), col, [lx - u(0.1), hipY - u(0.03), u(0.2), u(0.15)], { rimW: u(0.007), hi: 0.3 });
      } else {
        fx = lx + Math.sin(swing) * u(0.5); fy = -u(0.002) - (pose.stride && s > 0 ? u(0.02) : 0);
        form(ctx, capsule(lx, hipY - u(0.01), fx, fy - u(0.05), u(S.legR) * (skinLeg ? 0.82 : 1)), col, [Math.min(lx, fx) - u(0.05), hipY, Math.abs(fx - lx) + u(0.1), -hipY], { rimW: u(0.007) });
      }
      if (night) form(ctx, ell(fx + s * u(0.008), fy - u(0.02), u(0.034), u(0.022)), "#e9dcc6", [fx - u(0.04), fy - u(0.045), u(0.08), u(0.05)], { rimW: u(0.004) });
      else { // heels
        form(ctx, (c) => { c.moveTo(fx - u(0.026), fy - u(0.05)); c.quadraticCurveTo(fx + s * u(0.012), fy - u(0.066), fx + u(0.03), fy - u(0.04)); c.lineTo(fx + u(0.036), fy - u(0.004)); c.lineTo(fx - u(0.012), fy - u(0.004)); c.closePath(); }, C.heel, [fx - u(0.03), fy - u(0.066), u(0.07), u(0.066)], { rimW: u(0.004) });
        ctx.strokeStyle = dark(C.heel, 0.3); ctx.lineWidth = lw(0.006); ctx.beginPath(); ctx.moveTo(fx - u(0.022), fy - u(0.04)); ctx.lineTo(fx - u(0.026), fy); ctx.stroke();
      }
    });

    // ---- torso
    const torso = (wS, wW, wH, top = shY, bot = hipY + u(0.03)) => (c) => {
      c.moveTo(-wS, top + u(0.014)); c.quadraticCurveTo(0, top - u(0.022), wS, top + u(0.014));
      c.bezierCurveTo(wS + u(0.008), top + u(0.1), wW, (top + hipY) / 2, wH, bot); c.quadraticCurveTo(0, bot + u(0.03), -wH, bot);
      c.bezierCurveTo(-wW, (top + hipY) / 2, -wS - u(0.008), top + u(0.1), -wS, top + u(0.014)); c.closePath();
    };
    const tb = [-shW - u(0.02), shY - u(0.03), (shW + u(0.02)) * 2, hipY - shY + u(0.12)];
    // neck
    form(ctx, (c) => c.roundRect(-u(S.neckW) / 2, hy + ry * 0.72, u(S.neckW), shY - hy - ry * 0.55, u(0.008)), C.skin, [-u(S.neckW), hy + ry * 0.7, u(S.neckW) * 2, shY - hy], { rimW: 0, sx: 0.02, sy: -0.35 });
    if (dress) {
      form(ctx, (c) => { c.moveTo(-shW * 0.78, shY + u(0.02)); c.quadraticCurveTo(0, shY + u(0.06), shW * 0.78, shY + u(0.02)); c.bezierCurveTo(u(S.waistW), shY + u(0.14), u(S.waistW) * 0.9, hipY - u(0.1), hipW * 1.9, hipY + u(0.2)); c.quadraticCurveTo(0, hipY + u(0.25), -hipW * 1.9, hipY + u(0.2)); c.bezierCurveTo(-u(S.waistW) * 0.9, hipY - u(0.1), -u(S.waistW), shY + u(0.14), -shW * 0.78, shY + u(0.02)); c.closePath(); }, C.dress, [-hipW * 1.9, shY, hipW * 3.8, u(0.5)], { rimW: u(0.01), lo: 0.38 });
    } else if (night) {
      const loungeT = torso(shW * 0.98, u(S.waistW) + u(0.014), hipW + u(0.02), shY, hipY + u(0.06)); form(ctx, loungeT, C.tee, tb, { lo: 0.36, rimW: u(0.01) });
      form(ctx, ell(0, shY + u(0.004), u(0.05), u(0.03)), C.skin, [-u(0.05), shY - u(0.026), u(0.1), u(0.06)], { rimW: 0, sx: 0.02, sy: -0.3 }); // collarbones in the wide neck
      ctx.strokeStyle = dark(C.tee, 0.35); ctx.lineWidth = lw(0.006); ctx.beginPath(); ctx.ellipse(0, shY + u(0.004), u(0.052), u(0.032), 0, 0.15, Math.PI - 0.15); ctx.stroke();
      ctx.save(); ctx.beginPath(); loungeT(ctx); ctx.clip(); ctx.strokeStyle = dark(C.tee, 0.5); ctx.globalAlpha = 0.16; ctx.lineWidth = lw(0.0022); for (let rx2 = -shW * 1.1; rx2 < shW * 1.1; rx2 += u(0.0085)) { ctx.beginPath(); ctx.moveTo(rx2, shY); ctx.lineTo(rx2 * 0.92, hipY + u(0.07)); ctx.stroke(); } ctx.restore(); // a ribbed lounge set, bone-coloured: what she actually sleeps in
    } else {
      form(ctx, torso(shW * 0.9, u(S.waistW), hipW), C.top, tb, { lo: 0.2, rimW: 0 });
      // gold necklace on the black top
      ctx.strokeStyle = C.gold; ctx.lineWidth = lw(0.0035); ctx.beginPath(); ctx.arc(0, shY - u(0.02), u(0.04), 0.5, Math.PI - 0.5); ctx.stroke(); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(0, shY + u(0.021), u(0.007), 0, 6.3); ctx.fill();
      // the blazer: structured shoulders, lapels, one button
      [-1, 1].forEach((s) => {
        const half = (c) => { const a = shW + u(0.008), h = hipW + u(0.016), open = u(0.012);
          c.moveTo(s * u(0.022), shY - u(0.012)); c.lineTo(s * a, shY + u(0.006)); c.bezierCurveTo(s * (a + u(0.012)), shY + u(0.12), s * (u(S.waistW) + u(0.01)), (shY + hipY) / 2, s * h, hipY + u(0.06));
          c.lineTo(s * open, hipY + u(0.07)); c.lineTo(s * open, shY + u(0.16)); c.lineTo(s * u(0.022), shY - u(0.012)); c.closePath(); };
        form(ctx, half, C.blazer, tb, { lo: 0.34, rimW: s > 0 ? u(0.012) : 0 });
        form(ctx, (c) => { c.moveTo(s * u(0.02), shY - u(0.014)); c.lineTo(s * u(0.07), shY + u(0.055)); c.lineTo(s * u(0.05), shY + u(0.075)); c.lineTo(s * u(0.012), shY + u(0.165)); c.closePath(); }, lite(C.blazer, 0.25), [s > 0 ? 0 : -u(0.07), shY, u(0.07), u(0.17)], { rimW: 0, lo: 0.22, shadow: false });
      });
      form(ctx, ell(u(0.004), shY + u(0.185), u(0.008), u(0.008)), C.gold, [-u(0.006), shY + u(0.175), u(0.02), u(0.02)], { rimW: 0 });
    }

    // ---- arms: [angle out from straight down, bend]. Bare by night and in the dress.
    const arm = (s, ang, bend) => {
      const sx = s * (shW - u(0.006)), sy = shY + u(0.03), L = u(S.armL) / 2, r = u(S.armR) * (night ? 0.95 : dress ? 0.85 : 1.12);
      const a1 = Math.PI / 2 - s * ang, ex = sx + Math.cos(a1) * L, ey = sy + Math.sin(a1) * L, a2 = a1 - s * bend, wx = ex + Math.cos(a2) * L, wy = ey + Math.sin(a2) * L;
      const bb = [Math.min(sx, wx) - r * 2, Math.min(sy, wy) - r * 2, Math.abs(wx - sx) + r * 4, Math.abs(wy - sy) + r * 4], rim = s > 0 ? r * 0.3 : 0;
      const upper = dress ? C.skin : jacket, lower = (night && !pose.sleeves) || dress ? C.skin : jacket;
      form(ctx, capsule(sx, sy, ex, ey, r * 1.1), upper, bb, { lo: 0.34, rimW: rim });
      form(ctx, capsule(ex, ey, wx, wy, r * (night || dress ? 0.86 : 1)), lower, bb, { lo: 0.34, rimW: rim });
      const hxp = wx + Math.cos(a2) * r, hyp = wy + Math.sin(a2) * r;
      form(ctx, ell(hxp, hyp, r * 0.95, r * 1.1, a2 - Math.PI / 2), C.skin, [hxp - r * 1.3, hyp - r * 1.3, r * 2.8, r * 2.8], { rimW: rim * 0.8 });
      form(ctx, ell(hxp - s * Math.sin(a2) * r * 0.9, hyp + s * Math.cos(a2) * r * 0.6, r * 0.42, r * 0.7, a2 - 1.2 * s), C.skin, [hxp - r * 1.6, hyp - r * 1.3, r * 3, r * 2.8], { rimW: 0, shadow: false }); // thumb
      if (!night && !dress) { ctx.strokeStyle = C.gold; ctx.lineWidth = lw(0.004); ctx.beginPath(); ctx.arc(wx, wy, r * 0.9, a2 + 1.2, a2 + Math.PI * 2 - 1.2); if (s < 0) ctx.stroke(); } // a bracelet on one wrist
      return [hxp, hyp];
    };
    const aL = pose.armL || [0.12, 0.08], aR = pose.armR || [0.12, 0.08];
    const handR = arm(1, aR[0], aR[1]), handL = arm(-1, aL[0], aL[1]);

    // ---- head
    headRot(() => {
      [-1, 1].forEach((s) => { const ex = hx + s * rx * 0.98, ey = hy + ry * 0.16, er = rx * 0.15;
        form(ctx, ell(ex, ey, er, er * 1.25), C.skin, [ex - er, ey - er, er * 2, er * 2.5], { rimW: 0 });
        if (!night) { ctx.strokeStyle = C.gold; ctx.lineWidth = lw(0.0055); ctx.beginPath(); ctx.arc(ex + s * er * 0.15, ey + er * 2.0, rx * 0.15, 0, 6.2832); ctx.stroke(); } });
      const face = (c) => { c.moveTo(hx - rx, hy - ry * 0.2); c.bezierCurveTo(hx - rx, hy - ry * 1.15, hx + rx, hy - ry * 1.15, hx + rx, hy - ry * 0.2); c.bezierCurveTo(hx + rx, hy + ry * 0.5, hx + rx * 0.42, hy + ry * 1.02, hx, hy + ry * 1.02); c.bezierCurveTo(hx - rx * 0.42, hy + ry * 1.02, hx - rx, hy + ry * 0.5, hx - rx, hy - ry * 0.2); c.closePath(); };
      form(ctx, face, E.pale ? mix(C.skin, "#8f8a9a", 0.14) : C.skin, [hx - rx, hy - ry, rx * 2, ry * 2], { hi: 0.26, lo: 0.24, rimW: rx * 0.09, sx: 0.09, sy: 0.04 });
      if (pose.glow) { ctx.save(); ctx.beginPath(); face(ctx); ctx.clip(); const gg = ctx.createRadialGradient(hx, hy + ry * 1.5, 0, hx, hy + ry * 1.5, ry * 2.3); gg.addColorStop(0, `rgba(190,215,255,${0.6 * pose.glow})`); gg.addColorStop(1, "rgba(190,215,255,0)"); ctx.fillStyle = gg; ctx.globalCompositeOperation = "screen"; ctx.fillRect(hx - rx, hy - ry, rx * 2, ry * 2.1); ctx.restore(); }
      [-1, 1].forEach((s) => { ctx.save(); ctx.globalAlpha = 0.26 * (E.blush || 1); ctx.filter = `blur(${rx * 0.07}px)`; ctx.fillStyle = "#e2674c"; ctx.beginPath(); ctx.ellipse(hx + s * rx * 0.58, hy + ry * 0.42, rx * 0.2, ry * 0.11, 0, 0, 6.2832); ctx.fill(); ctx.restore(); });
      // eyes: almond, with lashes
      const ey = hy + u(S.eyeY), erx = u(S.eyeR[0]), ery = u(S.eyeR[1]) * Math.min(1.25, E.open) * (1 - 0.92 * (pose.blink || 0));
      [-1, 1].forEach((s) => {
        const ex = hx + s * u(S.eyeDx);
        const shape = (c) => { c.moveTo(ex - erx, ey + ery * 0.12); c.quadraticCurveTo(ex - s * erx * 0.1, ey - ery * 1.55, ex + erx, ey + ery * 0.02 - s * ery * 0.1); c.quadraticCurveTo(ex, ey + ery * 1.25, ex - erx, ey + ery * 0.12); c.closePath(); };
        ctx.save(); ctx.beginPath(); shape(ctx); ctx.fillStyle = C.white; ctx.fill(); ctx.clip();
        const ir = erx * 0.62, ix = ex + E.px * erx * 0.34, iy = ey - ery * 0.12 + E.py * ery * 0.5;
        ctx.fillStyle = "#4a2a1a"; ctx.beginPath(); ctx.arc(ix, iy, ir, 0, 6.2832); ctx.fill(); ctx.fillStyle = "#120a08"; ctx.beginPath(); ctx.arc(ix, iy, ir * 0.52, 0, 6.2832); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ix - ir * 0.36, iy - ir * 0.38, ir * 0.28, 0, 6.2832); ctx.fill();
        if (E.wet) { ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.beginPath(); ctx.ellipse(ix + ir * 0.3, iy + ir * 0.6, ir * 0.42, ir * 0.2, 0, 0, 6.2832); ctx.fill(); }
        ctx.fillStyle = "rgba(60,25,15,.2)"; ctx.fillRect(ex - erx * 1.2, ey - ery * 1.6, erx * 2.4, ery * 0.6);
        ctx.restore();
        ctx.strokeStyle = C.ink; ctx.lineWidth = lw(night ? 0.005 : 0.0058); ctx.beginPath(); ctx.moveTo(ex - erx, ey + ery * 0.12); ctx.quadraticCurveTo(ex - s * erx * 0.1, ey - ery * 1.55, ex + erx, ey + ery * 0.02 - s * ery * 0.1); ctx.stroke();
        ctx.lineWidth = lw(night ? 0.003 : 0.004); ctx.beginPath(); ctx.moveTo(ex + s * erx, ey); ctx.lineTo(ex + s * erx * (night ? 1.22 : 1.32), ey - ery * (night ? 0.36 : 0.5)); ctx.stroke(); // lash flick: softer without make-up
        if (pose.mascara) { ctx.strokeStyle = "rgba(20,12,10,.6)"; ctx.lineWidth = lw(0.005); ctx.beginPath(); ctx.moveTo(ex - erx * 0.2, ey + ery * 1.1); ctx.quadraticCurveTo(ex - erx * 0.1, ey + ery * 1.8, ex - erx * 0.25 * s, ey + ery * 2.5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(ex + erx * 0.4, ey + ery * 1.0); ctx.lineTo(ex + erx * 0.46, ey + ery * 1.8); ctx.stroke(); }
        const bw = u(S.browW), by = ey - ery - u(0.018) - u(0.012) * (E.bh + (s < 0 && E.browL ? E.browL : 0));
        ctx.strokeStyle = C.hair; ctx.lineWidth = lw(0.0078); ctx.beginPath(); ctx.moveTo(ex - s * bw * 0.55, by - u(0.01) * E.bi + u(0.003)); ctx.quadraticCurveTo(ex + s * bw * 0.1, by - u(0.011), ex + s * bw * 0.62, by - u(0.01) * E.bo + u(0.004)); ctx.stroke();
      });
      ctx.strokeStyle = dark(C.skin, 0.38); ctx.lineWidth = lw(0.004); ctx.beginPath(); ctx.arc(hx, hy + ry * 0.36, rx * 0.075, 0.3, Math.PI - 0.3); ctx.stroke();
      // mouth, with lip colour by day
      const my = hy + u(S.mouthY), mw = rx * 0.34, lip = night ? "#7a3a34" : C.lip; ctx.strokeStyle = lip; ctx.fillStyle = lip; ctx.lineWidth = lw(0.0078);
      ctx.beginPath();
      if (E.mouth === "soft") { ctx.moveTo(hx - mw * 0.62, my); ctx.quadraticCurveTo(hx, my + u(0.007), hx + mw * 0.62, my); ctx.quadraticCurveTo(hx, my - u(0.006), hx - mw * 0.62, my); ctx.fill(); ctx.stroke(); }
      else if (E.mouth === "smile") { ctx.moveTo(hx - mw * 0.8, my - u(0.005)); ctx.quadraticCurveTo(hx, my + u(0.02), hx + mw * 0.8, my - u(0.005)); ctx.stroke(); }
      else if (E.mouth === "down") { ctx.moveTo(hx - mw * 0.55, my + u(0.006)); ctx.quadraticCurveTo(hx, my - u(0.009), hx + mw * 0.55, my + u(0.006)); ctx.stroke(); }
      else if (E.mouth === "smirk") { ctx.moveTo(hx - mw * 0.6, my + u(0.003)); ctx.quadraticCurveTo(hx + mw * 0.2, my + u(0.011), hx + mw * 0.85, my - u(0.013)); ctx.stroke(); }
      else if (E.mouth === "o") { ctx.ellipse(hx + mw * 0.08, my + u(0.004), mw * 0.25, mw * 0.33, 0, 0, 6.2832); ctx.fill(); }
      else if (E.mouth === "wobble") { ctx.moveTo(hx - mw * 0.6, my + u(0.004)); ctx.bezierCurveTo(hx - mw * 0.3, my - u(0.01), hx - mw * 0.1, my + u(0.012), hx + mw * 0.15, my); ctx.bezierCurveTo(hx + mw * 0.3, my - u(0.008), hx + mw * 0.5, my + u(0.008), hx + mw * 0.62, my + u(0.002)); ctx.stroke(); }
      else if (E.mouth === "bright") { // a wide, held smile: a crescent of teeth between the lips
        const sm = (c) => { c.moveTo(hx - mw * 1.25, my - u(0.014)); c.quadraticCurveTo(hx, my + u(0.006), hx + mw * 1.25, my - u(0.014)); c.quadraticCurveTo(hx, my + u(0.052), hx - mw * 1.25, my - u(0.014)); c.closePath(); };
        sm(ctx); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = lw(0.0066); ctx.stroke(); ctx.strokeStyle = "rgba(120,60,50,.35)"; ctx.lineWidth = lw(0.0018); ctx.beginPath(); ctx.moveTo(hx - mw * 1.0, my + u(0.004)); ctx.quadraticCurveTo(hx, my + u(0.022), hx + mw * 1.0, my + u(0.004)); ctx.stroke(); }
      else if (E.mouth === "slip") { ctx.moveTo(hx - mw * 0.8, my - u(0.006)); ctx.bezierCurveTo(hx - mw * 0.3, my + u(0.01), hx + mw * 0.2, my - u(0.006), hx + mw * 0.8, my + u(0.012)); ctx.stroke(); }
      if (E.sweat) { const sx = hx + rx * 0.74, sy = hy - ry * 0.55; ctx.fillStyle = "rgba(190,225,255,.92)"; ctx.beginPath(); ctx.moveTo(sx, sy - u(0.02)); ctx.quadraticCurveTo(sx + u(0.012), sy + u(0.004), sx, sy + u(0.01)); ctx.quadraticCurveTo(sx - u(0.012), sy + u(0.004), sx, sy - u(0.02)); ctx.fill(); }
      // hair in front: a centre part and two sleek curtains; by day they fall past her shoulders
      [-1, 1].forEach((s) => {
        const bottom = up ? hy + ry * 0.55 : shY + u(0.1);
        const cur = (c) => { c.moveTo(hx, hy - ry * 1.14); c.bezierCurveTo(hx + s * rx * 0.95, hy - ry * 1.2, hx + s * rx * 1.22, hy - ry * 0.6, hx + s * rx * 1.2, hy);
          if (up) { c.quadraticCurveTo(hx + s * rx * 1.16, hy + ry * 0.4, hx + s * rx * 1.02, bottom); c.quadraticCurveTo(hx + s * rx * 0.9, hy - ry * 0.4, hx + s * rx * 0.06, hy - ry * 0.98); }
          else { c.lineTo(hx + s * rx * 1.42, bottom); c.quadraticCurveTo(hx + s * rx * 1.2, bottom + u(0.014), hx + s * rx * 1.04, bottom - u(0.004)); c.bezierCurveTo(hx + s * rx * 1.02, shY, hx + s * rx * 1.0, hy + ry * 0.5, hx + s * rx * 0.9, hy - ry * 0.1); c.quadraticCurveTo(hx + s * rx * 0.74, hy - ry * 0.72, hx + s * rx * 0.06, hy - ry * 0.98); }
          c.closePath(); };
        form(ctx, cur, C.hair, [hx - rx * 1.3, hy - ry * 1.2, rx * 2.6, bottom - hy + ry * 1.3], { hi: 0.2, lo: 0.06, rimW: s > 0 ? rx * 0.06 : 0, shadow: false });
        if (!up) { ctx.save(); ctx.globalAlpha = 0.16; ctx.strokeStyle = "#ffe9c8"; ctx.lineWidth = lw(0.006); ctx.beginPath(); ctx.moveTo(hx + s * rx * 0.62, hy - ry * 0.9); ctx.quadraticCurveTo(hx + s * rx * 1.12, hy - ry * 0.2, hx + s * rx * 1.08, shY + u(0.1)); ctx.stroke(); ctx.restore(); } // the sheen
      });
      if (hair === "side") form(ctx, (c) => { c.moveTo(hx + rx * 0.86, hy + ry * 0.2); c.bezierCurveTo(hx + rx * 1.5, hy + ry * 0.7, hx + rx * 1.5, shY + u(0.06), hx + rx * 1.28, shY + u(0.19)); c.quadraticCurveTo(hx + rx * 1.0, shY + u(0.205), hx + rx * 0.82, shY + u(0.17)); c.bezierCurveTo(hx + rx * 1.06, shY + u(0.04), hx + rx * 1.05, hy + ry * 0.9, hx + rx * 0.78, hy + ry * 0.45); c.closePath(); }, C.hair, [hx + rx * 0.7, hy, rx * 0.9, u(0.34)], { hi: 0.2, lo: 0.06, rimW: rx * 0.05, shadow: false }); // the length, pulled over one shoulder
    });

    if (hair === "low") headRot(() => { ctx.strokeStyle = C.hair; ctx.lineWidth = lw(0.0045); [-1, 1].forEach((s) => { ctx.beginPath(); ctx.moveTo(hx + s * rx * 0.98, hy + ry * 0.5); ctx.quadraticCurveTo(hx + s * rx * 1.12, hy + ry * 0.85, hx + s * rx * 0.94, hy + ry * 1.12); ctx.stroke(); }); });

    // ---- things in front of her
    if ((E.cushion && !pose.noCushion) || pose.cushion) {
      const cw = rx * 3.1, ch = ry * 1.5, cy = hy + ry * 0.22;
      form(ctx, (c) => c.roundRect(hx - cw / 2, cy, cw, ch, ch * 0.3), "#d9643a", [hx - cw / 2, cy, cw, ch], { lo: 0.34, rimW: u(0.01) });
      [-1, 1].forEach((s) => form(ctx, ell(hx + s * cw * 0.38, cy + ch * 0.5, rx * 0.3, rx * 0.34), C.skin, [hx + s * cw * 0.38 - rx * 0.3, cy + ch * 0.2, rx * 0.6, rx * 0.7], { rimW: 0 }));
    }
    if (pose.phone) {
      const [px, py] = pose.phone === "L" ? handL : handR, pw = u(0.05), ph = u(0.098);
      ctx.save(); ctx.translate(px, py - ph * 0.28); ctx.rotate(pose.phone === "L" ? 0.18 : -0.18);
      form(ctx, (c) => c.roundRect(-pw / 2, -ph / 2, pw, ph, pw * 0.2), "#221815", [-pw / 2, -ph / 2, pw, ph], { rimW: 0, shadow: false }); ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = "screen"; const pg = ctx.createRadialGradient(px, py - ph * 0.5, 0, px, py - ph * 0.5, u(0.2)); pg.addColorStop(0, "rgba(170,200,255,.5)"); pg.addColorStop(1, "rgba(170,200,255,0)"); ctx.fillStyle = pg; ctx.fillRect(px - u(0.2), py - ph * 0.5 - u(0.2), u(0.4), u(0.4)); ctx.restore();
    }
    if (pose.pastry) { const [px, py0] = handR, py = py0 - u(0.03), R = u(0.07);
      const cres = (c) => { c.moveTo(px - R, py + R * 0.1); c.bezierCurveTo(px - R * 0.8, py - R * 0.95, px + R * 0.8, py - R * 0.95, px + R, py + R * 0.1); c.bezierCurveTo(px + R * 0.55, py - R * 0.2, px - R * 0.55, py - R * 0.2, px - R, py + R * 0.1); c.closePath(); };
      form(ctx, cres, "#d99a3a", [px - R, py - R, R * 2, R * 1.2], { rimW: R * 0.06, lo: 0.4 });
      ctx.save(); ctx.beginPath(); cres(ctx); ctx.clip(); ctx.strokeStyle = "#9a5f1c"; ctx.lineWidth = lw(0.0045); [-0.62, -0.32, 0, 0.32, 0.62].forEach((k) => { ctx.beginPath(); ctx.moveTo(px + k * R * 1.25, py - R); ctx.quadraticCurveTo(px + k * R * 0.9, py - R * 0.4, px + k * R * 0.8, py + R * 0.2); ctx.stroke(); }); ctx.strokeStyle = "rgba(255,235,190,.6)"; ctx.lineWidth = lw(0.003); [-0.45, -0.14, 0.18, 0.48].forEach((k) => { ctx.beginPath(); ctx.moveTo(px + k * R * 1.2, py - R * 0.9); ctx.quadraticCurveTo(px + k * R * 0.9, py - R * 0.45, px + k * R * 0.84, py - R * 0.1); ctx.stroke(); }); ctx.restore();
      ctx.fillStyle = "#fbf4e8"; [[-0.5, 0.5], [0.3, 0.62], [0.75, 0.42]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(px + dx * R, py + dy * R, R * 0.045, 0, 6.3); ctx.fill(); }); } // crumbs
    ctx.restore();
  };
})(globalThis);
