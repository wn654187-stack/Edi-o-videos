import React, { useMemo } from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon, IconName } from "../brand/Icons";
import { GlassCard } from "../brand/Glass";
import { Accent, accentColor, brand, brandFont, clamp, onAccent } from "../brand/theme";

type TimedWord = { text: string; start: number; end: number };

/** 16:9 stage background (dot grid, two drifting glows, vignette). */
export const WideBackground: React.FC<{ glow?: string; glow2?: string }> = ({ glow = brand.orange, glow2 = brand.blue }) => {
  const t = useCurrentFrame() / 30;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${brand.bg2} 0%, ${brand.bg} 70%)` }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1.6px, transparent 1.6px)", backgroundSize: "44px 44px", opacity: 0.55 }} />
      <div style={{ position: "absolute", left: 200 + Math.sin(t / 4) * 80, top: 200 + Math.cos(t / 5) * 50, width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${glow}1f 0%, transparent 65%)` }} />
      <div style={{ position: "absolute", left: 1000 + Math.cos(t / 3.5) * 80, top: 150 + Math.sin(t / 4.5) * 50, width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${glow2}1c 0%, transparent 65%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Compact header for 16:9: label + icon tile + title, top-left. */
export const WideLabel: React.FC<{ label: string; title: React.ReactNode; icon: IconName; accent: Accent; instant?: boolean }> = ({ label, title, icon, accent, instant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = instant ? 1 : spring({ frame: frame - 2, fps, config: { damping: 14, stiffness: 170 } });
  const c = accentColor(accent);
  return (
    <div style={{ position: "absolute", left: 64, top: 56, opacity: interpolate(s, [0, 0.4], [0, 1], clamp), translate: `${interpolate(s, [0, 1], [-40, 0])}px 0px` }}>
      <GlassCard accent={accent} style={{ padding: "16px 30px 18px 18px", display: "flex", alignItems: "center", gap: 20, background: "linear-gradient(160deg, rgba(20,18,30,0.86), rgba(10,10,16,0.8))" }}>
        <div style={{ width: 76, height: 76, borderRadius: 20, background: c, display: "flex", alignItems: "center", justifyContent: "center", scale: "0.8" }}>
          <Icon name={icon} color={onAccent(accent)} />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 22, color: brand.muted }}>{label}</div>
          <div style={{ fontWeight: 800, fontSize: 44, lineHeight: 1.05, color: brand.ink, letterSpacing: -0.5 }}>{title}</div>
        </div>
      </GlassCard>
    </div>
  );
};

/** Scene wrapper with a short fade (skipped for the opening scene). */
export const WideScene: React.FC<{ instant?: boolean; children: React.ReactNode }> = ({ instant, children }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: instant ? 1 : interpolate(frame, [0, 8], [0, 1], clamp) }}>{children}</AbsoluteFill>;
};

const buildChunks = (words: TimedWord[], fps: number) => {
  const groups: TimedWord[][] = [];
  let cur: TimedWord[] = [];
  for (const w of words) {
    cur.push(w);
    if (cur.length >= 7 || /[?!]$/.test(w.text) || (cur.length >= 3 && /[.,:;]$/.test(w.text))) {
      groups.push(cur);
      cur = [];
    }
  }
  if (cur.length) groups.push(cur);
  return groups.map((g, i) => {
    const next = groups[i + 1];
    const last = g[g.length - 1];
    const endSec = next ? Math.min(next[0].start, last.end + 0.6) : last.end + 1;
    return { start: i === 0 ? 0 : Math.round(g[0].start * fps) - 1, end: Math.round(endSec * fps), words: g.map((w) => w.text) };
  });
};

/** Lower-third captions for 16:9 with keyword colouring. */
export const WideCaptions: React.FC<{ words: TimedWord[]; colorOf: (w: string) => string | null }> = ({ words, colorOf }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks = useMemo(() => buildChunks(words, fps), [words, fps]);
  const chunk = chunks.find((c) => frame >= c.start && frame < c.end);
  if (!chunk) return null;
  const local = frame - chunk.start;
  return (
    <div style={{ position: "absolute", left: 240, right: 240, bottom: 54, display: "flex", justifyContent: "center", opacity: chunk.start === 0 ? 1 : interpolate(local, [0, 3], [0, 1], clamp) }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 14, padding: "10px 26px", borderRadius: 18, background: "rgba(7,7,11,0.72)", fontFamily: brandFont, fontWeight: 700, fontSize: 46, lineHeight: 1.2, textAlign: "center" }}>
        {chunk.words.map((w, i) => (
          <span key={i} style={{ color: colorOf(w) ?? brand.ink }}>
            {w}
          </span>
        ))}
      </div>
    </div>
  );
};

export type WideVideoProps = { narration: string; music: string; musicVolume: number; showCaptions: boolean };

export const WideVideo: React.FC<
  WideVideoProps & {
    scenes: React.FC<{ from: number }>[];
    sceneStarts: number[];
    words: TimedWord[];
    colorOf: (w: string) => string | null;
    tag: string;
    chapterTitles: string[];
  }
> = ({ narration, music, musicVolume, showCaptions, scenes, sceneStarts, words, colorOf, tag, chapterTitles }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const current = sceneStarts.findIndex((s, i) => frame >= s * fps && frame < (sceneStarts[i + 1] ?? 1e9) * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: brand.bg, overflow: "hidden" }}>
      <WideBackground />
      {scenes.map((Scene, i) => {
        const from = Math.round(sceneStarts[i] * fps);
        const to = Math.round(sceneStarts[i + 1] * fps);
        return (
          <Sequence key={i} name={chapterTitles[i] ?? `Cena ${i + 1}`} from={from} durationInFrames={to - from}>
            <Scene from={from / fps} />
          </Sequence>
        );
      })}
      {/* chapter progress segments */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 6, display: "flex", gap: 4 }}>
        {scenes.map((_, i) => {
          const a = sceneStarts[i] * fps;
          const b = sceneStarts[i + 1] * fps;
          const p = Math.min(1, Math.max(0, (frame - a) / (b - a)));
          return (
            <div key={i} style={{ flex: b - a, background: "rgba(255,255,255,0.12)" }}>
              <div style={{ width: `${p * 100}%`, height: "100%", background: brand.lime }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 64, top: 70, display: "flex", alignItems: "center", gap: 12, fontFamily: brandFont, fontWeight: 700, fontSize: 22, color: brand.ink, opacity: 0.8 }}>
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: brand.orange, boxShadow: `0 0 12px ${brand.orange}` }} />
        {tag}
        {current >= 0 && chapterTitles[current] ? <span style={{ color: brand.muted }}>· {chapterTitles[current]}</span> : null}
      </div>
      {showCaptions ? <WideCaptions words={words} colorOf={colorOf} /> : null}
      {narration ? <Audio src={staticFile(narration)} /> : null}
      {music ? <Audio src={staticFile(music)} volume={musicVolume} loop /> : null}
      <div style={{ display: "none" }}>{durationInFrames}</div>
    </AbsoluteFill>
  );
};
