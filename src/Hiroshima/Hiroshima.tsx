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

/* palette: storybook paper */
const P = {
  paper: "#f3e6cf",
  ink: "#2a201b",
  red: "#c8402e",
  sun: "#e8573c",
  peach: "#f6c9a0",
  sky: "#9cc3d5",
  dusk: "#3b3552",
  night: "#1d1b2e",
  roof: "#4a3b38",
  wall: "#e9d6b6",
  river: "#6f9fb3",
  hill: "#6d8a5c",
  crane: ["#e8573c", "#f2b134", "#5b9bd5", "#e36aa0", "#7bbf6a", "#f3f0e8"],
};

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
  if (["hiroshima", "nagasaki", "fogo", "140mil", "74mil", "leucemia"].includes(n)) return "#ff8a6a";
  if (["kokura", "nuvem", "nuvens"].includes(n)) return "#bfe0ff";
  if (["sadako", "tsurus", "tsuru", "viver", "paz", "1000tsurus"].includes(n)) return "#ffd36b";
  return null;
};

/* ---------- reusable drawings ---------- */

/** Paper grain + vignette over everything. */
const Paper: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={1080} height={1920}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={3} />
        <feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 0 0.12  0 0 0 0.35 0" />
      </filter>
      <rect width={1080} height={1920} filter="url(#grain)" opacity={0.55} />
    </svg>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(20,12,8,0.45) 100%)" }} />
  </AbsoluteFill>
);

const Cloud: React.FC<{ x: number; y: number; s?: number; color?: string; opacity?: number }> = ({ x, y, s = 1, color = "#ffffff", opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <path d="M-150 40 Q-160 -10 -110 -20 Q-100 -80 -40 -70 Q-10 -120 50 -90 Q110 -100 120 -40 Q170 -30 160 20 Q160 50 120 50 L-120 50 Q-150 50 -150 40 Z" fill={color} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-90 10 Q-60 25 -30 10 M20 5 Q55 25 90 5" fill="none" stroke={P.ink} strokeWidth={3} opacity={0.25} />
  </g>
);

const House: React.FC<{ x: number; w: number; h: number; base: number; dark?: boolean }> = ({ x, w, h, base, dark }) => (
  <g>
    <rect x={x} y={base - h} width={w} height={h} fill={dark ? P.ink : P.wall} stroke={P.ink} strokeWidth={4} />
    <path d={`M${x - 16} ${base - h} L${x + w / 2} ${base - h - w * 0.42} L${x + w + 16} ${base - h} Z`} fill={dark ? P.ink : P.roof} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
    {!dark ? <rect x={x + w * 0.3} y={base - h * 0.62} width={w * 0.4} height={h * 0.34} fill={P.ink} opacity={0.6} /> : null}
  </g>
);

/** Hiroshima Prefectural Industrial Promotion Hall (today's A-Bomb Dome). */
const Dome: React.FC<{ x: number; base: number; dark?: boolean; ruined?: boolean }> = ({ x, base, dark, ruined }) => {
  const f = dark ? P.ink : "#d9c6a2";
  return (
    <g>
      <rect x={x - 150} y={base - 150} width={300} height={150} fill={f} stroke={P.ink} strokeWidth={5} />
      <rect x={x - 60} y={base - 230} width={120} height={80} fill={f} stroke={P.ink} strokeWidth={5} />
      {ruined ? (
        <path d={`M${x - 60} ${base - 230} Q${x - 62} ${base - 330} ${x} ${base - 335} Q${x + 62} ${base - 330} ${x + 60} ${base - 230}`} fill="none" stroke={P.ink} strokeWidth={8} />
      ) : (
        <path d={`M${x - 60} ${base - 230} Q${x - 62} ${base - 330} ${x} ${base - 335} Q${x + 62} ${base - 330} ${x + 60} ${base - 230} Z`} fill={dark ? P.ink : "#7f9a8a"} stroke={P.ink} strokeWidth={5} />
      )}
      {[-30, 0, 30].map((d) => (
        <line key={d} x1={x + d} y1={base - 330 + Math.abs(d) * 0.4} x2={x + d * 1.6} y2={base - 230} stroke={P.ink} strokeWidth={3} opacity={dark ? 0 : 0.6} />
      ))}
      {[-110, -50, 10, 70].map((d) => (
        <rect key={d} x={x + d} y={base - 120} width={36} height={56} fill={dark ? P.ink : P.ink} opacity={dark ? 1 : 0.55} />
      ))}
    </g>
  );
};

/** Four-engine bomber, side silhouette, flying right. */
const Plane: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M-120 0 Q-120 -14 -90 -16 L90 -14 Q130 -10 138 0 Q130 10 90 12 L-90 14 Q-120 14 -120 0 Z" fill="#5c6670" stroke={P.ink} strokeWidth={4} />
    <path d="M-20 -4 L-60 -70 L-30 -70 L30 -6 Z" fill="#4b545d" stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-100 -10 L-130 -60 L-110 -60 L-80 -12 Z" fill="#4b545d" stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={120} cy={-2} r={6} fill="#cfe4ef" stroke={P.ink} strokeWidth={2} />
  </g>
);

