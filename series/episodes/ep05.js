// Episode 5, day 26, "One drink". Path: ONCE won episode 4 (one look a day, at nine). Vote: HOME (wise) or STAY (tempting). New place: the bar.
(function (g) {
  const C = { mine: "i only feel fine after two drinks", reflect: "Fine arrives at drink two.", askParts: [["What happens to the feeling ", false], ["at drink three?", true]] };
  const HP = { y: 790, x: 680, w: 540 };
  const SUIT = { pic: "suit", when: "20:41", caption: "fitting no. 2. going with navy", likes: "301 likes" };
  const glasses = (c, n, y = 1500, x0 = 620, s = 1.5) => { for (let i = 0; i < n; i++) glass(c, x0 + i * 120, y, s, "#8c2f3a", i === n - 1 ? 0.55 : 0.04); };
  const bface = (ctx, expr, t, n, o = {}) => face(ctx, BAR, expr, { glow: 0, H: 2700, dim: 0.2, ...life(t, n), ...o, over: (c) => glasses(c, n, 1700, 700 - n * 40, 2.2) });
  const VL = { word: "HOME", sub: "coat on, dignity intact", color: "#f6ecdc", draw: (c) => drawZara(c, 250, 1300, 1250, "smile", {}) };
  const VR = { word: "STAY", sub: "one more", color: "#f0b34a", draw: (c) => { glass(c, 190, 760, 2.4, "#8c2f3a", 0.7); glass(c, 350, 780, 2.0, "#8c2f3a", 0.05); } };
  g.EP = {
    title: "One drink", daysStart: 26, dignityStart: 41, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "It is Friday, and Zara has an alarm", key: "alarm", sfx: "ding", draw: (ctx) => inHand(ctx, OFFICE, screenAlarm("9:00", "one look"), { thumb: [0.84, 0.8] }) },
      { say: "set for nine o'clock.", key: "nine", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "plotting", { glow: 0, H: 2800, dim: 0.15, ...life(t) }) },
      { say: "It says: one look.", key: "one look", draw: (ctx) => inHand(ctx, OFFICE, screenAlarm("9:00", "one look"), { thumb: [0.84, 0.8], w: 700, y: 1120, x: 600 }) },
      { say: "That is the deal.", key: "deal", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "neutral", { glow: 0, H: 3200, y: 950, dim: 0.15, ...life(t, 1) }) },
      { say: "One look a day at the ex", key: "ex", draw: (ctx) => inHand(ctx, OFFICE, screenProfile({ muted: true }), { thumb: [0.86, 0.5], w: 600, y: 960 }) },
      { say: "whose wedding she said yes to.", key: "yes", draw: (ctx) => inHand(ctx, OFFICE, screenInvite(true), { thumb: [0.84, 0.78] }) },
      { say: "Twenty-six days.", key: "twenty six", draw: (ctx) => { drawOffice(ctx, { expr: "smile" }); label(ctx, "FRIDAY · 5:58 PM", 640, 470, { size: 30 }); } },
      { say: "She is out with work.", key: "work", sfx: "whoosh", amb: [["candle", 880, 1440], ["dust", 200, 300, 700, 600]], draw: (ctx) => drawBar(ctx, { expr: "smile", behind: (c) => { c.save(); c.filter = "blur(3px)"; finch(c, 190, 1900, 1050, "neutral", {}); c.restore(); }, after: (c) => glasses(c, 1, 1560, 760, 1.5) }) },
      { say: "The plan is one drink.", key: "one", amb: [["candle", 300, 1300]], draw: (ctx) => cam(ctx, 700, 1380, 2.2, () => drawBar(ctx, { zara: false, after: (c) => glasses(c, 1, 1560, 760, 1.5) })) },
      { say: "Just the one.", who: "Z", key: "one", live: true, draw: (ctx, k, t) => bface(ctx, "smile", t, 1) },
      { say: "The first drink agreed with her.", key: "first", live: true, draw: (ctx, k, t) => bface(ctx, "smile", t, 1, { H: 3000, tilt: 0.04 }) },
      { say: "So did the second.", key: "second", sfx: "ding", live: true, draw: (ctx, k, t) => bface(ctx, "plotting", t, 2, { H: 3000, tilt: -0.06 }) },
      { say: "At nine the alarm went off in her bag.", key: "nine alarm", sfx: "tick", live: true, draw: (ctx, k) => inHand(ctx, BAR, screenAlarm("9:00", "one look", true), { thumb: [0.84, 0.8], rot: 0.03 * Math.sin(k * 60), y: 900 + 6 * Math.sin(k * 70) }) },
      { say: "She looked.", key: "looked", draw: (ctx) => inHand(ctx, BAR, screenProfile({ muted: true }), { thumb: [0.6, 0.45], w: 600, y: 960 }) },
      { say: "Once.", key: "once", live: true, draw: (ctx, k, t) => bface(ctx, "caught", t, 2, { H: 3300, y: 950 }) },
      { say: "He was at a suit fitting.", key: "suit", sfx: "whoosh", draw: (ctx) => inHand(ctx, BAR, screenPic(SUIT), { thumb: [0.86, 0.9] }) },
      { say: "Navy.", key: "navy", draw: (ctx) => inHand(ctx, BAR, screenPic(SUIT), { thumb: [0.86, 0.9], w: 760, y: 1180, x: 580 }) },
      { say: "The third drink had opinions about navy.", key: "third", dignity: 37, sfx: "thud", live: true, draw: (ctx, k, t) => bface(ctx, "plotting", t, 3, { H: 3100, tilt: 0.09 + 0.02 * Math.sin(t * 3) }) },
      { say: "By eleven, one look had become a habit", key: "habit", live: true, draw: (ctx, k) => inHand(ctx, BAR, k % 0.34 < 0.17 ? screenProfile({ muted: true }) : screenPic({ ...SUIT, banner: "23:02" }), { thumb: [0.8, 0.75 - 0.4 * ((k * 3) % 1)], w: 600, y: 960 }) },
      { say: "with a wine list.", key: "wine", amb: [["candle", 240, 1440]], draw: (ctx) => drawBar(ctx, { expr: "slip", pose: { armL: [0.2, -1.6], armR: [0.5, -2.2], tilt: 0.08 }, after: (c) => glasses(c, 4, 1560, 560, 1.4) }) },
      { say: "In the bathroom she opens the app.", key: "app", tag: "THE BATHROOM", sfx: "chime", draw: (ctx) => inHand(ctx, BAR, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I only feel fine after two drinks.", key: "fine two", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BAR, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "No advice.", key: "no", live: true, draw: (ctx, k, t) => face(ctx, BAR, "neutral", { glow: 1, H: 3300, y: 960, dim: 0.5, ...life(t, 2) }) },
      { say: "It just asks: what happens to the feeling at drink three?", key: "feeling three", tag: "IT ASKS", sfx: "chime", live: true, draw: (ctx, k) => inHand(ctx, BAR, screenStage(k < 0.22 ? 2 : 3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "It gets louder.", who: "Z", key: "louder", hold: 0.25, live: true, draw: (ctx, k, t) => face(ctx, BAR, "raw", { glow: 1, H: 3800, y: 930, dim: 0.5, ...life(t) }) },
      { say: "Go home now, with her coat and her dignity,", key: "home dignity", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BAR, VL, VR, false, true) },
      { say: "or stay for one more.", key: "stay", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BAR, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BAR, VL, VR) },
      { say: "Twenty-five days.", key: "twenty five", days: 25, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BAR, screenInvite(true), { thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
