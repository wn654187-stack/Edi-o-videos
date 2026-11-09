import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { at } from "../data";
import { Card, ClockIcon, CoinIcon, DoctorIcon, Pop, SceneIn, Title, useCue, useVertical } from "../ui";
import { clamp, colors, glow, headlineFont } from "../theme";

const PROBLEMS = [
  { word: "filas", label: "Filas longas", sub: "", Icon: ClockIcon },
  { word: "falta", label: "Falta de médicos", sub: "em regiões afastadas", Icon: DoctorIcon },
  { word: "financiamento", label: "Financiamento", sub: "insuficiente", Icon: CoinIcon },
];

const Step: React.FC<{ n: string; text: string; at: number; size: number }> = ({ n, text, at: start, size }) => (
  <Pop at={start} from="left" style={{ position: "relative" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
      <div
        style={{
          width: 64,
          height: 64,
          flexShrink: 0,
          borderRadius: "50%",
          background: colors.green,
          color: colors.bg,
          fontFamily: headlineFont,
          fontSize: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: glow(colors.green, 0.6),
        }}
      >
        {n}
      </div>
      <div style={{ fontSize: size, fontWeight: 900, lineHeight: 1.1 }}>{text}</div>
    </div>
  </Pop>
);

export const Scene6Problema: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const v = useVertical();
  const essay = cue("redação", at("Na", from));
  const dim = interpolate(frame, [essay - 6, essay + 6], [1, 0.55], clamp);

  return (
    <SceneIn>
      <Title glowColor={colors.red} size={v ? 76 : undefined}>
        Valorizar = existe um <span style={{ color: colors.redNeon }}>problema</span>
      </Title>

      {PROBLEMS.map((p, i) => (
        <Pop
          key={p.word}
          at={cue(p.word)}
          from={v ? "left" : "scale"}
          style={v ? { left: 70, top: 420 + i * 165, width: 940 } : { left: 190 + i * 520, top: 220, width: 500 }}
        >
          <Card
            color={colors.red}
            style={
              v
                ? { height: 145, opacity: dim, display: "flex", alignItems: "center", gap: 30, padding: "0 36px" }
                : { height: 300, opacity: dim, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center" }
            }
          >
            <p.Icon size={v ? 90 : 110} color={colors.redNeon} />
            <div>
              <div style={{ fontSize: v ? 40 : 42, fontWeight: 900, textTransform: "uppercase" }}>{p.label}</div>
              {p.sub ? <div style={{ fontSize: v ? 28 : 30, fontWeight: 800, color: colors.redNeon }}>{p.sub}</div> : null}
            </div>
          </Card>
        </Pop>
      ))}

      <Pop at={essay} from="up" style={v ? { left: 50, top: 925, width: 980 } : { left: 360, top: 560, width: 1200 }}>
        <Card color={colors.green} style={{ padding: v ? "26px 36px" : "28px 50px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontFamily: headlineFont, fontSize: v ? 48 : 52, color: colors.greenNeon, letterSpacing: 2 }}>NA SUA REDAÇÃO:</div>
          <div style={{ position: "relative", height: v ? 170 : 150 }}>
            <Step n="1" text="Reconhecer o SUS como conquista" at={cue("reconhecer")} size={v ? 38 : 46} />
            <div style={{ position: "absolute", top: v ? 92 : 84 }}>
              <Step n="2" text="Propor como fortalecê-lo" at={cue("propor")} size={v ? 38 : 46} />
            </div>
          </div>
        </Card>
      </Pop>
    </SceneIn>
  );
};
