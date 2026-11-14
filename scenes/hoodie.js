// Series A (story), "he kept her hoodie": three failed attempts, a 3am text he doesn't send,
// he writes it out in Heartly instead, and the next morning he can let it go.
const HOOD = '#E8A383';
function hoodie(x, y, sc = 1, col = C.INK, fill = HOOD, rot = 0) {
  cx.save(); cx.translate(x, y); cx.rotate(rot); cx.scale(sc, sc);
  const body = [[-60, -40], [-30, -48], [-22, -78], [0, -90], [22, -78], [30, -48], [60, -40], [96, 58], [74, 66], [56, 6], [56, 92], [-56, 92], [-56, 6], [-74, 66], [-96, 58], [-60, -40]];
  cx.fillStyle = fill; cx.beginPath(); body.forEach((p, i) => i ? cx.lineTo(p[0], p[1]) : cx.moveTo(p[0], p[1])); cx.closePath(); cx.fill();
  wline(body, 1.6, 5, col);
  wline([[-34, 40], [34, 40], [28, 70], [-28, 70], [-34, 40]], 1.2, 4, col);
  wline([[-8, -48], [-10, -20]], 1, 3, col); wline([[8, -48], [10, -20]], 1, 3, col);
  cx.restore();
}
function folded(x, y, col = C.INK) {
  cx.fillStyle = HOOD; cx.fillRect(x - 48, y - 26, 96, 52);
  wline([[x - 48, y - 26], [x + 48, y - 26], [x + 48, y + 26], [x - 48, y + 26], [x - 48, y - 26]], 1.2, 5, col);
  wline([[x - 48, y - 4], [x + 48, y - 4]], 1, 3, col);
}
const G = 1330;
window.SCENE = {
  duration: 23.5,
  render(t) {
    boil(t);
    const night = t >= 10.6 && t < 19.2;
    const ink = night ? C.CREAM : C.INK;
    paper(night ? C.NIGHT : C.PAPER, night ? 'rgba(241,230,214,.025)' : undefined);
    let capList = [], post = [];
    const cap = (list) => { capList = list; };
    const scaled = !(t >= 14.6 && t < 19.2);
    if (scaled) { cx.save(); cx.translate(540, G); cx.scale(1.2, 1.2); cx.translate(-540, -G); }

    if (t < 3.2) { // S1 hook
      cap([[0.1, 3.1, 'day 94 of trying\nto get rid of her hoodie.']]);
      wline([[60, G], [1020, G]], 1.8, 5, ink);
      const sway = Math.sin(t * 2.2) * 6;
      hoodie(560 + sway, 1080, 1.05);
      figure(420, 0, 0, 0, false, G, ink, [[505 + sway, 1040], [612 + sway, 1040]]);
    } else if (t < 7.0) { // S2 the bin
      const lt = t - 3.2;
      cap([[3.3, 5.6, 'attempt 1: the bin.'], [5.7, 6.95, 'nope.']]);
      wline([[60, G], [1020, G]], 1.8, 5, ink);
      // bin
      wline([[730, G], [710, G - 190], [890, G - 190], [870, G], [730, G]], 1.6, 6, ink);
      wline([[700, G - 205], [900, G - 205]], 1.4, 7, ink);
      for (let i = 0; i < 4; i++) wline([[745 + i * 36, G - 165], [750 + i * 34, G - 20]], 1, 3, ink);
      let fx, hx, hy, ph = 0;
      if (lt < 1.2) { fx = lerp(420, 620, ease(lt / 1.2)); hx = fx + 140; hy = 1060; ph = lt * 7; }
      else if (lt < 2.2) { fx = 620; hx = lerp(760, 800, seg(lt, 1.2, 1.6)); hy = lerp(1060, 1010 + Math.sin(lt * 30) * 3 * seg(lt, 1.6, 2.2), seg(lt, 1.2, 1.6)); }
      else { fx = 620; const k = ease(seg(lt, 2.4, 3.0)); hx = lerp(800, 625, k); hy = lerp(1010, 1000, k); }
      hoodie(hx, hy, 0.9, ink);
      figure(fx, 0, ph, 0, false, G, ink, [[hx - 60, hy - 20], [hx + 40, hy - 20]]);
    } else if (t < 10.6) { // S3 the drawer
      cap([[7.1, 8.85, 'attempt 2: out of sight.'], [8.95, 10.55, 'not out of mind.']]);
      wline([[60, G], [1020, G]], 1.8, 5, ink);
      const dx = 640, dw = 320, dh = 280, top = G - dh;
      wline([[dx, G], [dx, top], [dx + dw, top], [dx + dw, G]], 1.6, 6, ink);
      const open1 = t < 7.9 ? ease(seg(t, 7.1, 7.4)) * 70 : t < 8.4 ? 0 : ease(seg(t, 8.4, 8.9)) * 26;
      wline([[dx + 18 + open1, top + 22], [dx + dw - 18 + open1, top + 22], [dx + dw - 18 + open1, top + 120], [dx + 18 + open1, top + 120], [dx + 18 + open1, top + 22]], 1.4, 5, ink);
      wline([[dx + 18, top + 145], [dx + dw - 18, top + 145], [dx + dw - 18, G - 22], [dx + 18, G - 22], [dx + 18, top + 145]], 1.4, 5, ink);
      cx.fillStyle = ink; [top + 71, top + 200].forEach((yy, i) => { cx.beginPath(); cx.arc(dx + dw / 2 + (i ? 0 : open1), yy, 7, 0, 6.29); cx.fill(); });
      let hx = 540, hy = 1060, vis = true;
      if (t > 7.2) { const k = ease(seg(t, 7.2, 7.75)); hx = lerp(540, dx + 100, k); hy = lerp(1060, top + 30, k); if (t > 7.75) vis = false; }
      if (vis) hoodie(hx, hy, 0.8 * (1 - seg(t, 7.5, 7.75) * .5), ink);
      if (t > 8.45) { // sleeve flops out
        const k = easeOut(seg(t, 8.5, 9.0));
        cx.fillStyle = HOOD; cx.beginPath(); cx.moveTo(dx + 40 + open1, top + 120); cx.lineTo(dx + 34 + open1, top + 120 + 110 * k); cx.lineTo(dx + 70 + open1, top + 120 + 115 * k); cx.lineTo(dx + 76 + open1, top + 120); cx.fill();
        wline([[dx + 40 + open1, top + 120], [dx + 34 + open1, top + 120 + 110 * k], [dx + 70 + open1, top + 120 + 115 * k], [dx + 76 + open1, top + 120]], 1, 4, ink);
      }
      const reach = t > 7.2 && t < 7.9;
      figure(470, 0, 0, 0, false, G, ink, reach ? [[lerp(560, dx + 60, seg(t, 7.2, 7.75)), lerp(1040, top + 30, seg(t, 7.2, 7.75))], [lerp(600, dx + 120, seg(t, 7.2, 7.75)), lerp(1040, top + 34, seg(t, 7.2, 7.75))]] : (t > 9 ? [[440, G - 150], [500, G - 150]] : [[520, 1110], [560, 1110]]));
      if (t > 9.2) text('…', 470, G - 470, 70, seg(t, 9.2, 9.5), 'Caveat', 700, ink);
    } else if (t < 14.6) { // S4 3am
      cap([[10.7, 14.5, 'attempt 3: 3am.']]);
      const BG = 1230;
      // moon
      cx.fillStyle = C.CREAM; cx.beginPath(); cx.arc(860, 860, 38, 0, 6.29); cx.fill(); cx.fillStyle = C.NIGHT; cx.beginPath(); cx.arc(878, 848, 34, 0, 6.29); cx.fill();
      // bed
      wline([[260, G], [260, 980], [300, 980], [300, BG]], 1.4, 6, ink);
      wline([[260, BG + 40], [960, BG + 40], [960, G]], 1.4, 6, ink);
      // figure sitting against headboard, wearing the hoodie
      const fx = 360;
      const f = figure(fx, 1, 0, 0, false, BG, ink, [[fx + 95, BG - 175], [fx + 120, BG - 185]]);
      hoodie(fx + 6, BG - 150, 0.85, ink, HOOD);
      wline([[f.top[0] + 20, f.top[1] + 40], [fx + 95, BG - 175]], 2, 7, ink); // arm over hoodie
      wline([[f.top[0] - 5, f.top[1] + 40], [fx + 120, BG - 185]], 2, 7, ink);
      // blanket over legs
      cx.fillStyle = C.NIGHT; cx.beginPath(); cx.moveTo(fx + 10, BG - 70); cx.quadraticCurveTo(fx + 200, BG - 150, fx + 560, BG - 60); cx.lineTo(fx + 590, BG + 40); cx.lineTo(fx + 10, BG + 40); cx.closePath(); cx.fill();
      wline([[fx + 10, BG - 70], [fx + 150, BG - 118], [fx + 330, BG - 112], [fx + 560, BG - 60], [fx + 590, BG + 40]], 1.6, 6, ink);
      // phone + glow
      const g = cx.createRadialGradient(fx + 115, BG - 200, 4, fx + 115, BG - 200, 170); g.addColorStop(0, 'rgba(170,190,255,.35)'); g.addColorStop(1, 'rgba(170,190,255,0)');
      cx.fillStyle = g; cx.fillRect(fx - 80, BG - 400, 400, 400);
      cx.fillStyle = '#DDE4FF'; cx.fillRect(fx + 98, BG - 236, 34, 58);
      // typing bubble
      const full1 = 'hey. i know it’s been a while but', full2 = 'i miss';
      let s = '';
      if (t < 12.8) s = full1.slice(0, Math.floor(seg(t, 11.0, 12.6) * full1.length));
      else if (t < 13.6) s = full1.slice(0, Math.floor((1 - seg(t, 12.9, 13.5)) * full1.length));
      else if (t < 14.2) s = full2.slice(0, Math.floor(seg(t, 13.7, 14.1) * full2.length));
      else s = full2.slice(0, Math.floor((1 - seg(t, 14.25, 14.5)) * full2.length));
      if (t > 10.9) post.push(() => {
        const bx = 540, by = 700, bw = 600, bh = 92;
        cx.fillStyle = '#2B6CF0'; cx.beginPath(); cx.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 40); cx.fill();
        const cursor = Math.floor(t * 3) % 2 ? '|' : '';
        text(s + cursor, bx - bw / 2 + 34, by + 2, 38, 1, 'Inter', 500, '#FFFFFF', 'left');
      });
    } else if (t < 19.2) { // S5 writes it out in Heartly
      cap([[14.7, 19.1, 'so he wrote it out instead.']]);
      const px = 540, py = 1085, pw = 540, ph = 860;
      cx.fillStyle = '#17120E'; cx.beginPath(); cx.roundRect(px - pw / 2, py - ph / 2, pw, ph, 56); cx.fill();
      cx.save(); cx.strokeStyle = C.CREAM; cx.lineWidth = 6; cx.beginPath(); cx.roundRect(px - pw / 2, py - ph / 2, pw, ph, 56); cx.stroke(); cx.restore();
      text('heartly', px, py - ph / 2 + 70, 48, 1, 'Caveat', 700, C.CREAM);
      const wrap = (str, maxW, size, weight) => { cx.font = `${weight} ${size}px Inter`; const out = []; let line = '';
        for (const w of str.split(' ')) { const tryL = line ? line + ' ' + w : w; if (cx.measureText(tryL).width > maxW) { out.push(line); line = w } else line = tryL } if (line) out.push(line); return out; };
      const entry = 'i still sleep in her hoodie. i don’t even think i miss her. i miss who i was with her.';
      const n = Math.floor(seg(t, 15.0, 16.7) * entry.length);
      text('you', px - pw / 2 + 50, py - 280, 26, seg(t, 14.9, 15.1), 'Inter', 600, '#9C8E80', 'left');
      wrap(entry.slice(0, n), pw - 100, 34, 500).forEach((l, i) => text(l, px - pw / 2 + 50, py - 230 + i * 48, 34, 1, 'Inter', 500, C.CREAM, 'left'));
      const reply = 'so maybe the hoodie isn’t about her. it’s about the version of you that felt held. let’s start there.';
      if (t > 16.9) {
        text('heartly', px - pw / 2 + 50, py + 10, 26, seg(t, 16.9, 17.2), 'Inter', 600, '#9C8E80', 'left');
        wrap(reply, pw - 100, 34, 500).forEach((l, i) => text(l, px - pw / 2 + 50, py + 60 + i * 48, 34, seg(t, 17.0 + i * 0.35, 17.4 + i * 0.35), 'Inter', 500, HOOD, 'left'));
      }
    } else { // S6 morning
      cap([[19.3, 21.1, 'day 95.'], [21.2, 23.4, 'you don’t throw it away.\nyou let it go.']]);
      wline([[60, G], [1020, G]], 1.8, 5, ink);
      // shop
      const sx = 840; wline([[sx - 100, G], [sx - 100, G - 340], [sx + 100, G - 340], [sx + 100, G]], 1.6, 6, ink);
      wline([[sx - 130, G - 440], [sx + 130, G - 440], [sx + 130, G - 370], [sx - 130, G - 370], [sx - 130, G - 440]], 1.4, 5, ink);
      text('charity shop', sx, G - 405, 46, 1, 'Caveat', 700, ink);
      // donation box
      const bx = 620; wline([[bx - 80, G], [bx - 80, G - 190], [bx + 80, G - 190], [bx + 80, G]], 1.4, 6, ink);
      wline([[bx - 45, G - 160], [bx + 45, G - 160]], 0.8, 8, ink);
      text('donations', bx, G - 95, 36, 1, 'Caveat', 600, ink);
      // sun
      cx.strokeStyle = C.EMBER; cx.lineWidth = 6; cx.beginPath(); cx.arc(200, 700, 50, 0, 6.29); cx.stroke();
      for (let i = 0; i < 8; i++) { const a = i / 8 * 6.29 + t * .3; wline([[200 + Math.cos(a) * 70, 700 + Math.sin(a) * 70], [200 + Math.cos(a) * 95, 700 + Math.sin(a) * 95]], .8, 5, C.EMBER); }
      let fx, ph = 0, hold = true, hx, hy;
      if (t < 20.6) { fx = lerp(180, 470, ease(seg(t, 19.2, 20.6))); ph = (t - 19.2) * 7; hx = fx + 100; hy = 1120; }
      else if (t < 21.2) { fx = 470; const k = ease(seg(t, 20.6, 21.1)); hx = lerp(570, bx, k); hy = lerp(1120, G - 170, k); if (t > 21.05) hold = false; }
      else { fx = 470 - Math.pow(t - 21.2, 1.1) * 260; ph = (t - 21.2) * 8; hold = false; }
      if (hold) folded(hx, hy);
      figure(fx, 0, ph, 0, false, G, ink, hold ? [[hx - 40, hy], [hx + 40, hy]] : null, t > 21.2 ? 1 : 0);
    }
    if (scaled) cx.restore();
    post.forEach(f => f());
    captions(t, capList, 440, 80, ink);
    // quick dip between scenes
    for (const b of [3.2, 7.0, 10.6, 14.6, 19.2]) { const d = 1 - Math.abs(t - b) / 0.12; if (d > 0) { cx.fillStyle = `rgba(20,16,13,${d * .85})`; cx.fillRect(0, 0, W, H); } }
  }
};
