// Episode 27, day 4, "Properly". Path: LEAVE won episode 26. Vote: TELL (wise: tell Remy tonight) or KEEP (tempting: keep it to herself). Grief begins.
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep27.wav exists.
(function (g) {
  const C = { mine: "i'm sad about a wedding that isn't his", reflect: "Under his wedding, there was yours.", askParts: [["What do you want ", false], ["to do with that?", true]] };
  const HP = { night: true, sleeve: null, y: 790, x: 680, w: 540 };
  const P = (rows, hot) => (ctx) => paper(ctx, FLAT, "MILES & IVY · PLAN v9", rows, hot, { size: 54, gap: 230 });
  const A = ["BAND", "moved: his gran can hear"], B = ["14:50", "ten quiet minutes for the bride"], U = ["VAN", "40 umbrellas"];
  const desk = (ctx, expr) => cam(ctx, 590, 1080, 1.55, () => drawFlat(ctx, { expr, pose: { sit: true, look: "night", armL: [0.3, -1.5], armR: [0.3, -1.5] } }));
  const VL = { word: "TELL", sub: "tell Remy tonight", color: "#f6ecdc", draw: (c) => heldPhone(c, 230, 400, 300, screenThread("Remy", [], "i think i want one. a wedding."), { thumbAt: [0.86, 0.86], glow: 0 }) };
  const VR = { word: "KEEP", sub: "keep it to herself a while", color: "#f0b34a", draw: (c) => drawZara(c, 250, 1320, 1150, "neutral", { look: "night" }) };
  g.EP = {
    title: "Properly", daysStart: 4, dignityStart: 24, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara is redoing her ex's wedding plan at midnight.", key: "ex's midnight", sfx: "ding", amb: [["candle", 880, 1300], ["dust"]], draw: (ctx) => desk(ctx, "neutral") },
      { say: "Nobody asked her to.", key: "nobody", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "neutral", { look: "night", glow: 1, H: 3000, ...life(t) }) },
      { say: "Four days. She said yes.", key: "four yes", draw: (ctx) => inHand(ctx, FLAT, screenInvite(true), { sleeve: null, thumb: [0.84, 0.78] }) },
      { say: "The plan was already good.", key: "good", draw: P([["STATUS", "approved by Mrs Finch"]], 0) },
      { say: "It was a professional's plan.", key: "professional", draw: (ctx) => cam(ctx, 520, 900, 1.6, () => drawOffice(ctx, { expr: "smile" })) },
      { say: "Tonight she is doing the other kind.", key: "other", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "smile", { look: "night", glow: 1, H: 3300, y: 950, ...life(t, 1) }) },
      { say: "She moved the band so his gran can hear.", key: "gran", sfx: "tick", draw: P([A], 0) },
      { say: "She gave the bride ten quiet minutes before the aisle.", key: "quiet", sfx: "tick", draw: P([A, B], 1) },
      { say: "She added umbrellas.", key: "umbrellas", sfx: "tick", draw: P([A, B, U], 2) },
      { say: "It always rains on the ones that matter.", key: "rains", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "plotting", { look: "night", glow: 1, H: 3000, ...life(t, 2) }) },
      { say: "This is how I'd want mine.", who: "Z", key: "mine", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "smile", { look: "night", glow: 1, H: 3300, y: 950, ...life(t) }) },
      { say: "She said it to the laptop.", key: "laptop", amb: [["glow", 400, 1450, 500]], draw: (ctx) => cam(ctx, 400, 1480, 2.4, () => drawFlat(ctx, { zara: false })) },
      { say: "The laptop did not react.", key: "not", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "caught", { look: "night", glow: 1, H: 3400, y: 950, ...life(t, 1) }) },
      { say: "She had not known she still wanted one.", key: "wanted", dignity: 26, live: true, draw: (ctx, k, t) => face(ctx, FLAT, "raw", { look: "night", glow: 1, H: 3900, y: 930, ...life(t) }) },
      { say: "It turns out you can plan a day for someone,", key: "someone", amb: [["candle", 880, 1300], ["dust"]], draw: (ctx) => desk(ctx, "raw") },
      { say: "and miss a different day entirely.", key: "miss", draw: (ctx) => paper(ctx, FLAT, "PLAN · UNTITLED", [["COUPLE", "Zara & —"], ["DATE", "—"]], 0, { size: 90, gap: 260 }) },
      { say: "She opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, FLAT, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I'm sad about a wedding that isn't his.", key: "sad his", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, FLAT, screenStage(0, C, typed(C.mine, k, 0.06, 0.85)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.85), 0.74] }) },
      { say: "It says: under his wedding, there was yours.", key: "yours", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, FLAT, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "caught", { look: "night", glow: 1, H: 3400, y: 960, ...life(t, 2) }) },
      { say: "What do you want to do with that?", key: "do", tag: "IT ASKS", sfx: "chime", hold: 0.3, draw: (ctx) => inHand(ctx, FLAT, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Tell her best friend tonight,", key: "tell", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, FLAT, VL, VR, false, true) },
      { say: "or keep it to herself a while.", key: "keep", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, FLAT, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, FLAT, VL, VR) },
      { say: "Three days.", key: "three", days: 3, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, FLAT, screenInvite(true), { sleeve: null, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
