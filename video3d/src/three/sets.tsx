import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import { Ball, Cyl, M, RBox, Stick, V3 } from "./parts";

const INK = "#2a2420", EMBER = "#d9643a";

// ---------- flipchart ----------
export type Slide = { kind: "cover" } | { kind: "one" } | { kind: "three" } | { kind: "list"; cross: [number, number, number] };

const drawSlide = (ctx: CanvasRenderingContext2D, s: Slide, W: number, H: number) => {
  ctx.fillStyle = "#fffdf6"; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineCap = "round"; ctx.lineJoin = "round";
  const txt = (t: string, x: number, y: number, size: number, col = INK, align: CanvasTextAlign = "center") => {
    ctx.font = `700 ${size}px Caveat`; ctx.fillStyle = col; ctx.textAlign = align; ctx.fillText(t, x, y);
  };
  if (s.kind === "cover") {
    txt("worry’s", W / 2, 250, 120, EMBER); txt("3am briefing", W / 2, 390, 120);
    ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(150, 480); ctx.lineTo(W - 150, 480); ctx.stroke();
    txt("(3 slides. no breaks.)", W / 2, 570, 62, "#6d625a");
  } else if (s.kind === "one") {
    txt("slide 1", W / 2, 120, 84, EMBER);
    txt("you’re getting", W / 2, 270, 112); txt("fired.", W / 2, 390, 128);
    // a chart going down
    ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(130, 500); ctx.lineTo(130, 760); ctx.lineTo(W - 110, 760); ctx.stroke();
    ctx.strokeStyle = EMBER; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(150, 540); ctx.lineTo(270, 580); ctx.lineTo(370, 560); ctx.lineTo(470, 680); ctx.lineTo(W - 140, 735); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - 140, 735); ctx.lineTo(W - 190, 690); ctx.moveTo(W - 140, 735); ctx.lineTo(W - 200, 748); ctx.stroke();
  } else if (s.kind === "three") {
    txt("slide 3", W / 2, 120, 84, EMBER);
    txt("everyone’s", W / 2, 260, 112); txt("annoyed", W / 2, 370, 112); txt("with you.", W / 2, 480, 112);
    for (let i = 0; i < 3; i++) {
      const x = 190 + i * 155, y = 665;
      ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(x, y, 56, 0, 6.29); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 34, y - 26); ctx.lineTo(x - 10, y - 12); ctx.moveTo(x + 34, y - 26); ctx.lineTo(x + 10, y - 12); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y + 34, 20, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    }
  } else {
    txt("what if:", 90, 130, 110, EMBER, "left");
    const items = ["1. you get fired", "2. that mole", "3. everyone’s annoyed"];
    items.forEach((t, i) => {
      const y = 300 + i * 150; txt(t, 70, y, 72, INK, "left");
      const w = ctx.measureText(t).width, k = s.cross[i];
      if (k > 0) { ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(58, y + 6); ctx.lineTo(58 + (w + 24) * k, y - 2); ctx.stroke(); }
    });
  }
};

export const Flipchart: React.FC<{ pos: V3; rotY?: number; slide: Slide; fonts: boolean; glow?: number }> = ({ pos, rotY = 0, slide, fonts, glow = 0.25 }) => {
  const key = JSON.stringify(slide) + fonts;
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 688; c.height = 848;
    drawSlide(c.getContext("2d")!, slide, 688, 848);
    const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; return t;
  }, [key]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <Stick a={[-0.36, 0, 0.12]} b={[-0.2, 1.95, -0.03]} r={0.022} c="#8a6a4f" />
      <Stick a={[0.36, 0, 0.12]} b={[0.2, 1.95, -0.03]} r={0.022} c="#8a6a4f" />
      <Stick a={[0, 0, -0.4]} b={[0, 1.95, -0.03]} r={0.022} c="#8a6a4f" />
      <RBox size={[0.98, 1.18, 0.04]} pos={[0, 1.32, 0.02]} c="#efe6d8" r={0.015} />
      <mesh position={[0, 1.32, 0.045]}>
        <planeGeometry args={[0.88, 1.085]} />
        <meshStandardMaterial map={tex} roughness={0.9} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={glow} />
      </mesh>
      <RBox size={[1.0, 0.07, 0.07]} pos={[0, 1.9, 0.04]} c={EMBER} r={0.02} />
    </group>
  );
};

