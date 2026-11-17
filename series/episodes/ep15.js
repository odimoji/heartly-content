// Episode 15, day 16, "The chair". Path: FIX won episode 14 (she fixed the seating plan). Vote: TELL (tempting: say it to him) or WRITE (wise: write it down and keep it).
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep15.wav exists.
(function (g) {
  const C = { mine: "i shouted at a chair and it helped", reflect: "You finally said it out loud.", askParts: [["Who was ", false], ["it for?", true]] };
  const HP = { night: true, y: 790, x: 680, w: 540 };
  const chair = (ctx, s = 1, tag) => { soft(ctx, 18, 0.4, () => OFFICE(ctx)); ctx.save(); ctx.translate(540, 1150); ctx.scale(s, s); zform(ctx, (c) => c.roundRect(-190, -620, 380, 430, 60), "#3a3d4a", [-190, -620, 380, 430], { rimW: 8, lo: 0.4 }); zform(ctx, (c) => c.roundRect(-220, -170, 440, 110, 40), "#34384a", [-220, -170, 440, 110], { rimW: 6, lo: 0.4 }); ctx.strokeStyle = "#1c1210"; ctx.lineWidth = 22; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(0, 150); ctx.moveTo(-200, 230); ctx.lineTo(0, 150); ctx.lineTo(200, 230); ctx.stroke(); ctx.restore(); if (tag) label(ctx, tag, 620, 470, { size: 34 }); };
  const shout = (ctx, expr, t, o = {}) => face(ctx, OFFICE, expr, { glow: 0, H: 2900, dim: 0.15, ...life(t), bob: 14 * Math.sin(t * 13), ...o });
  const card = (ctx, fn, tag) => { soft(ctx, 18, 0.55, () => OFFICE(ctx)); ctx.save(); ctx.translate(540, 900); ctx.rotate(-0.04); ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.fillRect(-314, -380, 660, 800); ctx.fillStyle = "#fbf4e8"; ctx.fillRect(-330, -400, 660, 800); ctx.save(); ctx.translate(-290, -360); ctx.beginPath(); ctx.rect(0, 0, 580, 580); ctx.clip(); fn(ctx, 580, 580); ctx.restore(); ctx.fillStyle = "#1c1210"; ctx.font = "italic 600 78px Cormorant"; ctx.textAlign = "center"; ctx.fillText(tag, 0, 330); ctx.restore(); };
  const carpark = (c, w, h, rain) => { c.fillStyle = "#5a5d66"; c.fillRect(0, 0, w, h); c.strokeStyle = "#f3ead8"; c.lineWidth = 10; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(40 + i * 125, h * 0.45); c.lineTo(40 + i * 125, h); c.stroke(); } c.fillStyle = "#e0b23a"; c.fillRect(w * 0.4, h * 0.1, w * 0.2, h * 0.3); c.fillStyle = "#1c1210"; c.fillRect(w * 0.44, h * 0.15, w * 0.12, h * 0.08); if (rain) { c.strokeStyle = "rgba(200,220,255,.6)"; c.lineWidth = 4; for (let i = 0; i < 40; i++) { const x = (i * 97) % w, y = (i * 53) % h; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 12, y + 40); c.stroke(); } } };
  const door = (ctx, open) => { soft(ctx, 18, 0.4, () => OFFICE(ctx)); zform(ctx, (c) => c.roundRect(300, 300, 480, 1300, 10), "#5a3a26", [300, 300, 480, 1300], { rimW: 8, lo: 0.4 }); if (open) { ctx.fillStyle = "#f3d9b8"; ctx.fillRect(300, 300, 150, 1300); ctx.fillStyle = "#3a2a30"; ctx.beginPath(); ctx.roundRect(330, 760, 110, 500, 40); ctx.fill(); ctx.fillStyle = "#c08a62"; ctx.beginPath(); ctx.arc(385, 700, 52, 0, 6.3); ctx.fill(); } zform(ctx, (c) => c.ellipse(700, 980, 22, 22, 0, 0, 6.3), "#d9b26a", [678, 958, 44, 44], { rimW: 0 }); };
  const VL = { word: "TELL", sub: "say it to him", color: "#f0b34a", draw: (c) => heldPhone(c, 230, 400, 300, screenThread("Miles", [{ t: "happy birthday x", me: false }, { t: "thanks!", me: true }], "who ends 3 years next to a"), { thumbAt: [0.86, 0.86], glow: 0 }) };
  const VR = { word: "WRITE", sub: "write it down and keep it", color: "#f6ecdc", draw: (c) => { zform(c, (k) => k.roundRect(110, 200, 280, 380, 8), "#fbf4e8", [110, 200, 280, 380], { rimW: 5, lo: 0.2 }); c.strokeStyle = "#8a7a68"; c.lineWidth = 5; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(140, 250 + i * 36); c.lineTo(360 - (i % 3) * 40, 250 + i * 36); c.stroke(); } } };
  g.EP = {
    title: "The chair", daysStart: 16, dignityStart: 9, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara is alone in a meeting room at work,", key: "alone", sfx: "thud", live: true, draw: (ctx, k, t) => shout(ctx, "frozen", t) },
      { say: "shouting at a chair.", key: "chair", draw: (ctx) => chair(ctx) },
      { say: "The chair is standing in for her ex.", key: "ex", draw: (ctx) => chair(ctx, 1.25, "MILES (STAND-IN)") },
      { say: "His wedding is in sixteen days.", key: "sixteen", draw: (ctx) => inHand(ctx, OFFICE, screenInvite(true), { thumb: [0.84, 0.78] }) },
      { say: "She said yes. She is also planning it.", key: "yes planning", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "frozen", { glow: 0, H: 3200, y: 950, dim: 0.15, ...life(t, 1) }) },
      { say: "She fixed the seating plan last night.", key: "fixed", sfx: "ding", draw: (ctx) => { cam(ctx, 520, 900, 1.6, () => drawOffice(ctx, { expr: "smile" })); label(ctx, "SEATING PLAN: FIXED", 620, 470, { size: 30 }); } },
      { say: "His mother got her good table back.", key: "mother", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "smile", { glow: 0, H: 3000, dim: 0.15, ...life(t, 2) }) },
      { say: "Then the venue rang.", key: "venue", sfx: "buzz", live: true, draw: (ctx, k) => inHand(ctx, OFFICE, screenList("The Glasshouse", [["calling…", ""]], { hot: 0 }), { thumb: [0.8, 0.86], rot: 0.025 * Math.sin(k * 60) }) },
      { say: "He has asked for the car park to be decorated.", key: "car park", draw: (ctx) => card(ctx, (c, w, h) => carpark(c, w, h), "fairy lights, please") },
      { say: "They broke up in a car park.", key: "broke car park", dignity: 7, sfx: "thud", draw: (ctx) => card(ctx, (c, w, h) => carpark(c, w, h, true), "level 2, bay 14") },
      { say: "So. The chair.", key: "chair", sfx: "whoosh", draw: (ctx) => chair(ctx, 1.5) },
      { say: "Who ends three years next to a ticket machine?", who: "Z", key: "ticket machine", live: true, draw: (ctx, k, t) => shout(ctx, "raw", t, { H: 3300, y: 950 }) },
      { say: "The chair had no answer.", key: "no", draw: (ctx) => chair(ctx, 1.1) },
      { say: "The chair never did.", key: "never", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "slip", { glow: 0, H: 3500, y: 940, dim: 0.15, ...life(t) }) },
      { say: "She said all of it.", key: "all", live: true, draw: (ctx, k, t) => shout(ctx, "raw", t, { H: 2700, bob: 20 * Math.sin(t * 15) }) },
      { say: "The ticket machine. The rain.", key: "rain", draw: (ctx) => card(ctx, (c, w, h) => carpark(c, w, h, true), "it was raining") },
      { say: "The way he said take care.", key: "take care", draw: (ctx) => inHand(ctx, OFFICE, screenThread("Miles", [{ t: "take care, z", me: false }], "", { label: "14 MONTHS AGO" }), { thumb: [0.86, 0.9] }) },
      { say: "A colleague opened the door,", key: "door", sfx: "thud", draw: (ctx) => door(ctx, true) },
      { say: "and closed it again.", key: "closed", sfx: "thud", draw: (ctx) => door(ctx, false) },
      { say: "That evening she opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I shouted at a chair and it helped.", key: "chair helped", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "It says: you finally said it out loud.", key: "loud", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", H: 3400, y: 960, ...life(t, 2) }) },
      { say: "Who was it for?", key: "who", tag: "IT ASKS", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(3, C), { ...HP, w: 640, y: 880, thumb: [0.9, 0.8] }) },
      { say: "Me, apparently.", who: "Z", key: "me", hold: 0.25, live: true, draw: (ctx, k, t) => face(ctx, BED, "smile", { look: "night", H: 3600, y: 940, ...life(t) }) },
      { say: "Say it to him,", key: "him", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BED, VL, VR, false, true) },
      { say: "or write it down and keep it.", key: "write", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BED, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BED, VL, VR) },
      { say: "Fifteen days.", key: "fifteen", days: 15, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
