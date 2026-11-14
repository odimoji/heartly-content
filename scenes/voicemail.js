// Series A (story), "storage full": she deletes everything on her phone except one voicemail
// from her nan, which she can't delete and can't play. She writes it out in Heartly; she presses play.
const RED = '#C0392B';
function lightPhone(px, py, pw, ph) {
  cx.fillStyle = '#FBF8F3'; cx.beginPath(); cx.roundRect(px - pw / 2, py - ph / 2, pw, ph, 56); cx.fill();
  cx.save(); cx.strokeStyle = C.INK; cx.lineWidth = 7; cx.beginPath(); cx.roundRect(px - pw / 2, py - ph / 2, pw, ph, 56); cx.stroke(); cx.restore();
}
function cat(x, y, ink, mood = 0) { // y = ground
  cx.fillStyle = '#9C8E80'; cx.beginPath(); cx.ellipse(x, y - 50, 62, 48, 0, 0, 6.29); cx.fill();
  cx.beginPath(); cx.arc(x - 52, y - 110, 36, 0, 6.29); cx.fill();
  cx.beginPath(); cx.moveTo(x - 82, y - 128); cx.lineTo(x - 76, y - 160); cx.lineTo(x - 58, y - 140); cx.fill();
  cx.beginPath(); cx.moveTo(x - 46, y - 142); cx.lineTo(x - 30, y - 162); cx.lineTo(x - 26, y - 132); cx.fill();
  wline([[x + 58, y - 40], [x + 100, y - 70], [x + 96, y - 120]], 1.4, 10, '#9C8E80');
  cx.fillStyle = ink; cx.beginPath(); cx.arc(x - 64, y - 112, 5, 0, 6.29); cx.arc(x - 40, y - 112, 5, 0, 6.29); cx.fill();
  if (mood > 0) text('!', x - 10, y - 190, 70, mood, 'Caveat', 700, RED);
}
function row(x, y, w, label, sub, k, strike) {
  if (k <= 0) return; cx.save(); cx.globalAlpha = k;
  text(label, x, y, 42, 1, 'Inter', 600, C.INK, 'left'); if (sub) text(sub, x, y + 48, 30, 1, 'Inter', 500, '#8A8178', 'left');
  if (strike > 0) wline([[x - 6, y + 4], [x - 6 + (w + 12) * strike, y + 4]], 1, 6, RED);
  cx.restore();
}
window.SCENE = {
  duration: 19.5,
  render(t) {
    boil(t);
    paper();
    const ink = C.INK;
    let caps = [];
    if (t < 8.2) { // S1+S2 storage full, the purge
      caps = [[-1, 3.3, 'her phone has said\n“storage full” for 2 years.'], [3.5, 5.0, 'she’s deleted 4,000\nphotos of her cat.'], [5.1, 6.5, 'every app.\nthe uni group chat.'], [6.6, 8.1, 'everything except\none voicemail.']];
      const px = 540, py = 1040, pw = 560, ph = 820; lightPhone(px, py, pw, ph);
      const L = px - pw / 2 + 50, Rr = px + pw / 2 - 50;
      text('storage', px, py - ph / 2 + 70, 40, 1, 'Inter', 700, C.INK);
      const used = 1 - (seg(t, 3.7, 4.2) * .004 + seg(t, 5.2, 5.6) * .003 + seg(t, 5.8, 6.2) * .002);
      cx.fillStyle = '#E4DED6'; cx.beginPath(); cx.roundRect(L, py - ph / 2 + 130, Rr - L, 30, 15); cx.fill();
      cx.fillStyle = RED; cx.beginPath(); cx.roundRect(L, py - ph / 2 + 130, (Rr - L) * used, 30, 15); cx.fill();
      text('storage almost full', L, py - ph / 2 + 200, 30, 1, 'Inter', 600, RED, 'left');
      const y0 = py - ph / 2 + 300, gap = 140;
      row(L, y0, 380, '4,012 photos', 'cat, mostly', 1 - seg(t, 4.4, 4.9), easeOut(seg(t, 3.7, 4.2)));
      row(L, y0 + gap, 380, '61 apps', 'used once', 1 - seg(t, 5.7, 6.2), easeOut(seg(t, 5.2, 5.6)));
      row(L, y0 + gap * 2, 380, 'uni group chat', '2017–2019', 1 - seg(t, 6.1, 6.5), easeOut(seg(t, 5.7, 6.0)));
      const vy = lerp(y0 + gap * 3, y0 + gap, ease(seg(t, 6.4, 6.9)));
      const hl = seg(t, 6.6, 6.9);
      if (hl > 0) { cx.save(); cx.globalAlpha = hl * .9; cx.fillStyle = '#F6DCCB'; cx.beginPath(); cx.roundRect(L - 20, vy - 44, Rr - L + 40, 124, 20); cx.fill(); cx.restore(); }
      row(L, vy, 380, 'voicemail · nan', '0:14', 1, 0);
      if (hl > 0) text('♥', Rr - 20, vy + 10, 44, hl, 'Inter', 700, RED, 'right');
      cat(170, 1500, ink, seg(t, 3.9, 4.1) * (t < 5.2 ? 1 : 0));
    } else if (t < 11.2) { // S3 can't delete, can't play
      caps = [[8.3, 9.7, 'she can’t delete it.'], [9.8, 11.1, 'she can’t play it either.']];
      const px = 540, py = 1040, pw = 560, ph = 820; lightPhone(px, py, pw, ph);
      text('nan', px, py - ph / 2 + 110, 56, 1, 'Inter', 700, C.INK);
      text('voicemail · 0:14', px, py - ph / 2 + 170, 30, 1, 'Inter', 500, '#8A8178');
      for (let i = 0; i < 26; i++) { const x = px - 220 + i * 17.6, h = 10 + Math.abs(Math.sin(i * 1.7)) * 50; wline([[x, py - 60 - h / 2], [x, py - 60 + h / 2]], 0, 6, '#B9AFA3'); }
      // play + delete buttons
      cx.fillStyle = C.INK; cx.beginPath(); cx.moveTo(px - 140, py + 110); cx.lineTo(px - 140, py + 190); cx.lineTo(px - 75, py + 150); cx.fill();
      text('play', px - 115, py + 240, 30, 1, 'Inter', 600, C.INK);
      cx.save(); cx.strokeStyle = RED; cx.lineWidth = 6; cx.beginPath(); cx.roundRect(px + 50, py + 115, 140, 72, 20); cx.stroke(); cx.restore();
      text('delete', px + 120, py + 152, 30, 1, 'Inter', 600, RED);
      // thumb: towards delete, stops; towards play, stops
      let tx, ty;
      const a = ease(seg(t, 8.4, 9.1)), b = ease(seg(t, 9.3, 9.7)), c = ease(seg(t, 9.8, 10.5)), d = ease(seg(t, 10.6, 11.0));
      tx = lerp(lerp(lerp(lerp(560, 640, a), 560, b), 410, c), 560, d); ty = lerp(lerp(lerp(lerp(1560, 1250, a), 1500, b), 1250, c), 1500, d);
      cx.fillStyle = '#E8C2A8'; cx.beginPath(); cx.ellipse(tx, ty + 90, 52, 120, -.15, 0, 6.29); cx.fill();
      wline([[tx - 50, ty + 210], [tx - 50, ty + 60], [tx - 30, ty - 20], [tx + 20, ty - 26], [tx + 48, ty + 40], [tx + 52, ty + 210]], 1.4, 6, C.INK);
    } else if (t < 15.2) { // S4 the turn
      caps = [[11.3, 15.1, 'so she wrote out why.']];
      heartlyPhone(t, 11.4, 'if i delete it, she’s really gone. if i play it, it’s real. so it just sits there.',
        'you don’t have to choose. it can just be hers, and yours, until you’re ready to hear her.', { x: 510, y: 1010, w: 680, h: 860, typeDur: 1.3 });
    } else { // S5 sunday: she presses play
      caps = [[15.3, 17.0, 'sunday. she pressed play.'], [17.1, 19.4, 'storage still full.\nshe’s fine with that.']];
      camOn(1.15, 540, 1400);
      const GG = 1400, seat = 1220;
      wline([[60, GG], [1020, GG]], 1.8, 5, ink);
      // sofa
      wline([[220, GG], [220, seat + 60], [880, seat + 60], [880, GG]], 1.4, 6, ink);
      wline([[220, seat + 60], [220, seat - 230], [880, seat - 230], [880, seat + 60]], 1.4, 6, ink);
      wline([[180, seat + 60], [180, seat - 60], [260, seat - 60], [260, seat + 60]], 1.2, 6, ink);
      wline([[840, seat + 60], [840, seat - 60], [920, seat - 60], [920, seat + 60]], 1.2, 6, ink);
      const fx = 420;
      const ph = [fx + 70, seat - 300];
      const f = figure(fx, 1, 0, 0, false, seat + 30, ink, [[ph[0] - 10, ph[1] + 30], [ph[0] + 10, ph[1] + 40]], seg(t, 16.0, 16.6));
      cx.fillStyle = C.INK; cx.fillRect(ph[0] - 14, ph[1] - 10, 28, 50);
      // sound waves
      if (t > 15.6) for (let i = 0; i < 3; i++) { const p = ((t - 15.6) * .7 + i / 3) % 1; cx.save(); cx.globalAlpha = (1 - p) * .9; cx.strokeStyle = C.EMBER; cx.lineWidth = 5; cx.beginPath(); cx.arc(ph[0], ph[1] + 10, 30 + p * 110, -1.1, -.1); cx.stroke(); cx.restore(); }
      cat(760, seat + 60, ink, 0);
      camOff();
      // storage banner pops, gets swiped away
      const k = seg(t, 17.3, 17.6), out = ease(seg(t, 18.4, 18.9));
      if (k > 0 && out < 1) {
        const bx = 150 + out * 900, by = 640;
        cx.save(); cx.globalAlpha = k; cx.fillStyle = '#F4F1EC'; cx.beginPath(); cx.roundRect(bx, by, 760, 130, 34); cx.fill();
        cx.strokeStyle = '#D8D0C5'; cx.lineWidth = 3; cx.stroke();
        text('storage almost full', bx + 40, by + 66, 36, 1, 'Inter', 600, RED, 'left'); cx.restore();
      }
    }
    captions(t, caps, 430, 82, ink);
    dips(t, [8.2, 11.2, 15.2]);
  }
};
