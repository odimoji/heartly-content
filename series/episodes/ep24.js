// Episode 24, day 7, "The run sheet". Path: THROUGH won episode 23 (she is seeing it through). Vote: SWAP (tempting) or KEEP (wise: keep line fourteen). Fear begins.
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep24.wav exists.
(function (g) {
  const C = { mine: "i have to stand a foot away and pin a flower on him", reflect: "The job puts you closer than the invitation did.", askParts: [["What are you afraid ", false], ["your face will do?", true]] };
  const HP = { night: true, y: 790, x: 680, w: 540 };
  const RUN = [["14", "planner pins the groom's buttonhole"], ["22", "planner cues the first dance"], ["30", "planner hands the bride her bouquet"]];
  const run = (hot, rows = RUN) => (ctx) => paper(ctx, OFFICE, "RUN SHEET · MILES & IVY", rows, hot, { size: 50, gap: 230 });
  const pen = (ctx, k) => { soft(ctx, 18, 0.5, () => FLAT(ctx)); ctx.save(); ctx.translate(540 + 14 * Math.sin(k * 60), 960 + 300 * Math.max(0, k - 0.5) * 2); ctx.rotate(0.5 + 1.2 * Math.max(0, k - 0.5)); zform(ctx, (c) => c.roundRect(-30, -330, 60, 600, 26), "#1f1c22", [-30, -330, 60, 600], { rimW: 5, lo: 0.4 }); zform(ctx, (c) => { c.moveTo(-28, 270); c.lineTo(28, 270); c.lineTo(0, 350); c.closePath(); }, "#d9b26a", [-28, 270, 56, 80], { rimW: 0 }); ctx.restore(); };
  const VL = { word: "SWAP", sub: "give the buttonhole to a colleague", color: "#f0b34a", draw: (c) => heldPhone(c, 230, 400, 300, screenList("Line 14", [["Buttonhole", ""], ["Assign to", "someone else"]], { hot: 1, gap: 0.1 }), { thumbAt: [0.8, 0.3], glow: 0 }) };
  const VR = { word: "KEEP", sub: "keep line fourteen", color: "#f6ecdc", draw: (c) => heldPhone(c, 230, 400, 300, screenList("Line 14", [["Buttonhole", ""], ["Assign to", "Zara"]], { hot: 1, gap: 0.1 }), { thumbAt: [0.8, 0.3], glow: 0 }) };
  g.EP = {
    title: "The run sheet", daysStart: 7, dignityStart: 20, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara has the final run sheet for her ex's wedding.", key: "run ex's", sfx: "ding", draw: run(-1) },
      { say: "Seven days.", key: "seven", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "neutral", { glow: 0, H: 3000, dim: 0.15, ...life(t) }) },
      { say: "She said yes, and she is running it.", key: "yes running", draw: (ctx) => { drawOffice(ctx, { expr: "smile" }); label(ctx, "LEAD PLANNER · ALSO A GUEST", 620, 470, { size: 30 }); } },
      { say: "Line fourteen. Planner to pin the groom's buttonhole.", key: "fourteen buttonhole", sfx: "tick", draw: run(0) },
      { say: "Line twenty-two. Planner to cue the first dance.", key: "dance", sfx: "tick", draw: run(1) },
      { say: "Line thirty. Planner to hand the bride her bouquet,", key: "bouquet", sfx: "tick", draw: run(2) },
      { say: "and step back.", key: "back", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "slip", { glow: 0, H: 3400, y: 950, dim: 0.15, ...life(t, 1) }) },
      { say: "Step back. Right.", who: "Z", key: "right", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "frozen", { glow: 0, H: 3100, y: 950, dim: 0.15, ...life(t), bob: 8 * Math.sin(t * 11) }) },
      { say: "She has done these jobs two hundred times.", key: "two hundred", draw: (ctx) => cam(ctx, 520, 900, 1.6, () => drawOffice(ctx, { expr: "smile" })) },
      { say: "Her hands know them.", key: "hands", draw: (ctx) => inHand(ctx, OFFICE, screenList("Today", [["Florist", "done"], ["Band", "done"], ["Cake", "lemon. done."]], { hot: 2, gap: 0.1 }), { thumb: [0.84, 0.4], w: 600, y: 960 }) },
      { say: "Tonight her hands would not hold a pen.", key: "pen", dignity: 17, sfx: "thud", live: true, draw: (ctx, k) => pen(ctx, k) },
      { say: "She told Mrs Finch she would see it through.", key: "through", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "smile", { who: finch, glow: 0, H: 2700, dim: 0.15, ...life(t, 1) }) },
      { say: "That was yesterday.", key: "yesterday", amb: [["tv", 0.16], ["dust"]], draw: (ctx) => cam(ctx, 590, 1080, 1.55, () => drawFlat(ctx, { expr: "dread", pose: { sit: true, look: "night", armL: [0.5, -1.0], armR: [0.5, -1.0] } })) },
      { say: "Yesterday was braver.", key: "braver", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "raw", { look: "night", glow: 0, H: 3600, y: 940, ...life(t) }) },
      { say: "She opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I have to stand a foot away from him and pin a flower on.", key: "foot flower", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(0, C, typed(C.mine, k, 0.05, 0.88)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k, 44) * (k < 0.88), 0.74] }) },
      { say: "It says: the job puts you closer than the invitation did.", key: "closer", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", H: 3400, y: 960, ...life(t, 2) }) },
      { say: "What are you afraid your face will do?", key: "afraid face", tag: "IT ASKS", sfx: "chime", hold: 0.3, draw: (ctx) => inHand(ctx, BED, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Swap the buttonhole to a colleague,", key: "swap", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BED, VL, VR, false, true) },
      { say: "or keep line fourteen.", key: "keep", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BED, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BED, VL, VR) },
      { say: "Six days.", key: "six", days: 6, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
