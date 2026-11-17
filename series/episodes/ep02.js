// Episode 2, day 29, "Before the alarm". Path: CALL won episode 1. Vote: MUTE (wise) or LOOK (tempting).
(function (g) {
  const N = { look: "night" }, EAR = { sit: true, armL: [0.25, -0.4], armR: [0.95, -3.95], phone: "R", tilt: 0.05 };
  const C = { mine: "i keep checking if he's happy", reflect: "You keep checking if he's happy.", askParts: [["What are you ", false], ["hoping to find?", true]] };
  const RT = (n) => screenThread("Remy", [{ t: "OK.", me: false }, { t: "NOW WE KNOW.", me: false }, { t: "ONE RULE.", me: false }, { t: "NO LOOKING.", me: false }].slice(0, n), "");
  const CAKE = { pic: "cake", when: "23:04", caption: "the big decision", likes: "487 likes" };
  const HP = { night: true, y: 790, x: 680, w: 540 };
  const VL = { word: "MUTE", sub: "mute him until the wedding", color: "#f6ecdc", draw: (c) => heldPhone(c, 230, 400, 300, screenList("miles", ["Share profile", "Mute", "Restrict", "Block"], { hot: 1 }), { thumbAt: [0.8, 0.26], glow: 0 }) };
  const VR = { word: "LOOK", sub: "one last proper look", color: "#f0b34a", draw: (c) => heldPhone(c, 230, 400, 300, screenProfile(), { thumbAt: [0.8, 0.7], glow: 0 }) };
  g.EP = {
    title: "Before the alarm", daysStart: 29, dignityStart: 54, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara looked at her ex's profile", key: "ex's", sfx: "tick", live: true, draw: (ctx, k) => inHand(ctx, BED, screenProfile({ banner: Math.sin(k * 40) > -0.3 ? "Alarm · 6:30" : "" }), { night: true, thumb: [0.8, 0.6 - 0.1 * k], rot: 0.02 * Math.sin(k * 50) }) },
      { say: "before her alarm had finished.", key: "alarm", sfx: "tick", live: true, draw: (ctx, k, t) => face(ctx, BED, "slip", { look: "night", H: 3300, y: 960, ...life(t) }) },
      { say: "Twenty-nine days.", key: "twenty nine", live: true, draw: (ctx, k) => cam(ctx, 420, 1130, 1.45, () => drawBedroom(ctx, { expr: "slip", time: k > 0.5 ? "6:31" : "6:30" })) },
      { say: "Last night she rang her best friend", key: "friend", sfx: "whoosh", amb: [["tv", 0.18]], draw: (ctx) => cam(ctx, 590, 960, 2.5, () => drawFlat(ctx, { expr: "raw", pose: EAR })) },
      { say: "and said the real reason out loud.", key: "real", live: true, amb: [["tv", 0.16]], draw: (ctx, k, t) => face(ctx, FLAT, "raw", { glow: 0, H: 2700, ...life(t, 1) }) },
      { say: "I said yes so he'd think I'm fine.", who: "Z", key: "fine", live: true, amb: [["tv", 0.16]], draw: (ctx, k, t) => face(ctx, FLAT, "raw", { glow: 0, H: 3500, y: 940, ...life(t, 1) }) },
      { say: "Remy took it well.", key: "well", sfx: "buzz", live: true, draw: (ctx, k) => inHand(ctx, FLAT, RT(k > 0.45 ? 2 : 1), { thumb: [0.9, 0.62], rot: 0.04, x: 620 }) },
      { say: "Remy also made one rule.", key: "rule", sfx: "buzz", live: true, draw: (ctx, k) => inHand(ctx, FLAT, RT(3), { thumb: [0.9, 0.62], rot: 0.04 + 0.015 * Math.sin(k * 40) * (k < 0.5), x: 620 }) },
      { say: "No looking.", key: "looking", sfx: "buzz", draw: (ctx) => inHand(ctx, FLAT, RT(4), { thumb: [0.9, 0.62], rot: 0.04, x: 620, w: 620, y: 1040 }) },
      { say: "He posted at eleven.", key: "eleven", sfx: "ding", draw: (ctx) => inHand(ctx, BED, screenPic({ ...CAKE, banner: "miles posted a photo" }), { night: true, thumb: [0.86, 0.9] }) },
      { say: "A cake tasting.", key: "cake", draw: (ctx) => inHand(ctx, BED, screenPic(CAKE), { night: true, thumb: [0.86, 0.9], w: 700, y: 1100, x: 600 }) },
      { say: "Zara has opinions about that cake.", key: "opinions", live: true, draw: (ctx, k, t) => face(ctx, BED, "plotting", { look: "night", H: 3300, y: 960, tilt: 0.05, ...life(t, 2) }) },
      { say: "Professional ones.", key: "professional", sfx: "whoosh", draw: (ctx) => { drawOffice(ctx); label(ctx, "EVENTS DIRECTOR · WEDDINGS", 600, 470, { size: 30 }); } },
      { say: "At work she is excellent", key: "excellent", draw: (ctx) => cam(ctx, 520, 900, 1.6, () => drawOffice(ctx, { expr: "smile" })) },
      { say: "until about ten past nine.", key: "nine", live: true, draw: (ctx, k) => inHand(ctx, OFFICE, screenProfile(), { thumb: [0.8, 0.7 - 0.2 * k], y: 1000 }) },
      { say: "By lunch she knows the flavour.", key: "flavour", draw: (ctx) => inHand(ctx, OFFICE, screenPic({ ...CAKE, caption: "lemon & elderflower. obviously." }), { thumb: [0.86, 0.9], w: 640, y: 900, x: 600 }) },
      { say: "Lemon.", key: "lemon", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "slip", { glow: 0, H: 2900, dim: 0.15, ...life(t) }) },
      { say: "Just research.", who: "Z", key: "research", draw: (ctx) => cam(ctx, 470, 880, 1.5, () => drawOffice(ctx, { expr: "frozen", pose: { armL: [0.2, -1.9], armR: [0.5, -2.6], phone: "R" } })) },
      { say: "It was not research.", key: "not", dignity: 49, sfx: "thud", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "neutral", { who: finch, glow: 0, H: 2600, dim: 0.15, tilt: -0.04, ...life(t, 1) }) },
      { say: "At midnight her thumb", key: "midnight", sfx: "whoosh", live: true, draw: (ctx, k) => inHand(ctx, BED, screenPic(CAKE), { night: true, thumb: [0.2 + 0.03 * Math.sin(k * 9), 0.8 - 0.035 * k], w: 620, y: 860, x: 620 }) },
      { say: "nearly liked it.", key: "liked", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", H: 3600, y: 950, ...life(t) }) },
      { say: "So she opens the app instead.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I keep checking if he's happy.", key: "checking happy", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "No advice.", key: "no", live: true, draw: (ctx, k, t) => face(ctx, BED, "neutral", { look: "night", H: 3300, y: 960, ...life(t, 2) }) },
      { say: "It just asks: what are you hoping to find?", key: "hoping find", tag: "IT ASKS", sfx: "chime", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(k < 0.25 ? 2 : 3, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "She knows the answer.", key: "knows", live: true, draw: (ctx, k, t) => face(ctx, BED, "raw", { look: "night", H: 4200, y: 900, ...life(t, 0.4) }) },
      { say: "She doesn't type it.", key: "doesn't", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(3, C), { ...HP, w: 580, y: 820, thumb: [0.62, 0.86 - 0.03 * Math.sin(k * 7)] }) },
      { say: "Mute him for twenty-nine days,", key: "mute", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BED, VL, VR, false, true) },
      { say: "or one last proper look.", key: "look", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BED, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BED, VL, VR) },
      { say: "Twenty-eight days.", key: "twenty eight", days: 28, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
