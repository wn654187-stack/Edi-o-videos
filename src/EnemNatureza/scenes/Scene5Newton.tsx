import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Card, Pop, SceneIn } from "../../EnemSUS/ui";
import { bodyFont, clamp, colors, glow, headlineFont } from "../../EnemSUS/theme";
import { useCue } from "../data";
import { Topic } from "./common";

const Rocket: React.FC = () => (
  <svg width={160} height={300} viewBox="0 0 160 300">
    <path d="M80 10 Q130 70 120 200 L40 200 Q30 70 80 10 Z" fill="#e8ecf5" stroke="#9aa3b5" strokeWidth={4} />
    <circle cx={80} cy={100} r={22} fill={colors.susNeon} stroke="#fff" strokeWidth={5} />
    <path d="M40 160 L10 230 L40 210 Z" fill={colors.red} />
    <path d="M120 160 L150 230 L120 210 Z" fill={colors.red} />
    <rect x={55} y={200} width={50} height={16} rx={4} fill="#6b7385" />
  </svg>
);

export const Scene5Newton: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const act = cue("ação");
  const up = cue("foguete");
  const lift = interpolate(frame, [up, up + 40], [0, -260], { ...clamp, easing: Easing.in(Easing.cubic) });
  const flame = frame >= act ? 0.8 + 0.2 * Math.sin(frame / 2) : 0;
  return (
    <SceneIn>
      <Topic n="4" name="LEIS DE NEWTON" color={colors.redNeon} />
      <Pop at={cue("massa") - 6} from="scale" style={{ left: 70, top: 400, width: 940 }}>
        <Card color={colors.redNeon} style={{ padding: "16px 0", textAlign: "center" }}>
          <div style={{ fontFamily: headlineFont, fontSize: 140, lineHeight: 1 }}>F = m · a</div>
          <div style={{ fontFamily: bodyFont, fontWeight: 800, fontSize: 30, color: colors.muted }}>força = massa × aceleração</div>
        </Card>
      </Pop>
      <div style={{ position: "absolute", left: 460, top: 700 + lift, opacity: frame >= act - 10 ? 1 : 0 }}>
        <Rocket />
        <div
          style={{
            position: "absolute",
            left: 50,
            top: 210,
            width: 60,
            height: 120 * flame,
            borderRadius: "0 0 40px 40px",
            background: `linear-gradient(${colors.gold}, ${colors.red}00)`,
            filter: "blur(2px)",
          }}
        />
      </div>
      <Pop at={act} from="left" style={{ left: 80, top: 760, width: 330 }}>
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 36, color: colors.gold, lineHeight: 1.2 }}>
          AÇÃO ↓
          <br />
          <span style={{ fontSize: 26, color: colors.white }}>gases empurrados para baixo</span>
        </div>
      </Pop>
      <Pop at={cue("reação")} from="right" style={{ left: 680, top: 760, width: 340 }}>
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 36, color: colors.redNeon, lineHeight: 1.2, textAlign: "right" }}>
          REAÇÃO ↑
          <br />
          <span style={{ fontSize: 26, color: colors.white }}>foguete empurrado para cima</span>
        </div>
      </Pop>
      <Pop at={cue("intensidade")} style={{ left: 70, right: 70, top: 1130, textAlign: "center" }}>
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 32, color: colors.white, padding: "10px 20px", borderRadius: 20, background: "rgba(0,0,0,0.5)", boxShadow: glow(colors.redNeon, 0.3) }}>
          mesma intensidade · sentido oposto
        </div>
      </Pop>
    </SceneIn>
  );
};
