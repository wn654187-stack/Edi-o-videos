import React from "react";
import { AbsoluteFill, Easing, interpolate, random, Sequence, useCurrentFrame } from "remotion";
import { Particles } from "../fx";
import { clamp, colors, H, W } from "../theme";

const CUT1 = 70;
const CUT2 = 145;

/** Speed-ramped shot wrapper: whip blur in/out at the edges. */
const Shot: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const frame = useCurrentFrame();
  const inBlur = interpolate(frame, [0, 8], [40, 0], clamp);
  const outBlur = interpolate(frame, [len - 8, len], [0, 40], clamp);
  const shift = interpolate(frame, [0, 8], [260, 0], { ...clamp, easing: Easing.out(Easing.cubic) }) +
    interpolate(frame, [len - 8, len], [0, -260], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ filter: `blur(${inBlur + outBlur}px)`, translate: `${shift}px 0`, overflow: "hidden" }}>
      {children}
    </AbsoluteFill>
  );
};

const Microchip: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 45, CUT1], [1, 1.5, 5], { ...clamp, easing: Easing.in(Easing.exp) });
  const size = 420;
  const x0 = (W - size) / 2;
  const y0 = (H - size) / 2;
  const traces = new Array(28).fill(0).map((_, i) => {
    const side = i % 4;
    const k = Math.floor(i / 4);
    const off = -150 + k * 50;
    const len = 300 + random(`tr${i}`) * 400;
    const bend = 60 + random(`tb${i}`) * 120;
    const cx = W / 2;
    const cy = H / 2;
    const pts =
      side === 0
        ? [[cx + off, y0], [cx + off, y0 - bend], [cx + off + bend, y0 - bend - 40], [cx + off + bend, y0 - len]]
        : side === 1
          ? [[cx + off, y0 + size], [cx + off, y0 + size + bend], [cx + off - bend, y0 + size + bend + 40], [cx + off - bend, y0 + size + len]]
          : side === 2
            ? [[x0, cy + off], [x0 - bend, cy + off], [x0 - bend - 40, cy + off + bend], [x0 - len, cy + off + bend]]
            : [[x0 + size, cy + off], [x0 + size + bend, cy + off], [x0 + size + bend + 40, cy + off - bend], [x0 + size + len, cy + off - bend]];
    return { d: `M ${pts.map((p) => p.join(" ")).join(" L ")}`, len: len + bend * 2 };
  });
  return (
    <AbsoluteFill style={{ background: "#020a08", scale: zoom }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="die" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2b2f38" />
            <stop offset="1" stopColor="#0c0e12" />
          </linearGradient>
        </defs>
        {traces.map((t, i) => (
          <g key={i}>
            <path d={t.d} stroke="#0f5a3f" strokeWidth={4} fill="none" />
            <path
              d={t.d}
              stroke={colors.neonGreen}
              strokeWidth={4}
              fill="none"
              strokeDasharray={`60 ${t.len}`}
              strokeDashoffset={-((frame * 14 + i * 37) % (t.len + 60)) + t.len}
              style={{ filter: `drop-shadow(0 0 6px ${colors.neonGreen})` }}
            />
          </g>
        ))}
        {new Array(4).fill(0).flatMap((_, s) =>
          new Array(12).fill(0).map((__, j) => {
            const p = 30 + j * 32;
            const [x, y, w, h] =
              s === 0 ? [x0 + p, y0 - 18, 14, 18] : s === 1 ? [x0 + p, y0 + size, 14, 18] : s === 2 ? [x0 - 18, y0 + p, 18, 14] : [x0 + size, y0 + p, 18, 14];
            return <rect key={`${s}-${j}`} x={x} y={y} width={w} height={h} fill={colors.gold} />;
          }),
        )}
        <rect x={x0} y={y0} width={size} height={size} rx={18} fill="url(#die)" stroke="#555c6a" strokeWidth={3} />
        <rect x={x0 + 110} y={y0 + 110} width={200} height={200} rx={8} fill="#0d1a17" stroke={colors.cyan} strokeWidth={2} />
        <rect
          x={x0 + 140}
          y={y0 + 140}
          width={140}
          height={140}
          fill={colors.cyan}
          opacity={0.35 + 0.35 * Math.sin(frame / 4)}
          style={{ filter: `blur(10px)` }}
        />
        <text x={W / 2} y={y0 + 70} textAnchor="middle" fill="#9aa4b5" fontSize={26} fontFamily="monospace" letterSpacing={6}>
          Nd·Dy·Tb
        </text>
      </svg>
    </AbsoluteFill>
  );
};