// ---------- room shell ----------
export const Room: React.FC<{ floor: string; wall: string; wall2?: string; trim?: string; floorTex?: CanvasTexture }> = ({ floor, wall, wall2, trim = "#f3ead9", floorTex }) => (
  <group>
    <RBox size={[2.96, 0.3, 2.16]} pos={[0, -0.15, 0]} c={floor} r={0.04} />
    {floorTex && (
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.86, 2.06]} />
        <meshStandardMaterial map={floorTex} roughness={0.85} />
      </mesh>
    )}
    <RBox size={[2.96, 2.5, 0.14]} pos={[0, 1.1, -1.08]} c={wall} r={0.04} />
    <RBox size={[0.14, 2.5, 2.16]} pos={[-1.48, 1.1, 0]} c={wall2 ?? wall} r={0.04} />
    <RBox size={[2.8, 0.1, 0.03]} pos={[0, 0.05, -1.0]} c={trim} r={0.01} />
    <RBox size={[0.03, 0.1, 2.0]} pos={[-1.4, 0.05, 0]} c={trim} r={0.01} />
  </group>
);

export const Window: React.FC<{ pos: V3; sky: string; glow?: number; moon?: boolean; w?: number; h?: number }> = ({ pos, sky, glow = 1, moon, w = 0.8, h = 0.9 }) => (
  <group position={pos}>
    <RBox size={[w + 0.12, h + 0.12, 0.06]} pos={[0, 0, 0]} c="#f3ead9" r={0.02} />
    <mesh position={[0, 0, 0.035]}>
      <planeGeometry args={[w, h]} />
      <M c={sky} emissive={sky} ei={glow} />
    </mesh>
    {moon && (
      <mesh position={[0.14, 0.14, 0.04]}>
        <circleGeometry args={[0.13, 32]} />
        <M c="#fff6d8" emissive="#fff3c8" ei={2.2} />
      </mesh>
    )}
    <RBox size={[0.03, h, 0.03]} pos={[0, 0, 0.05]} c="#f3ead9" r={0.01} shadow={false} />
    <RBox size={[w, 0.03, 0.03]} pos={[0, 0, 0.05]} c="#f3ead9" r={0.01} shadow={false} />
    <RBox size={[w + 0.24, 0.05, 0.14]} pos={[0, -h / 2 - 0.07, 0.06]} c="#f3ead9" r={0.02} />
  </group>
);

const Plant: React.FC<{ pos: V3; s?: number }> = ({ pos, s = 1 }) => (
  <group position={pos} scale={s}>
    <Cyl pos={[0, 0.13, 0]} r={0.1} r2={0.13} h={0.26} c="#c9744f" />
    {[[0, 0.45, 0, 0.17], [-0.12, 0.36, 0.05, 0.12], [0.12, 0.38, -0.03, 0.13], [0.03, 0.6, 0.02, 0.11]].map((p, i) => (
      <Ball key={i} pos={[p[0], p[1], p[2]]} r={p[3]} c={i % 2 ? "#5f8a55" : "#6f9a61"} />
    ))}
  </group>
);

