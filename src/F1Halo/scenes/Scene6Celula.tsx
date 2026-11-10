import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Card, Pop, SceneIn } from "../../EnemSUS/ui";
import { useCue } from "../data";
import { bodyFont, clamp, colors, glow, headlineFont } from "../theme";

const Num: React.FC<{ n: string; color: string }> = ({ n, color }) => (
  <div style={{ width: 80, height: 80, flexShrink: 0, borderRadius: "50%", background: color, boxShadow: glow(color, 0.8), fontFamily: headlineFont, fontSize: 54, color: colors.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
    {n}
  </div>
);

export const Scene6Celula: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const timerAt = cue("30");
  const secs = Math.round(interpolate(frame, [timerAt, timerAt + 30], [0, 30], clamp));

  return (
    <SceneIn>
      <Pop at={2} from="left" style={{ left: 70, top: 250, width: 940 }}>
        <Card color={colors.blue} style={{ height: 420, padding: 36, position: "relative", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.35,
              backgroundImage: "repeating-linear-gradient(45deg, #000 0 10px, #2a2e38 10px 20px), repeating-linear-gradient(-45deg, transparent 0 10px, #11141a 10px 20px)",
              backgroundBlendMode: "multiply",
            }}
          />
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 22 }}>
            <Num n="2" color={colors.blue} />
            <div style={{ fontFamily: headlineFont, fontSize: 70, lineHeight: 1 }}>CÉLULA DE SOBREVIVÊNCIA</div>
          </div>
          <div style={{ position: "relative", marginTop: 26, fontFamily: bodyFont, fontWeight: 800, fontSize: 40 }}>
            Fibra de carbono
          </div>
          <Pop at={cue("deformou")} from="scale" style={{ left: 36, top: 290 }}>
            <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 44, color: colors.green }}>✓ Não se deformou</div>
          </Pop>
        </Card>
      </Pop>

      <Pop at={cue("Terceiro")} from="right" style={{ left: 70, top: 720, width: 940 }}>
        <Card color={colors.orange} style={{ height: 470, padding: 36, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <Num n="3" color={colors.orange} />
            <div style={{ fontFamily: headlineFont, fontSize: 70, lineHeight: 1 }}>MACACÃO À PROVA DE FOGO</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 36, marginTop: 30, opacity: frame >= timerAt ? 1 : 0 }}>
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: `conic-gradient(${colors.orange} ${(secs / 30) * 360}deg, #ffffff18 0deg)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 160, height: 160, borderRadius: "50%", background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: headlineFont, fontSize: 80, color: colors.white }}>
                {secs}s
              </div>
            </div>
            <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 40, lineHeight: 1.2 }}>
              quase 30 segundos
              <br />
              <span style={{ color: colors.orange }}>nas chamas</span>
            </div>
          </div>
        </Card>
      </Pop>
    </SceneIn>
  );
};
