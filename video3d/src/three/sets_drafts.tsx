// Set and props for "drafts": his bedroom at 1:40 AM (a double bed with one side untouched, a nightstand with a lamp,
// an unused gym bag), the man himself, his phone, and the paper slips that fall behind the Heartly phone.
// Colours stay in the brand family (midnight, cream, gold, ember, terracotta, warm wood). No violet in this video.
import { Color } from "three";
import { Ball, Cyl, M, RBox, Stick, V3 } from "./parts";
import { Room, Window } from "./sets";
import { Person, Pose } from "./Woman";

const INK = "#2a2420", EMBER = "#d9643a", GOLD = "#d9b26a", CREAM = "#f1e6d6", WOOD = "#7a5640", DARKWOOD = "#4f382a", DUVET = "#ab5539";
const mix = (a: string, b: string, k: number) => "#" + new Color(a).lerp(new Color(b), k).getHexString();

export const SKIN = "#b98058", HAIR = "#2b1d17", TEE = "#e3b667";

// where things are, so the video can aim the camera and pin bubbles
export const HIM_X = -0.3; // his side of the bed
export const MAT = 0.46; // top of the mattress
export const NS_TOP = 0.52; // top of the nightstand
export const NS_PHONE: V3 = [0.3, NS_TOP, -0.66];

// ---------- him ----------
// He is always in bed, so the pivot is his hips (on the mattress) and his legs stay under the duvet.
// lean: 0 sitting upright, negative leaning back onto the pillow. Children are placed in the body's own space
// (shoulders at y 0.99, head at y 1.37), so props can ride along.
export type Body = { hip: V3; rotY?: number; lean?: number; roll?: number; pose?: Pose };
const armOf = (pose: Pose, s: 1 | -1): [number, number] => (s === 1 ? pose.armL ?? [0, 0.14] : pose.armR ?? [0, 0.14]);

// side 1 = his left hand, -1 = his right. upright: children keep the body's orientation instead of the arm's.
export const AtHand: React.FC<{ pose?: Pose; side: 1 | -1; upright?: boolean; children?: React.ReactNode }> = ({ pose = {}, side, upright, children }) => {
  const a = armOf(pose, side);
  return (
    <group position={[side * 0.25, 0.99, 0]} rotation={[a[0], 0, side * a[1]]}>
      <group position={[0, -0.41, 0]}>
        {upright ? (
          <group rotation={[0, 0, -side * a[1]]}>
            <group rotation={[-a[0], 0, 0]}>{children}</group>
          </group>
        ) : children}
      </group>
    </group>
  );
};

// flex 0..1 draws a raised forearm on his left arm; pump swells the sleeve
export const Him: React.FC<Body & { flex?: number; pump?: number; children?: React.ReactNode }> = ({ hip, rotY = 0, lean = 0, roll = 0, pose = {}, flex = 0, pump = 0, children }) => {
  const a1 = armOf(pose, 1)[1];
  return (
    <group position={hip} rotation={[0, rotY, 0]}>
      <group rotation={[lean, 0, roll]}>
        <group position={[0, -0.52, 0]}>
          <Person pos={[0, 0, 0]} pose={pose} bun={false} jumper={TEE} trousers="#4a3a36" skin={SKIN} hair={HAIR} />
          {/* bed hair */}
          <group position={[0, 1.37, 0]} rotation={[pose.headTilt ?? 0, pose.headTurn ?? 0, 0]}>
            <Ball pos={[0.09, 0.3, 0.0]} r={0.085} c={HAIR} />
            <Ball pos={[-0.1, 0.29, -0.05]} r={0.075} c={HAIR} />
            <Ball pos={[-0.01, 0.3, 0.12]} r={0.07} c={HAIR} scale={[1.5, 0.8, 1]} />
            <Ball pos={[0.2, 0.22, -0.08]} r={0.06} c={HAIR} />
          </group>
          {flex > 0.03 && (
            <>
              <AtHand pose={pose} side={1} upright>
                <group scale={flex}>
                  <mesh position={[0, 0.16, 0]} castShadow>
                    <capsuleGeometry args={[0.062, 0.2, 8, 14]} />
                    <M c={SKIN} rough={0.7} />
                  </mesh>
                  <Ball pos={[0, 0.34, 0]} r={0.082} c={SKIN} />
                </group>
              </AtHand>
              <Ball pos={[0.25 + 0.21 * Math.sin(a1), 0.99 - 0.21 * Math.cos(a1) + 0.055 * flex, 0]} r={(0.07 + 0.028 * pump) * flex} c={TEE} />
            </>
          )}
          {children}
        </group>
      </group>
    </group>
  );
};

