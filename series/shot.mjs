// node series/shot.mjs <page.html> <out.png>  : opens the page, waits for title "done", saves the canvas
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const [page_, out] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell", args: ["--allow-file-access-from-files"] });
const p = await b.newPage();
p.on("console", (m) => console.log("page:", m.text())); p.on("pageerror", (e) => console.log("ERR", e.message));
await p.goto("file://" + process.cwd() + "/" + page_);
await p.waitForFunction(() => document.title === "done", null, { timeout: 60000 });
const c = await p.$("canvas"); await c.screenshot({ path: out });
await b.close(); console.log("saved", out);
