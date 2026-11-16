// "Your worry takes notes in every meeting. Bad ones.": 3D story video (Remotion + three.js), Worry series.
// Worry sits on the meeting table next to her and passes her notes: "they saw you yawn", "say something", "not that!".
// Turn: at lunch she types the notes into Heartly. Close: the next morning, same room, she is the one talking.
// Scene lengths, line windows and cues come from src/timing/worry_meeting.json, written by vo.py from scripts/worry_meeting.json.
import timing from "./timing/worry_meeting.json";
import { useFontsReady } from "./fonts";
import { Eyebrow, GOLD, glow, Lights, PhoneUI, serif, sp, Stage, Cam, useScene } from "./kit";
import { SoftBlurIn } from "./remocn/soft-blur-in";
import { clamp01, ease, easeOut, lerp, seg, V3 } from "./three/parts";
import { MeetingRoom, MiniPad, Note, Notepad, Pencil, TABLE_Y, WorryArm } from "./three/sets_worry_meeting";
import { Person, Pose, Woman } from "./three/Woman";
import { Mood, Worry } from "./three/Worry";

const DAY = glow("rgba(230,170,110,.3)", 48), DAWN = glow("rgba(240,150,100,.42)", 50);
const BG: Record<string, string> = { hook: DAY, notes: DAY, phone: glow("rgba(217,100,58,.26)", 52), rest: DAWN };

const mix3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const pop = (t: number, at: number, w = 4) => Math.max(0, 1 - Math.abs(t - at) / w);
// Worry's violet, kept small and on his far side so it stays on his coat and off her face
const Rim: React.FC<{ pos: V3; r: number }> = ({ pos, r }) => <pointLight color="#a98bff" position={[pos[0] + r * 1.5, pos[1] + r * 2.2, pos[2] - r * 1.4]} intensity={5.5 * r} distance={r * 4.4} decay={1.6} />;

// where everyone is
const SEAT_Y = 0.47, SEAT_Z = -0.56;
const HER_X = 0.6;
const WP: V3 = [1.12, TABLE_Y, 0.0]; // Worry, on the table beside her
const WR = 0.17;
const PAD: V3 = [WP[0] - 0.08, TABLE_Y, WP[2] + 0.36];
const SPOT: V3 = [0.62, TABLE_Y, 0.42]; // where a passed note lands, in front of her
const PILE: V3[] = [[0.27, TABLE_Y, 0.52], [0.33, TABLE_Y, 0.32]]; // where the old ones get pushed

// the two colleagues: they watch the chart, and look round at her when she moves
const Colleagues: React.FC<{ f: number; at: number }> = ({ f, at }) => (
  <>
    <Person pos={[-0.5, SEAT_Y, SEAT_Z]} bun={false} jumper="#ead9bd" skin="#7a5640" hair="#2b1f1b" pose={{ sit: true, armL: [-1.0, 0.1], armR: [-1.0, 0.1], headTurn: lerp(-0.7, 0.75, at), headTilt: 0.04 * Math.sin(f * 0.07) }} />
    <Person pos={[0.04, SEAT_Y, SEAT_Z]} jumper="#b5654a" skin="#c08a62" hair="#4a2e20" pose={{ sit: true, armL: [-1.0, 0.1], armR: [-1.0, 0.1], headTurn: lerp(-0.6, 0.8, at), headTilt: 0.04 * Math.sin(f * 0.06 + 1) }} />
  </>
);

// Worry writing on his little pad: the pencil tip scribbles, his arm follows it
const Scribble: React.FC<{ lf: number; on: number }> = ({ lf, on }) => {
  const tip: V3 = [PAD[0] + 0.045 * Math.sin(lf * 1.15) * on, TABLE_Y + 0.022 + 0.05 * (1 - on), PAD[2] + 0.035 * Math.sin(lf * 1.8 + 1) * on];
  const hand: V3 = [tip[0] + 0.03, tip[1] + 0.1, tip[2] - 0.05];
  return (
    <>
      <MiniPad pos={PAD} rotY={-0.2} s={0.85} />
      <Pencil tip={tip} dir={[0.03, 0.1, -0.05]} len={0.15} />
      <WorryArm wp={WP} r={WR} hand={hand} />
    </>
  );
};

