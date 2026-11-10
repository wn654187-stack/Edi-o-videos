import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Pop, SceneIn } from "../../EnemSUS/ui";
import { useCue } from "../data";
import { bodyFont, colors, glow, headlineFont } from "../theme";

const Option: React.FC<{ label: string; color: string; at: number; left: number }> = ({ label, color, at, left }) => (
  <Pop at={at} from="scale" style={{ left, top: 640, width: 420 }}>
    <div style={{ borderRadius: 30, border: `4px solid ${color}`, background: `${color}22`, boxShadow: glow(color, 0.6), padding: "40px 0", textAlign: "center", fontFamily: headlineFont, fontSize: 96, color: colors.white }}>
      {label}
    </div>
  </Pop>
);

export const Scene9Final: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const follow = cue("segue");
  return (
    <SceneIn>
      <Pop at={2} style={{ left: 60, right: 60, top: 260, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 110, lineHeight: 1.02, color: colors.white }}>
          VOCÊ VOLTARIA
          <br />
          <span style={{ color: colors.gold }}>A CORRER?</span>
        </div>
      </Pop>
      <Option label="SIM" color={colors.green} at={cue("correr") + 4} left={70} />
      <Option label="NÃO" color={colors.redNeon} at={cue("correr") + 10} left={590} />
      <Pop at={cue("Comenta")} style={{ left: 0, right: 0, top: 900, textAlign: "center" }}>
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 44, color: colors.muted }}>Responde nos comentários</div>
      </Pop>
      <Pop at={follow} from="scale" style={{ left: 190, top: 1010, width: 700 }}>
        <div
          style={{
            borderRadius: 999,
            padding: "26px 0",
            textAlign: "center",
            background: colors.red,
            boxShadow: glow(colors.red, interpolate(Math.sin(frame / 5), [-1, 1], [0.5, 1.1])),
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 48,
            color: colors.white,
            letterSpacing: 2,
          }}
        >
          + SEGUIR PRA MAIS FÍSICA
        </div>
      </Pop>
    </SceneIn>
  );
};
