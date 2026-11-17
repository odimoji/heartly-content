// Episode 11, day 20, "Tuesday". Path: KEEP won episode 10 (the dress stays). Vote: DRIVE (wise) or SEND (tempting: send flowers). Her mum is only ever a voice on the phone.
(function (g) {
  const C = { mine: "i was so busy not thinking about him that i forgot her", reflect: "The running cost you something this time.", askParts: [["What were you ", false], ["too busy to feel?", true]] };
  const HP = { night: true, y: 790, x: 680, w: 540 };
  const EAR = { sit: true, armL: [0.25, -0.4], armR: [0.95, -3.95], phone: "R", tilt: 0.05 };
  const notif = (open, dx = 0) => (ctx, w, h) => { const b = ctx.createLinearGradient(0, 0, 0, h); b.addColorStop(0, "#2a1a14"); b.addColorStop(1, "#120d0a"); ctx.fillStyle = b; ctx.fillRect(0, 0, w, h); ctx.textAlign = "center"; ctx.fillStyle = "#f6ecdc"; ctx.font = `600 ${w * 0.2}px Cormorant`; ctx.fillText("7:58", w / 2, h * 0.2);
    [["3 days ago", 0.3], ["2 days ago", 0.42], ["Yesterday", 0.54]].forEach(([when, y], i) => { ctx.save(); ctx.translate(i === 2 ? dx * w : 0, 0); ctx.fillStyle = "rgba(60,44,36,.96)"; ctx.beginPath(); ctx.roundRect(w * 0.05, h * y, w * 0.9, h * 0.1, w * 0.05); ctx.fill(); ctx.textAlign = "left"; ctx.fillStyle = "#d9b26a"; ctx.font = `600 ${w * 0.04}px Inter`; ctx.fillText("REMINDER · " + when.toUpperCase(), w * 0.1, h * (y + 0.038)); ctx.fillStyle = "#f6ecdc"; ctx.font = `600 ${w * 0.06}px Inter`; if (open) ctx.fillText("Mum's birthday", w * 0.1, h * (y + 0.078)); else { ctx.fillStyle = "rgba(246,236,220,.3)"; ctx.fillRect(w * 0.1, h * (y + 0.055), w * 0.5, h * 0.022); } ctx.restore(); }); };
  const call = (sub) => (ctx, w, h) => { const b = ctx.createLinearGradient(0, 0, 0, h); b.addColorStop(0, "#33241c"); b.addColorStop(1, "#120d0a"); ctx.fillStyle = b; ctx.fillRect(0, 0, w, h); zform(ctx, (c) => c.ellipse(w / 2, h * 0.24, w * 0.17, w * 0.17, 0, 0, 6.3), "#c9793f", [w * 0.33, h * 0.24 - w * 0.17, w * 0.34, w * 0.34], { rimW: 0 }); ctx.textAlign = "center"; ctx.fillStyle = "#f6ecdc"; ctx.font = `600 ${w * 0.16}px Cormorant`; ctx.fillText("M", w / 2, h * 0.265); ctx.font = `600 ${w * 0.13}px Inter`; ctx.fillText("Mum", w / 2, h * 0.45); ctx.fillStyle = "#d9b26a"; ctx.font = `500 ${w * 0.06}px Inter`; ctx.fillText(sub, w / 2, h * 0.51); [[0.28, "#e5484d"], [0.72, "#3fb56a"]].forEach(([x, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(w * x, h * 0.8, w * 0.11, 0, 6.3); ctx.fill(); }); };
  const MONTH = (ctx, w, h) => { ctx.fillStyle = "#17120f"; ctx.fillRect(0, 0, w, h); ctx.fillStyle = "#f6ecdc"; ctx.font = `600 ${w * 0.075}px Inter`; ctx.textAlign = "left"; ctx.fillText("This week", w * 0.07, h * 0.09); for (let i = 0; i < 35; i++) { const x = w * 0.05 + (i % 5) * w * 0.182, y = h * 0.13 + Math.floor(i / 5) * h * 0.115; ["#d9643a", "#d9b26a", "#5fa08a", "#7a8ad0"].forEach((c, j) => { ctx.fillStyle = c; ctx.fillRect(x, y + j * h * 0.025, w * 0.165, h * 0.021); }); } };
  const dress = (ctx, x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = "#d9b26a"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, -330, 26, Math.PI * 0.9, Math.PI * 2.3); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-150, -230); ctx.lineTo(0, -300); ctx.lineTo(150, -230); ctx.stroke(); zform(ctx, (c) => { c.moveTo(-120, -240); c.quadraticCurveTo(0, -200, 120, -240); c.bezierCurveTo(100, -80, 110, 20, 250, 420); c.quadraticCurveTo(0, 470, -250, 420); c.bezierCurveTo(-110, 20, -100, -80, -120, -240); c.closePath(); }, "#c0392b", [-250, -240, 500, 700], { rimW: 8, lo: 0.4 }); ctx.restore(); };
  const witness = (ctx) => { wardrobe(ctx, { hoodieAt: "shelf", door: 0.62 }); dress(ctx, 760, 880, 1.15); };
  const flowers = (c) => { c.strokeStyle = "#4a7a4a"; c.lineWidth = 10; [[-60, 0], [0, -10], [60, 0]].forEach(([dx]) => { c.beginPath(); c.moveTo(250 + dx * 0.3, 640); c.lineTo(250 + dx, 400); c.stroke(); }); [[190, 380, "#e58a9a"], [250, 340, "#f0cc72"], [310, 380, "#e5484d"], [220, 300, "#f6ecdc"], [290, 290, "#e58a9a"]].forEach(([x, y, col]) => zform(c, (k) => k.ellipse(x, y, 48, 48, 0, 0, 6.3), col, [x - 48, y - 48, 96, 96], { rimW: 4 })); zform(c, (k) => { k.moveTo(190, 520); k.lineTo(310, 520); k.lineTo(290, 660); k.lineTo(210, 660); k.closePath(); }, "#e9dcc6", [190, 520, 120, 140], { rimW: 4 }); };
  const VL = { word: "DRIVE", sub: "drive to her mum's tonight", color: "#f6ecdc", draw: (c) => heldPhone(c, 230, 400, 300, screenThread("Mum", [{ t: "it's fine, love", me: false }], "on my way"), { thumbAt: [0.86, 0.86], glow: 0 }) };
  const VR = { word: "SEND", sub: "send flowers, stay busy", color: "#f0b34a", draw: flowers };
  g.EP = {
    title: "Tuesday", daysStart: 20, dignityStart: 20, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara's phone has been reminding her of something", key: "reminding", sfx: "buzz", live: true, draw: (ctx, k) => inHand(ctx, OFFICE, notif(false), { thumb: [0.86, 0.6], rot: 0.02 * Math.sin(k * 50) * (k < 0.4) }) },
      { say: "for three days.", key: "three", draw: (ctx) => inHand(ctx, OFFICE, notif(false), { thumb: [0.86, 0.6], w: 700, y: 1000, x: 600 }) },
      { say: "She has been too busy to read it.", key: "busy", sfx: "whoosh", live: true, draw: (ctx, k) => inHand(ctx, OFFICE, notif(false, Math.max(0, k - 0.3) * 1.6), { thumb: [0.4 + 0.5 * Math.min(1, k * 1.6), 0.6], w: 600, y: 960 }) },
      { say: "Her ex's wedding is in twenty days.", key: "ex's twenty", draw: (ctx) => inHand(ctx, OFFICE, screenInvite(true), { thumb: [0.84, 0.78] }) },
      { say: "She said yes.", key: "yes", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "frozen", { glow: 0, H: 3000, dim: 0.15, ...life(t) }) },
      { say: "She kept the dress.", key: "kept", sfx: "ding", live: true, draw: (ctx, k) => { soft(ctx, 18, 0.5, () => BED(ctx)); dress(ctx, 520, 960, 1.3 + 0.1 * k); } },
      { say: "It hangs on the wardrobe door like a witness.", key: "witness", draw: (ctx) => witness(ctx) },
      { say: "She has not had a quiet minute all week,", key: "quiet", live: true, draw: (ctx, k) => inHand(ctx, OFFICE, MONTH, { thumb: [0.8, 0.8 - 0.5 * k], w: 600, y: 940 }) },
      { say: "which was the point.", key: "point", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "plotting", { glow: 0, H: 3000, dim: 0.15, ...life(t, 1) }) },
      { say: "Then her mum rang.", key: "mum", sfx: "buzz", live: true, draw: (ctx, k) => inHand(ctx, FLAT, call("calling…"), { thumb: [0.8, 0.86], rot: 0.025 * Math.sin(k * 60) }) },
      { say: "On a Tuesday.", key: "tuesday", sfx: "buzz", live: true, draw: (ctx, k) => { inHand(ctx, FLAT, call("calling…"), { thumb: [0.8, 0.86], w: 680, y: 1080, x: 600, rot: 0.025 * Math.sin(k * 60) }); } },
      { say: "Her mum rings on Sundays.", key: "sundays", live: true, amb: [["tv", 0.16]], draw: (ctx, k, t) => face(ctx, FLAT, "caught", { glow: 0, H: 2900, ...life(t) }) },
      { say: "Is everything okay?", who: "Z", key: "okay", amb: [["tv", 0.18]], draw: (ctx) => cam(ctx, 590, 960, 2.5, () => drawFlat(ctx, { expr: "dread", pose: EAR })) },
      { say: "It was her mum's birthday.", key: "birthday", sfx: "thud", draw: (ctx) => inHand(ctx, FLAT, notif(true), { thumb: [0.86, 0.75], w: 640, y: 980 }) },
      { say: "Yesterday.", key: "yesterday", dignity: 16, live: true, draw: (ctx, k, t) => face(ctx, FLAT, "dread", { glow: 0, H: 3800, y: 930, ...life(t, 1) }) },
      { say: "Her mum said it was fine.", key: "fine", amb: [["tv", 0.14]], draw: (ctx) => cam(ctx, 590, 960, 2.5, () => drawFlat(ctx, { expr: "raw", pose: EAR })) },
      { say: "Her mum also asked how Miles was.", key: "miles", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "caught", { glow: 0, H: 3300, y: 950, ...life(t, 2) }) },
      { say: "Getting married.", who: "Z", key: "married", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "raw", { glow: 0, H: 3600, y: 940, ...life(t) }) },
      { say: "The line went quiet.", key: "quiet", draw: (ctx) => inHand(ctx, FLAT, call("04:12"), { thumb: [0.8, 0.86] }) },
      { say: "So did the flat.", key: "flat", amb: [["dust"]], draw: (ctx) => drawFlat(ctx, { expr: "raw", pose: { sit: true, armL: [0.5, -1.0], armR: [0.5, -1.0] } }) },
      { say: "That night she opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I was so busy not thinking about him that I forgot her.", key: "busy forgot her", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(0, C, typed(C.mine, k, 0.05, 0.85)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k, 44) * (k < 0.85), 0.74] }) },
      { say: "It says: the running cost you something this time.", key: "cost", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", H: 3400, y: 960, ...life(t, 2) }) },
      { say: "What were you too busy to feel?", key: "feel", tag: "IT ASKS", sfx: "chime", hold: 0.35, draw: (ctx) => inHand(ctx, BED, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Drive to her mum's tonight,", key: "drive", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BED, VL, VR, false, true) },
      { say: "or send flowers and stay busy.", key: "send", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BED, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BED, VL, VR) },
      { say: "Nineteen days.", key: "nineteen", days: 19, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
