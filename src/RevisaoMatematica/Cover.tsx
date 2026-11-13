import React from "react";
import { AbsoluteFill } from "remotion";
import { BrandBackground } from "../brand/Background";
import { GlassObject, Sparks } from "../brand/GlassObject";
import { Pill } from "../brand/Glass";
import { brand, brandFont } from "../brand/theme";

const TOPICS = ["Porcentagem", "Escala", "Estatística", "Geometria", "Probabilidade"];

/** Vertical cover (1080×1920); title kept in the centre square for grid crops. */
export const RevisaoMatematicaCover: React.FC = () => (
  <AbsoluteFill style={{ background: brand.bg }}>
    <BrandBackground glow={brand.lime} glow2={brand.blue} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: brandFont, fontWeight: 700, fontSize: 34, color: brand.ink, opacity: 0.85 }}>
      <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: "50%", background: brand.orange, marginRight: 14, boxShadow: `0 0 12px ${brand.orange}` }} />
      WILL TE EXPLICA · ENEM
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative" }}>
        <GlassObject w={300} h={300} d="M150 0 A150 150 0 1 1 149.9 0 Z" colors={[brand.lime, brand.blue, brand.orange]}
          over={<circle cx={150} cy={150} r={124} fill="none" stroke={brand.lime} strokeWidth={16} strokeLinecap="round" strokeDasharray={779} strokeDashoffset={140} transform="rotate(-90 150 150)" style={{ filter: `drop-shadow(0 0 10px ${brand.lime})` }} />}
        >
          <div style={{ fontFamily: brandFont, fontWeight: 800, fontSize: 84, color: brand.ink, letterSpacing: -3 }}>1 min</div>
        </GlassObject>
        <Sparks w={300} h={300} color={brand.lime} n={6} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: brandFont, color: brand.ink }}>
      <div style={{ fontWeight: 800, fontSize: 150, lineHeight: 0.95, letterSpacing: -6, color: brand.lime, textShadow: `0 0 60px ${brand.lime}88` }}>5 ASSUNTOS</div>
      <div style={{ fontWeight: 800, fontSize: 112, lineHeight: 1, letterSpacing: -4, marginTop: 10 }}>DE MATEMÁTICA</div>
      <div style={{ display: "inline-block", marginTop: 34, padding: "14px 36px", borderRadius: 999, background: brand.orange, color: brand.bg, fontWeight: 800, fontSize: 56 }}>que sempre caem no Enem</div>
    </div>
    <div style={{ position: "absolute", left: 90, right: 90, top: 1230, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18 }}>
      {TOPICS.map((t, i) => (
        <Pill key={t} accent={i % 2 ? "blue" : "lime"} size={36}>
          {i + 1} · {t}
        </Pill>
      ))}
    </div>
  </AbsoluteFill>
);
