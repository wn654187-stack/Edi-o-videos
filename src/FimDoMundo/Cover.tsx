import React from "react";
import { AbsoluteFill } from "remotion";
import { BrandBackground } from "../brand/Background";
import { GlassObject, Sparks } from "../brand/GlassObject";
import { brand, brandFont } from "../brand/theme";

const rr = (w: number, h: number, r: number) => `M${r} 0 H${w - r} Q${w} 0 ${w} ${r} V${h - r} Q${w} ${h} ${w - r} ${h} H${r} Q0 ${h} 0 ${h - r} V${r} Q0 0 ${r} 0 Z`;

/** Vertical cover (1080×1920) for the 1960 doomsday-equation video. */
export const FimDoMundoCover: React.FC = () => (
  <AbsoluteFill style={{ background: brand.bg }}>
    <BrandBackground glow={brand.orange} glow2={brand.blue} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: brandFont, fontWeight: 700, fontSize: 34, color: brand.ink, opacity: 0.85 }}>
      <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: "50%", background: brand.orange, marginRight: 14, boxShadow: `0 0 12px ${brand.orange}` }} />
      WILL TE EXPLICA · MATEMÁTICA
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative" }}>
        <GlassObject w={420} h={450} d={rr(420, 450, 50)} colors={[brand.orange, brand.orangeSoft, brand.blue]} inner={<rect x={0} y={0} width={420} height={105} fill={brand.orange} opacity={0.85} />}>
          <div style={{ position: "absolute", top: 16, left: 0, right: 0, textAlign: "center", fontFamily: brandFont, fontWeight: 800, fontSize: 52, color: brand.bg, letterSpacing: 3 }}>NOV · 2026</div>
          <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily: brandFont, fontWeight: 800, fontSize: 230, lineHeight: 1, color: brand.ink, letterSpacing: -8 }}>13</div>
          <div style={{ position: "absolute", top: 365, left: 0, right: 0, textAlign: "center", fontFamily: brandFont, fontWeight: 800, fontSize: 46, color: brand.orange, letterSpacing: 3 }}>SEXTA-FEIRA</div>
        </GlassObject>
        <Sparks w={420} h={450} color={brand.orange} n={5} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", fontFamily: brandFont, color: brand.ink }}>
      <div style={{ fontWeight: 800, fontSize: 112, lineHeight: 0.98, letterSpacing: -4 }}>O MUNDO</div>
      <div style={{ fontWeight: 800, fontSize: 112, lineHeight: 0.98, letterSpacing: -4 }}>DEVERIA TER</div>
      <div style={{ fontWeight: 800, fontSize: 112, lineHeight: 0.98, letterSpacing: -4 }}>ACABADO</div>
      <div style={{ fontWeight: 800, fontSize: 150, lineHeight: 1.05, letterSpacing: -5, color: brand.orange, textShadow: `0 0 60px ${brand.orange}aa` }}>ONTEM.</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1470, textAlign: "center", rotate: "-6deg" }}>
      <span style={{ display: "inline-block", border: `8px solid ${brand.lime}`, borderRadius: 26, padding: "4px 40px", fontFamily: brandFont, fontWeight: 800, fontSize: 64, color: brand.lime, background: "rgba(7,7,11,0.88)", boxShadow: `0 0 50px ${brand.lime}66` }}>
        culpa de uma equação
      </span>
    </div>
  </AbsoluteFill>
);
