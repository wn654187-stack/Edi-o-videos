import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandScene, Hero } from "../../brand/Scene";
import { BrandPrompt, GlassCard, Pill, Reveal } from "../../brand/Glass";
import { GlassObject, Sparks } from "../../brand/GlassObject";
import { Icon } from "../../brand/Icons";
import { brand, brandFont, clamp } from "../../brand/theme";
import { at, useCue } from "../data";

const Candidate: React.FC<{ name: string; accent: "lime" | "orange"; result: string; reveal: boolean }> = ({ name, accent, result, reveal }) => (
  <GlassCard accent={reveal ? accent : "none"} style={{ width: 420, padding: "30px 0", textAlign: "center" }}>
    <div style={{ fontWeight: 700, fontSize: 30, color: brand.muted }}>{name}</div>
    <div style={{ fontWeight: 800, fontSize: 120, lineHeight: 1.05, letterSpacing: -3 }}>30</div>
    <div style={{ fontWeight: 600, fontSize: 28, color: brand.muted }}>acertos</div>
    <div style={{ marginTop: 16, fontWeight: 800, fontSize: 52, color: reveal ? (accent === "lime" ? brand.lime : brand.orange) : "#ffffff44" }}>{reveal ? result : "nota ?"}</div>
  </GlassCard>
);

export const Scene1Hook: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const reveal = frame >= cue("diferentes") - 4;
  return (
    <BrandScene instant label="Enem · como sai sua nota" icon="question" accent="lime" title="Mesmos acertos?">
      <div style={{ position: "absolute", left: 75, top: 540, display: "flex", gap: 80 }}>
        <Candidate name="Candidato A" accent="lime" result="nota maior" reveal={reveal} />
        <Candidate name="Candidato B" accent="orange" result="nota menor" reveal={reveal} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, textAlign: "center", fontFamily: brandFont, fontWeight: 500, fontSize: 24, color: brand.muted }}>exemplo ilustrativo</div>
    </BrandScene>
  );
};

