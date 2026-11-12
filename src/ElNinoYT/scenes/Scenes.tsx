import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { GlassCard, Pill, Reveal } from "../../brand/Glass";
import { GlassObject } from "../../brand/GlassObject";
import { brand, brandFont, clamp } from "../../brand/theme";
import { useCue } from "../data";
import { Bolt, Cloud, Cup, Fish, Seesaw, SubscribeButton, Sun, Thermo } from "../illus";
import { Camera, CountryClip, lerpCam, MapArrow, MapLabel, SeaBlob, useP, WorldMap } from "../map";
import { WideLabel, WideScene } from "../wide";

const ease = { ...clamp, easing: Easing.inOut(Easing.cubic) };
const PACIFIC: Camera = { lon: -165, lat: 0, zoom: 1.75 };
const WORLD: Camera = { lon: -160, lat: 5, zoom: 1.05 };

/** Camera that moves through keyframes [frame, camera]. */
export const useCamera = (keys: [number, Camera][]): Camera => {
  const frame = useCurrentFrame();
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, c0] = keys[i];
    const [f1, c1] = keys[i + 1];
    if (frame <= f1) return lerpCam(c0, c1, interpolate(frame, [f0, f1], [0, 1], ease));
  }
  return keys[keys.length - 1][1];
};

/** Niño 3.4 box (5°N–5°S, 170°W–120°W). */
export const Nino34: React.FC<{ k?: number; label?: boolean }> = ({ k = 1, label = true }) => {
  const P = useP();
  const frame = useCurrentFrame();
  const [x1, y1] = P(-170, 5);
  const [x2, y2] = P(-120, -5);
  const pulse = 0.6 + 0.4 * Math.sin(frame / 8);
  return (
    <g opacity={k}>
      <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill={`${brand.orange}33`} stroke={brand.orange} strokeWidth={4} strokeDasharray="14 10" rx={6} opacity={0.6 + 0.4 * pulse} style={{ filter: `drop-shadow(0 0 12px ${brand.orange})` }} />
      {label ? (
        <text x={(x1 + x2) / 2} y={y1 - 16} textAnchor="middle" fill={brand.orange} fontFamily={brandFont} fontWeight={800} fontSize={30} style={{ paintOrder: "stroke", stroke: "#07070bcc", strokeWidth: 8 }}>
          NIÑO 3.4
        </text>
      ) : null}
    </g>
  );
};

/** Trade winds: moving dashed arrows along the equator (direction -1 = to the west). */
export const Winds: React.FC<{ k: number; dir?: 1 | -1; color?: string }> = ({ k, dir = -1, color = brand.lime }) => {
  const frame = useCurrentFrame();
  const P = useP();
  return (
    <g opacity={k}>
      {[8, 0, -8].map((lat, i) => {
        const [xa, ya] = P(-85, lat);
        const [xb, yb] = P(155, lat);
        const [x1, x2] = dir < 0 ? [xa, xb] : [xb, xa];
        return (
          <g key={lat} style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
            <line x1={x1} y1={ya} x2={x2} y2={yb} stroke={color} strokeWidth={5} strokeDasharray="40 30" strokeDashoffset={-frame * 4 - i * 20} strokeLinecap="round" opacity={0.85} />
            <polygon points="0,0 -24,-12 -24,12" fill={color} transform={`translate(${x2} ${yb}) rotate(${dir < 0 ? 180 : 0})`} />
          </g>
        );
      })}
    </g>
  );
};

/* ---------------- 1. Gancho ---------------- */
export const S1Gancho: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tAmaz = cue("Amazônia", 90);
  const tSul = cue("Sul", 110);
  const tAus = cue("Austrália", 130);
  const tCafe = cue("café", 160);
  const tNino = cue(["Niño", "Nino"], 210);
  const t2026 = cue("2026", 260);
  const cam = useCamera([
    [0, { lon: -150, lat: 0, zoom: 2.2 }],
    [tAmaz - 20, { lon: -150, lat: 0, zoom: 2.0 }],
    [tAmaz + 10, { lon: -135, lat: -5, zoom: 0.95 }],
    [t2026, { lon: -135, lat: -5, zoom: 0.95 }],
  ]);
  const hl = [
    ...(frame >= tAmaz ? [{ ids: ["076"], color: brand.orange, opacity: 0.55 }] : []),
    ...(frame >= tAus ? [{ ids: ["036", "360"], color: brand.orange }] : []),
  ];
  const big = interpolate(frame, [tNino - 4, tNino + 8], [0, 1], clamp);
  return (
    <WideScene instant>
      <WorldMap camera={cam} highlights={hl}>
        <SeaBlob lon={-140} lat={0} rLon={45} rLat={9} color={brand.orange} opacity={0.45 + 0.15 * Math.sin(frame / 10)} />
        <Nino34 />
        {frame >= tSul ? <MapLabel lon={-52} lat={-30} color={brand.blueSoft} size={30}>SUL ALAGA</MapLabel> : null}
        {frame >= tAmaz ? <MapLabel lon={-60} lat={-4} color={brand.orange} size={30}>SECA</MapLabel> : null}
        {frame >= tAus ? <MapLabel lon={134} lat={-24} color={brand.orange} size={30}>FOGO</MapLabel> : null}
      </WorldMap>
      <WideLabel instant label="Clima · explicado com mapas" icon="sun" accent="orange" title="Um pedaço do Pacífico" />
      <Reveal at={tCafe} from="scale" style={{ left: 1580, top: 230 }}>
        <Cup size={0.8} />
      </Reveal>
      {frame >= tNino - 4 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", opacity: big * interpolate(frame, [t2026 + 60, t2026 + 80], [1, 0], clamp), scale: interpolate(big, [0, 1], [1.3, 1]) }}>
          <span style={{ fontFamily: brandFont, fontWeight: 800, fontSize: 190, letterSpacing: -6, color: brand.ink, textShadow: `0 0 60px ${brand.orange}aa, 0 8px 30px #000` }}>EL NIÑO</span>
        </div>
      ) : null}
      <Reveal at={t2026} from="scale" style={{ left: 0, right: 0, top: 640, textAlign: "center" }}>
        <Pill accent="orange" solid size={40}>2026: previsão de El Niño forte</Pill>
      </Reveal>
    </WideScene>
  );
};

