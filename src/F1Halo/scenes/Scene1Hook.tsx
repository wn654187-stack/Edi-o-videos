import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Chip, Pop, SceneIn } from "../../EnemSUS/ui";
import { useCue } from "../data";
import { CarTopDown, FireGlow, useShake } from "../ui";
import { clamp, colors, headlineFont, textGlow } from "../theme";

const Stamp: React.FC<{ at: number; top: number; color: string; children: React.ReactNode; size?: number; rotate?: number }> = ({
  at,
  top,
  color,
  children,
  size = 118,
  rotate = 0,
}) => (
  <Pop at={at} from="scale" style={{ left: 40, right: 40, top, textAlign: "center" }}>
    <div style={{ fontFamily: headlineFont, fontSize: size, color, lineHeight: 1, rotate: `${rotate}deg`, textShadow: textGlow(color, 0.8) }}>{children}</div>
  </Pop>
);

export const Scene1Hook: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const split = interpolate(frame, [cue("meio"), cue("meio") + 10], [0, 1], clamp);
  const fire = interpolate(frame, [cue("fogo"), cue("fogo") + 8, cue("andando") + 10, cue("andando") + 30], [0, 1, 1, 0.3], clamp);
  const shake = useShake(cue("meio"));
  return (
    <SceneIn>
      <FireGlow amount={fire} />
      <div style={{ position: "absolute", left: 190, top: 250, translate: shake }}>
        <CarTopDown width={700} split={split} />
      </div>
      <Stamp at={cue("190")} top={545} color={colors.gold}>+190 KM/H</Stamp>
      <Stamp at={cue("meio")} top={700} color={colors.redNeon}>PARTIU AO MEIO</Stamp>
      <Stamp at={cue("fogo")} top={855} color={colors.orange}>PEGOU FOGO</Stamp>
      <Stamp at={cue("andando")} top={1020} color={colors.green} size={104} rotate={-4}>
        ...E SAIU ANDANDO
      </Stamp>
      <Pop at={cue("física")} style={{ left: 0, right: 0, top: 1170, textAlign: "center" }}>
        <Chip color={colors.blue} size={40}>A resposta é física</Chip>
      </Pop>
    </SceneIn>
  );
};
