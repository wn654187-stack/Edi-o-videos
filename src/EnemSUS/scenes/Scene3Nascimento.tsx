import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { at } from "../data";
import { Card, Chip, Pop, SceneIn, Title, useCue } from "../ui";
import { bodyFont, clamp, colors, glow, headlineFont } from "../theme";

const NODES = [
  { x: 360, year: "1986", label: "8ª Conferência\nNacional de Saúde", word: "1986" },
  { x: 960, year: "1988", label: "Constituição\nFederal", word: "Constituição" },
  { x: 1560, year: "1990", label: "Lei 8.080\nSUS na prática", word: "1990" },
];
const LINE_Y = 330;

const QUOTE = ["“A", "saúde", "é", "direito", "de", "todos", "e", "dever", "do", "Estado.”"];

export const Scene3Nascimento: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCue(from);
  const lineProgress = interpolate(
    frame,
    [cue("1986") - 12, cue("1986"), cue("Constituição") - 12, cue("Constituição"), cue("1990") - 12, cue("1990"), cue("1990") + 20],
    [0, 100 / 1400, 100 / 1400, 700 / 1400, 700 / 1400, 1300 / 1400, 1],
    { ...clamp, easing: Easing.inOut(Easing.cubic) },
  );
  const quoteAt = cue("artigo");
  const quoteFrom = at("196", from);
  // Each quote word lights up when spoken.
  let after = quoteFrom;
  const lit = QUOTE.map((w) => {
    const t = at(w.replace(/[“”.]/g, ""), after);
    after = t + 0.01;
    return Math.round((t - from) * fps);
  });

  return (
    <SceneIn>
      <Title glowColor={colors.green}>Como o SUS nasceu</Title>
      <Pop at={cue("Reforma")} style={{ left: 0, right: 0, top: 185, textAlign: "center" }}>
        <Chip color={colors.green} size={30}>
          Movimento da Reforma Sanitária
        </Chip>
      </Pop>

      {/* timeline */}
      <div style={{ position: "absolute", left: 260, top: LINE_Y - 4, width: 1400, height: 8, borderRadius: 4, background: "#ffffff22" }} />
      <div
        style={{
          position: "absolute",
          left: 260,
          top: LINE_Y - 4,
          width: 1400 * lineProgress,
          height: 8,
          borderRadius: 4,
          background: `linear-gradient(90deg, ${colors.green}, ${colors.susNeon})`,
          boxShadow: glow(colors.susNeon, 0.6),
        }}
      />
      {NODES.map((n) => {
        const start = cue(n.word);
        const s = spring({ frame: frame - start, fps, config: { damping: 11, stiffness: 200 } });
        const on = frame >= start;
        return (
          <React.Fragment key={n.year}>
            <div
              style={{
                position: "absolute",
                left: n.x - 30,
                top: LINE_Y - 30,
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: on ? colors.gold : "#1a2a40",
                border: `5px solid ${on ? colors.white : "#3a4a66"}`,
                boxShadow: on ? glow(colors.gold, 0.9) : undefined,
                scale: on ? interpolate(s, [0, 1], [0.5, 1]) : 1,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: n.x - 200,
                width: 400,
                top: LINE_Y + 46,
                textAlign: "center",
                opacity: interpolate(s, [0, 0.4], [0, 1], clamp),
                translate: `0px ${interpolate(s, [0, 1], [30, 0])}px`,
              }}
            >
              <div style={{ fontFamily: headlineFont, fontSize: 64, color: colors.gold, lineHeight: 1 }}>{n.year}</div>
              <div style={{ fontFamily: bodyFont, fontWeight: 800, fontSize: 30, color: colors.white, whiteSpace: "pre-line", lineHeight: 1.2 }}>
                {n.label}
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {/* Art. 196 quote */}
      <Pop at={quoteAt} from="scale" style={{ left: 360, top: 560, width: 1200 }}>
        <Card color={colors.green} style={{ padding: "26px 44px", textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: colors.greenNeon, letterSpacing: 3 }}>CONSTITUIÇÃO FEDERAL · ART. 196</div>
          <div style={{ fontSize: 60, fontWeight: 900, lineHeight: 1.2, marginTop: 8 }}>
            {QUOTE.map((w, i) => (
              <span
                key={i}
                style={{
                  color: frame >= lit[i] ? colors.white : "#ffffff40",
                  textShadow: frame >= lit[i] ? "0 0 18px rgba(95,245,192,0.5)" : undefined,
                }}
              >
                {w}{" "}
              </span>
            ))}
          </div>
        </Card>
      </Pop>
    </SceneIn>
  );
};
