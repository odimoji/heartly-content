// Shared kit for Heartly 3D videos: camera, lights, the midnight stage, captions, bubbles, the phone, and scene timing.
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "three";
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useFontsReady } from "./fonts";
import { SoftBlurIn } from "./remocn/soft-blur-in";
import { easeOut, seg, V3 } from "./three/parts";

export const FPS = 30;
export type LightKind = "night" | "morning" | "afternoon" | "dinner" | "dawn";
export const CREAM = "#f6ecdc", GOLD = "#d9b26a";
export const sp = (frame: number, damping = 13, stiffness = 150) => spring({ frame, fps: FPS, config: { damping, stiffness } });

export const Cam: React.FC<{ target: V3; d: number; yaw?: number; el?: number; fov?: number }> = ({ target, d, yaw = 0.26, el = 0.19, fov = 26 }) => {
  const cam = useThree((s) => s.camera) as PerspectiveCamera;
  cam.position.set(target[0] + d * Math.sin(yaw) * Math.cos(el), target[1] + d * Math.sin(el), target[2] + d * Math.cos(yaw) * Math.cos(el));
  cam.fov = fov;
  cam.lookAt(target[0], target[1], target[2]);
  cam.updateProjectionMatrix();
  return null;
};

// k scales every light, so two kinds can be cross-faded (night into dawn)
export const Lights: React.FC<{ kind: LightKind; k?: number }> = ({ kind, k = 1 }) => {
  if (k <= 0.001) return null;
  const key = (pos: V3, color: string, intensity: number) => (
    <directionalLight position={pos} color={color} intensity={intensity * k} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0005} shadow-normalBias={0.02}>
      <orthographicCamera attach="shadow-camera" args={[-3.2, 3.2, 3.2, -3.2, 0.5, 24]} />
    </directionalLight>
  );
  if (kind === "night")
    return (
      <>
        <hemisphereLight args={["#5f5a8a", "#1c1410", 0.7 * k]} />
        {key([2.5, 5, 5], "#b3bcff", 0.8)}
        <pointLight position={[1.05, 1.5, -0.45]} color="#ffb060" intensity={8 * k} distance={5} decay={1.6} />
        <pointLight position={[0.4, 1.4, 1.6]} color="#ffd2a6" intensity={2.4 * k} distance={6} decay={1.6} />
      </>
    );
  if (kind === "dawn")
    return (
      <>
        <hemisphereLight args={["#ffd9bd", "#6b4a40", 1.35 * k]} />
        {key([3, 4.2, 5], "#ffc497", 2.9)}
        <pointLight position={[-0.8, 1.7, -0.5]} color="#ffb98a" intensity={5 * k} distance={5} decay={1.6} />
      </>
    );
  if (kind === "dinner")
    return (
      <>
        <hemisphereLight args={["#a0705a", "#1f1512", 0.75 * k]} />
        {key([3, 6, 4.5], "#ffd2a0", 0.9)}
        <pointLight position={[-0.5, 1.7, 0.05]} color="#ffb060" intensity={5.5 * k} distance={4.5} decay={1.5} />
        <pointLight position={[0.5, 1.7, 0.05]} color="#ffb060" intensity={5.5 * k} distance={4.5} decay={1.5} />
      </>
    );
  if (kind === "afternoon")
    return (
      <>
        <hemisphereLight args={["#fff0d6", "#9a7654", 0.95 * k]} />
        {key([3.4, 5, 4.5], "#ffe0b0", 2.3)}
      </>
    );
  return (
    <>
      <hemisphereLight args={["#ffe9c9", "#8a6a4f", 0.9 * k]} />
      {key([4.2, 4.2, 4.2], "#ffd093", 2.7)}
    </>
  );
};

// Worry's own colour: a soft violet light from behind that catches the edge of his coat
export const Rim: React.FC<{ pos: V3; r: number }> = ({ pos, r }) => (
  <pointLight color="#a98bff" position={[pos[0] - 0.15, pos[1] + r * 2.3, pos[2] - r * 1.5]} intensity={13 * r} distance={Math.max(1.2, r * 7)} decay={1.5} />
);

// the stage: Heartly's midnight ground with a glow behind the set
export const glow = (c: string, size = 44) => `radial-gradient(ellipse 95% ${size}% at 50% 50%, ${c} 0%, rgba(18,13,10,0) 72%), #120d0a`;


