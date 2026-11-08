import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { SCRIPT } from "./data";
import { Background } from "./ui";
import { Captions } from "./Captions";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Primarias } from "./scenes/Scene2Primarias";
import { Scene3Voto } from "./scenes/Scene3Voto";
import { Scene4Colegio } from "./scenes/Scene4Colegio";
import { Scene5Corrida } from "./scenes/Scene5Corrida";
import { Scene6Final } from "./scenes/Scene6Final";

export type EleicoesProps = {
  /** File in public/ with the voice-over (e.g. "narracao.mp3"). Empty = no narration. */
  narration: string;
  /** File in public/ with the background track (e.g. "trilha.mp3"). Empty = no music. */
  music: string;
  musicVolume: number;
  showCaptions: boolean;
};

const SCENES = [Scene1Hook, Scene2Primarias, Scene3Voto, Scene4Colegio, Scene5Corrida, Scene6Final];

export const EleicoesEUA: React.FC<EleicoesProps> = ({ narration, music, musicVolume, showCaptions }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#05060f", overflow: "hidden" }}>
      <Background />
      {SCRIPT.map((scene, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence
            key={i}
            name={`Cena ${i + 1}`}
            from={scene.from * fps}
            durationInFrames={(scene.to - scene.from) * fps}
          >
            <Scene />
          </Sequence>
        );
      })}
      {showCaptions ? <Captions /> : null}
      {narration ? <Audio src={staticFile(narration)} /> : null}
      {music ? <Audio src={staticFile(music)} volume={musicVolume} loop /> : null}
    </AbsoluteFill>
  );
};
