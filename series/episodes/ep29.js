// Episode 29, day 2, "The plant". Path: EMPTY won episode 28 (the shelf stays empty). Vote: BED (wise) or SIT (tempting: sit up with it). The night before the night before.
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep29.wav exists.
(function (g) {
  const C = { mine: "nothing to fix and i don't know what to do with my hands", reflect: "When there is nothing to fix, what is left is the feeling.", askParts: [["Can it just ", false], ["be there tonight?", true]] };
  const HP = { night: true, sleeve: null, y: 790, x: 680, w: 540 };
  const EAR = { sit: true, armL: [0.25, -0.4], armR: [0.95, -3.95], phone: "R", tilt: 0.05, look: "night" };
  const plant = (ctx, k = 0, water) => { soft(ctx, 18, 0.5, () => FLAT(ctx)); ctx.strokeStyle = "#6a5a3a"; ctx.lineWidth = 12; ctx.lineCap = "round"; [[-140, 0.9], [-40, 0.6], [90, 0.8], [170, 1.0]].forEach(([dx, droop], i) => { ctx.beginPath(); ctx.moveTo(540 + dx * 0.2, 1150); ctx.quadraticCurveTo(540 + dx, 760, 540 + dx * 1.9, 760 + 260 * droop); ctx.stroke(); zform(ctx, (c) => c.ellipse(540 + dx * 1.9, 780 + 260 * droop, 60, 26, 0.6, 0, 6.3), "#8a7a4a", [480 + dx * 1.9, 750 + 260 * droop, 120, 60], { rimW: 2 }); });
    ctx.strokeStyle = "#4a7a4a"; ctx.beginPath(); ctx.moveTo(545, 1150); ctx.quadraticCurveTo(560, 800, 600 + 20 * k, 640 - 30 * k); ctx.stroke(); zform(ctx, (c) => c.ellipse(610 + 20 * k, 610 - 30 * k, 90, 40, -0.7, 0, 6.3), "#5fa05a", [520, 540, 180, 140], { rimW: 4 });
    zform(ctx, (c) => { c.moveTo(380, 1130); c.lineTo(700, 1130); c.lineTo(660, 1460); c.lineTo(420, 1460); c.closePath(); }, "#e9dcc6", [380, 1130, 320, 330], { rimW: 8, lo: 0.35 });
    if (water) { ctx.fillStyle = "rgba(160,200,255,.85)"; for (let i = 0; i < 7; i++) { const p = (k * 2 + i / 7) % 1; ctx.beginPath(); ctx.ellipse(760 - 180 * p, 700 + 420 * p, 9, 16, 0.4, 0, 6.3); ctx.fill(); } zform(ctx, (c) => c.roundRect(760, 560, 260, 200, 30), "#c9793f", [760, 560, 260, 200], { rimW: 6, lo: 0.35 }); ctx.strokeStyle = "#c9793f"; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(770, 660); ctx.lineTo(680, 620); ctx.stroke(); } };
  const done = (hot) => (ctx) => paper(ctx, FLAT, "MILES & IVY · TWO DAYS OUT", [["SUIT", "pressed"], ["RUN SHEET", "done"], ["UMBRELLAS", "in the van"], ["BAND", "knows about his gran"]], hot, { size: 54, gap: 190 });
  const VL = { word: "BED", sub: "go to bed early", color: "#f6ecdc", draw: (c) => drawZara(c, 250, 1320, 1150, "neutral", { look: "night", blink: 1, tilt: 0.1 }) };
  const VR = { word: "SIT", sub: "sit up with it a while", color: "#f0b34a", draw: (c) => drawZara(c, 250, 1320, 1150, "raw", { look: "night" }) };
  g.EP = {
    title: "The plant", daysStart: 2, dignityStart: 30, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara has nothing left to fix.", key: "nothing", sfx: "ding", amb: [["dust"]], draw: (ctx) => cam(ctx, 590, 1080, 1.55, () => drawFlat(ctx, { expr: "neutral", pose: { sit: true, look: "night", armL: [0.5, -1.0], armR: [0.5, -1.0] } })) },
      { say: "Her ex gets married in two days. She said yes.", key: "ex two yes", draw: (ctx) => inHand(ctx, FLAT, screenInvite(true), { sleeve: null, thumb: [0.84, 0.78] }) },
      { say: "The suit is pressed.", key: "suit", sfx: "tick", draw: done(0) },
      { say: "The run sheet is done.", key: "done", sfx: "tick", draw: done(1) },
      { say: "So tonight she is watering the plant.", key: "plant", sfx: "whoosh", live: true, draw: (ctx, k) => plant(ctx, k, true) },
      { say: "The plant has been dying since the day she said yes.", key: "dying", draw: (ctx) => cam(ctx, 540, 900, 1.5, () => plant(ctx, 0)) },
      { say: "Sorry. Rude of me.", who: "Z", key: "rude", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "smile", { look: "night", glow: 0, H: 3100, y: 950, ...life(t) }) },
      { say: "It has one green leaf.", key: "one", live: true, draw: (ctx, k) => cam(ctx, 600, 640, 2.6, () => plant(ctx, 0.5 + 0.5 * Math.sin(k * 5))) },
      { say: "She gave it water anyway.", key: "anyway", live: true, draw: (ctx, k) => plant(ctx, k, true) },
      { say: "Her mum rang, on a Sunday.", key: "mum sunday", sfx: "buzz", live: true, draw: (ctx, k) => inHand(ctx, FLAT, screenList("Mum", [["calling…", ""]], { hot: 0 }), { sleeve: null, thumb: [0.8, 0.86], rot: 0.025 * Math.sin(k * 60) }) },
      { say: "Her mum asked if she was all right.", key: "right", amb: [["tv", 0.14]], draw: (ctx) => cam(ctx, 590, 960, 2.5, () => drawFlat(ctx, { expr: "neutral", pose: EAR })) },
      { say: "I think I'm sad. And all right.", who: "Z", key: "sad right", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "raw", { look: "night", glow: 0, H: 3500, y: 940, ...life(t, 1) }) },
      { say: "Both turned out to fit in one sentence.", key: "both", dignity: 33, live: true, draw: (ctx, k, t) => face(ctx, FLAT, "smile", { look: "night", glow: 0, H: 3200, y: 950, ...life(t, 2) }) },
      { say: "The flat was quiet.", key: "quiet", amb: [["dust"]], draw: (ctx) => drawFlat(ctx, { expr: "neutral", pose: { sit: true, look: "night", armL: [0.5, -1.0], armR: [0.5, -1.0] } }) },
      { say: "This time she let it be.", key: "let", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "neutral", { look: "night", glow: 0, H: 3000, blink: k > 0.5 ? 1 : 0, bob: 5 * Math.sin(t * 2), sway: 0 }) },
      { say: "She opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, FLAT, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: there is nothing to fix and I don't know what to do with my hands.", key: "nothing hands", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, FLAT, screenStage(0, C, typed(C.mine, k, 0.05, 0.88)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k, 44) * (k < 0.88), 0.74] }) },
      { say: "It says: when there is nothing to fix, what is left is the feeling.", key: "feeling", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, FLAT, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "caught", { look: "night", glow: 1, H: 3400, y: 960, ...life(t, 2) }) },
      { say: "Can it just be there tonight?", key: "tonight", tag: "IT ASKS", sfx: "chime", hold: 0.3, draw: (ctx) => inHand(ctx, FLAT, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Go to bed early,", key: "bed", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, FLAT, VL, VR, false, true) },
      { say: "or sit up with it a while.", key: "sit", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, FLAT, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, FLAT, VL, VR) },
      { say: "One day.", key: "one", days: 1, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, FLAT, screenInvite(true), { sleeve: null, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
