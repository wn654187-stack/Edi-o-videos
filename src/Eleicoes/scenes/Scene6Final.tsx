import React from "react";
import { Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline, SceneIn } from "../ui";
import { bodyFont, clamp, colors, glow } from "../theme";

const Capitol: React.FC = () => {
  const frame = useCurrentFrame();
  const glowAmt = 20 + 10 * Math.sin(frame / 8);
  return (
    <svg
      width={1000}
      height={620}
      viewBox="0 0 1000 620"
      style={{
        position: "absolute",
        left: 40,
        top: 470,
        scale: interpolate(frame, [0, 240], [1.35, 0.95], { ...clamp, easing: Easing.out(Easing.cubic) }),
        filter: `drop-shadow(0 0 ${glowAmt}px ${colors.blueNeon})`,
      }}
    >
      <g fill="#dfe8ff" stroke={colors.blueNeon} strokeWidth={3}>
        {/* statue + lantern */}
        <rect x={492} y={20} width={16} height={40} />
        <rect x={470} y={60} width={60} height={50} />
        {/* dome */}
        <path d="M360 260 Q360 110 500 105 Q640 110 640 260 Z" />
        <rect x={340} y={260} width={320} height={40} />
        {/* drum columns */}
        {new Array(9).fill(0).map((_, i) => (
          <rect key={i} x={355 + i * 34} y={300} width={14} height={90} fill="#c6d4f7" />
        ))}
        <rect x={320} y={390} width={360} height={30} />
        {/* wings */}
        <rect x={60} y={430} width={880} height={30} />
        <rect x={80} y={460} width={840} height={120} fill="#c6d4f7" />
        {new Array(22).fill(0).map((_, i) => (
          <rect key={`c${i}`} x={100 + i * 37} y={470} width={12} height={100} fill="#eef3ff" />
        ))}
        <path d="M400 430 L500 380 L600 430 Z" />
        <rect x={40} y={580} width={920} height={30} />
      </g>
    </svg>
  );
};

const Stars: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(70).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: random(`x${i}`) * 1080,
            top: random(`y${i}`) * 1100,
            width: 4,
            height: 4,
            borderRadius: 2,
            background: colors.white,
            opacity: 0.3 + 0.6 * Math.abs(Math.sin(frame / 10 + i)),
          }}
        />
      ))}
    </>
  );
};

const COMMENTS: { text: string; x: number; y: number; at: number; color: string }[] = [
  { text: "Genial!", x: 60, y: 480, at: 5.2, color: colors.gold },
  { text: "Confuso demais...", x: 560, y: 530, at: 5.6, color: colors.redNeon },
  { text: "E se der empate em 269?", x: 60, y: 1200, at: 6.0, color: colors.purple },
  { text: "Explica Maine e Nebraska!", x: 420, y: 1290, at: 6.4, color: colors.blueNeon },
];

const Comment: React.FC<{ c: (typeof COMMENTS)[number] }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - c.at * fps, fps, config: { damping: 11 } });
  const float = Math.sin((frame + c.x) / 14) * 10;
  return (
    <div
      style={{
        position: "absolute",
        left: c.x,
        top: c.y + float,
        scale: s,
        padding: "18px 28px",
        borderRadius: "28px 28px 28px 6px",
        background: "rgba(10,14,40,0.85)",
        border: `3px solid ${c.color}`,
        boxShadow: glow(c.color, 0.7),
        fontFamily: bodyFont,
        fontWeight: 800,
        fontSize: 38,
        color: colors.white,
        whiteSpace: "nowrap",
      }}
    >
      {c.text}
    </div>
  );
};

export const Scene6Final: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <SceneIn>
      <Stars />
      <Capitol />
      <Headline top={110} size={140} color={colors.purple} glowColor={colors.purple}>
        Midterms
      </Headline>
      <Headline top={270} size={60} delay={8}>
        Câmara inteira + ⅓ do Senado
        <br />
        <span style={{ color: colors.gold }}>voto direto</span>
      </Headline>
      {COMMENTS.map((c) => (
        <Comment key={c.text} c={c} />
      ))}
      <Headline top={1390} size={100} delay={7.6 * fps} color={colors.gold} glowColor={colors.gold}>
        Comenta aí ↓
      </Headline>
    </SceneIn>
  );
};
