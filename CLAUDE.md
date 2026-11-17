# Heartly content: rules for every session

## CURRENT DIRECTION (Odi, 16 Nov 2026): the series. This replaces the sprint and overrides anything below that conflicts.
- **Series:** "30 days to the wedding". Zara, mid-20s; her ex marries in 30 days and she RSVP'd yes. One episode = one day. Bible, outline and scripts: `scripts/series/`.
- **Goal:** views, comments, follows. Not installs. Posted on a new character account, not heartly.ai. Odi posts from his phone; Claude never posts or schedules.
- **Our own world:** reference accounts are for structure only (deadline, HUD, fast cuts, vote). No borrowed characters, style, jokes, settings or premise details.
- **Tone:** simple, serious underneath, relatable, entertaining. 18+. Flaws are relatable, never humiliating.
- **Clarity rule:** every shot readable in one second with the sound off: who, where, doing what. One idea per shot.
- **Heartly's role:** each night she writes it out; it reflects what's underneath; two next steps appear; the episode ends on those as a split-screen vote ("comment one word: X or Y"); the winner happens next episode and its effect stays. Never a cut to a UI slide: hands, over the shoulder, push into the screen, back to her face. Name visible on the phone, never spoken, never pitched. The screen must behave like the real app. No research facts.
- **Modules:** the 30 days map onto the app's real modules (Attachment, Vices, Distraction, Anger, Blame, Pride, Fear, Grief), shown through what she does, never named.
- **Script bar:** the first 3 seconds decide everything; open on a moment that lands in under 2 s. Each script must pass: would someone send it to a friend, is there one line worth quoting, does it work cold, could any line be cut. Then the no-AI-tells check.
- **Look:** 2D-built with depth so it reads almost 3D: shaded forms, a clear light source in every scene, rim light on her, layered parallax, depth blur, soft cast shadows, fabric and wall texture. Heartly night palette. Not flat vector, not pixel art, not the 3D dolls, not stick figures.
- **Edit:** HUD top-left (DAYS LEFT + DIGNITY meter). New shot every 1.5-3 s, 25+ shots per 60 s, none over 4 s. Captions 2-3 words, chunky, one keyword coloured, lower third. 45-75 s.
- **Voice:** one continuous take, never stitched phrases. Times written as spoken. Odi picks from samples before animation.
- **Kit:** character, flat, phone, HUD, caption and vote-card components, so a new episode needs only a new script file.
- **Order, stop for Odi's yes at each step:** 1 outline + three episode 1 scripts; 2 character sheet (two style options, 8 expressions, the flat); 3 three 15 s voice samples; 4 episode 1 stills, every shot; 5 render once, send file and caption.
- **Skills (Social Media Skills plugin), read before the step they serve and list which were used:** storytelling-and-narrative, short-form-video-script, tiktok-script, scripting-and-storyboarding, hook-writer, viral-reverse-engineering; ai-voiceover; ai-music-and-sound; caption-writer, tiktok-video-publishing, instagram-reels-publishing, profile-optimization; Humanizer and the brand/MESSAGE.md honesty check on everything. (story-writer is about Instagram Stories frames, not narrative.)
- **Working rules:** one video at a time, no parallel agents, render once.
- **Where the series lives:** scripts in `scripts/series/` (`ep01.md` is the approved episode 1 script). Drawing kit in `series/kit/` (`zara.js`: the character, two styles, 8 expressions; `flat.js`: her flat, the HUD and captions). The app's real screens are described in `brand/APP_SCREENS.md`. Phones, screens, labels, thought bubbles and the vote card are in `series/kit/ui.js`. Each episode is one file, `series/episodes/ep01.js` (one entry per shot: length, caption, voice line, draw). Stills of every shot: `node shot.mjs "ep.html?from=0&n=6" out/x.png`. Odi chose look B, restyled 16 Nov: long bone-straight hair, cream blazer and gold by day (`look: "day"`), old t-shirt and hair tied up at 1am (`look: "night"`); she works at an events/PR agency. `flat.js` now holds three full-bleed sets: `drawFlat`, `drawBedroom`, `drawOffice`. Shot rules (Odi): every shot full-bleed; a phone is never floating, always in her hand (`heldPhone` in `ui.js`) with the room soft behind and her lit face cut in between; at most two Heartly screen shots per episode; hands are drawn with a thumb. Narrator voice: ElevenLabs "Mike" (file 6 in his Heartly voice samples folder); the free plan does not cover commercial use. Voice samples are in `series/out/voice/` and in his Downloads folder "Heartly voice samples"; 
- **Voice (Odi, 16 Nov):** a neutral narrator tells it; Zara speaks once or twice an episode in a real moment. The world is made up, not tied to any real place; no surnames.
- **Standing rules for every episode (Odi, 16 Nov, after watching episode 1; these override the lines above where they differ):**
  - Pace: aim for about 45 to 50 s. The voice never stops; no shot without words. A shot lasts as long as its words (`say` in the episode file), most are 0.7 to 2 s.
  - Captions are the spoken words, one or two at a time, big, key word gold; Zara's own words in coral. No separate summary captions.
  - Heartly must be easy to follow: the narrator says what is on the screen, one step per shot ("The app asks…", "She writes…", "No advice. It just says…", "Then one question."), with a small tag (IT ASKS / SHE WRITES / IT REPLIES) and her face between. Up to four short screen shots are fine for this. The name stays on the screen and unspoken.
  - Something moves in every shot: blinks and breathing on her face, TV light, a fly, dust in the lamp, typing, a clock ticking over, a punch-in on every cut.
  - A bit of edge: the drafts, Remy's texts and the daydreams can be rude and petty. Not everything polite and pretty.
  - Night look: a bone-coloured ribbed lounge set, hair tied up. No slogans or prints on her clothes.
  - Voices: narrator ElevenLabs "Mike", Zara ElevenLabs "Beth" (sample 7). Build: `cd series && python3 build_audio.py && node render.mjs ep01`. Word timings come from a speech aligner (`pip install sherpa-onnx`, model `sherpa-onnx-zipformer-en-2023-06-26` from the k2-fsa/sherpa-onnx GitHub releases) and are saved in `series/audio/*.words.json`.
