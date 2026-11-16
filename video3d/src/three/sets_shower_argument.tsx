// Sets and props for "shower argument": the man (shower shorts, hoodie, gym kit, jumper), his bathroom with a walk-in
// shower (rain, steam, his tally in the steam on the tiles), and the three other places he wins: a parked car, the gym,
// and his living room, against a lamp. No creature in this one, and no violet: everything stays in the warm brand family.
import { useEffect, useMemo } from "react";
import { CanvasTexture, Color, SRGBColorSpace } from "three";
import { Ball, Cyl, M, RBox, Stick, V3 } from "./parts";
import { Room, Window } from "./sets";
import { Person, Pose } from "./Woman";

const INK = "#2a2420", EMBER = "#d9643a", GOLD = "#d9b26a", CREAM = "#f1e6d6", TRIM = "#e9dcc6", WOOD = "#7a5640", DARKWOOD = "#4f382a", TERRA = "#b5654a";
export const SKIN = "#b97f58", HAIR = "#2b1f1b";
const mix = (a: string, b: string, k: number) => "#" + new Color(a).lerp(new Color(b), k).getHexString();
const hash = (i: number, s = 0) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
const TAU = Math.PI * 2;

// ---------- rig: he and everything that rides on him share one frame (pos, turn, forward lean) ----------
export type Rig = { pos: V3; rotY?: number; lean?: number; pose?: Pose };
const Frame: React.FC<Rig & { children?: React.ReactNode }> = ({ pos, rotY = 0, lean = 0, pose = {}, children }) => (
  <group position={pos} rotation={[0, rotY, 0]}>
    <group rotation={[lean, 0, 0]}>
      <group position={[0, pose.sit ? -0.43 : 0, 0]}>{children}</group>
    </group>
  </group>
);
const armOf = (pose: Pose, s: 1 | -1): [number, number] => (s === 1 ? pose.armL ?? [0, 0.14] : pose.armR ?? [0, 0.14]);
const HeadG: React.FC<{ pose: Pose; children?: React.ReactNode }> = ({ pose, children }) => (
  <group position={[0, 1.37, 0]} rotation={[pose.headTilt ?? 0, pose.headTurn ?? 0, 0]}>{children}</group>
);
// side 1 = his left hand, -1 = his right; children sit at the hand, y pointing back up the arm
const HandG: React.FC<{ pose: Pose; side: 1 | -1; children?: React.ReactNode }> = ({ pose, side, children }) => {
  const a = armOf(pose, side);
  return (
    <group position={[side * 0.25, 0.99, 0]} rotation={[a[0], 0, side * a[1]]}>
      <group position={[0, -0.41, 0]}>{children}</group>
    </group>
  );
};
export const OnBody: React.FC<Rig & { children?: React.ReactNode }> = ({ children, ...rig }) => <Frame {...rig}>{children}</Frame>;

// ---------- the man ----------
export type Outfit = "shower" | "hoodie" | "gym" | "home";
const OUTFIT: Record<Outfit, { top: string; legs: string }> = {
  shower: { top: SKIN, legs: SKIN },
  hoodie: { top: "#ead9bd", legs: "#3a2c2a" },
  gym: { top: EMBER, legs: "#3a2c2a" },
  home: { top: "#d9b26a", legs: "#4a3a36" },
};
const Skin: React.FC = () => <M c={SKIN} rough={0.7} />;

