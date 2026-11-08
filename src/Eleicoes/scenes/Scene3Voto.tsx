import React from "react";
import { Easing, interpolate, random, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Chip, Headline, SceneIn, TileMap } from "../ui";
import { clamp, colors, glow } from "../theme";
import { leansBlue } from "../data";

const Mailbox: React.FC = () => {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [8, 40], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const shrink = interpolate(frame, [40, 52], [1, 0], clamp);
  const pulse = interpolate(frame, [40, 50, 70], [0, 1, 0.3], clamp);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
      {/* mailbox */}
      <svg
        width={360}
        height={520}
        viewBox="0 0 360 520"
        style={{
          position: "absolute",
          left: 600,
          top: 960,
          filter: `drop-shadow(0 0 ${20 + pulse * 40}px ${colors.blueNeon})`,
        }}
      >
        <path d="M20 160 Q20 20 180 20 Q340 20 340 160 L340 400 L20 400 Z" fill="#123a8a" stroke={colors.blueNeon} strokeWidth={8} />
        <rect x={80} y={120} width={200} height={22} rx={11} fill="#020615" />
        <text x={180} y={260} textAnchor="middle" fill={colors.white} fontSize={44} fontWeight={900} fontFamily="sans-serif">
          U.S. MAIL
        </text>
        <rect x={50} y={400} width={40} height={110} fill="#0d2a66" />
        <rect x={270} y={400} width={40} height={110} fill="#0d2a66" />
      </svg>
      {/* envelope */}
      <svg
        width={240}
        height={160}
        viewBox="0 0 240 160"
        style={{
          position: "absolute",
          left: interpolate(slide, [0, 1], [-260, 660]),
          top: interpolate(slide, [0, 1], [1180, 1080]),
          rotate: `${interpolate(slide, [0, 1], [-18, 0])}deg`,
          scale: `${1} ${shrink}`,
          transformOrigin: "50% 0%",
        }}
      >
        <rect x={4} y={4} width={232} height={152} rx={10} fill="#fffaf0" stroke={colors.gold} strokeWidth={6} />
        <path d="M6 8 L120 90 L234 8" fill="none" stroke={colors.gold} strokeWidth={6} />
      </svg>
    </div>
  );
};

/** Data particles streaming from the mailbox up into the map. */
const DataStream: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(40).fill(0).map((_, i) => {
        const born = i * 3;
        const p = interpolate(frame, [born, born + 30], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
        if (frame < born || p >= 1) return null;
        const tx = 120 + random(`sx${i}`) * 840;
        const ty = 420 + random(`sy${i}`) * 520;
        const x = interpolate(p, [0, 1], [780, tx]);
        const y = interpolate(p, [0, 1], [1100, ty]) - Math.sin(p * Math.PI) * 160;
        const c = i % 2 ? colors.blueNeon : colors.white;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 18,
              height: 18,
              borderRadius: 4,
              background: c,
              boxShadow: glow(c, 0.7),
            }}
          />
        );
      })}
    </>
  );
};

export const Scene3Voto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mapStart = 1.8 * fps;
  const swap = 4.2 * fps;
  return (
    <SceneIn>
      {frame < swap ? (
        <Headline top={150} size={96}>
          Você <span style={{ color: colors.red }}>não</span> vota
          <br />
          no presidente
        </Headline>
      ) : (
        <Headline top={150} size={96} delay={swap}>
          Você vota em
          <br />
          <span style={{ color: colors.gold }}>delegados</span>
        </Headline>
      )}
      <TileMap
        width={900}
        top={430}
        label="code"
        colorFor={(s) => (leansBlue(s.code) ? colors.blue : colors.red)}
        opacityFor={(_, i) =>
          interpolate(frame, [mapStart + i * 1.4, mapStart + i * 1.4 + 6], [0.12, 0.95], clamp)
        }
      />
      <Sequence from={mapStart} layout="none">
        <DataStream />
      </Sequence>
      <Mailbox />
      <Sequence from={6 * fps} layout="none">
        <ChipIn />
      </Sequence>
    </SceneIn>
  );
};

const ChipIn: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 1040,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        opacity: interpolate(frame, [0, 6], [0, 1], clamp),
        translate: `${interpolate(frame, [0, 10], [-80, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px 0px`,
      }}
    >
      <Chip color={colors.blueNeon}>Pelo correio</Chip>
      <Chip color={colors.gold}>Semanas antes</Chip>
    </div>
  );
};
