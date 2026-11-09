// Tile-grid cartogram of the 50 states + DC: [code, column, row, electoral votes (2024–2028)]
export type StateTile = { code: string; col: number; row: number; ev: number };

const raw: [string, number, number, number][] = [
  ["AK", 0, 0, 3], ["ME", 11, 0, 4],
  ["WI", 6, 1, 10], ["VT", 10, 1, 3], ["NH", 11, 1, 4],
  ["WA", 1, 2, 12], ["ID", 2, 2, 4], ["MT", 3, 2, 4], ["ND", 4, 2, 3], ["MN", 5, 2, 10],
  ["IL", 6, 2, 19], ["MI", 7, 2, 15], ["NY", 9, 2, 28], ["MA", 10, 2, 11],
  ["OR", 1, 3, 8], ["NV", 2, 3, 6], ["WY", 3, 3, 3], ["SD", 4, 3, 3], ["IA", 5, 3, 6],
  ["IN", 6, 3, 11], ["OH", 7, 3, 17], ["PA", 8, 3, 19], ["NJ", 9, 3, 14], ["CT", 10, 3, 7], ["RI", 11, 3, 4],
  ["CA", 1, 4, 54], ["UT", 2, 4, 6], ["CO", 3, 4, 10], ["NE", 4, 4, 5], ["MO", 5, 4, 10],
  ["KY", 6, 4, 8], ["WV", 7, 4, 4], ["VA", 8, 4, 13], ["MD", 9, 4, 10], ["DE", 10, 4, 3],
  ["AZ", 2, 5, 11], ["NM", 3, 5, 5], ["KS", 4, 5, 6], ["AR", 5, 5, 6], ["TN", 6, 5, 11],
  ["NC", 7, 5, 16], ["SC", 8, 5, 9], ["DC", 9, 5, 3],
  ["OK", 4, 6, 7], ["LA", 5, 6, 8], ["MS", 6, 6, 6], ["AL", 7, 6, 9], ["GA", 8, 6, 16],
  ["HI", 0, 7, 4], ["TX", 4, 7, 40], ["FL", 9, 7, 30],
];

export const STATES: StateTile[] = raw.map(([code, col, row, ev]) => ({ code, col, row, ev }));
export const MAP_COLS = 12;
export const MAP_ROWS = 8;
export const TOTAL_EV = STATES.reduce((sum, s) => sum + s.ev, 0); // 538

export const SWING_STATES = ["AZ", "GA", "MI", "NV", "NC", "PA", "WI"];

// Stable pseudo-random split for decorative red/blue colouring (not real results).
export const leansBlue = (code: string) =>
  (code.charCodeAt(0) * 7 + code.charCodeAt(1) * 13) % 2 === 0;

// Narration script and scene boundaries (seconds), aligned to public/narracao.mp3.
// Word-level caption timings live in narration.json (scripts/build-narration.py).
export const VIDEO_SECONDS = 61;
export type SceneScript = { from: number; to: number; text: string };

export const SCRIPT: SceneScript[] = [
  {
    from: 0,
    to: 9.0,
    text: "Sabia que nos Estados Unidos o candidato com mais votos pode PERDER a eleição presidencial? Pois é, bem-vindo ao sistema eleitoral mais maluco do mundo!",
  },
  {
    from: 9.0,
    to: 17.4,
    text: "Tudo começa meses antes. Os dois grandes partidos — Democratas e Republicanos — realizam as Primárias e Caucuses para escolher quem vai representá-los.",
  },
  {
    from: 17.4,
    to: 28.4,
    text: "No dia da eleição, o cidadão não vota direto no presidente. Ele vota em DELEGADOS. E o voto nem precisa ser no dia: dá pra votar pelo correio ou antecipadamente, semanas antes.",
  },
  {
    from: 28.4,
    to: 43.65,
    text: "Aqui tá o segredo: o Colégio Eleitoral tem 538 delegados, divididos entre os 50 estados e a capital. Em quase todos os estados, quem ganha fica com TODOS os delegados. Ganhou a Flórida por 1 voto? Leva os 30 delegados do estado inteirinho!",
  },
  {
    from: 43.65,
    to: 51.7,
    text: "É por isso que a campanha foca nos Swing States — os estados indecisos. Vence quem chegar primeiro aos 270 delegados no placar final.",
  },
  {
    from: 51.7,
    to: 61,
    text: "E nas Midterms? Aí eles elegem a Câmara inteira e um terço do Senado pelo voto direto! Achou o sistema genial ou confuso? Comenta aí!",
  },
];

export const KEYWORDS: Record<string, string> = {
  PERDER: "red",
  maluco: "gold",
  Democratas: "blue",
  Republicanos: "red",
  Primárias: "gold",
  Caucuses: "gold",
  DELEGADOS: "gold",
  correio: "blue",
  538: "gold",
  TODOS: "gold",
  Flórida: "blue",
  1: "gold",
  30: "gold",
  Swing: "purple",
  States: "purple",
  270: "gold",
  Midterms: "purple",
  Câmara: "blue",
  Senado: "red",
  genial: "gold",
  confuso: "gold",
};
