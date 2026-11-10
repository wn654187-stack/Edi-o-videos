import React from "react";
import { Pop } from "../../EnemSUS/ui";
import { bodyFont, colors, glow, headlineFont } from "../../EnemSUS/theme";

/** Numbered topic header ("1 · ECOLOGIA"). */
export const Topic: React.FC<{ n: string; name: string; color: string }> = ({ n, name, color }) => (
  <Pop at={1} from="left" style={{ left: 70, top: 230, right: 70 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
      <div
        style={{
          width: 120,
          height: 120,
          flexShrink: 0,
          borderRadius: 30,
          background: color,
          boxShadow: glow(color, 0.9),
          fontFamily: headlineFont,
          fontSize: 92,
          color: colors.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {n}
      </div>
      <div style={{ fontFamily: headlineFont, fontSize: 96, lineHeight: 1, color: colors.white }}>{name}</div>
    </div>
  </Pop>
);

export const Big: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = colors.white, size = 110 }) => (
  <div style={{ fontFamily: headlineFont, fontSize: size, color, lineHeight: 1, textAlign: "center", textShadow: `0 0 26px ${color}88` }}>{children}</div>
);

export const Note: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = colors.white, size = 40 }) => (
  <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: size, color, textAlign: "center", lineHeight: 1.2 }}>{children}</div>
);
