import React from "react";
import { BrandVideo, BrandVideoProps } from "../brand/BrandVideo";
import { makeColorOf } from "../brand/colorOf";
import { brand } from "../brand/theme";
import { KEYWORDS, SCENE_STARTS, VIDEO_SECONDS, WORDS, norm } from "./data";
import { V1Hook, V2Normal, V3Muda, V4Chuva, V5Brasil, V6Final } from "./scenes/Scenes";

const colorOf = makeColorOf(KEYWORDS, norm);
const SCENES = [V1Hook, V2Normal, V3Muda, V4Chuva, V5Brasil, V6Final];

export const ElNinoShort: React.FC<BrandVideoProps> = (props) => (
  <BrandVideo {...props} scenes={SCENES} sceneStarts={SCENE_STARTS} words={WORDS} colorOf={colorOf} tag="WILL TE EXPLICA · CLIMA" glow={brand.orange} glow2={brand.blue} />
);

export const ELNINO_SHORT_SECONDS = VIDEO_SECONDS;
