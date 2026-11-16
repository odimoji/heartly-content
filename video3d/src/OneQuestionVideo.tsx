// "One question, day 1": 8 s, one line on the night-to-dawn ground. The point of this one is the comments,
// so it keeps its question (the one exception to the ending rule in scripts/SPRINT.md).
import { AbsoluteFill, useCurrentFrame } from "remotion";
import timing from "./timing/one_question.json";
import { useFontsReady } from "./fonts";
import { GOLD, glow, serif } from "./kit";
import { SoftBlurIn } from "./remocn/soft-blur-in";
import { ease, seg } from "./three/parts";

const NIGHT = glow("rgba(196,100,60,.22)", 40), DAWN = glow("rgba(240,150,100,.46)", 54);

export const OneQuestionVideo: React.FC = () => {
  const f = useCurrentFrame();
  const fonts = useFontsReady();
  const cues = timing.scenes[0].cues as Record<string, number>;
  const b = cues.b ?? 71, total = timing.total;
  const dawn = ease(seg(f, b + 10, total - 20));
  const caret = f > b + 60 && Math.floor(f / 14) % 2 === 0;
  return (
    <AbsoluteFill style={{ background: NIGHT }}>
      <AbsoluteFill style={{ background: DAWN, opacity: dawn }} />
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={Math.floor(f / 2)} />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.88  0 0 0 0.16 0" />
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: "url(#grain)", mixBlendMode: "soft-light", opacity: 0.9 }} />
      {fonts && (
        <div style={{ position: "absolute", top: 620, left: 60, right: 230, textAlign: "center", transform: `scale(${1 + 0.02 * seg(f, 0, total)})` }}>
          <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 30, letterSpacing: "0.24em", color: GOLD }}>ONE QUESTION · DAY 1</div>
          <div style={{ ...serif, marginTop: 26, fontSize: 92, lineHeight: 1.06, whiteSpace: "nowrap", transform: `scale(${1 + 0.08 * Math.max(0, 1 - f / 9)})` }}>what would you say</div>
          <div style={{ ...serif, fontSize: 92, lineHeight: 1.06, whiteSpace: "nowrap" }}><SoftBlurIn text="if you knew they’d" from={b - 4} /></div>
          <div style={{ ...serif, marginTop: 8, fontSize: 112, lineHeight: 1.04, whiteSpace: "nowrap", fontStyle: "italic", color: GOLD }}>
            <SoftBlurIn text="never read it?" from={b + 22} />
            <span style={{ fontStyle: "normal", fontWeight: 400, opacity: caret ? 0.9 : 0 }}>|</span>
          </div>
          <div style={{ marginTop: 54, fontFamily: "Inter", fontWeight: 500, fontSize: 34, color: "rgba(246,236,220,.72)", opacity: seg(f, b + 84, b + 100) }}>say it in the comments.</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
