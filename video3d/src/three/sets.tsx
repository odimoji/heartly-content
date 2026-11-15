// Sets for the "night to dawn" look: warm low-key rooms that sit like small lit stages on Heartly's midnight ground.
// Colours stay in the brand family (midnight, cream, gold, ember, terracotta); violet is kept for Worry alone.
import { useEffect, useMemo } from "react";
import { CanvasTexture, Color, SRGBColorSpace } from "three";
import { Ball, Cyl, M, RBox, Stick, V3 } from "./parts";

const INK = "#2a2420", EMBER = "#d9643a", GOLD = "#d9b26a", CREAM = "#f1e6d6", WOOD = "#7a5640", DARKWOOD = "#4f382a";
const mix = (a: string, b: string, k: number) => "#" + new Color(a).lerp(new Color(b), k).getHexString();

// ---------- flipchart ----------
export type Slide = { kind: "cover" } | { kind: "one" } | { kind: "two" } | { kind: "three" } | { kind: "list"; cross: [number, number, number] };

const drawSlide = (ctx: CanvasRenderingContext2D, s: Slide, W: number, H: number) => {
  ctx.fillStyle = "#fffaf0"; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineCap = "round"; ctx.lineJoin = "round";
  const txt = (t: string, x: number, y: number, size: number, col = INK, align: CanvasTextAlign = "center") => {
    ctx.font = `700 ${size}px Caveat`; ctx.fillStyle = col; ctx.textAlign = align; ctx.fillText(t, x, y);
  };
  if (s.kind === "cover") {
    txt("worry’s", W / 2, 250, 124, EMBER); txt("3am briefing", W / 2, 390, 124);
    ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(150, 480); ctx.lineTo(W - 150, 480); ctx.stroke();
    txt("(3 slides. no breaks.)", W / 2, 570, 64, "#6d625a");
  } else if (s.kind === "one") {
    txt("slide 1", W / 2, 120, 88, EMBER);
    txt("you’re getting", W / 2, 270, 116); txt("fired.", W / 2, 395, 136);
    ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(130, 500); ctx.lineTo(130, 760); ctx.lineTo(W - 110, 760); ctx.stroke();
    ctx.strokeStyle = EMBER; ctx.lineWidth = 13; ctx.beginPath(); ctx.moveTo(150, 540); ctx.lineTo(270, 580); ctx.lineTo(370, 560); ctx.lineTo(470, 680); ctx.lineTo(W - 140, 735); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - 140, 735); ctx.lineTo(W - 190, 690); ctx.moveTo(W - 140, 735); ctx.lineTo(W - 200, 748); ctx.stroke();
  } else if (s.kind === "two") {
    txt("slide 2", W / 2, 120, 88, EMBER);
    txt("that mole.", W / 2, 300, 136);
    ctx.fillStyle = "#7a5640"; ctx.beginPath(); ctx.arc(W / 2, 570, 46, 0, 6.29); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(W / 2, 570, 120, 0, 6.29); ctx.stroke();
    txt("?", W / 2 + 190, 520, 150, EMBER);
  } else if (s.kind === "three") {
    txt("slide 3", W / 2, 120, 88, EMBER);
    txt("everyone’s", W / 2, 260, 116); txt("annoyed", W / 2, 372, 116); txt("with you.", W / 2, 484, 116);
    for (let i = 0; i < 3; i++) {
      const x = 190 + i * 155, y = 668;
      ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(x, y, 56, 0, 6.29); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 34, y - 26); ctx.lineTo(x - 10, y - 12); ctx.moveTo(x + 34, y - 26); ctx.lineTo(x + 10, y - 12); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y + 34, 20, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    }
  } else {
    txt("what if:", 70, 130, 112, EMBER, "left");
    const items = ["1. you get fired", "2. that mole", "3. everyone’s annoyed"];
    items.forEach((t, i) => {
      const y = 300 + i * 150; txt(t, 70, y, 72, INK, "left");
      const w = ctx.measureText(t).width, k = s.cross[i];
      if (k > 0) { ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(58, y + 6); ctx.lineTo(58 + (w + 24) * k, y - 2); ctx.stroke(); }
    });
  }
};

const useSlideTex = (slide: Slide, fonts: boolean) => {
  const key = JSON.stringify(slide) + fonts;
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 688; c.height = 848;
    drawSlide(c.getContext("2d")!, slide, 688, 848);
    const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; return t;
  }, [key]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
};

