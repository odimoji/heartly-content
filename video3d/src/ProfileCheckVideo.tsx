// "Stop checking their profile. Every look restarts the clock.": 3D explainer (Remotion + three.js), "night to dawn" look.
// No creature in this one. The clock is the tally of days on his wall: every check wipes it back to zero.
// Turn: he writes what he was hoping to find. Close: dawn, phone face-down, day 1 on the wall, and the UCLA line.
// Scene lengths, line windows and cues come from src/timing/profile_check.json, written by vo.py from scripts/profile_check.json.
import timing from "./timing/profile_check.json";
import { Cam, Cap, Eyebrow, GOLD, glow, Lights, PhoneUI, serif, sp, Stage, useScene } from "./kit";
import { SoftBlurIn } from "./remocn/soft-blur-in";
import { ease, lerp, seg, V3 } from "./three/parts";
import { Flat, FlatNight, LIE, SEAT } from "./three/sets_no_contact";
import { Person, Pose } from "./three/Woman";

const NIGHT = glow("rgba(196,100,60,.24)"), DAWN = glow("rgba(240,150,100,.42)", 50);
const BG: Record<string, string> = { hook: NIGHT, snooze: NIGHT, phone: glow("rgba(217,100,58,.26)", 52), rest: DAWN };

const Man: React.FC<{ pos: V3; rotY?: number; rotX?: number; pose?: Pose }> = (p) => <Person {...p} bun={false} jumper="#ead9bd" skin="#c08a62" hair="#4a2e20" trousers="#4a3a36" />;
const TALLY: V3 = [0.72, 1.32, -1.0]; // the tally on the wall (see Flat)
const HAND: V3 = [SEAT[0], 0.84, SEAT[2] + 0.44]; // where he holds the phone
const mix3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const pop = (t: number, at: number, w = 4) => Math.max(0, 1 - Math.abs(t - at) / w);

// ---------- camera as data, so labels can be pinned to 3D points ----------
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

