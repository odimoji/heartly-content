# Builds an episode's sound and its timing. The voice drives everything:
#   audio/narr2.wav        the ElevenLabs narration, one continuous take (Mike)
#   audio/narr2.words.json when each word starts in that take (measured with a speech aligner, sherpa-onnx zipformer)
#   audio/zara.wav         Zara's lines (ElevenLabs "Beth", Odi's sample 7)
# The take is kept in order and never re-stitched: long pauses are shortened, the pace is lifted a little, and it is
# opened only where Zara speaks. Each shot in episodes/ep01.js lasts exactly as long as its `say` words.
# Writes out/ep01_audio.wav and episodes/ep01.timing.json (shot starts and lengths, and the captions: the spoken words, one or two at a time).
# Music bed and sound effects are synthesised here (original; nothing licensed or sampled).
import json, re, subprocess, numpy as np, soundfile as sf
SR = 44100; TEMPO = 1.12; MAXGAP = 0.20
shots = json.loads(subprocess.check_output(["node", "-e", "require('./episodes/ep01.js');console.log(JSON.stringify(EP01.shots.map(s=>({say:s.say,who:s.who||'N',key:s.key||'',hold:s.hold||0}))))"]))
narr, _ = sf.read("audio/narr2.wav"); zara, _ = sf.read("audio/zara.wav")
W = json.load(open("audio/narr2.words.json"))                      # [[WORD, start], ...]
ZW = {"A": [0.0, 0.32, 0.84, 1.12, 1.4], "B": [0.03, 0.43]}        # Zara's word starts inside her two clips
ZC = {"A": (0.0, 1.95, 1.6, 1.06), "B": (2.45, 3.3, 5.0, 1.0)}     # start, end, gain, tempo

def tempo(a, r):
    if abs(r - 1) < 1e-3: return a
    sf.write("/tmp/_t_in.wav", a, SR); subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "/tmp/_t_in.wav", "-af", f"atempo={r}", "/tmp/_t_out.wav"], check=True); return sf.read("/tmp/_t_out.wav")[0]
def fade(a, n=int(0.012 * SR)): a = a.copy(); a[:n] *= np.linspace(0, 1, n); a[-n:] *= np.linspace(1, 0, n); return a

# ---- where the narration is opened: before each narrator shot that follows a Zara shot or a hold
hop = int(0.01 * SR); env = np.array([np.sqrt((narr[i:i + hop] ** 2).mean()) for i in range(0, len(narr) - hop, hop)]); thr = np.percentile(env, 95) * 0.03
def quiet_before(t):  # the quietest moment in the gap before a word
    a, b = int(max(0, t - 0.4) / 0.01), int(max(0.02, t - 0.02) / 0.01); return (a + int(np.argmin(env[a:b]))) * 0.01
tok = lambda s: re.findall(r"[A-Za-z0-9':]+[.,?]?", s.replace(":", ""))
wi = 0; plan = []                                                  # per shot: narrator word range, or Zara clip
zi = iter("AB")
for s in shots:
    n = len(tok(s["say"]))
    if s["who"] == "Z": plan.append(("Z", next(zi), n))
    else: plan.append(("N", wi, n)); wi += n
assert wi == len(W), (wi, len(W))
cuts = [0.0]
for i, p in enumerate(plan):
    if p[0] == "N" and i > 0 and (plan[i - 1][0] == "Z" or shots[i - 1]["hold"] > 0): cuts.append(quiet_before(W[p[1]][1]))
cuts.append(len(narr) / SR)

# ---- each piece: shorten pauses, lift the pace; remember where every original moment lands
def piece(t0, t1):
    a0, a1 = int(t0 / 0.01), int(t1 / 0.01); keep = []; rem = []; i = a0
    while i < a1:
        if env[i] < thr:
            j = i
            while j < a1 and env[j] < thr: j += 1
            if (j - i) * 0.01 > MAXGAP + 0.06 and i > a0 and j < a1: rem.append((i * 0.01 + MAXGAP / 2, j * 0.01 - MAXGAP / 2))
            i = j
        else: i += 1
    out = []; p = t0
    for r0, r1 in rem: out.append(fade(narr[int(p * SR):int(r0 * SR)])); p = r1
    out.append(fade(narr[int(p * SR):int(t1 * SR)]))
    a = tempo(np.concatenate(out), TEMPO)
    return a, (lambda t: (t - t0 - sum(min(t, r1) - r0 for r0, r1 in rem if t > r0)) / TEMPO)
pieces = [piece(cuts[i], cuts[i + 1]) for i in range(len(cuts) - 1)]
which = lambda t: max(i for i in range(len(pieces)) if cuts[i] <= t + 1e-6)

