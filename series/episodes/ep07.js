// Episode 7, day 24, "Like it's a job". Path: OWN won episode 6 (the like stays). Vote: DINNER (tempting) or DELETE (wise).
(function (g) {
  const C = { mine: "i want someone on my arm so he sees it", reflect: "You want him to see it.", askParts: [["Who is ", false], ["the date for?", true]] };
  const HP = { night: true, y: 790, x: 680, w: 540 };
  const MEN = [{ name: "Tom, 29", line: "here for a good time", c1: "#5a6a8a", c2: "#2a3040" }, { name: "Jay, 33", line: "gym. grind. gratitude.", c1: "#7a5a4a", c2: "#3a2a20", skin: "#8a5a3a", shirt: "#1f1614" }, { name: "Olly, 27", line: "ask me about crypto", c1: "#4a7a6a", c2: "#20302a", skin: "#e3b594", hairC: "#b0763a" }];
  const DAN = { name: "Dan, 31", line: "owns a kayak", c1: "#4a8ab0", c2: "#1f3a50", skin: "#e0b08e", hairC: "#3a2a1a", shirt: "#d9643a" };
  const ME = { name: "Zara, 26", line: "events. opinions. cake.", c1: "#c9a27a", c2: "#6a4a3a", skin: "#b0714f", hairC: "#1d1210", shirt: "#efe2cc" };
  const SAM = (n) => screenThread("Sam", [{ t: "hi zara", me: false }, { t: "dinner thursday?", me: false }, { t: "you're choosing. i'm hopeless.", me: false }].slice(0, n), "");
  const VL = { word: "DINNER", sub: "say yes to dinner", color: "#f0b34a", draw: (c) => heldPhone(c, 230, 400, 300, SAM(2), { thumbAt: [0.8, 0.9], glow: 0 }) };
  const VR = { word: "DELETE", sub: "delete the app, go alone", color: "#f6ecdc", draw: (c) => drawZara(c, 250, 1300, 1250, "neutral", { look: "night" }) };
  g.EP = {
    title: "Like it's a job", daysStart: 24, dignityStart: 31, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara is on a dating app at her desk,", key: "dating", sfx: "ding", draw: (ctx) => inHand(ctx, OFFICE, screenDating(MEN[0]), { thumb: [0.8, 0.86] }) },
      { say: "swiping the way she answers email.", key: "email", sfx: "tick", live: true, draw: (ctx, k) => { const i = Math.min(2, Math.floor(k * 3)), p = (k * 3) % 1; inHand(ctx, OFFICE, screenDating({ ...MEN[i], dx: -p * 0.8, stamp: p > 0.25 ? "NO" : null }), { thumb: [0.75 - 0.4 * p, 0.6] }); } },
      { say: "Twenty-four days until her ex's wedding.", key: "ex's wedding", draw: (ctx) => inHand(ctx, OFFICE, screenInvite(true), { thumb: [0.84, 0.78] }) },
      { say: "She said yes.", key: "yes", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "frozen", { glow: 0, H: 3000, dim: 0.15, ...life(t) }) },
      { say: "She would now like a plus one.", key: "plus one", draw: (ctx) => { cam(ctx, 520, 900, 1.6, () => drawOffice(ctx, { expr: "plotting" })); label(ctx, "PLUS ONE: TO BE CONFIRMED", 620, 470, { size: 30 }); } },
      { say: "The like is still there.", key: "like", draw: (ctx) => inHand(ctx, OFFICE, screenPic({ pic: "beach", when: "Aug 2023", caption: "best week", liked: true, likedText: "Liked by you · 1d" }), { thumb: [0.86, 0.9], w: 600, y: 940 }) },
      { say: "She left it.", key: "left", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "smile", { glow: 0, H: 3200, y: 950, dim: 0.15, ...life(t, 1) }) },
      { say: "He has not mentioned it,", key: "not", draw: (ctx) => inHand(ctx, OFFICE, screenThread("Miles", [{ t: "happy birthday x", me: false }, { t: "thanks!", me: true }], "", { label: "LAST MESSAGE: 14 MONTHS AGO" }), { thumb: [0.86, 0.9] }) },
      { say: "which is somehow louder.", key: "louder", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "slip", { glow: 0, H: 3700, y: 930, dim: 0.15, ...life(t, 2) }) },
      { say: "So. A profile.", key: "profile", sfx: "whoosh", draw: (ctx) => inHand(ctx, OFFICE, screenDating(ME), { thumb: [0.8, 0.86], w: 600, y: 960 }) },
      { say: "Three photos, one with a dog that is not hers.", key: "dog", draw: (ctx) => inHand(ctx, OFFICE, screenDating({ ...ME, pic: "dog", line: "(dog not included)" }), { thumb: [0.8, 0.86], w: 600, y: 960 }) },
      { say: "Borrowed. Technically.", who: "Z", key: "technically", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "plotting", { glow: 0, H: 3000, dim: 0.15, tilt: 0.05, ...life(t) }) },
      { say: "She swiped through lunch.", key: "lunch", sfx: "whoosh", draw: (ctx) => { drawOffice(ctx, { expr: "plotting", pose: { armL: [0.2, -1.9], armR: [0.5, -2.6], phone: "R" } }); label(ctx, "12:40 · LUNCH", 640, 470, { size: 30 }); } },
      { say: "No. No. No.", key: "no", sfx: "tick", live: true, draw: (ctx, k) => { const i = Math.min(2, Math.floor(k * 3)), p = (k * 3) % 1; inHand(ctx, OFFICE, screenDating({ ...MEN[(i + 1) % 3], dx: -Math.max(0, p - 0.35) * 1.2, stamp: p > 0.15 ? "NO" : null }), { thumb: [0.6, 0.6], w: 600, y: 960 }); } },
      { say: "Owns a kayak.", key: "kayak", draw: (ctx) => inHand(ctx, OFFICE, screenDating(DAN), { thumb: [0.8, 0.86], w: 640, y: 1000 }) },
      { say: "No.", key: "no", sfx: "thud", live: true, draw: (ctx, k) => inHand(ctx, OFFICE, screenDating({ ...DAN, stamp: "NO", dx: -Math.max(0, k - 0.4) }), { thumb: [0.6, 0.6], w: 640, y: 1000 }) },
      { say: "By four she had nine matches and a system.", key: "nine", sfx: "ding", draw: (ctx) => inHand(ctx, OFFICE, screenDating({ name: "Sam, 30", line: "reads the menu in advance", c1: "#8a6a9a", c2: "#3a2a44", skin: "#c98a62", stamp: "YES", matches: "9 matches" }), { thumb: [0.8, 0.86], w: 600, y: 960 }) },
      { say: "Her director walked past twice.", key: "twice", dignity: 28, sfx: "thud", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "neutral", { who: finch, glow: 0, H: 2600, dim: 0.15, tilt: -0.04, ...life(t, 1) }) },
      { say: "By midnight one of them had asked her to dinner.", key: "dinner", sfx: "buzz", live: true, draw: (ctx, k) => inHand(ctx, BED, SAM(k > 0.3 ? 2 : 1), { night: true, thumb: [0.9, 0.62], rot: 0.04, x: 620 }) },
      { say: "A nice man.", key: "nice", live: true, draw: (ctx, k, t) => face(ctx, BED, "smile", { look: "night", H: 3300, y: 960, ...life(t) }) },
      { say: "Spells well.", key: "spells", sfx: "buzz", draw: (ctx) => inHand(ctx, BED, SAM(3), { night: true, thumb: [0.9, 0.62], rot: 0.04, x: 600, w: 640, y: 1040 }) },
      { say: "She opens the other app.", key: "other", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I want someone on my arm so he sees it.", key: "arm sees", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "It says: you want him to see it.", key: "him", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", H: 3400, y: 960, ...life(t, 2) }) },
      { say: "Who is the date for?", key: "who", tag: "IT ASKS", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Zara did not type anything for a while.", key: "anything", hold: 0.3, live: true, draw: (ctx, k, t) => face(ctx, BED, "raw", { look: "night", H: 3900, y: 930, ...life(t) }) },
      { say: "Say yes to dinner,", key: "dinner", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BED, VL, VR, false, true) },
      { say: "or delete the app and go alone.", key: "delete alone", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BED, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BED, VL, VR) },
      { say: "Twenty-three days.", key: "twenty three", days: 23, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
