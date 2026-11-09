import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Card, Pop, SceneIn, useCue } from "../ui";
import { bodyFont, colors, glow, headlineFont } from "../theme";

const COMMENTS = [
  { text: "Usei o artigo 196 na introdução!", color: colors.green, dy: 0 },
  { text: "Travei na proposta de intervenção...", color: colors.redNeon, dy: 130 },
  { text: "Achei o tema ótimo", color: colors.gold, dy: 260 },
];

export const Scene7Final: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const comments = cue("comentários");
  const follow = cue("segue");
  const pulse = 1 + 0.05 * Math.sin((frame - follow) / 4) * (frame > follow + 10 ? 1 : 0);

  return (
    <SceneIn>
      <Pop at={2} style={{ left: 140, top: 110, width: 860 }}>
        <div style={{ fontFamily: headlineFont, fontSize: 92, color: colors.white, lineHeight: 1.05 }}>
          E VOCÊ, <span style={{ color: colors.gold }}>FEZ A PROVA?</span>
        </div>
      </Pop>
      <Pop at={comments - 4} style={{ left: 140, top: 262, width: 860 }}>
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 40, color: colors.muted }}>Como foi a sua redação? Comenta aí</div>
      </Pop>
      {COMMENTS.map((c, i) => (
        <Pop key={i} at={comments + 6 + i * 10} from="left" style={{ left: 140, top: 340 + c.dy, width: 820 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "18px 26px",
              borderRadius: 24,
              background: "rgba(255,255,255,0.08)",
              border: `2px solid ${c.color}`,
              fontFamily: bodyFont,
              fontWeight: 800,
              fontSize: 34,
              color: colors.white,
            }}
          >
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
            {c.text}
          </div>
        </Pop>
      ))}

      <Pop at={cue("Domingo")} from="scale" style={{ left: 1150, top: 110, width: 600 }}>
        <Card color={colors.gold} style={{ overflow: "hidden", textAlign: "center" }}>
          <div style={{ background: colors.gold, color: colors.bg, fontWeight: 900, fontSize: 36, padding: "12px 0", letterSpacing: 3 }}>DOMINGO</div>
          <div style={{ fontFamily: headlineFont, fontSize: 150, lineHeight: 1.05, marginTop: 10 }}>15/11</div>
          <div style={{ fontWeight: 900, fontSize: 40, color: colors.gold }}>2º DIA DO ENEM</div>
          <div style={{ fontWeight: 800, fontSize: 30, color: colors.muted, padding: "6px 0 26px" }}>Matemática + Ciências da Natureza</div>
        </Card>
      </Pop>

      <Pop at={follow} from="scale" style={{ left: 1150, top: 640, width: 600 }}>
        <div
          style={{
            scale: pulse,
            borderRadius: 999,
            padding: "26px 0",
            textAlign: "center",
            background: colors.red,
            boxShadow: glow(colors.red, interpolate(Math.sin(frame / 5), [-1, 1], [0.5, 1.1])),
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 50,
            color: colors.white,
            letterSpacing: 2,
          }}
        >
          + SEGUIR
        </div>
        <div style={{ textAlign: "center", marginTop: 16, fontFamily: bodyFont, fontWeight: 800, fontSize: 32, color: colors.white }}>
          pra não perder a revisão
        </div>
      </Pop>
    </SceneIn>
  );
};