const NOTES: string[][] = [["they saw", "you yawn."], ["say", "something."], ["not that!"]];

export const WorryMeetingVideo: React.FC = () => {
  const scene = useScene(timing as unknown as Parameters<typeof useScene>[0]);
  const fonts = useFontsReady();
  const { f, id, lf, p, line, cue, talk, zd } = scene;

  let content: React.ReactNode = null, lights: React.ReactNode = <Lights kind="morning" />, overlay: React.ReactNode = null;
  let c: { target: V3; d: number; yaw: number; el: number } = { target: [0.7, 1.1, 0.05], d: 6, yaw: 0.2, el: 0.17 };
  let scrim: "top" | "none" = "top";

  if (id === "hook") {
    // the habit: she is in the meeting, and he is on the table next to her, writing everything down
    const bad = cue("bad", 115);
    const wide = ease(seg(lf, 28, 74));
    const push = ease(seg(lf, bad - 6, bad + 14));
    const writing = 1 - ease(seg(lf, bad - 12, bad - 4));
    const glance = pop(lf, 22, 7) + pop(lf, 70, 9); // he checks on her, then goes back to the pad
    const herLook = ease(seg(lf, 84, 98)) - ease(seg(lf, bad + 6, bad + 16)); // she catches him at it
    const noteK = sp(lf - bad, 11, 180);
    const pose: Pose = { sit: true, armL: [-1.0, 0.08], armR: [-1.0, 0.08], headTurn: lerp(-0.55, 0.6, herLook), headTilt: 0.06 + 0.32 * ease(seg(lf, bad + 8, bad + 20)) };
    content = (
      <MeetingRoom f={f}>
        <Colleagues f={f} at={0} />
        <Woman pos={[HER_X, SEAT_Y, SEAT_Z]} pose={pose} />
        <Notepad pos={[HER_X - 0.02, TABLE_Y, 0.02]} rotY={0.08} />
        <Worry pos={WP} r={WR} f={f} rotY={-0.35} look={glance > 0.3 ? [-0.9, 0.25] : lf >= bad ? [-0.2, 0.1] : [-0.25, -0.85]} mood={lf >= bad - 4 ? "smug" : "neutral"} squash={0.05 * Math.abs(Math.sin(lf * 0.6)) * writing} seed={2} />
        <Rim pos={WP} r={WR} />
        <Scribble lf={lf} on={writing * (1 - 0.7 * clamp01(glance))} />
        <Note pos={mix3(PAD, [0.9, TABLE_Y, 0.44], easeOut(clamp01(noteK)))} rotY={0.12} lines={["you blinked", "weird."]} fonts={fonts} s={1.35 * clamp01(noteK)} tilt={0.5} />
      </MeetingRoom>
    );
    const close: V3 = [WP[0] - 0.06, 1.12, 0.16], full: V3 = [0.72, 1.3, 0.05];
    c = {
      target: mix3(mix3(close, full, wide), [0.9, 1.22, 0.2], push),
      d: zd(lerp(lerp(lerp(2.9, 3.2, seg(lf, 0, 30)), 5.7, wide), 4.3, push)),
      yaw: lerp(lerp(0.12, 0.22, wide), 0.14, push), el: lerp(0.2, 0.17, wide),
    };
    scrim = "none";
    overlay = (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 640, paddingTop: 236, boxSizing: "border-box", textAlign: "center", background: "linear-gradient(rgba(14,10,8,.98) 0%, rgba(14,10,8,.95) 72%, rgba(14,10,8,0) 100%)" }}>
        <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 30, letterSpacing: "0.24em", color: GOLD }}>10:15 AM · THE MEETING</div>
        <div style={{ ...serif, marginTop: 12, fontSize: 92, lineHeight: 1.0, transform: `scale(${1 + 0.1 * Math.max(0, 1 - lf / 9)})` }}>Your worry takes notes</div>
        <div style={{ ...serif, marginTop: 2, fontSize: 92, lineHeight: 1.0 }}>in every meeting.</div>
        <div style={{ ...serif, marginTop: 8, fontSize: 86, lineHeight: 1.0, fontStyle: "italic", color: GOLD }}><SoftBlurIn text="bad ones." from={bad} /></div>
      </div>
    );
  } else if (id === "notes") {
    // he passes her three, in his own voice. She tries to follow them.
    const n = [cue("n1", 4), cue("n2", 41), cue("n3", 80)];
    const beat = lf < n[1] ? 0 : lf < n[2] ? 1 : 2;
    const read = pop(lf, n[0] + 12, 9); // she looks down at the first one
    const dart = Math.sin((lf - n[0] - 20) * 0.5) * (lf > n[0] + 20 && lf < n[1] ? 1 : 0); // then round the room: did they?
    const up = sp(lf - n[1] - 10, 12, 170) * (1 - ease(seg(lf, n[2] + 2, n[2] + 10))); // hand up, half out of her chair
    const sink = ease(seg(lf, n[2] + 4, n[2] + 22));
    const speaking = (lf >= n[0] && lf < n[0] + 30) || (lf >= n[1] && lf < n[1] + 26) || (lf >= n[2] && lf < n[2] + 20);
    const mood: Mood = beat === 2 ? "shock" : speaking ? "neutral" : "smug";
    const hop = beat === 2 ? Math.abs(Math.sin(Math.min(1, (lf - n[2]) / 14) * Math.PI * 2)) * 0.08 : 0;
    const pose: Pose = {
      sit: true,
      armL: [lerp(-1.0, -1.15, sink), 0.08],
      armR: [lerp(-1.0, -2.75, up), lerp(0.08, 0.18, up)],
      headTurn: 0.5 * dart * (1 - up) + 0.35 * read - 0.3 * up,
      headTilt: 0.05 + 0.3 * read - 0.1 * up + 0.45 * sink,
    };
    content = (
      <MeetingRoom f={f} herChair={0.12 * up}>
        <Colleagues f={f} at={ease(seg(lf, n[1] + 16, n[1] + 28))} />
        <Woman pos={[HER_X, SEAT_Y + 0.1 * up - 0.05 * sink, SEAT_Z]} pose={pose} />
        <Notepad pos={[HER_X - 0.02, TABLE_Y, 0.0]} rotY={0.08} />
        <Worry pos={WP} r={WR} f={f} rotY={-0.5} look={beat === 2 ? [-0.5, 0.2] : [-0.8, 0.1]} mood={mood} talk={talk(speaking)} hop={hop} squash={hop * 1.2} seed={2} />
        <Rim pos={WP} r={WR} />
        <MiniPad pos={PAD} rotY={-0.2} s={0.85} />
        {NOTES.map((lines, i) => {
          if (lf < n[i]) return null;
          const k = easeOut(seg(lf, n[i], n[i] + 9));
          const gone = i < 2 && lf >= n[i + 1] ? easeOut(seg(lf, n[i + 1] - 1, n[i + 1] + 8)) : 0; // pushed aside by the next one
          const pos = mix3(mix3(PAD, SPOT, k), PILE[i] ?? SPOT, gone);
          return <Note key={i} pos={[pos[0], pos[1] + 0.004 * i, pos[2]]} rotY={lerp(0.06, i ? -0.5 : 0.55, gone)} lines={lines} fonts={fonts} s={lerp(lerp(0.5, 1.6, k), 0.75, gone)} tilt={0.5} />;
        })}
        {/* his arm goes out with each note, then comes back */}
        {(() => {
          const k = easeOut(seg(lf, n[beat], n[beat] + 9)), back = ease(seg(lf, n[beat] + 10, n[beat] + 20));
          const reach = mix3(PAD, SPOT, k * 0.55);
          const rest: V3 = [WP[0] - 0.16, TABLE_Y + 0.12, WP[2] + 0.16];
          return <WorryArm wp={WP} r={WR} hop={hop} hand={mix3([reach[0] + 0.05, TABLE_Y + 0.1, reach[2] - 0.02], rest, back)} />;
        })()}
      </MeetingRoom>
    );
    c = { target: [0.72, 1.2 + 0.04 * up, 0.12], d: zd(lerp(5.2, 4.75, ease(p)) - 0.12 * pop(lf, n[2] + 3, 5)), yaw: lerp(0.2, 0.14, p), el: 0.17 };
    overlay = (
      <div style={{ position: "absolute", left: 0, right: 0, top: 244, textAlign: "center" }}><Eyebrow text="10:15 AM · THE MEETING" from={0} /></div>
    );
  } else if (id === "phone") {
    // the turn: lunch. She types his three notes out; behind the phone they drift, then come together as one.
    const replyAt = cue("say", line(1));
    const one = ease(seg(lf, replyAt + 6, replyAt + 34));
    const from: V3[] = [[-0.78, 0.55, -0.9], [0.8, 0.1, -1.1], [-0.74, -0.85, -0.8]];
    lights = (
      <>
        <hemisphereLight args={["#8a6a52", "#1c1410", 0.6]} />
        <pointLight position={[0, 0.6, 2.2]} color="#ffcf9e" intensity={9} distance={9} decay={1.5} />
        <pointLight position={[0, -0.2, -2.2]} color="#d9643a" intensity={5} distance={5} decay={1.5} />
      </>
    );
    content = (
      <>
        {NOTES.map((lines, i) => {
          const drift: V3 = [from[i][0] + 0.04 * Math.sin(f * 0.03 + i * 2), from[i][1] + 0.06 * Math.sin(f * 0.024 + i * 1.3), from[i][2]];
          const to: V3 = [(i - 1) * 0.05, 1.02 + i * 0.012, -0.5 + i * 0.03];
          return (
            <group key={i} rotation={[0, 0, lerp((i - 1) * 0.22 + 0.06 * Math.sin(f * 0.02 + i), (i - 1) * 0.07, one)]}>
              <Note pos={mix3(drift, to, one)} rotY={lerp((i - 1) * -0.35, 0, one)} lines={lines} fonts={fonts} s={lerp(1.25, 1.05, one)} tilt={0.1} flat={false} />
            </group>
          );
        })}
      </>
    );
    c = { target: [0, 0, 0], d: zd(lerp(6.15, 5.85, ease(p))), yaw: 0.04 * Math.sin(lf * 0.02), el: 0 };
    scrim = "none";
    overlay = (
      <>
        <div style={{ position: "absolute", left: 0, right: 0, top: 244, textAlign: "center" }}><div style={{ opacity: 1 - seg(lf, replyAt, replyAt + 8) }}><Eyebrow text="12:30 PM · LUNCH" from={2} /></div></div>
        <PhoneUI lf={lf} replyAt={replyAt} entry="they saw me yawn. say something. not that." reply={["Are these three notes", "one fear?"]} />
      </>
    );
  } else {
    // close: the next morning, same room, early light. She is the one talking. He is small, and has started drawing instead.
    const resultAt = cue("result", 179), t0 = line(0);
    const say = Math.sin(lf * 0.16), nod = Math.max(0, Math.sin(lf * 0.11 + 1));
    const heart = seg(lf, 40, 130);
    const wr = 0.115, wp: V3 = [1.12, TABLE_Y, 0.1];
    const card: V3 = [0.88, TABLE_Y, 0.42];
    const a = heart * Math.PI * 2;
    const drawing = heart > 0 && heart < 1;
    const hand: V3 = drawing ? [card[0] + 0.06 * Math.sin(a) + 0.03, TABLE_Y + 0.13 + 0.04 * Math.cos(a), card[2] + 0.03] : [wp[0] - 0.1, TABLE_Y + 0.1, wp[2] + 0.12];
    const pose: Pose = { armL: [-0.35 + 0.08 * say, 0.3], armR: [-1.15 + 0.14 * say, 0.3 + 0.08 * Math.sin(lf * 0.09)], headTurn: -0.42 + 0.12 * Math.sin(lf * 0.05), headTilt: -0.04 + 0.03 * say, smile: true };
    lights = <Lights kind="dawn" />;
    content = (
      <MeetingRoom f={f} warm={1} hour={9} herChair={0.16}>
        <Person pos={[-0.5, SEAT_Y, SEAT_Z]} bun={false} jumper="#ead9bd" skin="#7a5640" hair="#2b1f1b" pose={{ sit: true, armL: [-1.0, 0.1], armR: [-1.0, 0.1], headTurn: 0.75, headTilt: 0.14 * nod, smile: true }} />
        <Person pos={[0.04, SEAT_Y, SEAT_Z]} jumper="#b5654a" skin="#c08a62" hair="#4a2e20" pose={{ sit: true, armL: [-1.0, 0.1], armR: [-1.0, 0.1], headTurn: 0.8, headTilt: 0.12 * Math.max(0, Math.sin(lf * 0.11 + 2.4)), smile: true }} />
        {/* standing: the table hides her legs */}
        <Woman pos={[HER_X, 0.2, SEAT_Z + 0.04]} pose={pose} />
        <Notepad pos={[HER_X - 0.02, TABLE_Y, 0.02]} rotY={0.08} />
        <Worry pos={wp} r={wr} f={f} rotY={-0.45} look={drawing ? [-0.5, -0.6] : [-0.7, 0.5]} mood="happy" seed={2} />
        <Rim pos={wp} r={wr} />
        <Note pos={card} rotY={0.1} fonts={fonts} s={1.15} tilt={0.5} heart={heart} />
        <WorryArm wp={wp} r={wr} hand={hand} />
        {drawing && <Pencil tip={[hand[0] - 0.03, hand[1] - 0.05, hand[2] + 0.02]} dir={[0.03, 0.08, -0.03]} len={0.11} />}
      </MeetingRoom>
    );
    c = { target: [0.3, 0.72, 0.1], d: zd(lerp(9.6, 9.1, ease(p))), yaw: lerp(0.26, 0.2, p), el: 0.2 };
    scrim = "none";
    overlay = (
      <>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 420, background: "linear-gradient(rgba(12,9,7,.9) 0%, rgba(12,9,7,.75) 55%, rgba(12,9,7,0) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(12,9,7,0) 50.5%, rgba(12,9,7,.92) 57%, rgba(12,9,7,.985) 63%, rgba(12,9,7,.985) 100%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 244, textAlign: "center" }}><Eyebrow text="THE NEXT MORNING" from={6} /></div>
        <div style={{ position: "absolute", top: 1106, left: 60, right: 230, textAlign: "center" }}>
          <Eyebrow text="UNIVERSITY OF CHICAGO · 2011" from={Math.max(0, t0 - 2)} />
          <div style={{ ...serif, marginTop: 14, fontSize: 62, lineHeight: 1.06 }}>
            <SoftBlurIn text="anxious students wrote" from={t0 + 6} /><br /><SoftBlurIn text="their worries out" from={t0 + 40} />
          </div>
          <div style={{ ...serif, marginTop: 6, fontSize: 80, lineHeight: 1.06, fontStyle: "italic", color: GOLD }}><SoftBlurIn text="nearly a grade higher" from={resultAt} /></div>
          <div style={{ marginTop: 18, fontFamily: "Inter", fontWeight: 500, fontSize: 24, color: "rgba(246,236,220,.7)", opacity: seg(lf, resultAt + 14, resultAt + 26) }}>Ramirez &amp; Beilock, Science · 10 minutes before an exam</div>
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
