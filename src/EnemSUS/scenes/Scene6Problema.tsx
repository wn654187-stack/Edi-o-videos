import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { at } from "../data";
import { Card, ClockIcon, CoinIcon, DoctorIcon, Pop, SceneIn, Title, useCue } from "../ui";
import { clamp, colors, glow, headlineFont } from "../theme";

const PROBLEMS = [
  { word: "filas", label: "Filas longas", sub: "", Icon: ClockIcon },
  { word: "falta", label: "Falta de médicos", sub: "em regiões afastadas", Icon: DoctorIcon },
  { word: "financiamento", label: "Financiamento", sub: "insuficiente", Icon: CoinIcon },
];

const Step: React.FC<{ n: string; text: string; at: number }> = ({ n, text, at: start }) => (
  <Pop at={start} from="left" style={{ position: "relative" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
      <div
        style={{
          width: 64,
          height: 64,
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
      <div style={{ fontSize: 46, fontWeight: 900 }}>{text}</div>
    </div>
  </Pop>
);

export const Scene6Problema: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const essay = cue("redação", at("Na", from));
  const dim = interpolate(frame, [essay - 6, essay + 6], [1, 0.55], clamp);

  return (
    <SceneIn>
      <Title glowColor={colors.red}>
        Valorizar = existe um <span style={{ color: colors.redNeon }}>problema</span>
      </Title>

      {PROBLEMS.map((p, i) => (
        <Pop key={p.word} at={cue(p.word)} from="scale" style={{ left: 190 + i * 520, top: 220, width: 500 }}>
          <Card color={colors.red} style={{ height: 300, opacity: dim, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center" }}>
            <p.Icon size={110} color={colors.redNeon} />
            <div style={{ fontSize: 42, fontWeight: 900, textTransform: "uppercase" }}>{p.label}</div>
            {p.sub ? <div style={{ fontSize: 30, fontWeight: 800, color: colors.redNeon }}>{p.sub}</div> : null}
          </Card>
        </Pop>
      ))}

      <Pop at={essay} from="up" style={{ left: 360, top: 560, width: 1200 }}>
        <Card color={colors.green} style={{ padding: "28px 50px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontFamily: headlineFont, fontSize: 52, color: colors.greenNeon, letterSpacing: 2 }}>NA SUA REDAÇÃO:</div>
          <div style={{ position: "relative", height: 150, display: "flex", flexDirection: "column", gap: 20 }}>
            <Step n="1" text="Reconhecer o SUS como conquista" at={cue("reconhecer")} />
            <div style={{ position: "absolute", top: 84 }}>
              <Step n="2" text="Propor como fortalecê-lo" at={cue("propor")} />
            </div>
          </div>
        </Card>
      </Pop>
    </SceneIn>
  );
};
