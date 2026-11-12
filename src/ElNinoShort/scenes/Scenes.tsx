import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandScene } from "../../brand/Scene";
import { BrandPrompt, GlassCard, Pill, Reveal } from "../../brand/Glass";
import { GlassObject } from "../../brand/GlassObject";
import { brand, brandFont, clamp } from "../../brand/theme";
import { useCue } from "../data";
import { Cloud, Cup } from "../../ElNinoYT/illus";
import { Camera, CountryClip, MapLabel, SeaBlob, WorldMap } from "../../ElNinoYT/map";
import { BrazilRegions, Nino34, useCamera, Winds } from "../../ElNinoYT/scenes/Scenes";

const MW = 1080;
const MH = 760;
const TOP = 440;
const ease = { ...clamp, easing: Easing.inOut(Easing.cubic) };
const PAC: Camera = { lon: -160, lat: 0, zoom: 1.25 };

/** Map viewport between the label card and the captions, with soft fades top and bottom. */
const MapBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: TOP, width: MW, height: MH, overflow: "hidden", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 8%, #000 88%, transparent 100%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 8%, #000 88%, transparent 100%)" }}>
    {children}
  </div>
);

export const V1Hook: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tAmaz = cue("Amazônia", 260);
  const tSul = cue("Sul", 300);
  const tAus = cue("Austrália", 350);
  const tCafe = cue("café", 420);
  const tNino = cue(["Niño.", "Niño"], 510, from + 15);
  const cam = useCamera([
    [0, { lon: -160, lat: 0, zoom: 1.0 }],
    [tAmaz - 15, { lon: -160, lat: 0, zoom: 0.95 }],
    [tAmaz + 15, { lon: -120, lat: -8, zoom: 0.62 }],
  ]);
  const hl = [
    ...(frame >= tAmaz ? [{ ids: ["076"], color: brand.orange, opacity: 0.55 }] : []),
    ...(frame >= tAus ? [{ ids: ["036"], color: brand.orange }] : []),
  ];
  const big = interpolate(frame, [tNino - 3, tNino + 8], [0, 1], clamp);
  return (
    <BrandScene instant label="Clima · explicado com mapas" icon="sun" accent="orange" title="El Niño 2026">
      <MapBox>
        <WorldMap camera={cam} highlights={hl} w={MW} h={MH}>
          <SeaBlob lon={-140} lat={0} rLon={45} rLat={10} color={brand.orange} opacity={0.5 + 0.15 * Math.sin(frame / 10)} />
          <Nino34 />
          {frame >= tAmaz ? <MapLabel lon={-58} lat={-2} color={brand.orange} size={30}>SECA</MapLabel> : null}
          {frame >= tSul ? <MapLabel lon={-52} lat={-33} color={brand.blueSoft} size={30}>ALAGA</MapLabel> : null}
          {frame >= tAus ? <MapLabel lon={134} lat={-26} color={brand.orange} size={30}>FOGO</MapLabel> : null}
        </WorldMap>
      </MapBox>
      <Reveal at={tCafe} from="scale" style={{ left: 60, top: 960 }}>
        <Cup size={0.7} />
      </Reveal>
      {frame >= tNino - 3 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", opacity: big, scale: interpolate(big, [0, 1], [1.4, 1]) }}>
          <span style={{ fontFamily: brandFont, fontWeight: 800, fontSize: 170, letterSpacing: -6, color: brand.ink, textShadow: `0 0 60px ${brand.orange}cc, 0 8px 30px #000` }}>EL NIÑO</span>
        </div>
      ) : null}
    </BrandScene>
  );
};

export const V2Normal: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tPush = cue("empurram", 150);
  const warm = interpolate(frame, [tPush, tPush + 50], [0, 1], clamp);
  return (
    <BrandScene label="Num ano normal" icon="wave" accent="blue" title="Ventos alísios">
      <MapBox>
        <WorldMap camera={PAC} w={MW} h={MH}>
          <SeaBlob lon={interpolate(warm, [0, 1], [-160, 150])} lat={0} rLon={interpolate(warm, [0, 1], [45, 30])} rLat={13} color={brand.orange} opacity={0.8} />
          <SeaBlob lon={-90} lat={-5} rLon={18} rLat={9} color={brand.blue} opacity={0.8} />
          <Winds k={interpolate(frame, [2, 15], [0, 1], clamp)} />
          <MapLabel lon={-130} lat={17} color={brand.lime} size={34}>← VENTOS ALÍSIOS</MapLabel>
          {frame >= tPush ? <MapLabel lon={140} lat={-28} color={brand.orange} size={32}>ÁGUA QUENTE</MapLabel> : null}
          <MapLabel lon={-90} lat={-24} color={brand.blueSoft} size={30}>ÁGUA FRIA</MapLabel>
        </WorldMap>
      </MapBox>
      <BrandPrompt at={4}>+ SEGUE: o clima explicado com mapas</BrandPrompt>
    </BrandScene>
  );
};