// ---------- bedroom ----------
export const Bedroom: React.FC<{ slide: Slide; fonts: boolean; dawn?: number; f: number; chartX?: number }> = ({ slide, fonts, dawn = 0, f, chartX = 0.32 }) => {
  const sky = dawn > 0.5 ? "#f6b58c" : "#27306f";
  return (
    <group>
      <Room floor="#6a513f" wall={dawn > 0.5 ? "#6f6796" : "#48427c"} wall2={dawn > 0.5 ? "#675f8d" : "#403a70"} />
      <Window pos={[-0.78, 1.72, -1.0]} sky={sky} glow={dawn > 0.5 ? 1.3 : 0.9} moon={dawn < 0.5} />
      {/* bed */}
      <RBox size={[1.08, 0.24, 1.9]} pos={[-0.8, 0.2, -0.02]} c="#7a5640" r={0.04} />
      <RBox size={[1.0, 0.18, 1.8]} pos={[-0.8, 0.38, -0.02]} c="#efe6d8" r={0.06} />
      <RBox size={[1.12, 0.85, 0.1]} pos={[-0.8, 0.62, -0.95]} c="#7a5640" r={0.05} />
      <RBox size={[0.66, 0.14, 0.4]} pos={[-0.8, 0.52, -0.68]} c="#fbf6ee" r={0.065} />
      <RBox size={[1.06, 0.56, 1.12]} pos={[-0.8, 0.6, 0.42]} c="#9474bd" r={0.2} />
      <RBox size={[1.07, 0.5, 0.2]} pos={[-0.8, 0.62, -0.12]} c="#f3ead9" r={0.09} />
      {/* rug + slippers */}
      <Cyl pos={[0.55, 0.012, 0.3]} r={0.78} h={0.024} c="#8566ad" />
      <Ball pos={[-0.12, 0.04, 0.45]} r={0.07} c="#f2c4a0" scale={[1, 0.55, 1.6]} />
      <Ball pos={[0.04, 0.04, 0.5]} r={0.07} c="#f2c4a0" scale={[1, 0.55, 1.6]} />
      {/* flipchart */}
      <Flipchart pos={[chartX, 0, -0.5]} rotY={0.12} slide={slide} fonts={fonts} glow={dawn > 0.5 ? 0.15 : 0.5} />
      {/* floor lamp */}
      <Cyl pos={[1.18, 0.02, -0.78]} r={0.14} h={0.04} c="#3b3440" />
      <Stick a={[1.18, 0, -0.78]} b={[1.18, 1.62, -0.78]} r={0.018} c="#3b3440" />
      <Cyl pos={[1.18, 1.68, -0.78]} r={0.2} r2={0.11} h={0.26} c="#ffd9a0" emissive="#ffc27a" ei={dawn > 0.5 ? 0.25 : 1.5} />
      {/* string lights */}
      {Array.from({ length: 11 }).map((_, i) => {
        const k = i / 10, x = -1.25 + k * 2.5, y = 2.2 - Math.sin(k * Math.PI) * 0.16 - Math.sin(k * Math.PI * 3) * 0.03;
        const on = 0.9 + 0.5 * Math.sin(f * 0.12 + i * 1.3);
        return <Ball key={i} pos={[x, y, -0.98]} r={0.035} c="#ffe2a8" emissive="#ffcf80" ei={dawn > 0.5 ? 0.3 : on * 1.8} shadow={false} />;
      })}
      {/* clock on the nightstand side */}
      <RBox size={[0.3, 0.4, 0.3]} pos={[-0.1, 0.2, -0.82]} c="#7a5640" r={0.03} />
      <RBox size={[0.2, 0.1, 0.08]} pos={[-0.1, 0.45, -0.8]} c="#2a2530" r={0.02} emissive="#ff8a5c" ei={0.5} />
    </group>
  );
};

// ---------- street ----------
const House: React.FC<{ pos: V3; c: string; roof: string; w?: number; h?: number }> = ({ pos, c, roof, w = 1.0, h = 1.15 }) => (
  <group position={pos}>
    <RBox size={[w, h, 0.5]} pos={[0, h / 2, 0]} c={c} r={0.03} />
    <mesh position={[0, h + 0.27, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1, 1, 0.5]} castShadow>
      <coneGeometry args={[w * 0.78, 0.56, 4]} />
      <M c={roof} />
    </mesh>
    <RBox size={[0.2, 0.42, 0.04]} pos={[-w * 0.22, 0.21, 0.26]} c={roof} r={0.02} />
    <RBox size={[0.24, 0.24, 0.04]} pos={[w * 0.2, 0.42, 0.26]} c="#fdf3d2" r={0.02} emissive="#ffe9a8" ei={0.25} />
    <RBox size={[0.24, 0.24, 0.04]} pos={[w * 0.2, 0.86, 0.26]} c="#fdf3d2" r={0.02} emissive="#ffe9a8" ei={0.25} />
    <RBox size={[0.24, 0.24, 0.04]} pos={[-w * 0.22, 0.86, 0.26]} c="#fdf3d2" r={0.02} emissive="#ffe9a8" ei={0.25} />
  </group>
);

