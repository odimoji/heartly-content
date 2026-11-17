// Episode 14, day 17, "The seating plan". Path: SILENT won episode 13 (she took the job and said nothing). Vote: FIX (wise) or LEAVE (tempting).
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep14.wav exists.
(function (g) {
  const C = { mine: "i wanted it to go wrong", reflect: "Some of you wants him to have a bad day.", askParts: [["What would that ", false], ["give you?", true]] };
  const HP = { night: true, y: 790, x: 680, w: 540 };
  // the seating plan on her screen: round tables with name tags; hot lights one table, tags is a list of [table, text]
  const TABLES = [[300, 620], [780, 620], [540, 900], [300, 1180], [780, 1180]];
  const plan = (ctx, hot, tags = [], me) => { soft(ctx, 18, 0.45, () => OFFICE(ctx)); zform(ctx, (c) => c.roundRect(70, 360, 940, 1100, 28), "#fbf4e8", [70, 360, 940, 1100], { rimW: 6, lo: 0.2 }); ctx.fillStyle = "#8a6a3a"; ctx.font = "600 36px Inter"; ctx.textAlign = "center"; ctx.letterSpacing = "6px"; ctx.fillText("SEATING · MILES & IVY", 540, 440); ctx.letterSpacing = "0px";
    TABLES.forEach(([x, y], i) => { zform(ctx, (c) => c.ellipse(x, y, 120, 120, 0, 0, 6.3), i === hot ? "#f0b9a8" : "#e9dcc6", [x - 120, y - 120, 240, 240], { rimW: 5, lo: 0.25 }); for (let s = 0; s < 8; s++) { const a = s / 8 * 6.283; ctx.fillStyle = i === hot ? "#c0452f" : "#b9a88a"; ctx.beginPath(); ctx.arc(x + Math.cos(a) * 150, y + Math.sin(a) * 150, 17, 0, 6.3); ctx.fill(); } ctx.fillStyle = "#1c1210"; ctx.font = "600 56px Cormorant"; ctx.fillText(String(i === 4 ? 9 : i + 1), x, y + 18); });
    tags.forEach(([i, text]) => { const [x, y] = TABLES[i]; ctx.font = "600 34px Inter"; const w = ctx.measureText(text).width + 40; ctx.fillStyle = "#1c1210"; ctx.beginPath(); ctx.roundRect(Math.max(90, Math.min(990 - w, x - w / 2)), y + 150, w, 58, 14); ctx.fill(); ctx.fillStyle = "#fbf4e8"; ctx.textAlign = "left"; ctx.fillText(text, Math.max(90, Math.min(990 - w, x - w / 2)) + 20, y + 191); ctx.textAlign = "center"; });
    if (me !== undefined) { const [x, y] = TABLES[me]; ctx.fillStyle = "#c0452f"; ctx.beginPath(); ctx.roundRect(x - 80, y - 190, 160, 60, 14); ctx.fill(); ctx.fillStyle = "#fbf4e8"; ctx.font = "600 38px Inter"; ctx.fillText("ZARA", x, y - 147); } };
  const VL = { word: "FIX", sub: "fix the plan tonight", color: "#f6ecdc", draw: (c) => drawZara(c, 250, 1300, 1250, "neutral", {}) };
  const VR = { word: "LEAVE", sub: "leave it one more day", color: "#f0b34a", draw: (c) => drawZara(c, 250, 1300, 1250, "plotting", {}) };
  g.EP = {
    title: "The seating plan", daysStart: 17, dignityStart: 12, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara is designing the worst seating plan of her career,", key: "worst", sfx: "ding", draw: (ctx) => plan(ctx) },
      { say: "on purpose.", key: "purpose", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "plotting", { glow: 0, H: 3000, dim: 0.15, ...life(t) }) },
      { say: "It is for her ex's wedding.", key: "ex's wedding", draw: (ctx) => inHand(ctx, OFFICE, screenInvite(true), { thumb: [0.84, 0.78] }) },
      { say: "Seventeen days.", key: "seventeen", draw: (ctx) => { drawOffice(ctx, { expr: "plotting" }); } },
      { say: "She said yes, and she said nothing.", key: "nothing", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "frozen", { glow: 0, H: 3300, y: 950, dim: 0.15, ...life(t, 1) }) },
      { say: "His mother, next to the speakers.", key: "mother speakers", sfx: "tick", draw: (ctx) => plan(ctx, 0, [[0, "his mum + the speakers"]]) },
      { say: "His best man, beside the bride's ex.", key: "ex", sfx: "tick", draw: (ctx) => plan(ctx, 1, [[1, "best man + her ex"]]) },
      { say: "The bride's table, under the air conditioning.", key: "air conditioning", sfx: "tick", draw: (ctx) => plan(ctx, 2, [[2, "top table: full blast"]]) },
      { say: "It's a bold layout.", who: "Z", key: "bold", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "frozen", { glow: 0, H: 3100, y: 950, dim: 0.15, ...life(t), bob: 8 * Math.sin(t * 11) }) },
      { say: "She gave herself table one.", key: "one", draw: (ctx) => plan(ctx, 0, [], 0) },
      { say: "Then table nine.", key: "nine", sfx: "thud", draw: (ctx) => plan(ctx, 4, [], 4) },
      { say: "Then table one again.", key: "again", sfx: "thud", draw: (ctx) => plan(ctx, 0, [], 0) },
      { say: "Mrs Finch stopped behind her chair.", key: "finch", draw: (ctx) => cam(ctx, 470, 880, 1.5, () => drawOffice(ctx, { expr: "caught", pose: { armL: [0.2, -1.9], armR: [0.14, 0.08] } })) },
      { say: "She looked at the screen for a long time.", key: "long", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "neutral", { who: finch, glow: 0, H: 2600 + 300 * k, dim: 0.15, tilt: -0.04, ...life(t, 1) }) },
      { say: "She said one word.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "dread", { glow: 0, H: 3300, y: 950, dim: 0.15, ...life(t, 2) }) },
      { say: "Interesting.", key: "interesting", dignity: 9, sfx: "thud", draw: (ctx) => { soft(ctx, 18, 0.5, () => OFFICE(ctx)); ctx.fillStyle = "#f6ecdc"; ctx.beginPath(); ctx.roundRect(150, 760, 780, 260, 80); ctx.fill(); ctx.beginPath(); ctx.moveTo(760, 1010); ctx.lineTo(860, 1140); ctx.lineTo(650, 1010); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#1c1210"; ctx.font = "italic 600 110px Cormorant"; ctx.textAlign = "center"; ctx.fillText("Interesting.", 540, 925); } },
      { say: "Zara has worked for her for four years.", key: "four", draw: (ctx) => cam(ctx, 520, 900, 1.6, () => drawOffice(ctx, { expr: "slip" })) },
      { say: "Interesting is not good.", key: "not", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "raw", { glow: 0, H: 3700, y: 930, dim: 0.15, ...life(t) }) },
      { say: "At home she opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I wanted it to go wrong.", key: "wrong", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "It says: some of you wants him to have a bad day.", key: "bad day", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", H: 3400, y: 960, ...life(t, 2) }) },
      { say: "What would that give you?", key: "give", tag: "IT ASKS", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Company.", who: "Z", key: "company", hold: 0.3, live: true, draw: (ctx, k, t) => face(ctx, BED, "raw", { look: "night", H: 3800, y: 930, ...life(t) }) },
      { say: "Fix the plan tonight,", key: "fix", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BED, VL, VR, false, true) },
      { say: "or leave it one more day.", key: "leave", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BED, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BED, VL, VR) },
      { say: "Sixteen days.", key: "sixteen", days: 16, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
