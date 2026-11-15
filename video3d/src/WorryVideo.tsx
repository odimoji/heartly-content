// "Her worry gave a presentation at 3am": 3D story video (Remotion + three.js).
// Scene lengths come from src/timing.json, written by vo.py from the narration.
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "three";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import timing from "./timing.json";
import { useFontsReady } from "./fonts";
import { SoftBlurIn } from "./remocn/soft-blur-in";
import { ease, easeOut, lerp, Look, LOOK, Outlines, seg, Stick, V3 } from "./three/parts";
import { Bedroom, Cafe, Office, Slide, Street } from "./three/sets";
import { Woman } from "./three/Woman";
import { Mood, Worry } from "./three/Worry";

const FPS = 30;
type Scene = (typeof timing.scenes)[number];

const Cam: React.FC<{ target: V3; d: number; yaw?: number; el?: number; fov?: number }> = ({ target, d, yaw = 0.26, el = 0.19, fov = 26 }) => {
  const cam = useThree((s) => s.camera) as PerspectiveCamera;
  cam.position.set(target[0] + d * Math.sin(yaw) * Math.cos(el), target[1] + d * Math.sin(el), target[2] + d * Math.cos(yaw) * Math.cos(el));
  cam.fov = fov;
  cam.lookAt(target[0], target[1], target[2]);
  cam.updateProjectionMatrix();
  return null;
};

const Lights: React.FC<{ kind: "day" | "night" | "dawn" | "cafe" }> = ({ kind }) => {
  const key = (pos: V3, color: string, intensity: number) => (
    <directionalLight position={pos} color={color} intensity={intensity} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0005} shadow-normalBias={0.02}>
      <orthographicCamera attach="shadow-camera" args={[-3.2, 3.2, 3.2, -3.2, 0.5, 24]} />
    </directionalLight>
  );
  if (kind === "night")
    return (
      <>
        <hemisphereLight args={["#6f7bd6", "#231d3a", 0.75]} />
        {key([2.5, 5, 5], "#aebcff", 0.9)}
        <pointLight position={[1.05, 1.5, -0.45]} color="#ffb86e" intensity={7} distance={5} decay={1.6} />
        <pointLight position={[0.4, 1.4, 1.6]} color="#ffd9b0" intensity={2.2} distance={6} decay={1.6} />
      </>
    );
  if (kind === "dawn")
    return (
      <>
        <hemisphereLight args={["#ffd9bd", "#5b4a6a", 1.0]} />
        {key([3, 5, 5], "#ffcfa6", 1.9)}
        <pointLight position={[-0.8, 1.7, -0.5]} color="#ffc095" intensity={4} distance={5} decay={1.6} />
      </>
    );
  if (kind === "cafe")
    return (
      <>
        <hemisphereLight args={["#fff1dc", "#b58f6a", 1.0]} />
        {key([3, 6, 4.5], "#fff0db", 2.0)}
        <pointLight position={[0, 1.75, 0.1]} color="#ffc27a" intensity={3} distance={4} decay={1.6} />
      </>
    );
  return (
    <>
      <hemisphereLight args={["#fff6e6", "#cfa77f", 1.05]} />
      {key([3.2, 6, 4.5], "#fff1dc", 2.3)}
    </>
  );
};

const BG: Record<string, string> = {
  hook: "linear-gradient(#16142e 0%, #262049 55%, #3a2f5e 100%)",
  huge: "linear-gradient(#16142e 0%, #262049 55%, #3a2f5e 100%)",
  phone: "radial-gradient(circle at 50% 45%, #2e2752 0%, #16142e 75%)",
  none: "linear-gradient(#3d3566 0%, #a8799a 55%, #f3b996 100%)",
  street: "linear-gradient(#bfe4f2 0%, #e6eedd 55%, #f6e3c5 100%)",
  pocket: "linear-gradient(#bfe4f2 0%, #e6eedd 55%, #f6e3c5 100%)",
  ask: "linear-gradient(#bfe4f2 0%, #e6eedd 55%, #f6e3c5 100%)",
  office: "linear-gradient(#f6ecdc 0%, #efdcc2 100%)",
  brunch: "linear-gradient(#f1e4cc 0%, #e2c9a2 100%)",
};

