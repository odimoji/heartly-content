# Fable 5.2 sprint list (15–17 Nov 2026)

Direction set by Odi in the planning chat. The content chat builds from this list, top to bottom, in the established 3D night-to-dawn style (see CLAUDE.md), and may mix in other styles where a note says so. Mark each one built / scheduled here and in tracker/posts.csv.

## What the numbers say so far (15 Nov, 18:35 UTC; five posts, under a day old, so treat as a lean, not a rule)
- Best by far: shower_argument (684 views, 64 likes, 6.4 s average watch). Funny, about a private habit nearly everyone has, breakup.
- Next: ok_fullstop (710 views, 14 likes, 4.6 s). Also funny and specific, dating.
- Weakest: voicemail (633 views, 4 likes, 2.1 s) and hoodie (700 views, 3 likes, 3.5 s). Slower and sadder openings.
- Nothing has a comment, save or share yet, and nobody watches to the end (1–4%). The first two seconds and a reason to react are the problems to solve.
- So: lean funny and specific ("the thing everyone does and nobody admits"), open on the joke, keep sad stories for later.

## Rules for this sprint
- Ending (Odi, 15 Nov): no question at the end. After the turn, the narrator adds one line of real education from scripts/FACTS.md, then the story closes at dawn. Captions on TikTok can still invite a reply.
- Length: aim for 20–26 s. The 36 s cut of worry_3am is too long for a 3–6 s average watch.
- Hook on frame 1, scored 70+ with tools/ig-reel/hookscore.py.
- Heartly once, at the turn, by what the character does. Never invent stats beyond FACTS.md.
- Mascot is not decided (Odi, 15 Nov): Heartly must not revolve around worry alone. So this list is also the test. Items are tagged [guy] (a little-guy character is in it) or [no guy]. Seven of ten have none. Compare the two groups before anything is fixed.
- Two chats build from this list at once. Before starting an item: git pull, skip anything marked claimed, built or scheduled, add "claimed (<which chat>, <time>)" to its line, and push straight away.

## Before anything ships (added 15 Nov, 19:50)
- Every hook, script and caption passes the honesty check in brand/MESSAGE.md and comes back to its one message.
- Every video's first two seconds show the private habit itself (the joke or the "that's me" moment), before any set-up. Average watch is 2–6 s, so a hook that needs context is lost.
- Every caption gives a reason to reply or send it to someone ("send this to the friend with 31 drafts"), since nothing has a comment or share yet. The video itself still ends on the research line.
- Front-load: post items 1, 2, 3 and 5 first so they collect the most data before the read tomorrow evening.

## Posting during the sprint (added 15 Nov, 20:15)
- The standing rule holds: nothing is posted without Odi's yes in the chat doing the posting.
- If Odi gives a standing yes there for the sprint ("post each sprint video as it finishes"), post each one as soon as it has passed the checks above, and send him the video and caption at the same moment so he can pull it if something is off.
- Keep at least 90 minutes between posts. If several finish together, post the highest on the list first and queue the rest 90 minutes apart. No posts between 00:30 and 07:00 UK; hold those for 07:30.
- Log the post time in the tracker so tomorrow's read can compare like with like (hours live matters as much as views).

## The list

1. **worry_3am, final cut** [guy] (3D, story). Already built. Change the ending from the question to FACTS 2, and trim towards 26 s. — claimed (content chat, 15 Nov 20:15 UK): trimming to ~25 s with the sleep fact (FACTS 4), as Odi asked in chat — posted 16 Nov 02:11 UK (Odi, 16 Nov: full 45.7 s cut with the pocket ending, tie line + FACTS 2; his call overrides the length rule for this one)
2. **shower_argument_3d** [no guy] (3D, story, remake of the best performer). He wins the argument with his ex in the shower, in the car, at the gym, to a lamp. Turn: he opens Heartly and writes what he actually wanted to say to her. Fact 1. — claimed (content chat, 15 Nov 21:05 UK)
3. **no_contact** [no guy] (explainer, correcting). Script in scripts/README.md. Replace the closing question with FACTS 3. Style: 3D set with labels of 1–3 words, like the middleman video. — claimed (content chat, 15 Nov 20:15 UK): built in 3D, being trimmed to 26 s with FACTS 3
4. **worse_at_night** [no guy] (explainer, validating). Script in scripts/README.md. Replace the closing question with FACTS 2. — claimed (content chat, 15 Nov 20:15 UK): built in 3D, being trimmed to 26 s with FACTS 2
5. **worry_meeting** [guy] (3D, story, Worry series). Worry attends her work meeting and keeps passing her notes: "they saw you yawn", "say something", "not that". Turn: lunch break, she writes the notes down in Heartly and sees they are all one fear. Fact 2. — claimed (content chat, 15 Nov 21:05 UK)
6. **drafts** [no guy] (3D, story, funny). His notes app has 31 unsent texts to her, each one "the final version". He reads three aloud, each worse. Turn: he writes the real one in Heartly, addressed to nobody. Fact 3. — claimed (content chat, 15 Nov 21:05 UK)
7. **profile_check** [no guy] (explainer, correcting, funny). "You checked their profile 9 times today. Each check restarts the clock." Shown as a snooze button he keeps hitting. Turn: write what you were hoping to find. Fact 1. (No stats: "9 times" is the character's count, shown on his screen.) — claimed (content chat, 16 Nov 01:12 UK)
8. **little_guy_replay** [guy, not Worry] (3D, story, experiment). Same little-guy body and personality as Worry, but this one is called Replay and belongs to a man with a regret. Different colour (ember, since violet is Worry's). Replay carries a tiny projector and screens the same 6 seconds of the worst thing he ever said, at dinner, at the gym, in bed. Turn: he opens Heartly and writes what he wishes he had said, and Replay's reel runs out. Fact 3. Purpose: does the little guy work when he isn't worry?
9. **the_replay** [no guy] (mixed style, experiment). The same 6-second memory plays three times, each time with a different caption for what she tells herself it meant. Turn: she writes down what actually happened. Fact 3.
10. **one_question, day 1** [no guy] (photo post or 8 s video, experiment from PLAYBOOK format c). One line on the night-to-dawn background: "what would you say if you knew they'd never read it?" This format's whole point is the comments, so it keeps its question and is the one exception to the ending rule. — built (content chat, 16 Nov 01:10 UK): 8 s video, video3d/src/OneQuestionVideo.tsx, sent to Odi, not scheduled

## Order if time runs short
1, 2, 3, 5, 4, 6, then the rest. Two posted videos that test the new style against yesterday's numbers are worth more than ten unposted ones.

## Extra (not on the list)
- **audience_of_one** [guy] (3D, story, funny, breakup). Built by the content chat before this list existed: he posts stories for one viewer who never watches; Worry eggs him on. Being trimmed to 26 s with FACTS 1. Hold or post, Odi's call.
