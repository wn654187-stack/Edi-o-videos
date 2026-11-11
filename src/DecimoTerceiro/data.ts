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

const s2 = at("primeira") - 0.35;
const s3 = at("segunda", s2) - 0.35;
const s4 = at("Não", s3) - 0.1;
const s5 = at("Foi", s4) - 0.1;
const s6 = at("Comenta", s5) - 0.1;

export const SCENE_STARTS = [0, s2, s3, s4, s5, s6, VIDEO_SECONDS];

/** Words drawn in colour in the captions. */
export const KEYWORDS: Record<string, string> = {
  "13": "gold",
  dia3011: "gold",
  dia30: "gold",
  "2012": "gold",
  metade: "gold",
  desconto: "green",
  r3000: "white",
  r1500: "green",
  inss: "redNeon",
  imposto: "redNeon",
  renda: "redNeon",
  menor: "redNeon",
  "112": "susNeon",
  "15": "susNeon",
  "6": "susNeon",
  proporcional: "green",
  multada: "redNeon",
  denuncia: "gold",
  comenta: "gold",
};
