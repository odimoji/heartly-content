import { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { BackSide, Color, DataTexture, Mesh, MeshBasicMaterial, NearestFilter, Quaternion, RGBAFormat, Vector3 } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type V3 = [number, number, number];

// ---- looks: "clay" (soft 3D), "ink" (toon shading, ink outlines, brand palette), "riso" (clay + print filter in the DOM)
export type Look = "clay" | "ink" | "riso" | "combo";
export const LOOK: { current: Look } = { current: "clay" };

const PALETTE = ["#2a2420", "#3b3552", "#5a4f86", "#8f7fb8", "#f3ede3", "#e4d8c4", "#d9643a", "#f0a07a", "#e3a63a", "#a8744f", "#7a5640", "#3d5a7a", "#7f9a78", "#ffffff", "#17131a"].map((h) => new Color(h));
const snapCache = new Map<string, string>();
const snap = (hex: string) => {
  if (snapCache.has(hex)) return snapCache.get(hex)!;
  const c = new Color(hex); let best = PALETTE[0], bd = 9;
  for (const p of PALETTE) { const d = (p.r - c.r) ** 2 + (p.g - c.g) ** 2 + (p.b - c.b) ** 2; if (d < bd) { bd = d; best = p; } }
  const out = "#" + best.getHexString(); snapCache.set(hex, out); return out;
};
let grad: DataTexture | null = null;
const gradient = () => {
  if (!grad) {
    const v = [120, 185, 255];
    grad = new DataTexture(new Uint8Array(v.flatMap((x) => [x, x, x, 255])), v.length, 1, RGBAFormat);
    grad.minFilter = grad.magFilter = NearestFilter; grad.needsUpdate = true;
  }
  return grad;
};

// the one material used everywhere; switches with the look
export const M: React.FC<{ c: string; rough?: number; emissive?: string; ei?: number }> = ({ c, rough = 0.85, emissive, ei = 1 }) =>
  LOOK.current === "ink" ? (
    <meshToonMaterial color={snap(c)} gradientMap={gradient()} emissive={emissive ? snap(emissive) : "#000000"} emissiveIntensity={emissive ? Math.min(ei, 0.9) : 0} />
  ) : (
    <meshStandardMaterial color={c} roughness={rough} metalness={0} emissive={emissive ?? "#000000"} emissiveIntensity={emissive ? ei : 0} />
  );

// ink outlines: gives every solid mesh a slightly larger back-facing ink shell
const olMat = new MeshBasicMaterial({ color: "#2a2420", side: BackSide });
export const Outlines: React.FC<{ w?: number }> = ({ w = 0.012 }) => {
  const scene = useThree((s) => s.scene);
  useLayoutEffect(() => {
    scene.traverse((o) => {
      const m = o as Mesh & { isInstancedMesh?: boolean };
      if (!m.isMesh || m.isInstancedMesh || m.userData.isOl || m.userData.noOl) return;
      const t = m.geometry.type;
      if (t === "PlaneGeometry" || t === "CircleGeometry" || t === "TorusGeometry" || t === "TubeGeometry" || (m.material as { type?: string }).type === "ShadowMaterial") return;
      let ol = m.userData.ol as Mesh | undefined;
      if (!ol) { ol = new Mesh(m.geometry, olMat); ol.userData.isOl = true; m.add(ol); m.userData.ol = ol; }
      ol.geometry = m.geometry;
      if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
      const sz = m.geometry.boundingBox!.getSize(new Vector3());
      const ws = m.getWorldScale(new Vector3());
      ol.scale.set(1 + (2 * w) / Math.max(0.02, sz.x * ws.x), 1 + (2 * w) / Math.max(0.02, sz.y * ws.y), 1 + (2 * w) / Math.max(0.02, sz.z * ws.z));
    });
  });
  return null;
};

// rounded box, centred on pos
export const RBox: React.FC<{ size: V3; pos?: V3; rot?: V3; c: string; r?: number; emissive?: string; ei?: number; shadow?: boolean; receive?: boolean }> = ({
  size, pos = [0, 0, 0], rot = [0, 0, 0], c, r = 0.03, emissive, ei, shadow = true, receive = true,
}) => {
  const geo = useMemo(() => new RoundedBoxGeometry(size[0], size[1], size[2], 3, Math.min(r, Math.min(...size) / 2 - 0.001)), [size[0], size[1], size[2], r]);
  return (
    <mesh geometry={geo} position={pos} rotation={rot} castShadow={shadow} receiveShadow={receive}>
      <M c={c} emissive={emissive} ei={ei} />
    </mesh>
  );
};

// thin cylinder between two points
export const Stick: React.FC<{ a: V3; b: V3; r?: number; c: string }> = ({ a, b, r = 0.02, c }) => {
  const va = new Vector3(...a), vb = new Vector3(...b);
  const mid = va.clone().add(vb).multiplyScalar(0.5);
  const q = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), vb.clone().sub(va).normalize());
  return (
    <mesh position={mid} quaternion={q} castShadow>
      <cylinderGeometry args={[r, r, va.distanceTo(vb), 10]} />
      <M c={c} />
    </mesh>
  );
};

export const Ball: React.FC<{ pos: V3; r: number; c: string; scale?: V3; emissive?: string; ei?: number; shadow?: boolean }> = ({ pos, r, c, scale = [1, 1, 1], emissive, ei, shadow = true }) => (
  <mesh position={pos} scale={scale} castShadow={shadow} receiveShadow>
    <sphereGeometry args={[r, 28, 20]} />
    <M c={c} emissive={emissive} ei={ei} />
  </mesh>
);

export const Cyl: React.FC<{ pos: V3; r: number; h: number; c: string; r2?: number; rot?: V3; emissive?: string; ei?: number }> = ({ pos, r, h, c, r2, rot = [0, 0, 0], emissive, ei }) => (
  <mesh position={pos} rotation={rot} castShadow receiveShadow>
    <cylinderGeometry args={[r2 ?? r, r, h, 28]} />
    <M c={c} emissive={emissive} ei={ei} />
  </mesh>
);

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
export const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
