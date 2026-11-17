# Builds any episode's sound and timing: python3 build.py ep02
#   audio/epNN.wav + audio/epNN.words.json   the ElevenLabs narration (Mike, one continuous take) and when each word starts
#   audio/zara2.wav + audio/zara2.words.json  Zara's lines for episodes 2 to 8 (ElevenLabs "Beth"), in episode order
# The take is kept in order and never re-stitched: long pauses are shortened, the pace is lifted, and it is opened only
# where Zara speaks or a shot holds. Each shot in episodes/epNN.js lasts exactly as long as its `say` words.
# Shots may carry sfx: "thud" | "buzz" | "type" | "chime" | "whoosh" | "flip" | "ding" | "tick" (or a list).
# Writes out/epNN_audio.wav and episodes/epNN.timing.json. Music and effects are synthesised here (original, nothing licensed).
import sys, json, re, difflib, subprocess, numpy as np, soundfile as sf
EP = sys.argv[1]; SR = 44100; MAXGAP = 0.16; TARGET = float(sys.argv[2]) if len(sys.argv) > 2 else 48.5
shots = json.loads(subprocess.check_output(["node", "-e", "globalThis.document={};require('./kit/zara.js');require('./kit/shots.js');require('./episodes/%s.js');console.log(JSON.stringify(EP.shots.map(s=>({say:s.say,who:s.who||'N',key:s.key||'',hold:s.hold||0,sfx:[].concat(s.sfx||[])}))))" % EP]))
narr, _ = sf.read(f"audio/{EP}.wav"); ZF = "zara3" if EP in ("ep09", "ep10", "ep11") else "zara2"; zara, _ = sf.read(f"audio/{ZF}.wav")
AW = json.load(open(f"audio/{EP}.words.json")); ZWORDS = json.load(open(f"audio/{ZF}.words.json"))
ZSTART = {"ep02": 0, "ep03": 10, "ep04": 16, "ep05": 20, "ep06": 26, "ep07": 33, "ep08": 35, "ep09": 0, "ep10": 5, "ep11": 12}[EP]
tok = lambda s: re.findall(r"[A-Za-z0-9']+[.,?:]?", s)
FIX = {"TSARA": "ZARA", "X": "EX", "AP": "APP", "EMILE": "EMAIL"}
norm = lambda w: (lambda x: FIX.get(x, x))(re.sub(r"[^A-Z0-9]", "", w.upper().replace("'S", "").replace("'", "")))
# the script's narrator words, matched to the measured words (the aligner mishears a few; those take a time between their neighbours)
script = [w for s in shots if s["who"] == "N" for w in tok(s["say"])]
a_, b_ = [norm(w) for w in script], [norm(w) for w, _ in AW]
tm = [None] * len(script)
for blk in difflib.SequenceMatcher(None, a_, b_, autojunk=False).get_matching_blocks():
    for k in range(blk.size): tm[blk.a + k] = AW[blk.b + k][1]
known = [i for i, x in enumerate(tm) if x is not None]; assert len(known) > 0.85 * len(script), (len(known), len(script))
for i in range(len(tm)):
    if tm[i] is None:
        lo = max([k for k in known if k < i], default=None); hi = min([k for k in known if k > i], default=None)
        tm[i] = tm[hi] - 0.2 * (hi - i) if lo is None else tm[lo] + 0.3 * (i - lo) if hi is None else tm[lo] + (tm[hi] - tm[lo]) * (i - lo) / (hi - lo)
print("matched", len(known), "of", len(script), "narrator words")
W = [[w, t] for w, t in zip(script, tm)]

def tempo(a, r):
    if abs(r - 1) < 1e-3: return a
    sf.write("/tmp/_t_in.wav", a, SR); subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "/tmp/_t_in.wav", "-af", f"atempo={r}", "/tmp/_t_out.wav"], check=True); return sf.read("/tmp/_t_out.wav")[0]
def fade(a, n=int(0.012 * SR)): a = a.copy(); a[:n] *= np.linspace(0, 1, n); a[-n:] *= np.linspace(1, 0, n); return a

# ---- where the narration is opened: before each narrator shot that follows a Zara shot or a hold
hop = int(0.01 * SR); env = np.array([np.sqrt((narr[i:i + hop] ** 2).mean()) for i in range(0, len(narr) - hop, hop)]); thr = np.percentile(env, 95) * 0.03
def quiet_before(t):  # the quietest moment in the gap before a word
    a, b = int(max(0, t - 0.4) / 0.01), int(max(0.02, t - 0.02) / 0.01); return (a + int(np.argmin(env[a:b]))) * 0.01
