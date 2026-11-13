import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BrandScene, Hero } from "../../brand/Scene";
import { BrandPrompt, GlassCard, Pill, Reveal } from "../../brand/Glass";
import { GlassObject, Sparks } from "../../brand/GlassObject";
import { brand, brandFont, clamp } from "../../brand/theme";
import { useCue } from "../data";
import { Camera, MapLabel, WorldMap } from "../../ElNinoYT/map";
import { useCamera } from "../../ElNinoYT/scenes/Scenes";

const rr = (w: number, h: number, r: number) => `M${r} 0 H${w - r} Q${w} 0 ${w} ${r} V${h - r} Q${w} ${h} ${w - r} ${h} H${r} Q0 ${h} 0 ${h - r} V${r} Q0 0 ${r} 0 Z`;

/** Big red rubber stamp. */
const Stamp: React.FC<{ at: number; text: string; top: number; size?: number }> = ({ at, text, top, size = 120 }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [at - 2, at + 6], [0, 1], clamp);
  if (frame < at - 2) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", opacity: k, scale: interpolate(k, [0, 1], [1.8, 1]), rotate: "-9deg" }}>
      <span style={{ display: "inline-block", border: `9px solid ${brand.orange}`, borderRadius: 26, padding: "0 44px", fontFamily: brandFont, fontWeight: 800, fontSize: size, color: brand.orange, background: "rgba(7,7,11,0.88)", boxShadow: `0 0 50px ${brand.orange}77` }}>
        {text}
      </span>
    </div>
  );
};

/** Glass light bulb that flickers. */
const Bulb: React.FC = () => {
  const frame = useCurrentFrame();
  const flick = [0.95, 0.2, 0.9, 0.95, 0.15, 0.95, 0.95, 0.95, 0.3, 0.95][Math.floor(frame / 4) % 10];
  return (
    <div style={{ position: "relative", opacity: 0.5 + 0.5 * flick }}>
      <GlassObject
        w={360}
        h={480}
        d="M180 0 C290 0 360 80 360 175 C360 245 320 285 290 320 C270 345 262 365 262 390 H98 C98 365 90 345 70 320 C40 285 0 245 0 175 C0 80 70 0 180 0 Z"
        colors={[brand.lime, brand.orangeSoft, brand.lime]}
        glow={flick > 0.5 ? brand.lime : brand.bg2}
        inner={<path d="M140 380 L150 230 L180 270 L210 230 L220 380" fill="none" stroke={brand.ink} strokeWidth={8} strokeLinejoin="round" opacity={0.8} />}
        over={
          <>
            <rect x={98} y={400} width={164} height={28} rx={10} fill="#9a96a8" />
            <rect x={108} y={434} width={144} height={24} rx={10} fill="#7a7688" />
            <rect x={130} y={462} width={100} height={18} rx={9} fill="#5a5668" />
          </>
        }
      />
      <Sparks w={360} h={480} color={brand.lime} n={5} />
    </div>
  );
};

export const S1Hook: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <BrandScene instant label="Hoje · 17 de novembro" icon="alert" accent="orange" title="Apagão mundial?">
      <Hero top={430}>
        <Bulb />
      </Hero>
      <Stamp at={cue("acontecer.")} text="FAKE" top={620} size={150} />
      <Reveal at={0} style={{ left: 0, right: 0, top: 1090, textAlign: "center" }}>
        <Pill accent="orange" size={38}>&quot;vai faltar luz no mundo todo&quot;</Pill>
      </Reveal>
    </BrandScene>
  );
};

/** Glass phone with chat bubbles. */
const Phone: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <GlassObject w={720} h={640} d={rr(720, 640, 70)} colors={[brand.blue, brand.blueSoft, brand.lime]}>
    <div style={{ width: 640, display: "flex", flexDirection: "column", gap: 18, fontFamily: brandFont }}>{children}</div>
  </GlassObject>
);

const Bubble: React.FC<{ from: "them" | "fake"; title: string; text: string; k: number }> = ({ from, title, text, k }) => (
  <div style={{ opacity: k, translate: `0px ${(1 - k) * 30}px`, alignSelf: from === "them" ? "flex-start" : "flex-end", maxWidth: 560, padding: "20px 26px", borderRadius: 22, background: from === "them" ? "rgba(255,255,255,0.12)" : `${brand.orange}dd`, color: from === "them" ? brand.ink : brand.bg }}>
    <div style={{ fontWeight: 800, fontSize: 30, opacity: 0.8 }}>{title}</div>
    <div style={{ fontWeight: 800, fontSize: 44, lineHeight: 1.2 }}>{text}</div>
  </div>
);

export const S2Origem: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tKit = cue("kit");
  const tVirou = cue("virou");
  return (
    <BrandScene label="De onde veio" icon="chat" accent="blue" title="Tirado de contexto">
      <Hero top={450}>
        <Phone>
          <Bubble from="them" title="Defesa Civil" text="Monte seu kit de emergência: água, lanterna, pilhas…" k={interpolate(frame, [tKit, tKit + 10], [0, 1], clamp)} />
          <Bubble from="fake" title="encaminhada muitas vezes" text="URGENTE!!! APAGÃO MUNDIAL DIA 17!!!" k={interpolate(frame, [tVirou, tVirou + 10], [0, 1], clamp)} />
        </Phone>
      </Hero>
      <BrandPrompt at={6}>+ SEGUE: boato explicado em 1 min</BrandPrompt>
    </BrandScene>
  );
};

const WORLD: Camera = { lon: -20, lat: 10, zoom: 0.62 };
const BR: Camera = { lon: -53, lat: -14, zoom: 3.2 };

