import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { cellOf, isRareEarth, SYMBOLS } from "../data";
import { Particles } from "../fx";
import { clamp, colors, titleFont, useSize } from "../theme";

const GAP = 4;

type Lay = ReturnType<typeof useLayout>;

const useLayout = () => {
  const { W, H, v } = useSize();
  const CELL = v ? 54 : 44;
  const TABLE = { x: (W - 18 * CELL) / 2, y: v ? 380 : 150 };
  const HORIZON = v ? 1520 : 860;
  const TOWER = v ? 1220 : 680;
  const LANTH_FOCUS = { x: TABLE.x + 10 * CELL, y: TABLE.y + 8 * CELL + 16 + CELL / 2 };
    return { W, H, v, CELL, TABLE, HORIZON, TOWER, LANTH_FOCUS };
};

const cellXY = ({ TABLE, CELL }: Lay, z: number) => {
  const { col, row } = cellOf(z);
  return {
    x: TABLE.x + (col - 1) * CELL,
    y: TABLE.y + (row - 1) * CELL + (row >= 9 ? 16 : 0),
  };
};


const Hologram: React.FC<{ dim: number }> = ({ dim }) => {
  const frame = useCurrentFrame();
  const lay = useLayout();
  const { W, H, CELL, TABLE, LANTH_FOCUS, v } = lay;
  const flicker = 0.9 + 0.1 * Math.sin(frame * 1.7) * Math.sin(frame * 0.31);
  const goldOn = (z: number) => {
    const order = z === 21 ? 0 : z === 39 ? 1 : z - 55;
    return interpolate(frame, [20 + order * 4, 32 + order * 4], [0, 1], clamp);
  };
  return (
    <AbsoluteFill style={{ opacity: dim * flicker }}>
      <svg width={W} height={H} style={{ position: "absolute", overflow: "visible" }}>
        <defs>
          <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="2" fill="rgba(160,255,255,0.12)" />
          </pattern>
        </defs>
        {SYMBOLS.map((sym, i) => {
          const z = i + 1;
          const { x, y } = cellXY(lay, z);
          const rare = isRareEarth(z);
          const g = rare ? goldOn(z) : 0;
          const stroke = rare ? (g > 0.5 ? colors.gold : colors.cyan) : colors.cyan;
          return (
            <g key={z} style={rare && g > 0 ? { filter: `drop-shadow(0 0 ${10 * g}px ${colors.gold})` } : undefined}>
              <rect
                x={x + GAP / 2}
                y={y + GAP / 2}
                width={CELL - GAP}
                height={CELL - GAP}
                rx={4}
                fill={rare ? `rgba(255,190,60,${0.08 + 0.5 * g})` : "rgba(80,230,255,0.07)"}
                stroke={stroke}
                strokeOpacity={rare ? 0.5 + 0.5 * g : 0.45}
                strokeWidth={rare ? 2 : 1.2}
              />
              <text
                x={x + CELL / 2}
                y={y + CELL / 2 + (v ? 8 : 6)}
                textAnchor="middle"
                fontFamily="Inter, sans-serif"
                fontWeight={700}
                fontSize={v ? 22 : 17}
                fill={rare && g > 0.5 ? "#fff3c4" : "#9ff3ff"}
                opacity={rare ? 0.7 + 0.3 * g : 0.55}
              >
                {sym}
              </text>
            </g>
          );
        })}
        <rect x={TABLE.x - 20} y={TABLE.y - 20} width={18 * CELL + 40} height={10 * CELL + 56} fill="url(#scan)" />
        <text
          x={LANTH_FOCUS.x}
          y={TABLE.y + 10 * CELL + 70}
          textAnchor="middle"
          fontFamily={titleFont}
          fontSize={v ? 30 : 24}
          letterSpacing={8}
          fill={colors.gold}
          opacity={interpolate(frame, [70, 100], [0, 1], clamp)}
        >
          17 ELEMENTOS · TERRAS RARAS
        </text>
      </svg>
    </AbsoluteFill>
  );
};

