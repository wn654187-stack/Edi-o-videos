import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BrandScene, Hero } from "../../brand/Scene";
import { BrandPrompt, GlassCard, Pill, Reveal } from "../../brand/Glass";
import { GlassObject, Sparks, starPath } from "../../brand/GlassObject";
import { brand, brandFont, clamp } from "../../brand/theme";
import { at, useCue } from "../data";
import { BRAZIL_PATH } from "../brazilPath";

/** Glass sun with turning rays + a glass thermometer whose column keeps rising. */
const SunThermo: React.FC = () => {
  const frame = useCurrentFrame();
  const rot = frame * 0.4;
  const level = 0.55 + 0.25 * (0.5 + 0.5 * Math.sin(frame / 18));
  const TW = 170;
  const TH = 520;
  const col = 300 * level;
  return (
    <div style={{ position: "relative", width: 760, height: 600 }}>
      <svg width={520} height={520} viewBox="0 0 520 520" style={{ position: "absolute", left: 20, top: 30, rotate: `${rot}deg`, overflow: "visible" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={250} y={0} width={20} height={70} rx={10} fill={i % 2 ? brand.orangeSoft : brand.lime} opacity={0.85} transform={`rotate(${i * 30} 260 260)`} style={{ filter: `drop-shadow(0 0 10px ${brand.orange})` }} />
        ))}
      </svg>
      <GlassObject w={340} h={340} d="M170 0 A170 170 0 1 1 169.9 0 Z" colors={[brand.orange, brand.orangeSoft, brand.lime]} style={{ position: "absolute", left: 110, top: 120 }} />
      <GlassObject
        w={TW}
        h={TH}
        d="M45 60 A40 40 0 0 1 125 60 V360 A85 85 0 1 1 45 360 Z"
        colors={[brand.blueSoft, brand.orange, brand.blue]}
        glow={brand.orange}
        style={{ position: "absolute", left: 540, top: 40 }}
        inner={
          <>
            <rect x={67} y={400 - col} width={36} height={col + 40} rx={18} fill={brand.orange} style={{ filter: `drop-shadow(0 0 14px ${brand.orange})` }} />
            <circle cx={85} cy={430} r={62} fill={brand.orange} style={{ filter: `drop-shadow(0 0 20px ${brand.orange})` }} />
            {Array.from({ length: 7 }).map((_, i) => (
              <rect key={i} x={112} y={90 + i * 40} width={i % 2 ? 10 : 18} height={4} rx={2} fill={brand.ink} opacity={0.7} />
            ))}
          </>
        }
      />
      <Sparks w={760} h={600} color={brand.orangeSoft} />
    </div>
  );
};

export const Scene1Hook: React.FC<{ from: number }> = () => (
  <BrandScene instant label="Clima · acontecendo agora" icon="sun" accent="orange" title="El Niño 2026">
    <Hero top={460}>
      <SunThermo />
    </Hero>
    <Reveal at={0} style={{ left: 0, right: 0, top: 1110, textAlign: "center" }}>
      <Pill accent="orange">o mais forte desde 1950?</Pill>
    </Reveal>
  </BrandScene>
);

export const Scene2Mecanismo: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const weak = interpolate(frame, [cue("enfraquecem") - 4, cue("enfraquecem") + 14], [0, 1], clamp);
  const spread = interpolate(frame, [cue("espalha") - 6, cue("costa") + 10], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const elnino = frame >= cue("No", at("Ásia", from));
  const W = 920;
  const shift = (frame * 4) % 60;
  return (
    <BrandScene label="Como funciona" icon="wave" accent="blue" title="Ventos alísios">
      <div style={{ position: "absolute", left: 80, top: 520, width: W }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <Pill accent={elnino ? "orange" : "blue"} solid size={32}>{elnino ? "COM EL NIÑO" : "NORMALMENTE"}</Pill>
        </div>
        <svg width={W} height={130} style={{ opacity: 1 - weak * 0.75 }}>
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <line x1={20} y1={25 + r * 40} x2={W - 20} y2={25 + r * 40} stroke={brand.ink} strokeOpacity={0.5} strokeWidth={4} strokeDasharray="2 14" strokeDashoffset={shift + r * 10} strokeLinecap="round" />
              <path d={`M${40} ${25 + r * 40} l18 -10 M${40} ${25 + r * 40} l18 10`} stroke={brand.ink} strokeWidth={4} strokeLinecap="round" />
            </g>
          ))}
        </svg>
        <div style={{ fontFamily: brandFont, fontWeight: 600, fontSize: 28, color: brand.muted, textAlign: "center", marginTop: -6 }}>ventos alísios {weak > 0.5 ? "· fracos" : ""}</div>
        <GlassCard accent="blue" style={{ position: "relative", height: 300, marginTop: 20, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${brand.blue}55, ${brand.bg}cc)` }} />
          <div
            style={{
              position: "absolute",
              left: interpolate(spread, [0, 1], [-60, 420]),
              top: -60,
              width: interpolate(spread, [0, 1], [440, 560]),
              height: 260,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${brand.orange}, ${brand.orange}00 70%)`,
              filter: "blur(10px)",
            }}
          />
          <div style={{ position: "absolute", left: 30, bottom: 22, fontWeight: 700, fontSize: 30, color: brand.ink }}>Ásia</div>
          <div style={{ position: "absolute", right: 30, bottom: 22, fontWeight: 700, fontSize: 30, color: brand.ink }}>América do Sul</div>
          <div style={{ position: "absolute", left: interpolate(spread, [0, 1], [70, 520]), top: 40, fontWeight: 700, fontSize: 28, color: brand.ink }}>água quente</div>
        </GlassCard>
      </div>
      <BrandPrompt at={6}>+ SEGUE: vídeo novo todo dia</BrandPrompt>
    </BrandScene>
  );
};