/** Stylised atomic cloud: stem + layered cap, growing with k (0..1). */
const Mushroom: React.FC<{ x: number; base: number; k: number; scale?: number }> = ({ x, base, k, scale = 1 }) => {
  const h = 700 * k * scale;
  const capR = (90 + 170 * k) * scale;
  const capY = base - h;
  return (
    <g>
      <defs>
        <radialGradient id="capG" cx="0.45" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fff1c9" />
          <stop offset="0.45" stopColor="#f2a35a" />
          <stop offset="1" stopColor="#8b3b2a" />
        </radialGradient>
        <linearGradient id="stemG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2a35a" />
          <stop offset="1" stopColor="#5a2c25" />
        </linearGradient>
      </defs>
      <path d={`M${x - 40 * scale} ${base} Q${x - 30 * scale} ${capY + capR * 0.4} ${x - 50 * scale} ${capY + capR * 0.3} L${x + 50 * scale} ${capY + capR * 0.3} Q${x + 30 * scale} ${capY + capR * 0.4} ${x + 40 * scale} ${base} Z`} fill="url(#stemG)" stroke={P.ink} strokeWidth={5} />
      <ellipse cx={x} cy={capY + capR * 0.55} rx={capR * 0.9} ry={capR * 0.25} fill="#c9714a" stroke={P.ink} strokeWidth={5} opacity={0.9} />
      {[-0.55, 0, 0.55].map((dx, i) => (
        <circle key={i} cx={x + dx * capR} cy={capY + (i === 1 ? -capR * 0.15 : capR * 0.1)} r={capR * (i === 1 ? 0.72 : 0.55)} fill="url(#capG)" stroke={P.ink} strokeWidth={5} />
      ))}
    </g>
  );
};

