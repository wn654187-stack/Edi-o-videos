// Scene boundaries and caption cues (seconds). Without a narration take the cues
// follow these fixed timings; replace them with the real word timings once the
// voice-over is recorded.

export const FPS = 30;
/** Frames two consecutive scenes overlap for the cross-dissolve. */
export const XFADE = 15;

export type SceneDef = { id: string; label: string; from: number; to: number };

export const SCENES: SceneDef[] = [
  { id: "origem", label: "01 · A Origem", from: 0, to: 8 },
  { id: "escala", label: "02 · A Escala", from: 8, to: 14 },
  { id: "alquimia", label: "03 · A Alquimia", from: 14, to: 20 },
  { id: "poder", label: "04 · O Poder", from: 20, to: 26.5 },
  { id: "aplicacao", label: "05 · A Aplicação", from: 26.5, to: 33.5 },
  { id: "futuro", label: "06 · O Futuro", from: 33.5, to: 43 },
];

export const VIDEO_SECONDS = SCENES[SCENES.length - 1].to;

export type Cue = { from: number; to: number; text: string };

export const CUES: Cue[] = [
  { from: 0.8, to: 3.6, text: "Elas não são raras por escassez," },
  { from: 3.6, to: 6.6, text: "mas por sua timidez em se revelar." },
  { from: 6.8, to: 9.6, text: "Escondidas no coração da rocha..." },
  { from: 10.2, to: 13.8, text: "As terras raras são a força invisível" },
  { from: 14.0, to: 17.6, text: "que move o mundo moderno." },
  { from: 21.0, to: 25.6, text: "Do magnetismo que gira as turbinas de vento..." },
  { from: 26.6, to: 31.4, text: "...aos motores dos nossos carros elétricos." },
  { from: 34.2, to: 37.0, text: "Dezessete elementos da tabela periódica." },
  { from: 37.2, to: 39.4, text: "Uma revolução silenciosa." },
  { from: 39.6, to: 42.6, text: "O poder do nosso futuro." },
];

/** Words highlighted in gold in the captions. */
export const KEYWORDS = new Set([
  "raras",
  "rocha",
  "terras",
  "invisível",
  "magnetismo",
  "turbinas",
  "elétricos",
  "dezessete",
  "revolução",
  "futuro",
]);

// Periodic table, by atomic number (index + 1).
export const SYMBOLS =
  "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og".split(
    " ",
  );

/** Grid position (1-based column, row) of element Z. f-block sits on rows 9–10. */
export const cellOf = (z: number): { col: number; row: number } => {
  if (z === 1) return { col: 1, row: 1 };
  if (z === 2) return { col: 18, row: 1 };
  const block = (start: number, row: number) => {
    const i = z - start;
    if (i < 2) return { col: i + 1, row };
    return { col: i + 11, row };
  };
  if (z <= 10) return block(3, 2);
  if (z <= 18) return block(11, 3);
  if (z <= 36) return { col: z - 18, row: 4 };
  if (z <= 54) return { col: z - 36, row: 5 };
  if (z <= 56) return { col: z - 54, row: 6 };
  if (z <= 71) return { col: z - 54, row: 9 };
  if (z <= 86) return { col: z - 68, row: 6 };
  if (z <= 88) return { col: z - 86, row: 7 };
  if (z <= 103) return { col: z - 86, row: 10 };
  return { col: z - 100, row: 7 };
};

/** Sc, Y and the 15 lanthanides: the 17 rare-earth elements. */
export const isRareEarth = (z: number) => z === 21 || z === 39 || (z >= 57 && z <= 71);
