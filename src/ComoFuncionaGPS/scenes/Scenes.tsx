import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Card, Chip, Pop, SceneIn } from "../../EnemSUS/ui";
import { bodyFont, clamp, colors, glow, headlineFont } from "../../EnemSUS/theme";
import { useCue } from "../data";

/** Space background: deep blue with twinkling stars. */
export const SpaceBackground: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, #12204a 0%, #050816 70%)" }}>
      {new Array(90).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: random(`sx${i}`) * 1080,
            top: random(`sy${i}`) * 1920,
            width: 3 + random(`ss${i}`) * 3,
            height: 3 + random(`ss${i}`) * 3,
            borderRadius: "50%",
            background: "#fff",
            opacity: 0.25 + 0.5 * Math.abs(Math.sin(frame / 18 + i)),
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const Satellite: React.FC<{ size?: number; color?: string }> = ({ size = 90, color = colors.susNeon }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 150 90">
    <rect x={0} y={30} width={50} height={30} rx={4} fill={color} opacity={0.85} />
    <rect x={100} y={30} width={50} height={30} rx={4} fill={color} opacity={0.85} />
    <line x1={50} y1={45} x2={100} y2={45} stroke="#cfd6e6" strokeWidth={4} />
    <rect x={58} y={20} width={34} height={50} rx={8} fill="#e8ecf5" />
    <line x1={75} y1={20} x2={75} y2={4} stroke="#cfd6e6" strokeWidth={4} />
    <circle cx={75} cy={4} r={4} fill={colors.gold} />
  </svg>
);

const Phone: React.FC<{ pin?: boolean }> = ({ pin = true }) => (
  <div style={{ width: 150, height: 270, borderRadius: 28, border: "8px solid #1d2230", background: "linear-gradient(160deg, #1f6f4a, #0d3b28)", position: "relative", boxShadow: glow(colors.green, 0.5) }}>
    {pin ? (
      <svg width={70} height={90} viewBox="0 0 70 90" style={{ position: "absolute", left: 32, top: 70 }}>
        <path d="M35 88 C35 88 6 52 6 33 A29 29 0 1 1 64 33 C64 52 35 88 35 88 Z" fill={colors.redNeon} />
        <circle cx={35} cy={33} r={11} fill="#fff" />
      </svg>
    ) : null}
  </div>
);

/** Hook: fully visible on frame 0. */
export const Scene1Hook: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const drift = interpolate(frame, [0, 120], [0, 60], clamp);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center" }}>
        <Chip color={colors.gold} size={36}>Como funciona o GPS</Chip>
      </div>
      <div style={{ position: "absolute", left: 465, top: 360, translate: `${drift}px 0px` }}>
        <Phone />
      </div>
      <div style={{ position: "absolute", left: 465 - drift, top: 360, opacity: 0.35 }}>
        <Phone pin />
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 680, textAlign: "center", fontFamily: headlineFont, lineHeight: 1.2, color: colors.white }}>
        <div style={{ fontSize: 84 }}>SEM EINSTEIN, SEU GPS</div>
        <div style={{ fontSize: 84 }}>
          ERRARIA <span style={{ display: "inline-block", lineHeight: 1.05, color: colors.bg, background: colors.gold, padding: "0 18px", borderRadius: 16 }}>10 KM</span>
        </div>
        <div style={{ fontSize: 84 }}>POR DIA</div>
      </div>
      <Pop at={cue("Segue")} from="scale" style={{ left: 0, right: 0, top: 1060, textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "14px 40px", borderRadius: 999, background: colors.red, boxShadow: glow(colors.red, 0.8), fontFamily: bodyFont, fontWeight: 900, fontSize: 38, color: colors.white }}>
          + SEGUE pra entender
        </div>
      </Pop>
    </>
  );
};

