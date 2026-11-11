import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandBackground } from "./Background";
import { BrandCaptions } from "./Captions";
import { brand, brandFont } from "./theme";

type TimedWord = { text: string; start: number; end: number };

export type BrandVideoProps = {
  narration: string;
  music: string;
  musicVolume: number;
  showCaptions: boolean;
};

/** Shared frame for every brand video: background, scenes, progress bar, tag, captions and audio. */
export const BrandVideo: React.FC<
  BrandVideoProps & {
    scenes: React.FC<{ from: number }>[];
    sceneStarts: number[];
    words: TimedWord[];
    colorOf: (w: string) => string | null;
    tag: string;
    glow?: string;
    glow2?: string;
  }
> = ({ narration, music, musicVolume, showCaptions, scenes, sceneStarts, words, colorOf, tag, glow, glow2 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: brand.bg, overflow: "hidden" }}>
      <BrandBackground glow={glow} glow2={glow2} />
      {scenes.map((Scene, i) => {
        const from = Math.round(sceneStarts[i] * fps);
        const to = Math.round(sceneStarts[i + 1] * fps);
        return (
          <Sequence key={i} name={`Cena ${i + 1}`} from={from} durationInFrames={to - from}>
            <Scene from={from / fps} />
          </Sequence>
        );
      })}
      <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${(frame / durationInFrames) * 100}%`, background: brand.lime }} />
      <div style={{ position: "absolute", left: 70, top: 150, display: "flex", alignItems: "center", gap: 12, fontFamily: brandFont, fontWeight: 700, fontSize: 24, color: brand.ink, opacity: 0.85 }}>
        <span style={{ width: 14, height: 14, borderRadius: "50%", background: brand.orange, boxShadow: `0 0 12px ${brand.orange}` }} />
        {tag}
      </div>
      {showCaptions ? <BrandCaptions words={words} colorOf={colorOf} /> : null}
      {narration ? <Audio src={staticFile(narration)} /> : null}
      {music ? <Audio src={staticFile(music)} volume={musicVolume} loop /> : null}
    </AbsoluteFill>
  );
};