# ---- lay it out: narration pieces in order, Zara's lines in the gaps, holds where a shot asks for one
t = 0.1; ev = []; word_t = []; shot_first = []; pi = -1                # ev: (clip, at); word_t: (start, who, shot)
for i, p in enumerate(plan):
    if p[0] == "Z":
        c0, c1, g, r = ZC[p[1]]; clip = fade(tempo(zara[int(c0 * SR):int(c1 * SR)] * g, r)); t += 0.1; ev.append((clip, t))
        for k, w in enumerate(ZW[p[1]]): word_t.append((t + w / r, "Z", i))
        t += len(clip) / SR + 0.1 + shots[i]["hold"]
    else:
        q = which(W[p[1]][1])
        if q != pi: pi = q; base = t; ev.append((pieces[q][0], base)); t = base + len(pieces[q][0]) / SR
        for k in range(p[1], p[1] + p[2]): word_t.append((base + pieces[q][1](W[k][1]), "N", i))
        if shots[i]["hold"]: t += shots[i]["hold"]
total = round(t + 0.15, 2)
starts = [0.0]
for i in range(1, len(shots)): starts.append(round(min(x for x, _, s in word_t if s == i) - 0.07, 3))
durs = [round((starts[i + 1] if i + 1 < len(shots) else total) - starts[i], 3) for i in range(len(shots))]

# ---- captions: the spoken words, one or two at a time, the key word coloured
caps = []; k = 0
for i, s in enumerate(shots):
    ws = tok(s["say"]); keys = set(s["key"].lower().split()); cur = None
    for w in ws:
        t0, who, _ = word_t[k]; k += 1; plain = w.strip(".,?").lower(); hot = plain in keys
        last = w is ws[-1] and len(plain) <= 3
        if cur and not cur["end"] and ((len(cur["w"]) < 2 and len(cur["w"][0][0]) + len(w) <= 11) or (last and len(cur["w"]) < 3)): cur["w"].append([w.upper().rstrip(".,"), hot])
        else:
            if cur: cur["t1"] = round(t0, 3); caps.append(cur)
            cur = {"t0": round(t0 - 0.04, 3), "who": who, "shot": i, "w": [[w.upper().rstrip(".,"), hot]]}
        cur["end"] = w.endswith((".", ",", "?"))
    cur["t1"] = round(starts[i] + durs[i] - (0.05 if not s["hold"] else s["hold"] * 0.6), 3); caps.append(cur)
for c in caps: c.pop("end")

N = int((total + 0.4) * SR); vo = np.zeros(N)
for clip, at in ev: a = int(at * SR); vo[a:a + len(clip)] += clip[:N - a]
# ---- music: an airy pad with a soft pulse under it so the edit has something to cut to
tt = np.arange(N) / SR; rng = np.random.default_rng(4)
def tone(f, det=0.0): return np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * (f * (1 + det)) * tt + 1.3) + 0.25 * np.sin(2 * np.pi * f * 2 * tt + 0.4)
chords = [[146.83, 220.0, 261.63, 329.63], [116.54, 174.61, 220.0, 293.66], [174.61, 220.0, 261.63, 349.23], [130.81, 196.0, 246.94, 329.63]]  # Dm9, Bbmaj7, F, Cmaj7
BEAT = 0.56; bar = BEAT * 8; pad = np.zeros(N)
for b in range(int(total / bar) + 2):
    ch = chords[b % 4]; b0 = b * bar; e = np.clip((tt - b0) / (bar * 0.4), 0, 1) * np.clip((b0 + bar * 1.5 - tt) / (bar * 0.6), 0, 1); e = e ** 1.5
    for j, f in enumerate(ch): pad += e * tone(f, 0.004 + 0.002 * j) * (0.3 if j == 0 else 0.22)
shim = np.zeros(N)
for k2 in range(int(total / (BEAT * 2))):
    b0 = 0.5 + k2 * BEAT * 2; f = rng.choice([659.25, 783.99, 880.0, 1046.5, 1318.5]); e = np.exp(-np.clip(tt - b0, 0, None) * 2.6) * (tt >= b0); shim += e * np.sin(2 * np.pi * f * tt) * 0.11
pulse = np.zeros(N); pn = int(0.22 * SR); pt = np.arange(pn) / SR; hit = np.sin(2 * np.pi * (62 - 60 * pt) * pt) * np.exp(-pt * 22)
for k2 in range(int(total / BEAT)):
    a = int((1.2 + k2 * BEAT) * SR)
    if a + pn < N: pulse[a:a + pn] += hit * (0.5 if k2 % 2 == 0 else 0.3)
music = pad * 0.5 + shim
ir = rng.standard_normal(int(2.4 * SR)) * np.exp(-np.arange(int(2.4 * SR)) / (0.65 * SR)); ir /= np.abs(ir).sum() ** 0.5 * 12
music = music * 0.5 + np.convolve(music, ir)[:N] * 0.9
k3 = int(SR * 0.004); music = np.convolve(music, np.ones(k3) / k3, "same")
music = music / (np.max(np.abs(music)) + 1e-9) + pulse * 0.55
music *= np.clip(tt / 0.6, 0, 1) * np.clip((total + 0.3 - tt) / 1.5, 0, 1)
# ---- sound effects
sfx = np.zeros(N)
def put(a, at, g=1.0):
    s = int(max(0, at) * SR); e = min(N, s + len(a)); sfx[s:e] += a[:e - s] * g
