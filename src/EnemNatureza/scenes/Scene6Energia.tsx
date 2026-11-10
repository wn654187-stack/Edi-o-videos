import React from "react";
import { Card, Pop, SceneIn } from "../../EnemSUS/ui";
import { bodyFont, colors, headlineFont } from "../../EnemSUS/theme";
import { useCue } from "../data";
import { Topic } from "./common";

const Shower: React.FC = () => (
  <svg width={190} height={210} viewBox="0 0 190 210">
    <path d="M30 10 V40 H120" fill="none" stroke="#c9ced8" strokeWidth={12} strokeLinecap="round" />
    <path d="M90 40 H170 Q175 75 130 80 H90 Z" fill="#e8ecf5" stroke="#9aa3b5" strokeWidth={4} />
    {[0, 1, 2, 3, 4].map((i) => (
      <line key={i} x1={100 + i * 15} y1={95} x2={92 + i * 17} y2={190} stroke={colors.susNeon} strokeWidth={5} strokeLinecap="round" strokeDasharray="14 12" />
    ))}
    <path d="M55 60 L45 85 H58 L48 110" fill="none" stroke={colors.gold} strokeWidth={6} strokeLinejoin="round" />
  </svg>
);

const Line: React.FC<{ at: number; children: React.ReactNode; top: number; color?: string }> = ({ at, children, top, color = colors.white }) => (
  <Pop at={at} from="left" style={{ left: 330, top, right: 70 }}>
    <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 46, color }}>{children}</div>
  </Pop>
);

export const Scene6Energia: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <SceneIn>
      <Topic n="5" name="ENERGIA ELÉTRICA" color={colors.gold} />
      <Pop at={cue("potência") - 6} from="scale" style={{ left: 70, top: 400, width: 940 }}>
        <Card color={colors.gold} style={{ padding: "16px 0", textAlign: "center" }}>
          <div style={{ fontFamily: headlineFont, fontSize: 140, lineHeight: 1 }}>E = P × t</div>
          <div style={{ fontFamily: bodyFont, fontWeight: 800, fontSize: 30, color: colors.muted }}>energia = potência × tempo</div>
        </Card>
      </Pop>
      <Pop at={cue("chuveiro")} from="scale" style={{ left: 90, top: 720 }}>
        <Shower />
      </Pop>
      <Line at={cue("chuveiro") + 6} top={720}>5 kW</Line>
      <Line at={cue("hora")} top={800}>× 1 h por dia</Line>
      <Line at={cue("mês") - 10} top={880}>× 30 dias</Line>
      <Pop at={cue("mês")} from="scale" style={{ left: 70, top: 1000, width: 940 }}>
        <Card color={colors.gold} style={{ padding: "18px 0", textAlign: "center" }}>
          <div style={{ fontFamily: headlineFont, fontSize: 100, color: colors.gold, lineHeight: 1 }}>= 150 kWh/mês</div>
        </Card>
      </Pop>
    </SceneIn>
  );
};