// ---------- his phone: screen on local +z, lens on the back. glow 0..1 lights the screen ----------
export const Phone: React.FC<{ pos?: V3; rot?: V3; glow?: number; s?: number }> = ({ pos = [0, 0, 0], rot = [0, 0, 0], glow = 1, s = 1 }) => (
  <group position={pos} rotation={rot} scale={s}>
    <RBox size={[0.145, 0.275, 0.024]} c="#e9dcc6" r={0.01} />
    <mesh position={[0, 0, 0.0128]}>
      <planeGeometry args={[0.125, 0.25]} />
      <M c={mix("#241b15", "#fff1d8", glow)} emissive="#ffe2b4" ei={1.3 * glow} />
    </mesh>
    <Cyl pos={[-0.035, 0.085, -0.014]} r={0.026} h={0.008} c="#241d19" rot={[Math.PI / 2, 0, 0]} />
    <Cyl pos={[-0.035, 0.085, -0.017]} r={0.013} h={0.008} c={GOLD} rot={[Math.PI / 2, 0, 0]} />
  </group>
);

// ---------- a draft: a slip of paper with a few lines on it (falls behind the Heartly phone) ----------
export const Slip: React.FC<{ pos: V3; rot: V3; s?: number; lit?: number; lines?: number }> = ({ pos, rot, s = 1, lit = 1, lines = 3 }) => (
  <group position={pos} rotation={rot} scale={s}>
    <RBox size={[0.4, 0.26, 0.012]} c="#e9dcc6" r={0.005} emissive="#ffd9a6" ei={0.1 + 0.22 * lit} shadow={false} />
    {Array.from({ length: lines }).map((_, i) => (
      <RBox key={i} size={[i === lines - 1 ? 0.16 : 0.3, 0.022, 0.004]} pos={[i === lines - 1 ? -0.07 : 0, 0.065 - i * 0.062, 0.008]} c="#4f382a" r={0.001} shadow={false} />
    ))}
  </group>
);

