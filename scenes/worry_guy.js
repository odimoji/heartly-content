// Series A (story), "her little guy called worry": worry as a scribbly creature that follows her
// everywhere and grows, until 3am he gives a presentation. She writes down what he says in Heartly;
// none of it is happening; he shrinks to pocket size. (Experiment: a recurring creature character.)
const WORRY = '#6E6A73';
function worry(x, g, r, t, ink, look = -1, talk = 0) {
  const by = g - 22 - r, bob = Math.sin(t * 6) * r * .04;
  // legs
  wline([[x - r * .35, by + r * .8], [x - r * .38, g]], 1, Math.max(4, r * .07), ink);
  wline([[x + r * .35, by + r * .8], [x + r * .38, g]], 1, Math.max(4, r * .07), ink);
  cx.fillStyle = WORRY; cx.beginPath(); cx.arc(x, by + bob, r, 0, 6.29); cx.fill();
  // scribble fuzz
  const pts = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * 6.29, rr = r * (1 + .12 * Math.sin(i * 2.7 + t * 4)); pts.push([x + Math.cos(a) * rr, by + bob + Math.sin(a) * rr]); }
  wline(pts, r * .05, Math.max(4, r * .06), ink);
  // eyes
  const er = r * .22, ex = r * .3;
  for (const s of [-1, 1]) {
    cx.fillStyle = '#FFFDF6'; cx.beginPath(); cx.arc(x + s * ex, by + bob - r * .15, er, 0, 6.29); cx.fill();
    cx.fillStyle = C.INK; cx.beginPath(); cx.arc(x + s * ex + look * er * .4, by + bob - r * .15, er * .5, 0, 6.29); cx.fill();
  }
  if (talk > 0) { const m = Math.abs(Math.sin(t * 14)) * r * .12 + 3; cx.fillStyle = C.INK; cx.beginPath(); cx.ellipse(x, by + bob + r * .35, r * .15, m, 0, 0, 6.29); cx.fill(); }
  return { top: by - r, cx: x, cy: by };
}
function whisper(x, y, msg, k, col = C.INK, z = 1.2) { // small speech note, given in world coords of a camOn(z) scene
  if (k <= 0) return; x = 540 + (x - 540) * z; y = 1400 + (y - 1400) * z; text(msg, Math.min(x, 700), y, 58, Math.min(1, k * 2), 'Caveat', 700, col);
}
function flipchart(x, y, ink, crossed) { // y = top of chart
  wline([[x - 140, y + 520], [x, y - 20], [x + 140, y + 520]], 1, 6, ink);
  cx.fillStyle = '#FFFDF6'; cx.fillRect(x - 170, y, 340, 360); wline([[x - 170, y], [x + 170, y], [x + 170, y + 360], [x - 170, y + 360], [x - 170, y]], 1, 5, C.INK);
  text('what if:', x - 140, y + 60, 50, 1, 'Caveat', 700, C.EMBER, 'left');
  const items = ['1. you get fired', '2. that mole', '3. everyone’s', '    annoyed w/ you'];
  items.forEach((s, i) => text(s, x - 140, y + 125 + i * 56, 42, 1, 'Caveat', 700, C.INK, 'left'));
  const rows = [[y + 125, 230], [y + 181, 200], [y + 237, 230]];
  rows.forEach(([yy, w], i) => { if (crossed[i] > 0) wline([[x - 145, yy + 4], [x - 145 + w * crossed[i], yy + 4]], 1, 7, '#C0392B'); });
  if (crossed[2] > 0) wline([[x - 120, y + 297], [x - 120 + 220 * crossed[2], y + 297]], 1, 7, '#C0392B');
}
window.SCENE = {
  duration: 19.5,
  render(t) {
    boil(t);
    const night = (t >= 9.0 && t < 12.0) || (t >= 15.8 && t < 17.6);
    const ink = night ? C.CREAM : C.INK;
    paper(night ? C.NIGHT : C.PAPER, night ? 'rgba(241,230,214,.025)' : undefined);
    let caps = [];
    const G = 1400;
    if (t < 3.4) { // S1 walking, little guy follows
      caps = [[-1, 3.3, 'she has a little guy.\nhis name is worry.']];
      camOn(1.2, 540, 1400);
      wline([[40, G], [1040, G]], 1.8, 5, ink);
      const fx = 560 + Math.sin(t * .8) * 10;
      figure(fx, 0, t * 7, 0, false, G, ink);
      worry(fx - 230, G, 46 + t * 3, t, ink, 1, 0);
      // scrolling pavement marks for walking
      for (let i = 0; i < 6; i++) { const x = ((i * 200 - t * 220) % 1200 + 1200) % 1200 - 60; wline([[x, G + 30], [x + 60, G + 30]], .6, 4, ink); }
      camOff();
    } else if (t < 6.4) { // S2 work
      caps = [[3.5, 6.3, 'he comes to work.']];
      camOn(1.2, 540, 1400);
      wline([[40, G], [1040, G]], 1.8, 5, ink);
      // desk
      wline([[320, 1170], [900, 1170]], 1, 7, ink); wline([[360, 1170], [360, G]], 1, 6, ink); wline([[860, 1170], [860, G]], 1, 6, ink);
      wline([[520, 1168], [700, 1168], [730, 1020], [560, 1020], [520, 1168]], 1, 5, ink);
      // chair + her
      wline([[150, G], [170, 1240], [300, 1240], [310, G]], 1, 5, ink); wline([[170, 1240], [150, 1000]], 1, 5, ink);
      figure(220, 1, 0, 0, true, 1240, ink, [[520, 1160], [560, 1150]]);
      const w = worry(780, 1170, 62, t, ink, -1, t > 4.0 ? 1 : 0);
      camOff();
      whisper(760, w.top - 50, 'they hated that email.', seg(t, 4.0, 4.3));
    } else if (t < 9.0) { // S3 brunch
      caps = [[6.5, 8.9, 'he comes to brunch.']];
      camOn(1.2, 540, 1400);
      wline([[40, G], [1040, G]], 1.8, 5, ink);
      // table with two cups
      wline([[340, 1180], [650, 1180]], 1, 7, ink); wline([[495, 1180], [495, G]], 1, 7, ink); wline([[415, G], [575, G]], 1, 7, ink);
      for (const cxp of [430, 580]) { wline([[cxp - 30, 1180], [cxp - 26, 1130], [cxp + 26, 1130], [cxp + 30, 1180]], .6, 5, ink); wline([[cxp + 28, 1145], [cxp + 46, 1152], [cxp + 28, 1165]], .4, 4, ink); }
      figure(240, 1, 0, 0, false, 1260, ink, [[390, 1150], [410, 1160]]);
      wline([[170, G], [190, 1260], [310, 1260], [320, G]], 1, 5, ink);
      const w = worry(765, G, 100, t, ink, -1, t > 7.0 ? 1 : 0);
      camOff();
      whisper(620, w.top - 140, 'you’re talking too much.', seg(t, 7.0, 7.3));
    } else if (t < 12.0) { // S4 3am presentation
      caps = [[9.1, 11.9, '3am. he does a little\npresentation.']];
      camOn(1.0);
      wline([[40, G], [1040, G]], 1.8, 5, ink);
      bedSide(60, 460, 1270, ink, G); pillow(150, 1270, ink); lyingFigure(150, 1258, 260, ink, C.NIGHT, true);
      flipchart(650, 760, ink, [0, 0, 0]);
      const w = worry(850, G, 130, t, ink, -1, 1);
      // pointer
      wline([[w.cx - 110, w.cy], [600, 960]], .6, 5, ink);
      camOff();
    } else if (t < 15.8) { // S5 the turn
      caps = [[12.1, 15.7, 'so she wrote down\neverything he said.']];
      heartlyPhone(t, 12.2, 'what if i get fired. what if everyone’s annoyed with me. what if i’m not doing enough.',
        'these are all “what ifs”. which one is actually happening right now?', { x: 510, y: 1040, w: 680, h: 820, typeDur: 1.3 });
    } else if (t < 17.6) { // S6a crossing out, he shrinks
      caps = [[15.9, 17.55, 'turns out none of it\nwas happening.']];
      wline([[40, G], [1040, G]], 1.8, 5, ink);
      bedSide(60, 460, 1270, ink, G); pillow(150, 1270, ink);
      // she's sitting up now
      figure(180, 1, 0, 0, false, 1270, ink, [[280, 1130], [300, 1140]]);
      const cr = [easeOut(seg(t, 16.0, 16.3)), easeOut(seg(t, 16.4, 16.7)), easeOut(seg(t, 16.8, 17.1))];
      flipchart(650, 760, ink, cr);
      const r = lerp(130, 34, ease(seg(t, 16.0, 17.3)));
      worry(850, G, r, t, ink, -1, 0);
    } else { // S6b day, pocket-sized
      caps = [[17.7, 19.4, 'he’s still around.\njust pocket-sized.']];
      wline([[40, G], [1040, G]], 1.8, 5, ink);
      camOn(1.25, 540, 1400);
      const fx = 480;
      figure(fx, 0, 0, 0, false, G, ink, [[fx + 120, G - 250], [fx - 50, G - 180]], 1);
      worry(fx + 125, G - 255, 26, t, ink, -1, 0); // sitting in her hand
      camOff();
      cx.strokeStyle = C.EMBER; cx.lineWidth = 6; cx.beginPath(); cx.arc(860, 720, 50, 0, 6.29); cx.stroke();
      for (let i = 0; i < 8; i++) { const a = i / 8 * 6.29 + t * .3; wline([[860 + Math.cos(a) * 70, 720 + Math.sin(a) * 70], [860 + Math.cos(a) * 95, 720 + Math.sin(a) * 95]], .8, 5, C.EMBER); }
    }
    captions(t, caps, 430, 82, ink);
    dips(t, [3.4, 6.4, 9.0, 12.0, 15.8, 17.6]);
  }
};
