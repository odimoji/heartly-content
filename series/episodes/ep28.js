// Episode 28, day 3, "The bag". Path: TELL won episode 27 (she told Remy). Vote: FILL (tempting) or EMPTY (wise: leave the shelf empty for a bit).
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep28.wav exists.
(function (g) {
  const C = { mine: "i gave the hoodie back and nothing fell down", reflect: "You let go of the thing, and you are still here.", askParts: [["What is the shelf ", false], ["for now?", true]] };
  const HP = { night: true, sleeve: null, y: 790, x: 680, w: 540 };
  const bag = (ctx, k = 1, note) => { soft(ctx, 18, 0.5, () => FLAT(ctx)); if (k < 1) hoodie(ctx, 540, 520 + 420 * k, 1.2, true); zform(ctx, (c) => { c.moveTo(250, 800); c.lineTo(830, 800); c.lineTo(800, 1500); c.lineTo(280, 1500); c.closePath(); }, "#c9a27a", [250, 800, 580, 700], { rimW: 8, lo: 0.35 }); ctx.strokeStyle = "#8a6a4a"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(400, 800); ctx.quadraticCurveTo(540, 600, 680, 800); ctx.stroke(); if (note) { ctx.save(); ctx.translate(540, 1150); ctx.rotate(-0.05); ctx.fillStyle = "#fbf4e8"; ctx.fillRect(-190, -110, 380, 220); ctx.fillStyle = "#1c1210"; ctx.font = "italic 600 62px Cormorant"; ctx.textAlign = "center"; ctx.fillText("this is his.", 0, -10); ctx.fillText(note, 0, 70); ctx.restore(); } };
  const strip = (ctx, x, y, s, rot = -0.06) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.fillRect(-110 * s + 14, -430 * s + 18, 220 * s, 860 * s); ctx.fillStyle = "#fbf4e8"; ctx.fillRect(-110 * s, -430 * s, 220 * s, 860 * s); [0, 1, 2, 3].forEach((i) => { const fy = -410 * s + i * 208 * s; ctx.fillStyle = "#3a2a3a"; ctx.fillRect(-92 * s, fy, 184 * s, 192 * s); ctx.save(); ctx.beginPath(); ctx.rect(-92 * s, fy, 184 * s, 192 * s); ctx.clip(); zform(ctx, (c) => c.ellipse(-36 * s, fy + 120 * s, 44 * s, 50 * s, 0, 0, 6.3), ZC.skin, [-80 * s, fy + 70 * s, 88 * s, 100 * s], { rimW: 0 }); ctx.fillStyle = ZC.hair; ctx.beginPath(); ctx.ellipse(-36 * s, fy + 96 * s, 50 * s, 44 * s, 0, Math.PI, 0); ctx.fill(); zform(ctx, (c) => c.ellipse(44 * s, fy + 108 * s, 46 * s, 54 * s, 0, 0, 6.3), "#c98a62", [-2 * s, fy + 54 * s, 92 * s, 108 * s], { rimW: 0 }); ctx.fillStyle = "#3a241a"; ctx.beginPath(); ctx.ellipse(44 * s, fy + 76 * s, 48 * s, 30 * s, 0, Math.PI, 0); ctx.fill(); ctx.restore(); }); ctx.restore(); };
  const drawer = (ctx, k = 1) => { soft(ctx, 18, 0.5, () => FLAT(ctx)); zform(ctx, (c) => c.roundRect(150, 900, 780, 460, 20), "#5a3a26", [150, 900, 780, 460], { rimW: 8, lo: 0.4 }); zform(ctx, (c) => c.roundRect(270, 760, 420, 200, 8), "#fbf4e8", [270, 760, 420, 200], { rimW: 5, lo: 0.2 }); strip(ctx, 660, 300 + 520 * k, 0.75, 0.3); zform(ctx, (c) => c.roundRect(150, 980, 780, 380, 20), "#6a4630", [150, 980, 780, 380], { rimW: 6, lo: 0.4 }); zform(ctx, (c) => c.ellipse(540, 1170, 34, 34, 0, 0, 6.3), "#d9b26a", [506, 1136, 68, 68], { rimW: 0 }); };
  const VL = { word: "FILL", sub: "fill the shelf", color: "#f0b34a", draw: (c) => { c.save(); c.scale(0.5, 0.5); c.translate(-40, -160); wardrobe(c, { hoodieAt: "shelf" }); c.restore(); } };
  const VR = { word: "EMPTY", sub: "leave it empty for a bit", color: "#f6ecdc", draw: (c) => { c.save(); c.scale(0.5, 0.5); c.translate(-40, -160); wardrobe(c, {}); c.restore(); } };
  g.EP = {
    title: "The bag", daysStart: 3, dignityStart: 26, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara is putting her ex's hoodie in a bag.", key: "ex's hoodie", sfx: "ding", live: true, draw: (ctx, k) => bag(ctx, Math.min(0.9, k)) },
      { say: "This time it is not coming back out.", key: "not", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "neutral", { look: "night", glow: 0, H: 3000, ...life(t) }) },
      { say: "Three days until his wedding. She said yes.", key: "three yes", draw: (ctx) => inHand(ctx, FLAT, screenInvite(true), { sleeve: null, thumb: [0.84, 0.78] }) },
      { say: "She told her best friend last night.", key: "told", sfx: "whoosh", draw: (ctx) => inHand(ctx, FLAT, screenThread("Remy", [{ t: "i think i want one. a wedding.", me: true }, { t: "ZARA", me: false }, { t: "I'M CRYING AT WORK", me: false }], ""), { sleeve: null, thumb: [0.9, 0.62], rot: 0.04, x: 620 }) },
      { say: "Remy cried first, which was annoying.", key: "annoying", live: true, draw: (ctx, k, t) => face(ctx, BED, "raw", { who: remy, glow: 0, H: 2700, dim: 0.5, ...life(t, 2) }) },
      { say: "The hoodie has been folded on the shelf for twenty-five days.", key: "twenty five", draw: (ctx) => cam(ctx, 760, 1080, 1.9, () => wardrobe(ctx, { hoodieAt: "shelf" })) },
      { say: "It goes in a paper bag, for his sister.", key: "sister", sfx: "thud", draw: (ctx) => bag(ctx, 1) },
      { say: "With a note. It says, this is his.", key: "his", draw: (ctx) => bag(ctx, 1, "") },
      { say: "No kisses. One kiss. No kisses.", key: "kiss", sfx: "tick", live: true, draw: (ctx, k) => bag(ctx, 1, k > 0.33 && k < 0.66 ? "x" : "") },
      { say: "One. It's a wedding.", who: "Z", key: "wedding", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "smile", { look: "night", glow: 0, H: 3100, y: 950, ...life(t) }) },
      { say: "Then the photo strip.", key: "strip", sfx: "whoosh", live: true, draw: (ctx, k) => { soft(ctx, 18, 0.5, () => FLAT(ctx)); strip(ctx, 540, 920, 1.75, -0.06 + 0.03 * Math.sin(k * 5)); } },
      { say: "She did not throw it away.", key: "not", draw: (ctx) => drawer(ctx, 0.2) },
      { say: "She put it in the drawer, on top of the letter.", key: "drawer", sfx: "thud", live: true, draw: (ctx, k) => drawer(ctx, Math.min(1, 0.2 + k)) },
      { say: "The shelf looked very empty.", key: "empty", draw: (ctx) => cam(ctx, 760, 1080, 1.9, () => wardrobe(ctx, {})) },
      { say: "Then it just looked like a shelf.", key: "shelf", dignity: 30, live: true, draw: (ctx, k, t) => face(ctx, FLAT, "smile", { look: "night", glow: 0, H: 3000, ...life(t, 2) }) },
      { say: "She opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, FLAT, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I gave the hoodie back and nothing fell down.", key: "nothing", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, FLAT, screenStage(0, C, typed(C.mine, k, 0.06, 0.85)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.85), 0.74] }) },
      { say: "It says: you let go of the thing, and you are still here.", key: "still here", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, FLAT, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "caught", { look: "night", glow: 1, H: 3400, y: 960, ...life(t, 2) }) },
      { say: "What is the shelf for now?", key: "now", tag: "IT ASKS", sfx: "chime", hold: 0.3, draw: (ctx) => inHand(ctx, FLAT, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Fill the shelf,", key: "fill", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, FLAT, VL, VR, false, true) },
      { say: "or leave it empty for a bit.", key: "empty", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, FLAT, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, FLAT, VL, VR) },
      { say: "Two days.", key: "two", days: 2, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, FLAT, screenInvite(true), { sleeve: null, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
