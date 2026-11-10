import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { Chip, Pop, SceneIn } from "../../EnemSUS/ui";
import { bodyFont, colors, glow, headlineFont } from "../../EnemSUS/theme";
import { QuizAlt } from "./QuizAlt";
import { at, useCue } from "../data";



/** Hook: fully visible on frame 0. */
export const Scene1Hook: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const pulse = 1 + 0.03 * Math.sin(frame / 4);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
        <Chip color={colors.green} size={36}>Estilo Enem · com alternativas</Chip>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 380, textAlign: "center", scale: pulse }}>
        <div style={{ fontFamily: headlineFont, fontSize: 170, lineHeight: 1.1, color: colors.white }}>
          VOCÊ
          <br />
          <span style={{ display: "inline-block", marginTop: 16, color: colors.bg, background: colors.green, padding: "0 24px", borderRadius: 20 }}>ACERTARIA?</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontFamily: bodyFont, fontWeight: 900, fontSize: 48, color: colors.white }}>
        3 questões de Natureza
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 890, display: "flex", justifyContent: "center", gap: 26 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 90, height: 90, borderRadius: 24, border: `4px solid ${colors.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: headlineFont, fontSize: 60, color: colors.green }}>
            ?
          </div>
        ))}
      </div>
      <Pop at={cue("Segue")} from="scale" style={{ left: 0, right: 0, top: 1040, textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "16px 40px", borderRadius: 999, background: colors.red, boxShadow: glow(colors.red, 0.8), fontFamily: bodyFont, fontWeight: 900, fontSize: 40, color: colors.white }}>
          + SEGUE · domingo é a prova
        </div>
      </Pop>
    </>
  );
};

const T = 4;

export const Scene2Q1: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <QuizAlt
      n={1}
      question={<>Em uma tempestade, vemos o <b>raio</b> antes de ouvir o <b>trovão</b>. Isso acontece porque:</>}
      options={[
        "O trovão é produzido depois do raio",
        "A luz se propaga muito mais rápido que o som",
        "O som não se propaga no ar úmido",
        "A luz é refletida pelas nuvens",
        "O olho reage mais rápido que o ouvido",
      ]}
      correct={1}
      optionsAt={cue("raio")}
      thinkFrom={cue("trovão") + T}
      revealAt={cue("Porque", at("trovão", from))}
      explanation={<>Luz: ~300.000 km/s · Som no ar: ~340 m/s</>}
    />
  );
};

export const Scene3Q2: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <QuizAlt
      n={2}
      question={<>A organela responsável por produzir a maior parte da <b>energia (ATP)</b> da célula é:</>}
      options={["Ribossomo", "Complexo de Golgi", "Mitocôndria", "Lisossomo", "Núcleo"]}
      correct={2}
      optionsAt={cue("organela")}
      thinkFrom={cue("célula") + T}
      revealAt={cue("mitocôndria")}
      explanation={<>Respiração celular → ATP: a "usina de energia" da célula</>}
    />
  );
};

export const Scene4Q3: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  const asked = at("boia", from);
  return (
    <QuizAlt
      n={3}
      question={<>Um cubo de <b>gelo</b> colocado em um copo com água <b>boia</b>. Isso ocorre porque:</>}
      options={[
        "A água é mais densa no estado sólido",
        "O gelo tem ar preso dentro dele",
        "A tensão superficial segura o gelo",
        "O gelo é menos denso que a água líquida",
        "O gelo está mais frio que a água",
      ]}
      correct={3}
      optionsAt={cue("gelo")}
      thinkFrom={cue("água", asked) + T}
      revealAt={cue("Porque", asked)}
      explanation={<>Gelo ~0,92 g/cm³ · Água 1 g/cm³: ao congelar, a água se expande</>}
    />
  );
};

export const Scene5Final: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  return (
    <SceneIn>
      <Pop at={1} style={{ left: 60, right: 60, top: 250, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 112, lineHeight: 1.02, color: colors.white }}>
          QUANTAS
          <br />
          <span style={{ color: colors.gold }}>VOCÊ ACERTOU?</span>
        </div>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 22 }}>
        {["0/3", "1/3", "2/3", "3/3"].map((s, i) => (
          <Pop key={s} at={4 + i * 3} from="scale" style={{ position: "relative" }}>
            <div style={{ padding: "22px 30px", borderRadius: 24, border: `4px solid ${i === 3 ? colors.green : colors.susNeon}`, background: `${i === 3 ? colors.green : colors.susNeon}22`, fontFamily: headlineFont, fontSize: 70, color: colors.white }}>{s}</div>
          </Pop>
        ))}
      </div>
      <Pop at={cue("Comenta")} style={{ left: 0, right: 0, top: 740, textAlign: "center" }}>
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 44, color: colors.muted }}>Comenta seu placar</div>
      </Pop>
      <Pop at={cue("manda")} from="scale" style={{ left: 120, top: 860, width: 840 }}>
        <div style={{ borderRadius: 999, padding: "28px 0", textAlign: "center", background: colors.green, color: colors.bg, boxShadow: glow(colors.green, interpolate(Math.sin(frame / 5), [-1, 1], [0.5, 1.1])), fontFamily: bodyFont, fontWeight: 900, fontSize: 42 }}>
          ↗ MANDA PRO GRUPO DE ESTUDOS
        </div>
      </Pop>
    </SceneIn>
  );
};
