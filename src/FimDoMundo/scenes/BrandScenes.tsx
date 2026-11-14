import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BrandScene, Hero } from "../../brand/Scene";
import { BrandPrompt, GlassCard, Pill, Reveal } from "../../brand/Glass";
import { GlassObject, Sparks } from "../../brand/GlassObject";
import { brand, brandFont, clamp } from "../../brand/theme";
import { PROJ, RATE, REAL, formula, useCue } from "../data";

const rr = (w: number, h: number, r: number) => `M${r} 0 H${w - r} Q${w} 0 ${w} ${r} V${h - r} Q${w} ${h} ${w - r} ${h} H${r} Q0 ${h} 0 ${h - r} V${r} Q0 0 ${r} 0 Z`;

/** Glass desk calendar: SEX 13 NOV 2026. */
const Calendar: React.FC<{ cross: number }> = ({ cross }) => (
  <div style={{ position: "relative" }}>
    <GlassObject
      w={520}
      h={560}
      d={rr(520, 560, 60)}
      colors={[brand.orange, brand.orangeSoft, brand.blue]}
      inner={<rect x={0} y={0} width={520} height={130} fill={brand.orange} opacity={0.85} />}
      over={
        <>
          <rect x={120} y={-30} width={26} height={70} rx={13} fill="#9a96a8" />
          <rect x={374} y={-30} width={26} height={70} rx={13} fill="#9a96a8" />
          {cross > 0 ? (
            <>
              <path d={`M70 190 L${70 + 380 * Math.min(1, cross * 2)} ${190 + 300 * Math.min(1, cross * 2)}`} stroke={brand.lime} strokeWidth={22} strokeLinecap="round" />
              {cross > 0.5 ? <path d={`M450 190 L${450 - 380 * (cross - 0.5) * 2} ${190 + 300 * (cross - 0.5) * 2}`} stroke={brand.lime} strokeWidth={22} strokeLinecap="round" /> : null}
            </>
          ) : null}
        </>
      }
    >
      <div style={{ position: "absolute", top: 18, left: 0, right: 0, textAlign: "center", fontFamily: brandFont, fontWeight: 800, fontSize: 64, color: brand.bg, letterSpacing: 4 }}>NOV · 2026</div>
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontFamily: brandFont, fontWeight: 800, fontSize: 280, lineHeight: 1, color: brand.ink, letterSpacing: -10 }}>13</div>
      <div style={{ position: "absolute", top: 450, left: 0, right: 0, textAlign: "center", fontFamily: brandFont, fontWeight: 800, fontSize: 56, color: brand.orange, letterSpacing: 3 }}>SEXTA-FEIRA</div>
    </GlassObject>
    <Sparks w={520} h={560} color={brand.orange} n={6} />
  </div>
);

export const S1Hook: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tProf = cue("profeta.");
  const tEq = cue("equação.");
  return (
    <BrandScene instant label="Ontem · 13/11/2026" icon="calendar" accent="orange" title="O fim do mundo">
      <Hero top={500}>
        <Calendar cross={interpolate(frame, [tEq, tEq + 14], [0, 1], clamp)} />
      </Hero>
      <Reveal at={tProf} from="scale" style={{ left: 0, right: 0, top: 1110, textAlign: "center", opacity: frame >= tEq ? 0 : 1 }}>
        <Pill accent="orange" size={40}>não foi profeta…</Pill>
      </Reveal>
      <Reveal at={tEq} from="scale" style={{ left: 0, right: 0, top: 1110, textAlign: "center" }}>
        <Pill accent="lime" solid size={44}>foi uma EQUAÇÃO</Pill>
      </Reveal>
    </BrandScene>
  );
};

/* ---------- chart ---------- */
const CW = 940;
const CH = 600;
const X0 = 1900;
const X1 = 2100;
const xOf = (t: number, x0 = X0, x1 = X1) => 70 + ((t - x0) / (x1 - x0)) * (CW - 100);
const yOf = (v: number, max: number) => CH - 60 - (v / max) * (CH - 110);
const path = (pts: [number, number][], max: number, x0 = X0, x1 = X1) => pts.map(([t, v], i) => `${i ? "L" : "M"}${xOf(t, x0, x1).toFixed(1)} ${yOf(Math.min(v, max * 1.25), max).toFixed(1)}`).join(" ");

