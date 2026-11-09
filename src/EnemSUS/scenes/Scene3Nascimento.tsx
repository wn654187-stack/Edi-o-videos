import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { at } from "../data";
import { Card, Chip, Pop, SceneIn, Title, useCue, useVertical } from "../ui";
import { bodyFont, clamp, colors, glow, headlineFont } from "../theme";

const NODES = [
  { year: "1986", label: "8ª Conferência\nNacional de Saúde", word: "1986" },
  { year: "1988", label: "Constituição\nFederal", word: "Constituição" },
  { year: "1990", label: "Lei 8.080\nSUS na prática", word: "1990" },
];

const QUOTE = ["“A", "saúde", "é", "direito", "de", "todos", "e", "dever", "do", "Estado.”"];

export const Scene3Nascimento: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCue(from);
  const v = useVertical();

  const L = v
    ? { lineX: 80, lineW: 920, lineY: 560, nodeX: [180, 540, 900], labelW: 340, year: 60, label: 27, chipTop: 345, quote: { left: 60, top: 850, width: 960 }, quoteSize: 56 }
    : { lineX: 260, lineW: 1400, lineY: 330, nodeX: [360, 960, 1560], labelW: 400, year: 64, label: 30, chipTop: 185, quote: { left: 360, top: 560, width: 1200 }, quoteSize: 60 };
  const rel = (x: number) => (x - L.lineX) / L.lineW;

  const lineProgress = interpolate(
    frame,
    [cue("1986") - 12, cue("1986"), cue("Constituição") - 12, cue("Constituição"), cue("1990") - 12, cue("1990"), cue("1990") + 20],
    [0, rel(L.nodeX[0]), rel(L.nodeX[0]), rel(L.nodeX[1]), rel(L.nodeX[1]), rel(L.nodeX[2]), 1],
    { ...clamp, easing: Easing.inOut(Easing.cubic) },
  );

  // Each quote word lights up when spoken.
  let after = at("196", from);
  const lit = QUOTE.map((w) => {
    const t = at(w.replace(/[“”.]/g, ""), after);
    after = t + 0.01;
    return Math.round((t - from) * fps);
  });

  return (
    <SceneIn>
      <Title glowColor={colors.green}>Como o SUS nasceu</Title>
      <Pop at={cue("Reforma")} style={{ left: 0, right: 0, top: L.chipTop, textAlign: "center" }}>
        <Chip color={colors.green} size={v ? 28 : 30}>
          Movimento da Reforma Sanitária
        </Chip>
      </Pop>

      <div style={{ position: "absolute", left: L.lineX, top: L.lineY - 4, width: L.lineW, height: 8, borderRadius: 4, background: "#ffffff22" }} />
      <div
        style={{
          position: "absolute",
          left: L.lineX,
          top: L.lineY - 4,
          width: L.lineW * lineProgress,
          height: 8,
          borderRadius: 4,
          background: `linear-gradient(90deg, ${colors.green}, ${colors.susNeon})`,
          boxShadow: glow(colors.susNeon, 0.6),
        }}
      />
      {NODES.map((n, i) => {
        const x = L.nodeX[i];
        const start = cue(n.word);
        const s = spring({ frame: frame - start, fps, config: { damping: 11, stiffness: 200 } });
        const on = frame >= start;
        return (
          <React.Fragment key={n.year}>
            <div
              style={{
                position: "absolute",
                left: x - 30,
                top: L.lineY - 30,
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
                left: x - L.labelW / 2,
                width: L.labelW,
                top: L.lineY + 46,
                textAlign: "center",
                opacity: interpolate(s, [0, 0.4], [0, 1], clamp),
                translate: `0px ${interpolate(s, [0, 1], [30, 0])}px`,
              }}
            >
              <div style={{ fontFamily: headlineFont, fontSize: L.year, color: colors.gold, lineHeight: 1 }}>{n.year}</div>
              <div style={{ fontFamily: bodyFont, fontWeight: 800, fontSize: L.label, color: colors.white, whiteSpace: "pre-line", lineHeight: 1.2 }}>
                {n.label}
              </div>
            </div>
          </React.Fragment>
        );
      })}

      <Pop at={cue("artigo")} from="scale" style={L.quote}>
        <Card color={colors.green} style={{ padding: v ? "30px 40px" : "26px 44px", textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: colors.greenNeon, letterSpacing: 3 }}>CONSTITUIÇÃO FEDERAL · ART. 196</div>
          <div style={{ fontSize: L.quoteSize, fontWeight: 900, lineHeight: 1.2, marginTop: 8 }}>
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
