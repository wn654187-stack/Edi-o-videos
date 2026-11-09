import React from "react";
import { at } from "../data";
import { CarteiraIcon, Card, HospitalIcon, Pop, SceneIn, Title, useCue, useVertical } from "../ui";
import { colors, headlineFont } from "../theme";

const Line: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number }> = ({
  children,
  size = 40,
  color = colors.white,
  weight = 800,
}) => <div style={{ fontSize: size, color, fontWeight: weight, lineHeight: 1.2 }}>{children}</div>;

export const Scene2Antes: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  const v = useVertical();
  const semCarteira = cue("Quem", at("Previdência", from));

  const cardStyle: React.CSSProperties = v
    ? { padding: "26px 36px", height: 380, display: "flex", alignItems: "center", gap: 34 }
    : { padding: 40, height: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, textAlign: "center" };
  const textBox: React.CSSProperties = v ? { display: "flex", flexDirection: "column", gap: 14 } : { display: "contents" };

  return (
    <SceneIn>
      <Title glowColor={colors.gold}>
        Antes de <span style={{ color: colors.gold }}>1988</span>
      </Title>

      <Pop at={cue("carteira")} from="left" style={v ? { left: 70, top: 370, width: 940 } : { left: 190, top: 240, width: 680 }}>
        <Card color={colors.sus} style={cardStyle}>
          <CarteiraIcon size={v ? 130 : 150} />
          <div style={textBox}>
            <Line size={v ? 44 : 46} weight={900}>COM CARTEIRA ASSINADA</Line>
            <Line size={v ? 36 : 40} color={colors.greenNeon}>✓ Atendimento público (INAMPS)</Line>
            <Line size={v ? 28 : 32} color={colors.muted}>quem contribuía com a Previdência</Line>
          </div>
        </Card>
      </Pop>

      <Pop at={semCarteira} from="scale" style={v ? { left: 0, right: 0, top: 752, textAlign: "center" } : { left: 900, top: 470, width: 120, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: v ? 70 : 80, color: colors.white }}>VS</div>
      </Pop>

      <Pop at={semCarteira} from="right" style={v ? { left: 70, top: 850, width: 940 } : { left: 1050, top: 240, width: 680 }}>
        <Card color={colors.red} style={cardStyle}>
          <HospitalIcon size={v ? 160 : 190} color={colors.redNeon} />
          <div style={textBox}>
            <Line size={v ? 44 : 46} weight={900}>SEM CARTEIRA</Line>
            <Line size={v ? 36 : 40} color={colors.redNeon}>✗ Dependia de caridade</Line>
            <Line size={v ? 28 : 32} color={colors.muted}>como as Santas Casas</Line>
          </div>
        </Card>
      </Pop>
    </SceneIn>
  );
};
