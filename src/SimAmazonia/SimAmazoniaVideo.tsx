import React from "react";
import { BrandVideo, BrandVideoProps } from "../brand/BrandVideo";
import { makeColorOf } from "../brand/colorOf";
import { brand } from "../brand/theme";
import { KEYWORDS, SCENE_STARTS, VIDEO_SECONDS, WORDS, norm } from "./data";
import { SimAmazonia } from "./SimScene";

const colorOf = makeColorOf(KEYWORDS, norm);

export const SimAmazoniaVideo: React.FC<BrandVideoProps> = (props) => (
  <BrandVideo
    {...props}
    scenes={[SimAmazonia]}
    sceneStarts={SCENE_STARTS}
    words={WORDS}
    colorOf={colorOf}
    tag="WILL TE EXPLICA · SIMULAÇÃO"
    glow={brand.lime}
    glow2={brand.orange}
    sfx="sfx-impacto.mp3"
    hook={{
      until: 60,
      lines: [
        { text: "E SE A", size: 120 },
        { text: "AMAZÔNIA", size: 150, color: brand.lime },
        { text: "VIRASSE", size: 130 },
        { text: "SAVANA?", size: 150, color: brand.orange },
      ],
    }}
  />
);

export const SIM_AMAZONIA_SECONDS = VIDEO_SECONDS;
