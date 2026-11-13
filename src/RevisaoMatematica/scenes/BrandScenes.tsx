import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandScene, Hero } from "../../brand/Scene";
import { BrandPrompt, GlassCard, Pill, Reveal } from "../../brand/Glass";
import { GlassObject, Sparks } from "../../brand/GlassObject";
import { brand, brandFont, clamp } from "../../brand/theme";
import { useCue } from "../data";

const rr = (w: number, h: number, r: number) => `M${r} 0 H${w - r} Q${w} 0 ${w} ${r} V${h - r} Q${w} ${h} ${w - r} ${h} H${r} Q0 ${h} 0 ${h - r} V${r} Q0 0 ${r} 0 Z`;
const TOPICS = ["Porcentagem", "Escala", "Estatística", "Geometria", "Probabilidade"];

/** Glass stopwatch whose ring empties over the video. */
const Stopwatch: React.FC<{ size?: number }> = ({ size = 330 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const R = size / 2;
  const p = 1 - frame / durationInFrames;
  const C = 2 * Math.PI * (R - 26);
  return (
    <div style={{ position: "relative", width: size, height: size + 40 }}>
      <div style={{ position: "absolute", left: R - 30, top: 0, width: 60, height: 40, borderRadius: 12, background: brand.ink, opacity: 0.85 }} />
      <GlassObject
        w={size}
        h={size}
        style={{ position: "absolute", top: 36 }}
        d={`M${R} 0 A${R} ${R} 0 1 1 ${R - 0.1} 0 Z`}
        colors={[brand.lime, brand.blue, brand.orange]}
        over={
          <>
            <circle cx={R} cy={R} r={R - 26} fill="none" stroke="#ffffff22" strokeWidth={16} />
            <circle cx={R} cy={R} r={R - 26} fill="none" stroke={brand.lime} strokeWidth={16} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} transform={`rotate(-90 ${R} ${R})`} style={{ filter: `drop-shadow(0 0 10px ${brand.lime})` }} />
          </>
        }
      >
        <div style={{ fontFamily: brandFont, fontWeight: 800, fontSize: size * 0.27, color: brand.ink, letterSpacing: -3 }}>1 min</div>
      </GlassObject>
      <Sparks w={size} h={size + 40} color={brand.lime} n={6} />
    </div>
  );
};

export const S1Hook: React.FC<{ from: number }> = () => (
  <BrandScene instant label="Enem · domingo 15/11" icon="calendar" accent="lime" title="5 assuntos · 1 minuto">
    <Hero top={450}>
      <Stopwatch size={320} />
    </Hero>
    <div style={{ position: "absolute", left: 75, right: 75, top: 840, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
      {TOPICS.map((t, i) => (
        <Pill key={t} accent={i % 2 ? "blue" : "lime"} size={34}>
          {i + 1} · {t}
        </Pill>
      ))}
    </div>
  </BrandScene>
);

const Box: React.FC<{ v: string; accent?: string; k?: number }> = ({ v, accent = brand.ink, k = 1 }) => (
  <GlassCard style={{ padding: "18px 22px", fontWeight: 800, fontSize: 52, color: accent, minWidth: 220, textAlign: "center", opacity: k }}>{v}</GlassCard>
);

export const S2Porcentagem: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  const tUp = cue("Aumentar");
  const tDown = cue("Descontar");
  const tEx = cue("100", from);
  return (
    <BrandScene label="1 · Porcentagem" icon="tag" accent="lime" title="×1,2 e ×0,8">
      <Hero top={450}>
        <GlassObject w={300} h={300} d={rr(300, 300, 70)} colors={[brand.lime, brand.blue, brand.lime]}>
          <div style={{ fontFamily: brandFont, fontWeight: 800, fontSize: 200, color: brand.ink, lineHeight: 1 }}>%</div>
        </GlassObject>
      </Hero>
      <Reveal at={tUp} from="left" style={{ left: 75, top: 800, width: 930 }}>
        <GlassCard accent="lime" style={{ padding: "16px 26px", fontWeight: 700, fontSize: 40 }}>
          +20% <span style={{ color: brand.muted }}>→</span> <span style={{ color: brand.lime }}>× 1,2</span>
        </GlassCard>
      </Reveal>
      <Reveal at={tDown} from="left" style={{ left: 75, top: 910, width: 930 }}>
        <GlassCard accent="orange" style={{ padding: "16px 26px", fontWeight: 700, fontSize: 40 }}>
          −20% <span style={{ color: brand.muted }}>→</span> <span style={{ color: brand.orange }}>× 0,8</span>
        </GlassCard>
      </Reveal>
      <Reveal at={tEx} from="scale" style={{ left: 0, right: 0, top: 1040, textAlign: "center" }}>
        <Pill accent="orange" solid size={38}>R$ 100 → R$ 120 → R$ 96 (não volta!)</Pill>
      </Reveal>
    </BrandScene>
  );
};

/** Glass ruler with the first centimetre lit. */
const Ruler: React.FC<{ lit: number }> = ({ lit }) => (
  <GlassObject
    w={900}
    h={160}
    d={rr(900, 160, 26)}
    colors={[brand.blue, brand.blueSoft, brand.lime]}
    inner={
      <>
        <rect x={40} y={20} width={160 * lit} height={120} rx={10} fill={brand.lime} opacity={0.45} />
        {Array.from({ length: 51 }).map((_, i) => (
          <rect key={i} x={40 + i * 16} y={20} width={3} height={i % 10 === 0 ? 70 : i % 5 === 0 ? 50 : 32} fill={brand.ink} opacity={0.7} />
        ))}
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <text key={n} x={40 + n * 160} y={130} textAnchor="middle" fill={brand.ink} fontFamily={brandFont} fontWeight={700} fontSize={28}>
            {n}
          </text>
        ))}
      </>
    }
  />
);

