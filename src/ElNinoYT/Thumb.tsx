import React from "react";
import { AbsoluteFill } from "remotion";
import { brand, brandFont } from "../brand/theme";
import { CountryClip, MapLabel, SeaBlob, useP, WorldMap } from "./map";
import { Thermo } from "./illus";

const Split: React.FC = () => {
  const P = useP();
  const [, yN] = P(-50, -12);
  const [, yS] = P(-50, -23);
  return (
    <g>
      <CountryClip id="brt" country="076" />
      <rect x={0} y={0} width={1920} height={yN} fill={brand.orange} opacity={0.85} clipPath="url(#brt)" />
      <rect x={0} y={yS} width={1920} height={1080} fill={brand.blue} opacity={0.95} clipPath="url(#brt)" />
    </g>
  );
};

/** YouTube thumbnail (render at --scale=0.6667 for 1280×720). */
export const ElNinoThumb: React.FC<{ variant?: "a" | "b" }> = ({ variant = "a" }) => (
  <AbsoluteFill style={{ background: brand.bg }}>
    <div style={{ position: "absolute", inset: 0 }}>
      <WorldMap camera={{ lon: -82, lat: -14, zoom: 2.5 }} highlights={[{ ids: ["076"], color: "#3a3850", opacity: 1 }]}>
        <SeaBlob lon={-100} lat={-2} rLon={26} rLat={9} color={brand.orange} opacity={0.95} />
        <SeaBlob lon={-92} lat={-2} rLon={12} rLat={5} color={brand.lime} opacity={0.45} />
        <Split />
        <MapLabel lon={-52} lat={-6} size={64} color={brand.ink}>SECA</MapLabel>
        <MapLabel lon={-50} lat={-29} size={56} color={brand.ink}>ENCHENTE</MapLabel>
      </WorldMap>
    </div>
    <AbsoluteFill style={{ background: "linear-gradient(90deg, #07070b 0%, #07070be6 36%, #07070b00 58%)" }} />
    <div style={{ position: "absolute", left: 70, top: 120, fontFamily: brandFont, color: brand.ink }}>
      {variant === "a" ? (
        <>
          <div style={{ fontWeight: 800, fontSize: 210, lineHeight: 0.9, letterSpacing: -8, color: brand.orange, textShadow: `0 0 60px ${brand.orange}aa` }}>EL NIÑO</div>
          <div style={{ fontWeight: 800, fontSize: 120, lineHeight: 1, letterSpacing: -4, marginTop: 10 }}>2026</div>
          <div style={{ display: "inline-block", marginTop: 40, padding: "16px 34px", borderRadius: 999, background: brand.lime, color: brand.bg, fontWeight: 800, fontSize: 64 }}>vai ser forte?</div>
        </>
      ) : (
        <>
          <div style={{ fontWeight: 800, fontSize: 120, lineHeight: 1, letterSpacing: -4 }}>O OCEANO QUE</div>
          <div style={{ fontWeight: 800, fontSize: 120, lineHeight: 1, letterSpacing: -4 }}>CONTROLA O</div>
          <div style={{ fontWeight: 800, fontSize: 170, lineHeight: 1, letterSpacing: -6, color: brand.lime, textShadow: `0 0 50px ${brand.lime}88` }}>BRASIL</div>
        </>
      )}
    </div>
    <div style={{ position: "absolute", left: 1000, top: 470, scale: "0.85" }}>
      <Thermo level={0.92} height={500} />
    </div>
  </AbsoluteFill>
);