/** Glass score gauge: the needle sweeps as the score is "calculated". */
const Gauge: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 620;
  const H = 360;
  const cx = W / 2;
  const cy = 320;
  const ang = -80 + 160 * (0.5 + 0.5 * Math.sin(frame / 22)) * 0.85 + 10;
  const ticks = Array.from({ length: 11 }).map((_, i) => {
    const a = ((-170 + i * 16) * Math.PI) / 180;
    return { x1: cx + Math.cos(a) * 250, y1: cy + Math.sin(a) * 250, x2: cx + Math.cos(a) * (i % 5 ? 220 : 200), y2: cy + Math.sin(a) * (i % 5 ? 220 : 200), i };
  });
  const rad = ((ang - 90) * Math.PI) / 180;
  return (
    <div style={{ position: "relative" }}>
      <GlassObject
        w={W}
        h={H}
        d={`M20 ${cy} A${cx - 20} ${cx - 20} 0 0 1 ${W - 20} ${cy} Q${W - 20} ${H} ${W - 60} ${H} H60 Q20 ${H} 20 ${cy} Z`}
        colors={[brand.lime, brand.blue, brand.blueSoft]}
        inner={
          <>
            <path d={`M${cx - 235} ${cy} A235 235 0 0 1 ${cx + 235} ${cy}`} fill="none" stroke="#ffffff22" strokeWidth={18} strokeLinecap="round" />
            <path d={`M${cx - 235} ${cy} A235 235 0 0 1 ${cx + 235} ${cy}`} fill="none" stroke={brand.lime} strokeWidth={18} strokeLinecap="round" strokeDasharray={740} strokeDashoffset={740 * (1 - (ang + 90) / 180)} style={{ filter: `drop-shadow(0 0 10px ${brand.lime})` }} />
            {ticks.map((k) => (
              <line key={k.i} x1={k.x1} y1={k.y1} x2={k.x2} y2={k.y2} stroke={brand.ink} strokeWidth={k.i % 5 ? 3 : 5} opacity={0.6} strokeLinecap="round" />
            ))}
          </>
        }
        over={
          <>
            <line x1={cx} y1={cy} x2={cx + Math.cos(rad) * 125} y2={cy + Math.sin(rad) * 125} stroke={brand.orange} strokeWidth={10} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${brand.orange})` }} />
            <circle cx={cx} cy={cy} r={22} fill={brand.ink} />
          </>
        }
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 95, textAlign: "center", fontFamily: brandFont, fontWeight: 800, fontSize: 90, color: brand.ink, letterSpacing: -4 }}>TRI</div>
      <Sparks w={W} h={H} color={brand.lime} n={6} />
    </div>
  );
};

/** Glass answer sheet whose bubbles fill in, row by row. */
const AnswerSheet: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 520;
  const H = 560;
  const ans = [2, 0, 3, 1, 4, 2];
  return (
    <div style={{ position: "relative", rotate: "-4deg" }}>
      <GlassObject
        w={W}
        h={H}
        d={`M40 0 H${W - 40} Q${W} 0 ${W} 40 V${H - 40} Q${W} ${H} ${W - 40} ${H} H40 Q0 ${H} 0 ${H - 40} V40 Q0 0 40 0 Z`}
        colors={[brand.lime, brand.blue, brand.orange]}
        inner={
          <>
            {["A", "B", "C", "D", "E"].map((l, j) => (
              <text key={l} x={120 + j * 75} y={70} textAnchor="middle" fill={brand.muted} fontFamily={brandFont} fontWeight={700} fontSize={30}>{l}</text>
            ))}
            {ans.map((a, r) =>
              [0, 1, 2, 3, 4].map((j) => {
                const on = j === a && frame > 10 + r * 9;
                return (
                  <circle key={`${r}${j}`} cx={120 + j * 75} cy={130 + r * 72} r={24} fill={on ? brand.lime : "none"} stroke={on ? brand.lime : "#ffffff55"} strokeWidth={3} style={on ? { filter: `drop-shadow(0 0 8px ${brand.lime})` } : undefined} />
                );
              }),
            )}
            {ans.map((_, r) => (
              <text key={r} x={50} y={140 + r * 72} textAnchor="middle" fill={brand.muted} fontFamily={brandFont} fontWeight={600} fontSize={26}>{r + 1}</text>
            ))}
          </>
        }
      />
      <Sparks w={W} h={H} color={brand.lime} n={6} />
    </div>
  );
};

export const Scene2TRI: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const strike = interpolate(frame, [cue("quantas"), cue("quantas") + 8], [0, 1], clamp);
  return (
    <BrandScene label="O que é" icon="chart" accent="lime" title="TRI">
      <Hero top={500}>
        <Gauge />
      </Hero>
      <Reveal at={cue("Teoria")} style={{ left: 0, right: 0, top: 960, textAlign: "center", fontFamily: brandFont, fontWeight: 700, fontSize: 38, color: brand.ink }}>
        Teoria de Resposta ao Item
      </Reveal>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1030, display: "flex", justifyContent: "center", gap: 24 }}>
        <Reveal at={cue("quantas")} style={{ position: "relative" }}>
          <div style={{ position: "relative" }}>
            <Pill accent="orange" size={34}>quantas</Pill>
            <div style={{ position: "absolute", left: 10, right: 10, top: "50%", height: 6, background: brand.orange, scale: `${strike} 1`, transformOrigin: "0 50%" }} />
          </div>
        </Reveal>
        <Reveal at={cue("quais")} from="scale" style={{ position: "relative" }}>
          <Pill accent="lime" solid size={34}>quais ✓</Pill>
        </Reveal>
      </div>
      <BrandPrompt at={6}>+ SEGUE: dica do Enem todo dia</BrandPrompt>
    </BrandScene>
  );
};

const Row: React.FC<{ label: string; pattern: boolean[]; tag: string; accent: "lime" | "orange"; at: number; tagAt: number; top: number }> = ({ label, pattern, tag, accent, at: start, tagAt, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - tagAt, fps, config: { damping: 11, stiffness: 180 } });
  return (
    <div style={{ position: "absolute", left: 75, top, width: 930, fontFamily: brandFont }}>
      <div style={{ fontWeight: 700, fontSize: 30, color: brand.muted }}>{label}</div>
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        {pattern.map((ok, i) => {
          const on = frame >= start + i * 3;
          const c = ok ? brand.lime : brand.orange;
          return (
            <div key={i} style={{ width: 84, height: 84, borderRadius: 18, background: on ? `${c}26` : "rgba(255,255,255,0.04)", border: `3px solid ${on ? c : "rgba(255,255,255,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 40, color: c }}>
              {on ? (ok ? "✓" : "✗") : ""}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, opacity: interpolate(t, [0, 0.3], [0, 1], clamp), scale: interpolate(t, [0, 1], [0.6, 1]), transformOrigin: "0 50%" }}>
        <Pill accent={accent} solid size={32}>{tag}</Pill>
      </div>
    </div>
  );
};

