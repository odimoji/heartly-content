// Episode 16, day 15, "Page four". Path: WRITE won episode 15 (she wrote it down). Vote: BURN (tempting) or KEEP (wise). The anger turns: neither of them fought for it.
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep16.wav exists.
(function (g) {
  const C = { mine: "i didn't fight for it either", reflect: "The anger had a second name on it.", askParts: [["What happens ", false], ["to it now?", true]] };
  const HP = { night: true, sleeve: null, y: 790, x: 680, w: 540 };
  const EAR = { sit: true, armL: [0.25, -0.4], armR: [0.95, -3.95], phone: "R", tilt: 0.05, look: "night" };
  // a page of the letter: a number, a few handwritten words lit, the rest as lines. fix: [struck word, word written above it]
  const page = (ctx, n, words, fix, k = 1) => { soft(ctx, 18, 0.5, () => FLAT(ctx)); ctx.save(); ctx.translate(540, 940); ctx.rotate(-0.03 + n * 0.012); ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.fillRect(-344, -470, 720, 980); zform(ctx, (c) => c.roundRect(-360, -490, 720, 980, 8), "#fbf4e8", [-360, -490, 720, 980], { rimW: 5, lo: 0.2 }); ctx.fillStyle = "#8a7a68"; ctx.font = "600 34px Inter"; ctx.textAlign = "right"; ctx.fillText("page " + n, 320, -420); ctx.strokeStyle = "rgba(60,50,40,.35)"; ctx.lineWidth = 5; ctx.lineCap = "round"; for (let i = 0; i < 12; i++) { if (i >= 4 && i < 7) continue; ctx.beginPath(); ctx.moveTo(-300, -340 + i * 64); ctx.lineTo(300 - (i * 53) % 150, -340 + i * 64); ctx.stroke(); }
    ctx.fillStyle = "#1c1210"; ctx.font = "italic 600 84px Cormorant"; ctx.textAlign = "center"; words.forEach((w, i) => ctx.fillText(w, 0, -50 + i * 92));
    if (fix && k > 0.35) { const wd = ctx.measureText(fix[0]).width; ctx.strokeStyle = "#c0452f"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(fix[2] - wd / 2 - 10, -72); ctx.lineTo(fix[2] + wd / 2 + 10, -80); ctx.stroke(); if (k > 0.6) { ctx.fillStyle = "#c0452f"; ctx.fillText(fix[1], fix[2], -140); } } ctx.restore(); };
  const VL = { word: "BURN", sub: "burn the letter", color: "#f0b34a", draw: (c) => { zform(c, (k) => k.roundRect(150, 300, 200, 280, 6), "#fbf4e8", [150, 300, 200, 280], { rimW: 4, lo: 0.2 }); zform(c, (k) => { k.moveTo(250, 180); k.bezierCurveTo(360, 300, 330, 420, 250, 430); k.bezierCurveTo(170, 420, 140, 300, 250, 180); k.closePath(); }, "#f0872a", [150, 180, 200, 250], { rimW: 6 }); } };
  const VR = { word: "KEEP", sub: "in the drawer, with the photo strip", color: "#f6ecdc", draw: (c) => { zform(c, (k) => k.roundRect(70, 380, 360, 220, 14), "#5a3a26", [70, 380, 360, 220], { rimW: 6, lo: 0.4 }); zform(c, (k) => k.roundRect(130, 300, 240, 120, 6), "#fbf4e8", [130, 300, 240, 120], { rimW: 4, lo: 0.2 }); zform(c, (k) => k.ellipse(250, 500, 22, 22, 0, 0, 6.3), "#d9b26a", [228, 478, 44, 44], { rimW: 0 }); } };
  g.EP = {
    title: "Page four", daysStart: 15, dignityStart: 7, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara has written her ex a four page letter.", key: "ex four", sfx: "ding", draw: (ctx) => page(ctx, 1, ["Miles,"]) },
      { say: "She is not going to send it.", key: "not", live: true, amb: [["dust"]], draw: (ctx, k, t) => face(ctx, FLAT, "plotting", { look: "night", glow: 0, H: 3000, ...life(t) }) },
      { say: "His wedding is in fifteen days.", key: "fifteen", draw: (ctx) => inHand(ctx, FLAT, screenInvite(true), { sleeve: null, thumb: [0.84, 0.78] }) },
      { say: "She said yes.", key: "yes", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "frozen", { look: "night", glow: 0, H: 3300, y: 950, ...life(t, 1) }) },
      { say: "Page one is the car park.", key: "car park", sfx: "tick", draw: (ctx) => page(ctx, 1, ["a CAR PARK,", "Miles."]) },
      { say: "Page two is the hoodie.", key: "hoodie", sfx: "tick", draw: (ctx) => page(ctx, 2, ["and I washed", "your hoodie"]) },
      { say: "Page three is mostly the word fine.", key: "fine", sfx: "tick", draw: (ctx) => page(ctx, 3, ["fine. fine.", "FINE. fine."]) },
      { say: "Page four surprised her.", key: "four", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "caught", { look: "night", glow: 0, H: 3200, y: 950, ...life(t, 2) }) },
      { say: "It says: you never fought for us.", key: "fought", sfx: "thud", draw: (ctx) => page(ctx, 4, ["you never", "fought for us"]) },
      { say: "She read it back, on her sofa, at midnight.", key: "midnight", amb: [["candle", 880, 1300], ["dust"]], draw: (ctx) => cam(ctx, 590, 1080, 1.55, () => drawFlat(ctx, { expr: "raw", pose: { sit: true, look: "night", armL: [0.3, -1.5], armR: [0.3, -1.5] } })) },
      { say: "Then she crossed out you,", key: "you", live: true, draw: (ctx, k) => page(ctx, 4, ["you never", "fought for us"], ["you", "we", -100], Math.min(0.55, k)) },
      { say: "and wrote we.", key: "we", sfx: "ding", draw: (ctx) => page(ctx, 4, ["you never", "fought for us"], ["you", "we", -100], 1) },
      { say: "Oh.", who: "Z", key: "oh", dignity: 10, live: true, draw: (ctx, k, t) => face(ctx, FLAT, "raw", { look: "night", glow: 0, H: 3900, y: 930, ...life(t) }) },
      { say: "Her best friend rang.", key: "friend", sfx: "buzz", amb: [["tv", 0.14]], draw: (ctx) => cam(ctx, 590, 960, 2.5, () => drawFlat(ctx, { expr: "raw", pose: EAR })) },
      { say: "Zara read her page four.", key: "four", draw: (ctx) => page(ctx, 4, ["we never", "fought for us"]) },
      { say: "Remy did not shout, for once.", key: "shout", live: true, draw: (ctx, k, t) => face(ctx, BED, "neutral", { who: remy, glow: 0, H: 2700, dim: 0.5, ...life(t, 1) }) },
      { say: "Remy said, I wondered when you'd get there.", key: "wondered", live: true, draw: (ctx, k, t) => face(ctx, BED, "smile", { who: remy, glow: 0, H: 3000, y: 950, dim: 0.5, ...life(t, 2) }) },
      { say: "She opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, FLAT, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I didn't fight for it either.", key: "fight either", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, FLAT, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "It says: the anger had a second name on it.", key: "second name", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, FLAT, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "caught", { look: "night", glow: 1, H: 3400, y: 960, ...life(t, 2) }) },
      { say: "What happens to it now?", key: "now", tag: "IT ASKS", sfx: "chime", hold: 0.3, draw: (ctx) => inHand(ctx, FLAT, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Burn the letter,", key: "burn", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, FLAT, VL, VR, false, true) },
      { say: "or keep it in the drawer with the photo strip.", key: "keep", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, FLAT, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, FLAT, VL, VR) },
      { say: "Fourteen days.", key: "fourteen", days: 14, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, FLAT, screenInvite(true), { sleeve: null, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
