import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Particles } from "../fx";
import { clamp, colors, H, W } from "../theme";

const CX = 960;
const CY = 640;

type CrystalProps = { x: number; y: number; w: number; h: number; rot: number; shade?: number };

/** A hexagonal prism seen from the front: three body faces and a pointed tip. */
const Crystal: React.FC<CrystalProps> = ({ x, y, w, h, rot, shade = 1 }) => {
  const tip = w * 0.9;
  const a = -w / 2;
  const b = -w / 5;
  const c = w / 5;
  const d = w / 2;
  const apex = `0,${-h - tip}`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={shade}>
      <polygon points={`${a},0 ${b},${w * 0.06} ${b},${-h} ${a},${-h + w * 0.04}`} fill="url(#faceL)" />
      <polygon points={`${b},${w * 0.06} ${c},${w * 0.06} ${c},${-h} ${b},${-h}`} fill="url(#faceC)" />
      <polygon points={`${c},${w * 0.06} ${d},0 ${d},${-h + w * 0.04} ${c},${-h}`} fill="url(#faceR)" />
      <polygon points={`${a},${-h + w * 0.04} ${b},${-h} ${apex}`} fill="#5a3fd0" />
      <polygon points={`${b},${-h} ${c},${-h} ${apex}`} fill="url(#tipC)" />
      <polygon points={`${c},${-h} ${d},${-h + w * 0.04} ${apex}`} fill="#c9f3ff" />
      <polyline
        points={`${b},${w * 0.06} ${b},${-h} 0,${-h - tip} ${c},${-h} ${c},${w * 0.06}`}
        fill="none"
        stroke="white"
        strokeOpacity={0.55}
        strokeWidth={1.5}
      />
    </g>
  );
};

const CRYSTALS: CrystalProps[] = [
  { x: -150, y: 40, w: 70, h: 120, rot: -38, shade: 0.8 },
  { x: 150, y: 50, w: 80, h: 140, rot: 34, shade: 0.85 },
  { x: -80, y: 30, w: 95, h: 220, rot: -16 },
  { x: 95, y: 30, w: 90, h: 200, rot: 14 },
  { x: 0, y: 30, w: 130, h: 300, rot: 0 },
  { x: -40, y: 50, w: 55, h: 90, rot: -60, shade: 0.7 },
  { x: 45, y: 55, w: 60, h: 100, rot: 58, shade: 0.7 },
];

export const S1Origem: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.32], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const reveal = interpolate(frame, [0, 45], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const pulse = 0.75 + 0.25 * Math.sin(frame / 14);

  return (
    <AbsoluteFill style={{ background: "#050308", overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: zoom, transformOrigin: `${CX}px ${CY - 60}px` }}>
        {/* Volcanic rock: turbulence lit as a relief map */}
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <filter id="rock" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.009" numOctaves="6" seed="7" result="n" />
            <feDiffuseLighting in="n" surfaceScale="9" lightingColor="#6d5a7e" result="lit">
              <feDistantLight azimuth="235" elevation="28" />
            </feDiffuseLighting>
            <feComponentTransfer>
              <feFuncR type="gamma" amplitude="0.55" exponent="1.6" />
              <feFuncG type="gamma" amplitude="0.45" exponent="1.6" />
              <feFuncB type="gamma" amplitude="0.6" exponent="1.5" />
            </feComponentTransfer>
          </filter>
          <rect width={W} height={H} filter="url(#rock)" />
        </svg>
        {/* Mineral light spilling onto the rock */}
        <AbsoluteFill
          style={{
            mixBlendMode: "screen",
            opacity: reveal * pulse,
            background: `radial-gradient(ellipse 620px 460px at ${CX}px ${CY - 80}px, ${colors.crystalBlue}99 0%, ${colors.crystalPurple}55 40%, transparent 75%)`,
          }}
        />
        {/* Slow light rays */}
        <AbsoluteFill
          style={{
            mixBlendMode: "screen",
            opacity: 0.22 * reveal,
            background: `repeating-conic-gradient(from ${frame * 0.25}deg at ${CX}px ${CY - 120}px, ${colors.crystalBlue}66 0deg 3deg, transparent 3deg 17deg)`,
            maskImage: `radial-gradient(circle at ${CX}px ${CY - 120}px, black 0%, transparent 55%)`,
          }}
        />
        {/* Cavity the crystals grow from */}
        <div
          style={{
            position: "absolute",
            left: CX - 330,
            top: CY - 20,
            width: 660,
            height: 170,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, #000 30%, transparent 70%)",
          }}
        />
        <svg
          width={W}
          height={H}
          style={{
            position: "absolute",
            filter: `drop-shadow(0 0 ${20 * pulse}px ${colors.crystalBlue}) drop-shadow(0 0 ${60 * pulse}px ${colors.crystalPurple})`,
            opacity: reveal,
          }}
        >
          <defs>
            <linearGradient id="faceL" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#2a0f5c" />
              <stop offset="1" stopColor="#6a3cff" />
            </linearGradient>
            <linearGradient id="faceC" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#5b2bd6" />
              <stop offset="0.6" stopColor="#3fb4ff" />
              <stop offset="1" stopColor="#bff6ff" />
            </linearGradient>
            <linearGradient id="faceR" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#4a2bb0" />
              <stop offset="1" stopColor="#8fe3ff" />
            </linearGradient>
            <linearGradient id="tipC" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#7fd8ff" />
              <stop offset="1" stopColor="#ffffff" />
            </linearGradient>
          </defs>
          <g transform={`translate(${CX} ${CY + 40})`}>
            {CRYSTALS.map((c, i) => (
              <Crystal key={i} {...c} />
            ))}
          </g>
        </svg>
        {/* Inner core glow */}
        <div
          style={{
            position: "absolute",
            left: CX - 70,
            top: CY - 260,
            width: 140,
            height: 260,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.75), transparent 70%)",
            mixBlendMode: "screen",
            opacity: reveal * (0.4 + 0.3 * pulse),
          }}
        />
        <Particles seed="dust1" count={140} color="#cbb8ff" drift={[0.15, -0.35]} size={[1.2, 3.2]} bokeh={0.2} />
      </AbsoluteFill>
      <Particles seed="dust1-fg" count={14} color={colors.crystalBlue} drift={[0.3, -0.5]} size={[6, 12]} bokeh={1} />
    </AbsoluteFill>
  );
};
