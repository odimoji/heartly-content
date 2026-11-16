// "Your glow-up has an audience of one": 3D story video (Remotion + three.js), "night to dawn" look.
// Scene lengths, line windows and cues come from src/timing/audience_of_one.json, written by vo.py from scripts/audience_of_one.json.
import { AbsoluteFill, useCurrentFrame } from "remotion";
import timing from "./timing/audience_of_one.json";
import { Bubble, Cam, Cap, CREAM, Eyebrow, GOLD, glow, Lights, PhoneUI, Rim, serif, sp, Stage, useScene, Tie } from "./kit";
import { SoftBlurIn } from "./remocn/soft-blur-in";
import { Ball, clamp01, ease, easeOut, lerp, seg, V3 } from "./three/parts";
import { Street } from "./three/sets";
import { Dumbbell, Gym, Man, NightBedroom, OnBody, OnHand, Phone3D, PizzaBox, PizzaSlice, Rig, SaladTable, Sparkle, Tripod } from "./three/sets_audience_of_one";
import { Worry } from "./three/Worry";

const BG: Record<string, string> = {
  hook: glow("rgba(232,150,80,.34)"), list: glow("rgba(232,160,90,.36)"),
  views: glow("rgba(217,100,58,.20)"), phone: glow("rgba(217,100,58,.26)", 52),
  run: glow("rgba(244,160,100,.46)", 50),
};

const pop = (t: number, at: number, w = 3) => Math.max(0, 1 - Math.abs(t - at) / w);
const mix3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const SH: V3 = [0.36, 1.04, 0]; // where Worry stands on his shoulder
const R = 0.15;

