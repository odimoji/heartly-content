// Episode 20, day 11, "Plus one". Path: HONEST won episode 19 (she told his sister it is hard). Vote: SAM (tempting: take a date for the photo) or ALONE (wise). Pride begins.
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep20.wav exists.
(function (g) {
  const C = { mine: "i don't want to walk in alone", reflect: "Alone is the part you keep dressing up.", askParts: [["Who is the empty chair ", false], ["for?", true]] };
  const HP = { night: true, y: 790, x: 680, w: 540 };
  const rsvp = (plus) => screenList("RSVP · Miles & Ivy", [["Attending", "yes"], ["Plus one", plus], ["Dietary", "none"]], { hot: 1, gap: 0.1 });
  const chairs = (ctx, name) => { soft(ctx, 18, 0.45, () => OFFICE(ctx)); [[330, "ZARA"], [750, name]].forEach(([x, n], i) => { zform(ctx, (c) => c.roundRect(x - 150, 620, 300, 380, 50), "#e9dcc6", [x - 150, 620, 300, 380], { rimW: 6, lo: 0.35 }); zform(ctx, (c) => c.roundRect(x - 170, 1000, 340, 90, 30), "#d9cbb8", [x - 170, 1000, 340, 90], { rimW: 4 }); ctx.strokeStyle = "#8a6a4a"; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(x - 130, 1090); ctx.lineTo(x - 150, 1330); ctx.moveTo(x + 130, 1090); ctx.lineTo(x + 150, 1330); ctx.stroke(); ctx.fillStyle = i ? "#c0452f" : "#1c1210"; ctx.beginPath(); ctx.roundRect(x - 110, 760, 220, 70, 12); ctx.fill(); ctx.fillStyle = "#fbf4e8"; ctx.font = "600 40px Inter"; ctx.textAlign = "center"; ctx.fillText(n, x, 808); }); };
  const cand = (ctx, name, note, verdict) => { paper(ctx, OFFICE, "PLUS ONE · CANDIDATES", [[name, note]], 0, { size: 60, total: verdict }); };
  const VL = { word: "SAM", sub: "ask Sam, for the photo", color: "#f0b34a", draw: (c) => heldPhone(c, 230, 400, 300, screenThread("Sam", [{ t: "take care, zara", me: false }], "odd question. free on the 28th?"), { thumbAt: [0.86, 0.86], glow: 0 }) };
  const VR = { word: "ALONE", sub: "untick the box, go alone", color: "#f6ecdc", draw: (c) => heldPhone(c, 230, 400, 300, rsvp("no"), { thumbAt: [0.8, 0.3], glow: 0 }) };
  g.EP = {
    title: "Plus one", daysStart: 11, dignityStart: 13, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara needs a plus one for her ex's wedding,", key: "plus one ex's", sfx: "ding", draw: (ctx) => inHand(ctx, OFFICE, rsvp("yes (name: ?)"), { thumb: [0.84, 0.3], w: 600, y: 960 }) },
      { say: "and she has eleven days to find one.", key: "eleven", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "plotting", { glow: 0, H: 3000, dim: 0.15, ...life(t) }) },
      { say: "She said yes. She ticked plus one.", key: "yes ticked", draw: (ctx) => inHand(ctx, OFFICE, screenInvite(true), { thumb: [0.84, 0.78] }) },
      { say: "She did that on purpose.", key: "purpose", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "frozen", { glow: 0, H: 3300, y: 950, dim: 0.15, ...life(t, 1) }) },
      { say: "She told his sister the truth. That it is hard.", key: "truth hard", sfx: "whoosh", draw: (ctx) => inHand(ctx, OFFICE, screenMail({ from: "Zara", subject: "re: so glad it's you", body: ["Nell, honestly?", "This one is hard for me.", "I'll still do it properly."] }, { hot: 1 }), { thumb: [0.86, 0.7], w: 600, y: 960 }) },
      { say: "His sister wrote back, I know. Come anyway.", key: "anyway", sfx: "buzz", draw: (ctx) => inHand(ctx, OFFICE, screenMail({ from: "Nell (groom's sister)", subject: "re: re: so glad it's you", body: ["I know.", "Come anyway.", "N x"] }, {}), { thumb: [0.86, 0.7], w: 600, y: 960 }) },
      { say: "So now there is a chair with her name on it,", key: "chair", draw: (ctx) => chairs(ctx, "+1") },
      { say: "and an empty one beside it.", key: "empty", draw: (ctx) => cam(ctx, 750, 900, 1.7, () => chairs(ctx, "?")) },
      { say: "Candidates.", key: "candidates", sfx: "whoosh", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "plotting", { glow: 0, H: 3200, y: 950, dim: 0.15, ...life(t, 2) }) },
      { say: "Sam, who has heard about the car park. Maybe.", key: "sam maybe", sfx: "tick", draw: (ctx) => cand(ctx, "SAM", "heard 40 minutes on the car park", "?") },
      { say: "Her cousin, who is nineteen and vapes. No.", key: "no", sfx: "tick", draw: (ctx) => cand(ctx, "COUSIN", "nineteen. vapes indoors.", "NO") },
      { say: "Her best friend, who has said she will wear a suit.", key: "suit", sfx: "tick", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "plotting", { who: remy, glow: 0, H: 2600, dim: 0.3, ...life(t) }) },
      { say: "That's actually tempting.", who: "Z", key: "tempting", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "smile", { glow: 0, H: 3000, dim: 0.15, ...life(t) }) },
      { say: "She wants the photo.", key: "photo", sfx: "ding", draw: (ctx) => { soft(ctx, 18, 0.5, () => OFFICE(ctx)); ctx.save(); ctx.translate(540, 900); ctx.rotate(0.04); ctx.fillStyle = "#fbf4e8"; ctx.fillRect(-330, -420, 660, 840); ctx.fillStyle = "#3a2c34"; ctx.fillRect(-290, -380, 580, 620); ctx.save(); ctx.beginPath(); ctx.rect(-290, -380, 580, 620); ctx.clip(); drawZara(ctx, -70, 560, 880, "smile", { look: "dress" }); zform(ctx, (c) => c.roundRect(60, -180, 190, 520, 60), "#2a2d3a", [60, -180, 190, 520], { rimW: 4, lo: 0.4 }); ctx.fillStyle = "#fbf4e8"; ctx.font = "600 120px Cormorant"; ctx.textAlign = "center"; ctx.fillText("?", 155, -220); ctx.restore(); ctx.restore(); } },
      { say: "Her, in red, on somebody's arm, looking fine.", key: "fine", dignity: 11, live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "frozen", { look: "dress", glow: 0, H: 3000, dim: 0.4, ...life(t, 1) }) },
      { say: "She opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I don't want to walk in alone.", key: "alone", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "It says: alone is the part you keep dressing up.", key: "dressing", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", H: 3400, y: 960, ...life(t, 2) }) },
      { say: "Who is the empty chair for?", key: "chair", tag: "IT ASKS", sfx: "chime", hold: 0.3, draw: (ctx) => inHand(ctx, BED, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Ask Sam, for the photo,", key: "sam", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BED, VL, VR, false, true) },
      { say: "or untick the box and go alone.", key: "alone", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BED, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BED, VL, VR) },
      { say: "Ten days.", key: "ten", days: 10, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
