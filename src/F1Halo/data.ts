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
  const w = WORDS.find((x) => x.start >= after - 0.01 && norm(x.text) === n);
  if (!w) throw new Error(`Narration cue not found: "${word}" after ${after}s`);
  return w.start;
};

/** Frame (relative to the scene start `from`) at which `word` is spoken. */
export const useCue = (from: number) => {
  const { fps } = useVideoConfig();
  return (word: string, after?: number) => Math.round((at(word, after ?? from) - from) * fps);
};

export const VIDEO_SECONDS = Math.ceil(WORDS[WORDS.length - 1].end + 2.4);

const s2 = at("Bahrein");
const s3 = at("impacto", s2) - 0.3;
const s4 = at("atravessou", s3) - 0.45;
const s5 = at("Mas", s4);
const s6 = at("Segundo", s5);
const s7 = at("ironia", s6) - 0.35;
const s8 = at("segunda", s7) - 0.15;
const s9 = at("você", s8) - 0.3;

export const SCENE_STARTS = [0, s2, s3, s4, s5, s6, s7, s8, s9, VIDEO_SECONDS];

/** Words drawn in colour in the captions. */
export const KEYWORDS: Record<string, string> = {
  "190": "gold",
  meio: "redNeon",
  fogo: "orange",
  andando: "green",
  fisica: "blue",
  bahrein: "gold",
  "2020": "gold",
  grosjean: "white",
  barreira: "redNeon",
  "67": "gold",
  g: "gold",
  "70": "gold",
  "5": "gold",
  toneladas: "gold",
  combustivel: "orange",
  halo: "blue",
  titanio: "blue",
  onibus: "gold",
  sobrevivencia: "blue",
  carbono: "blue",
  macacao: "orange",
  "30": "gold",
  chamas: "orange",
  ironia: "gold",
  criticado: "redNeon",
  newton: "blue",
  desaceleracao: "gold",
  forca: "redNeon",
  desmanchar: "orange",
  comenta: "gold",
};
