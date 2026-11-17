// Episode 26, day 5, "Nine seconds". Path: SLEEP won episode 25 (she did not send it). Vote: AGAIN (tempting: rehearse it once more) or LEAVE (wise: leave it alone now).
// Miles is never shown: the imagined moment is a lapel, a flower and her hands.
// VOICE NOT RECORDED YET (ElevenLabs credits ran out). Everything else is built: run plan.py for stills now, build.py + render.mjs once audio/ep26.wav exists.
(function (g) {
  const C = { mine: "the worst part is nine seconds long", reflect: "You walked all the way through it and came out the other side.", askParts: [["What is ", false], ["on the other side?", true]] };
  const HP = { night: true, sleeve: null, y: 790, x: 680, w: 540 };
  // the imagined moment, as a thought: his lapel, the buttonhole, her hand. pin 0..1 brings the flower in; back moves her hand away
  const lapel = (ctx, pin = 1, back = 0) => { const b = ctx.createLinearGradient(0, 0, 0, 1920); b.addColorStop(0, "#f3d9b8"); b.addColorStop(1, "#c98a6a"); ctx.fillStyle = b; ctx.fillRect(0, 0, 1080, 1920); zform(ctx, (c) => c.roundRect(60, 200, 960, 1800, 200), "#1f2a4a", [60, 200, 960, 1800], { rimW: 10, lo: 0.4 }); zform(ctx, (c) => { c.moveTo(440, 200); c.lineTo(640, 200); c.lineTo(540, 900); c.closePath(); }, "#f3ead8", [440, 200, 200, 700], { rimW: 0 }); zform(ctx, (c) => { c.moveTo(640, 200); c.lineTo(860, 200); c.lineTo(600, 1050); c.lineTo(540, 900); c.closePath(); }, "#28365c", [540, 200, 320, 850], { rimW: 6, lo: 0.3 });
    if (pin > 0) { ctx.save(); ctx.globalAlpha = Math.min(1, pin * 2); [[0, -46], [44, -14], [28, 38], [-28, 38], [-44, -14]].forEach(([dx, dy]) => zform(ctx, (c) => c.ellipse(740 + dx, 760 + dy, 34, 34, 0, 0, 6.3), "#f6ecdc", [706 + dx, 726 + dy, 68, 68], { rimW: 3 })); zform(ctx, (c) => c.ellipse(740, 760, 20, 20, 0, 0, 6.3), "#f0cc72", [720, 740, 40, 40], { rimW: 0 }); ctx.strokeStyle = "#4a7a4a"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(740, 800); ctx.lineTo(720, 900); ctx.stroke(); ctx.restore(); }
    const hx = 860 + 260 * back, hy = 900 + 200 * back; zform(ctx, (c) => c.roundRect(hx, hy, 420, 150, 70), ZC.skin, [hx, hy, 420, 150], { rimW: 6, lo: 0.3 }); [0, 1, 2].forEach((i) => zform(ctx, (c) => c.roundRect(hx - 90, hy - 10 + i * 50, 150, 44, 22), ZC.skin, [hx - 90, hy - 10 + i * 50, 150, 44], { rimW: 3 }));
    ctx.save(); ctx.fillStyle = "#fff8ec"; ctx.filter = "blur(8px)"; for (let i = 0; i < 40; i++) { const t = i / 40 * 6.283; ctx.beginPath(); ctx.arc(540 + Math.cos(t) * 640, 960 + Math.sin(t) * 1080, 190 + 40 * Math.sin(i * 2.3), 0, 6.3); ctx.fill(); } ctx.restore(); };
  const VL = { word: "AGAIN", sub: "rehearse it once more", color: "#f0b34a", draw: (c) => drawZara(c, 250, 1320, 1150, "dread", { look: "night" }) };
  const VR = { word: "LEAVE", sub: "leave it alone now", color: "#f6ecdc", draw: (c) => drawZara(c, 250, 1320, 1150, "smile", { look: "night" }) };
  g.EP = {
    title: "Nine seconds", daysStart: 5, dignityStart: 10, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara did not send the text.", key: "not", sfx: "ding", draw: (ctx) => inHand(ctx, BED, screenThread("Mrs Finch", [], "", { label: "DRAFTS: DELETED" }), { night: true, sleeve: null, thumb: [0.86, 0.9] }) },
      { say: "She slept on it.", key: "slept", live: true, draw: (ctx, k) => cam(ctx, 420, 1130, 1.45, () => drawBedroom(ctx, { expr: "neutral", time: k > 0.5 ? "7:01" : "7:00" })) },
      { say: "Then she did something braver.", key: "braver", live: true, draw: (ctx, k, t) => face(ctx, BED, "plotting", { look: "night", glow: 0, H: 3200, y: 950, ...life(t) }) },
      { say: "She pictured the worst moment of her ex's wedding, on purpose.", key: "worst ex's", sfx: "whoosh", live: true, draw: (ctx, k) => lapel(ctx, 0, 1 - k) },
      { say: "Five days away. She said yes.", key: "five yes", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, sleeve: null, thumb: [0.84, 0.78] }) },
      { say: "The worst moment is not the vows.", key: "vows", sfx: "tick", draw: (ctx) => paper(ctx, BED, "RUN SHEET · MILES & IVY", [["18", "the vows"], ["22", "the first dance"], ["14", "the buttonhole"]], 0, { size: 60, gap: 230 }) },
      { say: "It is not the first dance.", key: "dance", sfx: "tick", draw: (ctx) => paper(ctx, BED, "RUN SHEET · MILES & IVY", [["18", "the vows"], ["22", "the first dance"], ["14", "the buttonhole"]], 1, { size: 60, gap: 230 }) },
      { say: "It is the buttonhole.", key: "buttonhole", sfx: "thud", draw: (ctx) => paper(ctx, BED, "RUN SHEET · MILES & IVY", [["18", "the vows"], ["22", "the first dance"], ["14", "the buttonhole"]], 2, { size: 60, gap: 230 }) },
      { say: "Him looking down. Her looking up.", key: "up", live: true, draw: (ctx, k, t) => face(ctx, BED, "raw", { look: "day", hair: "low", glow: 0, H: 3300, y: 1000, tilt: -0.05, dim: 0.5, ...life(t, 1) }) },
      { say: "Nobody else in the room.", key: "nobody", draw: (ctx) => lapel(ctx, 0, 0.3) },
      { say: "She ran it in her head, like a rehearsal.", key: "rehearsal", live: true, draw: (ctx, k, t) => face(ctx, BED, "neutral", { look: "night", glow: 0, H: 3000, ...life(t, 2) }) },
      { say: "She has run two hundred rehearsals.", key: "two hundred", draw: (ctx) => cam(ctx, 520, 900, 1.6, () => drawOffice(ctx, { expr: "smile" })) },
      { say: "He says, thanks for doing this.", key: "thanks", sfx: "tick", draw: (ctx) => lapel(ctx, 0, 0.15) },
      { say: "She says, of course.", key: "course", sfx: "tick", live: true, draw: (ctx, k, t) => face(ctx, BED, "smile", { look: "day", hair: "low", glow: 0, H: 3300, y: 1000, dim: 0.5, ...life(t) }) },
      { say: "She pins the flower.", key: "pins", sfx: "tick", live: true, draw: (ctx, k) => lapel(ctx, Math.min(1, k * 2), 0) },
      { say: "She steps back.", key: "back", sfx: "tick", live: true, draw: (ctx, k) => lapel(ctx, 1, k) },
      { say: "That's it?", who: "Z", key: "it", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", glow: 0, H: 3200, y: 950, ...life(t) }) },
      { say: "She timed it. Nine seconds.", key: "nine", sfx: "ding", draw: (ctx) => inHand(ctx, BED, screenAlarm("0:09", "the worst part"), { night: true, sleeve: null, thumb: [0.84, 0.8], w: 620, y: 940 }) },
      { say: "She has been dreading nine seconds for twenty-five days.", key: "twenty five", dignity: 24, live: true, draw: (ctx, k, t) => face(ctx, BED, "smile", { look: "night", glow: 0, H: 3000, blink: k > 0.5 ? 1 : 0, bob: 14 * Math.sin(t * 13) * (k > 0.5), sway: 0 }) },
      { say: "She opens the app.", key: "app", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: the worst part is nine seconds long.", key: "nine", tag: "SHE WRITES", sfx: "type", live: true, draw: (ctx, k) => inHand(ctx, BED, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "It says: you walked all the way through it and came out the other side.", key: "through side", tag: "IT REPLIES", sfx: "chime", draw: (ctx) => inHand(ctx, BED, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, draw: (ctx, k, t) => face(ctx, BED, "caught", { look: "night", H: 3400, y: 960, ...life(t, 2) }) },
      { say: "What is on the other side?", key: "other", tag: "IT ASKS", sfx: "chime", hold: 0.3, draw: (ctx) => inHand(ctx, BED, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "Rehearse it once more,", key: "more", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, BED, VL, VR, false, true) },
      { say: "or leave it alone now.", key: "leave", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, BED, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, BED, VL, VR) },
      { say: "Four days.", key: "four", days: 4, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, BED, screenInvite(true), { night: true, sleeve: null, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
