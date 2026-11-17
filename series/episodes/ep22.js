// Episode 22, day 9, "Two outfits". Path: TRUE won episode 21 (she said the true sentence to the mirror). Vote: RED (tempting) or SUIT (wise).
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep22.wav exists.
(function (g) {
  const C = { mine: "i don't know who i am at this wedding", reflect: "Two outfits, and neither one is just you.", askParts: [["What would you wear ", false], ["to be comfortable?", true]] };
  const HP = { night: true, sleeve: null, y: 790, x: 680, w: 540 };
  const N = { look: "night" };
  const both = (ctx, hot) => { soft(ctx, 18, 0.45, () => BED(ctx)); ctx.save(); ctx.globalAlpha = hot === 1 ? 0.35 : 1; dressProp(ctx, 300, 960, 0.95); ctx.globalAlpha = hot === 0 ? 0.35 : 1; suitProp(ctx, 780, 940, 0.95); ctx.restore(); };
  const one = (ctx, kind, tag, s = 1.35) => { soft(ctx, 18, 0.5, () => BED(ctx)); (kind === "red" ? dressProp : suitProp)(ctx, 540, 960, s); if (tag) label(ctx, tag, 620, 400, { size: 32 }); };
  const VL = { word: "RED", sub: "wear the red", color: "#f0b34a", draw: (c) => dressProp(c, 250, 470, 0.72) };
  const VR = { word: "SUIT", sub: "wear the suit", color: "#f6ecdc", draw: (c) => suitProp(c, 250, 470, 0.72) };
  g.EP = {
    title: "Two outfits", daysStart: 9, dignityStart: 9, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara has two outfits on the bed for her ex's wedding.", key: "two ex's", sfx: "ding", draw: (ctx) => both(ctx) },
      { say: "One is for a guest.", key: "guest", sfx: "tick", draw: (ctx) => both(ctx, 0) },
      { say: "One is for the planner.", key: "planner", sfx: "tick", draw: (ctx) => both(ctx, 1) },
      { say: "She is both.", key: "both", live: true, draw: (ctx, k, t) => face(ctx, BED, "slip", { look: "night", glow: 0, H: 3200, y: 950, ...life(t) }) },
      { say: "Nine days. She said yes.", key: "nine yes", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, sleeve: null, thumb: [0.84, 0.78] }) },
      { say: "The red dress says, look what you lost.", key: "lost", sfx: "whoosh", draw: (ctx) => one(ctx, "red", "\"LOOK WHAT YOU LOST\"") },
      { say: "It cost four hundred.", key: "four hundred", live: true, draw: (ctx, k, t) => face(ctx, BED, "plotting", { look: "night", glow: 0, H: 3000, ...life(t, 1) }) },
      { say: "The black suit says, please direct questions to the venue.", key: "venue", sfx: "whoosh", draw: (ctx) => one(ctx, "suit", "\"QUESTIONS TO THE VENUE\"") },
      { say: "It has pockets.", key: "pockets", draw: (ctx) => cam(ctx, 540, 1040, 2.0, () => one(ctx, "suit")) },
      { say: "Last night she said the true sentence to the mirror.", key: "true", live: true, draw: (ctx, k, t) => mirrorShot(ctx, BED, "raw", { ...N, ...life(t) }, { H: 1900, y: 2500 }) },
      { say: "I am sad, and I am coming anyway.", key: "sad anyway", live: true, draw: (ctx, k, t) => face(ctx, BED, "raw", { look: "night", glow: 0, H: 3700, y: 930, ...life(t, 2) }) },
      { say: "It did not fix anything.", key: "not", live: true, draw: (ctx, k, t) => face(ctx, BED, "neutral", { look: "night", glow: 0, H: 3200, y: 950, ...life(t) }) },
      { say: "It did make the red dress look tired.", key: "tired", dignity: 12, live: true, draw: (ctx, k) => { soft(ctx, 18, 0.5, () => BED(ctx)); ctx.save(); ctx.translate(540, 960); ctx.rotate(0.12 * Math.min(1, k * 2)); ctx.translate(-540, -960); dressProp(ctx, 540, 960 + 40 * Math.min(1, k * 2), 1.3, "#a8483e"); ctx.restore(); } },
      { say: "Pockets, though.", who: "Z", key: "pockets", live: true, draw: (ctx, k, t) => face(ctx, BED, "smile", { look: "night", glow: 0, H: 3100, y: 950, ...life(t) }) },
      { say: "Her director rang to ask which one she would be on the day.", key: "which", sfx: "buzz", live: true, draw: (ctx, k) => inHand(ctx, BED, screenList("Mrs Finch", [["calling…", ""]], { hot: 0 }), { night: true, sleeve: null, thumb: [0.8, 0.86], rot: 0.025 * Math.sin(k * 60) }) },
      { say: "Guest, or staff.", key: "guest staff", draw: (ctx) => both(ctx) },
      { say: "Zara said she would confirm.", key: "confirm", live: true, draw: (ctx, k, t) => face(ctx, BED, "frozen", { look: "night", glow: 0, H: 3100, y: 950, ...life(t, 1) }) },
      { say: "She has confirmed nothing since.", key: "nothing", amb: [["dust"]], draw: (ctx) => cam(ctx, 420, 1130, 1.45, () => drawBedroom(ctx, { expr: "slip", time: "11:48" })) },
      { say: "She opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I don't know who I am at this wedding.", key: "who", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(0, C, typed(C.mine, k, 0.06, 0.85)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.85), 0.74] }) },
      { say: "It says: two outfits, and neither one is just you.", key: "neither", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", H: 3400, y: 960, ...life(t, 2) }) },
      { say: "What would you wear to be comfortable?", key: "comfortable", tag: "IT ASKS", sfx: "chime", hold: 0.3, draw: (ctx) => inHand(ctx, BED, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Wear the red,", key: "red", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BED, VL, VR, false, true) },
      { say: "or wear the suit.", key: "suit", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BED, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BED, VL, VR) },
      { say: "Eight days.", key: "eight", days: 8, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, sleeve: null, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