// ---------- the bedroom ----------
// dawn: 0 night .. 1 sunrise. hipZ: where he sits, so the duvet folds at his waist. lie: 0 pillow propped up .. 1 pillow flat.
// phone: his phone lies face-down on the nightstand.
export const DraftsRoom: React.FC<{ f: number; dawn?: number; hipZ?: number; lie?: number; phone?: boolean }> = ({ f, dawn = 0, hipZ = -0.12, lie = 0, phone = false }) => {
  const zTop = hipZ + 0.14, len = 0.92 - zTop;
  const BX = -0.66; // bed centre
  return (
    <group>
      <Room floor="#5e4232" wall="#52362c" wall2="#472f27" />
      <Window pos={[0.84, 1.66, -1.0]} sky={mix("#191b33", "#f6b58c", dawn)} glow={0.8 + dawn * 0.75} moon={1 - dawn} w={0.72} h={0.82} />
      {/* bed: base, mattress, headboard */}
      <RBox size={[1.46, 0.3, 1.9]} pos={[BX, 0.15, -0.02]} c={WOOD} r={0.04} />
      <RBox size={[1.38, 0.2, 1.82]} pos={[BX, MAT - 0.1, -0.02]} c="#efe6d8" r={0.06} />
      <RBox size={[1.5, 1.0, 0.1]} pos={[BX, 0.68, -0.95]} c={WOOD} r={0.05} />
      {/* her pillow: flat, untouched */}
      <RBox size={[0.56, 0.15, 0.4]} pos={[-1.04, MAT + 0.07, -0.66]} c="#fbf6ee" r={0.07} />
      {/* his pillow: propped against the headboard, or flat under his head */}
      <RBox size={[0.6, 0.46, 0.18]} pos={[HIM_X, MAT + 0.3 - 0.2 * lie, -0.8 + 0.12 * lie]} rot={[-0.3 - 0.95 * lie, 0, 0]} c="#fbf6ee" r={0.085} />
      {/* duvet with the sheet folded over, and the shape of his legs under it */}
      <RBox size={[1.42, 0.34, len]} pos={[BX, MAT + 0.04, zTop + len / 2]} c={DUVET} r={0.15} />
      <RBox size={[1.43, 0.3, 0.2]} pos={[BX, MAT + 0.07, zTop]} c={CREAM} r={0.1} />
      <RBox size={[0.42, 0.3, 0.74]} pos={[HIM_X, MAT + 0.1, zTop + 0.42]} c={DUVET} r={0.14} />
      {/* nightstand, lamp, mug */}
      <RBox size={[0.44, NS_TOP, 0.4]} pos={[0.38, NS_TOP / 2, -0.78]} c={WOOD} r={0.03} />
      <RBox size={[0.34, 0.15, 0.02]} pos={[0.38, 0.36, -0.575]} c={DARKWOOD} r={0.008} />
      <Ball pos={[0.38, 0.36, -0.56]} r={0.02} c={GOLD} shadow={false} />
      <Cyl pos={[0.5, NS_TOP + 0.015, -0.86]} r={0.07} h={0.03} c={INK} />
      <Stick a={[0.5, NS_TOP, -0.86]} b={[0.5, NS_TOP + 0.3, -0.86]} r={0.012} c={INK} />
      <Cyl pos={[0.5, NS_TOP + 0.36, -0.86]} r={0.13} r2={0.075} h={0.2} c="#ffd9a0" emissive="#ffb86a" ei={1.25 - dawn * 1.1} />
      <Cyl pos={[0.24, NS_TOP + 0.05, -0.88]} r={0.042} h={0.1} c={EMBER} />
      {phone && (
        <group position={NS_PHONE} rotation={[0, 0.3, 0]}>
          <RBox size={[0.145, 0.024, 0.275]} pos={[0, 0.012, 0]} c="#e9dcc6" r={0.01} />
          <Cyl pos={[-0.035, 0.026, -0.085]} r={0.026} h={0.008} c="#241d19" />
          <Cyl pos={[-0.035, 0.029, -0.085]} r={0.013} h={0.008} c={GOLD} />
        </group>
      )}
      {/* picture above the bed */}
      <RBox size={[0.56, 0.44, 0.03]} pos={[BX, 1.78, -1.0]} c="#e9dcc6" r={0.01} />
      <RBox size={[0.48, 0.36, 0.01]} pos={[BX, 1.78, -0.983]} c="#b5654a" r={0.004} shadow={false} />
      <Cyl pos={[BX + 0.08, 1.8, -0.976]} r={0.085} h={0.006} c={GOLD} rot={[Math.PI / 2, 0, 0]} />
      {/* rug, slippers */}
      <Cyl pos={[0.72, 0.012, 0.32]} r={0.7} h={0.024} c="#d8c3a2" />
      <Ball pos={[0.28, 0.045, 0.3]} r={0.07} c={GOLD} scale={[1, 0.55, 1.6]} />
      <Ball pos={[0.44, 0.045, 0.38]} r={0.07} c={GOLD} scale={[1.45, 0.55, 1.1]} />
      {/* the gym bag: packed, zipped, not moved in weeks */}
      <group position={[1.02, 0, -0.42]} rotation={[0, 0.5, 0]}>
        <Cyl pos={[0, 0.16, 0]} r={0.16} h={0.5} c={EMBER} rot={[0, 0, Math.PI / 2]} />
        <RBox size={[0.4, 0.02, 0.03]} pos={[0, 0.322, 0]} c={INK} r={0.008} />
        {[-0.12, 0.12].map((x) => (
          <mesh key={x} position={[x, 0.3, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <torusGeometry args={[0.09, 0.014, 8, 20, Math.PI]} />
            <M c={CREAM} />
          </mesh>
        ))}
      </group>
      {/* tiny flicker so the room is never frozen */}
      <pointLight position={[0.5, NS_TOP + 0.5, -0.6]} color="#ffb060" intensity={0.5 * (1 - dawn) * (1 + 0.2 * Math.sin(f * 0.21))} distance={2.2} decay={1.6} />
    </group>
  );
};

// night in his bedroom: moonlight key, a low warm lamp on the nightstand, a soft warm fill from the front.
// The phone adds its own light where he holds it. k cross-fades the rig against the kit's dawn.
export const BedNight: React.FC<{ k?: number }> = ({ k = 1 }) =>
  k <= 0.001 ? null : (
    <>
      <hemisphereLight args={["#5c5f8c", "#1c1410", 0.62 * k]} />
      <directionalLight position={[2.5, 5, 5]} color="#b9c0f5" intensity={0.7 * k} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0005} shadow-normalBias={0.02}>
        <orthographicCamera attach="shadow-camera" args={[-3.2, 3.2, 3.2, -3.2, 0.5, 24]} />
      </directionalLight>
      <pointLight position={[0.55, 1.25, -0.45]} color="#ffb060" intensity={4.2 * k} distance={4.5} decay={1.6} />
      <pointLight position={[0.4, 1.4, 1.6]} color="#ffd2a6" intensity={2.2 * k} distance={6} decay={1.6} />
      <pointLight position={[-1.1, 1.5, 0.5]} color="#ffb060" intensity={1.4 * k} distance={5} decay={1.6} />
    </>
  );
