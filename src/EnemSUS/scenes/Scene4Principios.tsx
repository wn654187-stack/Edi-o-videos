import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { HeartIcon, HospitalIcon, PersonIcon, SceneIn, Title, useCue } from "../ui";
import { bodyFont, clamp, colors, glow, headlineFont } from "../theme";

const TOP = 330;
const HEIGHT = 470;
const WIDTH = 420;

const Bars: React.FC<{ color: string }> = ({ color }) => (
  <svg width={170} height={120} viewBox="0 0 170 120">
    {[30, 60, 100].map((h, i) => (
      <rect key={i} x={10 + i * 55} y={115 - h} width={40} height={h} rx={6} fill={i === 2 ? color : `${color}66`} />
    ))}
  </svg>
);

const PILLARS = [
  {
    word: "universalidade",
    name: "Universalidade",
    text: "Atender\ntodo mundo",
    color: colors.green,
    icon: (c: string) => (
      <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
        <PersonIcon size={46} color={c} />
        <PersonIcon size={60} color={c} />
        <PersonIcon size={46} color={c} />
      </div>
    ),
  },
  {
    word: "integralidade",
    name: "Integralidade",
    text: "Do posto de saúde\nao transplante",
    color: colors.susNeon,
    icon: (c: string) => (
      <div style={{ display: "flex", gap: 14, alignItems: "center", color: c, fontSize: 50, fontWeight: 900 }}>
        <HospitalIcon size={90} color={c} />→<HeartIcon size={90} color={c} />
      </div>
    ),
  },
  {
    word: "equidade",
    name: "Equidade",
    text: "Mais a quem\nprecisa mais",
    color: colors.gold,
    icon: (c: string) => <Bars color={c} />,
  },
];

export const Scene4Principios: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCue(from);
  const roof = spring({ frame: frame - (cue("equidade") + 30), fps, config: { damping: 12 } });

  return (
    <SceneIn>
      <Title glowColor={colors.susNeon}>Os 3 princípios do SUS</Title>

      {/* pediment */}
      <div
        style={{
          position: "absolute",
          left: 960 - 760,
          top: TOP - 150,
          width: 1520,
          height: 140,
          opacity: interpolate(roof, [0, 0.4], [0, 1], clamp),
          translate: `0px ${interpolate(roof, [0, 1], [-60, 0])}px`,
        }}
      >
        <svg width={1520} height={140} viewBox="0 0 1520 140">
          <path d="M20 132 L760 14 L1500 132 Z" fill={`${colors.sus}55`} stroke={colors.susNeon} strokeWidth={6} strokeLinejoin="round" />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 58, textAlign: "center", fontFamily: headlineFont, fontSize: 64, color: colors.white, letterSpacing: 6 }}>
          SUS
        </div>
      </div>

      {PILLARS.map((p, i) => {
        const s = spring({ frame: frame - cue(p.word), fps, config: { damping: 14, stiffness: 140 } });
        const x = 960 + (i - 1) * 520 - WIDTH / 2;
        return (
          <div key={p.word} style={{ position: "absolute", left: x, top: TOP, width: WIDTH, height: HEIGHT, overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                translate: `0px ${interpolate(s, [0, 1], [HEIGHT + 20, 0])}px`,
                borderRadius: "18px 18px 8px 8px",
                border: `4px solid ${p.color}`,
                background: `repeating-linear-gradient(90deg, ${p.color}1c 0px, ${p.color}1c 34px, ${p.color}33 34px, ${p.color}33 42px), rgba(5,12,24,0.85)`,
                boxShadow: glow(p.color, 0.6),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 30,
                gap: 26,
                textAlign: "center",
                fontFamily: bodyFont,
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 44, color: p.color, textTransform: "uppercase", letterSpacing: 1 }}>{p.name}</div>
              <div style={{ height: 130, display: "flex", alignItems: "center" }}>{p.icon(p.color)}</div>
              <div style={{ fontWeight: 800, fontSize: 38, color: colors.white, whiteSpace: "pre-line", lineHeight: 1.2 }}>{p.text}</div>
            </div>
          </div>
        );
      })}
    </SceneIn>
  );
};
