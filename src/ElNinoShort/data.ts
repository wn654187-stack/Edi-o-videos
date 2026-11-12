import { useVideoConfig } from "remotion";
import narration from "./narration.json";

export type Word = { text: string; start: number; end: number };
export const WORDS: Word[] = narration.words;
/** Chapter start times (s) in the assembled narration. */
export const CHAPTERS: { id: string; title: string; start: number }[] = narration.chapters;

export const norm = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

/** Start time (s) of the first spoken word equal to `word` at or after `after`, or null. */
export const find = (word: string, after = 0): number | null => {
  const n = norm(word);
  const w = WORDS.find((x) => x.start >= after - 0.05 && norm(x.text) === n);
  return w ? w.start : null;
};

/** Frame (relative to the scene start) where `word` is spoken; tries alternatives, else `fallback` frames. */
export const useCue = (from: number) => {
  const { fps } = useVideoConfig();
  return (words: string | string[], fallback = 0, after?: number) => {
    for (const w of Array.isArray(words) ? words : [words]) {
      const t = find(w, after ?? from);
      if (t !== null) return Math.round((t - from) * fps);
    }
    return fallback;
  };
};

export const VIDEO_SECONDS = Math.ceil(WORDS[WORDS.length - 1].end + 2.4);
export const SCENE_STARTS = [...CHAPTERS.map((c) => c.start), VIDEO_SECONDS];

export const KEYWORDS: Record<string, string> = {
  nino: "redNeon",
  nina: "blue",
  pacifico: "susNeon",
  amazonia: "redNeon",
  seca: "redNeon",
  secas: "redNeon",
  chuva: "blue",
  chuvas: "blue",
  enchentes: "blue",
  quente: "redNeon",
  fria: "blue",
  frio: "blue",
  alisios: "gold",
  ressurgencia: "gold",
  ventos: "gold",
  brasil: "gold",
  "2026": "gold",
  cafe: "gold",
  calor: "redNeon",
  forte: "redNeon",
  sul: "blue",
  nordeste: "redNeon",
  inscreve: "gold",
  comenta: "gold",
};
