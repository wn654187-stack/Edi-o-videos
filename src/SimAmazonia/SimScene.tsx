import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BrandPrompt, LabelCard, Pill, Reveal } from "../brand/Glass";
import { GlassObject } from "../brand/GlassObject";
import { IconName } from "../brand/Icons";
import { Accent, brand, brandFont, clamp } from "../brand/theme";
import { CountryClip, MapLabel, useP, WorldMap } from "../ElNinoYT/map";
import { useCue } from "./data";

const MW = 1080;
const MH = 800;
const TOP = 430;

/** Simplified outline of the Amazon rainforest (lon, lat). Illustrative, not a legal boundary. */
const AMAZON: [number, number][] = [
  [-79, -2], [-77.5, 1.5], [-74, 4], [-70, 5.5], [-66, 6.5], [-61, 6], [-57, 4.5], [-53, 3.5], [-51, 2.5], [-49.5, 0],
  [-46.5, -1.5], [-45, -3.5], [-46, -6], [-48, -8.5], [-50.5, -11], [-54, -12.5], [-58, -13.5], [-62, -13.5], [-65.5, -12.5],
  [-69, -11.5], [-72, -10], [-75, -7.5], [-77, -5],
];

const STAGES: { key: string; year: number; label: string; title: string; icon: IconName; accent: Accent }[] = [
  { key: "Ano 0", year: 0, label: "Hoje", title: "~20% desmatado", icon: "pin", accent: "lime" },
  { key: "Ano 10", year: 10, label: "Ponto de virada", title: "25% desmatado", icon: "alert", accent: "orange" },
  { key: "Ano 20", year: 20, label: "O ciclo da chuva quebra", title: "Menos chuva", icon: "wave", accent: "blue" },
  { key: "Ano 35", year: 35, label: "A floresta vira savana", title: "Mata → capim", icon: "sun", accent: "orange" },
  { key: "Ano 50", year: 50, label: "Estudo na Nature (2024)", title: "Até ~47% em risco", icon: "chart", accent: "orange" },
];

const Amazon: React.FC<{ savanna: number; fire: number; green: number }> = ({ savanna, fire, green }) => {
  const P = useP();
  const frame = useCurrentFrame();
  const d = "M" + AMAZON.map(([lo, la]) => P(lo, la).join(" ")).join(" L") + " Z";
  // Savanna grows from the south-east "arc of deforestation".
  const [cx, cy] = P(-45, -12);
  const [ex] = P(-45 + 1, -12);
  const pxPerDeg = Math.abs(ex - cx);
  const r = savanna * pxPerDeg;
  return (
    <g>
      <defs>
        <clipPath id="amz">
          <path d={d} />
        </clipPath>
        <radialGradient id="sav" cx="50%" cy="50%" r="50%">
          <stop offset="0.7" stopColor={brand.orangeSoft} stopOpacity={0.95} />
          <stop offset="1" stopColor={brand.orange} stopOpacity={0} />
        </radialGradient>
      </defs>
      <path d={d} fill={brand.lime} opacity={0.18 * green} style={{ filter: `blur(18px)` }} />
      <path d={d} fill="#1f5d2a" opacity={0.9} />
      <g clipPath="url(#amz)">
        {/* forest texture */}
        {Array.from({ length: 420 }).map((_, i) => {
          const x = ((i * 137.5) % 1080) + ((i * 7) % 13);
          const y = ((i * 61.3) % 800) + ((i * 11) % 17);
          return <circle key={i} cx={x} cy={y} r={5 + (i % 5) * 2} fill={i % 3 ? "#3f8f3a" : "#2c7030"} opacity={0.75} />;
        })}
        <circle cx={cx} cy={cy} r={r} fill="url(#sav)" />
        {fire > 0
          ? Array.from({ length: 14 }).map((_, i) => {
              const a = (i / 14) * Math.PI * 1.1 + Math.PI * 0.85;
              const x = cx + Math.cos(a) * r * 0.95;
              const y = cy + Math.sin(a) * r * 0.95;
              const s = 7 + 5 * Math.abs(Math.sin(frame / 4 + i));
              return <circle key={`f${i}`} cx={x} cy={y} r={s} fill={brand.orange} opacity={fire} style={{ filter: `drop-shadow(0 0 10px ${brand.orange})` }} />;
            })
          : null}
      </g>
      <path d={d} fill="none" stroke="#ffffffaa" strokeWidth={2.5} />
    </g>
  );
};

