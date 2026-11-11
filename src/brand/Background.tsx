import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { brand } from "./theme";

/** Near-black stage with a faint dot grid, a warm/cool ambient glow and a vignette. */
export const BrandBackground: React.FC<{ glow?: string; glow2?: string }> = ({ glow = brand.orange, glow2 = brand.blue }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${brand.bg2} 0%, ${brand.bg} 70%)` }}>
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1.6px, transparent 1.6px)",
          backgroundSize: "44px 44px",
          opacity: 0.55,
        }}
      />
      <div style={{ position: "absolute", left: 140 + Math.sin(t / 4) * 60, top: 520 + Math.cos(t / 5) * 40, width: 800, height: 800, borderRadius: "50%", background: `radial-gradient(circle, ${glow}22 0%, transparent 65%)` }} />
      <div style={{ position: "absolute", left: 380 + Math.cos(t / 3.5) * 60, top: 820 + Math.sin(t / 4.5) * 40, width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${glow2}1c 0%, transparent 65%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.75) 100%)" }} />
    </AbsoluteFill>
  );
};
