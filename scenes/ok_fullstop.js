// Series A (story), "he replied ok.": one text, six hours of investigation, eleven drafts,
// she writes out what's really going on in Heartly, and the answer was boring all along.
const CORK = '#D9BC92', STRING = '#C0392B';
function phoneChat(t, typed) {
  const px = 500, py = 1030, pw = 660, ph = 880;
  cx.fillStyle = '#FBF8F3'; cx.beginPath(); cx.roundRect(px - pw / 2, py - ph / 2, pw, ph, 58); cx.fill();
  cx.save(); cx.strokeStyle = C.INK; cx.lineWidth = 7; cx.beginPath(); cx.roundRect(px - pw / 2, py - ph / 2, pw, ph, 58); cx.stroke(); cx.restore();
  text('ben', px, py - ph / 2 + 70, 40, 1, 'Inter', 600, C.INK);
  wline([[px - pw / 2 + 30, py - ph / 2 + 120], [px + pw / 2 - 30, py - ph / 2 + 120]], 1, 3, '#CFC6BA');
  chatBubble(px + pw / 2 - 40, py - ph / 2 + 170, 'had the best time tonight. same time next week?', true, 1, 38, 440);
  return { px, py, pw, ph };
}
function okBubble(t, k) {
  const p = phoneChat(t);
  const bx = p.px - p.pw / 2 + 40, by = p.py - p.ph / 2 + 370;
  chatBubble(bx, by, 'ok.', false, k, 96, 300);
  return { bx, by };
}
function note(x, y, l1, l2, k, rot) {
  if (k <= 0) return; cx.save(); cx.translate(x, y); cx.rotate(rot); const s = k < 1 ? .5 + .5 * easeOut(k) : 1; cx.scale(s, s);
  cx.fillStyle = '#FFFDF6'; cx.fillRect(-120, -52, 240, 104); wline([[-120, -52], [120, -52], [120, 52], [-120, 52], [-120, -52]], 1, 3, C.INK);
  text(l1, 0, l2 ? -16 : 0, 34, 1, 'Caveat', 700); if (l2) text(l2, 0, 22, 34, 1, 'Caveat', 700);
  cx.fillStyle = STRING; cx.beginPath(); cx.arc(0, -46, 8, 0, 6.29); cx.fill(); cx.restore();
}
window.SCENE = {
  duration: 19,
  render(t) {
    boil(t);
    const night = t >= 15.2;
    const ink = night ? C.CREAM : C.INK;
    paper(night ? C.NIGHT : C.PAPER, night ? 'rgba(241,230,214,.025)' : undefined);
    let caps = [];
    if (t < 3.2) { // S1 hook: the ok.
      caps = [[-1, 3.1, 'he replied “ok.”\nwith a full stop.']];
      const shake = t > .9 && t < 1.3 ? Math.sin(t * 90) * 6 : 0;
      cx.save(); cx.translate(shake, 0);
      const b = okBubble(t, 1);
      // red circle round the full stop
      if (t > .9) { cx.font = '500 96px Inter'; const ox = b.bx + 28 + cx.measureText('ok').width + 14; R = rng(5); wcircle(ox - 6, b.by + 18 + 96 * .65 + 8, 36, 7, STRING, 4, seg(t, .9, 1.4)); }
      if (t > 1.6) text('?!', b.bx + 260, b.by + 50, 110, seg(t, 1.6, 1.8), 'Caveat', 700, STRING);
      cx.restore();
    } else if (t < 8.4) { // S2 the investigation board
      caps = [[3.3, 5.7, 'hour 3: the investigation.'], [5.8, 8.3, 'hour 6: it’s getting worse.']];
      const BX0 = 50, BX1 = 790, BY0 = 590, BY1 = 1170, ccx = 420, ccy = 880;
      cx.fillStyle = CORK; cx.fillRect(BX0, BY0, BX1 - BX0, BY1 - BY0);
      wline([[BX0, BY0], [BX1, BY0], [BX1, BY1], [BX0, BY1], [BX0, BY0]], 1.6, 8, C.INK);
      const notes = [
        [195, 700, 'the full', 'stop??', -.05], [645, 700, '“haha” tuesday.', 'now THIS?', .04],
        [180, 880, 'i said “best time”', '(too much)', .03], [660, 880, 'driving?', '(no. he hates me)', -.04],
        [195, 1060, 'his mum liked', 'my pic in 2024', .05], [645, 1060, 'is “ok.”', 'ok??', -.03],
      ];
      notes.forEach(([x, y], i) => { const st = 3.5 + i * .62; const k = seg(t, st, st + .35); if (k > 0) wline([[ccx, ccy], [x, y - 46]], 1.2, 4, STRING, ease(k)); });
      // centre exhibit
      cx.save(); cx.translate(ccx, ccy); cx.rotate(-.02); cx.fillStyle = '#FFFDF6'; cx.fillRect(-90, -60, 180, 120);
      wline([[-90, -60], [90, -60], [90, 60], [-90, 60], [-90, -60]], 1, 4, C.INK); text('ok.', 0, 4, 80, 1, 'Inter', 600, C.INK); cx.restore();
      notes.forEach(([x, y, a, b, r], i) => { const st = 3.5 + i * .62; note(x, y, a, b, seg(t, st + .25, st + .55), r); });
      // her, with a magnifying glass, hair getting messier
      const fx = 900, GG = 1460;
      wline([[60, GG], [1020, GG]], 1.8, 5, C.INK);
      const glassX = 780 + Math.sin(t * 3) * 30, glassY = 1000 + Math.cos(t * 2.3) * 40;
      const f = figure(fx, 0, 0, 0, false, GG, C.INK, [[glassX + 30, glassY + 40], [fx - 10, GG - 260]]);
      wcircle(glassX, glassY, 36, 6, C.INK); wline([[glassX + 26, glassY + 26], [glassX + 46, glassY + 48]], 1, 7, C.INK);
      const mess = seg(t, 5.8, 7.5);
      for (let i = 0; i < Math.round(mess * 7); i++) { const a = -2.6 + i * .4; wcircle(f.head[0] + Math.cos(a) * 46, f.head[1] + Math.sin(a) * 46, 12, 4, C.INK, 4); }
    } else if (t < 11.2) { // S3 drafts
      caps = [[8.5, 11.1, 'drafts: 11.\nsent: 0.']];
      const p = phoneChat(t); chatBubble(p.px - p.pw / 2 + 40, p.py - p.ph / 2 + 370, 'ok.', false, 1, 96, 300);
      const ix = p.px - p.pw / 2 + 30, iy = p.py + p.ph / 2 - 130, iw = p.pw - 60;
      cx.save(); cx.strokeStyle = '#B9AFA3'; cx.lineWidth = 4; cx.beginPath(); cx.roundRect(ix, iy, iw, 80, 40); cx.stroke(); cx.restore();
      const drafts = [['so are we ok or', 8.5, 9.3, 9.6], ['sorry if i was too much', 9.75, 10.5, 10.9]];
      let s = '';
      for (const [d, a, b, c] of drafts) { if (t >= a && t < b) s = d.slice(0, Math.floor(seg(t, a, b - .1) * d.length)); else if (t >= b && t < c) s = d.slice(0, Math.floor((1 - seg(t, b, c)) * d.length)); }
      const cur = Math.floor(t * 3) % 2 ? '|' : '';
      text(s + cur, ix + 32, iy + 42, 34, 1, 'Inter', 500, C.INK, 'left');
    } else if (t < 15.2) { // S4 the turn
      caps = [[11.3, 15.1, 'so she wrote out the real thing.']];
      heartlyPhone(t, 11.4, 'he said ok. and now i’m convinced i was too much. i always end up feeling like too much.',
        'maybe the full stop isn’t the scary part. feeling like “too much” is. let’s start there.', { x: 510, y: 1010, w: 680, h: 880, typeDur: 1.4 });
    } else { // S5 release: asleep, phone buzzes
      caps = [[15.3, 17.0, 'he was driving.'], [17.1, 18.95, 'it was never about\nthe full stop.']];
      const GG = 1400, BY = 1260;
      camOn(1.3, 200, 1400);
      wline([[60, GG], [1020, GG]], 1.8, 5, ink);
      bedSide(300, 940, BY, ink, GG);
      pillow(400, BY, ink);
      lyingFigure(400, BY - 12, 470, ink, C.NIGHT, false);
      // nightstand + phone
      wline([[110, GG], [110, BY - 60], [260, BY - 60], [260, GG]], 1.2, 6, ink);
      const buzz = t > 15.6 && t < 16.4 ? Math.sin(t * 80) * 4 : 0;
      cx.fillStyle = '#DDE4FF'; cx.fillRect(160 + buzz, BY - 78, 54, 16);
      const g = cx.createRadialGradient(187, BY - 75, 4, 187, BY - 75, 140); g.addColorStop(0, `rgba(170,190,255,${.35 * seg(t, 15.6, 15.8)})`); g.addColorStop(1, 'rgba(170,190,255,0)');
      cx.fillStyle = g; cx.fillRect(40, BY - 220, 300, 300);
      text('z', 520, BY - 120 - (t * 30 % 60), 50, .7, 'Caveat', 700, ink); text('z', 560, BY - 170 - (t * 30 % 60), 40, .5, 'Caveat', 700, ink);
      camOff();
      // notification banner
      const k = easeOut(seg(t, 15.6, 16.0));
      if (k > 0) {
        const bx = 150, bw = 760, by = 640 - (1 - k) * 60;
        cx.save(); cx.globalAlpha = k; cx.fillStyle = '#F4F1EC'; cx.beginPath(); cx.roundRect(bx, by, bw, 170, 36); cx.fill();
        text('ben', bx + 40, by + 52, 34, 1, 'Inter', 700, '#1C1A18', 'left');
        text('now', bx + bw - 40, by + 52, 28, 1, 'Inter', 500, '#8A8178', 'right');
        text('sorry, was driving!! saturday? :)', bx + 40, by + 110, 36, 1, 'Inter', 500, '#1C1A18', 'left');
        cx.restore();
      }
    }
    captions(t, caps, 430, 82, ink);
    dips(t, [3.2, 8.4, 11.2, 15.2]);
  }
};
