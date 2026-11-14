import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { brand, brandFont, clamp } from "./theme";

export type HookLine = { text: string; color?: string; size?: number };

/**
 * Giant opening title shown from frame 0 (the "cover as first second"): stops the scroll
 * before the scene underneath is readable. Punches in slightly, then clears at `until`.
 */
export const HookTitle: React.FC<{ lines: HookLine[]; until?: number; top?: number }> = ({ lines, until = 66, top = 520 }) => {
  const frame = useCurrentFrame();
  if (frame > until + 10) return null;
  const out = interpolate(frame, [until, until + 10], [1, 0], clamp);
  const zoom = interpolate(frame, [0, until], [1.06, 1], clamp);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, rgba(7,7,11,0.82) 0%, rgba(7,7,11,0.94) 70%)" }} />
      <div style={{ position: "absolute", left: 50, right: 50, top, textAlign: "center", fontFamily: brandFont, scale: zoom, translate: `0px ${(1 - out) * -40}px` }}>
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontWeight: 800,
              fontSize: l.size ?? 150,
              lineHeight: 0.95,
              letterSpacing: -5,
              color: l.color ?? brand.ink,
              textShadow: l.color ? `0 0 60px ${l.color}99` : "0 6px 30px #000",
              marginTop: i ? 14 : 0,
            }}
          >
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
};
