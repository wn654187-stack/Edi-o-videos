import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Chip, Pop, SceneIn, useCue, useVertical } from "../ui";
import { bodyFont, clamp, colors, glow } from "../theme";

const SEGMENTS: { t: string; hl?: string }[] = [
  { t: "A valorização do Sistema Único de Saúde " },
  { t: "(SUS)", hl: colors.gold },
  { t: " como " },
  { t: "direito universal", hl: colors.green },
];
const TOTAL = SEGMENTS.reduce((n, s) => n + s.t.length, 0);

export const Scene1Hook: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const v = useVertical();
  const typeStart = cue("valorização") - 8;
  const typeEnd = cue("universal") + 8;
  const typed = Math.round(interpolate(frame, [typeStart, typeEnd], [0, TOTAL], clamp));
  const caret = Math.floor(frame / 8) % 2 === 0 && typed < TOTAL;
  const marker = interpolate(frame, [typeEnd, typeEnd + 12], [0, 1], clamp);
  let remaining = typed;

  const paper = v ? { left: 60, top: 440, width: 960, height: 560 } : { left: 260, top: 200, width: 1400, height: 520 };
  const margin = v ? 70 : 120;
  const lh = v ? 84 : 80;

  return (
    <SceneIn>
      <Pop at={2} style={{ left: 0, right: 0, top: v ? 260 : 70, textAlign: "center" }}>
        <Chip color={colors.gold} size={v ? 36 : 40}>
          Enem 2026 · Tema da redação
        </Chip>
      </Pop>

      <Pop at={6} from="scale" style={paper}>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 24,
            background: colors.paper,
            boxShadow: `0 30px 80px rgba(0,0,0,0.6), ${glow(colors.susNeon, 0.5)}`,
            backgroundImage: `repeating-linear-gradient(transparent 0px, transparent ${lh - 2}px, #c9d6ea ${lh - 2}px, #c9d6ea ${lh}px)`,
            backgroundPositionY: "40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: margin, top: 0, bottom: 0, width: 4, background: "#ff8a9a" }} />
          <div
            style={{
              position: "absolute",
              left: margin + 44,
              right: v ? 50 : 70,
              top: v ? 64 : 58,
              fontFamily: bodyFont,
              fontWeight: 900,
              fontSize: v ? 74 : 76,
              lineHeight: `${lh}px`,
              color: colors.ink,
            }}
          >
            {SEGMENTS.map((s, i) => {
              const shown = s.t.slice(0, Math.max(0, remaining));
              remaining -= s.t.length;
              if (!shown) return null;
              return (
                <span
                  key={i}
                  style={
                    s.hl
                      ? {
                          color: s.hl === colors.gold ? "#b07a00" : "#0b8a62",
                          backgroundImage: `linear-gradient(transparent 55%, ${s.hl}88 55%)`,
                          backgroundSize: `${marker * 100}% 100%`,
                          backgroundRepeat: "no-repeat",
                        }
                      : undefined
                  }
                >
                  {shown}
                </span>
              );
            })}
            {caret ? <span style={{ color: colors.sus }}>|</span> : null}
          </div>
        </div>
      </Pop>

      <Pop at={cue("90 segundos")} from="scale" style={v ? { left: 790, top: 340 } : { left: 1560, top: 150 }}>
        <div
          style={{
            width: 170,
            height: 170,
            borderRadius: "50%",
            background: colors.sus,
            border: `6px solid ${colors.white}`,
            boxShadow: glow(colors.susNeon, 1),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: colors.white,
            fontFamily: bodyFont,
            fontWeight: 900,
            rotate: "8deg",
          }}
        >
          <div style={{ fontSize: 72, lineHeight: 1 }}>90s</div>
          <div style={{ fontSize: 22, letterSpacing: 2 }}>EXPLICADO</div>
        </div>
      </Pop>
    </SceneIn>
  );
};
