// Sets and props for "audience of one": the man, his home-gym corner with a working mirror, his night bedroom,
// and the things he poses with. Colours stay in the brand family; violet is kept for Worry alone.
import { Ball, Cyl, M, RBox, Stick, V3 } from "./parts";
import { Room, Window } from "./sets";
import { Pose, Woman as Person } from "./Woman";

const INK = "#2a2420", EMBER = "#d9643a", GOLD = "#d9b26a", CREAM = "#f1e6d6", WOOD = "#7a5640", DARKWOOD = "#4f382a", TERRA = "#b5654a";

// ---------- rig: groups that follow the Person's body, head or hand, so props can ride along ----------
export type Rig = { pos: V3; rotY?: number; rotX?: number; pose?: Pose };
const armOf = (pose: Pose, s: 1 | -1): [number, number] => {
  const sw = pose.walk !== undefined ? Math.sin(pose.walk) * 0.62 : 0;
  return s === 1 ? pose.armL ?? [sw * 0.8, 0.14] : pose.armR ?? [-sw * 0.8, 0.14];
};
export const OnBody: React.FC<Rig & { children?: React.ReactNode }> = ({ pos, rotY = 0, rotX = 0, pose = {}, children }) => {
  const bob = pose.walk !== undefined ? Math.abs(Math.cos(pose.walk)) * 0.035 : 0;
  return (
    <group position={[pos[0], pos[1] + bob, pos[2]]} rotation={[rotX, rotY, 0]}>
      <group position={[0, (pose.sit ? 0.09 : 0.52) - 0.52, 0]}>{children}</group>
    </group>
  );
};
export const OnHead: React.FC<Rig & { children?: React.ReactNode }> = ({ children, ...rig }) => (
  <OnBody {...rig}>
    <group position={[0, 1.37, 0]} rotation={[rig.pose?.headTilt ?? 0, rig.pose?.headTurn ?? 0, 0]}>{children}</group>
  </OnBody>
);
// side 1 = his left hand, -1 = his right. upright: children keep the body's orientation instead of the arm's.
export const OnHand: React.FC<Rig & { side: 1 | -1; upright?: boolean; children?: React.ReactNode }> = ({ side, upright, children, ...rig }) => {
  const a = armOf(rig.pose ?? {}, side);
  return (
    <OnBody {...rig}>
      <group position={[side * 0.25, 0.99, 0]} rotation={[a[0], 0, side * a[1]]}>
        <group position={[0, -0.41, 0]}>
          {upright ? (
            <group rotation={[0, 0, -side * a[1]]}>
              <group rotation={[-a[0], 0, 0]}>{children}</group>
            </group>
          ) : children}
        </group>
      </group>
    </OnBody>
  );
};

// ---------- the man ----------
export type Kit = "gym" | "bed" | "run";
const KIT: Record<Kit, { top: string; legs: string }> = {
  gym: { top: "#efe2cc", legs: "#3a2c2a" },
  bed: { top: "#d8c3a2", legs: "#4a3a36" },
  run: { top: EMBER, legs: "#2f2622" },
};
export const SKIN = "#8f5e3e", HAIR = "#1f1613";

