// Episode 13, day 18, "The new account". Path: STAY won episode 12. Vote: TRUTH (wise) or SILENT (tempting). The midpoint turn: his wedding becomes her job.
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep13.wav exists.
(function (g) {
  const C = { mine: "i have to plan his wedding", reflect: "You have to build the day you were dreading.", askParts: [["What do you want ", false], ["to do to it?", true]] };
  const HP = { y: 1000, x: 660, w: 540 };
  const file = (ctx, k = 1) => { soft(ctx, 18, 0.45, () => OFFICE(ctx)); ctx.save(); ctx.translate(540, 940); ctx.rotate(-0.05 + 0.02 * (1 - k)); ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(-330, -420, 700, 900); zform(ctx, (c) => c.roundRect(-350, -450, 700, 900, 18), "#e9dcc6", [-350, -450, 700, 900], { rimW: 6, lo: 0.25 }); zform(ctx, (c) => c.roundRect(-350, -500, 260, 70, [18, 18, 0, 0]), "#d9c9aa", [-350, -500, 260, 70], { rimW: 0 });
    ctx.fillStyle = "#8a6a3a"; ctx.font = "600 34px Inter"; ctx.textAlign = "center"; ctx.letterSpacing = "6px"; ctx.fillText("NEW ACCOUNT · WEDDING", 0, -330); ctx.letterSpacing = "0px"; ctx.fillStyle = "#1c1210"; ctx.font = "italic 600 150px Cormorant"; ctx.fillText("Miles", 0, -120); ctx.font = "italic 600 80px Cormorant"; ctx.fillText("&", 0, -20); ctx.font = "italic 600 150px Cormorant"; ctx.fillText("Ivy", 0, 130); ctx.fillStyle = "#c0452f"; ctx.font = "600 44px Inter"; ctx.fillText("LEAD: ZARA", 0, 300); ctx.restore(); };
  const sheet = (ctx, hot) => { soft(ctx, 18, 0.45, () => OFFICE(ctx)); zform(ctx, (c) => c.roundRect(90, 380, 900, 1060, 24), "#fbf4e8", [90, 380, 900, 1060], { rimW: 6, lo: 0.2 }); [["BUDGET", "generous"], ["VENUE", "the glasshouse"], ["GUESTS", "120"], ["TABLE 9", "Zara (guest)"]].forEach(([a, b], i) => { const y = 520 + i * 230; if (i === hot) { ctx.fillStyle = "rgba(192,69,47,.18)"; ctx.fillRect(110, y - 90, 860, 190); } ctx.fillStyle = "#8a6a3a"; ctx.font = "600 40px Inter"; ctx.textAlign = "left"; ctx.letterSpacing = "5px"; ctx.fillText(a, 150, y - 20); ctx.letterSpacing = "0px"; ctx.fillStyle = i === hot ? "#c0452f" : "#1c1210"; ctx.font = "600 78px Cormorant"; ctx.fillText(b, 150, y + 62); }); };
  const VL = { word: "TRUTH", sub: "tell Mrs Finch whose wedding it is", color: "#f6ecdc", draw: (c) => finch(c, 250, 1300, 1250, "neutral", {}) };
  const VR = { word: "SILENT", sub: "take the job, say nothing", color: "#f0b34a", draw: (c) => drawZara(c, 250, 1300, 1250, "frozen", {}) };
  g.EP = {
    title: "The new account", daysStart: 18, dignityStart: 15, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara's director has just put a new wedding on her desk.", key: "wedding", sfx: "thud", live: true, draw: (ctx, k) => file(ctx, Math.min(1, k * 3)) },
      { say: "Eighteen days away.", key: "eighteen", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "neutral", { who: finch, glow: 0, H: 2600, dim: 0.15, tilt: -0.04, ...life(t) }) },
      { say: "The couple are Miles and Ivy.", key: "miles ivy", draw: (ctx) => cam(ctx, 540, 900, 1.5, () => file(ctx)) },
      { say: "Miles is her ex.", key: "ex", sfx: "thud", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "dread", { glow: 0, H: 3300, y: 950, dim: 0.15, ...life(t, 1) }) },
      { say: "She said yes to the invitation twelve days ago.", key: "yes", draw: (ctx) => inHand(ctx, OFFICE, screenInvite(true), { thumb: [0.84, 0.78] }) },
      { say: "Now she is also running the event.", key: "running", dignity: 12, draw: (ctx) => cam(ctx, 540, 1100, 2.2, () => file(ctx)) },
      { say: "Nobody at work knows.", key: "nobody", draw: (ctx) => { drawOffice(ctx, { expr: "frozen" }); } },
      { say: "Mrs Finch said the client asked for her by name.", key: "name", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "smile", { who: finch, glow: 0, H: 2800, dim: 0.15, ...life(t, 2) }) },
      { say: "How lovely.", who: "Z", key: "lovely", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "frozen", { glow: 0, H: 3100, y: 950, dim: 0.15, ...life(t), bob: 8 * Math.sin(t * 11) }) },
      { say: "The file has a budget,", key: "budget", sfx: "tick", draw: (ctx) => sheet(ctx, 0) },
      { say: "a venue,", key: "venue", sfx: "tick", draw: (ctx) => sheet(ctx, 1) },
      { say: "and a seating plan with her own name on it.", key: "name", sfx: "tick", draw: (ctx) => sheet(ctx, 3) },
      { say: "Table nine.", key: "nine", draw: (ctx) => cam(ctx, 540, 1150, 1.45, () => sheet(ctx, 3)) },
      { say: "She read it twice.", key: "twice", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "caught", { glow: 0, H: 3500, y: 940, dim: 0.15, ...life(t, 1) }) },
      { say: "Then she smiled at a spreadsheet for eleven minutes.", key: "eleven", live: true, draw: (ctx, k) => { cam(ctx, 520, 900, 1.6, () => drawOffice(ctx, { expr: "frozen" })); label(ctx, "11:" + String(20 + Math.floor(k * 11)).padStart(2, "0") + " AM", 640, 470, { size: 36 }); } },
      { say: "On Sunday she stayed on the sofa a whole hour.", key: "hour", sfx: "whoosh", amb: [["dust"]], draw: (ctx) => cam(ctx, 590, 1080, 1.55, () => drawFlat(ctx, { expr: "neutral", pose: { sit: true, look: "night", armL: [0.5, -1.0], armR: [0.5, -1.0] } })) },
      { say: "It did not prepare her for this.", key: "this", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "slip", { glow: 0, H: 3000, dim: 0.15, ...life(t) }) },
      { say: "In the stairwell she opens the app.", key: "app", tag: "THE STAIRWELL", sfx: "chime", draw: (ctx) => inHand(ctx, OFFICE, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I have to plan his wedding.", key: "plan his", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, OFFICE, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 900, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "It says: you have to build the day you were dreading.", key: "dreading", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, OFFICE, screenStage(2, C), { ...HP, w: 580, y: 880, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "caught", { glow: 0, H: 3200, y: 960, dim: 0.15, ...life(t, 2) }) },
      { say: "What do you want to do to it?", key: "do", tag: "IT ASKS", sfx: "chime", draw: (ctx) => inHand(ctx, OFFICE, screenStage(3, C), { ...HP, w: 600, y: 900, thumb: [0.9, 0.8] }) },
      { say: "Ruin it. Slightly.", who: "Z", key: "ruin", hold: 0.25, live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "plotting", { glow: 0, H: 3600, y: 940, dim: 0.15, ...life(t) }) },
      { say: "Tell Mrs Finch the truth,", key: "truth", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, OFFICE, VL, VR, false, true) },
      { say: "or take the job and say nothing.", key: "nothing", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, OFFICE, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, OFFICE, VL, VR) },
      { say: "Seventeen days.", key: "seventeen", days: 17, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, OFFICE, screenInvite(true), { thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
