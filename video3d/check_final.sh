#!/bin/sh
# ./check_final.sh <name> <bitrate k> t1 t2 ...  -> prints size/duration/volume, writes out/chk_<name>/sheet.jpg and out/upload/<name>.mp4 (under 10 MB for the browser upload)
N=$1; BR=$2; shift 2
F=out/final/$N.mp4; D=out/chk_$N; mkdir -p $D out/upload
ls -la $F | awk '{print "bytes",$5}'; ffprobe -v error -show_entries format=duration -of csv=p=0 $F
ffmpeg -hide_banner -i $F -af volumedetect -vn -f null - 2>&1 | grep -E "mean_volume" | sed 's/.*\] //'
i=0; for t in "$@"; do i=$((i+1)); ffmpeg -v error -y -ss $t -i $F -frames:v 1 -vf scale=324:-1 $D/f_$(printf %02d $i).jpg; done
python3 - $D <<'PY'
import glob, sys
from PIL import Image
d=sys.argv[1]; fs=sorted(glob.glob(d+'/f_*.jpg')); ims=[Image.open(f) for f in fs]
w,h=ims[0].size; s=Image.new('RGB',(w*len(ims),h))
for i,im in enumerate(ims): s.paste(im,(i*w,0))
s.save(d+'/sheet.jpg',quality=85)
PY
ffmpeg -v error -y -i $F -c:v libx264 -b:v ${BR}k -preset slow -pass 1 -passlogfile $D/p -an -f null /dev/null && ffmpeg -v error -y -i $F -c:v libx264 -b:v ${BR}k -preset slow -pass 2 -passlogfile $D/p -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart out/upload/$N.mp4 && ls -la out/upload/$N.mp4 | awk '{print "upload bytes",$5}'