// prev + flip (0..1): the previous page lifts and flips over the top bar to reveal `slide`
export const Flipchart: React.FC<{ pos: V3; rotY?: number; slide: Slide; prev?: Slide; flip?: number; fonts: boolean; glow?: number }> = ({ pos, rotY = 0, slide, prev, flip = 1, fonts, glow = 0.25 }) => {
  const tex = useSlideTex(slide, fonts);
  const ptex = useSlideTex(prev ?? slide, fonts);
  const flipping = prev && flip < 1;
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
      {flipping && (
        <group position={[0, 1.8625, 0.05]} rotation={[-flip * 2.9, 0, 0]}>
          <mesh position={[0, -0.5425, 0.004]}>
            <planeGeometry args={[0.88, 1.085]} />
            <meshStandardMaterial map={ptex} roughness={0.9} emissive="#ffffff" emissiveMap={ptex} emissiveIntensity={glow} side={2} />
          </mesh>
        </group>
      )}
      <RBox size={[1.0, 0.07, 0.07]} pos={[0, 1.9, 0.04]} c={EMBER} r={0.02} />
    </group>
  );
};

// ---------- room shell ----------
export const Room: React.FC<{ floor: string; wall: string; wall2?: string; trim?: string; floorTex?: CanvasTexture }> = ({ floor, wall, wall2, trim = "#e9dcc6", floorTex }) => (
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

export const Window: React.FC<{ pos: V3; sky: string; glow?: number; moon?: number; w?: number; h?: number }> = ({ pos, sky, glow = 1, moon = 0, w = 0.8, h = 0.9 }) => (
  <group position={pos}>
    <RBox size={[w + 0.12, h + 0.12, 0.06]} pos={[0, 0, 0]} c="#e9dcc6" r={0.02} />
    <mesh position={[0, 0, 0.035]}>
      <planeGeometry args={[w, h]} />
      <M c={sky} emissive={sky} ei={glow} />
    </mesh>
    {moon > 0.05 && (
      <mesh position={[0.14, 0.14, 0.04]} scale={moon}>
        <circleGeometry args={[0.13, 32]} />
        <M c="#fff6d8" emissive="#fff3c8" ei={2.2} />
      </mesh>
    )}
    <RBox size={[0.03, h, 0.03]} pos={[0, 0, 0.05]} c="#e9dcc6" r={0.01} shadow={false} />
    <RBox size={[w, 0.03, 0.03]} pos={[0, 0, 0.05]} c="#e9dcc6" r={0.01} shadow={false} />
    <RBox size={[w + 0.24, 0.05, 0.14]} pos={[0, -h / 2 - 0.07, 0.06]} c="#e9dcc6" r={0.02} />
  </group>
);

const Plant: React.FC<{ pos: V3; s?: number }> = ({ pos, s = 1 }) => (
  <group position={pos} scale={s}>
    <Cyl pos={[0, 0.13, 0]} r={0.1} r2={0.13} h={0.26} c="#b5654a" />
    {[[0, 0.45, 0, 0.17], [-0.12, 0.36, 0.05, 0.12], [0.12, 0.38, -0.03, 0.13], [0.03, 0.6, 0.02, 0.11]].map((p, i) => (
      <Ball key={i} pos={[p[0], p[1], p[2]]} r={p[3]} c={i % 2 ? "#74845c" : "#869668"} />
    ))}
  </group>
);

// ---------- bedroom (dawn: 0 night .. 1 sunrise) ----------
export const Bedroom: React.FC<{ slide: Slide; prev?: Slide; flip?: number; fonts: boolean; dawn?: number; f: number; chartX?: number; pillowUp?: number }> = ({ slide, prev, flip, fonts, dawn = 0, f, chartX = 0.32, pillowUp = 0 }) => (
  <group>
    <Room floor="#5a4030" wall="#4a3640" wall2="#42303a" />
    <Window pos={[-0.78, 1.72, -1.0]} sky={mix("#1f1a38", "#f6b58c", dawn)} glow={0.8 + dawn * 0.7} moon={1 - dawn} />
    {/* bed */}
    <RBox size={[1.08, 0.24, 1.9]} pos={[-0.8, 0.2, -0.02]} c={WOOD} r={0.04} />
    <RBox size={[1.0, 0.18, 1.8]} pos={[-0.8, 0.38, -0.02]} c="#efe6d8" r={0.06} />
    <RBox size={[1.12, 0.85, 0.1]} pos={[-0.8, 0.62, -0.95]} c={WOOD} r={0.05} />
    {pillowUp < 0.05 && <RBox size={[0.66, 0.14, 0.4]} pos={[-0.8, 0.52, -0.68]} c="#fbf6ee" r={0.065} />}
    <RBox size={[1.06, 0.56, 1.12]} pos={[-0.8, 0.6, 0.42]} c="#b9623f" r={0.2} />
    <RBox size={[1.07, 0.5, 0.2]} pos={[-0.8, 0.62, -0.12]} c="#f1e6d6" r={0.09} />
    {/* rug + slippers */}
    <Cyl pos={[0.55, 0.012, 0.3]} r={0.78} h={0.024} c="#d8c3a2" />
    <Ball pos={[-0.12, 0.04, 0.45]} r={0.07} c={GOLD} scale={[1, 0.55, 1.6]} />
    <Ball pos={[0.04, 0.04, 0.5]} r={0.07} c={GOLD} scale={[1, 0.55, 1.6]} />
    <Flipchart pos={[chartX, 0, -0.5]} rotY={0.12} slide={slide} prev={prev} flip={flip} fonts={fonts} glow={0.5 - dawn * 0.35} />
    {/* floor lamp */}
    <Cyl pos={[1.18, 0.02, -0.78]} r={0.14} h={0.04} c="#2a211b" />
    <Stick a={[1.18, 0, -0.78]} b={[1.18, 1.62, -0.78]} r={0.018} c="#2a211b" />
    <Cyl pos={[1.18, 1.68, -0.78]} r={0.2} r2={0.11} h={0.26} c="#ffd9a0" emissive="#ffb86a" ei={1.5 - dawn * 1.25} />
    {/* string lights */}
    {Array.from({ length: 11 }).map((_, i) => {
      const k = i / 10, x = -1.25 + k * 2.5, y = 2.2 - Math.sin(k * Math.PI) * 0.16 - Math.sin(k * Math.PI * 3) * 0.03;
      const on = 0.9 + 0.5 * Math.sin(f * 0.12 + i * 1.3);
      return <Ball key={i} pos={[x, y, -0.98]} r={0.035} c="#ffe2a8" emissive="#ffc978" ei={on * 1.8 * (1 - dawn * 0.85)} shadow={false} />;
    })}
    {/* nightstand + clock */}
    <RBox size={[0.3, 0.4, 0.3]} pos={[-0.1, 0.2, -0.82]} c={WOOD} r={0.03} />
    <RBox size={[0.2, 0.1, 0.08]} pos={[-0.1, 0.45, -0.8]} c="#2a2530" r={0.02} emissive="#ff8a5c" ei={0.6} />
  </group>
);

// ---------- street (golden morning) ----------
const House: React.FC<{ pos: V3; c: string; roof: string; w?: number; h?: number }> = ({ pos, c, roof, w = 1.0, h = 1.15 }) => (
  <group position={pos}>
    <RBox size={[w, h, 0.5]} pos={[0, h / 2, 0]} c={c} r={0.03} />
    <mesh position={[0, h + 0.27, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1, 1, 0.5]} castShadow>
      <coneGeometry args={[w * 0.78, 0.56, 4]} />
      <M c={roof} />
    </mesh>
    <RBox size={[0.2, 0.42, 0.04]} pos={[-w * 0.22, 0.21, 0.26]} c={roof} r={0.02} />
    {[[w * 0.2, 0.42], [w * 0.2, 0.86], [-w * 0.22, 0.86]].map(([x, y], i) => <RBox key={i} size={[0.24, 0.24, 0.04]} pos={[x, y, 0.26]} c="#fdf3d2" r={0.02} emissive="#ffd98a" ei={0.55} />)}
  </group>
);

export const Street: React.FC = () => (
  <group>
    <RBox size={[2.96, 0.3, 2.16]} pos={[0, -0.15, 0]} c="#d9c7ab" r={0.04} />
    <RBox size={[2.96, 0.3, 0.62]} pos={[0, -0.17, 0.78]} c="#4d4039" r={0.04} />
    {[-1.0, -0.33, 0.33, 1.0].map((x) => <RBox key={x} size={[0.34, 0.02, 0.05]} pos={[x, -0.015, 0.82]} c="#e9dcc6" r={0.005} shadow={false} />)}
    <House pos={[-0.72, 0, -0.78]} c="#ead9bd" roof="#b5563f" />
    <House pos={[0.5, 0, -0.78]} c="#d8b98f" roof="#5a4353" w={1.1} h={1.3} />
    <RBox size={[2.9, 0.36, 0.12]} pos={[0, 0.18, -0.38]} c="#b5654a" r={0.03} />
    {[-1.2, -0.85, -0.5, 0.95, 1.25].map((x, i) => <Ball key={x} pos={[x, 0.42, -0.5]} r={0.2 + (i % 2) * 0.04} c={i % 2 ? "#869668" : "#74845c"} />)}
    <Cyl pos={[1.18, 0.5, -0.72]} r={0.07} h={1.0} c={WOOD} />
    <Ball pos={[1.18, 1.25, -0.72]} r={0.36} c="#d9a441" />
    <Ball pos={[0.98, 1.05, -0.62]} r={0.24} c="#e3b45a" />
    <Ball pos={[1.3, 1.02, -0.6]} r={0.22} c="#c98d2e" />
    <Stick a={[-1.2, 0, -0.2]} b={[-1.2, 1.75, -0.2]} r={0.03} c="#2a211b" />
    <Ball pos={[-1.2, 1.82, -0.2]} r={0.1} c="#fff3d0" emissive="#ffd98a" ei={0.9} />
    <Cyl pos={[-1.2, 0.04, -0.2]} r={0.08} h={0.08} c="#2a211b" />
  </group>
);

// ---------- office (warm afternoon) ----------
export const Office: React.FC = () => (
  <group>
    <Room floor="#b98a5e" wall="#e6d5b8" wall2="#dcc9aa" />
    <Window pos={[-0.55, 1.6, -1.0]} sky="#f8dba6" glow={1.0} w={0.9} h={0.8} />
    <RBox size={[0.9, 0.05, 0.2]} pos={[0.75, 1.75, -0.92]} c={WOOD} r={0.015} />
    {[[EMBER, 0.26], ["#5a4353", 0.3], [GOLD, 0.22], [CREAM, 0.28], ["#b5654a", 0.24]].map(([c, h], i) => (
      <RBox key={i} size={[0.07, h as number, 0.15]} pos={[0.42 + i * 0.09, 1.78 + (h as number) / 2, -0.92]} c={c as string} r={0.01} />
    ))}
    <Plant pos={[1.02, 1.78, -0.92]} s={0.5} />
    <Cyl pos={[0.2, 1.75, -0.99]} r={0.17} h={0.04} c="#fffaf0" rot={[Math.PI / 2, 0, 0]} />
    <Stick a={[0.2, 1.75, -0.96]} b={[0.2, 1.86, -0.96]} r={0.008} c={INK} />
    <Stick a={[0.2, 1.75, -0.96]} b={[0.28, 1.72, -0.96]} r={0.008} c={INK} />
    <RBox size={[1.45, 0.06, 0.7]} pos={[0.3, 0.74, -0.2]} c={WOOD} r={0.02} />
    {[[-0.36, -0.5], [-0.36, 0.1], [0.96, -0.5], [0.96, 0.1]].map(([x, z], i) => <RBox key={i} size={[0.06, 0.72, 0.06]} pos={[x, 0.36, z]} c={DARKWOOD} r={0.015} />)}
    <RBox size={[0.32, 0.02, 0.42]} pos={[0.02, 0.78, -0.2]} c="#d8d2c8" r={0.008} />
    <RBox size={[0.02, 0.3, 0.42]} pos={[0.2, 0.92, -0.2]} rot={[0, 0, -0.22]} c="#d8d2c8" r={0.008} emissive="#fff0d8" ei={0.2} />
    <Cyl pos={[0.5, 0.82, -0.42]} r={0.05} h={0.1} c={EMBER} />
    <RBox size={[0.26, 0.012, 0.34]} pos={[0.45, 0.777, 0.0]} rot={[0, 0.3, 0]} c="#fffaf0" r={0.004} />
    <RBox size={[0.46, 0.07, 0.46]} pos={[-0.62, 0.43, -0.2]} c="#b5654a" r={0.03} />
    <RBox size={[0.07, 0.6, 0.44]} pos={[-0.84, 0.76, -0.2]} c="#b5654a" r={0.03} />
    <Cyl pos={[-0.62, 0.21, -0.2]} r={0.03} h={0.42} c="#2a211b" />
    <Cyl pos={[-0.62, 0.02, -0.2]} r={0.22} h={0.04} c="#2a211b" />
    <Plant pos={[1.15, 0, -0.7]} s={1.1} />
  </group>
);

// ---------- dinner (lamp-lit evening) ----------
export const Cafe: React.FC<{ f: number; rattle?: number }> = ({ f, rattle = 0 }) => {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 560; c.height = 400; const x = c.getContext("2d")!;
    for (let i = 0; i < 7; i++) for (let j = 0; j < 5; j++) { x.fillStyle = (i + j) % 2 ? "#e4d3b6" : "#b08a63"; x.fillRect(i * 80, j * 80, 80, 80); }
    const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
  }, []);
  const j = (i: number) => Math.sin(f * 2.4 + i * 2) * 0.012 * rattle;
  return (
    <group>
      <Room floor="#b08a63" wall="#8a4a36" wall2="#7d4130" floorTex={tex} />
      <RBox size={[0.7, 0.9, 0.05]} pos={[-0.75, 1.55, -0.99]} c="#2a211b" r={0.02} />
      {[0, 1, 2, 3].map((i) => <RBox key={i} size={[0.42 - (i % 2) * 0.1, 0.03, 0.01]} pos={[-0.78, 1.78 - i * 0.14, -0.96]} c={CREAM} r={0.004} shadow={false} />)}
      <RBox size={[1.0, 0.05, 0.2]} pos={[0.65, 1.6, -0.92]} c={DARKWOOD} r={0.015} />
      {[0.3, 0.48, 0.66, 0.84].map((x, i) => <Cyl key={x} pos={[x, 1.68, -0.92]} r={0.045} h={0.1} c={[CREAM, GOLD, "#e9c9a8", CREAM][i]} />)}
      <Plant pos={[1.0, 1.63, -0.92]} s={0.45} />
      {[-0.5, 0.5].map((x) => (
        <group key={x}>
          <Stick a={[x, 2.35, -0.1]} b={[x, 1.98, -0.1]} r={0.008} c="#2a211b" />
          <Cyl pos={[x, 1.9, -0.1]} r={0.17} r2={0.05} h={0.16} c={GOLD} emissive="#ffb86a" ei={1.3 + 0.08 * Math.sin(f * 0.1 + x)} />
        </group>
      ))}
      <Cyl pos={[0, 0.74, 0]} r={0.46} h={0.05} c={CREAM} />
      <Cyl pos={[0, 0.37, 0]} r={0.035} h={0.72} c="#2a211b" />
      <Cyl pos={[0, 0.02, 0]} r={0.24} h={0.04} c="#2a211b" />
      {/* plates, glasses, candle */}
      <Cyl pos={[-0.24, 0.775 + j(0), 0.2]} r={0.1} h={0.012} c="#fffaf0" />
      <Cyl pos={[0.24, 0.775 + j(1), 0.2]} r={0.1} h={0.012} c="#fffaf0" />
      <Ball pos={[-0.24, 0.8 + j(0), 0.2]} r={0.05} c="#c98d2e" scale={[1.2, 0.6, 1.2]} />
      <Ball pos={[0.24, 0.8 + j(1), 0.2]} r={0.05} c="#b5563f" scale={[1.2, 0.6, 1.2]} />
      <Cyl pos={[-0.3, 0.82 + j(2), -0.14]} r={0.035} h={0.1} c="#e9c9a8" />
      <Cyl pos={[0.3, 0.82 + j(3), -0.14]} r={0.035} h={0.1} c="#e9c9a8" />
      {[-1, 1].map((s) => (
        <group key={s}>
          <RBox size={[0.42, 0.06, 0.42]} pos={[s * 0.82, 0.43, 0]} c={DARKWOOD} r={0.03} />
          <RBox size={[0.06, 0.56, 0.42]} pos={[s * 1.02, 0.74, 0]} c={DARKWOOD} r={0.03} />
          {[[-0.16, -0.16], [0.16, -0.16], [-0.16, 0.16], [0.16, 0.16]].map(([x, z], i) => <RBox key={i} size={[0.04, 0.42, 0.04]} pos={[s * 0.82 + x, 0.21, z]} c="#3a281e" r={0.01} />)}
        </group>
      ))}
      <Plant pos={[-1.15, 0, -0.75]} s={1.2} />
    </group>
  );
};