// ---------- DOM pieces (frames count from the start of their scene) ----------
const Chip: React.FC<{ x: number; y: number; from: number; size?: number; children: React.ReactNode }> = ({ x, y, from, size = 36, children }) => {
  const f = useCurrentFrame();
  if (f < from) return null;
  const k = sp(f - from, 11, 190);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${k})`, display: "flex", alignItems: "center", gap: 14, background: "#17120e", border: "3px solid rgba(233,220,198,.9)", borderRadius: 999, padding: "12px 32px", fontFamily: "Inter", fontWeight: 600, fontSize: size, color: "#efe4d2", whiteSpace: "nowrap", boxShadow: "0 10px 30px rgba(0,0,0,.5), 0 0 60px rgba(217,100,58,.18)" }}>
      {children}
    </div>
  );
};

const VIEWERS: [string, string, string][] = [["mum", "#d9b26a", "2h"], ["dave from work", "#b5654a", "3h"], ["gym_dan", "#d9643a", "3h"], ["aunty ngozi", "#e9c9a8", "5h"], ["the barber", "#a8744f", "6h"]];
// the story-viewers list, in the same dark style as the Heartly phone. Each pull drags the list down and lets it spring back: nothing changes.
const ViewersCard: React.FC<{ lf: number; pulls: number[] }> = ({ lf, pulls }) => {
  const k = sp(lf - 6, 16, 120);
  let off = 0;
  for (const at of pulls) {
    const t = lf - at;
    if (t >= 0 && t < 46) off = 78 * easeOut(seg(t, 0, 6)) * (1 - (t > 9 ? sp(t - 9, 8, 170) : 0));
  }
  return (
    <div style={{ position: "absolute", left: 200, top: 322 + (1 - k) * 160, opacity: clamp01(k * 1.4), width: 640, height: 600, borderRadius: 56, background: "#17120e", border: "6px solid #e9dcc6", boxShadow: "0 30px 90px rgba(0,0,0,.6), 0 0 120px rgba(217,100,58,.2)", padding: "30px 40px", boxSizing: "border-box", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 40, color: CREAM }}>viewers · 23</div>
        <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 22, letterSpacing: "0.2em", color: "#9c8e80" }}>STORY 9</div>
      </div>
      <div style={{ marginTop: 20, height: 2, background: "rgba(233,220,198,.16)" }} />
      <div style={{ position: "relative", height: 440, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: 20, width: 34, height: 34, marginLeft: -21, borderRadius: "50%", border: "4px solid rgba(217,178,106,.25)", borderTopColor: GOLD, transform: `rotate(${lf * 26}deg)`, opacity: clamp01((off - 10) / 40) }} />
        <div style={{ transform: `translateY(${off}px)` }}>
          {VIEWERS.map(([name, c, ago]) => (
            <div key={name} style={{ height: 84, display: "flex", alignItems: "center", gap: 22, borderBottom: "2px solid rgba(233,220,198,.07)" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter", fontWeight: 600, fontSize: 26, color: "#2a2420" }}>{name[0]}</div>
              <div style={{ flex: 1, fontFamily: "Inter", fontWeight: 500, fontSize: 36, color: "#efe4d2" }}>{name}</div>
              <div style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 24, color: "#9c8e80" }}>{ago}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// the closing research line, in the style of the kit's Fact, kept inside x 60-850 and above y 1440
const Study: React.FC<{ at1: number; at2: number }> = ({ at1, at2 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 1166, left: 60, right: 230, textAlign: "center" }}>
      <div style={{ whiteSpace: "nowrap" }}><Eyebrow text="UCLA BRAIN-SCAN STUDY · 2007" from={8} /></div>
      <div style={{ ...serif, marginTop: 14, fontSize: 62, lineHeight: 1.06, whiteSpace: "nowrap" }}><SoftBlurIn text="putting a feeling into words" from={at1} /></div>
      <div style={{ ...serif, marginTop: 4, fontSize: 70, lineHeight: 1.06, fontStyle: "italic", color: GOLD, whiteSpace: "nowrap" }}><SoftBlurIn text="turned down the brain’s alarm" from={at2} /></div>
      <div style={{ marginTop: 18, fontFamily: "Inter", fontWeight: 500, fontSize: 24, color: "rgba(246,236,220,.7)", opacity: seg(f, at2 + 14, at2 + 26) }}>Lieberman et al., Psychological Science</div>
    </div>
  );
};

// ---------- the video ----------
export const AudienceOfOneVideo: React.FC = () => {
  const scene = useScene(timing as unknown as Parameters<typeof useScene>[0]);
  const { f, id, lf, p, line, lineEnd, cue, talk, zd } = scene;

  let content: React.ReactNode = null, cam: React.ReactNode = null, lights: React.ReactNode = <Lights kind="dinner" />, overlay: React.ReactNode = null;
  let scrim: "top" | "bottom" | "none" = "top";

  if (id === "hook") {
    // the habit: he poses for the story selfie. We open inside the mirror and hold there for two seconds,
    // then pull back to find him, the gym corner, and Worry on his shoulder.
    const notAt = cue("not", 108);
    const drop = ease(seg(lf, notAt - 2, notAt + 14)); // the pose goes when "she's not watching" lands
    const pose2 = ease(seg(lf, 24, 34)); // second pose inside the close-up: chin up, phone a little higher
    const turn2 = ease(seg(lf, 62, 76));
    const flash = Math.max(pop(lf, 5), pop(lf, 36), pop(lf, 88));
    const flexK = 1 - drop;
    const again = ease(seg(lf, notAt + 36, notAt + 52));
    const rig: Rig = {
      pos: [-0.5, 0, 0.1], rotY: Math.PI + lerp(-0.58, 0.1, turn2),
      pose: { armL: [0, lerp(0.14, 1.62, flexK)], armR: [lerp(-0.95 - 0.3 * again, -1.95 - 0.12 * pose2, flexK), lerp(0.12, 0.32, flexK)], headTurn: lerp(lerp(0.1, -0.1, pose2), -0.08, turn2) * flexK + 0.35 * ease(seg(lf, notAt + 26, notAt + 36)) * (1 - again), headTilt: -0.1 * pose2 * flexK + 0.34 * drop - 0.12 * again, smile: drop < 0.5 },
    };
    const cheer = pop(lf, 9, 5) + pop(lf, 40, 5) + pop(lf, 92, 5) + pop(lf, notAt + 32, 5) + pop(lf, notAt + 44, 5); // he bounces at every flash, then nudges him to go again
    const actors = (
      <>
        <Man {...rig} kit="gym" flex={flexK} pump={Math.max(0, Math.sin(lf * 0.45))} />
        <OnHand {...rig} side={-1} upright>
          <Phone3D pos={[0, 0.11, 0.03]} rot={[lerp(0.55, 0.08, flexK), Math.PI, 0]} flash={flash} s={1.15} />
        </OnHand>
        <OnBody {...rig}>
          <Worry pos={SH} r={R} f={f} rotY={lerp(-0.5, 0.15, flexK)} look={drop > 0.5 ? [-0.7, lf > notAt + 26 ? 0.1 : -0.5] : [-0.3, 0.1]} mood={drop > 0.5 && lf < notAt + 28 ? "neutral" : "smug"} hop={cheer * 0.05} squash={cheer * 0.1} wave={flexK > 0.5 ? 1 : 0} seed={1} />
          <Rim pos={SH} r={R} />
        </OnBody>
      </>
    );
    content = <Gym f={f}>{actors}</Gym>;
    const hold = seg(lf, 0, 56), k1 = ease(seg(lf, 56, 92)), k2 = ease(seg(lf, 84, notAt + 32));
    const t = mix3(mix3([-0.66, 1.38, -2.12], [-0.16, 1.15, -0.4], k1), [-0.08, 1.08, -0.05], k2);
    cam = <Cam target={t} d={zd(lerp(lerp(lerp(5.75, 5.3, hold), 9.4, k1), 11.3, k2))} yaw={lerp(lerp(lerp(0.62, 0.59, hold), 0.34, k1), 0.26, k2)} el={lerp(lerp(0.09, 0.17, k1), 0.19, k2)} />;
    scrim = "none";
    overlay = (
      <>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 640, background: "linear-gradient(rgba(14,10,8,.98) 0%, rgba(14,10,8,.96) 62%, rgba(14,10,8,0) 100%)" }} />
        <div style={{ position: "absolute", top: 236, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 30, letterSpacing: "0.24em", color: GOLD }}>DAY 41</div>
          <div style={{ position: "relative", marginTop: 12 }}>
            <div style={{ ...serif, fontSize: 98, lineHeight: 1.0, opacity: 1 - seg(lf, notAt - 9, notAt - 2) }}>
              Your glow-up has<br />
              <span style={{ fontStyle: "italic", color: GOLD, display: "inline-block", transform: `scale(${1 + 0.18 * Math.max(0, 1 - lf / 10)})` }}>an audience of one.</span>
            </div>
            <div style={{ ...serif, position: "absolute", top: 0, left: 0, right: 0, fontSize: 98, lineHeight: 1.0 }}>
              <SoftBlurIn text="she’s" from={notAt - 2} /><br />
              <SoftBlurIn text="not watching." from={notAt + 2} style={{ fontStyle: "italic", color: GOLD }} />
            </div>
          </div>
        </div>
      </>
    );
  } else if (id === "list") {
    // three quick beats, one per story
    const hA = cue("hair", 31), sA = cue("salad", 61);
    const beat = lf < hA ? 0 : lf < sA ? 1 : 2;
    let actors: React.ReactNode = null;
    if (beat === 0) {
      const curl = 0.5 - 0.5 * Math.cos(lf * 0.43);
      const rig: Rig = { pos: [-0.25, 0, 0.15], rotY: 0.32, pose: { armR: [-0.3 - 1.8 * curl, 0.14], armL: [0.12, 0.5], smile: true, headTurn: 0.12, headTilt: -0.06 * curl } };
      actors = (
        <>
          <Man {...rig} kit="gym" />
          <OnHand {...rig} side={-1}><Dumbbell pos={[0, -0.02, 0]} /></OnHand>
          <OnBody {...rig}>
            <Worry pos={SH} r={R} f={f} rotY={-0.3} look={[-0.6, -0.2]} mood="smug" hop={curl * 0.05} squash={curl * 0.08} wave={1} seed={1} />
            <Rim pos={SH} r={R} />
          </OnBody>
          <Tripod pos={[0.72, 0, 0.72]} rotY={0.9} flash={pop(lf, 20, 3)} />
        </>
      );
      cam = <Cam target={[0.12, 1.0, 0.2]} d={zd(lerp(8.4, 7.7, seg(lf, 0, hA)))} yaw={lerp(0.36, 0.32, seg(lf, 0, hA))} />;
    } else if (beat === 1) {
      const b = lf - hA;
      const rig: Rig = { pos: [-0.15, 0, 0.15], rotY: 0.25, pose: { armR: [-2.05, 0.4], smile: true, headTurn: 0.65 * Math.sin(b * 0.2 + 0.5), headTilt: -0.05 } };
      actors = (
        <>
          <Man {...rig} kit="gym" cut={Math.min(1.25, sp(b - 1, 9, 170))} />
          <OnHand {...rig} side={-1} upright><Phone3D pos={[0, 0.1, 0.03]} rot={[0.1, Math.PI, 0]} flash={pop(b, 12, 3)} /></OnHand>
          <OnBody {...rig}>
            <Worry pos={SH} r={R} f={f} rotY={-0.5} look={[-0.6, 0.8]} mood="happy" hop={pop(b, 5, 5) * 0.05} seed={1} />
            <Rim pos={SH} r={R} />
          </OnBody>
          {[[-0.52, 1.84, 0.3], [0.14, 2.02, 0.25], [-0.44, 1.42, 0.42], [-0.02, 2.08, 0.3]].map((q, i) => (
            <Sparkle key={i} pos={[q[0], q[1], q[2]]} s={Math.max(0, Math.sin((b - 1 - i * 4) * 0.3)) * (b > 1 + i * 4 ? 1 : 0)} />
          ))}
          <pointLight position={[0.7, 1.7, 1.9]} color="#ffe2bd" intensity={7} distance={5} decay={1.5} />
          {/* the clippings */}
          {Array.from({ length: 9 }).map((_, i) => {
            const t = b - 1 - (i % 3) * 2, a = i * 2.4;
            if (t < 0) return null;
            const y = 1.7 + t * 0.03 - t * t * 0.0042;
            return y < 0.03 ? null : <Ball key={i} pos={[-0.15 + Math.cos(a) * (0.3 + t * 0.008), y, 0.15 + Math.sin(a) * 0.3]} r={0.03 + (i % 2) * 0.012} c="#1f1613" scale={[1.4, 0.6, 1]} />;
          })}
        </>
      );
      cam = <Cam target={[-0.06, 1.27, 0.15]} d={lerp(5.4, 4.9, seg(b, 0, sA - hA))} yaw={lerp(0.14, 0.22, seg(b, 0, sA - hA))} el={0.12} />;
    } else {
      const b = lf - sA;
      const bite = ease(seg(b, 30, 40));
      const rig: Rig = { pos: [-0.15, 0, 0.3], rotY: Math.PI / 2 - 0.3, pose: { armL: [-1.72, 0.0], armR: [lerp(0.7, -2.2, bite), lerp(0.25, -0.1, bite)], headTilt: 0.16 - 0.1 * bite, headTurn: -0.5 * bite, smile: bite < 0.5 } };
      actors = (
        <>
          <Man {...rig} kit="gym" cut={1} />
          <OnHand {...rig} side={1} upright><Phone3D pos={[0, 0.03, 0.06]} rot={[-Math.PI / 2 + 0.5, 0, 0]} /></OnHand>
          <OnHand {...rig} side={-1}><PizzaSlice pos={[0, -0.26, 0]} rot={[-Math.PI / 2, 0, -Math.PI / 2]} s={1.1} /></OnHand>
          <SaladTable pos={[0.5, 0, 0.3]} lit={pop(b, 14, 3)} />
          <PizzaBox pos={[-0.82, 0, 0.5]} rotY={0.5} />
          <Worry pos={[-0.62, 0, 0.92]} r={R} f={f} rotY={0.9} look={[0.6, 0.6]} mood="smug" hop={Math.abs(Math.sin(b * 0.3)) * 0.06} squash={Math.abs(Math.sin(b * 0.3)) * 0.08} seed={1} />
          <Rim pos={[-0.62, 0, 0.92]} r={R} />
        </>
      );
      cam = <Cam target={[-0.08, 0.92, 0.3]} d={zd(lerp(9.0, 8.4, ease(seg(b, 0, 60))))} yaw={lerp(0.2, 0.27, seg(b, 0, 60))} />;
    }
    content = <Gym f={f} bench={beat < 2}>{actors}</Gym>;
    overlay = <Cap eyebrow={["MONDAY", "WEDNESDAY", "FRIDAY"][beat]} text={["the gym.", "the haircut.", "a salad he didn’t eat."][beat]} from={[cue("gym", 4), hA, sA][beat]} />;
  } else if (id === "views") {
    // 1:12 AM: in bed, lit by the phone, checking who has watched. One refresh, nothing changes, and it lands.
    const S = cue("say", 63), pullAt = S + 3;
    const land = ease(seg(lf, S + 18, S + 42)); // the list goes, the glow drops, the camera comes in
    const swipe = pop(lf, 14, 5) + pop(lf, pullAt + 1, 5);
    const rig: Rig = {
      pos: [-0.8, 0.47, -0.52], rotY: 0.3,
      pose: { sit: true, armL: [-1.2 + 0.3 * land, -0.3], armR: [-1.2 + 0.3 * land - 0.14 * swipe, -0.3], headTilt: 0.2 + 0.16 * land, eyes: lf > S + 46 ? "closed" : "open" },
    };
    const hop = lf >= S ? Math.abs(Math.sin((lf - S) * 0.5)) * Math.max(0, 1 - (lf - S) / 20) : 0;
    const speaking = lf >= S && lf <= lineEnd(1) + 2;
    const wp: V3 = [lerp(-0.34, -0.42, land), 1.045, -0.95];
    lights = <Lights kind="night" k={0.5} />;
    content = (
      <>
        <NightBedroom />
        <Man {...rig} kit="bed" cut={1} />
        <OnBody {...rig}>
          <Phone3D pos={[0, 0.82 - 0.12 * land, 0.43]} rot={[0.75 + 0.45 * land, Math.PI, 0]} glow={1 - 0.75 * land} />
          <pointLight position={[0, 1.02, 0.52]} color="#ffe9c8" intensity={3.2 * (1 - 0.55 * land)} distance={2.4} decay={1.4} />
        </OnBody>
        {/* his mouth only opens in the neutral/shock faces, so the smirk drops while he speaks */}
        <Worry pos={wp} r={R} f={f} rotY={lerp(-0.25, -0.75, land)} look={[lerp(-0.6, -0.85, land), lerp(-0.5, 0.05, land)]} mood={speaking ? "shock" : lf < S ? "smug" : land > 0.5 ? "sad" : "neutral"} talk={talk(speaking)} hop={hop * 0.13} squash={hop * 0.16} seed={1} />
        <Rim pos={wp} r={R} />
      </>
    );
    const k0 = ease(seg(lf, 0, S + 18));
    cam = <Cam target={[lerp(lerp(-0.36, -0.42, k0), -0.64, land), lerp(1.78, 1.47, land), lerp(-0.3, -0.5, land)]} d={zd(lerp(lerp(8.9, 8.3, k0), lerp(6.5, 6.2, seg(lf, S + 42, 119)), land))} yaw={lerp(lerp(0.34, 0.29, k0), 0.24, land)} el={lerp(0.19, 0.15, land)} />;
    const out = seg(lf, S + 15, S + 21);
    overlay = (
      <>
        <div style={{ opacity: 1 - out }}>
          <Cap eyebrow="1:12 AM" />
          <ViewersCard lf={lf} pulls={[pullAt]} />
          <Bubble text="check again!" from={S} x={640} y={1062} tail="right" />
        </div>
        {lf >= S + 20 && <div style={{ opacity: seg(lf, S + 20, S + 26) }}><Cap eyebrow="41 DAYS" text="it’s never her." from={S + 21} /></div>}
      </>
    );
  } else if (id === "phone") {
    const peek = easeOut(seg(lf, 8, 28));
    const replyAt = cue("say", line(1));
    const react = lf >= replyAt + 20;
    const wp: V3 = [0, lerp(-1.9, 0.1, peek) + (react ? 0.06 : 0), -0.5];
    lights = <Lights kind="night" />;
    content = (
      <>
        <Worry pos={wp} r={0.5} f={f} rotY={0} look={[0, -0.85]} mood={react ? "shock" : "neutral"} seed={0} />
        <Rim pos={[wp[0], wp[1], wp[2] - 0.2]} r={0.5} />
      </>
    );
    cam = <Cam target={[0, 0, 0]} d={zd(lerp(6.1, 5.9, ease(p)))} yaw={0} el={0} />;
    scrim = "none";
    overlay = <PhoneUI lf={lf} replyAt={replyAt} entry="everything i post is for one person." reply={["What do you want", "her to see?"]} />;
  } else {
    // run: dawn street. He jogs with empty hands and Worry rides in his pocket; the research line closes it.
    const resAt = cue("result", 131), F = cue("fact", 8);
    const stopAt = resAt + 6;
    const jog = lf < stopAt;
    const xk = seg(lf, -12, stopAt);
    const x = lerp(-1.15, 0.3, 1 - Math.pow(1 - xk, 1.35));
    const ph = (lf - stopAt) * 0.6;
    const sw = jog ? Math.sin(ph) : 0, bounce = jog ? Math.abs(Math.cos(ph)) : 0;
    const glance = ease(seg(lf, 44, 56)) - ease(seg(lf, 80, 92)); // he checks on his passenger mid-run
    const turn = ease(seg(lf, stopAt, stopAt + 22));
    const breath = !jog ? Math.sin((lf - stopAt) * 0.32) * 0.05 * Math.max(0.3, 1 - (lf - stopAt) / 80) : 0;
    const look = Math.max(glance, ease(seg(lf, stopAt + 10, stopAt + 24)));
    const pk = <Worry pos={[0, -0.05 + bounce * 0.035, 0.05]} r={0.13} f={f} legs={false} mood="happy" wave={1} look={look > 0.5 ? [-0.2, 0.7] : [0.3, 0.3]} squash={bounce * 0.1 - 0.03} seed={2} />;
    const rig: Rig = {
      pos: [x, 0, 0.18], rotY: Math.PI / 2 - turn * 0.78,
      pose: { walk: jog ? ph : 0, smile: true, pocket: pk, headTurn: -0.5 * look, headTilt: 0.14 * look + breath, armR: [0.25 + sw * 0.25, 0.55], armL: jog ? undefined : [0.08 + breath, 0.36 * ease(seg(lf, stopAt, stopAt + 10))] },
    };
    lights = <Lights kind="dawn" />;
    content = (
      <>
        <Street />
        <Man {...rig} kit="run" cut={1} band />
      </>
    );
    const kIn = ease(seg(lf, 20, resAt)), kA = ease(seg(lf, stopAt - 6, stopAt + 34)), drift = seg(lf, stopAt, 222);
    cam = <Cam target={[lerp(x * 0.8 + 0.08, x + 0.1, kA), lerp(lerp(0.66, 0.9, kIn), 0.8, kA), lerp(0.15, 0.3, kA)]} d={zd(lerp(lerp(8.4, 6.7, kIn), lerp(6.0, 5.7, drift), kA))} yaw={lerp(0.26, 0.15, kA)} el={lerp(0.16, 0.12, kA)} />;
    scrim = "none";
    const topK = 1 - seg(lf, resAt - 34, resAt - 24), botK = seg(lf, 0, 10);
    overlay = (
      <>
        <AbsoluteFill style={{ opacity: topK, background: "linear-gradient(rgba(12,9,7,.9) 0%, rgba(12,9,7,.7) 20%, rgba(12,9,7,0) 34%)" }} />
        <AbsoluteFill style={{ opacity: botK, background: "linear-gradient(rgba(12,9,7,0) 48%, rgba(12,9,7,.82) 64%, rgba(12,9,7,.95) 100%)" }} />
        <div style={{ opacity: topK }}>
          <Cap eyebrow="6:40 AM" />
          <Chip x={540} y={352} from={14} size={40}>stories posted: <span style={{ color: GOLD, marginLeft: -4 }}>0</span></Chip>
        </div>
        <Tie a="once the feeling had words," b="the checking went quiet." from={cue("tie", 8)} until={F} style={{ top: 1180, left: 60, right: 230, fontSize: 66 }} />
        <div style={{ opacity: seg(lf, F - 4, F + 4) }}><Study at1={F + 68} at2={resAt} /></div>
      </>
    );
  }

  return (
    <Stage bg={BG[id]} scene={scene} scrim={scrim} overlay={overlay}>
      {cam}
      {lights}
      {content}
    </Stage>
  );
};