// ---------- DOM overlays ----------
const Card: React.FC<{ text: string; from?: number; y?: number; size?: number; rot?: number }> = ({ text, from = 3, y = 1335, size = 66, rot = -1.4 }) => {
  const f = useCurrentFrame();
  const k = spring({ frame: f - from, fps: FPS, config: { damping: 14, stiffness: 160 } });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `rotate(${rot}deg) scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 1.5), background: "#fffaf0", borderRadius: 22, padding: "14px 40px 20px", boxShadow: "0 10px 30px rgba(20,16,13,.28)", fontFamily: "Caveat", fontWeight: 700, fontSize: size, color: "#2a2420", whiteSpace: "nowrap" }}>
        <SoftBlurIn text={text} from={from + 2} />
      </div>
    </div>
  );
};

const Bubble: React.FC<{ text: string; from: number; x: number; y: number; tail?: "left" | "right" }> = ({ text, from, x, y, tail = "right" }) => {
  const f = useCurrentFrame();
  const k = spring({ frame: f - from, fps: FPS, config: { damping: 11, stiffness: 190 } });
  if (f < from) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${k})`, transformOrigin: tail === "right" ? "75% 100%" : "25% 100%" }}>
      <div style={{ background: "#ffffff", borderRadius: 34, padding: "16px 34px 20px", fontFamily: "Caveat", fontWeight: 700, fontSize: 58, color: "#2a2420", whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(20,16,13,.25)" }}>{text}</div>
      <div style={{ position: "absolute", bottom: -22, [tail === "right" ? "right" : "left"]: 70, width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderTop: "26px solid #ffffff" }} />
    </div>
  );
};