export const Street: React.FC = () => (
  <group>
    <RBox size={[2.96, 0.3, 2.16]} pos={[0, -0.15, 0]} c="#ddd0be" r={0.04} />
    <RBox size={[2.96, 0.3, 0.62]} pos={[0, -0.17, 0.78]} c="#77717a" r={0.04} />
    {[-1.0, -0.33, 0.33, 1.0].map((x) => <RBox key={x} size={[0.34, 0.02, 0.05]} pos={[x, -0.015, 0.82]} c="#efe7da" r={0.005} shadow={false} />)}
    <House pos={[-0.72, 0, -0.78]} c="#f0b79a" roof="#b5563f" />
    <House pos={[0.5, 0, -0.78]} c="#a9cbd6" roof="#5d7f93" w={1.1} h={1.3} />
    {/* garden wall + hedge */}
    <RBox size={[2.9, 0.36, 0.12]} pos={[0, 0.18, -0.38]} c="#c0694c" r={0.03} />
    {[-1.2, -0.85, -0.5, 0.95, 1.25].map((x, i) => <Ball key={x} pos={[x, 0.42, -0.5]} r={0.2 + (i % 2) * 0.04} c={i % 2 ? "#6f9a61" : "#5f8a55"} />)}
    {/* tree */}
    <Cyl pos={[1.18, 0.5, -0.72]} r={0.07} h={1.0} c="#7a5640" />
    <Ball pos={[1.18, 1.25, -0.72]} r={0.36} c="#e8943a" />
    <Ball pos={[0.98, 1.05, -0.62]} r={0.24} c="#f0a84a" />
    <Ball pos={[1.3, 1.02, -0.6]} r={0.22} c="#dd8230" />
    {/* lamp post */}
    <Stick a={[-1.2, 0, -0.2]} b={[-1.2, 1.75, -0.2]} r={0.03} c="#3b3440" />
    <Ball pos={[-1.2, 1.82, -0.2]} r={0.1} c="#fff3d0" emissive="#ffe6a8" ei={0.6} />
    <Cyl pos={[-1.2, 0.04, -0.2]} r={0.08} h={0.08} c="#3b3440" />
  </group>
);

// ---------- office ----------
export const Office: React.FC = () => (
  <group>
    <Room floor="#c79a6c" wall="#dfe9e2" wall2="#d3dfd8" />
    <Window pos={[-0.55, 1.6, -1.0]} sky="#bfe3f5" glow={0.9} w={0.9} h={0.8} />
    {/* shelf + books */}
    <RBox size={[0.9, 0.05, 0.2]} pos={[0.75, 1.75, -0.92]} c="#8a6a4f" r={0.015} />
    {[["#d9643a", 0.26], ["#5e7f4e", 0.3], ["#e3a63a", 0.22], ["#5d7f93", 0.28], ["#f0b79a", 0.24]].map(([c, h], i) => (
      <RBox key={i} size={[0.07, h as number, 0.15]} pos={[0.42 + i * 0.09, 1.78 + (h as number) / 2, -0.92]} c={c as string} r={0.01} />
    ))}
    <Plant pos={[1.02, 1.78, -0.92]} s={0.5} />
    {/* clock */}
    <Cyl pos={[0.2, 1.75, -0.99]} r={0.17} h={0.04} c="#fffaf0" rot={[Math.PI / 2, 0, 0]} />
    <Stick a={[0.2, 1.75, -0.96]} b={[0.2, 1.86, -0.96]} r={0.008} c={INK} />
    <Stick a={[0.2, 1.75, -0.96]} b={[0.28, 1.72, -0.96]} r={0.008} c={INK} />
    {/* desk */}
    <RBox size={[1.45, 0.06, 0.7]} pos={[0.3, 0.74, -0.2]} c="#a97c55" r={0.02} />
    {[[-0.36, -0.5], [-0.36, 0.1], [0.96, -0.5], [0.96, 0.1]].map(([x, z], i) => <RBox key={i} size={[0.06, 0.72, 0.06]} pos={[x, 0.36, z]} c="#8a6a4f" r={0.015} />)}
    {/* laptop */}
    <RBox size={[0.32, 0.02, 0.42]} pos={[0.02, 0.78, -0.2]} c="#cfd3d8" r={0.008} />
    <RBox size={[0.02, 0.3, 0.42]} pos={[0.2, 0.92, -0.2]} rot={[0, 0, -0.22]} c="#cfd3d8" r={0.008} emissive="#dfe8ff" ei={0.15} />
    {/* mug + papers */}
    <Cyl pos={[0.5, 0.82, -0.42]} r={0.05} h={0.1} c="#d9643a" />
    <RBox size={[0.26, 0.012, 0.34]} pos={[0.45, 0.777, 0.0]} rot={[0, 0.3, 0]} c="#fffdf6" r={0.004} />
    {/* chair */}
    <RBox size={[0.46, 0.07, 0.46]} pos={[-0.62, 0.43, -0.2]} c="#5d7f93" r={0.03} />
    <RBox size={[0.07, 0.6, 0.44]} pos={[-0.84, 0.76, -0.2]} c="#5d7f93" r={0.03} />
    <Cyl pos={[-0.62, 0.21, -0.2]} r={0.03} h={0.42} c="#3b3440" />
    <Cyl pos={[-0.62, 0.02, -0.2]} r={0.22} h={0.04} c="#3b3440" />
    <Plant pos={[1.15, 0, -0.7]} s={1.1} />
  </group>
);

