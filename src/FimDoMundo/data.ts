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


const s2 = at("Em") - 0.3;
const s3 = at("Só", s2) - 0.2;
const s4 = at("No", s3) - 0.2;
const s5 = at("deu", s4) - 0.4;
const s6 = at("lição:", s5) - 0.3;

export const SCENE_STARTS = [0, s2, s3, s4, s5, s6, VIDEO_SECONDS];

/** Words drawn in colour in the captions. */
export const KEYWORDS: Record<string, string> = {
  ontem: "redNeon",
  equacao: "gold",
  science: "susNeon",
  "202687": "redNeon",
  zero: "redNeon",
  infinito: "redNeon",
  "200bilhoes": "redNeon",
  "83bilhoes": "gold",
  pico: "gold",
  "2": "gold",
  "1": "gold",
  "103bilhoes": "susNeon",
  sempre: "gold",
  comenta: "gold",
};

/** World population (billions) – UN estimates, and the 1960 fitted formula. */
export const REAL: [number, number][] = [
  [1900, 1.6], [1920, 1.9], [1940, 2.3], [1950, 2.5], [1960, 3.0], [1970, 3.7], [1980, 4.4], [1990, 5.3], [2000, 6.1], [2010, 6.9], [2020, 7.8], [2026, 8.3],
];
export const PROJ: [number, number][] = [[2026, 8.3], [2040, 9.2], [2050, 9.7], [2060, 10.0], [2070, 10.2], [2084, 10.3], [2100, 10.2]];
export const formula = (t: number) => 1.79e11 / Math.pow(2026.87 - t, 0.99) / 1e9;
/** Annual growth rate (%) – UN WPP, rounded. */
export const RATE: [number, number][] = [
  [1950, 1.8], [1955, 1.9], [1960, 1.4], [1963, 2.3], [1970, 2.1], [1980, 1.8], [1990, 1.7], [2000, 1.3], [2010, 1.2], [2020, 0.9], [2026, 0.8],
];