def whoosh(d=0.4):
    n = int(d * SR); x = rng.standard_normal(n); y = np.zeros(n); acc = 0.0; a = np.linspace(0.01, 0.35, n)
    for i in range(n): acc += a[i] * (x[i] - acc); y[i] = acc
    return y * np.sin(np.linspace(0, np.pi, n)) ** 2 * 0.5
def tick(f=2400, d=0.03): n = int(d * SR); return rng.standard_normal(n) * np.exp(-np.arange(n) / (0.004 * SR)) * 0.25 + np.sin(2 * np.pi * f * np.arange(n) / SR) * np.exp(-np.arange(n) / (0.006 * SR)) * 0.1
def buzz(d=0.2): n = int(d * SR); x = np.arange(n) / SR; return np.sign(np.sin(2 * np.pi * 160 * x)) * 0.12 * np.sin(np.pi * x / d) ** 0.5 * (0.6 + 0.4 * np.sin(2 * np.pi * 26 * x))
def chime(f=880, d=1.2): n = int(d * SR); x = np.arange(n) / SR; return (np.sin(2 * np.pi * f * x) + 0.5 * np.sin(2 * np.pi * f * 1.5 * x) + 0.3 * np.sin(2 * np.pi * f * 2 * x)) * np.exp(-x * 3.2) * 0.16
def thud(d=0.25): n = int(d * SR); x = np.arange(n) / SR; return np.sin(2 * np.pi * (90 - 60 * x / d) * x) * np.exp(-x * 16) * 0.5
def fly(d): n = int(d * SR); x = np.arange(n) / SR; return np.sign(np.sin(2 * np.pi * (190 + 30 * np.sin(x * 9)) * x)) * 0.05 * (0.5 + 0.5 * np.sin(x * 13)) * np.sin(np.pi * x / d)
S = lambda i: starts[i]; D = lambda i: durs[i]
find = lambda txt: next(i for i, s in enumerate(shots) if s["say"].startswith(txt))
put(thud(), S(0) + D(0) * 0.3, 0.9); put(chime(1318, 0.8), S(0) + D(0) * 0.3 + 0.03, 0.6)                # she taps yes
i = find("Her best"); put(buzz(), S(i) + D(i) * 0.45); j = find("had notes"); [put(buzz(), S(j) + D(j) * x) for x in (0.02, 0.3, 0.62)]
for name in ("They were", "Zara plans", "The plan is", "By one", "Call her"): put(whoosh(), S(find(name)) - 0.2, 0.9)
put(thud(), S(find("She was not")) + 0.25, 0.7)                                                           # dignity drops
i = find("she has written")
for k2 in range(int(D(i) / 0.075)): put(tick(), S(i) + 0.05 + k2 * 0.075, 0.7)                            # nine drafts, fast
i = find("She writes")
for k2 in range(int(D(i) * 0.6 / 0.1)): put(tick(), S(i) + D(i) * 0.22 + k2 * 0.1, 0.6)                   # writing it out
put(chime(784, 1.0), S(find("The app asks")) + 0.02, 0.7); put(chime(659, 1.4), S(find("he looks fine")) + 0.02, 0.8); put(chime(880, 1.4), S(find("When he sees")) + 0.02, 0.7)
i = find("met the buffet"); put(fly(D(i)), S(i), 1.0)                       # the fly
i = find("or send"); put(thud(), S(i), 0.5); i = find("What would"); put(chime(523, 2.0), S(i), 0.9)
i = find("Twenty"); put(thud(), S(i) + D(i) * 0.45, 0.7); put(chime(1046, 1.2), S(i) + D(i) * 0.45 + 0.04, 0.6)   # the counter flips
# ---- mix: the bed ducks under the voice
w = int(0.15 * SR); e2 = np.convolve(np.abs(vo), np.ones(w) / w, "same"); duck = 1 - 0.6 * np.clip(e2 / 0.05, 0, 1)
vo_g = vo / (np.max(np.abs(vo)) + 1e-9) * 0.85
mix = np.tanh((vo_g + music / (np.max(np.abs(music)) + 1e-9) * 0.2 * duck + sfx * 0.5) * 1.1) * 0.92
sf.write("out/ep01_audio.wav", mix[:int((total + 0.05) * SR)], SR)
json.dump({"durs": durs, "starts": starts, "total": total, "caps": caps}, open("episodes/ep01.timing.json", "w"))
print("total", total, "s,", len(shots), "shots; longest", max(durs), "shortest", min(durs)); print(durs)
print(" | ".join(f"{c['t0']:.2f} " + " ".join(x for x, _ in c["w"]) for c in caps))
