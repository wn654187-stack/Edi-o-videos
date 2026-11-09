import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { at } from "./data";
import { bodyFont, clamp, colors, glow, headlineFont, textGlow } from "./theme";

/** True when the composition is portrait (9:16). */
export const useVertical = () => {
  const { width, height } = useVideoConfig();
  return height > width;
};

/** Frame (relative to the scene start `from`) at which `word` is spoken. */
export const useCue = (from: number) => {
  const { fps } = useVideoConfig();
  return (word: string, after?: number) => Math.round((at(word, after ?? from) - from) * fps);
};

/** Dark blue studio background: drifting glow blobs + subtle dot grid. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill
      style={{ background: `radial-gradient(ellipse at 50% 40%, ${colors.bg2} 0%, ${colors.bg} 75%)` }}
    >
      <div
        style={{
          position: "absolute",
          left: 300 + Math.sin(t / 3) * 120,
          top: 100 + Math.cos(t / 4) * 60,
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.sus}33 0%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 900 + Math.cos(t / 3.5) * 140,
          top: 200 + Math.sin(t / 5) * 80,
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.green}22 0%, transparent 65%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${colors.susNeon}33 2px, transparent 2px)`,
          backgroundSize: "48px 48px",
          backgroundPosition: `${(frame * 0.4) % 48}px 0px`,
          opacity: 0.5,
        }}
      />
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.7) 100%)" }}
      />
    </AbsoluteFill>
  );
};

/** Quick punch-in at the start of each scene. */
export const SceneIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 6], [0, 1], clamp),
        scale: interpolate(frame, [0, 10], [1.06, 1], { ...clamp, easing: Easing.out(Easing.cubic) }),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Springs its children in at frame `at`. */