export const Scene3Brasil: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const dry = interpolate(frame, [cue("Norte") - 4, cue("Norte") + 10], [0, 1], clamp);
  const wet = interpolate(frame, [cue("Sul") - 4, cue("Sul") + 10], [0, 1], clamp);
  const hot = interpolate(frame, [cue("esquenta") - 6, cue("esquenta") + 10], [0, 1], clamp);
  return (
    <BrandScene label="No Brasil" icon="pin" accent="lime" title="Seca × chuva">
      <div style={{ position: "absolute", left: 175, top: 470, scale: 0.9, transformOrigin: "50% 0" }}>
        <svg width={820} height={800} viewBox="0 0 820 800">
          <defs>
            <clipPath id="brz">
              <path d={BRAZIL_PATH} />
            </clipPath>
          </defs>
          <path d={BRAZIL_PATH} fill="rgba(255,255,255,0.05)" stroke={brand.ink} strokeOpacity={0.6} strokeWidth={4} />
          <g clipPath="url(#brz)">
            <rect x={0} y={0} width={820} height={800} fill={brand.orange} opacity={hot * 0.22} />
            <path d="M0 0 H820 V480 H620 V330 H0 Z" fill={brand.orange} opacity={dry * 0.8} />
            <rect x={0} y={570} width={640} height={230} fill={brand.blue} opacity={wet * 0.9} />
          </g>
        </svg>
        <div style={{ position: "absolute", left: 280, top: 140, opacity: dry }}>
          <Pill accent="orange" solid size={34}>+ SECA</Pill>
        </div>
        <div style={{ position: "absolute", left: 180, top: 660, opacity: wet }}>
          <Pill accent="blue" solid size={34}>+ CHUVA</Pill>
        </div>
      </div>
      <Reveal at={cue("esquenta")} from="scale" style={{ left: 0, right: 0, top: 1150, textAlign: "center" }}>
        <Pill accent="orange">+1 a 2 °C em quase todo o país</Pill>
      </Reveal>
    </BrandScene>
  );
};

export const Scene4Nome: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <BrandScene label="Origem do nome" icon="star" accent="orange" title="O Menino">
      <Hero top={480}>
        <div style={{ position: "relative" }}>
          <GlassObject w={440} h={440} d={starPath(440)} colors={[brand.orangeSoft, brand.lime, brand.orange]}>
            <div style={{ fontFamily: brandFont, fontWeight: 800, fontSize: 46, color: brand.ink, marginTop: 40, textAlign: "center", lineHeight: 1 }}>
              25/12
            </div>
          </GlassObject>
          <Sparks w={440} h={440} color={brand.lime} n={6} />
        </div>
      </Hero>
      <Reveal at={cue("Peru")} from="scale" style={{ left: 0, right: 0, top: 1060, textAlign: "center" }}>
        <Pill accent="lime">Peru · água quente perto do Natal</Pill>
      </Reveal>
      <BrandPrompt at={4} accent="orange">COMENTA SUA CIDADE</BrandPrompt>
    </BrandScene>
  );
};

export const Scene5Final: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  const btn = (txt: string, accent: "orange" | "blue", left: number, delay: number) => (
    <Reveal at={delay} from="scale" style={{ left, top: 600, width: 430 }}>
      <GlassCard accent={accent} style={{ padding: "50px 0", textAlign: "center", fontWeight: 800, fontSize: 64 }}>{txt}</GlassCard>
    </Reveal>
  );
  return (
    <BrandScene label="Sua vez" icon="chat" accent="lime" title="Calor ou chuva?">
      {btn("+ CALOR", "orange", 75, 6)}
      {btn("+ CHUVA", "blue", 575, 10)}
      <Reveal at={cue("Comenta")} from="scale" style={{ left: 0, right: 0, top: 900, textAlign: "center" }}>
        <Pill accent="lime" solid size={40}>COMENTA A SUA CIDADE</Pill>
      </Reveal>
    </BrandScene>
  );
};
