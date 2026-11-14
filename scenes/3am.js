// Series B, "3am brain": thoughts pile up faster and faster, then one calm line.
const THOUGHTS = [
  'are they thinking about me?', 'just check their story', 'it’s been 4 months', 'why do i still care',
  'what if i text them', 'they’ve moved on', 'replay it again', 'did i say something wrong',
  'you should be over this', 'one more look', 'what if it was me', 'i’m fine', 'they look happy',
  'i’m fine', 'what did i miss', 'replay it again', 'why wasn’t i enough', 'type it. delete it.',
  'they don’t even think about me', 'just one more look', 'i’m not fine', 'what if', 'what if',
  'replay it again', 'it’s 3am', 'go to sleep', 'what if they call', 'why', 'why', 'why', 'what if',
  'one more look', 'replay it', 'replay it', 'i’m fine', 'what if'
];
const SP = (() => { // spawn schedule + fixed layout, seeded
  const r = rng(42), out = []; let tt = 0.35, gap = 0.95;
  for (const s of THOUGHTS) {
    if (tt > 9.9) break;
    out.push({ s, t: tt, x: 150 + r() * 780, y: 470 + r() * 1000, size: 34 + r() * 34, rot: (r() - .5) * 0.08, w: r() > .6 ? 700 : r() > .3 ? 500 : 300 });
    tt += gap; gap = Math.max(0.11, gap * 0.86);
  }
  return out;
})();
window.SCENE = {
  duration: 16,
  render(t) {
    paper(C.NIGHT, 'rgba(241,230,214,.025)');
    const fall = seg(t, 10.0, 10.7);
    // clock
    if (t < 10.4) {
      const min = t < 5 ? '07' : t < 8.5 ? '08' : '09';
      text(`3:${min} am`, W / 2, 330, 64, 0.75 * (1 - fall) * seg(t, 0, .4), 'Inter', 300, C.CREAM);
    }
    // thoughts
    for (const p of SP) {
      if (t < p.t) continue;
      const age = t - p.t;
      let a = Math.min(1, age / 0.12) * (age < 1.6 ? 1 : Math.max(0.28, 1 - (age - 1.6) * 0.5));
      const dy = -age * 10 + fall * fall * (900 + p.y * .3);
      a *= 1 - fall;
      if (a <= 0) continue;
      cx.font = `${p.w} ${p.size}px Inter`; const tw = cx.measureText(p.s).width;
      const px = clamp(p.x, 50 + tw / 2, 1030 - tw / 2);
      cx.save(); cx.translate(px, p.y + dy); cx.rotate(p.rot + fall * p.rot * 6);
      const jitter = (t > 8 && age < 0.3) ? (Math.sin(t * 90 + p.x) * 3) : 0;
      text(p.s, jitter, 0, p.size, a, 'Inter', p.w, C.CREAM);
      cx.restore();
    }
    // calm lines
    const out = 1 - seg(t, 13.2, 13.6);
    const k1 = seg(t, 11.0, 11.5), k2 = seg(t, 12.0, 12.5);
    if (k1 > 0) text('you don’t need to stop thinking about it.', W / 2, 840 + (1 - easeOut(k1)) * 14, 50, k1 * out, 'Inter', 500, C.CREAM);
    if (k2 > 0) text('you need somewhere to put it.', W / 2, 925 + (1 - easeOut(k2)) * 14, 50, k2 * out, 'Inter', 600, C.EMBER);
    endCard(t, 13.6, true);
  }
};
