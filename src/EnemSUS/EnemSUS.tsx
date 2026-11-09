import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SCENE_STARTS, VIDEO_SECONDS } from "./data";
import { Background, Chip } from "./ui";
import { Captions } from "./Captions";
import { clamp, colors } from "./theme";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Antes } from "./scenes/Scene2Antes";
import { Scene3Nascimento } from "./scenes/Scene3Nascimento";
import { Scene4Principios } from "./scenes/Scene4Principios";
import { Scene5Numeros } from "./scenes/Scene5Numeros";
import { Scene6Problema } from "./scenes/Scene6Problema";
import { Scene7Final } from "./scenes/Scene7Final";

export type EnemSUSProps = {
  /** File in public/ with the voice-over. Empty = no narration. */
  narration: string;
  /** File in public/ with a background track. Empty = no music. */
  music: string;
  musicVolume: number;
  showCaptions: boolean;
};

const SCENES = [Scene1Hook, Scene2Antes, Scene3Nascimento, Scene4Principios, Scene5Numeros, Scene6Problema, Scene7Final];

/** Persistent progress bar + topic tag (keeps viewers oriented and watching). */
const Overlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const v = height > width;
  const tagIn = interpolate(frame, [SCENE_STARTS[1] * fps, SCENE_STARTS[1] * fps + 10], [0, 1], clamp);
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${(frame / durationInFrames) * 100}%`, background: `linear-gradient(90deg, ${colors.green}, ${colors.susNeon})` }} />
      <div style={{ position: "absolute", left: v ? 60 : 36, top: v ? 150 : 34, opacity: tagIn, scale: 0.62, transformOrigin: "0 0" }}>
        <Chip color={colors.gold}>Enem 2026 · Redação · SUS</Chip>
      </div>
    </>
  );
};

export const EnemSUS: React.FC<EnemSUSProps> = ({ narration, music, musicVolume, showCaptions }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      <Background />
      {SCENES.map((Scene, i) => {
        const from = Math.round(SCENE_STARTS[i] * fps);
        const to = Math.round(SCENE_STARTS[i + 1] * fps);
        return (
          <Sequence key={i} name={`Cena ${i + 1}`} from={from} durationInFrames={to - from}>
            <Scene from={from / fps} />
          </Sequence>
        );
      })}
      <Overlay />
      {showCaptions ? <Captions /> : null}
      {narration ? <Audio src={staticFile(narration)} /> : null}
      {music ? <Audio src={staticFile(music)} volume={musicVolume} loop /> : null}
    </AbsoluteFill>
  );
};

export const ENEM_SUS_SECONDS = VIDEO_SECONDS;
