import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Card, Chip, Pop, SceneIn } from "../../EnemSUS/ui";
import { bodyFont, clamp, colors, glow, headlineFont } from "../../EnemSUS/theme";

/** One quiz question: label, question card, visual, a "think" countdown and the reveal. */
export const Quiz: React.FC<{
  n: number;
  question: React.ReactNode;
  visual: React.ReactNode;
  thinkFrom: number;
  revealAt: number;
  answer: React.ReactNode;
  explanation: React.ReactNode;
}> = ({ n, question, visual, thinkFrom, revealAt, answer, explanation }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const thinking = frame >= thinkFrom && frame < revealAt;
  const left = interpolate(frame, [thinkFrom, revealAt], [1, 0], clamp);
  const secs = Math.max(1, Math.ceil(left * ((revealAt - thinkFrom) / fps)));
  const reveal = spring({ frame: frame - revealAt, fps, config: { damping: 10, stiffness: 180 } });

  return (
    <SceneIn>
      <Pop at={0} style={{ left: 0, right: 0, top: 220, textAlign: "center" }}>
        <Chip color={colors.gold} size={36}>Questão {n}/3</Chip>
      </Pop>
      <Pop at={2} style={{ left: 60, top: 320, width: 960 }}>
        <Card color={colors.susNeon} style={{ padding: "26px 34px", fontWeight: 900, fontSize: 50, lineHeight: 1.2, textAlign: "center" }}>
          {question}
        </Card>
      </Pop>
      <div style={{ position: "absolute", left: 60, top: 640, width: 960, height: 330, display: "flex", alignItems: "center", justifyContent: "center", opacity: frame >= revealAt ? 0 : 1 }}>
        {visual}
      </div>
      {thinking ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 990, display: "flex", justifyContent: "center", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: `conic-gradient(${colors.gold} ${left * 360}deg, #ffffff18 0deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: headlineFont, fontSize: 80, color: colors.white }}>
              {secs}
            </div>
          </div>
          <div style={{ fontFamily: headlineFont, fontSize: 80, color: colors.gold }}>PENSA...</div>
        </div>
      ) : null}
      {frame >= revealAt ? (
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 650,
            textAlign: "center",
            opacity: interpolate(reveal, [0, 0.3], [0, 1], clamp),
            scale: interpolate(reveal, [0, 1], [0.5, 1]),
          }}
        >
          <div style={{ display: "inline-block", padding: "18px 50px", borderRadius: 36, background: colors.green, color: colors.bg, boxShadow: glow(colors.green, 1), fontFamily: headlineFont, fontSize: 150, lineHeight: 1 }}>
            {answer}
          </div>
          <div style={{ marginTop: 34, fontFamily: bodyFont, fontWeight: 900, fontSize: 40, color: colors.white, lineHeight: 1.3 }}>{explanation}</div>
        </div>
      ) : null}
    </SceneIn>
  );
};