/* ---------------- 2. O Pacífico normal ---------------- */
export const S2Normal: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tWind = cue("alísios", 150);
  const tPush = cue("empurram", 220);
  const tMeio = cue("meio", 330, from + 10);
  const tFria = cue(["fria", "contrário"], 480);
  const tRess = cue("ressurgência", 560);
  const tPesca = cue("pescarias", 680);
  const tRes = cue("Resultado", 800);
  const warm = interpolate(frame, [tPush, tPush + 60], [0, 1], clamp);
  const cold = interpolate(frame, [tFria, tFria + 40], [0, 1], clamp);
  return (
    <WideScene>
      <WorldMap camera={useCamera([[0, WORLD], [40, PACIFIC]])}>
        <SeaBlob lon={interpolate(warm, [0, 1], [-160, 150])} lat={0} rLon={interpolate(warm, [0, 1], [50, 35])} rLat={14} color={brand.orange} opacity={0.75} />
        <SeaBlob lon={-90} lat={-5} rLon={22} rLat={10} color={brand.blue} opacity={0.85 * cold} />
        <Winds k={interpolate(frame, [tWind, tWind + 15], [0, 1], clamp)} />
        {frame >= tWind ? <MapLabel lon={-120} lat={16} color={brand.lime} size={34}>VENTOS ALÍSIOS ←</MapLabel> : null}
        {frame >= tPush ? <MapLabel lon={135} lat={-30} color={brand.orange} size={30}>ÁGUA QUENTE</MapLabel> : null}
        {frame >= tRess
          ? [-12, -6, 0].map((lat, i) => <MapArrow key={lat} from={[-84 - i * 3, lat - 8]} to={[-84 - i * 3, lat + 2]} color={brand.blueSoft} width={5} progress={interpolate(frame, [tRess + i * 5, tRess + 20 + i * 5], [0, 1], clamp)} />)
          : null}
        {frame >= tFria ? <MapLabel lon={-95} lat={-22} color={brand.blueSoft} size={30}>ÁGUA FRIA</MapLabel> : null}
      </WorldMap>
      <WideLabel label="Capítulo 1" icon="wave" accent="blue" title="O Pacífico num ano normal" />
      <Reveal at={tMeio} from="scale" style={{ left: 1290, top: 210 }}>
        <Pill accent="orange" solid size={34}>nível do mar ~50 cm mais alto</Pill>
      </Reveal>
      <Reveal at={tPesca} from="scale" style={{ left: 1380, top: 760 }}>
        <Fish size={0.9} />
      </Reveal>
      <Reveal at={tRes} from="scale" style={{ left: 170, top: 620 }}>
        <Cloud size={0.9} />
      </Reveal>
      <Reveal at={tRes + 40} from="scale" style={{ left: 1500, top: 260 }}>
        <Sun size={0.8} />
      </Reveal>
    </WideScene>
  );
};

