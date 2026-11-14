import React from "react";
import { BrandVideo, BrandVideoProps } from "../brand/BrandVideo";
import { makeColorOf } from "../brand/colorOf";
import { brand } from "../brand/theme";
import { KEYWORDS, SCENE_STARTS, VIDEO_SECONDS, WORDS, norm } from "./data";
import { S1Hook, S2Artigo, S3Zero, S4Real, S5Pico, S6Final } from "./scenes/BrandScenes";

const colorOf = makeColorOf(KEYWORDS, norm);
const SCENES = [S1Hook, S2Artigo, S3Zero, S4Real, S5Pico, S6Final];

export const FimDoMundo: React.FC<BrandVideoProps> = (props) => (
  <BrandVideo
    {...props}
    scenes={SCENES}
    sceneStarts={SCENE_STARTS}
    words={WORDS}
    colorOf={colorOf}
    tag="WILL TE EXPLICA · MATEMÁTICA"
    glow={brand.orange}
    glow2={brand.blue}
    sfx="sfx-impacto.mp3"
    hook={{
      until: 62,
      lines: [
        { text: "O MUNDO", size: 150 },
        { text: "DEVERIA TER", size: 120 },
        { text: "ACABADO", size: 150 },
        { text: "ONTEM.", size: 170, color: brand.orange },
      ],
    }}
  />
);

export const FIM_DO_MUNDO_SECONDS = VIDEO_SECONDS;
