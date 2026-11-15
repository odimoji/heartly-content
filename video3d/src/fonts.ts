import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

let ready = false;
const waiters: (() => void)[] = [];
if (typeof document !== "undefined") {
  Promise.all([
    new FontFace("Caveat", `url(${staticFile("fonts/caveat-700.woff2")})`, { weight: "700" }).load(),
    new FontFace("Inter", `url(${staticFile("fonts/inter-500.woff2")})`, { weight: "500" }).load(),
    new FontFace("Inter", `url(${staticFile("fonts/inter-600.woff2")})`, { weight: "600" }).load(),
  ]).then((fs) => {
    fs.forEach((f) => document.fonts.add(f));
    ready = true;
    waiters.forEach((w) => w());
  });
}

// true once Caveat and Inter are usable (also for text drawn onto canvas textures)
export const useFontsReady = () => {
  const [ok, setOk] = useState(ready);
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    if (ready) setOk(true);
    else waiters.push(() => setOk(true));
  }, []);
  useEffect(() => {
    if (ok) continueRender(handle);
  }, [ok, handle]);
  return ok;
};
