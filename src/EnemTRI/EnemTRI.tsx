import React from "react";
import { BrandVideo, BrandVideoProps } from "../brand/BrandVideo";
import { makeColorOf } from "../brand/colorOf";
import { brand } from "../brand/theme";
import { KEYWORDS, SCENE_STARTS, VIDEO_SECONDS, WORDS, norm } from "./data";
import { Scene1Hook, Scene2TRI, Scene3Coerencia, Scene4Dicas, Scene5Final } from "./scenes/BrandScenes";

export type EnemTRIProps = BrandVideoProps;

const colorOf = makeColorOf(KEYWORDS, norm);
const SCENES = [Scene1Hook, Scene2TRI, Scene3Coerencia, Scene4Dicas, Scene5Final];

export const EnemTRI: React.FC<EnemTRIProps> = (props) => (
  <BrandVideo {...props} scenes={SCENES} sceneStarts={SCENE_STARTS} words={WORDS} colorOf={colorOf} tag="WILL TE EXPLICA · ENEM"
    glow={brand.blue}
    glow2={brand.lime}
    sfx="sfx-impacto.mp3"
    hook={{
      until: 64,
      lines: [
        { text: "MESMOS", size: 150 },
        { text: "ACERTOS.", size: 150 },
        { text: "NOTAS", size: 150, color: brand.orange },
        { text: "DIFERENTES?", size: 132, color: brand.orange },
      ],
    }}
  />
);

export const ENEM_TRI_SECONDS = VIDEO_SECONDS;
