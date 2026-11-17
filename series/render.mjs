// node render.mjs ep01 [--stills t1 t2 ...]   Draws every frame in the browser and pipes it to ffmpeg with the audio.
import { createRequire } from "module"; import fs from "fs"; import { spawn } from "child_process";
const require = createRequire(import.meta.url); const { chromium } = require("playwright");
const ep = process.argv[2], si = process.argv.indexOf("--stills"), timing = JSON.parse(fs.readFileSync(`episodes/${ep}.timing.json`));
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell", args: ["--allow-file-access-from-files"] });
const p = await b.newPage(); p.on("pageerror", (e) => console.log("ERR", e.message));
await p.goto("file://" + process.cwd() + "/ep.html?render=1&ep=" + ep); await p.waitForFunction(() => document.title === "ready"); await p.evaluate((t) => window.setup(t), timing);
const grab = async (t) => Buffer.from((await p.evaluate((x) => window.frame(x), t)).split(",")[1], "base64");
if (process.argv.includes("--sheet")) { // one still per shot, 60% of the way through it, as contact sheets of 9
  const n = timing.starts.length, per = 9; fs.mkdirSync("out/sh", { recursive: true });
  for (let i = 0; i < n; i++) fs.writeFileSync(`out/sh/${String(i).padStart(2, "0")}.jpg`, await grab(timing.starts[i] + timing.durs[i] * 0.6));
  const { execSync } = await import("child_process");
  for (let k = 0; k * per < n; k++) { const ins = []; for (let i = k * per; i < Math.min(n, (k + 1) * per); i++) ins.push(`-i out/sh/${String(i).padStart(2, "0")}.jpg`); execSync(`ffmpeg -v error -y ${ins.join(" ")} ${ins.length > 1 ? `-filter_complex "hstack=inputs=${ins.length},scale=${220 * ins.length}:-1"` : `-vf scale=220:-1`} out/${ep}_sheet${k + 1}.jpg`); }
} else if (si > 0) { for (const t of process.argv.slice(si + 1)) fs.writeFileSync(`out/still_${t}.jpg`, await grab(+t)); }
else {
  const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", "30", "-c:v", "mjpeg", "-i", "-", "-i", `out/${ep}_audio.wav`, "-c:v", "libx264", "-crf", "20", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", `out/${ep}.mp4`], { stdio: ["pipe", "inherit", "inherit"] });
  const n = Math.round(timing.total * 30);
  for (let f = 0; f < n; f++) { const buf = await grab(f / 30); if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r)); if (f % 150 === 0) fs.appendFileSync("out/render.log", `frame ${f}/${n}\n`); }
  ff.stdin.end(); await new Promise((r) => ff.on("close", r)); fs.appendFileSync("out/render.log", "DONE\n");
}
await b.close();
