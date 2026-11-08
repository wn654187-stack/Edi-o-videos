import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MAP_COLS, MAP_ROWS, STATES, StateTile } from "./data";
import { bodyFont, clamp, colors, glow, headlineFont, textGlow } from "./theme";

/** Dark studio background with a neon perspective grid that slowly scrolls. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const offset = (frame * 2) % 80;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${colors.bg2} 0%, ${colors.bg} 70%)`,
      }}
    >
      <AbsoluteFill
        style={{
          top: 1100,
          perspective: 600,
          overflow: "hidden",
          opacity: 0.55,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -1000,
            right: -1000,
            top: 0,
            height: 1600,
            transformOrigin: "50% 0%",
            rotate: "x 68deg",
            backgroundImage: `linear-gradient(${colors.blueNeon}55 2px, transparent 2px), linear-gradient(90deg, ${colors.blueNeon}55 2px, transparent 2px)`,
            backgroundSize: "80px 80px",
            backgroundPosition: `0px ${offset}px`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.75) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Quick punch-in at the start of each scene to simulate a hard cut. */
export const SceneIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 5], [0, 1], clamp),
        scale: interpolate(frame, [0, 8], [1.08, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        }),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Big headline that springs in at `delay` frames. */
export const Headline: React.FC<{
  children: React.ReactNode;
  delay?: number;
  top: number;
  size?: number;
  color?: string;
  glowColor?: string;
}> = ({ children, delay = 0, top, size = 120, color = colors.white, glowColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 180 } });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 40,
        right: 40,
        textAlign: "center",
        fontFamily: headlineFont,
        fontSize: size,
        lineHeight: 1.02,
        color,
        textTransform: "uppercase",
        letterSpacing: 2,
        textShadow: glowColor ? textGlow(glowColor) : undefined,
        opacity: interpolate(s, [0, 0.3], [0, 1], clamp),
        scale: interpolate(s, [0, 1], [0.6, 1]),
        translate: `0px ${interpolate(s, [0, 1], [40, 0])}px`,
      }}
    >
      {children}
    </div>
  );
};

/** Small pill label. */
export const Chip: React.FC<{
  children: React.ReactNode;
  color: string;
  style?: React.CSSProperties;
}> = ({ children, color, style }) => (
  <div
    style={{
      display: "inline-block",
      padding: "14px 30px",
      borderRadius: 999,
      border: `3px solid ${color}`,
      boxShadow: glow(color, 0.8),
      color: colors.white,
      background: `${color}22`,
      fontFamily: bodyFont,
      fontWeight: 900,
      fontSize: 40,
      letterSpacing: 1,
      textTransform: "uppercase",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Tile-grid map of the USA. Colours are decided per tile by the caller. */
export const TileMap: React.FC<{
  width: number;
  top: number;
  colorFor: (s: StateTile, i: number) => string;
  opacityFor?: (s: StateTile, i: number) => number;
  scaleFor?: (s: StateTile, i: number) => number;
  label?: "code" | "ev" | "both";
}> = ({ width, top, colorFor, opacityFor, scaleFor, label = "code" }) => {
  const tile = width / MAP_COLS;
  const gap = tile * 0.08;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: (1080 - width) / 2,
        width,
        height: tile * MAP_ROWS,
      }}
    >
      {STATES.map((s, i) => {
        const c = colorFor(s, i);
        return (
          <div
            key={s.code}
            style={{
              position: "absolute",
              left: s.col * tile + gap / 2,
              top: s.row * tile + gap / 2,
              width: tile - gap,
              height: tile - gap,
              borderRadius: tile * 0.14,
              background: `${c}cc`,
              border: `2px solid ${c}`,
              boxShadow: glow(c, 0.5),
              opacity: opacityFor ? opacityFor(s, i) : 1,
              scale: scaleFor ? scaleFor(s, i) : 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: colors.white,
              fontFamily: bodyFont,
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {label !== "ev" ? (
              <span style={{ fontSize: tile * 0.3 }}>{s.code}</span>
            ) : null}
            {label !== "code" ? (
              <span style={{ fontSize: tile * (label === "ev" ? 0.36 : 0.24), opacity: 0.9 }}>
                {s.ev}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
