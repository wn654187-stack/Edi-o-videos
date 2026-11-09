import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { LensFlare, Particles } from "../fx";
import { clamp, colors, H, W } from "../theme";

const ORB_R = 74;

/** Glass column with glowing liquid and rising bubbles. */
const Tube: React.FC<{ x: number; top: number; h: number; w: number; fill: number; color: string; seed: string }> = ({
  x,
  top,
  h,
  w,
  fill,
  color,
  seed,
}) => {
  const frame = useCurrentFrame();
  const liquidTop = top + h * (1 - fill);
  const wave = Math.sin(frame / 8 + x) * 3;
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} rx={w / 2} fill="rgba(180,240,255,0.05)" stroke="rgba(200,250,255,0.35)" strokeWidth={2} />
      <clipPath id={`clip-${seed}`}>
        <rect x={x + 4} y={top + 4} width={w - 8} height={h - 8} rx={(w - 8) / 2} />
      </clipPath>
      <g clipPath={`url(#clip-${seed})`}>
        <rect x={x} y={liquidTop + wave} width={w} height={h} fill={color} opacity={0.75} />
        <rect x={x} y={liquidTop + wave} width={w} height={6} fill="white" opacity={0.6} />
        {new Array(8).fill(0).map((_, i) => {
          const bx = x + 8 + random(`${seed}-bx-${i}`) * (w - 16);
          const speed = 1.5 + random(`${seed}-bv-${i}`) * 2.5;
          const span = top + h - liquidTop;
          const by = top + h - ((frame * speed + random(`${seed}-by-${i}`) * span) % span);
          return <circle key={i} cx={bx} cy={by} r={2 + random(`${seed}-br-${i}`) * 4} fill="white" opacity={0.55} />;
        })}
      </g>
      <rect x={x + w * 0.18} y={top + 20} width={w * 0.12} height={h - 40} rx={w * 0.06} fill="white" opacity={0.25} />
    </g>
  );
};

const BASE = { x: 1520, y: 830 };
const SEG1 = 300;
const SEG2 = 250;
const GRIP = 118;

/** Joint angles (degrees) and the resulting orb centre for a given frame. */
const armPose = (frame: number) => {
  const sway = Math.sin(frame / 30) * 2.5;
  const a1 = -118 + sway;
  const a2 = -58 - sway * 1.4;
  const a3 = 6 + sway * 0.6;
  const r = (d: number) => (d * Math.PI) / 180;
  const t1 = r(a1);
  const t12 = r(a1 + a2);
  const t123 = r(a1 + a2 + a3);
  const orb = {
    x: BASE.x + SEG1 * Math.cos(t1) + SEG2 * Math.cos(t12) + GRIP * Math.cos(t123),
    y: BASE.y + SEG1 * Math.sin(t1) + SEG2 * Math.sin(t12) + GRIP * Math.sin(t123),
  };
  return { a1, a2, a3, orb };
};

/** Robotic arm holding a liquid-silver sphere with a slowly rippling surface. */
const ArmAndOrb: React.FC = () => {
  const frame = useCurrentFrame();
  const { a1, a2, a3, orb } = armPose(frame);
  const metal = "url(#metal)";
  return (
    <svg width={W} height={H} style={{ position: "absolute", overflow: "visible" }}>
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f7fb" />
          <stop offset="0.5" stopColor="#aab4c3" />
          <stop offset="1" stopColor="#566173" />
        </linearGradient>
        <radialGradient id="joint">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#7d8899" />
          <stop offset="1" stopColor="#2c3340" />
        </radialGradient>
        <radialGradient id="silver" cx="0.36" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.25" stopColor="#e8eef6" />
          <stop offset="0.6" stopColor="#8c99ab" />
          <stop offset="0.85" stopColor="#3b4656" />
          <stop offset="1" stopColor="#9fe9ff" />
        </radialGradient>
        <filter id="ripple" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency={0.016 + 0.004 * Math.sin(frame / 20)} numOctaves="2" seed={3} />
          <feDisplacementMap in="SourceGraphic" scale={6} />
        </filter>
      </defs>
      <rect x={BASE.x - 130} y={880} width={260} height={70} rx={14} fill="#1b222c" />
      <rect x={BASE.x - 80} y={820} width={160} height={80} rx={18} fill={metal} />
      <circle cx={orb.x} cy={orb.y} r={ORB_R * 2} fill={colors.cyan} opacity={0.14} style={{ filter: "blur(30px)" }} />
      <g transform={`translate(${BASE.x} ${BASE.y}) rotate(${a1})`}>
        <rect x={-30} y={-26} width={SEG1 + 30} height={52} rx={26} fill={metal} />
        <rect x={30} y={-6} width={SEG1 - 80} height={4} fill={colors.cyan} opacity={0.8} />
        <circle r={44} fill="url(#joint)" />
        <g transform={`translate(${SEG1} 0) rotate(${a2})`}>
          <rect x={-22} y={-20} width={SEG2 + 22} height={40} rx={20} fill={metal} />
          <rect x={30} y={-4} width={SEG2 - 70} height={3} fill={colors.cyan} opacity={0.8} />
          <circle r={34} fill="url(#joint)" />
          <g transform={`translate(${SEG2} 0) rotate(${a3})`}>
            <circle r={26} fill="url(#joint)" />
            <rect x={0} y={-18} width={40} height={36} rx={8} fill="#c9d1dc" />
            <g filter="url(#ripple)">
              <circle cx={GRIP} cy={0} r={ORB_R} fill="url(#silver)" />
            </g>
            <path d={`M 36 -16 C 50 -${ORB_R + 20}, ${GRIP + 40} -${ORB_R + 20}, ${GRIP + 50} -30`} stroke="#c9d1dc" strokeWidth={11} fill="none" strokeLinecap="round" />
            <path d={`M 36 16 C 50 ${ORB_R + 20}, ${GRIP + 40} ${ORB_R + 20}, ${GRIP + 50} 30`} stroke="#c9d1dc" strokeWidth={11} fill="none" strokeLinecap="round" />
          </g>
        </g>
      </g>
      {/* Specular highlight stays fixed to the light, not the gripper */}
      <ellipse cx={orb.x - 24} cy={orb.y - 30} rx={22} ry={12} fill="white" opacity={0.85} transform={`rotate(-30 ${orb.x - 24} ${orb.y - 30})`} />
    </svg>
  );
};

