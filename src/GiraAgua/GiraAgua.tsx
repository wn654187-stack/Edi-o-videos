import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Baloo2";
import lyrics from "./lyrics.json";

const { fontFamily } = loadFont("normal", { weights: ["600", "800"], subsets: ["latin", "latin-ext"] });

type W = { text: string; start: number; end: number };
const WORDS: W[] = lyrics.words;
export const GIRA_SECONDS = 77;

const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");

/** Visual track: [start s, end s, kind, file, motion]. Videos are 10 s Kling clips; stills get gentle camera moves. */
type Shot = { from: number; to: number; src: string; video?: boolean; motion?: "zoomIn" | "zoomOut" | "panUp" | "panDown" | "panLeft" | "float"; flip?: boolean };
const SHOTS: Shot[] = [
  { from: 0, to: 10, src: "gira/v1.mp4", video: true },
  { from: 10, to: 12.1, src: "gira/q1.png", motion: "zoomIn" },
  { from: 12.1, to: 22.1, src: "gira/v2.mp4", video: true },
  { from: 22.1, to: 32.3, src: "gira/q3.png", motion: "float" },
  { from: 32.3, to: 42.3, src: "gira/v1.mp4", video: true, flip: true },
  { from: 42.3, to: 44.3, src: "gira/q2.png", motion: "panUp" },
  { from: 44.3, to: 54.3, src: "gira/v3.mp4", video: true },
  { from: 54.3, to: 58.9, src: "gira/q5.png", motion: "zoomIn" },
  { from: 58.9, to: 63.4, src: "gira/q6.png", motion: "panDown" },
  { from: 63.4, to: GIRA_SECONDS, src: "gira/q7.png", motion: "zoomOut" },
];

const Still: React.FC<{ src: string; motion: Shot["motion"]; dur: number }> = ({ src, motion, dur }) => {
  const f = useCurrentFrame();
  const p = f / dur;
  const t = (a: number, b: number) => a + (b - a) * p;
  const style: React.CSSProperties =
    motion === "zoomIn"
      ? { scale: t(1.0, 1.12) }
      : motion === "zoomOut"
        ? { scale: t(1.18, 1.02) }
        : motion === "panUp"
          ? { scale: 1.15, translate: `0px ${t(60, -60)}px` }
          : motion === "panDown"
            ? { scale: 1.15, translate: `0px ${t(-60, 60)}px` }
            : motion === "panLeft"
              ? { scale: 1.15, translate: `${t(50, -50)}px 0px` }
              : { scale: 1.06, translate: `0px ${Math.sin(f / 20) * 14}px`, rotate: `${Math.sin(f / 30) * 0.8}deg` };
  return <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />;
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
            <AbsoluteFill style={{ transform: s.flip ? "scaleX(-1)" : undefined }}>
              {s.video ? <OffthreadVideo src={staticFile(s.src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Still src={s.src} motion={s.motion} dur={dur} />}
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <Sparkles />
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