export const S3Escala: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tCm = cue("cm");
  const tKm = cue("km");
  return (
    <BrandScene label="2 · Escala" icon="pin" accent="blue" title="1 : 100.000">
      <Reveal at={2} from="scale" style={{ left: 90, top: 520 }}>
        <Ruler lit={interpolate(frame, [tCm, tCm + 15], [0, 1], clamp)} />
      </Reveal>
      <Reveal at={tCm} from="scale" style={{ left: 120, top: 760 }}>
        <Box v="1 cm" accent={brand.lime} />
      </Reveal>
      <Reveal at={tCm + 6} style={{ left: 470, top: 775, fontFamily: brandFont, fontWeight: 800, fontSize: 70, color: brand.ink }}>
        =
      </Reveal>
      <Reveal at={tKm} from="scale" style={{ left: 600, top: 760 }}>
        <Box v="1 km" accent={brand.blueSoft} />
      </Reveal>
      <BrandPrompt at={tKm + 20} duration={80}>+ SEGUE: revisão do Enem até domingo</BrandPrompt>
    </BrandScene>
  );
};

export const S4Estatistica: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tNotas = cue("Notas");
  const tMedia = cue("Média");
  const tMediana = cue("Mediana");
  const tModa = cue("Moda");
  const vals = [3, 5, 5, 7, 10];
  const lit = (i: number) => (frame >= tModa ? i === 1 || i === 2 : frame >= tMediana ? i === 2 : false);
  return (
    <BrandScene label="3 · Estatística" icon="chart" accent="orange" title="3 medidas">
      <div style={{ position: "absolute", left: 75, right: 75, top: 500, display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: 330 }}>
        {vals.map((v, i) => (
          <Reveal key={i} at={tNotas + i * 4} from="scale" style={{ position: "relative" }}>
            <GlassObject w={160} h={60 + v * 24} d={rr(160, 60 + v * 24, 24)} colors={lit(i) ? [brand.orange, brand.orangeSoft, brand.orange] : [brand.blue, brand.blueSoft, brand.blue]}>
              <div style={{ fontFamily: brandFont, fontWeight: 800, fontSize: 64, color: brand.ink }}>{v}</div>
            </GlassObject>
          </Reveal>
        ))}
      </div>
      <div style={{ position: "absolute", left: 75, right: 75, top: 880, display: "flex", flexDirection: "column", gap: 14 }}>
        <Reveal at={tMedia} from="left" style={{ position: "relative" }}>
          <GlassCard style={{ padding: "12px 24px", fontWeight: 700, fontSize: 36 }}>
            <span style={{ color: brand.lime }}>Média 6</span> · 30 ÷ 5
          </GlassCard>
        </Reveal>
        <Reveal at={tMediana} from="left" style={{ position: "relative" }}>
          <GlassCard style={{ padding: "12px 24px", fontWeight: 700, fontSize: 36 }}>
            <span style={{ color: brand.orange }}>Mediana 5</span> · o do meio (em ordem)
          </GlassCard>
        </Reveal>
        <Reveal at={tModa} from="left" style={{ position: "relative" }}>
          <GlassCard style={{ padding: "12px 24px", fontWeight: 700, fontSize: 36 }}>
            <span style={{ color: brand.blueSoft }}>Moda 5</span> · o que mais repete
          </GlassCard>
        </Reveal>
      </div>
    </BrandScene>
  );
};

