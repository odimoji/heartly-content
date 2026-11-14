// Series A (story), "the shower argument": two years after the breakup he still wins
// imaginary arguments with her, everywhere. He writes it out in Heartly; the shower goes quiet.
const WATER = '#7FA7C9';
function bottle(x, y, ink, face = 0) { // y = bottom
  cx.fillStyle = '#E8A383'; cx.beginPath(); cx.roundRect(x - 34, y - 130, 68, 130, 14); cx.fill();
  wline([[x - 34, y], [x - 34, y - 120], [x - 22, y - 132], [x + 22, y - 132], [x + 34, y - 120], [x + 34, y], [x - 34, y]], 1, 5, ink);
  wline([[x - 14, y - 132], [x - 14, y - 160], [x + 14, y - 160], [x + 14, y - 132]], .8, 5, ink);
  if (face > 0) {
    cx.fillStyle = ink; cx.beginPath(); cx.arc(x - 12, y - 80, 5, 0, 6.29); cx.arc(x + 12, y - 80, 5, 0, 6.29); cx.fill();
    cx.save(); cx.strokeStyle = ink; cx.lineWidth = 4; cx.lineCap = 'round'; cx.beginPath(); cx.arc(x, y - 66, 13, .2 * Math.PI, (.2 + .6 * face) * Math.PI); cx.stroke(); cx.restore();
  }
}
function showerStall(t, ink, flow = 1) {
  const G = 1400;
  wline([[200, G], [880, G]], 1.6, 6, ink);
  wline([[230, G], [230, 780]], 1.4, 6, ink); wline([[850, G], [850, 780]], 1.4, 6, ink);
  // pipe and head
  wline([[760, 780], [760, 800], [680, 830]], 1, 7, ink);
  wline([[600, 845], [690, 825]], 1, 12, ink);
  // water streams
  cx.save(); cx.strokeStyle = WATER; cx.lineWidth = 4; cx.lineCap = 'round'; cx.globalAlpha = .8 * flow;
  for (let i = 0; i < 12; i++) {
    const x0 = 605 + i * 7, sp = -44 + i * 8;
    for (let j = 0; j < 4; j++) {
      const p = ((t * 1.6 + j / 4 + i * .13) % 1);
      const y = 860 + p * 530, x = x0 + sp * p * 3.2;
      cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x + sp * .12, y + 40); cx.stroke();
    }
  }
  cx.restore();
  // ledge + bottle
  wline([[250, 1100], [380, 1100]], .8, 6, ink);
  return G;
}
function car(t, ink) {
  const G = 1330, x = 520;
  wline([[60, G], [1020, G]], 1.8, 5, ink);
  // traffic light
  wline([[130, G], [130, 840]], 1, 6, ink); wline([[95, 700], [165, 700], [165, 860], [95, 860], [95, 700]], 1, 5, ink);
  cx.fillStyle = '#C0392B'; cx.beginPath(); cx.arc(130, 740, 22, 0, 6.29); cx.fill(); wcircle(130, 810, 22, 4, ink);
  // body
  wline([[x - 300, G - 70], [x - 300, G - 180], [x - 160, G - 190], [x - 90, G - 300], [x + 140, G - 300], [x + 220, G - 190], [x + 320, G - 175], [x + 320, G - 70], [x - 300, G - 70]], 1.6, 7, ink);
  wline([[x - 70, G - 280], [x + 125, G - 280], [x + 185, G - 195], [x - 130, G - 195], [x - 70, G - 280]], 1.2, 5, ink);
  wcircle(x - 170, G - 60, 58, 7, ink); wcircle(x + 190, G - 60, 58, 7, ink);
  // driver head + steering wheel
  wcircle(x - 10, G - 236, 30, 6, ink);
  wline([[x + 50, G - 200], [x + 80, G - 250]], 1, 6, ink);
}
window.SCENE = {
  duration: 18.6,
  render(t) {
    boil(t);
    const night = t >= 8.2 && t < 9.6;
    const ink = night ? C.CREAM : C.INK;
    paper(night ? C.NIGHT : C.PAPER, night ? 'rgba(241,230,214,.025)' : undefined);
    let caps = [];
    if (t < 6.8) { // S1+S2 the shower arguments
      caps = [[-1, 1.9, '2 years after the breakup,\nhe’s still arguing with her.'], [2.0, 3.35, 'in the shower.'], [3.5, 5.1, 'arguments won: 312.'], [5.2, 6.75, 'said to her: 0.']];
      const G = 1400;
      const jab = Math.sin(t * 14) * 14;
      const big = t > 4.6;
      camOn(1.18, 540, 1400); showerStall(t, ink); bottle(315, 1100, ink);
      figure(620, 0, 0, Math.sin(t * 5) * 8, false, G, ink, [[440 + jab, 1010 + jab * .4], [680, 1110]]); camOff();
      const lines = [[0, 1.4, 'and ANOTHER thing—'], [1.5, 2.9, 'no, YOU listen.'], [3.0, 4.4, 'with respect—'], [4.5, 5.6, 'i was RIGHT about italy'], [5.7, 6.8, '…and that’s THAT.']];
      for (const [a, b, m] of lines) if (t >= a && t < b) bubble(430, 800, m, seg(t, a, a + .2), 54);
    } else if (t < 8.2) { // S3a car
      caps = [[6.9, 8.15, 'the car.']];
      car(t, ink);
      bubble(520, 860, 'you NEVER even—', seg(t, 7.0, 7.2), 50);
    } else if (t < 9.6) { // S3b bed, 1am
      caps = [[8.3, 9.55, 'bed. 1am.']];
      camOn(1.25, 200, 1400);
      const GG = 1400, BY = 1260;
      wline([[60, GG], [1020, GG]], 1.8, 5, ink);
      bedSide(300, 940, BY, ink, GG); pillow(400, BY, ink); lyingFigure(400, BY - 12, 470, ink, C.NIGHT, true);
      camOff();
      bubble(560, 900, 'actually, no—', seg(t, 8.4, 8.6), 50);
      const k = seg(t, 9.0, 9.2); if (k > 0) bubble(640, 1010, 'and ANOTHER—', k, 44);
    } else if (t < 13.9) { // S4 the turn
      caps = [[9.7, 13.85, 'so one night he wrote it out.']];
      heartlyPhone(t, 9.8, 'i keep arguing with her in my head. i win every time. it never feels like winning.',
        'maybe it was never about winning. maybe you just needed someone to hear how much it hurt.', { x: 510, y: 1010, w: 680, h: 880, typeDur: 1.3 });
    } else { // S5 quiet shower
      caps = [[14.0, 16.1, 'first quiet shower\nin two years.'], [16.2, 18.5, 'the shampoo is\nso relieved.']];
      camOn(1.18, 540, 1400); const G = showerStall(t, ink);
      bottle(315, 1100, ink, t > 16.2 ? seg(t, 16.2, 16.6) : 0);
      figure(620, 0, 0, 0, false, G, ink, [[580, 900], [660, 900]], 1);
      // humming notes
      for (let i = 0; i < 3; i++) {
        const p = ((t - 14) * .5 + i / 3) % 1, nx = 470 - p * 90 + Math.sin(p * 9) * 12, ny = 900 - p * 200;
        cx.save(); cx.globalAlpha = Math.sin(p * Math.PI); cx.fillStyle = ink; cx.beginPath(); cx.ellipse(nx, ny, 12, 9, -.4, 0, 6.29); cx.fill();
        cx.strokeStyle = ink; cx.lineWidth = 4; cx.beginPath(); cx.moveTo(nx + 10, ny - 3); cx.lineTo(nx + 10, ny - 50); cx.lineTo(nx + 26, ny - 40); cx.stroke(); cx.restore();
      }
      camOff();
    }
    captions(t, caps, 430, 82, ink);
    dips(t, [6.8, 8.2, 9.6, 13.9]);
  }
};
