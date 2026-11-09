import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { Particles } from "../fx";
import { clamp, colors, H, W } from "../theme";

const HORIZON = 360;
const PX = 980;
const PY = 780;
const LEVELS = 10;
const SUN = { x: 360, y: HORIZON - 10 };

const bench = (i: number) => {
  const rx = 1250 - i * 118;
  return { rx, ry: rx * 0.27, cy: PY + i * 14 };
};

const ridge = (seed: string, base: number, amp: number, step = 60) => {
  let d = `M -200 ${HORIZON + 40}`;
  for (let x = -200; x <= W + 400; x += step) {
    const y = base - amp * (0.4 + random(`${seed}-${x}`) * 0.6);
    d += ` L ${x} ${y}`;
  }
  return d + ` L ${W + 400} ${HORIZON + 40} Z`;
};

const Truck: React.FC<{ level: number; offset: number; speed: number }> = ({ level, offset, speed }) => {
  const frame = useCurrentFrame();
  const { rx, ry, cy } = bench(level);
  const th = offset + frame * speed;
  const x = PX + (rx - 50) * Math.cos(th);
  const y = cy - 6 + (ry - 18) * Math.sin(th);
  const depth = interpolate(y, [PY - 400, PY + 300], [0.5, 1.5], clamp);
  const dir = -Math.sin(th) * Math.sign(speed);
  return (
    <g transform={`translate(${x} ${y}) scale(${depth * (dir >= 0 ? 1 : -1)} ${depth})`}>
      <rect x={-16} y={-10} width={30} height={10} rx={2} fill="#3a2a1a" />
      <path d="M -14 -10 L -10 -20 L 8 -20 L 12 -10 Z" fill={colors.neonGreen} opacity={0.95} />
      <rect x={10} y={-16} width={9} height={8} rx={1.5} fill="#f2c14e" />
      <circle cx={19} cy={-6} r={2.2} fill="#fff6c8" />
      <circle cx={-10} cy={1} r={3} fill="#111" />
      <circle cx={8} cy={1} r={3} fill="#111" />
    </g>
  );
};

const Excavator: React.FC<{ level: number; angle: number; phase: number }> = ({ level, angle, phase }) => {
  const frame = useCurrentFrame();
  const { rx, ry, cy } = bench(level);
  const x = PX + (rx - 70) * Math.cos(angle);
  const y = cy - 8 + (ry - 22) * Math.sin(angle);
  const depth = interpolate(y, [PY - 400, PY + 300], [0.6, 1.7], clamp);
  const swing = Math.sin(frame / 18 + phase) * 18;
  return (
    <g transform={`translate(${x} ${y}) scale(${depth})`}>
      <rect x={-22} y={-6} width={44} height={8} rx={4} fill="#1d1a16" />
      <rect x={-16} y={-24} width={30} height={18} rx={3} fill="#f2b33d" />
      <rect x={4} y={-22} width={9} height={9} fill="#9fe8ff" opacity={0.8} />
      <g transform={`translate(10 -20) rotate(${-40 + swing})`}>
        <rect x={0} y={-3} width={42} height={6} rx={3} fill="#e0a12f" />
        <g transform={`translate(42 0) rotate(${70 - swing * 1.4})`}>
          <rect x={0} y={-2.5} width={30} height={5} rx={2.5} fill="#e0a12f" />
          <path d="M 28 -6 L 40 -2 L 36 10 L 26 6 Z" fill="#2b2b2b" />
          <circle cx={34} cy={4} r={4} fill={colors.neonGreen} opacity={0.9} />
        </g>
      </g>
    </g>
  );
};