export const S5Geometria: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  const tVol = cue("Volume");
  return (
    <BrandScene label="4 · Geometria" icon="star" accent="lime" title="V = área da base × h">
      <div style={{ position: "absolute", left: 0, right: 0, top: 480, display: "flex", justifyContent: "center", gap: 70, alignItems: "flex-end" }}>
        <Reveal at={2} from="scale" style={{ position: "relative" }}>
          <GlassObject
            w={300}
            h={400}
            d="M0 50 A150 50 0 0 1 300 50 V350 A150 50 0 0 1 0 350 Z"
            colors={[brand.lime, brand.blue, brand.lime]}
            over={<ellipse cx={150} cy={50} rx={150} ry={50} fill="none" stroke="#ffffff66" strokeWidth={3} />}
          />
        </Reveal>
        <Reveal at={8} from="scale" style={{ position: "relative" }}>
          <GlassObject
            w={300}
            h={400}
            d="M60 0 H300 V340 L240 400 H0 V60 Z"
            colors={[brand.blue, brand.blueSoft, brand.orange]}
            over={<path d="M0 60 H240 V400 M240 60 L300 0" fill="none" stroke="#ffffff55" strokeWidth={3} />}
          />
        </Reveal>
      </div>
      <Reveal at={tVol} from="scale" style={{ left: 0, right: 0, top: 960, textAlign: "center" }}>
        <Pill accent="lime" solid size={40}>Volume = área da base × altura</Pill>
      </Reveal>
    </BrandScene>
  );
};

const Die: React.FC = () => {
  const frame = useCurrentFrame();
  const pips = [
    [80, 70],
    [80, 150],
    [80, 230],
    [220, 70],
    [220, 150],
    [220, 230],
  ];
  return (
    <div style={{ rotate: `${Math.sin(frame / 14) * 6}deg` }}>
      <GlassObject
        w={300}
        h={300}
        d={rr(300, 300, 60)}
        colors={[brand.blue, brand.blueSoft, brand.lime]}
        over={
          <>
            {pips.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={26} fill={brand.ink} />
            ))}
          </>
        }
      />
    </div>
  );
};

export const S6Probabilidade: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  const tQuer = cue("quer");
  const tDado = cue("dado:");
  const tE = cue("lembra:");
  const tOu = cue("ou", from + 1);
  return (
    <BrandScene label="5 · Probabilidade" icon="question" accent="blue" title="o que quero ÷ total">
      <Hero top={460}>
        <Die />
      </Hero>
      <Reveal at={tQuer} from="scale" style={{ left: 0, right: 0, top: 800, textAlign: "center" }}>
        <GlassCard accent="blue" style={{ display: "inline-block", padding: "14px 30px", fontWeight: 800, fontSize: 44 }}>
          P = <span style={{ color: brand.lime }}>o que você quer</span> ÷ total
        </GlassCard>
      </Reveal>
      <Reveal at={tDado} from="scale" style={{ left: 0, right: 0, top: 920, textAlign: "center" }}>
        <Pill accent="lime" solid size={38}>tirar 6 no dado = 1/6</Pill>
      </Reveal>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1030, display: "flex", justifyContent: "center", gap: 20 }}>
        <Reveal at={tE} from="scale" style={{ position: "relative" }}>
          <Pill accent="orange" size={38}>&quot;E&quot; → ×</Pill>
        </Reveal>
        <Reveal at={tOu} from="scale" style={{ position: "relative" }}>
          <Pill accent="blue" size={38}>&quot;OU&quot; → +</Pill>
        </Reveal>
      </div>
    </BrandScene>
  );
};

export const S7Final: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  const tCom = cue("Comenta");
  return (
    <BrandScene label="Sua vez" icon="chat" accent="lime" title="Qual você mais erra?">
      <div style={{ position: "absolute", left: 75, right: 75, top: 480, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 22 }}>
        {TOPICS.map((t, i) => (
          <Reveal key={t} at={2 + i * 4} from="scale" style={{ position: "relative" }}>
            <GlassObject w={290} h={150} d={rr(290, 150, 34)} colors={i % 2 ? [brand.blue, brand.blueSoft, brand.blue] : [brand.lime, brand.blue, brand.lime]}>
              <div style={{ textAlign: "center", fontFamily: brandFont, color: brand.ink }}>
                <div style={{ fontWeight: 800, fontSize: 54, lineHeight: 1 }}>{i + 1}</div>
                <div style={{ fontWeight: 700, fontSize: 28 }}>{t}</div>
              </div>
            </GlassObject>
          </Reveal>
        ))}
      </div>
      <Reveal at={tCom} from="scale" style={{ left: 0, right: 0, top: 1000, textAlign: "center" }}>
        <Pill accent="lime" solid size={38}>COMENTA O NÚMERO 👇</Pill>
      </Reveal>
      <Reveal at={tCom + 15} from="scale" style={{ left: 0, right: 0, top: 1100, textAlign: "center" }}>
        <Pill accent="orange" size={34}>manda pro grupo de estudos</Pill>
      </Reveal>
    </BrandScene>
  );
};
