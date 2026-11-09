import React from "react";
import { CarteiraIcon, Card, HospitalIcon, Pop, SceneIn, Title, useCue } from "../ui";
import { colors, headlineFont } from "../theme";
import { at } from "../data";

const Line: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number }> = ({
  children,
  size = 40,
  color = colors.white,
  weight = 800,
}) => <div style={{ fontSize: size, color, fontWeight: weight, lineHeight: 1.2 }}>{children}</div>;

export const Scene2Antes: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  const semCarteira = cue("Quem", at("Previdência", from));
  return (
    <SceneIn>
      <Title glowColor={colors.gold}>
        Antes de <span style={{ color: colors.gold }}>1988</span>
      </Title>

      <Pop at={cue("carteira")} from="left" style={{ left: 190, top: 240, width: 680 }}>
        <Card color={colors.sus} style={{ padding: 40, height: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, textAlign: "center" }}>
          <CarteiraIcon size={150} />
          <Line size={46} weight={900}>COM CARTEIRA ASSINADA</Line>
          <Line color={colors.greenNeon}>✓ Atendimento público (INAMPS)</Line>
          <Line size={32} color={colors.muted}>quem contribuía com a Previdência</Line>
        </Card>
      </Pop>

      <Pop at={semCarteira} from="scale" style={{ left: 900, top: 470, width: 120, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 80, color: colors.white }}>VS</div>
      </Pop>

      <Pop at={semCarteira} from="right" style={{ left: 1050, top: 240, width: 680 }}>
        <Card color={colors.red} style={{ padding: 40, height: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, textAlign: "center" }}>
          <HospitalIcon size={190} color={colors.redNeon} />
          <Line size={46} weight={900}>SEM CARTEIRA</Line>
          <Line color={colors.redNeon}>✗ Dependia de caridade</Line>
          <Line size={32} color={colors.muted}>como as Santas Casas</Line>
        </Card>
      </Pop>
    </SceneIn>
  );
};
