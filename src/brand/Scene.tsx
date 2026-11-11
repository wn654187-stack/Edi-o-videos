import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { LabelCard } from "./Glass";
import { IconName } from "./Icons";
import { Accent, clamp } from "./theme";

/**
 * Standard brand scene: label card on top, a hero visual in the middle
 * (children, absolutely positioned between y≈470 and y≈1150) and the
 * captions below. `instant` renders the opening scene fully on frame 0.
 */
export const BrandScene: React.FC<{
  label: string;
  title: React.ReactNode;
  icon: IconName;
  accent: Accent;
  instant?: boolean;
  children?: React.ReactNode;
}> = ({ label, title, icon, accent, instant, children }) => {
  const frame = useCurrentFrame();
  const fade = instant ? 1 : interpolate(frame, [0, 6], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      {children}
      <LabelCard label={label} title={title} icon={icon} accent={accent} instant={instant} />
    </AbsoluteFill>
  );
};

/** Centers the hero visual horizontally at a given vertical position. */
export const Hero: React.FC<{ top: number; children: React.ReactNode }> = ({ top, children }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}>{children}</div>
);
