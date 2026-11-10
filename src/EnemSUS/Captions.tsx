import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { KEYWORDS, WORDS, norm } from "./data";
import { bodyFont, clamp, colors, textGlow } from "./theme";

type Chunk = { start: number; end: number; words: string[] };
type TimedWord = { text: string; start: number; end: number };

/** Groups timed narration words into short caption chunks. */
const buildChunks = (words: TimedWord[], fps: number, MAX_WORDS: number): Chunk[] => {
  const groups: TimedWord[][] = [];
  let current: TimedWord[] = [];
  for (const w of words) {
    current.push(w);
    if (current.length >= MAX_WORDS || (current.length >= 3 && /[.,!?:;]$/.test(w.text))) {
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

const susColorOf = (word: string) => {
  const tone = KEYWORDS[norm(word)];
  return tone ? colors[tone as keyof typeof colors] : null;
};

/** Lower dynamic captions with keyword colouring (16:9 and 9:16). */
export const CaptionsBase: React.FC<{
  words: TimedWord[];
  colorOf: (word: string) => string | null;
}> = ({ words, colorOf }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const v = height > width;
  const chunks = useMemo(() => buildChunks(words, fps, v ? 4 : 6), [words, fps, v]);
  const chunk = chunks.find((c) => frame >= c.start && frame < c.end);
  if (!chunk) return null;

  const local = frame - chunk.start;
  const pop = spring({ frame: local, fps, config: { damping: 14, stiffness: 260 } });

  return (
    <div
      style={{
        position: "absolute",
        left: v ? 80 : 160,
        right: v ? 140 : 160,
        top: v ? 1290 : 905,
        height: v ? 230 : 130,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        alignContent: "center",
        columnGap: 18,
        fontFamily: bodyFont,
        fontWeight: 900,
        fontSize: v ? 70 : 56,
        lineHeight: 1.1,
        textAlign: "center",
        scale: interpolate(pop, [0, 1], [0.86, 1]),
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
              textShadow: c ? textGlow(c, 0.7) : "0 5px 0 rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.9)",
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

export const Captions: React.FC = () => <CaptionsBase words={WORDS} colorOf={susColorOf} />;