// ---------- cafe ----------
export const Cafe: React.FC<{ f: number }> = ({ f }) => {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 560; c.height = 400; const x = c.getContext("2d")!;
    for (let i = 0; i < 7; i++) for (let j = 0; j < 5; j++) { x.fillStyle = (i + j) % 2 ? "#f3e6d0" : "#d8b98f"; x.fillRect(i * 80, j * 80, 80, 80); }
    const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
  }, []);
  return (
    <group>
      <Room floor="#d8b98f" wall="#5f8f7b" wall2="#568371" floorTex={tex} />
      {/* menu board */}
      <RBox size={[0.7, 0.9, 0.05]} pos={[-0.75, 1.55, -0.99]} c="#2f3a36" r={0.02} />
      {[0, 1, 2, 3].map((i) => <RBox key={i} size={[0.42 - (i % 2) * 0.1, 0.03, 0.01]} pos={[-0.78, 1.78 - i * 0.14, -0.96]} c="#f3ead9" r={0.004} shadow={false} />)}
      {/* shelf with cups */}
      <RBox size={[1.0, 0.05, 0.2]} pos={[0.65, 1.6, -0.92]} c="#8a6a4f" r={0.015} />
      {[0.3, 0.48, 0.66, 0.84].map((x, i) => <Cyl key={x} pos={[x, 1.68, -0.92]} r={0.045} h={0.1} c={["#f3ead9", "#e3a63a", "#f0b79a", "#f3ead9"][i]} />)}
      <Plant pos={[1.0, 1.63, -0.92]} s={0.45} />
      {/* pendant lamps */}
      {[-0.5, 0.5].map((x) => (
        <group key={x}>
          <Stick a={[x, 2.35, -0.1]} b={[x, 1.98, -0.1]} r={0.008} c="#3b3440" />
          <Cyl pos={[x, 1.9, -0.1]} r={0.17} r2={0.05} h={0.16} c="#e3a63a" emissive="#ffc27a" ei={0.5 + 0.05 * Math.sin(f * 0.1 + x)} />
        </group>
      ))}
      {/* table */}
      <Cyl pos={[0, 0.74, 0]} r={0.46} h={0.05} c="#f3ead9" />
      <Cyl pos={[0, 0.37, 0]} r={0.035} h={0.72} c="#3b3440" />
      <Cyl pos={[0, 0.02, 0]} r={0.24} h={0.04} c="#3b3440" />
      {/* pancakes + cups */}
      <Cyl pos={[0, 0.775, 0.26]} r={0.11} h={0.012} c="#fffdf6" />
      {[0, 1, 2].map((i) => <Cyl key={i} pos={[0, 0.795 + i * 0.025, 0.26]} r={0.075} h={0.022} c="#e0a45a" />)}
      <RBox size={[0.04, 0.02, 0.04]} pos={[0, 0.87, 0.26]} c="#ffe9a8" r={0.005} />
      <Cyl pos={[-0.3, 0.8, 0.12]} r={0.04} h={0.08} c="#d9643a" />
      <Cyl pos={[0.3, 0.8, 0.12]} r={0.04} h={0.08} c="#5d7f93" />
      {/* chairs */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <RBox size={[0.42, 0.06, 0.42]} pos={[s * 0.82, 0.43, 0]} c="#b5654a" r={0.03} />
          <RBox size={[0.06, 0.56, 0.42]} pos={[s * 1.02, 0.74, 0]} c="#b5654a" r={0.03} />
          {[[-0.16, -0.16], [0.16, -0.16], [-0.16, 0.16], [0.16, 0.16]].map(([x, z], i) => <RBox key={i} size={[0.04, 0.42, 0.04]} pos={[s * 0.82 + x, 0.21, z]} c="#8a4a36" r={0.01} />)}
        </group>
      ))}
      <Plant pos={[-1.15, 0, -0.75]} s={1.2} />
    </group>
  );
};
