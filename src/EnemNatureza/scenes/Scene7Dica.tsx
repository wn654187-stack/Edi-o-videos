import React from "react";
import { Card, Pop, SceneIn } from "../../EnemSUS/ui";
import { bodyFont, colors, headlineFont } from "../../EnemSUS/theme";
import { useCue } from "../data";

export const Scene7Dica: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <SceneIn>
      <Pop at={2} from="scale" style={{ left: 0, right: 0, top: 280, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 130, color: colors.gold, lineHeight: 1, textShadow: `0 0 30px ${colors.gold}aa` }}>★ DICA DE OURO ★</div>
      </Pop>
      <Pop at={cue("resposta")} from="up" style={{ left: 70, top: 520, width: 940 }}>
        <Card color={colors.gold} style={{ padding: "40px 40px", textAlign: "center" }}>
          <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 56, lineHeight: 1.2 }}>
            A resposta quase sempre está no <span style={{ color: colors.green }}>ENUNCIADO</span>
          </div>
        </Card>
      </Pop>
      <Pop at={cue("calma")} from="scale" style={{ left: 0, right: 0, top: 900, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 96, color: colors.green }}>LEIA COM CALMA</div>
      </Pop>
    </SceneIn>
  );
};
