// Episode 19, day 12, "His sister". Path: BOTH won episode 18 (she kept both lists). Vote: HONEST (wise) or PLANNER (tempting). His sister is only ever an email.
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep19.wav exists.
(function (g) {
  const C = { mine: "they're being kind and i hate it", reflect: "Kindness is harder to file than blame.", askParts: [["What would it mean ", false], ["if he wasn't the villain?", true]] };
  const HP = { y: 1000, x: 660, w: 540 };
  const M = { from: "Nell (groom's sister)", subject: "so glad it's you", body: ["Zara! Mum told me you're running the day.", "We are all so relieved.", "He'd never say it, but he trusts you.", "Nell x"] };
  const mail = (ctx, o = {}, p = {}) => inHand(ctx, OFFICE, screenMail(M, o), { thumb: [0.86, 0.7], w: 600, y: 960, ...p });
  const VL = { word: "HONEST", sub: "reply to Nell honestly", color: "#f6ecdc", draw: (c) => heldPhone(c, 230, 400, 300, screenMail({ ...M, body: [] }, { reply: "this is hard for me" }), { thumbAt: [0.86, 0.86], glow: 0 }) };
  const VR = { word: "PLANNER", sub: "reply as the planner", color: "#f0b34a", draw: (c) => heldPhone(c, 230, 400, 300, screenMail({ ...M, body: [] }, { reply: "Warm regards, Zara" }), { thumbAt: [0.86, 0.86], glow: 0 }) };
  g.EP = {
    title: "His sister", daysStart: 12, dignityStart: 14, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara has an email from the groom's sister.", key: "sister", sfx: "ding", draw: (ctx) => mail(ctx, { hot: -1 }) },
      { say: "Subject line: so glad it's you.", key: "glad", draw: (ctx) => mail(ctx, { hot: -1 }, { w: 900, y: 1500, x: 600, rot: 0 }) },
      { say: "The groom is her ex.", key: "ex", sfx: "thud", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "dread", { glow: 0, H: 3200, y: 950, dim: 0.15, ...life(t) }) },
      { say: "The wedding is in twelve days.", key: "twelve", draw: (ctx) => inHand(ctx, OFFICE, screenInvite(true), { thumb: [0.84, 0.78] }) },
      { say: "She said yes, and she is planning it.", key: "yes planning", draw: (ctx) => { drawOffice(ctx, { expr: "frozen" }); label(ctx, "LEAD PLANNER · ALSO A GUEST", 620, 470, { size: 30 }); } },
      { say: "His sister always liked her.", key: "liked", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "smile", { glow: 0, H: 3000, dim: 0.15, ...life(t, 1) }) },
      { say: "His sister does not know that Zara knows that.", key: "knows", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "plotting", { glow: 0, H: 3400, y: 940, dim: 0.15, ...life(t, 2) }) },
      { say: "The email is four lines long.", key: "four", draw: (ctx) => mail(ctx) },
      { say: "It says the family is relieved she is running the day.", key: "relieved", sfx: "tick", draw: (ctx) => mail(ctx, { hot: 1 }, { w: 680, y: 1040, x: 600 }) },
      { say: "It says, he would never say it, but he trusts you.", key: "trusts", sfx: "tick", draw: (ctx) => mail(ctx, { hot: 2 }, { w: 680, y: 1040, x: 600 }) },
      { say: "Well, that's worse.", who: "Z", key: "worse", dignity: 13, live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "slip", { glow: 0, H: 3300, y: 950, dim: 0.15, ...life(t) }) },
      { say: "She had two lists ready.", key: "two", draw: (ctx) => paper(ctx, OFFICE, "THE LISTS", [["HIM", "40 items"], ["ME", "3 items"]], -1, { size: 90, gap: 260 }) },
      { say: "Neither had a line for this.", key: "neither", draw: (ctx) => paper(ctx, OFFICE, "THE LISTS", [["HIM", "40 items"], ["ME", "3 items"], ["KIND SISTER", "?"]], 2, { size: 90, gap: 260 }) },
      { say: "She typed a reply. Warm regards.", key: "warm", sfx: "type", live: true, draw: (ctx, k) => mail(ctx, { hot: -1, reply: typed("Warm regards,", k, 0.2, 0.8) }, { thumb: [0.86, 0.6 - tap(k) * 0.3], y: 720 }) },
      { say: "Deleted it.", key: "deleted", live: true, draw: (ctx, k) => mail(ctx, { hot: -1, reply: "Warm regards,".slice(0, Math.max(0, Math.round(13 * (1 - k * 1.5)))) }, { thumb: [0.86, 0.6], y: 720 }) },
      { say: "Typed, thank you.", key: "thank", sfx: "type", live: true, draw: (ctx, k) => mail(ctx, { hot: -1, reply: typed("Thank you.", k, 0.1, 0.8) }, { thumb: [0.86, 0.6 - tap(k) * 0.3], y: 720 }) },
      { say: "Deleted that.", key: "deleted", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "raw", { glow: 0, H: 3600, y: 940, dim: 0.15, ...life(t, 1) }) },
      { say: "She opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, OFFICE, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: they're being kind and I hate it.", key: "kind hate", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, OFFICE, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 900, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "It says: kindness is harder to file than blame.", key: "kindness blame", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, OFFICE, screenStage(2, C), { ...HP, w: 580, y: 880, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, OFFICE, "caught", { glow: 0, H: 3200, y: 960, dim: 0.15, ...life(t, 2) }) },
      { say: "What would it mean if he wasn't the villain?", key: "villain", tag: "IT ASKS", sfx: "chime", hold: 0.3, draw: (ctx) => inHand(ctx, OFFICE, screenStage(3, C), { ...HP, w: 600, y: 900, thumb: [0.9, 0.8] }) },
      { say: "Reply to his sister honestly,", key: "honestly", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, OFFICE, VL, VR, false, true) },
      { say: "or reply as the planner.", key: "planner", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, OFFICE, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, OFFICE, VL, VR) },
      { say: "Eleven days.", key: "eleven", days: 11, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, OFFICE, screenInvite(true), { thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
