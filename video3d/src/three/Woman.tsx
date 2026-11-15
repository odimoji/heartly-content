import { M, V3 } from "./parts";

export type Pose = {
  walk?: number; // walk-cycle phase in radians
  sit?: boolean; // legs forward
  armL?: [number, number]; // [swing forward(-)/back(+), out]
  armR?: [number, number];
  headTurn?: number;
  headTilt?: number;
  eyes?: "open" | "closed";
  smile?: boolean;
  phone?: boolean; // holds a glowing phone in front of her
  pocket?: React.ReactNode; // something riding in her side pocket
  pillow?: number; // 0..1 lifts a pillow from her lap to hide behind
};

// A soft toy-like character: big head, bun, jumper. Faces +z; pos is at her feet (or seat when sitting).
export const Woman: React.FC<{
  pos: V3; rotY?: number; rotX?: number; pose?: Pose; scale?: number;
  jumper?: string; skin?: string; hair?: string; trousers?: string; bun?: boolean;
}> = ({ pos, rotY = 0, rotX = 0, pose = {}, scale = 1, jumper = "#e3a63a", skin = "#a8744f", hair = "#2b1f1b", trousers = "#3d5a7a", bun = true }) => {
  const sw = pose.walk !== undefined ? Math.sin(pose.walk) * 0.62 : 0;
  const bob = pose.walk !== undefined ? Math.abs(Math.cos(pose.walk)) * 0.035 : 0;
  const legBase = pose.sit ? -Math.PI / 2 : 0;
  const hipY = pose.sit ? 0.09 : 0.52;
  const armL = pose.armL ?? [sw * 0.8, 0.14];
  const armR = pose.armR ?? [-sw * 0.8, 0.14];
  const arms: [number, [number, number]][] = [[1, armL], [-1, armR]];
  return (
    <group position={[pos[0], pos[1] + bob, pos[2]]} rotation={[rotX, rotY, 0]} scale={scale}>
      <group position={[0, hipY - 0.52, 0]}>
        {/* legs */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.105, 0.52, 0]} rotation={[legBase + (pose.sit ? 0 : s * sw), 0, 0]}>
            <mesh position={[0, -0.23, 0]} castShadow>
              <capsuleGeometry args={[0.082, 0.3, 8, 16]} />
              <M c={trousers} />
            </mesh>
            <mesh position={[0, -0.49, 0.05]} scale={[1, 0.62, 1.55]} castShadow>
              <sphereGeometry args={[0.092, 18, 14]} />
              <M c="#f5efe4" />
            </mesh>
          </group>
        ))}
        {/* jumper */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.215, 0.24, 10, 24]} />
          <M c={jumper} />
        </mesh>
        <mesh position={[0, 0.6, 0]} scale={[1, 0.5, 1]} castShadow>
          <sphereGeometry args={[0.235, 24, 16]} />
          <M c={jumper} />
        </mesh>
        {/* side pocket (her right side) */}
        {pose.pocket && (
          <group position={[-0.2, 0.7, 0.03]}>
            <mesh position={[-0.035, -0.02, 0]} scale={[0.5, 1, 1]} castShadow>
              <sphereGeometry args={[0.13, 18, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
              <M c="#c98d27" />
            </mesh>
            <group position={[-0.05, 0.0, 0]} rotation={[0, -Math.PI / 2, 0]}>{pose.pocket}</group>
          </group>
        )}
        {/* arms */}
        {arms.map(([s, a]) => (
          <group key={s} position={[s * 0.25, 0.99, 0]} rotation={[a[0], 0, s * a[1]]}>
            <mesh position={[0, -0.19, 0]} castShadow>
              <capsuleGeometry args={[0.066, 0.27, 8, 14]} />
              <M c={jumper} />
            </mesh>
            <mesh position={[0, -0.41, 0]} castShadow>
              <sphereGeometry args={[0.07, 16, 12]} />
              <M c={skin} />
            </mesh>
          </group>
        ))}
        {pose.phone && (
          <mesh position={[0, 0.83, 0.44]} rotation={[-0.5, 0, 0]}>
            <boxGeometry args={[0.13, 0.24, 0.02]} />
            <M c="#dfe6ff" emissive="#b9c8ff" ei={1.6} />
          </mesh>
        )}
        {pose.pillow !== undefined && (
          <mesh position={[0, 0.72 + pose.pillow * 0.56, 0.3 + pose.pillow * 0.04]} rotation={[-0.2 * pose.pillow, 0, 0]} scale={[1.55, 1.05, 0.42]} castShadow>
            <sphereGeometry args={[0.23, 24, 18]} />
            <M c="#fbf6ee" />
          </mesh>
        )}
        {/* head */}
        <group position={[0, 1.37, 0]} rotation={[pose.headTilt ?? 0, pose.headTurn ?? 0, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.275, 36, 28]} />
            <M c={skin} rough={0.7} />
          </mesh>
          <mesh position={[0, 0.045, -0.055]} castShadow>
            <sphereGeometry args={[0.292, 36, 28]} />
            <M c={hair} rough={0.95} />
          </mesh>
          {bun && (
            <mesh position={[0, 0.36, -0.1]} castShadow>
              <sphereGeometry args={[0.125, 24, 18]} />
              <M c={hair} rough={0.95} />
            </mesh>
          )}
          {/* ears */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.27, -0.03, 0]}>
              <sphereGeometry args={[0.045, 12, 10]} />
              <M c={skin} rough={0.7} />
            </mesh>
          ))}
          {/* eyes */}
          {[-1, 1].map((s) =>
            pose.eyes === "closed" ? (
              <mesh key={s} position={[s * 0.1, -0.03, 0.262]} rotation={[0, 0, Math.PI]}>
                <torusGeometry args={[0.035, 0.009, 6, 12, Math.PI]} />
                <M c="#1c1512" />
              </mesh>
            ) : (
              <mesh key={s} position={[s * 0.1, -0.02, 0.258]} scale={[1, 1.25, 0.6]}>
                <sphereGeometry args={[0.03, 12, 10]} />
                <M c="#1c1512" rough={0.3} />
              </mesh>
            ),
          )}
          {/* cheeks */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.165, -0.085, 0.215]} scale={[1, 0.7, 0.4]}>
              <sphereGeometry args={[0.04, 12, 10]} />
              <M c="#c97f62" />
            </mesh>
          ))}
          {pose.smile && (
            <mesh position={[0, -0.1, 0.262]} rotation={[0, 0, Math.PI]}>
              <torusGeometry args={[0.04, 0.009, 6, 12, Math.PI]} />
              <M c="#1c1512" />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
};