const Phone: React.FC<{ lf: number; replyAt: number }> = ({ lf, replyAt }) => {
  const k = spring({ frame: lf, fps: FPS, config: { damping: 16, stiffness: 120 } });
  const entry = "slide one: i’m getting fired. slide two: that mole. slide three: everyone’s annoyed with me.";
  const n = Math.floor(seg(lf, 8, replyAt - 12) * entry.length);
  const rk = spring({ frame: lf - replyAt, fps: FPS, config: { damping: 15, stiffness: 140 } });
  return (
    <div style={{ position: "absolute", left: 210, top: 440 + (1 - k) * 160, width: 660, height: 880, borderRadius: 64, background: "#17120e", border: "7px solid #f1e6d6", boxShadow: "0 30px 80px rgba(0,0,0,.55)", padding: "44px 46px", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center", fontFamily: "Caveat", fontWeight: 700, fontSize: 54, color: "#f1e6d6" }}>heartly</div>
      <div style={{ marginTop: 34, fontFamily: "Inter", fontWeight: 600, fontSize: 26, color: "#9c8e80" }}>you</div>
      <div style={{ marginTop: 12, fontFamily: "Inter", fontWeight: 500, fontSize: 39, lineHeight: 1.38, color: "#f1e6d6", minHeight: 280 }}>
        {entry.slice(0, n)}
        {lf < replyAt && Math.floor(lf / 8) % 2 === 0 ? "|" : ""}
      </div>
      {lf >= replyAt && (
        <div style={{ marginTop: 26, transform: `translateY(${(1 - rk) * 30}px)`, opacity: rk, background: "#2a211b", borderRadius: 30, padding: "24px 30px 30px" }}>
          <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 26, color: "#d9643a" }}>heartly</div>
          <div style={{ marginTop: 10, fontFamily: "Inter", fontWeight: 500, fontSize: 41, lineHeight: 1.34, color: "#f6b48f" }}>
            <SoftBlurIn text="which of these is" from={replyAt + 3} /><br />
            <SoftBlurIn text="happening right now?" from={replyAt + 12} />
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- the video ----------
export const WorryVideo: React.FC<{ look?: Look }> = ({ look = "clay" }) => {
  LOOK.current = look;
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const fonts = useFontsReady();
  const sc: Scene = timing.scenes.find((s) => f >= s.start && f < s.start + s.dur) ?? timing.scenes[timing.scenes.length - 1];
  const lf = f - sc.start, t = lf / FPS, p = lf / sc.dur;
  const line = (j: number) => Math.round(sc.lines[j].A[0] * FPS); // frame a narration line starts
  const lineEnd = (j: number) => Math.round((sc.lines[j].A[0] + sc.lines[j].A[1]) * FPS);
  const speaking = sc.lines.some((_, j) => lf >= line(j) && lf <= lineEnd(j));
  const talk = (on: boolean) => (on ? Math.abs(Math.sin(f * 0.95)) : 0);
  const id = sc.id;

  let content: React.ReactNode = null, cam: React.ReactNode = null, lights: "day" | "night" | "dawn" | "cafe" = "day", overlay: React.ReactNode = null;

  if (id === "hook" || id === "huge") {
    const big = id === "huge";
    const r = big ? 0.56 : 0.42, wx = big ? 1.12 : 1.0, wz = big ? 0.5 : 0.22, cx = big ? 0.1 : 0.32;
    const slide: Slide = big ? { kind: "three" } : lf < line(1) - 4 ? { kind: "cover" } : { kind: "one" };
    const tap = Math.max(0, Math.sin(f * 0.5)) * 0.05;
    const hop = !big && lf >= line(1) - 4 && lf < line(1) + 6 ? Math.sin(seg(lf, line(1) - 4, line(1) + 6) * Math.PI) * 0.16 : 0;
    lights = "night";
    content = (
      <>
        <Bedroom slide={slide} fonts={fonts} f={f} chartX={cx} />
        {big ? (
          <Woman pos={[-0.8, 0.47, -0.52]} rotY={0.3} pose={{ sit: true, armL: [-1.0, -0.25], armR: [-1.0, -0.25], headTurn: 0.35, headTilt: 0.12 }} />
        ) : (
          <Woman pos={[-0.8, 0.6, 0.7]} rotX={-Math.PI / 2} pose={{ armL: [-0.5, 0.25], armR: [-0.5, 0.25], headTurn: 0.5 }} />
        )}
        <Worry pos={[wx, 0, wz]} r={r} f={f} rotY={-0.45} look={[-0.75, 0.25]} mood="smug" talk={talk(speaking)} hop={hop} squash={hop > 0 ? 0.08 : 0} />
        <Stick a={[wx - r * 0.95, r * 1.75, wz + 0.1]} b={[cx + 0.22, 1.2 + tap, -0.42]} r={0.012} c="#f3ead9" />
        <Stick a={[wx - r * 0.6, r * 1.6, wz + 0.1]} b={[wx - r * 0.98, r * 1.76, wz + 0.1]} r={0.03 * (r / 0.42)} c="#221c22" />
      </>
    );
    if (big) {
      cam = <Cam target={[0.2, 1.05, 0]} d={lerp(11.8, 10.8, ease(p))} />;
      overlay = <Card text="3am. slide three." />;
    } else {
      const k = ease(seg(lf, line(1) + 34, sc.dur));
      cam = <Cam target={[lerp(0.66, 0.1, k), lerp(1.08, 1.05, k), lerp(-0.1, 0, k)]} d={lerp(7.6, 12.2, k) - seg(lf, 0, line(1)) * 0.3} yaw={lerp(0.2, 0.26, k)} />;
      overlay = (
        <>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 560, background: "linear-gradient(rgba(18,16,40,.92) 0%, rgba(18,16,40,.75) 60%, rgba(18,16,40,0) 100%)" }} />
        <div style={{ position: "absolute", top: 236, left: 0, right: 0, textAlign: "center", fontFamily: "Caveat", fontWeight: 700, fontSize: 96, lineHeight: 1.02, color: "#fff3dc", textShadow: "0 4px 18px rgba(0,0,0,.5)" }}>
          her worry gave<br />a presentation <span style={{ color: "#ff9a6a", display: "inline-block", marginLeft: 14, transform: `scale(${1 + 0.2 * Math.max(0, 1 - lf / 10)})` }}>at 3am.</span>
        </div>
        </>
      );
    }
  } else if (id === "street" || id === "pocket" || id === "ask") {
    const pocket = id !== "street";
    const x = id === "street" ? lerp(-0.95, 0.45, p) : id === "pocket" ? lerp(-0.9, 0.15, easeOut(p)) : 0.15;
    const walking = id === "street" || (id === "pocket" && p < 0.86);
    const turn = id === "ask" ? ease(seg(lf, 0, 18)) : 0;
    const pk = <Worry pos={[0, -0.05, 0.05]} r={0.125} f={f} legs={false} mood="happy" wave={1} look={id === "ask" ? [0, 0.1] : [0.2, 0.5]} seed={2} />;
    content = (
      <>
        <Street />
        <Woman pos={[x, 0, 0.18]} rotY={Math.PI / 2 - turn * 0.75} pose={{ walk: walking ? f * 0.36 : undefined, smile: pocket, pocket: pocket ? pk : undefined, headTurn: pocket ? -0.45 * (id === "ask" ? 1 : seg(lf, 20, 40)) : 0, headTilt: pocket ? 0.12 : 0, armR: pocket ? [0.25, 0.55] : undefined }} />
        {!pocket && <Worry pos={[x - 0.62, 0, 0.3]} r={0.17} f={f} rotY={1.0} look={[0.5, 0.6]} hop={Math.abs(Math.sin(f * 0.36)) * 0.13} squash={Math.abs(Math.sin(f * 0.36)) * 0.12 - 0.04} mood="neutral" seed={1} />}
      </>
    );
    if (id === "street") { cam = <Cam target={[x * 0.55 - 0.15, 0.78, 0]} d={9.4} el={0.17} />; overlay = <Card text="he’s followed her all day" />; }
    else if (id === "pocket") { cam = <Cam target={[x * 0.7, 0.8, 0.1]} d={lerp(8.8, 7.2, ease(p))} el={0.16} />; overlay = <Card text="he still tags along" />; }
    else {
      cam = <Cam target={[0.12, lerp(0.8, 0.9, ease(p)), 0.3]} d={lerp(7.2, 4.5, easeOut(seg(lf, 0, 40)))} yaw={lerp(0.26, 0.12, ease(p))} el={0.12} />;
      const ak = spring({ frame: lf - 2, fps: FPS, config: { damping: 14, stiffness: 150 } });
      overlay = (
        <div style={{ position: "absolute", top: 1150, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div style={{ transform: `rotate(-1.2deg) scale(${0.6 + 0.4 * ak})`, opacity: Math.min(1, ak * 1.5), background: "#fffaf0", borderRadius: 28, padding: "16px 48px 26px", boxShadow: "0 12px 34px rgba(20,16,13,.3)", textAlign: "center", fontFamily: "Caveat", fontWeight: 700, fontSize: 86, lineHeight: 1.05, color: "#2a2420" }}>
            <SoftBlurIn text="what’s on your worry’s" from={5} /><br />
            <span style={{ color: "#d9643a" }}><SoftBlurIn text="slide one?" from={18} /></span>
          </div>
        </div>
      );
    }
  } else if (id === "office") {
    const said = lf >= line(0) + 20;
    content = (
      <>
        <Office />
        <Woman pos={[-0.62, 0.47, -0.2]} rotY={Math.PI / 2} pose={{ sit: true, armL: [-1.2 + Math.sin(f * 0.9) * 0.07, 0.05], armR: [-1.2 + Math.cos(f * 0.8) * 0.07, 0.05], headTurn: -0.55 * ease(seg(lf, line(0) + 24, line(0) + 36)), headTilt: 0.1 }} />
        <Worry pos={[0.68, 0.77, 0.0]} r={0.2} f={f} rotY={-0.75} look={[-0.6, 0.1]} mood="smug" talk={talk(said && lf < lineEnd(0) + 4)} hop={said ? Math.max(0, Math.sin(seg(lf, line(0) + 20, line(0) + 30) * Math.PI)) * 0.08 : 0} seed={1} />
      </>
    );
    cam = <Cam target={[0.05, 0.98, -0.1]} d={lerp(9.0, 8.2, ease(p))} />;
    overlay = (
      <>
        <Card text="at work" />
        <Bubble text="they hated that email." from={line(0) + 20} x={690} y={770} tail="right" />
      </>
    );
  } else if (id === "brunch") {
    const said = lf >= line(0) + 22;
    const chat = said ? 0 : 1;
    lights = "cafe";
    content = (
      <>
        <Cafe f={f} />
        <Woman pos={[-0.82, 0.46, 0]} rotY={Math.PI / 2} pose={{ sit: true, smile: !said, armR: [-1.35 + Math.sin(f * 0.35) * 0.3 * chat + (1 - chat) * 0.9, 0.2], armL: [-1.0, 0.1], headTurn: -0.5 * ease(seg(lf, line(0) + 26, line(0) + 38)) }} />
        <Woman pos={[0.82, 0.46, 0]} rotY={-Math.PI / 2} pose={{ sit: true, smile: true, armL: [-1.0, 0.1], armR: [-1.0, 0.1], headTilt: Math.sin(f * 0.2) * 0.05 }} jumper="#e58fa0" skin="#e2b48f" hair="#7a4a2a" trousers="#6b5a7a" bun={false} />
        <Worry pos={[0, 0.765, -0.06]} r={0.25} f={f} rotY={-0.55} look={[-0.7, 0.2]} mood="smug" talk={talk(said && lf < lineEnd(0) + 4)} seed={1} />
      </>
    );
    cam = <Cam target={[0, 0.98, 0]} d={lerp(9.2, 8.5, ease(p))} />;
    overlay = (
      <>
        <Card text="at brunch" />
        <Bubble text="you’re talking too much." from={line(0) + 22} x={560} y={690} tail="left" />
      </>
    );
  } else if (id === "phone") {
    lights = "night";
    const peek = easeOut(seg(lf, 6, 26));
    const react = lf >= line(1) + 20;
    content = <Worry pos={[0, lerp(-1.9, 0.1, peek) + (react ? 0.06 : 0), -0.5]} r={0.5} f={f} rotY={0} look={[0, -0.85]} mood={react ? "shock" : "neutral"} seed={0} />;
    cam = <Cam target={[0, 0, 0]} d={6} yaw={0} el={0} />;
    overlay = <Phone lf={lf} replyAt={line(1)} />;
  } else if (id === "none") {
    lights = "dawn";
    const cross: [number, number, number] = [easeOut(seg(lf, 6, 14)), easeOut(seg(lf, 16, 24)), easeOut(seg(lf, 26, 34))];
    const k = ease(seg(lf, 8, 44));
    const r = lerp(0.56, 0.13, k);
    content = (
      <>
        <Bedroom slide={{ kind: "list", cross }} fonts={fonts} dawn={1} f={f} chartX={0.1} />
        <Woman pos={[-0.8, 0.47, -0.52]} rotY={0.3} pose={{ sit: true, phone: true, armL: [-1.25, -0.3], armR: [-1.25, -0.3], headTurn: 0.4 * seg(lf, 30, 44), smile: lf > 36 }} />
        <Worry pos={[1.12, 0, 0.5]} r={r} f={f} rotY={-0.45} look={[-0.6, 0.5]} mood={k < 0.9 ? "shock" : "sad"} squash={Math.sin(k * Math.PI) * -0.18} />
      </>
    );
    cam = <Cam target={[0.2, 1.0, 0]} d={lerp(10.8, 10.2, ease(p))} />;
    overlay = <Card text="none of it was happening" />;
  }

  const dip = Math.max(0, 1 - Math.min(lf, sc.dur - lf) / 3) * (f < 3 ? 0 : 1);
  return (
    <AbsoluteFill style={{ background: BG[id] }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="riso" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.3 0.55 0.15 0 0  0.3 0.55 0.15 0 0  0.3 0.55 0.15 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0.13 0.24 0.38 0.85 0.95 0.97" />
            <feFuncG type="discrete" tableValues="0.12 0.20 0.30 0.39 0.69 0.93" />
            <feFuncB type="discrete" tableValues="0.20 0.36 0.52 0.23 0.53 0.86" />
          </feComponentTransfer>
        </filter>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(f / 3)} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0.5 0" />
        </filter>
      </svg>
      <AbsoluteFill style={look === "riso" || look === "combo" ? { filter: "url(#riso)" } : undefined}>
      <ThreeCanvas width={width} height={height} shadows camera={{ fov: 26, near: 0.1, far: 80 }}>
        {cam}
        <Lights kind={lights} />
        {look === "ink" && <Outlines />}
        {content}
        {id !== "phone" && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.31, 0]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <shadowMaterial opacity={0.22} />
          </mesh>
        )}
      </ThreeCanvas>
      </AbsoluteFill>
      {(look === "riso" || look === "combo") && <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(38,35,58,.55) 1.4px, transparent 1.9px)", backgroundSize: "9px 9px", mixBlendMode: "multiply", opacity: 0.55 }} />}
      {look !== "clay" && <AbsoluteFill style={{ filter: "url(#grain)", mixBlendMode: "multiply", opacity: 0.55 }} />}
      <AbsoluteFill>{fonts && overlay}</AbsoluteFill>
      <AbsoluteFill style={{ background: "#14100d", opacity: dip * 0.85 }} />
    </AbsoluteFill>
  );
};
