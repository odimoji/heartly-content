// "Fine all day. Wrecked at 2am.": the thought is the same size day and night; at night the room is just emptier.
// One room, and the thought as a small violet glow (no character in this video) that stays the same size until it burns down at dawn.
// Scene lengths come from src/timing/worse_at_night.json (vo.py).
import { useCurrentFrame } from "remotion";
import timing from "./timing/worse_at_night.json";
import { Cam, Eyebrow, GOLD, glow, Lights, PhoneUI, serif, sp, Stage, useScene } from "./kit";
import { SoftBlurIn } from "./remocn/soft-blur-in";
import { ease, easeOut, lerp, seg, V3 } from "./three/parts";
import { DayThings, FRIEND, HER, NightRoom, Orb, Pop, popOut, SunPatch, Thing } from "./three/sets_worse_at_night";
import { Person } from "./three/Woman";

const R = 0.13; // the thought: the same size in every scene
const NIGHT = [126, 98, 214, 0.3], DAY = [232, 170, 90, 0.38], DAWN = [240, 150, 100, 0.42];
const rgba = (a: number[], b: number[] = a, k = 0) => `rgba(${a.map((v, i) => (i < 3 ? Math.round(lerp(v, b[i], k)) : lerp(v, b[i], k).toFixed(3))).join(",")})`;
const v3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

// caption block at the top: gold time stamp, then one or two Cormorant lines (the second can be the gold key line)
const Lines: React.FC<{ eyebrow?: React.ReactNode; a?: string; b?: string; fromA?: number; fromB?: number; gold?: boolean }> = ({ eyebrow, a, b, fromA = 6, fromB = 14, gold }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 244, textAlign: "center" }}>
    {eyebrow}
    <div style={{ ...serif, marginTop: 12, fontStyle: "italic", fontSize: 84, lineHeight: 1.05 }}>
      {a && <div><SoftBlurIn text={a} from={fromA} /></div>}
      {b && <div style={{ color: gold ? GOLD : undefined }}><SoftBlurIn text={b} from={fromB} /></div>}
    </div>
  </div>
);
const Stamp: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 30, letterSpacing: "0.24em", color: GOLD, textShadow: "0 2px 10px rgba(0,0,0,.6)" }}>{text}</div>
);

// the closing research line, in the style of the kit's Fact but held inside x 230-850 and above y 1440
const Finding: React.FC<{ eyebrow: string; a: [string, string]; b: string; source: string; atA: number; atB: number }> = ({ eyebrow, a, b, source, atA, atB }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 1072, left: 230, width: 620, textAlign: "center" }}>
      <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 23, letterSpacing: "0.2em", color: GOLD, whiteSpace: "nowrap", opacity: seg(f, 4, 12), textShadow: "0 2px 10px rgba(0,0,0,.6)" }}>{eyebrow}</div>
      <div style={{ ...serif, marginTop: 14, fontSize: 62, lineHeight: 1.04, whiteSpace: "nowrap" }}>
        <div><SoftBlurIn text={a[0]} from={atA} /></div>
        <div><SoftBlurIn text={a[1]} from={atA + 12} /></div>
      </div>
      <div style={{ ...serif, marginTop: 8, fontSize: 74, lineHeight: 1.06, fontStyle: "italic", color: GOLD, whiteSpace: "nowrap" }}><SoftBlurIn text={b} from={atB} /></div>
      <div style={{ marginTop: 16, fontFamily: "Inter", fontWeight: 500, fontSize: 22, lineHeight: 1.35, color: "rgba(246,236,220,.72)", opacity: seg(f, atB + 14, atB + 26) }}>{source}</div>
    </div>
  );
};

