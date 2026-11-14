import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Baloo2";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] });

const stroke = (c: string, w: number): React.CSSProperties => ({ WebkitTextStroke: `${w}px ${c}`, paintOrder: "stroke fill" });

/** Vertical cover (1080×1920) for the "Gira, Gira, Água" music clip. */
export const GiraAguaCover: React.FC = () => (
  <AbsoluteFill>
    <Img src={staticFile("gira/q7.png")} style={{ width: "100%", height: "100%", objectFit: "cover", scale: "1.04" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(16,36,92,0.55) 0%, rgba(16,36,92,0) 38%, rgba(16,36,92,0) 70%, rgba(16,36,92,0.6) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontFamily, fontWeight: 800, lineHeight: 0.95 }}>
      <div style={{ fontSize: 170, color: "#ffffff", ...stroke("#1d3b8f", 18), textShadow: "0 12px 0 #10245c" }}>Gira, Gira,</div>
      <div style={{ fontSize: 210, color: "#ffe14d", ...stroke("#1d3b8f", 20), textShadow: "0 14px 0 #10245c" }}>Água!</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 300, textAlign: "center" }}>
      <span style={{ display: "inline-block", padding: "14px 46px 6px", borderRadius: 999, background: "#2f9bff", border: "10px solid #ffffff", boxShadow: "0 12px 0 rgba(0,0,0,0.25)", fontFamily, fontWeight: 800, fontSize: 66, color: "#ffffff", ...stroke("rgba(0,0,0,0.25)", 4) }}>
        a música do ciclo da água 💧
      </span>
    </div>
  </AbsoluteFill>
);
