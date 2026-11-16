// Episode 1, "She said yes". One entry per shot of scripts/series/ep01.md: how long it runs, its caption, who speaks,
// and a draw(ctx, k) where k runs 0..1 through the shot. A new episode is a new file like this one; the kit does the rest.
// Every shot is full-bleed. A phone is always in her hand, in her room; her lit face is cut in between as the reaction.
(function (g) {
  const cam = (ctx, cx, cy, s, fn) => { ctx.save(); ctx.translate(540, 960); ctx.scale(s, s); ctx.translate(-cx, -cy); fn(); ctx.restore(); };
  const soft = (ctx, px, dim, fn) => { ctx.save(); ctx.filter = `blur(${px}px)`; fn(); ctx.restore(); ctx.fillStyle = `rgba(14,10,9,${dim})`; ctx.fillRect(0, 0, 1080, 1920); };
  // empty rooms are drawn once and reused as the soft background (blurring a picture is cheap; blurring every stroke is not)
  const cache = {}; const room = (key, fn) => { if (!cache[key]) { const c = document.createElement("canvas"); c.width = 1080; c.height = 1920; fn(c.getContext("2d")); cache[key] = c; } return cache[key]; };
  const FLAT = (ctx) => cam(ctx, 600, 1050, 1.7, () => ctx.drawImage(room("flat", (c) => drawFlat(c, { zara: false })), 0, 0));
  const BED = (ctx) => cam(ctx, 560, 1050, 1.5, () => ctx.drawImage(room("bed", (c) => drawBedroom(c, { zara: false })), 0, 0));
  const NIGHT = { look: "night" };
  const BLAZER = "#efe2cc";
  // the phone in her hand, in the room she is in
  const inHand = (ctx, room, screen, o = {}) => { soft(ctx, 18, 0.38, () => room(ctx)); heldPhone(ctx, o.x || 640, o.y || 900, o.w || 520, screen, { sleeve: o.night ? null : BLAZER, thumbAt: o.thumb, rot: o.rot, glowC: o.night ? "rgba(170,200,255,.3)" : undefined }); };
  // her face, close, the room soft behind
  const face = (ctx, room, expr, o = {}) => { soft(ctx, 16, 0.3, () => room(ctx)); const H = o.H || 2500; drawZara(ctx, 540 + (o.x || 0), (o.y || 980) + 0.868 * H, H, expr, { glow: o.glow ?? 1, tilt: o.tilt || 0, look: o.look, mascara: o.mascara }); };
  const sofa = (ctx, expr, pose, s = 1.55, cy = 1080) => cam(ctx, 590, cy, s, () => drawFlat(ctx, { expr, pose }));
  const EAR = { sit: true, armL: [0.25, -0.4], armR: [0.95, -3.95], phone: "R", tilt: 0.05 };
  // a daydream: full frame, with a soft cloud edge so it reads as a thought
  const dream = (ctx, fn, tag) => { fn(); ctx.save(); ctx.fillStyle = "#fff8ec"; ctx.filter = "blur(8px)"; for (let i = 0; i < 40; i++) { const t = i / 40 * 6.283, x = 540 + Math.cos(t) * 640, y = 960 + Math.sin(t) * 1080; ctx.beginPath(); ctx.arc(x, y, 190 + 40 * Math.sin(i * 2.3), 0, 6.3); ctx.fill(); } ctx.restore(); [[170, 1640, 44], [100, 1740, 26]].forEach(([x, y, r]) => { ctx.fillStyle = "#fff8ec"; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.fill(); }); label(ctx, tag, 470, 420, { size: 38 }); };
  const ballroom = (ctx) => { const b = ctx.createLinearGradient(0, 0, 0, 1920); b.addColorStop(0, "#f3d9b8"); b.addColorStop(1, "#c98a6a"); ctx.fillStyle = b; ctx.fillRect(0, 0, 1080, 1920); ctx.save(); ctx.filter = "blur(14px)"; for (let i = 0; i < 30; i++) { ctx.fillStyle = "rgba(255,240,200,.6)"; ctx.beginPath(); ctx.arc((i * 197) % 1080, 300 + (i * 131) % 500, 14 + (i % 4) * 6, 0, 6.3); ctx.fill(); } ctx.restore(); ctx.fillStyle = "rgba(120,60,40,.35)"; ctx.fillRect(0, 1500, 1080, 420); };
  const guest = (ctx, x, y, s, turn, skin, suit) => { ctx.save(); ctx.filter = "blur(3px)"; zform(ctx, (c) => c.roundRect(x - 90 * s, y, 180 * s, 520 * s, 60 * s), suit, [x - 90 * s, y, 180 * s, 520 * s], { rimW: 0 }); zform(ctx, (c) => c.ellipse(x, y - 70 * s, 62 * s, 72 * s, 0, 0, 6.3), skin, [x - 62 * s, y - 142 * s, 124 * s, 144 * s], { rimW: 0 }); ctx.fillStyle = "#1c1210"; [-1, 1].forEach((e) => { ctx.beginPath(); ctx.arc(x + turn * 22 * s + e * 20 * s, y - 76 * s, 7 * s, 0, 6.3); ctx.fill(); }); ctx.beginPath(); ctx.ellipse(x + turn * 24 * s, y - 40 * s, 11 * s, 14 * s, 0, 0, 6.3); ctx.fill(); ctx.restore(); };
  const T = (t) => screenThread("Miles", [{ t: "happy birthday x", me: false }, { t: "thanks!", me: true }], t, { label: "LAST MESSAGE: 14 MONTHS AGO" });
  const strip = (ctx, x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.rotate(-0.06); ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.fillRect(-110 * s + 14, -330 * s + 18, 220 * s, 660 * s); ctx.fillStyle = "#fbf4e8"; ctx.fillRect(-110 * s, -330 * s, 220 * s, 660 * s);
    [0, 1, 2].forEach((i) => { const fy = -310 * s + i * 212 * s; ctx.fillStyle = "#3a2a3a"; ctx.fillRect(-92 * s, fy, 184 * s, 196 * s); ctx.save(); ctx.beginPath(); ctx.rect(-92 * s, fy, 184 * s, 196 * s); ctx.clip();
      zform(ctx, (c) => c.ellipse(-36 * s, fy + 120 * s, 44 * s, 50 * s, 0, 0, 6.3), ZC.skin, [-80 * s, fy + 70 * s, 88 * s, 100 * s], { rimW: 0 }); ctx.fillStyle = ZC.hair; ctx.beginPath(); ctx.ellipse(-36 * s, fy + 96 * s, 50 * s, 44 * s, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(-86 * s, fy + 96 * s, 22 * s, 100 * s);
      zform(ctx, (c) => c.ellipse(44 * s, fy + 108 * s, 46 * s, 54 * s, 0, 0, 6.3), "#c98a62", [-2 * s, fy + 54 * s, 92 * s, 108 * s], { rimW: 0 }); ctx.fillStyle = "#3a241a"; ctx.beginPath(); ctx.ellipse(44 * s, fy + 76 * s, 48 * s, 30 * s, 0, Math.PI, 0); ctx.fill(); ctx.restore(); }); ctx.restore(); };

  g.EP01 = {
    title: "She said yes", daysStart: 30, dignityStart: 61,
    shots: [
      { dur: 1.8, cap: [["SHE SAID ", 0], ["YES", 1]], vo: "N: Zara just said yes to her ex's wedding.", hud: false, draw: (ctx) => inHand(ctx, FLAT, screenInvite(true), { thumb: [0.84, 0.78] }) },
      { dur: 1.4, cap: [["to her ", 0], ["EX'S", 1], [" wedding", 0]], hud: false, draw: (ctx) => face(ctx, FLAT, "dread") },
      { dur: 2.0, cap: [["30", 1], [" DAYS", 0]], vo: "N: It is in thirty days.", draw: (ctx) => drawFlat(ctx, { expr: "dread" }) },
      { dur: 1.6, draw: (ctx) => inHand(ctx, FLAT, screenThread("Remy", [], "i said yes"), { thumb: [0.86, 0.9] }) },
      { dur: 2.0, cap: [["TAKE IT ", 0], ["BACK", 1]], draw: (ctx) => inHand(ctx, FLAT, screenThread("Remy", [{ t: "i said yes", me: true }, { t: "TO WHAT", me: false }, { t: "ZARA.", me: false }, { t: "take it back", me: false }], ""), { thumb: [0.9, 0.62], rot: 0.04, x: 620 }) },
      { dur: 2.8, cap: [["3", 1], [" YEARS / ", 0], ["5", 1], [" MONTHS", 0]], vo: "N: They were together three years. He met Ivy five months later.",
        draw: (ctx) => { soft(ctx, 18, 0.45, () => FLAT(ctx));
          ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 534, 1920); ctx.clip(); strip(ctx, 268, 900, 1.5); ctx.restore();
          ctx.save(); ctx.beginPath(); ctx.rect(546, 0, 534, 1920); ctx.clip(); ctx.fillStyle = "rgba(14,10,9,.35)"; ctx.fillRect(546, 0, 534, 1920); heldPhone(ctx, 800, 900, 430, screenPost(), { sleeve: BLAZER, thumbAt: [0.85, 0.9], rot: 0.03 }); ctx.restore();
          ctx.fillStyle = "#120d0a"; ctx.fillRect(534, 0, 12, 1920);
          label(ctx, "MILES · 3 YEARS", 268, 480); label(ctx, "IVY · 5 MONTHS LATER", 800, 400, { size: 28 }); } },
      { dur: 2.8, cap: [["her actual ", 0], ["JOB", 1]], vo: "N: Zara plans other people's big days for a living, which has stopped being funny.", draw: (ctx) => { drawOffice(ctx); label(ctx, "EVENTS DIRECTOR · WEDDINGS", 470, 470, { size: 30 }); } },
      { dur: 2.6, cap: [["I'm being ", 0], ["MATURE", 1]], vo: "Z: It's fine. I'm being mature.", draw: (ctx) => sofa(ctx, "frozen", EAR, 2.5, 960) },
      { dur: 1.8, cap: [["she was ", 0], ["NOT", 1]], vo: "N: She was not being mature.", dignity: 54, draw: (ctx) => face(ctx, FLAT, "slip", { glow: 0, H: 2300, tilt: 0.05 }) },
      { dur: 1.4, draw: (ctx) => cam(ctx, 560, 1150, 1.9, () => drawFlat(ctx, { zara: false, after: (c) => { const H = 780; c.save(); c.translate(660, 1262); c.rotate(-1.2); drawZara(c, 0, 0.5 * H, H, "hiding", { noCushion: true, armL: [0.9, -1.6], armR: [0.2, 0.3] }); c.restore(); zform(c, (k) => k.roundRect(300, 1086, 176, 150, 40), "#d9643a", [300, 1086, 176, 150], { rimW: 6, lo: 0.4 }); } })) },
      { dur: 2.4, cap: [["THE ", 0], ["PLAN", 1]], vo: "N: The plan is to walk in looking incredible.",
        draw: (ctx) => dream(ctx, () => { ballroom(ctx); guest(ctx, 150, 900, 1.5, 1, "#c08a62", "#3a2a30"); guest(ctx, 930, 880, 1.5, -1, "#7a5640", "#4a3a44"); guest(ctx, 330, 780, 1.0, 1, "#e3b594", "#5a4a40"); guest(ctx, 790, 770, 1.0, -1, "#b0714f", "#2a1f1d"); drawZara(ctx, 540, 1640, 1250, "plotting", { look: "dress", stride: true, armL: [0.35, 0.2], armR: [0.3, -0.3] }); }, "THE PLAN") },
      { dur: 2.4, cap: [["more ", 0], ["LIKELY", 1]], vo: "N: The plan has not accounted for the buffet.",
        draw: (ctx) => dream(ctx, () => { ballroom(ctx); const H = 2300; drawZara(ctx, 500, 1000 + 0.868 * H, H, "raw", { look: "dress", mascara: true, glow: 0, armL: [0.2, 0.1], armR: [0.7, -3.2], pastry: true, tilt: -0.04 }); }, "MORE LIKELY") },
      { dur: 1.4, cap: [["1:12", 1], [" AM", 0]], draw: (ctx) => cam(ctx, 420, 1130, 1.45, () => drawBedroom(ctx, { expr: "raw" })) },
      { dur: 2.2, vo: "N: By one in the morning she has written to him nine times.", draw: (ctx) => inHand(ctx, BED, T("congrats!! can't wait x"), { night: true, thumb: [0.86, 0.9] }) },
      { dur: 2.0, cap: [["old t-shirt, ", 0], ["DRAFT NINE", 1]], draw: (ctx) => face(ctx, BED, "slip", { look: "night", H: 3300, y: 960 }) },
      { dur: 2.2, cap: [["SENT: ", 0], ["NONE", 1]], vo: "N: She has sent none of them.",  draw: (ctx) => { inHand(ctx, BED, T("i said yes so you'd think i'm fine"), { night: true, thumb: [0.8, 0.84], y: 790, x: 670 }); label(ctx, "DRAFT 9", 670, 700, { size: 36 }); } },
      { dur: 1.4, draw: (ctx) => face(ctx, BED, "raw", { look: "night", H: 4300, y: 900 }) },
      { dur: 2.4, vo: "N: So she writes it somewhere he can't read it.",
        draw: (ctx) => { soft(ctx, 14, 0.3, () => BED(ctx)); heldPhone(ctx, 640, 860, 470, screenHeartly(0, null), { thumbAt: [0.7, 0.62], rot: 0.05, glowC: "rgba(255,200,150,.3)" });
          ctx.save(); ctx.filter = "blur(7px)"; zform(ctx, (c) => c.ellipse(170, 1660, 330, 400, 0.1, 0, 6.3), ZC.hair, [-160, 1260, 660, 800], { rimW: 16 }); zform(ctx, (c) => c.ellipse(210, 1230, 170, 130, 0, 0, 6.3), ZC.hair, [40, 1100, 340, 260], { rimW: 10 }); zform(ctx, (c) => c.ellipse(420, 1900, 240, 150, -0.3, 0, 6.3), ZC.tee, [180, 1750, 480, 300], { rimW: 10 }); ctx.restore(); } },
      { dur: 3.4, cap: [["keeps coming ", 0], ["BACK", 1]],  draw: (ctx) => inHand(ctx, BED, screenHeartly(0, [["that he's ", false], ["fine without me", true]]), { night: true, thumb: [0.8, 0.62], y: 790, x: 680, w: 540 }) },
      { dur: 2.6, cap: [["you're still ", 0], ["AWAKE", 1]], draw: (ctx) => face(ctx, BED, "caught", { look: "night", H: 3300, y: 960, tilt: -0.04 }) },
      { dur: 3.6, cap: [["what should he ", 0], ["THINK", 1]],  draw: (ctx) => inHand(ctx, BED, screenHeartly(2), { night: true, thumb: [0.9, 0.72], y: 790, x: 680, w: 540 }) },
      { dur: 2.6, cap: [["that I'm ", 0], ["FINE", 1]], vo: "Z: That I'm fine.", draw: (ctx) => face(ctx, BED, "raw", { look: "night", H: 3300, y: 960 }) },
      { dur: 5.8, cap: [["CALL", 1], [" or ", 0], ["SEND", 1]], vo: "N: What would you do?", capY: 1500,
        draw: (ctx) => { soft(ctx, 20, 0.55, () => BED(ctx)); voteCard(ctx,
          { word: "CALL", sub: "tell Remy the real reason", color: "#f6ecdc", draw: (c) => drawZara(c, 250, 1300, 1250, "smile", { look: "night", armL: [0.2, 0.1], armR: [0.95, -3.95], phone: "R" }) },
          { word: "SEND", sub: "send Miles draft nine", color: "#f0b34a", draw: (c) => heldPhone(c, 230, 400, 300, T("i said yes so you'd think i'm fine"), { thumbAt: [0.86, 0.86], glow: 0 }) }); } },
      { dur: 3.4, cap: [["29", 1], [" DAYS", 0]], vo: "N: Twenty-nine days.", days: 29, draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