// a small gold-edged tag pinned to a point in the scene (x, y: bottom centre)
const Tag: React.FC<{ text: string; x: number; y: number; k: number; hot?: boolean }> = ({ text, x, y, k, hot }) =>
  k <= 0.01 ? null : (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${k})`, transformOrigin: "50% 100%", padding: "10px 24px 11px", borderRadius: 999, background: hot ? "#d9643a" : "#17120e", boxShadow: `0 8px 26px rgba(0,0,0,.5), 0 0 0 3px ${hot ? "rgba(246,236,220,.85)" : "rgba(217,178,106,.8)"}`, fontFamily: "Inter", fontWeight: 600, fontSize: 34, letterSpacing: "0.2em", color: hot ? "#fff6e8" : GOLD, whiteSpace: "nowrap" }}>{text}</div>
  );

// sitting on the sofa with the phone: thumbs hover, then one goes down
const sitPose = (lf: number, tap: number, lookUp: number, sag: number): Pose => ({
  sit: true, phone: true,
  armL: [-1.1 + 0.03 * Math.sin(lf * 0.5), -0.3],
  armR: [-1.1 - 0.1 * tap + 0.04 * Math.sin(lf * 0.9 + 1), -0.3],
  headTilt: lerp(0.42, -0.02, lookUp) + 0.3 * sag,
  headTurn: 0.62 * lookUp,
  eyes: sag > 0.6 ? "closed" : "open",
});
const PhoneGlow: React.FC<{ flash: number }> = ({ flash }) => <pointLight position={[HAND[0], HAND[1] + 0.12, HAND[2] + 0.1]} color="#ffe2bd" intensity={1.1 + 3.2 * flash} distance={2.2} decay={1.4} />;

export const ProfileCheckVideo: React.FC = () => {
  const scene = useScene(timing as unknown as Parameters<typeof useScene>[0]);
  const { f, id, lf, p, line, cue, zd } = scene;

  let content: React.ReactNode = null, lights: React.ReactNode = <FlatNight />, overlay: React.ReactNode = null;
  let c: CamP = { target: [0.3, 1.25, -0.4], d: 6.4, yaw: 0.2, el: 0.16 };
  let scrim: "top" | "none" = "none";

  if (id === "hook") {
    // the habit: on the sofa at night, thumb over their profile. He knows. He looks anyway, and day 12 becomes day 0.
    const R = cue("reset", 67) + 22;
    const wide = ease(seg(lf, 30, R - 6));
    const know = ease(seg(lf, 26, 36)) - ease(seg(lf, 46, 56)); // a look at the wall first
    const tap = pop(lf, R - 2, 4);
    const after = ease(seg(lf, R + 6, R + 18));
    const days = Math.round(12 * (1 - seg(lf, R, R + 9)));
    content = (
      <>
        <Flat f={f} days={days} noPhone />
        <Man pos={SEAT} rotY={0.12} pose={sitPose(lf, tap, Math.max(know, after * (1 - 0.7 * seg(lf, R + 40, R + 54))), ease(seg(lf, R + 40, R + 54)))} />
        <PhoneGlow flash={pop(lf, R, 6)} />
      </>
    );
    c = { target: mix3([SEAT[0] + 0.02, 1.32, -0.2], [0.34, 1.3, -0.4], wide), d: zd(lerp(lerp(5.0, 4.8, seg(lf, 0, 30)), 6.9, wide)), yaw: lerp(0.12, 0.07, wide), el: lerp(0.12, 0.16, wide) };
    const t = project(c, [TALLY[0], TALLY[1] + 0.3, TALLY[2]]);
    const flip = sp(lf - R - 8, 10, 200);
    overlay = (
      <>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 640, background: "linear-gradient(rgba(14,10,8,.98) 0%, rgba(14,10,8,.95) 72%, rgba(14,10,8,0) 100%)" }} />
        <div style={{ position: "absolute", top: 236, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 30, letterSpacing: "0.24em", color: GOLD }}>11:48 PM</div>
          <div style={{ ...serif, marginTop: 12, fontSize: 104, lineHeight: 0.98, transform: `scale(${1 + 0.1 * Math.max(0, 1 - lf / 9)})` }}>Stop checking<br />their profile.</div>
          <div style={{ ...serif, marginTop: 18, fontSize: 66, lineHeight: 1.0, fontStyle: "italic", color: GOLD }}><SoftBlurIn text="every look restarts the clock." from={cue("reset", 67)} /></div>
        </div>
        {lf < R + 8 ? <Tag text="DAY 12" x={t[0]} y={t[1]} k={wide} /> : <Tag text="DAY 0" x={t[0]} y={t[1]} k={flip} hot />}
      </>
    );
  } else if (id === "snooze") {
    // three more. Each time the wall has just started counting again.
    const T = [cue("t1", 4) + 12, cue("t2", 56) + 14, cue("t3", 107) + 16];
    const beat = lf < cue("t2", 56) - 2 ? 0 : lf < cue("t3", 107) - 2 ? 1 : 2;
    const tap = Math.max(...T.map((t) => pop(lf, t - 2, 4)));
    const flash = Math.max(...T.map((t) => pop(lf, t, 6)));
    const since = Math.min(...T.map((t) => (lf >= t ? lf - t : 999)));
    const until = Math.min(...T.map((t) => (lf < t ? t - lf : 999)));
    const days = since < 20 ? 0 : 1; // one day goes back up, and gets wiped again
    const look = since < 999 ? ease(seg(since, 4, 12)) - ease(seg(since, 22, 32)) : 0;
    const sag = lf > T[2] ? ease(seg(lf, T[2] + 26, T[2] + 40)) : 0;
    content = (
      <>
        <Flat f={f} days={days} noPhone />
        <Man pos={[SEAT[0], SEAT[1] + 0.012 * Math.max(0, 1 - until / 8), SEAT[2]]} rotY={0.12} pose={sitPose(lf, tap, look * (1 - sag), sag)} />
        <PhoneGlow flash={flash} />
      </>
    );
    c = { target: [0.34, 1.3, -0.4], d: zd(lerp(6.9, 6.5, ease(p)) - 0.1 * flash), yaw: lerp(0.07, 0.04, p), el: 0.16 };
    const t = project(c, [TALLY[0], TALLY[1] + 0.3, TALLY[2]]);
    const n = project(c, [SEAT[0] - 0.62, 1.02, SEAT[2] + 0.3]);
    const done = T.filter((x) => lf >= x).length;
    scrim = "top";
    overlay = (
      <>
        <Cap key={beat} eyebrow="11:48 PM" text={["nine times today.", "it feels like checking.", "it works like snooze."][beat]} from={[cue("t1", 4), cue("t2", 56), cue("t3", 107)][beat] - 2} />
        <Tag text={days ? "DAY 1" : "DAY 0"} x={t[0]} y={t[1]} k={days ? sp(since - 20, 12, 180) : since < 999 ? sp(since, 10, 200) : 1} hot={!days} />
        {done > 0 && <Tag key={done} text={`CHECK ${6 + done}`} x={n[0]} y={n[1]} k={sp(since, 10, 200)} />}
      </>
    );
  } else if (id === "phone") {
    // the turn: he writes what he was hoping to find
    const replyAt = cue("say", line(1));
    lights = null;
    c = { target: [0, 0, 0], d: zd(6 - 0.25 * ease(p)), yaw: 0, el: 0 };
    overlay = <PhoneUI lf={lf} replyAt={replyAt} entry="i check to see if she’s happy without me." reply={["Is the real question", "do I still matter?"]} />;
  } else {
    // rest: dawn. Phone face-down on the table, him asleep on the sofa, one day on the wall.
    const resultAt = cue("result", 127), t0 = line(0);
    const m = ease(seg(lf, 4, 80));
    lights = (
      <>
        <FlatNight k={1 - m} />
        <Lights kind="dawn" k={m} />
      </>
    );
    content = (
      <>
        <Flat f={f} dawn={m} phone={0} days={1} />
        <group position={[LIE[0], LIE[1] + Math.sin(f * 0.085) * 0.006, LIE[2]]} rotation={[0, -Math.PI / 2, 0]}>
          <Man pos={[0, 0, 0]} rotX={-Math.PI / 2} pose={{ armL: [1.15, 0.5], armR: [-0.3 + Math.sin(f * 0.085) * 0.02, -0.5], headTurn: 0.55, headTilt: 0.12, eyes: "closed", smile: true }} />
        </group>
      </>
    );
    c = { target: [0.02, 0.3, 0.05], d: zd(lerp(11.2, 10.3, ease(p))), yaw: lerp(0.16, 0.08, ease(p)), el: 0.2 };
    const t = project(c, [TALLY[0], TALLY[1] + 0.3, TALLY[2]]);
    overlay = (
      <>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(12,9,7,0) 50.5%, rgba(12,9,7,.92) 57%, rgba(12,9,7,.985) 63%, rgba(12,9,7,.985) 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 420, background: "linear-gradient(rgba(12,9,7,.9) 0%, rgba(12,9,7,.75) 55%, rgba(12,9,7,0) 100%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 244, textAlign: "center" }}><Eyebrow text="6:10 AM" from={30} /></div>
        <Tag text="DAY 1" x={t[0]} y={t[1]} k={sp(lf - 44, 12, 180)} />
        <div style={{ position: "absolute", top: 1106, left: 60, right: 230, textAlign: "center" }}>
          <Eyebrow text="UCLA BRAIN-SCAN STUDY · 2007" from={Math.max(0, t0 - 2)} />
          <div style={{ ...serif, marginTop: 14, fontSize: 62, lineHeight: 1.06 }}><SoftBlurIn text="putting a feeling into words" from={t0 + 50} /></div>
          <div style={{ ...serif, marginTop: 6, fontSize: 68, lineHeight: 1.06, whiteSpace: "nowrap", fontStyle: "italic", color: GOLD }}><SoftBlurIn text="turned down the brain’s alarm" from={resultAt} /></div>
          <div style={{ marginTop: 18, fontFamily: "Inter", fontWeight: 500, fontSize: 24, color: "rgba(246,236,220,.7)", opacity: seg(lf, resultAt + 14, resultAt + 26) }}>Lieberman et al., Psychological Science</div>
        </div>
      </>
    );
  }

  return (
    <Stage bg={BG[id]} scene={scene} scrim={scrim} overlay={overlay}>
      <Cam target={c.target} d={c.d} yaw={c.yaw} el={c.el} />
      {lights}
      {content}
    </Stage>
  );
};
