import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AmbulanceIcon, Card, HeartIcon, PersonIcon, Pop, SceneIn, ShieldIcon, SyringeIcon, useCue, useVertical } from "../ui";
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
  const v = useVertical();
  const fill = cue("7");

  const L = v
    ? {
        head: { left: 60, top: 220, width: 960 },
        big: 116,
        sub: 40,
        people: { left: 90, top: 440, width: 900 },
        person: 84,
        note: { left: 90, top: 700, width: 900 },
        svcTitle: { left: 60, top: 760, width: 960 },
        svcTitleSize: 54,
        card: (i: number) => ({ left: 70 + (i % 2) * 480, top: 840 + Math.floor(i / 2) * 170, width: 460 }),
        cardH: 155,
        icon: 66,
        label: 28,
        polio: { left: 70, top: 1185, width: 940 },
        polioSize: 32,
      }
    : {
        head: { left: 120, top: 105, width: 800 },
        big: 130,
        sub: 44,
        people: { left: 170, top: 360, width: 700 },
        person: 110,
        note: { left: 170, top: 730, width: 700 },
        svcTitle: { left: 1010, top: 120, width: 760 },
        svcTitleSize: 64,
        card: (i: number) => ({ left: 1010 + (i % 2) * 390, top: 220 + Math.floor(i / 2) * 225, width: 370 }),
        cardH: 200,
        icon: 100,
        label: 32,
        polio: { left: 1010, top: 690, width: 760 },
        polioSize: 34,
      };

  return (
    <SceneIn>
      <Pop at={fill} from="scale" style={{ ...L.head, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: L.big, color: colors.green, lineHeight: 1, textShadow: glow(colors.green, 0.6) }}>
          7 <span style={{ fontSize: L.big * 0.55, color: colors.white }}>em cada</span> 10
        </div>
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: L.sub, color: colors.white }}>brasileiros dependem só do SUS</div>
      </Pop>
      <div style={{ position: "absolute", ...L.people, display: "flex", flexWrap: "wrap", gap: v ? "14px 40px" : "22px 30px", justifyContent: "center" }}>
        {new Array(10).fill(0).map((_, i) => {
          const s = spring({ frame: frame - (4 + i * 3), fps, config: { damping: 12 } });
          const on = i < 7 && frame >= fill + 6 + i * 4;
          return (
            <div key={i} style={{ opacity: interpolate(s, [0, 0.5], [0, 1], clamp), scale: interpolate(s, [0, 1], [0.5, 1]) }}>
              <PersonIcon size={L.person} color={on ? colors.green : "#3a4a66"} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", ...L.note, textAlign: "center", fontFamily: bodyFont, fontWeight: 600, fontSize: 24, color: colors.muted, opacity: interpolate(frame, [fill + 20, fill + 30], [0, 1], clamp) }}>
        Fonte: IBGE, Pesquisa Nacional de Saúde 2019
      </div>

      <Pop at={cue("plano")} style={{ ...L.svcTitle, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: L.svcTitleSize, color: colors.white, lineHeight: 1.05 }}>
          Até quem tem <span style={{ color: colors.gold }}>plano</span> usa
        </div>
      </Pop>
      {SERVICES.map((s, i) => (
        <Pop key={s.word} at={cue(s.word)} from="scale" style={L.card(i)}>
          <Card color={s.color} style={{ height: L.cardH, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: v ? 6 : 10 }}>
            <s.Icon size={L.icon} color={s.color} />
            <div style={{ fontWeight: 900, fontSize: L.label, textTransform: "uppercase", textAlign: "center" }}>{s.label}</div>
          </Card>
        </Pop>
      ))}
      <Pop at={cue("pólio")} from="up" style={L.polio}>
        <div
          style={{
            borderRadius: 999,
            padding: "18px 30px",
            background: `linear-gradient(90deg, ${colors.green}, ${colors.sus})`,
            boxShadow: glow(colors.green, 0.7),
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: L.polioSize,
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