/** Origami crane (orizuru), facing right. */
const Crane: React.FC<{ x: number; y: number; s?: number; color: string; rot?: number; flap?: number }> = ({ x, y, s = 1, color, rot = 0, flap = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d={`M-10 0 L-60 ${-50 - flap * 30} L0 -10 Z`} fill={color} stroke={P.ink} strokeWidth={3} strokeLinejoin="round" />
    <path d="M-40 6 L0 -12 L40 6 L0 20 Z" fill={color} stroke={P.ink} strokeWidth={3} strokeLinejoin="round" />
    <path d="M30 2 L62 -38 L54 -40 L48 -30 L22 -2 Z" fill={color} stroke={P.ink} strokeWidth={3} strokeLinejoin="round" />
    <path d="M-30 2 L-70 -24 L-24 -4 Z" fill={color} stroke={P.ink} strokeWidth={3} strokeLinejoin="round" />
    <path d={`M10 0 L${50} ${-60 - flap * 30} L-4 -10 Z`} fill={color} stroke={P.ink} strokeWidth={3} strokeLinejoin="round" opacity={0.92} />
    <path d="M-40 6 L0 -12 L40 6" fill="none" stroke="#000" strokeWidth={2} opacity={0.2} />
  </g>
);

/** Sadako: child figure. age 2 or 12. */
const Girl: React.FC<{ x: number; base: number; age: 2 | 12; sitting?: boolean; arm?: number }> = ({ x, base, age, sitting, arm = 0 }) => {
  const s = age === 2 ? 0.62 : 1;
  const body = sitting ? 120 : 210;
  return (
    <g transform={`translate(${x} ${base}) scale(${s})`}>
      {!sitting ? (
        <>
          <rect x={-34} y={-70} width={24} height={70} rx={10} fill="#f2d0b1" stroke={P.ink} strokeWidth={4} />
          <rect x={10} y={-70} width={24} height={70} rx={10} fill="#f2d0b1" stroke={P.ink} strokeWidth={4} />
        </>
      ) : null}
      <path d={`M-70 ${-60} L-50 ${-60 - body} L50 ${-60 - body} L70 -60 Z`} fill={age === 2 ? "#e36aa0" : "#f3f0e8"} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
      {age === 12 ? <path d={`M-50 ${-60 - body + 30} L50 ${-60 - body + 30}`} stroke={P.red} strokeWidth={8} /> : null}
      <g transform={`translate(52 ${-60 - body + 40}) rotate(${-30 - arm * 50})`}>
        <rect x={-10} y={0} width={20} height={100} rx={10} fill="#f2d0b1" stroke={P.ink} strokeWidth={4} />
      </g>
      <g transform={`translate(-52 ${-60 - body + 40}) rotate(${30 + arm * 50})`}>
        <rect x={-10} y={0} width={20} height={100} rx={10} fill="#f2d0b1" stroke={P.ink} strokeWidth={4} />
      </g>
      <circle cx={0} cy={-60 - body - 70} r={72} fill="#f2d0b1" stroke={P.ink} strokeWidth={4} />
      <path d={`M-76 ${-60 - body - 50} Q-86 ${-60 - body - 160} 0 ${-60 - body - 150} Q86 ${-60 - body - 160} 76 ${-60 - body - 50} L60 ${-60 - body - 60} Q40 ${-60 - body - 110} -60 ${-60 - body - 100} L-60 ${-60 - body - 50} Z`} fill={P.ink} />
      <path d={`M-30 ${-60 - body - 62} q8 6 16 0 M14 ${-60 - body - 62} q8 6 16 0`} fill="none" stroke={P.ink} strokeWidth={4} strokeLinecap="round" />
      <circle cx={-36} cy={-60 - body - 40} r={10} fill="#f4a3a0" opacity={0.7} />
      <circle cx={36} cy={-60 - body - 40} r={10} fill="#f4a3a0" opacity={0.7} />
      <path d={`M-12 ${-60 - body - 30} q12 8 24 0`} fill="none" stroke={P.ink} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

/** Hand-lettered label card. */
const Tag: React.FC<{ show: number; x?: number; y: number; children: React.ReactNode; color?: string; size?: number; rot?: number }> = ({ show, y, children, color = P.paper, size = 52, rot = -3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < show) return null;
  const k = spring({ frame: frame - show, fps, config: { damping: 12, stiffness: 180 } });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", scale: interpolate(k, [0, 1], [0.6, 1]), opacity: interpolate(k, [0, 0.4], [0, 1], clamp), rotate: `${rot}deg` }}>
      <span style={{ display: "inline-block", padding: "10px 34px 12px", background: color, color: P.ink, border: `5px solid ${P.ink}`, borderRadius: 14, boxShadow: `8px 8px 0 ${P.ink}`, fontFamily: brandFont, fontWeight: 800, fontSize: size, lineHeight: 1.15 }}>
        {children}
      </span>
    </div>
  );
};

const Clock: React.FC<{ x: number; y: number; h: number; m: number; show: number }> = ({ x, y, h, m, show }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [show, show + 10], [0, 1], clamp);
  if (frame < show) return null;
  const ma = (m / 60) * 360;
  const ha = ((h % 12) / 12) * 360 + m / 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <circle r={90} fill={P.paper} stroke={P.ink} strokeWidth={8} />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={0} y1={-72} x2={0} y2={-82} stroke={P.ink} strokeWidth={5} transform={`rotate(${i * 30})`} />
      ))}
      <line x1={0} y1={0} x2={0} y2={-48} stroke={P.ink} strokeWidth={9} strokeLinecap="round" transform={`rotate(${ha})`} />
      <line x1={0} y1={0} x2={0} y2={-70} stroke={P.red} strokeWidth={6} strokeLinecap="round" transform={`rotate(${ma})`} />
      <circle r={8} fill={P.ink} />
    </g>
  );
};

/* ---------- scenes ---------- */
type SP = { from: number };
const useCue = (from: number) => {
  const { fps } = useVideoConfig();
  return (w: string, after?: number) => Math.round((at(w, after ?? from) - from) * fps);
};

