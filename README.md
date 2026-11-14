# heartly-content

Heartly's content engine: short vertical videos (1080×1920, 30 fps) drawn in code and rendered with headless Chrome + ffmpeg.

## Render
```
npm i @fontsource/caveat @fontsource/inter playwright
node engine/render.mjs scenes/doors.js                 # -> out/doors.mp4
node engine/render.mjs scenes/doors.js --stills 1 5 9  # -> out/doors_sheet.jpg (check frames)
```

## Layout
- `engine/lib.js`: shared drawing kit (hand-drawn lines with boil, stick figure, ball and chain, bubbles, captions, end card, palette).
- `engine/page.html`, `engine/render.mjs`: loads a scene and renders it.
- `scenes/*.js`: one file per video. Each sets `window.SCENE = { duration, render(t) }`.
- `tracker/posts.csv`: every post, its series, and its numbers.

## Series (v0, testing)
A. The one carrying it (stick figure + ball). B. 3am brain (kinetic type). C. Unsent (phone UI). D. Pick a door (comment-bait, mirrors onboarding Q1). E. Letters you'll never send. F. Why you keep checking (psychology explainers). G. Day 1 vs day 30. H. What Heartly heard (real app entries and replies).

## Rules
- Faceless. No AI people posing as real users; no fake testimonials or fake screenshots.
- Keep text inside TikTok's safe area: nothing important above y=300 or below y=1500, or in the right 140 px.
- Every video ends on the Heartly card. No audio in the file; a trending sound is added in TikTok.
