import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Chip, Pop, SceneIn } from "../../EnemSUS/ui";
import { PersonIcon } from "../../EnemSUS/ui";
import { at, useCue } from "../data";
import { bodyFont, colors, glow, headlineFont } from "../../EnemSUS/theme";
import { Quiz } from "./Quiz";

const THINK_OFFSET = 4;

/** Hook: fully visible on frame 0 (no fade), so the feed never shows an empty first frame. */
export const Scene1Hook: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const pulse = 1 + 0.03 * Math.sin(frame / 4);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
        <Chip color={colors.gold} size={36}>Enem · Matemática</Chip>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 380, textAlign: "center", scale: pulse }}>
        <div style={{ fontFamily: headlineFont, fontSize: 170, lineHeight: 1.1, color: colors.white }}>
          VOCÊ
          <br />
          <span style={{ display: "inline-block", marginTop: 16, color: colors.bg, background: colors.gold, padding: "0 24px", borderRadius: 20 }}>ACERTARIA?</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", fontFamily: bodyFont, fontWeight: 900, fontSize: 48, color: colors.white }}>
        3 questões que <span style={{ color: colors.gold }}>sempre caem</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center", gap: 26 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 90, height: 90, borderRadius: 24, border: `4px solid ${colors.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: headlineFont, fontSize: 60, color: colors.gold }}>
            ?
          </div>
        ))}
      </div>
      <Pop at={cue("Segue")} from="scale" style={{ left: 0, right: 0, top: 1040, textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "16px 40px", borderRadius: 999, background: colors.red, boxShadow: glow(colors.red, 0.8), fontFamily: bodyFont, fontWeight: 900, fontSize: 40, color: colors.white }}>
          + SEGUE · amanhã tem mais
        </div>
      </Pop>
    </>
  );
};

const PriceTag: React.FC = () => {
  const frame = useCurrentFrame();
  const y = interpolate(Math.sin(frame / 8), [-1, 1], [-14, 14]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
      <div style={{ padding: "30px 46px", borderRadius: 28, background: colors.gold, color: colors.bg, fontFamily: headlineFont, fontSize: 120, rotate: "-6deg" }}>R$ 100</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, translate: `0px ${y}px` }}>
        <div style={{ fontFamily: headlineFont, fontSize: 70, color: colors.green }}>▲ 20%</div>
        <div style={{ fontFamily: headlineFont, fontSize: 70, color: colors.redNeon }}>▼ 20%</div>
      </div>
    </div>
  );
};

export const Scene2Q1: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <Quiz
      n={1}
      question={<>R$ 100 sobem <span style={{ color: colors.green }}>20%</span> e depois caem <span style={{ color: colors.redNeon }}>20%</span>. Quanto fica?</>}
      visual={<PriceTag />}
      thinkFrom={cue("fica?") + THINK_OFFSET}
      revealAt={cue("R$ 96", at("fica?", from))}
      answer="R$ 96"
      explanation={<>100 + 20% = <span style={{ color: colors.gold }}>120</span> · 20% de 120 = <span style={{ color: colors.redNeon }}>24</span><br />120 − 24 = <span style={{ color: colors.green }}>96</span></>}
    />
  );
};

const Coin: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const flip = Math.abs(Math.cos((frame + delay) / 5));
  return (
    <div style={{ width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #fff3b0, ${colors.gold} 60%, #b9790a)`, scale: `${flip} 1`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: headlineFont, fontSize: 70, color: "#5a3d00", boxShadow: glow(colors.gold, 0.5) }}>
      ?
    </div>
  );
};

export const Scene3Q2: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <Quiz
      n={2}
      question={<>Jogando <span style={{ color: colors.gold }}>duas moedas</span>, qual a chance de dar <span style={{ color: colors.gold }}>cara nas duas</span>?</>}
      visual={<div style={{ display: "flex", gap: 60 }}><Coin delay={0} /><Coin delay={7} /></div>}
      thinkFrom={cue("duas", at("cara", from)) + THINK_OFFSET}
      revealAt={cue("1/4", at("cara", from))}
      answer="1/4"
      explanation={<>4 resultados possíveis: <span style={{ color: colors.green }}>Ca·Ca</span>, Ca·Co, Co·Ca, Co·Co<br />só 1 serve → <span style={{ color: colors.green }}>25%</span></>}
    />
  );
};

const Workers: React.FC<{ n: number; days: string; color: string }> = ({ n, days, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <div style={{ display: "flex", gap: 4, width: 420, flexWrap: "wrap" }}>
      {new Array(n).fill(0).map((_, i) => (
        <PersonIcon key={i} size={60} color={color} />
      ))}
    </div>
    <div style={{ fontFamily: headlineFont, fontSize: 80, color }}>{days}</div>
  </div>
);

export const Scene4Q3: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  const ask = at("dias?", at("quantos", from));
  return (
    <Quiz
      n={3}
      question={<><span style={{ color: colors.gold }}>3 pedreiros</span> fazem um muro em <span style={{ color: colors.gold }}>12 dias</span>. Quantos dias levam <span style={{ color: colors.gold }}>6 pedreiros</span>?</>}
      visual={
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <Workers n={3} days="12 dias" color={colors.susNeon} />
          <Workers n={6} days="? dias" color={colors.gold} />
        </div>
      }
      thinkFrom={cue("dias?", at("quantos", from)) + THINK_OFFSET}
      revealAt={cue("Seis", ask)}
      answer="6 dias"
      explanation={<>Mais gente, menos tempo: <span style={{ color: colors.gold }}>inversamente proporcional</span><br />3 × 12 = 6 × <span style={{ color: colors.green }}>6</span></>}
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
