import React, { useMemo } from "react";
import { AbsoluteFill, Audio, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-50m.json";
import narration from "./narration.json";
import { BrandCaptions } from "../brand/Captions";
import { brandFont, clamp } from "../brand/theme";

type Word = { text: string; start: number; end: number };
const WORDS: Word[] = narration.words;
const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const at = (word: string, after = 0) => {
  const n = norm(word);
  const w = WORDS.find((x) => x.start >= after - 0.05 && norm(x.text) === n);
  if (!w) throw new Error(`cue not found: ${word}`);
  return w.start;
};
export const HIROSHIMA_SECONDS = Math.ceil(WORDS[WORDS.length - 1].end + 2.2);

const T = {
  s2: at("6 de agosto de 1945") - 0.1,
  s3: at("Em") - 0.05,
  s4: at("Três") - 0.1,
  s5: at("Às") - 0.1,
  s6: at("Em", at("rendeu.")) - 0.1,
  s7: at("No", at("leucemia.")) - 0.05,
  s8: at("Sadako", at("viver.")) - 0.1,
};

const colorOf = (w: string) => {
  const n = norm(w);
  if (["hiroshima", "nagasaki", "fogo", "140mil", "74mil", "leucemia"].includes(n)) return "#ff9b6e";
  if (["kokura", "nuvem", "nuvens"].includes(n)) return "#c9defa";
  if (["sadako", "tsurus", "tsuru", "viver", "paz", "1000tsurus"].includes(n)) return "#ffd77a";
  return null;
};

const CRANES = ["#e85a4f", "#f2b33d", "#4f8fd6", "#e46aa6", "#6dbb6a", "#f4efe4", "#9b6bd6"];
const W = 1080;
const H = 1920;

/* ---------- procedural scenery ---------- */

/** Smooth ridge line (mountains / hills) as a closed path down to `bottom`. */
const ridge = (seed: string, baseY: number, amp: number, bottom = H, step = 40) => {
  const a = [random(`${seed}a`), random(`${seed}b`), random(`${seed}c`)];
  let d = `M-20 ${bottom} L-20 ${baseY}`;
  for (let x = -20; x <= W + 40; x += step) {
    const y = baseY - amp * (0.55 * Math.sin(x / (180 + a[0] * 120) + a[1] * 6) + 0.3 * Math.sin(x / (70 + a[2] * 40) + a[0] * 9) + 0.15 * Math.sin(x / 31 + a[2] * 3));
    d += ` L${x} ${y.toFixed(1)}`;
  }
  return d + ` L${W + 40} ${bottom} Z`;
};

/** Japanese low-rise town silhouette: houses with hipped, slightly curved roofs. */
const town = (seed: string, baseY: number, x0: number, x1: number, hMin: number, hMax: number, wMin = 50, wMax = 110) => {
  let d = "";
  let x = x0;
  let i = 0;
  while (x < x1) {
    const w = wMin + random(`${seed}w${i}`) * (wMax - wMin);
    const h = hMin + random(`${seed}h${i}`) * (hMax - hMin);
    const r = w * (0.28 + random(`${seed}r${i}`) * 0.12);
    const top = baseY - h;
    // walls
    d += `M${x + 4} ${baseY} L${x + 4} ${top} L${x + w - 4} ${top} L${x + w - 4} ${baseY} Z `;
    // roof with flared eaves
    d += `M${x - 8} ${top + 4} Q${x + w * 0.12} ${top - 2} ${x + w * 0.22} ${top - r} L${x + w * 0.78} ${top - r} Q${x + w * 0.88} ${top - 2} ${x + w + 8} ${top + 4} Z `;
    x += w + random(`${seed}g${i}`) * 10;
    i++;
  }
  return d;
};

/** Windows lit in a town layer. */
const Windows: React.FC<{ seed: string; baseY: number; x0: number; x1: number; color: string; n: number }> = ({ seed, baseY, x0, x1, color, n }) => {
  const frame = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const x = x0 + random(`${seed}x${i}`) * (x1 - x0);
        const y = baseY - 14 - random(`${seed}y${i}`) * 40;
        const o = 0.55 + 0.45 * Math.sin(frame / (12 + i) + i);
        return <rect key={i} x={x} y={y} width={10} height={12} fill={color} opacity={o} />;
      })}
    </g>
  );
};

/** Painterly filter: displaces edges like brush strokes. */
const Paint: React.FC<{ id: string; scale?: number; freq?: number; seed?: number }> = ({ id, scale = 14, freq = 0.025, seed = 2 }) => (
  <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={3} seed={seed} result="n" />
    <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" />
  </filter>
);

/** Billowing painted cloud made of overlapping puffs. */
const PaintedCloud: React.FC<{ x: number; y: number; s?: number; light: string; shade: string; seed: string; filter: string; puffs?: number }> = ({ x, y, s = 1, light, shade, seed, filter, puffs = 9 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter={`url(#${filter})`}>
    {Array.from({ length: puffs }).map((_, i) => {
      const px = (i / (puffs - 1) - 0.5) * 360 + (random(`${seed}x${i}`) - 0.5) * 40;
      const r = 50 + random(`${seed}r${i}`) * 55 - Math.abs(px) * 0.12;
      const py = -r * 0.55 + (random(`${seed}y${i}`) - 0.5) * 20;
      return <circle key={`s${i}`} cx={px + 6} cy={py + 10} r={r} fill={shade} />;
    })}
    {Array.from({ length: puffs }).map((_, i) => {
      const px = (i / (puffs - 1) - 0.5) * 360 + (random(`${seed}x${i}`) - 0.5) * 40;
      const r = 50 + random(`${seed}r${i}`) * 55 - Math.abs(px) * 0.12;
      const py = -r * 0.55 + (random(`${seed}y${i}`) - 0.5) * 20;
      return <circle key={`l${i}`} cx={px - 4} cy={py - 6} r={r * 0.86} fill={light} />;
    })}
  </g>
);

/** B-29 seen from below (top-down silhouette), pointing right. */
const Bomber: React.FC<{ x: number; y: number; s?: number; rot?: number; color?: string }> = ({ x, y, s = 1, rot = 0, color = "#1c1a22" }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} fill={color}>
    <path d="M70 0 Q66 -7 50 -7 L-60 -6 Q-70 -5 -72 0 Q-70 5 -60 6 L50 7 Q66 7 70 0 Z" />
    <path d="M14 -6 L-6 -6 L-22 -86 L-8 -86 Z M14 6 L-6 6 L-22 86 L-8 86 Z" />
    <path d="M-56 -5 L-64 -5 L-70 -28 L-62 -28 Z M-56 5 L-64 5 L-70 28 L-62 28 Z" />
    {[-30, -58, 30, 58].map((yy) => (
      <rect key={yy} x={yy < 0 ? -10 + yy * 0.12 : -10 - yy * 0.12} y={yy - 4} width={26} height={8} rx={4} />
    ))}
  </g>
);