const Turbine: React.FC<{ x: number; y: number; s: number; speed: number; phase: number }> = ({ x, y, s, speed, phase }) => {
  const frame = useCurrentFrame();
  const a = frame * speed + phase;
  const blade = (deg: number, o: number) => (
    <path
      key={`${deg}-${o}`}
      d="M -6 0 C -10 -120, -4 -300, 2 -330 C 8 -300, 10 -120, 6 0 Z"
      transform={`rotate(${deg})`}
      fill="#f3f6fa"
      opacity={o}
    />
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -14 0 L -6 -520 L 6 -520 L 14 0 Z" fill="#e6ebf2" />
      <g transform="translate(0 -520)">
        <rect x={-30} y={-14} width={60} height={28} rx={12} fill="#dfe5ee" />
        {[0, 120, 240].flatMap((b) => [blade(a + b - 8, 0.15), blade(a + b - 4, 0.3), blade(a + b, 1)])}
        <circle r={14} fill="#c8d0dc" />
      </g>
    </g>
  );
};

const MistyMountain: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame;
  const rise = interpolate(local, [0, CUT2 - CUT1], [80, -40]);
  const ridge = (seed: string, base: number, amp: number) => {
    let d = `M -100 ${H}`;
    for (let x = -100; x <= W + 200; x += 90) {
      d += ` L ${x} ${base - amp * random(`${seed}${x}`)}`;
    }
    return d + ` L ${W + 200} ${H} Z`;
  };
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #6f8fb8 0%, #c9d6e6 55%, #eef2f6 100%)" }}>
      <AbsoluteFill style={{ translate: `${-local * 1.5}px ${rise * 0.4}px` }}>
        <svg width={W + 400} height={H} style={{ position: "absolute" }}>
          <path d={ridge("m1", 640, 160)} fill="#8ea3bd" />
          <Turbine x={500} y={600} s={0.35} speed={7} phase={10} />
          <Turbine x={1500} y={580} s={0.3} speed={7.5} phase={70} />
          <path d={ridge("m2", 760, 140)} fill="#62778f" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 45%, rgba(240,244,250,0.85) 75%)" }} />
      <AbsoluteFill style={{ translate: `${-local * 3}px ${rise}px` }}>
        <svg width={W + 600} height={H + 200} style={{ position: "absolute", overflow: "visible" }}>
          <path d="M -100 1200 L 600 760 Q 900 640 1200 760 L 2200 1200 Z" fill="#33414f" />
          <Turbine x={960} y={770} s={0.78} speed={6} phase={0} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 1200px 220px at ${(local * 9) % (W + 1200) - 600}px 820px, rgba(255,255,255,0.7), transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const CyberCity: React.FC = () => {
  const frame = useCurrentFrame();
  const layer = (seed: string, speed: number, base: number, maxH: number, tint: string, windowColor: string) => {
    const scroll = (frame * speed) % 2400;
    return (
      <AbsoluteFill style={{ translate: `${-scroll}px 0` }}>
        {new Array(40).fill(0).map((_, i) => {
          const w = 90 + random(`${seed}w${i}`) * 140;
          const h = 200 + random(`${seed}h${i}`) * maxH;
          const x = i * 120;
          const neon = [colors.magenta, colors.cyan, "#ffb347"][i % 3];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: base - h,
                width: w,
                height: h,
                background: tint,
                backgroundImage: `repeating-linear-gradient(90deg, transparent 0 14px, ${windowColor} 14px 22px), repeating-linear-gradient(0deg, transparent 0 20px, ${tint} 20px 34px)`,
                borderTop: `3px solid ${neon}`,
                boxShadow: `0 -6px 24px ${neon}55`,
              }}
            />
          );
        })}
      </AbsoluteFill>
    );
  };
  const carBob = Math.sin(frame / 3) * 1.5;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #07041a 0%, #2a0b45 55%, #12051f 100%)" }}>
      {layer("c1", 6, 640, 420, "#140c2c", "rgba(120,200,255,0.18)")}
      {layer("c2", 16, 720, 380, "#0b0718", "rgba(255,80,220,0.28)")}
      {/* Wet road with reflections */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 720,
          width: W,
          height: H - 720,
          background: "linear-gradient(180deg, #1a0f30 0%, #05030b 100%)",
        }}
      />
      <AbsoluteFill style={{ top: 720, translate: `${-((frame * 60) % 240)}px 0` }}>
        {new Array(14).fill(0).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: i * 240, top: 150, width: 120, height: 8, background: "#ffe08a", opacity: 0.8 }} />
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ top: 730, opacity: 0.35, filter: "blur(6px)", transform: "scaleY(-0.6)", transformOrigin: "50% 0%" }}>
        {layer("c2", 16, 720, 380, "#0b0718", "rgba(255,80,220,0.5)")}
      </AbsoluteFill>
      {/* Light streaks */}
      {new Array(16).fill(0).map((_, i) => {
        const y = 760 + random(`ls${i}`) * 260;
        const x = W - ((frame * (70 + random(`lv${i}`) * 50) + random(`lx${i}`) * 3000) % 3000);
        const c = i % 2 ? colors.cyan : colors.magenta;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 420,
              height: 4,
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${c})`,
              boxShadow: `0 0 12px ${c}`,
            }}
          />
        );
      })}
      {/* Electric sports car */}
      <svg width={W} height={H} style={{ position: "absolute", translate: `0 ${carBob}px` }}>
        <defs>
          <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e9f1ff" />
            <stop offset="0.45" stopColor="#7b8aa8" />
            <stop offset="1" stopColor="#1b2133" />
          </linearGradient>
        </defs>
        <ellipse cx={960} cy={905} rx={420} ry={26} fill={colors.cyan} opacity={0.55} style={{ filter: "blur(14px)" }} />
        <path
          d="M 590 880 C 600 840, 640 820, 720 810 L 820 760 C 900 728, 1060 722, 1150 752 L 1260 800 C 1320 808, 1350 830, 1352 870 L 1350 890 L 590 890 Z"
          fill="url(#body)"
        />
        <path d="M 840 768 C 910 742, 1050 738, 1130 762 L 1180 798 L 800 800 Z" fill="#0d1424" opacity={0.92} />
        <path d="M 600 860 L 1345 860" stroke={colors.cyan} strokeWidth={3} style={{ filter: `drop-shadow(0 0 8px ${colors.cyan})` }} />
        <rect x={1320} y={826} width={30} height={8} rx={4} fill="#ffffff" style={{ filter: "drop-shadow(0 0 14px white)" }} />
        <rect x={592} y={834} width={22} height={8} rx={4} fill="#ff2950" style={{ filter: "drop-shadow(0 0 10px #ff2950)" }} />
        {[720, 1200].map((cx) => (
          <g key={cx} transform={`translate(${cx} 890) rotate(${frame * 40})`}>
            <circle r={46} fill="#0a0c12" />
            <circle r={30} fill="#3a4152" />
            <path d="M -30 0 L 30 0 M 0 -30 L 0 30" stroke="#8a93a8" strokeWidth={5} />
          </g>
        ))}
      </svg>
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, rgba(10,0,30,0.6), transparent 25%, transparent 75%, rgba(10,0,30,0.6))`,
        }}
      />
    </AbsoluteFill>
  );
};

export const S5Aplicacao: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = (at: number) => interpolate(frame, [at - 4, at, at + 6], [0, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence durationInFrames={CUT1} layout="none">
        <Shot len={CUT1}>
          <Microchip />
        </Shot>
      </Sequence>
      <Sequence from={CUT1} durationInFrames={CUT2 - CUT1} layout="none">
        <Shot len={CUT2 - CUT1}>
          <MistyMountain />
        </Shot>
      </Sequence>
      <Sequence from={CUT2} layout="none">
        <Shot len={1000}>
          <CyberCity />
          <Particles seed="rain" count={60} color="#b9c7ff" drift={[-6, 14]} size={[1, 2]} opacity={[0.2, 0.5]} bokeh={0} />
        </Shot>
      </Sequence>
      <AbsoluteFill style={{ background: "white", opacity: Math.max(flash(CUT1), flash(CUT2)) * 0.85 }} />
    </AbsoluteFill>
  );
};