// cut 0 = grown-out hair, 1 = the fresh haircut (quiff). flex 0..1 draws the raised forearm on his left arm.
export const Man: React.FC<Rig & { kit?: Kit; cut?: number; band?: boolean; flex?: number; pump?: number; cape?: boolean }> = ({ kit = "gym", cut = 0, band, flex = 0, pump = 0, cape, ...rig }) => {
  const k = KIT[kit];
  const a1 = armOf(rig.pose ?? {}, 1)[1];
  const shag = 1 - cut;
  return (
    <>
      <Person pos={rig.pos} rotY={rig.rotY} rotX={rig.rotX} pose={rig.pose} bun={false} jumper={k.top} trousers={k.legs} skin={SKIN} hair={HAIR} />
      <OnHead {...rig}>
        {shag > 0.03 && (
          <group>
            <Ball pos={[0.03, 0.2, 0.2]} r={0.105 * shag} c={HAIR} scale={[1.7, 0.62, 1]} />
            <Ball pos={[-0.25, 0.0, -0.1]} r={0.1 * shag} c={HAIR} />
            <Ball pos={[0.25, 0.0, -0.1]} r={0.1 * shag} c={HAIR} />
            <Ball pos={[0, -0.13, -0.27]} r={0.13 * shag} c={HAIR} scale={[1.5, 1, 1]} />
          </group>
        )}
        {cut > 0.03 && (
          <group scale={[1, cut, 1]} position={[0, 0.2, 0]}>
            <RBox size={[0.47, 0.17, 0.45]} pos={[0, 0.085, -0.04]} c={HAIR} r={0.08} />
          </group>
        )}
        {band && (
          <mesh position={[0, 0.115, -0.045]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.283, 0.034, 10, 36]} />
            <M c={CREAM} />
          </mesh>
        )}
      </OnHead>
      {flex > 0.03 && (
        <>
          <OnHand {...rig} side={1} upright>
            <group scale={flex}>
              <mesh position={[0, 0.16, 0]} castShadow>
                <capsuleGeometry args={[0.062, 0.2, 8, 14]} />
                <M c={SKIN} rough={0.7} />
              </mesh>
              <Ball pos={[0, 0.34, 0]} r={0.082} c={SKIN} />
            </group>
          </OnHand>
          <OnBody {...rig}>
            <Ball pos={[0.25 + 0.21 * Math.sin(a1), 0.99 - 0.21 * Math.cos(a1) + 0.055 * flex, 0]} r={(0.07 + 0.025 * pump) * flex} c={k.top} />
          </OnBody>
        </>
      )}
      {cape && (
        <OnBody {...rig}>
          <Cyl pos={[0, 0.76, 0]} r={0.43} r2={0.15} h={0.7} c="#f6ecdc" />
          <Cyl pos={[0, 1.11, 0]} r={0.16} h={0.05} c={TERRA} />
        </OnBody>
      )}
    </>
  );
};

// ---------- small props ----------
// screen on local +z, lens and flash on the back. flash 0..1 is the pop of light.
export const Phone3D: React.FC<{ pos?: V3; rot?: V3; glow?: number; flash?: number; s?: number }> = ({ pos = [0, 0, 0], rot = [0, 0, 0], glow = 1, flash = 0, s = 1 }) => (
  <group position={pos} rotation={rot} scale={s}>
    <RBox size={[0.145, 0.275, 0.024]} c="#c9583a" r={0.01} />
    <mesh position={[0, 0, 0.0128]}>
      <planeGeometry args={[0.125, 0.25]} />
      <M c="#fff1d8" emissive="#ffe2b4" ei={1.3 * glow} />
    </mesh>
    <Cyl pos={[-0.03, 0.08, -0.014]} r={0.03} h={0.008} c="#241d19" rot={[Math.PI / 2, 0, 0]} />
    <Cyl pos={[-0.03, 0.08, -0.017]} r={0.016} h={0.008} c={GOLD} rot={[Math.PI / 2, 0, 0]} />
    <Ball pos={[0.03, 0.095, -0.014]} r={0.011 + 0.055 * flash} c="#fff6e0" emissive="#fff3d2" ei={1 + 5 * flash} shadow={false} />
    {flash > 0.02 && (
      <group position={[0.03, 0.095, -0.03]} rotation={[0, 0, 0.4]}>
        <RBox size={[0.42 * flash, 0.014, 0.01]} c="#fff6e0" emissive="#fff3d2" ei={5} r={0.004} shadow={false} />
        <RBox size={[0.014, 0.42 * flash, 0.01]} c="#fff6e0" emissive="#fff3d2" ei={5} r={0.004} shadow={false} />
      </group>
    )}
    <pointLight position={[0.03, 0.1, -0.25]} color="#fff0d0" intensity={4 * flash} distance={3} decay={1.5} />
  </group>
);

export const Dumbbell: React.FC<{ pos?: V3; rot?: V3; s?: number }> = ({ pos = [0, 0, 0], rot = [0, 0, 0], s = 1 }) => (
  <group position={pos} rotation={rot} scale={s}>
    <Cyl pos={[0, 0, 0]} r={0.02} h={0.22} c={GOLD} rot={[0, 0, Math.PI / 2]} />
    {[-1, 1].map((x) => (
      <Cyl key={x} pos={[x * 0.115, 0, 0]} r={0.068} h={0.075} c={INK} rot={[0, 0, Math.PI / 2]} />
    ))}
  </group>
);

