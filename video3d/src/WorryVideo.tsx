// "Her worry gave a presentation at 3am": 3D story video (Remotion + three.js), "night to dawn" look.
// Scene lengths come from src/timing.json, written by vo.py from the narration.
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "three";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import timing from "./timing.json";
import { useFontsReady } from "./fonts";
import { SoftBlurIn } from "./remocn/soft-blur-in";
import { Ball, ease, easeOut, lerp, seg, Stick, V3 } from "./three/parts";
import { Bedroom, Cafe, Office, Slide, Street } from "./three/sets";
import { Woman } from "./three/Woman";
import { Worry } from "./three/Worry";

const FPS = 30;
type Scene = (typeof timing.scenes)[number];
type LightKind = "night" | "morning" | "afternoon" | "dinner" | "dawn";
const CREAM = "#f6ecdc", GOLD = "#d9b26a";
const sp = (frame: number, damping = 13, stiffness = 150) => spring({ frame, fps: FPS, config: { damping, stiffness } });

const Cam: React.FC<{ target: V3; d: number; yaw?: number; el?: number; fov?: number }> = ({ target, d, yaw = 0.26, el = 0.19, fov = 26 }) => {
  const cam = useThree((s) => s.camera) as PerspectiveCamera;
  cam.position.set(target[0] + d * Math.sin(yaw) * Math.cos(el), target[1] + d * Math.sin(el), target[2] + d * Math.cos(yaw) * Math.cos(el));
  cam.fov = fov;
  cam.lookAt(target[0], target[1], target[2]);
  cam.updateProjectionMatrix();
  return null;
};

// k scales every light, so two kinds can be cross-faded (night into dawn)
const Lights: React.FC<{ kind: LightKind; k?: number }> = ({ kind, k = 1 }) => {
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
const Rim: React.FC<{ pos: V3; r: number }> = ({ pos, r }) => (
  <pointLight color="#a98bff" position={[pos[0] - 0.15, pos[1] + r * 2.3, pos[2] - r * 1.5]} intensity={13 * r} distance={Math.max(1.2, r * 7)} decay={1.5} />
);

// the stage: Heartly's midnight ground with a glow behind the set
const glow = (c: string, size = 44) => `radial-gradient(ellipse 95% ${size}% at 50% 50%, ${c} 0%, rgba(18,13,10,0) 72%), #120d0a`;
const BG: Record<string, string> = {
  hook: glow("rgba(126,98,214,.30)"), huge: glow("rgba(126,98,214,.30)"), phone: glow("rgba(217,100,58,.26)", 52),
  none: glow("rgba(240,150,100,.42)", 50), street: glow("rgba(232,170,90,.40)"), pocket: glow("rgba(244,160,100,.46)", 50), ask: glow("rgba(244,160,100,.46)", 50),
  office: glow("rgba(232,170,90,.36)"), dinner: glow("rgba(217,100,58,.34)"),
};

// ---------- DOM overlays ----------
const serif: React.CSSProperties = { fontFamily: "Cormorant", fontWeight: 600, color: CREAM, textShadow: "0 3px 18px rgba(0,0,0,.65)" };
const Eyebrow: React.FC<{ text: string; from?: number }> = ({ text, from = 4 }) => {
  const f = useCurrentFrame();
  return <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 30, letterSpacing: "0.24em", color: GOLD, opacity: seg(f, from, from + 8), textShadow: "0 2px 10px rgba(0,0,0,.6)" }}>{text}</div>;
};
const Cap: React.FC<{ eyebrow?: string; text?: string; from?: number }> = ({ eyebrow, text, from = 6 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 244, textAlign: "center" }}>
    {eyebrow && <Eyebrow text={eyebrow} />}
    {text && <div style={{ ...serif, marginTop: 12, fontStyle: "italic", fontSize: 84, lineHeight: 1.05 }}><SoftBlurIn text={text} from={from} /></div>}
  </div>
);

