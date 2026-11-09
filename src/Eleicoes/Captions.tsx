import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { KEYWORDS } from "./data";
import narration from "./narration.json";
import { bodyFont, clamp, colors, textGlow } from "./theme";

type Chunk = { start: number; end: number; words: string[] };

const MAX_WORDS = 4;

/** Groups the narration's timed words into short caption chunks. */
const buildChunks = (fps: number): Chunk[] => {
  const words = narration.words;
  const groups: (typeof words)[] = [];
  let current: typeof words = [];
  for (const w of words) {
    current.push(w);
    if (current.length >= MAX_WORDS || /[.,!?:]$/.test(w.text)) {
      groups.push(current);
      current = [];
    }
  }
  if (current.length) groups.push(current);

  return groups.map((g, i) => {
    const next = groups[i + 1];
    const last = g[g.length - 1];
    const endSec = next ? Math.min(next[0].start, last.end + 0.8) : last.end + 1;
    return {
      start: Math.round(g[0].start * fps) - 1,
      end: Math.round(endSec * fps),
      words: g.map((w) => w.text),
    };
  });
};

const colorOf = (word: string) => {
  const key = word.replace(/[^\p{L}\p{N}]/gu, "");
  const tone = KEYWORDS[key];
  if (!tone) return null;
  return colors[tone as keyof typeof colors];
};

/** Centre-screen dynamic captions with keyword colouring. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks = useMemo(() => buildChunks(fps), [fps]);
  const chunk = chunks.find((c) => frame >= c.start && frame < c.end);
  if (!chunk) return null;

  const local = frame - chunk.start;
  const pop = spring({ frame: local, fps, config: { damping: 14, stiffness: 260 } });

  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        right: 50,
        top: 1480,
        height: 280,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        alignContent: "center",
        columnGap: 22,
        rowGap: 4,
        fontFamily: bodyFont,
        fontWeight: 900,
        fontSize: 76,
        lineHeight: 1.1,
        textAlign: "center",
        scale: interpolate(pop, [0, 1], [0.82, 1]),
        opacity: interpolate(local, [0, 2], [0, 1], clamp),
      }}
    >
      {chunk.words.map((w, i) => {
        const c = colorOf(w);
        return (
          <span
            key={i}
            style={{
              color: c ?? colors.white,
              textShadow: c
                ? textGlow(c, 0.8)
                : "0 6px 0 rgba(0,0,0,0.9), 0 0 18px rgba(0,0,0,0.9)",
              WebkitTextStroke: c ? undefined : "2px rgba(0,0,0,0.6)",
              textTransform: c ? "uppercase" : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
