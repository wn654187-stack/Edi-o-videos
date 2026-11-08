import React from "react";
import { Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline, SceneIn } from "../ui";
import { bodyFont, clamp, colors, glow, headlineFont, textGlow } from "../theme";

const Fighter: React.FC<{ side: -1 | 1; color: string; letter: string; name: string; animal: string }> = ({
  side,
  color,
  letter,
  name,
  animal,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = interpolate(frame, [4, 22], [1, 0], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  // Punches: quick jab toward the centre every ~1.6s, alternating sides
  const period = Math.round(1.6 * fps);
  const t = (frame + (side === 1 ? period / 2 : 0)) % period;
  const jab = interpolate(t, [0, 5, 12], [0, 1, 0], clamp);
  const bob = Math.sin(frame / 6 + (side === 1 ? 1.5 : 0)) * 10;

  return (
    <div
      style={{
        position: "absolute",
        top: 520,
        left: side === -1 ? 90 : 590,
        width: 400,
        height: 420,
        translate: `${side * enter * 600 - side * jab * 70}px ${bob}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <div
        style={{
          width: 250,
          height: 250,
          borderRadius: "50%",
          border: `8px solid ${color}`,
          background: `radial-gradient(circle, ${color}55, ${color}11)`,
          boxShadow: glow(color, 1.6 + jab),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: headlineFont,
          fontSize: 170,
          color: colors.white,
          textShadow: textGlow(color, 1.2),
        }}
      >
        {letter}
      </div>
      <div style={{ fontFamily: headlineFont, fontSize: 64, color, textShadow: textGlow(color, 0.8) }}>
        {name}
      </div>
      <div style={{ fontFamily: bodyFont, fontWeight: 800, fontSize: 34, color: colors.muted }}>
        símbolo: {animal}
      </div>
    </div>
  );
};

const Ring: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = interpolate(Math.sin(frame / 4), [-1, 1], [0.5, 1]);
  return (
    <svg
      width={1000}
      height={560}
      viewBox="0 0 1000 560"
      style={{ position: "absolute", left: 40, top: 430 }}
    >
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={30}
          x2={970}
          y1={110 + i * 150}
          y2={110 + i * 150}
          stroke={i === 1 ? colors.white : colors.gold}
          strokeOpacity={0.5 * flash}
          strokeWidth={6}
        />
      ))}
      <rect x={20} y={40} width={22} height={480} rx={8} fill={colors.blue} />
      <rect x={958} y={40} width={22} height={480} rx={8} fill={colors.red} />
    </svg>
  );
};

/** Delegates (dots) falling into a glass funnel and coming out as one nominee. */
const Funnel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = 3.5 * fps;
  const appear = interpolate(frame, [start - 10, start + 6], [0, 1], clamp);
  const dots = new Array(26).fill(0).map((_, i) => {
    const born = start + i * 5;
    const p = interpolate(frame, [born, born + 34], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    const x0 = 160 + random(`dx${i}`) * 680;
    const x = interpolate(p, [0, 0.7, 1], [x0, 500 + (x0 - 500) * 0.15, 500]);
    const y = interpolate(p, [0, 1], [-40, 300]);
    const color = i % 2 === 0 ? colors.blueNeon : colors.redNeon;
    return { x, y, color, visible: frame >= born && p < 1, i };
  });
  const out = interpolate(frame, [start + 60, start + 80], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });

  return (
    <div style={{ position: "absolute", left: 40, top: 1010, width: 1000, height: 470, opacity: appear }}>
      <svg width={1000} height={470} viewBox="0 0 1000 470" style={{ position: "absolute" }}>
        <path
          d="M140 40 L860 40 L560 280 L560 360 L440 360 L440 280 Z"
          fill={`${colors.white}10`}
          stroke={colors.blueNeon}
          strokeWidth={5}
          style={{ filter: `drop-shadow(0 0 14px ${colors.blueNeon})` }}
        />
      </svg>
      {dots.map((d) =>
        d.visible ? (
          <div
            key={d.i}
            style={{
              position: "absolute",
              left: d.x - 14,
              top: d.y - 14,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: d.color,
              boxShadow: glow(d.color, 0.8),
            }}
          />
        ) : null,
      )}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 370,
          textAlign: "center",
          scale: out,
        }}
      >
        <span
          style={{
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 44,
            color: colors.gold,
            textShadow: textGlow(colors.gold, 0.7),
            textTransform: "uppercase",
          }}
        >
          1 candidato por partido
        </span>
      </div>
    </div>
  );
};

export const Scene2Primarias: React.FC = () => (
  <SceneIn>
    <Headline top={130} size={130} glowColor={colors.gold}>
      Primárias
    </Headline>
    <Headline top={270} size={80} delay={8} color={colors.gold} glowColor={colors.gold}>
      &amp; Caucuses
    </Headline>
    <Ring />
    <Fighter side={-1} color={colors.blue} letter="D" name="Democratas" animal="burro" />
    <Fighter side={1} color={colors.red} letter="R" name="Republicanos" animal="elefante" />
    <Funnel />
  </SceneIn>
);