/** Satellites orbiting ~20,000 km up, broadcasting the time. */
export const Scene2Satelites: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const ms = Math.floor((frame * 1000) / 30) % 1000;
  const sats = [0, 1, 2, 3, 4];
  return (
    <SceneIn>
      {/* Earth */}
      <div style={{ position: "absolute", left: -300, top: 1080, width: 1680, height: 1680, borderRadius: "50%", background: "radial-gradient(circle at 50% 20%, #2f7bff, #0b3a8a 55%, #062457)", boxShadow: "0 0 80px #2f7bff88" }} />
      {/* orbit */}
      <div style={{ position: "absolute", left: -360, top: 820, width: 1800, height: 1800, borderRadius: "50%", border: "3px dashed #ffffff33" }} />
      {sats.map((i) => {
        const a = (-125 + i * 17.5 + frame * 0.12) * (Math.PI / 180);
        const x = 540 + Math.cos(a) * 900 - 45;
        const y = 1720 + Math.sin(a) * 900 - 27;
        const pulse = ((frame + i * 9) % 45) / 45;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, opacity: frame >= cue("satélites") + i * 3 ? 1 : 0 }}>
            <Satellite />
            {frame >= cue("sinais") ? (
              <div style={{ position: "absolute", left: 45 - 60 * pulse, top: 27 - 60 * pulse, width: 120 * pulse, height: 120 * pulse, borderRadius: "50%", border: `3px solid ${colors.gold}`, opacity: 1 - pulse }} />
            ) : null}
          </div>
        );
      })}
      <Pop at={cue("20.000 km")} from="scale" style={{ left: 0, right: 0, top: 240, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 110, color: colors.white, lineHeight: 1 }}>~20.000 KM</div>
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 36, color: colors.muted }}>de altura</div>
      </Pop>
      <Pop at={cue("hora")} from="up" style={{ left: 190, top: 440, width: 700 }}>
        <Card color={colors.gold} style={{ padding: "18px 0", textAlign: "center" }}>
          <div style={{ fontWeight: 900, fontSize: 30, color: colors.gold, letterSpacing: 3 }}>SINAL: HORA EXATA</div>
          <div style={{ fontFamily: headlineFont, fontSize: 84, color: colors.white }}>12:00:0{Math.floor(frame / 30) % 10}.{String(ms).padStart(3, "0")}</div>
        </Card>
      </Pop>
    </SceneIn>
  );
};

/** Trilateration: distance circles from satellites meet at the phone. */
export const Scene3Trilateracao: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCue(from);
  const cx = 540;
  const cy = 760;
  const SATS = [
    { x: 160, y: 380 },
    { x: 920, y: 420 },
    { x: 140, y: 1080 },
    { x: 940, y: 1060 },
  ];
  const startRings = cue("distância");
  return (
    <SceneIn>
      <Pop at={1} style={{ left: 60, right: 60, top: 230, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 80, lineHeight: 1, color: colors.white }}>
          TEMPO DO SINAL → <span style={{ color: colors.green }}>DISTÂNCIA</span>
        </div>
      </Pop>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {SATS.map((s, i) => {
          const r = Math.hypot(s.x - cx, s.y - cy);
          const k = spring({ frame: frame - (startRings + i * 8), fps, config: { damping: 18 } });
          const show = i < 3 || frame >= cue("4");
          return show ? (
            <circle key={i} cx={s.x} cy={s.y} r={r * k} fill="none" stroke={[colors.susNeon, colors.gold, colors.purple, colors.green][i]} strokeWidth={5} opacity={0.8} />
          ) : null;
        })}
      </svg>
      {SATS.map((s, i) => (
        <div key={i} style={{ position: "absolute", left: s.x - 45, top: s.y - 27, opacity: i < 3 || frame >= cue("4") ? 1 : 0.15 }}>
          <Satellite size={90} />
        </div>
      ))}
      <div style={{ position: "absolute", left: cx - 75, top: cy - 135 }}>
        <Phone pin={frame >= cue("descobre")} />
      </div>
      <Pop at={cue("4")} from="scale" style={{ left: 0, right: 0, top: 1150, textAlign: "center" }}>
        <Chip color={colors.green} size={40}>4 satélites → sua posição</Chip>
      </Pop>
      <Pop at={cue("trilateração")} from="scale" style={{ left: 0, right: 0, top: 960, textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "4px 30px", borderRadius: 20, background: "rgba(5,8,22,0.85)", fontFamily: headlineFont, fontSize: 80, color: colors.green }}>TRILATERAÇÃO</div>
      </Pop>
    </SceneIn>
  );
};

