import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { SceneIn, Title } from "../../EnemSUS/ui";
import { useCue } from "../data";
import { CarTopDown, FireGlow, useShake } from "../ui";
import { clamp, colors } from "../theme";

export const Scene4Fogo: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const split = interpolate(frame, [cue("meio"), cue("meio") + 12], [0, 1], clamp);
  const fireAt = cue("fogo");
  const fire = interpolate(frame, [fireAt - 4, fireAt + 8], [0, 1], clamp);
  const barrierCut = interpolate(frame, [cue("barreira"), cue("barreira") + 8], [0, 1], clamp);
  const shake = useShake(cue("meio"), 30, 16);

  return (
    <SceneIn>
      <FireGlow amount={fire} />
      <Title glowColor={colors.redNeon}>
        Partiu <span style={{ color: colors.redNeon }}>ao meio</span>
      </Title>
      <div style={{ position: "absolute", inset: 0, translate: shake }}>
        {/* barrier being pierced */}
        <div style={{ position: "absolute", left: 510, top: 420, width: 50, height: 300 * (1 - barrierCut * 0.25), background: `repeating-linear-gradient(0deg, ${colors.steel} 0 30px, #5a606c 30px 60px)` }} />
        <div style={{ position: "absolute", left: 510, top: 1000 + barrierCut * 60, width: 50, height: 240, background: `repeating-linear-gradient(0deg, ${colors.steel} 0 30px, #5a606c 30px 60px)` }} />
        <div style={{ position: "absolute", left: 90, top: 700 }}>
          <CarTopDown width={900} split={split} />
        </div>
        {/* flames */}
        {new Array(46).fill(0).map((_, i) => {
          const life = 26 + random(`fl${i}`) * 24;
          const t = ((frame - fireAt + random(`fo${i}`) * life) % life) / life;
          if (frame < fireAt) return null;
          const x = 260 + random(`fx${i}`) * 560 + Math.sin(frame / 5 + i) * 14;
          const size = (1 - t) * (50 + random(`fs${i}`) * 70);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: 1000 - t * 560,
                width: size,
                height: size,
                borderRadius: "50%",
                background: t < 0.35 ? colors.gold : t < 0.7 ? colors.orange : colors.red,
                opacity: (1 - t) * 0.85,
                filter: "blur(6px)",
                mixBlendMode: "screen",
              }}
            />
          );
        })}
      </div>
    </SceneIn>
  );
};
