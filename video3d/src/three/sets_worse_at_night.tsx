// Props for "worse at night": one room that is full by day and bare by night.
// Colours stay in the brand family (midnight, cream, gold, ember, terracotta, warm wood); violet is the thought's alone.
import { useMemo } from "react";
import { CanvasTexture, Color, SRGBColorSpace } from "three";
import { Ball, clamp01, Cyl, M, RBox, Stick, V3 } from "./parts";
import { Room, Window } from "./sets";

const INK = "#2a2420", EMBER = "#d9643a", GOLD = "#d9b26a", CREAM = "#f1e6d6", WOOD = "#7a5640", DARKWOOD = "#4f382a", TERRA = "#b9623f", SAND = "#d6b98c";
export const mixc = (a: string, b: string, k: number) => "#" + new Color(a).lerp(new Color(b), clamp01(k)).getHexString();

// a thing that can pop away: scales about its own base
export const Pop: React.FC<{ pos: V3; k: number; rotY?: number; children: React.ReactNode }> = ({ pos, k, rotY = 0, children }) =>
  k <= 0.004 ? null : <group position={pos} rotation={[0, rotY, 0]} scale={k}>{children}</group>;
// 1 until `at`, a small swell, then gone nine frames later
export const popOut = (lf: number, at: number) => {
  const u = clamp01((lf - at) / 9);
  return u <= 0 ? 1 : (1 + 0.24 * Math.sin(u * Math.PI)) * (1 - u * u * u);
};

// ---------- the thought: a small violet glow. No face, no voice; k is how brightly it burns ----------
export const Orb: React.FC<{ pos: V3; r?: number; k?: number }> = ({ pos, r = 0.13, k = 1 }) => {
  const halo = useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 256;
    const x = c.getContext("2d")!, g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(246,240,255,1)"); g.addColorStop(0.08, "rgba(222,208,255,0.95)"); g.addColorStop(0.19, "rgba(178,150,255,0.8)");
    g.addColorStop(0.27, "rgba(169,139,255,0.46)"); g.addColorStop(0.45, "rgba(169,139,255,0.2)"); g.addColorStop(0.72, "rgba(169,139,255,0.06)"); g.addColorStop(1, "rgba(169,139,255,0)");
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
  }, []);
  const b = clamp01(k);
  return (
    <group position={pos}>
      <mesh>
        <sphereGeometry args={[r, 32, 24]} />
        <meshBasicMaterial color={mixc("#4f4184", "#a98bff", b)} toneMapped={false} />
      </mesh>
      {/* drawn over everything so the glow is never cut by the floor or the bed */}
      <sprite scale={[r * 10, r * 10, 1]}>
        <spriteMaterial map={halo} transparent opacity={Math.min(1, 0.85 * k)} depthWrite={false} depthTest={false} toneMapped={false} />
      </sprite>
      <pointLight color="#a98bff" intensity={1.9 * k * (r / 0.13)} distance={2.2} decay={1.6} />
    </group>
  );
};

// ---------- what stays: the room, the window, the bed ----------
// night 0..1 turns the afternoon room into the 2am one; dawn 0..1 brings the morning into the window
export const NightRoom: React.FC<{ night: number; dawn?: number }> = ({ night, dawn = 0 }) => {
  const sky = dawn > 0 ? mixc("#1f1a38", "#d98a5e", dawn) : mixc("#f8dba6", "#1f1a38", night);
  const lampOn = night * (1 - dawn * 0.85);
  return (
    <group>
      <Room floor={mixc("#b98a5e", "#5a4030", night)} wall={mixc("#ead8bc", "#4a3640", night)} wall2={mixc("#dfc9a8", "#42303a", night)} />
      <Window pos={[-0.84, 1.72, -1.0]} sky={sky} glow={1.0 - 0.2 * night - dawn * 0.3} moon={night * (1 - dawn)} />
      {/* bed */}
      <RBox size={[1.08, 0.24, 1.9]} pos={[-0.84, 0.2, -0.02]} c={WOOD} r={0.04} />
      <RBox size={[1.0, 0.18, 1.8]} pos={[-0.84, 0.38, -0.02]} c="#efe6d8" r={0.06} />
      <RBox size={[1.12, 0.85, 0.1]} pos={[-0.84, 0.62, -0.95]} c={WOOD} r={0.05} />
      <RBox size={[0.66, 0.14, 0.4]} pos={[-0.84, 0.52, -0.68]} c="#fbf6ee" r={0.065} />
      <RBox size={[1.06, 0.56, 1.12]} pos={[-0.84, 0.6, 0.42]} c={TERRA} r={0.2} />
      <RBox size={[1.07, 0.5, 0.2]} pos={[-0.84, 0.62, -0.12]} c={CREAM} r={0.09} />
      {/* slippers */}
      <Ball pos={[-0.16, 0.04, 0.72]} r={0.06} c={GOLD} scale={[1, 0.55, 1.6]} />
      <Ball pos={[-0.03, 0.04, 0.76]} r={0.06} c={GOLD} scale={[1, 0.55, 1.6]} />
      {/* nightstand, clock, bedside lamp */}
      <RBox size={[0.3, 0.4, 0.3]} pos={[-0.1, 0.2, -0.84]} c={WOOD} r={0.03} />
      <RBox size={[0.16, 0.09, 0.07]} pos={[-0.04, 0.445, -0.76]} c="#2a2530" r={0.02} emissive="#ff8a5c" ei={0.25 + 0.5 * night} />
      <Cyl pos={[-0.15, 0.42, -0.88]} r={0.06} h={0.03} c={DARKWOOD} />
      <Stick a={[-0.15, 0.42, -0.88]} b={[-0.15, 0.6, -0.88]} r={0.012} c={DARKWOOD} />
      <Cyl pos={[-0.15, 0.66, -0.88]} r={0.11} r2={0.065} h={0.15} c="#ffd9a0" emissive="#ffb86a" ei={0.15 + 1.5 * lampOn} />
      <pointLight position={[-0.15, 0.8, -0.6]} color="#ffb060" intensity={1.1 * lampOn} distance={2.4} decay={1.6} />
    </group>
  );
};

