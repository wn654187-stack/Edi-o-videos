import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, clamp, colors, glow } from "../EnemSUS/theme";

/**
 * Mid-video call to action ("+ SEGUE…", "COMENTA…") shown just above the captions
 * for a few seconds, while most viewers are still watching.
 */
export const PromptPill: React.FC<{ at: number; duration?: number; color?: string; textColor?: string; children: React.ReactNode }> = ({
  at,
  duration = 90,
  color = colors.red,
  textColor = colors.white,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || frame > at + duration) return null;
  const s = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 200 } });
  const out = interpolate(frame, [at + duration - 8, at + duration], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1170, textAlign: "center", opacity: Math.min(interpolate(s, [0, 0.3], [0, 1], clamp), out), scale: interpolate(s, [0, 1], [0.6, 1]) }}>
      <div style={{ display: "inline-block", padding: "16px 40px", borderRadius: 999, background: color, boxShadow: glow(color, 0.8), fontFamily: bodyFont, fontWeight: 900, fontSize: 38, color: textColor }}>
        {children}
      </div>
    </div>
  );
};
