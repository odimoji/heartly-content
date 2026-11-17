# 30 days to the wedding: series bible and season outline

<!-- STATUS:START -->
## Where we are (updated by Claude at the end of the overnight run, 17 Nov)
- **Built, rendered once and sent (mp4 + caption in Downloads > Zara episodes; also `series/out/epNN.mp4` here, not in git):** episodes 2 to 12. Episode 1 (v2) was sent earlier. Nothing is posted or scheduled.
- **Built up to the voice (only the narration is missing):** episodes 13 to 30 (eighteen): the whole season is now written and drawn. Script, every shot and the stills exist (`series/episodes/ep13.js` to `ep30.js`; contact sheets `series/out/epNN_sheet*.jpg`, remade with `python3 plan.py epNN && node render.mjs epNN --sheet`). The text to record is in `series/narr/epNN_narration.txt` and `epNN_zara.txt`.
- **To finish 13 to 30 once there are credits (about 800 each, roughly 14,500 for all eighteen; the free plan gives 10,000 a month, so two months free or a paid month):** generate the narration (Mike, one take, the paragraphs as in the txt file) and Zara's lines (Beth), save as `series/audio/ep13.wav` (mono 44.1 kHz) and add her lines as a new zara file in `build.py` (see how `zara4` is wired for ep12), run `python3 align.py audio/ep13.wav audio/ep13.words.json`, then `cd series && python3 build.py ep13 && node render.mjs ep13 --sheet`, check, `node render.mjs ep13`, `./finish.sh ep13 "message"`.
- **Scripted:** episodes 2 to 30, in `scripts/series/ep02-30.md`; captions for 2 to 30 in `scripts/series/captions/`. Odi approved the episode 2 script only; the rest were written and checked by Claude and are waiting for his view.
- **Left:** nothing to script. What remains is the voice for 13 to 30, then one render each, and Odi's review of everything from episode 3 on. For 13 to 30 Claude looked at one or two contact sheets per episode, not every shot.
- **ElevenLabs:** 75 credits left (free plan). One narration costs about 750. The site showed an upgrade pop-up once; it was closed, nothing was bought or changed.
- **Path chosen (no real votes yet; change the opening lines of the next episode if a different word wins):** ep1 CALL, ep2 MUTE, ep3 FOLD, ep4 ONCE, ep5 STAY, ep6 OWN, ep7 DINNER, ep8 SORRY, ep9 EMPTY, ep10 KEEP, ep11 DRIVE, ep12 STAY, ep13 SILENT, ep14 FIX, ep15 WRITE, ep16 KEEP, ep17 SEND, ep18 BOTH, ep19 HONEST, ep20 ALONE, ep21 TRUE, ep22 SUIT, ep23 THROUGH, ep24 KEEP, ep25 SLEEP, ep26 LEAVE, ep27 TELL, ep28 EMPTY, ep29 BED. Episode 30's vote is the send-off: DANCE or HOME.
- **New in the world:** people on screen: Remy (from episode 4), Mrs Finch (from episode 2). Places: the office and the bar. Seen only on her phone: Miles, Ivy, Sam (the date). Her mum is a call and his sister Nell is an email; neither is shown or heard. In episodes 26 and 30 Miles is a lapel and a buttonhole only. Episode 30's venue is soft light, not a drawn set. (The outline had her meet his sister at a market; that became an email to stay inside two new places and two new people.)
- **Not checked:** Claude cannot hear audio or watch motion. Every shot was checked as a still, word timings come from a speech aligner, levels were measured, and episodes 2 to 12 were scanned for blank or frozen stretches.
<!-- STATUS:END -->

Direction from Odi, 16 Nov 2026. This replaces the sprint. Status: episode 1 rendered once on 16 Nov (series/out/ep01.mp4, 63.7 s) and sent to Odi with its caption; not posted. Episodes 2 to 4 are paper drafts in ep02-04_drafts.md.

## The idea in one line
Zara's ex gets married in 30 days and she said yes to the invite. One episode is one day. Each night she writes it out, sees what's underneath, and two next steps appear. The audience picks one. It happens the next day and its effect stays.

Goal: views, comments, follows. Not installs. It runs on its own character account, not heartly.ai.

## Her world (ours, invented; not tied to any real place)
Like a cartoon's city: it feels lived-in and is nowhere in particular. No real cities, streets or companies, no surnames.
- **Zara, 26.** A smart, stylish corporate woman. Long bone-straight hair, tailored cream blazer, gold jewellery, heels. Confident and glamorous, never sexualised; no lingering body shots. By day she is completely put together. At 1am she is in an old t-shirt with her hair tied up, writing draft nine. That contrast is the comedy.
- **Her flat:** sleek and modern. A good arc lamp, city lights through a big window, a laptop still open, a wine glass, one dying plant, her heels kicked off by the door.
- **Job:** events director at an events and PR agency with glass walls. She plans other people's big days, weddings included.
- **Miles, the ex.** Kind, avoids arguments. Three years together. It ended in a car park, which she holds against the car park.
- **Ivy, the bride.** Engaged five months after the breakup. Zara has decided she's lovely and resents it.
- **Remy, best friend.** Works nights, replies in capitals.
- **Mrs Finch, her director.** Says little. Sees everything.
- **Her mum.** Rings on Sundays. Liked Miles.
- **Things that recur:** the invitation propped on her coffee table, a photo-booth strip of her and Miles she hasn't thrown out, Miles's grey hoodie at the back of the wardrobe, the heels by the door, the plant.

