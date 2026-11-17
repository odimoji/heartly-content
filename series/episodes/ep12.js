// Episode 12, day 19, "Sunday". Path: DRIVE won episode 11 (she went to her mum's). Vote: STAY (wise) or TIDY (tempting).
(function (g) {
  const N = { look: "night" };
  const C = { mine: "i can't sit still for five minutes", reflect: "Four minutes in, something showed up.", askParts: [["What ", false], ["was it?", true]] };
  const HP = { night: true, sleeve: null, y: 790, x: 680, w: 540 };
  const day = (rows, hot) => screenList("Sunday", rows, { hot, gap: 0.1 });
  const OFF = [["Spin", "cancelled"], ["Clients", "none"], ["Pottery", "skipped"]];
  const sit = (ctx, expr, o = {}) => cam(ctx, 590, 1080, o.s || 1.55, () => drawFlat(ctx, { expr, pose: { sit: true, look: "night", armL: [0.5, -1.0], armR: [0.5, -1.0], ...(o.pose || {}) } }));
  const box = (x, y, w, h, r) => (c) => c.roundRect(x, y, w, h, r);
  const appliance = (ctx, kind, k) => { soft(ctx, 18, 0.5, () => FLAT(ctx)); zform(ctx, box(190, 420, 700, 1000, 30), kind === "oven" ? "#2a2624" : "#d9d4cc", [190, 420, 700, 1000], { rimW: 8, lo: 0.4 }); zform(ctx, box(230, 460, 620, 110, 14), kind === "oven" ? "#3a3532" : "#c4beb4", [230, 460, 620, 110], { rimW: 0 }); [0, 1, 2].forEach((i) => zform(ctx, (c) => c.ellipse(320 + i * 110, 515, 30, 30, 0, 0, 6.3), "#8a857c", [290 + i * 110, 485, 60, 60], { rimW: 3 }));
    ctx.fillStyle = "#14100e"; ctx.beginPath(); ctx.roundRect(250, 620, 580, 740, 20); ctx.fill(); ctx.strokeStyle = "#b9b2a6"; ctx.lineWidth = 8; if (kind === "oven") { [820, 1040].forEach((y) => { ctx.beginPath(); ctx.moveTo(270, y); ctx.lineTo(810, y); ctx.stroke(); }); } else { [800, 1080].forEach((y) => { ctx.strokeRect(290, y, 500, 200); for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(330 + i * 84, y); ctx.lineTo(330 + i * 84, y - 70); ctx.stroke(); } }); }
    ctx.save(); ctx.fillStyle = "#fff6d8"; for (let i = 0; i < 7; i++) { const x = 300 + (i * 163) % 500, y = 680 + (i * 211) % 620, s = 10 + 16 * Math.abs(Math.sin(k * 9 + i * 1.7)); ctx.beginPath(); ctx.moveTo(x, y - s * 2); ctx.lineTo(x + s * 0.5, y - s * 0.5); ctx.lineTo(x + s * 2, y); ctx.lineTo(x + s * 0.5, y + s * 0.5); ctx.lineTo(x, y + s * 2); ctx.lineTo(x - s * 0.5, y + s * 0.5); ctx.lineTo(x - s * 2, y); ctx.lineTo(x - s * 0.5, y - s * 0.5); ctx.closePath(); ctx.fill(); } ctx.restore(); };
  const cakeCard = (ctx) => { soft(ctx, 18, 0.5, () => FLAT(ctx)); ctx.save(); ctx.translate(540, 900); ctx.rotate(0.04); ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.fillRect(-314, -380, 660, 800); ctx.fillStyle = "#fbf4e8"; ctx.fillRect(-330, -400, 660, 800); ctx.save(); ctx.translate(-290, -360); ctx.beginPath(); ctx.rect(0, 0, 580, 580); ctx.clip(); PICS.cake(ctx, 580, 580); ctx.restore(); ctx.fillStyle = "#1c1210"; ctx.font = "italic 600 70px Cormorant"; ctx.textAlign = "center"; ctx.fillText("happy birthday mum (+1)", 0, 330); ctx.restore(); };
  const MUM = (n) => screenThread("Mum", [{ t: "on my way", me: true }, { t: "door's open, love", me: false }, { t: "lovely to see you x", me: false }, { t: "eat something", me: false }].slice(0, n), "");
  const VL = { word: "STAY", sub: "one hour on the sofa", color: "#f6ecdc", draw: (c) => drawZara(c, 250, 1320, 1150, "neutral", { look: "night" }) };
  const VR = { word: "TIDY", sub: "reorganise the wardrobe", color: "#f0b34a", draw: (c) => { c.save(); c.scale(0.5, 0.5); c.translate(-40, -160); wardrobe(c, { hoodieAt: "shelf" }); c.restore(); } };
  g.EP = {
    title: "Sunday", daysStart: 19, dignityStart: 16, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "It is Sunday, and Zara has nothing in the calendar.", key: "sunday nothing", sfx: "ding", draw: (ctx) => inHand(ctx, FLAT, day([["All day", ""], ["(nothing)", ""]], 1), { sleeve: null, thumb: [0.84, 0.3], w: 600, y: 960 }) },
      { say: "She put it there on purpose.", key: "purpose", live: true, amb: [["dust"]], draw: (ctx, k, t) => face(ctx, FLAT, "plotting", { look: "night", glow: 0, H: 3000, ...life(t) }) },
      { say: "Her ex's wedding is in nineteen days.", key: "ex's nineteen", draw: (ctx) => inHand(ctx, FLAT, screenInvite(true), { sleeve: null, thumb: [0.84, 0.78] }) },
      { say: "She said yes.", key: "yes", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "frozen", { look: "night", glow: 0, H: 3300, y: 950, ...life(t, 1) }) },
      { say: "She drove to her mum's on Tuesday.", key: "mum's", sfx: "whoosh", draw: (ctx) => inHand(ctx, FLAT, MUM(2), { sleeve: null, thumb: [0.9, 0.62], rot: 0.04, x: 620 }) },
      { say: "They had cake a day late.", key: "cake", draw: (ctx) => cakeCard(ctx) },
      { say: "Her mum did not mention Miles again.", key: "miles", sfx: "buzz", draw: (ctx) => inHand(ctx, FLAT, MUM(4), { sleeve: null, thumb: [0.9, 0.62], rot: 0.04, x: 620 }) },
      { say: "So today is empty.", key: "empty", amb: [["dust"]], draw: (ctx) => sit(ctx, "neutral") },
      { say: "No spin.", key: "spin", sfx: "tick", draw: (ctx) => inHand(ctx, FLAT, day(OFF, 0), { sleeve: null, thumb: [0.84, 0.2], w: 620, y: 980 }) },
      { say: "No clients.", key: "clients", sfx: "tick", draw: (ctx) => inHand(ctx, FLAT, day(OFF, 1), { sleeve: null, thumb: [0.84, 0.3], w: 620, y: 980 }) },
      { say: "No pottery.", key: "pottery", sfx: "tick", draw: (ctx) => inHand(ctx, FLAT, day(OFF, 2), { sleeve: null, thumb: [0.84, 0.4], w: 620, y: 980 }) },
      { say: "By ten she had cleaned the oven.", key: "oven", sfx: "whoosh", live: true, draw: (ctx, k) => { appliance(ctx, "oven", k); label(ctx, "10:00 · THE OVEN", 640, 380, { size: 32 }); } },
      { say: "By eleven, the inside of the dishwasher.", key: "dishwasher", live: true, draw: (ctx, k) => { appliance(ctx, "dish", k); label(ctx, "11:00 · THE DISHWASHER", 680, 380, { size: 28 }); } },
      { say: "It's called self care.", who: "Z", key: "self care", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "frozen", { look: "night", glow: 0, H: 3100, y: 950, ...life(t), bob: 8 * Math.sin(t * 11) }) },
      { say: "At noon she sat down.", key: "sat", sfx: "thud", amb: [["dust"]], draw: (ctx) => { sit(ctx, "neutral"); label(ctx, "12:00", 640, 470, { size: 40 }); } },
      { say: "It lasted four minutes.", key: "four", dignity: 15, sfx: "tick", live: true, amb: [["dust"]], draw: (ctx, k) => { sit(ctx, k > 0.75 ? "caught" : "slip", { s: 1.9, pose: { armL: [0.5, -1.0 - 0.6 * Math.abs(Math.sin(k * 14))], armR: [0.5, -1.0 - 0.6 * Math.abs(Math.cos(k * 12))] } }); label(ctx, "12:0" + Math.min(4, Math.floor(k * 5)), 640, 470, { size: 40 }); } },
      { say: "The flat was very quiet.", key: "quiet", amb: [["dust"]], draw: (ctx) => drawFlat(ctx, { expr: "raw", pose: { sit: true, look: "night", armL: [0.5, -1.0], armR: [0.5, -1.0] } }) },
      { say: "The invitation was very loud.", key: "loud", live: true, amb: [["glow", 560, 1000, 520, "255,210,150"]], draw: (ctx, k) => cam(ctx, 690, 1500, 3.2 + 0.5 * k, () => drawFlat(ctx, { zara: false })) },
      { say: "She opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, FLAT, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I can't sit still for five minutes.", key: "sit still", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, FLAT, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "It says: four minutes in, something showed up.", key: "something", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, FLAT, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "caught", { look: "night", glow: 1, H: 3400, y: 960, ...life(t, 2) }) },
      { say: "What was it?", key: "what", tag: "IT ASKS", sfx: "chime", draw: (ctx) => inHand(ctx, FLAT, screenStage(3, C), { ...HP, w: 640, y: 880, thumb: [0.9, 0.8] }) },
      { say: "Him. Obviously.", who: "Z", key: "him", hold: 0.25, live: true, draw: (ctx, k, t) => face(ctx, FLAT, "raw", { look: "night", glow: 1, H: 3800, y: 930, ...life(t) }) },
      { say: "Stay on the sofa for one hour,", key: "stay", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, FLAT, VL, VR, false, true) },
      { say: "or go and reorganise the wardrobe.", key: "wardrobe", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, FLAT, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, FLAT, VL, VR) },
      { say: "Eighteen days.", key: "eighteen", days: 18, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, FLAT, screenInvite(true), { sleeve: null, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