const City: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, H, HORIZON, TOWER, v } = useLayout();
  const tall = v ? 1.9 : 1;
  const buildings = new Array(26).fill(0).map((_, i) => {
    const w = 46 + random(`bw${i}`) * 60;
    const h = (70 + random(`bh${i}`) * 150 * (0.4 + Math.abs(i - 13) / 13)) * tall;
    return { x: i * 75 - 20, w, h, round: random(`br${i}`) > 0.5 };
  });
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="tower" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffd8b0" />
          <stop offset="0.5" stopColor="#e9eef0" />
          <stop offset="1" stopColor="#7d93a0" />
        </linearGradient>
      </defs>
      {/* far green hills */}
      <path d={`M 0 ${HORIZON} Q 400 ${HORIZON - 70} 800 ${HORIZON - 20} T ${W} ${HORIZON - 40} L ${W} ${H} L 0 ${H} Z`} fill="#3f7a5a" />
      {buildings.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={HORIZON + 40 - b.h} width={b.w} height={b.h} rx={b.round ? 16 : 4} fill="url(#tower)" opacity={0.92} />
          {/* hanging gardens */}
          {new Array(Math.floor(b.h / 70)).fill(0).map((__, k) => (
            <rect key={k} x={b.x - 3} y={HORIZON + 40 - b.h + 40 + k * 70} width={b.w + 6} height={6} rx={3} fill="#3fae6a" />
          ))}
          <ellipse cx={b.x + b.w / 2} cy={HORIZON + 40 - b.h} rx={b.w / 2 + 4} ry={9} fill="#52c27c" />
          <circle cx={b.x + b.w + 6} cy={HORIZON + 30} r={16} fill="#2f8f57" />
        </g>
      ))}
      {/* central projector tower */}
      <rect x={W / 2 - 24} y={TOWER} width={48} height={HORIZON + 40 - TOWER} rx={18} fill="url(#tower)" />
      <circle cx={W / 2} cy={TOWER} r={22} fill="#e8ffff" style={{ filter: `drop-shadow(0 0 20px ${colors.cyan})` }} />
      {/* small turbines on the hills */}
      {(v ? [90, 990] : [180, 320, 1620, 1760]).map((x, i) => (
        <g key={x} transform={`translate(${x} ${HORIZON - 30})`}>
          <rect x={-2} y={-90} width={4} height={90} fill="#f0f4f7" />
          <g transform={`translate(0 -90) rotate(${frame * 5 + i * 40})`}>
            {[0, 120, 240].map((a) => (
              <rect key={a} x={-1.5} y={-38} width={3} height={38} fill="#f0f4f7" transform={`rotate(${a})`} />
            ))}
          </g>
        </g>
      ))}
      {/* green foreground parks + water */}
      <rect x={0} y={HORIZON + 40} width={W} height={H - HORIZON} fill="#245c45" />
      <rect x={0} y={HORIZON + 90} width={W} height={60} fill="#f4a36b" opacity={0.35} />
    </svg>
  );
};

export const S6Futuro: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, CELL, TABLE, HORIZON, TOWER, LANTH_FOCUS, v } = useLayout();
  const pull = interpolate(frame, [0, 200], [2.3, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const dim = interpolate(frame, [190, 220], [1, 0.35], clamp);
  const title = interpolate(frame, [200, 235], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const beam = 0.35 + 0.1 * Math.sin(frame / 6);

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: pull, transformOrigin: `${LANTH_FOCUS.x}px ${LANTH_FOCUS.y}px` }}>
        <AbsoluteFill
          style={{
            background: "linear-gradient(180deg, #2b1747 0%, #a2456b 38%, #f28a4a 62%, #ffd38a 76%, #ffd38a 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: W - 540,
            top: HORIZON - 260,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, #fff8e0 0%, #ffd27a 14%, #ff9a4a66 35%, transparent 65%)",
          }}
        />
        <City />
        {/* Projection beam */}
        <div
          style={{
            position: "absolute",
            left: TABLE.x,
            top: TABLE.y + 10 * CELL,
            width: 18 * CELL,
            height: TOWER - (TABLE.y + 10 * CELL),
            clipPath: "polygon(0 0, 100% 0, 52% 100%, 48% 100%)",
            background: `linear-gradient(0deg, ${colors.cyan}cc, ${colors.cyan}11)`,
            opacity: beam * dim,
            mixBlendMode: "screen",
          }}
        />
        <Hologram dim={dim} />
        <Particles seed="pollen" count={60} color="#fff0c0" drift={[0.3, -0.25]} size={[1.5, 3]} opacity={[0.3, 0.8]} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: title,
          background: `radial-gradient(ellipse 900px 300px at 50% 46%, rgba(0,0,0,${0.55 * title}), transparent 70%)`,
        }}
      >
        <div
          style={{
            fontFamily: titleFont,
            fontWeight: 700,
            fontSize: v ? 170 : 150,
            lineHeight: 1.05,
            textAlign: "center",
            letterSpacing: interpolate(title, [0, 1], v ? [30, 12] : [40, 18]),
            color: colors.gold,
            textShadow: `0 0 30px ${colors.goldDeep}, 0 0 80px ${colors.goldDeep}88`,
            marginTop: -60,
          }}
        >
          {v ? (
            <>
              TERRAS
              <br />
              RARAS
            </>
          ) : (
            "TERRAS RARAS"
          )}
        </div>
        <div
          style={{
            fontFamily: titleFont,
            fontSize: v ? 34 : 38,
            letterSpacing: v ? 8 : 14,
            color: colors.white,
            marginTop: 6,
            opacity: interpolate(frame, [225, 250], [0, 1], clamp),
          }}
        >
          O PODER DO NOSSO FUTURO
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
