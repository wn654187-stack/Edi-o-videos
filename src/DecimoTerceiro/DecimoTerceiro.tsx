import React from "react";
import { BrandVideo, BrandVideoProps } from "../brand/BrandVideo";
import { makeColorOf } from "../brand/colorOf";
import { brand } from "../brand/theme";
import { KEYWORDS, SCENE_STARTS, VIDEO_SECONDS, WORDS, norm } from "./data";
import { Scene1Hook, Scene2Parcela1, Scene3Parcela2, Scene4Proporcional, Scene5Direitos, Scene6Final } from "./scenes/BrandScenes";

export type DecimoTerceiroProps = BrandVideoProps;

const colorOf = makeColorOf(KEYWORDS, norm);
const SCENES = [Scene1Hook, Scene2Parcela1, Scene3Parcela2, Scene4Proporcional, Scene5Direitos, Scene6Final];

export const DecimoTerceiro: React.FC<DecimoTerceiroProps> = (props) => (
  <BrandVideo {...props} scenes={SCENES} sceneStarts={SCENE_STARTS} words={WORDS} colorOf={colorOf} tag="WILL TE EXPLICA · SEU BOLSO"
    glow={brand.lime}
    glow2={brand.blue}
    sfx="sfx-impacto.mp3"
    hook={{
      until: 64,
      lines: [
        { text: "SEU 13º", size: 170 },
        { text: "VAI VIR", size: 150 },
        { text: "MENOR?", size: 170, color: brand.orange },
      ],
    }}
  />
);

export const DECIMO_TERCEIRO_SECONDS = VIDEO_SECONDS;
