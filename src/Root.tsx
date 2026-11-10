import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { EleicoesEUA } from "./Eleicoes/EleicoesEUA";
import { VIDEO_SECONDS } from "./Eleicoes/data";
import { EnemSUS, ENEM_SUS_SECONDS } from "./EnemSUS/EnemSUS";
import { F1Halo, F1_HALO_SECONDS } from "./F1Halo/F1Halo";
import { EnemNatureza, ENEM_NATUREZA_SECONDS } from "./EnemNatureza/EnemNatureza";
import { EnemMatematica, ENEM_MATEMATICA_SECONDS } from "./EnemMatematica/EnemMatematica";

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
