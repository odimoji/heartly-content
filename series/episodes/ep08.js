// Episode 8, day 23, "The date". Path: DINNER won episode 7. Vote: SORRY (wise) or MILES (tempting). The date is never shown: his glass, his olives.
(function (g) {
  const D = { look: "dress" };
  const C = { mine: "i talked about him for 40 minutes", reflect: "Forty minutes, to a stranger, and it still wasn't finished.", askParts: [["What did you want ", false], ["the stranger to say?", true]] };
  const HP = { y: 790, x: 680, w: 540, sleeve: null };
  const CAB = (ctx) => { const b = ctx.createLinearGradient(0, 0, 0, 1920); b.addColorStop(0, "#0e1320"); b.addColorStop(1, "#1a1218"); ctx.fillStyle = b; ctx.fillRect(0, 0, 1080, 1920); for (let i = 0; i < 26; i++) { ctx.fillStyle = ["rgba(255,190,110,.5)", "rgba(255,90,80,.4)", "rgba(150,190,255,.45)"][i % 3]; ctx.beginPath(); ctx.arc((i * 211) % 1080, 200 + (i * 137) % 1100, 30 + (i % 4) * 16, 0, 6.3); ctx.fill(); } };
  const his = (c, fill = 0.5, n = 6) => { glass(c, 300, 1560, 1.5, "#d9b26a", fill); zform(c, (k) => { k.moveTo(430, 1500); k.quadraticCurveTo(540, 1600, 650, 1500); k.closePath(); }, "#e9dcc6", [430, 1500, 220, 60], { rimW: 4 }); for (let i = 0; i < n; i++) zform(c, (k) => k.ellipse(470 + (i % 4) * 46, 1492 - Math.floor(i / 4) * 22, 22, 17, 0, 0, 6.3), "#6f8a3a", [448 + (i % 4) * 46, 1475 - Math.floor(i / 4) * 22, 44, 34], { rimW: 2 }); };
  const bar = (ctx, expr, o = {}) => drawBar(ctx, { expr, zx: 180, pose: { ...D, armL: [0.2, -1.6], armR: [0.3, -0.3], ...(o.pose || {}) }, after: (c) => { his(c, o.fill, o.olives); glass(c, 830, 1560, 1.5, "#8c2f3a", o.hers ?? 0.5); } });
  const bf = (ctx, expr, t, n, o = {}) => face(ctx, BAR, expr, { ...D, glow: 0, H: 2700, dim: 0.2, ...life(t, n), ...o });
  const card = (ctx, fn, tag) => { soft(ctx, 18, 0.55, () => BAR(ctx)); ctx.save(); ctx.translate(540, 900); ctx.rotate(-0.04); ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.fillRect(-330 + 16, -400 + 20, 660, 800); ctx.fillStyle = "#fbf4e8"; ctx.fillRect(-330, -400, 660, 800); ctx.save(); ctx.translate(-290, -360); ctx.beginPath(); ctx.rect(0, 0, 580, 580); ctx.clip(); fn(ctx, 580, 580); ctx.restore(); ctx.fillStyle = "#1c1210"; ctx.font = "italic 600 78px Cormorant"; ctx.textAlign = "center"; ctx.fillText(tag, 0, 330); ctx.restore(); };
  const carpark = (c, w, h) => { c.fillStyle = "#5a5d66"; c.fillRect(0, 0, w, h); c.strokeStyle = "#f3ead8"; c.lineWidth = 10; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(40 + i * 125, h * 0.45); c.lineTo(40 + i * 125, h); c.stroke(); } c.fillStyle = "#2a6ad0"; c.fillRect(w * 0.38, h * 0.08, w * 0.24, h * 0.26); c.fillStyle = "#ffffff"; c.font = `600 ${h * 0.22}px Inter`; c.textAlign = "center"; c.fillText("P", w * 0.5, h * 0.29); };
  const T = (name, typing, bubbles = []) => screenThread(name, bubbles, typing);
  const VL = { word: "SORRY", sub: "text the nice man an apology", color: "#f6ecdc", draw: (c) => heldPhone(c, 230, 400, 300, T("Sam", "sorry about tonight", [{ t: "table at 8", me: false }]), { thumbAt: [0.86, 0.86], glow: 0 }) };
  const VR = { word: "MILES", sub: "text her ex", color: "#f0b34a", draw: (c) => heldPhone(c, 230, 400, 300, T("Miles", "funny story", [{ t: "happy birthday x", me: false }, { t: "thanks!", me: true }]), { thumbAt: [0.86, 0.86], glow: 0 }) };
  g.EP = {
    title: "The date", daysStart: 23, dignityStart: 28, hudTitle: "HER EX'S WEDDING",
    shots: [
      { say: "Zara is on a date,", key: "date", sfx: "ding", amb: [["candle", 560, 1440]], draw: (ctx) => bar(ctx, "smile") },
      { say: "in the bar from Friday,", key: "friday", amb: [["candle", 300, 1100]], draw: (ctx) => { cam(ctx, 600, 1180, 1.45, () => bar(ctx, "smile")); label(ctx, "SAME BAR · SAME STOOL", 620, 470, { size: 30 }); } },
      { say: "talking about her ex.", key: "ex", live: true, draw: (ctx, k, t) => bf(ctx, "frozen", t, 0, { bob: 10 * Math.sin(t * 9) }) },
      { say: "His wedding is in twenty-three days.", key: "twenty three", draw: (ctx) => inHand(ctx, BAR, screenInvite(true), { sleeve: null, thumb: [0.84, 0.78] }) },
      { say: "She said yes.", key: "yes", live: true, draw: (ctx, k, t) => bf(ctx, "dread", t, 1, { H: 3200, y: 950 }) },
      { say: "Tonight was meant to be the fix.", key: "fix", draw: (ctx) => inHand(ctx, BAR, T("Sam", "", [{ t: "dinner thursday?", me: false }, { t: "yes. 8.", me: true }, { t: "i'll be the nervous one", me: false }]), { sleeve: null, thumb: [0.9, 0.62], rot: 0.04, x: 620 }) },
      { say: "The man is nice.", key: "nice", amb: [["candle", 880, 1250]], draw: (ctx) => { cam(ctx, 430, 1420, 2.1, () => drawBar(ctx, { zara: false, after: (c) => his(c, 0.6, 6) })); label(ctx, "SAM", 560, 520, { size: 34 }); } },
      { say: "He asked one question.", key: "one", live: true, draw: (ctx, k, t) => bf(ctx, "smile", t, 2) },
      { say: "What do you do?", key: "do", draw: (ctx) => { soft(ctx, 18, 0.5, () => BAR(ctx)); ctx.fillStyle = "#f6ecdc"; ctx.beginPath(); ctx.roundRect(110, 700, 780, 300, 80); ctx.fill(); ctx.beginPath(); ctx.moveTo(200, 990); ctx.lineTo(140, 1120); ctx.lineTo(320, 990); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#1c1210"; ctx.font = "600 70px Inter"; ctx.textAlign = "center"; ctx.fillText("so what do you do?", 500, 875); } },
      { say: "Weddings, she said.", key: "weddings", live: true, draw: (ctx, k, t) => bf(ctx, "smile", t, 0, { H: 3000, tilt: 0.04 }) },
      { say: "And then.", key: "then", live: true, draw: (ctx, k, t) => bf(ctx, "caught", t, 1, { H: 3500, y: 940 }) },
      { say: "Funny story, actually.", who: "Z", key: "funny", live: true, draw: (ctx, k, t) => bf(ctx, "frozen", t, 0, { H: 3000, bob: 10 * Math.sin(t * 9) }) },
      { say: "The funny story lasted forty minutes.", key: "forty", sfx: "tick", live: true, amb: [["candle", 560, 1440]], draw: (ctx, k) => { const m = 20 + Math.round(k * 40); bar(ctx, "frozen", { fill: 0.6 - 0.55 * k, hers: 0.5 - 0.45 * k, olives: Math.round(6 - 5 * k), pose: { armL: [0.6, -2.4 + 0.5 * Math.sin(k * 30)], armR: [0.7, -2.6 + 0.5 * Math.cos(k * 26)] } }); label(ctx, (m >= 60 ? "9:" + String(m - 60).padStart(2, "0") : "8:" + m) + " PM", 640, 470, { size: 40 }); } },
      { say: "The car park.", key: "car park", sfx: "whoosh", draw: (ctx) => card(ctx, carpark, "the car park") },
      { say: "The hoodie.", key: "hoodie", sfx: "whoosh", draw: (ctx) => card(ctx, (c, w, h) => { c.fillStyle = "#d9cbb8"; c.fillRect(0, 0, w, h); hoodie(c, w / 2, h * 0.52, 0.95); }, "the hoodie") },
      { say: "The cake.", key: "cake", sfx: "whoosh", draw: (ctx) => card(ctx, PICS.cake, "the cake") },
      { say: "Lemon.", key: "lemon", live: true, draw: (ctx, k, t) => bf(ctx, "slip", t, 0, { H: 3400, y: 940 }) },
      { say: "He nodded in the right places.", key: "nodded", live: true, amb: [["candle", 880, 1250]], draw: (ctx, k) => cam(ctx, 430, 1420 + 14 * Math.sin(k * 16), 2.1, () => drawBar(ctx, { zara: false, after: (c) => his(c, 0.3, 4) })) },
      { say: "He ordered olives.", key: "olives", sfx: "ding", draw: (ctx) => cam(ctx, 540, 1480, 3.0, () => drawBar(ctx, { zara: false, after: (c) => his(c, 0.1, 8) })) },
      { say: "At minute forty-one he asked if she was all right.", key: "forty one right", dignity: 24, sfx: "thud", live: true, draw: (ctx, k, t) => { bf(ctx, "caught", t, 1, { H: 3000 }); label(ctx, "MINUTE 41", 640, 420, { size: 38 }); } },
      { say: "On the way home she opens the app.", key: "home app", sfx: "chime", amb: [["blink", 0, 150, 1080, 1100]], draw: (ctx) => inHand(ctx, CAB, screenStage(0, C), { ...HP, thumb: [0.6, 0.9], rot: 0.04 }) },
      { say: "She writes: I talked about him for forty minutes.", key: "talked forty", tag: "SHE WRITES", sfx: "type", live: true, amb: [["blink", 0, 150, 1080, 1100]], draw: (ctx, k) => inHand(ctx, CAB, screenStage(0, C, typed(C.mine, k, 0.08, 0.8)), { ...HP, w: 600, y: 840, thumb: [0.7 - tap(k) * (k < 0.8), 0.74] }) },
      { say: "It says: forty minutes, to a stranger,", key: "stranger", tag: "IT REPLIES", sfx: "chime", amb: [["blink", 0, 150, 1080, 1100]], draw: (ctx) => inHand(ctx, CAB, screenStage(2, C), { ...HP, w: 580, y: 820, thumb: [0.9, 0.8] }) },
      { say: "and it still wasn't finished.", key: "finished", tag: "IT REPLIES", amb: [["blink", 0, 150, 1080, 1100]], draw: (ctx) => inHand(ctx, CAB, screenStage(2, C), { ...HP, w: 760, y: 1120, x: 600, thumb: [0.9, 0.8] }) },
      { say: "Then one question.", key: "one", live: true, amb: [["blink", 0, 150, 1080, 300]], draw: (ctx, k, t) => face(ctx, CAB, "caught", { ...D, glow: 1, H: 3400, y: 960, ...life(t, 2) }) },
      { say: "What did you want the stranger to say?", key: "stranger say", tag: "IT ASKS", sfx: "chime", amb: [["blink", 0, 150, 1080, 1100]], draw: (ctx) => inHand(ctx, CAB, screenStage(3, C), { ...HP, w: 600, y: 840, thumb: [0.9, 0.8] }) },
      { say: "That it makes sense.", who: "Z", key: "sense", hold: 0.25, live: true, draw: (ctx, k, t) => face(ctx, CAB, "raw", { ...D, glow: 1, H: 3800, y: 930, ...life(t) }) },
      { say: "Text the nice man an apology,", key: "apology", capY: 1500, sfx: "whoosh", draw: (ctx) => vote(ctx, CAB, VL, VR, false, true) },
      { say: "or text her ex.", key: "ex", capY: 1500, sfx: "thud", draw: (ctx) => vote(ctx, CAB, VL, VR, true, false) },
      { say: "What would you do?", key: "you", capY: 1500, hold: 1.0, sfx: "vote", draw: (ctx) => vote(ctx, CAB, VL, VR) },
      { say: "Twenty-two days.", key: "twenty two", days: 22, hold: 0.9, sfx: "flip", draw: (ctx) => inHand(ctx, CAB, screenInvite(true), { sleeve: null, night: true, thumb: [0.84, 0.78] }) },
    ],
  };
})(globalThis);
