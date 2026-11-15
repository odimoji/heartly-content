#!/bin/sh
# ./stills.sh <CompositionId> 10 120 300 ...  -> out/<CompositionId>_sheet.jpg (frames at 0.4 size, side by side)
B=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
C=$1; shift
mkdir -p out/st_$C; rm -f out/st_$C/*.png
for f in "$@"; do npx remotion still $C out/st_$C/$(printf %05d $f).png --frame=$f --browser-executable=$B --gl=swangle --scale=0.4 --log=error || exit 1; done
python3 - "$C" <<'PY'
import glob, sys
from PIL import Image
c=sys.argv[1]; fs=sorted(glob.glob(f'out/st_{c}/*.png')); ims=[Image.open(f).convert('RGB') for f in fs]
w,h=ims[0].size; s=Image.new('RGB',(w*len(ims),h))
for i,im in enumerate(ims): s.paste(im,(i*w,0))
s.save(f'out/{c}_sheet.jpg',quality=88)
PY
