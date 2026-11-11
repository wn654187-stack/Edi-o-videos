import { loadFont as loadSora } from "@remotion/google-fonts/Sora";

/** Brand font: geometric sans used for every title and caption. */
export const { fontFamily: brandFont } = loadSora("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
});

/**
 * "Will te explica" palette, taken from the profile avatar
 * (black, off-white W, lime bar, electric blue, orange-red dot).
 */
export const brand = {
  bg: "#07070b",
  bg2: "#111018",
  ink: "#f3f1ea",
  muted: "#9a96a8",
  lime: "#d8ff3e",
  blue: "#3b3bff",
  blueSoft: "#7b7bff",
  orange: "#ff5a1f",
  orangeSoft: "#ff9a5c",
  glass: "rgba(255,255,255,0.05)",
  glassBorder: "rgba(255,255,255,0.12)",
};

export type Accent = "lime" | "blue" | "orange";
export const accentColor = (a: Accent) => (a === "lime" ? brand.lime : a === "blue" ? brand.blue : brand.orange);
/** Text colour to use on top of a solid accent fill. */
export const onAccent = (a: Accent) => (a === "blue" ? brand.ink : brand.bg);

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const softGlow = (c: string, k = 1) => `0 0 ${18 * k}px ${c}66, 0 0 ${48 * k}px ${c}33`;
