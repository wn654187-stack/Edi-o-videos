import React from "react";
import { BrandVideo, BrandVideoProps } from "../brand/BrandVideo";
import { makeColorOf } from "../brand/colorOf";
import { brand } from "../brand/theme";
import { KEYWORDS, SCENE_STARTS, VIDEO_SECONDS, WORDS, norm } from "./data";
import { Scene1Hook, Scene2Mecanismo, Scene3Brasil, Scene4Nome, Scene5Final } from "./scenes/BrandScenes";

export type ElNinoProps = BrandVideoProps;

const colorOf = makeColorOf(KEYWORDS, norm);
const SCENES = [Scene1Hook, Scene2Mecanismo, Scene3Brasil, Scene4Nome, Scene5Final];

export const ElNino: React.FC<ElNinoProps> = (props) => (
  <BrandVideo {...props} scenes={SCENES} sceneStarts={SCENE_STARTS} words={WORDS} colorOf={colorOf} tag="WILL TE EXPLICA · CLIMA" glow={brand.orange} glow2={brand.blue} />
);

export const EL_NINO_SECONDS = VIDEO_SECONDS;
