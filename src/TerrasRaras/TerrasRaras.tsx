import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SCENES, XFADE } from "./data";
import { FilmLook, Letterbox } from "./fx";
import { clamp } from "./theme";
import { S1Origem } from "./scenes/S1Origem";
import { S2Escala } from "./scenes/S2Escala";
import { S3Alquimia } from "./scenes/S3Alquimia";
import { S4Poder } from "./scenes/S4Poder";
import { S5Aplicacao } from "./scenes/S5Aplicacao";
import { S6Futuro } from "./scenes/S6Futuro";

export type TerrasRarasProps = {
  /** File in public/ with the voice-over. Empty = no narration. */
  narration: string;
  /** File in public/ with the soundtrack. Empty = no music. */
  music: string;
  musicVolume: number;
  showCaptions: boolean;
};

const COMPONENTS = [S1Origem, S2Escala, S3Alquimia, S4Poder, S5Aplicacao, S6Futuro];

/** Fades a scene in over the previous one (cross-dissolve). */
const Dissolve: React.FC<{ first: boolean; children: React.ReactNode }> = ({ first, children }) => {
  const frame = useCurrentFrame();
  const opacity = first ? interpolate(frame, [0, 20], [0, 1], clamp) : interpolate(frame, [0, XFADE], [0, 1], clamp);
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const TerrasRaras: React.FC<TerrasRarasProps> = ({ narration, music, musicVolume, showCaptions }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const current = [...SCENES].reverse().find((s) => frame >= Math.round(s.from * fps)) ?? SCENES[0];
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames - 1], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {SCENES.map((scene, i) => {
          const Scene = COMPONENTS[i];
          const from = Math.round(scene.from * fps);
          const last = i === SCENES.length - 1;
          const dur = Math.round(scene.to * fps) - from + (last ? 0 : XFADE);
          return (
            <Sequence key={scene.id} name={scene.label} from={from} durationInFrames={dur}>
              <Dissolve first={i === 0}>
                <Scene />
              </Dissolve>
            </Sequence>
          );
        })}
        <FilmLook />
      </AbsoluteFill>
      <Letterbox label={current.label} labelFrom={Math.round(current.from * fps)} showCaptions={showCaptions} />
      {narration ? <Audio src={staticFile(narration)} /> : null}
      {music ? (
        <Audio
          src={staticFile(music)}
          loop
          volume={(f) => musicVolume * interpolate(f, [0, 30, durationInFrames - 45, durationInFrames], [0, 1, 1, 0], clamp)}
        />
      ) : null}
    </AbsoluteFill>
  );
};