/** Realistic-ish atomic cloud built from many lit puffs; k = 0..1 growth. */
const AtomicCloud: React.FC<{ id: string; x: number; base: number; k: number; scale?: number }> = ({ id, x, base, k, scale = 1 }) => {
  const frame = useCurrentFrame();
  const top = base - 760 * k * scale;
  const capR = (110 + 200 * k) * scale;
  const stemW = (40 + 30 * k) * scale;
  const swirl = frame / 30;
  return (
    <g>
      <defs>
        <radialGradient id={`${id}cap`} cx="0.4" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#fff3d1" />
          <stop offset="0.35" stopColor="#f6b26b" />
          <stop offset="0.75" stopColor="#a8483a" />
          <stop offset="1" stopColor="#4a2228" />
        </radialGradient>
        <linearGradient id={`${id}stem`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8935a" />
          <stop offset="1" stopColor="#5b2a2a" />
        </linearGradient>
        <radialGradient id={`${id}glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity={0.75} />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity={0} />
        </radialGradient>
        <Paint id={`${id}p`} scale={22} freq={0.03} seed={7} />
      </defs>
      <circle cx={x} cy={top + capR * 0.1} r={capR * 2.4} fill={`url(#${id}glow)`} />
      <g filter={`url(#${id}p)`}>
        {/* stem */}
        {Array.from({ length: 14 }).map((_, i) => {
          const t = i / 13;
          const yy = base - (base - top - capR * 0.4) * t;
          const r = stemW * (1.2 - 0.5 * t) + Math.sin(swirl + i) * 4;
          return <circle key={`st${i}`} cx={x + Math.sin(i * 1.7 + swirl) * 8} cy={yy} r={r} fill={`url(#${id}stem)`} />;
        })}
        {/* condensation ring */}
        <ellipse cx={x} cy={top + capR * 0.95} rx={capR * 1.05} ry={capR * 0.16} fill="#e7c7a8" opacity={0.55 * k} />
        {/* cap puffs */}
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2 + swirl * 0.15;
          const rr = capR * (0.38 + 0.12 * random(`${id}c${i}`));
          const cx = x + Math.cos(a) * capR * 0.62;
          const cy = top + Math.sin(a) * capR * 0.32;
          return <circle key={`c${i}`} cx={cx} cy={cy} r={rr} fill={`url(#${id}cap)`} />;
        })}
        <circle cx={x} cy={top - capR * 0.12} r={capR * 0.62} fill={`url(#${id}cap)`} />
      </g>
    </g>
  );
};

/** Origami crane with two-tone shading, facing right. */
const Crane: React.FC<{ x: number; y: number; s?: number; color: string; rot?: number; flap?: number }> = ({ x, y, s = 1, color, rot = 0, flap = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d={`M-8 -4 L-46 ${-62 - flap * 26} L6 -12 Z`} fill={color} />
    <path d={`M-8 -4 L-46 ${-62 - flap * 26} L-20 -8 Z`} fill="#000" opacity={0.22} />
    <path d="M-44 4 L0 -14 L44 4 L0 22 Z" fill={color} />
    <path d="M0 -14 L44 4 L0 22 Z" fill="#000" opacity={0.18} />
    <path d="M30 0 L64 -44 L56 -46 L50 -34 L20 -2 Z" fill={color} />
    <path d="M-30 0 L-74 -30 L-24 -6 Z" fill={color} />
    <path d="M-30 0 L-74 -30 L-40 -6 Z" fill="#000" opacity={0.2} />
    <path d={`M8 -4 L42 ${-70 - flap * 30} L-6 -12 Z`} fill={color} />
    <path d={`M8 -4 L42 ${-70 - flap * 30} L18 -6 Z`} fill="#fff" opacity={0.25} />
  </g>
);

/** Cinematic caption chip: small caps, letter-spaced, thin rule. */
const Chip: React.FC<{ show: number; y: number; children: React.ReactNode; accent?: string; size?: number }> = ({ show, y, children, accent = "#ffd77a", size = 44 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < show) return null;
  const k = spring({ frame: frame - show, fps, config: { damping: 18, stiffness: 120 } });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: k, translate: `0px ${(1 - k) * 16}px` }}>
      <div style={{ display: "inline-block", padding: "14px 34px", background: "rgba(10,8,12,0.62)", borderTop: `3px solid ${accent}`, borderBottom: `3px solid ${accent}`, backdropFilter: "blur(6px)", fontFamily: brandFont, fontWeight: 800, fontSize: size, letterSpacing: 3, color: "#f7f1e6", textShadow: "0 2px 12px #000" }}>
        {children}
      </div>
    </div>
  );
};

