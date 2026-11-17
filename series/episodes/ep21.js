// Episode 21, day 10, "So happy for you". Path: ALONE won episode 20 (she unticked the box). Vote: REHEARSE (tempting) or TRUE (wise: say the true sentence once).
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep21.wav exists.
(function (g) {
  const C = { mine: "i can't say it without my face doing something", reflect: "Your face keeps telling the truth.", askParts: [["What is ", false], ["the true sentence?", true]] };
  const HP = { night: true, sleeve: null, y: 790, x: 680, w: 540 };
  const N = { look: "night" };
  const take = (ctx, n, expr, t, o = {}) => { mirrorShot(ctx, BED, expr, { ...N, ...life(t), ...o.pose }, { H: o.H || 1900, y: o.y || 2500 }); label(ctx, "TAKE " + n, 640, 360, { size: 40 }); };
  const VL = { word: "REHEARSE", sub: "until it's perfect", color: "#f0b34a", draw: (c) => drawZara(c, 250, 1320, 1150, "frozen", { look: "night" }) };
  const VR = { word: "TRUE", sub: "say the true one, once", color: "#f6ecdc", draw: (c) => drawZara(c, 250, 1320, 1150, "raw", { look: "night" }) };
  g.EP = {
    title: "So happy for you", daysStart: 10, dignityStart: 11, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara is in her bathroom mirror, practising the sentence,", key: "mirror", sfx: "ding", live: true, draw: (ctx, k, t) => mirrorShot(ctx, BED, "frozen", { ...N, ...life(t) }) },
      { say: "so happy for you.", key: "happy", live: true, draw: (ctx, k, t) => take(ctx, 14, "frozen", t) },
      { say: "She is on take fourteen.", key: "fourteen", live: true, draw: (ctx, k, t) => face(ctx, BED, "slip", { look: "night", glow: 0, H: 3200, y: 950, ...life(t, 1) }) },
      { say: "It is for her ex.", key: "ex", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, sleeve: null, thumb: [0.84, 0.78] }) },
      { say: "He gets married in ten days.", key: "ten", draw: (ctx) => inHand(ctx, BED, screenProfile({ muted: true }), { night: true, sleeve: null, thumb: [0.86, 0.5], w: 600, y: 960 }) },
      { say: "She said yes. She is going alone.", key: "yes alone", draw: (ctx) => inHand(ctx, BED, screenList("RSVP · Miles & Ivy", [["Attending", "yes"], ["Plus one", "no"], ["Dietary", "none"]], { hot: 1, gap: 0.1 }), { night: true, sleeve: null, thumb: [0.84, 0.3], w: 600, y: 960 }) },
      { say: "Take one sounded like a hostage video.", key: "hostage", sfx: "tick", live: true, draw: (ctx, k, t) => take(ctx, 1, "dread", t) },
      { say: "Take six was too loud.", key: "loud", sfx: "tick", live: true, draw: (ctx, k, t) => take(ctx, 6, "frozen", t, { H: 2300, y: 2950, pose: { bob: 18 * Math.sin(t * 16) } }) },
      { say: "Take nine had a wink in it.", key: "wink", sfx: "tick", live: true, draw: (ctx, k, t) => take(ctx, 9, "plotting", t, { pose: { blink: k > 0.4 && k < 0.75 ? 1 : 0 } }) },
      { say: "She does not know where the wink came from.", key: "wink", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", glow: 0, H: 3300, y: 950, ...life(t, 2) }) },
      { say: "So happy for you. Both. So much.", who: "Z", key: "both", live: true, draw: (ctx, k, t) => take(ctx, 11, "frozen", t, { H: 2100, y: 2720 }) },
      { say: "Take twelve was nearly human.", key: "human", sfx: "tick", live: true, draw: (ctx, k, t) => take(ctx, 12, "smile", t) },
      { say: "Then her eye twitched.", key: "twitched", dignity: 9, sfx: "thud", live: true, draw: (ctx, k, t) => face(ctx, BED, "slip", { look: "night", glow: 0, H: 4300, y: 900, blink: Math.sin(t * 30) > 0.3 ? 1 : 0, bob: 0, sway: 0 }) },
      { say: "She has run two hundred weddings.", key: "two hundred", sfx: "whoosh", draw: (ctx) => { drawOffice(ctx, { expr: "smile" }); label(ctx, "WEDDINGS RUN: 200", 620, 470, { size: 32 }); } },
      { say: "She has said congratulations for a living.", key: "congratulations", draw: (ctx) => cam(ctx, 520, 900, 1.7, () => drawOffice(ctx, { expr: "frozen" })) },
      { say: "It turns out she has never once meant it at a mirror.", key: "never", live: true, draw: (ctx, k, t) => mirrorShot(ctx, BED, "raw", { ...N, ...life(t) }, { H: 1900, y: 2500 }) },
      { say: "She opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I can't say it without my face doing something.", key: "face", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(0, C, typed(C.mine, k, 0.06, 0.85)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.85), 0.74] }) },
      { say: "It says: your face keeps telling the truth.", key: "truth", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", H: 3400, y: 960, ...life(t, 2) }) },
      { say: "What is the true sentence?", key: "true", tag: "IT ASKS", sfx: "chime", hold: 0.3, draw: (ctx) => inHand(ctx, BED, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Keep rehearsing until it's perfect,", key: "rehearsing", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BED, VL, VR, false, true) },
      { say: "or say the true one out loud, once.", key: "true", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BED, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BED, VL, VR) },
      { say: "Nine days.", key: "nine", days: 9, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, sleeve: null, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
