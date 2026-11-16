// "The 31st draft is worse than the first": 3D story video (Remotion + three.js), "night to dawn" look. No creature in this one.
// 1:40 AM: his notes app holds 31 unsent texts to her, each one "the final version". He reads three aloud, each worse.
// Turn: he writes the real one in Heartly, addressed to nobody. Dawn: asleep at last, phone face-down.
// Scene lengths, line windows and cues come from src/timing/drafts.json, written by vo.py from scripts/drafts.json.
import timing from "./timing/drafts.json";
import { CREAM, Cam, Eyebrow, GOLD, glow, Lights, PhoneUI, serif, sp, Stage, useScene } from "./kit";
import { SoftBlurIn } from "./remocn/soft-blur-in";
import { clamp01, ease, easeOut, lerp, seg, V3 } from "./three/parts";
import { AtHand, BedNight, Body, DraftsRoom, Him, HIM_X, MAT, NS_PHONE, Phone, Slip } from "./three/sets_drafts";
import { Pose } from "./three/Woman";

const NIGHT = glow("rgba(196,100,60,.24)"), DAWN = glow("rgba(240,150,100,.42)", 50);
const BG: Record<string, string> = { hook: NIGHT, read: NIGHT, phone: glow("rgba(217,100,58,.26)", 52), rest: DAWN };

const pop = (t: number, at: number, w = 3) => Math.max(0, 1 - Math.abs(t - at) / w);
const mix3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const mix2 = (a: [number, number], b: [number, number], k: number): [number, number] => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

// ---------- camera as data, so bubbles can be pinned to his head ----------
type CamP = { target: V3; d: number; yaw: number; el: number };
const FOCAL = 960 / Math.tan((13 * Math.PI) / 180);
const project = (c: CamP, p: V3): [number, number] => {
  const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw), ce = Math.cos(c.el), se = Math.sin(c.el);
  const v: V3 = [p[0] - c.target[0] - c.d * sy * ce, p[1] - c.target[1] - c.d * se, p[2] - c.target[2] - c.d * cy * ce];
  const fw: V3 = [-sy * ce, -se, -cy * ce], rt: V3 = [cy, 0, -sy];
  const up: V3 = [rt[1] * fw[2] - rt[2] * fw[1], rt[2] * fw[0] - rt[0] * fw[2], rt[0] * fw[1] - rt[1] * fw[0]];
  const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const z = dot(v, fw);
  return [540 + (dot(v, rt) / z) * FOCAL, 960 - (dot(v, up) / z) * FOCAL];
};
// a point h above his hips, along his spine
const along = (b: Body, h: number): V3 => {
  const l = b.lean ?? 0, r = b.rotY ?? 0, z = h * Math.sin(l);
  return [b.hip[0] + z * Math.sin(r), b.hip[1] + h * Math.cos(l), b.hip[2] + z * Math.cos(r)];
};

// ---------- DOM pieces (lf: frames since the scene started) ----------
// the message he is writing to her: types, hesitates, deletes. The send button never gets pressed.
const TYPED = "hey, i just wanted to";
const ComposeBar: React.FC<{ lf: number; y: number }> = ({ lf, y }) => {
  const n = lf < 37 ? 4 + Math.floor(seg(lf, 1, 30) * (TYPED.length - 4)) : Math.round((1 - seg(lf, 40, 53)) * TYPED.length);
  const caret = lf >= 30 && lf < 40 ? Math.floor(lf / 5) % 2 === 0 : true;
  const out = 1 - seg(lf, 58, 64);
  if (out <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 180, top: y, width: 664, height: 96, boxSizing: "border-box", opacity: out, display: "flex", alignItems: "center", background: "#17120e", border: "3px solid rgba(233,220,198,.9)", borderRadius: 999, padding: "0 14px 0 36px", boxShadow: "0 10px 30px rgba(0,0,0,.55), 0 0 60px rgba(217,100,58,.2)" }}>
      <div style={{ flex: 1, fontFamily: "Inter", fontWeight: 500, fontSize: 40, color: "#efe4d2", whiteSpace: "pre" }}>
        {TYPED.slice(0, n)}
        <span style={{ color: GOLD, opacity: caret ? 1 : 0 }}>|</span>
      </div>
      <div style={{ position: "relative", width: 64, height: 64, borderRadius: "50%", background: GOLD, opacity: n > 0 ? 1 : 0.35 }}>
        <div style={{ position: "absolute", left: 29, top: 20, width: 6, height: 28, borderRadius: 3, background: "#17120e" }} />
        <div style={{ position: "absolute", left: 21, top: 17, width: 16, height: 16, borderLeft: "6px solid #17120e", borderTop: "6px solid #17120e", borderRadius: 3, transform: "rotate(45deg)" }} />
      </div>
    </div>
  );
};

