// Usage:
//   node engine/render.mjs scenes/<name>.js                 -> out/<name>.mp4 (full render)
//   node engine/render.mjs scenes/<name>.js --stills 1 4.5  -> out/<name>_sheet.jpg (check frames)
import { chromium } from 'playwright';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [sceneArg, flag, ...times] = process.argv.slice(2);
const name = path.basename(sceneArg, '.js');
const exe = ['/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].find(p => fs.existsSync(p));
const browser = await chromium.launch({ executablePath: exe, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto('file://' + path.join(root, 'engine/page.html') + '?scene=' + name + '.js');
await page.waitForFunction(() => window.SCENE);
await page.evaluate(async () => {
  await Promise.all(['700 40px Caveat', '600 40px Caveat', '300 40px Inter', '400 40px Inter', '500 40px Inter', '600 40px Inter', '700 40px Inter'].map(f => document.fonts.load(f)));
  await document.fonts.ready;
});
// optional time warp written by engine/narrate.py: video time -> scene time (piecewise linear knots)
const tf = path.join(root, 'scenes', name + '.timing.json');
const warp = fs.existsSync(tf) && !process.env.NO_WARP ? JSON.parse(fs.readFileSync(tf, 'utf8')).map : null;
const toScene = tv => { if (!warp) return tv; for (let i = 0; i < warp.length - 1; i++) { const [v0, s0] = warp[i], [v1, s1] = warp[i + 1]; if (tv <= v1) return s0 + (s1 - s0) * (tv - v0) / (v1 - v0); } return warp[warp.length - 1][1]; };
const el = await page.$('#c');
const out = path.join(root, 'out'); fs.mkdirSync(out, { recursive: true });

if (flag === '--stills') {
  const files = [];
  for (const t of times) {
    await page.evaluate(t => window.render(t), toScene(Number(t)));
    const f = path.join(out, `_still_${t}.jpg`); await el.screenshot({ path: f, type: 'jpeg', quality: 85 }); files.push(f);
  }
  await browser.close();
  execFileSync('python3', ['-c', `
import sys
from PIL import Image
fs=sys.argv[1:-1];ims=[Image.open(f).resize((360,640)) for f in fs]
s=Image.new('RGB',(360*len(ims),640))
for i,im in enumerate(ims): s.paste(im,(i*360,0))
s.save(sys.argv[-1],quality=85)`, ...files, path.join(out, `${name}_sheet.jpg`)]);
  files.forEach(f => fs.unlinkSync(f));
} else {
  const dur = warp ? warp[warp.length - 1][0] : await page.evaluate(() => window.SCENE.duration), fps = 30;
  const dir = path.join(out, `_frames_${name}`); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
  for (let i = 0; i < Math.round(dur * fps); i++) {
    await page.evaluate(t => window.render(t), toScene(i / fps));
    await el.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92 });
  }
  await browser.close();
  const tmp = path.join(out, `_tmp_${name}.mp4`), final = path.join(out, `${name}.mp4`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', '30', '-i', path.join(dir, 'f%04d.jpg'), '-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', tmp]);
  fs.renameSync(tmp, final); fs.rmSync(dir, { recursive: true, force: true });
  console.log(final);
}
