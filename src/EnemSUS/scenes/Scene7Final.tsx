import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Card, Pop, SceneIn, useCue, useVertical } from "../ui";
import { bodyFont, colors, glow, headlineFont } from "../theme";

const COMMENTS = [
  { text: "Usei o artigo 196 na introdução!", color: colors.green },
  { text: "Travei na proposta de intervenção...", color: colors.redNeon },
  { text: "Achei o tema ótimo", color: colors.gold },
];

export const Scene7Final: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const v = useVertical();
  const comments = cue("comentários");
  const follow = cue("segue");
  const pulse = 1 + 0.05 * Math.sin((frame - follow) / 4) * (frame > follow + 10 ? 1 : 0);

  const L = v
    ? {
        head: { left: 60, top: 220, width: 960 },
        headSize: 84,
        sub: { left: 60, top: 420, width: 960 },
        subSize: 36,
        comment: (i: number) => ({ left: 60, top: 490 + i * 108, width: 900 }),
        commentSize: 31,
        cal: { left: 60, top: 840, width: 470 },
        calBig: 110,
        btn: { left: 550, top: 905, width: 390 },
        btnSize: 44,
      }
    : {
        head: { left: 140, top: 110, width: 860 },
        headSize: 92,
        sub: { left: 140, top: 262, width: 860 },
        subSize: 40,
        comment: (i: number) => ({ left: 140, top: 340 + i * 130, width: 820 }),
        commentSize: 34,
        cal: { left: 1150, top: 110, width: 600 },
        calBig: 150,
        btn: { left: 1150, top: 640, width: 600 },
        btnSize: 50,
      };

  return (
    <SceneIn>
      <Pop at={2} style={{ ...L.head, textAlign: v ? "center" : "left" }}>
        <div style={{ fontFamily: headlineFont, fontSize: L.headSize, color: colors.white, lineHeight: 1.05 }}>
          E VOCÊ, {v ? <br /> : null}
          <span style={{ color: colors.gold }}>FEZ A PROVA?</span>
        </div>
      </Pop>
      <Pop at={comments - 4} style={{ ...L.sub, textAlign: v ? "center" : "left" }}>
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: L.subSize, color: colors.muted }}>Como foi a sua redação? Comenta aí</div>
      </Pop>
      {COMMENTS.map((c, i) => (
        <Pop key={i} at={comments + 6 + i * 10} from="left" style={L.comment(i)}>
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
              fontSize: L.commentSize,
              color: colors.white,
            }}
          >
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
            {c.text}
          </div>
        </Pop>
      ))}

      <Pop at={cue("Domingo")} from="scale" style={L.cal}>
        <Card color={colors.gold} style={{ overflow: "hidden", textAlign: "center" }}>
          <div style={{ background: colors.gold, color: colors.bg, fontWeight: 900, fontSize: v ? 30 : 36, padding: "10px 0", letterSpacing: 3 }}>DOMINGO</div>
          <div style={{ fontFamily: headlineFont, fontSize: L.calBig, lineHeight: 1.05, marginTop: 8 }}>15/11</div>
          <div style={{ fontWeight: 900, fontSize: v ? 32 : 40, color: colors.gold }}>2º DIA DO ENEM</div>
          <div style={{ fontWeight: 800, fontSize: v ? 24 : 30, color: colors.muted, padding: v ? "4px 16px 20px" : "6px 0 26px" }}>
            Matemática + Ciências da Natureza
          </div>
        </Card>
      </Pop>

      <Pop at={follow} from="scale" style={L.btn}>
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
            fontSize: L.btnSize,
            color: colors.white,
            letterSpacing: 2,
          }}
        >
          + SEGUIR
        </div>
        <div style={{ textAlign: "center", marginTop: 16, fontFamily: bodyFont, fontWeight: 800, fontSize: 30, color: colors.white }}>
          pra não perder a revisão
        </div>
      </Pop>
    </SceneIn>
  );
};
