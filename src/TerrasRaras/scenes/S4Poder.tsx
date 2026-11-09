import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Particles } from "../fx";
import { clamp, colors, H, W } from "../theme";

const C = { x: 960, y: 470 };
const SIZE = 220;
const LOOPS = [170, 250, 350, 470];
const PLANES = 8;
const TILT = 0.18;

/** Point on a dipole field line r = L·sin²θ in a plane rotated by phi around the vertical axis. */
const fieldPoint = (L: number, theta: number, phi: number) => {
  const r = L * Math.sin(theta) ** 2;
  const x = r * Math.sin(theta);
  const y = -r * Math.cos(theta);
  const X = x * Math.cos(phi);
  const Z = x * Math.sin(phi);
  return { x: C.x + X, y: C.y + y + Z * TILT, z: Z };
};

const MetalCube: React.FC<{ rot: number; bob: number }> = ({ rot, bob }) => {
  const face = (transform: string, shade: string) => (
    <div
      style={{
        position: "absolute",
        width: SIZE,
        height: SIZE,
        transform,
        background: `linear-gradient(135deg, #ffffff 0%, ${shade} 35%, #5f6b7c 70%, #e9eef5 100%)`,
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow: "inset 0 0 40px rgba(0,0,0,0.35)",
      }}
    />
  );
  const h = SIZE / 2;
  return (
    <div
      style={{
        position: "absolute",
        left: C.x - h,
        top: C.y - h + bob,
        width: SIZE,
        height: SIZE,
        perspective: 1400,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: SIZE,
          height: SIZE,
          transformStyle: "preserve-3d",
          transform: `rotateX(-22deg) rotateY(${rot}deg) rotateZ(4deg)`,
        }}
      >
        {face(`translateZ(${h}px)`, "#c3ccd8")}
        {face(`rotateY(180deg) translateZ(${h}px)`, "#9aa5b4")}
        {face(`rotateY(90deg) translateZ(${h}px)`, "#aeb8c6")}
        {face(`rotateY(-90deg) translateZ(${h}px)`, "#8d98a8")}
        {face(`rotateX(90deg) translateZ(${h}px)`, "#f2f5fa")}
        {face(`rotateX(-90deg) translateZ(${h}px)`, "#4b5563")}
      </div>
    </div>
  );
};

export const S4Poder: React.FC = () => {
  const frame = useCurrentFrame();
  const orbit = frame * 0.014;
  const bob = Math.sin(frame / 20) * 10;
  const appear = interpolate(frame, [0, 40], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  const lines: { d: string; z: number; L: number; phi: number }[] = [];
  for (let k = 0; k < PLANES; k++) {
    const phi = (k / PLANES) * Math.PI * 2 + orbit;
    for (const L of LOOPS) {
      const pts: string[] = [];
      let zSum = 0;
      for (let i = 0; i <= 48; i++) {
        const th = 0.12 + (i / 48) * (Math.PI - 0.24);
        const p = fieldPoint(L * appear, th, phi);
        zSum += p.z;
        pts.push(`${p.x.toFixed(1)},${(p.y + bob).toFixed(1)}`);
      }
      lines.push({ d: `M ${pts.join(" L ")}`, z: zSum / 49, L, phi });
    }
  }
  lines.sort((a, b) => a.z - b.z);

  const sparks = lines.flatMap((ln, li) =>
    [0, 0.5].map((off, j) => {
      const u = (frame * 0.008 + off + li * 0.137) % 1;
      const th = 0.12 + u * (Math.PI - 0.24);
      const p = fieldPoint(ln.L * appear, th, ln.phi);
      return { key: `${li}-${j}`, x: p.x, y: p.y + bob, z: p.z };
    }),
  );

  const depthOpacity = (z: number) => interpolate(z, [-400, 400], [0.25, 1], clamp);

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #10162a 0%, #030409 70%)", overflow: "hidden" }}>
      <Particles seed="space" count={80} color="#9fb6ff" drift={[-0.6, 0]} size={[1, 2.2]} opacity={[0.2, 0.6]} bokeh={0.1} />
      {/* Pedestal */}
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="ped" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#141a26" />
            <stop offset="0.5" stopColor="#3a4559" />
            <stop offset="1" stopColor="#0d1119" />
          </linearGradient>
        </defs>
        <ellipse cx={C.x} cy={950} rx={420} ry={70} fill="#000" opacity={0.6} />
        <rect x={C.x - 260} y={820} width={520} height={130} fill="url(#ped)" />
        <ellipse cx={C.x} cy={950} rx={260} ry={42} fill="#0d1119" />
        <ellipse cx={C.x} cy={820} rx={260} ry={42} fill="#202a3b" />
        <ellipse
          cx={C.x}
          cy={820}
          rx={230}
          ry={34}
          fill="none"
          stroke={colors.cyan}
          strokeWidth={5}
          opacity={0.6 + 0.4 * Math.sin(frame / 8)}
          style={{ filter: `drop-shadow(0 0 12px ${colors.cyan})` }}
        />
        <ellipse cx={C.x} cy={820} rx={150} ry={22} fill="none" stroke={colors.gold} strokeWidth={3} opacity={0.8} />
      </svg>
      {/* Light cone from pedestal to cube */}
      <div
        style={{
          position: "absolute",
          left: C.x - 240,
          top: C.y + 60,
          width: 480,
          height: 760,
          background: `linear-gradient(0deg, ${colors.cyan}55, transparent 70%)`,
          clipPath: "polygon(35% 0, 65% 0, 100% 100%, 0 100%)",
          opacity: 0.5,
          mixBlendMode: "screen",
        }}
      />
      <svg width={W} height={H} style={{ position: "absolute", filter: `drop-shadow(0 0 6px ${colors.gold})` }}>
        {lines
          .filter((l) => l.z < 0)
          .map((l, i) => (
            <path key={`b${i}`} d={l.d} fill="none" stroke={colors.gold} strokeWidth={1.4} strokeDasharray="2 10" strokeDashoffset={-frame * 1.2} opacity={depthOpacity(l.z) * 0.8} />
          ))}
        {sparks
          .filter((s) => s.z < 0)
          .map((s) => (
            <circle key={s.key} cx={s.x} cy={s.y} r={2.5} fill="#fff1c2" opacity={depthOpacity(s.z)} />
          ))}
      </svg>
      <div style={{ filter: `drop-shadow(0 0 30px ${colors.cyan}88) drop-shadow(0 30px 40px rgba(0,0,0,0.6))`, position: "absolute", inset: 0, opacity: appear }}>
        <MetalCube rot={frame * 0.9 + 20} bob={bob} />
      </div>
      <svg width={W} height={H} style={{ position: "absolute", filter: `drop-shadow(0 0 8px ${colors.gold})` }}>
        {lines
          .filter((l) => l.z >= 0)
          .map((l, i) => (
            <path key={`f${i}`} d={l.d} fill="none" stroke={colors.gold} strokeWidth={2} strokeDasharray="3 9" strokeDashoffset={-frame * 1.2} opacity={depthOpacity(l.z)} />
          ))}
        {sparks
          .filter((s) => s.z >= 0)
          .map((s) => (
            <circle key={s.key} cx={s.x} cy={s.y} r={3.5} fill="#fff6d6" opacity={depthOpacity(s.z)} />
          ))}
      </svg>
      <Particles seed="golddust" count={70} color={colors.gold} drift={[0.25, -0.4]} size={[1.5, 3.5]} opacity={[0.3, 0.9]} bokeh={0.2} area={{ x: 460, y: 120, w: 1000, h: 760 }} />
    </AbsoluteFill>
  );
};