## Voice
A neutral narrator tells it in the third person, calm and dry (ElevenLabs library voice "Mike", Odi's pick, 16 Nov; Zara is the ElevenLabs library voice "Beth", his sample 7, confirmed 16 Nov). Zara speaks once or twice an episode, only in a real moment (a call, a line to her boss, something said to herself), and the narrator may contradict her.

## Votes
Each episode ends on two choices as a split screen, one word each, one wise and one tempting; the narrator asks "What would you do?" and people comment the word. The episode never promises that the winner happens. Odi reads the comments and gives the winner. Real counts only, shown at the start of the next episode. A tie or no votes: the narrator flips a coin on screen. The vote decides how she gets through a day; the big turns happen either way.

## On-screen furniture
- **HUD, top-left, always there:** DAYS LEFT (counts down) and one funny meter, DIGNITY, as a percentage. The vote moves it and it never resets.
- **Vote card:** split screen, the two steps as pictures, one word each. "comment one word: X or Y".
- **Her phone:** she picks it up, we see her hands, camera over her shoulder, push into the screen, back out to her face. The app's name is visible on the phone. Nobody says it. No research facts.

## Season outline
Module names are Heartly's real ones from the app (Attachment, Vices, Distraction, Anger, Blame, Pride, Fear, Grief). They are never named on screen. The big turns are fixed; what she does day to day follows the vote.

| Day | Module | What happens | Turn |
|---|---|---|---|
| 1 | Attachment | She RSVPs yes and can't undo it. Nine drafts to him at 1 a.m. | Premise |
| 2 | Attachment | The vote's winner. She checks his profile before her alarm has finished. | |
| 3 | Attachment | The hoodie comes out of the wardrobe "to wash it". | |
| 4 | Attachment | Remy makes her count the checks. The number is said out loud. | First honest laugh |
| 5 | Vices | Friday. "One drink." | |
| 6 | Vices | The morning after. She liked a photo of his from 2023. | Public embarrassment |
| 7 | Vices | She downloads the app. Swipes like it's a job. | |
| 8 | Vices | The date. Nice man. She talks about Miles for 40 minutes. | End of week 1 recap |
| 9 | Distraction | She signs up for everything: 6 a.m. classes, three extra accounts, a pottery course. | |
| 10 | Distraction | The glow-up. Hair, nails, a dress she can't afford. | |
| 11 | Distraction | She is so busy she forgets her mum's birthday. | Cost of running |
| 12 | Distraction | A quiet Sunday she can't sit through. | |
| 13 | Anger | Mrs Finch drops a new account on her desk: the Miles & Ivy wedding. It's hers to run. | Midpoint turn |
| 14 | Anger | She drafts the worst seating plan of her career, on purpose. Mrs Finch looks at it. | |
| 15 | Anger | She says the thing about the car park, out loud, to an empty meeting room. | |
| 16 | Anger | Under it: he never fought for it. Neither did she. | |
| 17 | Blame | She makes the list of everything he did. It's long. | |
| 18 | Blame | Remy asks for her half of the list. | |
| 19 | Blame | She runs into his sister at the market. The sister is kind. That's worse. | |
| 20 | Pride | The plus-one. She wants someone on her arm for the photo. | |
| 21 | Pride | She rehearses being fine in the mirror. Three versions of "so happy for you". | |
| 22 | Pride | The dress that says "look what you lost" versus the dress she likes. | |
| 23 | Pride | She tells Mrs Finch whose wedding it is. | Truth told at work |
| 24 | Fear | The seating plan arrives. She's on the table by the toilets with his uncles. | |
| 25 | Fear | She drafts the text that gets her out of going. | Lowest point |
| 26 | Fear | She pictures the actual worst moment and walks through it. It's about nine seconds long. | |
| 27 | Grief | She redoes the wedding plan properly, the way she'd want her own done. | |
| 28 | Grief | The hoodie goes in a bag for his sister. The photo strip goes in a drawer. | |
| 29 | Grief | The night before. Nothing to fix. She waters the plant. | |
| 30 | (all of it) | The wedding. We see her walk in. The last vote is the audience's send-off, not a cliffhanger. | End |

Things the outline avoids on purpose: nobody is humiliated for laughs, no crisis or self-harm storyline, no promise that she ends up "healed". She ends up at a wedding, able to be there.

## Handles to check (I can't see which are free)
1. @zarasaidyes
2. @30daystothewedding
3. @zaraminus30
4. @zara.rsvpdyes
5. @daysleftzara

## What I still need from Odi
- Nothing for the screens: brand/APP_SCREENS.md describes the real app and every Heartly screen is drawn from it.