// a gold glint; s scales it (0 hides it)
export const Sparkle: React.FC<{ pos: V3; s: number }> = ({ pos, s }) =>
  s <= 0.02 ? null : (
    <group position={pos} scale={s} rotation={[0.3, 0.5, 0.2]}>
      <RBox size={[0.2, 0.022, 0.022]} c="#ffe2a8" emissive="#ffc978" ei={2.4} r={0.008} shadow={false} />
      <RBox size={[0.022, 0.2, 0.022]} c="#ffe2a8" emissive="#ffc978" ei={2.4} r={0.008} shadow={false} />
      <RBox size={[0.022, 0.022, 0.2]} c="#ffe2a8" emissive="#ffc978" ei={2.4} r={0.008} shadow={false} />
      <Ball pos={[0, 0, 0]} r={0.035} c="#ffe2a8" emissive="#ffc978" ei={2.4} shadow={false} />
    </group>
  );

export const Tripod: React.FC<{ pos: V3; rotY?: number; flash?: number }> = ({ pos, rotY = 0, flash = 0 }) => (
  <group position={pos} rotation={[0, rotY, 0]}>
    {[0, 2.1, 4.2].map((a) => (
      <Stick key={a} a={[Math.cos(a) * 0.24, 0, Math.sin(a) * 0.24]} b={[0, 1.02, 0]} r={0.014} c={INK} />
    ))}
    <Ball pos={[0, 1.04, 0]} r={0.04} c={INK} />
    {/* the phone looks along -z of the tripod */}
    <Phone3D pos={[0, 1.2, 0]} flash={flash} glow={0.9} />
  </group>
);

