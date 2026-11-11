import React from "react";
import { BrandVideo, BrandVideoProps } from "../brand/BrandVideo";
import { makeColorOf } from "../brand/colorOf";
import { brand } from "../brand/theme";
import { KEYWORDS, SCENE_STARTS, VIDEO_SECONDS, WORDS, norm } from "./data";
import { Scene1Hook, Scene2Dobro, Scene3Site, Scene4Direito, Scene5Final } from "./scenes/BrandScenes";

export type BlackFridayProps = BrandVideoProps;

const colorOf = makeColorOf(KEYWORDS, norm);
const SCENES = [Scene1Hook, Scene2Dobro, Scene3Site, Scene4Direito, Scene5Final];

export const BlackFriday: React.FC<BlackFridayProps> = (props) => (
  <BrandVideo {...props} scenes={SCENES} sceneStarts={SCENE_STARTS} words={WORDS} colorOf={colorOf} tag="WILL TE EXPLICA · BLACK FRIDAY" glow={brand.orange} glow2={brand.lime} />
);

export const BLACK_FRIDAY_SECONDS = VIDEO_SECONDS;
