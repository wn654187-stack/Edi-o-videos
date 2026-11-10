import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { Chip, Pop, SceneIn } from "../../EnemSUS/ui";
import { bodyFont, colors, glow, headlineFont } from "../../EnemSUS/theme";
import { Quiz } from "../../EnemMatematica/scenes/Quiz";
import { at, useCue } from "../data";


const THINK_OFFSET = 4;

/** Hook: fully visible on frame 0. */
export const Scene1Hook: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const pulse = 1 + 0.03 * Math.sin(frame / 4);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
        <Chip color={colors.green} size={36}>Enem · Ciências da Natureza</Chip>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 380, textAlign: "center", scale: pulse }}>
        <div style={{ fontFamily: headlineFont, fontSize: 170, lineHeight: 1.1, color: colors.white }}>
          VOCÊ
          <br />
          <span style={{ display: "inline-block", marginTop: 16, color: colors.bg, background: colors.green, padding: "0 24px", borderRadius: 20 }}>ACERTARIA?</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontFamily: bodyFont, fontWeight: 900, fontSize: 48, color: colors.white }}>
        Física · Biologia · Química
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

const Storm: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = (frame % 50) < 4 ? 1 : 0.35;
  const wave = (frame % 40) / 40;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
      <svg width={180} height={260} viewBox="0 0 180 260" style={{ opacity: flash, filter: `drop-shadow(0 0 30px ${colors.gold})` }}>
        <path d="M110 0 L30 140 L90 140 L60 260 L160 100 L100 100 L140 0 Z" fill={colors.gold} />
      </svg>
      <svg width={240} height={240} viewBox="0 0 240 240">
        {[0, 1, 2].map((i) => {
          const r = 30 + ((wave + i / 3) % 1) * 100;
          return <circle key={i} cx={40} cy={120} r={r} fill="none" stroke={colors.purple} strokeWidth={6} opacity={1 - ((wave + i / 3) % 1)} />;
        })}
        <text x={150} y={135} fill={colors.purple} fontFamily="sans-serif" fontWeight={900} fontSize={40}>BUM</text>
      </svg>
    </div>
  );
};

export const Scene2Q1: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <Quiz
      n={1}
      question={<>Por que a gente vê o <span style={{ color: colors.gold }}>raio</span> antes de ouvir o <span style={{ color: colors.purple }}>trovão</span>?</>}
      visual={<Storm />}
      thinkFrom={cue("trovão") + THINK_OFFSET}
      revealAt={cue("Porque", at("trovão", from))}
      answer="LUZ > SOM"
      explanation={<>Luz: <span style={{ color: colors.gold }}>~300.000 km/s</span><br />Som no ar: <span style={{ color: colors.purple }}>~340 m/s</span></>}
    />
  );
};

const Cell: React.FC = () => {
  const frame = useCurrentFrame();
  const wob = Math.sin(frame / 10) * 4;
  return (
    <svg width={520} height={320} viewBox="0 0 520 320">
      <ellipse cx={260} cy={160} rx={240 + wob} ry={140 - wob / 2} fill={`${colors.green}22`} stroke={colors.green} strokeWidth={6} />
      <circle cx={260} cy={150} r={55} fill={`${colors.purple}55`} stroke={colors.purple} strokeWidth={5} />
      <circle cx={260} cy={150} r={18} fill={colors.purple} />
      {[
        [120, 90, -20],
        [390, 220, 25],
        [130, 225, 10],
      ].map(([x, y, r], i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx={50} ry={24} fill={`${colors.gold}33`} stroke={colors.gold} strokeWidth={5} />
          <path d={`M${x - 36} ${y} q 12 -16 24 0 t 24 0 t 24 0`} fill="none" stroke={colors.gold} strokeWidth={4} />
        </g>
      ))}
      <text x={360} y={85} fill={colors.white} fontFamily="sans-serif" fontWeight={900} fontSize={34}>?</text>
    </svg>
  );
};

export const Scene3Q2: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <Quiz
      n={2}
      question={<>Qual <span style={{ color: colors.green }}>organela</span> produz a <span style={{ color: colors.gold }}>energia</span> da célula?</>}
      visual={<Cell />}
      thinkFrom={cue("célula") + THINK_OFFSET}
      revealAt={cue("mitocôndria")}
      answer="MITOCÔNDRIA"
      explanation={<>Respiração celular → <span style={{ color: colors.gold }}>ATP</span><br />(a "usina de energia" da célula)</>}
    />
  );
};

const IceGlass: React.FC = () => {
  const frame = useCurrentFrame();
  const bob = interpolate(Math.sin(frame / 12), [-1, 1], [-6, 6]);
  return (
    <svg width={300} height={320} viewBox="0 0 300 320">
      <path d="M40 20 L60 300 L240 300 L260 20" fill="none" stroke="#cfd6e6" strokeWidth={8} strokeLinejoin="round" />
      <path d="M48 110 L60 296 L240 296 L252 110 Z" fill={`${colors.susNeon}55`} />
      <g transform={`translate(0 ${bob})`}>
        <rect x={100} y={78} width={80} height={70} rx={10} fill="#e9f6ff" stroke={colors.susNeon} strokeWidth={4} opacity={0.95} />
        <rect x={185} y={92} width={50} height={46} rx={8} fill="#e9f6ff" stroke={colors.susNeon} strokeWidth={4} opacity={0.95} />
      </g>
    </svg>
  );
};

export const Scene4Q3: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  const asked = at("boia", from);
  return (
    <Quiz
      n={3}
      question={<>Por que o <span style={{ color: colors.susNeon }}>gelo boia</span> na água?</>}
      visual={<IceGlass />}
      thinkFrom={cue("água", asked) + THINK_OFFSET}
      revealAt={cue("Porque", asked)}
      answer="MENOS DENSO"
      explanation={<>Gelo: <span style={{ color: colors.susNeon }}>~0,92 g/cm³</span> · Água: <span style={{ color: colors.green }}>1 g/cm³</span><br />Ao congelar, a água se expande</>}
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
