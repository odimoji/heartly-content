import sys, json, numpy as np, soundfile as sf, sherpa_onnx
d="/tmp/claude-0/-home-claude-heartly-content/7357ccbf-3169-5138-9a6c-036ee5648c2a/scratchpad/asr/sherpa-onnx-zipformer-en-2023-06-26/"
r=sherpa_onnx.OfflineRecognizer.from_transducer(encoder=d+"encoder-epoch-99-avg-1.int8.onnx",decoder=d+"decoder-epoch-99-avg-1.int8.onnx",joiner=d+"joiner-epoch-99-avg-1.int8.onnx",tokens=d+"tokens.txt",num_threads=4)
a,sr=sf.read(sys.argv[1],dtype="float32")
if a.ndim>1:a=a.mean(1)
if sr!=16000:
    n=int(len(a)*16000/sr); a=np.interp(np.linspace(0,len(a)-1,n),np.arange(len(a)),a).astype("float32")
words=[]
# decode in 20 s windows so timestamps stay accurate
W=20*16000; pos=0
s=r.create_stream(); s.accept_waveform(16000,a); r.decode_stream(s)
toks,ts=s.result.tokens,s.result.timestamps
cur=None
for t,x in zip(toks,ts):
    if t.startswith((" ","▁")) or cur is None:
        if cur: words.append(cur)
        cur=[t.strip(" ▁"),round(float(x),2)]
    else: cur[0]+=t
if cur: words.append(cur)
json.dump(words,open(sys.argv[2],"w")); print(" ".join(f"{w}@{t}" for w,t in words))
