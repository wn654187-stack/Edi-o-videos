import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Chip } from "../EnemSUS/ui";
import { CaptionsBase } from "../EnemSUS/Captions";
import { colors } from "../EnemSUS/theme";
import { KEYWORDS, SCENE_STARTS, VIDEO_SECONDS, WORDS, norm } from "./data";
import { SpaceBackground, Scene1Hook, Scene2Satelites, Scene3Trilateracao, Scene4Relatividade, Scene5Final } from "./scenes/Scenes";

export type GPSProps = {
  /** File in public/ with the voice-over. Empty = no narration. */
  narration: string;
  /** File in public/ with a background track. Empty = no music. */
  music: string;
  musicVolume: number;
  showCaptions: boolean;
};

const SCENES = [Scene1Hook, Scene2Satelites, Scene3Trilateracao, Scene4Relatividade, Scene5Final];

const colorOf = (word: string) => {
  const tone = KEYWORDS[norm(word)];
  return tone ? colors[tone as keyof typeof colors] : null;
};

const Overlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, height: 10, width: `${(frame / durationInFrames) * 100}%`, background: `linear-gradient(90deg, ${colors.susNeon}, ${colors.gold})` }} />
      <div style={{ position: "absolute", left: 60, top: 150, scale: 0.62, transformOrigin: "0 0" }}>
        <Chip color={colors.gold}>Will te explica · Como funciona</Chip>
      </div>
    </>
  );
};

export const ComoFuncionaGPS: React.FC<GPSProps> = ({ narration, music, musicVolume, showCaptions }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#050816", overflow: "hidden" }}>
      <SpaceBackground />
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

export const GPS_SECONDS = VIDEO_SECONDS;
