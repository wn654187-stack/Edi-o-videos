import React from "react";
import { Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline, SceneIn, TileMap } from "../ui";
import { leansBlue, TOTAL_EV } from "../data";
import { bodyFont, clamp, colors, glow, headlineFont, textGlow } from "../theme";

const CollegeMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = Math.round(
    interpolate(frame, [0.4 * fps, 3 * fps], [0, TOTAL_EV], { ...clamp, easing: Easing.out(Easing.cubic) }),
  );
  return (
    <>
      <Headline top={120} size={100} glowColor={colors.blueNeon}>
        Colégio Eleitoral
      </Headline>
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: headlineFont,
          fontSize: 230,
          lineHeight: 1,
          color: colors.gold,
          textShadow: textGlow(colors.gold, 1.2),
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {count}
      </div>
      <div
        style={{
          position: "absolute",
          top: 490,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: bodyFont,
          fontWeight: 900,
          fontSize: 42,
          color: colors.white,
          letterSpacing: 3,
        }}
      >
        DELEGADOS · 50 ESTADOS + DC
      </div>
      <TileMap
        width={1000}
        top={600}
        label="both"
        colorFor={(s) => (leansBlue(s.code) ? colors.blue : colors.red)}
        scaleFor={(_, i) =>
          spring({ frame: frame - 0.4 * fps - i * 1.2, fps, config: { damping: 12, stiffness: 200 } })
        }
      />
    </>
  );
};

const FLORIDA_PATH =
  "M10 40 L300 30 L320 60 L470 52 L520 90 L580 200 L640 330 L690 460 L700 560 L660 610 L600 590 L560 520 L520 440 L470 360 L440 260 L420 170 L380 120 L300 100 L220 110 L140 95 L60 90 L10 80 Z";

const Florida: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flashAt = 3.4 * fps;
  const blueShare = interpolate(frame, [0.6 * fps, 2.8 * fps], [50, 50.5], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const won = frame >= flashAt;
  const flash = interpolate(frame, [flashAt, flashAt + 3, flashAt + 14], [0, 1, 0], clamp);
  const fill = won ? colors.blue : "#2a2f4a";
  const trophiesStart = flashAt + 10;
  const delegates = Math.round(
    interpolate(frame, [trophiesStart, trophiesStart + 2.2 * fps], [0, 30], clamp),
  );
  const winnerPop = spring({ frame: frame - flashAt - 4, fps, config: { damping: 10 } });

  return (
    <>
      <Headline top={110} size={84} color={colors.blueNeon} glowColor={colors.blue}>
        Flórida
      </Headline>
      <div
        style={{
          position: "absolute",
          top: 230,
          left: 0,
          right: 0,
          textAlign: "center",
          scale: winnerPop,
          fontFamily: headlineFont,
          fontSize: 120,
          color: colors.gold,
          textShadow: textGlow(colors.gold, 1.2),
          rotate: "-3deg",
        }}
      >
        WINNER-TAKES-ALL
      </div>

      {/* vote bar */}
      <div style={{ position: "absolute", top: 420, left: 90, width: 900 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 48,
            color: colors.white,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span style={{ color: colors.blueNeon }}>{blueShare.toFixed(1)}%</span>
          <span style={{ color: colors.gold, opacity: frame > 1.6 * fps ? 1 : 0 }}>+1 VOTO</span>
          <span style={{ color: colors.redNeon }}>{(100 - blueShare).toFixed(1)}%</span>
        </div>
        <div
          style={{
            marginTop: 14,
            height: 50,
            borderRadius: 25,
            overflow: "hidden",
            display: "flex",
            border: `3px solid ${colors.white}55`,
          }}
        >
          <div style={{ width: `${blueShare}%`, background: colors.blue, boxShadow: glow(colors.blue) }} />
          <div style={{ flex: 1, background: colors.red }} />
        </div>
      </div>

      {/* state shape */}
      <svg
        width={720}
        height={640}
        viewBox="0 0 720 640"
        style={{
          position: "absolute",
          left: 190,
          top: 570,
          filter: `drop-shadow(0 0 ${won ? 40 : 10}px ${won ? colors.blueNeon : colors.purple})`,
        }}
      >
        <defs>
          <linearGradient id="split" x1="0" x2="1">
            <stop offset="0.505" stopColor={colors.blue} />
            <stop offset="0.505" stopColor={colors.red} />
          </linearGradient>
        </defs>
        <path
          d={FLORIDA_PATH}
          fill={frame > 0.6 * fps && !won ? "url(#split)" : fill}
          stroke={colors.white}
          strokeWidth={6}
        />
        <path d={FLORIDA_PATH} fill={colors.white} opacity={flash} />
      </svg>

      {/* delegate trophies flying into the counter */}
      {new Array(30).fill(0).map((_, i) => {
        const born = trophiesStart + i * 2;
        const p = interpolate(frame, [born, born + 18], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
        if (frame < born || p >= 1) return null;
        const col = i % 6;
        const row = Math.floor(i / 6);
        const x0 = 330 + col * 70;
        const y0 = 780 + row * 70;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: interpolate(p, [0, 1], [x0, 160]),
              top: interpolate(p, [0, 1], [y0, 1270]),
              width: 54,
              height: 54,
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 30%, #fff6c4, ${colors.gold} 55%, #a86c00)`,
              boxShadow: glow(colors.gold, 0.6),
              scale: interpolate(p, [0, 0.2, 1], [0.4, 1.1, 0.6]),
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1230,
          padding: "10px 30px",
          borderRadius: 24,
          border: `4px solid ${colors.blueNeon}`,
          boxShadow: glow(colors.blue, 1),
          background: `${colors.blue}33`,
          fontFamily: headlineFont,
          fontSize: 80,
          color: colors.white,
          opacity: won ? 1 : 0,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {delegates} <span style={{ fontSize: 44, fontFamily: bodyFont, fontWeight: 900 }}>DELEGADOS</span>
      </div>
      <div
        style={{
          position: "absolute",
          right: 90,
          top: 1250,
          fontFamily: headlineFont,
          fontSize: 80,
          color: colors.redNeon,
          opacity: won ? 0.8 : 0,
        }}
      >
        0
      </div>
    </>
  );
};

export const Scene4Colegio: React.FC = () => {
  const { fps } = useVideoConfig();
  const floridaAt = 8 * fps;
  return (
    <SceneIn>
      <Sequence durationInFrames={floridaAt} layout="none">
        <CollegeMap />
      </Sequence>
      <Sequence from={floridaAt} layout="none">
        <SceneIn>
          <Florida />
        </SceneIn>
      </Sequence>
    </SceneIn>
  );
};
