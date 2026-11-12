import React from "react";
import { AbsoluteFill } from "remotion";
import { brand, brandFont } from "../brand/theme";
import { CountryClip, MapLabel, SeaBlob, useP, WorldMap } from "../ElNinoYT/map";
import { Thermo } from "../ElNinoYT/illus";

const Split: React.FC = () => {
  const P = useP();
  const [, yN] = P(-50, -12);
  const [, yS] = P(-50, -23);
  return (
    <g>
      <CountryClip id="brc" country="076" />
      <rect x={0} y={0} width={1080} height={yN} fill={brand.orange} opacity={0.88} clipPath="url(#brc)" />
      <rect x={0} y={yS} width={1080} height={1920} fill={brand.blue} opacity={0.95} clipPath="url(#brc)" />
    </g>
  );
};

/**
 * Vertical cover (1080×1920) for TikTok / Reels / Shorts, same look as YouTube thumbnail A.
 * Title sits inside the centre square so the 1:1 and 4:5 grid crops still read.
 */
export const ElNinoCover: React.FC = () => (
  <AbsoluteFill style={{ background: brand.bg }}>
    <div style={{ position: "absolute", left: 0, top: 820, width: 1080, height: 1100 }}>
      <WorldMap camera={{ lon: -62, lat: -16, zoom: 3.1 }} w={1080} h={1100} highlights={[{ ids: ["076"], color: "#3a3850", opacity: 1 }]}>
        <SeaBlob lon={-95} lat={-3} rLon={14} rLat={8} color={brand.orange} opacity={0.9} />
        <Split />
        <MapLabel lon={-54} lat={-5} size={70}>SECA</MapLabel>
        <MapLabel lon={-50} lat={-29} size={62}>ENCHENTE</MapLabel>
      </WorldMap>
    </div>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #07070b 0%, #07070b 38%, #07070bcc 50%, #07070b00 64%, #07070b00 88%, #07070bdd 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: brandFont, color: brand.ink }}>
      <div style={{ fontWeight: 800, fontSize: 200, lineHeight: 0.9, letterSpacing: -8, color: brand.orange, textShadow: `0 0 70px ${brand.orange}aa` }}>EL NIÑO</div>
      <div style={{ fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: -5, marginTop: 6 }}>2026</div>
      <div style={{ display: "inline-block", marginTop: 34, padding: "16px 40px", borderRadius: 999, background: brand.lime, color: brand.bg, fontWeight: 800, fontSize: 68 }}>vai ser forte?</div>
    </div>
    <div style={{ position: "absolute", left: 80, top: 1090, scale: "0.8" }}>
      <Thermo level={0.92} height={480} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: brandFont, fontWeight: 700, fontSize: 34, color: brand.ink, opacity: 0.85 }}>
      <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: "50%", background: brand.orange, marginRight: 14, boxShadow: `0 0 12px ${brand.orange}` }} />
      WILL TE EXPLICA · CLIMA
    </div>
  </AbsoluteFill>
);
