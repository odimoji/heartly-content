// "60 days of no contact": 3D story video (Remotion + three.js), "night to dawn" look. No creature in this one.
// A man, 60 days after a breakup. No contact stops new contact; the loop in his head runs on three unanswered
// questions, shown as three glowing violet question marks that circle his head.
// Scene lengths come from src/timing/no_contact.json, written by vo.py from scripts/no_contact.json.
import timing from "./timing/no_contact.json";
import { Cam, Cap, Eyebrow, GOLD, glow, Lights, PhoneUI, serif, sp, Stage, useScene, Tie } from "./kit";
import { SoftBlurIn } from "./remocn/soft-blur-in";
import { ease, easeOut, lerp, seg, V3 } from "./three/parts";
import { Flat, FlatNight, LIE, PHONE, QMark, SEAT, TABLE_TOP } from "./three/sets_no_contact";
import { Person, Pose } from "./three/Woman";

const NIGHT = glow("rgba(196,100,60,.24)"), DAWN = glow("rgba(240,150,100,.42)", 50);
const BG: Record<string, string> = { hook: NIGHT, loop: NIGHT, questions: NIGHT, phone: glow("rgba(217,100,58,.26)", 52), rest: DAWN };

// ---------- him ----------
const Man: React.FC<{ pos: V3; rotY?: number; rotX?: number; pose?: Pose }> = (p) => <Person {...p} bun={false} jumper="#ead9bd" skin="#c08a62" hair="#4a2e20" trousers="#4a3a36" />;
const HEAD_SIT: V3 = [SEAT[0], SEAT[1] + 0.94, SEAT[2]];

// ---------- the three questions ----------
const S = 0.3, TAU = Math.PI * 2;
// a tilted ring: th=0 is screen-right, th=PI/2 the front
const orbit = (th: number, c: V3, rx: number, rz: number, tilt: number): V3 => [c[0] + rx * Math.cos(th), c[1] + tilt * Math.cos(th), c[2] + rz * Math.sin(th)];
const mix3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
// they face the camera and sway a little, so they read as "?" from every seat on the ring
const sway = (f: number, i: number, yaw: number) => ({ rotY: yaw + 0.45 * Math.sin(f * 0.07 + i * 2.1), rotZ: 0.14 * Math.sin(f * 0.055 + i * 1.7) });

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

