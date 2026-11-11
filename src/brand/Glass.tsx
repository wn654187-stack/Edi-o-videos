import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon, IconName } from "./Icons";
import { Accent, accentColor, brand, brandFont, clamp, onAccent, softGlow } from "./theme";

/** Frosted dark panel with a thin accent border. */
export const GlassCard: React.FC<{ accent?: Accent | "none"; style?: React.CSSProperties; children: React.ReactNode }> = ({ accent = "none", style, children }) => {
  const c = accent === "none" ? brand.glassBorder : accentColor(accent);
  return (
    <div
      style={{
        borderRadius: 30,
        background: "linear-gradient(160deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
        border: `3px solid ${accent === "none" ? c : `${c}cc`}`,
        boxShadow: accent === "none" ? "0 20px 60px rgba(0,0,0,0.45)" : `0 20px 60px rgba(0,0,0,0.45), ${softGlow(c, 0.6)}`,
        color: brand.ink,
        fontFamily: brandFont,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** The scene header: small label, accent icon tile and a big title (as in "Quem sou eu / Humano"). */
export const LabelCard: React.FC<{ label: string; title: React.ReactNode; icon: IconName; accent: Accent; instant?: boolean }> = ({ label, title, icon, accent, instant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = instant ? 1 : spring({ frame: frame - 1, fps, config: { damping: 14, stiffness: 170 } });
  const c = accentColor(accent);
  return (
    <div style={{ position: "absolute", left: 70, top: 225, width: 940, opacity: interpolate(s, [0, 0.4], [0, 1], clamp), translate: `0px ${interpolate(s, [0, 1], [-30, 0])}px` }}>
      <GlassCard accent={accent} style={{ padding: "22px 34px 26px" }}>
        <div style={{ fontWeight: 600, fontSize: 30, color: brand.muted }}>{label}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 12 }}>
          <div style={{ width: 104, height: 104, flexShrink: 0, borderRadius: 24, background: c, boxShadow: `0 10px 0 ${c}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={icon} color={onAccent(accent)} />
          </div>
          <div style={{ fontWeight: 800, fontSize: 70, lineHeight: 1.02, letterSpacing: -1, color: brand.ink }}>{title}</div>
        </div>
      </GlassCard>
    </div>
  );
};

/** Springs children in at frame `at` (no-op when `at` <= 0 and `instant`). */
export const Reveal: React.FC<{ at: number; style?: React.CSSProperties; children: React.ReactNode; from?: "up" | "scale" | "left" }> = ({ at, style, children, from = "up" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = at <= 0 ? 1 : spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 170 } });
  const d = interpolate(s, [0, 1], [50, 0]);
  return (
    <div
      style={{
        position: "absolute",
        opacity: interpolate(s, [0, 0.35], [0, 1], clamp),
        translate: from === "up" ? `0px ${d}px` : from === "left" ? `${-d}px 0px` : undefined,
        scale: from === "scale" ? interpolate(s, [0, 1], [0.6, 1]) : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Pill button / chip. */
export const Pill: React.FC<{ accent?: Accent; solid?: boolean; size?: number; children: React.ReactNode }> = ({ accent = "lime", solid, size = 36, children }) => {
  const c = accentColor(accent);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 34px",
        borderRadius: 999,
        background: solid ? c : "rgba(255,255,255,0.06)",
        border: `3px solid ${c}`,
        boxShadow: softGlow(c, 0.5),
        color: solid ? onAccent(accent) : brand.ink,
        fontFamily: brandFont,
        fontWeight: 800,
        fontSize: size,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

/** Mid-video call to action shown just above the captions for a few seconds. */
export const BrandPrompt: React.FC<{ at: number; duration?: number; accent?: Accent; children: React.ReactNode }> = ({ at, duration = 90, accent = "lime", children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || frame > at + duration) return null;
  const s = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 200 } });
  const out = interpolate(frame, [at + duration - 8, at + duration], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1160, textAlign: "center", opacity: Math.min(interpolate(s, [0, 0.3], [0, 1], clamp), out), scale: interpolate(s, [0, 1], [0.6, 1]) }}>
      <Pill accent={accent} solid>
        {children}
      </Pill>
    </div>
  );
};
