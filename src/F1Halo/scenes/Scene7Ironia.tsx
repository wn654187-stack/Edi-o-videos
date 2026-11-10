import React from "react";
import { Card, Pop, SceneIn, Title } from "../../EnemSUS/ui";
import { at, useCue } from "../data";
import { bodyFont, colors } from "../theme";

export const Scene7Ironia: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <SceneIn>
      <Title glowColor={colors.gold} size={110}>
        A <span style={{ color: colors.gold }}>ironia</span>
      </Title>
      <Pop at={cue("anos")} from="left" style={{ left: 70, top: 440, width: 940 }}>
        <Card color={colors.redNeon} style={{ padding: "30px 36px" }}>
          <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 32, color: colors.redNeon, letterSpacing: 3 }}>ANTES DO ACIDENTE</div>
          <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 54, marginTop: 8 }}>Grosjean criticava o halo</div>
        </Card>
      </Pop>
      <Pop at={cue("halo", at("criticado", from))} from="right" style={{ left: 70, top: 760, width: 940 }}>
        <Card color={colors.green} style={{ padding: "30px 36px" }}>
          <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 32, color: colors.green, letterSpacing: 3 }}>DEPOIS DO ACIDENTE</div>
          <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 48, marginTop: 8, lineHeight: 1.2 }}>
            “Acho que é a melhor coisa que trouxemos para a F1.”
          </div>
        </Card>
      </Pop>
    </SceneIn>
  );
};