export const S2Escala: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const camX = interpolate(t, [0, 1], [140, -140]);
  const camScale = interpolate(t, [0, 1], [1.18, 1.04]);
  const camRot = interpolate(t, [0, 1], [-1.6, 1.2]);
  const veinPulse = 0.7 + 0.3 * Math.sin(frame / 10);

  return (
    <AbsoluteFill style={{ background: "#1a0f12", overflow: "hidden" }}>
      {/* Sky, sun and far ridges move less than the ground (parallax) */}
      <AbsoluteFill style={{ translate: `${camX * 0.25}px 0`, scale: 1.1, rotate: `${camRot * 0.5}deg` }}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, #2a1846 0%, #8a3b4c 30%, #f08a3a 55%, #ffd27a 68%, #ffb24d 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: SUN.x - 420,
            top: SUN.y - 420,
            width: 840,
            height: 840,
            borderRadius: "50%",
            background: "radial-gradient(circle, #fffbe6 0%, #ffe39a 8%, #ffb34788 22%, transparent 60%)",
          }}
        />
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <path d={ridge("far", HORIZON, 70, 50)} fill="#9b5a6e" opacity={0.55} />
          <path d={ridge("near", HORIZON + 20, 50, 80)} fill="#6e3d48" opacity={0.75} />
        </svg>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          translate: `${camX}px 0`,
          scale: camScale,
          rotate: `${camRot}deg`,
          transformOrigin: `${PX}px ${PY}px`,
        }}
      >
        <svg width={W} height={H} style={{ position: "absolute", overflow: "visible" }}>
          <defs>
            <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#9a5a37" />
              <stop offset="1" stopColor="#3b2216" />
            </linearGradient>
            <linearGradient id="benchTop" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#e09a5a" />
              <stop offset="0.45" stopColor="#a8643a" />
              <stop offset="1" stopColor="#4a2a1c" />
            </linearGradient>
            <linearGradient id="benchWall" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5a3020" />
              <stop offset="1" stopColor="#1e120c" />
            </linearGradient>
            <radialGradient id="pool">
              <stop offset="0" stopColor="#eaffd8" />
              <stop offset="0.3" stopColor={colors.neonGreen} />
              <stop offset="1" stopColor="#0d4a1a" stopOpacity={0} />
            </radialGradient>
            <filter id="neon">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect x={-400} y={HORIZON + 10} width={W + 800} height={H} fill="url(#ground)" />
          {new Array(LEVELS).fill(0).map((_, i) => {
            const { rx, ry, cy } = bench(i);
            return (
              <g key={i}>
                <ellipse cx={PX} cy={cy} rx={rx} ry={ry} fill="url(#benchTop)" />
                <ellipse cx={PX} cy={cy + 14} rx={rx - 40} ry={ry - 12} fill="url(#benchWall)" />
                <ellipse
                  cx={PX}
                  cy={cy + 10}
                  rx={rx - 60}
                  ry={ry - 16}
                  fill="none"
                  stroke={colors.neonGreen}
                  strokeWidth={i % 3 === 1 ? 4 : 2}
                  strokeDasharray={`${40 + i * 13} ${90 + i * 7}`}
                  strokeDashoffset={-frame * (1.5 + i * 0.2)}
                  opacity={(i % 2 === 0 ? 0.45 : 0.8) * veinPulse}
                  filter="url(#neon)"
                />
              </g>
            );
          })}
          <ellipse
            cx={PX}
            cy={bench(LEVELS).cy + 10}
            rx={bench(LEVELS - 1).rx * 0.8}
            ry={bench(LEVELS - 1).ry * 0.8}
            fill="url(#pool)"
            opacity={0.85 * veinPulse + 0.15}
          />
          {[1, 3, 5, 7].map((lv, i) => (
            <Excavator key={`e${i}`} level={lv} angle={0.6 + i * 1.7} phase={i * 2} />
          ))}
          {[0, 2, 4, 6, 8, 3, 5].map((lv, i) => (
            <Truck key={`t${i}`} level={lv} offset={i * 1.3} speed={(i % 2 ? -1 : 1) * (0.006 + (i % 3) * 0.002)} />
          ))}
        </svg>
      </AbsoluteFill>

      {/* Volumetric dust lit by the setting sun */}
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          opacity: 0.5,
          background: `repeating-linear-gradient(${110 + Math.sin(frame / 60) * 2}deg, rgba(255,200,120,0.0) 0px, rgba(255,200,120,0.16) 60px, rgba(255,200,120,0) 160px)`,
          maskImage: `radial-gradient(ellipse 1400px 900px at ${SUN.x + camX * 0.25}px ${SUN.y}px, black 0%, transparent 80%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 900px 300px at ${700 + frame * 1.2}px 620px, rgba(255,190,120,0.28), transparent 70%)`,
          mixBlendMode: "screen",
        }}
      />
      <Particles seed="mine-dust" count={90} color="#ffd9a0" drift={[0.8, -0.15]} size={[1.5, 3.5]} opacity={[0.2, 0.6]} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,170,90,0.12), transparent 40%)" }} />
    </AbsoluteFill>
  );
};