/* ---------------- 3. O que muda ---------------- */
export const S3Muda: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCue(from);
  const tWeak = cue("enfraquecem", 30);
  const tBack = cue("voltar", 200);
  const tTampa = cue("tampa", 480);
  const tCiclo = cue("ciclo", 760);
  const tBj = cue("Bjerknes", 820);
  const tChuva = cue("chuva", 900, from + 40);
  const move = interpolate(frame, [tBack, tBack + 8 * fps], [0, 1], ease);
  const winds = interpolate(frame, [tWeak, tWeak + 40], [1, 0.15], clamp);
  return (
    <WideScene>
      <WorldMap camera={PACIFIC}>
        <SeaBlob lon={interpolate(move, [0, 1], [150, -105])} lat={0} rLon={interpolate(move, [0, 1], [35, 55])} rLat={13} color={brand.orange} opacity={0.8} />
        <SeaBlob lon={-90} lat={-5} rLon={22} rLat={10} color={brand.blue} opacity={0.85 * interpolate(frame, [tTampa, tTampa + 40], [1, 0], clamp)} />
        <Winds k={winds} />
        {frame >= tBack && frame < tBack + 9 * fps
          ? [0, 1, 2].map((i) => {
              const f = (frame - tBack + i * 20) % 60;
              const lon = interpolate(move, [0, 1], [150, -105]);
              return <SeaBlob key={i} lon={lon} lat={0} rLon={10 + f * 0.6} rLat={4 + f * 0.2} color={brand.orangeSoft} opacity={0.4 * (1 - f / 60)} />;
            })
          : null}
        {frame >= tBack ? <MapLabel lon={-160} lat={18} color={brand.orange} size={34}>ÁGUA QUENTE VOLTA →</MapLabel> : null}
      </WorldMap>
      <WideLabel label="Capítulo 2" icon="alert" accent="orange" title="O que muda no El Niño" />
      <Reveal at={tWeak} from="scale" style={{ left: 1300, top: 210 }}>
        <Pill accent="lime" size={34}>ventos enfraquecem</Pill>
      </Reveal>
      <Reveal at={cue("banheira", tBack + 40)} from="scale" style={{ left: 1300, top: 290 }}>
        <Pill accent="orange" size={34}>~2 meses pra cruzar</Pill>
      </Reveal>
      {frame >= tCiclo ? (
        <div style={{ position: "absolute", left: 600, top: 300, width: 720, opacity: interpolate(frame, [tCiclo, tCiclo + 10, tChuva - 5, tChuva + 5], [0, 1, 1, 0], clamp) }}>
          <GlassCard accent="orange" style={{ padding: "34px 40px", background: "linear-gradient(160deg, rgba(20,18,30,0.92), rgba(10,10,16,0.9))" }}>
            <svg width={640} height={250} viewBox="0 0 640 250">
              <circle cx={315} cy={125} r={80} fill="none" stroke={brand.orange} strokeWidth={6} strokeDasharray="20 14" strokeDashoffset={-frame * 2} />
              <text x={100} y={135} textAnchor="middle" fill={brand.ink} fontFamily={brandFont} fontWeight={800} fontSize={28}>vento fraco</text>
              <text x={530} y={135} textAnchor="middle" fill={brand.orange} fontFamily={brandFont} fontWeight={800} fontSize={28}>oceano quente</text>
              <text x={315} y={140} textAnchor="middle" fill={brand.lime} fontFamily={brandFont} fontWeight={800} fontSize={60}>↻</text>
            </svg>
            <div style={{ textAlign: "center", fontWeight: 700, fontSize: 30, color: brand.muted, opacity: frame >= tBj ? 1 : 0 }}>Jacob Bjerknes · 1969</div>
          </GlassCard>
        </div>
      ) : null}
      <Reveal at={tChuva} from="scale" style={{ left: 820, top: 330 }}>
        <Cloud size={1} />
      </Reveal>
    </WideScene>
  );
};

/* ---------------- 4. O nome ---------------- */
export const S4Nome: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tNatal = cue("Natal", 150);
  const tPeixes = cue("peixes", 200);
  const tMenino = cue("Menino", 330);
  const t1972 = cue(["1972", "setenta"], 450);
  const tNina = cue(["Niña", "Nina"], 600, from + 25);
  const cam = useCamera([[0, PACIFIC], [40, { lon: -80, lat: -8, zoom: 5 }]]);
  const fall = interpolate(frame, [t1972 + 10, t1972 + 50], [0, 1], ease);
  return (
    <WideScene>
      <WorldMap camera={cam} highlights={[{ ids: ["604"], color: brand.lime, opacity: 0.55 }]} dim={frame >= t1972 ? 0.35 : 1}>
        <MapLabel lon={-75} lat={-9} size={44}>PERU</MapLabel>
        <SeaBlob lon={-84} lat={-8} rLon={6} rLat={8} color={brand.orange} opacity={frame >= tNatal ? 0.7 : 0} />
      </WorldMap>
      <WideLabel label="Capítulo 3" icon="star" accent="lime" title="De onde vem o nome" />
      <div style={{ opacity: frame >= t1972 ? 0 : 1 }}>
      <Reveal at={tNatal} from="scale" style={{ left: 1260, top: 260 }}>
        <Pill accent="orange" solid size={36}>água quente perto do Natal</Pill>
      </Reveal>
      <Reveal at={tPeixes} from="left" style={{ left: 1300, top: 360 }}>
        <div style={{ opacity: 0.45, filter: "grayscale(0.6)" }}>
          <Fish size={0.7} />
        </div>
      </Reveal>
      <Reveal at={tMenino} from="scale" style={{ left: 1240, top: 560 }}>
        <GlassCard accent="lime" style={{ padding: "22px 34px", fontWeight: 800, fontSize: 46 }}>
          El Niño = <span style={{ color: brand.lime }}>o Menino</span>
        </GlassCard>
      </Reveal>
      </div>
      {frame >= t1972 ? (
        <div style={{ position: "absolute", left: 360, top: 240, width: 1200, opacity: interpolate(frame, [t1972, t1972 + 10], [0, 1], clamp) }}>
          <GlassCard accent="orange" style={{ padding: "30px 40px", background: "linear-gradient(160deg, rgba(20,18,30,0.94), rgba(10,10,16,0.92))" }}>
            <div style={{ fontWeight: 700, fontSize: 30, color: brand.muted }}>Pesca da anchoveta no Peru (aprox., milhões de toneladas)</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 60, height: 300, marginTop: 20, paddingLeft: 40 }}>
              {[
                ["1970", 12],
                ["1971", 10.5],
                ["1972", interpolate(fall, [0, 1], [10, 4.5])],
                ["1973", interpolate(fall, [0, 1], [10, 1.8])],
              ].map(([y, v]) => (
                <div key={y as string} style={{ textAlign: "center" }}>
                  <div style={{ width: 150, height: (v as number) * 20, borderRadius: 14, background: (v as number) < 6 ? brand.orange : brand.lime, boxShadow: `0 0 20px ${(v as number) < 6 ? brand.orange : brand.lime}66` }} />
                  <div style={{ fontWeight: 800, fontSize: 32, marginTop: 10 }}>{y}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      ) : null}
      <Reveal at={tNina} from="scale" style={{ left: 0, right: 0, top: 900, textAlign: "center" }}>
        <div style={{ display: "inline-flex", gap: 24 }}>
          <Pill accent="orange" solid size={38}>El Niño: Pacífico leste quente</Pill>
          <Pill accent="blue" solid size={38}>La Niña: Pacífico leste frio</Pill>
        </div>
      </Reveal>
    </WideScene>
  );
};

