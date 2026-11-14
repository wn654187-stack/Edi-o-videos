import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Baloo2";
import lyrics from "./lyrics.json";

const { fontFamily } = loadFont("normal", { weights: ["600", "800"], subsets: ["latin", "latin-ext"] });

type W = { text: string; start: number; end: number };
const WORDS: W[] = lyrics.words;
export const GIRA_SECONDS = 77;

const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");

/** Visual track — every second is moving footage. Kling clips are cut on the lyric
 * beats (start = seconds into the clip, rate = playback speed); the two moments
 * without a clip are "living" stills animated here (bob, vapour, flowing water). */
type Shot = { from: number; to: number; src: string; start?: number; rate?: number; flip?: boolean; living?: "leaf" | "river" };
const SHOTS: Shot[] = [
  { from: 0, to: 12.1, src: "gira/v1.mp4", rate: 0.83 },
  { from: 12.1, to: 22.1, src: "gira/v2.mp4" },
  { from: 22.1, to: 29.2, src: "gira/v4.mp4", rate: 0.7 },
  { from: 29.2, to: 32.3, src: "gira/v3.mp4" },
  { from: 32.3, to: 35.4, src: "gira/v2.mp4", start: 3 },
  { from: 35.4, to: 38.4, src: "gira/v4.mp4", start: 2 },
  { from: 38.4, to: 40.5, src: "gira/v3.mp4", start: 5 },
  { from: 40.5, to: 44.3, src: "gira/v1.mp4", start: 4, flip: true },
  { from: 44.3, to: 54.3, src: "gira/v3.mp4" },
  { from: 54.3, to: 58.9, src: "gira/q5.png", living: "leaf" },
  { from: 58.9, to: 63.4, src: "gira/q6.png", living: "river" },
  { from: 63.4, to: 66.3, src: "gira/v2.mp4", start: 6 },
  { from: 66.3, to: 69.3, src: "gira/v4.mp4", start: 1.5 },
  { from: 69.3, to: 71.5, src: "gira/v3.mp4", start: 2 },
  { from: 71.5, to: GIRA_SECONDS, src: "gira/v1.mp4", start: 2, rate: 0.95 },
];

