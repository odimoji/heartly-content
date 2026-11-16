// Sets and props for "worry takes notes in every meeting": the meeting room, the chart on its stand,
// Worry's folded notes (words drawn in Caveat on a canvas), his pad, pencil and little arm.
// Colours stay in the brand family; violet is kept for Worry alone.
import { useEffect, useMemo } from "react";
import { CanvasTexture, Color, SRGBColorSpace } from "three";
import { Ball, Cyl, M, RBox, Stick, V3 } from "./parts";
import { Room, Window } from "./sets";

const INK = "#2a2420", EMBER = "#d9643a", GOLD = "#d9b26a", DARKWOOD = "#4f382a", TERRA = "#b5654a", DARK = "#221c22";
const mix = (a: string, b: string, k: number) => "#" + new Color(a).lerp(new Color(b), k).getHexString();

export const TABLE_Y = 0.8; // top of the meeting table
export const SEATS = [-0.5, 0.04, 0.6]; // x of the three chairs; the last one is hers

// ---------- the folded note ----------
// heart < 0 draws the words; heart 0..1 draws that much of a heart instead
const useNoteTex = (lines: string[], fonts: boolean, heart: number) => {
  const hk = Math.round(heart * 48);
  const key = lines.join("|") + fonts + hk;
  const tex = useMemo(() => {
    const W = 640, H = 320;
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const x = c.getContext("2d")!;
    x.fillStyle = "#fffaf0"; x.fillRect(0, 0, W, H);
    x.textAlign = "center"; x.textBaseline = "middle"; x.lineCap = "round"; x.lineJoin = "round";
    if (heart >= 0) {
      const n = Math.round(60 * heart);
      if (n > 0) {
        x.strokeStyle = EMBER; x.lineWidth = 22; x.beginPath();
        for (let i = 0; i <= n; i++) {
          const a = (i / 60) * Math.PI * 2;
          const hx = 16 * Math.pow(Math.sin(a), 3), hy = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a);
          const px = W / 2 + hx * 7.4, py = H / 2 - 8 - hy * 7.4;
          if (i) x.lineTo(px, py); else x.moveTo(px, py);
        }
        x.stroke();
      }
    } else {
      let size = lines.length > 1 ? 136 : 176;
      const widest = () => Math.max(...lines.map((t) => x.measureText(t).width));
      x.font = `700 ${size}px Caveat`;
      while (size > 60 && widest() > W - 64) { size -= 4; x.font = `700 ${size}px Caveat`; }
      x.fillStyle = INK;
      lines.forEach((t, i) => x.fillText(t, W / 2, H / 2 + (i - (lines.length - 1) / 2) * size * 0.84 + 4));
    }
    const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; return t;
  }, [key]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
};

// A note folded in half: the lower half lies on the table, the upper half stands up (tilt: radians back from upright)
// and carries the words. pos is the middle of the fold.
export const NOTE_W = 0.3, NOTE_H = 0.15;
export const Note: React.FC<{ pos: V3; rotY?: number; lines?: string[]; tilt?: number; fonts: boolean; s?: number; heart?: number; flat?: boolean }> = ({ pos, rotY = 0, lines = [], tilt = 0.6, fonts, s = 1, heart = -1, flat = true }) => {
  const tex = useNoteTex(lines, fonts, heart);
  if (s <= 0.01) return null;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={s}>
      {flat && <RBox size={[NOTE_W, 0.006, NOTE_H * 0.9]} pos={[0, 0.004, NOTE_H * 0.45]} c="#f1e6d2" r={0.002} />}
      <group rotation={[-tilt, 0, 0]}>
        <RBox size={[NOTE_W, NOTE_H, 0.006]} pos={[0, NOTE_H / 2, -0.004]} c="#fffaf0" r={0.002} />
        <mesh position={[0, NOTE_H / 2, 0.0006]}>
          <planeGeometry args={[NOTE_W * 0.97, NOTE_H * 0.95]} />
          <meshStandardMaterial map={tex} roughness={0.9} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.32} />
        </mesh>
      </group>
    </group>
  );
};

// a note that did not make it
export const Crumple: React.FC<{ pos: V3; s?: number }> = ({ pos, s = 1 }) => (
  <group position={pos} scale={s}>
    <Ball pos={[0, 0.036, 0]} r={0.04} c="#f6ecda" scale={[1.05, 0.85, 0.95]} />
    {[[0.026, 0.05, 0.012], [-0.024, 0.044, 0.018], [0.004, 0.064, -0.014], [-0.012, 0.026, -0.026], [0.02, 0.022, -0.02], [0.0, 0.03, 0.03]].map((p, i) => (
      <Ball key={i} pos={[p[0], p[1], p[2]]} r={0.021 + (i % 3) * 0.003} c={i % 2 ? "#fffaf0" : "#eadcc4"} />
    ))}
  </group>
);

