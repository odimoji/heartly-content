// Episode 23, day 8, "Whose wedding". Path: SUIT won episode 22. Vote: HAND (tempting: hand the wedding to a colleague) or THROUGH (wise: see it through). The truth is told at work.
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep23.wav exists.
(function (g) {
  const C = { mine: "she knew, and she let me do it anyway", reflect: "Someone trusted you with the hard version.", askParts: [["Do you ", false], ["trust yourself with it?", true]] };
  const HP = { night: true, y: 790, x: 680, w: 540 };
  const ff = (ctx, expr, t, o = {}) => face(ctx, OFFICE, expr, { who: finch, glow: 0, H: 2600, dim: 0.15, tilt: -0.04, ...life(t, 1), ...o });
  const zf = (ctx, expr, t, o = {}) => face(ctx, OFFICE, expr, { glow: 0, H: 3000, dim: 0.15, ...life(t), ...o });
  const bubble = (ctx, text) => { soft(ctx, 18, 0.5, () => OFFICE(ctx)); ctx.fillStyle = "#f6ecdc"; ctx.beginPath(); ctx.roundRect(190, 760, 700, 260, 80); ctx.fill(); ctx.beginPath(); ctx.moveTo(720, 1010); ctx.lineTo(820, 1140); ctx.lineTo(610, 1010); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#1c1210"; ctx.font = "italic 600 130px Cormorant"; ctx.textAlign = "center"; ctx.fillText(text, 540, 930); };
  const plan = (ctx, bad) => paper(ctx, OFFICE, "SEATING · MILES & IVY", bad ? [["TABLE 1", "his mum + the speakers"], ["TABLE 2", "best man + her ex"]] : [["TABLE 1", "his mum, by the window"], ["TABLE 2", "best man, far from trouble"], ["TABLE 9", "Zara (guest)"]], bad ? 0 : -1, { size: 56, gap: 230 });
  const VL = { word: "HAND", sub: "hand it to a colleague", color: "#f0b34a", draw: (c) => { zform(c, (k) => k.roundRect(110, 260, 280, 360, 12), "#e9dcc6", [110, 260, 280, 360], { rimW: 5, lo: 0.25 }); c.fillStyle = "#1c1210"; c.font = "italic 600 54px Cormorant"; c.textAlign = "center"; c.fillText("Miles", 250, 400); c.fillText("& Ivy", 250, 470); c.fillStyle = "#c0452f"; c.font = "600 30px Inter"; c.fillText("LEAD: —", 250, 560); } };
  const VR = { word: "THROUGH", sub: "see it through", color: "#f6ecdc", draw: (c) => drawZara(c, 250, 1300, 1250, "neutral", {}) };
  g.EP = {
    title: "Whose wedding", daysStart: 8, dignityStart: 12, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara is about to tell her director something she has hidden for ten days.", key: "hidden", sfx: "thud", live: true, draw: (ctx, k, t) => zf(ctx, "dread", t) },
      { say: "The wedding she is planning is her ex's.", key: "ex's", draw: (ctx) => paper(ctx, OFFICE, "NEW ACCOUNT · WEDDING", [["COUPLE", "Miles & Ivy"], ["LEAD", "Zara"]], 0, { size: 90, gap: 260 }) },
      { say: "It is in eight days.", key: "eight", draw: (ctx) => inHand(ctx, OFFICE, screenInvite(true), { thumb: [0.84, 0.78] }) },
      { say: "She said yes to the invite before she got the job.", key: "yes", live: true, draw: (ctx, k, t) => zf(ctx, "frozen", t, { H: 3300, y: 950 }) },
      { say: "She chose the suit.", key: "suit", sfx: "ding", draw: (ctx) => { soft(ctx, 18, 0.5, () => OFFICE(ctx)); suitProp(ctx, 540, 960, 1.35); } },
      { say: "The suit has pockets, and nowhere to hide.", key: "hide", live: true, draw: (ctx, k, t) => zf(ctx, "slip", t, { H: 2800 }) },
      { say: "Mrs Finch was reading a contract.", key: "finch", live: true, draw: (ctx, k, t) => ff(ctx, "neutral", t) },
      { say: "Miles is my ex. Three years.", who: "Z", key: "ex", live: true, draw: (ctx, k, t) => zf(ctx, "raw", t, { H: 3400, y: 950 }) },
      { say: "Mrs Finch did not look up straight away.", key: "not", live: true, draw: (ctx, k, t) => ff(ctx, "neutral", t, { H: 2600 + 300 * k }) },
      { say: "Then she said, I know.", key: "know", sfx: "thud", draw: (ctx) => bubble(ctx, "I know.") },
      { say: "She had known since the seating plan.", key: "seating", live: true, draw: (ctx, k, t) => zf(ctx, "caught", t, { H: 3300, y: 950 }) },
      { say: "Nobody puts a groom's mother next to the speakers by accident.", key: "accident", draw: (ctx) => plan(ctx, true) },
      { say: "She had been waiting to see what Zara would do with it.", key: "waiting", live: true, draw: (ctx, k, t) => ff(ctx, "smile", t, { H: 2900 }) },
      { say: "Zara had fixed the plan.", key: "fixed", sfx: "ding", draw: (ctx) => plan(ctx, false) },
      { say: "That was the answer.", key: "answer", dignity: 20, live: true, draw: (ctx, k, t) => zf(ctx, "smile", t, { H: 3100, y: 950 }) },
      { say: "That night she opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: she knew, and she let me do it anyway.", key: "knew anyway", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(0, C, typed(C.mine, k, 0.06, 0.85)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.85), 0.74] }) },
      { say: "It says: someone trusted you with the hard version.", key: "trusted", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", H: 3400, y: 960, ...life(t, 2) }) },
      { say: "Do you trust yourself with it?", key: "trust", tag: "IT ASKS", sfx: "chime", hold: 0.3, draw: (ctx) => inHand(ctx, BED, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Hand the wedding to a colleague,", key: "hand", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BED, VL, VR, false, true) },
      { say: "or see it through.", key: "through", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BED, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BED, VL, VR) },
      { say: "Seven days.", key: "seven", days: 7, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
