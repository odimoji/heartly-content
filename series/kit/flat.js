// Zara's world, each set full-bleed (1080x1920) and built in layers with one clear light source:
//   drawFlat: her sleek flat at night (arc lamp, city lights through a big window, laptop, wine glass, one dying plant, heels by the door)
//   drawBedroom: 1am, lit by her phone
//   drawOffice: the glass-walled agency by day
// o.par slides the layers for camera moves; o.zara = false leaves her out; o.expr / o.pose set her up.
(function (g) {
  const W = 1080, H = 1920;
  const blurred = (ctx, px, fn) => { ctx.save(); ctx.filter = `blur(${px}px)`; fn(); ctx.restore(); };
  const shadow = (ctx, x, y, rx, ry, a = 0.45) => blurred(ctx, 18, () => { ctx.fillStyle = `rgba(8,4,3,${a})`; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.3); ctx.fill(); });
  const box = (x, y, w, h, r) => (c) => c.roundRect(x, y, w, h, r);
  const screenGlow = (ctx, x, y, r, c) => { ctx.save(); ctx.globalCompositeOperation = "screen"; const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, c); gr.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); };
  // a made-up skyline: towers with lit windows, and soft points of light
  function city(ctx, x, y, w, h, day) {
    const sky = ctx.createLinearGradient(0, y, 0, y + h);
    if (day) { sky.addColorStop(0, "#f6cfa0"); sky.addColorStop(1, "#f3e2c8"); } else { sky.addColorStop(0, "#14132a"); sky.addColorStop(0.7, "#3a2a48"); sky.addColorStop(1, "#6a3a40"); }
    ctx.fillStyle = sky; ctx.fillRect(x, y, w, h);
    let s = 11; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 12; i++) { const bw = 50 + rnd() * 70, bx = x + (i / 12) * w + rnd() * 20 - 10, bh = h * (0.25 + rnd() * 0.5);
      ctx.fillStyle = day ? `rgba(160,120,90,${0.35 + rnd() * 0.25})` : ["#1a1730", "#221c38", "#15122a"][i % 3]; ctx.fillRect(bx, y + h - bh, bw, bh);
      if (!day) { for (let r = 0; r < bh / 22; r++) for (let c2 = 0; c2 < bw / 16; c2++) if (rnd() > 0.55) { ctx.fillStyle = rnd() > 0.3 ? "rgba(255,205,130,.85)" : "rgba(190,215,255,.7)"; ctx.fillRect(bx + 5 + c2 * 16, y + h - bh + 8 + r * 22, 7, 10); } } }
    if (!day) blurred(ctx, 8, () => { for (let i = 0; i < 26; i++) { ctx.fillStyle = ["rgba(255,190,110,.6)", "rgba(255,120,90,.5)", "rgba(190,215,255,.5)"][i % 3]; ctx.beginPath(); ctx.arc(x + rnd() * w, y + h * (0.55 + rnd() * 0.45), 5 + rnd() * 9, 0, 6.3); ctx.fill(); } });
  }
  function heels(ctx, x, y, s = 1) { [0, 46].forEach((d, i) => { ctx.save(); ctx.translate(x + d * s, y + i * 6 * s); ctx.scale(s, s); ctx.rotate(i ? 0.5 : -0.1);
    zform(ctx, (c) => { c.moveTo(-34, -6); c.quadraticCurveTo(0, -34, 32, -18); c.lineTo(40, 0); c.lineTo(-16, 0); c.closePath(); }, "#c0452f", [-34, -34, 76, 34], { rimW: 3 }); ctx.strokeStyle = "#8a2f20"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-28, -8); ctx.lineTo(-32, 0 + (i ? 0 : 0)); ctx.lineTo(-33, 26 * (i ? 0 : 1)); ctx.stroke(); ctx.restore(); }); }
  function wine(ctx, x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = "rgba(255,245,230,.55)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -52); ctx.moveTo(-20, 0); ctx.lineTo(20, 0); ctx.stroke();
    ctx.fillStyle = "rgba(255,245,230,.16)"; ctx.beginPath(); ctx.moveTo(-26, -112); ctx.quadraticCurveTo(-30, -52, 0, -52); ctx.quadraticCurveTo(30, -52, 26, -112); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#8a2030"; ctx.beginPath(); ctx.moveTo(-27, -84); ctx.quadraticCurveTo(-26, -55, 0, -55); ctx.quadraticCurveTo(26, -55, 27, -84); ctx.closePath(); ctx.fill(); ctx.restore(); }
  function laptop(ctx, x, y, s = 1, lit = true) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    zform(ctx, box(-110, -150, 220, 146, 10), "#2a2220", [-110, -150, 220, 146], { rimW: 4 }); if (lit) { ctx.fillStyle = "#dfe8ff"; ctx.fillRect(-100, -140, 200, 126); ctx.fillStyle = "rgba(60,70,110,.5)"; [0, 1, 2, 3].forEach((i) => ctx.fillRect(-86, -124 + i * 26, 172 - i * 30, 10)); }
    zform(ctx, (c) => { c.moveTo(-122, 0); c.lineTo(122, 0); c.lineTo(136, 16); c.lineTo(-136, 16); c.closePath(); }, "#b9b0a4", [-136, 0, 272, 16], { rimW: 0 }); ctx.restore(); if (lit) screenGlow(ctx, x, y - 80 * s, 300 * s, "rgba(170,200,255,.3)"); }
  function plant(ctx, x, y, s = 1) { zform(ctx, (c) => { c.moveTo(x - 44 * s, y - 110 * s); c.lineTo(x + 44 * s, y - 110 * s); c.lineTo(x + 34 * s, y); c.lineTo(x - 34 * s, y); c.closePath(); }, "#e9dcc6", [x - 44 * s, y - 110 * s, 88 * s, 110 * s], { rimW: 5 });
    ctx.strokeStyle = "#5c6a3c"; ctx.lineWidth = 6 * s; ctx.lineCap = "round"; [[-80, -170, "#6f7f48"], [46, -230, "#8a8a4a"], [86, -100, "#a08a48"], [-30, -120, "#9a7a40"]].forEach(([dx, dy, c]) => { ctx.beginPath(); ctx.moveTo(x, y - 108 * s); ctx.quadraticCurveTo(x + dx * 0.2 * s, y - 108 * s + dy * 0.8 * s, x + dx * s, y - 108 * s + dy * s); ctx.stroke(); ctx.save(); ctx.translate(x + dx * s, y - 108 * s + dy * s); ctx.rotate(dx > 0 ? 1.0 : -0.8); zform(ctx, (k) => k.ellipse(0, 0, 46 * s, 24 * s, 0, 0, 6.3), c, [-46 * s, -24 * s, 92 * s, 48 * s], { rimW: 3 }); ctx.restore(); }); }

  g.drawFlat = function (ctx, o = {}) {
    const par = o.par || 0, FLOOR = 1390;
    // back: wall and the big window
    ctx.save(); ctx.translate(par * 0.3, 0);
    const wall = ctx.createLinearGradient(0, 0, 0, FLOOR); wall.addColorStop(0, "#2a1c1a"); wall.addColorStop(1, "#3a2620"); ctx.fillStyle = wall; ctx.fillRect(-80, 0, W + 160, FLOOR);
    city(ctx, 380, 180, 760, 1010);
    ctx.fillStyle = "#1a1210"; [380, 632, 884].forEach((x) => ctx.fillRect(x - 6, 180, 12, 1010)); ctx.fillRect(380, 174, 760, 12); ctx.fillRect(380, 1184, 760, 14);
    ctx.save(); ctx.globalAlpha = 0.1; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(420, 180); ctx.lineTo(560, 180); ctx.lineTo(430, 1190); ctx.lineTo(380, 1190); ctx.closePath(); ctx.fill(); ctx.restore(); // glass
    // one framed print, and a console with the things she hasn't dealt with
    zform(ctx, box(96, 430, 190, 250, 6), "#1a1210", [96, 430, 190, 250], { rimW: 4 }); ctx.fillStyle = "#e9dcc6"; ctx.fillRect(110, 444, 162, 222); ctx.fillStyle = "#d9643a"; ctx.beginPath(); ctx.arc(190, 560, 54, 0, 6.3); ctx.fill(); ctx.fillStyle = "#d9b26a"; ctx.fillRect(110, 600, 162, 6);
    ctx.restore();
    // warm pool from the lamp
    screenGlow(ctx, 250, 760, 760, "rgba(255,170,95,.5)");
    // floor
    const fl = ctx.createLinearGradient(0, FLOOR, 0, H); fl.addColorStop(0, "#4a3226"); fl.addColorStop(1, "#1a110d"); ctx.fillStyle = fl; ctx.fillRect(0, FLOOR, W, H - FLOOR);
    ctx.save(); ctx.globalAlpha = 0.1; ctx.strokeStyle = "#0e0806"; ctx.lineWidth = 2; for (let i = -6; i < 14; i++) { ctx.beginPath(); ctx.moveTo(540 + i * 80, FLOOR); ctx.lineTo(540 + i * 240, H); ctx.stroke(); } ctx.restore();
    ctx.fillStyle = "#150e0c"; ctx.fillRect(0, FLOOR - 14, W, 14);
    ctx.save(); ctx.globalAlpha = 0.25; city(ctx, 380, FLOOR, 760, 200); ctx.restore(); const fade = ctx.createLinearGradient(0, FLOOR, 0, FLOOR + 220); fade.addColorStop(0, "rgba(40,26,20,.55)"); fade.addColorStop(1, "#2a1c16"); ctx.fillStyle = fade; ctx.fillRect(380, FLOOR, 700, 220); // the city in the polished floor
    zform(ctx, (c) => c.ellipse(560, 1560, 470, 90, 0, 0, 6.3), "#cbb89a", [90, 1470, 940, 180], { rimW: 0, lo: 0.5, sx: 0.04, sy: 0.3 });
    screenGlow(ctx, 260, 1440, 560, "rgba(255,160,90,.3)");

    ctx.save(); ctx.translate(par * 0.7, 0);
    // the door, her heels kicked off beside it, her bag
    zform(ctx, box(-40, 420, 170, 980, 4), "#3a2a24", [-40, 420, 170, 980], { rimW: 6, lo: 0.5 }); ctx.fillStyle = "#d9b26a"; ctx.beginPath(); ctx.arc(104, 930, 9, 0, 6.3); ctx.fill();
    shadow(ctx, 170, 1420, 90, 12, 0.5); heels(ctx, 150, 1418, 1.15);
    // the arc lamp (the key light)
    ctx.strokeStyle = "#d9b26a"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(250, 1392); ctx.bezierCurveTo(240, 700, 300, 520, 470, 560); ctx.stroke(); ctx.fillStyle = "#1a1210"; ctx.beginPath(); ctx.ellipse(250, 1394, 60, 12, 0, 0, 6.3); ctx.fill();
    blurred(ctx, 26, () => { ctx.globalCompositeOperation = "screen"; ctx.fillStyle = "rgba(255,200,130,.75)"; ctx.beginPath(); ctx.arc(470, 610, 110, 0, 6.3); ctx.fill(); });
    zform(ctx, (c) => c.ellipse(470, 600, 62, 62, 0, 0, 6.3), "#ffe2b0", [408, 538, 124, 124], { rimW: 0, lo: 0.1, shadow: false });
    // the sofa: low, cream, one ember cushion
    shadow(ctx, 580, 1400, 360, 30, 0.6);
    zform(ctx, box(250, 1010, 680, 300, 50), "#d8c8ae", [250, 1010, 680, 400], { lo: 0.5, rimW: 10, sx: 0.05, sy: 0.02 });
    zform(ctx, box(226, 1120, 110, 270, 44), "#e2d3ba", [226, 1120, 110, 270], { rimW: 0, lo: 0.4 }); zform(ctx, box(844, 1120, 110, 270, 44), "#cdbb9f", [844, 1120, 110, 270], { rimW: 9, lo: 0.5 });
    zform(ctx, box(310, 1200, 560, 130, 40), "#e6d8c0", [310, 1200, 560, 160], { rimW: 0, lo: 0.42, sx: 0.02, sy: -0.2 });
    zform(ctx, box(336, 1080, 140, 140, 36), "#d9643a", [336, 1080, 140, 140], { rimW: 0, lo: 0.4 });
    // her blazer's twin: the work bag dropped by the sofa
    zform(ctx, box(900, 1290, 120, 110, 16), "#1f1614", [900, 1290, 120, 110], { rimW: 6 }); ctx.strokeStyle = "#d9b26a"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(960, 1290, 34, Math.PI, 0); ctx.stroke();
    plant(ctx, 1010, 1400, 1.05);
    ctx.restore();

    if (o.zara !== false) { ctx.save(); ctx.translate(par * 0.85, 0); const ZH = 780;
      drawZara(ctx, 590 + (o.zx || 0), 1400 + zSitLift() * ZH + 44, ZH, o.expr || "dread", o.pose || { sit: true, armL: [0.3, -1.5], armR: [0.3, -1.5], phone: "R", glow: 1, tilt: -0.04 }); ctx.restore(); }
    if (o.after) o.after(ctx);
    ctx.save(); ctx.translate(par * 0.7, 0); zform(ctx, box(300, 1322, 580, 76, 16), "#b8a688", [300, 1322, 580, 76], { rimW: 0, lo: 0.5 }); ctx.restore(); // the seat's front edge, in front of her

    // in front of her: the table, laptop still open, wine, the invitation
    ctx.save(); ctx.translate(par * 1.1, 0);
    shadow(ctx, 430, 1640, 300, 26, 0.6);
    zform(ctx, box(150, 1530, 560, 34, 14), "#e9dcc6", [150, 1530, 560, 34], { rimW: 5 }); ctx.fillStyle = "#1a1210"; ctx.fillRect(184, 1564, 14, 84); ctx.fillRect(662, 1564, 14, 84);
    laptop(ctx, 330, 1516, 0.9); wine(ctx, 540, 1530, 1.1);
    ctx.save(); ctx.translate(628, 1474); ctx.rotate(0.08); ctx.fillStyle = "#fbf4e8"; ctx.fillRect(-42, -56, 84, 112); ctx.strokeStyle = "#d9b26a"; ctx.lineWidth = 2; ctx.strokeRect(-36, -50, 72, 100); ctx.fillStyle = "#3a2a22"; ctx.font = "italic 600 19px Cormorant"; ctx.textAlign = "center"; ctx.fillText("Miles", 0, -14); ctx.fillText("& Ivy", 0, 8); ctx.restore();
    ctx.restore();
    // closest to the camera, out of focus
    ctx.save(); ctx.translate(par * 1.8, 0);
    blurred(ctx, 11, () => { ctx.fillStyle = "#140c0a"; [[-20, 1820, 220, 80, -0.5], [150, 1760, 190, 66, -0.9], [40, 1690, 160, 54, -1.2]].forEach(([x, y, a, b, r]) => { ctx.beginPath(); ctx.ellipse(x, y, a, b, r, 0, 6.3); ctx.fill(); }); ctx.fillStyle = "#1c110e"; ctx.beginPath(); ctx.roundRect(880, 1700, 260, 300, 50); ctx.fill(); });
    ctx.restore();
    const vg = ctx.createRadialGradient(540, 1000, 420, 540, 1000, 1150); vg.addColorStop(0, "rgba(10,6,5,0)"); vg.addColorStop(1, "rgba(10,6,5,.7)"); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  };

  g.drawBedroom = function (ctx, o = {}) {
    const wall = ctx.createLinearGradient(0, 0, 0, 1300); wall.addColorStop(0, "#15121c"); wall.addColorStop(1, "#241a22"); ctx.fillStyle = wall; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.beginPath(); ctx.rect(-40, 200, 330, 760); ctx.clip(); city(ctx, -40, 200, 330, 760); ctx.restore(); ctx.fillStyle = "#0e0a0c"; ctx.fillRect(286, 200, 12, 760); ctx.fillRect(-40, 954, 338, 14);
    blurred(ctx, 3, () => { ctx.fillStyle = "rgba(240,230,220,.1)"; ctx.fillRect(300, 190, 90, 790); }); // a sheer curtain
    // headboard, pillows
    zform(ctx, box(250, 720, 760, 520, 60), "#4a3a44", [250, 720, 760, 520], { rimW: 8, lo: 0.5 });
    [[470, 1120, -0.08], [800, 1130, 0.06]].forEach(([x, y, r]) => { ctx.save(); ctx.translate(x, y); ctx.rotate(r); zform(ctx, box(-180, -90, 360, 180, 60), "#e6dccb", [-180, -90, 360, 180], { rimW: 5, lo: 0.5 }); ctx.restore(); });
    // bedside table: the clock, a glass of water she won't drink
    zform(ctx, box(40, 1150, 210, 420, 14), "#3a2a24", [40, 1150, 210, 420], { rimW: 0, lo: 0.5 });
    zform(ctx, box(66, 1070, 150, 84, 16), "#1a1210", [66, 1070, 150, 84], { rimW: 3 }); ctx.save(); ctx.shadowColor = "#ff9a5a"; ctx.shadowBlur = 16; ctx.fillStyle = "#ffb27a"; ctx.font = "600 50px Inter"; ctx.textAlign = "center"; ctx.fillText(o.time || "1:12", 141, 1130); ctx.restore();
    ctx.fillStyle = "rgba(220,235,255,.2)"; ctx.beginPath(); ctx.roundRect(196, 1088, 40, 64, 6); ctx.fill();
    if (o.zara !== false) { const ZH = 900; drawZara(ctx, 640 + (o.zx || 0), 1690, ZH, o.expr || "raw", o.pose || { look: "night", armL: [0.25, -1.75], armR: [0.25, -1.75], phone: "R", glow: 1, tilt: -0.05 }); }
    // the duvet over her legs
    zform(ctx, (c) => { c.moveTo(220, 1330); c.bezierCurveTo(420, 1250, 860, 1250, 1100, 1320); c.lineTo(1100, 1960); c.lineTo(220, 1960); c.closePath(); }, "#d9cdb8", [220, 1260, 880, 700], { rimW: 0, lo: 0.6, sx: 0.03, sy: -0.06 });
    ctx.save(); ctx.globalAlpha = 0.14; ctx.strokeStyle = "#4a3a30"; ctx.lineWidth = 5; [[420, 1300, 380, 1900], [760, 1290, 820, 1900]].forEach(([a, b, c2, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.quadraticCurveTo((a + c2) / 2 + 40, (b + d) / 2, c2, d); ctx.stroke(); }); ctx.restore();
    screenGlow(ctx, 640 + (o.zx || 0), 1240, 620, "rgba(160,190,255,.3)");
    const vg = ctx.createRadialGradient(600, 1100, 300, 600, 1100, 1150); vg.addColorStop(0, "rgba(6,5,8,0)"); vg.addColorStop(1, "rgba(6,5,8,.78)"); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  };

  g.drawOffice = function (ctx, o = {}) {
    city(ctx, 0, 0, W, 1320, true);
    screenGlow(ctx, 900, 200, 900, "rgba(255,235,190,.55)");
    ctx.fillStyle = "#2a1f1a"; [0, 270, 540, 810, 1074].forEach((x) => ctx.fillRect(x - 5, 0, 10, 1320)); ctx.fillRect(0, 560, W, 8); // glass wall frames
    ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(60, 0); ctx.lineTo(240, 0); ctx.lineTo(90, 1320); ctx.lineTo(0, 1320); ctx.closePath(); ctx.fill(); ctx.restore();
    // colleagues behind the glass, soft
    blurred(ctx, 7, () => { [[160, "#7a5640"], [930, "#c08a62"]].forEach(([x, c]) => { ctx.fillStyle = "#3a2a30"; ctx.beginPath(); ctx.roundRect(x - 70, 900, 140, 420, 50); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, 850, 54, 0, 6.3); ctx.fill(); }); ctx.fillStyle = "#8a6a4a"; ctx.fillRect(40, 1180, 300, 30); });
    const fl = ctx.createLinearGradient(0, 1320, 0, H); fl.addColorStop(0, "#b99c7c"); fl.addColorStop(1, "#5a4636"); ctx.fillStyle = fl; ctx.fillRect(0, 1320, W, 600);
    if (o.zara !== false) drawZara(ctx, 520, 1640, 1080, o.expr || "neutral", o.pose || { armL: [0.2, -1.9], armR: [0.14, 0.08] });
    // her desk across the front: laptop, name plate, a wedding file
    shadow(ctx, 540, 1700, 520, 30, 0.35);
    zform(ctx, box(-40, 1560, 1160, 60, 10), "#f1e6d2", [-40, 1560, 1160, 60], { rimW: 0, lo: 0.3 }); zform(ctx, box(-40, 1620, 1160, 320, 0), "#3a2a24", [-40, 1620, 1160, 320], { rimW: 0, lo: 0.5 });
    laptop(ctx, 840, 1560, 1.25, false);
    zform(ctx, box(120, 1490, 250, 70, 6), "#fbf4e8", [120, 1490, 250, 70], { rimW: 0 }); ctx.fillStyle = "#d9643a"; ctx.fillRect(120, 1490, 250, 14);
    zform(ctx, box(430, 1508, 170, 54, 6), "#1f1614", [430, 1508, 170, 54], { rimW: 0 }); ctx.fillStyle = "#d9b26a"; ctx.font = "600 26px Inter"; ctx.textAlign = "center"; ctx.fillText("ZARA", 515, 1545);
  };

  // the HUD: days left and the DIGNITY meter, top-left, always there
  g.drawHUD = function (ctx, days, dignity) {
    ctx.save(); ctx.translate(56, 236);
    ctx.fillStyle = "rgba(23,18,14,.88)"; ctx.beginPath(); ctx.roundRect(0, 0, 330, 132, 26); ctx.fill(); ctx.strokeStyle = "rgba(217,178,106,.75)"; ctx.lineWidth = 3; ctx.stroke();
    ctx.textAlign = "left"; ctx.fillStyle = "#d9b26a"; ctx.font = "600 22px Inter"; ctx.letterSpacing = "4px"; ctx.fillText("DAYS LEFT", 24, 40); ctx.fillText("DIGNITY", 24, 98);
    ctx.letterSpacing = "0px"; ctx.fillStyle = "#f6ecdc"; ctx.font = "600 54px Cormorant"; ctx.textAlign = "right"; ctx.fillText(String(days), 306, 50);
    ctx.fillStyle = "rgba(246,236,220,.18)"; ctx.beginPath(); ctx.roundRect(150, 82, 116, 18, 9); ctx.fill(); ctx.fillStyle = "#d9643a"; ctx.beginPath(); ctx.roundRect(150, 82, 116 * dignity / 100, 18, 9); ctx.fill();
    ctx.fillStyle = "#f6ecdc"; ctx.font = "600 22px Inter"; ctx.fillText(dignity + "%", 310, 99); ctx.restore();
  };
  // captions: chunky, lower third, 2-3 words, one word coloured, kept clear of the right-hand buttons
  g.drawCaption = function (ctx, parts, y = 1420) {
    ctx.save(); let size = 92; ctx.font = `600 ${size}px Inter`; ctx.textBaseline = "middle"; ctx.lineJoin = "round";
    const width = () => parts.reduce((a, [t]) => a + ctx.measureText(t).width, 0);
    while (width() > 800 && size > 54) { size -= 4; ctx.font = `600 ${size}px Inter`; }
    let x = 470 - width() / 2; if (x < 40) x = 40;
    parts.forEach(([t, hot]) => { ctx.textAlign = "left"; ctx.strokeStyle = "#120d0a"; ctx.lineWidth = size * 0.18; ctx.strokeText(t, x, y); ctx.fillStyle = hot ? "#f0b34a" : "#fbf4e8"; ctx.fillText(t, x, y); x += ctx.measureText(t).width; });
    ctx.restore();
  };
})(globalThis);
