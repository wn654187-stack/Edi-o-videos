import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, brandFont, clamp } from "./theme";

type TimedWord = { text: string; start: number; end: number };
type Chunk = { start: number; end: number; words: string[] };

const buildChunks = (words: TimedWord[], fps: number, maxWords: number): Chunk[] => {
  const groups: TimedWord[][] = [];
  let cur: TimedWord[] = [];
  for (const w of words) {
    cur.push(w);
    if (cur.length >= maxWords || /[?!]$/.test(w.text) || (cur.length >= 3 && /[.,:;]$/.test(w.text))) {
      groups.push(cur);
      cur = [];
    }
  }
  if (cur.length) groups.push(cur);
  return groups.map((g, i) => {
    const next = groups[i + 1];
    const last = g[g.length - 1];
    const endSec = next ? Math.min(next[0].start, last.end + 0.8) : last.end + 1;
    return { start: i === 0 ? 0 : Math.round(g[0].start * fps) - 1, end: Math.round(endSec * fps), words: g.map((w) => w.text) };
  });
};

/** Big statement-style captions (like "Eu não sou humano."), keywords in an accent colour. */
export const BrandCaptions: React.FC<{ words: TimedWord[]; colorOf: (w: string) => string | null }> = ({ words, colorOf }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks = useMemo(() => buildChunks(words, fps, 4), [words, fps]);
  const chunk = chunks.find((c) => frame >= c.start && frame < c.end);
  if (!chunk) return null;
  const local = frame - chunk.start;
  const pop = chunk.start === 0 ? 1 : spring({ frame: local, fps, config: { damping: 16, stiffness: 240 } });
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 130,
        top: 1270,
        height: 240,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignContent: "center",
        columnGap: 20,
        fontFamily: brandFont,
        fontWeight: 800,
        fontSize: 70,
        letterSpacing: -1,
        lineHeight: 1.08,
        textAlign: "center",
        opacity: chunk.start === 0 ? 1 : interpolate(local, [0, 2], [0, 1], clamp),
        translate: `0px ${interpolate(pop, [0, 1], [18, 0])}px`,
      }}
    >
      {chunk.words.map((w, i) => {
        const c = colorOf(w);
        return (
          <span key={i} style={{ color: c ?? brand.ink, textShadow: "0 4px 24px rgba(0,0,0,0.85)" }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};
