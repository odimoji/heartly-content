#!/bin/sh
# ./render_one.sh <CompositionId> <name> <audio wav in out/>  -> out/final/<name>.mp4 (render once, add the voice track)
B=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
C=$1; N=$2; W=$3
mkdir -p out/final
echo "START $N $(date -u +%H:%M)" >> out/queue.log
npx remotion render $C out/raw_$N.mp4 --muted --browser-executable=$B --gl=swangle --concurrency=2 --crf=20 --log=error >> out/queue.log 2>&1 \
 && ffmpeg -v error -y -i out/raw_$N.mp4 -i out/$W -map 0:v -map 1:a -c:v libx264 -crf 22 -preset medium -pix_fmt yuv420p -c:a aac -b:a 160k -shortest -movflags +faststart out/final/$N.mp4 \
 && echo "DONE $N $(date -u +%H:%M)" >> out/queue.log || echo "FAIL $N $(date -u +%H:%M)" >> out/queue.log
