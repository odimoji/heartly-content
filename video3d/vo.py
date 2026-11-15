# Speaks script.json with Kokoro for each voice, sizes every scene to the longer voice,
# writes src/timing.json (frames) and out/vo_<voice>.wav (voice + a quiet pad).
#   KOKORO_DIR=~/tts python3 vo.py
import json, os
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
here = os.path.dirname(os.path.abspath(__file__))
cfg = json.load(open(os.path.join(here, 'script.json')))
kd = os.environ.get('KOKORO_DIR', os.path.expanduser('~/tts'))
k = Kokoro(os.path.join(kd, 'kokoro-v1.0.onnx'), os.path.join(kd, 'voices-v1.0.bin'))
SR, FPS = 24000, 30
LEAD, GAP, TAIL = cfg['lead'], cfg['gap'], cfg['tail']
def trim(a, thr=0.004):
    idx = np.where(np.abs(a) > thr)[0]
    return a[max(0, idx[0] - 600): idx[-1] + 1800] if len(idx) else a
clips = {v: [[trim(k.create(l, voice=o['voice'], speed=o['speed'], lang=o['lang'])[0]) for l in s['lines']] for s in cfg['scenes']] for v, o in cfg['voices'].items()}
scenes, t = [], 0.0
for i, s in enumerate(cfg['scenes']):
    need = max(LEAD + sum(len(c) / SR + GAP for c in clips[v][i]) - GAP + TAIL for v in clips)
    dur = round(max(s['min'], need) * FPS) / FPS
    lines = []
    for j in range(len(s['lines'])):
        e = {}
        for v in clips:
            st = LEAD + sum(len(c) / SR + GAP for c in clips[v][i][:j])
            e[v] = [round(st, 3), round(len(clips[v][i][j]) / SR, 3)]
        lines.append(e)
    scenes.append({'id': s['id'], 'start': round(t * FPS), 'dur': round(dur * FPS), 'lines': lines})
    print(f"{s['id']:8s} {t:5.1f}s +{dur:4.1f}s  " + f'need {need:.1f}'); t += dur
total = t; print(f'total {total:.1f}s')
json.dump({'fps': FPS, 'total': round(total * FPS), 'scenes': scenes}, open(os.path.join(here, 'src', 'timing.json'), 'w'), indent=1)
# quiet pad: four slow chords, soft sines
n = int(total * SR); tt = np.arange(n) / SR; pad = np.zeros(n, dtype=np.float32)
chords = [[174.61, 220.0, 261.63, 329.63], [146.83, 220.0, 261.63, 349.23], [130.81, 196.0, 261.63, 329.63], [116.54, 174.61, 233.08, 293.66]]
seg = total / 8
for ci in range(8):
    c0 = ci * seg; env = np.clip((tt - c0 + 1.2) / 2.4, 0, 1) * np.clip((c0 + seg + 1.2 - tt) / 2.4, 0, 1); env = np.sin(env * np.pi / 2) ** 2
    for fq in chords[ci % 4]:
        pad += (env * (np.sin(2 * np.pi * fq * tt) + 0.3 * np.sin(2 * np.pi * fq * 2 * tt + 1) ) * (1 + 0.15 * np.sin(2 * np.pi * 0.21 * tt + fq))).astype(np.float32)
pad *= np.clip(tt / 1.0, 0, 1) * np.clip((total - tt) / 1.5, 0, 1); pad = pad / np.abs(pad).max() * 0.06
os.makedirs(os.path.join(here, 'out'), exist_ok=True)
for v in clips:
    tr = np.zeros(n + SR, dtype=np.float32)
    for i, sc in enumerate(scenes):
        for j, c in enumerate(clips[v][i]):
            s0 = int((sc['start'] / FPS + sc['lines'][j][v][0]) * SR); c = c / (np.abs(c).max() or 1) * 0.8; tr[s0:s0 + len(c)] += c
    tr = tr[:n]; out = tr + pad; sf.write(os.path.join(here, 'out', f'vo_{v}.wav'), out, SR)
