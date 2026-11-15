// Set and props for the "no contact" video: his flat at night (a sofa long enough to lie on, coffee table with his phone,
// a tally of days on the wall) and the glowing question marks that circle his head.
// Colours stay in the brand family; violet is kept for the question marks.
import { useEffect, useMemo } from "react";
import { AdditiveBlending, CanvasTexture, CatmullRomCurve3, Color, SRGBColorSpace, TubeGeometry, Vector3 } from "three";
import { Ball, Cyl, M, RBox, Stick, V3 } from "./parts";
import { Room, Window } from "./sets";

const INK = "#2a2420", EMBER = "#d9643a", GOLD = "#d9b26a", WOOD = "#7a5640", DARKWOOD = "#4f382a", TERRA = "#b5583c";
const mix = (a: string, b: string, k: number) => "#" + new Color(a).lerp(new Color(b), k).getHexString();

// where things are, so the video can aim him and the question marks at them
export const SEAT: V3 = [-0.2, 0.44, -0.45]; // where he sits on the sofa
export const LIE: V3 = [-1.33, 0.66, -0.5]; // his feet when he lies along the sofa, head towards +x
export const TABLE_TOP = 0.325; // y of the coffee table surface
export const TABLE: V3 = [-0.15, TABLE_TOP, 0.36];
export const PHONE: V3 = [TABLE[0] - 0.02, TABLE_TOP, TABLE[2] + 0.02];

// ---------- a glowing question mark (pos is its centre, s its height) ----------
const useGlowTex = () =>
  useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const x = c.getContext("2d")!;
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(169,139,255,0.55)"); g.addColorStop(0.35, "rgba(169,139,255,0.2)"); g.addColorStop(1, "rgba(169,139,255,0)");
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
  }, []);

// glow: 1 lit .. 0 dim and spent
export const QMark: React.FC<{ pos: V3; s?: number; rotY?: number; rotZ?: number; rotX?: number; glow?: number; light?: boolean }> = ({ pos, s = 0.3, rotY = 0, rotZ = 0, rotX = 0, glow = 1, light = true }) => {
  const geo = useMemo(() => {
    const pts = [[-0.26, 0.22], [-0.2, 0.4], [-0.02, 0.5], [0.18, 0.44], [0.27, 0.27], [0.2, 0.1], [0.05, -0.02], [0.0, -0.16]].map(([x, y]) => new Vector3(x, y, 0));
    return new TubeGeometry(new CatmullRomCurve3(pts, false, "catmullrom", 0.5), 48, 0.085, 12, false);
  }, []);
  const tex = useGlowTex();
  const c = mix("#5d5478", "#9a7bff", glow), ei = 0.12 + 0.5 * glow;
  return (
    <group position={pos}>
      <group rotation={[rotX, rotY, rotZ]} scale={s}>
        <mesh geometry={geo} castShadow>
          <M c={c} rough={0.5} emissive="#7d55f5" ei={ei} />
        </mesh>
        {([[-0.26, 0.22, 0.085], [0.0, -0.16, 0.085], [0, -0.41, 0.105]] as V3[]).map(([x, y, r], i) => (
          <mesh key={i} position={[x, y, 0]} castShadow>
            <sphereGeometry args={[r, 20, 16]} />
            <M c={c} rough={0.5} emissive="#7d55f5" ei={ei} />
          </mesh>
        ))}
      </group>
      {glow > 0.02 && (
        <sprite scale={[s * 2.6, s * 2.6, 1]}>
          <spriteMaterial map={tex} blending={AdditiveBlending} depthWrite={false} transparent opacity={0.6 * glow} />
        </sprite>
      )}
      {light && glow > 0.02 && <pointLight color="#a98bff" position={[0, s * 0.1, s * 0.5]} intensity={5.5 * s * glow} distance={Math.max(1.3, s * 4)} decay={1.6} />}
    </group>
  );
};