/* ---------------- 5. Como medem ---------------- */
export const S5Medem: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tReg = cue("região", 120);
  const tBr = cue("Brasil", 240);
  const tBoias = cue("Boias", 330);
  const tMeio = cue("meio", 450, from + 15);
  const tForte = cue("forte", 560);
  const tSuper = cue(["super", "muito"], 650);
  const level = interpolate(frame, [tMeio, tMeio + 20, tForte, tForte + 20, tSuper, tSuper + 20], [0.1, 0.35, 0.35, 0.65, 0.65, 0.95], clamp);
  return (
    <WideScene>
      <WorldMap camera={useCamera([[0, PACIFIC], [tBr, PACIFIC], [tBr + 30, { lon: -110, lat: -8, zoom: 1.6 }], [tBoias, PACIFIC]])} highlights={frame >= tBr && frame < tBoias ? [{ ids: ["076"], color: brand.lime, opacity: 0.45 }] : []}>
        <Nino34 k={interpolate(frame, [tReg, tReg + 15], [0, 1], clamp)} />
        {frame >= tBoias
          ? [-8, -5, -2, 0, 2, 5, 8].flatMap((lat) =>
              [137, 147, 156, 165, 180, -170, -155, -140, -125, -110, -95].map((lon) => <Buoy key={`${lat}${lon}`} lon={lon} lat={lat} k={interpolate(frame, [tBoias + ((lon + 360) % 360) / 20, tBoias + ((lon + 360) % 360) / 20 + 10], [0, 1], clamp)} />),
            )
          : null}
      </WorldMap>
      <WideLabel label="Capítulo 4" icon="chart" accent="orange" title="Como os cientistas medem" />
      <Reveal at={tBr} from="scale" style={{ left: 1240, top: 230 }}>
        <Pill accent="lime" solid size={34}>+6 milhões de km² · ~70% do Brasil</Pill>
      </Reveal>
      <Reveal at={tMeio} from="left" style={{ left: 1330, top: 330 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Thermo level={level} height={480} />
          <div style={{ fontFamily: brandFont, fontWeight: 800, fontSize: 32, lineHeight: 2.2, whiteSpace: "nowrap", color: brand.ink }}>
            <div style={{ color: frame >= tSuper ? brand.orange : brand.muted }}>+2,0 °C muito forte</div>
            <div style={{ color: frame >= tForte ? brand.orangeSoft : brand.muted }}>+1,5 °C forte</div>
            <div style={{ color: brand.lime }}>+0,5 °C El Niño</div>
          </div>
        </div>
      </Reveal>
    </WideScene>
  );
};

const Buoy: React.FC<{ lon: number; lat: number; k: number }> = ({ lon, lat, k }) => {
  const P = useP();
  const frame = useCurrentFrame();
  const [x, y] = P(lon, lat);
  return (
    <g opacity={k}>
      <circle cx={x} cy={y} r={6 + 3 * Math.sin(frame / 6 + lon)} fill={brand.lime} opacity={0.25} />
      <circle cx={x} cy={y} r={4} fill={brand.lime} style={{ filter: `drop-shadow(0 0 6px ${brand.lime})` }} />
    </g>
  );
};

/* ---------------- 5b. O ciclo ---------------- */
export const S5bCiclo: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tG = cue("gangorra", 120);
  const tNino = cue(["Niño", "Nino"], 160, from + 6);
  const tNina = cue(["Niña", "Nina"], 230, from + 6);
  const tNeutro = cue("neutros", 300);
  const tAnos = cue("sete", 360);
  const tNov = cue("novembro", 470);
  const tDepois = cue("depois", 560);
  const tBr = cue("Brasil", 680);
  const tilt = interpolate(frame, [tNino, tNino + 15, tNina, tNina + 15, tNeutro, tNeutro + 15, tDepois, tDepois + 15, tDepois + 40, tDepois + 55], [0, -1, -1, 1, 1, 0, 0, -1, -1, 1], clamp);
  return (
    <WideScene>
      <WideLabel label="Capítulo 5" icon="wave" accent="lime" title="Uma gangorra chamada ENOS" />
      <Reveal at={tG} from="scale" style={{ left: 510, top: 300 }}>
        <Seesaw tilt={tilt} />
      </Reveal>
      <Reveal at={tAnos} from="scale" style={{ left: 260, top: 820 }}>
        <Pill accent="lime" solid size={36}>a cada 2 a 7 anos</Pill>
      </Reveal>
      <Reveal at={tAnos + 25} from="scale" style={{ left: 770, top: 820 }}>
        <Pill accent="blue" size={36}>dura 9 a 12 meses</Pill>
      </Reveal>
      <Reveal at={tNov} from="scale" style={{ left: 1230, top: 820 }}>
        <Pill accent="orange" size={36}>pico: nov a jan</Pill>
      </Reveal>
      <Reveal at={tBr} from="scale" style={{ left: 0, right: 0, top: 200, textAlign: "center" }}>
        <GlassCard accent="blue" style={{ display: "inline-block", padding: "16px 30px", fontWeight: 700, fontSize: 34 }}>
          La Niña no Brasil: <span style={{ color: brand.orange }}>Sul seco</span> · <span style={{ color: brand.blueSoft }}>Norte e Nordeste chuvosos</span>
        </GlassCard>
      </Reveal>
    </WideScene>
  );
};

