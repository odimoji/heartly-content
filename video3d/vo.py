# Directed narration. script.json gives a cast (narrator, Worry, Heartly) and, for every phrase, how to say it:
# who, speed, pitch (semitones), gain, pause before, and an optional cue name the animation can sync to.
# Writes src/timing.json (scene lengths, line windows, cues, in frames) and out/vo.wav (voices + quiet pad).
#   KOKORO_DIR=~/tts python3 vo.py
import json, os
from fractions import Fraction
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
from kokoro_onnx import Kokoro
here = os.path.dirname(os.path.abspath(__file__))
cfg = json.load(open(os.path.join(here, 'script.json')))
kd = os.environ.get('KOKORO_DIR', os.path.expanduser('~/tts'))
k = Kokoro(os.path.join(kd, 'kokoro-v1.0.onnx'), os.path.join(kd, 'voices-v1.0.bin'))
SR, FPS = 24000, 30
LEAD, GAP, TAIL = cfg['lead'], cfg['gap'], cfg['tail']
try:
    import pyworld as pw
    def f0med(a):
        f0, _ = pw.harvest(a.astype(np.float64), SR, f0_floor=60, f0_ceil=600); v = f0[f0 > 0]; return float(np.median(v)) if len(v) else 0
except ImportError:
    f0med = lambda a: 0
def trim(a, thr=0.004):
    idx = np.where(np.abs(a) > thr)[0]
    return a[max(0, idx[0] - 500): idx[-1] + 1500] if len(idx) else a
def say(ph):
    c = cfg['cast'][ph.get('who', 'n')]
    speed, pitch = ph.get('speed', c['speed']) , c['pitch'] + ph.get('pitch', 0)
    if 'speed' in ph and ph.get('who', 'n') != 'n': speed = ph['speed']
    r = 2 ** (pitch / 12)                      # pitch by resampling: speak slower/faster first so the pace comes out as asked
    a = trim(k.create(ph['t'], voice=c['voice'], speed=speed / r, lang=c['lang'])[0])
    if abs(r - 1) > 1e-3:
        fr = Fraction(1 / r).limit_denominator(300); a = resample_poly(a, fr.numerator, fr.denominator).astype(np.float32)
    a = a / (np.abs(a).max() or 1) * ph.get('gain', c['gain'])
    return a
scenes, clips, t = [], [], 0.0
for s in cfg['scenes']:
    cur, lines, cues = LEAD, [], {}
    for line in s['lines']:
        start = None
        for ph in line:
            cur += ph.get('pause', 0)
            a = say(ph); d = len(a) / SR
            if start is None: start = cur
            if 'cue' in ph: cues[ph['cue']] = round(cur * FPS)
            clips.append((t + cur, a))
            w = len(ph['t'].split())
            print(f"  {s['id']:7s} {ph.get('who','n')} {t+cur:5.1f}s {d:4.1f}s  {w/d:3.1f} w/s  {f0med(a):4.0f} Hz  {ph['t']}")
            cur += d
        lines.append({'A': [round(start, 3), round(cur - start, 3)]}); cur += GAP
    dur = round(max(s['min'], cur - GAP + TAIL) * FPS) / FPS
    scenes.append({'id': s['id'], 'start': round(t * FPS), 'dur': round(dur * FPS), 'lines': lines, 'cues': cues}); t += dur
total = t; print(f'total {total:.1f}s')
json.dump({'fps': FPS, 'total': round(total * FPS), 'scenes': scenes}, open(os.path.join(here, 'src', 'timing.json'), 'w'), indent=1)
n = int(total * SR); tt = np.arange(n) / SR; pad = np.zeros(n, dtype=np.float32)
chords = [[174.61, 220.0, 261.63, 329.63], [146.83, 220.0, 261.63, 349.23], [130.81, 196.0, 261.63, 329.63], [116.54, 174.61, 233.08, 293.66]]
seg = total / 8
for ci in range(8):
    c0 = ci * seg; env = np.clip((tt - c0 + 1.2) / 2.4, 0, 1) * np.clip((c0 + seg + 1.2 - tt) / 2.4, 0, 1); env = np.sin(env * np.pi / 2) ** 2
    for fq in chords[ci % 4]:
        pad += (env * (np.sin(2 * np.pi * fq * tt) + 0.3 * np.sin(2 * np.pi * fq * 2 * tt + 1)) * (1 + 0.15 * np.sin(2 * np.pi * 0.21 * tt + fq))).astype(np.float32)
pad *= np.clip(tt / 1.0, 0, 1) * np.clip((total - tt) / 1.5, 0, 1); pad = pad / np.abs(pad).max() * 0.06
tr = np.zeros(n + 2 * SR, dtype=np.float32)
for st, a in clips: s0 = int(st * SR); tr[s0:s0 + len(a)] += a
os.makedirs(os.path.join(here, 'out'), exist_ok=True)
sf.write(os.path.join(here, 'out', 'vo.wav'), np.clip(tr[:n] + pad, -0.98, 0.98), SR)