// a small floating label next to a question mark (x, y: bottom centre)
const Label: React.FC<{ text: string; k: number; x: number; y: number }> = ({ text, k, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${k})`, transformOrigin: "50% 100%", fontFamily: "Caveat", fontWeight: 700, fontSize: 84, lineHeight: 1, color: "#f6ecdc", whiteSpace: "nowrap", textShadow: "0 3px 14px rgba(0,0,0,.9), 0 0 26px rgba(169,139,255,.9), 0 0 8px rgba(120,90,220,.7)" }}>{text}</div>
);

// ---------- the video ----------
export const NoContactVideo: React.FC = () => {
  const scene = useScene(timing as unknown as Parameters<typeof useScene>[0]);
  const { f, sc, id, lf, p, line, lineEnd, cue, zd } = scene;

  let content: React.ReactNode = null, lights: React.ReactNode = <FlatNight />, overlay: React.ReactNode = null;
  let c: CamP = { target: [0, 1.1, 0], d: 10, yaw: 0.26, el: 0.19 };

  if (id === "hook") {
    // the habit: flat on the sofa, feet up on the arm, staring at nothing while the three go round above his face
    const still = cue("still", 4);
    const k = ease(seg(lf, 16, sc.dur - 8));
    const head: V3 = [LIE[0] + 1.37, LIE[1], LIE[2]];
    const hc: V3 = [head[0] - 0.02, 1.2, -0.4];
    const th = (i: number) => f * 0.075 + (i * TAU) / 3;
    const blink = (lf > 58 && lf < 63) || (lf > 104 && lf < 108);
    c = { target: [lerp(0.06, -0.25, k), lerp(1.04, 1.62, k), lerp(-0.4, -0.15, k)], d: zd(lerp(6.3, 10.4, k) - lf * 0.004), yaw: lerp(0.1, 0.27, k), el: 0.19 };
    content = (
      <>
        <Flat f={f} />
        <group position={[LIE[0], LIE[1] + Math.sin(f * 0.11) * 0.006, LIE[2]]} rotation={[0, -Math.PI / 2, 0]}>
          <Man pos={[0, 0, 0]} rotX={-Math.PI / 2} pose={{ armL: [1.15 + Math.sin(f * 0.06) * 0.04, 0.5], armR: [-0.3 + Math.sin(f * 0.11) * 0.03, -0.5], headTurn: 0.55 + 0.1 * Math.sin(f * 0.075), headTilt: 0.12, eyes: blink ? "closed" : "open" }} />
        </group>
        {[0, 1, 2].map((i) => {
          const o = orbit(th(i), hc, 0.4, 0.25, 0.08);
          return <QMark key={i} pos={[o[0], o[1] + Math.sin(f * 0.13 + i * 2) * 0.025, o[2]]} s={S} {...sway(f, i, c.yaw)} />;
        })}
      </>
    );
    overlay = (
      <>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 730, background: "linear-gradient(rgba(14,10,8,.98) 0%, rgba(14,10,8,.96) 82%, rgba(14,10,8,0) 100%)" }} />
        <div style={{ position: "absolute", top: 236, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 30, letterSpacing: "0.24em", color: GOLD }}>DAY 60</div>
          <div style={{ ...serif, marginTop: 12, fontSize: 108, lineHeight: 0.98, transform: `scale(${1 + 0.1 * Math.max(0, 1 - lf / 9)})` }}>
            60 days of<br />no contact.
          </div>
          <div style={{ ...serif, marginTop: 20, fontSize: 70, lineHeight: 1.0, fontStyle: "italic", color: GOLD }}><SoftBlurIn text="still thinking about them." from={still} /></div>
        </div>
      </>
    );
  } else if (id === "loop") {
    // sitting up: they go round and round; he swats at one, misses, gives up
    const loopAt = cue("loop", 68);
    const hc: V3 = [HEAD_SIT[0], HEAD_SIT[1] + 0.26, HEAD_SIT[2]];
    const th = (i: number) => f * 0.085 + (i * TAU) / 3;
    const swat = ease(seg(lf, 22, 30)) - ease(seg(lf, 46, 56));
    const giveUp = ease(seg(lf, loopAt - 4, loopAt + 16));
    c = { target: [-0.14, 1.24, -0.15], d: zd(lerp(9.0, 7.5, ease(p))), yaw: lerp(0.3, 0.2, ease(p)), el: 0.18 };
    content = (
      <>
        <Flat f={f} />
        <Man pos={SEAT} rotY={0.12} pose={{ sit: true, armR: [lerp(-1.0, -2.55 + Math.sin(lf * 0.9) * 0.35, swat) + 0.35 * giveUp, lerp(-0.1, 0.45, swat) + 0.25 * giveUp], armL: [-1.0 + 0.35 * giveUp, -0.1 + 0.25 * giveUp], headTurn: 0.42 * Math.cos(th(0)) * (1 - 0.35 * giveUp), headTilt: -0.12 * swat - 0.24 * giveUp }} />
        {[0, 1, 2].map((i) => {
          const o = orbit(th(i), hc, 0.56, 0.4, 0.12);
          return <QMark key={i} pos={[o[0], o[1] + 0.1 * swat + Math.sin(f * 0.17 + i * 2) * 0.02, o[2]]} s={S} {...sway(f, i, c.yaw)} />;
        })}
      </>
    );
    const two = (a: string, b: string, from: number) => (
      <>
        <Cap eyebrow="DAY 60" text={a} from={from} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 124 }}><Cap text={b} from={from + 9} /></div>
      </>
    );
    overlay = lf < loopAt - 2 ? two("no contact", "stops new contact", line(0)) : two("not the loop", "in your head", loopAt);
  } else if (id === "questions") {
    // each one comes forward in turn and is named; then they go back to circling
    const q = [cue("q1", 4), cue("q2", 23), cue("q3", 41)];
    const qEnd = [q[1] - 3, q[2] - 3, lineEnd(0) + 2];
    const replay = cue("replay", line(1)), back = replay - 6;
    const H = HEAD_SIT, hc: V3 = [H[0], H[1] + 0.26, H[2]];
    const slots: V3[] = [[H[0] - 0.58, H[1] + 0.14, H[2] + 0.2], [H[0] + 0.58, H[1] + 0.2, H[2] + 0.2], [H[0] + 0.02, H[1] + 0.64, H[2] + 0.06]];
    const lean: V3[] = [[0.03, 0.02, 0.22], [-0.03, 0.02, 0.22], [0, -0.06, 0.3]];
    const base = [Math.PI, 0, -Math.PI / 2];
    const kRing = ease(seg(lf, back, back + 22));
    const th = (i: number) => base[i] + 0.1 * Math.max(0, lf - back) + 0.00014 * Math.max(0, lf - back) ** 2;
    c = { target: [0.0, 1.3, -0.15], d: zd(lerp(8.0, 7.0, ease(p))), yaw: lerp(0.2, 0.28, ease(p)), el: 0.17 };
    const marks = [0, 1, 2].map((i) => {
      const pop = sp(lf - q[i], 10, 190) - sp(lf - qEnd[i], 14, 150);
      const said = sp(lf - q[i], 11, 190);
      const s0 = slots[i], l = lean[i];
      const at: V3 = [s0[0] + l[0] * pop, s0[1] + l[1] * pop + Math.sin(f * 0.15 + i * 2) * 0.02, s0[2] + l[2] * pop];
      return { pc: mix3(at, orbit(th(i), hc, 0.56, 0.4, 0.12), kRing), s: S * (1 + 0.4 * pop), pop, said };
    });
    const t1 = ease(seg(lf, q[0], q[0] + 6)) - ease(seg(lf, q[1] - 2, q[1] + 5));
    const t2 = ease(seg(lf, q[1], q[1] + 6)) - ease(seg(lf, q[2] - 2, q[2] + 5));
    const up = ease(seg(lf, q[2], q[2] + 6)) - ease(seg(lf, q[2] + 9, q[2] + 18));
    const ears = ease(seg(lf, q[2] + 8, q[2] + 18)) - ease(seg(lf, back + 10, back + 30));
    const follow = ease(seg(lf, back + 20, back + 38));
    content = (
      <>
        <Flat f={f} />
        <Man pos={[SEAT[0] + 0.04 * t1 - 0.04 * t2, SEAT[1], SEAT[2]]} rotY={0.12} pose={{ sit: true, armL: [lerp(-1.0, -2.9, ears), lerp(-0.1, 0.25, ears)], armR: [lerp(-1.0, -2.9, ears), lerp(-0.1, 0.25, ears)], headTurn: -0.75 * t1 + 0.75 * t2 + 0.4 * follow * Math.cos(th(0)), headTilt: -0.4 * up + 0.3 * ears - 0.1 * follow, eyes: ears > 0.5 ? "closed" : "open" }} />
        {marks.map((u, i) => {
          const w = sway(f, i, c.yaw);
          return <QMark key={i} pos={u.pc} s={u.s} rotY={lerp(c.yaw + [0.3, -0.3, 0][i], w.rotY, kRing)} rotZ={w.rotZ * (1 - u.pop) + 0.12 * Math.sin(lf * 0.9) * u.pop * Math.max(0, 1 - (lf - q[i]) / 12)} glow={0.75 + 0.25 * Math.max(u.pop, kRing)} />;
        })}
      </>
    );
    const fade = 1 - seg(lf, back - 3, back + 3);
    const tip = (i: number) => project(c, [marks[i].pc[0], marks[i].pc[1] + marks[i].s * 0.62, marks[i].pc[2]]);
    const [b0, b1, b2] = [tip(0), tip(1), tip(2)];
    overlay = (
      <>
        {fade > 0 && (
          <div style={{ opacity: fade }}>
            {lf >= q[0] && <Label text="why?" k={marks[0].said} x={b0[0] - 6} y={b0[1] - 26} />}
            {lf >= q[1] && <Label text="what if?" k={marks[1].said} x={b1[0] - 8} y={b1[1] - 26} />}
            {lf >= q[2] && <Label text="was it me?" k={marks[2].said} x={b2[0]} y={b2[1] - 26} />}
          </div>
        )}
        {/* nudged 20 px left so the line ends clear of the right 230 px */}
        {lf >= replay - 2 && <div style={{ position: "absolute", left: -20, right: 20, top: 0 }}><Cap eyebrow="UNANSWERED" text="so they keep replaying" from={replay + 4} /></div>}
      </>
    );
  } else if (id === "phone") {
    // the first question rises behind the phone as he writes it down; it dims when the reply lands
    const peek = sp(lf - 10, 12, 110);
    const replyAt = cue("say", line(1));
    const react = ease(seg(lf, replyAt + 14, replyAt + 34));
    // it comes up over the top edge of the phone and leans in to read
    content = <QMark pos={[0.03, lerp(0.2, 1.0, peek) - 0.13 * react + Math.sin(f * 0.11) * 0.012, -0.3]} s={0.46} rotY={Math.sin(f * 0.05) * 0.22} rotX={0.28 * peek} rotZ={Math.sin(f * 0.04) * 0.05 + 0.2 * react} glow={1 - 0.65 * react} />;
    c = { target: [0, 0, 0], d: zd(6 - 0.25 * ease(p)), yaw: 0, el: 0 };
    overlay = <PhoneUI lf={lf} replyAt={replyAt} entry="why did she leave?" reply={["Underneath “why”:", "was it me?"]} />;
  } else {
    // rest: dawn. The one he wrote down drops onto the table by his phone and goes still and dim; the other two circle slowly.
    const resultAt = cue("result", 133), F = cue("fact", line(0));
    const m = ease(seg(lf, 4, 80));
    const breathIn = ease(seg(lf, 16, 30)) - ease(seg(lf, 32, 58)), out = ease(seg(lf, 32, 64));
    const looks = ease(seg(lf, 70, 90));
    const hc: V3 = [HEAD_SIT[0], HEAD_SIT[1] + 0.3, HEAD_SIT[2]];
    const th = (i: number) => 0.6 + f * 0.036 + i * Math.PI;
    // the spent one: falls from the ring, lands, tips over, fades
    const fall = Math.pow(seg(lf, 4, 18), 2), tip = easeOut(seg(lf, 20, 34)), spent = ease(seg(lf, 16, 64));
    const s2 = 0.26;
    const land: V3 = [PHONE[0] + 0.23, TABLE_TOP + lerp(0.51, 0.36, tip) * s2 + Math.max(0, Math.sin(seg(lf, 18, 26) * Math.PI)) * 0.03, PHONE[2] + 0.02];
    const from: V3 = [hc[0] + 0.5, hc[1], hc[2] + 0.2];
    lights = (
      <>
        <FlatNight k={1 - m} />
        <Lights kind="dawn" k={m} />
      </>
    );
    c = { target: [-0.2, 0.3, 0.05], d: zd(lerp(10.8, 9.8, ease(p))), yaw: lerp(0.3, 0.18, ease(p)), el: 0.2 };
    content = (
      <>
        <Flat f={f} dawn={m} phone={lerp(1, 0.5, seg(lf, 50, 130))} />
        <Man pos={[SEAT[0], SEAT[1] + 0.02 * breathIn - 0.015 * out, SEAT[2]]} rotY={0.12} pose={{ sit: true, armL: [lerp(-1.15, -0.72, out), lerp(-0.2, 0.2, out)], armR: [lerp(-1.15, -0.72, out), lerp(-0.2, 0.2, out)], eyes: lf > 32 && lf < 58 ? "closed" : "open", smile: lf > 52, headTilt: -0.14 * breathIn + 0.08 * out + 0.24 * looks, headTurn: 0.22 * looks + 0.25 * (1 - seg(lf, 10, 30)) }} />
        {[0, 1].map((i) => {
          const o = orbit(th(i), hc, 0.58, 0.4, 0.1);
          return <QMark key={i} pos={[o[0], o[1] + Math.sin(f * 0.07 + i * 2) * 0.03, o[2]]} s={S * 0.92} {...sway(f * 0.5, i, c.yaw)} glow={lerp(1, 0.7, m)} />;
        })}
        <QMark pos={mix3(from, land, fall)} s={s2} rotY={c.yaw} rotZ={-1.45 * tip} glow={1 - 0.9 * spent} />
      </>
    );
    overlay = (
      <>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(12,9,7,0) 50.5%, rgba(12,9,7,.92) 57%, rgba(12,9,7,.985) 63%, rgba(12,9,7,.985) 100%)" }} />
        <Tie a="the one he wrote down" b="went quiet." from={cue("tie", 8)} until={F} style={{ left: 60, right: 230 }} />
        <div style={{ position: "absolute", top: 1106, left: 60, right: 230, textAlign: "center" }}>
          <Eyebrow text="146 STUDIES · 2006" from={F + 2} />
          <div style={{ ...serif, marginTop: 14, fontSize: 62, lineHeight: 1.06 }}>
            <SoftBlurIn text="writing about what’s" from={F + 50} /><br /><SoftBlurIn text="weighing on you" from={F + 62} />
          </div>
          <div style={{ ...serif, marginTop: 6, fontSize: 80, lineHeight: 1.06, fontStyle: "italic", color: GOLD }}><SoftBlurIn text="a small but real benefit" from={resultAt} /></div>
          <div style={{ marginTop: 18, fontFamily: "Inter", fontWeight: 500, fontSize: 24, color: "rgba(246,236,220,.7)", opacity: seg(lf, resultAt + 14, resultAt + 26) }}>Frattaroli, Psychological Bulletin</div>
        </div>
      </>
    );
  }

  return (
    <Stage bg={BG[id]} scene={scene} scrim={id === "loop" || id === "questions" ? "top" : "none"} overlay={overlay}>
      <Cam target={c.target} d={c.d} yaw={c.yaw} el={c.el} />
      {lights}
      {content}
    </Stage>
  );
};