/* ---------------- 5c. Como se prevê ---------------- */
export const S5cPrevisao: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const t1982 = cue(["1982", "oitenta"], 90);
  const tBoias = cue("boias", 200);
  const tSat = cue("satélites", 380);
  const tMaio = cue("maio", 540);
  const tBarr = cue("barreira", 610);
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const showCal = frame >= tMaio;
  return (
    <WideScene>
      <WorldMap camera={PACIFIC} dim={showCal ? 0.3 : 1}>
        {frame >= tBoias
          ? [-8, -5, -2, 0, 2, 5, 8].flatMap((lat) =>
              [137, 147, 156, 165, 180, -170, -155, -140, -125, -110, -95].map((lon) => <Buoy key={`${lat}${lon}`} lon={lon} lat={lat} k={interpolate(frame, [tBoias + ((lon + 360) % 360) / 20, tBoias + ((lon + 360) % 360) / 20 + 10], [0, 1], clamp)} />),
            )
          : null}
        {frame >= tSat ? <Satellite /> : null}
      </WorldMap>
      <WideLabel label="Capítulo 6" icon="question" accent="blue" title="Dá pra prever?" />
      <Reveal at={t1982} from="scale" style={{ left: 1320, top: 210 }}>
        <Pill accent="orange" solid size={34}>1982: ninguém viu chegar</Pill>
      </Reveal>
      <Reveal at={tBoias + 30} from="scale" style={{ left: 1320, top: 290 }}>
        <Pill accent="lime" size={34}>rede de boias no Pacífico</Pill>
      </Reveal>
      {showCal ? (
        <div style={{ position: "absolute", left: 360, top: 330, width: 1200, opacity: interpolate(frame, [tMaio, tMaio + 10], [0, 1], clamp) }}>
          <GlassCard accent="orange" style={{ padding: "30px 36px", background: "linear-gradient(160deg, rgba(20,18,30,0.94), rgba(10,10,16,0.92))" }}>
            <div style={{ display: "flex", gap: 12 }}>
              {months.map((m, i) => {
                const bad = i >= 2 && i <= 4;
                const on = bad && frame >= tBarr;
                return (
                  <div key={i} style={{ flex: 1, height: 130, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 44, background: on ? `${brand.orange}55` : "rgba(255,255,255,0.05)", border: `2px solid ${on ? brand.orange : "rgba(255,255,255,0.12)"}`, color: on ? brand.ink : brand.muted }}>
                    {m}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 22, textAlign: "center", fontWeight: 800, fontSize: 40, color: frame >= tBarr ? brand.orange : brand.ink }}>
              {frame >= tBarr ? "barreira da primavera: previsões erram mais" : "previsões feitas antes de maio"}
            </div>
          </GlassCard>
        </div>
      ) : null}
    </WideScene>
  );
};

const Satellite: React.FC = () => {
  const frame = useCurrentFrame();
  const x = 300 + ((frame * 5) % 1400);
  return (
    <g transform={`translate(${x} 200) rotate(-20)`} style={{ filter: `drop-shadow(0 0 10px ${brand.lime})` }}>
      <rect x={-60} y={-10} width={45} height={20} fill={brand.blueSoft} />
      <rect x={15} y={-10} width={45} height={20} fill={brand.blueSoft} />
      <rect x={-15} y={-15} width={30} height={30} rx={6} fill={brand.ink} />
      <path d={`M0 15 L-120 ${330} L120 330 Z`} fill={brand.lime} opacity={0.08} />
    </g>
  );
};

/* ---------------- 6. O mundo ---------------- */
export const S6Mundo: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tIndo = cue("Indonésia", 30);
  const tIndia = cue("Índia", 170);
  const tAfr = cue("África", 260);
  const tPeru = cue("Peru", 330);
  const tEua = cue("Estados", 430);
  const tGal = cue("Galápagos", 520);
  const tCor = cue("corais", 620);
  const tBr = cue("Brasil", 760, from + 30);
  const hl = [
    ...(frame >= tIndo ? [{ ids: ["360", "036", "598"], color: brand.orange }] : []),
    ...(frame >= tIndia ? [{ ids: ["356"], color: brand.orange }] : []),
    ...(frame >= tAfr ? [{ ids: ["710", "716", "508", "894", "072", "516"], color: brand.orange }] : []),
    ...(frame >= tPeru ? [{ ids: ["604", "218"], color: brand.blue }] : []),
    ...(frame >= tEua ? [{ ids: ["840"], color: brand.blue, opacity: 0.5 }] : []),
    ...(frame >= tBr ? [{ ids: ["076"], color: brand.lime, opacity: 0.6 }] : []),
  ];
  return (
    <WideScene>
      <WorldMap camera={useCamera([[0, PACIFIC], [30, { lon: 160, lat: -5, zoom: 1.15 }], [tPeru, { lon: 160, lat: -5, zoom: 1.15 }], [tPeru + 40, { lon: -150, lat: 5, zoom: 1.15 }], [tBr, { lon: -150, lat: 5, zoom: 1.15 }], [tBr + 40, { lon: -60, lat: -12, zoom: 1.9 }]])} highlights={hl}>
        <SeaBlob lon={-130} lat={0} rLon={45} rLat={9} color={brand.orange} opacity={0.45} />
        {frame >= tIndo ? <MapLabel lon={125} lat={-32} color={brand.orange}>SECA E INCÊNDIOS</MapLabel> : null}
        {frame >= tIndia ? <MapLabel lon={79} lat={30} color={brand.orange}>MONÇÃO FRACA</MapLabel> : null}
        {frame >= tAfr ? <MapLabel lon={27} lat={-33} color={brand.orange}>SECA</MapLabel> : null}
        {frame >= tPeru ? <MapLabel lon={-78} lat={-20} color={brand.blueSoft}>CHUVAS TORRENCIAIS</MapLabel> : null}
        {frame >= tEua ? <MapLabel lon={-100} lat={28} color={brand.blueSoft}>INVERNO CHUVOSO</MapLabel> : null}
        {frame >= tGal ? <MapLabel lon={-91} lat={3} color={brand.lime} size={26}>GALÁPAGOS</MapLabel> : null}
      </WorldMap>
      <WideLabel label="Capítulo 7" icon="pin" accent="orange" title="O planeta inteiro sente" />
      <Reveal at={tCor} from="scale" style={{ left: 1370, top: 740 }}>
        <GlassCard accent="orange" style={{ padding: "18px 28px", fontWeight: 700, fontSize: 32 }}>
          🪸 branqueamento de corais
        </GlassCard>
      </Reveal>
    </WideScene>
  );
};

