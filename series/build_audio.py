# Builds episode 1's sound: the ElevenLabs narration (one take, cut only at its own pauses so each line can sit on its shot),
# Zara's two lines (ElevenLabs sample 7), an original synthesised music bed and sound effects (nothing licensed or sampled).
# Writes episodes/ep01.timing.json (shot lengths, driven by the audio) and out/ep01_audio.wav.
import json, numpy as np, soundfile as sf
SR = 44100
narr, _ = sf.read("audio/narr.wav"); zara, _ = sf.read("audio/zara.wav")
cut = lambda a, t0, t1: a[int(max(0, t0 - 0.04) * SR):int((t1 + 0.08) * SR)].copy()
L = [cut(narr, *t) for t in [(0, 2.83), (3.12, 4.53), (4.99, 9.17), (9.66, 14.25), (14.69, 16.24), (16.75, 19.46), (19.87, 22.08), (22.5, 25.62), (25.9, 27.32), (27.72, 30.17), (30.58, 31.22), (31.73, 33.08)]]
ZA, ZB = cut(zara, 0, 1.95) * 1.6, cut(zara, 2.45, 3.3) * 5.0
for a in L + [ZA, ZB]:
    n = int(0.02 * SR); a[:n] *= np.linspace(0, 1, n); a[-n:] *= np.linspace(1, 0, n)
# shot -> (voice clip, offset into shot, minimum length)
plan = [(L[0], 0.1, 1.8), (None, 0, 1.4), (L[1], 0.15, 2.0), (None, 0, 1.6), (None, 0, 2.0), (L[2], 0.15, 0), (L[3], 0.15, 0), (ZA, 0.2, 2.4), (L[4], 0.15, 1.9), (None, 0, 1.4),
        (L[5], 0.15, 2.4), (L[6], 0.15, 2.4), (None, 0, 1.4), (L[7], 0.1, 0), (None, 0, 2.0), (L[8], 0.3, 2.2), (None, 0, 1.4), (L[9], 0.15, 2.4), (None, 0, 3.4), (None, 0, 2.6),
        (None, 0, 3.6), (ZB, 0.9, 2.6), (L[10], 0.5, 4.6), (L[11], 0.9, 3.2)]
durs = []
for i, (clip, off, mn) in enumerate(plan):
    need = (len(clip) / SR + off + 0.2) if clip is not None else 0
    if i == 0: need = max(1.8, need - 1.4)  # the first line runs on over shot 2
    durs.append(round(max(mn, need), 2))
starts = np.concatenate([[0], np.cumsum(durs)]); total = float(starts[-1]); N = int((total + 0.5) * SR)
vo = np.zeros(N)
for i, (clip, off, mn) in enumerate(plan):
    if clip is None: continue
    s = int((starts[i] + off) * SR); vo[s:s + len(clip)] += clip
# ---- music: a slow, airy pad. Four long chords, soft attack, a high shimmer, a wash of reverb.
t = np.arange(N) / SR
def tone(f, det=0.0): return np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * (f * (1 + det)) * t + 1.3) + 0.25 * np.sin(2 * np.pi * f * 2 * t + 0.4)
chords = [[146.83, 220.0, 261.63, 329.63], [116.54, 174.61, 220.0, 293.66], [174.61, 220.0, 261.63, 349.23], [130.81, 196.0, 246.94, 329.63]]  # Dm9, Bbmaj7, F, Cmaj7
bar = total / 8; pad = np.zeros(N)
for b in range(9):
    ch = chords[b % 4]; t0 = b * bar; env = np.clip((t - t0) / (bar * 0.45), 0, 1) * np.clip((t0 + bar * 1.5 - t) / (bar * 0.6), 0, 1); env = env ** 1.5
    for j, f in enumerate(ch): pad += env * tone(f, 0.004 + 0.002 * j) * (0.3 if j == 0 else 0.22)
shim = np.zeros(N); rng = np.random.default_rng(4)
for k in range(int(total / 1.9)):
    t0 = 0.8 + k * 1.9 + rng.uniform(-0.3, 0.3); f = rng.choice([659.25, 783.99, 880.0, 1046.5, 1318.5]); e = np.exp(-np.clip(t - t0, 0, None) * 2.2) * (t >= t0); shim += e * np.sin(2 * np.pi * f * t) * 0.12
