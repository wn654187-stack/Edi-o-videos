import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BrandScene, Hero } from "../../brand/Scene";
import { BrandPrompt, GlassCard, Pill, Reveal } from "../../brand/Glass";
import { GlassObject, Sparks } from "../../brand/GlassObject";
import { brand, brandFont, clamp } from "../../brand/theme";
import { useCue } from "../data";

const roundRect = (w: number, h: number, r: number) =>
  `M${r} 0 H${w - r} Q${w} 0 ${w} ${r} V${h - r} Q${w} ${h} ${w - r} ${h} H${r} Q0 ${h} 0 ${h - r} V${r} Q0 0 ${r} 0 Z`;

/** Glass calendar page: "30 NOV", with binder rings. */
const Calendar: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 460;
  const H = 480;
  return (
    <div style={{ position: "relative", rotate: `${-3 + Math.sin(frame / 25) * 1.5}deg` }}>
      <GlassObject
        w={W}
        h={H}
        d={roundRect(W, H, 44)}
        colors={[brand.lime, brand.orange, brand.blue]}
        inner={<rect x={0} y={0} width={W} height={120} fill={brand.orange} opacity={0.92} />}
        over={
          <>
            {[130, 330].map((x) => (
              <rect key={x} x={x - 14} y={-34} width={28} height={74} rx={14} fill={brand.ink} opacity={0.9} />
            ))}
          </>
        }
      >
        <div style={{ textAlign: "center", fontFamily: brandFont, marginTop: -10 }}>
          <div style={{ fontWeight: 800, fontSize: 52, color: brand.bg, letterSpacing: 4, marginTop: -12 }}>NOVEMBRO</div>
          <div style={{ fontWeight: 800, fontSize: 250, lineHeight: 1.05, letterSpacing: -10, color: brand.ink }}>30</div>
        </div>
      </GlassObject>
      <Sparks w={W} h={H} color={brand.lime} />
    </div>
  );
};

export const Scene1Hook: React.FC<{ from: number }> = () => (
  <BrandScene instant label="Seu bolso · prazo" icon="calendar" accent="lime" title="13º salário">
    <Hero top={470}>
      <Calendar />
    </Hero>
    <Reveal at={0} style={{ left: 0, right: 0, top: 1070, textAlign: "center" }}>
      <Pill accent="lime">1ª parcela: até 30/11</Pill>
    </Reveal>
  </BrandScene>
);

/** Glass banknote: shows the salary, then halves into the 1st instalment. */
export const Scene2Parcela1: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tSal = cue("R$ 3.000");
  const tHalf = cue("R$ 1.500");
  const half = frame >= tHalf;
  const k = interpolate(frame, [tHalf - 4, tHalf + 8], [0, 1], clamp);
  const W = 800;
  const H = 380;
  return (
    <BrandScene label="1ª parcela · até 30/11" icon="tag" accent="lime" title="Sem desconto">
      <Hero top={500}>
        <div style={{ position: "relative" }}>
          <GlassObject
            w={W}
            h={H}
            d={roundRect(W, H, 36)}
            colors={[brand.lime, brand.blue, brand.lime]}
            inner={
              <>
                <rect x={24} y={24} width={W - 48} height={H - 48} rx={22} fill="none" stroke="#ffffff33" strokeWidth={3} strokeDasharray="4 10" />
                <circle cx={W - 120} cy={H / 2} r={80} fill="none" stroke="#ffffff22" strokeWidth={10} />
              </>
            }
          >
            <div style={{ textAlign: "center", fontFamily: brandFont }}>
              <div style={{ fontWeight: 700, fontSize: 40, color: brand.ink, opacity: 0.85 }}>{half ? "você recebe" : frame >= tSal ? "salário" : "1ª parcela"}</div>
              <div style={{ fontWeight: 800, fontSize: 150, lineHeight: 1.05, letterSpacing: -5, color: half ? brand.lime : brand.ink, scale: half ? interpolate(k, [0, 1], [0.8, 1]) : 1 }}>
                {half ? "R$ 1.500" : frame >= tSal ? "R$ 3.000" : "½"}
              </div>
            </div>
          </GlassObject>
          <Sparks w={W} h={H} color={brand.lime} n={6} />
        </div>
      </Hero>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", gap: 22 }}>
        <Reveal at={cue("metade")} from="scale" style={{ position: "relative" }}>
          <Pill accent="blue" size={36}>÷ 2</Pill>
        </Reveal>
        <Reveal at={cue("desconto")} from="scale" style={{ position: "relative" }}>
          <Pill accent="lime" solid size={36}>SEM DESCONTO</Pill>
        </Reveal>
      </div>
      <BrandPrompt at={6}>+ SEGUE: seu dinheiro explicado</BrandPrompt>
    </BrandScene>
  );
};