/* ---------------- 7. O Brasil ---------------- */
export const BrazilRegions: React.FC<{ tNorte: number; tSul: number; tSE: number }> = ({ tNorte, tSul, tSE }) => {
  const frame = useCurrentFrame();
  const P = useP();
  const [, yN] = P(-50, -11);
  const [, yS] = P(-50, -23.5);
  const k = (t: number) => interpolate(frame, [t, t + 20], [0, 0.6], clamp);
  return (
    <g style={{ mixBlendMode: "screen" }}>
      <rect x={0} y={0} width={1920} height={yN} fill={brand.orange} opacity={k(tNorte)} clipPath="url(#br)" />
      <rect x={0} y={yN} width={1920} height={yS - yN} fill={brand.orangeSoft} opacity={k(tSE) * 0.7} clipPath="url(#br)" />
      <rect x={0} y={yS} width={1920} height={1080} fill={brand.blue} opacity={k(tSul) * 1.4} clipPath="url(#br)" />
    </g>
  );
};

export const S7Brasil: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tNorte = cue("Nordeste", 60);
  const tManaus = cue("Manaus", 160);
  const tQueim = cue("queimadas", 330);
  const t2015 = cue(["2015", "quinze"], 420);
  const tSul = cue("Sul", 520, from + 20);
  const tRS = cue("Grande", 620);
  const tSE = cue("Sudeste", 760);
  const tCom = cue("Comenta", 900);
  const tInsc = cue("inscreve", 1020);
  return (
    <WideScene>
      <WorldMap camera={{ lon: -54, lat: -15, zoom: 5.2 }} highlights={[{ ids: ["076"], color: "#3a3850", opacity: 0.95 }]} dim={frame >= tCom ? 0.35 : 1}>
        <BrazilClip />
        <BrazilRegions tNorte={tNorte} tSul={tSul} tSE={tSE} />
        {frame >= tManaus ? <CityDot lon={-60.02} lat={-3.1} name="Manaus" /> : null}
        {frame >= tRS ? <CityDot lon={-51.23} lat={-30.03} name="Porto Alegre" /> : null}
        {frame >= tNorte ? <MapLabel lon={-46} lat={-7} color={brand.ink} size={40}>SECA</MapLabel> : null}
        {frame >= tSul ? <MapLabel lon={-46} lat={-28.5} color={brand.ink} size={40}>CHUVA DEMAIS</MapLabel> : null}
        {frame >= tSE ? <MapLabel lon={-44} lat={-18} color={brand.ink} size={40}>CALOR</MapLabel> : null}
      </WorldMap>
      <WideLabel label="Capítulo 8" icon="pin" accent="lime" title="E no Brasil?" />
      <Reveal at={tManaus + 10} from="left" style={{ left: 64, top: 230, width: 520 }}>
        <GlassCard accent="orange" style={{ padding: "20px 26px", fontWeight: 700, fontSize: 30, lineHeight: 1.3 }}>
          Rio Negro, Manaus, 2023: <span style={{ color: brand.orange }}>menor nível já registrado</span>
        </GlassCard>
      </Reveal>
      <Reveal at={tQueim} from="left" style={{ left: 64, top: 400, width: 520 }}>
        <GlassCard accent="orange" style={{ padding: "16px 26px", fontWeight: 700, fontSize: 28 }}>floresta seca = queimadas</GlassCard>
      </Reveal>
      <Reveal at={t2015} from="left" style={{ left: 64, top: 500, width: 520 }}>
        <GlassCard accent="orange" style={{ padding: "16px 26px", fontWeight: 700, fontSize: 28 }}>Nordeste 2015–16: seca histórica</GlassCard>
      </Reveal>
      <Reveal at={tRS} from="left" style={{ left: 1340, top: 700, width: 520 }}>
        <GlassCard accent="blue" style={{ padding: "20px 26px", fontWeight: 700, fontSize: 30, lineHeight: 1.3 }}>
          Rio Grande do Sul, maio de 2024: <span style={{ color: brand.blueSoft }}>maior enchente da história do estado</span>
        </GlassCard>
      </Reveal>
      {frame >= tCom ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
          <Pill accent="lime" solid size={46}>COMENTA: de onde você é?</Pill>
          {frame >= tInsc ? <SubscribeButton at={tInsc} /> : null}
        </div>
      ) : null}
    </WideScene>
  );
};

