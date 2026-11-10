import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Card, Chip, Pop, SceneIn } from "../../EnemSUS/ui";
import { bodyFont, clamp, colors, glow, headlineFont } from "../../EnemSUS/theme";
import { at, useCue } from "../data";

const GRASS = "#0f3d22";

/** Stadium-night background: dark green with mowing stripes and a light glow. */
export const PitchBackground: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 20%, #1c5a35 0%, ${GRASS} 45%, #06140b 100%)` }}>
    <AbsoluteFill style={{ opacity: 0.12, backgroundImage: "repeating-linear-gradient(0deg, #ffffff 0 90px, transparent 90px 180px)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.75) 100%)" }} />
  </AbsoluteFill>
);

/** TV/monitor frame with a "VAR" badge. */
const Monitor: React.FC<{ children: React.ReactNode; width: number; height: number }> = ({ children, width, height }) => (
  <div style={{ width, height, borderRadius: 24, border: "10px solid #1a1d24", background: "#0b0e14", boxShadow: glow(colors.susNeon, 0.5), position: "relative", overflow: "hidden" }}>
    {children}
    <div style={{ position: "absolute", right: 16, top: 12, padding: "4px 16px", borderRadius: 10, background: colors.susNeon, fontFamily: headlineFont, fontSize: 38, color: "#06140b" }}>VAR</div>
  </div>
);

/** Hook: fully visible on frame 0. */
export const Scene1Hook: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const decide = cue("Quem");
  const crossed = interpolate(frame, [cue("marca") , cue("marca") + 8], [0, 1], clamp);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center" }}>
        <Chip color={colors.gold} size={36}>Regra do futebol explicada</Chip>
      </div>
      <div style={{ position: "absolute", left: 140, top: 360 }}>
        <Monitor width={800} height={420}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: headlineFont, fontSize: 150, color: colors.white }}>
            PÊNALTI?
          </div>
          <div style={{ position: "absolute", left: 60, right: 60, top: 205, height: 14, background: colors.redNeon, rotate: "-12deg", scale: `${crossed} 1`, transformOrigin: "0 50%", boxShadow: glow(colors.redNeon, 0.6) }} />
        </Monitor>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 830, textAlign: "center", fontFamily: headlineFont, fontSize: 92, lineHeight: 1.05, color: colors.white }}>
        O VAR <span style={{ color: colors.redNeon }}>NÃO</span> MARCA PÊNALTI
      </div>
      <Pop at={decide} from="scale" style={{ left: 0, right: 0, top: 1040, textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "14px 40px", borderRadius: 999, background: colors.green, boxShadow: glow(colors.green, 0.8), fontFamily: bodyFont, fontWeight: 900, fontSize: 40, color: "#06140b" }}>
          quem decide é o ÁRBITRO
        </div>
      </Pop>
    </>
  );
};

const LANCES = [
  { t: "Gol", c: colors.gold, w: "gol" },
  { t: "Pênalti", c: colors.gold, w: "pênalti" },
  { t: "Vermelho direto", c: colors.redNeon, w: "vermelho" },
  { t: "Cartão no jogador errado", c: colors.purple, w: "errado" },
];

/** The 4 reviewable situations + "clear and obvious error". */
export const Scene2Lances: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  const base = at("4", from);
  return (
    <SceneIn>
      <Pop at={1} style={{ left: 60, right: 60, top: 230, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 96, lineHeight: 1, color: colors.white }}>
          SÓ <span style={{ color: colors.gold }}>4 LANCES</span>
        </div>
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 36, color: colors.muted }}>em que o VAR pode entrar</div>
      </Pop>
      {LANCES.map((l, i) => (
        <Pop key={l.t} at={cue(l.w, base)} from="left" style={{ left: 90, top: 450 + i * 125, width: 900 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ width: 84, height: 84, borderRadius: 22, background: l.c, boxShadow: glow(l.c, 0.6), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: headlineFont, fontSize: 56, color: "#06140b" }}>{i + 1}</div>
            <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 52, color: colors.white }}>{l.t}</div>
          </div>
        </Pop>
      ))}
      <Pop at={cue("claro")} from="up" style={{ left: 70, top: 980, width: 940 }}>
        <Card color={colors.gold} style={{ padding: "20px 30px", textAlign: "center", fontWeight: 900, fontSize: 40 }}>
          E só se for um erro <span style={{ color: colors.gold }}>CLARO E ÓBVIO</span>
        </Card>
      </Pop>
    </SceneIn>
  );
};

