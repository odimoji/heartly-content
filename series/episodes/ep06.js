// Episode 6, day 25, "2023". Path: STAY won episode 5. Vote: UNLIKE (tempting) or OWN (wise).
(function (g) {
  const C = { mine: "now he knows i was looking", reflect: "He knows you looked, and you're still here.", askParts: [["What is the worst thing ", false], ["he could think?", true]] };
  const HP = { y: 1000, x: 660, w: 540 };
  const OLD = { pic: "beach", when: "Aug 2023", caption: "best week", likes: "96 likes" }, LIKED = { ...OLD, liked: true, likedText: "Liked by you · 7h" };
  const shot = (typing) => (ctx, w, h) => { screenThread("Remy", [], typing || "")(ctx, w, h); ctx.save(); ctx.translate(w * 0.05, h * 0.15); ctx.fillStyle = "#33291f"; ctx.beginPath(); ctx.roundRect(0, 0, w * 0.62, w * 0.86, w * 0.05); ctx.fill(); ctx.save(); ctx.translate(w * 0.03, w * 0.03); ctx.beginPath(); ctx.rect(0, 0, w * 0.56, w * 0.56); ctx.clip(); PICS.beach(ctx, w * 0.56, w * 0.56); ctx.restore(); ctx.fillStyle = "#e5484d"; ctx.beginPath(); ctx.arc(w * 0.09, w * 0.7, w * 0.035, 0, 6.3); ctx.fill(); ctx.font = `600 ${w * 0.05}px Inter`; ctx.textAlign = "left"; ctx.fillText("Liked by you", w * 0.15, w * 0.72); ctx.restore(); };
  const passport = (ctx, k) => { soft(ctx, 18, 0.5, () => BED(ctx)); ctx.save(); ctx.translate(540, 940); ctx.rotate(-0.06); zform(ctx, (c) => c.roundRect(-270, -380, 540, 760, 30), "#6a1f2a", [-270, -380, 540, 760], { rimW: 8, lo: 0.4 }); ctx.strokeStyle = ctx.fillStyle = "#d9b26a"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -40, 110, 0, 6.3); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, -40, 46, 110, 0, 0, 6.3); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-110, -40); ctx.lineTo(110, -40); ctx.stroke(); ctx.font = "600 64px Cormorant"; ctx.textAlign = "center"; ctx.letterSpacing = "10px"; ctx.fillText("PASSPORT", 0, 220); ctx.letterSpacing = "0px";
    if (k > 0.3) { ctx.rotate(-0.16); ctx.strokeStyle = ctx.fillStyle = "#ff5a52"; ctx.lineWidth = 12; ctx.strokeRect(-250, -70, 500, 140); ctx.font = "600 96px Inter"; ctx.fillText("EXPIRED", 0, 34); } ctx.restore(); };
  const VL = { word: "UNLIKE", sub: "unlike it, say nothing", color: "#f0b34a", draw: (c) => heldPhone(c, 230, 400, 300, screenPic(OLD), { thumbAt: [0.14, 0.76], glow: 0 }) };
  const VR = { word: "OWN", sub: "leave it there, own it", color: "#f6ecdc", draw: (c) => drawZara(c, 250, 1300, 1250, "neutral", {}) };
  g.EP = {
    title: "2023", daysStart: 25, dignityStart: 37, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "At some point last night, Zara liked a photo", key: "liked", sfx: "ding", draw: (ctx) => inHand(ctx, BED, screenPic(LIKED), { night: true, thumb: [0.86, 0.9] }) },
      { say: "of her ex from twenty twenty-three.", key: "ex twenty three", draw: (ctx) => inHand(ctx, BED, screenPic(LIKED), { night: true, thumb: [0.86, 0.9], w: 760, y: 1180, x: 580 }) },
      { say: "She found out at eight this morning.", key: "eight", live: true, draw: (ctx, k, t) => { face(ctx, BED, "dread", { look: "night", mascara: true, H: 3200, y: 960, ...life(t) }); label(ctx, "8:03 AM", 640, 420, { size: 38 }); } },
      { say: "His wedding is in twenty-five days,", key: "twenty five", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, thumb: [0.84, 0.78] }) },
      { say: "and she said yes to it.", key: "yes", live: true, draw: (ctx, k, t) => face(ctx, BED, "dread", { look: "night", mascara: true, H: 3900, y: 920, ...life(t, 1) }) },
      { say: "She stayed for one more.", key: "stayed", sfx: "whoosh", amb: [["candle", 240, 1440]], draw: (ctx) => drawBar(ctx, { expr: "frozen", pose: { armL: [0.2, -1.6], armR: [0.8, -3.6], tilt: 0.08 }, after: (c) => { for (let i = 0; i < 4; i++) glass(c, 560 + i * 120, 1560, 1.4, "#8c2f3a", i === 3 ? 0.6 : 0.04); } }) },
      { say: "One more had friends.", key: "friends", sfx: "ding", amb: [["candle", 140, 1300]], draw: (ctx) => cam(ctx, 560, 1400, 1.7, () => drawBar(ctx, { zara: false, after: (c) => { for (let i = 0; i < 8; i++) glass(c, 150 + i * 112, 1560 + (i % 2) * 20, 1.2 + (i % 3) * 0.12, i % 3 ? "#8c2f3a" : "#d9b26a", i === 7 ? 0.5 : 0.04); } })) },
      { say: "The photo is him on a beach.", key: "beach", draw: (ctx) => inHand(ctx, BED, screenPic(OLD), { night: true, thumb: [0.86, 0.9], w: 640, y: 960, x: 600 }) },
      { say: "She took it.", key: "took", dignity: 31, sfx: "thud", live: true, draw: (ctx, k, t) => face(ctx, BED, "raw", { look: "night", mascara: true, H: 4200, y: 900, ...life(t, 0.4) }) },
      { say: "Her like has been sitting under it", key: "like", live: true, draw: (ctx, k) => inHand(ctx, BED, screenPic(LIKED), { night: true, thumb: [0.86, 0.6], w: 1000, y: 260 - 40 * k, x: 620, rot: 0 }) },
      { say: "for seven hours.", key: "seven", live: true, draw: (ctx, k) => cam(ctx, 420, 1130, 1.45, () => drawBedroom(ctx, { expr: "dread", time: k > 0.5 ? "8:05" : "8:04" })) },
      { say: "Her best friend has seen it.", key: "seen", sfx: "buzz", live: true, draw: (ctx, k) => inHand(ctx, BED, k > 0.35 ? shot() : screenThread("Remy", [], ""), { night: true, thumb: [0.9, 0.62], rot: 0.04, x: 620 }) },
      { say: "Her best friend sent a screenshot,", key: "screenshot", draw: (ctx) => inHand(ctx, BED, shot(), { night: true, thumb: [0.9, 0.62], rot: 0.04, x: 600, w: 680, y: 1080 }) },
      { say: "and no words.", key: "no", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", mascara: true, H: 3400, y: 960, ...life(t, 2) }) },
      { say: "I'm moving abroad.", who: "Z", key: "abroad", live: true, draw: (ctx, k, t) => face(ctx, BED, "frozen", { look: "night", mascara: true, H: 3200, y: 950, ...life(t) }) },
      { say: "Her passport expired in March.", key: "expired", sfx: "thud", live: true, draw: (ctx, k) => passport(ctx, k) },
      { say: "She has a client at ten.", key: "ten", sfx: "whoosh", draw: (ctx) => { drawOffice(ctx, { expr: "frozen" }); label(ctx, "10:00 · CLIENT MEETING", 620, 470, { size: 30 }); } },
      { say: "At her desk she opens the app,", key: "app", draw: (ctx) => cam(ctx, 520, 860, 1.9, () => drawOffice(ctx, { expr: "neutral", pose: { armL: [0.2, -0.3], armR: [0.14, 0.08] } })) },
      { say: "under the table.", key: "under", tag: "UNDER THE TABLE", sfx: "chime", draw: (ctx) => inHand(ctx, OFFICE, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: now he knows I was looking.", key: "knows looking", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, OFFICE, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 900, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "It says: he knows you looked, and you're still here.", key: "still here", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, OFFICE, screenStage(2, C), { ...HP, w: 580, y: 880, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "caught", { glow: 0, H: 3200, y: 960, dim: 0.15, ...life(t, 2) }) },
      { say: "What is the worst thing he could think?", key: "worst think", tag: "IT ASKS", sfx: "chime", draw: (ctx) => inHand(ctx, OFFICE, screenStage(3, C), { ...HP, w: 600, y: 900, thumb: [0.9, 0.8] }) },
      { say: "That I still care.", who: "Z", key: "care", hold: 0.25, live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "raw", { glow: 0, H: 3800, y: 930, dim: 0.15, ...life(t) }) },
      { say: "Unlike it and say nothing,", key: "unlike", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, OFFICE, VL, VR, false, true) },
      { say: "or leave it there and own it.", key: "own", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, OFFICE, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, OFFICE, VL, VR) },
      { say: "Twenty-four days.", key: "twenty four", days: 24, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, OFFICE, screenInvite(true), { thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