const BrazilClip: React.FC = () => <CountryClip id="br" country="076" />;

const CityDot: React.FC<{ lon: number; lat: number; name: string }> = ({ lon, lat, name }) => {
  const P = useP();
  const frame = useCurrentFrame();
  const [x, y] = P(lon, lat);
  return (
    <g>
      <circle cx={x} cy={y} r={14 + 6 * Math.sin(frame / 5)} fill={brand.lime} opacity={0.3} />
      <circle cx={x} cy={y} r={9} fill={brand.lime} />
      <text x={x + 20} y={y + 10} fill={brand.ink} fontFamily={brandFont} fontWeight={800} fontSize={28} style={{ paintOrder: "stroke", stroke: "#07070bcc", strokeWidth: 8 }}>
        {name}
      </text>
    </g>
  );
};

/* ---------------- 8. O seu bolso ---------------- */
export const S8Bolso: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  const item = (at: number, left: number, node: React.ReactNode, label: string) => (
    <Reveal at={at} from="scale" style={{ left, top: 330, width: 380, textAlign: "center" }}>
      <div style={{ height: 330, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>{node}</div>
      <div style={{ fontFamily: brandFont, fontWeight: 800, fontSize: 40, marginTop: 20, color: brand.ink }}>{label}</div>
    </Reveal>
  );
  return (
    <WideScene>
      <WideLabel label="Capítulo 9" icon="tag" accent="orange" title="O El Niño no seu bolso" />
      {item(cue("café", 80), 120, <Cup size={0.95} />, "café, açúcar, cacau ↑")}
      {item(cue("hidrelétricas", 220), 560, <Bolt size={1} />, "conta de luz ↑")}
      {item(cue("peixe", 380), 1000, <Fish size={1.1} color={brand.orange} />, "peixe ↑")}
      <Reveal at={cue("governos", 430)} from="scale" style={{ left: 1440, top: 420, width: 400 }}>
        <GlassCard accent="lime" style={{ padding: "26px 30px", fontWeight: 700, fontSize: 32, lineHeight: 1.35 }}>
          Governos, bancos e empresas <span style={{ color: brand.lime }}>acompanham as previsões</span>
        </GlassCard>
      </Reveal>
    </WideScene>
  );
};

/* ---------------- 9. Os maiores ---------------- */
export const S9Maiores: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const events: [string, number, string][] = [
    ["1982–83", cue(["1982", "oitenta"], 60), "pegou o mundo de surpresa"],
    ["1997–98", cue(["1997", "noventa"], 160), "o “El Niño do século”"],
    ["2015–16", cue(["2015", "quinze"], 300), "2016: ano mais quente até então"],
    ["2023–24", cue(["2023", "vinte"], 430), "2024: +1,5 °C pela 1ª vez"],
  ];
  const lineK = interpolate(frame, [events[0][1], events[3][1] + 20], [0, 1], clamp);
  return (
    <WideScene>
      <WideLabel label="Capítulo 10" icon="bolt" accent="orange" title="Os El Niños que fizeram história" />
      <div style={{ position: "absolute", left: 160, top: 560, width: 1600 * lineK, height: 8, borderRadius: 4, background: `linear-gradient(90deg, ${brand.lime}, ${brand.orange})`, boxShadow: `0 0 20px ${brand.orange}88` }} />
      {events.map(([y, t, txt], i) => (
        <Reveal key={y} at={t} from="scale" style={{ left: 160 + i * 430, top: i % 2 ? 610 : 250, width: 380 }}>
          <GlassCard accent={i === 3 ? "orange" : "lime"} style={{ padding: "26px 28px" }}>
            <div style={{ fontWeight: 800, fontSize: 58, letterSpacing: -2, color: i === 3 ? brand.orange : brand.ink }}>{y}</div>
            <div style={{ fontWeight: 700, fontSize: 28, color: brand.muted, marginTop: 6 }}>{txt}</div>
          </GlassCard>
        </Reveal>
      ))}
      {events.map(([y, t], i) => (
        <div key={`d${y}`} style={{ position: "absolute", left: 160 + i * 430 + 180, top: 548, width: 32, height: 32, borderRadius: "50%", background: frame >= t ? brand.lime : "#2a2838", boxShadow: frame >= t ? `0 0 20px ${brand.lime}` : undefined }} />
      ))}
    </WideScene>
  );
};

