import { useLayoutEffect, useMemo, useRef } from "react";
import { CatmullRomCurve3, InstancedMesh, Matrix4, Quaternion, TubeGeometry, Vector3 } from "three";
import { LOOK, M, V3 } from "./parts";

export type Mood = "neutral" | "smug" | "sad" | "happy" | "shock";

// Worry: a fuzzy charcoal puffball with big eyes, two little legs and a bow tie.
// pos is where his feet touch; r is body radius; f is the current frame (drives fur, blinks, hops).
export const Worry: React.FC<{
  pos: V3; r: number; f: number; rotY?: number; look?: [number, number]; talk?: number; mood?: Mood;
  hop?: number; squash?: number; tie?: boolean; legs?: boolean; wave?: number; seed?: number;
}> = ({ pos, r, f, rotY = 0, look = [0, 0], talk = 0, mood = "neutral", hop = 0, squash = 0, tie = true, legs = true, wave = 0, seed = 0 }) => {
  const N = 950;
  const fur = useMemo(() => {
    const out: { dir: Vector3; len: number; ph: number }[] = [];
    let s = 7 + seed;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < N; i++) {
      const y = 1 - (2 * (i + 0.5)) / N, rad = Math.sqrt(1 - y * y), th = i * 2.399963;
      const dir = new Vector3(Math.cos(th) * rad, y, Math.sin(th) * rad);
      const face = dir.z > 0.62 && dir.y > -0.5 && dir.y < 0.62; // keep the face clear
      out.push({ dir, len: face ? 0.001 : 0.55 + rnd() * 0.5, ph: rnd() * 6.28 });
    }
    return out;
  }, [seed]);
  // ink look: he is a tangle of scribbled ink lines that boils like a hand-drawn line
  const ink = LOOK.current === "ink" || LOOK.current === "combo";
  const boil = Math.floor(f / 3);
  const scribble = useMemo(() => {
    if (!ink) return [];
    let s = 11 + seed * 7;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    let b = 101 + boil * 31 + seed;
    const jit = () => ((b = (b * 16807) % 2147483647) / 2147483647 - 0.5) * 0.09;
    const out: TubeGeometry[] = [];
    for (let i = 0; i < 13; i++) {
      const pts: Vector3[] = [];
      const ax = new Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize();
      const u = new Vector3(ax.y, -ax.x, 0.3).normalize(), v = new Vector3().crossVectors(ax, u).normalize();
      for (let k = 0; k < 9; k++) {
        const a = (k / 9) * Math.PI * 2, rr = 1.02 + rnd() * 0.3;
        pts.push(new Vector3().addScaledVector(u, Math.cos(a) * rr).addScaledVector(v, Math.sin(a) * rr).addScaledVector(ax, (rnd() - 0.5) * 0.7).add(new Vector3(jit(), jit(), jit())));
        const q = pts[pts.length - 1];
        if (q.z > 0.45 && Math.abs(q.x) < 0.85 && q.y > -0.35 && q.y < 0.7) q.z = -q.z; // keep the face clear
      }
      out.push(new TubeGeometry(new CatmullRomCurve3(pts, true, "catmullrom", 0.6), 72, 0.035, 5, true));
    }
    return out;
  }, [ink, boil, seed]);
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const m = new Matrix4(), q = new Quaternion(), up = new Vector3(0, 1, 0), sc = new Vector3(), p = new Vector3(), d = new Vector3();
    fur.forEach((h, i) => {
      d.copy(h.dir);
      d.x += Math.sin(f * 0.22 + h.ph) * 0.13; d.y += Math.cos(f * 0.19 + h.ph * 1.7) * 0.13; d.z += Math.sin(f * 0.17 + h.ph * 0.6) * 0.1;
      d.normalize();
      q.setFromUnitVectors(up, d);
      p.copy(h.dir).multiplyScalar(0.9 + 0.22 * h.len);
      sc.set(1, h.len, 1);
      m.compose(p, q, sc);
      ref.current!.setMatrixAt(i, m);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [f, fur]);

  const blink = (f + 40 + seed * 13) % 76 < 3 ? 0.12 : 1;
  const eyeOpen = mood === "shock" ? 1.15 : mood === "smug" ? 0.8 : mood === "sad" ? 0.9 : 1;
  const browRot = mood === "smug" ? -0.38 : mood === "sad" ? 0.42 : mood === "shock" ? 0.15 : mood === "happy" ? 0.12 : 0;
  const browY = mood === "shock" ? 0.74 : mood === "smug" ? 0.56 : 0.64;
  const sq = squash;
  const mouthOpen = 0.3 + talk * 0.9 + (mood === "shock" ? 0.9 : 0);
  const BODY = "#6a6573", FUR = "#7d7888", DARK = "#221c22";
  return (
    <group position={[pos[0], pos[1], pos[2]]} rotation={[0, rotY, 0]} scale={r}>
      {legs && [-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.36, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.45, 8]} />
            <M c={DARK} />
          </mesh>
          <mesh position={[s * 0.36, 0.06, 0.1]} scale={[1, 0.55, 1.5]} castShadow>
            <sphereGeometry args={[0.13, 16, 12]} />
            <M c={DARK} />
          </mesh>
        </group>
      ))}
      <group position={[0, 1.3 + hop / r, 0]} scale={[1 - sq * 0.5, 1 + sq, 1 - sq * 0.5]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[ink ? 0.93 : 1, 40, 28]} />
          <M c={ink ? "#3b3552" : BODY} rough={1} />
        </mesh>
        {ink ? (
          scribble.map((g, i) => (
            <mesh key={i} geometry={g} castShadow>
              <meshBasicMaterial color="#2a2420" />
            </mesh>
          ))
        ) : (
          <instancedMesh ref={ref} args={[undefined, undefined, N]} castShadow>
            <coneGeometry args={[0.075, 0.5, 5]} />
            <M c={FUR} rough={1} />
          </instancedMesh>
        )}
        {/* eyes */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.36, 0.2, 0.82]} scale={[1, blink * eyeOpen, 1]}>
            <mesh>
              <sphereGeometry args={[0.31, 28, 20]} />
              <M c="#fffdf8" rough={0.35} />
            </mesh>
            <mesh position={[look[0] * 0.11, look[1] * 0.11, 0.2]}>
              <sphereGeometry args={[0.15, 20, 16]} />
              <M c="#17131a" rough={0.3} />
            </mesh>
            <mesh position={[look[0] * 0.11 + 0.06, look[1] * 0.11 + 0.07, 0.33]}>
              <sphereGeometry args={[0.04, 10, 8]} />
              <M c="#ffffff" emissive="#ffffff" ei={0.6} />
            </mesh>
          </group>
        ))}
        {/* brows */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.36, browY, 1.02]} rotation={[0, 0, s * browRot]}>
            <boxGeometry args={[0.34, 0.075, 0.08]} />
            <M c={DARK} />
          </mesh>
        ))}
        {/* mouth */}
        {mood === "happy" || mood === "smug" ? (
          <mesh position={[mood === "smug" ? 0.08 : 0, -0.22, 1.0]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.15, 0.035, 8, 20, Math.PI]} />
            <M c={DARK} />
          </mesh>
        ) : (
          <mesh position={[0, -0.3, 0.98]} scale={[mood === "sad" ? 0.9 : 1.2, mouthOpen, 0.5]}>
            <sphereGeometry args={[0.12, 16, 12]} />
            <M c={DARK} />
          </mesh>
        )}
        {/* bow tie */}
        {tie && (
          <group position={[0, -0.72, 0.93]} rotation={[0.25, 0, 0]}>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.13, 0, 0]} rotation={[0, 0, (s * Math.PI) / 2]}>
                <coneGeometry args={[0.13, 0.24, 12]} />
                <M c="#d9643a" />
              </mesh>
            ))}
            <mesh>
              <sphereGeometry args={[0.06, 12, 10]} />
              <M c="#b84e2a" />
            </mesh>
          </group>
        )}
        {/* little waving arm */}
        {wave > 0 && (
          <group position={[0.95, 0.1, 0.2]} rotation={[0, 0, -0.6 + Math.sin(f * 0.45) * 0.5 * wave]}>
            <mesh position={[0.25, 0.25, 0]} rotation={[0, 0, -0.78]}>
              <cylinderGeometry args={[0.05, 0.05, 0.7, 8]} />
              <M c={DARK} />
            </mesh>
            <mesh position={[0.5, 0.5, 0]}>
              <sphereGeometry args={[0.11, 12, 10]} />
              <M c={DARK} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};
