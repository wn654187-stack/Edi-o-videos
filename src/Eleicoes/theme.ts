import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: headlineFont } = loadAnton("normal", {
  weights: ["400"],
  subsets: ["latin", "latin-ext"],
});

export const { fontFamily: bodyFont } = loadInter("normal", {
  weights: ["600", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

export const colors = {
  bg: "#05060f",
  bg2: "#0b1030",
  blue: "#2f7bff",
  blueNeon: "#4fb3ff",
  red: "#ff3150",
  redNeon: "#ff6b81",
  gold: "#ffc93c",
  purple: "#b46bff",
  white: "#f4f6ff",
  muted: "#8a93b8",
};

export const glow = (color: string, strength = 1) =>
  `0 0 ${12 * strength}px ${color}, 0 0 ${32 * strength}px ${color}88`;

export const textGlow = (color: string, strength = 1) =>
  `0 0 ${10 * strength}px ${color}, 0 0 ${28 * strength}px ${color}aa`;

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
