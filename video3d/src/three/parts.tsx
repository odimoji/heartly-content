import { useMemo } from "react";
import { Quaternion, Vector3 } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type V3 = [number, number, number];

// matte "clay" material used everywhere
export const M: React.FC<{ c: string; rough?: number; emissive?: string; ei?: number }> = ({ c, rough = 0.85, emissive, ei = 1 }) => (
  <meshStandardMaterial color={c} roughness={rough} metalness={0} emissive={emissive ?? "#000000"} emissiveIntensity={emissive ? ei : 0} />
);

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
