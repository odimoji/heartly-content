// Series D, "Pick a door": the six things people carry (mirrors onboarding Q1). Comment-bait.
window.SCENE = {
  duration: 15,
  render(t) {
    boil(t); paper();
    captions(t, [
      [0.2, 2.4, "everyone's carrying something."],
      [7.0, 10.0, 'which one are you carrying?'],
      [10.2, 12.9, 'comment the number.'],
    ], 470);
    const doors = [
      ['someone', 'who left'], ['someone', 'i’ve lost'], ['something', 'someone did'],
      ['something', 'i did'], ['what might', 'happen'], ['something', 'else'],
    ];
    const cols = [185, 540, 895], tops = [560, 1030], w = 260, h = 340;
    const fade = 1 - seg(t, 12.9, 13.3);
    if (fade <= 0) { endCard(t, 13.2); return; }
    cx.save(); cx.globalAlpha = fade;
    // which door is "lit" while the question is on screen
    const cyc = t > 7.2 && t < 10.6 ? Math.floor((t - 7.2) * (2.2 + (t - 7.2) * 1.4)) % 6 : -1;
    doors.forEach(([l1, l2], i) => {
      const x = cols[i % 3], top = tops[Math.floor(i / 3)], st = 0.5 + i * 0.55, k = seg(t, st, st + 0.8);
      if (k <= 0) return;
      const L = x - w / 2, Rr = x + w / 2, B = top + h;
      // light spilling from a door left ajar
      const lit = (i === cyc) ? 1 : 0;
      if (lit) { const g = cx.createLinearGradient(Rr, 0, Rr + 50, 0); g.addColorStop(0, 'rgba(217,100,58,.55)'); g.addColorStop(1, 'rgba(217,100,58,0)');
        cx.fillStyle = g; cx.fillRect(Rr, top + 6, 50, h - 6); wline([[Rr - 2, top + 8], [Rr - 2, B]], 1, 5, C.EMBER); }
      wline([[L, B], [L, top], [Rr, top], [Rr, B]], 2, 7, C.INK, ease(k));
      const k2 = seg(t, st + 0.5, st + 1.0);
      if (k2 > 0) {
        wline([[L + 28, top + 28], [Rr - 28, top + 28], [Rr - 28, top + 150], [L + 28, top + 150], [L + 28, top + 28]], 1.4, 4, C.INK, k2);
        wline([[L + 28, top + 185], [Rr - 28, top + 185], [Rr - 28, B - 28], [L + 28, B - 28], [L + 28, top + 185]], 1.4, 4, C.INK, k2);
        if (k2 > .6) { cx.fillStyle = C.INK; cx.beginPath(); cx.arc(Rr - 22, top + 170, 8, 0, 6.29); cx.fill(); }
        text(String(i + 1), x, top + 92, 120, k2, 'Caveat', 700, lit ? C.EMBER : C.INK);
        text(l1, x, B + 42, 52, k2, 'Caveat', 600); text(l2, x, B + 92, 52, k2, 'Caveat', 600);
      }
    });
    
    cx.restore();
  }
};
