import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, Chip } from "../EnemSUS/ui";
import { CaptionsBase } from "../EnemSUS/Captions";
import { colors } from "../EnemSUS/theme";
import { KEYWORDS, SCENE_STARTS, VIDEO_SECONDS, WORDS, norm } from "./data";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Ecologia } from "./scenes/Scene2Ecologia";
import { Scene3Genetica } from "./scenes/Scene3Genetica";
import { Scene4Quimica } from "./scenes/Scene4Quimica";
import { Scene5Newton } from "./scenes/Scene5Newton";
import { Scene6Energia } from "./scenes/Scene6Energia";
import { Scene7Dica } from "./scenes/Scene7Dica";
import { Scene8Final } from "./scenes/Scene8Final";

export type EnemNaturezaProps = {
  /** File in public/ with the voice-over. Empty = no narration. */
  narration: string;
  /** File in public/ with a background track. Empty = no music. */
  music: string;
  musicVolume: number;
  showCaptions: boolean;
};

const SCENES = [Scene1Hook, Scene2Ecologia, Scene3Genetica, Scene4Quimica, Scene5Newton, Scene6Energia, Scene7Dica, Scene8Final];

const colorOf = (word: string) => {
  const tone = KEYWORDS[norm(word)];
  return tone ? colors[tone as keyof typeof colors] : null;
};

const Overlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, height: 10, width: `${(frame / durationInFrames) * 100}%`, background: `linear-gradient(90deg, ${colors.green}, ${colors.gold})` }} />
      <div style={{ position: "absolute", left: 60, top: 150, scale: 0.62, transformOrigin: "0 0" }}>
        <Chip color={colors.green}>Revisão Enem · Natureza</Chip>
      </div>
    </>
  );
};

export const EnemNatureza: React.FC<EnemNaturezaProps> = ({ narration, music, musicVolume, showCaptions }) => {
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

export const ENEM_NATUREZA_SECONDS = VIDEO_SECONDS;