/** Flying rivers: dashed blue arcs from the Amazon to the Centre-West / South-East. */
const FlyingRivers: React.FC<{ k: number; strength: number }> = ({ k, strength }) => {
  const P = useP();
  const frame = useCurrentFrame();
  const arcs: [[number, number], [number, number], number][] = [
    [[-66, -4], [-54, -18], 70],
    [[-61, -2], [-49, -19], 100],
    [[-69, -8], [-58, -19], 40],
  ];
  return (
    <g opacity={k}>
      {arcs.map(([a, b, bend], i) => {
        const [x1, y1] = P(...a);
        const [x2, y2] = P(...b);
        const mx = (x1 + x2) / 2 + bend;
        const my = (y1 + y2) / 2 - bend * 0.3;
        return (
          <path
            key={i}
            d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`}
            fill="none"
            stroke={brand.blueSoft}
            strokeWidth={4 + 6 * strength}
            strokeDasharray="22 18"
            strokeDashoffset={-frame * 3}
            strokeLinecap="round"
            opacity={0.35 + 0.65 * strength}
            style={{ filter: `drop-shadow(0 0 ${8 * strength}px ${brand.blue})` }}
          />
        );
      })}
    </g>
  );
};

const CO2: React.FC<{ k: number }> = ({ k }) => {
  const P = useP();
  const frame = useCurrentFrame();
  if (k <= 0) return null;
  return (
    <g opacity={k}>
      {[[-55, -10], [-50, -7], [-60, -12], [-48, -11]].map(([lo, la], i) => {
        const [x, y] = P(lo, la);
        const dy = ((frame * 1.6 + i * 40) % 120);
        return (
          <text key={i} x={x} y={y - dy} textAnchor="middle" fill={brand.ink} opacity={1 - dy / 120} fontFamily={brandFont} fontWeight={800} fontSize={30}>
            CO₂↑
          </text>
        );
      })}
    </g>
  );
};

export const SimAmazonia: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const t = STAGES.map((s) => cue(s.key));
  const tRios = cue("rios");
  const tFogo = cue("fogo");
  const tCarb = cue("soltar");
  const tMas = cue("Mas");
  const tRest = cue("restaurar");
  const tCom = cue("Comenta");
  const stage = t.reduce((acc, s, i) => (frame >= s - 3 ? i : acc), 0);
  // Year counter rolls up quickly at each stage.
  const year = Math.round(
    interpolate(frame, [t[1] - 4, t[1] + 20, t[2] - 4, t[2] + 20, t[3] - 4, t[3] + 24, t[4] - 4, t[4] + 24], [0, 10, 10, 20, 20, 35, 35, 50], clamp),
  );
  // Savanna radius in degrees, growing per stage and shrinking back on "restaurar".
  const sav = interpolate(frame, [t[0], t[1], t[1] + 30, t[2] + 30, t[3], t[3] + 60, t[4], t[4] + 60], [8.5, 8.5, 10.5, 13, 13, 18, 18, 24], clamp) * interpolate(frame, [tRest, tRest + 45], [1, 0.3], clamp);
  const fire = interpolate(frame, [tFogo - 5, tFogo + 10], [0, 1], clamp) * interpolate(frame, [tRest, tRest + 20], [1, 0], clamp);
  const rivers = interpolate(frame, [tRios - 10, tRios + 5], [0, 1], clamp);
  const riverStrength = interpolate(frame, [tRios + 40, tRios + 110], [1, 0.25], clamp) + interpolate(frame, [tRest, tRest + 45], [0, 0.75], clamp);
  const co2 = interpolate(frame, [tCarb - 5, tCarb + 10], [0, 1], clamp) * interpolate(frame, [tRest, tRest + 20], [1, 0], clamp);
  const hope = frame >= tMas;
  const st = STAGES[stage];
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {hope ? (
        <LabelCard key="hope" label="Esse futuro não está escrito" title="Dá pra evitar" icon="check" accent="lime" />
      ) : (
        <LabelCard key={st.key} instant={stage === 0} label={st.label} title={st.title} icon={st.icon} accent={st.accent} />
      )}
      <div style={{ position: "absolute", left: 0, top: TOP, width: MW, height: MH, overflow: "hidden", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 6%, #000 90%, transparent 100%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 6%, #000 90%, transparent 100%)" }}>
        <WorldMap camera={{ lon: -60, lat: -8, zoom: 4.6 }} w={MW} h={MH} highlights={[{ ids: ["076"], color: "#2e2c40", opacity: 0.95 }]}>
          <CountryClip id="brsim" country="076" />
          <Amazon savanna={sav} fire={fire} green={hope ? 1 : 0.6} />
          <FlyingRivers k={rivers} strength={Math.min(1, riverStrength)} />
          <CO2 k={co2} />
          {rivers > 0.5 ? <MapLabel lon={-50} lat={-19.5} size={30} color={brand.blueSoft}>CENTRO-OESTE / SUDESTE ↓</MapLabel> : null}
          <MapLabel lon={-65} lat={-3} size={40} color={brand.ink}>AMAZÔNIA</MapLabel>
        </WorldMap>
      </div>
      {/* year counter */}
      <div style={{ position: "absolute", right: 70, top: 470 }}>
        <GlassObject w={300} h={150} d="M36 0 H264 Q300 0 300 36 V114 Q300 150 264 150 H36 Q0 150 0 114 V36 Q0 0 36 0 Z" colors={[brand.lime, brand.orange, brand.blue]}>
          <div style={{ textAlign: "center", fontFamily: brandFont, color: brand.ink }}>
            <div style={{ fontWeight: 700, fontSize: 26, opacity: 0.8 }}>SIMULAÇÃO</div>
            <div style={{ fontWeight: 800, fontSize: 70, lineHeight: 1, letterSpacing: -2 }}>ANO {year}</div>
          </div>
        </GlassObject>
      </div>
      <div style={{ position: "absolute", left: 70, top: 1180, fontFamily: brandFont, fontWeight: 600, fontSize: 24, color: brand.muted, opacity: frame >= tCom ? 0 : 1 }}>simulação ilustrativa · baseada em estudos científicos</div>
      <BrandPrompt at={tRios + 30} duration={90}>COMENTA: em que ano você acha que isso começa?</BrandPrompt>
      <Reveal at={tCom} from="scale" style={{ left: 0, right: 0, top: 1120, textAlign: "center" }}>
        <Pill accent="lime" solid size={40}>QUAL REGIÃO EU SIMULO? 👇</Pill>
      </Reveal>
    </div>
  );
};
