import React from "react";
import { BrandVideo, BrandVideoProps } from "../brand/BrandVideo";
import { makeColorOf } from "../brand/colorOf";
import { brand } from "../brand/theme";
import { KEYWORDS, SCENE_STARTS, VIDEO_SECONDS, WORDS, norm } from "./data";
import { S1Hook, S2Origem, S3Rede, S4Real, S5Kit, S6Final } from "./scenes/BrandScenes";

const colorOf = makeColorOf(KEYWORDS, norm);
const SCENES = [S1Hook, S2Origem, S3Rede, S4Real, S5Kit, S6Final];

export const Apagao: React.FC<BrandVideoProps> = (props) => (
  <BrandVideo {...props} scenes={SCENES} sceneStarts={SCENE_STARTS} words={WORDS} colorOf={colorOf} tag="WILL TE EXPLICA · BOATO" glow={brand.orange} glow2={brand.lime} />
);

export const APAGAO_SECONDS = VIDEO_SECONDS;