const Axes: React.FC<{ max: number; ticks: number[]; years: number[]; unit: string; x0?: number; x1?: number }> = ({ max, ticks, years, unit, x0 = X0, x1 = X1 }) => (
  <>
    {ticks.map((v) => (
      <g key={v}>
        <line x1={70} x2={CW - 30} y1={yOf(v, max)} y2={yOf(v, max)} stroke={brand.ink} opacity={0.12} strokeWidth={2} />
        <text x={58} y={yOf(v, max) + 10} textAnchor="end" fill={brand.ink} opacity={0.6} fontFamily={brandFont} fontSize={26} fontWeight={700}>
          {v}
          {unit}
        </text>
      </g>
    ))}
    {years.map((y) => (
      <text key={y} x={xOf(y, x0, x1)} y={CH - 18} textAnchor="middle" fill={brand.ink} opacity={0.6} fontFamily={brandFont} fontSize={26} fontWeight={700}>
        {y}
      </text>
    ))}
  </>
);

/** Clip-reveal of a path from left to right (k 0..1). */
const Draw: React.FC<{ k: number; id: string; children: React.ReactNode }> = ({ k, id, children }) => (
  <>
    <defs>
      <clipPath id={id}>
        <rect x={0} y={-200} width={70 + k * (CW - 70)} height={CH + 400} />
      </clipPath>
    </defs>
    <g clipPath={`url(#${id})`}>{children}</g>
  </>
);

const FORMULA_PTS: [number, number][] = [];
for (let t = 1900; t <= 2026.6; t += t < 2015 ? 2 : 0.25) FORMULA_PTS.push([t, formula(t)]);

const PopChart: React.FC<{ kFormula: number; kReal: number; kProj?: number; max?: number; fadeFormula?: number }> = ({ kFormula, kReal, kProj = 0, max = 12, fadeFormula = 1 }) => (
  <GlassCard style={{ width: CW, height: CH, padding: 0, overflow: "hidden" }}>
    <svg width={CW} height={CH} style={{ overflow: "visible" }}>
      <Axes max={max} ticks={[0, 4, 8, 12]} years={[1900, 1950, 2000, 2050, 2100]} unit=" bi" />
      <line x1={xOf(2026.87)} x2={xOf(2026.87)} y1={30} y2={CH - 60} stroke={brand.orange} strokeWidth={3} strokeDasharray="10 10" opacity={0.7 * kFormula} />
      <Draw k={kFormula} id="fF">
        <path d={path(FORMULA_PTS, max)} fill="none" stroke={brand.orange} strokeWidth={9} strokeLinecap="round" opacity={fadeFormula} />
      </Draw>
      <Draw k={kReal} id="fR">
        <path d={path(REAL, max)} fill="none" stroke={brand.lime} strokeWidth={9} strokeLinecap="round" />
        {REAL.map(([t, v]) => (
          <circle key={t} cx={xOf(t)} cy={yOf(v, max)} r={9} fill={brand.lime} />
        ))}
      </Draw>
      <Draw k={kProj} id="fP">
        <path d={path(PROJ, max)} fill="none" stroke={brand.blueSoft} strokeWidth={8} strokeDasharray="16 12" strokeLinecap="round" />
      </Draw>
    </svg>
  </GlassCard>
);

const Legend: React.FC<{ items: [string, string][] }> = ({ items }) => (
  <div style={{ display: "flex", gap: 34, justifyContent: "center", fontFamily: brandFont, fontWeight: 700, fontSize: 30, color: brand.ink }}>
    {items.map(([c, t]) => (
      <span key={t} style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 34, height: 10, borderRadius: 5, background: c }} />
        {t}
      </span>
    ))}
  </div>
);

export const S2Artigo: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tAcert = cue("acertava");
  const tQuanto = cue("quanto");
  const showChart = frame >= tAcert - 4;
  return (
    <BrandScene label="Revista Science · 1960" icon="star" accent="blue" title="A fórmula">
      <Reveal at={cue("Science")} from="scale" style={{ left: 90, right: 90, top: 470, opacity: interpolate(frame, [tAcert - 6, tAcert + 4], [1, 0], clamp) }}>
        <GlassCard accent="blue" style={{ padding: "34px 40px", textAlign: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 34, color: brand.blueSoft, letterSpacing: 6 }}>SCIENCE · 4 NOV 1960</div>
          <div style={{ fontWeight: 800, fontSize: 60, lineHeight: 1.1, marginTop: 18 }}>“Doomsday: Friday, 13 November, A.D. 2026”</div>
          <div style={{ fontWeight: 600, fontSize: 30, opacity: 0.7, marginTop: 18 }}>von Foerster, Mora & Amiot</div>
        </GlassCard>
      </Reveal>
      {showChart ? (
        <div style={{ position: "absolute", left: 70, top: 450, opacity: interpolate(frame, [tAcert - 4, tAcert + 6], [0, 1], clamp) }}>
          <PopChart kReal={interpolate(frame, [tAcert, tAcert + 40], [0, 0.42], clamp)} kFormula={interpolate(frame, [tAcert + 10, tAcert + 50], [0, 0.42], clamp)} />
          <div style={{ marginTop: 18 }}>
            <Legend items={[[brand.lime, "real"], [brand.orange, "fórmula"]]} />
          </div>
        </div>
      ) : null}
      <Reveal at={tQuanto} from="scale" style={{ left: 0, right: 0, top: 1150, textAlign: "center" }}>
        <Pill accent="lime" solid size={38}>+ gente → cresce + rápido</Pill>
      </Reveal>
    </BrandScene>
  );
};

