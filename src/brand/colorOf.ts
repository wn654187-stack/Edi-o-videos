import { brand } from "./theme";

/** Maps the per-video keyword tones (legacy names) onto the brand palette. */
const TONES: Record<string, string> = {
  gold: brand.lime,
  green: brand.lime,
  redNeon: brand.orange,
  red: brand.orange,
  susNeon: brand.blueSoft,
  blue: brand.blueSoft,
  purple: brand.blueSoft,
  orange: brand.orange,
  white: brand.ink,
};

export const makeColorOf = (keywords: Record<string, string>, norm: (w: string) => string) => (word: string) => {
  const tone = keywords[norm(word)];
  return tone ? TONES[tone] ?? brand.lime : null;
};