/** Hook: a cloud hanging over two cities. */
const S1: React.FC<SP> = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 20) * 10;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <defs>
          <linearGradient id="s1sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={P.dusk} />
            <stop offset="0.7" stopColor="#8a6d7d" />
            <stop offset="1" stopColor={P.peach} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#s1sky)" />
        {/* two towns */}
        {[0, 1].map((side) => {
          const ox = side ? 560 : 40;
          return (
            <g key={side}>
              {[0, 1, 2, 3].map((i) => (
                <House key={i} x={ox + i * 115} w={90} h={90 + ((i * 37) % 60)} base={1300} dark />
              ))}
            </g>
          );
        })}
        <rect x={0} y={1300} width={1080} height={620} fill={P.ink} />
        <Cloud x={300 + drift} y={1010} s={1.5} color="#e7e3ea" />
        <Cloud x={230 + drift * 0.6} y={1090} s={1.1} color="#cfcad6" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1160, display: "flex", justifyContent: "space-around", fontFamily: brandFont, fontWeight: 800, fontSize: 40, color: P.paper, letterSpacing: 4 }}>
        <span>KOKURA</span>
        <span style={{ color: "#ff8a6a" }}>NAGASAKI</span>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 300, textAlign: "center", fontFamily: brandFont, fontWeight: 800, color: P.paper, textShadow: `6px 6px 0 ${P.ink}` }}>
        <div style={{ fontSize: 120, lineHeight: 0.98, letterSpacing: -4 }}>UMA NUVEM</div>
        <div style={{ fontSize: 96, lineHeight: 1.02, letterSpacing: -3 }}>DECIDIU QUAL</div>
        <div style={{ fontSize: 96, lineHeight: 1.02, letterSpacing: -3 }}>CIDADE IA</div>
        <div style={{ fontSize: 116, lineHeight: 1.05, letterSpacing: -4, color: "#ff8a6a" }}>DESAPARECER</div>
      </div>
    </AbsoluteFill>
  );
};