// morning light from the window lying on the floor (k 0..1)
export const SunPatch: React.FC<{ k: number }> = ({ k }) =>
  k <= 0.01 ? null : (
    <group position={[0.42, 0.006, 0.12]} rotation={[-Math.PI / 2, 0, -0.42]}>
      {[-1, 1].map((sx) => [-1, 1].map((sy) => (
        <mesh key={`${sx}${sy}`} position={[sx * 0.23, sy * 0.37, 0]}>
          <planeGeometry args={[0.4, 0.68]} />
          <meshBasicMaterial color="#ffc98f" transparent opacity={0.26 * k} depthWrite={false} />
        </mesh>
      )))}
    </group>
  );

// ---------- what the day fills the room with ----------
export type Thing = "sofa" | "laptop" | "mug" | "phone" | "radio" | "books" | "picture" | "clock" | "bag" | "plant" | "lamp" | "desk" | "rug" | "chair";
export const HER: V3 = [-0.04, 0.47, 0.0]; // her desk chair
export const FRIEND: V3 = [1.18, 0.42, 0.0]; // the sofa seat

const Note: React.FC<{ pos: V3; s: number }> = ({ pos, s }) => (
  <group position={pos} scale={s}>
    <Ball pos={[0, 0, 0]} r={0.035} c={GOLD} scale={[1.2, 0.85, 1]} shadow={false} />
    <Stick a={[0.034, 0, 0]} b={[0.034, 0.13, 0]} r={0.008} c={GOLD} />
    <RBox size={[0.06, 0.022, 0.016]} pos={[0.06, 0.125, 0]} rot={[0, 0, -0.35]} c={GOLD} r={0.006} shadow={false} />
  </group>
);

