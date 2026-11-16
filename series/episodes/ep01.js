// Episode 1, "She said yes". One entry per shot of scripts/series/ep01.md: how long it runs, its caption, who speaks,
// and a draw(ctx, k) where k runs 0..1 through the shot. A new episode is a new file like this one; the kit does the rest.
(function (g) {
  const ST = "graphic"; // Zara's look (option B)
  const cam = (ctx, cx, cy, s, fn) => { ctx.save(); ctx.translate(540, 960); ctx.scale(s, s); ctx.translate(-cx, -cy); fn(); ctx.restore(); };
  const night = (ctx, c = "rgba(196,100,60,.3)") => { ctx.fillStyle = "#120d0a"; ctx.fillRect(0, 0, 1080, 1920); const r = ctx.createRadialGradient(540, 900, 0, 540, 900, 900); r.addColorStop(0, c); r.addColorStop(1, "rgba(18,13,10,0)"); ctx.fillStyle = r; ctx.fillRect(0, 0, 1080, 1920); };
  const blurBg = (ctx, px, fn) => { ctx.save(); ctx.filter = `blur(${px}px)`; fn(); ctx.restore(); ctx.fillStyle = "rgba(18,13,10,.35)"; ctx.fillRect(0, 0, 1080, 1920); };
  // her face, close: the room behind goes soft
  const face = (ctx, expr, o = {}) => {
    blurBg(ctx, 16, () => cam(ctx, 560, 900, 1.9, () => drawFlat(ctx, { style: ST, zara: false })));
    const H = o.H || 2500; drawZara(ctx, 540 + (o.x || 0), (o.y || 960) + 0.868 * H, H, ST, expr, { glow: o.glow ?? 1, tilt: o.tilt || 0, cushion: o.cushion });
  };
  const bigPhone = (ctx, screen, o = {}) => { night(ctx, o.c); phone(ctx, 540, o.y || 930, o.w || 600, screen, { rot: o.rot || 0 }); };
  const sofa = (ctx, expr, pose, o = {}) => cam(ctx, 540, 1010, 1.55, () => drawFlat(ctx, { style: ST, expr, pose, zx: o.zx || 0 }));
  const EAR = { sit: true, armL: [0.25, -0.4], armR: [0.95, -3.95], phone: "R", tilt: 0.05 };
  const dressed = (colors, fn) => { const keep = { ...ZC }; Object.assign(ZC, colors); fn(); Object.assign(ZC, keep); };
  const clock = (ctx) => {
    night(ctx, "rgba(90,110,190,.22)");
    zform(ctx, (c) => c.roundRect(-40, 1180, 1160, 500, 30), "#4a2f24", [-40, 1180, 1160, 500], { rimW: 0, lo: 0.6 });
    zform(ctx, (c) => c.roundRect(170, 880, 560, 310, 46), "#2a201c", [170, 880, 560, 310], { rimW: 10 });
    ctx.fillStyle = "#0e0a09"; ctx.beginPath(); ctx.roundRect(200, 910, 500, 250, 30); ctx.fill();
    ctx.save(); ctx.shadowColor = "#ff9a5a"; ctx.shadowBlur = 40; ctx.fillStyle = "#ffb27a"; ctx.font = "600 190px Inter"; ctx.textAlign = "center"; ctx.fillText("1:12", 450, 1100); ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = "screen"; const p = ctx.createRadialGradient(1000, 1150, 0, 1000, 1150, 560); p.addColorStop(0, "rgba(170,200,255,.5)"); p.addColorStop(1, "rgba(170,200,255,0)"); ctx.fillStyle = p; ctx.fillRect(0, 380, 1080, 1300); ctx.restore();
    zform(ctx, (c) => c.ellipse(1010, 1250, 250, 120, -0.1, 0, 6.3), "#e9dcc6", [760, 1130, 500, 240], { rimW: 0, lo: 0.5 }); // pillow
    zform(ctx, (c) => c.roundRect(60, 1090, 80, 96, 16), "#d9643a", [60, 1090, 80, 96], { rimW: 5 }); // a glass of water she won't drink
  };
  const shop = (ctx) => {
    ctx.fillStyle = "#120d0a"; ctx.fillRect(0, 0, 1080, 1920);
    const w = ctx.createLinearGradient(0, 380, 0, 1200); w.addColorStop(0, "#e6cfa8"); w.addColorStop(1, "#c9a87c"); ctx.fillStyle = w; ctx.fillRect(0, 380, 1080, 900);
    ctx.save(); ctx.globalCompositeOperation = "screen"; const sun = ctx.createRadialGradient(880, 420, 0, 880, 420, 800); sun.addColorStop(0, "rgba(255,240,200,.7)"); sun.addColorStop(1, "rgba(255,240,200,0)"); ctx.fillStyle = sun; ctx.fillRect(0, 380, 1080, 900); ctx.restore();
    // ribbon wall
    ctx.save(); ctx.filter = "blur(3px)";
    ["#d9643a", "#f3d9c8", "#d9b26a", "#7f9a78", "#c98aa0", "#fbf4e8"].forEach((c, i) => { const x = 110 + i * 150; zform(ctx, (k) => k.ellipse(x, 520, 44, 44, 0, 0, 6.3), c, [x - 44, 476, 88, 88], { rimW: 4 }); ctx.fillStyle = c; ctx.fillRect(x - 8, 540, 16, 150 + (i % 3) * 40); });
    // buckets of stems
    [[150, "#f3d9c8"], [420, "#e8a38a"], [900, "#fbf4e8"]].forEach(([x, c]) => { zform(ctx, (k) => { k.moveTo(x - 80, 900); k.lineTo(x + 80, 900); k.lineTo(x + 64, 1110); k.lineTo(x - 64, 1110); k.closePath(); }, "#8f887a", [x - 80, 900, 160, 210], { rimW: 6 }); ctx.strokeStyle = "#4f6a45"; ctx.lineWidth = 7; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(x + i * 20, 905); ctx.lineTo(x + i * 44, 760 - Math.abs(i) * 12); ctx.stroke(); zform(ctx, (k) => k.ellipse(x + i * 44, 748 - Math.abs(i) * 12, 34, 34, 0, 0, 6.3), c, [x + i * 44 - 34, 714, 68, 68], { rimW: 3 }); } });
    ctx.restore();
    // the bench, and her hands tying a bride's bouquet
    zform(ctx, (c) => c.roundRect(-40, 1180, 1160, 420, 20), "#8a5a3c", [-40, 1180, 1160, 420], { rimW: 0, lo: 0.55, sx: 0.02, sy: -0.2 });
    ctx.save(); ctx.filter = "blur(14px)"; ctx.fillStyle = "rgba(20,10,6,.45)"; ctx.beginPath(); ctx.ellipse(540, 1250, 300, 40, 0, 0, 6.3); ctx.fill(); ctx.restore();
    ctx.strokeStyle = "#4f6a45"; ctx.lineWidth = 16; ctx.lineCap = "round"; [-40, -14, 12, 38].forEach((d) => { ctx.beginPath(); ctx.moveTo(540 + d, 1080); ctx.lineTo(540 + d * 0.5, 1330); ctx.stroke(); });
    [[-150, 880, "#f3d9c8", 78], [0, 820, "#fbf4e8", 88], [150, 880, "#e8a38a", 78], [-80, 980, "#fbf4e8", 70], [80, 980, "#f3d9c8", 72], [0, 930, "#e9c3b0", 64]].forEach(([dx, y, c, r]) => { for (let i = 0; i < 7; i++) { const a = i * 0.9, px = 540 + dx + Math.cos(a) * r * 0.5, py = y + Math.sin(a) * r * 0.5; zform(ctx, (k) => k.ellipse(px, py, r * 0.52, r * 0.52, 0, 0, 6.3), c, [px - r * 0.55, py - r * 0.55, r * 1.1, r * 1.1], { rimW: r * 0.06 }); } });
    zform(ctx, (c) => c.roundRect(486, 1120, 108, 60, 12), "#d9b26a", [486, 1120, 108, 60], { rimW: 4 }); // the ribbon she's tying
    [[-1, 60, 1560, 440, 1190], [1, 1020, 1560, 640, 1190]].forEach(([sd, x0, y0, x1, y1]) => {
      const a = Math.atan2(y1 - y0, x1 - x0); const cap = (r, k0, k1) => (c) => { const ax = x0 + (x1 - x0) * k0, ay = y0 + (y1 - y0) * k0, bx = x0 + (x1 - x0) * k1, by = y0 + (y1 - y0) * k1; c.arc(ax, ay, r, a + Math.PI / 2, a - Math.PI / 2); c.arc(bx, by, r, a - Math.PI / 2, a + Math.PI / 2); c.closePath(); };
      zform(ctx, cap(74, 0, 0.82), ZC.cardi, [Math.min(x0, x1) - 80, y1 - 80, Math.abs(x1 - x0) + 160, y0 - y1 + 160], { rimW: sd > 0 ? 10 : 0 });
      zform(ctx, cap(58, 0.86, 1.02), ZC.skin, [x1 - 90, y1 - 80, 180, 170], { rimW: sd > 0 ? 7 : 0 });
    });
    const top = ctx.createLinearGradient(0, 380, 0, 470); top.addColorStop(0, "#120d0a"); top.addColorStop(1, "rgba(18,13,10,0)"); ctx.fillStyle = top; ctx.fillRect(0, 380, 1080, 90);
    const bot = ctx.createLinearGradient(0, 1500, 0, 1640); bot.addColorStop(0, "rgba(18,13,10,0)"); bot.addColorStop(1, "#120d0a"); ctx.fillStyle = bot; ctx.fillRect(0, 1500, 1080, 420);
  };
  const REMY = [{ t: "i said yes", me: true }];
  const T = (t) => screenThread("Miles", [{ t: "happy birthday x", me: false }, { t: "thanks!", me: true }], t, { label: "LAST MESSAGE: 14 MONTHS AGO" });

  g.EP01 = {
    title: "She said yes", daysStart: 30, dignityStart: 61, style: ST,
    shots: [
      { dur: 1.8, cap: [["SHE SAID ", 0], ["YES", 1]], vo: "N: Zara just said yes to her ex's wedding.", hud: false,
        draw: (ctx) => { bigPhone(ctx, screenInvite(true), { w: 640, y: 900, rot: -0.03 }); thumb(ctx, 800, 1250, 120, -0.6); } },
      { dur: 1.4, cap: [["to her ", 0], ["EX'S", 1], [" wedding", 0]], hud: false, draw: (ctx) => face(ctx, "dread") },
      { dur: 2.0, cap: [["30", 1], [" DAYS", 0]], vo: "N: It is in thirty days.", draw: (ctx) => drawFlat(ctx, { style: ST, expr: "dread" }) },
      { dur: 1.6, draw: (ctx) => bigPhone(ctx, screenThread("Remy", [], "i said yes")) },
      { dur: 2.0, cap: [["TAKE IT ", 0], ["BACK", 1]], draw: (ctx) => bigPhone(ctx, screenThread("Remy", [...REMY, { t: "TO WHAT", me: false }, { t: "ZARA.", me: false }, { t: "take it back", me: false }], "")) },
      { dur: 2.8, cap: [["3", 1], [" YEARS / ", 0], ["5", 1], [" MONTHS", 0]], vo: "N: They were together three years. He met Ivy five months later.",
        draw: (ctx) => {
          night(ctx);
          ctx.save(); ctx.beginPath(); ctx.rect(0, 380, 532, 1180); ctx.clip(); cam(ctx, 400, 590, 4.2, () => drawFlat(ctx, { style: ST, zara: false })); ctx.fillStyle = "rgba(18,13,10,.18)"; ctx.fillRect(0, 380, 540, 1180); ctx.restore();
          ctx.save(); ctx.beginPath(); ctx.rect(548, 380, 532, 1180); ctx.clip(); ctx.fillStyle = "#1c1410"; ctx.fillRect(548, 380, 532, 1180); phone(ctx, 814, 940, 420, screenPost()); ctx.restore();
          label(ctx, "MILES · 3 YEARS", 270, 1300); label(ctx, "IVY · 5 MONTHS LATER", 814, 520, { size: 30 });
        } },
      { dur: 2.8, cap: [["her actual ", 0], ["JOB", 1]], vo: "N: Zara makes wedding flowers for a living, which has stopped being funny.", draw: (ctx) => { shop(ctx); label(ctx, "HER JOB", 540, 660); } },
      { dur: 2.6, cap: [["I'm being ", 0], ["MATURE", 1]], vo: "Z: It's fine. I'm being mature.", draw: (ctx) => sofa(ctx, "frozen", EAR) },
      { dur: 1.8, cap: [["she was ", 0], ["NOT", 1]], vo: "N: She was not being mature.", dignity: 54, draw: (ctx) => sofa(ctx, "frozen", EAR) },
      { dur: 1.4, draw: (ctx) => sofa(ctx, "hiding", { sit: true, armL: [0.5, -2.3], armR: [0.5, -2.3], lean: 0.16 }) },
      { dur: 2.4, cap: [["THE ", 0], ["PLAN", 1]], vo: "N: The plan is to walk in looking incredible.",
        draw: (ctx) => { blurBg(ctx, 10, () => sofa(ctx, "plotting", { sit: true, armL: [0.2, -0.3], armR: [0.2, -0.3] }));
          thought(ctx, 540, 860, 330, (c) => { c.fillStyle = "#f3d9c8"; c.fillRect(0, 0, 1080, 1920); [200, 880].forEach((x, i) => { c.save(); c.globalAlpha = 0.45; dressed({ cardi: "#8a7a6a", tee: "#b9a78d", trousers: "#5a4a40" }, () => drawZara(c, x, 1150, 520, "graphic", "caught", { armL: [0.2, 0.1], armR: [0.2, 0.1] })); c.restore(); }); dressed({ cardi: "#c0392b", tee: "#c0392b", trousers: "#c0392b" }, () => drawZara(c, 540, 1190, 640, "graphic", "plotting", { armL: [0.5, 0.3], armR: [0.3, 0.2] })); }, [0.2, 1]);
          label(ctx, "THE PLAN", 540, 520); } },
      { dur: 2.4, cap: [["more ", 0], ["LIKELY", 1]], vo: "N: The plan has not accounted for the buffet.",
        draw: (ctx) => { blurBg(ctx, 10, () => sofa(ctx, "dread", { sit: true, armL: [0.2, -0.3], armR: [0.2, -0.3] }));
          thought(ctx, 540, 860, 330, (c) => { c.fillStyle = "#e9dcc6"; c.fillRect(0, 0, 1080, 1920); zform(c, (k) => k.roundRect(160, 1010, 760, 60, 10), "#fbf4e8", [160, 1010, 760, 60], { rimW: 0 }); [240, 330, 760, 850].forEach((x, i) => zform(c, (k) => k.ellipse(x, 1000, 34, 22, 0, 0, 6.3), ["#d9b26a", "#e8a38a"][i % 2], [x - 34, 978, 68, 44], { rimW: 0 })); dressed({ cardi: "#c0392b", tee: "#c0392b", trousers: "#c0392b" }, () => drawZara(c, 540, 1190, 640, "graphic", "raw", { armL: [0.2, 0.1], armR: [0.3, -2.3] })); zform(c, (k) => k.ellipse(585, 745, 34, 24, 0, 0, 6.3), "#d9b26a", [551, 721, 68, 48], { rimW: 0 }); }, [0.2, 1]);
          label(ctx, "MORE LIKELY", 540, 520); } },
      { dur: 1.4, cap: [["1:12", 1], [" AM", 0]], draw: (ctx) => clock(ctx) },
      { dur: 2.2, vo: "N: By one in the morning she has written to him nine times.", draw: (ctx) => bigPhone(ctx, T("congrats!! can't wait x"), { c: "rgba(90,110,190,.2)" }) },
      { dur: 2.0, draw: (ctx) => bigPhone(ctx, T("who invites their ex"), { c: "rgba(90,110,190,.2)" }) },
      { dur: 2.2, cap: [["SENT: ", 0], ["NONE", 1]], vo: "N: She has sent none of them.", draw: (ctx) => { bigPhone(ctx, T("i said yes so you'd think i'm fine"), { c: "rgba(90,110,190,.2)" }); thumb(ctx, 880, 1440, 120, -0.75); label(ctx, "DRAFT 9 · SENT: 0", 540, 1010); } },
      { dur: 1.4, draw: (ctx) => face(ctx, "raw", { H: 4300, y: 900 }) },
      { dur: 2.4, vo: "N: So she writes it somewhere he can't read it.",
        draw: (ctx) => { night(ctx, "rgba(120,72,48,.4)"); phone(ctx, 610, 900, 520, screenHeartly(0, null), { rot: 0.04 });
          ctx.save(); ctx.filter = "blur(12px)"; [[120, 1500, 300], [330, 1640, 240], [-20, 1250, 230], [200, 1300, 200]].forEach(([x, y, r]) => { ctx.fillStyle = "#1c110e"; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.fill(); }); ctx.restore();
          thumb(ctx, 840, 1330, 110, -0.6); thumb(ctx, 400, 1380, 110, 0.6); } },
      { dur: 3.8, cap: [["keeps coming ", 0], ["BACK", 1]], draw: (ctx) => bigPhone(ctx, screenHeartly(0, [["that he's ", false], ["fine without me", true]]), { w: 760, y: 1090, c: "rgba(120,72,48,.4)" }) },
      { dur: 4.0, cap: [["still ", 0], ["AWAKE", 1]], draw: (ctx) => bigPhone(ctx, screenHeartly(1), { w: 760, y: 1090, c: "rgba(120,72,48,.4)" }) },
      { dur: 3.8, cap: [["what should he ", 0], ["THINK", 1]], draw: (ctx) => bigPhone(ctx, screenHeartly(2), { w: 760, y: 1090, c: "rgba(120,72,48,.4)" }) },
      { dur: 2.6, cap: [["that I'm ", 0], ["FINE", 1]], vo: "Z: That I'm fine.", draw: (ctx) => face(ctx, "caught") },
      { dur: 5.8, cap: [["CALL", 1], [" or ", 0], ["SEND", 1]], vo: "N: What would you do?", capY: 1500,
        draw: (ctx) => { night(ctx, "rgba(120,72,48,.3)"); voteCard(ctx,
          { word: "CALL", sub: "tell Remy the real reason", color: "#f6ecdc", draw: (c) => drawZara(c, 250, 1290, 1250, "graphic", "smile", { armL: [0.2, 0.1], armR: [0.95, -3.95], phone: "R" }) },
          { word: "SEND", sub: "send Miles draft nine", color: "#f0b34a", draw: (c) => { phone(c, 250, 420, 330, T("i said yes so you'd think i'm fine"), { glow: 0 }); thumb(c, 400, 690, 70, -0.75); } }); } },
      { dur: 3.4, cap: [["29", 1], [" DAYS", 0]], vo: "N: Twenty-nine days.", days: 29,
        draw: (ctx) => { bigPhone(ctx, screenInvite(true), { w: 640, y: 900, rot: -0.03 }); thumb(ctx, 800, 1250, 120, -0.6); } },
    ],
  };
})(globalThis);