export const WorseAtNightVideo: React.FC = () => {
  const scene = useScene(timing as unknown as Parameters<typeof useScene>[0]);
  const { f, sc, id, lf, p, line, cue, zd } = scene;

  let content: React.ReactNode = null, cam: React.ReactNode = null, lights: React.ReactNode = <Lights kind="night" />, overlay: React.ReactNode = null;
  let bg = glow(rgba(NIGHT));
  const blinkHer = (f + 11) % 83 < 3;
  const bob: V3 = [Math.sin(f * 0.05) * 0.02, Math.sin(f * 0.09) * 0.035, 0]; // the glow never sits quite still
  const hover = (a: V3): V3 => [a[0] + bob[0], a[1] + bob[1], a[2]];

  if (id === "hook") {
    // the habit: 2am, she lies awake with her eyes on the thought hovering over the bed. Seen from the foot of the bed, then out to the bare room.
    const wAt = cue("wrecked", 44), nAt = cue("not", 100);
    const near = sp(lf - wAt, 12, 110); // it sinks a little closer
    const turn = ease(seg(lf, wAt + 18, wAt + 28)); // she turns away from it...
    const shut = lf >= wAt + 22 && lf < wAt + 42;
    const follow = ease(seg(lf, wAt + 28, wAt + 44)); // ...and it drifts round to where she is looking
    const out = ease(seg(lf, nAt - 8, sc.dur - 4));
    const op = hover(v3([-0.84, 1.5 - 0.12 * near, -0.05], [-1.2, 1.0, -0.42], follow));
    content = (
      <>
        <NightRoom night={1} />
        <Person pos={[-0.84, 0.6, 0.82]} rotX={-Math.PI / 2} pose={{ armL: [-0.22, 0.3], armR: [-0.22, 0.3], headTurn: -0.85 * turn, headTilt: lerp(0.5, 0.28, turn), eyes: shut || blinkHer ? "closed" : "open" }} />
        <Orb pos={op} r={R} k={1 + 0.25 * Math.sin(f * 0.13)} />
      </>
    );
    const k1 = easeOut(seg(lf, 0, 60));
    cam = <Cam target={v3([-0.84 - 0.1 * follow, 1.05, -0.5], [-0.3, 1.2, 0], out)} d={zd(lerp(lerp(5.7, 5.1, k1), 11.0, out))} yaw={lerp(lerp(0.2, 0.1, k1), 0.34, out)} el={lerp(0.55, 0.2, out)} />;
    const c1 = 1 - seg(lf, nAt - 9, nAt - 2);
    overlay = (
      <>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 720, background: "linear-gradient(rgba(14,10,8,.98) 0%, rgba(14,10,8,.96) 66%, rgba(14,10,8,0) 100%)" }} />
        <div style={{ position: "absolute", top: 236, left: 0, right: 0, textAlign: "center" }}>
          <Stamp text="2:00 AM" />
          <div style={{ position: "relative", marginTop: 12 }}>
            <div style={{ ...serif, fontSize: 98, lineHeight: 1.0, opacity: c1 }}>
              Fine all day.<br />
              <span style={{ fontStyle: "italic", color: GOLD, display: "inline-block", opacity: lf >= wAt ? 1 : 0, transform: `scale(${1 + 0.18 * Math.max(0, 1 - (lf - wAt) / 10)})` }}>Wrecked at 2am.</span>
            </div>
            <div style={{ ...serif, position: "absolute", top: 0, left: 0, right: 0, fontSize: 98, lineHeight: 1.02 }}>
              <div><SoftBlurIn text="you’re not going" from={nAt} /></div>
              <div style={{ fontStyle: "italic", color: GOLD }}><SoftBlurIn text="backwards" from={nAt + 9} /></div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (id === "day" || id === "empties") {
    // the same room at 2pm, full; then everything pops away and only the bed, her and the thought are left
    const day = id === "day";
    const N = day ? 9999 : cue("night", 4), sAt = day ? 9999 : cue("same", 72);
    const order: Thing[] = ["sofa", "laptop", "mug", "phone", "radio", "books", "picture", "clock", "bag", "plant", "lamp", "desk", "rug", "chair"];
    const step = day ? 5 : Math.min(5, (sAt - N - 20) / (order.length - 1)); // every pop fits before "same thought"
    const at = (t: Thing) => N + 7 + order.indexOf(t) * step;
    const k = (t: Thing) => popOut(lf, at(t));
    const dropAt = at("chair") + 3; // the chair goes and she lands on the floor
    const m = day ? 0 : ease(seg(lf, N, sAt - 4));
    const fall = Math.pow(seg(lf, dropAt, dropAt + 5), 2);
    const flail = seg(lf, dropAt - 1, dropAt + 3) - ease(seg(lf, dropAt + 6, dropAt + 16));
    const typing = 1 - ease(seg(lf, at("laptop"), at("laptop") + 8));
    const ty = (ph: number) => lerp(0, -1.2 + Math.sin(f * 0.9 + ph) * 0.07, typing);
    const bump = (a: number, b: number) => ease(seg(lf, a, a + 6)) - ease(seg(lf, b, b + 6));
    const chat = day ? bump(22, 48) + bump(66, 200) : 1 - ease(seg(lf, N + 5, N + 12)); // she looks up at her friend
    const lost = day ? 0 : bump(at("mug"), at("radio")) * -0.7 + bump(at("bag"), at("lamp")) * 0.6; // looking round as things go
    const turn = ease(seg(lf, dropAt + 8, dropAt + 24));
    const land = lerp(HER[1], 0, fall) + Math.sin(seg(lf, dropAt + 5, dropAt + 12) * Math.PI) * 0.05;
    bg = glow(rgba(DAY, NIGHT, m));
    lights = (
      <>
        <Lights kind="afternoon" k={1 - m} />
        <Lights kind="night" k={m} />
      </>
    );
    content = (
      <>
        <NightRoom night={m} />
        <DayThings f={f} k={k} />
        <Person
          pos={[HER[0], land, HER[2]]}
          rotY={lerp(Math.PI / 2 - 0.15, 0.75, turn)}
          pose={{ sit: true, armL: [ty(0) - 2.0 * flail, lerp(0.14, 0.05, typing) + 0.5 * flail], armR: [ty(1.6) - 2.0 * flail, lerp(0.14, 0.05, typing) + 0.5 * flail], headTurn: lost * (1 - turn), headTilt: lerp(lerp(0.16, -0.02, chat), 0.3, turn) + (day ? Math.sin(f * 0.5) * 0.03 * chat : 0), smile: day || lf < N + 8, eyes: blinkHer ? "closed" : "open" }}
        />
        <Pop pos={[FRIEND[0], 0, FRIEND[2]]} k={popOut(lf, N + 3)}>
          <Person pos={[0, FRIEND[1], 0]} rotY={-Math.PI / 2 + 0.6} pose={{ sit: true, smile: true, armL: [-0.9, 0.1], armR: [-1.25 + Math.sin(f * 0.33) * 0.35, 0.25], headTilt: Math.sin(f * 0.27) * 0.07, headTurn: Math.sin(f * 0.13) * 0.12 }} jumper="#b9623f" skin="#e2b48f" hair="#7a4a2a" trousers="#4a3a36" bun={false} />
        </Pop>
        {/* the thought: same place, same size, same glow from 2pm to 2am */}
        <Orb pos={hover([0.68, 0.36, 0.8])} r={R} k={1 + 0.25 * Math.sin(f * 0.13)} />
      </>
    );
    const kc = day ? 0 : ease(seg(lf, 4, sc.dur - 4));
    cam = <Cam target={v3([0.15, 1.18, 0], [0.34, 0.74, 0.4], kc)} d={zd(day ? lerp(12.3, 11.6, ease(p)) : lerp(11.6, 7.0, kc))} yaw={day ? lerp(0.3, 0.25, p) : lerp(0.25, 0.2, kc)} />;
    if (day) overlay = <Lines eyebrow={<Eyebrow text="2:00 PM" />} a="in the day," b="your attention is taken" fromA={5} fromB={14} />;
    else {
      const mins = 14 * 60 + Math.round((seg(lf, N, sAt - 8) * 720) / 10) * 10, h = Math.floor(mins / 60) % 24;
      const clock = `${h % 12 || 12}:${String(mins % 60).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
      overlay = (
        <>
          {/* the camera has pushed in, so the window is behind the caption: dim it */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 600, opacity: seg(lf, sAt - 14, sAt), background: "linear-gradient(rgba(14,10,8,.94) 0%, rgba(14,10,8,.9) 68%, rgba(14,10,8,0) 100%)" }} />
          <Lines eyebrow={<Stamp text={clock} />} a="same thought." b="emptier room." fromA={sAt} fromB={sAt + 22} gold />
        </>
      );
    }
  } else if (id === "phone") {
    // dark stage: she writes it out; the thought rises behind the phone, and settles when the reply lands
    const rise = easeOut(seg(lf, 6, 30));
    const replyAt = cue("say", line(1));
    const calm = ease(seg(lf, replyAt + 16, replyAt + 40));
    const flick = lf >= replyAt + 8 && lf < replyAt + 18 ? Math.sin((lf - replyAt - 8) * 1.9) * 0.3 : 0;
    bg = glow("rgba(217,100,58,.26)", 52);
    content = <Orb pos={hover([0.02, lerp(-0.5, 0.62, rise) - 0.06 * calm, -0.3])} r={R} k={(1 + 0.25 * Math.sin(f * 0.13) + flick) * lerp(1, 0.6, calm)} />;
    cam = <Cam target={[0, 0, 0]} d={zd(4.2)} yaw={0} el={0} />;
    overlay = <PhoneUI lf={lf} replyAt={replyAt} entry="it’s 2am and i’m sure i’ll feel like this forever." reply={["What would", "2pm you say?"]} />;
  } else {
    // rest: night into dawn. She sleeps; the thought has burned down to an ember at the foot of the bed.
    const m = ease(seg(lf, 6, 130));
    const rAt = cue("result", 178);
    const down = ease(seg(lf, 0, 70));
    bg = glow(rgba(NIGHT, DAWN, m), lerp(44, 50, m));
    lights = (
      <>
        <Lights kind="night" k={1 - m} />
        <Lights kind="dawn" k={m} />
      </>
    );
    content = (
      <>
        <NightRoom night={1} dawn={m} />
        <SunPatch k={ease(seg(lf, 60, 150))} />
        <Person pos={[-0.9, 0.6, 0.82]} rotX={-Math.PI / 2} pose={{ armL: [-0.3, 0.3], armR: [-0.3, 0.3], headTurn: 0.3, headTilt: 0.5, eyes: "closed", smile: lf > 60 }} />
        <Orb pos={[-0.44, lerp(1.0, 0.93, down) + bob[1] * (1 - down), 0.74]} r={lerp(R, 0.055, down)} k={lerp(0.6, 0.3, down) + 0.06 * Math.sin(f * 0.07)} />
      </>
    );
    cam = <Cam target={[-0.5, -0.12, 0]} d={zd(lerp(12.3, 11.6, ease(p)))} yaw={lerp(0.07, -0.06, ease(p))} el={0.42} />;
    overlay = (
      <>
        <div style={{ position: "absolute", left: 0, right: 0, top: 940, height: 980, background: "linear-gradient(rgba(12,9,7,0) 0%, rgba(12,9,7,.8) 16%, rgba(12,9,7,.9) 100%)" }} />
        <Finding eyebrow="UNIVERSITY OF CHICAGO · 2011" a={["anxious students wrote", "their worries out"]} b="nearly a grade higher" source="Ramirez & Beilock, Science · 10 minutes before an exam" atA={22} atB={rAt} />
      </>
    );
  }

  return (
    <Stage bg={bg} scene={scene} scrim={id === "hook" || id === "phone" ? "none" : id === "rest" ? "bottom" : "top"} overlay={overlay}>
      {cam}
      {lights}
      {content}
    </Stage>
  );
};
