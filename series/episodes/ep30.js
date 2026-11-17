// Episode 30, day 0, "The wedding". Path: BED won episode 29. The last vote is a send-off, not a cliffhanger: DANCE or HOME.
// Miles and Ivy are never shown: a lapel, a flower, her hands. The venue is soft light only, so it is not a third drawn set.
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep30.wav exists.
(function (g) {
  const C = { mine: "i was there", reflect: "You were there, all of you, the whole day.", askParts: [["Where ", false], ["to now?", true]] };
  const SUIT = { look: "day", hair: "low", pal: { blazer: "#1f1c22", top: "#f3ead8" } };
  const HP = { sleeve: "#1f1c22", y: 790, x: 680, w: 540 };
  const VENUE = (ctx) => { const b = ctx.createLinearGradient(0, 0, 0, 1920); b.addColorStop(0, "#f3d9b8"); b.addColorStop(1, "#b98a6a"); ctx.fillStyle = b; ctx.fillRect(0, 0, 1080, 1920); for (let i = 0; i < 34; i++) { ctx.fillStyle = "rgba(255,244,210,.55)"; ctx.beginPath(); ctx.arc((i * 197) % 1080, 150 + (i * 131) % 900, 18 + (i % 4) * 9, 0, 6.3); ctx.fill(); } };
  const NIGHTOUT = (ctx) => { const b = ctx.createLinearGradient(0, 0, 0, 1920); b.addColorStop(0, "#141a2a"); b.addColorStop(1, "#2a2420"); ctx.fillStyle = b; ctx.fillRect(0, 0, 1080, 1920); for (let i = 0; i < 20; i++) { ctx.fillStyle = "rgba(255,210,140,.5)"; ctx.beginPath(); ctx.arc((i * 211) % 1080, 200 + (i * 137) % 700, 26 + (i % 4) * 12, 0, 6.3); ctx.fill(); } };
  const zf = (ctx, expr, t, o = {}) => face(ctx, VENUE, expr, { ...SUIT, glow: 0, H: 3000, dim: 0.2, ...life(t), ...o });
  const lapel = (ctx, pin = 1, back = 0) => { soft(ctx, 18, 0.2, () => VENUE(ctx)); zform(ctx, (c) => c.roundRect(60, 200, 960, 1800, 200), "#1f2a4a", [60, 200, 960, 1800], { rimW: 10, lo: 0.4 }); zform(ctx, (c) => { c.moveTo(440, 200); c.lineTo(640, 200); c.lineTo(540, 900); c.closePath(); }, "#f3ead8", [440, 200, 200, 700], { rimW: 0 }); zform(ctx, (c) => { c.moveTo(640, 200); c.lineTo(860, 200); c.lineTo(600, 1050); c.lineTo(540, 900); c.closePath(); }, "#28365c", [540, 200, 320, 850], { rimW: 6, lo: 0.3 });
    if (pin > 0) { ctx.save(); ctx.globalAlpha = Math.min(1, pin * 2); [[0, -46], [44, -14], [28, 38], [-28, 38], [-44, -14]].forEach(([dx, dy]) => zform(ctx, (c) => c.ellipse(740 + dx, 760 + dy, 34, 34, 0, 0, 6.3), "#f6ecdc", [706 + dx, 726 + dy, 68, 68], { rimW: 3 })); zform(ctx, (c) => c.ellipse(740, 760, 20, 20, 0, 0, 6.3), "#f0cc72", [720, 740, 40, 40], { rimW: 0 }); ctx.strokeStyle = "#4a7a4a"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(740, 800); ctx.lineTo(720, 900); ctx.stroke(); ctx.restore(); }
    const hx = 860 + 260 * back, hy = 900 + 200 * back; zform(ctx, (c) => c.roundRect(hx + 120, hy - 20, 400, 190, 40), "#1f1c22", [hx + 120, hy - 20, 400, 190], { rimW: 4 }); zform(ctx, (c) => c.roundRect(hx, hy, 220, 150, 70), ZC.skin, [hx, hy, 220, 150], { rimW: 6, lo: 0.3 }); [0, 1, 2].forEach((i) => zform(ctx, (c) => c.roundRect(hx - 90, hy - 10 + i * 50, 150, 44, 22), ZC.skin, [hx - 90, hy - 10 + i * 50, 150, 44], { rimW: 3 })); };
  const rain = (ctx, t) => { ctx.strokeStyle = "rgba(210,225,255,.5)"; ctx.lineWidth = 4; for (let i = 0; i < 60; i++) { const x = (i * 97 + t * 300) % 1180 - 50, y = (i * 173 + t * 1400) % 1920; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 14, y + 50); ctx.stroke(); } };
  const brolly = (ctx, x, y, s, col) => { zform(ctx, (c) => { c.moveTo(x - 260 * s, y); c.quadraticCurveTo(x, y - 300 * s, x + 260 * s, y); c.closePath(); }, col, [x - 260 * s, y - 160 * s, 520 * s, 160 * s], { rimW: 6, lo: 0.35 }); ctx.strokeStyle = "#1c1210"; ctx.lineWidth = 10 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 320 * s); ctx.stroke(); };
  const chair = (ctx) => { soft(ctx, 18, 0.3, () => VENUE(ctx)); zform(ctx, (c) => c.ellipse(540, 1320, 520, 150, 0, 0, 6.3), "#fbf4e8", [20, 1170, 1040, 300], { rimW: 6, lo: 0.2 }); zform(ctx, (c) => c.roundRect(390, 620, 300, 380, 50), "#e9dcc6", [390, 620, 300, 380], { rimW: 6, lo: 0.35 }); zform(ctx, (c) => c.roundRect(370, 1000, 340, 90, 30), "#d9cbb8", [370, 1000, 340, 90], { rimW: 4 }); ctx.fillStyle = "#1c1210"; ctx.beginPath(); ctx.roundRect(430, 760, 220, 70, 12); ctx.fill(); ctx.fillStyle = "#fbf4e8"; ctx.font = "600 40px Inter"; ctx.textAlign = "center"; ctx.fillText("ZARA", 540, 808); label(ctx, "TABLE 9", 620, 470, { size: 34 }); };
  const VL = { word: "DANCE", sub: "one song", color: "#f6ecdc", draw: (c) => drawZara(c, 250, 1300, 1250, "smile", { ...SUIT, armL: [0.9, -2.6], armR: [0.9, -2.6], tilt: 0.1 }) };
  const VR = { word: "HOME", sub: "go home, shoes off", color: "#f6ecdc", draw: (c) => drawZara(c, 250, 1320, 1150, "smile", { look: "night", blink: 1 }) };
  g.EP = {
    title: "The wedding", daysStart: 0, dignityStart: 33, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara is standing outside her ex's wedding, in a black suit,", key: "ex's wedding", sfx: "thud", live: true, draw: (ctx, k, t) => { soft(ctx, 14, 0.25, () => VENUE(ctx)); drawZara(ctx, 540, 1900, 1500, "neutral", { ...SUIT, armL: [0.2, -1.4], armR: [0.2, -1.4], ...life(t) }); rain(ctx, t); } },
      { say: "holding a box of buttonholes.", key: "buttonholes", draw: (ctx) => { soft(ctx, 18, 0.3, () => VENUE(ctx)); zform(ctx, (c) => c.roundRect(220, 800, 640, 420, 20), "#e9dcc6", [220, 800, 640, 420], { rimW: 8, lo: 0.3 }); for (let i = 0; i < 8; i++) { const x = 310 + (i % 4) * 155, y = 900 + Math.floor(i / 4) * 190; [[0, -30], [28, -8], [18, 26], [-18, 26], [-28, -8]].forEach(([dx, dy]) => zform(ctx, (c) => c.ellipse(x + dx, y + dy, 24, 24, 0, 0, 6.3), "#f6ecdc", [x + dx - 24, y + dy - 24, 48, 48], { rimW: 2 })); zform(ctx, (c) => c.ellipse(x, y, 14, 14, 0, 0, 6.3), "#f0cc72", [x - 14, y - 14, 28, 28], { rimW: 0 }); } } },
      { say: "Thirty days ago she said yes.", key: "thirty yes", draw: (ctx) => inHand(ctx, VENUE, screenInvite(true), { sleeve: "#1f1c22", thumb: [0.84, 0.78] }) },
      { say: "Today is the day.", key: "today", live: true, draw: (ctx, k, t) => zf(ctx, "neutral", t, { H: 3300, y: 950 }) },
      { say: "It rained.", key: "rained", sfx: "whoosh", live: true, draw: (ctx, k, t) => { soft(ctx, 18, 0.5, () => VENUE(ctx)); rain(ctx, t); } },
      { say: "She had umbrellas.", key: "umbrellas", sfx: "ding", live: true, draw: (ctx, k, t) => { soft(ctx, 18, 0.4, () => VENUE(ctx)); [[260, 900, 0.9, "#f6ecdc"], [820, 860, 1.0, "#d9b26a"], [540, 1100, 1.2, "#c0452f"]].forEach(([x, y, s, c], i) => k * 4 > i && brolly(ctx, x, y, s, c)); rain(ctx, t); } },
      { say: "His gran could hear the band.", key: "gran", live: true, draw: (ctx, k, t) => zf(ctx, "smile", t) },
      { say: "The bride got her ten quiet minutes.", key: "quiet", draw: (ctx) => paper(ctx, VENUE, "RUN SHEET · TODAY", [["14:50", "ten quiet minutes: done"], ["15:00", "the aisle"]], 0, { size: 56, gap: 230 }) },
      { say: "Then line fourteen.", key: "fourteen", sfx: "thud", draw: (ctx) => paper(ctx, VENUE, "RUN SHEET · TODAY", [["14", "planner pins the groom's buttonhole"]], 0, { size: 50, gap: 230 }) },
      { say: "She pinned the flower.", key: "flower", sfx: "tick", live: true, draw: (ctx, k) => lapel(ctx, Math.min(1, k * 2), 0) },
      { say: "He said, thanks for doing this.", key: "thanks", sfx: "tick", draw: (ctx) => lapel(ctx, 1, 0) },
      { say: "She said, of course.", key: "course", sfx: "tick", live: true, draw: (ctx, k, t) => zf(ctx, "smile", t, { H: 3400, y: 1000, tilt: -0.05 }) },
      { say: "Nine seconds. She counted.", key: "nine", sfx: "tick", live: true, draw: (ctx, k) => lapel(ctx, 1, k) },
      { say: "Congratulations. I mean it.", who: "Z", key: "mean", live: true, draw: (ctx, k, t) => zf(ctx, "smile", t, { H: 3300, y: 950 }) },
      { say: "She found that she did.", key: "did", live: true, draw: (ctx, k, t) => zf(ctx, "caught", t, { H: 3600, y: 940 }) },
      { say: "Not all the way. Enough.", key: "enough", dignity: 61, live: true, draw: (ctx, k, t) => zf(ctx, "raw", t, { H: 3900, y: 930 }) },
      { say: "She cued the first dance, and stepped back.", key: "back", sfx: "whoosh", live: true, draw: (ctx, k, t) => { soft(ctx, 14, 0.35, () => VENUE(ctx)); drawZara(ctx, 300 - 120 * k, 1900, 1300 - 150 * k, "smile", { ...SUIT, ...life(t) }); } },
      { say: "Nobody looked at her.", key: "nobody", live: true, draw: (ctx, k, t) => zf(ctx, "smile", t, { H: 2600, x: -200 }) },
      { say: "It was the best day's work of her life.", key: "best", live: true, draw: (ctx, k, t) => face(ctx, VENUE, "smile", { who: finch, glow: 0, H: 2700, dim: 0.2, ...life(t, 1) }) },
      { say: "At table nine there was one chair, and it was hers.", key: "hers", draw: (ctx) => chair(ctx) },
      { say: "Later, in the car park, she opens the app.", key: "car park", tag: "THE CAR PARK", sfx: "chime", draw: (ctx) => inHand(ctx, NIGHTOUT, screenStage(0, C), { ...HP, night: true, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I was there.", key: "there", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, NIGHTOUT, screenStage(0, C, typed(C.mine, k, 0.1, 0.7)), { ...HP, night: true, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.7), 0.74] }) },
      { say: "It says: you were there, all of you, the whole day.", key: "whole", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, NIGHTOUT, screenStage(2, C), { ...HP, night: true, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question. Where to now?", key: "now", tag: "IT ASKS", sfx: "chime", draw: (ctx) => inHand(ctx, NIGHTOUT, screenStage(3, C), { ...HP, night: true, w: 640, y: 880, thumb: [0.9, 0.8] }) },
      { say: "One last vote.", key: "last", live: true, draw: (ctx, k, t) => face(ctx, NIGHTOUT, "smile", { ...SUIT, glow: 1, H: 3200, y: 950, ...life(t) }) },
      { say: "Does she dance,", key: "dance", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, NIGHTOUT, VL, VR, false, true) },
      { say: "or does she go home?", key: "home", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, NIGHTOUT, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, NIGHTOUT, VL, VR) },
      { say: "Zero days.", key: "zero", days: 0, hold: 1.2, sfx: "flip", live: true, draw: (ctx, k, t) => face(ctx, NIGHTOUT, "smile", { ...SUIT, glow: 1, H: 2800, blink: k > 0.6 ? 1 : 0, bob: 6 * Math.sin(t * 2), sway: 0 }) },
    ],
  };
})(globalThis);
