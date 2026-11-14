# Heartly content: rules for every session

Odi runs Heartly (iPhone app: you write out what you can't stop thinking about, it reflects back what's underneath and walks you through letting it go). This repo makes its TikTok content. Odi sets direction and approves; Claude makes the videos.

## What a good video is (Odi's direction, 14 Nov 2026)
- Entertaining first. Top-of-funnel: built to get views and shares, not to sell.
- Tell a story. Take the viewer on a journey with a character, setup → struggle → turn → release. Humour and recognisable pain ("day 94 of trying to throw out her hoodie").
- Heartly appears inside the story as the tool the character reaches for at the turning point. Never an ad: no end card pitch, no "Heartly helps you…" lines.
- Subtle CTA (Odi, 14 Nov 2026): the narrator names Heartly once, as what the character does at the turn ("so she opened Heartly and wrote out what was really going on"), then lets the reply show what it does. Name also in the caption.
- Faceless. Model the winners in the niche: animated micro-stories (Pixar-style, simple line-drawn metaphor stories) get 100K–1M likes.
- Never: AI people posing as real users, fake testimonials, fake reviews, fake app screenshots presented as real. A drawn phone showing a plausible Heartly reply inside a story is fine.
- Nothing is the final brand identity yet. The stick-figure world is the first test; iterate on what the numbers say.

## Format
- 1080×1920, 30 fps, 15–30 s.
- Narrated (Odi, 14 Nov 2026): British male storyteller voice (Kokoro `bm_george`, speed 1.2). The narration tells the story, wry and warm, more than the captions say. A trending sound can go underneath on TikTok at low volume.
- Hook in the first second, on screen.
- Safe area: keep text and key action between y=300 and y=1500, away from the right 140 px.
- Lowercase, conversational captions on screen (Caveat), short.

## How to make one
- Write a scene in `scenes/<name>.js` using `engine/lib.js` (see `scenes/hoodie.js` for a story).
- Check frames first: `node engine/render.mjs scenes/<name>.js --stills 1 5 9 …`, look at `out/<name>_sheet.jpg`, fix, then render: `node engine/render.mjs scenes/<name>.js`.
- Narrate: write `scenes/<name>.narration.json` (lines per scene segment), then `KOKORO_DIR=~/tts python3 engine/narrate.py scenes/<name>.narration.json`. It speaks the lines, writes `scenes/<name>.timing.json` (stretches each segment so the voice fits; render.mjs reads it), renders, and muxes the audio into `out/<name>.mp4`. Add `--plan` to only print timings. Keep the total ≤30 s.
- Narration setup: `pip install kokoro-onnx soundfile --break-system-packages`, then download `kokoro-v1.0.onnx` and `voices-v1.0.bin` from github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0 into ~/tts (Hugging Face is blocked here; GitHub works).
- Setup in a fresh session: `npm i @fontsource/caveat @fontsource/inter playwright` (Chrome at /usr/bin/google-chrome).
- Log every video in `tracker/posts.csv`. Commit and push scenes and tracker after every batch.

## Posting
- Never post or schedule to TikTok without Odi's explicit yes in that same chat, per batch.
- On his yes, schedule in TikTok Studio (tiktok.com/tiktokstudio) in his Chrome via Claude in Chrome, spaced across the next day from 08:30 UK.
- Numbers come from the Windsor.ai connector (tiktok_organic, account heartly.ai). Judge on views, shares, saves and profile visits.
