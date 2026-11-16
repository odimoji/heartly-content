// Phones, screens, labels, thought bubbles and the vote card for the series.
// Heartly's screens follow brand/APP_SCREENS.md: near-black warm ground with a glow top-right, plain cream text,
// serif for questions, the user's last answer as a small grey quote with a thin bar, cream pill buttons.
(function (g) {
  const CREAM = "#f6ecdc", GOLD = "#d9b26a", EMBER = "#d9643a", NIGHT = "#120d0a";
  g.UI = { CREAM, GOLD, EMBER, NIGHT };

  // words: [[text, lit]], wraps inside maxW; unlit words are dimmed so the key phrase reads in a second
  g.rich = function (ctx, parts, x, y, maxW, lh, font, o = {}) {
    ctx.save(); ctx.font = font; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    let cx = x, cy = y;
    parts.forEach(([text, lit]) => text.split(/(\s+)/).forEach((w) => {
      if (!w) return; const wd = ctx.measureText(w).width;
      if (/^\s+$/.test(w)) { cx += wd; return; }
      if (cx + wd > x + maxW && cx > x) { cx = x; cy += lh; }
      ctx.fillStyle = lit ? (o.hot || CREAM) : (o.dim || "rgba(246,236,220,.36)"); ctx.fillText(w, cx, cy); cx += wd;
    }));
    ctx.restore(); return cy;
  };

  // a phone, upright, with a screen drawn by fn(ctx, w, h) in its own coordinates
  g.phone = function (ctx, cx, cy, w, fn, o = {}) {
    const h = w * 2.06, r = w * 0.13, b = w * 0.035;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(o.rot || 0);
    ctx.save(); ctx.filter = "blur(26px)"; ctx.fillStyle = "rgba(0,0,0,.6)"; ctx.beginPath(); ctx.roundRect(-w / 2 + 14, -h / 2 + 30, w, h, r); ctx.fill(); ctx.restore();
    if (o.glow !== 0) { ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.filter = "blur(60px)"; ctx.fillStyle = o.glowC || "rgba(255,200,150,.26)"; ctx.beginPath(); ctx.roundRect(-w / 2 - 20, -h / 2 - 20, w + 40, h + 40, r); ctx.fill(); ctx.restore(); }
    zform(ctx, (c) => c.roundRect(-w / 2, -h / 2, w, h, r), "#2a201c", [-w / 2, -h / 2, w, h], { rimW: w * 0.012, shadow: false });
    ctx.save(); ctx.beginPath(); ctx.roundRect(-w / 2 + b, -h / 2 + b, w - b * 2, h - b * 2, r - b); ctx.clip(); ctx.translate(-w / 2 + b, -h / 2 + b);
    fn(ctx, w - b * 2, h - b * 2); ctx.restore();
    ctx.fillStyle = "#0c0807"; ctx.beginPath(); ctx.roundRect(-w * 0.13, -h / 2 + b + w * 0.03, w * 0.26, w * 0.06, w * 0.03); ctx.fill();
    ctx.restore();
  };
  // her thumb, coming in from the bottom right
  g.thumb = function (ctx, x, y, s, rot = -0.5) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    zform(ctx, (c) => c.roundRect(-s * 0.5, -s * 0.2, s, s * 3.4, s * 0.5), ZC.skin, [-s * 0.5, -s * 0.2, s, s * 3.4], { rimW: s * 0.08 });
    ctx.fillStyle = "rgba(255,225,205,.55)"; ctx.beginPath(); ctx.roundRect(-s * 0.3, -s * 0.08, s * 0.6, s * 0.62, s * 0.26); ctx.fill();
    ctx.restore();
  };

  // a phone held in her hand: forearm, palm behind the phone, four fingertips round the far edge, thumb over the screen.
  // thumbAt = [fx, fy] as fractions of the phone; sleeve = cuff colour (her blazer) or null for a bare arm
  g.heldPhone = function (ctx, cx, cy, w, fn, o = {}) {
    const h = w * 2.06, sk = ZC.skin, rot = o.rot ?? -0.05, ta = o.thumbAt || [0.6, 0.86];
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
    // forearm coming up from the bottom right
    const arm = (c) => { c.moveTo(w * 0.12, h * 0.5); c.lineTo(w * 0.78, h * 0.34); c.lineTo(w * 1.5, h * 1.5); c.lineTo(w * 0.5, h * 1.5); c.closePath(); };
    zform(ctx, arm, o.sleeve || sk, [w * 0.1, h * 0.3, w * 1.4, h * 1.2], { rimW: w * 0.03, lo: 0.4 });
    if (o.sleeve) { zform(ctx, (c) => { c.moveTo(w * 0.1, h * 0.52); c.lineTo(w * 0.8, h * 0.35); c.lineTo(w * 0.86, h * 0.45); c.lineTo(w * 0.17, h * 0.63); c.closePath(); }, sk, [w * 0.1, h * 0.35, w * 0.8, h * 0.3], { rimW: 0 }); ctx.strokeStyle = ZC.gold; ctx.lineWidth = w * 0.02; ctx.beginPath(); ctx.moveTo(w * 0.19, h * 0.655); ctx.lineTo(w * 0.87, h * 0.475); ctx.stroke(); }
    // palm behind the lower half of the phone
    zform(ctx, (c) => c.ellipse(w * 0.12, h * 0.3, w * 0.66, h * 0.3, -0.2, 0, 6.3), sk, [-w * 0.6, 0, w * 1.4, h * 0.62], { rimW: w * 0.02 });
    ctx.restore();
    phone(ctx, cx, cy, w, fn, { rot, glow: o.glow, glowC: o.glowC });
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
    // fingertips wrapping the left edge
    [0.02, 0.13, 0.24, 0.345].forEach((fy, i) => { const fw = w * (0.2 - i * 0.012), fh = w * 0.15; zform(ctx, (c) => c.roundRect(-w / 2 - fw * 0.42, h * fy, fw, fh, fh * 0.48), sk, [-w / 2 - fw * 0.42, h * fy, fw, fh], { rimW: 0, sx: -0.1, sy: 0.12 }); });
    // the thumb: base at the lower right edge, tip at thumbAt
    const bx = w * 0.56, by = h * 0.36, tx = (ta[0] - 0.5) * w, ty = (ta[1] - 0.5) * h, an = Math.atan2(ty - by, tx - bx), L = Math.hypot(tx - bx, ty - by);
    ctx.translate(bx, by); ctx.rotate(an);
    zform(ctx, (c) => { c.moveTo(-w * 0.1, -w * 0.15); c.bezierCurveTo(L * 0.4, -w * 0.15, L * 0.8, -w * 0.11, L, -w * 0.085); c.arc(L, 0, w * 0.085, -Math.PI / 2, Math.PI / 2); c.bezierCurveTo(L * 0.8, w * 0.11, L * 0.4, w * 0.16, -w * 0.1, w * 0.19); c.closePath(); }, sk, [-w * 0.1, -w * 0.16, L + w * 0.2, w * 0.36], { rimW: w * 0.012 });
    ctx.fillStyle = o.sleeve ? "rgba(196,70,60,.85)" : "rgba(255,225,205,.5)"; ctx.beginPath(); ctx.roundRect(L - w * 0.075, -w * 0.058, w * 0.12, w * 0.116, w * 0.05); ctx.fill(); // nail (painted by day)
    ctx.strokeStyle = "rgba(90,50,35,.35)"; ctx.lineWidth = w * 0.008; ctx.beginPath(); ctx.moveTo(L * 0.52, -w * 0.09); ctx.lineTo(L * 0.52, w * 0.1); ctx.stroke(); // knuckle
    ctx.restore();
  };

  // ---------- screens
  g.screenInvite = (pressed) => (ctx, w, h) => {
    const bg = ctx.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, "#fbf4e8"); bg.addColorStop(1, "#f0e2cc"); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = GOLD; ctx.lineWidth = w * 0.006; ctx.strokeRect(w * 0.06, h * 0.07, w * 0.88, h * 0.86);
    ctx.textAlign = "center"; ctx.fillStyle = "#8a6a3a"; ctx.font = `600 ${w * 0.042}px Inter`; ctx.letterSpacing = `${w * 0.012}px`; ctx.fillText("YOU ARE INVITED", w / 2, h * 0.17); ctx.letterSpacing = "0px";
    ctx.fillStyle = "#3a2a22"; ctx.font = `italic 600 ${w * 0.17}px Cormorant`; ctx.fillText("Miles", w / 2, h * 0.3); ctx.font = `italic 600 ${w * 0.09}px Cormorant`; ctx.fillText("&", w / 2, h * 0.36); ctx.font = `italic 600 ${w * 0.17}px Cormorant`; ctx.fillText("Ivy", w / 2, h * 0.445);
    ctx.fillStyle = "#8a6a3a"; ctx.font = `600 ${w * 0.04}px Inter`; ctx.fillText("are getting married", w / 2, h * 0.51);
    ctx.fillStyle = "#3a2a22"; ctx.font = `600 ${w * 0.05}px Inter`; ctx.fillText("Will you be there?", w / 2, h * 0.6);
    const btn = (y, label, on) => { ctx.fillStyle = on ? "#3a2a22" : "rgba(58,42,34,.08)"; ctx.beginPath(); ctx.roundRect(w * 0.14, y, w * 0.72, h * 0.085, h * 0.043); ctx.fill(); ctx.fillStyle = on ? "#fbf4e8" : "#8a7a68"; ctx.font = `600 ${w * 0.058}px Inter`; ctx.fillText(label, w / 2, y + h * 0.056); };
    btn(h * 0.65, pressed ? "✓  ACCEPTED" : "ACCEPT", true); btn(h * 0.76, "DECLINE", false);
  };
  // bubbles: [{t, me}], typing: text in the input box
  g.screenThread = (name, bubbles, typing, o = {}) => (ctx, w, h) => {
    ctx.fillStyle = "#17120f"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#211a16"; ctx.fillRect(0, 0, w, h * 0.115); ctx.textAlign = "center"; ctx.fillStyle = CREAM; ctx.font = `600 ${w * 0.062}px Inter`; ctx.fillText(name, w / 2, h * 0.085);
    let y = h * 0.16; ctx.font = `500 ${w * 0.062}px Inter`;
    bubbles.forEach((b) => {
      const tw = ctx.measureText(b.t).width, bw = tw + w * 0.09, bh = h * 0.062, x = b.me ? w * 0.95 - bw : w * 0.05;
      ctx.fillStyle = b.me ? "#c9793f" : "#33291f"; ctx.beginPath(); ctx.roundRect(x, y, bw, bh, bh * 0.45); ctx.fill();
      ctx.fillStyle = b.me ? "#fff6e8" : CREAM; ctx.textAlign = "left"; ctx.fillText(b.t, x + w * 0.045, y + bh * 0.68); y += bh + h * 0.016;
    });
    if (o.label) { ctx.textAlign = "center"; ctx.fillStyle = GOLD; ctx.font = `600 ${w * 0.04}px Inter`; ctx.letterSpacing = `${w * 0.006}px`; ctx.fillText(o.label, w / 2, h * 0.34); ctx.letterSpacing = "0px"; }
    // the box she types in grows to two lines for a long draft, so the whole draft can be read
    ctx.font = `500 ${w * 0.058}px Inter`; const full = typing ? typing + "|" : "Message"; let l1 = full, l2 = "";
    if (ctx.measureText(full).width > w * 0.64) { const ws = full.split(" "); l1 = ""; while (ws.length && ctx.measureText(l1 + ws[0]).width < w * 0.62) l1 += ws.shift() + " "; l2 = ws.join(" "); }
    const tall = l2 ? h * 0.05 : 0;
    ctx.fillStyle = "#241c17"; ctx.fillRect(0, h * 0.84 - tall, w, h * 0.16 + tall); ctx.fillStyle = "#33291f"; ctx.beginPath(); ctx.roundRect(w * 0.05, h * 0.865 - tall, w * 0.74, h * 0.07 + tall, h * 0.035); ctx.fill();
    ctx.textAlign = "left"; ctx.fillStyle = typing ? CREAM : "#8a7a68";
    ctx.fillText(l1, w * 0.09, h * 0.91 - tall); if (l2) ctx.fillText(l2, w * 0.09, h * 0.91);
    ctx.fillStyle = typing ? "#c9793f" : "#4a3d32"; ctx.beginPath(); ctx.arc(w * 0.885, h * 0.9, w * 0.06, 0, 6.3); ctx.fill(); ctx.strokeStyle = "#fff6e8"; ctx.lineWidth = w * 0.012; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(w * 0.885, h * 0.915); ctx.lineTo(w * 0.885, h * 0.885); ctx.moveTo(w * 0.865, h * 0.897); ctx.lineTo(w * 0.885, h * 0.883); ctx.lineTo(w * 0.905, h * 0.897); ctx.stroke();
  };
  g.screenPost = () => (ctx, w, h) => {
    ctx.fillStyle = "#17120f"; ctx.fillRect(0, 0, w, h); ctx.fillStyle = CREAM; ctx.font = `600 ${w * 0.06}px Inter`; ctx.textAlign = "left"; ctx.fillText("ivy", w * 0.2, h * 0.075);
    ctx.fillStyle = "#e8b8a0"; ctx.beginPath(); ctx.arc(w * 0.1, h * 0.065, w * 0.055, 0, 6.3); ctx.fill();
    const p = ctx.createLinearGradient(0, h * 0.11, w, h * 0.7); p.addColorStop(0, "#e9c7b2"); p.addColorStop(1, "#b9806a"); ctx.fillStyle = p; ctx.fillRect(0, h * 0.11, w, h * 0.6);
    // a hand with the ring
    zform(ctx, (c) => c.ellipse(w * 0.5, h * 0.52, w * 0.3, h * 0.13, -0.2, 0, 6.3), "#e3b594", [w * 0.2, h * 0.39, w * 0.6, h * 0.26], { rimW: 0 });
    [0, 1, 2, 3].forEach((i) => zform(ctx, (c) => c.roundRect(w * (0.3 + i * 0.105), h * (0.22 + (i % 3 === 0 ? 0.04 : 0)), w * 0.085, h * 0.22, w * 0.04), "#e3b594", [w * (0.3 + i * 0.105), h * 0.22, w * 0.085, h * 0.26], { rimW: 0 }));
    ctx.strokeStyle = GOLD; ctx.lineWidth = w * 0.02; ctx.beginPath(); ctx.moveTo(w * 0.51, h * 0.36); ctx.lineTo(w * 0.595, h * 0.36); ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(w * 0.552, h * 0.325); ctx.lineTo(w * 0.585, h * 0.345); ctx.lineTo(w * 0.552, h * 0.365); ctx.lineTo(w * 0.52, h * 0.345); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.filter = `blur(${w * 0.03}px)`; ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.beginPath(); ctx.arc(w * 0.552, h * 0.345, w * 0.06, 0, 6.3); ctx.fill(); ctx.restore();
    ctx.fillStyle = CREAM; ctx.font = `500 ${w * 0.058}px Inter`; ctx.fillText("he asked. i said yes.", w * 0.06, h * 0.78); ctx.fillStyle = "#8a7a68"; ctx.fillText("1,204 likes", w * 0.06, h * 0.83);
  };
  // Heartly onboarding. step 0: the question and her typed answer. 1: her answer quoted + the reflection. 2: + WHEN YOU'RE READY and the next question.
  g.screenHeartly = (step, typed) => (ctx, w, h) => {
    ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, w, h);
    const gl = ctx.createRadialGradient(w * 0.95, h * 0.05, 0, w * 0.95, h * 0.05, w * 1.1); gl.addColorStop(0, "rgba(120,72,48,.55)"); gl.addColorStop(1, "rgba(120,72,48,0)"); ctx.fillStyle = gl; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = CREAM; ctx.lineWidth = w * 0.008; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(w * 0.085, h * 0.068); ctx.lineTo(w * 0.06, h * 0.08); ctx.lineTo(w * 0.085, h * 0.092); ctx.stroke();
    ctx.textAlign = "center"; ctx.fillStyle = CREAM; ctx.font = `600 ${w * 0.062}px Cormorant`; ctx.fillText("Heartly", w / 2, h * 0.088);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = i <= step ? CREAM : "rgba(246,236,220,.25)"; ctx.fillRect(w * (0.38 + i * 0.052), h * 0.105, w * 0.036, h * 0.003); }
    const X = w * 0.085, MW = w * 0.83;
    if (step === 0) {
      const y = rich(ctx, [["When it's quiet and you're alone with yourself, what's the feeling that ", false], ["keeps coming back?", true]], X, h * 0.22, MW, w * 0.115, `600 ${w * 0.094}px Cormorant`);
      ctx.fillStyle = "rgba(246,236,220,.07)"; ctx.beginPath(); ctx.roundRect(X, y + h * 0.05, MW, h * 0.16, w * 0.05); ctx.fill();
      if (typed) rich(ctx, typed, X + w * 0.045, y + h * 0.105, MW - w * 0.09, w * 0.078, `500 ${w * 0.058}px Inter`);
      else { ctx.textAlign = "left"; ctx.fillStyle = "rgba(246,236,220,.3)"; ctx.font = `500 ${w * 0.054}px Inter`; ctx.fillText("Start wherever you want", X + w * 0.045, y + h * 0.105); }
    } else {
      ctx.fillStyle = "rgba(246,236,220,.4)"; ctx.fillRect(X, h * 0.175, w * 0.006, h * 0.045); ctx.textAlign = "left"; ctx.font = `500 ${w * 0.048}px Inter`; ctx.fillText("that he's fine without me", X + w * 0.035, h * 0.205);
      let y = rich(ctx, [["He looks fine, and ", step === 2 ? false : false], ["you're the one still awake.", step === 1]], X, h * 0.31, MW, w * 0.092, `500 ${w * 0.068}px Inter`, step === 2 ? { dim: "rgba(246,236,220,.3)" } : {});
      if (step === 2) {
        ctx.fillStyle = GOLD; ctx.font = `600 ${w * 0.036}px Inter`; ctx.letterSpacing = `${w * 0.012}px`; ctx.fillText("WHEN YOU'RE READY", X, y + h * 0.085); ctx.letterSpacing = "0px";
        y = rich(ctx, [["When he sees your yes, ", false], ["what do you want him to think?", true]], X, y + h * 0.15, MW, w * 0.115, `600 ${w * 0.094}px Cormorant`);
      }
      ctx.fillStyle = CREAM; ctx.beginPath(); ctx.roundRect(X, h * 0.86, MW, h * 0.075, h * 0.038); ctx.fill(); ctx.fillStyle = "#1a120e"; ctx.textAlign = "center"; ctx.font = `600 ${w * 0.056}px Inter`; ctx.fillText("Go on", w / 2, h * 0.908);
    }
  };

  // a small tag pinned to something in the shot
  g.label = function (ctx, text, x, y, o = {}) {
    ctx.save(); ctx.font = `600 ${o.size || 34}px Inter`; ctx.letterSpacing = "2px"; const w = ctx.measureText(text).width + 44, h = (o.size || 34) * 1.75;
    ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.fillStyle = "rgba(23,18,14,.9)"; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.strokeStyle = "rgba(217,178,106,.8)"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = o.color || CREAM; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, 1, 2); ctx.restore();
  };
  // a thought bubble: fn draws inside a clipped circle area centred on (cx, cy)
  g.thought = function (ctx, cx, cy, r, fn, tail = [1, 1]) {
    ctx.save();
    const blobs = [[0, 0, 1], [-0.72, 0.1, 0.62], [0.72, 0.05, 0.64], [-0.4, -0.55, 0.62], [0.42, -0.56, 0.6], [-0.35, 0.58, 0.6], [0.4, 0.58, 0.58]];
    const path = (c) => blobs.forEach(([dx, dy, s]) => { c.moveTo(cx + dx * r + r * s, cy + dy * r); c.arc(cx + dx * r, cy + dy * r, r * s, 0, 6.3); });
    ctx.save(); ctx.filter = "blur(18px)"; ctx.fillStyle = "rgba(0,0,0,.5)"; ctx.beginPath(); path(ctx); ctx.fill(); ctx.restore();
    ctx.beginPath(); path(ctx); const gr = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r); gr.addColorStop(0, "#fff8ec"); gr.addColorStop(1, "#e2d0b6"); ctx.fillStyle = gr; ctx.fill();
    [[0.95, 1.05, 0.14], [1.2, 1.3, 0.085]].forEach(([dx, dy, s]) => { ctx.beginPath(); ctx.arc(cx + tail[0] * dx * r, cy + tail[1] * dy * r, r * s, 0, 6.3); ctx.fill(); });
    ctx.beginPath(); path(ctx); ctx.clip(); fn(ctx); ctx.restore();
  };
  // the vote: two options side by side in Heartly's colours and type
  g.voteCard = function (ctx, left, right) {
    const side = (x, o) => {
      ctx.save(); ctx.beginPath(); ctx.roundRect(x, 430, 500, 900, 40); ctx.clip();
      ctx.fillStyle = "#1a120e"; ctx.fillRect(x, 430, 500, 900); const gl = ctx.createRadialGradient(x + 420, 470, 0, x + 420, 470, 600); gl.addColorStop(0, "rgba(120,72,48,.6)"); gl.addColorStop(1, "rgba(120,72,48,0)"); ctx.fillStyle = gl; ctx.fillRect(x, 430, 500, 900);
      ctx.save(); ctx.translate(x, 430); o.draw(ctx); ctx.restore();
      const sh = ctx.createLinearGradient(0, 1040, 0, 1330); sh.addColorStop(0, "rgba(18,13,10,0)"); sh.addColorStop(0.55, "rgba(18,13,10,.94)"); ctx.fillStyle = sh; ctx.fillRect(x, 1040, 500, 290);
      ctx.textAlign = "center"; ctx.fillStyle = o.color; ctx.font = "600 108px Cormorant"; ctx.fillText(o.word, x + 250, 1240); ctx.fillStyle = "rgba(246,236,220,.8)"; ctx.font = "500 30px Inter"; ctx.fillText(o.sub, x + 250, 1292);
      ctx.restore(); ctx.strokeStyle = "rgba(217,178,106,.7)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, 430, 500, 900, 40); ctx.stroke();
    };
    side(30, left); side(550, right);
    ctx.fillStyle = "#120d0a"; ctx.beginPath(); ctx.arc(540, 880, 52, 0, 6.3); ctx.fill(); ctx.strokeStyle = "rgba(217,178,106,.8)"; ctx.stroke(); ctx.fillStyle = "#f6ecdc"; ctx.textAlign = "center"; ctx.font = "italic 600 44px Cormorant"; ctx.fillText("or", 540, 893);
    ctx.fillStyle = "rgba(246,236,220,.85)"; ctx.font = "600 32px Inter"; ctx.letterSpacing = "5px"; ctx.fillText("COMMENT ONE WORD", 540, 1392); ctx.letterSpacing = "0px";
  };
})(globalThis);