/** Film grain + letterbox vignette. */
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={W} height={H}>
        <filter id="grainF">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 6} />
          <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0.22 0" />
        </filter>
        <rect width={W} height={H} filter="url(#grainF)" />
      </svg>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 38%, transparent 50%, rgba(5,3,6,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Dark foreground band that hosts the captions. */
const Ground: React.FC<{ from?: number; color?: string }> = ({ from = 1220, color = "#0d0b10" }) => (
  <>
    <rect x={0} y={from - 120} width={W} height={160} fill={`url(#groundFade)`} />
    <rect x={0} y={from} width={W} height={H - from} fill={color} />
    <defs>
      <linearGradient id="groundFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity={0} />
        <stop offset="1" stopColor={color} stopOpacity={1} />
      </linearGradient>
    </defs>
  </>
);

type SP = { from: number };
const useCue = (from: number) => {
  const { fps } = useVideoConfig();
  return (w: string, after?: number) => Math.round((at(w, after ?? from) - from) * fps);
};

/* ---------- scenes ---------- */

/** Hook: a huge cloud hanging over two silhouetted towns at dusk. */
const S1: React.FC<SP> = () => {
  const frame = useCurrentFrame();
  const drift = frame * 0.6;
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs>
          <linearGradient id="h1sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#141327" />
            <stop offset="0.45" stopColor="#3a2f4f" />
            <stop offset="0.75" stopColor="#a0606a" />
            <stop offset="0.9" stopColor="#e8a374" />
          </linearGradient>
          <Paint id="h1p" scale={16} freq={0.02} seed={4} />
        </defs>
        <rect width={W} height={H} fill="url(#h1sky)" />
        <PaintedCloud x={560 + drift} y={760} s={2.1} light="#b9a7b8" shade="#5b4a63" seed="h1a" filter="h1p" puffs={11} />
        <PaintedCloud x={240 + drift * 0.7} y={900} s={1.2} light="#a08a9e" shade="#4c3e55" seed="h1b" filter="h1p" />
        <path d={ridge("h1r", 1050, 60)} fill="#2a2236" />
        <path d={town("h1t1", 1170, -10, 470, 50, 120)} fill="#120f18" />
        <path d={town("h1t2", 1170, 610, 1100, 50, 120)} fill="#120f18" />
        <Windows seed="h1w1" baseY={1170} x0={20} x1={450} color="#ffcf84" n={12} />
        <Windows seed="h1w2" baseY={1170} x0={630} x1={1060} color="#ffcf84" n={12} />
        <Ground from={1170} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1080, display: "flex", justifyContent: "space-around", fontFamily: brandFont, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: "#f7f1e6", opacity: 0.9 }}>
        <span>KOKURA</span>
        <span style={{ color: "#ff9b6e" }}>NAGASAKI</span>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 250, textAlign: "center", fontFamily: brandFont, fontWeight: 800, color: "#f7f1e6", textShadow: "0 8px 40px rgba(0,0,0,0.8)" }}>
        <div style={{ fontSize: 112, lineHeight: 1, letterSpacing: -3 }}>UMA NUVEM</div>
        <div style={{ fontSize: 88, lineHeight: 1.05, letterSpacing: -2 }}>DECIDIU QUAL</div>
        <div style={{ fontSize: 88, lineHeight: 1.05, letterSpacing: -2 }}>CIDADE IA</div>
        <div style={{ fontSize: 110, lineHeight: 1.08, letterSpacing: -3, color: "#ff9b6e" }}>DESAPARECER</div>
      </div>
    </AbsoluteFill>
  );
};

/** Hiroshima morning: misty layered city, the Dome, a bomber high above. */
const DomeSil: React.FC<{ x: number; base: number; color: string; ruined?: boolean }> = ({ x, base, color, ruined }) => (
  <g fill={color}>
    <rect x={x - 150} y={base - 140} width={300} height={140} />
    <rect x={x - 62} y={base - 215} width={124} height={80} />
    {ruined ? (
      <>
        <path d={`M${x - 62} ${base - 215} Q${x - 64} ${base - 320} ${x} ${base - 326} Q${x + 64} ${base - 320} ${x + 62} ${base - 215}`} fill="none" stroke={color} strokeWidth={9} />
        {[-32, 0, 32].map((d) => (
          <line key={d} x1={x + d * 0.4} y1={base - 324} x2={x + d * 1.7} y2={base - 215} stroke={color} strokeWidth={5} />
        ))}
        <path d={`M${x - 150} ${base - 140} L${x - 120} ${base - 170} L${x - 90} ${base - 140} M${x + 90} ${base - 140} L${x + 125} ${base - 160} L${x + 150} ${base - 140}`} />
      </>
    ) : (
      <path d={`M${x - 62} ${base - 215} Q${x - 64} ${base - 320} ${x} ${base - 326} Q${x + 64} ${base - 320} ${x + 62} ${base - 215} Z`} />
    )}
  </g>
);

