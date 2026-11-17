// Episode 3, day 28, "To wash it". Path: MUTE won episode 2. Vote: FOLD (wise) or WEAR (tempting).
(function (g) {
  const HD = { look: "night", pal: HOODIE, sleeves: true }, GREY = "#8b8d97";
  const EAR = { sit: true, armL: [0.25, -0.4], armR: [0.95, -3.95], phone: "R", tilt: 0.05, look: "night" };
  const C = { mine: "it doesn't smell like him anymore", reflect: "It stopped smelling like him, and you noticed.", askParts: [["What were you ", false], ["keeping it for?", true]] };
  const HP = { night: true, y: 790, x: 680, w: 540, sleeve: GREY };
  const wash = (ctx, a, o = {}) => { soft(ctx, 18, 0.5, () => FLAT(ctx)); washer(ctx, o.x || 540, o.y || 1020, o.s || 1.3, a, o); };
  const VL = { word: "FOLD", sub: "fold it, shut the wardrobe", color: "#f6ecdc", draw: (c) => { c.save(); c.scale(0.5, 0.5); c.translate(-40, -160); wardrobe(c, { hoodieAt: "shelf", door: 0.35 }); c.restore(); } };
  const VR = { word: "WEAR", sub: "sleep in it, just tonight", color: "#f0b34a", draw: (c) => { drawZara(c, 250, 1320, 1150, "smile", { ...HD, blink: 1, tilt: 0.08 }); } };
  g.EP = {
    title: "To wash it", daysStart: 28, dignityStart: 49, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara is washing her ex's hoodie", key: "ex's hoodie", sfx: "thud", live: true, draw: (ctx, k) => wash(ctx, k * 2.4) },
      { say: "at seven in the morning.", key: "seven", live: true, draw: (ctx, k, t) => { face(ctx, FLAT, "neutral", { look: "night", H: 3000, glow: 0, ...life(t) }); label(ctx, "7:02 AM", 640, 420, { size: 38 }); } },
      { say: "His wedding is in twenty-eight days.", key: "twenty eight", draw: (ctx) => inHand(ctx, FLAT, screenInvite(true), { sleeve: null, thumb: [0.84, 0.78] }) },
      { say: "She is going.", key: "going", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "frozen", { look: "night", H: 3300, glow: 0, y: 950, ...life(t, 1) }) },
      { say: "Yesterday she muted him.", key: "muted", sfx: "ding", draw: (ctx) => inHand(ctx, FLAT, screenProfile({ muted: true }), { sleeve: null, thumb: [0.86, 0.5], w: 600, y: 960 }) },
      { say: "It worked,", key: "worked", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "smile", { look: "night", H: 3000, glow: 0, ...life(t, 2) }) },
      { say: "which left her hands with nothing to do.", key: "nothing", amb: [["tv", 0.2], ["dust"]], draw: (ctx) => cam(ctx, 590, 1080, 1.55, () => drawFlat(ctx, { expr: "slip", pose: { sit: true, look: "night", armL: [0.5, -1.0], armR: [0.5, -1.0] } })) },
      { say: "The hoodie has lived at the back of her wardrobe", key: "hoodie wardrobe", sfx: "whoosh", draw: (ctx) => wardrobe(ctx, { hoodieAt: "back" }) },
      { say: "since the car park.", key: "car park", draw: (ctx) => cam(ctx, 860, 640, 2.1, () => wardrobe(ctx, { hoodieAt: "back" })) },
      { say: "I'm just washing it.", who: "Z", key: "washing", amb: [["tv", 0.18]], draw: (ctx) => cam(ctx, 590, 960, 2.5, () => drawFlat(ctx, { expr: "frozen", pose: EAR })) },
      { say: "Her best friend asked who for.", key: "who", sfx: "buzz", live: true, draw: (ctx, k) => inHand(ctx, FLAT, screenThread("Remy", [{ t: "just washing it", me: true }, { t: "WASHING IT", me: false }, { t: "FOR WHO", me: false }].slice(0, 1 + (k > 0.2) + (k > 0.5)), ""), { sleeve: null, thumb: [0.9, 0.62], rot: 0.04, x: 620 }) },
      { say: "To give it back.", key: "back", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "neutral", { look: "night", H: 3000, glow: 0, tilt: 0.04, ...life(t) }) },
      { say: "That is the official position.", key: "official", live: true, draw: (ctx, k, t) => { face(ctx, FLAT, "plotting", { look: "night", H: 3600, glow: 0, y: 940, ...life(t, 1) }); ctx.save(); ctx.translate(560, 1330); ctx.rotate(-0.12); ctx.strokeStyle = ctx.fillStyle = "#e5484d"; ctx.lineWidth = 8; ctx.globalAlpha = Math.min(1, k * 6); ctx.strokeRect(-270, -60, 540, 120); ctx.font = "600 62px Inter"; ctx.textAlign = "center"; ctx.fillText("OFFICIAL POSITION", 0, 22); ctx.restore(); } },
      { say: "She sat on the floor and watched the whole cycle.", key: "cycle", sfx: "whoosh", live: true, draw: (ctx, k) => { wash(ctx, k * 9, { x: 740, y: 1120, s: 1.0 }); drawZara(ctx, 250, 1820, 1150, "neutral", { look: "night", sit: true, armL: [0.4, -1.0], armR: [0.4, -1.0], tilt: 0.06 }); } },
      { say: "Forty minutes.", key: "forty", sfx: "tick", live: true, draw: (ctx, k) => { const m = Math.max(0, Math.round(40 * (1 - k * 1.15))); cam(ctx, 660, 620, 2.6, () => wash(ctx, k * 14, { time: "0:" + String(m).padStart(2, "0") })); } },
      { say: "It came out smelling of her detergent,", key: "detergent", live: true, amb: [["steam", 540, 1250]], draw: (ctx, k, t) => face(ctx, FLAT, "slip", { look: "night", H: 3000, glow: 0, y: 900, ...life(t), over: (c) => hoodie(c, 540, 1640, 1.9) }) },
      { say: "which was somehow worse.", key: "worse", dignity: 46, sfx: "thud", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "raw", { look: "night", H: 4000, glow: 0, y: 900, ...life(t, 1) }) },
      { say: "By one in the morning", key: "one", sfx: "whoosh", live: true, draw: (ctx, k) => cam(ctx, 420, 1130, 1.45, () => drawBedroom(ctx, { expr: "slip", time: k > 0.5 ? "1:05" : "1:04", pose: { ...HD, armL: [0.25, -1.75], armR: [0.25, -1.75], phone: "R", glow: 1, tilt: -0.05 } })) },
      { say: "she was wearing it.", key: "wearing", live: true, draw: (ctx, k, t) => face(ctx, BED, "slip", { ...HD, H: 3000, y: 980, ...life(t) }) },
      { say: "So she opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: it doesn't smell like him anymore.", key: "smell him", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "It says: it stopped smelling like him, and you noticed.", key: "noticed", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { ...HD, H: 3400, y: 960, ...life(t, 2) }) },
      { say: "What were you keeping it for?", key: "keeping", tag: "IT ASKS", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "In case.", who: "Z", key: "case", hold: 0.25, live: true, draw: (ctx, k, t) => face(ctx, BED, "raw", { ...HD, H: 3800, y: 930, ...life(t) }) },
      { say: "Fold it and shut the wardrobe,", key: "fold", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BED, VL, VR, false, true) },
      { say: "or sleep in it, just tonight.", key: "sleep", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BED, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BED, VL, VR) },
      { say: "Twenty-seven days.", key: "twenty seven", days: 27, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, sleeve: GREY, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