export const S3Alquimia: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const track = interpolate(t, [0, 1], [120, -120]);
  const { orb } = armPose(frame);

  return (
    <AbsoluteFill style={{ background: "#03090d", overflow: "hidden" }}>
      {/* Far wall: blurred tubes and bokeh (shallow depth of field) */}
      <AbsoluteFill style={{ translate: `${track * 0.35}px 0`, filter: "blur(7px)", opacity: 0.85 }}>
        <AbsoluteFill
          style={{ background: "radial-gradient(ellipse at 50% 40%, #0c2a33 0%, #03090d 70%)" }}
        />
        <svg width={W + 400} height={H} style={{ position: "absolute", left: -200 }}>
          {new Array(11).fill(0).map((_, i) => (
            <Tube
              key={i}
              seed={`far${i}`}
              x={80 + i * 190}
              top={200 + (i % 3) * 40}
              h={560 - (i % 3) * 60}
              w={70}
              fill={0.45 + random(`ff${i}`) * 0.4}
              color={i % 4 === 0 ? colors.magenta : colors.cyan}
            />
          ))}
          <rect x={0} y={300} width={W + 400} height={10} fill="rgba(160,240,255,0.25)" />
        </svg>
        <Particles seed="bokeh" count={22} color={colors.cyan} drift={[0, -0.1]} size={[18, 40]} opacity={[0.1, 0.35]} bokeh={1} />
      </AbsoluteFill>
      {/* Ceiling neon strips */}
      <AbsoluteFill style={{ translate: `${track * 0.6}px 0` }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 120 + i * 480,
              top: 150,
              width: 340,
              height: 8,
              borderRadius: 4,
              background: colors.white,
              boxShadow: `0 0 20px ${colors.cyan}, 0 0 60px ${colors.cyan}`,
              opacity: 0.85,
            }}
          />
        ))}
      </AbsoluteFill>
      {/* Lab bench */}
      <AbsoluteFill style={{ translate: `${track * 0.8}px 0` }}>
        <div
          style={{
            position: "absolute",
            left: -300,
            top: 900,
            width: W + 600,
            height: 200,
            background: "linear-gradient(180deg, #a9c6cf 0%, #2a3a40 6%, #0b1215 100%)",
          }}
        />
      </AbsoluteFill>
      {/* Subject in focus */}
      <AbsoluteFill style={{ translate: `${track}px 0` }}>
        <ArmAndOrb />
      </AbsoluteFill>
      <LensFlare x={orb.x - 24 + track} y={orb.y - 30} color={colors.cyan} intensity={0.75} />
      {/* Foreground glass passing out of focus */}
      <AbsoluteFill style={{ translate: `${track * 2.2}px 0`, filter: "blur(16px)", opacity: 0.7 }}>
        <svg width={W} height={H} style={{ position: "absolute" }}>
          <Tube seed="fg" x={140} top={120} h={1000} w={150} fill={0.55} color={colors.cyan} />
        </svg>
      </AbsoluteFill>
      <Particles seed="lab-motes" count={50} color="#bff8ff" drift={[0.1, -0.2]} size={[1, 2.5]} opacity={[0.2, 0.6]} />
    </AbsoluteFill>
  );
};