const S2: React.FC<SP> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tPlane = cue("avião");
  const tBomb = cue("bomba");
  const cam = frame * 0.35;
  const px = interpolate(frame, [tPlane - 20, tPlane + 110], [-150, 1250], clamp);
  const by = interpolate(frame, [tBomb, tBomb + 40], [300, 900], { ...clamp, easing: (x) => x * x });
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs>
          <linearGradient id="h2sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7fa8c4" />
            <stop offset="0.55" stopColor="#d6dfd9" />
            <stop offset="0.8" stopColor="#f3d7b2" />
          </linearGradient>
          <radialGradient id="h2sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fff7e0" />
            <stop offset="0.25" stopColor="#ffe7b0" stopOpacity={0.9} />
            <stop offset="1" stopColor="#ffe7b0" stopOpacity={0} />
          </radialGradient>
          <Paint id="h2p" scale={12} freq={0.02} seed={9} />
          <linearGradient id="h2mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3e6d2" stopOpacity={0} />
            <stop offset="1" stopColor="#f3e6d2" stopOpacity={0.85} />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#h2sky)" />
        <circle cx={820} cy={420} r={300} fill="url(#h2sun)" />
        <PaintedCloud x={250 - cam} y={360} s={0.9} light="#ffffff" shade="#c8d3dc" seed="h2a" filter="h2p" />
        <PaintedCloud x={860 - cam * 0.6} y={600} s={0.6} light="#fbf6ee" shade="#cdd3d8" seed="h2b" filter="h2p" />
        <g transform={`translate(${-cam * 0.2} 0)`}>
          <path d={ridge("h2r1", 880, 90)} fill="#9fb3b5" />
          <rect x={0} y={860} width={W} height={160} fill="url(#h2mist)" />
          <path d={ridge("h2r2", 960, 50)} fill="#7f978f" />
        </g>
        <g transform={`translate(${-cam * 0.45} 0)`}>
          <path d={town("h2t1", 1080, -40, 1200, 40, 90, 40, 80)} fill="#5f6f69" />
        </g>
        <g transform={`translate(${-cam * 0.7} 0)`}>
          <DomeSil x={560} base={1150} color="#3b3f3c" />
          <path d={town("h2t2", 1150, -60, 380, 50, 100)} fill="#3b3f3c" />
          <path d={town("h2t3", 1150, 740, 1300, 50, 100)} fill="#3b3f3c" />
        </g>
        {/* river with reflections */}
        <rect x={0} y={1150} width={W} height={90} fill="#8fb0bd" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={((i * 157 + frame * 1.5) % 1200) - 100} y={1165 + (i % 3) * 22} width={70 + (i % 4) * 20} height={4} rx={2} fill="#eef5f7" opacity={0.7} />
        ))}
        <Ground from={1240} />
        {/* bomber with contrail */}
        {frame >= tPlane - 20 ? (
          <g>
            <rect x={-200} y={246} width={px + 120} height={6} rx={3} fill="#ffffff" opacity={0.75} />
            <Bomber x={px} y={250} s={0.9} />
          </g>
        ) : null}
        {frame >= tBomb && frame < tBomb + 41 ? <ellipse cx={560} cy={by} rx={10} ry={20} fill="#1c1a22" /> : null}
      </svg>
      <Chip show={0} y={170} size={46}>
        HIROSHIMA · 6 DE AGOSTO DE 1945
      </Chip>
      <Chip show={cue("8h15 da manhã.")} y={300} size={60} accent="#ff9b6e">
        8h15
      </Chip>
    </AbsoluteFill>
  );
};

/** The flash and the cloud over the ruined city. */
const S3: React.FC<SP> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const flash = interpolate(frame, [0, 4, 26], [1, 1, 0], clamp);
  const k = interpolate(frame, [3, 150], [0.12, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 2.2) });
  const shake = frame < 34 ? Math.sin(frame * 2.7) * (34 - frame) * 0.7 : 0;
  return (
    <AbsoluteFill style={{ translate: `${shake}px ${shake * 0.4}px` }}>
      <svg width={W} height={H}>
        <defs>
          <linearGradient id="h3sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1c1016" />
            <stop offset="0.5" stopColor="#6e2a26" />
            <stop offset="0.8" stopColor="#d06a3a" />
            <stop offset="1" stopColor="#f2a35a" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#h3sky)" />
        <AtomicCloud id="h3c" x={560} base={1110} k={k} />
        <path d={ridge("h2r2", 1000, 50)} fill="#3a1a1c" />
        <DomeSil x={560} base={1150} color="#0d0b10" ruined />
        <path d={town("h3t1", 1150, -60, 380, 20, 60)} fill="#0d0b10" />
        <path d={town("h3t2", 1150, 740, 1300, 20, 60)} fill="#0d0b10" />
        {Array.from({ length: 40 }).map((_, i) => {
          const y = 1150 - ((frame * (1.2 + random(`e${i}`) * 1.5) + random(`y${i}`) * 1000) % 1000);
          return <circle key={i} cx={random(`x${i}`) * W + Math.sin((frame + i * 20) / 14) * 18} cy={y} r={2 + random(`r${i}`) * 4} fill="#ffc977" opacity={0.85} />;
        })}
        <Ground from={1150} />
      </svg>
      <Chip show={cue("140 mil")} y={170} size={50} accent="#ff9b6e">
        ~140 MIL MORTOS ATÉ O FIM DE 1945
      </Chip>
      <AbsoluteFill style={{ background: "#fffaf0", opacity: flash }} />
    </AbsoluteFill>
  );
};

/* vintage map */
const topo = world as unknown as Topology<{ countries: GeometryCollection }>;
const JAPAN = (feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry>).features.find((c) => String(c.id) === "392") as Feature<Geometry>;
const CITY = { hiroshima: [132.455, 34.385], kokura: [130.88, 33.88], nagasaki: [129.87, 32.75] } as const;

