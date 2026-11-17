// Episode 4, day 27, "The count". Path: FOLD won episode 3. Vote: BLOCK (wise) or ONCE (tempting). Remy is on screen for the first time.
(function (g) {
  const TEAL = "#2f7f86", SEAT = () => 1400 + zSitLift() * 780 + 44;
  const C = { mine: "41 times and nothing changed", reflect: "Forty-one looks, and he was the same every time.", askParts: [["What did you want ", false], ["to be different?", true]] };
  const HP = { night: true, y: 790, x: 680, w: 540 };
  const remyHand = (ctx, rm, screen, o) => { const k0 = ZC.skin; ZC.skin = "#7a4a32"; inHand(ctx, rm, screen, { sleeve: TEAL, ...o }); ZC.skin = k0; };
  const HIST = screenList("Search history", [["miles", "now"], ["miles", "08:14"], ["miles", "08:02"], ["miles", "07:51"], ["miles", "Tue"], ["miles", "Tue"], ["miles", "Tue"], ["miles", "Mon"], ["miles", "Mon"], ["miles", "Mon"]], { hot: 0 });
  const two = (ctx, ze, re) => cam(ctx, 560, 1080, 1.6, () => drawFlat(ctx, { expr: ze, zx: 130, pose: { sit: true, armL: [0.3, -1.3], armR: [0.3, -1.3], cushion: true }, after: (c) => remy(c, 390, SEAT(), 780, re, { sit: true, armL: [0.3, -1.5], armR: [0.3, -1.5], phone: "R" }) }));
  const lidShot = (ctx, n, o = {}) => { soft(ctx, 18, 0.5, () => FLAT(ctx)); lid(ctx, 540, 960, 1.55, n, o); };
  const VL = { word: "BLOCK", sub: "block him until the wedding", color: "#f6ecdc", draw: (c) => heldPhone(c, 230, 400, 300, screenList("miles", ["Share profile", "Mute", "Restrict", "Block"], { hot: 3, red: true }), { thumbAt: [0.8, 0.42], glow: 0 }) };
  const VR = { word: "ONCE", sub: "one look a day, at nine", color: "#f0b34a", draw: (c) => heldPhone(c, 230, 400, 300, screenAlarm("9:00", "one look"), { thumbAt: [0.8, 0.8], glow: 0 }) };
  g.EP = {
    title: "The count", daysStart: 27, dignityStart: 46, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Twenty-seven days until her ex's wedding,", key: "ex's wedding", sfx: "thud", live: true, draw: (ctx, k, t) => { face(ctx, FLAT, "plotting", { who: remy, glow: 0, H: 2500, ...life(t) }); label(ctx, "REMY · BEST FRIEND", 640, 420, { size: 32 }); } },
      { say: "and Zara's best friend has come round to count.", key: "count", live: true, amb: [["tv", 0.16]], draw: (ctx, k, t) => face(ctx, FLAT, "caught", { glow: 0, H: 2700, ...life(t, 1) }) },
      { say: "The hoodie stayed folded.", key: "folded", sfx: "whoosh", draw: (ctx) => cam(ctx, 760, 1080, 1.9, () => wardrobe(ctx, { hoodieAt: "shelf" })) },
      { say: "That part is going well.", key: "well", live: true, amb: [["tv", 0.16]], draw: (ctx, k, t) => face(ctx, FLAT, "smile", { glow: 0, H: 2900, ...life(t, 2) }) },
      { say: "Muting him hid his posts.", key: "muting", draw: (ctx) => inHand(ctx, FLAT, screenProfile({ muted: true }), { thumb: [0.86, 0.5], w: 600, y: 960 }) },
      { say: "It did not hide his profile.", key: "profile", live: true, draw: (ctx, k) => inHand(ctx, FLAT, screenList("Search", [["miles", "profile"], ["miles and ivy wedding", ""], ["milestone cake ideas", ""]], { hot: 0 }), { thumb: [0.7, 0.2 + 0.03 * Math.sin(k * 10)], w: 600, y: 960 }) },
      { say: "Remy asked how many times she had looked.", key: "many", amb: [["tv", 0.2], ["dust"]], draw: (ctx) => two(ctx, "hiding", "plotting") },
      { say: "Two or three.", who: "Z", key: "three", live: true, amb: [["tv", 0.16]], draw: (ctx, k, t) => face(ctx, FLAT, "frozen", { glow: 0, H: 3100, y: 950, ...life(t) }) },
      { say: "Remy opened the search history,", key: "history", sfx: "ding", live: true, draw: (ctx, k) => remyHand(ctx, FLAT, HIST, { thumb: [0.8, 0.7 - 0.25 * k], w: 600, y: 960 }) },
      { say: "and started a tally on the takeaway lid.", key: "tally", sfx: "tick", live: true, draw: (ctx, k) => lidShot(ctx, Math.floor(k * 5)) },
      { say: "Five. Ten. Twenty.", key: "five ten twenty", sfx: "tick", live: true, draw: (ctx, k) => lidShot(ctx, k < 0.3 ? 5 : k < 0.62 ? 10 : 20) },
      { say: "Forty-one.", key: "forty one", dignity: 41, sfx: "thud", draw: (ctx) => lidShot(ctx, 41, { total: "41" }) },
      { say: "In four days.", key: "four", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "neutral", { who: remy, glow: 0, H: 3000, y: 950, ...life(t, 1) }) },
      { say: "Nobody spoke.", key: "nobody", amb: [["tv", 0.2], ["dust"]], draw: (ctx) => two(ctx, "dread", "neutral") },
      { say: "Then Zara laughed, properly,", key: "laughed", sfx: "ding", live: true, amb: [["tv", 0.16]], draw: (ctx, k, t) => face(ctx, FLAT, "frozen", { glow: 0, H: 2900, blink: 1, bob: 22 * Math.sin(t * 15), sway: 0.03 * Math.sin(t * 7.5) }) },
      { say: "for the first time since she said yes.", key: "yes", live: true, amb: [["tv", 0.16]], draw: (ctx, k, t) => face(ctx, FLAT, "frozen", { who: remy, glow: 0, H: 2700, blink: 1, bob: 20 * Math.sin(t * 14 + 1), sway: -0.03 * Math.sin(t * 7) }) },
      { say: "Remy left the lid on the table.", key: "lid", sfx: "whoosh", amb: [["tv", 0.2]], draw: (ctx) => cam(ctx, 470, 1420, 1.9, () => drawFlat(ctx, { zara: false, after: (c) => lid(c, 640, 1470, 0.3, 41, { rot: 0.06 }) })) },
      { say: "That night she opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: forty-one times and nothing changed.", key: "nothing changed", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "It says: forty-one looks, and he was the same every time.", key: "same", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", H: 3400, y: 960, ...life(t, 2) }) },
      { say: "What did you want to be different?", key: "different", tag: "IT ASKS", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Me.", who: "Z", key: "me", hold: 0.35, live: true, draw: (ctx, k, t) => face(ctx, BED, "raw", { look: "night", H: 3800, y: 930, ...life(t) }) },
      { say: "Block him until the wedding,", key: "block", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BED, VL, VR, false, true) },
      { say: "or allow one look a day, at nine, like an adult.", key: "one adult", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BED, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BED, VL, VR) },
      { say: "Twenty-six days.", key: "twenty six", days: 26, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
