// Episode 9, day 22, "Busy". Path: SORRY won episode 8. Vote: EMPTY (wise) or SPIN (tempting). Distraction begins.
(function (g) {
  const C = { mine: "if i stop, i think about him", reflect: "When you stop, he's there.", askParts: [["What happens ", false], ["in the gap?", true]] };
  const HP = { night: true, y: 790, x: 680, w: 540 };
  const ROWS = [["6:00", "Spin", "#d9643a"], ["8:00", "Work", "#d9b26a"], ["19:00", "Pottery", "#5fa08a"], ["21:00", "Webinar: spreadsheets", "#7a8ad0"], ["Thu 21:40", "Eat", "#8a7a68"]];
  const cal = (hot, rows = ROWS, title = "Today") => (ctx, w, h) => { ctx.fillStyle = "#17120f"; ctx.fillRect(0, 0, w, h); ctx.fillStyle = "#f6ecdc"; ctx.font = `600 ${w * 0.075}px Inter`; ctx.textAlign = "left"; ctx.fillText(title, w * 0.07, h * 0.09);
    rows.forEach(([t, name, col], i) => { const y = h * (0.14 + i * 0.125), on = hot === i || hot === -1; ctx.globalAlpha = on || hot === undefined ? 1 : 0.35; ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(w * 0.06, y, w * 0.88, h * 0.105, w * 0.04); ctx.fill(); ctx.fillStyle = "#17120f"; ctx.font = `600 ${w * 0.05}px Inter`; ctx.fillText(t, w * 0.1, y + h * 0.043); ctx.font = `600 ${w * 0.064}px Inter`; ctx.fillText(name, w * 0.1, y + h * 0.085); ctx.globalAlpha = 1; }); };
  const MONTH = (ctx, w, h) => { ctx.fillStyle = "#17120f"; ctx.fillRect(0, 0, w, h); ctx.fillStyle = "#f6ecdc"; ctx.font = `600 ${w * 0.075}px Inter`; ctx.textAlign = "left"; ctx.fillText("Next month", w * 0.07, h * 0.09); for (let i = 0; i < 35; i++) { const x = w * 0.05 + (i % 5) * w * 0.182, y = h * 0.13 + Math.floor(i / 5) * h * 0.115; ["#d9643a", "#d9b26a", "#5fa08a", "#7a8ad0"].forEach((c, j) => { ctx.fillStyle = c; ctx.fillRect(x, y + j * h * 0.025, w * 0.165, h * 0.021); }); } };
  const book = (hot) => screenList("Booked", [["Spin class", "6:00"], ["Pottery course", "8 weeks"], ["New clients", "3"]], { hot, gap: 0.09 });
  const clay = (ctx, kind, sq = 1) => { soft(ctx, 18, 0.5, () => FLAT(ctx)); zform(ctx, (c) => c.ellipse(540, 1240, 420, 110, 0, 0, 6.3), "#6a5a4e", [120, 1130, 840, 220], { rimW: 6, lo: 0.4 }); ctx.save(); ctx.translate(540, 1200); ctx.scale(1, sq); const CL = "#b98a6a";
    if (kind === "bowl") { zform(ctx, (c) => { c.moveTo(-230, -260); c.quadraticCurveTo(-200, 0, 0, 0); c.quadraticCurveTo(200, 0, 230, -260); c.closePath(); }, CL, [-230, -260, 460, 260], { rimW: 8, lo: 0.4 }); zform(ctx, (c) => c.ellipse(0, -260, 230, 50, 0, 0, 6.3), "#8a6248", [-230, -310, 460, 100], { rimW: 4 }); }
    else zform(ctx, (c) => { c.moveTo(0, 0); c.bezierCurveTo(-420, -230, -220, -520, 0, -330); c.bezierCurveTo(220, -520, 420, -230, 0, 0); c.closePath(); }, CL, [-330, -470, 660, 470], { rimW: 8, lo: 0.4 });
    ctx.restore(); };
  const VL = { word: "EMPTY", sub: "leave one evening empty", color: "#f6ecdc", draw: (c) => heldPhone(c, 230, 400, 300, cal(4, [...ROWS.slice(0, 4), ["Fri 19:00", "(nothing)", "#33291f"]]), { thumbAt: [0.8, 0.7], glow: 0 }) };
  const VR = { word: "SPIN", sub: "add a second spin class", color: "#f0b34a", draw: (c) => heldPhone(c, 230, 400, 300, cal(4, [...ROWS.slice(0, 4), ["Fri 19:00", "Spin (again)", "#d9643a"]]), { thumbAt: [0.8, 0.7], glow: 0 }) };
  g.EP = {
    title: "Busy", daysStart: 22, dignityStart: 24, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara has signed up for a six a.m. spin class,", key: "six spin", sfx: "ding", draw: (ctx) => inHand(ctx, OFFICE, book(0), { thumb: [0.84, 0.2] }) },
      { say: "a pottery course", key: "pottery", sfx: "ding", draw: (ctx) => inHand(ctx, OFFICE, book(1), { thumb: [0.84, 0.29], w: 600, y: 960 }) },
      { say: "and three new clients.", key: "three", sfx: "ding", draw: (ctx) => { cam(ctx, 520, 900, 1.6, () => drawOffice(ctx, { expr: "smile" })); label(ctx, "+3 CLIENTS", 640, 470, { size: 36 }); } },
      { say: "Her ex's wedding is in twenty-two days.", key: "ex's twenty two", draw: (ctx) => inHand(ctx, OFFICE, screenInvite(true), { thumb: [0.84, 0.78] }) },
      { say: "She said yes.", key: "yes", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "frozen", { glow: 0, H: 3000, dim: 0.15, ...life(t) }) },
      { say: "She texted the nice man an apology.", key: "apology", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, OFFICE, screenThread("Sam", k > 0.7 ? [{ t: "sorry. i was a lot.", me: true }] : [], k > 0.7 ? "" : typed("sorry. i was a lot.", k, 0.05, 0.6)), { thumb: [0.86 - tap(k) * (k < 0.6), 0.9] }) },
      { say: "He said no harm done,", key: "harm", sfx: "buzz", draw: (ctx) => inHand(ctx, OFFICE, screenThread("Sam", [{ t: "sorry. i was a lot.", me: true }, { t: "no harm done. honestly.", me: false }, { t: "take care, zara", me: false }], ""), { thumb: [0.9, 0.62], rot: 0.04, x: 620 }) },
      { say: "which was somehow the last straw.", key: "last straw", dignity: 22, sfx: "thud", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "slip", { glow: 0, H: 3500, y: 940, dim: 0.15, ...life(t, 1) }) },
      { say: "So. A new calendar.", key: "calendar", sfx: "whoosh", draw: (ctx) => inHand(ctx, OFFICE, cal(), { thumb: [0.86, 0.9], w: 600, y: 960 }) },
      { say: "Colour coded.", key: "colour", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "plotting", { glow: 0, H: 3000, dim: 0.15, ...life(t, 2) }) },
      { say: "Six, spin.", key: "spin", sfx: "tick", draw: (ctx) => inHand(ctx, OFFICE, cal(0), { thumb: [0.86, 0.2], w: 640, y: 1000 }) },
      { say: "Eight, work.", key: "work", sfx: "tick", draw: (ctx) => inHand(ctx, OFFICE, cal(1), { thumb: [0.86, 0.32], w: 640, y: 1000 }) },
      { say: "Seven, pottery.", key: "pottery", sfx: "tick", draw: (ctx) => inHand(ctx, OFFICE, cal(2), { thumb: [0.86, 0.45], w: 640, y: 1000 }) },
      { say: "Nine, a webinar about spreadsheets.", key: "spreadsheets", sfx: "tick", draw: (ctx) => inHand(ctx, OFFICE, cal(3), { thumb: [0.86, 0.57], w: 640, y: 1000 }) },
      { say: "I'm thriving.", who: "Z", key: "thriving", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "frozen", { glow: 0, H: 3200, y: 950, dim: 0.15, ...life(t), bob: 8 * Math.sin(t * 11) }) },
      { say: "Her best friend asked when she eats.", key: "eats", sfx: "buzz", live: true, draw: (ctx, k) => inHand(ctx, OFFICE, screenThread("Remy", [{ t: "thriving!!", me: true }, { t: "WHEN DO YOU EAT", me: false }].slice(0, k > 0.3 ? 2 : 1), ""), { thumb: [0.9, 0.62], rot: 0.04, x: 620 }) },
      { say: "It was in the calendar.", key: "calendar", draw: (ctx) => inHand(ctx, OFFICE, cal(4), { thumb: [0.86, 0.7], w: 640, y: 1000 }) },
      { say: "Thursday.", key: "thursday", draw: (ctx) => inHand(ctx, OFFICE, cal(4), { thumb: [0.9, 0.8], w: 1000, y: 420, x: 600, rot: 0 }) },
      { say: "At pottery she made a bowl.", key: "bowl", sfx: "whoosh", live: true, amb: [["dust", 200, 400, 700, 700]], draw: (ctx, k) => clay(ctx, "bowl", 0.9 + 0.1 * k) },
      { say: "It came out as a heart.", key: "heart", live: true, draw: (ctx, k) => clay(ctx, "heart", 0.95 + 0.05 * Math.sin(k * 6)) },
      { say: "She flattened it.", key: "flattened", sfx: "thud", live: true, draw: (ctx, k) => clay(ctx, "heart", Math.max(0.08, 1 - k * 3)) },
      { say: "By midnight she was colour coding next month.", key: "midnight", live: true, draw: (ctx, k) => inHand(ctx, BED, MONTH, { night: true, thumb: [0.8, 0.8 - 0.5 * k], w: 600, y: 900 }) },
      { say: "So she opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: if I stop, I think about him.", key: "stop him", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "No advice.", key: "no", live: true, draw: (ctx, k, t) => face(ctx, BED, "neutral", { look: "night", H: 3300, y: 960, ...life(t, 2) }) },
      { say: "It just asks: what happens in the gap?", key: "gap", tag: "IT ASKS", sfx: "chime", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(k < 0.25 ? 2 : 3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "He's in it.", who: "Z", key: "he's", hold: 0.25, live: true, draw: (ctx, k, t) => face(ctx, BED, "raw", { look: "night", H: 3800, y: 930, ...life(t) }) },
      { say: "Leave one evening empty,", key: "empty", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BED, VL, VR, false, true) },
      { say: "or add a second spin class.", key: "spin", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BED, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BED, VL, VR) },
      { say: "Twenty-one days.", key: "twenty one", days: 21, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