/** Relativity: satellite clock runs ~38 µs/day fast -> ~11 km/day. */
export const Scene4Relatividade: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const fast = cue("rápido");
  const drift = Math.round(interpolate(frame, [fast, fast + 50], [0, 38], clamp));
  const clock = (label: string, color: string, extra: number) => (
    <Card color={color} style={{ width: 430, padding: "18px 0", textAlign: "center" }}>
      <div style={{ fontWeight: 900, fontSize: 30, color, letterSpacing: 2 }}>{label}</div>
      <div style={{ fontFamily: headlineFont, fontSize: 50, color: colors.white }}>
        12:00:00.000<span style={{ color: extra ? colors.gold : colors.white }}>{String(extra).padStart(3, "0")}</span>
      </div>
    </Card>
  );
  return (
    <SceneIn>
      <Pop at={1} style={{ left: 60, right: 60, top: 230, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 84, lineHeight: 1.02, color: colors.white }}>
          LÁ EM CIMA, O TEMPO
          <br />
          <span style={{ color: colors.gold }}>PASSA MAIS RÁPIDO</span>
        </div>
      </Pop>
      <Pop at={fast - 10} style={{ left: 70, top: 470, width: 940 }}>
        <div style={{ display: "flex", gap: 80 }}>
          {clock("TERRA", colors.green, 0)}
          {clock("SATÉLITE", colors.gold, drift)}
        </div>
      </Pop>
      <Pop at={cue("38 µs")} from="scale" style={{ left: 0, right: 0, top: 690, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 130, color: colors.gold, textShadow: glow(colors.gold, 0.5) }}>+38 µs/dia</div>
      </Pop>
      <Pop at={cue("luz")} from="up" style={{ left: 70, top: 880, width: 940 }}>
        <Card color={colors.redNeon} style={{ padding: "18px 26px", textAlign: "center", fontWeight: 900, fontSize: 40, lineHeight: 1.3 }}>
          38 µs × velocidade da luz ≈ <span style={{ color: colors.redNeon }}>11 km de erro</span>
        </Card>
      </Pop>
      <Pop at={cue("relatividade")} from="scale" style={{ left: 0, right: 0, top: 1080, textAlign: "center" }}>
        <Chip color={colors.gold} size={34}>Relógios ajustados com a relatividade</Chip>
      </Pop>
    </SceneIn>
  );
};

export const Scene5Final: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  return (
    <SceneIn>
      <Pop at={1} style={{ left: 60, right: 60, top: 300, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 100, lineHeight: 1.02, color: colors.white }}>
          SABIA <span style={{ color: colors.gold }}>DISSO?</span>
        </div>
      </Pop>
      <Pop at={cue("Manda")} style={{ left: 60, right: 60, top: 520, textAlign: "center" }}>
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 52, lineHeight: 1.25, color: colors.white }}>
          Manda pra quem acha que <span style={{ color: colors.green }}>física não serve pra nada</span>
        </div>
      </Pop>
      <Pop at={cue("Manda") + 8} from="scale" style={{ left: 190, top: 820, width: 700 }}>
        <div style={{ borderRadius: 999, padding: "26px 0", textAlign: "center", background: colors.green, color: colors.bg, boxShadow: glow(colors.green, interpolate(Math.sin(frame / 5), [-1, 1], [0.5, 1.1])), fontFamily: bodyFont, fontWeight: 900, fontSize: 44 }}>
          ↗ COMPARTILHAR
        </div>
      </Pop>
    </SceneIn>
  );
};

