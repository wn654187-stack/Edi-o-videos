import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Card, Pop, SceneIn, Title } from "../../EnemSUS/ui";
import { at, useCue } from "../data";
import { bodyFont, clamp, colors, glow, headlineFont, textGlow } from "../theme";

export const Scene3Forca: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCue(from);
  const g0 = cue("67");
  const g = Math.round(interpolate(frame, [g0, g0 + 22], [0, 67], clamp));
  const blocksAt = cue("5", at("quase", from));

  return (
    <SceneIn>
      <Title glowColor={colors.redNeon}>No impacto</Title>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", opacity: frame >= g0 ? 1 : 0 }}>
        <div style={{ fontFamily: headlineFont, fontSize: 330, lineHeight: 1, color: colors.gold, textShadow: textGlow(colors.gold, 0.8) }}>
          {g}G
        </div>
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 40, color: colors.white }}>
          o corpo ficou <span style={{ color: colors.gold }}>67 vezes</span> mais pesado
        </div>
      </div>

      <Pop at={cue("70")} style={{ left: 70, top: 790, width: 940 }}>
        <Card color={colors.gold} style={{ padding: "22px 30px", textAlign: "center", fontWeight: 900, fontSize: 52 }}>
          70 kg × 67 ≈ <span style={{ color: colors.gold }}>4,7 toneladas</span>
        </Card>
      </Pop>

      <div style={{ position: "absolute", left: 140, right: 140, top: 960, height: 280, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 18 }}>
        {new Array(5).fill(0).map((_, i) => {
          const s = spring({ frame: frame - (blocksAt + i * 4), fps, config: { damping: 9, stiffness: 160 } });
          return (
            <div
              key={i}
              style={{
                width: 130,
                height: 150 + (i % 2) * 30,
                borderRadius: "40px 40px 12px 12px",
                background: "linear-gradient(180deg, #5b6170, #2b2f38)",
                border: `3px solid ${colors.steel}`,
                boxShadow: glow(colors.gold, 0.3),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: headlineFont,
                fontSize: 52,
                color: colors.white,
                opacity: interpolate(s, [0, 0.2], [0, 1], clamp),
                translate: `0px ${interpolate(s, [0, 1], [-420, 0])}px`,
              }}
            >
              1 t
            </div>
          );
        })}
      </div>
    </SceneIn>
  );
};
