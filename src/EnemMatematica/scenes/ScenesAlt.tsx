import React from "react";
import { QuizAlt } from "../../EnemNaturezaAlt/scenes/QuizAlt";
import { PromptPill } from "../../shared/PromptPill";
import { at, useCue } from "../data";

export { Scene5Final } from "./Scenes";

const T = 4;
const LABEL = "COMENTA SUA LETRA!";

/** Q1 opens the video: question on screen from frame 0. */
export const SceneQ1: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <QuizAlt
      n={1}
      instant
      title="VOCÊ ACERTARIA? · 1/3"
      countdownLabel={LABEL}
      question={<>Um produto de <b>R$ 100</b> sobe <b>20%</b> e, depois, cai <b>20%</b>. Quanto ele custa agora?</>}
      options={["R$ 100", "R$ 104", "R$ 96", "R$ 98", "R$ 80"]}
      correct={2}
      optionsAt={cue("R$ 100")}
      thinkFrom={cue("fica?") + T}
      revealAt={cue("R$ 96", at("fica?", from))}
      explanation={<>100 + 20% = 120 · 20% de 120 = 24 · 120 − 24 = 96</>}
    />
  );
};

export const SceneQ2: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  const asked = at("cara", from);
  return (
    <>
      <QuizAlt
        n={2}
        title="VOCÊ ACERTARIA? · 2/3"
        countdownLabel={LABEL}
        question={<>Ao lançar <b>duas moedas</b>, qual a probabilidade de sair <b>cara nas duas</b>?</>}
        options={["1/2", "1/4", "1/3", "3/4", "2/3"]}
        correct={1}
        optionsAt={cue("moedas")}
        thinkFrom={cue("duas", asked) + T}
        revealAt={cue("1/4", asked)}
        explanation={<>4 resultados possíveis (Ca·Ca, Ca·Co, Co·Ca, Co·Co): só 1 serve → 25%</>}
      />
      <PromptPill at={4}>+ SEGUE: quiz novo todo dia</PromptPill>
    </>
  );
};

export const SceneQ3: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  const asked = at("quantos", from);
  return (
    <QuizAlt
      n={3}
      title="VOCÊ ACERTARIA? · 3/3"
      countdownLabel={LABEL}
      question={<><b>3 pedreiros</b> fazem um muro em <b>12 dias</b>. Em quantos dias <b>6 pedreiros</b> fazem o mesmo muro?</>}
      options={["24 dias", "18 dias", "9 dias", "6 dias", "3 dias"]}
      correct={3}
      optionsAt={cue("pedreiros")}
      thinkFrom={cue("dias", asked) + T}
      revealAt={cue("Seis", asked)}
      explanation={<>Mais gente, menos tempo (inversamente proporcional): 3 × 12 = 6 × 6</>}
    />
  );
};

