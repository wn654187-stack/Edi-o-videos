import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Chip, Pop, SceneIn } from "../../EnemSUS/ui";
import { clamp, colors, glow, headlineFont } from "../../EnemSUS/theme";
import { useCue } from "../data";

const TOPICS = [
  { t: "Ecologia", c: colors.green },
  { t: "Genética", c: colors.purple },
  { t: "Química orgânica", c: colors.susNeon },
  { t: "Leis de Newton", c: colors.redNeon },
  { t: "Energia elétrica", c: colors.gold },
];

export const Scene1Hook: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const m = cue("minuto");
  const left = Math.max(0, 60 - Math.floor(Math.max(0, frame - m) / 30) * 1);
  const ring = interpolate(frame, [m, m + 60], [1, 0.9], clamp);
  return (
    <SceneIn>
      <Pop at={2} style={{ left: 0, right: 0, top: 230, textAlign: "center" }}>
        <Chip color={colors.gold} size={34}>Enem · domingo 15/11</Chip>
      </Pop>
      <Pop at={m - 4} from="scale" style={{ left: 340, top: 330 }}>
        <div
          style={{
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `conic-gradient(${colors.gold} ${ring * 360}deg, #ffffff18 0deg)`,
            boxShadow: glow(colors.gold, 0.6),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 340, height: 340, borderRadius: "50%", background: colors.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: headlineFont, fontSize: 150, color: colors.white, lineHeight: 1 }}>0:{String(left % 60).padStart(2, "0")}</div>
            <div style={{ fontFamily: headlineFont, fontSize: 44, color: colors.gold }}>1 MINUTO</div>
          </div>
        </div>
      </Pop>
      <Pop at={cue("Ciências")} style={{ left: 0, right: 0, top: 760, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 92, color: colors.white, lineHeight: 1 }}>
          REVISÃO DE <span style={{ color: colors.green }}>NATUREZA</span>
        </div>
      </Pop>
      <div style={{ position: "absolute", left: 70, right: 70, top: 900, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
        {TOPICS.map((t, i) => (
          <Pop key={t.t} at={cue("isso") + i * 4} from="scale" style={{ position: "relative" }}>
            <Chip color={t.c} size={30}>
              {i + 1}. {t.t}
            </Chip>
          </Pop>
        ))}
      </div>
    </SceneIn>
  );
};
