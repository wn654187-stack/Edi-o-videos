import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Pop, SceneIn } from "../../EnemSUS/ui";
import { clamp, colors, glow, headlineFont } from "../../EnemSUS/theme";
import { useCue } from "../data";
import { Big, Note, Topic } from "./common";

const CELLS = ["AA", "Aa", "Aa", "aa"];
const SIZE = 200;

export const Scene3Genetica: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const sq = cue("heterozigotos");
  const fill = cue("dominante");
  const head = (t: string, style: React.CSSProperties) => (
    <div style={{ position: "absolute", width: SIZE, height: 90, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: headlineFont, fontSize: 72, color: colors.purple, ...style }}>{t}</div>
  );
  return (
    <SceneIn>
      <Topic n="2" name="GENÉTICA" color={colors.purple} />
      <Pop at={sq - 6} style={{ left: 0, right: 0, top: 380 }}>
        <Big size={88}>
          Aa <span style={{ color: colors.purple }}>×</span> Aa
        </Big>
        <Note size={30} color={colors.muted}>dois heterozigotos</Note>
      </Pop>
      <Pop at={sq} from="scale" style={{ left: 540 - SIZE - 45, top: 570, width: SIZE * 2 + 90, height: SIZE * 2 + 90 }}>
        {head("A", { left: 90, top: 0 })}
        {head("a", { left: 90 + SIZE, top: 0 })}
        {head("A", { left: 0, top: 90 + SIZE / 2 - 45, width: 90 })}
        {head("a", { left: 0, top: 90 + SIZE + SIZE / 2 - 45, width: 90 })}
        {CELLS.map((c, i) => {
          const on = frame >= fill + i * 4;
          const dom = c !== "aa";
          const col = dom ? colors.purple : colors.gold;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 90 + (i % 2) * SIZE,
                top: 90 + Math.floor(i / 2) * SIZE,
                width: SIZE - 10,
                height: SIZE - 10,
                borderRadius: 18,
                border: `3px solid ${col}`,
                background: on ? `${col}44` : "transparent",
                boxShadow: on ? glow(col, 0.5) : undefined,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: headlineFont,
                fontSize: 80,
                color: colors.white,
                opacity: interpolate(frame, [sq + 6 + i * 3, sq + 12 + i * 3], [0, 1], clamp),
              }}
            >
              {c}
            </div>
          );
        })}
      </Pop>
      <Pop at={cue("Proporção")} from="scale" style={{ left: 0, right: 0, top: 1080 }}>
        <Big size={120} color={colors.gold}>3 : 1</Big>
        <Note size={30} color={colors.muted}>dominante : recessivo</Note>
      </Pop>
    </SceneIn>
  );
};