const Bubble: React.FC<{ text: string; from: number; x: number; y: number; tail?: "left" | "right" }> = ({ text, from, x, y, tail = "right" }) => {
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

const Phone: React.FC<{ lf: number; replyAt: number }> = ({ lf, replyAt }) => {
  const k = sp(lf - 3, 16, 120);
  const entry = "slide one: i’m getting fired. slide two: that mole. slide three: everyone’s annoyed with me.";
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
            <SoftBlurIn text="Which of these is" from={replyAt + 3} /><br />
            <SoftBlurIn text="happening right now?" from={replyAt + 12} />
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- the video ----------
export const WorryVideo: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const fonts = useFontsReady();
  const idx = Math.max(0, timing.scenes.findIndex((s) => f >= s.start && f < s.start + s.dur));
  const sc: Scene = timing.scenes[idx];
  const lf = f - sc.start, p = lf / sc.dur;
  const line = (j: number) => Math.round(sc.lines[j].A[0] * FPS);
  const lineEnd = (j: number) => Math.round((sc.lines[j].A[0] + sc.lines[j].A[1]) * FPS);
  const talk = (on: boolean) => (on ? Math.abs(Math.sin(f * 0.95)) : 0);
  const id = sc.id;
  // zoom-through cuts: rush in at the end of a scene, settle in from far at the start of the next
  const zin = idx < timing.scenes.length - 1 ? Math.pow(seg(lf, sc.dur - 7, sc.dur), 2) : 0;
  const zout = idx > 0 ? 1 - easeOut(seg(lf, 0, 9)) : 0;
  const zd = (d: number) => d * (1 - 0.45 * zin) * (1 + 0.6 * zout);

  let content: React.ReactNode = null, cam: React.ReactNode = null, lights: React.ReactNode = <Lights kind="morning" />, overlay: React.ReactNode = null;

  if (id === "hook") {
    const r = 0.42, wp: V3 = [1.0, 0, 0.22];
    const flipAt = line(1) - 7;
    const flip = ease(seg(lf, flipAt, flipAt + 15));
    const tap = Math.max(0, Math.sin(f * 0.5)) * 0.05;
    const hop = lf >= flipAt && lf < flipAt + 12 ? Math.sin(seg(lf, flipAt, flipAt + 12) * Math.PI) * 0.18 : 0;
    const speaking = (lf >= line(0) && lf <= lineEnd(0)) || (lf >= line(1) && lf <= lineEnd(1));
    lights = <Lights kind="night" />;
    content = (
      <>
        <Bedroom slide={{ kind: "one" }} prev={{ kind: "cover" }} flip={flip} fonts={fonts} f={f} />
        <Woman pos={[-0.8, 0.6, 0.7]} rotX={-Math.PI / 2} pose={{ armL: [-0.5, 0.25], armR: [-0.5, 0.25], headTurn: 0.5 }} />
        <Worry pos={wp} r={r} f={f} rotY={lerp(0.25, -0.45, ease(seg(lf, 6, 24)))} look={[lerp(0, -0.75, ease(seg(lf, 8, 22))), 0.25]} mood="smug" talk={talk(speaking)} hop={hop} squash={hop > 0 ? 0.1 : 0} />
        <Rim pos={wp} r={r} />
        <Stick a={[wp[0] - r * 0.95, r * 1.75, wp[2] + 0.1]} b={[0.54, 1.2 + tap, -0.42]} r={0.012} c="#f3ead9" />
        <Stick a={[wp[0] - r * 0.6, r * 1.6, wp[2] + 0.1]} b={[wp[0] - r * 0.98, r * 1.76, wp[2] + 0.1]} r={0.03} c="#221c22" />
      </>
    );
    // open tight on his face, pull back to the flipchart, then out to the whole room
    const k1 = easeOut(seg(lf, 2, 30)), k2 = ease(seg(lf, line(1) + 30, sc.dur - 6));
    const t1: V3 = [lerp(0.98, 0.66, k1), lerp(0.84, 1.08, k1), lerp(0.25, -0.1, k1)];
    cam = <Cam target={[lerp(t1[0], 0.1, k2), lerp(t1[1], 1.05, k2), lerp(t1[2], 0, k2)]} d={zd(lerp(lerp(3.3, 7.6, k1), 12.2, k2))} yaw={lerp(lerp(0.1, 0.2, k1), 0.26, k2)} />;
    overlay = (
      <>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 640, background: "linear-gradient(rgba(14,10,8,.98) 0%, rgba(14,10,8,.96) 62%, rgba(14,10,8,0) 100%)" }} />
        <div style={{ position: "absolute", top: 236, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 30, letterSpacing: "0.24em", color: GOLD }}>3:00 AM</div>
          <div style={{ ...serif, marginTop: 12, fontSize: 98, lineHeight: 1.0 }}>
            Her worry gave<br />a presentation <span style={{ fontStyle: "italic", color: GOLD, display: "inline-block", marginLeft: 16, transform: `scale(${1 + 0.18 * Math.max(0, 1 - lf / 10)})` }}>at 3am.</span>
          </div>
        </div>
      </>
    );
  } else if (id === "huge") {
    const grow = sp(lf - 24, 9, 120);
    const r = lerp(0.42, 0.58, grow), wp: V3 = [1.12, 0, 0.5];
    const flipAt = 56, flip = ease(seg(lf, flipAt, flipAt + 15));
    const shake = Math.sin(lf * 2.4) * 0.025 * Math.max(0, 1 - Math.abs(lf - 30) / 12);
    lights = <Lights kind="night" />;
    content = (
      <>
        <Bedroom slide={{ kind: "three" }} prev={{ kind: "two" }} flip={flip} fonts={fonts} f={f} chartX={0.1} pillowUp={1} />
        <Woman pos={[-0.8, 0.47, -0.52]} rotY={0.3} pose={{ sit: true, armL: [-1.0 - 0.9 * ease(seg(lf, 30, 46)), -0.25], armR: [-1.0 - 0.9 * ease(seg(lf, 30, 46)), -0.25], headTurn: 0.35, headTilt: 0.12, pillow: ease(seg(lf, 30, 46)) }} />
        <Worry pos={wp} r={r} f={f} rotY={-0.45} look={[-0.75, 0.25]} mood="smug" talk={talk(lf >= line(0) && lf <= lineEnd(0))} squash={(1 - grow) * 0.0 + Math.sin(Math.min(1, seg(lf, 24, 40)) * Math.PI) * 0.12} />
        <Rim pos={wp} r={r} />
        <Stick a={[wp[0] - r * 0.95, r * 1.75, wp[2] + 0.1]} b={[0.32, 1.25 + Math.max(0, Math.sin(f * 0.5)) * 0.05, -0.42]} r={0.012} c="#f3ead9" />
        <Stick a={[wp[0] - r * 0.6, r * 1.6, wp[2] + 0.1]} b={[wp[0] - r * 0.98, r * 1.76, wp[2] + 0.1]} r={0.04} c="#221c22" />
      </>
    );
    cam = <Cam target={[0.2, 1.22 + shake, 0]} d={zd(lerp(11.8, 10.6, ease(p)))} />;
    overlay = <Cap eyebrow="3:00 AM AGAIN" text="he’s on slide three" from={50} />;
  } else if (id === "street") {
    const x = lerp(-1.0, 0.5, p);
    const g = ease(seg(lf, 38, 46)) - ease(seg(lf, 62, 70)); // she glances back; he freezes
    const hopA = Math.abs(Math.sin(f * 0.36)) * (1 - g);
    const wp: V3 = [x - 0.62 - 0.22 * g, 0, 0.3];
    content = (
      <>
        <Street />
        <Woman pos={[x, 0, 0.18]} rotY={Math.PI / 2} pose={{ walk: f * 0.36, headTurn: -1.3 * g, headTilt: 0.1 * g }} />
        <Worry pos={wp} r={0.17} f={f} rotY={lerp(1.0, 0.2, g)} look={g > 0.5 ? [-0.5, 0.8] : [0.5, 0.6]} hop={hopA * 0.13} squash={hopA * 0.12 - 0.04 - g * 0.16} mood="neutral" talk={g * 0.25} seed={1} />
        <Rim pos={wp} r={0.17} />
      </>
    );
    cam = <Cam target={[x * 0.55 - 0.15, 1.0, 0]} d={zd(lerp(9.6, 8.6, ease(p)))} el={0.17} />;
    overlay = <Cap eyebrow="EARLIER · 8:15 AM" text="he’s followed her all day" />;
  } else if (id === "office") {
    const saidAt = line(0) + 20;
    const inK = seg(lf, 4, saidAt - 2);
    const wp: V3 = [lerp(1.3, 0.68, easeOut(inK)), 0.77 + Math.abs(Math.sin(inK * Math.PI * 2)) * 0.2 * (1 - inK), 0.0];
    const stop = ease(seg(lf, saidAt + 2, saidAt + 12)), slump = ease(seg(lf, saidAt + 26, saidAt + 44));
    const ty = (ph: number) => -1.2 + Math.sin(f * 0.9 + ph) * 0.07 * (1 - stop) + 0.15 * stop;
    lights = <Lights kind="afternoon" />;
    content = (
      <>
        <Office />
        <Woman pos={[-0.62, 0.47, -0.2]} rotY={Math.PI / 2} pose={{ sit: true, armL: [ty(0), 0.05], armR: [ty(1.6), 0.05], headTurn: -0.6 * stop * (1 - slump * 0.6), headTilt: 0.1 + 0.3 * slump }} />
        <Worry pos={wp} r={0.2} f={f} rotY={-0.75} look={[-0.6, 0.1]} mood="smug" talk={talk(lf >= saidAt && lf < lineEnd(0) + 4)} squash={inK < 1 ? Math.abs(Math.sin(inK * Math.PI * 2)) * 0.1 : 0} seed={1} />
        <Rim pos={wp} r={0.2} />
      </>
    );
    cam = <Cam target={[0.05, 1.18, -0.1]} d={zd(lerp(9.2, 7.9, ease(p)))} />;
    overlay = (
      <>
        <Cap eyebrow="2:40 PM · AT WORK" />
        <Bubble text="they hated that email." from={saidAt} x={690} y={850} tail="right" />
      </>
    );
  } else if (id === "dinner") {
    const landAt = 16, saidAt = line(0) + 22;
    const fall = Math.pow(seg(lf, 6, landAt), 2);
    const land = Math.max(0, 1 - Math.abs(lf - landAt - 2) / 5);
    const wp: V3 = [0, lerp(2.7, 0.765, fall), -0.06];
    const froze = ease(seg(lf, landAt, landAt + 8)), lower = ease(seg(lf, landAt + 12, landAt + 30));
    lights = <Lights kind="dinner" />;
    content = (
      <>
        <Cafe f={f} rattle={Math.max(0, 1 - Math.abs(lf - landAt - 6) / 12)} />
        <Woman pos={[-0.82, 0.46, 0]} rotY={Math.PI / 2} pose={{ sit: true, smile: froze < 0.5, armR: [-1.45 + Math.sin(f * 0.4) * 0.3 * (1 - froze) + lower * 0.5, 0.2], armL: [-1.0, 0.1], headTurn: -0.55 * ease(seg(lf, landAt + 2, landAt + 12)), headTilt: 0.2 * lower }} />
        <Woman pos={[0.82, 0.46, 0]} rotY={-Math.PI / 2} pose={{ sit: true, smile: true, armL: [-1.0, 0.1], armR: [-1.15 + Math.sin(f * 0.15) * 0.1, 0.1], headTilt: Math.sin(f * 0.2) * 0.05 }} jumper="#b9623f" skin="#e2b48f" hair="#7a4a2a" trousers="#4a3a36" bun={false} />
        <Worry pos={wp} r={0.25} f={f} rotY={-0.55} look={[-0.7, 0.2]} mood="smug" talk={talk(lf >= saidAt && lf < lineEnd(0) + 4)} squash={-land * 0.3} seed={1} />
        <Rim pos={wp} r={0.25} />
      </>
    );
    cam = <Cam target={[0, 1.18, 0]} d={zd(lerp(9.3, 8.2, ease(p)))} />;
    overlay = (
      <>
        <Cap eyebrow="7:30 PM · AT DINNER" />
        <Bubble text="you’re talking too much." from={saidAt} x={560} y={770} tail="left" />
      </>
    );
  } else if (id === "phone") {
    const peek = easeOut(seg(lf, 8, 28));
    const react = lf >= line(1) + 20;
    const wp: V3 = [0, lerp(-1.9, 0.1, peek) + (react ? 0.06 : 0), -0.5];
    lights = <Lights kind="night" />;
    content = (
      <>
        <Worry pos={wp} r={0.5} f={f} rotY={0} look={[0, -0.85]} mood={react ? "shock" : "neutral"} seed={0} />
        <Rim pos={[wp[0], wp[1], wp[2] - 0.2]} r={0.5} />
      </>
    );
    cam = <Cam target={[0, 0, 0]} d={zd(6)} yaw={0} el={0} />;
    overlay = <Phone lf={lf} replyAt={line(1)} />;
  } else if (id === "none") {
    const m = ease(seg(lf, 4, 62));
    const cross: [number, number, number] = [easeOut(seg(lf, 8, 16)), easeOut(seg(lf, 19, 27)), easeOut(seg(lf, 30, 38))];
    const k = ease(seg(lf, 10, 52));
    const r = lerp(0.58, 0.13, k), wp: V3 = [1.12, 0, 0.5];
    lights = (
      <>
        <Lights kind="night" k={1 - m} />
        <Lights kind="dawn" k={m} />
      </>
    );
    content = (
      <>
        <Bedroom slide={{ kind: "list", cross }} fonts={fonts} dawn={m} f={f} chartX={0.1} pillowUp={1} />
        <Woman pos={[-0.8, 0.47, -0.52]} rotY={0.3} pose={{ sit: true, phone: lf < 50, armL: [-1.25 + 0.35 * seg(lf, 50, 62), -0.3], armR: [-1.25 + 0.35 * seg(lf, 50, 62), -0.3], headTurn: 0.45 * seg(lf, 34, 48), smile: lf > 40 }} />
        <Worry pos={wp} r={r} f={f} rotY={-0.45} look={[-0.6, 0.5]} mood={k < 0.92 ? "shock" : "sad"} squash={Math.sin(k * Math.PI) * -0.2 + Math.sin(lf * 1.3) * 0.04 * Math.sin(k * Math.PI)} />
        <Rim pos={wp} r={r} />
        {/* little puffs as he deflates */}
        {Array.from({ length: 8 }).map((_, i) => {
          const t = seg(lf, 12 + i * 4.5, 36 + i * 4.5);
          if (t <= 0 || t >= 1) return null;
          const a = i * 2.4;
          return <Ball key={i} pos={[wp[0] + Math.cos(a) * (0.25 + t * 0.35), 0.5 + t * 0.9 + (i % 3) * 0.1, wp[2] + Math.sin(a) * 0.25]} r={0.07 * (1 - t) + 0.02} c="#b9a6e8" shadow={false} />;
        })}
      </>
    );
    cam = <Cam target={[0.2, 1.2, 0]} d={zd(lerp(11.2, 10.0, ease(p)))} />;
    overlay = <Cap eyebrow="6:41 AM" text="none of it was happening" from={10} />;
  } else {
    // pocket + ask: sunrise street. He hops after her, jumps into her pocket, and stays there.
    const ask = id === "ask";
    const stopAt = 52, jumpAt = 58, inAt = 71;
    const x = ask ? 0.1 : lerp(-0.95, 0.1, easeOut(seg(lf, 0, stopAt)));
    const walking = !ask && lf < stopAt;
    const inPocket = ask || lf >= inAt;
    const jk = seg(lf, jumpAt, inAt);
    const hopA = Math.abs(Math.sin(f * 0.38));
    const free: V3 = lf < jumpAt ? [x - 0.5, 0, 0.45] : [lerp(x - 0.5, x + 0.05, jk), lerp(0, 0.55, jk) + Math.sin(jk * Math.PI) * 0.45, 0.45];
    const turn = ask ? ease(seg(lf, 0, 18)) : 0;
    const look = inPocket ? (ask ? 1 : ease(seg(lf, inAt, inAt + 10))) : ease(seg(lf, jumpAt - 6, jumpAt)) * 0.6;
    const pk = <Worry pos={[0, -0.05, 0.05]} r={0.125} f={f} legs={false} mood="happy" wave={1} look={ask ? [0, 0.1] : [0.2, 0.5]} seed={2} />;
    lights = <Lights kind="dawn" />;
    content = (
      <>
        <Street />
        <Woman pos={[x, 0, 0.18]} rotY={Math.PI / 2 - turn * 0.75} pose={{ walk: walking ? f * 0.36 : undefined, smile: true, pocket: inPocket ? pk : undefined, headTurn: -0.5 * look, headTilt: 0.14 * look, armR: inPocket ? [0.25 + Math.sin(f * 0.5) * 0.08 * (ask ? 0 : 1), 0.55] : undefined }} />
        {!inPocket && <Worry pos={free} r={0.125} f={f} rotY={1.0} look={[0.5, 0.7]} hop={lf < jumpAt ? hopA * 0.1 : 0} squash={lf < jumpAt ? hopA * 0.12 - 0.04 : 0.12} mood="happy" seed={2} />}
        {!inPocket && <Rim pos={free} r={0.125} />}
      </>
    );
    if (!ask) {
      cam = <Cam target={[x * 0.7, 1.0, 0.1]} d={zd(lerp(9.0, 7.0, ease(p)))} el={0.16} />;
      overlay = <Cap eyebrow="8:15 AM" text="he still tags along" />;
    } else {
      cam = <Cam target={[0.1, lerp(0.8, 0.76, ease(p)), 0.3]} d={zd(lerp(7.0, 4.5, easeOut(seg(lf, 0, 40))))} yaw={lerp(0.26, 0.12, ease(p))} el={0.12} />;
      overlay = (
        <div style={{ position: "absolute", top: 1222, left: 40, right: 40, textAlign: "center", ...serif, fontSize: 90, lineHeight: 1.02 }}>
          <SoftBlurIn text="What’s on your worry’s" from={5} /><br />
          <span style={{ fontStyle: "italic", color: GOLD }}><SoftBlurIn text="slide one?" from={18} /></span>
        </div>
      );
    }
  }

  const blur = Math.max(zin, zout) * 18;
  return (
    <AbsoluteFill style={{ background: BG[id] }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={Math.floor(f / 2)} />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.88  0 0 0 0.16 0" />
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
        <ThreeCanvas width={width} height={height} shadows camera={{ fov: 26, near: 0.1, far: 80 }}>
          {cam}
          {lights}
          {content}
        </ThreeCanvas>
      </AbsoluteFill>
      {id !== "hook" && id !== "phone" && id !== "ask" && <AbsoluteFill style={{ background: "linear-gradient(rgba(12,9,7,.9) 0%, rgba(12,9,7,.7) 20%, rgba(12,9,7,0) 34%)" }} />}
      {id === "ask" && <AbsoluteFill style={{ background: "linear-gradient(rgba(12,9,7,0) 52%, rgba(12,9,7,.8) 68%, rgba(12,9,7,.94) 100%)" }} />}
      <AbsoluteFill style={{ filter: "url(#grain)", mixBlendMode: "soft-light", opacity: 0.9 }} />
      <AbsoluteFill style={{ opacity: 1 - zin }}>{fonts && overlay}</AbsoluteFill>
    </AbsoluteFill>
  );
};
