// "Stop winning arguments in the shower": 3D story video (Remotion + three.js), "night to dawn" look. No creature in this one.
// Two years on, he still wins arguments with his ex that never happen: in the shower, in the car, at the gym, against a lamp.
// Scene lengths, line windows and cues come from src/timing/shower_argument_3d.json, written by vo.py from scripts/shower_argument_3d.json.
import { useCurrentFrame } from "remotion";
import timing from "./timing/shower_argument_3d.json";
import { useFontsReady } from "./fonts";
import { Cam, Cap, Eyebrow, GOLD, glow, Lights, PhoneUI, serif, sp, Stage, useScene } from "./kit";
import { SoftBlurIn } from "./remocn/soft-blur-in";
import { ease, lerp, seg, V3 } from "./three/parts";
import { Barbell, Bathroom, BOTTLE, Car, CarPark, Guy, GymCorner, HIM, LAMP, LampRoom, Note, OnBody, Rig, Steam, WarmNight } from "./three/sets_shower_argument";

const NIGHT = glow("rgba(210,112,64,.26)"), DAWN = glow("rgba(240,150,100,.42)", 50);
const BG: Record<string, string> = { hook: NIGHT, places: glow("rgba(226,140,80,.30)"), phone: glow("rgba(217,100,58,.26)", 52), rest: DAWN };

const pop = (t: number, at: number, w = 3) => Math.max(0, 1 - Math.abs(t - at) / w);
const mix3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const FACE = Math.atan2(BOTTLE[0] - HIM[0], BOTTLE[2] - HIM[2]); // he squares up to the shampoo

// ---------- camera as data, so his speech bubble can be pinned above his head ----------
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

// ---------- DOM pieces (frames count from the start of their scene) ----------
// his own words: the kit's bubble with a gold edge (no violet in this video); x, y is the tip of the tail
const Say: React.FC<{ text: string; from: number; to?: number; x: number; y: number; tailAt?: number; size?: number }> = ({ text, from, to = 9999, x, y, tailAt = 0.3, size = 58 }) => {
  const f = useCurrentFrame();
  if (f < from || f > to + 5) return null;
  const k = sp(f - from, 11, 190) * (1 - seg(f, to, to + 5));
  return (
    <div style={{ position: "absolute", left: x, top: y - 24, transform: `translate(${-tailAt * 100}%,-100%) scale(${k})`, transformOrigin: `${tailAt * 100}% 100%` }}>
      <div style={{ background: "#f6ecdc", borderRadius: 34, padding: "12px 32px 18px", fontFamily: "Caveat", fontWeight: 700, fontSize: size, color: "#2a2420", whiteSpace: "nowrap", boxShadow: "0 8px 26px rgba(0,0,0,.4), 0 0 0 3px rgba(217,178,106,.6)" }}>{text}</div>
      <div style={{ position: "absolute", bottom: -22, left: `calc(${tailAt * 100}% - 16px)`, width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderTop: "26px solid #f6ecdc" }} />
    </div>
  );
};

// the closing research line, in the style of the kit's Fact, kept inside x 60-850 and above y 1440
const Study: React.FC<{ at0: number; at1: number; at2: number }> = ({ at0, at1, at2 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 1166, left: 60, right: 230, textAlign: "center" }}>
      <div style={{ whiteSpace: "nowrap" }}><Eyebrow text="UCLA BRAIN-SCAN STUDY · 2007" from={at0} /></div>
      <div style={{ ...serif, marginTop: 14, fontSize: 62, lineHeight: 1.06, whiteSpace: "nowrap" }}><SoftBlurIn text="putting a feeling into words" from={at1} /></div>
      <div style={{ ...serif, marginTop: 4, fontSize: 70, lineHeight: 1.06, fontStyle: "italic", color: GOLD, whiteSpace: "nowrap" }}><SoftBlurIn text="turned down the brain’s alarm" from={at2} /></div>
      <div style={{ marginTop: 18, fontFamily: "Inter", fontWeight: 500, fontSize: 24, color: "rgba(246,236,220,.7)", opacity: seg(f, at2 + 14, at2 + 26) }}>Lieberman et al., Psychological Science</div>
    </div>
  );
};