const Bar: React.FC<{ label: string; top: number; at: number; cuts?: { at: number; w: number; text: string }[] }> = ({ label, top, at: start, cuts = [] }) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [start, start + 14], [0, 1], clamp);
  const W = 930;
  let right = 0;
  return (
    <Reveal at={start} style={{ left: 75, top, width: W }}>
      <div style={{ fontFamily: brandFont, fontWeight: 700, fontSize: 36, color: brand.ink, marginBottom: 12 }}>{label}</div>
      <GlassCard style={{ position: "relative", height: 110, padding: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${grow * 100}%`, background: `linear-gradient(90deg, ${brand.lime}cc, ${brand.lime})`, boxShadow: `0 0 30px ${brand.lime}66` }} />
        {cuts.map((c) => {
          const kk = interpolate(frame, [c.at, c.at + 10], [0, 1], clamp);
          right += c.w;
          return (
            <div key={c.text} style={{ position: "absolute", top: 0, bottom: 0, right: `${(right - c.w) * 100}%`, width: `${c.w * 100 * kk}%`, background: brand.orange, borderLeft: `3px solid ${brand.bg}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: brandFont, fontWeight: 800, fontSize: 30, color: brand.bg, overflow: "hidden" }}>
              {kk > 0.6 ? c.text : ""}
            </div>
          );
        })}
      </GlassCard>
    </Reveal>
  );
};

export const Scene3Parcela2: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <BrandScene label="2ª parcela · até 20/12" icon="calendar" accent="orange" title="Com desconto">
      <Bar label="1ª parcela · 30/11" top={500} at={2} />
      <Bar label="2ª parcela · 20/12" top={720} at={cue("20/12")} cuts={[{ at: cue("INSS"), w: 0.16, text: "INSS" }, { at: cue("Imposto"), w: 0.12, text: "IR" }]} />
      <Reveal at={cue("menor")} from="scale" style={{ left: 0, right: 0, top: 980, textAlign: "center" }}>
        <Pill accent="orange" solid size={38}>por isso vem menor</Pill>
      </Reveal>
      <div style={{ position: "absolute", right: 80, top: 1050, fontFamily: brandFont, fontWeight: 600, fontSize: 24, color: brand.muted }}>proporções ilustrativas</div>
    </BrandScene>
  );
};

const MONTHS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

export const Scene4Proporcional: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tFill = cue("1/12");
  const t15 = cue("15");
  const t6 = cue("6");
  const lit = (i: number) => (frame >= t6 ? i < 6 : frame >= tFill + i * 3);
  return (
    <BrandScene label="Não trabalhou o ano todo?" icon="chart" accent="blue" title="1/12 por mês">
      <div style={{ position: "absolute", left: 75, top: 490, width: 930, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
        {MONTHS.map((m, i) => (
          <div
            key={m}
            style={{
              height: 118,
              borderRadius: 26,
              border: `2px solid ${lit(i) ? brand.lime : "rgba(255,255,255,0.14)"}`,
              background: lit(i) ? `linear-gradient(160deg, ${brand.lime}55, ${brand.lime}18)` : "linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
              boxShadow: lit(i) ? `0 0 26px ${brand.lime}44` : undefined,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: brandFont,
              fontWeight: 800,
              fontSize: 40,
              color: lit(i) ? brand.ink : brand.muted,
            }}
          >
            {m}
          </div>
        ))}
      </div>
      <Reveal at={t15} from="scale" style={{ left: 0, right: 0, top: 940, textAlign: "center", opacity: frame >= t6 ? 0 : 1 }}>
        <Pill accent="blue" size={38}>15 dias ou mais = 1 mês</Pill>
      </Reveal>
      <Reveal at={t6} from="scale" style={{ left: 0, right: 0, top: 940, textAlign: "center" }}>
        <Pill accent="lime" solid size={38}>6 meses = metade do 13º</Pill>
      </Reveal>
    </BrandScene>
  );
};

/** Glass warning sign that stamps "MULTA". */
const Warning: React.FC<{ stamp: number }> = ({ stamp }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [stamp - 2, stamp + 6], [0, 1], clamp);
  const W = 420;
  const H = 370;
  return (
    <div style={{ position: "relative" }}>
      <GlassObject w={W} h={H} d={`M${W / 2} 10 Q${W / 2 + 16} 10 ${W / 2 + 26} 28 L${W - 8} ${H - 34} Q${W} ${H - 6} ${W - 34} ${H - 6} H34 Q0 ${H - 6} 8 ${H - 34} L${W / 2 - 26} 28 Q${W / 2 - 16} 10 ${W / 2} 10 Z`} colors={[brand.orange, brand.orangeSoft, brand.blue]}>
        <div style={{ fontFamily: brandFont, fontWeight: 800, fontSize: 170, color: brand.ink, marginTop: 70 }}>!</div>
      </GlassObject>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", opacity: k, scale: interpolate(k, [0, 1], [1.6, 1]), rotate: "-8deg" }}>
        <span style={{ display: "inline-block", border: `7px solid ${brand.orange}`, borderRadius: 20, padding: "0 30px", fontFamily: brandFont, fontWeight: 800, fontSize: 80, color: brand.orange, background: "rgba(7,7,11,0.85)", boxShadow: `0 0 30px ${brand.orange}66` }}>
          MULTA
        </span>
      </div>
    </div>
  );
};