export const V3Muda: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCue(from);
  const tWeak = cue("enfraquecem.", 30);
  const tBack = cue("voltar", 200);
  const move = interpolate(frame, [tBack, tBack + 5 * fps], [0, 1], ease);
  return (
    <BrandScene label="Quando chega o El Niño" icon="alert" accent="orange" title="A água volta">
      <MapBox>
        <WorldMap camera={PAC} w={MW} h={MH}>
          <SeaBlob lon={interpolate(move, [0, 1], [150, -105])} lat={0} rLon={interpolate(move, [0, 1], [30, 50])} rLat={13} color={brand.orange} opacity={0.85} />
          <SeaBlob lon={-90} lat={-5} rLon={18} rLat={9} color={brand.blue} opacity={0.8 * (1 - move)} />
          <Winds k={interpolate(frame, [tWeak, tWeak + 30], [1, 0.12], clamp)} />
          {frame >= tBack ? <MapLabel lon={-165} lat={18} color={brand.orange} size={34}>ÁGUA QUENTE →</MapLabel> : null}
        </WorldMap>
      </MapBox>
      <Reveal at={tWeak} from="scale" style={{ left: 0, right: 0, top: 1110, textAlign: "center" }}>
        <Pill accent="lime" size={36}>ventos enfraquecem</Pill>
      </Reveal>
    </BrandScene>
  );
};

export const V4Chuva: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tNuvens = cue("nuvens", 90);
  const tPlaneta = cue("planeta", 300);
  const x = interpolate(frame, [tNuvens, tNuvens + 60], [120, 460], ease);
  const cam = useCamera([[0, PAC], [tPlaneta - 10, PAC], [tPlaneta + 20, { lon: -150, lat: 5, zoom: 0.62 }]]);
  const hl = frame >= tPlaneta ? [{ ids: ["360", "036", "356", "604", "218", "076", "710", "840"], color: brand.orange, opacity: 0.7 }] : [];
  return (
    <BrandScene label="Junto com a água" icon="wave" accent="blue" title="A chuva muda">
      <MapBox>
        <WorldMap camera={cam} highlights={hl} w={MW} h={MH}>
          <SeaBlob lon={-115} lat={0} rLon={45} rLat={12} color={brand.orange} opacity={0.75} />
        </WorldMap>
      </MapBox>
      {frame < tPlaneta ? (
        <div style={{ position: "absolute", left: x, top: 560 }}>
          <Cloud size={0.9} />
        </div>
      ) : null}
      <Reveal at={tPlaneta} from="scale" style={{ left: 0, right: 0, top: 1110, textAlign: "center" }}>
        <Pill accent="orange" solid size={36}>o planeta inteiro sente</Pill>
      </Reveal>
    </BrandScene>
  );
};

export const V5Brasil: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tNorte = cue("Nordeste,", 100);
  const tSul = cue("Sul", 210, from + 4);
  const tSE = cue("Sudeste", 360);
  return (
    <BrandScene label="E no Brasil?" icon="pin" accent="lime" title="Dividido em dois">
      <MapBox>
        <WorldMap camera={{ lon: -53, lat: -15, zoom: 3.4 }} w={MW} h={MH} highlights={[{ ids: ["076"], color: "#3a3850", opacity: 0.95 }]}>
          <CountryClip id="br" country="076" />
          <BrazilRegions tNorte={tNorte} tSul={tSul} tSE={tSE} />
          {frame >= tNorte ? <MapLabel lon={-52} lat={-6} size={44}>SECA</MapLabel> : null}
          {frame >= tSE ? <MapLabel lon={-46} lat={-18} size={40}>CALOR</MapLabel> : null}
          {frame >= tSul ? <MapLabel lon={-52} lat={-28} size={40}>ENCHENTE</MapLabel> : null}
        </WorldMap>
      </MapBox>
      <BrandPrompt at={8} accent="orange">COMENTA: qual é a sua região?</BrandPrompt>
    </BrandScene>
  );
};

export const V6Final: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const tCom = cue("comentários:", 140);
  const btn = (txt: string, colors: [string, string, string], left: number, at: number) => (
    <Reveal at={at} from="scale" style={{ left, top: 600 }}>
      <GlassObject w={430} h={200} d="M44 0 H386 Q430 0 430 44 V156 Q430 200 386 200 H44 Q0 200 0 156 V44 Q0 0 44 0 Z" colors={colors}>
        <div style={{ fontFamily: brandFont, fontWeight: 800, fontSize: 68, color: brand.ink }}>{txt}</div>
      </GlassObject>
    </Reveal>
  );
  return (
    <BrandScene label="Sua vez" icon="chat" accent="lime" title="Calor ou chuva?">
      {frame < tCom ? (
        <MapBox>
          <WorldMap camera={PAC} w={MW} h={MH} dim={0.9}>
            <SeaBlob lon={-140} lat={0} rLon={45} rLat={10} color={brand.orange} opacity={0.6 + 0.2 * Math.sin(frame / 8)} />
            <Nino34 />
          </WorldMap>
        </MapBox>
      ) : null}
      <Reveal at={6} from="scale" style={{ left: 0, right: 0, top: 1060, textAlign: "center", opacity: frame >= tCom ? 0 : 1 }}>
        <Pill accent="orange" solid size={38}>2026: pode ser forte</Pill>
      </Reveal>
      {btn("+ CALOR", [brand.orange, brand.orangeSoft, brand.orange], 75, tCom)}
      {btn("+ CHUVA", [brand.blue, brand.blueSoft, brand.blue], 575, tCom + 6)}
      <Reveal at={tCom + 14} from="scale" style={{ left: 0, right: 0, top: 880, textAlign: "center" }}>
        <Pill accent="lime" solid size={40}>COMENTA A SUA CIDADE 👇</Pill>
      </Reveal>
      <Reveal at={tCom + 24} style={{ left: 0, right: 0, top: 990, textAlign: "center" }}>
        <GlassCard style={{ display: "inline-block", padding: "12px 26px", fontWeight: 700, fontSize: 30 }}>
          vídeo completo (10 min) no <span style={{ color: brand.orange }}>YouTube</span>
        </GlassCard>
      </Reveal>
    </BrandScene>
  );
};
