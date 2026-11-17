# For an episode whose voice is not recorded yet: python3 plan.py ep13
# Writes episodes/epNN.timing.json with estimated shot lengths (about 0.3 s a word) so stills and contact sheets can be made:
#   node render.mjs ep13 --sheet
# When the narration exists (audio/epNN.wav + audio/epNN.words.json), run build.py instead; it replaces this timing with the real one.
import sys, json, re, subprocess
EP = sys.argv[1]
shots = json.loads(subprocess.check_output(["node", "-e", "globalThis.document={};require('./kit/zara.js');require('./kit/shots.js');require('./episodes/%s.js');console.log(JSON.stringify(EP.shots.map(s=>({say:s.say,who:s.who||'N',key:s.key||'',hold:s.hold||0}))))" % EP]))
tok = lambda s: re.findall(r"[A-Za-z0-9']+[.,?:]?", s)
t = 0.1; starts = []; durs = []; caps = []
for i, s in enumerate(shots):
    ws = tok(s["say"]); d = round(0.12 + 0.3 * len(ws) + sum(0.12 for w in ws if w[-1] in ".,?:") + s["hold"], 3); starts.append(round(t - 0.1 if i else 0, 3)); keys = set(s["key"].lower().split())
    for j in range(0, len(ws), 2): caps.append({"t0": round(t + 0.3 * j, 3), "t1": round(t + 0.3 * (j + 2), 3), "who": s["who"], "shot": i, "w": [[w.upper().rstrip(".,:"), w.strip(".,?:").lower() in keys] for w in ws[j:j + 2]]})
    caps[-1]["t1"] = round(t + d - 0.05, 3); t += d; durs.append(d)
durs[0] = round(durs[0] + 0.1, 3)
json.dump({"durs": durs, "starts": starts, "total": round(t, 2), "caps": caps, "estimated": True}, open(f"episodes/{EP}.timing.json", "w"))
print(EP, "estimated", round(t, 1), "s at a slow read (the real take is sped up to about 48 s);", len(shots), "shots;", sum(len(tok(s["say"])) for s in shots), "words;", sum(len(s["say"]) for s in shots if s["who"] == "N"), "narrator characters")
