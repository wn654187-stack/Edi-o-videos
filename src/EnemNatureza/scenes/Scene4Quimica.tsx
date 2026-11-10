import React from "react";
import { Card, Chip, Pop, SceneIn } from "../../EnemSUS/ui";
import { bodyFont, colors, headlineFont } from "../../EnemSUS/theme";
import { useCue } from "../data";
import { Topic } from "./common";

const Formula: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: headlineFont, fontSize: 104, color: colors.white, lineHeight: 1 }}>{children}</div>
);

export const Scene4Quimica: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <SceneIn>
      <Topic n="3" name="QUÍMICA ORGÂNICA" color={colors.susNeon} />
      <Pop at={cue("grupo")} style={{ left: 0, right: 0, top: 410, textAlign: "center" }}>
        <Chip color={colors.susNeon} size={38}>Reconheça o grupo funcional</Chip>
      </Pop>
      <Pop at={cue("ligado") - 8} from="left" style={{ left: 70, top: 540, width: 940 }}>
        <Card color={colors.susNeon} style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 50px" }}>
          <Formula>
            R–<span style={{ color: colors.susNeon }}>OH</span>
          </Formula>
          <div style={{ textAlign: "right", fontFamily: bodyFont }}>
            <div style={{ fontWeight: 900, fontSize: 52 }}>ÁLCOOL</div>
            <div style={{ fontWeight: 800, fontSize: 26, color: colors.muted }}>OH ligado a carbono saturado</div>
          </div>
        </Card>
      </Pop>
      <Pop at={cue("ácido") - 14} from="right" style={{ left: 70, top: 840, width: 940 }}>
        <Card color={colors.gold} style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 50px" }}>
          <Formula>
            R–<span style={{ color: colors.gold }}>COOH</span>
          </Formula>
          <div style={{ textAlign: "right", fontFamily: bodyFont }}>
            <div style={{ fontWeight: 900, fontSize: 46 }}>ÁCIDO</div>
            <div style={{ fontWeight: 900, fontSize: 40 }}>CARBOXÍLICO</div>
          </div>
        </Card>
      </Pop>
    </SceneIn>
  );
};
