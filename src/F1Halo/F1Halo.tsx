import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Chip } from "../EnemSUS/ui";
import { CaptionsBase } from "../EnemSUS/Captions";
import { KEYWORDS, SCENE_STARTS, VIDEO_SECONDS, WORDS, norm } from "./data";
import { Background } from "./ui";
import { colors } from "./theme";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Bahrein } from "./scenes/Scene2Bahrein";
import { Scene3Forca } from "./scenes/Scene3Forca";
import { Scene4Fogo } from "./scenes/Scene4Fogo";
import { Scene5Halo } from "./scenes/Scene5Halo";
import { Scene6Celula } from "./scenes/Scene6Celula";
import { Scene7Ironia } from "./scenes/Scene7Ironia";
import { Scene8Newton } from "./scenes/Scene8Newton";
import { Scene9Final } from "./scenes/Scene9Final";

export type F1HaloProps = {
  /** File in public/ with the voice-over. Empty = no narration. */
  narration: string;
  /** File in public/ with a background track. Empty = no music. */
  music: string;
  musicVolume: number;
  showCaptions: boolean;
};

const SCENES = [Scene1Hook, Scene2Bahrein, Scene3Forca, Scene4Fogo, Scene5Halo, Scene6Celula, Scene7Ironia, Scene8Newton, Scene9Final];

const colorOf = (word: string) => {
  const tone = KEYWORDS[norm(word)];
  return tone ? colors[tone as keyof typeof colors] : null;
};

const Overlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, height: 10, width: `${(frame / durationInFrames) * 100}%`, background: `linear-gradient(90deg, ${colors.red}, ${colors.orange})` }} />
      <div style={{ position: "absolute", left: 60, top: 150, scale: 0.62, transformOrigin: "0 0" }}>
        <Chip color={colors.red}>Física da F1</Chip>
      </div>
    </>
  );
};

export const F1Halo: React.FC<F1HaloProps> = ({ narration, music, musicVolume, showCaptions }) => {
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
      {showCaptions ? <CaptionsBase words={WORDS} colorOf={colorOf} /> : null}
      {narration ? <Audio src={staticFile(narration)} /> : null}
      {music ? <Audio src={staticFile(music)} volume={musicVolume} loop /> : null}
    </AbsoluteFill>
  );
};

export const F1_HALO_SECONDS = VIDEO_SECONDS;