export const Pop: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  from?: "up" | "down" | "left" | "right" | "scale";
}> = ({ at: start, children, style, from = "up" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - start, fps, config: { damping: 13, stiffness: 170 } });
  const d = interpolate(s, [0, 1], [60, 0]);
  const translate =
    from === "up" ? `0px ${d}px` : from === "down" ? `0px ${-d}px` : from === "left" ? `${-d}px 0px` : from === "right" ? `${d}px 0px` : "0px 0px";
  return (
    <div
      style={{
        position: "absolute",
        opacity: interpolate(s, [0, 0.35], [0, 1], clamp),
        translate,
        scale: from === "scale" ? interpolate(s, [0, 1], [0.4, 1]) : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Title: React.FC<{
  children: React.ReactNode;
  top?: number;
  size?: number;
  color?: string;
  glowColor?: string;
  delay?: number;
}> = ({ children, top, size, color = colors.white, glowColor, delay = 2 }) => {
  const v = useVertical();
  return (
  <Pop at={delay} style={{ left: v ? 60 : 0, right: v ? 60 : 0, top: top ?? (v ? 230 : 92), textAlign: "center" }}>
    <div
      style={{
        fontFamily: headlineFont,
        fontSize: size ?? (v ? 84 : 92),
        color,
        lineHeight: 1.05,
        letterSpacing: 2,
        textTransform: "uppercase",
        textShadow: glowColor ? textGlow(glowColor, 0.9) : "0 6px 0 rgba(0,0,0,0.6)",
      }}
    >
      {children}
    </div>
  </Pop>
  );
};

export const Card: React.FC<{
  color: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ color, children, style }) => (
  <div
    style={{
      borderRadius: 28,
      border: `3px solid ${color}`,
      background: `linear-gradient(160deg, ${color}2e 0%, rgba(5,12,24,0.85) 70%)`,
      boxShadow: glow(color, 0.6),
      color: colors.white,
      fontFamily: bodyFont,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{ color: string; children: React.ReactNode; size?: number }> = ({
  color,
  children,
  size = 34,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 28px",
      borderRadius: 999,
      border: `3px solid ${color}`,
      boxShadow: glow(color, 0.6),
      background: `${color}26`,
      color: colors.white,
      fontFamily: bodyFont,
      fontWeight: 900,
      fontSize: size,
      letterSpacing: 1,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

/* ---------- Icons (simple flat SVGs) ---------- */

export const PersonIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130">
    <circle cx={50} cy={28} r={24} fill={color} />
    <path d="M8 130 Q8 62 50 62 Q92 62 92 130 Z" fill={color} />
  </svg>
);

export const CarteiraIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130">
    <rect x={6} y={4} width={88} height={122} rx={10} fill="#1d4e9e" stroke="#9cc7ff" strokeWidth={4} />
    <rect x={22} y={26} width={56} height={8} rx={4} fill="#ffd65a" />
    <text x={50} y={70} textAnchor="middle" fontSize={15} fontWeight={900} fill="#dfeaff" fontFamily="sans-serif">
      CARTEIRA
    </text>
    <text x={50} y={92} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dfeaff" fontFamily="sans-serif">
      DE TRABALHO
    </text>
  </svg>
);

export const HospitalIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M10 92 V40 L50 12 L90 40 V92 Z" fill={`${color}33`} stroke={color} strokeWidth={5} strokeLinejoin="round" />
    <rect x={40} y={36} width={20} height={44} rx={3} fill={color} />
    <rect x={28} y={48} width={44} height={20} rx={3} fill={color} />
  </svg>
);

export const SyringeIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <g transform="rotate(45 50 50)" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round">
      <rect x={38} y={22} width={24} height={46} rx={4} fill={`${color}33`} />
      <line x1={50} y1={68} x2={50} y2={92} />
      <line x1={50} y1={22} x2={50} y2={8} />
      <line x1={36} y1={8} x2={64} y2={8} />
      <line x1={40} y1={36} x2={50} y2={36} />
      <line x1={40} y1={48} x2={50} y2={48} />
    </g>
  </svg>
);

export const AmbulanceIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M6 70 V34 H62 V46 H80 L94 60 V70 Z" fill={`${color}33`} stroke={color} strokeWidth={5} strokeLinejoin="round" />
    <rect x={28} y={40} width={8} height={22} fill={color} />
    <rect x={21} y={47} width={22} height={8} fill={color} />
    <circle cx={26} cy={74} r={9} fill={color} />
    <circle cx={76} cy={74} r={9} fill={color} />
  </svg>
);

export const HeartIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M50 88 C20 66 8 50 8 33 C8 20 18 10 31 10 C40 10 46 15 50 22 C54 15 60 10 69 10 C82 10 92 20 92 33 C92 50 80 66 50 88 Z"
      fill={`${color}33`}
      stroke={color}
      strokeWidth={5}
    />
    <polyline points="18,46 36,46 44,32 54,60 62,46 82,46" fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" />
  </svg>
);

export const ShieldIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 6 L88 20 V48 C88 72 70 88 50 95 C30 88 12 72 12 48 V20 Z" fill={`${color}33`} stroke={color} strokeWidth={5} />
    <polyline points="32,50 45,63 70,36" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ClockIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={40} fill={`${color}33`} stroke={color} strokeWidth={6} />
    <polyline points="50,24 50,50 68,60" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

export const DoctorIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={28} r={18} fill={`${color}33`} stroke={color} strokeWidth={5} />
    <path d="M16 94 Q16 54 50 54 Q84 54 84 94 Z" fill={`${color}33`} stroke={color} strokeWidth={5} />
    <path d="M38 58 V74 Q38 84 50 84 Q62 84 62 74 V58" fill="none" stroke={color} strokeWidth={4} />
    <circle cx={62} cy={58} r={4} fill={color} />
  </svg>
);

export const CoinIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={40} fill={`${color}33`} stroke={color} strokeWidth={6} />
    <text x={50} y={66} textAnchor="middle" fontSize={44} fontWeight={900} fill={color} fontFamily="sans-serif">
      R$
    </text>
  </svg>
);
