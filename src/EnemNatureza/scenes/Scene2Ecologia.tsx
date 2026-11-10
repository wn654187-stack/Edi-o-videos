import React from "react";
import { interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Chip, Pop, SceneIn } from "../../EnemSUS/ui";
import { bodyFont, clamp, colors } from "../../EnemSUS/theme";
import { useCue } from "../data";
import { Topic } from "./common";

const LEVELS = [
  { name: "Produtores", e: "100%", w: 940 },
  { name: "Consumidor 1º", e: "10%", w: 780 },
  { name: "Consumidor 2º", e: "1%", w: 620 },
  { name: "Consumidor 3º", e: "0,1%", w: 460 },
];

export const Scene2Ecologia: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCue(from);
  const lv = cue("nível");
  const en = cue("energia");
  const hg = cue("mercúrio");
  return (
    <SceneIn>
      <Topic n="1" name="ECOLOGIA" color={colors.green} />
      {LEVELS.map((l, i) => {
        const s = spring({ frame: frame - (lv + i * 5), fps, config: { damping: 13 } });
        const top = 1020 - (i + 1) * 135;
        const dots = Math.round(interpolate(frame, [hg + 4, hg + 30], [0, [1, 3, 7, 14][i]], clamp));
        return (
          <div
            key={l.name}
            style={{
              position: "absolute",
              left: 540 - l.w / 2,
              top,
              width: l.w,
              height: 120,
              borderRadius: 18,
              background: `${colors.green}${["33", "4d", "66", "88"][i]}`,
              border: `3px solid ${colors.green}`,
              opacity: interpolate(s, [0, 0.4], [0, 1], clamp),
              scale: interpolate(s, [0, 1], [0.6, 1]),
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              fontFamily: bodyFont,
              fontWeight: 900,
              color: colors.white,
              overflow: "hidden",
            }}
          >
            <span style={{ fontSize: 30 }}>{l.name}</span>
            <span style={{ fontSize: 34, color: colors.gold, opacity: frame >= en + i * 6 ? 1 : 0 }}>{l.e}</span>
            {new Array(dots).fill(0).map((_, d) => (
              <div
                key={d}
                style={{
                  position: "absolute",
                  left: 20 + random(`hx${i}-${d}`) * (l.w - 40),
                  top: 10 + random(`hy${i}-${d}`) * 100,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: colors.redNeon,
                  boxShadow: `0 0 10px ${colors.redNeon}`,
                }}
              />
            ))}
          </div>
        );
      })}
      <Pop at={hg} style={{ left: 0, right: 0, top: 1060, textAlign: "center" }}>
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 32, color: colors.redNeon }}>● mercúrio se acumula no topo</div>
      </Pop>
      <Pop at={cue("biomagnificação")} from="scale" style={{ left: 0, right: 0, top: 1130, textAlign: "center" }}>
        <Chip color={colors.green} size={40}>Biomagnificação</Chip>
      </Pop>
    </SceneIn>
  );
};