// ---------- the video ----------
export const ShowerArgumentVideo: React.FC = () => {
  const scene = useScene(timing as unknown as Parameters<typeof useScene>[0]);
  const fonts = useFontsReady();
  const { f, sc, id, lf, p, line, cue, zd } = scene;

  let content: React.ReactNode = null, lights: React.ReactNode = <WarmNight />, overlay: React.ReactNode = null;
  let c: CamP = { target: [0, 1.1, 0], d: 10, yaw: 0.26, el: 0.19 };

  if (id === "hook") {
    // the habit, from frame 0: mid-rant under the water, jabbing a finger at the shampoo. Then we pull back to the
    // whole bathroom and his count on the tiles, and "she can't hear you" takes the wind out of him.
    const rantAt = cue("rant", 4), cantAt = cue("cant", 113);
    const stop = ease(seg(lf, cantAt, cantAt + 14));
    const jab = [1, 9, 17, 25, 40, 48, 62, 70, 88, 96, 104].reduce((m, at) => Math.max(m, pop(lf, at, 4)), 0) * (1 - stop);
    const fling = ease(seg(lf, 54, 62)) - ease(seg(lf, 80, 90)); // the free arm goes up: "can you BELIEVE"
    const ranting = lf < cantAt + 2;
    const look = ease(seg(lf, cantAt + 22, cantAt + 34)); // he looks at the bottle. It is a bottle.
    const rig: Rig = {
      pos: [HIM[0] + 0.035 * jab, HIM[1], HIM[2] + 0.02 * jab], rotY: FACE - 0.04, lean: 0.05 + 0.09 * jab - 0.03 * stop,
      pose: {
        armR: [lerp(-1.68 - 0.14 * jab, -0.12, stop), lerp(-0.2, 0.16, stop)],
        armL: [lerp(lerp(0.18, -1.9, fling), 0.05, stop), lerp(lerp(0.62, 1.0, fling), 0.18, stop)],
        headTurn: lerp(-0.3 + 0.12 * jab, -0.42 + 0.34 * look, stop), headTilt: lerp(-0.05 + 0.12 * jab, 0.2 - 0.06 * look, stop),
      },
    };
    content = (
      <Bathroom f={f} fonts={fonts}>
        <Guy {...rig} outfit="shower" foam={1} point={stop < 0.6 ? -1 : undefined} mouth={ranting ? 0.2 + 0.8 * Math.abs(Math.sin((f + 1) * 0.95)) : 0.05} brows={lerp(0.42, -0.3, stop)} />
      </Bathroom>
    );
    const hold = seg(lf, 0, 54), k1 = ease(seg(lf, 52, 94)), k2 = ease(seg(lf, cantAt + 2, sc.dur));
    c = {
      target: mix3(mix3([0.2, 1.43, -0.24], [-0.12, 1.4, -0.1], k1), [0.02, 1.36, -0.15], k2),
      d: zd(lerp(lerp(lerp(5.6, 5.2, hold), 11.0, k1), 9.0, k2)),
      yaw: lerp(lerp(lerp(0.44, 0.4, hold), 0.25, k1), 0.3, k2), el: lerp(0.1, 0.19, k1),
    };
    const head = project(c, [rig.pos[0], rig.pos[1] + 1.8, rig.pos[2]]);
    overlay = (
      <>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 640, background: "linear-gradient(rgba(14,10,8,.98) 0%, rgba(14,10,8,.96) 62%, rgba(14,10,8,0) 100%)" }} />
        {/* the title block is centred in x 60-850, clear of the right 230 px */}
        <div style={{ position: "absolute", top: 236, left: 60, right: 230, textAlign: "center" }}>
          <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 30, letterSpacing: "0.24em", color: GOLD }}>TWO YEARS LATER</div>
          <div style={{ position: "relative", marginTop: 12 }}>
            <div style={{ ...serif, fontSize: 82, lineHeight: 1.02, whiteSpace: "nowrap", opacity: 1 - seg(lf, cantAt - 9, cantAt - 2) }}>
              Stop winning arguments<br />
              <span style={{ fontStyle: "italic", fontSize: 104, lineHeight: 1.0, color: GOLD, display: "inline-block", transform: `scale(${1 + 0.16 * Math.max(0, 1 - lf / 10)})` }}>in the shower.</span>
            </div>
            <div style={{ ...serif, position: "absolute", top: 0, left: 0, right: 0, fontSize: 98, lineHeight: 1.0 }}>
              <SoftBlurIn text="she can’t" from={cantAt - 2} /><br />
              <SoftBlurIn text="hear you." from={cantAt + 3} style={{ fontStyle: "italic", color: GOLD }} />
            </div>
          </div>
        </div>
        <Say text="and ANOTHER thing!" from={rantAt} to={46} x={head[0] + 40} y={Math.max(head[1], 668)} tailAt={0.22} />
      </>
    );
  } else if (id === "places") {
    // three quick wins, one per cue: the car, the gym, the lamp
    const gA = cue("gym", 51), lA = cue("lamp", 84);
    const beat = lf < gA ? 0 : lf < lA ? 1 : 2;
    const yap = 0.2 + 0.8 * Math.abs(Math.sin((f + 1) * 0.95));
    if (beat === 0) {
      const jab = Math.max(pop(lf, 8, 4), pop(lf, 18, 4), pop(lf, 30, 4), pop(lf, 40, 4));
      const rig: Rig = { pos: [-0.22, 0.4, -0.52], lean: 0.04 + 0.08 * jab, pose: { sit: true, armR: [-1.52 - 0.12 * jab, 0.16], armL: [-1.15, -0.3], headTurn: -0.32 + 0.1 * jab, headTilt: -0.04 + 0.1 * jab } };
      lights = <WarmNight lamp={[0.7, 1.9, -0.3]} li={9} />;
      content = (
        <CarPark>
          <group position={[0.1, 0, 0.08]} rotation={[0, 0.8, 0]}>
            <Car>
              <Guy {...rig} outfit="hoodie" point={-1} mouth={yap} brows={0.42} />
            </Car>
          </group>
        </CarPark>
      );
      c = { target: [0.02, 0.9, 0.12], d: zd(lerp(8.9, 8.2, seg(lf, 0, gA))), yaw: lerp(0.16, 0.24, seg(lf, 0, gA)), el: 0.17 };
    } else if (beat === 1) {
      const b = lf - gA;
      const curl = 0.52 + 0.035 * Math.sin(b * 1.3) + 0.1 * (1 - seg(b, 0, 7)); // stuck halfway up, and shaking
      const a0 = -0.25 - 1.5 * curl;
      const rig: Rig = { pos: [-0.12, 0, 0.2], rotY: 0.22, pose: { armL: [a0, 0.06], armR: [a0, 0.06], headTurn: 0.5 + 0.08 * Math.sin(b * 0.5), headTilt: -0.06 + 0.07 * Math.sin(b * 0.9) } };
      lights = <WarmNight lamp={[0, 2.0, 0.9]} li={6} />;
      content = (
        <GymCorner f={f}>
          <Guy {...rig} outfit="gym" mouth={yap} brows={0.42} />
          <OnBody {...rig}><Barbell pos={[0, 0.99 - 0.43 * Math.cos(a0), -0.43 * Math.sin(a0)]} /></OnBody>
        </GymCorner>
      );
      c = { target: [-0.08, 1.02, 0.2], d: lerp(7.9, 7.3, seg(b, 0, lA - gA)), yaw: lerp(0.36, 0.3, seg(b, 0, lA - gA)), el: 0.15 };
    } else {
      const b = lf - lA;
      const jab = Math.max(pop(b, 5, 4), pop(b, 14, 4), pop(b, 24, 4), pop(b, 34, 4));
      const at: V3 = [-0.38, 0, -0.2];
      const rig: Rig = { pos: at, rotY: Math.atan2(LAMP[0] - at[0], LAMP[2] - at[2]), lean: 0.05 + 0.09 * jab, pose: { armR: [-1.82 - 0.14 * jab, -0.12], armL: [0.2, 0.62], headTurn: -0.28, headTilt: -0.2 + 0.1 * jab } };
      lights = <WarmNight lamp={[-0.6, 2.0, 0.6]} li={4} />;
      content = (
        <LampRoom>
          <Guy {...rig} outfit="home" point={-1} mouth={yap} brows={0.42} />
        </LampRoom>
      );
      c = { target: [0.1, 1.04, 0.05], d: zd(lerp(8.6, 8.0, seg(b, 0, sc.dur - lA))), yaw: lerp(0.3, 0.22, seg(b, 0, sc.dur - lA)), el: 0.17 };
      const head = project(c, [at[0], 1.7, at[2]]);
      overlay = <Say text="and FURTHERMORE" from={lA + 5} x={head[0] + 20} y={head[1]} tailAt={0.3} size={54} />;
    }
    overlay = (
      <>
        <Cap eyebrow="HE’S WON" text={["in the car.", "at the gym.", "against a lamp."][beat]} from={[cue("car", 4), gA, lA][beat] - 2} />
        {overlay}
      </>
    );
  } else if (id === "phone") {
    // the turn: he writes it down. Only a little steam behind the phone.
    const replyAt = cue("say", line(1));
    lights = null;
    content = <Steam f={f} at={[0, -1.6, -0.6]} spread={2.2} rise={3.4} n={8} k={0.6} size={1.5} />;
    c = { target: [0, 0, 0], d: zd(6 - 0.25 * ease(p)), yaw: 0, el: 0 };
    overlay = <PhoneUI lf={lf} replyAt={replyAt} entry="i keep arguing with you in my head. i always win." reply={["What did you want", "her to hear?"]} />;
  } else {
    // rest: the same shower at dawn. Nobody to beat. He hums; the count on the wall goes with the steam.
    const resAt = cue("result", 127);
    const m = ease(seg(lf, 0, 46));
    const sway = Math.sin(f * 0.07);
    const breath = Math.sin(f * 0.09);
    const rig: Rig = {
      pos: HIM, rotY: 0.34 + 0.07 * sway,
      pose: { armL: [0.04 + 0.03 * sway, 0.16 + 0.02 * breath], armR: [-0.04 - 0.03 * sway, 0.16 + 0.02 * breath], headTilt: -0.2 + 0.03 * breath, headTurn: 0.1 * sway, eyes: "closed", smile: true },
    };
    lights = (
      <>
        <WarmNight k={1 - m} />
        <Lights kind="dawn" k={m} />
      </>
    );
    content = (
      <Bathroom f={f} fonts={fonts} dawn={m} tally={lerp(0.85, 0.07, ease(seg(lf, 14, 150)))} steam={0.8}>
        <Guy {...rig} outfit="shower" foam={0.55} />
        {[0, 1, 2].map((i) => {
          const t = ((lf + i * 30) % 90) / 90;
          const k = Math.sin(t * Math.PI) * (lf > 16 + i * 14 ? 1 : 0);
          return <Note key={i} pos={[HIM[0] + 0.36 + 0.13 * i + 0.06 * Math.sin(lf * 0.1 + i * 2), 1.5 + 0.62 * t, HIM[2] + 0.3]} s={1.5} rotZ={0.25 * Math.sin(lf * 0.08 + i)} k={k} />;
        })}
      </Bathroom>
    );
    c = { target: [lerp(-0.02, -0.1, ease(p)), 0.4, 0.0], d: zd(lerp(10.9, 9.9, ease(p))), yaw: lerp(0.3, 0.2, ease(p)), el: 0.2 };
    overlay = (
      <>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(12,9,7,0) 50.5%, rgba(12,9,7,.92) 57%, rgba(12,9,7,.985) 63%, rgba(12,9,7,.985) 100%)" }} />
        <Study at0={line(0)} at1={line(0) + 8} at2={resAt} />
      </>
    );
  }

  return (
    <Stage bg={BG[id]} scene={scene} scrim={id === "places" ? "top" : "none"} overlay={overlay}>
      <Cam target={c.target} d={c.d} yaw={c.yaw} el={c.el} />
      {lights}
      {content}
    </Stage>
  );
};
