import React from "react";
import { Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline, SceneIn, TileMap } from "../ui";
import { leansBlue, SWING_STATES } from "../data";
import { bodyFont, clamp, colors, glow, headlineFont, textGlow } from "../theme";

const Counter: React.FC<{ value: number; color: string; label: string; winner: boolean }> = ({
  value,
  color,
  label,
  winner,
}) => (
  <div
    style={{
      flex: 1,
      padding: "24px 0",
      borderRadius: 28,
      border: `5px solid ${color}`,
      background: `${color}22`,
      boxShadow: glow(color, winner ? 2.2 : 0.7),
      textAlign: "center",
    }}
  >
    <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 36, color: colors.white, letterSpacing: 2 }}>
      {label}
    </div>
    <div
      style={{
        fontFamily: headlineFont,
        fontSize: 170,
        lineHeight: 1.05,
        color: colors.white,
        textShadow: textGlow(color, 1.2),
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </div>
  </div>
);

const Confetti: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const t = frame - from;
  if (t < 0) return null;
  const palette = [colors.gold, colors.white, colors.blueNeon, "#ffe17a"];
  return (
    <>
      {new Array(90).fill(0).map((_, i) => {
        const angle = random(`a${i}`) * Math.PI * 2;
        const speed = 14 + random(`s${i}`) * 26;
        const x = 540 + Math.cos(angle) * speed * t;
        const y = 1050 + Math.sin(angle) * speed * t + 0.9 * t * t;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 18,
              height: 30,
              background: palette[i % palette.length],
              rotate: `${t * (8 + random(`r${i}`) * 20)}deg`,
              opacity: interpolate(t, [30, 55], [1, 0], clamp),
            }}
          />
        );
      })}
    </>
  );
};

export const Scene5Corrida: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const raceStart = 3.6 * fps; // "Vence quem chegar primeiro"
  const finish = 5.7 * fps; // "...aos 270"
  const ease = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const blue = Math.round(interpolate(frame, [raceStart, finish], [226, 270], ease));
  const red = Math.round(interpolate(frame, [raceStart, finish - 6], [219, 268], ease));
  const won = frame >= finish;
  const banner = spring({ frame: frame - finish, fps, config: { damping: 9 } });

  return (
    <SceneIn>
      <Headline top={110} size={120} color={colors.purple} glowColor={colors.purple}>
        Swing States
      </Headline>
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 40,
          color: colors.white,
          letterSpacing: 2,
        }}
      >
        OS ESTADOS INDECISOS DECIDEM TUDO
      </div>
      <TileMap
        width={820}
        top={340}
        colorFor={(s) => {
          if (SWING_STATES.includes(s.code)) {
            return Math.floor(frame / 8) % 2 === 0 ? colors.purple : colors.white;
          }
          return leansBlue(s.code) ? colors.blue : colors.red;
        }}
        opacityFor={(s) => (SWING_STATES.includes(s.code) ? 1 : 0.35)}
        scaleFor={(s) => (SWING_STATES.includes(s.code) ? 1 + 0.12 * Math.abs(Math.sin(frame / 5)) : 0.92)}
      />

      <div
        style={{
          position: "absolute",
          top: 930,
          left: 80,
          right: 80,
          display: "flex",
          gap: 40,
          opacity: interpolate(frame, [raceStart - 20, raceStart - 4], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [raceStart - 20, raceStart - 4], [80, 0], clamp)}px`,
        }}
      >
        <Counter value={blue} color={colors.blue} label="AZUL" winner={won} />
        <Counter value={red} color={colors.red} label="VERMELHO" winner={false} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1290,
          left: 0,
          right: 0,
          textAlign: "center",
          scale: banner,
          fontFamily: headlineFont,
          fontSize: 130,
          color: colors.gold,
          textShadow: textGlow(colors.gold, 1.4),
        }}
      >
        270 = VITÓRIA!
      </div>
      <Confetti from={finish} />
    </SceneIn>
  );
};