/** N = 1,79·10¹¹ / (2026,87 − ano)^0,99 with a live year ticker. */
export const S3Zero: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tBox = cue("Embaixo");
  const tQuando = cue("Quando");
  const tZero = cue("zero.");
  const tInf = cue("infinito.");
  const year = interpolate(frame, [tQuando, tZero], [1960, 2026.87], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 2.4) });
  const den = 2026.87 - year;
  const N = frame >= tZero ? Infinity : formula(year);
  const shake = frame >= tInf ? Math.sin(frame * 2.3) * 6 : 0;
  const boxK = interpolate(frame, [tBox, tBox + 10], [0, 1], clamp);
  const fmt = (v: number) => (v === Infinity ? "∞" : v >= 1000 ? `${Math.round(v / 1000).toLocaleString("pt-BR")} trilhões` : `${v.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} bi`);
  return (
    <BrandScene label="O detalhe" icon="alert" accent="orange" title="Divisão por zero">
      <Hero top={480}>
        <GlassCard accent="orange" style={{ width: 920, padding: "40px 30px", textAlign: "center", translate: `${shake}px 0px` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 26, fontWeight: 800 }}>
            <span style={{ fontSize: 96 }}>N =</span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: 66, paddingBottom: 10 }}>1,79 × 10¹¹</span>
              <span style={{ width: "100%", height: 8, borderRadius: 4, background: brand.ink }} />
              <span
                style={{
                  fontSize: 66,
                  paddingTop: 10,
                  padding: "10px 18px 0",
                  borderRadius: 18,
                  marginTop: 8,
                  color: boxK > 0.5 ? brand.orange : brand.ink,
                  boxShadow: `0 0 0 ${6 * boxK}px ${brand.orange}`,
                }}
              >
                (2026,87 − ano)<sup style={{ fontSize: 34 }}>0,99</sup>
              </span>
            </div>
          </div>
        </GlassCard>
      </Hero>
      <Reveal at={tQuando} from="up" style={{ left: 90, right: 90, top: 850 }}>
        <div style={{ display: "flex", gap: 24 }}>
          {[
            ["ano", year.toLocaleString("pt-BR", { maximumFractionDigits: 2, minimumFractionDigits: 2 }), brand.ink],
            ["embaixo", den.toLocaleString("pt-BR", { maximumFractionDigits: 2, minimumFractionDigits: 2 }), frame >= tZero ? brand.orange : brand.ink],
            ["população", fmt(N), brand.orange],
          ].map(([l, v, c]) => (
            <GlassCard key={l} style={{ flex: 1, padding: "18px 10px", textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 28, opacity: 0.7 }}>{l}</div>
              <div style={{ fontWeight: 800, fontSize: l === "população" && N === Infinity ? 90 : 46, color: c, lineHeight: 1.2 }}>{v}</div>
            </GlassCard>
          ))}
        </div>
      </Reveal>
    </BrandScene>
  );
};

/** Formula vs reality for 2026. */
export const S4Real: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tF = cue("200 bilhões");
  const tR = cue("8,3 bilhões.");
  const H = 480;
  const fH = interpolate(frame, [tF, tF + 24], [0, H], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const rH = interpolate(frame, [tR, tR + 16], [0, Math.max(34, (8.3 / 206) * H)], clamp);
  const Bar: React.FC<{ h: number; color: string; label: string; value: string; show: boolean }> = ({ h, color, label, value, show }) => (
    <div style={{ width: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: H + 150 }}>
      <div style={{ fontWeight: 800, fontSize: 64, color, opacity: show ? 1 : 0, marginBottom: 10 }}>{value}</div>
      <div style={{ width: 240, height: h, borderRadius: 26, background: `linear-gradient(180deg, ${color}, ${color}55)`, boxShadow: `0 0 40px ${color}66` }} />
      <div style={{ fontWeight: 800, fontSize: 36, marginTop: 16, color: brand.ink }}>{label}</div>
    </div>
  );
  return (
    <BrandScene label="Em 2026" icon="chart" accent="lime" title="Fórmula × realidade">
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", gap: 80, fontFamily: brandFont }}>
        <Bar h={fH} color={brand.orange} label="a fórmula" value="200+ bi" show={frame >= tF} />
        <Bar h={rH} color={brand.lime} label="a vida real" value="8,3 bi" show={frame >= tR} />
      </div>
    </BrandScene>
  );
};