// ---------- Worry's stationery ----------
export const MiniPad: React.FC<{ pos: V3; rotY?: number; s?: number }> = ({ pos, rotY = 0, s = 1 }) => (
  <group position={pos} rotation={[0, rotY, 0]} scale={s}>
    <RBox size={[0.18, 0.016, 0.23]} pos={[0, 0.008, 0]} c="#fffaf0" r={0.005} />
    <RBox size={[0.18, 0.02, 0.035]} pos={[0, 0.011, -0.1]} c={EMBER} r={0.006} />
  </group>
);

// tip is where the lead touches; dir points up the pencil
export const Pencil: React.FC<{ tip: V3; dir: V3; len?: number }> = ({ tip, dir, len = 0.17 }) => {
  const L = Math.hypot(dir[0], dir[1], dir[2]) || 1;
  const at = (k: number): V3 => [tip[0] + (dir[0] / L) * len * k, tip[1] + (dir[1] / L) * len * k, tip[2] + (dir[2] / L) * len * k];
  return (
    <>
      <Stick a={at(0.1)} b={at(0.9)} r={len * 0.058} c="#e3a63a" />
      <Stick a={tip} b={at(0.1)} r={len * 0.03} c={INK} />
      <Stick a={at(0.9)} b={at(1)} r={len * 0.062} c={EMBER} />
    </>
  );
};

// his little arm, from the coat to wherever his hand is (world coordinates)
export const WorryArm: React.FC<{ wp: V3; r: number; hop?: number; hand: V3 }> = ({ wp, r, hop = 0, hand }) => {
  const c: V3 = [wp[0], wp[1] + 1.3 * r + hop, wp[2]];
  const d: V3 = [hand[0] - c[0], hand[1] - c[1], hand[2] - c[2]];
  const L = Math.hypot(d[0], d[1], d[2]);
  if (L < r * 0.9) return <Ball pos={hand} r={r * 0.15} c={DARK} />;
  const a: V3 = [c[0] + (d[0] / L) * r * 0.82, c[1] + (d[1] / L) * r * 0.82, c[2] + (d[2] / L) * r * 0.82];
  return (
    <>
      <Stick a={a} b={hand} r={r * 0.07} c={DARK} />
      <Ball pos={hand} r={r * 0.15} c={DARK} />
    </>
  );
};

// her own notepad: ruled page, gold binding, a pen beside it
export const Notepad: React.FC<{ pos: V3; rotY?: number; pen?: boolean }> = ({ pos, rotY = 0, pen = true }) => (
  <group position={pos} rotation={[0, rotY, 0]}>
    <RBox size={[0.3, 0.016, 0.38]} pos={[0, 0.008, 0]} c="#fbf6ee" r={0.006} />
    <RBox size={[0.3, 0.022, 0.04]} pos={[0, 0.011, -0.17]} c={GOLD} r={0.008} />
    {[-0.08, -0.02, 0.04, 0.1].map((z) => <RBox key={z} size={[0.23, 0.003, 0.006]} pos={[0, 0.017, z]} c="#dccdb4" r={0.001} shadow={false} />)}
    {pen && <Stick a={[-0.21, 0.014, -0.1]} b={[-0.24, 0.014, 0.1]} r={0.011} c={TERRA} />}
  </group>
);

// ---------- the chart everyone else is looking at ----------
const BARS = [0.12, 0.18, 0.15, 0.25, 0.33];
export const ChartScreen: React.FC<{ pos: V3; rotY?: number; f: number }> = ({ pos, rotY = 0, f }) => (
  <group position={pos} rotation={[0, rotY, 0]}>
    <Cyl pos={[0, 0.02, 0]} r={0.27} h={0.04} c="#2a211b" />
    <Stick a={[0, 0, 0]} b={[0, 1.25, 0]} r={0.026} c="#2a211b" />
    <RBox size={[1.0, 0.68, 0.05]} pos={[0, 1.55, 0.02]} c="#2a211b" r={0.02} />
    <mesh position={[0, 1.55, 0.047]}>
      <planeGeometry args={[0.93, 0.61]} />
      <M c="#fff3dc" emissive="#ffe6bd" ei={0.62} />
    </mesh>
    <RBox size={[0.36, 0.03, 0.006]} pos={[-0.24, 1.78, 0.05]} c={INK} r={0.002} shadow={false} />
    <RBox size={[0.22, 0.018, 0.006]} pos={[-0.31, 1.73, 0.05]} c="#b9a78d" r={0.002} shadow={false} />
    <RBox size={[0.8, 0.012, 0.006]} pos={[0, 1.3, 0.05]} c={INK} r={0.002} shadow={false} />
    {BARS.map((h0, i) => {
      const h = h0 + Math.sin(f * 0.06 + i * 1.4) * 0.008;
      return <RBox key={i} size={[0.1, h, 0.012]} pos={[-0.3 + i * 0.15, 1.306 + h / 2, 0.053]} c={i === 4 ? EMBER : i % 2 ? GOLD : TERRA} r={0.004} shadow={false} />;
    })}
  </group>
);