export const Scene3Coerencia: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <BrandScene label="Como a nota é calculada" icon="chart" accent="orange" title="Coerência">
      <Reveal at={cue("dificuldade")} style={{ left: 75, top: 500, width: 930 }}>
        <div style={{ height: 14, borderRadius: 7, background: `linear-gradient(90deg, ${brand.lime}, ${brand.orange})` }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: brandFont, fontWeight: 700, fontSize: 28, marginTop: 8 }}>
          <span style={{ color: brand.lime }}>fácil</span>
          <span style={{ color: brand.orange }}>difícil</span>
        </div>
      </Reveal>
      <Row label="7 acertos · errou fáceis, acertou difíceis" pattern={[false, false, false, true, true, true, true, true, true, true]} tag="CHUTE? NOTA SOBE MENOS" accent="orange" at={cue("erra")} tagAt={cue("chute")} top={620} />
      <Row label="7 acertos · acertou fáceis, errou difíceis" pattern={[true, true, true, true, true, true, true, false, false, false]} tag="COERENTE: GANHA MAIS" accent="lime" at={cue("acerta", at("Já", from))} tagAt={cue("coerência")} top={890} />
    </BrandScene>
  );
};

const Tip: React.FC<{ at: number; text: React.ReactNode; top: number }> = ({ at: start, text, top }) => (
  <Reveal at={start} from="left" style={{ left: 75, top, width: 930 }}>
    <GlassCard accent="lime" style={{ padding: "26px 30px", display: "flex", alignItems: "center", gap: 24, fontWeight: 700, fontSize: 44 }}>
      <div style={{ width: 72, height: 72, flexShrink: 0, borderRadius: 18, background: brand.lime, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="check" color={brand.bg} />
      </div>
      <div>{text}</div>
    </GlassCard>
  </Reveal>
);

export const Scene4Dicas: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <BrandScene label="No domingo" icon="check" accent="lime" title="3 dicas">
      <Tip at={cue("capricha")} top={520} text={<>Capricha nas <span style={{ color: brand.lime }}>fáceis</span></>} />
      <Tip at={cue("branco")} top={700} text={<>Nenhuma <span style={{ color: brand.lime }}>em branco</span></>} />
      <Tip at={cue("Errar")} top={880} text={<>Errar <span style={{ color: brand.lime }}>não tira ponto</span></>} />
      <BrandPrompt at={4} accent="orange">COMENTA: quantas acertou no 1º dia?</BrandPrompt>
    </BrandScene>
  );
};

export const Scene5Final: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <BrandScene label="Sua vez" icon="chat" accent="lime" title="Quantas acertou?">
      <Hero top={470}>
        <AnswerSheet />
      </Hero>
      <Reveal at={cue("Comenta")} from="scale" style={{ left: 0, right: 0, top: 1060, textAlign: "center" }}>
        <Pill accent="lime" solid size={40}>COMENTA SEU PLACAR</Pill>
      </Reveal>
    </BrandScene>
  );
};