export const SaladTable: React.FC<{ pos: V3; lit?: number }> = ({ pos, lit = 0 }) => (
  <group position={pos}>
    <Cyl pos={[0, 0.72, 0]} r={0.36} h={0.05} c={CREAM} />
    <Cyl pos={[0, 0.36, 0]} r={0.032} h={0.7} c={INK} />
    <Cyl pos={[0, 0.02, 0]} r={0.22} h={0.04} c={INK} />
    {/* bowl */}
    <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
      <sphereGeometry args={[0.17, 28, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
      <M c="#fbf6ee" />
    </mesh>
    <Cyl pos={[0, 0.885, 0]} r={0.165} h={0.02} c="#74845c" />
    {[[0, 0.92, 0, 0.075], [-0.08, 0.91, 0.04, 0.06], [0.08, 0.91, -0.03, 0.065], [0.02, 0.9, 0.09, 0.055], [-0.03, 0.9, -0.09, 0.06]].map((p, i) => (
      <Ball key={i} pos={[p[0], p[1], p[2]]} r={p[3]} c={i % 2 ? "#74845c" : "#869668"} scale={[1.1, 0.75, 1.1]} />
    ))}
    {[[0.06, 0.955, 0.05], [-0.07, 0.95, -0.03], [0.0, 0.965, -0.07]].map((p, i) => (
      <Ball key={i} pos={[p[0], p[1], p[2]]} r={0.028} c={EMBER} />
    ))}
    {/* fork, napkin */}
    <RBox size={[0.03, 0.01, 0.2]} pos={[0.24, 0.75, 0.05]} rot={[0, 0.3, 0]} c={GOLD} r={0.004} />
    <RBox size={[0.14, 0.012, 0.14]} pos={[-0.22, 0.75, 0.12]} rot={[0, 0.5, 0]} c={TERRA} r={0.004} />
    <pointLight position={[0, 1.25, 0.1]} color="#fff0d0" intensity={5 * lit} distance={2.2} decay={1.5} />
  </group>
);

const wedge = (r: number, h: number, from: number, len: number, c: string, y: number) => (
  <mesh position={[0, y, 0]} castShadow receiveShadow>
    <cylinderGeometry args={[r, r, h, 28, 1, false, from, len]} />
    <M c={c} />
  </mesh>
);
export const PizzaSlice: React.FC<{ pos?: V3; rot?: V3; s?: number }> = ({ pos = [0, 0, 0], rot = [0, 0, 0], s = 1 }) => (
  <group position={pos} rotation={rot} scale={s}>
    {wedge(0.2, 0.022, -0.5, 1.0, "#e3b45a", 0)}
    {wedge(0.165, 0.026, -0.42, 0.84, "#d9643a", 0.002)}
    <Ball pos={[0.0, 0.016, 0.1]} r={0.022} c="#b84e2a" scale={[1, 0.4, 1]} shadow={false} />
    <Ball pos={[0.03, 0.016, 0.05]} r={0.016} c="#f6e3b0" scale={[1, 0.4, 1]} shadow={false} />
  </group>
);
export const PizzaBox: React.FC<{ pos: V3; rotY?: number }> = ({ pos, rotY = 0 }) => (
  <group position={pos} rotation={[0, rotY, 0]}>
    <RBox size={[0.5, 0.04, 0.5]} pos={[0, 0.02, 0]} c="#c9a27a" r={0.012} />
    <group position={[0, 0.04, -0.25]} rotation={[-1.25, 0, 0]}>
      <RBox size={[0.5, 0.02, 0.5]} pos={[0, 0, -0.25]} c="#c9a27a" r={0.008} />
      <Cyl pos={[0, 0.012, -0.25]} r={0.09} h={0.006} c={EMBER} />
    </group>
    <group position={[0, 0.045, 0]}>
      {wedge(0.21, 0.02, 0.6, Math.PI * 2 - 1.1, "#e3b45a", 0)}
      {wedge(0.175, 0.024, 0.66, Math.PI * 2 - 1.22, "#d9643a", 0.002)}
      {[[0.08, 0.06], [-0.07, 0.08], [-0.09, -0.05], [0.0, -0.1], [-0.01, 0.01]].map(([x, z], i) => (
        <Ball key={i} pos={[x, 0.016, z]} r={0.024} c="#b84e2a" scale={[1, 0.4, 1]} shadow={false} />
      ))}
    </group>
  </group>
);

const Plant: React.FC<{ pos: V3; s?: number }> = ({ pos, s = 1 }) => (
  <group position={pos} scale={s}>
    <Cyl pos={[0, 0.13, 0]} r={0.1} r2={0.13} h={0.26} c={TERRA} />
    {[[0, 0.45, 0, 0.17], [-0.12, 0.36, 0.05, 0.12], [0.12, 0.38, -0.03, 0.13], [0.03, 0.6, 0.02, 0.11]].map((p, i) => (
      <Ball key={i} pos={[p[0], p[1], p[2]]} r={p[3]} c={i % 2 ? "#74845c" : "#869668"} />
    ))}
  </group>
);

// ---------- the home-gym corner ----------
// The mirror is real: everything passed as children (and the room's own props) is drawn a second time,
// flipped through the mirror plane, behind an opening in the back wall.
const ZM = -1.01; // mirror plane
const MX0 = -1.08, MX1 = 0.85, MY0 = 0.2, MY1 = 2.02; // the opening
const G_FLOOR = "#9a7250", G_WALL = "#6a4238", G_WALL2 = "#5d3a32";
export const Gym: React.FC<{ f: number; bench?: boolean; children?: React.ReactNode }> = ({ f, bench = true, children }) => {
  const mw = MX1 - MX0, mh = MY1 - MY0, mcx = (MX0 + MX1) / 2, mcy = (MY0 + MY1) / 2;
  const props = (
    <>
      {/* mat */}
      <RBox size={[1.5, 0.03, 0.72]} pos={[-0.3, 0.016, 0.12]} c={TERRA} r={0.012} />
      {/* dumbbell rack on the side wall */}
      <RBox size={[0.3, 0.05, 0.86]} pos={[-1.2, 0.34, -0.38]} c={WOOD} r={0.015} />
      {[-0.76, 0.0].map((z) => <RBox key={z} size={[0.26, 0.34, 0.05]} pos={[-1.2, 0.17, z]} c={DARKWOOD} r={0.012} />)}
      {[-0.66, -0.38, -0.1].map((z, i) => <Dumbbell key={z} pos={[-1.2, 0.44, z]} rot={[0, 0.0, 0]} s={0.95 - i * 0.1} />)}
      {/* kettlebell */}
      <Ball pos={[-1.12, 0.1, 0.42]} r={0.105} c={INK} />
      <mesh position={[-1.12, 0.21, 0.42]} castShadow>
        <torusGeometry args={[0.055, 0.016, 8, 20]} />
        <M c={GOLD} />
      </mesh>
      {bench && (
        <group>
          <RBox size={[0.9, 0.09, 0.36]} pos={[0.78, 0.43, 0.3]} c="#c9764f" r={0.035} />
          {[[0.42, 0.16], [0.42, 0.44], [1.14, 0.16], [1.14, 0.44]].map(([x, z], i) => <RBox key={i} size={[0.05, 0.4, 0.05]} pos={[x, 0.2, z]} c={INK} r={0.012} />)}
        </group>
      )}
      <Plant pos={[1.2, 0, -0.72]} s={1.05} />
    </>
  );
  return (
    <group>
      {/* shell */}
      <RBox size={[2.96, 0.3, 2.16]} pos={[0, -0.15, 0]} c={G_FLOOR} r={0.04} />
      <RBox size={[0.14, 2.5, 2.16]} pos={[-1.48, 1.1, 0]} c={G_WALL2} r={0.04} />
      <RBox size={[0.03, 0.1, 2.0]} pos={[-1.4, 0.05, 0]} c="#e9dcc6" r={0.01} />
      {/* back wall, built around the mirror */}
      <RBox size={[MX0 + 1.55, 2.5, 0.07]} pos={[(MX0 - 1.55) / 2, 1.1, ZM - 0.035]} c={G_WALL} r={0.02} shadow={false} />
      <RBox size={[1.48 - MX1, 2.5, 0.07]} pos={[(MX1 + 1.48) / 2, 1.1, ZM - 0.035]} c={G_WALL} r={0.02} shadow={false} />
      <RBox size={[mw, 2.35 - MY1, 0.07]} pos={[mcx, (2.35 + MY1) / 2, ZM - 0.035]} c={G_WALL} r={0.01} shadow={false} />
      <RBox size={[mw, MY0 + 0.15, 0.07]} pos={[mcx, (MY0 - 0.15) / 2, ZM - 0.035]} c={G_WALL} r={0.01} shadow={false} />
      <RBox size={[1.48 - MX1 - 0.04, 0.1, 0.03]} pos={[(MX1 + 1.48) / 2, 0.05, ZM + 0.015]} c="#e9dcc6" r={0.01} />
      {/* mirror frame */}
      <RBox size={[mw + 0.14, 0.07, 0.06]} pos={[mcx, MY1 + 0.02, ZM + 0.02]} c="#e9dcc6" r={0.02} shadow={false} />
      <RBox size={[mw + 0.14, 0.07, 0.06]} pos={[mcx, MY0 - 0.02, ZM + 0.02]} c="#e9dcc6" r={0.02} shadow={false} />
      <RBox size={[0.07, mh + 0.1, 0.06]} pos={[MX0 - 0.02, mcy, ZM + 0.02]} c="#e9dcc6" r={0.02} shadow={false} />
      <RBox size={[0.07, mh + 0.1, 0.06]} pos={[MX1 + 0.02, mcy, ZM + 0.02]} c="#e9dcc6" r={0.02} shadow={false} />
      {/* shelf with towels and a bottle */}
      <RBox size={[0.44, 0.05, 0.2]} pos={[1.2, 1.42, -0.9]} c={WOOD} r={0.015} />
      {[[1.08, 1.515], [1.23, 1.515], [1.155, 1.64]].map(([x, y], i) => <Cyl key={i} pos={[x, y, -0.9]} r={0.07} h={0.17} c={i === 2 ? "#e9c9a8" : "#fbf6ee"} rot={[Math.PI / 2, 0, 0]} />)}
      <Cyl pos={[1.36, 1.54, -0.9]} r={0.035} h={0.18} c={GOLD} />
      <Cyl pos={[1.36, 1.65, -0.9]} r={0.02} h={0.04} c={INK} />
      {/* pendant lamps */}
      {[-0.62, 0.62].map((x) => (
        <group key={x}>
          <Stick a={[x, 2.5, 0.05]} b={[x, 2.12, 0.05]} r={0.008} c="#2a211b" />
          <Cyl pos={[x, 2.05, 0.05]} r={0.17} r2={0.05} h={0.16} c={GOLD} emissive="#ffb86a" ei={1.3 + 0.08 * Math.sin(f * 0.1 + x)} />
        </group>
      ))}
      {props}
      {children}
      {/* the room in the mirror */}
      <group position={[0, 0, 2 * ZM]} scale={[1, 1, -1]}>
        <RBox size={[2.3, 0.3, 2.09]} pos={[-0.4, -0.15, 0.035]} c={G_FLOOR} r={0.04} />
        <RBox size={[0.14, 2.25, 2.09]} pos={[-1.48, 0.975, 0.035]} c={G_WALL2} r={0.04} />
        <RBox size={[2.3, 2.25, 0.06]} pos={[-0.4, 0.975, 1.11]} c="#573730" r={0.02} />
        {props}
        {children}
      </group>
      {/* glass */}
      <mesh position={[mcx, mcy, ZM + 0.004]}>
        <planeGeometry args={[mw, mh]} />
        <meshStandardMaterial color="#fff3df" transparent opacity={0.07} roughness={0.2} depthWrite={false} />
      </mesh>
      {[-0.32, 0.18].map((x, i) => (
        <mesh key={i} position={[mcx + x, mcy + 0.1, ZM + 0.006]} rotation={[0, 0, -0.5]}>
          <planeGeometry args={[0.12 - i * 0.05, 2.6]} />
          <meshBasicMaterial color="#fff3df" transparent opacity={0.05} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

// ---------- his bedroom at night ----------
export const NightBedroom: React.FC = () => (
  <group>
    <Room floor="#5a4030" wall="#4a3640" wall2="#42303a" />
    <Window pos={[0.52, 1.52, -1.0]} sky="#1f1a38" glow={0.8} moon={1} />
    {/* bed */}
    <RBox size={[1.08, 0.24, 1.9]} pos={[-0.8, 0.2, -0.02]} c={WOOD} r={0.04} />
    <RBox size={[1.0, 0.18, 1.8]} pos={[-0.8, 0.38, -0.02]} c="#efe6d8" r={0.06} />
    <RBox size={[1.12, 0.85, 0.1]} pos={[-0.8, 0.62, -0.95]} c={WOOD} r={0.05} />
    <RBox size={[0.7, 0.44, 0.16]} pos={[-0.8, 0.72, -0.84]} rot={[-0.18, 0, 0]} c="#fbf6ee" r={0.07} />
    <RBox size={[1.06, 0.56, 1.12]} pos={[-0.8, 0.6, 0.42]} c="#b9623f" r={0.2} />
    <RBox size={[1.07, 0.5, 0.2]} pos={[-0.8, 0.62, -0.12]} c="#f1e6d6" r={0.09} />
    {/* rug, yesterday's dumbbell, trainers */}
    <Cyl pos={[0.55, 0.012, 0.3]} r={0.78} h={0.024} c="#d8c3a2" />
    <Dumbbell pos={[0.62, 0.095, 0.42]} rot={[0, 0.5, 0]} />
    <Ball pos={[0.0, 0.05, 0.62]} r={0.075} c="#f5efe4" scale={[1, 0.6, 1.6]} />
    <Ball pos={[0.17, 0.05, 0.7]} r={0.075} c="#f5efe4" scale={[1.5, 0.6, 1]} />
    {/* floor lamp, switched off */}
    <Cyl pos={[1.18, 0.02, -0.78]} r={0.14} h={0.04} c="#2a211b" />
    <Stick a={[1.18, 0, -0.78]} b={[1.18, 1.62, -0.78]} r={0.018} c="#2a211b" />
    <Cyl pos={[1.18, 1.68, -0.78]} r={0.2} r2={0.11} h={0.26} c="#bfa37c" emissive="#ffb86a" ei={0.12} />
    {/* nightstand + clock */}
    <RBox size={[0.3, 0.4, 0.3]} pos={[-0.1, 0.2, -0.82]} c={WOOD} r={0.03} />
    <RBox size={[0.2, 0.1, 0.08]} pos={[-0.1, 0.45, -0.8]} c="#2a2530" r={0.02} emissive="#ff8a5c" ei={0.7} />
  </group>
);
