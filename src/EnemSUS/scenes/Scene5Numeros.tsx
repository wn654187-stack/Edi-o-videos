import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AmbulanceIcon, Card, HeartIcon, PersonIcon, Pop, SceneIn, ShieldIcon, SyringeIcon, useCue } from "../ui";
import { bodyFont, clamp, colors, glow, headlineFont } from "../theme";

const SERVICES = [
  { word: "vacinas", label: "Vacinas", Icon: SyringeIcon, color: colors.green },
  { word: "SAMU", label: "SAMU", Icon: AmbulanceIcon, color: colors.redNeon },
  { word: "transplantes", label: "Transplantes", Icon: HeartIcon, color: colors.susNeon },
  { word: "vigilância", label: "Vigilância sanitária", Icon: ShieldIcon, color: colors.gold },
];

export const Scene5Numeros: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCue(from);
  const fill = cue("7");

  return (
    <SceneIn>
      {/* 7 in 10 */}
      <Pop at={fill} from="scale" style={{ left: 120, top: 105, width: 800, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 130, color: colors.green, lineHeight: 1, textShadow: glow(colors.green, 0.6) }}>
          7 <span style={{ fontSize: 72, color: colors.white }}>em cada</span> 10
        </div>
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 44, color: colors.white }}>brasileiros dependem só do SUS</div>
      </Pop>
      <div style={{ position: "absolute", left: 170, top: 360, width: 700, display: "flex", flexWrap: "wrap", gap: "22px 30px", justifyContent: "center" }}>
        {new Array(10).fill(0).map((_, i) => {
          const s = spring({ frame: frame - (4 + i * 3), fps, config: { damping: 12 } });
          const on = i < 7 && frame >= fill + 6 + i * 4;
          return (
            <div key={i} style={{ opacity: interpolate(s, [0, 0.5], [0, 1], clamp), scale: interpolate(s, [0, 1], [0.5, 1]) }}>
              <PersonIcon size={110} color={on ? colors.green : "#3a4a66"} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 170, top: 730, width: 700, textAlign: "center", fontFamily: bodyFont, fontWeight: 600, fontSize: 24, color: colors.muted, opacity: interpolate(frame, [fill + 20, fill + 30], [0, 1], clamp) }}>
        Fonte: IBGE, Pesquisa Nacional de Saúde 2019
      </div>

      {/* services */}
      <Pop at={cue("plano")} style={{ left: 1010, top: 120, width: 760, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 64, color: colors.white, lineHeight: 1.05 }}>
          Até quem tem <span style={{ color: colors.gold }}>plano</span> usa
        </div>
      </Pop>
      {SERVICES.map((s, i) => (
        <Pop key={s.word} at={cue(s.word)} from="scale" style={{ left: 1010 + (i % 2) * 390, top: 220 + Math.floor(i / 2) * 225, width: 370 }}>
          <Card color={s.color} style={{ height: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <s.Icon size={100} color={s.color} />
            <div style={{ fontWeight: 900, fontSize: 32, textTransform: "uppercase", textAlign: "center" }}>{s.label}</div>
          </Card>
        </Pop>
      ))}
      <Pop at={cue("pólio")} from="up" style={{ left: 1010, top: 690, width: 760 }}>
        <div
          style={{
            borderRadius: 999,
            padding: "18px 30px",
            background: `linear-gradient(90deg, ${colors.green}, ${colors.sus})`,
            boxShadow: glow(colors.green, 0.7),
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 34,
            color: colors.white,
            textAlign: "center",
          }}
        >
          PÓLIO: nenhum caso desde 1989
        </div>
      </Pop>
    </SceneIn>
  );
};
