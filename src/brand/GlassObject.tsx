import React, { useId } from "react";
import { useCurrentFrame } from "remotion";

/**
 * The brand "hero object" material: any SVG shape rendered as dark glass with
 * slowly moving blurred colour light inside, a top-left reflection, a thin
 * bright rim and an outer glow. Each video builds its own themed object from it
 * (thermometer, star, shield, gauge, price tag...).
 */
export const GlassObject: React.FC<{
  w: number;
  h: number;
  /** Shape outline in the w×h coordinate space. */
  d: string;
  colors: string[];
  glow?: string;
  /** Extra SVG drawn inside the glass (clipped), e.g. dial ticks. */
  inner?: React.ReactNode;
  /** Extra SVG drawn over the glass (not clipped), e.g. a needle. */
  over?: React.ReactNode;
  /** HTML content centred over the object. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ w, h, d, colors, glow, inner, over, children, style }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const id = useId().replace(/:/g, "");
  const m = Math.min(w, h);
  const pad = m * 0.3;
  return (
    <div style={{ position: "relative", width: w, height: h, ...style }}>
      <svg
        width={w + pad * 2}
        height={h + pad * 2}
        viewBox={`${-pad} ${-pad} ${w + pad * 2} ${h + pad * 2}`}
        style={{ position: "absolute", left: -pad, top: -pad, overflow: "visible" }}
      >
        <defs>
          <clipPath id={`c${id}`}>
            <path d={d} />
          </clipPath>
          <filter id={`b${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={m * 0.13} />
          </filter>
          <filter id={`g${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={m * 0.08} />
          </filter>
          <filter id={`h${id}`}>
            <feGaussianBlur stdDeviation={6} />
          </filter>
          <linearGradient id={`f${id}`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor="#2a2236" stopOpacity={0.8} />
            <stop offset="1" stopColor="#08080e" stopOpacity={0.95} />
          </linearGradient>
          <linearGradient id={`r${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity={0.55} />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity={0.08} />
            <stop offset="1" stopColor="#ffffff" stopOpacity={0.3} />
          </linearGradient>
        </defs>
        {/* outer glow */}
        <path d={d} fill={glow ?? colors[0]} opacity={0.28 + 0.06 * Math.sin(t * 2)} filter={`url(#g${id})`} />
        <path d={d} fill={`url(#f${id})`} />
        <g clipPath={`url(#c${id})`}>
          <g filter={`url(#b${id})`} style={{ mixBlendMode: "screen" }}>
            {colors.map((c, i) => (
              <circle
                key={i}
                cx={w * (0.5 + 0.32 * Math.sin(t * (0.5 + i * 0.17) + i * 2.1))}
                cy={h * (0.55 + 0.3 * Math.cos(t * (0.42 + i * 0.13) + i))}
                r={m * 0.32}
                fill={c}
                opacity={i === 2 ? 0.6 : 0.9}
              />
            ))}
          </g>
          {inner}
          <ellipse
            cx={w * 0.3}
            cy={h * 0.18}
            rx={w * 0.26}
            ry={h * 0.09}
            fill="#ffffff"
            opacity={0.16}
            transform={`rotate(-20 ${w * 0.3} ${h * 0.18})`}
            filter={`url(#h${id})`}
          />
        </g>
        <path d={d} fill="none" stroke={`url(#r${id})`} strokeWidth={3} strokeLinejoin="round" />
        {over}
      </svg>
      {children ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
      ) : null}
    </div>
  );
};

/** Regular star outline (n points) centred in a w×w box. */
export const starPath = (w: number, n = 5, inner = 0.42) => {
  const c = w / 2;
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = (i % 2 ? inner : 1) * c * 0.96;
    const a = -Math.PI / 2 + (i * Math.PI) / n;
    pts.push(`${(c + r * Math.cos(a)).toFixed(1)} ${(c + r * Math.sin(a) + w * 0.04).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
};

/** Small glowing particles drifting upwards around a hero object. */
export const Sparks: React.FC<{ w: number; h: number; color: string; n?: number }> = ({ w, h, color, n = 7 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const s = 8 + ((i * 7) % 10);
        const x = w * ((i * 0.618) % 1);
        const y = h - ((frame * (0.6 + (i % 3) * 0.3) + i * 97) % (h + 40));
        return (
          <div
            key={i}
            style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: color, boxShadow: `0 0 ${s * 2}px ${color}`, opacity: 0.75 }}
          />
        );
      })}
    </div>
  );
};
