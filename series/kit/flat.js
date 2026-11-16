// Zara's flat at night, built in layers (back wall, furniture, her, foreground) with one warm lamp as the key light.
// drawFlat(ctx, o): o.style picks her look; o.expr her face; o.par is a parallax offset in px (camera moves).
(function (g) {
  const W = 1080, H = 1920, FLOOR = 1300;
  const blurred = (ctx, px, fn) => { ctx.save(); ctx.filter = `blur(${px}px)`; fn(); ctx.restore(); };
  const shadow = (ctx, x, y, rx, ry, a = 0.45) => blurred(ctx, 16, () => { ctx.fillStyle = `rgba(8,4,3,${a})`; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.3); ctx.fill(); });
  const box = (x, y, w, h, r) => (c) => c.roundRect(x, y, w, h, r);
  function flower(ctx, x, y, r, col) {
    for (let i = 0; i < 7; i++) { const a = i * 0.9, px = x + Math.cos(a) * r * 0.55, py = y + Math.sin(a) * r * 0.55; zform(ctx, (c) => c.ellipse(px, py, r * 0.55, r * 0.55, 0, 0, 6.3), col, [px - r * 0.6, py - r * 0.6, r * 1.2, r * 1.2], { rimW: r * 0.08 }); }
    zform(ctx, (c) => c.ellipse(x, y, r * 0.4, r * 0.4, 0, 0, 6.3), zdark(col, 0.25), [x - r * 0.4, y - r * 0.4, r * 0.8, r * 0.8], { rimW: 0 });
  }
  function bouquet(ctx, x, y, s, cols) {
    ctx.strokeStyle = "#4f6a45"; ctx.lineWidth = 5 * s; ctx.lineCap = "round";
    const heads = [[-46, -150], [0, -185], [44, -150], [-22, -118], [26, -112]];
    heads.forEach(([dx, dy]) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + dx * s * 0.3, y + dy * s * 0.5, x + dx * s, y + dy * s); ctx.stroke(); });
    heads.forEach(([dx, dy], i) => flower(ctx, x + dx * s, y + dy * s, 30 * s, cols[i % cols.length]));
  }
  g.drawFlat = function (ctx, o = {}) {
    const par = o.par || 0, style = o.style || "soft";
    ctx.fillStyle = "#120d0a"; ctx.fillRect(0, 0, W, H);
    // ---------- back layer: wall, window, things on the wall (moves least)
    ctx.save(); ctx.translate(par * 0.3, 0);
    const wall = ctx.createLinearGradient(0, 380, 0, FLOOR); wall.addColorStop(0, "#3d2520"); wall.addColorStop(1, "#2a1814");
    ctx.fillStyle = wall; ctx.fillRect(-60, 380, W + 120, FLOOR - 380);
    ctx.save(); ctx.globalAlpha = 0.07; ctx.fillStyle = "#f6dcc0"; for (let x = -60; x < W + 60; x += 54) ctx.fillRect(x, 380, 2, FLOOR - 380); ctx.restore(); // wallpaper stripe
    // lamp light pooling on the wall
    ctx.save(); ctx.globalCompositeOperation = "screen"; const lg = ctx.createRadialGradient(200, 700, 0, 200, 700, 620); lg.addColorStop(0, "rgba(255,170,95,.62)"); lg.addColorStop(0.5, "rgba(230,120,70,.2)"); lg.addColorStop(1, "rgba(230,120,70,0)"); ctx.fillStyle = lg; ctx.fillRect(-60, 380, W + 120, FLOOR - 380); ctx.restore();
    // window: night, a railway bridge, one lit train
    zform(ctx, box(606, 452, 318, 372, 10), "#d8c3a2", [606, 452, 318, 372], { rimW: 0, lo: 0.5 });
    ctx.save(); ctx.beginPath(); ctx.roundRect(624, 470, 282, 336, 4); ctx.clip();
    const sky = ctx.createLinearGradient(0, 470, 0, 806); sky.addColorStop(0, "#1b1b3a"); sky.addColorStop(1, "#3a2c4a"); ctx.fillStyle = sky; ctx.fillRect(624, 470, 282, 336);
    ctx.save(); ctx.filter = "blur(10px)"; ctx.fillStyle = "rgba(255,240,210,.5)"; ctx.beginPath(); ctx.arc(840, 540, 44, 0, 6.3); ctx.fill(); ctx.restore();
    ctx.fillStyle = "#f6ecd2"; ctx.beginPath(); ctx.arc(840, 540, 26, 0, 6.3); ctx.fill();
    ctx.fillStyle = "#15122a"; ctx.fillRect(624, 690, 282, 26); for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.rect(634 + i * 74, 716, 16, 90); ctx.fill(); ctx.beginPath(); ctx.arc(679 + i * 74, 716, 29, 0, Math.PI, true); ctx.rect(650 + i * 74, 716, 58, 0); ctx.fill(); }
    ctx.fillStyle = "#15122a"; ctx.fillRect(624, 716, 282, 14);
    ctx.fillStyle = "#ffd98a"; for (let i = 0; i < 6; i++) ctx.fillRect(650 + i * 22, 676, 14, 9);
    ctx.fillStyle = "#2a2350"; ctx.fillRect(644, 670, 140, 20); ctx.fillStyle = "#ffd98a"; for (let i = 0; i < 6; i++) ctx.fillRect(650 + i * 22, 675, 14, 9);
    ctx.restore();
    ctx.fillStyle = "#d8c3a2"; ctx.fillRect(760, 470, 10, 336); ctx.fillRect(624, 632, 282, 10);
    zform(ctx, box(590, 820, 350, 22, 6), "#e2cfae", [590, 820, 350, 22], { rimW: 0 });
    // corkboard with the photo strip she hasn't taken down
    zform(ctx, box(318, 500, 214, 176, 8), "#8a5a3c", [318, 500, 214, 176], { rimW: 0 });
    zform(ctx, box(330, 512, 190, 152, 4), "#b98556", [330, 512, 190, 152], { rimW: 0, lo: 0.2 });
    ctx.save(); ctx.translate(378, 590); ctx.rotate(-0.07); ctx.fillStyle = "#fbf4e8"; ctx.fillRect(-26, -64, 52, 128); ["#c98a5e", "#b06a48", "#d9a070"].forEach((c, i) => { ctx.fillStyle = "#3a2a3a"; ctx.fillRect(-21, -59 + i * 41, 42, 36); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(-8, -38 + i * 41, 8, 0, 6.3); ctx.arc(9, -40 + i * 41, 9, 0, 6.3); ctx.fill(); }); ctx.restore();
    ctx.fillStyle = "#d9643a"; ctx.beginPath(); ctx.arc(378, 522, 6, 0, 6.3); ctx.fill();
    ctx.save(); ctx.translate(462, 566); ctx.rotate(0.06); ctx.fillStyle = "#f3e2b8"; ctx.fillRect(-34, -30, 68, 60); ctx.fillStyle = "#8a6a4a"; for (let i = 0; i < 3; i++) ctx.fillRect(-24, -16 + i * 14, 48 - i * 10, 4); ctx.restore();
    ctx.save(); ctx.translate(470, 632); ctx.rotate(-0.04); ctx.fillStyle = "#e9c3b0"; ctx.fillRect(-30, -18, 60, 36); ctx.restore();
    // fairy lights over the window
    ctx.strokeStyle = "rgba(30,18,14,.8)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(560, 430); ctx.quadraticCurveTo(765, 470, 970, 426); ctx.stroke();
    for (let i = 0; i <= 12; i++) { const t = i / 12, x = 560 + 410 * t, y = 430 + 2 * 40 * t * (1 - t) - 4 * t + 6; ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.filter = "blur(7px)"; ctx.fillStyle = "rgba(255,200,120,.75)"; ctx.beginPath(); ctx.arc(x, y, 11, 0, 6.3); ctx.fill(); ctx.restore(); ctx.fillStyle = "#ffe2b0"; ctx.beginPath(); ctx.arc(x, y, 4, 0, 6.3); ctx.fill(); }
    // a small framed print and a bunch of flowers hung upside down to dry
    zform(ctx, box(96, 610, 92, 116, 4), "#d8c3a2", [96, 610, 92, 116], { rimW: 0 }); ctx.fillStyle = "#3a2a3a"; ctx.fillRect(106, 620, 72, 96); ctx.fillStyle = "#d9643a"; ctx.beginPath(); ctx.arc(142, 676, 22, 0, 6.3); ctx.fill(); ctx.fillStyle = "#f0cc72"; ctx.beginPath(); ctx.arc(156, 650, 9, 0, 6.3); ctx.fill();
    ctx.strokeStyle = "#6a5a3a"; ctx.lineWidth = 4; [[-10, 0], [0, 6], [10, 0]].forEach(([dx, dy], i) => { ctx.beginPath(); ctx.moveTo(552, 690); ctx.lineTo(552 + dx * 2.2, 770 + dy); ctx.stroke(); ctx.fillStyle = ["#c98aa0", "#d9b26a", "#e8a38a"][i]; ctx.beginPath(); ctx.arc(552 + dx * 2.4, 778 + dy, 13, 0, 6.3); ctx.fill(); }); ctx.fillStyle = "#b5654a"; ctx.fillRect(546, 684, 12, 8);
    // shelf of jars: dried petals from bouquets she was proud of
    zform(ctx, box(96, 560, 190, 14, 4), "#6a4630", [96, 560, 190, 14], { rimW: 0 });
    [["#d9643a", 118], ["#e8b8a0", 168], ["#d9b26a", 218], ["#c98aa0", 262]].forEach(([c, x], i) => { const h = 58 - (i % 2) * 12; ctx.fillStyle = "rgba(240,230,215,.22)"; ctx.beginPath(); ctx.roundRect(x - 17, 560 - h, 34, h, 8); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(x - 14, 560 - h * 0.62, 28, h * 0.6, 6); ctx.fill(); ctx.fillStyle = "#c9a57a"; ctx.fillRect(x - 15, 560 - h - 6, 30, 8); ctx.strokeStyle = "rgba(255,240,220,.5)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 11, 560 - h + 8); ctx.lineTo(x - 11, 552); ctx.stroke(); });
    ctx.restore();

    // ---------- floor
    const fl = ctx.createLinearGradient(0, FLOOR, 0, 1600); fl.addColorStop(0, "#5a3a28"); fl.addColorStop(1, "#1d120d"); ctx.fillStyle = fl; ctx.fillRect(0, FLOOR, W, 320);
    ctx.save(); ctx.globalAlpha = 0.12; ctx.strokeStyle = "#1a0f0a"; ctx.lineWidth = 2; for (let i = -6; i < 14; i++) { ctx.beginPath(); ctx.moveTo(540 + i * 70, FLOOR); ctx.lineTo(540 + i * 190, 1620); ctx.stroke(); } ctx.restore();
    ctx.fillStyle = "#2a1712"; ctx.fillRect(0, FLOOR - 16, W, 16); // skirting
    zform(ctx, (c) => c.ellipse(520, 1420, 420, 70, 0, 0, 6.3), "#b88a62", [100, 1350, 840, 140], { rimW: 0, lo: 0.45, sx: 0.05, sy: 0.3 });
    ctx.save(); ctx.globalCompositeOperation = "screen"; const fg2 = ctx.createRadialGradient(240, 1330, 0, 240, 1330, 520); fg2.addColorStop(0, "rgba(255,160,90,.34)"); fg2.addColorStop(1, "rgba(255,160,90,0)"); ctx.fillStyle = fg2; ctx.fillRect(0, FLOOR, W, 320); ctx.restore();

    // ---------- mid layer: fridge, lamp, sofa, plant, table
    ctx.save(); ctx.translate(par * 0.7, 0);
    // fridge with the invitation under a pizza-slice magnet
    shadow(ctx, 990, FLOOR + 6, 120, 20);
    zform(ctx, box(900, 700, 200, 600, 16), "#cfc6b6", [900, 700, 200, 600], { rimW: 0, lo: 0.55, sx: 0.12, sy: 0.02 });
    ctx.fillStyle = "rgba(40,25,20,.45)"; ctx.fillRect(900, 900, 200, 5); ctx.fillStyle = "#8f887a"; ctx.fillRect(916, 800, 9, 70); ctx.fillRect(916, 930, 9, 90);
    ctx.save(); ctx.translate(992, 800); ctx.rotate(0.05); ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.fillRect(-45, -57, 96, 124); ctx.fillStyle = "#fbf4e8"; ctx.fillRect(-48, -62, 96, 124); ctx.strokeStyle = "#d9b26a"; ctx.lineWidth = 2; ctx.strokeRect(-41, -55, 82, 110);
    ctx.fillStyle = "#3a2a22"; ctx.font = "italic 600 22px Cormorant"; ctx.textAlign = "center"; ctx.fillText("Miles", 0, -20); ctx.fillText("& Ivy", 0, 4); ctx.fillStyle = "#b9a78d"; ctx.fillRect(-26, 20, 52, 3); ctx.fillRect(-18, 32, 36, 3);
    ctx.fillStyle = "#e3a63a"; ctx.beginPath(); ctx.moveTo(-16, -78); ctx.lineTo(16, -78); ctx.lineTo(0, -44); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#d9643a"; ctx.beginPath(); ctx.arc(-4, -70, 4, 0, 6.3); ctx.arc(5, -62, 3.5, 0, 6.3); ctx.fill(); ctx.restore();
    // floor lamp (the key light)
    shadow(ctx, 150, FLOOR + 4, 70, 12);
    ctx.fillStyle = "#1c120e"; ctx.fillRect(144, 700, 10, 600); ctx.beginPath(); ctx.ellipse(149, FLOOR, 54, 12, 0, 0, 6.3); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.moveTo(98, 610); ctx.lineTo(200, 610); ctx.lineTo(232, 716); ctx.lineTo(66, 716); ctx.closePath(); const sh = ctx.createLinearGradient(0, 610, 0, 716); sh.addColorStop(0, "#ffd9a0"); sh.addColorStop(1, "#ffb060"); ctx.fillStyle = sh; ctx.fill(); ctx.restore();
    blurred(ctx, 30, () => { ctx.globalCompositeOperation = "screen"; ctx.fillStyle = "rgba(255,190,120,.55)"; ctx.beginPath(); ctx.ellipse(149, 680, 130, 110, 0, 0, 6.3); ctx.fill(); });
    // sofa
    shadow(ctx, 520, FLOOR + 10, 330, 30, 0.6);
    zform(ctx, box(232, 930, 590, 300, 60), "#b5553a", [232, 930, 590, 380], { lo: 0.5, rimW: 10, sx: 0.06, sy: 0.02 });
    zform(ctx, box(206, 1050, 110, 250, 46), "#c05e40", [206, 1050, 110, 250], { rimW: 0, lo: 0.4 });
    zform(ctx, box(738, 1050, 110, 250, 46), "#a84c33", [738, 1050, 110, 250], { rimW: 9, lo: 0.5 });
    zform(ctx, box(290, 1130, 474, 120, 40), "#c96446", [290, 1130, 474, 150], { rimW: 0, lo: 0.42, sx: 0.02, sy: -0.2 });
    zform(ctx, box(280, 1230, 494, 70, 18), "#8f3f2a", [280, 1230, 494, 70], { rimW: 0, lo: 0.5 });
    zform(ctx, box(318, 1010, 130, 130, 34), "#d9b26a", [318, 1010, 130, 130], { rimW: 0, lo: 0.4 }); // cushion
    // a blanket over the arm, books by the lamp, slippers kicked off
    zform(ctx, (c) => { c.moveTo(730, 1040); c.quadraticCurveTo(800, 1020, 852, 1050); c.lineTo(858, 1210); c.quadraticCurveTo(800, 1232, 740, 1204); c.closePath(); }, "#e9dcc6", [730, 1030, 128, 200], { rimW: 6, lo: 0.4 });
    ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = "#b5654a"; ctx.lineWidth = 7; [1080, 1120, 1160].forEach((y) => { ctx.beginPath(); ctx.moveTo(736, y); ctx.quadraticCurveTo(800, y - 14, 856, y + 6); ctx.stroke(); }); ctx.restore();
    [["#7f9a78", 0], ["#d9b26a", -18], ["#3d5a7a", -34], ["#c96446", -50]].forEach(([c, dy], i) => zform(ctx, box(180 + (i % 2) * 8, 1272 + dy, 104 - i * 6, 18, 4), c, [180, 1272 + dy, 104, 18], { rimW: 0 }));
    [[610, 1318, 0.2], [664, 1326, -0.15]].forEach(([x, y, r]) => { ctx.save(); ctx.translate(x, y); ctx.rotate(r); zform(ctx, (c) => c.ellipse(0, 0, 30, 13, 0, 0, 6.3), "#c98aa0", [-30, -13, 60, 26], { rimW: 2 }); ctx.restore(); });
    // the dying houseplant
    shadow(ctx, 866, FLOOR + 6, 60, 12);
    zform(ctx, (c) => { c.moveTo(830, 1200); c.lineTo(902, 1200); c.lineTo(890, 1300); c.lineTo(842, 1300); c.closePath(); }, "#b5654a", [830, 1200, 72, 100], { rimW: 5 });
    ctx.strokeStyle = "#5c6a3c"; ctx.lineWidth = 6; ctx.lineCap = "round";
    [[-70, -150, "#6f7f48"], [40, -190, "#8a8a4a"], [70, -90, "#a08a48"]].forEach(([dx, dy, c]) => { ctx.beginPath(); ctx.moveTo(866, 1202); ctx.quadraticCurveTo(866 + dx * 0.2, 1202 + dy * 0.8, 866 + dx, 1202 + dy); ctx.stroke(); ctx.save(); ctx.translate(866 + dx, 1202 + dy); ctx.rotate(dx > 0 ? 0.9 : -0.7); zform(ctx, (k) => k.ellipse(0, 0, 44, 24, 0, 0, 6.3), c, [-44, -24, 88, 48], { rimW: 3 }); ctx.restore(); });
    ctx.restore();

    // ---------- her
    ctx.save(); ctx.translate(par * 0.85, 0);
    const ZH = style === "soft" ? 640 : 720;
    if (o.zara !== false) drawZara(ctx, 540 + (o.zx || 0), 1300 + zSitLift(style) * ZH, ZH, style, o.expr || "dread", o.pose || { sit: true, armL: [0.3, -1.5], armR: [0.3, -1.5], phone: "R", glow: 1, tilt: -0.04 });
    ctx.restore();

    // ---------- front of her: the coffee table and tonight's flowers
    ctx.save(); ctx.translate(par * 1.1, 0);
    shadow(ctx, 380, 1470, 200, 22, 0.55);
    zform(ctx, box(190, 1380, 380, 28, 12), "#7a5038", [190, 1380, 380, 28], { rimW: 4 });
    ctx.fillStyle = "#3a2318"; ctx.fillRect(214, 1408, 16, 64); ctx.fillRect(530, 1408, 16, 64);
    zform(ctx, box(254, 1300, 70, 82, 14), "#e9dcc6", [254, 1300, 70, 82], { rimW: 4 });
    bouquet(ctx, 289, 1304, 0.8, ["#f3d9c8", "#e8a38a", "#fbf4e8"]);
    zform(ctx, box(430, 1330, 54, 52, 10), "#d9643a", [430, 1330, 54, 52], { rimW: 3 }); // mug, still warm
    ctx.save(); ctx.strokeStyle = "rgba(255,240,220,.28)"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.filter = "blur(3px)"; [0, 16].forEach((d) => { ctx.beginPath(); ctx.moveTo(448 + d, 1322); ctx.bezierCurveTo(438 + d, 1300, 462 + d, 1286, 450 + d, 1262); ctx.stroke(); }); ctx.restore();
    zform(ctx, box(496, 1362, 62, 20, 4), "#fbf4e8", [496, 1362, 62, 20], { rimW: 0 }); // a ribbon offcut and scissors from work
    ctx.strokeStyle = "#d9b26a"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(350, 1376); ctx.bezierCurveTo(370, 1356, 390, 1392, 414, 1372); ctx.stroke();
    ctx.restore();

    // ---------- foreground, out of focus (moves most)
    ctx.save(); ctx.translate(par * 1.8, 0);
    blurred(ctx, 9, () => {
      ctx.fillStyle = "#1a100c"; [[-10, 1610, 190, 70, -0.5], [120, 1560, 170, 60, -0.9], [40, 1500, 150, 50, -1.2]].forEach(([x, y, a, b, r]) => { ctx.beginPath(); ctx.ellipse(x, y, a, b, r, 0, 6.3); ctx.fill(); });
      ctx.fillStyle = "#24130e"; ctx.beginPath(); ctx.roundRect(900, 1470, 200, 240, 40); ctx.fill();
      ctx.fillStyle = "#c9785c"; [[930, 1420, 46], [1010, 1380, 54], [1060, 1450, 40]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.fill(); });
    });
    ctx.restore();
    // vignette
    const vg = ctx.createRadialGradient(540, 1000, 380, 540, 1000, 980); vg.addColorStop(0, "rgba(10,6,5,0)"); vg.addColorStop(1, "rgba(10,6,5,.72)"); ctx.fillStyle = vg; ctx.fillRect(0, 380, W, 1300);
    const top = ctx.createLinearGradient(0, 380, 0, 470); top.addColorStop(0, "#120d0a"); top.addColorStop(1, "rgba(18,13,10,0)"); ctx.fillStyle = top; ctx.fillRect(0, 380, W, 90);
    const bot = ctx.createLinearGradient(0, 1540, 0, 1700); bot.addColorStop(0, "rgba(18,13,10,0)"); bot.addColorStop(1, "#120d0a"); ctx.fillStyle = bot; ctx.fillRect(0, 1540, W, 380);
  };
  // the HUD: days left and the DIGNITY meter, top-left, always there
  g.drawHUD = function (ctx, days, dignity) {
    ctx.save(); ctx.translate(56, 236);
    ctx.fillStyle = "rgba(23,18,14,.86)"; ctx.beginPath(); ctx.roundRect(0, 0, 330, 132, 26); ctx.fill(); ctx.strokeStyle = "rgba(217,178,106,.75)"; ctx.lineWidth = 3; ctx.stroke();
    ctx.textAlign = "left"; ctx.fillStyle = "#d9b26a"; ctx.font = "600 22px Inter"; ctx.letterSpacing = "4px"; ctx.fillText("DAYS LEFT", 24, 40); ctx.fillText("DIGNITY", 24, 98);
    ctx.letterSpacing = "0px"; ctx.fillStyle = "#f6ecdc"; ctx.font = "600 54px Cormorant"; ctx.textAlign = "right"; ctx.fillText(String(days), 306, 50);
    ctx.fillStyle = "rgba(246,236,220,.18)"; ctx.beginPath(); ctx.roundRect(150, 82, 116, 18, 9); ctx.fill();
    ctx.fillStyle = "#d9643a"; ctx.beginPath(); ctx.roundRect(150, 82, 116 * dignity / 100, 18, 9); ctx.fill();
    ctx.fillStyle = "#f6ecdc"; ctx.font = "600 22px Inter"; ctx.fillText(dignity + "%", 310, 99);
    ctx.restore();
  };
  // captions: chunky, lower third, 2-3 words, one word coloured. parts = [["30", true], [" DAYS", false]]
  g.drawCaption = function (ctx, parts, y = 1470) {
    ctx.save(); ctx.font = "600 92px Inter"; ctx.textBaseline = "middle"; ctx.lineJoin = "round";
    const total = parts.reduce((a, [t]) => a + ctx.measureText(t).width, 0); let x = 540 - total / 2;
    parts.forEach(([t, hot]) => { ctx.textAlign = "left"; ctx.strokeStyle = "#120d0a"; ctx.lineWidth = 16; ctx.strokeText(t, x, y); ctx.fillStyle = hot ? "#f0b34a" : "#fbf4e8"; ctx.fillText(t, x, y); x += ctx.measureText(t).width; });
    ctx.restore();
  };
})(globalThis);
