import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { EleicoesEUA } from "./Eleicoes/EleicoesEUA";
import { VIDEO_SECONDS } from "./Eleicoes/data";
import { TerrasRaras } from "./TerrasRaras/TerrasRaras";
import { FPS as TR_FPS, VIDEO_SECONDS as TR_SECONDS } from "./TerrasRaras/data";

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
        id="TerrasRaras"
        component={TerrasRaras}
        durationInFrames={Math.round(TR_SECONDS * TR_FPS)}
        fps={TR_FPS}
        width={1920}
        height={1080}
        defaultProps={{
          narration: "",
          music: "",
          musicVolume: 0.3,
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
