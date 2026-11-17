// Episode 18, day 13, "Her half". Path: SEND won episode 17 (she sent Remy the list). Vote: BOTH (wise: keep both lists) or DELETE (tempting: delete his).
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep18.wav exists.
(function (g) {
  const C = { mine: "some of it was me", reflect: "Three items, and they cost more than his forty.", askParts: [["What changes ", false], ["if it was both of you?", true]] };
  const HP = { night: true, y: 790, x: 680, w: 540 };
  const SEAT = () => 1400 + zSitLift() * 780 + 44;
  const two = (ctx, ze, re) => cam(ctx, 560, 1080, 1.6, () => drawFlat(ctx, { expr: ze, zx: 130, pose: { sit: true, armL: [0.3, -1.3], armR: [0.3, -1.3] }, after: (c) => remy(c, 390, SEAT(), 780, re, { sit: true, armL: [0.3, -1.5], armR: [0.3, -1.5] }) }));
  const H = (rows, hot) => (ctx) => paper(ctx, FLAT, "HER HALF", rows, hot, { size: 54, gap: 230 });
  const R1 = ["1", "stopped asking about his day"], R2 = ["2", "booked a holiday instead"], R3 = ["3", "said \"fine, go.\""];
  const VL = { word: "BOTH", sub: "keep both lists", color: "#f6ecdc", draw: (c) => { [[90, "#fbf4e8"], [270, "#f3e6d2"]].forEach(([x, col], i) => { zform(c, (k) => k.roundRect(x, 240 + i * 30, 170, 330, 6), col, [x, 240 + i * 30, 170, 330], { rimW: 4, lo: 0.2 }); c.fillStyle = i ? "#c0452f" : "#1c1210"; c.font = "600 34px Inter"; c.textAlign = "center"; c.fillText(i ? "ME: 3" : "HIM: 40", x + 85, 300 + i * 30); }); } };
  const VR = { word: "DELETE", sub: "delete his list", color: "#f0b34a", draw: (c) => heldPhone(c, 230, 400, 300, screenList("EVERYTHING HE DID", ["Open", "Share", "Rename", "Delete"], { hot: 3, red: true }), { thumbAt: [0.8, 0.42], glow: 0 }) };
  g.EP = {
    title: "Her half", daysStart: 13, dignityStart: 9, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara sent her best friend a forty item list about her ex.", key: "forty ex", sfx: "ding", draw: (ctx) => inHand(ctx, FLAT, screenThread("Remy", [{ t: "40 items. with a pie chart.", me: true }], ""), { thumb: [0.9, 0.62], rot: 0.04, x: 620 }) },
      { say: "Remy sent back one question.", key: "one", sfx: "buzz", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "caught", { glow: 0, H: 2900, ...life(t) }) },
      { say: "Where is your half?", key: "half", sfx: "buzz", draw: (ctx) => inHand(ctx, FLAT, screenThread("Remy", [{ t: "40 items. with a pie chart.", me: true }, { t: "WHERE IS YOUR HALF", me: false }], ""), { thumb: [0.9, 0.62], rot: 0.04, x: 600, w: 640, y: 1040 }) },
      { say: "His wedding is in thirteen days.", key: "thirteen", draw: (ctx) => inHand(ctx, FLAT, screenInvite(true), { thumb: [0.84, 0.78] }) },
      { say: "She said yes, and until tonight it was entirely his fault.", key: "yes fault", live: true, amb: [["tv", 0.16]], draw: (ctx, k, t) => face(ctx, FLAT, "frozen", { glow: 0, H: 3200, y: 950, ...life(t, 1) }) },
      { say: "Remy came round with wine and a pen.", key: "pen", sfx: "thud", live: true, draw: (ctx, k, t) => { face(ctx, FLAT, "plotting", { who: remy, glow: 0, H: 2500, ...life(t) }); label(ctx, "REMY · BEST FRIEND", 640, 420, { size: 32 }); } },
      { say: "I don't have a half.", who: "Z", key: "half", live: true, amb: [["tv", 0.16]], draw: (ctx, k, t) => face(ctx, FLAT, "frozen", { glow: 0, H: 3100, y: 950, ...life(t), bob: 8 * Math.sin(t * 11) }) },
      { say: "Remy wrote the number one, and waited.", key: "one", draw: H([["1", ""]], 0) },
      { say: "It took eleven minutes.", key: "eleven", amb: [["tv", 0.2], ["dust"]], draw: (ctx) => two(ctx, "dread", "neutral") },
      { say: "One. She stopped asking how his day was.", key: "stopped", sfx: "tick", draw: H([R1], 0) },
      { say: "Somewhere in year two.", key: "two", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "raw", { glow: 0, H: 3300, y: 950, ...life(t, 2) }) },
      { say: "Two. She knew it was ending, and booked a holiday instead of saying so.", key: "holiday", sfx: "tick", draw: H([R1, R2], 1) },
      { say: "Three took longer.", key: "three", amb: [["tv", 0.2]], draw: (ctx) => two(ctx, "raw", "neutral") },
      { say: "Three was the car park.", key: "car park", sfx: "tick", draw: H([R1, R2, ["3", "the car park"]], 2) },
      { say: "She was the one who said, fine, go.", key: "fine go", dignity: 14, sfx: "thud", draw: H([R1, R2, R3], 2) },
      { say: "Remy did not say I told you so.", key: "not", live: true, draw: (ctx, k, t) => face(ctx, FLAT, "smile", { who: remy, glow: 0, H: 2800, ...life(t, 1) }) },
      { say: "Remy topped up the glass.", key: "glass", live: true, draw: (ctx, k) => { soft(ctx, 18, 0.5, () => FLAT(ctx)); glass(ctx, 540, 1350, 3.2, "#8c2f3a", 0.2 + 0.5 * k); } },
      { say: "That night she opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: some of it was me.", key: "me", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "It says: three items, and they cost more than his forty.", key: "cost", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", H: 3400, y: 960, ...life(t, 2) }) },
      { say: "What changes if it was both of you?", key: "both", tag: "IT ASKS", sfx: "chime", hold: 0.3, draw: (ctx) => inHand(ctx, BED, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Keep both lists,", key: "both", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BED, VL, VR, false, true) },
      { say: "or delete his.", key: "delete", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BED, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BED, VL, VR) },
      { say: "Twelve days.", key: "twelve", days: 12, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
