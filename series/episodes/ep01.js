// Episode 1, "She said yes". One entry per shot: `say` is the words spoken while it is on screen (the shot lasts exactly
// as long as those words; build_audio.py measures them), `who` is N (narrator, default) or Z (Zara), `key` the caption words
// to colour, `hold` extra seconds after the words, and draw(ctx, k, t): k runs 0..1 through the shot, t is the clock in seconds.
// No shot without words: the voice never stops, the picture changes under it. Captions are the spoken words, one or two at a time.
// Every shot is full-bleed. A phone is always in her hand, in her room; her lit face is cut in between as the reaction.
(function (g) {
  const cam = (ctx, cx, cy, s, fn) => { ctx.save(); ctx.translate(540, 960); ctx.scale(s, s); ctx.translate(-cx, -cy); fn(); ctx.restore(); };
  const soft = (ctx, px, dim, fn) => { ctx.save(); ctx.filter = `blur(${px}px)`; fn(); ctx.restore(); ctx.fillStyle = `rgba(14,10,9,${dim})`; ctx.fillRect(0, 0, 1080, 1920); };
  // empty rooms are drawn once and reused as the soft background (blurring a picture is cheap; blurring every stroke is not)
  const cache = {}; const room = (key, fn) => { if (!cache[key]) { const c = document.createElement("canvas"); c.width = 1080; c.height = 1920; fn(c.getContext("2d")); cache[key] = c; } return cache[key]; };
  const FLAT = (ctx) => cam(ctx, 600, 1050, 1.7, () => ctx.drawImage(room("flat", (c) => drawFlat(c, { zara: false })), 0, 0));
  const BED = (ctx) => cam(ctx, 560, 1050, 1.5, () => ctx.drawImage(room("bed", (c) => drawBedroom(c, { zara: false })), 0, 0));
  const NIGHT = { look: "night" };
  const BLAZER = "#efe2cc";
  // the phone in her hand, in the room she is in
  const inHand = (ctx, room, screen, o = {}) => { soft(ctx, 18, 0.38, () => room(ctx)); heldPhone(ctx, o.x || 640, o.y || 900, o.w || 520, screen, { sleeve: o.night ? null : BLAZER, thumbAt: o.thumb, rot: o.rot, glowC: o.night ? "rgba(170,200,255,.3)" : undefined }); };
  // her face, close, the room soft behind
  const face = (ctx, room, expr, o = {}) => { soft(ctx, 16, 0.3, () => room(ctx)); const H = o.H || 2500; drawZara(ctx, 540 + (o.x || 0), (o.y || 980) + 0.868 * H + (o.bob || 0), H, expr, { glow: o.glow ?? 1, tilt: (o.tilt || 0) + (o.sway || 0), look: o.look, mascara: o.mascara, blink: o.blink }); };
  // small signs of life for any shot with her face in it: a blink now and then, breathing, a slight sway
  const life = (t, ph = 0) => { const b = (t * 1.0 + ph) % 2.3; return { blink: b > 1.05 && b < 1.17 ? 1 : 0, bob: 7 * Math.sin(t * 2.4 + ph), sway: 0.012 * Math.sin(t * 1.7 + ph) }; };
  const sofa = (ctx, expr, pose, s = 1.55, cy = 1080) => cam(ctx, 590, cy, s, () => drawFlat(ctx, { expr, pose }));
  const EAR = { sit: true, armL: [0.25, -0.4], armR: [0.95, -3.95], phone: "R", tilt: 0.05 };
  // a daydream: full frame, with a soft cloud edge so it reads as a thought
  const dream = (ctx, fn, tag) => { fn(); ctx.save(); ctx.fillStyle = "#fff8ec"; ctx.filter = "blur(8px)"; for (let i = 0; i < 40; i++) { const t = i / 40 * 6.283, x = 540 + Math.cos(t) * 640, y = 960 + Math.sin(t) * 1080; ctx.beginPath(); ctx.arc(x, y, 190 + 40 * Math.sin(i * 2.3), 0, 6.3); ctx.fill(); } ctx.restore(); [[170, 1640, 44], [100, 1740, 26]].forEach(([x, y, r]) => { ctx.fillStyle = "#fff8ec"; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.fill(); }); label(ctx, tag, 640, 420, { size: 38 }); };
  const ballroom = (ctx) => { const b = ctx.createLinearGradient(0, 0, 0, 1920); b.addColorStop(0, "#f3d9b8"); b.addColorStop(1, "#c98a6a"); ctx.fillStyle = b; ctx.fillRect(0, 0, 1080, 1920); ctx.save(); ctx.filter = "blur(14px)"; for (let i = 0; i < 30; i++) { ctx.fillStyle = "rgba(255,240,200,.6)"; ctx.beginPath(); ctx.arc((i * 197) % 1080, 300 + (i * 131) % 500, 14 + (i % 4) * 6, 0, 6.3); ctx.fill(); } ctx.restore(); ctx.fillStyle = "rgba(120,60,40,.35)"; ctx.fillRect(0, 1500, 1080, 420); };
  const guest = (ctx, x, y, s, turn, skin, suit) => { ctx.save(); ctx.filter = "blur(3px)"; zform(ctx, (c) => c.roundRect(x - 90 * s, y, 180 * s, 520 * s, 60 * s), suit, [x - 90 * s, y, 180 * s, 520 * s], { rimW: 0 }); zform(ctx, (c) => c.ellipse(x, y - 70 * s, 62 * s, 72 * s, 0, 0, 6.3), skin, [x - 62 * s, y - 142 * s, 124 * s, 144 * s], { rimW: 0 }); ctx.fillStyle = "#1c1210"; [-1, 1].forEach((e) => { ctx.beginPath(); ctx.arc(x + turn * 22 * s + e * 20 * s, y - 76 * s, 7 * s, 0, 6.3); ctx.fill(); }); ctx.beginPath(); ctx.ellipse(x + turn * 24 * s, y - 40 * s, 11 * s, 14 * s, 0, 0, 6.3); ctx.fill(); ctx.restore(); };
  const T = (t) => screenThread("Miles", [{ t: "happy birthday x", me: false }, { t: "thanks!", me: true }], t, { label: "LAST MESSAGE: 14 MONTHS AGO" });
  const strip = (ctx, x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.rotate(-0.06); ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.fillRect(-110 * s + 14, -330 * s + 18, 220 * s, 660 * s); ctx.fillStyle = "#fbf4e8"; ctx.fillRect(-110 * s, -330 * s, 220 * s, 660 * s);
    [0, 1, 2].forEach((i) => { const fy = -310 * s + i * 212 * s; ctx.fillStyle = "#3a2a3a"; ctx.fillRect(-92 * s, fy, 184 * s, 196 * s); ctx.save(); ctx.beginPath(); ctx.rect(-92 * s, fy, 184 * s, 196 * s); ctx.clip();
      zform(ctx, (c) => c.ellipse(-36 * s, fy + 120 * s, 44 * s, 50 * s, 0, 0, 6.3), ZC.skin, [-80 * s, fy + 70 * s, 88 * s, 100 * s], { rimW: 0 }); ctx.fillStyle = ZC.hair; ctx.beginPath(); ctx.ellipse(-36 * s, fy + 96 * s, 50 * s, 44 * s, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(-86 * s, fy + 96 * s, 22 * s, 100 * s);
      zform(ctx, (c) => c.ellipse(44 * s, fy + 108 * s, 46 * s, 54 * s, 0, 0, 6.3), "#c98a62", [-2 * s, fy + 54 * s, 92 * s, 108 * s], { rimW: 0 }); ctx.fillStyle = "#3a241a"; ctx.beginPath(); ctx.ellipse(44 * s, fy + 76 * s, 48 * s, 30 * s, 0, Math.PI, 0); ctx.fill(); ctx.restore(); }); ctx.restore(); };


  const DRAFTS = ["congrats!! can't wait x", "wow.", "so happy for you both", "does she know about the car park", "five months. FIVE.", "hope the cake is dry", "i hope it rains", "who even is ivy", "i said yes so you'd think i'm fine"];
  const REMY = [{ t: "i said yes", me: true }, { t: "TO WHAT", me: false }, { t: "ZARA.", me: false }, { t: "ARE YOU UNWELL", me: false }, { t: "take it back", me: false }];
  const VOTE = (ctx, dimL, dimR) => { soft(ctx, 20, 0.55, () => BED(ctx)); voteCard(ctx,
    { word: "CALL", sub: "tell Remy the real reason", color: "#f6ecdc", draw: (c) => drawZara(c, 250, 1300, 1250, "smile", { look: "night", armL: [0.2, 0.1], armR: [0.95, -3.95], phone: "R" }) },
    { word: "SEND", sub: "send Miles draft nine", color: "#f0b34a", draw: (c) => heldPhone(c, 230, 400, 300, T("i said yes so you'd think i'm fine"), { thumbAt: [0.86, 0.86], glow: 0 }) });
    ctx.fillStyle = "rgba(14,10,9,.72)"; if (dimL) { ctx.beginPath(); ctx.roundRect(28, 428, 504, 904, 40); ctx.fill(); } if (dimR) { ctx.beginPath(); ctx.roundRect(548, 428, 504, 904, 40); ctx.fill(); } };
  const HP = { night: true, y: 790, x: 680, w: 540 };

  g.EP = g.EP01 = {
    title: "She said yes", daysStart: 30, dignityStart: 61,
    shots: [
      // ---- the premise, in the first three seconds
      { say: "Zara just said yes", key: "yes", hud: false, live: true, draw: (ctx, k) => inHand(ctx, FLAT, screenInvite(k > 0.3), { thumb: [0.84, k > 0.3 && k < 0.5 ? 0.76 : 0.8] }) },
      { say: "to her ex's wedding.", key: "ex's", hud: false, live: true, amb: "tv", draw: (ctx, k, t) => face(ctx, FLAT, "dread", life(t)) },
      { say: "It's in thirty days.", key: "thirty", amb: "flat", draw: (ctx) => drawFlat(ctx, { expr: "dread" }) },
      { say: "Her best friend", key: "friend", live: true, draw: (ctx, k) => inHand(ctx, FLAT, screenThread("Remy", REMY.slice(0, k > 0.45 ? 2 : 1), ""), { thumb: [0.9, 0.62], rot: 0.04, x: 620 }) },
      { say: "had notes.", key: "notes", live: true, draw: (ctx, k) => inHand(ctx, FLAT, screenThread("Remy", REMY.slice(0, 3 + (k > 0.3) + (k > 0.62)), ""), { thumb: [0.9, 0.62], rot: 0.04 + 0.02 * Math.sin(k * 40) * (k < 0.7), x: 620 }) },
      // ---- the history
      { say: "They were together three years.", key: "three", live: true, draw: (ctx, k) => { soft(ctx, 18, 0.45, () => FLAT(ctx)); ctx.save(); ctx.translate(540, 0); ctx.rotate(0.03 * Math.sin(k * 5)); ctx.translate(-540, 0); strip(ctx, 540, 900, 1.9); ctx.restore(); } },
      { say: "He met Ivy", key: "ivy", draw: (ctx) => { inHand(ctx, FLAT, screenPost(), { thumb: [0.85, 0.9], rot: 0.03 }); label(ctx, "IVY", 640, 420, { size: 34 }); } },
      { say: "five months later.", key: "five", live: true, amb: "tv", draw: (ctx, k, t) => face(ctx, FLAT, "caught", { ...life(t, 1), H: 2900 }) },
      // ---- her job
      { say: "Zara plans weddings", key: "weddings", draw: (ctx) => { drawOffice(ctx); label(ctx, "EVENTS DIRECTOR · WEDDINGS", 470, 470, { size: 30 }); } },
      { say: "for a living,", draw: (ctx) => cam(ctx, 520, 900, 1.6, () => drawOffice(ctx, { expr: "smile" })) },
      { say: "which has stopped being funny.", key: "funny", draw: (ctx) => cam(ctx, 520, 820, 2.3, () => drawOffice(ctx, { expr: "slip" })) },
      { say: "It's fine. I'm being mature.", who: "Z", key: "mature", amb: "tv", draw: (ctx) => sofa(ctx, "frozen", EAR, 2.5, 960) },
      { say: "She was not", key: "not", dignity: 54, live: true, amb: "tv", draw: (ctx, k, t) => face(ctx, FLAT, "slip", { glow: 0, H: 2300, tilt: 0.05, ...life(t, 2) }) },
      { say: "being mature.", amb: "flat2", draw: (ctx) => cam(ctx, 560, 1150, 1.9, () => drawFlat(ctx, { zara: false, after: (c) => { const H = 780; c.save(); c.translate(660, 1262); c.rotate(-1.2); drawZara(c, 0, 0.5 * H, H, "hiding", { noCushion: true, armL: [0.9, -1.6], armR: [0.2, 0.3] }); c.restore(); zform(c, (k) => k.roundRect(300, 1086, 176, 150, 40), "#d9643a", [300, 1086, 176, 150], { rimW: 6, lo: 0.4 }); } })) },
      // ---- the plan, and the likelier version
      { say: "The plan is to walk in", key: "plan", live: true, draw: (ctx, k) => dream(ctx, () => { ballroom(ctx); guest(ctx, 150, 900, 1.5, k > 0.3 ? 1 : -1, "#c08a62", "#3a2a30"); guest(ctx, 930, 880, 1.5, k > 0.45 ? -1 : 1, "#7a5640", "#4a3a44"); guest(ctx, 330, 780, 1.0, k > 0.2 ? 1 : -1, "#e3b594", "#5a4a40"); guest(ctx, 790, 770, 1.0, k > 0.55 ? -1 : 1, "#b0714f", "#2a1f1d"); drawZara(ctx, 540, 1700 - 60 * k, 1150 + 100 * k, "plotting", { look: "dress", stride: true, armL: [0.35, 0.2 + 0.2 * Math.sin(k * 9)], armR: [0.3, -0.3 - 0.2 * Math.sin(k * 9)] }); }, "THE PLAN") },
      { say: "looking incredible.", key: "incredible", live: true, draw: (ctx, k, t) => dream(ctx, () => { ballroom(ctx); const H = 2300; drawZara(ctx, 540, 1000 + 0.868 * H, H, "plotting", { look: "dress", glow: 0, blink: life(t).blink }); }, "THE PLAN") },
      { say: "The plan has not", key: "not", draw: (ctx) => dream(ctx, () => { ballroom(ctx); guest(ctx, 170, 900, 1.5, 1, "#c08a62", "#3a2a30"); guest(ctx, 920, 880, 1.5, -1, "#7a5640", "#4a3a44"); drawZara(ctx, 540, 1700, 1250, "raw", { look: "dress", mascara: true, armL: [0.2, 0.1], armR: [0.7, -3.2], pastry: true }); }, "MORE LIKELY") },
      { say: "met the buffet.", key: "buffet", live: true, amb: "fly", fly: [760, 1080, 130], draw: (ctx, k, t) => dream(ctx, () => { ballroom(ctx); const H = 2300; drawZara(ctx, 500, 1000 + 0.868 * H, H, "raw", { look: "dress", mascara: true, glow: 0, armL: [0.2, 0.1], armR: [0.7, -3.2], pastry: true, tilt: -0.04, blink: life(t).blink }); }, "MORE LIKELY") },
      // ---- one in the morning
      { say: "By one in the morning", key: "one", live: true, draw: (ctx, k) => cam(ctx, 420, 1130, 1.45, () => drawBedroom(ctx, { expr: "raw", time: k > 0.55 ? "1:13" : "1:12" })) },
      { say: "she has written to him nine times,", key: "nine", live: true, draw: (ctx, k) => { const n = Math.min(8, Math.floor(k * 9.4)), d = DRAFTS[n], part = Math.min(1, ((k * 9.4) % 1) * 2.2); inHand(ctx, BED, T(n === 8 ? d : d.slice(0, Math.ceil(part * d.length))), { night: true, thumb: [0.86 - 0.3 * Math.abs(Math.sin(k * 60)), 0.9], y: 790, x: 670 }); label(ctx, "DRAFT " + (n + 1), 670, 700, { size: 36 }); } },
      { say: "and sent none.", key: "none", live: true, draw: (ctx, k) => { inHand(ctx, BED, T("i said yes so you'd think i'm fine"), { night: true, thumb: [0.8, 0.84 - 0.03 * Math.sin(k * 12)], y: 790, x: 670 }); label(ctx, "DRAFT 9 · NOT SENT", 670, 700, { size: 32 }); } },
      // ---- Heartly: the narrator says what is on the screen, one thing at a time
      { say: "So she types it somewhere", key: "somewhere",
        draw: (ctx) => { soft(ctx, 14, 0.3, () => BED(ctx)); heldPhone(ctx, 640, 860, 470, screenHeartly(0, null), { thumbAt: [0.7, 0.62], rot: 0.05, glowC: "rgba(255,200,150,.3)" });
          ctx.save(); ctx.filter = "blur(7px)"; zform(ctx, (c) => c.ellipse(170, 1660, 330, 400, 0.1, 0, 6.3), ZC.hair, [-160, 1260, 660, 800], { rimW: 16 }); zform(ctx, (c) => c.ellipse(210, 1230, 170, 130, 0, 0, 6.3), ZC.hair, [40, 1100, 340, 260], { rimW: 10 }); zform(ctx, (c) => c.ellipse(420, 1900, 240, 150, -0.3, 0, 6.3), ZC.tee, [180, 1750, 480, 300], { rimW: 10 }); ctx.restore(); } },
      { say: "he will never read it.", key: "never", live: true, draw: (ctx, k, t) => face(ctx, BED, "raw", { look: "night", H: 4300, y: 900, ...life(t, 1) }) },
      { say: "The app asks what feeling keeps coming back.", key: "asks back", tag: "IT ASKS", draw: (ctx) => inHand(ctx, BED, screenHeartly(0, null), { ...HP, thumb: [0.86, 0.66] }) },
      { say: "She writes: that he's fine without me.", key: "fine without me", tag: "SHE WRITES", live: true, draw: (ctx, k) => { const n = Math.ceil(Math.min(1, Math.max(0, k - 0.22) * 1.6) * 15); inHand(ctx, BED, screenHeartly(0, k < 0.22 ? null : [["that he's ", false], ["fine without me".slice(0, n), true]]), { ...HP, w: 600, y: 840, thumb: [0.8 - 0.25 * Math.abs(Math.sin(k * 30)) * (k > 0.22 && k < 0.85), 0.62] }); } },
      { say: "No advice. It just says:", key: "no", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", H: 3300, y: 960, tilt: -0.04, ...life(t, 2) }) },
      { say: "he looks fine, and you're the one still awake.", key: "awake", tag: "IT REPLIES", draw: (ctx) => inHand(ctx, BED, screenHeartly(1), { ...HP, thumb: [0.9, 0.72] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, BED, "slip", { look: "night", H: 3600, y: 940, ...life(t, 0.5) }) },
      { say: "When he sees your yes, what do you want him to think?", key: "yes think", tag: "IT ASKS", draw: (ctx) => inHand(ctx, BED, screenHeartly(2), { ...HP, w: 580, y: 820, thumb: [0.9, 0.72] }) },
      { say: "I'm fine.", who: "Z", key: "fine", live: true, hold: 0.25, draw: (ctx, k, t) => face(ctx, BED, "raw", { look: "night", H: 3300, y: 960, ...life(t) }) },
      // ---- the vote
      { say: "Call her best friend and admit it,", key: "call", capY: 1500, draw: (ctx) => VOTE(ctx, false, true) },
      { say: "or send him draft nine.", key: "send", capY: 1500, draw: (ctx) => VOTE(ctx, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, draw: (ctx) => VOTE(ctx) },
      { say: "Twenty nine days.", key: "twenty nine", days: 29, hold: 0.9, draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
