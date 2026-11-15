import React from "react";
import { AbsoluteFill } from "remotion";
import { BrandBackground } from "../brand/Background";
import { GlassObject, Sparks } from "../brand/GlassObject";
import { brand, brandFont } from "../brand/theme";

const rr = (w: number, h: number, r: number) => `M${r} 0 H${w - r} Q${w} 0 ${w} ${r} V${h - r} Q${w} ${h} ${w - r} ${h} H${r} Q0 ${h} 0 ${h - r} V${r} Q0 0 ${r} 0 Z`;

/** Vertical cover (1080×1920) for the 13º salário video. */
export const DecimoTerceiroCover: React.FC = () => (
  <AbsoluteFill style={{ background: brand.bg }}>
    <BrandBackground glow={brand.lime} glow2={brand.blue} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: brandFont, fontWeight: 700, fontSize: 34, color: brand.ink, opacity: 0.85 }}>
      <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: "50%", background: brand.orange, marginRight: 14, boxShadow: `0 0 12px ${brand.orange}` }} />
      WILL TE EXPLICA · SEU BOLSO
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", rotate: "-4deg" }}>
        <GlassObject
          w={420}
          h={430}
          d={rr(420, 430, 44)}
          colors={[brand.lime, brand.orange, brand.blue]}
          inner={<rect x={0} y={0} width={420} height={105} fill={brand.orange} opacity={0.92} />}
          over={[120, 300].map((x) => <rect key={x} x={x - 13} y={-30} width={26} height={66} rx={13} fill={brand.ink} opacity={0.9} />)}
        >
          <div style={{ position: "absolute", top: 18, left: 0, right: 0, textAlign: "center", fontFamily: brandFont, fontWeight: 800, fontSize: 48, color: brand.bg, letterSpacing: 4 }}>NOVEMBRO</div>
          <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", fontFamily: brandFont, fontWeight: 800, fontSize: 250, lineHeight: 1.1, color: brand.ink, letterSpacing: -10 }}>30</div>
        </GlassObject>
        <Sparks w={420} h={430} color={brand.lime} n={6} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 850, textAlign: "center", fontFamily: brandFont, color: brand.ink }}>
      <div style={{ fontWeight: 800, fontSize: 150, lineHeight: 0.98, letterSpacing: -5 }}>SEU 13º</div>
      <div style={{ fontWeight: 800, fontSize: 130, lineHeight: 0.98, letterSpacing: -5 }}>VAI VIR</div>
      <div style={{ fontWeight: 800, fontSize: 170, lineHeight: 1.05, letterSpacing: -6, color: brand.orange, textShadow: `0 0 60px ${brand.orange}aa` }}>MENOR?</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1400, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, fontFamily: brandFont }}>
      {[
        ["1ª parcela", "até 30/11", brand.lime],
        ["2ª parcela", "até 18/12", brand.orange],
      ].map(([a, b, c]) => (
        <span key={a} style={{ display: "inline-block", border: `5px solid ${c}`, borderRadius: 999, padding: "8px 40px", fontWeight: 800, fontSize: 52, color: brand.ink, background: "rgba(7,7,11,0.8)", boxShadow: `0 0 30px ${c}55` }}>
          {a} · <span style={{ color: c }}>{b}</span>
        </span>
      ))}
    </div>
  </AbsoluteFill>
);
