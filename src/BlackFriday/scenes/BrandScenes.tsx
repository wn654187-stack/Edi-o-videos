import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BrandScene, Hero } from "../../brand/Scene";
import { BrandPrompt, GlassCard, Pill, Reveal } from "../../brand/Glass";
import { GlassObject, Sparks } from "../../brand/GlassObject";
import { Icon } from "../../brand/Icons";
import { brand, brandFont, clamp } from "../../brand/theme";
import { at, useCue } from "../data";

/** Hook: fully visible on frame 0, price tag stamped "FALSO?". */
export const Scene1Hook: React.FC<{ from: number }> = () => {
  const frame = useCurrentFrame();
  const wobble = 1 + 0.05 * Math.sin(frame / 3);
  return (
    <BrandScene instant label="Black Friday · 27/11" icon="tag" accent="orange" title="Desconto falso?">
      <div style={{ position: "absolute", left: 110, top: 500, rotate: "-4deg" }}>
        <GlassObject
          w={860}
          h={400}
          d="M170 10 H820 Q850 10 850 40 V360 Q850 390 820 390 H170 L20 200 Z"
          colors={[brand.lime, brand.orange, brand.blue]}
          inner={<circle cx={120} cy={200} r={26} fill={brand.bg} stroke="#ffffff66" strokeWidth={3} />}
        >
          <div style={{ marginLeft: 130, textAlign: "center", fontFamily: brandFont }}>
            <div style={{ fontWeight: 600, fontSize: 46, color: brand.muted, textDecoration: "line-through" }}>De R$ 1.000</div>
            <div style={{ fontWeight: 800, fontSize: 160, lineHeight: 1, letterSpacing: -6, color: brand.ink }}>R$ 500</div>
          </div>
        </GlassObject>
        <div style={{ position: "absolute", left: 640, top: -30 }}>
          <Pill accent="lime" solid size={50}>−50%</Pill>
        </div>
        <Sparks w={860} h={400} color={brand.lime} n={6} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", scale: wobble, rotate: "-8deg" }}>
        <span style={{ display: "inline-block", border: `8px solid ${brand.orange}`, borderRadius: 26, padding: "2px 40px", fontFamily: brandFont, fontWeight: 800, fontSize: 130, color: brand.orange, background: "rgba(7,7,11,0.85)", boxShadow: `0 0 40px ${brand.orange}66` }}>
          FALSO?
        </span>
      </div>
    </BrandScene>
  );
};

/** Golpe 1: price doubles weeks before, then "-50%". */
export const Scene2Dobro: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const up = cue("sobe");
  const down = cue("anuncia");
  const W = 880;
  const H = 300;
  const pts = [[0, 500], [0.45, 500], [0.55, 1000], [0.85, 1000], [0.93, 500], [1, 500]] as const;
  const progress = interpolate(frame, [up - 20, up + 10, down, down + 20], [0.2, 0.7, 0.88, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const y = (v: number) => H - ((v - 300) / 800) * H;
  const path = pts.map(([x, v], i) => `${i ? "L" : "M"}${x * W} ${y(v)}`).join(" ");
  return (
    <BrandScene label="Golpe nº 1" icon="chart" accent="orange" title="Metade do dobro">
      <div style={{ position: "absolute", left: 75, top: 500, width: 930 }}>
        <GlassCard style={{ padding: "40px 25px 20px" }}>
          <svg width={W} height={H + 50} style={{ overflow: "visible" }}>
            <line x1={0} y1={y(500)} x2={W} y2={y(500)} stroke="#ffffff33" strokeDasharray="2 12" strokeWidth={4} strokeLinecap="round" />
            <path d={path} fill="none" stroke={brand.lime} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={3000} strokeDashoffset={3000 * (1 - progress)} style={{ filter: `drop-shadow(0 0 10px ${brand.lime})` }} />
            <text x={0} y={y(500) - 18} fill={brand.ink} fontFamily={brandFont} fontWeight={700} fontSize={32}>R$ 500</text>
            {progress > 0.6 ? <text x={W * 0.5} y={y(1000) - 20} fill={brand.orange} fontFamily={brandFont} fontWeight={800} fontSize={32}>R$ 1.000 (semanas antes)</text> : null}
            <text x={0} y={H + 40} fill={brand.muted} fontFamily={brandFont} fontWeight={600} fontSize={26}>outubro</text>
            <text x={W - 150} y={H + 40} fill={brand.lime} fontFamily={brandFont} fontWeight={700} fontSize={26}>Black Friday</text>
          </svg>
        </GlassCard>
      </div>
      <Reveal at={down} from="scale" style={{ left: 640, top: 690 }}>
        <Pill accent="orange" solid size={44}>−50%?!</Pill>
      </Reveal>
      <Reveal at={cue("histórico")} style={{ left: 75, top: 960, width: 930 }}>
        <GlassCard accent="lime" style={{ padding: "22px 30px", display: "flex", alignItems: "center", gap: 22, fontWeight: 700, fontSize: 36, lineHeight: 1.25 }}>
          <div style={{ width: 66, height: 66, flexShrink: 0, borderRadius: 16, background: brand.lime, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="check" color={brand.bg} />
          </div>
          <div>
            Veja o <span style={{ color: brand.lime }}>histórico de preço</span> (Zoom, Buscapé)
          </div>
        </GlassCard>
      </Reveal>
      <BrandPrompt at={6}>+ SEGUE pra não cair em golpe</BrandPrompt>
    </BrandScene>
  );
};

const Flag: React.FC<{ at: number; text: string; top: number }> = ({ at: start, text, top }) => (
  <Reveal at={start} from="left" style={{ left: 75, top, width: 930 }}>
    <GlassCard accent="orange" style={{ padding: "20px 28px", display: "flex", alignItems: "center", gap: 22, fontWeight: 700, fontSize: 44 }}>
      <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 16, background: brand.orange, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 38, color: brand.bg }}>✗</div>
      {text}
    </GlassCard>
  </Reveal>
);

/** Golpe 2: fake-store red flags. */
export const Scene3Site: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <BrandScene label="Golpe nº 2" icon="alert" accent="orange" title="Site falso">
      <Flag at={cue("bom")} text="Preço bom demais" top={500} />
      <Flag at={cue("Pix")} text="Só aceita Pix" top={640} />
      <Flag at={cue("CNPJ")} text="Sem CNPJ no site" top={780} />
      <Reveal at={cue("Reclame")} style={{ left: 75, top: 960, width: 930 }}>
        <GlassCard accent="lime" style={{ padding: "22px 30px", textAlign: "center", fontWeight: 700, fontSize: 38 }}>
          Pesquise a loja no <span style={{ color: brand.lime }}>Reclame Aqui</span>
        </GlassCard>
      </Reveal>
      <BrandPrompt at={6} accent="orange">COMENTA: já caiu num desses?</BrandPrompt>
    </BrandScene>
  );
};

