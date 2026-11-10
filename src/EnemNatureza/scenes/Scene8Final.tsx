import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Chip, Pop, SceneIn } from "../../EnemSUS/ui";
import { bodyFont, colors, glow, headlineFont } from "../../EnemSUS/theme";
import { useCue } from "../data";

const OPTIONS = [
  { t: "1. Ecologia", c: colors.green },
  { t: "2. Genética", c: colors.purple },
  { t: "3. Química orgânica", c: colors.susNeon },
  { t: "4. Leis de Newton", c: colors.redNeon },
  { t: "5. Energia elétrica", c: colors.gold },
];

export const Scene8Final: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const follow = cue("segue");
  return (
    <SceneIn>
      <Pop at={2} style={{ left: 60, right: 60, top: 240, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 104, lineHeight: 1.02, color: colors.white }}>
          QUAL DESSES
          <br />
          <span style={{ color: colors.gold }}>VOCÊ MAIS ERRA?</span>
        </div>
      </Pop>
      <div style={{ position: "absolute", left: 70, right: 70, top: 500, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        {OPTIONS.map((o, i) => (
          <Pop key={o.t} at={6 + i * 4} from="left" style={{ position: "relative" }}>
            <Chip color={o.c} size={36}>{o.t}</Chip>
          </Pop>
        ))}
      </div>
      <Pop at={follow} from="scale" style={{ left: 140, top: 1050, width: 800 }}>
        <div
          style={{
            borderRadius: 999,
            padding: "24px 0",
            textAlign: "center",
            background: colors.red,
            boxShadow: glow(colors.red, interpolate(Math.sin(frame / 5), [-1, 1], [0.5, 1.1])),
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 42,
            color: colors.white,
          }}
        >
          + SEGUIR · revisão de MATEMÁTICA
        </div>
      </Pop>
    </SceneIn>
  );
};
