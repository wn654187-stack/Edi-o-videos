import React from "react";
import { makeColorOf } from "../brand/colorOf";
import { CHAPTERS, KEYWORDS, SCENE_STARTS, VIDEO_SECONDS, WORDS, norm } from "./data";
import { WideVideo, WideVideoProps } from "./wide";
import { S10Futuro, S1Gancho, S2Normal, S3Muda, S4Nome, S5bCiclo, S5cPrevisao, S5Medem, S6Mundo, S7Brasil, S8Bolso, S9Maiores } from "./scenes/Scenes";

const colorOf = makeColorOf(KEYWORDS, norm);
const SCENES = [S1Gancho, S2Normal, S3Muda, S4Nome, S5Medem, S5bCiclo, S5cPrevisao, S6Mundo, S7Brasil, S8Bolso, S9Maiores, S10Futuro];

export const ElNinoYT: React.FC<WideVideoProps> = (props) => (
  <WideVideo {...props} scenes={SCENES} sceneStarts={SCENE_STARTS} words={WORDS} colorOf={colorOf} tag="WILL TE EXPLICA" chapterTitles={CHAPTERS.map((c) => c.title)} />
);

export const ELNINO_YT_SECONDS = VIDEO_SECONDS;