// ---------- the meeting room ----------
// warm 0 = mid-morning, 1 = late golden afternoon. hour sets the wall clock. herChair pushes her chair back (she half-stands).
// Everyone sits behind a boardroom table with a solid front, so only what is above the table top is seen.
const TX = 0.3, TL = 2.3, TZ = 0.17, TD = 0.98;
export const MeetingRoom: React.FC<{ f: number; warm?: number; hour?: number; herChair?: number; children?: React.ReactNode }> = ({ f, warm = 0, hour = 10, herChair = 0, children }) => {
  const ha = (hour / 12) * Math.PI * 2;
  return (
    <group>
      <Room floor={mix("#a47750", "#b98a5e", warm)} wall={mix("#d9c3a3", "#ecd0a6", warm)} wall2={mix("#cdb694", "#e0c296", warm)} />
      <Window pos={[1.0, 1.66, -1.0]} sky={mix("#f3e6cb", "#f8b888", warm)} glow={0.85 + 0.75 * warm} w={0.72} h={0.86} />
      {/* wall clock */}
      <Cyl pos={[-0.28, 1.98, -0.99]} r={0.16} h={0.04} c="#fffaf0" rot={[Math.PI / 2, 0, 0]} />
      <Stick a={[-0.28, 1.98, -0.965]} b={[-0.28, 2.09, -0.965]} r={0.008} c={INK} />
      <Stick a={[-0.28, 1.98, -0.965]} b={[-0.28 + Math.sin(ha) * 0.075, 1.98 + Math.cos(ha) * 0.075, -0.965]} r={0.01} c={INK} />
      <ChartScreen pos={[-1.12, 0, 0.12]} rotY={1.05} f={f} />
      {/* table: top, recessed front, end slabs, a gold inlay */}
      <RBox size={[TL, 0.06, TD]} pos={[TX, TABLE_Y - 0.03, TZ]} c="#8d6648" r={0.025} />
      <RBox size={[TL - 0.22, TABLE_Y - 0.06, 0.06]} pos={[TX, (TABLE_Y - 0.06) / 2, TZ + TD / 2 - 0.13]} c={DARKWOOD} r={0.02} />
      {[-1, 1].map((s) => <RBox key={s} size={[0.07, TABLE_Y - 0.06, TD - 0.2]} pos={[TX + s * (TL / 2 - 0.12), (TABLE_Y - 0.06) / 2, TZ]} c={DARKWOOD} r={0.02} />)}
      <RBox size={[TL - 0.6, 0.016, 0.012]} pos={[TX, 0.56, TZ + TD / 2 - 0.097]} c={GOLD} r={0.004} shadow={false} />
      {/* chairs: only the backs show */}
      {SEATS.map((x, i) => <RBox key={x} size={[0.52, 0.98, 0.07]} pos={[x, 0.79, -0.87 - (i === 2 ? herChair : 0)]} c={i === 2 ? "#a85a40" : "#96513a"} r={0.05} />)}
      {/* the colleagues' things: a cup and papers, a laptop */}
      <Cyl pos={[-0.74, TABLE_Y + 0.05, -0.02]} r={0.045} h={0.1} c={EMBER} />
      <RBox size={[0.26, 0.01, 0.34]} pos={[-0.46, TABLE_Y + 0.005, 0.02]} rot={[0, 0.2, 0]} c="#fffaf0" r={0.004} />
      <RBox size={[0.34, 0.016, 0.24]} pos={[0.04, TABLE_Y + 0.008, 0.0]} c="#e4d8c4" r={0.006} />
      <RBox size={[0.34, 0.23, 0.014]} pos={[0.04, TABLE_Y + 0.115, 0.15]} rot={[0.3, 0, 0]} c="#e4d8c4" r={0.006} />
      {children}
    </group>
  );
};