// mouth 0..1 opens it (leave undefined for none); brows > 0 angry, < 0 sorry; point puts a jabbing finger on that hand
export const Guy: React.FC<Rig & { outfit?: Outfit; mouth?: number; brows?: number; foam?: number; point?: 1 | -1 }> = ({ outfit = "home", mouth, brows, foam = 0, point, ...rig }) => {
  const k = OUTFIT[outfit], pose = rig.pose ?? {};
  return (
    <Frame {...rig} pose={{}}>
      <Person pos={[0, 0, 0]} pose={pose} bun={false} jumper={k.top} trousers={k.legs} skin={SKIN} hair={HAIR} />
      <group position={[0, pose.sit ? -0.43 : 0, 0]}>
        {outfit === "shower" && !pose.sit && (
          <group>
            {/* swim shorts and bare feet */}
            <mesh position={[0, 0.57, 0]} scale={[1.04, 0.6, 1.04]} castShadow>
              <sphereGeometry args={[0.24, 24, 16]} />
              <M c={EMBER} />
            </mesh>
            {[-1, 1].map((s) => (
              <group key={s}>
                <mesh position={[s * 0.105, 0.42, 0]} castShadow>
                  <capsuleGeometry args={[0.093, 0.13, 8, 16]} />
                  <M c={EMBER} />
                </mesh>
                <mesh position={[s * 0.105, 0.03, 0.05]} scale={[1.04, 0.66, 1.6]} castShadow>
                  <sphereGeometry args={[0.094, 18, 14]} />
                  <Skin />
                </mesh>
              </group>
            ))}
            <RBox size={[0.3, 0.022, 0.03]} pos={[0, 0.655, 0.2]} c={CREAM} r={0.01} shadow={false} />
          </group>
        )}
        {outfit === "hoodie" && <Ball pos={[0, 1.1, -0.17]} r={0.16} c={k.top} scale={[1.25, 0.8, 0.8]} />}
        <HeadG pose={pose}>
          {/* a short fringe so he is not the man from the other videos */}
          <Ball pos={[0.03, 0.235, 0.13]} r={0.1} c={HAIR} scale={[1.9, 0.6, 1.05]} />
          <Ball pos={[-0.13, 0.2, 0.12]} r={0.075} c={HAIR} scale={[1.2, 0.7, 1]} />
          {foam > 0.03 && (
            <group scale={foam} position={[0, 0.28 * (1 - foam), 0]}>
              {[[0, 0.31, -0.02, 0.14], [-0.15, 0.25, 0.08, 0.1], [0.15, 0.26, 0.04, 0.105], [0.03, 0.27, -0.17, 0.11], [0.06, 0.41, 0.0, 0.075], [-0.08, 0.37, -0.06, 0.08]].map((q, i) => (
                <Ball key={i} pos={[q[0], q[1], q[2]]} r={q[3]} c="#fbf6ee" />
              ))}
            </group>
          )}
          {brows !== undefined &&
            [-1, 1].map((s) => <RBox key={s} size={[0.095, 0.024, 0.02]} pos={[s * 0.1, 0.05 + Math.abs(brows) * 0.012, 0.258]} rot={[0, s * 0.35, s * brows]} c="#1c1512" r={0.008} shadow={false} />)}
          {mouth !== undefined && !pose.smile && (
            <mesh position={[0, -0.108, 0.256]} scale={[1, 0.28 + 1.05 * mouth, 0.45]}>
              <sphereGeometry args={[0.038, 14, 10]} />
              <M c="#3a1c16" rough={0.5} />
            </mesh>
          )}
        </HeadG>
        {point && (
          <HandG pose={pose} side={point}>
            <mesh position={[0, -0.095, 0]} castShadow>
              <capsuleGeometry args={[0.026, 0.085, 6, 10]} />
              <Skin />
            </mesh>
          </HandG>
        )}
      </group>
    </Frame>
  );
};

