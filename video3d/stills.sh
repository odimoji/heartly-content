#!/bin/sh
# ./stills.sh 10 120 300 ...  -> out/sheet.jpg (frames at half size, side by side)
B=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
mkdir -p out/st; rm -f out/st/*.png
for f in "$@"; do npx remotion still Worry3am out/st/$(printf %05d $f).png --frame=$f --browser-executable=$B --gl=swangle --scale=0.4 --log=error || exit 1; done
python3 - <<'PY'
import glob
from PIL import Image
fs=sorted(glob.glob('out/st/*.png')); ims=[Image.open(f).convert('RGB') for f in fs]
w,h=ims[0].size; s=Image.new('RGB',(w*len(ims),h))
for i,im in enumerate(ims): s.paste(im,(i*w,0))
s.save('out/sheet.jpg',quality=88)
PY
