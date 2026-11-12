import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { GlassObject, Sparks } from "../brand/GlassObject";
import { brand, brandFont, clamp } from "../brand/theme";

/** Glass rain cloud with falling drops. */
export const Cloud: React.FC<{ size?: number; rain?: boolean }> = ({ size = 1, rain = true }) => {
  const frame = useCurrentFrame();
  const W = 300 * size;
  const H = 180 * size;
  const d = `M${60 * size} ${170 * size} C${10 * size} ${170 * size} ${0} ${110 * size} ${50 * size} ${95 * size} C${50 * size} ${40 * size} ${120 * size} ${10 * size} ${165 * size} ${50 * size} C${190 * size} ${15 * size} ${265 * size} ${30 * size} ${255 * size} ${90 * size} C${305 * size} ${95 * size} ${305 * size} ${170 * size} ${245 * size} ${170 * size} Z`;
  return (
    <div style={{ position: "relative", width: W, height: H + 120 * size }}>
      <GlassObject w={W} h={H} d={d} colors={[brand.blueSoft, brand.blue, brand.ink]} glow={brand.blue} />
      {rain
        ? Array.from({ length: 7 }).map((_, i) => {
            const y = ((frame * 6 + i * 37) % (110 * size)) + H - 10 * size;
            return <div key={i} style={{ position: "absolute", left: (40 + i * 34) * size, top: y, width: 6 * size, height: 26 * size, borderRadius: 4, background: brand.blueSoft, opacity: 0.85, boxShadow: `0 0 10px ${brand.blue}` }} />;
          })
        : null}
    </div>
  );
};

/** Glass sun with rotating rays. */
export const Sun: React.FC<{ size?: number }> = ({ size = 1 }) => {
  const frame = useCurrentFrame();
  const R = 110 * size;
  return (
    <div style={{ position: "relative", width: R * 3, height: R * 3 }}>
      <svg width={R * 3} height={R * 3} style={{ position: "absolute", inset: 0, rotate: `${frame * 0.5}deg`, overflow: "visible" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={R * 1.5 - 9 * size} y={0} width={18 * size} height={50 * size} rx={9 * size} fill={i % 2 ? brand.orangeSoft : brand.lime} transform={`rotate(${i * 30} ${R * 1.5} ${R * 1.5})`} style={{ filter: `drop-shadow(0 0 8px ${brand.orange})` }} />
        ))}
      </svg>
      <GlassObject w={R * 2} h={R * 2} d={`M${R} 0 A${R} ${R} 0 1 1 ${R - 0.1} 0 Z`} colors={[brand.orange, brand.orangeSoft, brand.lime]} style={{ position: "absolute", left: R / 2, top: R / 2 }} />
    </div>
  );
};

/** Glass fish (pesca). */
export const Fish: React.FC<{ size?: number; color?: string }> = ({ size = 1, color = brand.lime }) => {
  const frame = useCurrentFrame();
  const s = size;
  return (
    <div style={{ translate: `0px ${Math.sin(frame / 8) * 8}px` }}>
      <GlassObject
        w={300 * s}
        h={150 * s}
        d={`M${10 * s} ${75 * s} C${60 * s} ${5 * s} ${170 * s} ${5 * s} ${225 * s} ${60 * s} L${290 * s} ${15 * s} L${280 * s} ${75 * s} L${290 * s} ${135 * s} L${225 * s} ${90 * s} C${170 * s} ${145 * s} ${60 * s} ${145 * s} ${10 * s} ${75 * s} Z`}
        colors={[color, brand.blue, brand.blueSoft]}
        over={<circle cx={60 * s} cy={65 * s} r={9 * s} fill={brand.ink} />}
      />
    </div>
  );
};

/** Glass coffee cup with steam. */
export const Cup: React.FC<{ size?: number }> = ({ size = 1 }) => {
  const frame = useCurrentFrame();
  const s = size;
  return (
    <div style={{ position: "relative", width: 300 * s, height: 300 * s }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: (70 + i * 45) * s, top: (10 - ((frame + i * 20) % 60) * 0.6) * s + 20 * s, width: 14 * s, height: 60 * s, borderRadius: 10, background: "#ffffff40", filter: "blur(4px)", opacity: 1 - ((frame + i * 20) % 60) / 60 }} />
      ))}
      <GlassObject
        w={300 * s}
        h={210 * s}
        style={{ position: "absolute", top: 90 * s }}
        d={`M${20 * s} ${10 * s} H${220 * s} V${20 * s} C${300 * s} ${10 * s} ${300 * s} ${120 * s} ${215 * s} ${115 * s} C${200 * s} ${170 * s} ${160 * s} ${200 * s} ${120 * s} ${200 * s} C${60 * s} ${200 * s} ${20 * s} ${150 * s} ${20 * s} ${90 * s} Z`}
        colors={[brand.orangeSoft, brand.orange, brand.lime]}
      />
    </div>
  );
};

