import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { CUES, KEYWORDS } from "./data";
import { BAR, bodyFont, clamp, colors, titleFont, useSize } from "./theme";

type ParticleOpts = {
  seed: string;
  count: number;
  color: string;
  /** Drift in px per frame (x, y). */
  drift?: [number, number];
  size?: [number, number];
  opacity?: [number, number];
  /** Fraction of particles drawn out of focus (blurred, larger). */
  bokeh?: number;
  area?: { x: number; y: number; w: number; h: number };
};

/** Floating dust/sparks that wrap around the frame. Deterministic per seed. */
export const Particles: React.FC<ParticleOpts> = ({
  seed,
  count,
  color,
  drift = [0.2, -0.6],
  size = [1.5, 4],
  opacity = [0.3, 0.9],
  bokeh = 0.15,
  area: areaProp,
}) => {
  const frame = useCurrentFrame();
  const { W, H } = useSize();
  const area = areaProp ?? { x: 0, y: 0, w: W, h: H };
  const items = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const blurred = r("b") < bokeh;
        return {
          x: r("x") * area.w,
          y: r("y") * area.h,
          s: (size[0] + r("s") * (size[1] - size[0])) * (blurred ? 3 : 1),
          o: opacity[0] + r("o") * (opacity[1] - opacity[0]),
          speed: 0.5 + r("v"),
          phase: r("p") * Math.PI * 2,
          blurred,
        };
      }),
    [seed, count, bokeh, size, opacity, area.w, area.h],
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {items.map((p, i) => {
        const x =
          (((p.x + drift[0] * frame * p.speed + Math.sin(frame / 40 + p.phase) * 12) % area.w) +
            area.w) %
          area.w;
        const y = (((p.y + drift[1] * frame * p.speed) % area.h) + area.h) % area.h;
        const twinkle = 0.6 + 0.4 * Math.sin(frame / 9 + p.phase * 3);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: area.x + x,
              top: area.y + y,
              width: p.s,
              height: p.s,
              borderRadius: "50%",
              background: color,
              opacity: p.o * twinkle * (p.blurred ? 0.45 : 1),
              filter: p.blurred ? "blur(4px)" : undefined,
              boxShadow: p.blurred ? undefined : `0 0 ${p.s * 2}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Animated film grain + vignette shared by all scenes. */
export const FilmLook: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, H } = useSize();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={W} height={H} style={{ position: "absolute", opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 12} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Cinematic black bars, scene label on top and subtitles on the bottom one. */
export const Letterbox: React.FC<{ label: string; labelFrom: number; showCaptions: boolean }> = ({
  label,
  labelFrom,
  showCaptions,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { W, v } = useSize();
  const t = frame / fps;
  const labelOpacity = interpolate(frame - labelFrom, [8, 24, 100, 120], [0, 1, 1, 0], clamp);

  const cue = CUES.find((c) => t >= c.from && t < c.to);
  const cueLocal = cue ? t - cue.from : 0;
  const cueOpacity = cue
    ? interpolate(cueLocal, [0, 0.25, cue.to - cue.from - 0.25, cue.to - cue.from], [0, 1, 1, 0], clamp)
    : 0;

  const words = cue
    ? cue.text.split(" ").map((w, i) => {
        const key = w.toLowerCase().replace(/[^\p{L}]/gu, "");
        const hot = KEYWORDS.has(key);
        return (
          <span
            key={i}
            style={{
              color: hot ? colors.gold : undefined,
              textShadow: hot ? `0 0 18px ${colors.goldDeep}` : v ? "0 4px 18px rgba(0,0,0,0.9)" : undefined,
            }}
          >
            {w}
          </span>
        );
      })
    : null;

  if (v) {
    // Portrait: no bars; label on top, large captions in the lower third.
    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 14%, transparent 62%, rgba(0,0,0,0.7) 100%)" }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 150,
            width: W,
            textAlign: "center",
            fontFamily: titleFont,
            fontSize: 40,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: colors.gold,
            textShadow: "0 2px 12px rgba(0,0,0,0.9)",
            opacity: labelOpacity,
          }}
        >
          {label}
        </div>
        {showCaptions && cue ? (
          <div
            style={{
              position: "absolute",
              left: 70,
              right: 70,
              top: 1420,
              height: 260,
              display: "flex",
              flexWrap: "wrap",
              alignContent: "center",
              justifyContent: "center",
              columnGap: 20,
              fontFamily: bodyFont,
              fontWeight: 800,
              fontSize: 66,
              lineHeight: 1.15,
              textAlign: "center",
              color: colors.white,
              opacity: cueOpacity,
              translate: `0 ${interpolate(cueLocal, [0, 0.3], [14, 0], clamp)}px`,
            }}
          >
            {words}
          </div>
        ) : null}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: BAR, background: colors.black }} />
      <div
        style={{ position: "absolute", left: 0, bottom: 0, width: W, height: BAR, background: colors.black }}
      />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 0,
          height: BAR,
          display: "flex",
          alignItems: "center",
          fontFamily: titleFont,
          fontSize: 30,
          letterSpacing: 10,
          textTransform: "uppercase",
          color: colors.gold,
          opacity: labelOpacity,
        }}
      >
        {label}
      </div>
      {showCaptions && cue ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: W,
            height: BAR,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: 44,
            color: colors.white,
            opacity: cueOpacity,
            translate: `0 ${interpolate(cueLocal, [0, 0.3], [8, 0], clamp)}px`,
            gap: 14,
          }}
        >
          {words}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** Anamorphic lens flare centred on (x, y). */
export const LensFlare: React.FC<{ x: number; y: number; color: string; intensity?: number }> = ({
  x,
  y,
  color,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const { W, H } = useSize();
  const flicker = 0.85 + 0.15 * Math.sin(frame / 5) * Math.sin(frame / 13);
  const o = intensity * flicker;
  const ghosts = [0.35, 0.6, 1.25, 1.6];
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      <div
        style={{
          position: "absolute",
          left: x - 900,
          top: y - 6,
          width: 1800,
          height: 12,
          borderRadius: 6,
          background: `linear-gradient(90deg, transparent, ${color}, white, ${color}, transparent)`,
          opacity: 0.7 * o,
          filter: "blur(3px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 160,
          top: y - 160,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: `radial-gradient(circle, white 0%, ${color}aa 18%, transparent 65%)`,
          opacity: 0.8 * o,
        }}
      />
      {ghosts.map((g, i) => {
        const gx = x + (W / 2 - x) * g * 2;
        const gy = y + (H / 2 - y) * g * 2;
        const s = 40 + i * 30;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: gx - s / 2,
              top: gy - s / 2,
              width: s,
              height: s,
              borderRadius: "50%",
              border: `2px solid ${color}55`,
              background: `${color}18`,
              opacity: o,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
