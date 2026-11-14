import React from "react";
import { AbsoluteFill } from "remotion";
import { BrandBackground } from "../brand/Background";
import { brand, brandFont } from "../brand/theme";
import { GlassObject } from "../brand/GlassObject";

/** Vertical cover (1080×1920) for the Amazon simulation: forest → savanna split. */
export const SimAmazoniaCover: React.FC = () => (
  <AbsoluteFill style={{ background: brand.bg, fontFamily: brandFont }}>
    <BrandBackground glow={brand.lime} glow2={brand.orange} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontWeight: 700, fontSize: 34, color: brand.ink, opacity: 0.85 }}>
      <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: "50%", background: brand.orange, marginRight: 14, boxShadow: `0 0 12px ${brand.orange}` }} />
      WILL TE EXPLICA · SIMULAÇÃO
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center" }}>
      <div style={{ fontWeight: 800, fontSize: 120, lineHeight: 0.95, letterSpacing: -4, color: brand.ink }}>E SE A</div>
      <div style={{ fontWeight: 800, fontSize: 160, lineHeight: 1, letterSpacing: -6, color: brand.lime, textShadow: `0 0 60px ${brand.lime}88` }}>AMAZÔNIA</div>
      <div style={{ fontWeight: 800, fontSize: 120, lineHeight: 1, letterSpacing: -4, color: brand.ink }}>VIRASSE</div>
      <div style={{ fontWeight: 800, fontSize: 160, lineHeight: 1, letterSpacing: -6, color: brand.orange, textShadow: `0 0 60px ${brand.orange}aa` }}>SAVANA?</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center", gap: 30, alignItems: "center" }}>
      <GlassObject w={340} h={260} d="M40 0 H300 Q340 0 340 40 V220 Q340 260 300 260 H40 Q0 260 0 220 V40 Q0 0 40 0 Z" colors={["#2c7030", brand.lime, "#3f8f3a"]} glow={brand.lime}>
        <div style={{ textAlign: "center", color: brand.ink }}>
          <div style={{ fontWeight: 700, fontSize: 30, opacity: 0.85 }}>ANO 0</div>
          <div style={{ fontWeight: 800, fontSize: 56 }}>floresta</div>
        </div>
      </GlassObject>
      <div style={{ fontWeight: 800, fontSize: 90, color: brand.ink }}>→</div>
      <GlassObject w={340} h={260} d="M40 0 H300 Q340 0 340 40 V220 Q340 260 300 260 H40 Q0 260 0 220 V40 Q0 0 40 0 Z" colors={[brand.orange, brand.orangeSoft, brand.orange]}>
        <div style={{ textAlign: "center", color: brand.ink }}>
          <div style={{ fontWeight: 700, fontSize: 30, opacity: 0.85 }}>ANO 50</div>
          <div style={{ fontWeight: 800, fontSize: 56 }}>savana?</div>
        </div>
      </GlassObject>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1400, textAlign: "center" }}>
      <span style={{ display: "inline-block", padding: "12px 34px", borderRadius: 999, background: brand.lime, color: brand.bg, fontWeight: 800, fontSize: 48 }}>simulação com base em estudos</span>
    </div>
  </AbsoluteFill>
);