const S4: React.FC<SP> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const zoom = interpolate(frame, [0, 200], [8200, 9200], clamp);
  const proj = useMemo(() => geoMercator().center([131.1, 33.55]).scale(zoom).translate([540, 720]), [zoom]);
  const path = useMemo(() => geoPath(proj), [proj]);
  const land = useMemo(() => path(JAPAN) ?? "", [path]);
  const pt = (c: readonly [number, number]) => proj([c[0], c[1]]) as [number, number];
  const [hx, hy] = pt(CITY.hiroshima);
  const [kx, ky] = pt(CITY.kokura);
  const [nx, ny] = pt(CITY.nagasaki);
  const tStart = cue("depois,") - 5;
  const tK = cue("Kokura.");
  const tCloud = cue("nuvens");
  const tTurn = cue("desviou.");
  const startP: [number, number] = [1150, 1180];
  const near: [number, number] = [kx + 70, ky + 80];
  let pos: [number, number] = startP;
  let ang = (Math.atan2(near[1] - startP[1], near[0] - startP[0]) * 180) / Math.PI;
  if (frame < tTurn) {
    const t = interpolate(frame, [tStart, tK + 25], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 2) });
    pos = [startP[0] + (near[0] - startP[0]) * t, startP[1] + (near[1] - startP[1]) * t];
    if (frame > tK + 25) {
      const a = (frame - tK - 25) / 16;
      pos = [near[0] + Math.cos(a + Math.PI) * 50 + 50, near[1] + Math.sin(a + Math.PI) * 34];
      ang = (a * 180) / Math.PI - 90 + 180;
    }
  } else {
    const t = interpolate(frame, [tTurn, tTurn + 34], [0, 1], { ...clamp, easing: (x) => x * (2 - x) });
    const cx = (near[0] + nx) / 2 - 40;
    const cy = (near[1] + ny) / 2 + 80;
    const bx = (1 - t) * (1 - t) * near[0] + 2 * (1 - t) * t * cx + t * t * nx;
    const byy = (1 - t) * (1 - t) * near[1] + 2 * (1 - t) * t * cy + t * t * (ny - 30);
    const dx = 2 * (1 - t) * (cx - near[0]) + 2 * t * (nx - cx);
    const dy = 2 * (1 - t) * (cy - near[1]) + 2 * t * (ny - 30 - cy);
    pos = [bx, byy];
    ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  }
  const cloudK = interpolate(frame, [tCloud - 6, tCloud + 20], [0, 1], clamp);
  const label = (x: number, y: number, text: string, color: string, dx = 0, dy = -36) => (
    <g>
      <circle cx={x} cy={y} r={30} fill="none" stroke={color} strokeWidth={3} opacity={0.5 + 0.5 * Math.sin(frame / 6)} />
      <circle cx={x} cy={y} r={13} fill={color} stroke="#2b2118" strokeWidth={4} />
      <text x={x + dx} y={y + dy} textAnchor="middle" fontFamily={brandFont} fontWeight={800} fontSize={42} letterSpacing={2} fill="#2b2118" stroke="#efe2c4" strokeWidth={10} paintOrder="stroke">
        {text}
      </text>
    </g>
  );
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs>
          <radialGradient id="h4sea" cx="0.5" cy="0.4" r="0.8">
            <stop offset="0" stopColor="#c9c2a4" />
            <stop offset="1" stopColor="#8f8a70" />
          </radialGradient>
          <pattern id="h4hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="14" stroke="#6f6a52" strokeWidth={1.5} opacity={0.35} />
          </pattern>
          <filter id="h4in">
            <feMorphology operator="erode" radius={6} in="SourceAlpha" result="e" />
            <feGaussianBlur in="e" stdDeviation={8} result="b" />
            <feComposite in="SourceGraphic" in2="b" operator="out" result="edge" />
            <feFlood floodColor="#b49a6a" floodOpacity={0.7} />
            <feComposite in2="edge" operator="in" result="tint" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="tint" />
            </feMerge>
          </filter>
          <Paint id="h4p" scale={14} freq={0.03} seed={5} />
        </defs>
        <rect width={W} height={H} fill="url(#h4sea)" />
        <rect width={W} height={H} fill="url(#h4hatch)" />
        {[22, 14, 7].map((w, i) => (
          <path key={w} d={land} fill="none" stroke="#efe2c4" strokeWidth={w} opacity={0.18 + i * 0.12} />
        ))}
        <path d={land} fill="#efe2c4" stroke="#2b2118" strokeWidth={4} strokeLinejoin="round" filter="url(#h4in)" />
        {/* compass */}
        <g transform="translate(900 1060)" opacity={0.75}>
          <circle r={70} fill="none" stroke="#2b2118" strokeWidth={3} />
          <path d="M0 -80 L14 0 L0 80 L-14 0 Z" fill="#2b2118" />
          <path d="M-80 0 L0 -12 L80 0 L0 12 Z" fill="#2b2118" opacity={0.6} />
          <text y={-92} textAnchor="middle" fontFamily={brandFont} fontWeight={800} fontSize={30} fill="#2b2118">N</text>
        </g>
        {label(hx, hy, "HIROSHIMA", "#2b2118")}
        <text x={hx} y={hy + 60} textAnchor="middle" fontFamily={brandFont} fontWeight={700} fontSize={28} fill="#2b2118">
          6 AGO
        </text>
        {frame >= tK - 6 ? label(kx, ky, "KOKURA", "#4f8fd6", -10) : null}
        {frame >= tTurn ? label(nx, ny, "NAGASAKI", "#c8402e", 60, -30) : null}
        {/* trail */}
        {frame >= tStart ? <path d={`M${startP[0]} ${startP[1]} L${near[0]} ${near[1]}`} stroke="#2b2118" strokeWidth={4} strokeDasharray="12 12" opacity={0.5} /> : null}
        {frame >= tTurn ? <path d={`M${near[0]} ${near[1]} Q${(near[0] + nx) / 2 - 40} ${(near[1] + ny) / 2 + 80} ${nx} ${ny - 30}`} fill="none" stroke="#c8402e" strokeWidth={5} strokeDasharray="14 12" /> : null}
        <g opacity={cloudK}>
          <PaintedCloud x={kx + 20} y={ky + 10} s={0.75 * (0.6 + 0.4 * cloudK)} light="#f4f1ec" shade="#9c97a2" seed="h4a" filter="h4p" />
          <PaintedCloud x={kx - 70} y={ky + 70} s={0.5 * (0.6 + 0.4 * cloudK)} light="#e9e5ec" shade="#8f8996" seed="h4b" filter="h4p" />
          <PaintedCloud x={kx + 110} y={ky + 80} s={0.45 * (0.6 + 0.4 * cloudK)} light="#e9e5ec" shade="#8f8996" seed="h4c" filter="h4p" />
        </g>
        {frame >= tStart ? <Bomber x={pos[0]} y={pos[1]} s={0.55} rot={ang} color="#2b2118" /> : null}
        <Ground from={1240} />
      </svg>
      <Chip show={0} y={170} size={46}>
        9 DE AGOSTO DE 1945
      </Chip>
      <Chip show={tCloud} y={300} size={38} accent="#c9defa">
        ALVO COBERTO POR NUVENS E FUMAÇA
      </Chip>
    </AbsoluteFill>
  );
};

