#!/bin/bash
# after a render: check the file, commit and push. usage: ./finish.sh ep02 "message"
cd "$(dirname "$0")"; ep=$1
ffprobe -v error -show_entries format=duration -of csv=p=0 out/$ep.mp4
ffmpeg -hide_banner -i out/$ep.mp4 -af volumedetect -vn -f null - 2>&1 | grep -E "mean_volume|max_volume" | sed 's/.*] //'
cd .. && git add -A CLAUDE.md scripts series && git commit -qm "$2

Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01M5B2pZ1q45jyeAdpQNBRdB" && git push -q 2>&1 | tail -1; git log --oneline | head -1
