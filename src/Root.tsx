import { Still, Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { EleicoesEUA } from "./Eleicoes/EleicoesEUA";
import { VIDEO_SECONDS } from "./Eleicoes/data";
import { EnemSUS, ENEM_SUS_SECONDS } from "./EnemSUS/EnemSUS";
import { F1Halo, F1_HALO_SECONDS } from "./F1Halo/F1Halo";
import { EnemNatureza, ENEM_NATUREZA_SECONDS } from "./EnemNatureza/EnemNatureza";
import { EnemMatematica, ENEM_MATEMATICA_SECONDS } from "./EnemMatematica/EnemMatematica";
import { BlackFriday, BLACK_FRIDAY_SECONDS } from "./BlackFriday/BlackFriday";
import { VarPenalti, VAR_PENALTI_SECONDS } from "./VarPenalti/VarPenalti";
import { ComoFuncionaGPS, GPS_SECONDS } from "./ComoFuncionaGPS/ComoFuncionaGPS";
import { EnemNaturezaQuiz, ENEM_NATUREZA_QUIZ_SECONDS } from "./EnemNaturezaQuiz/EnemNaturezaQuiz";
import { EnemNaturezaAlt, ENEM_NATUREZA_ALT_SECONDS } from "./EnemNaturezaAlt/EnemNaturezaAlt";
import { ElNino, EL_NINO_SECONDS } from "./ElNino/ElNino";
import { EnemTRI, ENEM_TRI_SECONDS } from "./EnemTRI/EnemTRI";
import { DecimoTerceiro, DECIMO_TERCEIRO_SECONDS } from "./DecimoTerceiro/DecimoTerceiro";
import { ElNinoYT, ELNINO_YT_SECONDS } from "./ElNinoYT/ElNinoYT";
import { ElNinoThumb } from "./ElNinoYT/Thumb";
import { ElNinoShort, ELNINO_SHORT_SECONDS } from "./ElNinoShort/ElNinoShort";
import { ElNinoCover } from "./ElNinoShort/Cover";
import { RevisaoMatematica, REVISAO_MATEMATICA_SECONDS } from "./RevisaoMatematica/RevisaoMatematica";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="EleicoesEUA"
        component={EleicoesEUA}
        durationInFrames={VIDEO_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          narration: "narracao.mp3",
          music: "",
          musicVolume: 0.25,
          showCaptions: true,
        }}
      />
      <Composition
        id="EnemSUS"
        component={EnemSUS}
        durationInFrames={ENEM_SUS_SECONDS * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          narration: "narracao-sus.mp3",
          music: "",
          musicVolume: 0.2,
          showCaptions: true,
        }}
      />
      <Composition
        id="EnemSUSVertical"
        component={EnemSUS}
        durationInFrames={ENEM_SUS_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          narration: "narracao-sus.mp3",
          music: "",
          musicVolume: 0.2,
          showCaptions: true,
        }}
      />
      <Composition
        id="F1HaloVertical"
        component={F1Halo}
        durationInFrames={F1_HALO_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          narration: "narracao-f1.mp3",
          music: "",
          musicVolume: 0.2,
          showCaptions: true,
        }}
      />
      <Composition
        id="EnemNaturezaVertical"
        component={EnemNatureza}
        durationInFrames={ENEM_NATUREZA_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          narration: "narracao-natureza.mp3",
          music: "",
          musicVolume: 0.2,
          showCaptions: true,
        }}
      />
      <Composition
        id="EnemMatematicaVertical"
        component={EnemMatematica}
        durationInFrames={ENEM_MATEMATICA_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          narration: "narracao-matematica.mp3",
          music: "",
          musicVolume: 0.2,
          showCaptions: true,
        }}
      />
      <Composition
        id="BlackFridayVertical"
        component={BlackFriday}
        durationInFrames={BLACK_FRIDAY_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          narration: "narracao-blackfriday.mp3",
          music: "",
          musicVolume: 0.2,
          showCaptions: true,
        }}
      />
      <Composition
        id="VarPenaltiVertical"
        component={VarPenalti}
        durationInFrames={VAR_PENALTI_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          narration: "narracao-var.mp3",
          music: "",
          musicVolume: 0.2,
          showCaptions: true,
        }}
      />
      <Composition
        id="ComoFuncionaGPSVertical"
        component={ComoFuncionaGPS}
        durationInFrames={GPS_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          narration: "narracao-gps.mp3",
          music: "",
          musicVolume: 0.2,
          showCaptions: true,
        }}
      />
      <Composition
        id="EnemNaturezaQuizVertical"
        component={EnemNaturezaQuiz}
        durationInFrames={ENEM_NATUREZA_QUIZ_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          narration: "narracao-natureza-quiz.mp3",
          music: "",
          musicVolume: 0.2,
          showCaptions: true,
        }}
      />
      <Composition
        id="EnemNaturezaAltVertical"
        component={EnemNaturezaAlt}
        durationInFrames={ENEM_NATUREZA_ALT_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          narration: "narracao-natureza-alt.mp3",
          music: "",
          musicVolume: 0.2,
          showCaptions: true,
        }}
      />
      <Composition
        id="ElNinoVertical"
        component={ElNino}
        durationInFrames={EL_NINO_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          narration: "narracao-elnino.mp3",
          music: "",
          musicVolume: 0.2,
          showCaptions: true,
        }}
      />
      <Composition
        id="EnemTRIVertical"
        component={EnemTRI}
        durationInFrames={ENEM_TRI_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          narration: "narracao-tri.mp3",
          music: "",
          musicVolume: 0.2,
          showCaptions: true,
        }}
      />
      <Composition
        id="DecimoTerceiroVertical"
        component={DecimoTerceiro}
        durationInFrames={DECIMO_TERCEIRO_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          narration: "narracao-decimo.mp3",
          music: "",
          musicVolume: 0.2,
          showCaptions: true,
        }}
      />
      <Composition
        id="ElNinoYouTube"
        component={ElNinoYT}
        durationInFrames={ELNINO_YT_SECONDS * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          narration: "narracao-elnino-yt.mp3",
          music: "",
          musicVolume: 0.15,
          showCaptions: true,
        }}
      />
      <Still id="ElNinoThumbA" component={ElNinoThumb} width={1920} height={1080} defaultProps={{ variant: "a" as const }} />
      <Still id="ElNinoThumbB" component={ElNinoThumb} width={1920} height={1080} defaultProps={{ variant: "b" as const }} />
      <Composition
        id="ElNinoShortVertical"
        component={ElNinoShort}
        durationInFrames={ELNINO_SHORT_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          narration: "narracao-elnino-short.mp3",
          music: "",
          musicVolume: 0.2,
          showCaptions: true,
        }}
      />
      <Still id="ElNinoCoverVertical" component={ElNinoCover} width={1080} height={1920} />
      <Composition
        id="RevisaoMatematicaVertical"
        component={RevisaoMatematica}
        durationInFrames={REVISAO_MATEMATICA_SECONDS * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          narration: "",
          music: "",
          musicVolume: 0.2,
          showCaptions: true,
        }}
      />
      <Folder name="Elements">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
      <Composition
        // You can take the "id" to render a video:
        // bunx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />

    </>
  );
};