/** Nagasaki valley, 11:02 — then surrender. */
const S5: React.FC<SP> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tFlash = cue("Nagasaki.");
  const after = frame >= tFlash;
  const flash = interpolate(frame, [tFlash, tFlash + 3, tFlash + 24], [0, 1, 0], clamp);
  const k = interpolate(frame, [tFlash + 3, tFlash + 120], [0.12, 0.9], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 2.2) });
  const tSurr = cue("rendeu.");
  const dusk = interpolate(frame, [tSurr - 10, tSurr + 20], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs>
          <linearGradient id="h5a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#86a9bf" />
            <stop offset="0.7" stopColor="#e5ddc8" />
          </linearGradient>
          <linearGradient id="h5b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1c1016" />
            <stop offset="0.5" stopColor="#6e2a26" />
            <stop offset="0.85" stopColor="#d06a3a" />
          </linearGradient>
          <linearGradient id="h5mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e5ddc8" stopOpacity={0} />
            <stop offset="1" stopColor="#e5ddc8" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={after ? "url(#h5b)" : "url(#h5a)"} />
        {after ? <AtomicCloud id="h5c" x={560} base={1050} k={k} scale={0.9} /> : null}
        <path d={ridge("h5r1", 820, 120)} fill={after ? "#2a1418" : "#8ea29a"} transform="translate(-300 0)" />
        <path d={ridge("h5r2", 860, 130)} fill={after ? "#2a1418" : "#8ea29a"} transform="translate(380 0)" />
        {!after ? <rect x={0} y={860} width={W} height={180} fill="url(#h5mist)" /> : null}
        <path d={ridge("h5r3", 1000, 60)} fill={after ? "#140c10" : "#5d7468"} />
        {/* Urakami cathedral */}
        <g fill={after ? "#0d0b10" : "#3e4440"}>
          <rect x={470} y={930} width={180} height={120} />
          <rect x={450} y={860} width={50} height={190} />
          <rect x={620} y={860} width={50} height={190} />
          <path d="M450 860 Q475 800 500 860 Z M620 860 Q645 800 670 860 Z M520 930 L560 880 L600 930 Z" />
        </g>
        <path d={town("h5t", 1100, -40, 1200, 30, 70, 40, 80)} fill={after ? "#0d0b10" : "#3e4440"} />
        {/* surrender: white flag silhouette */}
        <g opacity={dusk} transform="translate(860 520)">
          <line x1={0} y1={-120} x2={0} y2={300} stroke="#0d0b10" strokeWidth={9} />
          <path d={`M0 -120 Q${80 + Math.sin(frame / 5) * 12} ${-136 + Math.sin(frame / 7) * 10} 170 -108 L170 -10 Q80 ${-30 + Math.sin(frame / 6) * 12} 0 -24 Z`} fill="#f7f1e6" />
        </g>
        <Ground from={1150} />
      </svg>
      <Chip show={0} y={170} size={46}>
        NAGASAKI · 11h02
      </Chip>
      <Chip show={cue("74 mil")} y={300} size={46} accent="#ff9b6e">
        +74 MIL MORTOS
      </Chip>
      <Chip show={tSurr} y={430} size={40} accent="#f7f1e6">
        15 DE AGOSTO: O JAPÃO SE RENDE
      </Chip>
      <AbsoluteFill style={{ background: "#fffaf0", opacity: flash }} />
    </AbsoluteFill>
  );
};

