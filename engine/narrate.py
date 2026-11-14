# Narrated render: speaks each scene's lines, stretches the scene so the voice fits, renders, adds the audio.
#   KOKORO_DIR=~/tts python3 engine/narrate.py scenes/<name>.narration.json [--plan]
#   -> scenes/<name>.timing.json (time warp read by render.mjs) and out/<name>.mp4 (with narration)
# JSON: {"voice": "bm_george", "lang": "en-gb", "speed": 1.08,
#        "segments": [[scene_start, scene_end, ["line", "line"]], ...]}   (segments in order, covering the scene)
# Needs: pip install kokoro-onnx soundfile; model files in $KOKORO_DIR:
#   github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/{kokoro-v1.0.onnx,voices-v1.0.bin}
import json, os, subprocess, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cfg_path = sys.argv[1]; name = os.path.basename(cfg_path).split('.')[0]
cfg = json.load(open(cfg_path))
kd = os.environ.get('KOKORO_DIR', os.path.expanduser('~/tts'))
k = Kokoro(os.path.join(kd, 'kokoro-v1.0.onnx'), os.path.join(kd, 'voices-v1.0.bin'))
SR = 24000
LEAD, GAP, TAIL = cfg.get('lead', 0.25), cfg.get('gap', 0.3), cfg.get('tail', 0.4)
clips, warp, v = [], [], 0.0
for si, (s0, s1, lines) in enumerate(cfg['segments']):
    warp.append([round(v, 3), s0])
    t = v + (0.1 if si == 0 else LEAD)
    for txt in lines:
        a, _ = k.create(txt, voice=cfg.get('voice', 'bm_george'), speed=cfg.get('speed', 1.08), lang=cfg.get('lang', 'en-gb'))
        clips.append((t, a)); t += len(a) / SR + GAP
    seg_len = max(s1 - s0, t - GAP + TAIL - v)
    print(f'scene {s0:5.1f}-{s1:5.1f} ({s1-s0:4.1f}s) -> video {v:5.1f}-{v+seg_len:5.1f} ({seg_len:4.1f}s, x{seg_len/(s1-s0):.2f})')
    v += seg_len
warp.append([round(v, 3), cfg['segments'][-1][1]])
print(f'total {v:.1f}s')
json.dump({'map': warp}, open(os.path.join(root, 'scenes', name + '.timing.json'), 'w'))
track = np.zeros(int(v * SR) + SR, dtype=np.float32)
for t, a in clips: s = int(t * SR); track[s:s + len(a)] += a
track = track[:int(v * SR)]; track = track / (np.abs(track).max() or 1) * 0.89
wav = os.path.join(root, 'out', f'_{name}_vo.wav'); os.makedirs(os.path.dirname(wav), exist_ok=True); sf.write(wav, track, SR)
if '--plan' in sys.argv: sys.exit()
subprocess.check_call(['node', os.path.join(root, 'engine/render.mjs'), os.path.join('scenes', name + '.js')], cwd=root)
video = os.path.join(root, 'out', name + '.mp4'); tmp = os.path.join(root, 'out', f'_{name}_mux.mp4')
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', video, '-i', wav, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', tmp])
os.replace(tmp, video); os.remove(wav); print(video)
