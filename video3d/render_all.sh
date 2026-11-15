#!/bin/sh
# ./render_all.sh Comp:name ...   renders each composition, adds out/<name>_vo.wav (or out/vo.wav for worry), writes out/final/<name>.mp4
B=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
mkdir -p out/final
for pair in "$@"; do
  C=${pair%%:*}; N=${pair##*:}
  WAV=out/${N}_vo.wav; [ "$N" = "worry_3am" ] && WAV=out/vo.wav
  echo "START $N $(date +%H:%M)" >> out/queue.log
  npx remotion render $C out/raw_$N.mp4 --muted --browser-executable=$B --gl=swangle --concurrency=2 --crf=20 --log=error >> out/queue.log 2>&1 \
   && ffmpeg -v error -y -i out/raw_$N.mp4 -i $WAV -map 0:v -map 1:a -c:v libx264 -crf 22 -preset medium -pix_fmt yuv420p -c:a aac -b:a 160k -shortest -movflags +faststart out/final/$N.mp4 \
   && echo "DONE $N $(date +%H:%M)" >> out/queue.log || echo "FAIL $N $(date +%H:%M)" >> out/queue.log
done
echo "ALL DONE $(date +%H:%M)" >> out/queue.log
