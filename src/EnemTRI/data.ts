import { useVideoConfig } from "remotion";
import narration from "./narration.json";

export type Word = { text: string; start: number; end: number };
export const WORDS: Word[] = narration.words;

export const norm = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

/** Start time (s) of the first spoken word equal to `word` at or after `after` seconds. */
export const at = (word: string, after = 0): number => {
  const n = norm(word);
  const w = WORDS.find((x) => x.start >= after - 0.05 && norm(x.text) === n);
  if (!w) throw new Error(`Narration cue not found: "${word}" after ${after}s`);
  return w.start;
};

/** Frame (relative to the scene start `from`) at which `word` is spoken. */
export const useCue = (from: number) => {
  const { fps } = useVideoConfig();
  return (word: string, after?: number) => Math.round((at(word, after ?? from) - from) * fps);
};

export const VIDEO_SECONDS = Math.ceil(WORDS[WORDS.length - 1].end + 2.4);




const s2 = at("TRI") - 0.5;
const s3 = at("Cada", s2);
const s4 = at("Então", s3);
const s5 = at("conferiu", s4) - 0.35;

export const SCENE_STARTS = [0, s2, s3, s4, s5, VIDEO_SECONDS];

/** Words drawn in colour in the captions. */
export const KEYWORDS: Record<string, string> = {
  "30": "gold",
  diferentes: "redNeon",
  segue: "redNeon",
  tri: "gold",
  teoria: "gold",
  quantas: "susNeon",
  quais: "green",
  dificuldade: "gold",
  faceis: "green",
  dificeis: "purple",
  chute: "redNeon",
  menos: "redNeon",
  coerencia: "green",
  mais: "green",
  branco: "gold",
  errar: "gold",
  gabarito: "gold",
  comenta: "gold",
};