/** Soft-masked copy of the character region that bobs/breathes over the still. */
const Bob: React.FC<{ src: string; cx: number; cy: number; r: number; base: React.CSSProperties; amp?: number }> = ({ src, cx, cy, r, base, amp = 1 }) => {
  const f = useCurrentFrame();
  const mask = `radial-gradient(ellipse ${r * 100}% ${r * 62}% at ${cx * 100}% ${cy * 100}%, #000 55%, transparent 100%)`;
  return (
    <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask }}>
      <Img
        src={staticFile(src)}
        style={{
          ...base,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: `${cx * 100}% ${cy * 100 + 15}%`,
          transform: `${base.transform ?? ""} translateY(${Math.sin(f / 4.2) * -9 * amp}px) scale(${1 + 0.018 * amp * Math.sin(f / 4.2)}) rotate(${Math.sin(f / 9) * 1.6 * amp}deg)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Butterfly: React.FC<{ x: number; y: number; color: string; delay: number }> = ({ x, y, color, delay }) => {
  const f = useCurrentFrame() + delay;
  const flap = Math.abs(Math.sin(f / 2.2));
  return (
    <div style={{ position: "absolute", left: x + Math.sin(f / 25) * 160 + f * 2.2, top: y + Math.sin(f / 11) * 50 - f * 1.2 }}>
      <svg width={90} height={70} viewBox="-45 -35 90 70" style={{ overflow: "visible" }}>
        <g transform={`scale(${0.25 + 0.75 * flap} 1)`}>
          <path d="M0 0 C-30 -45 -55 -10 -30 6 C-45 30 -10 30 0 6 C10 30 45 30 30 6 C55 -10 30 -45 0 0Z" fill={color} stroke="#3a1d00" strokeWidth={3} />
        </g>
        <rect x={-3} y={-14} width={6} height={30} rx={3} fill="#3a1d00" />
      </svg>
    </div>
  );
};

const LivingStill: React.FC<{ src: string; kind: "leaf" | "river"; dur: number }> = ({ src, kind, dur }) => {
  const f = useCurrentFrame();
  const p = f / dur;
  const base: React.CSSProperties = kind === "leaf" ? { transform: `scale(${1.04 + 0.08 * p})`, transformOrigin: "45% 45%" } : { transform: `scale(${1.1}) translateY(${-40 + 80 * p}px)` };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...base }} />
      {kind === "leaf" ? (
        <>
          {/* sun rays turning */}
          <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.35 }}>
            <div style={{ position: "absolute", left: 1000 - 900, top: 60 - 900, width: 1800, height: 1800, background: "repeating-conic-gradient(from 0deg, rgba(255,240,180,0.55) 0deg 6deg, transparent 6deg 18deg)", rotate: `${f * 0.4}deg`, WebkitMaskImage: "radial-gradient(circle, #000 0%, transparent 60%)", maskImage: "radial-gradient(circle, #000 0%, transparent 60%)" }} />
          </AbsoluteFill>
          <Bob src={src} cx={0.47} cy={0.42} r={0.3} base={base} />
          {/* water vapour leaving the leaf */}
          {Array.from({ length: 22 }).map((_, i) => {
            const life = 70;
            const t = (f + i * 9) % life;
            const x = 180 + ((i * 97) % 700) + Math.sin((f + i * 13) / 9) * 25;
            const y = 1180 - t * 9 - (i % 3) * 40;
            const s = 14 + (i % 4) * 8;
            return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.9)", background: "radial-gradient(circle at 30% 30%, #ffffff, rgba(160,220,255,0.35))", opacity: interpolate(t, [0, 10, life - 15, life], [0, 0.9, 0.9, 0]) }} />;
          })}
          {/* wisps */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`w${i}`} style={{ position: "absolute", left: 250 + i * 160, top: 1050 - ((f * 5 + i * 120) % 700), width: 70, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.35)", filter: "blur(18px)", rotate: `${Math.sin((f + i * 20) / 12) * 18}deg` }} />
          ))}
          <Butterfly x={-60} y={420} color="#ff9a1f" delay={0} />
          <Butterfly x={-300} y={760} color="#4aa8ff" delay={40} />
        </>
      ) : (
        <>
          {/* flowing streaks down the river */}
          {Array.from({ length: 46 }).map((_, i) => {
            const life = 40 + (i % 5) * 6;
            const t = ((f * 1.0 + i * 7) % life) / life;
            const pts = [
              [0.36, 0.07],
              [0.42, 0.3],
              [0.52, 0.55],
              [0.6, 0.8],
              [0.66, 1.05],
            ];
            const k = t * (pts.length - 1);
            const j = Math.min(Math.floor(k), pts.length - 2);
            const u = k - j;
            const spread = (((i * 53) % 100) / 100 - 0.5) * (0.08 + t * 0.5);
            const x = (pts[j][0] + (pts[j + 1][0] - pts[j][0]) * u + spread) * 1080;
            const y = (pts[j][1] + (pts[j + 1][1] - pts[j][1]) * u) * 1920;
            const len = 40 + t * 110;
            return <div key={i} style={{ position: "absolute", left: x, top: y, width: 10 + t * 10, height: len, borderRadius: 99, background: "rgba(255,255,255,0.85)", rotate: "-18deg", opacity: interpolate(t, [0, 0.15, 0.85, 1], [0, 0.9, 0.9, 0]), filter: "blur(1.5px)" }} />;
          })}
          <Bob src={src} cx={0.55} cy={0.6} r={0.42} base={base} amp={0.45} />
          {/* splashes around the droplet */}
          {Array.from({ length: 16 }).map((_, i) => {
            const life = 22;
            const t = (f + i * 5) % life;
            const ang = (i / 16) * Math.PI * 2;
            const r = 230 + t * 9;
            const x = 600 + Math.cos(ang) * r;
            const y = 1250 + Math.sin(ang) * r * 0.35 - Math.sin((t / life) * Math.PI) * 120;
            const s = 12 + (i % 3) * 6;
            return <div key={`s${i}`} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "#ffffff", boxShadow: "0 0 10px #bfe9ff", opacity: interpolate(t, [0, 4, life], [0, 1, 0]) }} />;
          })}
        </>
      )}
    </AbsoluteFill>
  );
};

/** Clip with a little zoom punch on the cut. */
const Clip: React.FC<{ s: Shot }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const punch = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
  return (
    <AbsoluteFill style={{ transform: `${s.flip ? "scaleX(-1) " : ""}scale(${interpolate(punch, [0, 1], [1.12, 1.03]) + frame * 0.0006})` }}>
      <OffthreadVideo src={staticFile(s.src)} muted startFrom={Math.round((s.start ?? 0) * fps)} playbackRate={s.rate ?? 1} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#ffffff", opacity: interpolate(f, [0, 5], [0.55, 0], { extrapolateRight: "clamp" }) }} />;
};

/** Confetti for the last chorus. */
const Confetti: React.FC = () => {
  const f = useCurrentFrame();
  const cols = ["#ffe14d", "#ff6fa8", "#4aa8ff", "#5fd35a", "#ff8a3d"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 40 }).map((_, i) => {
        const x = ((i * 211) % 1080) + Math.sin((f + i * 10) / 10) * 40;
        const y = -60 + ((f * (7 + (i % 4) * 2) + i * 90) % 2050);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 22, height: 34, borderRadius: 5, background: cols[i % 5], rotate: `${f * (4 + (i % 5)) + i * 30}deg`, scale: `${Math.abs(Math.sin((f + i * 7) / 6)) * 0.8 + 0.2} 1` }} />;
      })}
    </AbsoluteFill>
  );
};

/** Sparkle particles for the whole clip (water shimmer). */
const Sparkles: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 18 }).map((_, i) => {
        const x = (i * 137) % 1080;
        const y = 1920 - ((f * (2 + (i % 4)) + i * 211) % 2100);
        const s = 6 + (i % 5) * 3;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "#ffffff", opacity: 0.55, boxShadow: "0 0 14px #bfe9ff" }} />;
      })}
    </AbsoluteFill>
  );
};

/** Lines of lyrics built from the sung words (break on . ! ? or after 6 words). */
const useLines = () =>
  useMemo(() => {
    const lines: W[][] = [];
    let cur: W[] = [];
    for (const w of WORDS) {
      cur.push(w);
      if (/[.!?]$/.test(w.text) || cur.length >= 6) {
        lines.push(cur);
        cur = [];
      }
    }
    if (cur.length) lines.push(cur);
    return lines;
  }, []);

const TERMS: Record<string, { label: string; color: string; icon: string }> = {
  evaporacao: { label: "EVAPORAÇÃO", color: "#ff8a3d", icon: "☀️" },
  condensacao: { label: "CONDENSAÇÃO", color: "#7a8cff", icon: "☁️" },
  precipitacao: { label: "PRECIPITAÇÃO", color: "#2f9bff", icon: "🌧️" },
  transpiracao: { label: "TRANSPIRAÇÃO", color: "#3fbf5a", icon: "🌱" },
};

const Karaoke: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const lines = useLines();
  const idx = lines.findIndex((l, i) => t >= l[0].start - 0.15 && t < (lines[i + 1]?.[0].start ?? 1e9) - 0.15);
  if (idx < 0) return null;
  const line = lines[idx];
  const pop = spring({ frame: frame - Math.round((line[0].start - 0.15) * fps), fps, config: { damping: 12, stiffness: 200 } });
  return (
    <div style={{ position: "absolute", left: 50, right: 50, bottom: 300, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 18, scale: interpolate(pop, [0, 1], [0.85, 1]) }}>
      {line.map((w, i) => {
        const sung = t >= w.start;
        const active = t >= w.start && t < w.end + 0.05;
        const term = TERMS[norm(w.text)];
        return (
          <span
            key={i}
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: 84,
              lineHeight: 1.1,
              color: term && sung ? term.color : sung ? "#ffe14d" : "#ffffff",
              WebkitTextStroke: "10px #1d3b8f",
              paintOrder: "stroke fill",
              textShadow: "0 8px 0 #10245c",
              translate: active ? "0px -10px" : "0px 0px",
              display: "inline-block",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/** Big badge that pops when a water-cycle term is sung. */
const TermBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const hit = [...WORDS].reverse().find((w) => TERMS[norm(w.text)] && t >= w.start && t < w.start + 1.6);
  if (!hit) return null;
  const term = TERMS[norm(hit.text)];
  const s = spring({ frame: frame - Math.round(hit.start * fps), fps, config: { damping: 9, stiffness: 220 } });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", scale: interpolate(s, [0, 1], [0.3, 1]), opacity: interpolate(t - hit.start, [1.3, 1.6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      <span style={{ display: "inline-block", padding: "10px 40px 4px", borderRadius: 999, background: term.color, border: "8px solid #ffffff", boxShadow: "0 10px 0 rgba(0,0,0,0.25)", fontFamily, fontWeight: 800, fontSize: 76, color: "#ffffff", WebkitTextStroke: "4px rgba(0,0,0,0.25)" }}>
        {term.icon} {term.label}
      </span>
    </div>
  );
};

export const GiraAgua: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#7cc8ff" }}>
      {SHOTS.map((s, i) => {
        const from = Math.round(s.from * fps);
        const dur = Math.round((s.to - s.from) * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            {s.living ? <LivingStill src={s.src} kind={s.living} dur={dur} /> : <Clip s={s} />}
            {/* white flash on the cut */}
            {i > 0 ? <Flash /> : null}
          </Sequence>
        );
      })}
      <Sparkles />
      <Sequence from={Math.round(63.4 * fps)}>
        <Confetti />
      </Sequence>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(16,36,92,0.55) 100%)" }} />
      {/* title on the first seconds */}
      {frame < 2.2 * fps ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", opacity: interpolate(frame, [1.8 * fps, 2.2 * fps], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily, fontWeight: 800, fontSize: 120, color: "#ffffff", WebkitTextStroke: "14px #1d3b8f", paintOrder: "stroke fill", textShadow: "0 10px 0 #10245c" }}>Gira, Gira, Água!</span>
        </div>
      ) : null}
      <TermBadge />
      <Karaoke />
      {frame > 73 * fps ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center" }}>
          <span style={{ display: "inline-block", padding: "12px 40px 6px", borderRadius: 999, background: "#ffe14d", border: "8px solid #ffffff", fontFamily, fontWeight: 800, fontSize: 60, color: "#1d3b8f" }}>SALVA e canta junto! 💧</span>
        </div>
      ) : null}
      <Audio src={staticFile("gira/musica.mp3")} />
    </AbsoluteFill>
  );
};