// ---------- the tally of days ----------
const useTally = (days: number) => {
  const tex = useMemo(() => {
    const W = 360, H = 460;
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const x = c.getContext("2d")!;
    x.fillStyle = "#fffaf0"; x.fillRect(0, 0, W, H);
    x.fillStyle = EMBER; x.fillRect(0, 0, W, 74);
    x.fillStyle = "#fffaf0";
    [90, 270].forEach((cx) => { x.beginPath(); x.arc(cx, 37, 13, 0, 6.29); x.fill(); });
    x.lineCap = "round";
    const cols = 6, rows = 10, gx = 52, gy = 36, x0 = (W - (cols - 1) * gx) / 2, y0 = 112;
    for (let i = 0; i < cols * rows; i++) {
      const cx = x0 + (i % cols) * gx, cy = y0 + Math.floor(i / cols) * gy;
      if (i < days) {
        x.strokeStyle = INK; x.lineWidth = 5;
        x.beginPath(); x.moveTo(cx - 10, cy - 10); x.lineTo(cx + 10, cy + 10); x.moveTo(cx + 10, cy - 10); x.lineTo(cx - 10, cy + 10); x.stroke();
      }
      if (i === days - 1) { x.strokeStyle = EMBER; x.lineWidth = 6; x.beginPath(); x.arc(cx, cy, 19, 0, 6.29); x.stroke(); }
    }
    const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; return t;
  }, [days]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
};

const Tally: React.FC<{ pos: V3; days: number; glow: number }> = ({ pos, days, glow }) => {
  const tex = useTally(days);
  return (
    <group position={pos}>
      <RBox size={[0.36, 0.46, 0.02]} pos={[0, 0, 0]} c="#efe6d8" r={0.008} />
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[0.34, 0.435]} />
        <meshStandardMaterial map={tex} roughness={0.9} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={glow} />
      </mesh>
      <Ball pos={[0, 0.25, 0.01]} r={0.018} c={GOLD} shadow={false} />
    </group>
  );
};

