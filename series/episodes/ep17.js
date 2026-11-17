// Episode 17, day 14, "The list". Path: KEEP won episode 16 (the letter is in the drawer). Vote: SEND (tempting) or COLUMN (wise: add a second column). Blame begins.
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep17.wav exists.
(function (g) {
  const C = { mine: "it's all his fault and i have the data", reflect: "Forty items, and every one of them is his.", askParts: [["What is ", false], ["not on the list?", true]] };
  const HP = { night: true, sleeve: null, y: 790, x: 680, w: 540 };
  const L = (rows, hot, o) => (ctx) => paper(ctx, FLAT, "EVERYTHING HE DID · v3", rows, hot, o);
  const pie = (ctx, k = 1) => { soft(ctx, 18, 0.45, () => FLAT(ctx)); zform(ctx, (c) => c.roundRect(90, 380, 900, 1060, 24), "#fbf4e8", [90, 380, 900, 1060], { rimW: 6, lo: 0.2 }); const cols = ["#c0452f", "#d9b26a", "#5fa08a", "#7a8ad0"], parts = [0.46, 0.27, 0.17, 0.1]; let a = -1.57; parts.forEach((p, i) => { ctx.fillStyle = cols[i]; ctx.beginPath(); ctx.moveTo(540, 880); ctx.arc(540, 880, 330, a, a + p * 6.283 * k); ctx.closePath(); ctx.fill(); a += p * 6.283 * k; }); ctx.fillStyle = "#1c1210"; ctx.font = "600 44px Inter"; ctx.textAlign = "center"; ctx.fillText("WHOSE FAULT: 100% HIM", 540, 470); };
  const VL = { word: "SEND", sub: "send the list to Remy", color: "#f0b34a", draw: (c) => heldPhone(c, 230, 400, 300, screenThread("Remy", [], "40 items. with a pie chart."), { thumbAt: [0.86, 0.86], glow: 0 }) };
  const VR = { word: "COLUMN", sub: "add a second column", color: "#f6ecdc", draw: (c) => { zform(c, (k) => k.roundRect(90, 220, 320, 380, 8), "#fbf4e8", [90, 220, 320, 380], { rimW: 5, lo: 0.2 }); c.strokeStyle = "#8a7a68"; c.lineWidth = 4; c.beginPath(); c.moveTo(250, 230); c.lineTo(250, 590); c.stroke(); c.fillStyle = "#1c1210"; c.font = "600 40px Inter"; c.textAlign = "center"; c.fillText("HIM", 170, 280); c.fillStyle = "#c0452f"; c.fillText("ME", 330, 280); } };
  g.EP = {
    title: "The list", daysStart: 14, dignityStart: 10, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara is making a list of everything her ex did wrong.", key: "ex wrong", sfx: "ding", draw: L([["1", "the car park"], ["2", "the hoodie situation"], ["3", "\"take care\""], ["4", "the bin bags"], ["5", "five months. FIVE."]]) },
      { say: "She is on item thirty one.", key: "thirty one", live: true, amb: [["tv", 0.14]], draw: (ctx, k, t) => face(ctx, FLAT, "plotting", { look: "night", glow: 0, H: 3000, ...life(t) }) },
      { say: "His wedding is in fourteen days.", key: "fourteen", draw: (ctx) => inHand(ctx, FLAT, screenInvite(true), { sleeve: null, thumb: [0.84, 0.78] }) },
      { say: "She said yes.", key: "yes", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "frozen", { look: "night", glow: 0, H: 3300, y: 950, ...life(t, 1) }) },
      { say: "The letter is in the drawer.", key: "drawer", draw: (ctx) => { soft(ctx, 18, 0.5, () => FLAT(ctx)); zform(ctx, (c) => c.roundRect(170, 800, 740, 420, 20), "#5a3a26", [170, 800, 740, 420], { rimW: 8, lo: 0.4 }); zform(ctx, (c) => c.roundRect(300, 650, 480, 220, 8), "#fbf4e8", [300, 650, 480, 220], { rimW: 5, lo: 0.2 }); zform(ctx, (c) => c.ellipse(540, 1020, 34, 34, 0, 0, 6.3), "#d9b26a", [506, 986, 68, 68], { rimW: 0 }); } },
      { say: "The list is new.", key: "new", draw: L([["29", "hummed while reading"], ["30", "called it \"a\" break"], ["31", "…"]], 2) },
      { say: "The list is in a spreadsheet, because she is a professional.", key: "professional", amb: [["tv", 0.16], ["dust"]], draw: (ctx) => cam(ctx, 590, 1080, 1.55, () => drawFlat(ctx, { expr: "plotting", pose: { sit: true, look: "night", armL: [0.3, -1.5], armR: [0.3, -1.5] } })) },
      { say: "Item four. Never once replaced the bin bag.", key: "bin", sfx: "tick", draw: L([["4", "never replaced the bin bag"]], 0, { size: 62 }) },
      { say: "Item twelve. Said relax, during an argument.", key: "relax", sfx: "tick", draw: L([["12", "said \"relax\". mid-argument."]], 0, { size: 62 }) },
      { say: "Item nineteen. Liked his own photos.", key: "own", sfx: "tick", draw: L([["19", "liked his own photos"]], 0, { size: 62 }) },
      { say: "Column B is severity.", who: "Z", key: "severity", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "frozen", { look: "night", glow: 0, H: 3100, y: 950, ...life(t), bob: 8 * Math.sin(t * 11) }) },
      { say: "By midnight there were forty items and a pie chart.", key: "forty pie", sfx: "whoosh", live: true, draw: (ctx, k) => pie(ctx, Math.min(1, k * 1.6)) },
      { say: "The pie chart was very satisfying.", key: "satisfying", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "smile", { look: "night", glow: 0, H: 3000, ...life(t, 2) }) },
      { say: "For about a minute.", key: "minute", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "slip", { look: "night", glow: 0, H: 3500, y: 940, ...life(t) }) },
      { say: "Then she noticed the list only had one name on it.", key: "one name", dignity: 9, sfx: "thud", draw: (ctx) => paper(ctx, FLAT, "EVERYTHING HE DID · v3", [["WHO", "Miles"], ["WHO", "Miles"], ["WHO", "Miles"], ["WHO", "Miles"]], -1, { total: "×40" }) },
      { say: "She opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, FLAT, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: it is all his fault and I have the data.", key: "fault data", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, FLAT, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "It says: forty items, and every one of them is his.", key: "his", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, FLAT, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "caught", { look: "night", glow: 1, H: 3400, y: 960, ...life(t, 2) }) },
      { say: "What is not on the list?", key: "not", tag: "IT ASKS", sfx: "chime", hold: 0.3, draw: (ctx) => inHand(ctx, FLAT, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Send the list to her best friend,", key: "send", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, FLAT, VL, VR, false, true) },
      { say: "or add a second column.", key: "column", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, FLAT, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, FLAT, VL, VR) },
      { say: "Thirteen days.", key: "thirteen", days: 13, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, FLAT, screenInvite(true), { sleeve: null, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