/* ---------------- 10. 2026 e o futuro ---------------- */
export const S10Futuro: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCue(from);
  const tRec = cue("recordes", 330);
  const tPesq = cue("pesquisadores", 420);
  const tProx = cue("próxima", 560);
  const tCom = cue("comentários", 760);
  const level = interpolate(frame, [tRec - 20, tRec + 40], [0.45, 0.9], clamp);
  return (
    <WideScene>
      <WorldMap camera={{ lon: -160 + frame / fps, lat: 0, zoom: 1.2 }} dim={frame >= tCom ? 0.3 : 0.9}>
        <SeaBlob lon={-140} lat={0} rLon={50} rLat={10} color={brand.orange} opacity={0.5 + 0.2 * Math.sin(frame / 12)} />
        <Nino34 />
      </WorldMap>
      <WideLabel label="Capítulo 11" icon="calendar" accent="orange" title="2026 e o futuro" />
      <Reveal at={tRec - 20} from="left" style={{ left: 120, top: 330 }}>
        <Thermo level={level} height={500} />
      </Reveal>
      <Reveal at={tPesq} from="scale" style={{ left: 1240, top: 250, width: 600 }}>
        <GlassCard accent="orange" style={{ padding: "22px 28px", fontWeight: 700, fontSize: 32, lineHeight: 1.3 }}>
          Em aberto: o aquecimento vai deixar o El Niño <span style={{ color: brand.orange }}>mais frequente ou mais intenso?</span>
        </GlassCard>
      </Reveal>
      {frame >= tProx && frame < tCom ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", gap: 24 }}>
          {[
            ["seca na Amazônia", "orange"],
            ["enchente no Sul", "blue"],
            ["café mais caro", "lime"],
          ].map(([t, a], i) => (
            <Reveal key={t} at={tProx + i * 25} from="scale" style={{ position: "relative" }}>
              <Pill accent={a as "orange" | "blue" | "lime"} solid size={36}>{t}</Pill>
            </Reveal>
          ))}
        </div>
      ) : null}
      {frame >= tCom ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
          <div style={{ display: "flex", gap: 40 }}>
            <GlassObject w={380} h={180} d="M40 0 H340 Q380 0 380 40 V140 Q380 180 340 180 H40 Q0 180 0 140 V40 Q0 0 40 0 Z" colors={[brand.orange, brand.orangeSoft, brand.orange]}>
              <div style={{ fontFamily: brandFont, fontWeight: 800, fontSize: 64 }}>+ CALOR</div>
            </GlassObject>
            <GlassObject w={380} h={180} d="M40 0 H340 Q380 0 380 40 V140 Q380 180 340 180 H40 Q0 180 0 140 V40 Q0 0 40 0 Z" colors={[brand.blue, brand.blueSoft, brand.blue]}>
              <div style={{ fontFamily: brandFont, fontWeight: 800, fontSize: 64 }}>+ CHUVA</div>
            </GlassObject>
          </div>
          <Pill accent="lime" solid size={44}>COMENTA A SUA CIDADE 👇</Pill>
        </div>
      ) : null}
    </WideScene>
  );
};
