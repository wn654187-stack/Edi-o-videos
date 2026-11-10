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




const s2 = at("Um", at("isso"));
const s3 = at("Dois", s2);
const s4 = at("Três", at("Proporção", s3));
const s5 = at("Quatro", s4);
const s6 = at("Cinco", s5);
const s7 = at("dica", s6) - 0.55;
const s8 = at("Qual", s7);

export const SCENE_STARTS = [0, s2, s3, s4, s5, s6, s7, s8, VIDEO_SECONDS];

/** Words drawn in colour in the captions. */
export const KEYWORDS: Record<string, string> = {
  enem: "gold",
  minuto: "gold",
  ecologia: "green",
  energia: "gold",
  "10": "gold",
  mercurio: "redNeon",
  biomagnificacao: "green",
  genetica: "purple",
  heterozigotos: "purple",
  dominante: "purple",
  recessivo: "purple",
  "31": "gold",
  quimica: "susNeon",
  organica: "susNeon",
  funcional: "susNeon",
  alcool: "susNeon",
  carboxilico: "susNeon",
  newton: "redNeon",
  forca: "redNeon",
  acao: "redNeon",
  reacao: "redNeon",
  foguete: "gold",
  eletrica: "gold",
  potencia: "gold",
  "5000w": "gold",
  "150kwh": "gold",
  oh: "susNeon",
  cooh: "gold",
  ouro: "gold",
  enunciado: "green",
  calma: "green",
  comenta: "gold",
  matematica: "gold",
};