// his notes app, in the same dark style as the Heartly phone: 31 notes, every one of them the final version
const NOTES = ["final", "final v2", "FINAL final", "ok this one", "draft 31 (send this)"];
const NotesCard: React.FC<{ lf: number; from: number }> = ({ lf, from }) => {
  if (lf < from) return null;
  const k = sp(lf - from, 16, 120);
  const last = sp(lf - from - 30, 12, 160);
  return (
    <div style={{ position: "absolute", left: 200, top: 506 + (1 - k) * 170, opacity: clamp01(k * 1.4), width: 640, borderRadius: 56, background: "#17120e", border: "6px solid #e9dcc6", boxShadow: "0 30px 90px rgba(0,0,0,.6), 0 0 120px rgba(217,100,58,.2)", padding: "26px 34px 20px", boxSizing: "border-box", overflow: "hidden" }}>
      <div style={{ padding: "0 8px", fontFamily: "Inter", fontWeight: 600, fontSize: 40, color: CREAM }}>notes · 31</div>
      <div style={{ marginTop: 18, height: 2, background: "rgba(233,220,198,.16)" }} />
      {NOTES.map((t, i) => {
        const rk = sp(lf - from - 5 - i * 4, 15, 150), hot = i === NOTES.length - 1 ? last : 0;
        return (
          <div key={t} style={{ height: 76, display: "flex", alignItems: "center", gap: 20, padding: "0 8px", borderRadius: 20, opacity: rk, transform: `translateY(${(1 - rk) * 18}px)`, borderBottom: i < NOTES.length - 1 ? "2px solid rgba(233,220,198,.07)" : "none", background: `rgba(217,178,106,${0.16 * hot})` }}>
            <div style={{ width: 34, height: 42, borderRadius: 7, background: i === NOTES.length - 1 ? GOLD : "#e9c9a8", display: "flex", flexDirection: "column", justifyContent: "center", gap: 5, padding: "0 7px", boxSizing: "border-box" }}>
              {[20, 20, 12].map((w, j) => <div key={j} style={{ width: w, height: 3, borderRadius: 2, background: "#2a2420" }} />)}
            </div>
            <div style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 36, color: hot > 0.5 ? GOLD : "#efe4d2", whiteSpace: "nowrap" }}>{t}</div>
          </div>
        );
      })}
    </div>
  );
};

// what he reads aloud: the kit's speech bubble with a gold edge (no violet in this video).
// x, y: the tip of the tail. The bubble keeps clear of the right 230 px.
const Say: React.FC<{ lf: number; text: string; from: number; until: number; x: number; y: number }> = ({ lf, text, from, until, x, y }) => {
  if (lf < from || lf > until + 5) return null;
  const k = sp(lf - from, 11, 190) * (1 - seg(lf, until, until + 5));
  const w = text.length * 24.5 + 74; // close enough to place it
  const cx = Math.min(846 - w / 2, Math.max(64 + w / 2, x)), dx = Math.max(-w / 2 + 50, Math.min(w / 2 - 50, x - cx));
  return (
    <div style={{ position: "absolute", left: cx, top: y - 24, transform: `translate(-50%,-100%) scale(${k})`, transformOrigin: `calc(50% + ${dx}px) 100%` }}>
      <div style={{ background: "#f6ecdc", borderRadius: 34, padding: "14px 34px 20px", fontFamily: "Caveat", fontWeight: 700, fontSize: 66, color: "#2a2420", whiteSpace: "nowrap", boxShadow: "0 8px 26px rgba(0,0,0,.45), 0 0 0 3px rgba(217,178,106,.75)" }}>{text}</div>
      <div style={{ position: "absolute", bottom: -22, left: `calc(50% + ${dx}px)`, marginLeft: -16, width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderTop: "26px solid #f6ecdc" }} />
    </div>
  );
};

