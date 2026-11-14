// Series A (story), "2am reruns": her brain screens her cringe classics every night, then the one
// that isn't funny (the last thing she said to her sister). She writes that one out in Heartly; she texts her.
const SCR = { x: 130, y: 600, w: 800, h: 540 };
function screenOn(t) {
  cx.fillStyle = C.CREAM; cx.fillRect(SCR.x, SCR.y, SCR.w, SCR.h);
  cx.save(); cx.beginPath(); cx.rect(SCR.x, SCR.y, SCR.w, SCR.h); cx.clip(); cx.translate(SCR.x - 250 * .64, SCR.y - 133); cx.scale(.64, .64);
}
function screenOff(ink) {
  cx.restore();
  wline([[SCR.x, SCR.y], [SCR.x + SCR.w, SCR.y], [SCR.x + SCR.w, SCR.y + SCR.h], [SCR.x, SCR.y + SCR.h], [SCR.x, SCR.y]], 1.2, 6, ink);
}
function beam(hx, hy, a = .1) {
  cx.fillStyle = `rgba(241,230,214,${a})`; cx.beginPath(); cx.moveTo(hx, hy); cx.lineTo(SCR.x + 40, SCR.y + SCR.h); cx.lineTo(SCR.x + SCR.w - 40, SCR.y + SCR.h); cx.closePath(); cx.fill();
}
function clip(t, n, lt) { // mini scenes, in screen space 0..1520 x 0..920
  const g = 1020, I = C.INK;
  const say = (x, y, m, k, col = I) => text(m, x, y, 104, k, 'Caveat', 700, col);
  wline([[0, g], [1520, g]], 1.4, 6, I);
  if (n === 1) { // "you too!"
    figure(1050, 0, 0, 0, false, g, I, [[930, g - 300], [990, g - 300]]);
    wline([[880, g - 310], [1010, g - 310]], 1, 6, I);
    figure(470, 0, 0, 0, false, g, I, [[430, g - 170], [520, g - 170]]);
    say(1050, 330, '“enjoy your meal!”', seg(lt, .2, .5));
    say(470, 470, '“you too!”', seg(lt, 1.3, 1.6));
    if (lt > 2.2) text('…', 1050, 520, 120, seg(lt, 2.2, 2.4), 'Caveat', 700, I);
  } else if (n === 2) { // the wave
    const wv = Math.sin(lt * 12) * 30;
    figure(420, 0, 0, 0, false, g, I, [[540 + wv, g - 470], [380, g - 170]]);
    const p = seg(lt, 0, 1.6);
    figure(1000, 0, lt * 6, 0, false, g, I, [[1120, g - 470 + wv * .3], [960, g - 170]]);
    figure(1380, 0, 0, 0, false, g, I, [[1290, g - 450], [1420, g - 170]]);
    say(440, 380, 'hiii!!', seg(lt, .2, .4));
  } else if (n === 3) { // "thanks, mum"
    wline([[960, 300], [1440, 300], [1440, 560], [960, 560], [960, 300]], 1, 6, I);
    figure(1120, 0, 0, 0, false, g, I, [[1040, g - 300], [1200, g - 300]]);
    figure(420, 0, 0, 0, false, g, I, [[560, g - 300], [600, g - 290]]);
    say(560, 380, '“thanks, mum.”', seg(lt, .2, .5));
  } else if (n === 4) { // the one that isn't funny
    const away = ease(seg(lt, 1.6, 3.0));
    figure(420, 0, 0, 0, false, g, I, [[360, g - 170], [480, g - 170]]);
    figure(1000 + away * 520, 0, away * 18, 0, false, g, I);
    wline([[700, g], [730, g - 40], [690, g - 90], [740, g - 140]], 2, 5, '#C0392B', seg(lt, 1.0, 1.4));
    say(760, 380, '“you’re so selfish.”', seg(lt, .2, .5), '#C0392B');
  }
}
window.SCENE = {
  duration: 19.5,
  render(t) {
    boil(t);
    const night = t < 14.2 && !(t >= 10.2 && t < 14.2);
    const ink = night ? C.CREAM : C.INK;
    paper(night ? C.NIGHT : C.PAPER, night ? 'rgba(241,230,214,.025)' : undefined);
    let caps = [];
    const G = 1460, BY = 1340;
    if (t < 10.2) { // S1–S3 the screenings
      caps = [[-1, 3.3, 'every night at 2am, her\nbrain screens the classics.'], [3.5, 5.1, 'classic #2: the wave.'], [5.3, 7.0, 'classic #3: “thanks, mum.”\n(teacher.)'],
        [7.2, 8.6, 'and then the one\nthat isn’t funny.'], [8.7, 10.1, 'the last thing she\nsaid to her sister.']];
      wline([[40, G], [1040, G]], 1.8, 5, ink);
      bedSide(110, 940, BY, ink, G); pillow(210, BY, ink);
      lyingFigure(210, BY - 12, 560, ink, C.NIGHT, true);
      if (t > 5.8 && t < 7.1) { // pillow over face
        cx.fillStyle = C.NIGHT; cx.beginPath(); cx.ellipse(215, BY - 40, 70, 34, -.15, 0, 6.29); cx.fill();
        wline([[150, BY - 30], [170, BY - 70], [270, BY - 76], [285, BY - 36], [150, BY - 30]], 1.2, 5, ink);
      }
      beam(222, BY - 60, t > 7.1 ? .07 : .11);
      screenOn(t);
      const n = t < 3.4 ? 1 : t < 5.2 ? 2 : t < 7.1 ? 3 : 4;
      const st = [0, 0, 3.4, 5.2, 7.1][n];
      clip(t, n, t - st);
      screenOff(ink);
    } else if (t < 14.2) { // S4 the turn
      caps = [[10.3, 14.1, 'so she wrote that one out.']];
      heartlyPhone(t, 10.4, 'i keep replaying the last fight with my sister. i called her selfish. we haven’t spoken in a year.',
        'the cringe ones are just noise. this one keeps replaying because part of you still wants to fix it.', { x: 510, y: 1030, w: 680, h: 860, typeDur: 1.4 });
    } else { // S5 morning: she texts her sister
      caps = [[14.3, 16.7, 'some reruns are just cringe.'], [16.8, 19.4, 'some are unfinished.']];
      const px = 520, py = 1050, pw = 640, ph = 820;
      cx.fillStyle = '#FBF8F3'; cx.beginPath(); cx.roundRect(px - pw / 2, py - ph / 2, pw, ph, 56); cx.fill();
      cx.save(); cx.strokeStyle = C.INK; cx.lineWidth = 7; cx.beginPath(); cx.roundRect(px - pw / 2, py - ph / 2, pw, ph, 56); cx.stroke(); cx.restore();
      text('soph', px, py - ph / 2 + 70, 40, 1, 'Inter', 600, C.INK);
      wline([[px - pw / 2 + 30, py - ph / 2 + 120], [px + pw / 2 - 30, py - ph / 2 + 120]], 1, 3, '#CFC6BA');
      text('last message: 1 year ago', px, py - ph / 2 + 165, 26, 1, 'Inter', 500, '#8A8178');
      const msg = 'hey. i’ve been thinking about what i said. i’m sorry. i miss you.';
      // typed in the input bar, then sent
      const ix = px - pw / 2 + 30, iy = py + ph / 2 - 130, iw = pw - 60;
      const sent = t > 16.4;
      cx.save(); cx.strokeStyle = '#B9AFA3'; cx.lineWidth = 4; cx.beginPath(); cx.roundRect(ix, iy, iw, 80, 40); cx.stroke(); cx.restore();
      if (!sent) { const s = msg.slice(0, Math.floor(seg(t, 14.6, 16.2) * msg.length)); const show = s.length > 26 ? '…' + s.slice(-25) : s; text(show + (Math.floor(t * 3) % 2 ? '|' : ''), ix + 32, iy + 42, 32, 1, 'Inter', 500, C.INK, 'left'); }
      if (sent) chatBubble(px + pw / 2 - 36, py - ph / 2 + 230, msg, true, seg(t, 16.4, 16.7), 38, 440);
      if (t > 17.4) { // typing dots from her sister
        const bx = px - pw / 2 + 36, by = py - ph / 2 + 470;
        cx.fillStyle = '#E4DED6'; cx.beginPath(); cx.roundRect(bx, by, 150, 76, 36); cx.fill();
        for (let i = 0; i < 3; i++) { const b = Math.sin(t * 8 - i * .8) * 6; cx.fillStyle = '#8A8178'; cx.beginPath(); cx.arc(bx + 42 + i * 33, by + 38 + b, 10, 0, 6.29); cx.fill(); }
      }
    }
    captions(t, caps, 430, 82, ink);
    dips(t, [3.4, 5.2, 7.1, 10.2, 14.2]);
  }
};
