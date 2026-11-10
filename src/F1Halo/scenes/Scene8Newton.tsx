import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Card, Chip, Pop, SceneIn, Title } from "../../EnemSUS/ui";
import { useCue } from "../data";
import { bodyFont, clamp, colors, glow, headlineFont, textGlow } from "../theme";

const Bar: React.FC<{ label: string; dt: string; value: number; color: string; top: number; at: number }> = ({ label, dt, value, color, top, at }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [at, at + 18], [0, value], clamp);
  return (
    <div style={{ position: "absolute", left: 70, top, width: 940, opacity: frame >= at ? 1 : 0 }}>
      <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 36, color: colors.white }}>
        <span style={{ color: colors.gold }}>{dt}</span> → {label}
      </div>
      <div style={{ marginTop: 12, height: 64, width: 940 * w, borderRadius: 14, background: color, boxShadow: glow(color, 0.7) }} />
    </div>
  );
};

export const Scene8Newton: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <SceneIn>
      <Title glowColor={colors.blue}>2ª Lei de Newton</Title>
      <Pop at={cue("explica")} from="scale" style={{ left: 70, top: 380, width: 940 }}>
        <Card color={colors.blue} style={{ padding: "18px 0", textAlign: "center" }}>
          <div style={{ fontFamily: headlineFont, fontSize: 130, color: colors.white, textShadow: textGlow(colors.blue, 0.6) }}>
            F = Δp / Δt
          </div>
          <div style={{ fontFamily: bodyFont, fontWeight: 800, fontSize: 30, color: colors.muted }}>força = variação do momento ÷ tempo</div>
        </Card>
      </Pop>
      <Bar dt="Δt curto" label="força ENORME" value={1} color={colors.redNeon} top={720} at={cue("tempo")} />
      <Bar dt="Δt longo" label="força menor" value={0.35} color={colors.green} top={880} at={cue("menor")} />
      <Pop at={cue("desmanchar")} style={{ left: 0, right: 0, top: 1080, textAlign: "center" }}>
        <Chip color={colors.orange} size={34}>O carro se desmancha. O piloto, não.</Chip>
      </Pop>
    </SceneIn>
  );
};
