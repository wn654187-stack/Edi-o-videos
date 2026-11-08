import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Headline, SceneIn, TileMap } from "../ui";
import { clamp, colors, glow } from "../theme";

const BallotBox: React.FC = () => {
  const frame = useCurrentFrame();
  const laser = interpolate(frame, [40, 58], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const split = interpolate(frame, [60, 80], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const enter = interpolate(frame, [6, 26], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });

  const half = (side: -1 | 1) => (
    <div
      style={{
        position: "absolute",
        left: side === -1 ? 0 : 160,
        top: 0,
        width: 160,
        height: 300,
        overflow: "hidden",
        translate: `${side * split * 110}px ${split * 30}px`,
        rotate: `${side * split * 14}deg`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: side === -1 ? 0 : -160,
          width: 320,
          height: 300,
        }}
      >
        <svg width={320} height={300} viewBox="0 0 320 300">
          <defs>
            <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff3b0" />
              <stop offset="0.5" stopColor={colors.gold} />
              <stop offset="1" stopColor="#b9790a" />
            </linearGradient>
          </defs>
          <rect x={10} y={70} width={300} height={220} rx={18} fill="url(#gold)" />
          <rect x={0} y={50} width={320} height={40} rx={12} fill="#ffe17a" />
          <rect x={90} y={62} width={140} height={14} rx={7} fill="#3a2a00" />
          <rect x={115} y={0} width={90} height={74} rx={6} fill="#fff" transform="rotate(-6 160 40)" />
          <text x={160} y={210} textAnchor="middle" fontSize={64} fontWeight={900} fill="#3a2a00" fontFamily="sans-serif">
            VOTE
          </text>
        </svg>
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 380,
        top: 560,
        width: 320,
        height: 300,
        scale: enter,
        filter: `drop-shadow(0 0 40px ${colors.gold}88)`,
      }}
    >
      {half(-1)}
      {half(1)}
      <div
        style={{
          position: "absolute",
          left: 157,
          top: -80,
          width: 6,
          height: 460 * laser,
          background: colors.white,
          borderRadius: 3,
          boxShadow: glow(colors.red, 2),
          opacity: interpolate(frame, [40, 44, 72, 84], [0, 1, 1, 0], clamp),
        }}
      />
    </div>
  );
};

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneIn>
      <AbsoluteFill style={{ opacity: 0.85 }}>
        <TileMap
          width={1000}
          top={420}
          colorFor={(s, i) => {
            const flip = Math.floor((frame + i * 3) / 7) % 2 === 0;
            return (s.code.charCodeAt(1) + i) % 2 === 0 === flip ? colors.blue : colors.red;
          }}
          opacityFor={(_, i) => interpolate(frame, [i * 0.6, i * 0.6 + 8], [0, 0.9], clamp)}
        />
      </AbsoluteFill>
      <BallotBox />
      <Headline top={140} size={150} glowColor={colors.red}>
        Mais votos
      </Headline>
      <Headline top={290} size={110} delay={12} color={colors.gold} glowColor={colors.gold}>
        ≠ vitória?
      </Headline>
    </SceneIn>
  );
};