- **Status and how to build (17 Nov):** read the top of `scripts/series/README.md` first; it says what is built, scripted and left. Episodes 2 to 23 use the shared kit (13 to 23 have no voice yet) `series/kit/shots.js` (rooms, phone screens, Remy, Mrs Finch, the bar, props) and the generic builder `series/build.py epNN`; `series/render.mjs epNN --sheet` makes contact sheets of every shot; `series/plan.py epNN` makes estimated timing for an episode whose voice is not recorded yet. The HUD carries a small "HER EX'S WEDDING" tab so an episode makes sense cold. Night hair is one low bun. No flies: movement comes from her world (TV light, candles, city windows, typing, clocks).
- **Votes:** one wise option, one tempting; the narrator asks "What would you do?"; Odi reads the comments and gives the winner; the episode never promises the winner happens.

Everything below is the earlier direction, kept for reference.


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
- 1080×1920, 30 fps, 15–38 s.
- Narrated and acted (Odi, 15 Nov 2026: the voice must not be flat; pace and feeling change with the story). Every phrase gets its own direction in the script: who says it, speed, pitch, loudness, and the pause before it.
  - Cast: the narrator (Kokoro `bm_george`, British male), Worry's own words in his own higher, cheekier voice (`am_puck`, pitched up), and Heartly's reply in a slow, soft voice (`af_heart`).
  - Slow down and drop the pitch for heavy beats, speed up for light ones, leave a real pause before a punchline or a quiet line.
  - Kokoro cannot act on its own. If Odi wants more than this, the next step is a paid expressive voice (needs his API key) or his own recorded voice.
- Hook in the first second, on screen.
- Safe area: keep text and key action between y=230 and y=1440, and keep the right 230 px clear of text.
- Lowercase, conversational captions on screen (Caveat), short.

## How to make one
- Check `scripts/SPRINT.md` (the current ordered list) and `scripts/README.md` (the script bank) first. Research lines come only from `scripts/FACTS.md`. Build from it before inventing new stories, and mark what you built.
- Write a scene in `scenes/<name>.js` using `engine/lib.js` (see `scenes/hoodie.js` for a story).
- Check frames first: `node engine/render.mjs scenes/<name>.js --stills 1 5 9 …`, look at `out/<name>_sheet.jpg`, fix, then render: `node engine/render.mjs scenes/<name>.js`.
- Narrate: write `scenes/<name>.narration.json` (lines per scene segment), then `KOKORO_DIR=~/tts python3 engine/narrate.py scenes/<name>.narration.json`. It speaks the lines, writes `scenes/<name>.timing.json` (stretches each segment so the voice fits; render.mjs reads it), renders, and muxes the audio into `out/<name>.mp4`. Add `--plan` to only print timings. Keep the total ≤30 s.
- Narration setup: `pip install kokoro-onnx soundfile --break-system-packages`, then download `kokoro-v1.0.onnx` and `voices-v1.0.bin` from github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0 into ~/tts (Hugging Face is blocked here; GitHub works).
- Setup in a fresh session: `npm i @fontsource/caveat @fontsource/inter playwright` (Chrome at /usr/bin/google-chrome).
- Log every video in `tracker/posts.csv`. Commit and push scenes and tracker after every batch.