// ---------- water, steam, humming ----------
// rain from the shower head: thin warm streaks that fall and wrap, driven by the frame alone
export const Rain: React.FC<{ f: number; at: V3; r?: number; n?: number; floor?: number; k?: number }> = ({ f, at, r = 0.19, n = 84, floor = 0.1, k = 1 }) => {
  const H = at[1] - floor;
  return (
    <group>
      {Array.from({ length: n }).map((_, i) => {
        const a = hash(i, 1) * TAU, rr = r * Math.sqrt(hash(i, 2));
        const sp = 0.085 + 0.035 * hash(i, 3), len = 0.1 + 0.1 * hash(i, 4);
        const y = at[1] - ((f * sp + hash(i, 5) * H) % H);
        return (
          <mesh key={i} position={[at[0] + Math.cos(a) * rr * (1 + (at[1] - y) * 0.12), y, at[2] + Math.sin(a) * rr * (1 + (at[1] - y) * 0.12)]}>
            <cylinderGeometry args={[0.009, 0.009, len, 5]} />
            <meshStandardMaterial color="#f3efe4" emissive="#ffe9cc" emissiveIntensity={0.75} transparent opacity={0.74 * k} roughness={0.2} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

// droplets that bounce off whatever the water lands on (his head and shoulders)
export const Splash: React.FC<{ f: number; at: V3; r?: number; n?: number }> = ({ f, at, r = 0.3, n = 12 }) => (
  <group>
    {Array.from({ length: n }).map((_, i) => {
      const t = ((f + hash(i, 7) * 13) % 13) / 13, a = hash(i + Math.floor((f + hash(i, 7) * 13) / 13) * 17, 8) * TAU;
      const d = r * (0.55 + 0.6 * t);
      return (
        <mesh key={i} position={[at[0] + Math.cos(a) * d, at[1] + 0.2 * t - 0.42 * t * t, at[2] + Math.sin(a) * d]} scale={1 - 0.6 * t}>
          <sphereGeometry args={[0.02, 8, 6]} />
          <meshStandardMaterial color="#f3efe4" emissive="#ffe9cc" emissiveIntensity={0.6} transparent opacity={0.8} roughness={0.2} depthWrite={false} />
        </mesh>
      );
    })}
  </group>
);

const usePuffTex = () =>
  useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const x = c.getContext("2d")!;
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,240,222,0.9)"); g.addColorStop(0.4, "rgba(255,240,222,0.4)"); g.addColorStop(1, "rgba(255,240,222,0)");
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
  }, []);

// soft puffs that rise, widen and thin out
export const Steam: React.FC<{ f: number; at: V3; spread?: number; rise?: number; n?: number; k?: number; size?: number }> = ({ f, at, spread = 0.9, rise = 1.7, n = 9, k = 1, size = 0.7 }) => {
  const tex = usePuffTex();
  return (
    <group>
      {Array.from({ length: n }).map((_, i) => {
        const p = (f * (0.006 + 0.004 * hash(i, 11)) + hash(i, 12)) % 1;
        const s = size * (0.55 + 0.9 * p) * (0.8 + 0.4 * hash(i, 13));
        return (
          <sprite key={i} position={[at[0] + (hash(i, 14) - 0.5) * spread + Math.sin(f * 0.03 + i * 1.7) * 0.06, at[1] + p * rise, at[2] + (hash(i, 15) - 0.5) * 0.3]} scale={[s, s, 1]}>
            <spriteMaterial map={tex} transparent opacity={0.3 * k * Math.sin(p * Math.PI)} depthWrite={false} />
          </sprite>
        );
      })}
    </group>
  );
};

// a hummed note: gold, floating
export const Note: React.FC<{ pos: V3; s?: number; rotZ?: number; k?: number }> = ({ pos, s = 1, rotZ = 0, k = 1 }) =>
  k <= 0.02 ? null : (
    <group position={pos} rotation={[0, 0.2, rotZ]} scale={s * k}>
      <Ball pos={[0, 0, 0]} r={0.045} c="#e9b85a" emissive="#ffac3c" ei={1.1} scale={[1.25, 0.9, 0.8]} shadow={false} />
      <RBox size={[0.016, 0.2, 0.016]} pos={[0.047, 0.1, 0]} c="#e9b85a" emissive="#ffac3c" ei={1.1} r={0.006} shadow={false} />
      <RBox size={[0.085, 0.03, 0.016]} pos={[0.085, 0.18, 0]} rot={[0, 0, -0.45]} c="#e9b85a" emissive="#ffac3c" ei={1.1} r={0.008} shadow={false} />
    </group>
  );

// ---------- the bathroom ----------
export const HIM: V3 = [-0.1, 0.08, -0.42]; // where he stands, under the shower head
export const BOTTLE: V3 = [0.57, 1.05, 0.0]; // the shampoo, on the end of the ledge
export const HEAD_Y = 2.14; // the shower head

const useTiles = (w: number, h: number, seed: number) => {
  const tex = useMemo(() => {
    const S = 360, T = 0.235 * S;
    const c = document.createElement("canvas"); c.width = Math.round(w * S); c.height = Math.round(h * S);
    const x = c.getContext("2d")!;
    x.fillStyle = "#5e382e"; x.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i * T < c.width; i++)
      for (let j = 0; j * T < c.height; j++) {
        x.fillStyle = mix("#7a4a3c", "#8a5646", hash(i * 31 + j, seed));
        x.beginPath(); x.roundRect(i * T + 3, c.height - (j + 1) * T + 3, T - 6, T - 6, 5); x.fill();
      }
    const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; return t;
  }, [w, h, seed]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
};

// his count, finger-written in the steam on the tiles: the fog is light, the strokes show the wall through it
const useTally = (fonts: boolean) => {
  const tex = useMemo(() => {
    const W = 640, H = 480;
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const x = c.getContext("2d")!;
    x.filter = "blur(26px)";
    x.fillStyle = "rgba(255,241,224,0.95)";
    x.beginPath(); x.roundRect(52, 56, W - 104, H - 112, 90); x.fill();
    x.filter = "none";
    x.globalCompositeOperation = "destination-out";
    x.lineCap = "round"; x.lineJoin = "round"; x.textAlign = "center"; x.textBaseline = "middle";
    x.font = "700 168px Caveat"; x.fillStyle = "#000"; x.strokeStyle = "#000"; x.lineWidth = 7;
    x.fillText("won: 312", W / 2, 170); x.strokeText("won: 312", W / 2, 170);
    // two gates of five and two more: ...312
    x.lineWidth = 15;
    const gate = (x0: number, n: number) => {
      for (let i = 0; i < n; i++) { x.beginPath(); x.moveTo(x0 + i * 30, 286 + (i % 2) * 5); x.lineTo(x0 + i * 30 + 4, 388 - (i % 2) * 4); x.stroke(); }
      if (n === 4) { x.beginPath(); x.moveTo(x0 - 20, 376); x.lineTo(x0 + 112, 300); x.stroke(); }
    };
    gate(112, 4); gate(292, 4); gate(468, 2);
    // drips
    x.lineWidth = 6; x.globalAlpha = 0.75;
    [[150, 232, 60], [334, 236, 34], [470, 230, 78], [206, 392, 44], [502, 390, 52]].forEach(([dx, dy, dl]) => { x.beginPath(); x.moveTo(dx, dy); x.lineTo(dx, dy + dl); x.stroke(); });
    const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; return t;
  }, [fonts]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
};

export const ShampooBottle: React.FC<{ pos: V3; rotY?: number }> = ({ pos, rotY = 0 }) => (
  <group position={pos} rotation={[0, rotY, 0]}>
    <Cyl pos={[0, 0.105, 0]} r={0.066} h={0.21} c={GOLD} />
    <Ball pos={[0, 0.21, 0]} r={0.066} c={GOLD} scale={[1, 0.45, 1]} />
    <Cyl pos={[0, 0.105, 0]} r={0.068} h={0.09} c={CREAM} />
    <Cyl pos={[0, 0.262, 0]} r={0.022} h={0.06} c={INK} />
    <RBox size={[0.11, 0.028, 0.04]} pos={[-0.03, 0.3, 0]} c={INK} r={0.012} />
  </group>
);

// dawn: 0 night .. 1 sunrise. tally: how much of his count is still on the wall. water: the shower running.
export const Bathroom: React.FC<{ f: number; fonts: boolean; dawn?: number; tally?: number; water?: number; steam?: number; children?: React.ReactNode }> = ({ f, fonts, dawn = 0, tally = 1, water = 1, steam = 1, children }) => {
  const back = useTiles(2.82, 2.3, 1), side = useTiles(2.02, 2.3, 2), tallyTex = useTally(fonts);
  return (
    <group>
      {/* shell: tiled walls, warm floor */}
      <RBox size={[2.96, 0.3, 2.16]} pos={[0, -0.15, 0]} c="#6b4838" r={0.04} />
      <RBox size={[2.96, 2.5, 0.14]} pos={[0, 1.1, -1.08]} c="#6a4034" r={0.04} />
      <RBox size={[0.14, 2.5, 2.16]} pos={[-1.48, 1.1, 0]} c="#603a30" r={0.04} />
      <mesh position={[0, 1.17, -1.008]} receiveShadow>
        <planeGeometry args={[2.82, 2.3]} />
        <meshStandardMaterial map={back} roughness={0.55} />
      </mesh>
      <mesh position={[-1.408, 1.17, 0.01]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[2.02, 2.3]} />
        <meshStandardMaterial map={side} roughness={0.55} />
      </mesh>
      {/* the walk-in shower: tray, a tiled half wall with a ledge, glass above it */}
      <RBox size={[1.9, 0.08, 1.14]} pos={[-0.46, 0.04, -0.44]} c={TRIM} r={0.03} />
      <Cyl pos={[HIM[0] - 0.32, 0.082, HIM[2] - 0.2]} r={0.05} h={0.006} c="#8f8474" />
      <RBox size={[0.18, 1.0, 1.14]} pos={[0.57, 0.5, -0.44]} c="#9a5a46" r={0.03} />
      <RBox size={[0.25, 0.05, 1.19]} pos={[0.57, 1.025, -0.44]} c={TRIM} r={0.02} />
      <mesh position={[0.57, 1.58, -0.66]}>
        <boxGeometry args={[0.02, 1.06, 0.7]} />
        <meshStandardMaterial color="#fff1dc" transparent opacity={0.16 + 0.05 * steam} roughness={0.25} depthWrite={false} />
      </mesh>
      <RBox size={[0.035, 0.035, 0.74]} pos={[0.57, 2.12, -0.66]} c={GOLD} r={0.012} />
      <RBox size={[0.035, 1.09, 0.035]} pos={[0.57, 1.59, -0.3]} c={GOLD} r={0.012} />
      <ShampooBottle pos={BOTTLE} rotY={-0.5} />
      <RBox size={[0.12, 0.045, 0.085]} pos={[0.57, 1.073, -0.24]} c="#fbf6ee" r={0.02} />
      {/* shower: valve, riser, arm, rain head */}
      <Cyl pos={[HIM[0], 1.12, -0.985]} r={0.06} h={0.04} c={GOLD} rot={[Math.PI / 2, 0, 0]} />
      <Stick a={[HIM[0], 1.12, -0.975]} b={[HIM[0], 2.24, -0.975]} r={0.018} c={GOLD} />
      <Stick a={[HIM[0], 2.24, -0.975]} b={[HIM[0], 2.24, HIM[2]]} r={0.018} c={GOLD} />
      <Cyl pos={[HIM[0], HEAD_Y + 0.05, HIM[2]]} r={0.03} h={0.1} c={GOLD} />
      <Cyl pos={[HIM[0], HEAD_Y, HIM[2]]} r={0.21} h={0.035} c={GOLD} />
      {/* his count */}
      {tally > 0.01 && (
        <mesh position={[-0.97, 1.74, -1.002]}>
          <planeGeometry args={[0.84, 0.63]} />
          <meshStandardMaterial map={tallyTex} transparent opacity={0.8 * tally} roughness={0.9} emissive="#ffe9d0" emissiveMap={tallyTex} emissiveIntensity={0.22} depthWrite={false} />
        </mesh>
      )}
      {/* the rest of the room: a small window, a towel on its rail, the mat */}
      <Window pos={[1.06, 1.72, -1.0]} sky={mix("#231b22", "#f6b58c", dawn)} glow={0.5 + dawn * 1.0} w={0.5} h={0.56} />
      <Stick a={[0.8, 1.02, -0.93]} b={[1.34, 1.02, -0.93]} r={0.014} c={GOLD} />
      {[0.8, 1.34].map((x) => <Stick key={x} a={[x, 1.02, -1.0]} b={[x, 1.02, -0.93]} r={0.012} c={GOLD} />)}
      <RBox size={[0.36, 0.56, 0.05]} pos={[1.07, 0.76, -0.92]} c={CREAM} r={0.02} />
      <RBox size={[0.36, 0.07, 0.052]} pos={[1.07, 0.6, -0.92]} c={TERRA} r={0.02} shadow={false} />
      <RBox size={[0.6, 0.03, 0.42]} pos={[1.02, 0.015, 0.2]} c={CREAM} r={0.014} />
      <Ball pos={[0.92, 0.065, 0.56]} r={0.07} c={GOLD} scale={[1, 0.55, 1.6]} />
      <Ball pos={[1.1, 0.065, 0.6]} r={0.07} c={GOLD} scale={[1, 0.55, 1.6]} />
      {/* ceiling light over the shower */}
      <Cyl pos={[-0.75, 2.3, 0.1]} r={0.13} h={0.05} c="#ffe9c8" emissive="#ffc27a" ei={1.5 - dawn * 1.2} />
      {children}
      {water > 0.02 && (
        <>
          <Rain f={f} at={[HIM[0], HEAD_Y - 0.03, HIM[2]]} floor={0.09} k={water} />
          <Splash f={f} at={[HIM[0], HIM[1] + 1.62, HIM[2]]} />
        </>
      )}
      {steam > 0.02 && <Steam f={f} at={[-0.5, 0.25, -0.5]} spread={1.5} rise={2.0} n={11} k={steam} size={0.85} />}
    </group>
  );
};

// warm night for every indoor set: low sky, a soft warm key, a lamp at `lamp`, and a fill from the front so his face reads
export const WarmNight: React.FC<{ k?: number; lamp?: V3; li?: number }> = ({ k = 1, lamp = [-0.75, 2.1, 0.2], li = 7 }) =>
  k <= 0.001 ? null : (
    <>
      <hemisphereLight args={["#9a7460", "#1c1410", 0.8 * k]} />
      <directionalLight position={[2.5, 5, 5]} color="#ffdcbc" intensity={0.95 * k} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0005} shadow-normalBias={0.02}>
        <orthographicCamera attach="shadow-camera" args={[-3.2, 3.2, 3.2, -3.2, 0.5, 24]} />
      </directionalLight>
      <pointLight position={lamp} color="#ffb060" intensity={li * k} distance={5.5} decay={1.6} />
      <pointLight position={[0.6, 1.4, 1.9]} color="#ffd2a6" intensity={3.0 * k} distance={6} decay={1.6} />
    </>
  );

// ---------- the car park ----------
// a small open-top car, nose towards +z; the driver sits on its right
export const Car: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <group>
    {[-1, 1].map((sx) => [-1, 1].map((sz) => (
      <group key={`${sx}${sz}`} position={[sx * 0.5, 0.19, sz * 0.62]}>
        <Cyl pos={[0, 0, 0]} r={0.19} h={0.15} c={INK} rot={[0, 0, Math.PI / 2]} />
        <Cyl pos={[sx * 0.078, 0, 0]} r={0.085} h={0.02} c={TRIM} rot={[0, 0, Math.PI / 2]} />
      </group>
    )))}
    <RBox size={[1.02, 0.36, 1.96]} pos={[0, 0.43, 0]} c={EMBER} r={0.14} />
    <RBox size={[0.86, 0.04, 0.84]} pos={[0, 0.598, -0.3]} c="#241a15" r={0.015} shadow={false} />
    {[-1, 1].map((s) => (
      <group key={s}>
        <RBox size={[0.36, 0.56, 0.11]} pos={[s * 0.22, 0.84, -0.8]} rot={[-0.1, 0, 0]} c={CREAM} r={0.05} />
        <RBox size={[0.22, 0.14, 0.09]} pos={[s * 0.22, 1.19, -0.84]} c={CREAM} r={0.04} />
      </group>
    ))}
    <RBox size={[0.9, 0.12, 0.16]} pos={[0, 0.655, 0.2]} c="#241a15" r={0.04} />
    <mesh position={[-0.22, 0.82, 0.03]} rotation={[-0.5, 0, 0]} castShadow>
      <torusGeometry args={[0.11, 0.018, 8, 24]} />
      <M c={INK} />
    </mesh>
    <Stick a={[-0.22, 0.68, 0.16]} b={[-0.22, 0.82, 0.03]} r={0.014} c={INK} />
    {/* windscreen */}
    {[-1, 1].map((s) => <Stick key={s} a={[s * 0.47, 0.6, 0.36]} b={[s * 0.44, 1.12, 0.22]} r={0.022} c={INK} />)}
    <Stick a={[-0.44, 1.12, 0.22]} b={[0.44, 1.12, 0.22]} r={0.022} c={INK} />
    <mesh position={[0, 0.86, 0.29]} rotation={[-0.265, 0, 0]}>
      <planeGeometry args={[0.88, 0.52]} />
      <meshStandardMaterial color="#fff1dc" transparent opacity={0.14} roughness={0.2} depthWrite={false} side={2} />
    </mesh>
    <mesh position={[0.12, 0.88, 0.292]} rotation={[-0.265, 0, -0.5]}>
      <planeGeometry args={[0.07, 0.62]} />
      <meshBasicMaterial color="#fff1dc" transparent opacity={0.1} depthWrite={false} side={2} />
    </mesh>
    {/* lamps, bumper, mirror */}
    {[-1, 1].map((s) => <Ball key={s} pos={[s * 0.33, 0.47, 0.955]} r={0.08} c="#fff3d0" emissive="#ffd98a" ei={0.35} scale={[1, 1, 0.5]} />)}
    <RBox size={[0.92, 0.07, 0.07]} pos={[0, 0.3, 0.97]} c={TRIM} r={0.025} />
    <RBox size={[0.3, 0.09, 0.03]} pos={[0, 0.44, 0.985]} c="#241a15" r={0.012} />
    <RBox size={[0.07, 0.06, 0.1]} pos={[-0.56, 0.68, 0.26]} c={EMBER} r={0.02} />
    {children}
  </group>
);

export const CarPark: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <group>
    <RBox size={[2.96, 0.3, 2.16]} pos={[0, -0.15, 0]} c="#5a4a41" r={0.04} />
    {/* a brick wall behind the bays, bay lines, the sign, the street lamp he is parked under */}
    <RBox size={[2.96, 1.75, 0.14]} pos={[0, 0.725, -1.08]} c="#7d4a3c" r={0.04} />
    <RBox size={[2.96, 0.07, 0.2]} pos={[0, 1.62, -1.08]} c={TRIM} r={0.025} />
    <Stick a={[-1.12, 0, -0.9]} b={[-1.12, 1.95, -0.9]} r={0.022} c="#4a3c34" />
    <RBox size={[0.34, 0.34, 0.03]} pos={[-1.12, 2.02, -0.88]} c={TERRA} r={0.03} />
    <RBox size={[0.045, 0.2, 0.012]} pos={[-1.17, 2.02, -0.862]} c={TRIM} r={0.005} shadow={false} />
    <mesh position={[-1.115, 2.065, -0.862]}>
      <torusGeometry args={[0.052, 0.02, 8, 20]} />
      <M c={TRIM} />
    </mesh>
    {[-1.05, 1.12].map((x) => <RBox key={x} size={[0.05, 0.012, 1.7]} pos={[x, 0.004, 0.05]} rot={[0, 0.8, 0]} c={TRIM} r={0.004} shadow={false} />)}
    <RBox size={[2.9, 0.12, 0.2]} pos={[0, 0.06, -0.95]} c="#8f7e6c" r={0.03} />
    <Stick a={[1.2, 0, -0.85]} b={[1.2, 2.0, -0.85]} r={0.03} c="#4a3c34" />
    <Stick a={[1.2, 2.0, -0.85]} b={[0.9, 2.08, -0.7]} r={0.024} c="#4a3c34" />
    <Ball pos={[0.88, 2.04, -0.69]} r={0.1} c="#fff3d0" emissive="#ffd98a" ei={1.6} scale={[1.2, 0.6, 1.2]} shadow={false} />
    <Cyl pos={[1.2, 0.05, -0.85]} r={0.08} h={0.1} c="#2a211b" />
    {children}
  </group>
);

// ---------- the gym ----------
export const Barbell: React.FC<{ pos: V3 }> = ({ pos }) => (
  <group position={pos}>
    <Cyl pos={[0, 0, 0]} r={0.018} h={1.36} c={GOLD} rot={[0, 0, Math.PI / 2]} />
    {[-1, 1].map((s) => (
      <group key={s}>
        <Cyl pos={[s * 0.52, 0, 0]} r={0.17} h={0.05} c={INK} rot={[0, 0, Math.PI / 2]} />
        <Cyl pos={[s * 0.585, 0, 0]} r={0.13} h={0.045} c={TERRA} rot={[0, 0, Math.PI / 2]} />
        <Cyl pos={[s * 0.63, 0, 0]} r={0.035} h={0.04} c={GOLD} rot={[0, 0, Math.PI / 2]} />
      </group>
    ))}
  </group>
);

export const GymCorner: React.FC<{ f: number; children?: React.ReactNode }> = ({ f, children }) => (
  <group>
    <Room floor="#9a7250" wall="#6a4238" wall2="#5d3a32" />
    <RBox size={[1.7, 0.03, 0.8]} pos={[-0.1, 0.016, 0.2]} c={TERRA} r={0.012} />
    {/* plate tree, a bench, a kettlebell, a water bottle */}
    <Cyl pos={[1.08, 0.03, -0.62]} r={0.2} h={0.06} c={INK} />
    <Stick a={[1.08, 0, -0.62]} b={[1.08, 1.25, -0.62]} r={0.024} c={INK} />
    {[0.36, 0.62, 0.88].map((y, i) => (
      <group key={y}>
        <Stick a={[0.86, y, -0.62]} b={[1.3, y, -0.62]} r={0.016} c={GOLD} />
        <Cyl pos={[0.9, y, -0.62]} r={0.17 - i * 0.025} h={0.05} c={i === 1 ? TERRA : "#241d19"} rot={[0, 0, Math.PI / 2]} />
        <Cyl pos={[1.26, y, -0.62]} r={0.17 - i * 0.025} h={0.05} c={i === 1 ? TERRA : "#241d19"} rot={[0, 0, Math.PI / 2]} />
      </group>
    ))}
    <RBox size={[0.36, 0.09, 0.9]} pos={[-1.08, 0.43, -0.3]} c="#c9764f" r={0.035} />
    {[-0.66, 0.06].map((z) => [-1.2, -0.96].map((x) => <RBox key={`${x}${z}`} size={[0.05, 0.4, 0.05]} pos={[x, 0.2, z]} c={INK} r={0.012} />))}
    <Ball pos={[1.12, 0.1, 0.36]} r={0.105} c={INK} />
    <mesh position={[1.12, 0.21, 0.36]} castShadow>
      <torusGeometry args={[0.055, 0.016, 8, 20]} />
      <M c={GOLD} />
    </mesh>
    <Cyl pos={[-1.08, 0.57, -0.52]} r={0.04} h={0.19} c={CREAM} />
    <Cyl pos={[-1.08, 0.68, -0.52]} r={0.025} h={0.04} c={EMBER} />
    {[-0.62, 0.62].map((x) => (
      <group key={x}>
        <Stick a={[x, 2.5, 0.05]} b={[x, 2.12, 0.05]} r={0.008} c="#2a211b" />
        <Cyl pos={[x, 2.05, 0.05]} r={0.17} r2={0.05} h={0.16} c={GOLD} emissive="#ffb86a" ei={1.3 + 0.08 * Math.sin(f * 0.1 + x)} />
      </group>
    ))}
    {children}
  </group>
);

// ---------- his living room, and the lamp ----------
export const LAMP: V3 = [0.56, 0, 0.3];
export const LampRoom: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <group>
    <Room floor="#5e4232" wall="#52362c" wall2="#472f27" />
    <Cyl pos={[0.1, 0.012, 0.2]} r={0.95} h={0.024} c="#d8c3a2" />
    {/* armchair, a side table with a mug, a picture */}
    <group position={[-1.0, 0, -0.55]} rotation={[0, 0.35, 0]}>
      <RBox size={[0.7, 0.26, 0.66]} pos={[0, 0.2, 0]} c={TERRA} r={0.07} />
      <RBox size={[0.7, 0.6, 0.18]} pos={[0, 0.58, -0.25]} c={TERRA} r={0.08} />
      {[-1, 1].map((s) => <RBox key={s} size={[0.15, 0.4, 0.66]} pos={[s * 0.36, 0.36, 0]} c="#a85a40" r={0.07} />)}
      <RBox size={[0.3, 0.28, 0.12]} pos={[0.02, 0.5, -0.1]} rot={[-0.2, 0, 0.12]} c={GOLD} r={0.05} />
    </group>
    <Cyl pos={[1.12, 0.48, -0.66]} r={0.2} h={0.04} c={WOOD} />
    <Cyl pos={[1.12, 0.24, -0.66]} r={0.025} h={0.46} c={DARKWOOD} />
    <Cyl pos={[1.12, 0.02, -0.66]} r={0.13} h={0.04} c={DARKWOOD} />
    <Cyl pos={[1.12, 0.55, -0.66]} r={0.045} h={0.1} c={EMBER} />
    <RBox size={[0.62, 0.46, 0.04]} pos={[0.28, 1.72, -0.99]} c={TRIM} r={0.015} />
    <RBox size={[0.54, 0.38, 0.03]} pos={[0.28, 1.72, -0.975]} c="#b5654a" r={0.01} shadow={false} />
    <Ball pos={[0.4, 1.78, -0.965]} r={0.07} c={GOLD} scale={[1, 1, 0.1]} shadow={false} />
    <RBox size={[0.54, 0.12, 0.03]} pos={[0.28, 1.59, -0.972]} c={DARKWOOD} r={0.01} shadow={false} />
    {/* the lamp. just a lamp. */}
    <group position={LAMP}>
      <Cyl pos={[0, 0.025, 0]} r={0.17} h={0.05} c="#2a211b" />
      <Stick a={[0, 0, 0]} b={[0, 1.42, 0]} r={0.02} c="#2a211b" />
      <Cyl pos={[0, 1.56, 0]} r={0.25} r2={0.15} h={0.34} c="#ffe2b4" emissive="#ffb86a" ei={1.25} />
      <Cyl pos={[0, 1.43, 0]} r={0.03} h={0.05} c={GOLD} />
      <pointLight position={[0, 1.3, 0.1]} color="#ffb86a" intensity={5} distance={4} decay={1.6} />
    </group>
    {children}
  </group>
);