// ---------- the flat (dawn: 0 night .. 1 sunrise; phone: 0 face-down and dark .. 1 face-up and glowing) ----------
export const Flat: React.FC<{ f: number; dawn?: number; phone?: number; days?: number }> = ({ f, dawn = 0, phone = 0, days = 60 }) => (
  <group>
    <Room floor="#5e4232" wall="#52362c" wall2="#472f27" />
    <Window pos={[-0.86, 1.74, -1.0]} sky={mix("#1f1a38", "#f6b58c", dawn)} glow={0.8 + dawn * 0.7} moon={1 - dawn} w={0.78} h={0.7} />
    <Tally pos={[0.72, 1.32, -1.0]} days={days} glow={0.32 - dawn * 0.2} />
    {/* sofa, long enough to lie on with his feet up on the far arm */}
    <group position={[-0.45, 0, -0.6]}>
      <RBox size={[1.56, 0.24, 0.76]} pos={[0, 0.2, 0]} c={TERRA} r={0.06} />
      <RBox size={[0.76, 0.14, 0.58]} pos={[-0.385, 0.37, 0.09]} c="#c56a48" r={0.06} />
      <RBox size={[0.76, 0.14, 0.58]} pos={[0.385, 0.37, 0.09]} c="#c56a48" r={0.06} />
      <RBox size={[1.56, 0.66, 0.2]} pos={[0, 0.6, -0.28]} c={TERRA} r={0.09} />
      {[-1, 1].map((s) => <RBox key={s} size={[0.17, 0.44, 0.76]} pos={[s * 0.86, 0.36, 0]} c={TERRA} r={0.075} />)}
      {[-0.7, 0.7].map((x) => [-0.3, 0.3].map((z) => <Cyl key={`${x}${z}`} pos={[x, 0.04, z]} r={0.03} h={0.08} c={DARKWOOD} />))}
      {/* the cushion he uses as a pillow */}
      <RBox size={[0.14, 0.3, 0.34]} pos={[0.68, 0.57, 0.08]} rot={[0, 0, 0.25]} c={GOLD} r={0.06} />
    </group>
    {/* rug + coffee table, with his phone and a mug on it */}
    <Cyl pos={[-0.22, 0.012, 0.34]} r={0.74} h={0.024} c="#d8c3a2" />
    <RBox size={[0.84, 0.05, 0.42]} pos={[TABLE[0], TABLE_TOP - 0.025, TABLE[2]]} c={WOOD} r={0.02} />
    {[-0.36, 0.36].map((x) => [-0.16, 0.16].map((z) => <RBox key={`${x}${z}`} size={[0.045, 0.28, 0.045]} pos={[TABLE[0] + x, 0.14, TABLE[2] + z]} c={DARKWOOD} r={0.012} />))}
    <group position={PHONE} rotation={[0, 0.25, 0]}>
      <RBox size={[0.125, 0.016, 0.24]} pos={[0, 0.008, 0]} c="#17120e" r={0.006} />
      {phone > 0.02 ? (
        <mesh position={[0, 0.0175, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.105, 0.215]} />
          <M c={mix("#241b15", "#f6ecdc", phone)} emissive="#ffd9a6" ei={phone * 1.5} />
        </mesh>
      ) : (
        <Cyl pos={[-0.035, 0.018, -0.085]} r={0.014} h={0.006} c="#3a302a" />
      )}
    </group>
    <Cyl pos={[TABLE[0] - 0.3, TABLE_TOP + 0.05, TABLE[2] - 0.08]} r={0.045} h={0.1} c={EMBER} />
    {/* floor lamp at the head end of the sofa */}
    <Cyl pos={[1.22, 0.02, -0.78]} r={0.11} h={0.04} c="#2a211b" />
    <Stick a={[1.22, 0, -0.78]} b={[1.22, 1.5, -0.78]} r={0.016} c="#2a211b" />
    <Cyl pos={[1.22, 1.55, -0.78]} r={0.135} r2={0.08} h={0.22} c="#ffd9a0" emissive="#ffb86a" ei={1.5 - dawn * 1.25} />
    {/* his shoes, kicked off */}
    <Ball pos={[1.16, 0.04, 0.2]} r={0.07} c="#efe6d8" scale={[1, 0.55, 1.6]} />
    <Ball pos={[1.28, 0.04, 0.36]} r={0.07} c="#efe6d8" scale={[1.5, 0.55, 1.1]} />
    {/* a shelf with a few things */}
    <RBox size={[0.3, 0.035, 0.14]} pos={[0.72, 1.86, -0.94]} c={WOOD} r={0.012} />
    <Cyl pos={[0.65, 1.94, -0.94]} r={0.045} r2={0.055} h={0.12} c="#b5654a" />
    <Ball pos={[0.65, 2.04, -0.94]} r={0.07} c="#8a7a4e" />
    <RBox size={[0.05, 0.16, 0.1]} pos={[0.78, 1.96, -0.94]} c={GOLD} r={0.008} />
    <RBox size={[0.04, 0.13, 0.1]} pos={[0.83, 1.945, -0.94]} c="#f1e6d6" r={0.008} />
    {/* tiny flicker so the room is never frozen */}
    <pointLight position={[1.22, 1.2, -0.5]} color="#ffb060" intensity={0.35 * (1 - dawn) * (1 + 0.25 * Math.sin(f * 0.21))} distance={2} decay={1.6} />
  </group>
);

// night in the flat: the kit's night rig (moonlight key, cool sky, warm fill) with the lamp light moved to this room's lamp,
// so his face is lit, not burnt, wherever he is on the sofa. k cross-fades it against the kit's dawn.
export const FlatNight: React.FC<{ k?: number }> = ({ k = 1 }) =>
  k <= 0.001 ? null : (
    <>
      <hemisphereLight args={["#5f5a8a", "#1c1410", 0.7 * k]} />
      <directionalLight position={[2.5, 5, 5]} color="#b3bcff" intensity={0.8 * k} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0005} shadow-normalBias={0.02}>
        <orthographicCamera attach="shadow-camera" args={[-3.2, 3.2, 3.2, -3.2, 0.5, 24]} />
      </directionalLight>
      <pointLight position={[1.0, 1.55, -0.3]} color="#ffb060" intensity={6 * k} distance={5} decay={1.6} />
      <pointLight position={[0.4, 1.4, 1.6]} color="#ffd2a6" intensity={2.4 * k} distance={6} decay={1.6} />
      <pointLight position={[-1.2, 1.6, 0.4]} color="#ffb060" intensity={2.2 * k} distance={5} decay={1.6} />
    </>
  );
