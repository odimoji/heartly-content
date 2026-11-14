# Heartly content: rules for every session

Odi runs Heartly (iPhone app: you write out what you can't stop thinking about, it reflects back what's underneath and walks you through letting it go). This repo makes its TikTok content. Odi sets direction and approves; Claude makes the videos.

## What a good video is (Odi's direction, 14 Nov 2026)
- Entertaining first. Top-of-funnel: built to get views and shares, not to sell.
- Tell a story. Take the viewer on a journey with a character, setup → struggle → turn → release. Humour and recognisable pain ("day 94 of trying to throw out her hoodie").
- Heartly appears inside the story as the tool the character reaches for at the turning point, for a second or two. Never an ad: no end card pitch, no "Heartly helps you…" lines. The name goes in the caption and bio, not shouted in the video.
- Faceless. Model the winners in the niche: animated micro-stories (Pixar-style, simple line-drawn metaphor stories) get 100K–1M likes.
- Never: AI people posing as real users, fake testimonials, fake reviews, fake app screenshots presented as real. A drawn phone showing a plausible Heartly reply inside a story is fine.
- Nothing is the final brand identity yet. The stick-figure world is the first test; iterate on what the numbers say.

## Format
- 1080×1920, 30 fps, 15–30 s, no audio in the file (a trending sound is added on TikTok).
- Hook in the first second, on screen.
- Safe area: keep text and key action between y=300 and y=1500, away from the right 140 px.
- Lowercase, conversational captions on screen (Caveat), short.

## How to make one
- Write a scene in `scenes/<name>.js` using `engine/lib.js` (see `scenes/hoodie.js` for a story).
- Check frames first: `node engine/render.mjs scenes/<name>.js --stills 1 5 9 …`, look at `out/<name>_sheet.jpg`, fix, then render: `node engine/render.mjs scenes/<name>.js`.
- Setup in a fresh session: `npm i @fontsource/caveat @fontsource/inter playwright` (Chrome at /usr/bin/google-chrome).
- Log every video in `tracker/posts.csv`. Commit and push scenes and tracker after every batch.

## Posting
- Never post or schedule to TikTok without Odi's explicit yes in that same chat, per batch.
- On his yes, schedule in TikTok Studio (tiktok.com/tiktokstudio) in his Chrome via Claude in Chrome, spaced across the next day from 08:30 UK.
- Numbers come from the Windsor.ai connector (tiktok_organic, account heartly.ai). Judge on views, shares, saves and profile visits.
