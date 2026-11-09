import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: titleFont } = loadCinzel("normal", {
  weights: ["400", "700"],
  subsets: ["latin", "latin-ext"],
});

export const { fontFamily: bodyFont } = loadInter("normal", {
  weights: ["400", "600", "800"],
  subsets: ["latin", "latin-ext"],
});

export const W = 1920;
export const H = 1080;
/** Height of each cinematic letterbox bar (≈2.39:1 picture). */
export const BAR = 130;

export const colors = {
  black: "#020205",
  crystalBlue: "#3fb4ff",
  crystalPurple: "#9a5cff",
  cyan: "#3ff5ff",
  neonGreen: "#6dff7a",
  gold: "#ffcc4d",
  goldDeep: "#e8961c",
  silver: "#d9e2ee",
  magenta: "#ff4fd8",
  white: "#f6f8ff",
};

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const glow = (color: string, s = 1) =>
  `drop-shadow(0 0 ${8 * s}px ${color}) drop-shadow(0 0 ${24 * s}px ${color})`;