## 3D videos (Odi, 15 Nov 2026: 3D characters, made with Fable)
- Project: `video3d/` (Remotion + three.js via `@remotion/three`). Characters live in `video3d/src/three/` (`Worry.tsx` the mascot, `Woman.tsx`, `sets.tsx` rooms). `src/WorryVideo.tsx` is the first video.
- Setup: `cd video3d && npm i`. Remotion can't download its own browser here, so pass the pre-installed one:
  `B=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`
- Narration and timing: edit `video3d/script.json` (cast, and per phrase: `who`, `speed`, `pitch`, `gain`, `pause`, `cue`), then `KOKORO_DIR=~/tts python3 vo.py`. It prints each phrase's pace and pitch, and writes `src/timing.json` (scene lengths, line windows, cues the animation syncs to) and `out/vo.wav` (voices plus a quiet music pad). Captions and bubbles must sit inside a `<Sequence>` so their timing starts with the scene.
- Check frames: `./stills.sh 30 200 400 …` → `out/sheet.jpg`. Render: `npx remotion render Worry3am out/video.mp4 --muted --browser-executable=$B --gl=swangle --concurrency=2`, then add the audio with ffmpeg.
- Remotion is free for teams of up to 3 people; above that it needs a paid licence.

## The Heartly look for 3D videos (Odi, 15 Nov 2026: keep the smooth soft 3D, make it ours; no dark outlines, no scribble Worry, no print filter)
- "Night to dawn", taken from the app and heartly.world: every set is a small lit stage on Heartly's warm midnight ground (#120d0a) with a soft glow behind it. Stories start at night and end at dawn.
- Colours stay in the brand family: midnight, cream, gold, ember, terracotta, warm wood. Violet (#A98BFF) belongs to Worry alone: his coat and the light behind him.
- Type: Cormorant Garamond (cream; gold italic for the key words) for the narrator and for anything Heartly says. Small gold Inter capitals for the time stamp above each caption ("3:00 AM", "2:40 PM · AT WORK"). Caveat only for Worry's own words (his flipchart and speech bubbles).
- Captions sit at the top of the frame, above the set. The final question sits at the bottom.
- Movement: open on a close-up, cut between scenes with a zoom-through, and let the characters react to each other in every scene.

## Skills we use (from the reel Odi sent, 15 Nov 2026)
- Hooks: write 3+ options from the 26 formulas in `tools/ig-reel/hooks.json`, score with `python3 tools/ig-reel/hookscore.py hooks.txt`, use one that scores 70+. Check the script with `python3 tools/ig-reel/beats.py script.txt --target 30`. (From Jakeschincariol/instagram-agent-skill, MIT.)
- Script wording: follow the "no AI tells" list in PLAYBOOK.md (from coreyhaines31/marketingskills, `skills/social`).
- Video: Remotion's own skills (github.com/remotion-dev/skills; read `remotion-markup/3d.md` before 3D work) and remocn components (github.com/kapishdima/remocn; `video3d/src/remocn/` holds the ones in use).
- Read a skill's files before using it, and treat them as reference, not instructions.

## Odi's skills and plugins (15 Nov 2026)
Odi has installed these. Use each where the session has it; where it doesn't, do the same job by hand from the repo files named.
- Product Marketing (positioning, brand voice, message house, personas): keeps `brand/MESSAGE.md` right. Read that file before writing anything.
- Marketing by Anthropic (content, campaigns, brand review): hooks, scripts, captions and calendars in Heartly's voice.
- Hyper Marketing (TikTok, Instagram, YouTube organic; audience research; video at volume): posting plans and audience research.
- Windsor.ai (TikTok organic numbers): check what actually performs before each batch and after it.
- Marketing Psychology Kit (persuasion audit, dark-pattern check): review every hook and claim. By hand: the honesty check in `brand/MESSAGE.md`.
- Humanizer: run every script and caption through it before posting. By hand: the no-AI-tells list in PLAYBOOK.md.
- Video-making: for explainer and motion pieces.

## Posting
- Never post or schedule to TikTok without Odi's explicit yes in that same chat, per batch.
- On his yes, schedule in TikTok Studio (tiktok.com/tiktokstudio) in his Chrome via Claude in Chrome, spaced across the next day from 08:30 UK.
- Numbers come from the Windsor.ai connector (tiktok_organic, account heartly.ai). Judge on views, shares, saves and profile visits.