/* silhouettes */
const Woman: React.FC<{ x: number; base: number; color: string }> = ({ x, base, color }) => (
  <g transform={`translate(${x} ${base})`} fill={color}>
    <path d="M-40 0 L-34 -150 Q-44 -230 -36 -300 Q-30 -340 0 -345 Q30 -340 36 -300 Q44 -230 34 -150 L40 0 L12 0 L6 -130 L-6 -130 L-12 0 Z" />
    <circle cx={0} cy={-385} r={38} />
    <path d="M-36 -390 Q-40 -440 0 -440 Q40 -440 36 -390 Q30 -420 0 -420 Q-30 -420 -36 -390 Z" />
    <path d="M30 -300 Q70 -230 92 -200 L84 -192 Q56 -222 24 -270 Z" />
  </g>
);
const Toddler: React.FC<{ x: number; base: number; color: string; step: number }> = ({ x, base, color, step }) => (
  <g transform={`translate(${x} ${base})`} fill={color}>
    <path d={`M-10 0 L${-8 + step * 6} -60 L${8 - step * 6} -60 L10 0 L4 0 L2 -40 L-2 -40 L-4 0 Z`} />
    <path d="M-26 -50 Q-30 -110 0 -120 Q30 -110 26 -50 Z" />
    <circle cx={0} cy={-142} r={28} />
    <path d="M-30 -140 Q-32 -178 0 -178 Q32 -178 30 -140 L24 -150 Q0 -160 -24 -150 Z" />
    <path d="M-20 -105 Q-46 -150 -58 -178 L-50 -184 Q-36 -156 -12 -118 Z" />
  </g>
);
const Runner: React.FC<{ x: number; base: number; color: string; phase: number }> = ({ x, base, color, phase }) => {
  const s = Math.sin(phase);
  return (
    <g transform={`translate(${x} ${base})`} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M0 -150 L${-30 * s} -80 L${-40 * s - 10} 0`} strokeWidth={22} />
      <path d={`M0 -150 L${30 * s} -80 L${40 * s + 10} 0`} strokeWidth={22} />
      <path d="M0 -150 L10 -260" strokeWidth={46} />
      <path d={`M8 -250 L${40 * s + 10} -200 L${50 * s + 30} -170`} strokeWidth={18} />
      <path d={`M8 -250 L${-40 * s + 10} -200 L${-50 * s - 10} -170`} strokeWidth={18} />
      <circle cx={16} cy={-300} r={34} fill={color} stroke="none" />
      <path d="M-20 -300 Q-22 -342 16 -342 Q52 -342 50 -300 L44 -290 Q36 -322 0 -318 Q-12 -300 -16 -280 Z" fill={color} stroke="none" />
    </g>
  );
};

/** Sadako: the survivor toddler, then the runner who fell ill. */
const S6: React.FC<SP> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tGrow = cue("Aos");
  const tSick = cue("leucemia.");
  const grow = interpolate(frame, [tGrow - 6, tGrow + 12], [0, 1], clamp);
  const sick = interpolate(frame, [tSick - 6, tSick + 18], [0, 1], clamp);
  const runX = interpolate(frame, [tGrow, tSick + 10], [380, 560], clamp);
  const runPhase = frame / 3.2 * (1 - sick);
  return (
    <AbsoluteFill style={{ filter: `saturate(${1 - sick * 0.75}) brightness(${1 - sick * 0.2})` }}>
      <svg width={W} height={H}>
        <defs>
          <linearGradient id="h6sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2b2d4f" />
            <stop offset="0.5" stopColor="#c27a6a" />
            <stop offset="0.75" stopColor="#f6c48b" />
          </linearGradient>
          <radialGradient id="h6sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fff2cf" />
            <stop offset="0.3" stopColor="#ffd18f" stopOpacity={0.85} />
            <stop offset="1" stopColor="#ffd18f" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#h6sky)" />
        <circle cx={540} cy={980} r={420} fill="url(#h6sun)" />
        <circle cx={540} cy={1000} r={120} fill="#fff3d8" />
        <path d={ridge("h6r", 1020, 40)} fill="#5a3a48" />
        {/* first: ruins + mother and toddler at dawn */}
        <g opacity={1 - grow}>
          <DomeSil x={250} base={1120} color="#1a1219" ruined />
          <Woman x={620} base={1120} color="#1a1219" />
          <Toddler x={720} base={1120} color="#1a1219" step={Math.sin(frame / 6)} />
        </g>
        {/* then: running girl at 12 (Sadako loved to run) */}
        <g opacity={grow}>
          <path d={town("h6t", 1120, -40, 1200, 30, 70, 50, 90)} fill="#1a1219" />
          <Runner x={runX} base={1120} color="#1a1219" phase={runPhase} />
        </g>
        <Ground from={1120} color="#110c12" />
      </svg>
      <Chip show={cue("Sadako")} y={170} size={58}>
        SADAKO SASAKI
      </Chip>
      <Chip show={cue("Sadako") + 10} y={290} size={34} accent="#f7f1e6">
        1943 – 1955
      </Chip>
      <Chip show={tSick} y={420} size={42} accent="#ff9b6e">
        LEUCEMIA AOS 12 ANOS
      </Chip>
    </AbsoluteFill>
  );
};

/** Hospital at night: a silhouette folding cranes by the window. */
const S7: React.FC<SP> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tLegend = cue("1.000 tsurus");
  const tLive = cue("viver.");
  const strings = 8;
  const per = 7;
  const shown = Math.floor(interpolate(frame, [6, tLive + 10], [2, strings * per], clamp));
  const fold = (Math.sin(frame / 5) + 1) / 2;
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs>
          <linearGradient id="h7win" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#24305a" />
            <stop offset="1" stopColor="#5a6ea0" />
          </linearGradient>
          <radialGradient id="h7glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#bcd0ff" stopOpacity={0.55} />
            <stop offset="1" stopColor="#bcd0ff" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="h7lamp" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffd38a" stopOpacity={0.5} />
            <stop offset="1" stopColor="#ffd38a" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="#151321" />
        {/* window */}
        <rect x={260} y={300} width={560} height={720} fill="url(#h7win)" />
        <circle cx={660} cy={430} r={60} fill="#f3f0e0" />
        <circle cx={660} cy={430} r={160} fill="url(#h7glow)" />
        {/* cherry branch */}
        <path d="M260 560 Q420 520 520 600 Q600 650 700 620" fill="none" stroke="#151321" strokeWidth={12} strokeLinecap="round" />
        <path d="M470 575 Q500 520 560 510" fill="none" stroke="#151321" strokeWidth={7} strokeLinecap="round" />
        <rect x={530} y={300} width={16} height={720} fill="#151321" />
        <rect x={260} y={640} width={560} height={16} fill="#151321" />
        <rect x={250} y={290} width={580} height={740} fill="none" stroke="#151321" strokeWidth={22} />
        <circle cx={300} cy={980} r={380} fill="url(#h7lamp)" />
        {/* crane garlands from the ceiling */}
        {Array.from({ length: strings }).map((_, s) => {
          const sx = 60 + s * 137;
          return (
            <g key={s}>
              <line x1={sx} y1={0} x2={sx} y2={60 + per * 92} stroke="#c9c2b0" strokeWidth={1.5} opacity={0.5} />
              {Array.from({ length: per }).map((__, j) => {
                const idx = s * per + j;
                if (idx >= shown) return null;
                return <Crane key={j} x={sx} y={70 + j * 92 + Math.sin((frame + idx * 9) / 22) * 4} s={0.6} color={CRANES[idx % CRANES.length]} rot={Math.sin((frame + idx * 11) / 30) * 10} />;
              })}
            </g>
          );
        })}
        {/* bed + seated silhouette folding */}
        <path d="M120 1060 L960 1060 L960 1130 L120 1130 Z" fill="#0d0b12" />
        <path d="M150 1130 L150 1220 M930 1130 L930 1220" stroke="#0d0b12" strokeWidth={22} />
        <g fill="#0d0b12">
          <path d="M330 1060 Q320 960 360 900 Q400 860 440 880 Q470 940 470 1060 Z" />
          <circle cx={420} cy={830} r={46} />
          <path d="M372 828 Q366 772 420 768 Q474 772 468 826 L462 846 Q452 800 420 798 Q392 800 380 850 Z" />
          <path d={`M440 900 Q520 ${920 - fold * 10} 560 ${940 - fold * 14} L556 ${952 - fold * 14} Q510 ${940 - fold * 8} 440 930 Z`} />
          <path d={`M400 920 Q470 ${960 - fold * 8} 540 ${960 - fold * 10} L538 ${972 - fold * 10} Q460 ${975 - fold * 6} 400 950 Z`} />
        </g>
        <Crane x={600} y={930} s={0.55} color={CRANES[shown % CRANES.length]} rot={-10} flap={fold} />
        <Ground from={1220} color="#0b0a10" />
      </svg>
      <Chip show={tLegend} y={170} size={46}>
        1.000 TSURUS = 1 DESEJO
      </Chip>
      <Chip show={tLive} y={1080} size={50} accent="#f7f1e6">
        O DELA: VIVER
      </Chip>
    </AbsoluteFill>
  );
};

/** Night at the river: floating lanterns, the Dome, cranes arriving. */
const S8: React.FC<SP> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tToday = cue("Hoje,");
  const tCom = cue("Comenta");
  const flock = frame >= tToday;
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs>
          <linearGradient id="h8sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#090a1a" />
            <stop offset="0.55" stopColor="#1f2244" />
            <stop offset="0.75" stopColor="#4a3a5e" />
          </linearGradient>
          <linearGradient id="h8river" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b1d36" />
            <stop offset="1" stopColor="#0b0a14" />
          </linearGradient>
          <radialGradient id="h8lan" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffcf7a" stopOpacity={0.8} />
            <stop offset="1" stopColor="#ffcf7a" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#h8sky)" />
        {Array.from({ length: 60 }).map((_, i) => (
          <circle key={i} cx={random(`s8x${i}`) * W} cy={random(`s8y${i}`) * 800} r={1.5 + random(`s8r${i}`) * 2} fill="#fff6e4" opacity={0.3 + 0.5 * Math.abs(Math.sin((frame + i * 17) / 18))} />
        ))}
        <circle cx={820} cy={320} r={70} fill="#f1ecd8" opacity={0.9} />
        {/* far bank with the Dome */}
        <path d={town("h8t", 900, -40, 1200, 30, 80, 50, 100)} fill="#0e0f1f" />
        <DomeSil x={380} base={905} color="#0e0f1f" ruined />
        <rect x={0} y={900} width={W} height={400} fill="url(#h8river)" />
        {/* lanterns (tōrō nagashi) */}
        {Array.from({ length: 16 }).map((_, i) => {
          const lane = i % 4;
          const y = 960 + lane * 70 + random(`l${i}`) * 20;
          const x = ((random(`lx${i}`) * 1300 + frame * (0.8 + lane * 0.25)) % 1300) - 110;
          const s = 0.6 + lane * 0.18;
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
              <ellipse cx={0} cy={50} rx={60} ry={14} fill="#ffcf7a" opacity={0.25} />
              <circle cx={0} cy={0} r={70} fill="url(#h8lan)" />
              <rect x={-26} y={-30} width={52} height={50} fill="#ffe4a8" stroke="#2a1d14" strokeWidth={4} />
              <rect x={-30} y={20} width={60} height={10} fill="#2a1d14" />
              <path d="M-30 -30 L0 -46 L30 -30 Z" fill="#2a1d14" />
            </g>
          );
        })}
        <Ground from={1260} color="#0b0a14" />
        {flock
          ? Array.from({ length: 30 }).map((_, i) => {
              const t = Math.max(0, frame - tToday - i * 2.4);
              const a = random(`a${i}`) * Math.PI * 2;
              const r = Math.max(120, 950 - t * 8);
              const x = 540 + Math.cos(a) * r + Math.cos(a + t / 25) * 30;
              const y = 640 + Math.sin(a) * r * 0.65;
              return t > 0 ? <Crane key={i} x={x} y={y} s={0.4 + random(`cs${i}`) * 0.3} color={CRANES[i % CRANES.length]} rot={(a * 180) / Math.PI + 180} flap={(Math.sin((frame + i * 7) / 5) + 1) / 2} /> : null;
            })
          : null}
      </svg>
      <Chip show={0} y={170} size={50} accent="#f7f1e6">
        SADAKO MORREU EM 1955
      </Chip>
      <Chip show={cue("Memorial")} y={300} size={36}>
        MEMORIAL DA PAZ · HIROSHIMA
      </Chip>
      <Chip show={tCom} y={1120} size={44}>
        COMENTA “TSURU” 🕊
      </Chip>
    </AbsoluteFill>
  );
};

const SCENES: [number, React.FC<SP>][] = [
  [0, S1],
  [T.s2, S2],
  [T.s3, S3],
  [T.s4, S4],
  [T.s5, S5],
  [T.s6, S6],
  [T.s7, S7],
  [T.s8, S8],
];

export const Hiroshima: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0d0b10" }}>
      {SCENES.map(([start, Scene], i) => {
        const from = Math.round(start * fps);
        const to = i + 1 < SCENES.length ? Math.round(SCENES[i + 1][0] * fps) : durationInFrames;
        const fadeIn = i === 0 ? 1 : 0;
        return (
          <Sequence key={i} from={from} durationInFrames={to - from}>
            <SceneFade instant={fadeIn === 1 || i === 2}>
              <Scene from={start} />
            </SceneFade>
          </Sequence>
        );
      })}
      <Grain />
      <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${(frame / durationInFrames) * 100}%`, background: "#ffd77a" }} />
      <div style={{ position: "absolute", left: 70, top: 110, fontFamily: brandFont, fontWeight: 700, fontSize: 24, letterSpacing: 2, color: "#f7f1e6", opacity: 0.8, textShadow: "0 2px 8px #000" }}>WILL TE EXPLICA · HISTÓRIA</div>
      <BrandCaptions words={WORDS} colorOf={colorOf} />
      <Audio src={staticFile("sfx-impacto.mp3")} volume={0.5} />
      <Audio src={staticFile("narracao-hiroshima.mp3")} />
    </AbsoluteFill>
  );
};

const SceneFade: React.FC<{ instant?: boolean; children: React.ReactNode }> = ({ instant, children }) => {
  const frame = useCurrentFrame();
  const o = instant ? 1 : interpolate(frame, [0, 10], [0, 1], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
