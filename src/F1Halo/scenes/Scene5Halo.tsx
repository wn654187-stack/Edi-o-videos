import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Card, Chip, Pop, SceneIn, Title } from "../../EnemSUS/ui";
import { useCue } from "../data";
import { HaloSide } from "../ui";
import { bodyFont, clamp, colors, glow, headlineFont } from "../theme";

const Bus: React.FC = () => (
  <svg width={200} height={150} viewBox="0 0 200 150">
    <rect x={8} y={10} width={184} height={118} rx={14} fill={colors.red} />
    <line x1={8} y1={68} x2={192} y2={68} stroke="#7a0000" strokeWidth={5} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={`a${i}`} x={22 + i * 42} y={22} width={32} height={34} rx={4} fill="#cfe6ff" />
    ))}
    {[0, 1, 2, 3].map((i) => (
      <rect key={`b${i}`} x={22 + i * 42} y={78} width={32} height={30} rx={4} fill="#cfe6ff" />
    ))}
    <circle cx={50} cy={132} r={14} fill="#111" />
    <circle cx={150} cy={132} r={14} fill="#111" />
  </svg>
);

export const Scene5Halo: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const haloOn = interpolate(frame, [cue("halo"), cue("halo") + 10], [0, 1], clamp);

  return (
    <SceneIn>
      <Title glowColor={colors.gold}>
        <span style={{ color: colors.gold }}>3 coisas</span> salvaram ele
      </Title>
      <Pop at={cue("halo")} from="scale" style={{ left: 70, top: 380 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ width: 90, height: 90, borderRadius: "50%", background: colors.blue, boxShadow: glow(colors.blue, 0.8), fontFamily: headlineFont, fontSize: 60, color: colors.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>1</div>
          <div style={{ fontFamily: headlineFont, fontSize: 96, color: colors.white }}>O HALO</div>
        </div>
      </Pop>
      <Pop at={cue("halo")} style={{ left: 140, top: 500 }}>
        <HaloSide width={800} highlight={haloOn} />
      </Pop>
      <Pop at={cue("titânio")} style={{ left: 0, right: 0, top: 960, textAlign: "center" }}>
        <Chip color={colors.blue} size={34}>Arco de titânio sobre a cabeça</Chip>
      </Pop>
      <Pop at={cue("ônibus")} from="up" style={{ left: 70, top: 1050, width: 940 }}>
        <Card color={colors.gold} style={{ display: "flex", alignItems: "center", gap: 26, padding: "14px 30px", height: 190 }}>
          <Bus />
          <div style={{ fontFamily: bodyFont }}>
            <div style={{ fontWeight: 900, fontSize: 42 }}>Aguenta ~12 toneladas</div>
            <div style={{ fontWeight: 800, fontSize: 30, color: colors.gold }}>o peso de um ônibus de 2 andares</div>
          </div>
        </Card>
      </Pop>
    </SceneIn>
  );
};
