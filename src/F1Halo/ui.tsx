import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { colors } from "./theme";

/** Night-race background: dark gradient, drifting speed lines and a red glow. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 35%, ${colors.bg2} 0%, ${colors.bg} 70%)` }}>
      {new Array(26).fill(0).map((_, i) => {
        const y = random(`ly${i}`) * 1920;
        const speed = 18 + random(`ls${i}`) * 30;
        const len = 120 + random(`ll${i}`) * 260;
        const x = ((random(`lx${i}`) * 1600 + frame * speed) % 1700) - 300;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: len,
              height: 3,
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${i % 5 === 0 ? colors.red : "#ffffff"}44)`,
            }}
          />
        );
      })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.8) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Flickering fire glow from the bottom of the frame; `amount` 0..1. */
export const FireGlow: React.FC<{ amount: number }> = ({ amount }) => {
  const frame = useCurrentFrame();
  if (amount <= 0) return null;
  const flick = 0.85 + 0.15 * Math.sin(frame / 2.3) * Math.cos(frame / 3.7);
  return (
    <AbsoluteFill
      style={{
        opacity: amount * flick,
        background: `radial-gradient(ellipse at 50% 100%, ${colors.fire}cc 0%, ${colors.orange}88 25%, ${colors.red}44 45%, transparent 70%)`,
        mixBlendMode: "screen",
      }}
    />
  );
};

/** Short camera shake starting at frame `at`. */
export const useShake = (start: number, strength = 26, length = 14) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  if (t < 0 || t > length) return "0px 0px";
  const k = interpolate(t, [0, length], [1, 0]);
  return `${Math.sin(t * 3.1) * strength * k}px ${Math.cos(t * 2.3) * strength * k}px`;
};

/** Top-down F1 car (nose pointing right). Two halves so it can split. */
export const CarTopDown: React.FC<{ width: number; split?: number; color?: string }> = ({ width, split = 0, color = colors.red }) => {
  const h = width * 0.36;
  const rear = (
    <g>
      <rect x={4} y={26} width={36} height={92} rx={6} fill="#111" />
      <rect x={30} y={44} width={110} height={56} rx={18} fill={color} />
      <rect x={60} y={0} width={46} height={34} rx={8} fill="#151515" />
      <rect x={60} y={110} width={46} height={34} rx={8} fill="#151515" />
    </g>
  );
  const front = (
    <g>
      <path d="M140 48 L300 60 Q330 72 300 84 L140 96 Z" fill={color} />
      <ellipse cx={170} cy={72} rx={26} ry={16} fill="#0c0c0c" />
      <path d="M150 58 Q170 40 192 58" fill="none" stroke="#c9ced8" strokeWidth={7} />
      <rect x={196} y={4} width={44} height={32} rx={8} fill="#151515" />
      <rect x={196} y={108} width={44} height={32} rx={8} fill="#151515" />
      <rect x={300} y={26} width={22} height={92} rx={5} fill="#111" />
    </g>
  );
  return (
    <svg width={width} height={h} viewBox="0 0 330 144" style={{ overflow: "visible" }}>
      <g transform={`translate(${-split * 40} ${split * 12}) rotate(${-split * 14} 140 72)`}>{rear}</g>
      <g transform={`translate(${split * 40} ${-split * 8}) rotate(${split * 10} 140 72)`}>{front}</g>
    </svg>
  );
};

/** Side view of the cockpit with the halo; `highlight` 0..1 makes the halo glow. */
export const HaloSide: React.FC<{ width: number; highlight: number }> = ({ width, highlight }) => (
  <svg width={width} height={width * 0.55} viewBox="0 0 400 220">
    <path d="M10 170 L80 140 L300 130 Q370 132 390 160 L390 185 L10 190 Z" fill={colors.red} />
    <circle cx={90} cy={188} r={30} fill="#111" stroke="#333" strokeWidth={6} />
    <circle cx={320} cy={188} r={30} fill="#111" stroke="#333" strokeWidth={6} />
    <circle cx={190} cy={118} r={24} fill="#f4f4f4" />
    <path d="M196 106 H214 Q216 118 208 122 H196 Z" fill="#1b2a44" />
    <rect x={166} y={96} width={10} height={20} rx={4} fill={colors.red} />
    <path
      d="M135 140 Q150 70 225 72 L270 140"
      fill="none"
      stroke={highlight > 0 ? colors.blue : "#b7bcc8"}
      strokeWidth={12}
      strokeLinecap="round"
      style={{ filter: highlight > 0 ? `drop-shadow(0 0 ${18 * highlight}px ${colors.blue})` : undefined }}
    />
    <line x1={225} y1={72} x2={232} y2={140} stroke={highlight > 0 ? colors.blue : "#b7bcc8"} strokeWidth={10} strokeLinecap="round" />
  </svg>
);