/** Withdrawal right: 7 days (CDC art. 49). */
export const Scene4Direito: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const seven = cue("7", at("tem", from));
  const k = interpolate(frame, [seven - 2, seven + 8], [0, 1], clamp);
  return (
    <BrandScene label="Seu direito · CDC art. 49" icon="shield" accent="lime" title="Arrependimento">
      <Hero top={500}>
        <div style={{ position: "relative" }}>
          <GlassObject w={420} h={480} d="M210 8 L405 72 V230 C405 355 320 440 210 474 C100 440 15 355 15 230 V72 Z" colors={[brand.lime, brand.blue, brand.orangeSoft]}>
            <div style={{ textAlign: "center", fontFamily: brandFont, marginTop: -20, opacity: k, scale: interpolate(k, [0, 1], [0.6, 1]) }}>
              <div style={{ fontWeight: 800, fontSize: 190, lineHeight: 0.9, color: brand.ink, letterSpacing: -6 }}>7</div>
              <div style={{ fontWeight: 800, fontSize: 46, color: brand.lime }}>DIAS</div>
            </div>
          </GlassObject>
          <Sparks w={420} h={480} color={brand.lime} n={6} />
        </div>
      </Hero>
      <Reveal at={cue("dinheiro")} from="scale" style={{ left: 0, right: 0, top: 1060, textAlign: "center" }}>
        <Pill accent="lime" solid size={38}>dinheiro de volta + frete</Pill>
      </Reveal>
    </BrandScene>
  );
};

export const Scene5Final: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <BrandScene label="Sua vez" icon="chat" accent="lime" title="Manda pra alguém">
      <Reveal at={2} from="scale" style={{ left: 290, top: 520, width: 500 }}>
        <GlassCard accent="orange" style={{ overflow: "hidden", textAlign: "center" }}>
          <div style={{ background: brand.orange, color: brand.bg, fontWeight: 800, fontSize: 34, padding: "12px 0", letterSpacing: 2 }}>BLACK FRIDAY</div>
          <div style={{ fontWeight: 800, fontSize: 160, lineHeight: 1.15, letterSpacing: -6 }}>27/11</div>
        </GlassCard>
      </Reveal>
      <Reveal at={cue("Manda") + 8} from="scale" style={{ left: 0, right: 0, top: 960, textAlign: "center" }}>
        <Pill accent="lime" solid size={42}>↗ COMPARTILHAR</Pill>
      </Reveal>
    </BrandScene>
  );
};