/** Penalty box diagram and the 3 checks. */
export const Scene3Checks: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCue(from);
  const checks = [
    { t: "Teve falta?", w: "falta", c: colors.redNeon },
    { t: "Foi dentro da área?", w: "dentro", c: colors.susNeon },
    { t: "Infração antes, no começo da jogada?", w: "antes", c: colors.purple },
  ];
  const line = spring({ frame: frame - cue("dentro"), fps, config: { damping: 14 } });
  return (
    <SceneIn>
      <Pop at={1} style={{ left: 60, right: 60, top: 230, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 92, lineHeight: 1, color: colors.white }}>
          NO PÊNALTI, <span style={{ color: colors.gold }}>3 CHECAGENS</span>
        </div>
      </Pop>
      {/* penalty area diagram */}
      <div style={{ position: "absolute", left: 190, top: 360, width: 700, height: 300 }}>
        <svg width={700} height={300} viewBox="0 0 700 300">
          <rect x={0} y={0} width={700} height={300} fill="none" stroke="#ffffff55" strokeWidth={6} />
          <rect x={150} y={0} width={400} height={150} fill="none" stroke="#ffffffcc" strokeWidth={6} />
          <rect x={260} y={0} width={180} height={60} fill="none" stroke="#ffffff88" strokeWidth={5} />
          <circle cx={350} cy={110} r={6} fill="#fff" />
          <line x1={150} y1={150} x2={550} y2={150} stroke={colors.susNeon} strokeWidth={10} opacity={line} style={{ filter: `drop-shadow(0 0 10px ${colors.susNeon})` }} />
          <circle cx={420} cy={168} r={16} fill={colors.gold} />
          <text x={160} y={185} fill={colors.susNeon} fontFamily="sans-serif" fontWeight={900} fontSize={26} opacity={line}>
            linha da área
          </text>
        </svg>
      </div>
      {checks.map((c, i) => (
        <Pop key={c.t} at={cue(c.w)} from="left" style={{ left: 80, top: 700 + i * 120, width: 920 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, fontFamily: bodyFont, fontWeight: 900, fontSize: 42, color: colors.white }}>
            <div style={{ width: 70, height: 70, flexShrink: 0, borderRadius: "50%", border: `5px solid ${c.c}`, display: "flex", alignItems: "center", justifyContent: "center", color: c.c, fontSize: 40 }}>{i + 1}</div>
            {c.t}
          </div>
        </Pop>
      ))}
    </SceneIn>
  );
};

/** Interpretation -> monitor review; fact -> accept directly. */
export const Scene4Decide: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <SceneIn>
      <Pop at={1} style={{ left: 60, right: 60, top: 230, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 92, lineHeight: 1, color: colors.white }}>
          E QUEM <span style={{ color: colors.green }}>DECIDE?</span>
        </div>
      </Pop>
      <Pop at={cue("interpretação") - 6} from="left" style={{ left: 70, top: 380, width: 940 }}>
        <Card color={colors.gold} style={{ padding: "26px 30px", display: "flex", alignItems: "center", gap: 28 }}>
          <Monitor width={220} height={140}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70 }}>▶</div>
          </Monitor>
          <div>
            <div style={{ fontWeight: 900, fontSize: 30, color: colors.gold, letterSpacing: 2 }}>LANCE DE INTERPRETAÇÃO</div>
            <div style={{ fontWeight: 900, fontSize: 40, lineHeight: 1.2 }}>Árbitro vai ao monitor e revê</div>
          </div>
        </Card>
      </Pop>
      <Pop at={cue("fato") - 4} from="right" style={{ left: 70, top: 680, width: 940 }}>
        <Card color={colors.susNeon} style={{ padding: "26px 30px", display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ width: 220, height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={200} height={110} viewBox="0 0 200 110">
              <rect x={10} y={10} width={180} height={90} fill="none" stroke="#ffffff99" strokeWidth={5} />
              <line x1={10} y1={70} x2={190} y2={70} stroke={colors.susNeon} strokeWidth={8} />
              <circle cx={96} cy={74} r={10} fill={colors.gold} />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 30, color: colors.susNeon, letterSpacing: 2 }}>LANCE DE FATO</div>
            <div style={{ fontWeight: 900, fontSize: 40, lineHeight: 1.2 }}>Ex.: linha da área. Pode aceitar direto</div>
          </div>
        </Card>
      </Pop>
      <Pop at={cue("direto")} from="scale" style={{ left: 0, right: 0, top: 1000, textAlign: "center" }}>
        <Chip color={colors.green} size={36}>Decisão final: sempre do árbitro</Chip>
      </Pop>
    </SceneIn>
  );
};

export const Scene5Final: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const opt = (label: string, color: string, left: number, delay: number) => (
    <Pop at={cue("ajudou") + delay} from="scale" style={{ left, top: 620, width: 420 }}>
      <div style={{ borderRadius: 30, border: `4px solid ${color}`, background: `${color}22`, boxShadow: glow(color, 0.6), padding: "36px 0", textAlign: "center", fontFamily: headlineFont, fontSize: 84, color: colors.white }}>{label}</div>
    </Pop>
  );
  return (
    <SceneIn>
      <Pop at={1} style={{ left: 60, right: 60, top: 270, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 104, lineHeight: 1.02, color: colors.white }}>
          O VAR <span style={{ color: colors.green }}>AJUDOU</span>
          <br />
          OU <span style={{ color: colors.redNeon }}>PIOROU</span>?
        </div>
      </Pop>
      {opt("AJUDOU", colors.green, 70, 0)}
      {opt("PIOROU", colors.redNeon, 590, 6)}
      <Pop at={cue("Comenta")} from="scale" style={{ left: 190, top: 900, width: 700 }}>
        <div style={{ borderRadius: 999, padding: "24px 0", textAlign: "center", background: colors.red, boxShadow: glow(colors.red, interpolate(Math.sin(frame / 5), [-1, 1], [0.5, 1.1])), fontFamily: bodyFont, fontWeight: 900, fontSize: 44, color: colors.white }}>
          COMENTA + SEGUE
        </div>
      </Pop>
    </SceneIn>
  );
};
