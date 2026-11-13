import React from "react";
import { AbsoluteFill } from "remotion";
import { BrandBackground } from "../brand/Background";
import { GlassObject, Sparks } from "../brand/GlassObject";
import { brand, brandFont } from "../brand/theme";

/** Vertical cover (1080×1920) for the 17/11 blackout rumour video. */
export const ApagaoCover: React.FC = () => (
  <AbsoluteFill style={{ background: brand.bg }}>
    <BrandBackground glow={brand.orange} glow2={brand.lime} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: brandFont, fontWeight: 700, fontSize: 34, color: brand.ink, opacity: 0.85 }}>
      <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: "50%", background: brand.orange, marginRight: 14, boxShadow: `0 0 12px ${brand.orange}` }} />
      WILL TE EXPLICA · BOATO
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative" }}>
        <GlassObject
          w={330}
          h={440}
          d="M165 0 C266 0 330 73 330 160 C330 225 293 261 266 293 C248 316 240 335 240 357 H90 C90 335 82 316 64 293 C37 261 0 225 0 160 C0 73 64 0 165 0 Z"
          colors={[brand.lime, brand.orangeSoft, brand.lime]}
          inner={<path d="M128 348 L137 210 L165 247 L193 210 L202 348" fill="none" stroke={brand.ink} strokeWidth={8} strokeLinejoin="round" opacity={0.8} />}
          over={<><rect x={90} y={366} width={150} height={26} rx={10} fill="#9a96a8" /><rect x={99} y={398} width={132} height={22} rx={10} fill="#7a7688" /></>}
        />
        <Sparks w={330} h={440} color={brand.lime} n={5} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 780, textAlign: "center", fontFamily: brandFont, color: brand.ink }}>
      <div style={{ fontWeight: 800, fontSize: 132, lineHeight: 0.95, letterSpacing: -5 }}>APAGÃO</div>
      <div style={{ fontWeight: 800, fontSize: 132, lineHeight: 0.95, letterSpacing: -5 }}>MUNDIAL</div>
      <div style={{ fontWeight: 800, fontSize: 132, lineHeight: 1, letterSpacing: -5, color: brand.orange, textShadow: `0 0 60px ${brand.orange}aa` }}>HOJE?</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", rotate: "-8deg" }}>
      <span style={{ display: "inline-block", border: `9px solid ${brand.lime}`, borderRadius: 26, padding: "0 44px", fontFamily: brandFont, fontWeight: 800, fontSize: 110, color: brand.lime, background: "rgba(7,7,11,0.88)", boxShadow: `0 0 50px ${brand.lime}66` }}>17/11</span>
    </div>
  </AbsoluteFill>
);