export const DayThings: React.FC<{ f: number; k: (t: Thing) => number }> = ({ f, k }) => {
  const buzz = Math.sin(f * 0.21) > -0.2 ? 1 : 0; // the phone buzzes in bursts
  return (
    <group>
      <Pop pos={[0.6, 0, 0.12]} k={k("rug")}>
        <Cyl pos={[0, 0.012, 0]} r={0.82} h={0.024} c="#e2cfae" />
        <Cyl pos={[0, 0.016, 0]} r={0.6} h={0.024} c="#d8b98f" />
      </Pop>
      {/* her chair */}
      <Pop pos={[HER[0], 0, HER[2]]} k={k("chair")}>
        <RBox size={[0.46, 0.07, 0.46]} pos={[0, 0.43, 0]} c="#b5654a" r={0.03} />
        <RBox size={[0.07, 0.6, 0.44]} pos={[-0.22, 0.76, 0]} c="#b5654a" r={0.03} />
        <Cyl pos={[0, 0.21, 0]} r={0.03} h={0.42} c="#2a211b" />
        <Cyl pos={[0, 0.02, 0]} r={0.2} h={0.04} c="#2a211b" />
      </Pop>
      {/* desk */}
      <Pop pos={[0.59, 0, 0]} k={k("desk")}>
        <RBox size={[0.62, 0.06, 0.7]} pos={[0, 0.74, 0]} c={WOOD} r={0.02} />
        {[[-0.26, -0.3], [-0.26, 0.3], [0.26, -0.3], [0.26, 0.3]].map(([x, z], i) => <RBox key={i} size={[0.05, 0.72, 0.05]} pos={[x, 0.36, z]} c={DARKWOOD} r={0.012} />)}
      </Pop>
      <Pop pos={[0.52, 0.772, -0.02]} k={k("laptop")}>
        <RBox size={[0.26, 0.02, 0.36]} pos={[0, 0.01, 0]} c="#d8d2c8" r={0.008} />
        <RBox size={[0.02, 0.28, 0.36]} pos={[0.16, 0.145, 0]} rot={[0, 0, -0.24]} c="#d8d2c8" r={0.008} />
        <RBox size={[0.008, 0.23, 0.31]} pos={[0.148, 0.145, 0]} rot={[0, 0, -0.24]} c="#fff4dc" r={0.003} emissive="#ffe9c4" ei={0.85} shadow={false} />
      </Pop>
      <Pop pos={[0.42, 0.772, 0.27]} k={k("mug")}>
        <Cyl pos={[0, 0.055, 0]} r={0.048} h={0.11} c={EMBER} />
        <Cyl pos={[0, 0.108, 0]} r={0.04} h={0.008} c="#4a2f22" />
        <mesh position={[0.055, 0.055, 0]} castShadow>
          <torusGeometry args={[0.03, 0.01, 8, 16]} />
          <M c={EMBER} />
        </mesh>
      </Pop>
      <Pop pos={[0.76 + Math.sin(f * 2.7) * 0.006 * buzz, 0.772, 0.2]} k={k("phone")} rotY={0.5 + Math.sin(f * 2.3) * 0.16 * buzz}>
        <RBox size={[0.1, 0.02, 0.19]} pos={[0, 0.01, 0]} c="#2a2420" r={0.009} />
        <RBox size={[0.085, 0.006, 0.17]} pos={[0, 0.022, 0]} c="#fff0d0" r={0.002} emissive="#ffd9a0" ei={0.5 + 1.4 * buzz} shadow={false} />
        {/* buzz marks */}
        {buzz > 0 && [-1, 1].map((s) => (
          <group key={s}>
            <Stick a={[s * 0.09, 0.03, -0.05]} b={[s * 0.115, 0.07, -0.07]} r={0.006} c={GOLD} />
            <Stick a={[s * 0.09, 0.03, 0.05]} b={[s * 0.115, 0.07, 0.07]} r={0.006} c={GOLD} />
          </group>
        ))}
      </Pop>
      {/* sofa, side-on */}
      <Pop pos={[FRIEND[0], 0, FRIEND[2]]} k={k("sofa")}>
        <RBox size={[0.58, 0.3, 0.96]} pos={[0.0, 0.27, 0]} c={SAND} r={0.07} />
        <RBox size={[0.17, 0.68, 0.96]} pos={[0.24, 0.62, 0]} c={SAND} r={0.07} />
        <RBox size={[0.56, 0.24, 0.15]} pos={[0.0, 0.5, 0.45]} c="#cbab7c" r={0.065} />
        <RBox size={[0.56, 0.24, 0.15]} pos={[0.0, 0.5, -0.45]} c="#cbab7c" r={0.065} />
        <Ball pos={[0.1, 0.56, -0.28]} r={0.15} c={EMBER} scale={[0.6, 1, 1]} />
        {[[-0.22, -0.4], [-0.22, 0.4], [0.24, -0.4], [0.24, 0.4]].map(([x, z], i) => <Cyl key={i} pos={[x, 0.06, z]} r={0.03} h={0.12} c={DARKWOOD} />)}
      </Pop>
      {/* bag by her chair */}
      <Pop pos={[0.0, 0, 0.66]} k={k("bag")} rotY={0.3}>
        <RBox size={[0.34, 0.3, 0.15]} pos={[0, 0.15, 0]} c="#c98d27" r={0.05} />
        <RBox size={[0.34, 0.07, 0.155]} pos={[0, 0.28, 0]} c="#a8744f" r={0.03} />
        <mesh position={[0, 0.31, 0]} castShadow>
          <torusGeometry args={[0.1, 0.014, 8, 20, Math.PI]} />
          <M c="#a8744f" />
        </mesh>
      </Pop>
      {/* plant, front corner: autumn gold, to stay in the palette */}
      <Pop pos={[1.24, 0, 0.8]} k={k("plant")}>
        <Cyl pos={[0, 0.14, 0]} r={0.11} r2={0.14} h={0.28} c="#b5654a" />
        {[[0, 0.5, 0, 0.19], [-0.13, 0.4, 0.05, 0.13], [0.13, 0.42, -0.03, 0.14], [0.03, 0.68, 0.02, 0.13]].map((p, i) => (
          <Ball key={i} pos={[p[0], p[1], p[2]]} r={p[3]} c={["#d9a441", "#c98d2e", "#e3b45a", "#c98d2e"][i]} />
        ))}
      </Pop>
      {/* floor lamp, back corner (off by day) */}
      <Pop pos={[1.28, 0, -0.84]} k={k("lamp")}>
        <Cyl pos={[0, 0.02, 0]} r={0.14} h={0.04} c="#2a211b" />
        <Stick a={[0, 0, 0]} b={[0, 1.5, 0]} r={0.018} c="#2a211b" />
        <Cyl pos={[0, 1.56, 0]} r={0.2} r2={0.11} h={0.26} c="#ffd9a0" emissive="#ffb86a" ei={0.35} />
      </Pop>
      {/* shelf with books */}
      <Pop pos={[0.74, 1.66, -0.92]} k={k("books")}>
        <RBox size={[1.0, 0.05, 0.2]} pos={[0, 0, 0]} c={WOOD} r={0.015} />
        {([[EMBER, 0.26], ["#5a4353", 0.3], [GOLD, 0.22], [CREAM, 0.28], ["#b5654a", 0.24]] as [string, number][]).map(([c, h], i) => (
          <RBox key={i} size={[0.07, h, 0.15]} pos={[-0.4 + i * 0.085, 0.03 + h / 2, 0]} rot={[0, 0, i === 4 ? -0.22 : 0]} c={c} r={0.01} />
        ))}
      </Pop>
      {/* radio on the shelf, playing */}
      <Pop pos={[1.02, 1.69, -0.92]} k={k("radio")}>
        <RBox size={[0.34, 0.22, 0.14]} pos={[0, 0.11, 0]} c="#a8744f" r={0.04} />
        <Cyl pos={[-0.07, 0.11, 0.07]} r={0.07} h={0.02} c={CREAM} rot={[Math.PI / 2, 0, 0]} />
        <Cyl pos={[-0.07, 0.11, 0.078]} r={0.03} h={0.02} c={INK} rot={[Math.PI / 2, 0, 0]} />
        <Ball pos={[0.09, 0.15, 0.07]} r={0.022} c={GOLD} shadow={false} />
        <Ball pos={[0.09, 0.08, 0.07]} r={0.022} c={EMBER} shadow={false} />
        <Stick a={[0.13, 0.22, 0]} b={[0.22, 0.44, 0]} r={0.007} c="#2a211b" />
        {[0, 1, 2].map((i) => {
          const t = (f * 0.022 + i / 3) % 1;
          return <Note key={i} pos={[-0.2 - t * 0.22 + Math.sin(t * 9 + i) * 0.04, 0.3 + t * 0.34, 0.06]} s={Math.sin(t * Math.PI) * 1.25} />;
        })}
      </Pop>
      {/* picture: a sun over a hill */}
      <Pop pos={[0.62, 1.2, -1.0]} k={k("picture")}>
        <RBox size={[0.44, 0.36, 0.04]} pos={[0, 0, 0]} c={GOLD} r={0.015} />
        <RBox size={[0.37, 0.29, 0.02]} pos={[0, 0, 0.015]} c="#f6ecdc" r={0.008} shadow={false} />
        <Cyl pos={[0.05, 0.03, 0.03]} r={0.07} h={0.01} c={EMBER} rot={[Math.PI / 2, 0, 0]} />
        <RBox size={[0.37, 0.09, 0.012]} pos={[0, -0.1, 0.028]} c="#b5654a" r={0.004} shadow={false} />
      </Pop>
      {/* wall clock at two o'clock */}
      <Pop pos={[0.1, 2.02, -0.99]} k={k("clock")}>
        <Cyl pos={[0, 0, 0]} r={0.17} h={0.04} c="#fffaf0" rot={[Math.PI / 2, 0, 0]} />
        <Stick a={[0, 0, 0.03]} b={[0, 0.12, 0.03]} r={0.008} c={INK} />
        <Stick a={[0, 0, 0.03]} b={[0.07, 0.04, 0.03]} r={0.01} c={INK} />
        <Ball pos={[0, 0, 0.03]} r={0.016} c={EMBER} shadow={false} />
      </Pop>
    </group>
  );
};