/** Growth-rate peak, then the UN projection flattening out. */
export const S5Pico: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tPico = cue("pico:");
  const tHoje = cue("Hoje");
  const tOnu = cue("ONU");
  const tProj = cue("10,3 bilhões.");
  const R0 = 1945;
  const R1 = 2030;
  const rateK = interpolate(frame, [cue("crescimento"), tPico + 8], [0, 0.22], clamp) + interpolate(frame, [tPico + 8, tHoje + 10], [0, 0.78], clamp);
  const showPop = frame >= tOnu - 4;
  const peakX = xOf(1963, R0, R1);
  const peakY = yOf(2.3, 2.6);
  return (
    <BrandScene label="O que deu errado" icon="chart" accent="lime" title={showPop ? "A previsão da ONU" : "O pico de 1963"}>
      {!showPop ? (
        <div style={{ position: "absolute", left: 70, top: 450 }}>
          <GlassCard style={{ width: CW, height: CH, padding: 0, overflow: "hidden" }}>
            <svg width={CW} height={CH} style={{ overflow: "visible" }}>
              <Axes max={2.6} ticks={[0, 1, 2]} years={[1950, 1970, 1990, 2010, 2026]} unit="%" x0={R0} x1={R1} />
              <Draw k={rateK} id="rate">
                <path d={path(RATE, 2.6, R0, R1)} fill="none" stroke={brand.lime} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
              </Draw>
              {frame >= tPico ? (
                <>
                  <circle cx={peakX} cy={peakY} r={18} fill={brand.orange} />
                  <text x={peakX + 30} y={peakY + 4} fill={brand.orange} fontFamily={brandFont} fontWeight={800} fontSize={40}>
                    2,3% · pico
                  </text>
                </>
              ) : null}
              {frame >= tHoje + 10 ? (
                <text x={xOf(2026, R0, R1) - 10} y={yOf(0.8, 2.6) - 30} textAnchor="end" fill={brand.lime} fontFamily={brandFont} fontWeight={800} fontSize={40}>
                  hoje 0,8%
                </text>
              ) : null}
            </svg>
          </GlassCard>
          <div style={{ marginTop: 18, textAlign: "center", fontWeight: 700, fontSize: 30, color: brand.ink, opacity: 0.75, fontFamily: brandFont }}>crescimento da população por ano</div>
        </div>
      ) : (
        <div style={{ position: "absolute", left: 70, top: 450, opacity: interpolate(frame, [tOnu - 4, tOnu + 6], [0, 1], clamp) }}>
          <PopChart kFormula={0.57} fadeFormula={0.55} kReal={0.66} kProj={interpolate(frame, [cue("crescer"), tProj], [0.62, 1], clamp)} />
          <div style={{ marginTop: 18 }}>
            <Legend items={[[brand.lime, "real"], [brand.blueSoft, "ONU"], [brand.orange, "fórmula"]]} />
          </div>
        </div>
      )}
      <Reveal at={cue("filhos.")} from="scale" style={{ left: 0, right: 0, top: 1170, textAlign: "center", opacity: showPop ? 0 : 1 }}>
        <Pill accent="lime" size={36}>famílias com menos filhos</Pill>
      </Reveal>
      <Reveal at={tProj} from="scale" style={{ left: 0, right: 0, top: 1170, textAlign: "center" }}>
        <Pill accent="blue" solid size={36}>pico: ~10,3 bi nos anos 2080</Pill>
      </Reveal>
    </BrandScene>
  );
};

export const S6Final: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const k = interpolate(frame, [4, 40], [0, 1], clamp);
  // logistic curve drawn inside a glass shape
  const pts = Array.from({ length: 60 }, (_, i) => {
    const x = i / 59;
    const y = 1 / (1 + Math.exp(-12 * (x - 0.45)));
    return `${i ? "L" : "M"}${(40 + x * 640).toFixed(1)} ${(380 - y * 300).toFixed(1)}`;
  }).join(" ");
  return (
    <BrandScene label="A lição" icon="check" accent="lime" title="Nada cresce pra sempre">
      <Hero top={480}>
        <div style={{ position: "relative" }}>
          <GlassObject
            w={720}
            h={440}
            d={rr(720, 440, 70)}
            colors={[brand.lime, brand.blue, brand.orangeSoft]}
            over={
              <>
                <defs>
                  <clipPath id="fimClip">
                    <rect x={0} y={0} width={40 + k * 660} height={440} />
                  </clipPath>
                </defs>
                <path d={pts} clipPath="url(#fimClip)" fill="none" stroke={brand.lime} strokeWidth={14} strokeLinecap="round" />
              </>
            }
          />
          <Sparks w={720} h={440} color={brand.lime} n={6} />
        </div>
      </Hero>
      <BrandPrompt at={cue("Você")} duration={120}>COMENTA: você já conhecia esse “fim do mundo”?</BrandPrompt>
    </BrandScene>
  );
};