wi = 0; plan = []                                                  # per shot: narrator word range, or Zara clip
zi = ZSTART; vrms = np.sqrt((narr[np.abs(narr) > 0.02] ** 2).mean())
def zclip(i0, n):
    t0 = max(0, ZWORDS[i0][1] - 0.06); t1 = ZWORDS[i0 + n][1] - 0.1 if i0 + n < len(ZWORDS) else len(zara) / SR
    a = zara[int(t0 * SR):int(t1 * SR)].copy(); e = np.abs(a); live = np.where(e > 0.02 * e.max())[0]; a = a[:min(len(a), live[-1] + int(0.12 * SR))]
    a *= vrms / (np.sqrt((a[np.abs(a) > 0.02 * e.max()] ** 2).mean()) + 1e-9) * 1.1
    return a, [ZWORDS[i0 + k][1] - t0 for k in range(n)]
for s in shots:
    n = len(tok(s["say"]))
    if s["who"] == "Z": plan.append(("Z", zclip(zi, n), n)); zi += n
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
    return np.concatenate(out), rem, t0
raw = [piece(cuts[i], cuts[i + 1]) for i in range(len(cuts) - 1)]
extra = sum(len(p[1][0]) / SR + 0.2 for p in plan if p[0] == "Z") + sum(s["hold"] for s in shots) + 0.3
TEMPO = float(np.clip(sum(len(r[0]) for r in raw) / SR / (TARGET - extra), 1.08, 1.2)); print("pace lifted by", round(TEMPO, 3))
pieces = [(tempo(a, TEMPO), (lambda t, rem=rem, t0=t0: (t - t0 - sum(min(t, r1) - r0 for r0, r1 in rem if t > r0)) / TEMPO)) for a, rem, t0 in raw]
which = lambda t: max(i for i in range(len(pieces)) if cuts[i] <= t + 1e-6)

# ---- lay it out: narration pieces in order, Zara's lines in the gaps, holds where a shot asks for one
t = 0.1; ev = []; word_t = []; shot_first = []; pi = -1                # ev: (clip, at); word_t: (start, who, shot)
for i, p in enumerate(plan):
    if p[0] == "Z":
        clip = fade(tempo(p[1][0], 1.05)); t += 0.1; ev.append((clip, t))
        for k, w in enumerate(p[1][1]): word_t.append((t + w / 1.05, "Z", i))
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
        t0, who, _ = word_t[k]; k += 1; plain = w.strip(".,?:").lower(); hot = plain in keys
        last = w is ws[-1] and len(plain) <= 3
        if cur and not cur["end"] and ((len(cur["w"]) < 2 and len(cur["w"][0][0]) + len(w) <= 11) or (last and len(cur["w"]) < 3)): cur["w"].append([w.upper().rstrip(".,:"), hot])
        else:
            if cur: cur["t1"] = round(t0, 3); caps.append(cur)
            cur = {"t0": round(t0 - 0.04, 3), "who": who, "shot": i, "w": [[w.upper().rstrip(".,:"), hot]]}
        cur["end"] = w.endswith((".", ",", "?", ":"))
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
for i, sh in enumerate(shots):
    for name in sh["sfx"]:
        if name == "thud": put(thud(), S(i) + min(0.3, D(i) * 0.3), 0.8)
        elif name == "buzz": [put(buzz(), S(i) + D(i) * x) for x in (0.05, 0.4)]
        elif name == "type": [put(tick(), S(i) + D(i) * 0.15 + k2 * 0.085, 0.65) for k2 in range(int(D(i) * 0.7 / 0.085))]
        elif name == "tick": [put(tick(1500, 0.04), S(i) + k2 * 0.25, 0.9) for k2 in range(int(D(i) / 0.25))]
        elif name == "chime": put(chime(700 + 90 * (i % 3), 1.2), S(i) + 0.02, 0.75)
        elif name == "ding": put(chime(1318, 0.8), S(i) + 0.05, 0.7)
        elif name == "whoosh": put(whoosh(), S(i) - 0.2, 0.9)
        elif name == "flip": put(thud(), S(i) + D(i) * 0.45, 0.7); put(chime(1046, 1.2), S(i) + D(i) * 0.45 + 0.04, 0.6)
        elif name == "vote": put(chime(523, 2.0), S(i), 0.9)
# ---- mix: the bed ducks under the voice
w = int(0.15 * SR); e2 = np.convolve(np.abs(vo), np.ones(w) / w, "same"); duck = 1 - 0.6 * np.clip(e2 / 0.05, 0, 1)
vo_g = vo / (np.max(np.abs(vo)) + 1e-9) * 0.85
mix = np.tanh((vo_g + music / (np.max(np.abs(music)) + 1e-9) * 0.2 * duck + sfx * 0.5) * 1.1) * 0.92
sf.write(f"out/{EP}_audio.wav", mix[:int((total + 0.05) * SR)], SR)
json.dump({"durs": durs, "starts": starts, "total": total, "caps": caps}, open(f"episodes/{EP}.timing.json", "w"))
print("total", total, "s,", len(shots), "shots; longest", max(durs), "shortest", min(durs)); print(durs)
print(" | ".join(f"{c['t0']:.2f} " + " ".join(x for x, _ in c["w"]) for c in caps))