// ---------- DOM overlays ----------
export const serif: React.CSSProperties = { fontFamily: "Cormorant", fontWeight: 600, color: CREAM, textShadow: "0 3px 18px rgba(0,0,0,.65)" };
export const Eyebrow: React.FC<{ text: string; from?: number }> = ({ text, from = 4 }) => {
  const f = useCurrentFrame();
  return <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 30, letterSpacing: "0.24em", color: GOLD, opacity: seg(f, from, from + 8), textShadow: "0 2px 10px rgba(0,0,0,.6)" }}>{text}</div>;
};
export const Cap: React.FC<{ eyebrow?: string; text?: string; from?: number }> = ({ eyebrow, text, from = 6 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 244, textAlign: "center" }}>
    {eyebrow && <Eyebrow text={eyebrow} />}
    {text && <div style={{ ...serif, marginTop: 12, fontStyle: "italic", fontSize: 84, lineHeight: 1.05 }}><SoftBlurIn text={text} from={from} /></div>}
  </div>
);

export const Bubble: React.FC<{ text: string; from: number; x: number; y: number; tail?: "left" | "right" }> = ({ text, from, x, y, tail = "right" }) => {
  const f = useCurrentFrame();
  if (f < from) return null;
  const k = sp(f - from, 11, 190);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${k})`, transformOrigin: tail === "right" ? "75% 100%" : "25% 100%" }}>
      <div style={{ background: "#f6ecdc", borderRadius: 34, padding: "14px 34px 20px", fontFamily: "Caveat", fontWeight: 700, fontSize: 60, color: "#2a2420", whiteSpace: "nowrap", boxShadow: "0 8px 26px rgba(0,0,0,.4), 0 0 0 3px rgba(169,139,255,.55)" }}>{text}</div>
      <div style={{ position: "absolute", bottom: -22, [tail === "right" ? "right" : "left"]: 70, width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderTop: "26px solid #f6ecdc" }} />
    </div>
  );
};


// the drawn Heartly phone: the entry types in, then Heartly's reply arrives at replyAt (frames, scene-local)
export const PhoneUI: React.FC<{ lf: number; replyAt: number; entry: string; reply: string[] }> = ({ lf, replyAt, entry, reply }) => {
  const k = sp(lf - 3, 16, 120);
  const n = Math.floor(seg(lf, 10, replyAt - 12) * entry.length);
  const rk = sp(lf - replyAt, 15, 140);
  return (
    <div style={{ position: "absolute", left: 210, top: 440 + (1 - k) * 200, width: 660, height: 880, borderRadius: 64, background: "#17120e", border: "6px solid #e9dcc6", boxShadow: "0 30px 90px rgba(0,0,0,.6), 0 0 120px rgba(217,100,58,.22)", padding: "40px 46px", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center", fontFamily: "Cormorant", fontWeight: 600, fontSize: 52, color: CREAM, letterSpacing: "0.01em" }}>Heartly</div>
      <div style={{ marginTop: 30, fontFamily: "Inter", fontWeight: 600, fontSize: 24, letterSpacing: "0.2em", color: "#9c8e80" }}>YOU</div>
      <div style={{ marginTop: 12, fontFamily: "Inter", fontWeight: 500, fontSize: 38, lineHeight: 1.38, color: "#efe4d2", minHeight: 270 }}>
        {entry.slice(0, n)}
        {lf < replyAt && Math.floor(lf / 8) % 2 === 0 ? "|" : ""}
      </div>
      {lf >= replyAt && (
        <div style={{ marginTop: 22, transform: `translateY(${(1 - rk) * 30}px)`, opacity: rk, background: "#241b15", borderRadius: 30, padding: "22px 30px 30px", boxShadow: "0 0 0 2px rgba(217,178,106,.35)" }}>
          <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 24, letterSpacing: "0.2em", color: GOLD }}>HEARTLY</div>
          <div style={{ marginTop: 8, fontFamily: "Cormorant", fontStyle: "italic", fontWeight: 600, fontSize: 56, lineHeight: 1.12, color: CREAM }}>
            {reply.map((r, i) => (
              <div key={i}><SoftBlurIn text={r} from={replyAt + 3 + i * 9} /></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// a closing fact with its source: small gold label, the claim in two lines, and a footnote
export const Fact: React.FC<{ eyebrow: string; lines: [string, string]; source: string; at1?: number; at2?: number }> = ({ eyebrow, lines, source, at1 = 8, at2 = 40 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 1128, left: 50, right: 50, textAlign: "center" }}>
      <Eyebrow text={eyebrow} from={Math.max(0, at1 - 4)} />
      <div style={{ ...serif, marginTop: 14, fontSize: 70, lineHeight: 1.06 }}><SoftBlurIn text={lines[0]} from={at1} /></div>
      <div style={{ ...serif, marginTop: 4, fontSize: 84, lineHeight: 1.06, fontStyle: "italic", color: GOLD }}><SoftBlurIn text={lines[1]} from={at2} /></div>
      <div style={{ marginTop: 18, fontFamily: "Inter", fontWeight: 500, fontSize: 24, color: "rgba(246,236,220,.7)", opacity: seg(f, at2 + 14, at2 + 26) }}>{source}</div>
    </div>
  );
};

// scene clock: which scene we are in, frames since it started, narration windows, cues, and the zoom-through values
type Timing = { fps: number; total: number; scenes: { id: string; start: number; dur: number; lines: { A: number[] }[]; cues: Record<string, number> }[] };
export const useScene = (timing: Timing) => {
  const f = useCurrentFrame();
  const idx = Math.max(0, timing.scenes.findIndex((s) => f >= s.start && f < s.start + s.dur));
  const sc = timing.scenes[idx];
  const lf = f - sc.start, p = lf / sc.dur;
  const line = (j: number) => Math.round(sc.lines[j].A[0] * FPS);
  const lineEnd = (j: number) => Math.round((sc.lines[j].A[0] + sc.lines[j].A[1]) * FPS);
  const cue = (name: string, fallback: number) => sc.cues[name] ?? fallback;
  const talk = (on: boolean) => (on ? Math.abs(Math.sin(f * 0.95)) : 0);
  // zoom-through cuts: rush in at the end of a scene, settle in from far at the start of the next
  const zin = idx < timing.scenes.length - 1 ? Math.pow(seg(lf, sc.dur - 7, sc.dur), 2) : 0;
  const zout = idx > 0 ? 1 - easeOut(seg(lf, 0, 9)) : 0;
  const zd = (d: number) => d * (1 - 0.45 * zin) * (1 + 0.6 * zout);
  return { f, idx, sc, id: sc.id, lf, p, line, lineEnd, cue, talk, zin, zout, zd };
};

// the frame: glow background, the 3D canvas (blurred during zoom cuts), scrim for text, grain, then captions
export const Stage: React.FC<{ bg: string; scene: ReturnType<typeof useScene>; scrim?: "top" | "bottom" | "none"; overlay?: React.ReactNode; children: React.ReactNode }> = ({ bg, scene, scrim = "top", overlay, children }) => {
  const { width, height } = useVideoConfig();
  const fonts = useFontsReady();
  const { f, zin, zout, sc } = scene;
  const blur = Math.max(zin, zout) * 18;
  return (
    <AbsoluteFill style={{ background: bg }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={Math.floor(f / 2)} />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.88  0 0 0 0.16 0" />
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
        <ThreeCanvas width={width} height={height} shadows camera={{ fov: 26, near: 0.1, far: 80 }}>
          {children}
        </ThreeCanvas>
      </AbsoluteFill>
      {scrim === "top" && <AbsoluteFill style={{ background: "linear-gradient(rgba(12,9,7,.9) 0%, rgba(12,9,7,.7) 20%, rgba(12,9,7,0) 34%)" }} />}
      {scrim === "bottom" && <AbsoluteFill style={{ background: "linear-gradient(rgba(12,9,7,0) 48%, rgba(12,9,7,.82) 64%, rgba(12,9,7,.95) 100%)" }} />}
      <AbsoluteFill style={{ filter: "url(#grain)", mixBlendMode: "soft-light", opacity: 0.9 }} />
      <AbsoluteFill style={{ opacity: 1 - zin }}>
        {/* the Sequence gives captions and bubbles a frame count that starts with their scene */}
        <Sequence key={sc.id} from={sc.start} layout="none">{fonts && overlay}</Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