/** Hiroshima, morning of 6 August: city, clock, plane, falling bomb. */
const S2: React.FC<SP> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tPlane = cue("avião");
  const tBomb = cue("bomba");
  const px = interpolate(frame, [tPlane - 10, tPlane + 120], [-200, 1300], clamp);
  const bombX = 540 + interpolate(frame, [tBomb, tBomb + 40], [0, 20], clamp);
  const bombY = interpolate(frame, [tBomb, tBomb + 45], [330, 980], { ...clamp, easing: (x) => x * x });
  const sway = Math.sin(frame / 18) * 6;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <defs>
          <linearGradient id="s2sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={P.sky} />
            <stop offset="1" stopColor={P.peach} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#s2sky)" />
        <circle cx={860} cy={300} r={80} fill={P.sun} stroke={P.ink} strokeWidth={5} />
        <Cloud x={200 + sway} y={260} s={0.8} />
        <Cloud x={720 - sway} y={480} s={0.6} />
        {/* hills */}
        <path d="M0 1000 Q200 860 420 960 Q640 860 820 940 Q960 880 1080 930 L1080 1300 L0 1300 Z" fill={P.hill} stroke={P.ink} strokeWidth={5} />
        <Dome x={540} base={1180} />
        {[60, 170, 780, 890, 980].map((x, i) => (
          <House key={x} x={x} w={84} h={80 + (i % 2) * 30} base={1180} />
        ))}
        {/* river */}
        <path d="M0 1180 L1080 1180 L1080 1300 L0 1300 Z" fill={P.river} stroke={P.ink} strokeWidth={5} />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${((frame * 2 + i * 300) % 1200) - 100} ${1220 + i * 25} q40 -12 80 0`} fill="none" stroke="#e8f3f7" strokeWidth={5} strokeLinecap="round" />
        ))}
        <rect x={0} y={1300} width={1080} height={620} fill={P.ink} />
        {frame >= tPlane - 10 ? <Plane x={px} y={250} s={1.2} /> : null}
        {frame >= tBomb && frame < tBomb + 46 ? <ellipse cx={bombX} cy={bombY} rx={14} ry={26} fill={P.ink} /> : null}
        <Clock x={170} y={560} h={8} m={15} show={cue("8h15 da manhã.")} />
      </svg>
      <Tag show={0} y={170} size={58}>6 de agosto de 1945</Tag>
      <Tag show={cue("Hiroshima.")} y={1110} size={44} rot={2} color="#ffd36b">
        HIROSHIMA
      </Tag>
    </AbsoluteFill>
  );
};

/** Flash, then the cloud rises over the burnt city. */
const S3: React.FC<SP> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const flash = interpolate(frame, [0, 3, 22], [1, 1, 0], clamp);
  const k = interpolate(frame, [4, 110], [0.1, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 2) });
  const shake = frame < 30 ? Math.sin(frame * 3) * (30 - frame) * 0.6 : 0;
  return (
    <AbsoluteFill style={{ translate: `${shake}px 0px` }}>
      <svg width={1080} height={1920}>
        <defs>
          <linearGradient id="s3sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4b2a2a" />
            <stop offset="0.6" stopColor="#c8573a" />
            <stop offset="1" stopColor="#f2a35a" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#s3sky)" />
        <Mushroom x={540} base={1180} k={k} />
        <Dome x={540} base={1180} dark ruined />
        {[60, 170, 780, 890, 980].map((x, i) => (
          <House key={x} x={x} w={84} h={50 + (i % 2) * 20} base={1180} dark />
        ))}
        <rect x={0} y={1180} width={1080} height={740} fill={P.ink} />
        {Array.from({ length: 26 }).map((_, i) => {
          const y = 1180 - ((frame * (1.5 + random(`e${i}`)) + random(`y${i}`) * 900) % 900);
          return <circle key={i} cx={random(`x${i}`) * 1080 + Math.sin((frame + i * 20) / 15) * 20} cy={y} r={3 + random(`r${i}`) * 5} fill="#ffcf7a" opacity={0.8} />;
        })}
      </svg>
      <Tag show={cue("140 mil")} y={170} size={54} color="#ff8a6a">
        ~140 mil mortos até o fim de 1945
      </Tag>
      <AbsoluteFill style={{ background: "#fff8e8", opacity: flash }} />
    </AbsoluteFill>
  );
};

/* map */
const topo = world as unknown as Topology<{ countries: GeometryCollection }>;
const JAPAN = (feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry>).features.find((c) => String(c.id) === "392") as Feature<Geometry>;
const CITIES = { hiroshima: [132.455, 34.385], kokura: [130.88, 33.88], nagasaki: [129.87, 32.75] } as const;

const S4: React.FC<SP> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const proj = useMemo(() => geoMercator().center([131.2, 33.6]).scale(9000).translate([540, 760]), []);
  const path = useMemo(() => geoPath(proj), [proj]);
  const land = useMemo(() => path(JAPAN) ?? "", [path]);
  const P_ = (c: readonly [number, number]) => proj([c[0], c[1]]) as [number, number];
  const [hx, hy] = P_(CITIES.hiroshima);
  const [kx, ky] = P_(CITIES.kokura);
  const [nx, ny] = P_(CITIES.nagasaki);
  const tK = cue("Kokura.");
  const tCloud = cue("nuvens");
  const tTurn = cue("desviou.");
  // plane path: from south-east to near Kokura, circle, then to Nagasaki
  const start: [number, number] = [1100, 1250];
  const near: [number, number] = [kx + 60, ky + 70];
  let pos: [number, number];
  let ang = 0;
  if (frame < tTurn) {
    const t = interpolate(frame, [cue("depois,") - 5, tK + 30], [0, 1], clamp);
    pos = [start[0] + (near[0] - start[0]) * t, start[1] + (near[1] - start[1]) * t];
    if (frame > tK + 30) {
      const a = (frame - tK - 30) / 14;
      pos = [near[0] + Math.cos(a) * 45 - 45, near[1] + Math.sin(a) * 30];
      ang = (a * 180) / Math.PI + 90;
    } else ang = (Math.atan2(near[1] - start[1], near[0] - start[0]) * 180) / Math.PI;
  } else {
    const t = interpolate(frame, [tTurn, tTurn + 30], [0, 1], clamp);
    pos = [near[0] + (nx - near[0]) * t, near[1] + (ny - 40 - near[1]) * t];
    ang = (Math.atan2(ny - near[1], nx - near[0]) * 180) / Math.PI;
  }
  const cloudK = interpolate(frame, [tCloud - 4, tCloud + 16], [0, 1], clamp);
  const dot = (x: number, y: number, label: string, color: string, show: boolean, dx = 0) =>
    show ? (
      <g>
        <circle cx={x} cy={y} r={18} fill={color} stroke={P.ink} strokeWidth={5} />
        <text x={x + dx} y={y - 34} textAnchor="middle" fontFamily={brandFont} fontWeight={800} fontSize={44} fill={P.ink} stroke={P.paper} strokeWidth={10} paintOrder="stroke">
          {label}
        </text>
      </g>
    ) : null;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <rect width={1080} height={1920} fill="#9fc0c8" />
        {Array.from({ length: 14 }).map((_, i) => (
          <path key={i} d={`M${(i * 97) % 1080} ${300 + i * 70} q20 -10 40 0 q20 10 40 0`} fill="none" stroke="#e8f3f7" strokeWidth={3} opacity={0.6} />
        ))}
        <path d={land} fill={P.paper} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
        {dot(hx, hy, "Hiroshima", P.ink, true)}
        <text x={hx} y={hy + 60} textAnchor="middle" fontFamily={brandFont} fontWeight={700} fontSize={30} fill={P.ink}>
          6/8
        </text>
        {dot(kx, ky, "Kokura", "#5b9bd5", frame >= tK - 6, -20)}
        {dot(nx, ny, "Nagasaki", P.red, frame >= tTurn, 40)}
        {frame >= tTurn ? <path d={`M${near[0]} ${near[1]} Q${(near[0] + nx) / 2 - 40} ${(near[1] + ny) / 2 + 60} ${nx} ${ny - 40}`} fill="none" stroke={P.red} strokeWidth={6} strokeDasharray="14 12" /> : null}
        <g opacity={cloudK}>
          <Cloud x={kx + 10} y={ky - 10} s={0.9 * cloudK} color="#d8d4dc" />
          <Cloud x={kx - 50} y={ky + 40} s={0.7 * cloudK} color="#b9b4c0" />
          <Cloud x={kx + 70} y={ky + 50} s={0.6 * cloudK} color="#cbc6d2" />
        </g>
        {frame >= cue("depois,") - 5 ? (
          <g transform={`translate(${pos[0]} ${pos[1]}) rotate(${ang})`}>
            <path d="M30 0 L-20 -10 L-30 -44 L-38 -44 L-34 -8 L-40 -6 L-48 -18 L-54 -18 L-52 0 L-54 18 L-48 18 L-40 6 L-34 8 L-38 44 L-30 44 L-20 10 Z" fill="#5c6670" stroke={P.ink} strokeWidth={3} />
          </g>
        ) : null}
        <rect x={0} y={1300} width={1080} height={620} fill={P.ink} opacity={0.9} />
      </svg>
      <Tag show={0} y={170} size={54}>9 de agosto de 1945</Tag>
      <Tag show={tCloud} y={1150} size={40} color="#bfe0ff" rot={2}>
        nuvens e fumaça sobre Kokura
      </Tag>
    </AbsoluteFill>
  );
};

/** Nagasaki at 11:02, then surrender. */
const S5: React.FC<SP> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tBomb = cue("bomba");
  const tFlash = cue("Nagasaki.");
  const flash = interpolate(frame, [tFlash, tFlash + 3, tFlash + 22], [0, 1, 0], clamp);
  const after = frame >= tFlash;
  const k = interpolate(frame, [tFlash + 4, tFlash + 100], [0.1, 0.85], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 2) });
  const tSurr = cue("rendeu.");
  const by = interpolate(frame, [tBomb, tFlash], [300, 1000], { ...clamp, easing: (x) => x * x });
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <defs>
          <linearGradient id="s5a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={P.sky} />
            <stop offset="1" stopColor={P.peach} />
          </linearGradient>
          <linearGradient id="s5b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4b2a2a" />
            <stop offset="0.6" stopColor="#c8573a" />
            <stop offset="1" stopColor="#f2a35a" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill={after ? "url(#s5b)" : "url(#s5a)"} />
        {after ? <Mushroom x={560} base={1050} k={k} scale={0.95} /> : null}
        {/* valley hills */}
        <path d="M0 860 Q180 720 360 900 L360 1300 L0 1300 Z" fill={after ? P.ink : P.hill} stroke={P.ink} strokeWidth={5} />
        <path d="M1080 820 Q880 700 720 900 L720 1300 L1080 1300 Z" fill={after ? P.ink : P.hill} stroke={P.ink} strokeWidth={5} />
        <path d="M300 1050 Q540 960 780 1050 L780 1300 L300 1300 Z" fill={after ? P.ink : "#8aa676"} stroke={P.ink} strokeWidth={5} />
        {/* Urakami cathedral silhouette */}
        <g fill={after ? P.ink : P.wall} stroke={P.ink} strokeWidth={4}>
          <rect x={470} y={960} width={140} height={110} />
          <rect x={455} y={900} width={40} height={170} />
          <rect x={585} y={900} width={40} height={170} />
          <path d="M455 900 L475 860 L495 900 Z M585 900 L605 860 L625 900 Z" />
        </g>
        <rect x={0} y={1180} width={1080} height={740} fill={P.ink} />
        {!after && frame >= tBomb ? <ellipse cx={560} cy={by} rx={22} ry={30} fill={P.ink} /> : null}
        <Clock x={170} y={560} h={11} m={2} show={0} />
        {frame >= tSurr ? (
          <g transform="translate(860 520)">
            <line x1={0} y1={-140} x2={0} y2={220} stroke={P.ink} strokeWidth={10} />
            <path d={`M0 -140 Q${90 + Math.sin(frame / 5) * 10} ${-150 + Math.sin(frame / 7) * 10} 170 -120 L170 -20 Q90 ${-40 + Math.sin(frame / 6) * 12} 0 -40 Z`} fill="#fbf7ee" stroke={P.ink} strokeWidth={5} />
          </g>
        ) : null}
      </svg>
      <Tag show={0} y={170} size={58}>11h02 · Nagasaki</Tag>
      <Tag show={cue("74 mil")} y={330} size={50} color="#ff8a6a" rot={2}>
        +74 mil mortos
      </Tag>
      <Tag show={tSurr} y={1100} size={42} color="#fbf7ee">
        15 de agosto: o Japão se rende
      </Tag>
      <AbsoluteFill style={{ background: "#fff8e8", opacity: flash }} />
    </AbsoluteFill>
  );
};

/** Sadako: from survivor toddler to the girl with leukaemia. */
const S6: React.FC<SP> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tGrow = cue("Aos");
  const grow = interpolate(frame, [tGrow - 4, tGrow + 12], [0, 1], clamp);
  const breathe = Math.sin(frame / 14) * 4;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <defs>
          <linearGradient id="s6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c9d8de" />
            <stop offset="1" stopColor={P.paper} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#s6)" />
        <circle cx={540} cy={700} r={360} fill="#fff6e4" opacity={0.8} />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={180 + i * 180} cy={420 + (i % 2) * 60 + Math.sin((frame + i * 30) / 25) * 10} r={8} fill="#f4a3a0" opacity={0.7} />
        ))}
        <rect x={0} y={1180} width={1080} height={740} fill={P.ink} />
        <path d="M0 1180 Q540 1120 1080 1180" fill="#b9a27d" stroke={P.ink} strokeWidth={5} />
        <g opacity={1 - grow} transform={`translate(0 ${breathe})`}>
          <Girl x={540} base={1180} age={2} />
        </g>
        <g opacity={grow} transform={`translate(0 ${breathe})`}>
          <Girl x={540} base={1180} age={12} />
        </g>
      </svg>
      <Tag show={cue("Sadako")} y={170} size={60} color="#ffd36b">
        Sadako Sasaki
      </Tag>
      <Tag show={cue("Sadako") + 8} y={300} size={36} rot={2}>
        1943 – 1955
      </Tag>
      <Tag show={cue("leucemia.")} y={1100} size={44} color="#ff8a6a" rot={-2}>
        leucemia, aos 12 anos
      </Tag>
    </AbsoluteFill>
  );
};

/** Hospital: folding cranes; strings fill up. */
const S7: React.FC<SP> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tLegend = cue("1.000 tsurus");
  const tLive = cue("viver.");
  const strings = 7;
  const perString = 6;
  const shown = Math.floor(interpolate(frame, [10, tLive], [1, strings * perString], clamp));
  const arm = (Math.sin(frame / 6) + 1) / 2;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <rect width={1080} height={1920} fill="#d9e2df" />
        {/* window */}
        <rect x={640} y={330} width={330} height={420} fill="#9cc3d5" stroke={P.ink} strokeWidth={8} />
        <line x1={805} y1={330} x2={805} y2={750} stroke={P.ink} strokeWidth={6} />
        <line x1={640} y1={540} x2={970} y2={540} stroke={P.ink} strokeWidth={6} />
        <circle cx={900} cy={420} r={40} fill="#f6e3a0" opacity={0.8} />
        {/* strings of cranes */}
        {Array.from({ length: strings }).map((_, s) => (
          <g key={s}>
            <line x1={70 + s * 80} y1={0} x2={70 + s * 80} y2={140 + perString * 80} stroke={P.ink} strokeWidth={2} opacity={0.5} />
            {Array.from({ length: perString }).map((__, j) => {
              const idx = s * perString + j;
              if (idx >= shown) return null;
              return <Crane key={j} x={70 + s * 80} y={130 + j * 80 + Math.sin((frame + idx * 9) / 20) * 4} s={0.55} color={P.crane[idx % P.crane.length]} rot={Math.sin((frame + idx * 13) / 25) * 8} />;
            })}
          </g>
        ))}
        {/* bed */}
        <rect x={80} y={1000} width={920} height={110} rx={20} fill="#f7f4ec" stroke={P.ink} strokeWidth={6} />
        <rect x={80} y={1110} width={30} height={90} fill={P.ink} />
        <rect x={970} y={1110} width={30} height={90} fill={P.ink} />
        <rect x={0} y={1200} width={1080} height={720} fill={P.ink} />
        <Girl x={420} base={1030} age={12} sitting arm={arm * 0.4} />
        {/* crane being folded */}
        <Crane x={420} y={720} s={0.8 + arm * 0.1} color={P.crane[shown % P.crane.length]} rot={-8} flap={arm} />
      </svg>
      <Tag show={tLegend} y={170} size={50} color="#ffd36b">
        1.000 tsurus = 1 desejo
      </Tag>
      <Tag show={tLive} y={1100} size={56} color="#fbf7ee" rot={2}>
        o dela: viver
      </Tag>
    </AbsoluteFill>
  );
};

/** Children's Peace Monument: cranes from the whole world. */
const S8: React.FC<SP> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tToday = cue("Hoje,");
  const tCom = cue("Comenta");
  const flock = frame >= tToday;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <defs>
          <linearGradient id="s8" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={P.night} />
            <stop offset="0.75" stopColor={P.dusk} />
            <stop offset="1" stopColor="#8a6d7d" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#s8)" />
        {Array.from({ length: 40 }).map((_, i) => (
          <circle key={i} cx={random(`sx${i}`) * 1080} cy={random(`sy${i}`) * 700} r={2 + random(`sr${i}`) * 2} fill="#fff6e4" opacity={0.4 + 0.4 * Math.sin((frame + i * 17) / 15)} />
        ))}
        {/* monument: dome-like tower with girl on top holding a crane */}
        <g fill={P.ink} stroke={P.ink}>
          <path d="M420 1180 L460 760 Q540 690 620 760 L660 1180 Z" />
          <path d="M470 1180 L505 900 Q540 870 575 900 L610 1180 Z" fill="#3b3552" />
          <rect x={525} y={600} width={30} height={100} rx={12} />
          <circle cx={540} cy={585} r={22} />
          <path d="M530 600 L470 540 L480 530 L545 590 Z" />
        </g>
        <Crane x={460} y={520} s={0.7} color="#ffd36b" rot={-15} flap={(Math.sin(frame / 8) + 1) / 2} />
        {/* garlands at the base */}
        {Array.from({ length: 9 }).map((_, i) => (
          <g key={i}>
            {Array.from({ length: 5 }).map((__, j) => (
              <rect key={j} x={110 + i * 100} y={1060 + j * 22} width={18} height={18} rx={4} fill={P.crane[(i + j) % P.crane.length]} stroke={P.ink} strokeWidth={2} />
            ))}
          </g>
        ))}
        <rect x={0} y={1180} width={1080} height={740} fill={P.ink} />
        {/* cranes flying in from everywhere */}
        {flock
          ? Array.from({ length: 34 }).map((_, i) => {
              const t = Math.max(0, frame - tToday - i * 2.5);
              const ang = random(`a${i}`) * Math.PI * 2;
              const r0 = 900;
              const r = Math.max(130, r0 - t * 9);
              const x = 540 + Math.cos(ang) * r + Math.cos(ang + t / 30) * 40;
              const y = 820 + Math.sin(ang) * r * 0.7;
              return t > 0 ? <Crane key={i} x={x} y={y} s={0.45 + random(`s${i}`) * 0.3} color={P.crane[i % P.crane.length]} rot={(ang * 180) / Math.PI + 180} flap={(Math.sin((frame + i * 7) / 5) + 1) / 2} /> : null;
            })
          : null}
      </svg>
      <Tag show={0} y={170} size={60} color="#fbf7ee">
        1955
      </Tag>
      <Tag show={cue("Memorial")} y={300} size={40} color="#ffd36b" rot={2}>
        Memorial da Paz das Crianças · Hiroshima
      </Tag>
      <Tag show={tCom} y={1100} size={46} color="#ffd36b" rot={-2}>
        COMENTA “TSURU” 🕊
      </Tag>
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
    <AbsoluteFill style={{ background: P.ink }}>
      {SCENES.map(([start, Scene], i) => {
        const from = Math.round(start * fps);
        const to = i + 1 < SCENES.length ? Math.round(SCENES[i + 1][0] * fps) : durationInFrames;
        return (
          <Sequence key={i} from={from} durationInFrames={to - from}>
            <Scene from={start} />
          </Sequence>
        );
      })}
      <Paper />
      <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${(frame / durationInFrames) * 100}%`, background: "#ffd36b" }} />
      <div style={{ position: "absolute", left: 70, top: 110, fontFamily: brandFont, fontWeight: 700, fontSize: 24, color: P.paper, opacity: 0.85, textShadow: "0 2px 8px #000" }}>WILL TE EXPLICA · HISTÓRIA</div>
      <BrandCaptions words={WORDS} colorOf={colorOf} />
      <Audio src={staticFile("sfx-impacto.mp3")} volume={0.5} />
      <Audio src={staticFile("narracao-hiroshima.mp3")} />
    </AbsoluteFill>
  );
};
