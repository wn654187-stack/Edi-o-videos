import React from "react";
import { AbsoluteFill } from "remotion";
import { BrandBackground } from "../brand/Background";
import { GlassObject, Sparks } from "../brand/GlassObject";
import { brand, brandFont } from "../brand/theme";

/** Vertical cover (1080×1920) for the Black Friday fake-discount video. */
export const BlackFridayCover: React.FC = () => (
  <AbsoluteFill style={{ background: brand.bg }}>
    <BrandBackground glow={brand.orange} glow2={brand.lime} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: brandFont, fontWeight: 700, fontSize: 34, color: brand.ink, opacity: 0.85 }}>
      <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: "50%", background: brand.orange, marginRight: 14, boxShadow: `0 0 12px ${brand.orange}` }} />
      WILL TE EXPLICA · SEU BOLSO
    </div>
    <div style={{ position: "absolute", left: 110, top: 340, rotate: "-4deg" }}>
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
        <span style={{ display: "inline-block", padding: "6px 30px", borderRadius: 999, background: brand.lime, color: brand.bg, fontFamily: brandFont, fontWeight: 800, fontSize: 56 }}>−50%</span>
      </div>
      <Sparks w={860} h={400} color={brand.lime} n={6} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", fontFamily: brandFont, color: brand.ink }}>
      <div style={{ fontWeight: 800, fontSize: 124, lineHeight: 0.98, letterSpacing: -4 }}>ESSE</div>
      <div style={{ fontWeight: 800, fontSize: 124, lineHeight: 0.98, letterSpacing: -4 }}>DESCONTO</div>
      <div style={{ fontWeight: 800, fontSize: 124, lineHeight: 0.98, letterSpacing: -4 }}>PODE SER</div>
      <div style={{ fontWeight: 800, fontSize: 168, lineHeight: 1.05, letterSpacing: -6, color: brand.orange, textShadow: `0 0 60px ${brand.orange}aa` }}>FALSO</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1530, textAlign: "center", rotate: "-5deg" }}>
      <span style={{ display: "inline-block", border: `7px solid ${brand.lime}`, borderRadius: 24, padding: "6px 36px", fontFamily: brandFont, fontWeight: 800, fontSize: 56, color: brand.lime, background: "rgba(7,7,11,0.88)", boxShadow: `0 0 40px ${brand.lime}55` }}>
        2 golpes + 1 direito
      </span>
    </div>
  </AbsoluteFill>
);