export const Scene5Direitos: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <BrandScene label="Seus direitos" icon="shield" accent="orange" title="E se não pagar?">
      <Reveal at={cue("demitido")} from="left" style={{ left: 75, top: 500, width: 930 }}>
        <GlassCard accent="lime" style={{ padding: "22px 30px", fontWeight: 700, fontSize: 38 }}>
          Demitido sem justa causa? <span style={{ color: brand.lime }}>Recebe o proporcional</span>
        </GlassCard>
      </Reveal>
      <Reveal at={cue("empresa")} from="scale" style={{ left: 330, top: 670 }}>
        <Warning stamp={cue("multada")} />
      </Reveal>
      <Reveal at={cue("Denuncia")} from="scale" style={{ left: 0, right: 0, top: 1070, textAlign: "center" }}>
        <Pill accent="lime" solid size={34}>Denuncie no Ministério do Trabalho</Pill>
      </Reveal>
    </BrandScene>
  );
};

/** Glass piggy bank with a "13º" coin dropping into the slot. */
const Piggy: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 560;
  const H = 400;
  const drop = (frame % 50) / 50;
  const coinY = interpolate(drop, [0, 0.7, 1], [-10, 70, 70]);
  const coinO = interpolate(drop, [0, 0.1, 0.65, 0.75], [0, 1, 1, 0]);
  return (
    <div style={{ position: "relative", width: W + 80, height: H + 80 }}>
      <div style={{ position: "absolute", left: 300, top: coinY, opacity: coinO, width: 90, height: 90, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #f6ffb0, ${brand.lime})`, boxShadow: `0 0 26px ${brand.lime}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: brandFont, fontWeight: 800, fontSize: 32, color: brand.bg }}>
        13º
      </div>
      <GlassObject
        w={W}
        h={H}
        style={{ position: "absolute", left: 40, top: 70 }}
        d={`M70 200 C70 90 180 40 290 40 C400 40 500 90 520 170 L555 175 Q565 200 555 230 L515 240 C500 300 450 340 420 350 L420 395 L370 395 L360 360 L210 360 L200 395 L150 395 L150 345 C100 315 70 260 70 200 Z`}
        colors={[brand.lime, brand.orangeSoft, brand.blue]}
        over={
          <>
            <rect x={250} y={58} width={110} height={14} rx={7} fill={brand.bg} stroke="#ffffff55" strokeWidth={2} />
            <circle cx={430} cy={150} r={11} fill={brand.ink} />
            <path d="M200 70 L230 10 L260 62" fill="none" stroke="#ffffff66" strokeWidth={4} strokeLinejoin="round" />
          </>
        }
      />
      <Sparks w={W + 80} h={H + 80} color={brand.lime} n={6} />
    </div>
  );
};

export const Scene6Final: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <BrandScene label="Sua vez" icon="chat" accent="lime" title="E o seu 13º?">
      <Hero top={470}>
        <Piggy />
      </Hero>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", gap: 18 }}>
        {["pagar contas", "guardar", "gastar"].map((t, i) => (
          <Reveal key={t} at={4 + i * 5} from="scale" style={{ position: "relative" }}>
            <Pill accent={i === 1 ? "lime" : i === 0 ? "blue" : "orange"} size={34}>
              {t}
            </Pill>
          </Reveal>
        ))}
      </div>
      <Reveal at={cue("fazer")} from="scale" style={{ left: 0, right: 0, top: 1070, textAlign: "center" }}>
        <Pill accent="lime" solid size={38}>COMENTA AÍ 👇</Pill>
      </Reveal>
    </BrandScene>
  );
};
