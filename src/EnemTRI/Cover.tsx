import React from "react";
import { AbsoluteFill } from "remotion";
import { BrandBackground } from "../brand/Background";
import { GlassCard } from "../brand/Glass";
import { brand, brandFont } from "../brand/theme";

const Cand: React.FC<{ name: string; result: string; color: string }> = ({ name, result, color }) => (
  <GlassCard style={{ width: 400, padding: "26px 0", textAlign: "center" }}>
    <div style={{ fontWeight: 700, fontSize: 32, color: brand.muted }}>{name}</div>
    <div style={{ fontWeight: 800, fontSize: 130, lineHeight: 1, letterSpacing: -4, color: brand.ink }}>30</div>
    <div style={{ fontWeight: 700, fontSize: 30, color: brand.muted }}>acertos</div>
    <div style={{ display: "inline-block", marginTop: 16, padding: "10px 26px", borderRadius: 999, background: color, color: brand.bg, fontWeight: 800, fontSize: 38 }}>{result}</div>
  </GlassCard>
);

/** Vertical cover (1080×1920) for the TRI video. */
export const TRICover: React.FC = () => (
  <AbsoluteFill style={{ background: brand.bg, fontFamily: brandFont }}>
    <BrandBackground glow={brand.blue} glow2={brand.lime} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontWeight: 700, fontSize: 34, color: brand.ink, opacity: 0.85 }}>
      <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: "50%", background: brand.orange, marginRight: 14, boxShadow: `0 0 12px ${brand.orange}` }} />
      WILL TE EXPLICA · ENEM
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center" }}>
      <div style={{ fontWeight: 800, fontSize: 150, lineHeight: 0.95, letterSpacing: -5, color: brand.ink }}>MESMOS</div>
      <div style={{ fontWeight: 800, fontSize: 150, lineHeight: 0.95, letterSpacing: -5, color: brand.ink }}>ACERTOS.</div>
      <div style={{ fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: -5, color: brand.orange, textShadow: `0 0 60px ${brand.orange}aa`, marginTop: 10 }}>NOTAS</div>
      <div style={{ fontWeight: 800, fontSize: 132, lineHeight: 1, letterSpacing: -5, color: brand.orange, textShadow: `0 0 60px ${brand.orange}aa` }}>DIFERENTES?</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center", gap: 40 }}>
      <Cand name="Candidato A" result="nota maior" color={brand.lime} />
      <Cand name="Candidato B" result="nota menor" color={brand.orange} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1480, textAlign: "center" }}>
      <span style={{ display: "inline-block", padding: "14px 40px", borderRadius: 999, background: brand.lime, color: brand.bg, fontWeight: 800, fontSize: 60 }}>é a TRI</span>
    </div>
  </AbsoluteFill>
);
