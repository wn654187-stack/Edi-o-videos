import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Chip, Pop, SceneIn } from "../../EnemSUS/ui";
import { useCue } from "../data";
import { CarTopDown, useShake } from "../ui";
import { bodyFont, clamp, colors } from "../theme";

export const Scene2Bahrein: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const touch = cue("toca");
  const hit = cue("barreira");
  const x = interpolate(frame, [cue("Primeira"), touch, hit], [-80, 360, 700], { ...clamp, easing: Easing.in(Easing.quad) });
  const yaw = interpolate(frame, [touch, touch + 8, hit], [0, -18, -28], clamp);
  const flash = interpolate(frame, [hit, hit + 2, hit + 14], [0, 0.9, 0], clamp);
  const shake = useShake(hit, 34, 18);

  return (
    <SceneIn>
      <AbsoluteFill style={{ translate: shake }}>
        <Pop at={2} style={{ left: 0, right: 0, top: 240, textAlign: "center" }}>
          <Chip color={colors.gold} size={38}>Bahrein · 2020 · Volta 1</Chip>
        </Pop>
        <Pop at={cue("Romain")} style={{ left: 0, right: 0, top: 350, textAlign: "center" }}>
          <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 64, color: colors.white }}>Romain Grosjean</div>
          <div style={{ fontFamily: bodyFont, fontWeight: 800, fontSize: 34, color: colors.muted }}>piloto da Haas</div>
        </Pop>

        {/* track */}
        <div style={{ position: "absolute", left: -100, right: -100, top: 600, height: 460, background: "#22252c", rotate: "-8deg", borderTop: "10px solid #fff", borderBottom: "10px solid #fff" }}>
          {new Array(10).fill(0).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: i * 140 - ((frame * 6) % 140), top: 220, width: 70, height: 10, background: "#ffffff55" }} />
          ))}
        </div>
        {/* barrier */}
        <div
          style={{
            position: "absolute",
            left: 930,
            top: 500,
            width: 40,
            height: 680,
            background: `repeating-linear-gradient(0deg, ${colors.red} 0 50px, #fff 50px 100px)`,
            boxShadow: frame >= hit ? `0 0 40px ${colors.redNeon}` : undefined,
          }}
        />
        {/* other car */}
        <div style={{ position: "absolute", left: 330, top: 640, opacity: interpolate(frame, [touch - 20, touch], [0, 1], clamp), rotate: "-8deg" }}>
          <CarTopDown width={300} color="#3b4cff" />
        </div>
        {/* Grosjean's car */}
        <div style={{ position: "absolute", left: x, top: 820, rotate: `${-8 + yaw}deg` }}>
          <CarTopDown width={320} />
        </div>
        <Pop at={touch} from="scale" style={{ left: 380, top: 760 }}>
          <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 40, color: colors.gold, rotate: "-8deg" }}>TOQUE!</div>
        </Pop>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </SceneIn>
  );
};