music = pad * 0.5 + shim
ir = rng.standard_normal(int(2.6 * SR)) * np.exp(-np.arange(int(2.6 * SR)) / (0.7 * SR)); ir /= np.abs(ir).sum() ** 0.5 * 12
music = music * 0.5 + np.convolve(music, ir)[:N] * 0.9
k = int(SR * 0.004); music = np.convolve(music, np.ones(k) / k, "same")  # take the edge off
music *= np.clip(t / 1.5, 0, 1) * np.clip((total + 0.4 - t) / 2.0, 0, 1)
# ---- sound effects, all synthesised
sfx = np.zeros(N)
def put(a, at, g=1.0):
    s = int(at * SR); e = min(N, s + len(a)); sfx[s:e] += a[:e - s] * g
def whoosh(d=0.5): n = int(d * SR); x = rng.standard_normal(n); f = np.linspace(0.02, 0.5, n); y = np.zeros(n); acc = 0.0
def whoosh(d=0.5):
    n = int(d * SR); x = rng.standard_normal(n); y = np.zeros(n); acc = 0.0; a = np.linspace(0.01, 0.35, n)
    for i in range(n): acc += a[i] * (x[i] - acc); y[i] = acc
    return y * np.sin(np.linspace(0, np.pi, n)) ** 2 * 0.5
def tick(f=2400, d=0.03): n = int(d * SR); return rng.standard_normal(n) * np.exp(-np.arange(n) / (0.004 * SR)) * 0.25 + np.sin(2 * np.pi * f * np.arange(n) / SR) * np.exp(-np.arange(n) / (0.006 * SR)) * 0.1
def buzz(d=0.28): n = int(d * SR); tt = np.arange(n) / SR; return np.sign(np.sin(2 * np.pi * 160 * tt)) * 0.12 * np.sin(np.pi * tt / d) ** 0.5 * (0.6 + 0.4 * np.sin(2 * np.pi * 26 * tt))
def chime(f=880, d=1.6): n = int(d * SR); tt = np.arange(n) / SR; return (np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * f * 1.5 * tt) + 0.3 * np.sin(2 * np.pi * f * 2 * tt)) * np.exp(-tt * 2.6) * 0.16
def thud(d=0.25): n = int(d * SR); tt = np.arange(n) / SR; return np.sin(2 * np.pi * (90 - 60 * tt / d) * tt) * np.exp(-tt * 16) * 0.5
S = lambda i: float(starts[i])
for i in (6, 10, 12, 22): put(whoosh(0.55), S(i) - 0.3, 0.9)          # into the office, the daydream, the bedroom, the vote
put(thud(), 0.05, 0.8); put(chime(1318, 0.9), 0.12, 0.6)                 # the tap that says yes
for k2 in range(9): put(tick(), S(3) + 0.25 + k2 * 0.12, 0.8)            # typing to Remy
for j, at in enumerate((0.25, 0.75, 1.25)): put(buzz(), S(4) + at, 1.0)  # three replies
put(thud(), S(8) + 0.5, 0.6)                                             # dignity drops
for k2 in range(18): put(tick(), S(13) + 0.3 + k2 * 0.13, 0.7)           # drafts at 1am
for k2 in range(12): put(tick(), S(15) + 0.2 + k2 * 0.1, 0.7)
for k2 in range(16): put(tick(), S(18) + 0.9 + k2 * 0.13, 0.6)           # writing it out
put(chime(659, 2.0), S(19) + 0.1, 0.8); put(chime(880, 2.0), S(20) + 1.2, 0.6)  # the reply arrives
put(chime(523, 2.4), S(22) + 0.1, 0.9); put(thud(), S(23) + 1.6, 0.7); put(chime(1046, 1.4), S(23) + 1.65, 0.6)  # the vote; the counter flips
# ---- mix: the bed ducks under the voice
w = int(0.15 * SR); env = np.convolve(np.abs(vo), np.ones(w) / w, "same"); duck = 1 - 0.6 * np.clip(env / 0.05, 0, 1)
vo_g = vo / (np.max(np.abs(vo)) + 1e-9) * 0.85
mix = vo_g + music / (np.max(np.abs(music)) + 1e-9) * 0.2 * duck + sfx * 0.5
mix = np.tanh(mix * 1.1) * 0.92
sf.write("out/ep01_audio.wav", mix, SR)
json.dump({"durs": durs, "starts": [round(float(x), 3) for x in starts[:-1]], "total": round(total, 2)}, open("episodes/ep01.timing.json", "w"))
print("total", round(total, 2), "s"); print(durs)
rms = lambda a: 20 * np.log10(np.sqrt((a ** 2).mean()) + 1e-9)
print("levels dB  voice", round(rms(vo_g[np.abs(vo_g) > 0.01]), 1), " music under voice", round(rms(music / np.max(np.abs(music)) * 0.2 * 0.4), 1), " music alone", round(rms(music / np.max(np.abs(music)) * 0.2), 1))
