// Adapted from remocn "soft-blur-in" (github.com/kapishdima/remocn, MIT): per-character blur/fade/rise.
// Changed: inline layout instead of a full-frame wrapper, font passed in.
import { Easing, interpolate, useCurrentFrame } from "remotion";

export const SoftBlurIn: React.FC<{ text: string; from?: number; blur?: number; style?: React.CSSProperties }> = ({ text, from = 0, blur = 10, style }) => {
  const frame = useCurrentFrame() - from;
  const easing = Easing.bezier(0.22, 1, 0.36, 1);
  const opt = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing } as const;
  return (
    <span style={style}>
      {Array.from(text).map((ch, i) => {
        const local = frame - i * 0.7;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: interpolate(local, [0, 14], [0, 1], opt),
              translate: `0 ${interpolate(local, [0, 9], [14, 0], opt)}px`,
              filter: `blur(${interpolate(local, [0, 14], [blur, 0], opt)}px)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};
