// Episode 25, day 6, "The text". Path: KEEP won episode 24 (line fourteen stays hers). Vote: SEND (tempting) or SLEEP (wise: sleep on it). The lowest point.
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep25.wav exists.
(function (g) {
  const C = { mine: "i want to not be there", reflect: "Tonight the wanting is very loud.", askParts: [["What does the part of you ", false], ["that said yes want?", true]] };
  const HP = { night: true, sleeve: null, y: 790, x: 680, w: 540 };
  const D = ["so sorry, food poisoning!!", "family emergency. can't say more.", "i can't do it. i thought i could.", "A scheduling conflict has arisen."];
  const draft = (n, to = "Mrs Finch") => screenThread(to, [], D[n], { label: "DRAFT " + (n + 1) });
  const ph = (ctx, s, o = {}) => inHand(ctx, BED, s, { night: true, sleeve: null, thumb: [0.86, 0.86], ...o });
  const VL = { word: "SEND", sub: "send it. get out.", color: "#f0b34a", draw: (c) => heldPhone(c, 230, 400, 300, draft(3), { thumbAt: [0.88, 0.9], glow: 0 }) };
  const VR = { word: "SLEEP", sub: "sleep on it", color: "#f6ecdc", draw: (c) => drawZara(c, 250, 1320, 1150, "neutral", { look: "night", blink: 1, tilt: 0.1 }) };
  g.EP = {
    title: "The text", daysStart: 6, dignityStart: 17, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara has written a text that gets her out of her ex's wedding.", key: "out ex's", sfx: "ding", draw: (ctx) => ph(ctx, draft(3)) },
      { say: "It is very good. It took four drafts.", key: "four", live: true, draw: (ctx, k, t) => face(ctx, BED, "plotting", { look: "night", H: 3200, y: 960, ...life(t) }) },
      { say: "Six days to go.", key: "six", draw: (ctx) => ph(ctx, screenInvite(true), { thumb: [0.84, 0.78] }) },
      { say: "She said yes, and tonight she would like to say no.", key: "yes no", live: true, draw: (ctx, k, t) => face(ctx, BED, "raw", { look: "night", H: 3500, y: 950, ...life(t, 1) }) },
      { say: "Draft one had food poisoning.", key: "poisoning", sfx: "type", live: true, draw: (ctx, k) => ph(ctx, screenThread("Mrs Finch", [], typed(D[0], k, 0.05, 0.7), { label: "DRAFT 1" }), { thumb: [0.86 - tap(k), 0.9] }) },
      { say: "Draft two had a family emergency.", key: "emergency", sfx: "type", live: true, draw: (ctx, k) => ph(ctx, screenThread("Mrs Finch", [], typed(D[1], k, 0.05, 0.7), { label: "DRAFT 2" }), { thumb: [0.86 - tap(k), 0.9] }) },
      { say: "Draft three was honest.", key: "honest", draw: (ctx) => ph(ctx, draft(2), { w: 640, y: 860, x: 620 }) },
      { say: "She deleted draft three fastest.", key: "fastest", sfx: "thud", live: true, draw: (ctx, k) => ph(ctx, screenThread("Mrs Finch", [], D[2].slice(0, Math.max(0, Math.round(D[2].length * (1 - k * 1.6)))), { label: "DRAFT 3" }), { w: 640, y: 860, x: 620 }) },
      { say: "Draft four says a scheduling conflict has arisen.", key: "conflict", draw: (ctx) => ph(ctx, draft(3), { w: 640, y: 860, x: 620 }) },
      { say: "A scheduling conflict. With my whole personality.", who: "Z", key: "personality", live: true, draw: (ctx, k, t) => face(ctx, BED, "slip", { look: "night", H: 3300, y: 960, ...life(t) }) },
      { say: "It is one in the morning.", key: "one", live: true, draw: (ctx, k) => cam(ctx, 420, 1130, 1.45, () => drawBedroom(ctx, { expr: "raw", time: k > 0.5 ? "1:01" : "1:00" })) },
      { say: "The suit is on the door.", key: "suit", draw: (ctx) => { soft(ctx, 18, 0.5, () => BED(ctx)); suitProp(ctx, 540, 960, 1.3); } },
      { say: "The run sheet is on the floor.", key: "floor", draw: (ctx) => { soft(ctx, 18, 0.55, () => BED(ctx)); ctx.save(); ctx.translate(540, 1150); ctx.rotate(0.5); ctx.transform(1, 0, -0.3, 0.6, 0, 0); zform(ctx, (c) => c.roundRect(-300, -380, 600, 760, 10), "#fbf4e8", [-300, -380, 600, 760], { rimW: 5, lo: 0.3 }); ctx.strokeStyle = "rgba(60,50,40,.4)"; ctx.lineWidth = 8; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(-240, -300 + i * 76); ctx.lineTo(240 - (i * 53) % 150, -300 + i * 76); ctx.stroke(); } ctx.restore(); } },
      { say: "Her thumb is on send.", key: "send", live: true, draw: (ctx, k) => ph(ctx, draft(3), { w: 1000, y: 200, x: 560, rot: 0, thumb: [0.86, 0.9 - 0.012 * Math.sin(k * 14)] }) },
      { say: "One to Mrs Finch. One to his sister.", key: "finch sister", draw: (ctx) => ph(ctx, draft(3, "Nell")) },
      { say: "She has not felt this small since the car park.", key: "small", dignity: 10, sfx: "thud", live: true, draw: (ctx, k, t) => face(ctx, BED, "raw", { look: "night", H: 2600 - 500 * k, y: 1000, ...life(t, 2) }) },
      { say: "She opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I want to not be there.", key: "not there", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "It says: tonight the wanting is very loud.", key: "loud", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", H: 3400, y: 960, ...life(t, 2) }) },
      { say: "What does the part of you that said yes want?", key: "yes want", tag: "IT ASKS", sfx: "chime", hold: 0.3, draw: (ctx) => inHand(ctx, BED, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Send it,", key: "send", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BED, VL, VR, false, true) },
      { say: "or sleep on it.", key: "sleep", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BED, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BED, VL, VR) },
      { say: "Five days.", key: "five", days: 5, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, sleeve: null, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
