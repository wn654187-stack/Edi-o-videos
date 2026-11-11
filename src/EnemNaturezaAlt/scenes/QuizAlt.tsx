import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Chip, Pop, SceneIn } from "../../EnemSUS/ui";
import { bodyFont, clamp, colors, glow, headlineFont } from "../../EnemSUS/theme";

const LETTERS = ["A", "B", "C", "D", "E"];

/** ENEM-style multiple-choice question: options, a think countdown, then the right letter lights up. */
export const QuizAlt: React.FC<{
  n: number;
  question: React.ReactNode;
  options: string[];
  correct: number;
  optionsAt: number;
  thinkFrom: number;
  revealAt: number;
  explanation: React.ReactNode;
  /** Header chip text; defaults to "Questão n/3 · Estilo Enem". */
  title?: string;
  /** Text next to the countdown; defaults to "QUAL LETRA?". */
  countdownLabel?: string;
  /** Show the header and question fully on the first frame (no fade-in). Use for the opening question. */
  instant?: boolean;
}> = ({ n, question, options, correct, optionsAt, thinkFrom, revealAt, explanation, title, countdownLabel = "QUAL LETRA?", instant = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const revealed = frame >= revealAt;
  const thinking = frame >= thinkFrom && !revealed;
  const left = interpolate(frame, [thinkFrom, revealAt], [1, 0], clamp);
  const secs = Math.max(1, Math.ceil(left * ((revealAt - thinkFrom) / fps)));
  const pop = spring({ frame: frame - revealAt, fps, config: { damping: 10, stiffness: 200 } });

  const Wrap = instant ? AbsoluteFill : SceneIn;
  const Appear: React.FC<{ at: number; style: React.CSSProperties; children: React.ReactNode }> = ({ at: a, style, children }) =>
    instant ? <div style={{ position: "absolute", ...style }}>{children}</div> : <Pop at={a} style={style}>{children}</Pop>;
  return (
    <Wrap>
      <Appear at={0} style={{ left: 0, right: 0, top: 215, textAlign: "center" }}>
        <Chip color={colors.gold} size={title ? 42 : 34}>{title ?? `Questão ${n}/3 · Estilo Enem`}</Chip>
      </Appear>
      <Appear at={2} style={{ left: 50, top: 305, width: 980 }}>
        <div style={{ borderRadius: 22, background: "#f4f6ff", color: "#121a33", padding: "22px 30px", fontFamily: bodyFont, fontWeight: 800, fontSize: 42, lineHeight: 1.22, boxShadow: "0 18px 50px rgba(0,0,0,0.5)" }}>
          {question}
        </div>
      </Appear>
      {options.map((o, i) => {
        const isRight = i === correct;
        const dim = revealed && !isRight;
        const color = revealed && isRight ? colors.green : "#ffffff";
        return (
          <Pop key={o} at={optionsAt + i * 4} from="left" style={{ left: 50, top: 500 + i * 112, width: 980 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "14px 22px",
                borderRadius: 18,
                border: `3px solid ${revealed && isRight ? colors.green : "#ffffff33"}`,
                background: revealed && isRight ? `${colors.green}33` : "rgba(255,255,255,0.06)",
                boxShadow: revealed && isRight ? glow(colors.green, 0.8) : undefined,
                opacity: dim ? 0.3 : 1,
                scale: revealed && isRight ? interpolate(pop, [0, 1], [1, 1.04]) : 1,
              }}
            >
              <div
                style={{
                  width: 62,
                  height: 62,
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: revealed && isRight ? colors.green : "transparent",
                  border: `4px solid ${revealed && isRight ? colors.green : colors.gold}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: headlineFont,
                  fontSize: 40,
                  color: revealed && isRight ? colors.bg : colors.gold,
                }}
              >
                {revealed && isRight ? "✓" : LETTERS[i]}
              </div>
              <div style={{ fontFamily: bodyFont, fontWeight: 800, fontSize: 34, lineHeight: 1.2, color }}>{o}</div>
            </div>
          </Pop>
        );
      })}
      {thinking ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1080, display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
          <div style={{ width: 120, height: 120, borderRadius: "50%", background: `conic-gradient(${colors.gold} ${left * 360}deg, #ffffff18 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 94, height: 94, borderRadius: "50%", background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: headlineFont, fontSize: 62, color: colors.white }}>{secs}</div>
          </div>
          <div style={{ fontFamily: headlineFont, fontSize: 64, color: colors.gold }}>{countdownLabel}</div>
        </div>
      ) : null}
      {revealed ? (
        <div style={{ position: "absolute", left: 60, right: 60, top: 1080, textAlign: "center", opacity: interpolate(pop, [0, 0.4], [0, 1], clamp), fontFamily: bodyFont, fontWeight: 900, fontSize: 34, lineHeight: 1.3, color: colors.white }}>
          <span style={{ fontFamily: headlineFont, fontSize: 52, color: colors.green }}>LETRA {LETTERS[correct]}</span>
          <br />
          {explanation}
        </div>
      ) : null}
    </Wrap>
  );
};
