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

const LAST = WORDS[WORDS.length - 1];
export const VIDEO_SECONDS = Math.ceil(LAST.end + 1.6);

// Scene boundaries follow the narration: each scene starts on its first spoken word.
const s2 = at("Antes");
const s3 = at("Isso", s2);
const s4 = at("Três", s3);
const s5 = at("Hoje", s4);
const s6 = at("Mas", s5);
const s7 = at("você", at("fortalecêla", s6)) - 0.35;

export const SCENE_STARTS = [0, s2, s3, s4, s5, s6, s7, VIDEO_SECONDS];

/** Words drawn in colour in the captions. */
export const KEYWORDS: Record<string, string> = {
  enem: "gold",
  sus: "susNeon",
  valorizacao: "green",
  universal: "green",
  universalidade: "green",
  integralidade: "susNeon",
  equidade: "gold",
  1988: "gold",
  1986: "gold",
  1990: "gold",
  1989: "gold",
  "8080": "gold",
  "196": "gold",
  carteira: "susNeon",
  caridade: "redNeon",
  direito: "green",
  dever: "green",
  previdencia: "susNeon",
  sete: "gold",
  "7": "gold",
  dez: "gold",
  "10": "gold",
  polio: "redNeon",
  filas: "redNeon",
  falta: "redNeon",
  insuficiente: "redNeon",
  reconhecer: "green",
  propor: "green",
  comentarios: "gold",
  domingo: "gold",
};
