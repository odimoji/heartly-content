// Episode 10, day 21, "The dress". Path: EMPTY won episode 9 (she filled the empty evening with shopping). Vote: KEEP (tempting) or RETURN (wise).
(function (g) {
  const D = { look: "dress" };
  const C = { mine: "i want him to see what he lost", reflect: "You bought it for his eyes.", askParts: [["What would you wear ", false], ["if he wasn't looking?", true]] };
  const HP = { y: 790, x: 680, w: 540, sleeve: null, night: true };
  const dress = (ctx, x, y, s, tag) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = "#d9b26a"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, -330, 26, Math.PI * 0.9, Math.PI * 2.3); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-150, -230); ctx.lineTo(0, -300); ctx.lineTo(150, -230); ctx.stroke();
    zform(ctx, (c) => { c.moveTo(-120, -240); c.quadraticCurveTo(0, -200, 120, -240); c.bezierCurveTo(100, -80, 110, 20, 250, 420); c.quadraticCurveTo(0, 470, -250, 420); c.bezierCurveTo(-110, 20, -100, -80, -120, -240); c.closePath(); }, "#c0392b", [-250, -240, 500, 700], { rimW: 8, lo: 0.4 });
    if (tag) { ctx.strokeStyle = "#f6ecdc"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(110, -230); ctx.lineTo(200, -120); ctx.stroke(); ctx.fillStyle = "#f6ecdc"; ctx.beginPath(); ctx.roundRect(150, -120, 170, 90, 10); ctx.fill(); ctx.fillStyle = "#1c1210"; ctx.font = "600 56px Inter"; ctx.textAlign = "center"; ctx.fillText(tag, 235, -56); } ctx.restore(); };
  const hang = (ctx, s, tag, rm = FLAT) => { soft(ctx, 18, 0.5, () => rm(ctx)); ctx.save(); ctx.globalCompositeOperation = "screen"; const gl = ctx.createRadialGradient(540, 900, 0, 540, 900, 700); gl.addColorStop(0, "rgba(255,120,90,.3)"); gl.addColorStop(1, "rgba(255,120,90,0)"); ctx.fillStyle = gl; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); dress(ctx, 520, 960, s, tag); };
  const mirror = (ctx, expr, t) => { soft(ctx, 18, 0.45, () => BED(ctx)); zform(ctx, (c) => c.roundRect(170, 250, 740, 1400, 370), "#d9b26a", [170, 250, 740, 1400], { rimW: 8, lo: 0.4 }); ctx.save(); ctx.beginPath(); ctx.roundRect(200, 280, 680, 1340, 340); ctx.clip(); const b = ctx.createLinearGradient(0, 280, 0, 1620); b.addColorStop(0, "#3a2c34"); b.addColorStop(1, "#1c1418"); ctx.fillStyle = b; ctx.fillRect(200, 280, 680, 1340); drawZara(ctx, 540, 1640, 1180, expr, { ...D, armL: [0.3, -0.2], armR: [0.3, 0.2], ...life(t) }); ctx.fillStyle = "rgba(255,255,255,.07)"; ctx.beginPath(); ctx.moveTo(240, 280); ctx.lineTo(420, 280); ctx.lineTo(260, 1620); ctx.lineTo(200, 1620); ctx.closePath(); ctx.fill(); ctx.restore(); };
  const slot = (name, col) => screenList("Friday", [["19:00", ""], [name, ""], ["23:00  sleep", ""]], { hot: 1, gap: 0.1 });
  const BOOK = (hot) => screenList("Booked", [["Hair", "Sat 9:00"], ["Nails", "Sat 12:00"], ["Facial", "Sat 15:00"]], { hot, gap: 0.09 });
  const VL = { word: "KEEP", sub: "keep the dress", color: "#f0b34a", draw: (c) => dress(c, 250, 470, 0.72) };
  const VR = { word: "RETURN", sub: "take it back tomorrow", color: "#f6ecdc", draw: (c) => { zform(c, (k) => k.roundRect(110, 260, 280, 360, 16), "#e9dcc6", [110, 260, 280, 360], { rimW: 5, lo: 0.3 }); c.strokeStyle = "#8a6a4a"; c.lineWidth = 8; c.beginPath(); c.moveTo(170, 262); c.quadraticCurveTo(250, 120, 330, 262); c.stroke(); c.fillStyle = "#c0392b"; c.font = "600 54px Inter"; c.textAlign = "center"; c.fillText("RETURNS", 250, 460); } };
  g.EP = {
    title: "The dress", daysStart: 21, dignityStart: 22, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara has spent four hundred on a dress", key: "four hundred", sfx: "ding", live: true, draw: (ctx, k) => hang(ctx, 1.25 + 0.03 * Math.sin(k * 5), "400") },
      { say: "for her ex's wedding.", key: "ex's wedding", draw: (ctx) => inHand(ctx, FLAT, screenInvite(true), { thumb: [0.84, 0.78] }) },
      { say: "It is in twenty-one days.", key: "twenty one", live: true, amb: [["tv", 0.16]], draw: (ctx, k, t) => face(ctx, FLAT, "plotting", { glow: 0, H: 2900, ...life(t) }) },
      { say: "She said yes,", key: "yes", live: true, amb: [["tv", 0.16]], draw: (ctx, k, t) => face(ctx, FLAT, "frozen", { glow: 0, H: 3300, y: 950, ...life(t, 1) }) },
      { say: "and she intends to look expensive.", key: "expensive", sfx: "whoosh", live: true, draw: (ctx, k) => { soft(ctx, 18, 0.45, () => FLAT(ctx)); drawZara(ctx, 540, 1760 - 40 * k, 1350 + 80 * k, "plotting", { ...D, stride: true, armL: [0.35, 0.2 + 0.2 * Math.sin(k * 9)], armR: [0.3, -0.3 - 0.2 * Math.sin(k * 9)] }); } },
      { say: "She left one evening empty.", key: "empty", draw: (ctx) => inHand(ctx, FLAT, slot("(nothing)"), { thumb: [0.84, 0.3], w: 600, y: 960 }) },
      { say: "She filled it with shopping.", key: "shopping", sfx: "ding", draw: (ctx) => inHand(ctx, FLAT, slot("Shopping. All of it."), { thumb: [0.84, 0.3], w: 600, y: 960 }) },
      { say: "Hair, booked.", key: "hair", sfx: "tick", draw: (ctx) => inHand(ctx, FLAT, BOOK(0), { thumb: [0.84, 0.2], w: 620, y: 980 }) },
      { say: "Nails, booked.", key: "nails", sfx: "tick", draw: (ctx) => inHand(ctx, FLAT, BOOK(1), { thumb: [0.84, 0.29], w: 620, y: 980 }) },
      { say: "A facial that costs more than her first car.", key: "facial car", sfx: "tick", draw: (ctx) => inHand(ctx, FLAT, BOOK(2), { thumb: [0.84, 0.38], w: 620, y: 980 }) },
      { say: "The dress is red.", key: "red", live: true, draw: (ctx, k) => hang(ctx, 1.5 + 0.2 * k) },
      { say: "The dress is, frankly, a threat.", key: "threat", live: true, amb: [["tv", 0.16]], draw: (ctx, k, t) => face(ctx, FLAT, "plotting", { ...D, glow: 0, H: 2900, tilt: 0.05, ...life(t, 2) }) },
      { say: "It's an investment.", who: "Z", key: "investment", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "frozen", { glow: 0, H: 3000, dim: 0.15, ...life(t) }) },
      { say: "Her director asked what the occasion was.", key: "occasion", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "neutral", { who: finch, glow: 0, H: 2600, dim: 0.15, tilt: -0.04, ...life(t, 1) }) },
      { say: "A funeral. Sort of.", who: "Z", key: "funeral", dignity: 20, sfx: "thud", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "slip", { glow: 0, H: 3300, y: 950, dim: 0.15, ...life(t, 2) }) },
      { say: "At home she tried it on,", key: "tried", sfx: "whoosh", live: true, draw: (ctx, k, t) => mirror(ctx, "plotting", t) },
      { say: "and stood at the mirror for a while.", key: "mirror", live: true, draw: (ctx, k, t) => cam(ctx, 540, 760, 1.5, () => mirror(ctx, "neutral", t)) },
      { say: "She looked incredible.", key: "incredible", sfx: "ding", live: true, draw: (ctx, k, t) => face(ctx, BED, "smile", { ...D, glow: 0, H: 2900, ...life(t) }) },
      { say: "She felt exactly the same.", key: "same", live: true, draw: (ctx, k, t) => face(ctx, BED, "raw", { ...D, glow: 0, H: 3700, y: 930, ...life(t, 1) }) },
      { say: "So she opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I want him to see what he lost.", key: "see lost", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "It says: you bought it for his eyes.", key: "his eyes", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { ...D, H: 3400, y: 960, ...life(t, 2) }) },
      { say: "What would you wear if he wasn't looking?", key: "wear looking", tag: "IT ASKS", sfx: "chime", hold: 0.3, draw: (ctx) => inHand(ctx, BED, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Keep the dress,", key: "keep", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BED, VL, VR, false, true) },
      { say: "or take it back tomorrow.", key: "back", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BED, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BED, VL, VR) },
      { say: "Twenty days.", key: "twenty", days: 20, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, sleeve: null, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
