import React from "react";
import { BrandVideo, BrandVideoProps } from "../brand/BrandVideo";
import { makeColorOf } from "../brand/colorOf";
import { brand } from "../brand/theme";
import { KEYWORDS, SCENE_STARTS, VIDEO_SECONDS, WORDS, norm } from "./data";
import { S1Hook, S2Porcentagem, S3Escala, S4Estatistica, S5Geometria, S6Probabilidade, S7Final } from "./scenes/BrandScenes";

const colorOf = makeColorOf(KEYWORDS, norm);
const SCENES = [S1Hook, S2Porcentagem, S3Escala, S4Estatistica, S5Geometria, S6Probabilidade, S7Final];

export const RevisaoMatematica: React.FC<BrandVideoProps> = (props) => (
  <BrandVideo {...props} scenes={SCENES} sceneStarts={SCENE_STARTS} words={WORDS} colorOf={colorOf} tag="WILL TE EXPLICA · ENEM" glow={brand.lime} glow2={brand.blue} />
);

export const REVISAO_MATEMATICA_SECONDS = VIDEO_SECONDS;