const Stamp: React.FC<{ text: string; from: number }> = ({ text, from }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 244, textAlign: "center" }}><Eyebrow text={text} from={from} /></div>
);

// the unsent drafts, falling slowly behind the Heartly phone: [x, y at the start, z, fall speed]
const SLIPS: [number, number, number, number][] = [[-0.76, 0.25, -0.9, 1], [0.78, 0.8, -1.1, 1.25], [-0.72, 1.3, -1.5, 0.8], [0.74, -0.35, -0.8, 0.9], [0.12, 1.5, -1.3, 1.1], [-0.3, -1.15, -0.9, 1.2], [0.55, -1.25, -1.4, 0.85]];

// ---------- the video ----------
export const DraftsVideo: React.FC = () => {
  const scene = useScene(timing as unknown as Parameters<typeof useScene>[0]);
  const { f, id, lf, p, line, cue, zd } = scene;

  let content: React.ReactNode = null, lights: React.ReactNode = <BedNight />, overlay: React.ReactNode = null;
  let c: CamP = { target: [0, 1.1, 0], d: 10, yaw: 0.26, el: 0.19 };

  if (id === "hook") {
    // the habit: in bed, lit by the phone, typing to her and deleting it. Then the notes app: 31 of them.
    const typing = lf < 31, deleting = lf >= 40 && lf < 54;
    const tap = typing ? Math.sin(lf * 2.1) : 0;
    const hover = ease(seg(lf, 30, 35)) - ease(seg(lf, 38, 42)); // thumbs hang over the send button, then he gives up on it
    const hold = deleting ? 0.6 + 0.4 * Math.sin(lf * 3.1) : 0;
    const sigh = ease(seg(lf, 52, 60)) - ease(seg(lf, 66, 78));
    const wide = ease(seg(lf, 54, 86));
    const swipe = pop(lf, 94, 5) + pop(lf, 112, 5); // scrolling through them
    const pose: Pose = {
      armL: [-1.1 - 0.08 * Math.max(0, tap) + 0.05 * hover, -0.3],
      armR: [-1.1 - 0.08 * Math.max(0, -tap) + 0.05 * hover - 0.07 * hold - 0.1 * swipe, -0.3],
      headTilt: 0.42 + 0.16 * sigh - 0.08 * hover + 0.02 * Math.sin(lf * 0.4) * (typing ? 1 : 0),
      headTurn: 0.04 * Math.sin(lf * 0.06),
      eyes: lf > 55 && lf < 67 ? "closed" : "open",
    };
    const body: Body = { hip: [HIM_X, MAT, -0.12], rotY: 0.1, lean: -0.38 + 0.04 * sigh, pose };
    content = (
      <>
        <DraftsRoom f={f} />
        <Him {...body}>
          <Phone pos={[0, 0.78, 0.4]} rot={[0.8, Math.PI, 0]} />
          <pointLight position={[0, 1.0, 0.5]} color="#ffe9c8" intensity={3.4 * (1 + 0.06 * tap)} distance={2.4} decay={1.4} />
        </Him>
      </>
    );
    c = {
      target: mix3([HIM_X + 0.03, 1.1, -0.2], [HIM_X + 0.06, 1.72, -0.3], wide),
      d: zd(lerp(lerp(4.45, 4.2, seg(lf, 0, 56)), 6.9 - Math.max(0, lf - 86) * 0.004, wide)),
      yaw: lerp(lerp(0.22, 0.18, seg(lf, 0, 56)), 0.27, wide), el: lerp(0.1, 0.17, wide),
    };
    overlay = (
      <>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 620, background: "linear-gradient(rgba(14,10,8,.98) 0%, rgba(14,10,8,.96) 70%, rgba(14,10,8,0) 100%)" }} />
        <div style={{ position: "absolute", top: 236, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 30, letterSpacing: "0.24em", color: GOLD }}>1:40 AM</div>
          <div style={{ ...serif, marginTop: 12, fontSize: 104, lineHeight: 1.0, transform: `scale(${1 + 0.1 * Math.max(0, 1 - lf / 9)})` }}>The 31st draft</div>
          <div style={{ ...serif, marginTop: 4, fontSize: 82, lineHeight: 1.0, fontStyle: "italic", color: GOLD }}>is worse than the first.</div>
        </div>
        <ComposeBar lf={lf} y={1150} />
        <NotesCard lf={lf} from={58} />
      </>
    );
  } else if (id === "read") {
    // he sits up and reads three of them aloud. Each one is worse, and he is prouder of each.
    const d1 = cue("d1", 4), d2 = cue("d2", 49), d3 = cue("d3", 144);
    const s1 = d1 + 24, s2 = d2 + 36, s3 = d3 + 36; // where the draft itself starts inside each phrase (measured on the voice track)
    const beat = lf < d2 - 2 ? 0 : lf < d3 - 2 ? 1 : 2;
    const fallAt = s3 + 31, dropAt = s3 + 40, landAt = dropAt + 9;
    const up = easeOut(seg(lf, -3, 10));
    const fall = ease(seg(lf, fallAt, fallAt + 8)); // his face falls
    const drop = Math.pow(seg(lf, dropAt, landAt), 2); // and he goes back onto the pillow
    const bounce = lf >= landAt ? Math.sin(Math.min(1, (lf - landAt) / 9) * Math.PI) * 0.06 : 0;
    const speaking = (lf >= d1 + 2 && lf < d1 + 32) || (lf >= d2 + 1 && lf < d2 + 26) || (lf >= s2 && lf < s2 + 40) || (lf >= d3 + 2 && lf < d3 + 27) || (lf >= s3 && lf < s3 + 25);
    const talk = speaking ? Math.sin(lf * 0.95) : 0;

    let armL: [number, number] = [-0.75, 0.2], armR: [number, number] = [-1.3, -0.2];
    let headTilt = 0.14, headTurn = 0, smile = false, eyes: "open" | "closed" = "open", flex = 0;
    if (beat === 0) {
      // "hey." with a small wave at nobody
      const wave = sp(lf - s1 + 2, 12, 170);
      armL = mix2([-0.75, 0.2], [-0.25, 2.2 + 0.26 * Math.sin((lf - s1) * 0.8)], wave);
      headTilt = lerp(0.16, -0.06, wave); headTurn = 0.12 * wave; smile = wave > 0.5;
    } else if (beat === 1) {
      // "i'm fine, by the way": chin up, eyes shut, brushing it off. Then he nods at his own work.
      const cool = ease(seg(lf, s2 - 3, s2 + 5)) - ease(seg(lf, s2 + 30, s2 + 37));
      const nodFrom = s2 + 33;
      const nod = lf >= nodFrom ? Math.max(0, Math.sin(((lf - nodFrom) / 12) * Math.PI * 2 - 0.4)) : 0;
      armL = mix2([-0.75, 0.2], [-0.95, 1.0 + 0.2 * Math.sin((lf - s2) * 0.5)], cool);
      headTilt = 0.14 - 0.28 * cool + 0.24 * nod; headTurn = 0.3 * cool;
      eyes = cool > 0.5 ? "closed" : "open"; smile = lf > s2 + 8;
    } else {
      // "sent from the gym": he flexes at the phone, in bed. Then he hears it.
      const ready = ease(seg(lf, d3 - 2, d3 + 12)) * (1 - fall);
      const flexUp = sp(lf - s3 + 3, 10, 180) * (1 - fall);
      flex = flexUp;
      armR = mix2([-1.3, -0.2], [-1.62, 0.22], ready);
      armL = mix2([-0.75, 0.2], [0, 1.57], flexUp);
      headTilt = lerp(0.12, -0.1, flexUp) + 0.4 * fall; headTurn = -0.3 * flexUp;
      smile = lf > d3 + 4 && lf < fallAt; eyes = lf > landAt - 2 ? "closed" : "open";
      armR = mix2(armR, [-0.55, 0.75], drop); armL = mix2(armL, [-0.3, 0.95], drop);
      headTilt = lerp(headTilt, 0.3, drop);
    }
    const pose: Pose = { armL, armR, headTilt: headTilt + 0.035 * talk, headTurn, smile, eyes };
    const body: Body = { hip: [HIM_X, MAT + bounce * 0.5, lerp(-0.12, 0.06, drop)], rotY: lerp(0.1, 0.02, up), lean: lerp(lerp(-0.38, 0.04, up), -0.86, drop) + bounce, pose };
    const pump = flex * Math.max(0, Math.sin((lf - s3) * 0.55));
    content = (
      <>
        <DraftsRoom f={f} hipZ={-0.12} />
        <Him {...body} flex={flex} pump={pump}>
          <AtHand pose={pose} side={-1} upright>
            <Phone pos={[0, 0.1, 0.03]} rot={[0.14, Math.PI + 0.2, 0]} glow={1 - 0.5 * drop} />
            <pointLight position={[0.06, 0.24, -0.16]} color="#ffe9c8" intensity={2.6 * (1 - 0.6 * drop)} distance={2.2} decay={1.4} />
          </AtHand>
        </Him>
      </>
    );
    if (beat === 0) {
      const k = seg(lf, 0, d2);
      c = { target: [HIM_X + 0.1, 1.2, -0.1], d: zd(lerp(6.5, 6.0, ease(k))), yaw: lerp(0.3, 0.25, k), el: 0.14 };
    } else if (beat === 1) {
      const k = seg(lf, d2 - 2, d3);
      c = { target: [HIM_X + 0.04, lerp(1.2, 1.24, k), -0.1], d: lerp(5.3, 4.8, ease(k)), yaw: lerp(-0.1, -0.02, k), el: 0.1 };
    } else {
      const k = ease(seg(lf, d3 - 2, s3 + 10)), back = ease(seg(lf, fallAt, landAt + 6));
      c = { target: [HIM_X + 0.12, lerp(1.2, 1.04, back), lerp(-0.1, -0.18, back)], d: zd(lerp(lerp(6.9, 6.2, k), 7.3, back)), yaw: lerp(lerp(0.36, 0.3, k), 0.24, back), el: lerp(0.15, 0.24, back) };
    }
    const tip = project(c, along(body, 0.85 + 0.37));
    overlay = (
      <>
        <Stamp key={beat} text={["DRAFT 4", "DRAFT 19", "DRAFT 31"][beat]} from={[d1, d2, d3][beat]} />
        {beat === 0 && <Say lf={lf} text="hey." from={s1} until={d2 - 2} x={tip[0] - 40} y={tip[1]} />}
        {beat === 1 && <Say lf={lf} text="hey. i’m fine, by the way." from={s2} until={d3 - 2} x={tip[0]} y={tip[1]} />}
        {beat === 2 && <Say lf={lf} text="sent from the gym." from={s3} until={fallAt + 2} x={tip[0] - 30} y={tip[1]} />}
      </>
    );
  } else if (id === "phone") {
    // the real one, addressed to nobody. Behind the phone, the drafts drift down and go dim.
    const replyAt = cue("say", line(1));
    const done = ease(seg(lf, replyAt + 8, replyAt + 36));
    lights = (
      <>
        <hemisphereLight args={["#8a6a52", "#1c1410", 0.55]} />
        <pointLight position={[0, 0.6, 2.2]} color="#ffcf9e" intensity={9} distance={9} decay={1.5} />
        <pointLight position={[0, -0.2, -2.2]} color="#d9643a" intensity={5} distance={5} decay={1.5} />
      </>
    );
    content = (
      <>
        {SLIPS.map(([x, y0, z, v], i) => {
          const y = ((((y0 - lf * 0.0052 * v + 1.7) % 3.4) + 3.4) % 3.4) - 1.7;
          return <Slip key={i} pos={[x + 0.05 * Math.sin(f * 0.03 + i * 1.7), y, z]} rot={[0.35 * Math.sin(f * 0.026 + i), 0.6 * Math.sin(f * 0.021 + i * 2.2), (i - 3) * 0.14 + 0.25 * Math.sin(f * 0.017 + i * 1.3)]} lit={1 - 0.75 * done} lines={2 + (i % 2)} />;
        })}
      </>
    );
    c = { target: [0, 0, 0], d: zd(lerp(6.15, 5.85, ease(p))), yaw: 0.04 * Math.sin(lf * 0.02), el: 0 };
    overlay = <PhoneUI lf={lf} replyAt={replyAt} entry="i miss you and i hate that i do." reply={["What’s the part", "you kept deleting?"]} />;
  } else {
    // rest: dawn. His phone is face-down on the nightstand and he is asleep at last. The research line closes it.
    const resultAt = cue("result", 134);
    const m = ease(seg(lf, 4, 84));
    const reveal = ease(seg(lf, 30, 104));
    const breath = Math.sin(lf * 0.085);
    const pose: Pose = { armL: [-0.5, 0.42], armR: [-0.95, -0.42], headTilt: 0.34 + 0.015 * breath, headTurn: 0.42, eyes: "closed", smile: true };
    const body: Body = { hip: [HIM_X, MAT + 0.006 * breath, 0.08], rotY: 0.08, lean: -1.0 + 0.012 * breath, roll: -0.05, pose };
    lights = (
      <>
        <BedNight k={1 - m} />
        <Lights kind="dawn" k={m} />
      </>
    );
    content = (
      <>
        <DraftsRoom f={f} dawn={m} hipZ={-0.02} lie={1} phone />
        <Him {...body} />
      </>
    );
    c = {
      target: mix3([NS_PHONE[0] - 0.04, 0.2, NS_PHONE[2]], [-0.14, 0.3, -0.2], reveal),
      d: zd(lerp(lerp(4.9, 4.6, seg(lf, 0, 34)), lerp(9.7, 9.1, seg(lf, 100, 208)), reveal)),
      yaw: lerp(0.44, 0.24, reveal), el: lerp(0.36, 0.24, reveal),
    };
    const t0 = line(0);
    overlay = (
      <>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(12,9,7,0) 50.5%, rgba(12,9,7,.92) 57%, rgba(12,9,7,.985) 63%, rgba(12,9,7,.985) 100%)" }} />
        <Stamp text="6:30 AM" from={46} />
        <div style={{ position: "absolute", top: 1106, left: 60, right: 230, textAlign: "center" }}>
          <Eyebrow text="146 STUDIES · 2006" from={Math.max(0, t0 - 2)} />
          <div style={{ ...serif, marginTop: 14, fontSize: 62, lineHeight: 1.06 }}>
            <SoftBlurIn text="writing about what’s" from={t0 + 6} /><br /><SoftBlurIn text="weighing on you" from={t0 + 18} />
          </div>
          <div style={{ ...serif, marginTop: 6, fontSize: 80, lineHeight: 1.06, fontStyle: "italic", color: GOLD }}><SoftBlurIn text="a small but real benefit" from={resultAt} /></div>
          <div style={{ marginTop: 18, fontFamily: "Inter", fontWeight: 500, fontSize: 24, color: "rgba(246,236,220,.7)", opacity: seg(lf, resultAt + 14, resultAt + 26) }}>Frattaroli, Psychological Bulletin</div>
        </div>
      </>
    );
  }

  return (
    <Stage bg={BG[id]} scene={scene} scrim={id === "read" ? "top" : "none"} overlay={overlay}>
      <Cam target={c.target} d={c.d} yaw={c.yaw} el={c.el} />
      {lights}
      {content}
    </Stage>
  );
};