export const S3Rede: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tCada = cue("cada");
  const tBr = cue("Brasil,");
  const cam = useCamera([[0, WORLD], [tBr - 5, WORLD], [tBr + 25, BR]]);
  const hl =
    frame >= tCada
      ? [
          { ids: ["840", "124"], color: brand.blue },
          { ids: ["076"], color: brand.lime },
          { ids: ["643"], color: brand.orange },
          { ids: ["156"], color: brand.blueSoft },
          { ids: ["356"], color: brand.orangeSoft },
          { ids: ["036"], color: brand.lime },
          { ids: ["250", "276", "724", "380"], color: brand.orangeSoft },
        ]
      : [];
  return (
    <BrandScene label="Por que não acontece" icon="bolt" accent="lime" title="Sem rede mundial">
      <div style={{ position: "absolute", left: 0, top: 440, width: 1080, height: 760, overflow: "hidden" }}>
        <WorldMap camera={cam} highlights={hl} w={1080} h={760}>
          {frame >= tBr + 20 ? <MapLabel lon={-52} lat={-12} size={56}>SIN</MapLabel> : null}
        </WorldMap>
      </div>
      <Reveal at={tCada} from="scale" style={{ left: 0, right: 0, top: 1110, textAlign: "center", opacity: frame >= tBr ? 0 : 1 }}>
        <Pill accent="lime" size={38}>cada país tem a sua rede</Pill>
      </Reveal>
      <Reveal at={cue("ONS.")} from="scale" style={{ left: 0, right: 0, top: 1110, textAlign: "center" }}>
        <Pill accent="lime" solid size={36}>Sistema Interligado Nacional · ONS</Pill>
      </Reveal>
    </BrandScene>
  );
};

export const S4Real: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <BrandScene label="Apagão de verdade" icon="calendar" accent="orange" title="Agosto de 2023">
      <Reveal at={cue("2023")} from="scale" style={{ left: 290, top: 470, width: 500 }}>
        <GlassCard accent="orange" style={{ overflow: "hidden", textAlign: "center" }}>
          <div style={{ background: brand.orange, color: brand.bg, fontWeight: 800, fontSize: 40, padding: "12px 0", letterSpacing: 2 }}>AGOSTO · 2023</div>
          <div style={{ fontWeight: 800, fontSize: 190, lineHeight: 1.1, letterSpacing: -6 }}>15</div>
        </GlassCard>
      </Reveal>
      <Reveal at={cue("25 estados")} from="scale" style={{ left: 0, right: 0, top: 880, textAlign: "center" }}>
        <Pill accent="orange" solid size={42}>25 estados + DF sem luz</Pill>
      </Reveal>
      <Reveal at={cue("falha")} from="scale" style={{ left: 0, right: 0, top: 990, textAlign: "center" }}>
        <Pill accent="lime" size={38}>falha no sistema, não previsão</Pill>
      </Reveal>
    </BrandScene>
  );
};

const KitItem: React.FC<{ at: number; label: string; colors: string[]; icon: React.ReactNode; left: number; top: number }> = ({ at, label, colors, icon, left, top }) => (
  <Reveal at={at} from="scale" style={{ left, top, width: 420, textAlign: "center" }}>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <GlassObject w={220} h={220} d={rr(220, 220, 54)} colors={colors} over={icon} />
    </div>
    <div style={{ fontFamily: brandFont, fontWeight: 800, fontSize: 40, color: brand.ink, marginTop: 12 }}>{label}</div>
  </Reveal>
);

export const S5Kit: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <BrandScene label="Isso vale a pena" icon="check" accent="lime" title="Kit de emergência">
      <KitItem at={cue("água,")} label="Água" left={90} top={470} colors={[brand.blue, brand.blueSoft, brand.blue]} icon={<path d="M110 40 C150 100 170 130 170 155 A60 60 0 0 1 50 155 C50 130 70 100 110 40 Z" fill={brand.ink} opacity={0.85} />} />
      <KitItem at={cue("lanterna,")} label="Lanterna" left={570} top={470} colors={[brand.lime, brand.orangeSoft, brand.lime]} icon={<path d="M50 90 H120 L170 60 V160 L120 130 H50 Z" fill={brand.ink} opacity={0.85} />} />
      <KitItem at={cue("pilhas")} label="Pilhas" left={90} top={790} colors={[brand.orange, brand.orangeSoft, brand.orange]} icon={<><rect x={80} y={50} width={60} height={130} rx={10} fill={brand.ink} opacity={0.85} /><rect x={98} y={36} width={24} height={16} rx={4} fill={brand.ink} /></>} />
      <KitItem at={cue("carregador")} label="Carregador" left={570} top={790} colors={[brand.blue, brand.lime, brand.blue]} icon={<><rect x={60} y={50} width={100} height={130} rx={18} fill={brand.ink} opacity={0.85} /><path d="M115 70 L90 120 H112 L100 160 L135 105 H112 Z" fill={brand.bg} /></>} />
    </BrandScene>
  );
};

export const S6Final: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  return (
    <BrandScene label="Sua vez" icon="chat" accent="lime" title="Manda pro grupo">
      <Hero top={460}>
        <Phone>
          <Bubble from="fake" title="grupo da família" text="APAGÃO MUNDIAL DIA 17!!!" k={1} />
          <Bubble from="them" title="você" text="É boato 😅 olha esse vídeo" k={interpolate(frame, [8, 18], [0, 1], clamp)} />
        </Phone>
      </Hero>
      <Reveal at={cue("família!", 20)} from="scale" style={{ left: 0, right: 0, top: 1130, textAlign: "center" }}>
        <Pill accent="lime" solid size={40}>MANDA PRO GRUPO DA FAMÍLIA</Pill>
      </Reveal>
    </BrandScene>
  );
};