/** Glass lightning bolt (energia). */
export const Bolt: React.FC<{ size?: number }> = ({ size = 1 }) => {
  const s = size;
  return <GlassObject w={200 * s} h={300 * s} d={`M${120 * s} 0 L${20 * s} ${170 * s} H${95 * s} L${70 * s} ${300 * s} L${185 * s} ${110 * s} H${110 * s} L${150 * s} 0 Z`} colors={[brand.lime, brand.orange, brand.lime]} glow={brand.lime} />;
};

/** Glass seesaw: El Niño vs La Niña, tilting with `tilt` (-1..1). */
export const Seesaw: React.FC<{ tilt: number }> = ({ tilt }) => {
  const ang = tilt * 12;
  return (
    <div style={{ position: "relative", width: 900, height: 420 }}>
      <div style={{ position: "absolute", left: 50, top: 150, width: 800, rotate: `${ang}deg`, transformOrigin: "50% 50%" }}>
        <GlassObject w={800} h={40} d="M20 0 H780 Q800 0 800 20 Q800 40 780 40 H20 Q0 40 0 20 Q0 0 20 0 Z" colors={[brand.orange, brand.ink, brand.blue]} />
        <div style={{ position: "absolute", left: 20, top: -150 }}>
          <GlassObject w={160} h={150} d="M80 0 A75 75 0 1 1 79.9 0 Z" colors={[brand.orange, brand.orangeSoft, brand.orange]}>
            <div style={{ fontFamily: brandFont, fontWeight: 800, fontSize: 28, color: brand.ink, textAlign: "center", lineHeight: 1.1 }}>El<br />Niño</div>
          </GlassObject>
        </div>
        <div style={{ position: "absolute", right: 20, top: -150 }}>
          <GlassObject w={160} h={150} d="M80 0 A75 75 0 1 1 79.9 0 Z" colors={[brand.blue, brand.blueSoft, brand.blue]}>
            <div style={{ fontFamily: brandFont, fontWeight: 800, fontSize: 28, color: brand.ink, textAlign: "center", lineHeight: 1.1 }}>La<br />Niña</div>
          </GlassObject>
        </div>
      </div>
      <div style={{ position: "absolute", left: 380, top: 190 }}>
        <GlassObject w={140} h={180} d="M70 0 L140 180 H0 Z" colors={[brand.lime, brand.blue, brand.lime]} />
      </div>
    </div>
  );
};

/** Glass thermometer whose column follows `level` (0..1). */
export const Thermo: React.FC<{ level: number; height?: number }> = ({ level, height = 520 }) => {
  const H = height;
  const col = (H - 200) * level;
  return (
    <div style={{ position: "relative" }}>
      <GlassObject
        w={170}
        h={H}
        d={`M45 60 A40 40 0 0 1 125 60 V${H - 160} A85 85 0 1 1 45 ${H - 160} Z`}
        colors={[brand.blueSoft, brand.orange, brand.blue]}
        glow={brand.orange}
        inner={
          <>
            <rect x={67} y={H - 120 - col} width={36} height={col + 40} rx={18} fill={brand.orange} style={{ filter: `drop-shadow(0 0 14px ${brand.orange})` }} />
            <circle cx={85} cy={H - 90} r={62} fill={brand.orange} />
          </>
        }
      />
      <Sparks w={170} h={H} color={brand.orangeSoft} n={4} />
    </div>
  );
};

/** Glossy subscribe button with a cursor click. */
export const SubscribeButton: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const click = frame >= at + 18;
  const k = interpolate(frame, [at, at + 10], [0, 1], clamp);
  const cx = interpolate(frame, [at + 4, at + 16], [180, 0], clamp);
  return (
    <div style={{ position: "relative", opacity: k, scale: interpolate(k, [0, 1], [0.7, 1]) }}>
      <div style={{ padding: "22px 48px", borderRadius: 999, background: click ? "#2a2838" : brand.orange, color: brand.ink, fontFamily: brandFont, fontWeight: 800, fontSize: 40, boxShadow: click ? "none" : `0 0 40px ${brand.orange}88`, border: "2px solid rgba(255,255,255,0.25)" }}>
        {click ? "INSCRITO ✓" : "INSCREVA-SE"}
      </div>
      <svg width={60} height={70} viewBox="0 0 24 28" style={{ position: "absolute", left: 230 + cx, top: 50 + cx * 0.3 }}>
        <path d="M2 2 L2 22 L7 17 L11 26 L14 25 L10 16 L17 16 Z" fill={brand.ink} stroke={brand.bg} strokeWidth={1.5} />
      </svg>
    </div>
  );
};
