import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Chip, Pop, SceneIn } from "../../EnemSUS/ui";
import { bodyFont, clamp, colors, glow, headlineFont } from "../../EnemSUS/theme";
import { at, useCue } from "../data";
import { PromptPill } from "../../shared/PromptPill";
import { BRAZIL_PATH } from "../brazilPath";

const WARM = "#ff6a3d";
const COLD = "#2f8fff";

/** Ocean background: deep blue gradient with a warm glow at the bottom. */
export const OceanBackground: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #071226 0%, #0a2147 55%, #12102a 100%)" }}>
      <AbsoluteFill
        style={{
          opacity: 0.1,
          backgroundImage: "repeating-linear-gradient(0deg, #ffffff 0 2px, transparent 2px 40px)",
          backgroundPosition: `0px ${(frame * 0.6) % 40}px`,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.75) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Hook: fully visible on frame 0. */
export const Scene1Hook: React.FC<{ from: number }> = () => {
  const frame = useCurrentFrame();
  const heat = 0.6 + 0.4 * Math.sin(frame / 6);
  const slam = interpolate(frame, [0, 8], [1.25, 1], clamp);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center" }}>
        <Chip color={WARM} size={36}>Clima · acontecendo agora</Chip>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 230, lineHeight: 0.95, color: WARM, scale: slam, textShadow: `0 0 ${40 * heat}px ${WARM}` }}>EL NIÑO</div>
        <div style={{ fontFamily: headlineFont, fontSize: 120, color: colors.white }}>2026</div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 760, textAlign: "center", fontFamily: headlineFont, fontSize: 76, lineHeight: 1.1, color: colors.white }}>
        PODE SER O <span style={{ color: colors.gold }}>MAIS FORTE</span>
        <br />
        DESDE <span style={{ display: "inline-block", color: colors.bg, background: colors.gold, padding: "0 16px", borderRadius: 14 }}>1950</span>
      </div>
    </>
  );
};

/** Pacific cross-section: trade winds pile warm water west; in El Niño they weaken and it spreads east. */
export const Scene2Mecanismo: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const weak = interpolate(frame, [cue("enfraquecem") - 4, cue("enfraquecem") + 14], [0, 1], clamp);
  const spread = interpolate(frame, [cue("espalha") - 6, cue("costa") + 10], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const elnino = frame >= cue("No", at("Ásia", from));
  const windShift = (frame * 6) % 200;
  const W = 960;
  const oceanTop = 640;
  const warmLeft = interpolate(spread, [0, 1], [0, 360]);
  const warmWidth = interpolate(spread, [0, 1], [430, 600]);
  return (
    <SceneIn>
      <Pop at={1} style={{ left: 0, right: 0, top: 230, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 92, color: elnino ? WARM : COLD, lineHeight: 1 }}>{elnino ? "COM EL NIÑO" : "NORMALMENTE"}</div>
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 34, color: colors.muted }}>Oceano Pacífico</div>
      </Pop>
      <PromptPill at={6}>+ SEGUE: vídeo novo todo dia</PromptPill>
      <div style={{ position: "absolute", left: 60, top: 400, width: W, height: 620 }}>
        {/* wind arrows */}
        {[0, 1, 2].map((r) => (
          <div key={r} style={{ position: "absolute", left: 0, right: 0, top: 20 + r * 55, height: 60, overflow: "hidden", opacity: 1 - weak * 0.8 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ position: "absolute", left: W - ((i * 200 + windShift + r * 70) % (W + 200)), top: 0, fontFamily: bodyFont, fontWeight: 900, fontSize: 48, lineHeight: "60px", color: "#cfe6ff" }}>
                ⟵
              </div>
            ))}
          </div>
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center", fontFamily: bodyFont, fontWeight: 900, fontSize: 32, color: "#cfe6ff", opacity: 1 - weak * 0.6 }}>
          ventos alísios {weak > 0.5 ? "(fracos)" : ""}
        </div>
        {/* ocean */}
        <div style={{ position: "absolute", left: 0, top: oceanTop - 400, width: W, height: 330, borderRadius: 24, background: `linear-gradient(180deg, ${COLD}aa, #0a2a66)`, overflow: "hidden", border: "3px solid #ffffff33" }}>
          <div
            style={{
              position: "absolute",
              left: warmLeft,
              top: 0,
              width: warmWidth,
              height: interpolate(spread, [0, 1], [190, 120]),
              borderRadius: "0 0 160px 160px",
              background: `radial-gradient(ellipse at 50% 0%, ${WARM}, ${WARM}55 70%, transparent)`,
              boxShadow: `0 0 60px ${WARM}88`,
            }}
          />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", fontFamily: bodyFont, fontWeight: 900, fontSize: 30, color: "#cfe6ff" }}>água fria (fundo)</div>
        </div>
        <div style={{ position: "absolute", left: 0, top: oceanTop - 60, fontFamily: headlineFont, fontSize: 52, color: colors.white }}>← ÁSIA</div>
        <div style={{ position: "absolute", right: 0, top: oceanTop - 60, fontFamily: headlineFont, fontSize: 52, color: colors.white, textAlign: "right" }}>AMÉRICA DO SUL →</div>
        <div style={{ position: "absolute", left: warmLeft + warmWidth / 2 - 160, width: 320, top: oceanTop - 385, textAlign: "center", fontFamily: bodyFont, fontWeight: 900, fontSize: 32, color: colors.white, textShadow: "0 2px 8px #000" }}>água quente</div>
      </div>
    </SceneIn>
  );
};

/** Brazil impacts map. */
export const Scene3Brasil: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const dry = interpolate(frame, [cue("Norte") - 4, cue("Norte") + 10], [0, 1], clamp);
  const wet = interpolate(frame, [cue("Sul") - 4, cue("Sul") + 10], [0, 1], clamp);
  const hot = interpolate(frame, [cue("esquenta") - 6, cue("esquenta") + 10], [0, 1], clamp);
  return (
    <SceneIn>
      <Pop at={1} style={{ left: 0, right: 0, top: 230, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 88, color: colors.white, lineHeight: 1 }}>
          E NO <span style={{ color: colors.green }}>BRASIL?</span>
        </div>
      </Pop>
      <div style={{ position: "absolute", left: 140, top: 360 }}>
        <svg width={820} height={800} viewBox="0 0 820 800">
          <defs>
            <clipPath id="br">
              <path d={BRAZIL_PATH} />
            </clipPath>
          </defs>
          <path d={BRAZIL_PATH} fill="#1f6f4a" stroke="#9be7c4" strokeWidth={4} />
          <g clipPath="url(#br)">
            <rect x={0} y={0} width={820} height={800} fill="#ff3d3d" opacity={hot * 0.35} />
            <path d="M0 0 H820 V480 H620 V330 H0 Z" fill="#ff9a1f" opacity={dry * 0.85} />
            <rect x={0} y={570} width={640} height={230} fill={COLD} opacity={wet * 0.9} />
          </g>
        </svg>
        <div style={{ position: "absolute", left: 330, top: 130, opacity: dry, fontFamily: headlineFont, fontSize: 56, color: colors.white, textShadow: "0 3px 10px #000" }}>☀ + SECA</div>
        <div style={{ position: "absolute", left: 250, top: 640, opacity: wet, fontFamily: headlineFont, fontSize: 52, color: colors.white, textShadow: "0 3px 10px #000" }}>☂ + CHUVA</div>
      </div>
      <Pop at={cue("esquenta")} from="scale" style={{ left: 0, right: 0, top: 1150, textAlign: "center" }}>
        <Chip color={colors.redNeon} size={36}>+1 a 2 °C em quase todo o país</Chip>
      </Pop>
    </SceneIn>
  );
};

/** Name origin: Peruvian fishermen, warm water near Christmas. */
export const Scene4Nome: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const bob = Math.sin(frame / 8) * 8;
  return (
    <SceneIn>
      <Pop at={1} style={{ left: 0, right: 0, top: 230, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 88, color: colors.white }}>E O NOME?</div>
      </Pop>
      <PromptPill at={4} color={colors.gold} textColor={colors.bg}>COMENTA SUA CIDADE: + CALOR OU + CHUVA?</PromptPill>
      <Pop at={cue("Pescadores")} style={{ left: 290, top: 420 }}>
        <svg width={500} height={260} viewBox="0 0 500 260" style={{ translate: `0px ${bob}px` }}>
          <path d="M60 150 H440 L390 210 H110 Z" fill="#c9773c" stroke="#7a3f14" strokeWidth={6} />
          <line x1={250} y1={150} x2={250} y2={20} stroke="#e8e0d0" strokeWidth={8} />
          <path d="M256 30 L380 140 H256 Z" fill="#f2efe6" />
          <path d="M0 225 Q60 205 120 225 T240 225 T360 225 T500 225" fill="none" stroke={WARM} strokeWidth={8} />
        </svg>
      </Pop>
      <Pop at={cue("Peru")} from="scale" style={{ left: 0, right: 0, top: 720, textAlign: "center" }}>
        <Chip color={colors.gold} size={30}>Peru · água quente perto do Natal</Chip>
      </Pop>
      <Pop at={cue("Menino")} from="scale" style={{ left: 0, right: 0, top: 860, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 104, color: colors.gold, textShadow: glow(colors.gold, 0.6), lineHeight: 1.05 }}>
          ★ EL NIÑO ★
          <br />
          <span style={{ color: colors.white, fontSize: 80 }}>= O MENINO JESUS</span>
        </div>
      </Pop>
    </SceneIn>
  );
};

export const Scene5Final: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const opt = (label: string, color: string, left: number, delay: number) => (
    <Pop at={delay} from="scale" style={{ left, top: 620, width: 420 }}>
      <div style={{ borderRadius: 30, border: `4px solid ${color}`, background: `${color}22`, boxShadow: glow(color, 0.6), padding: "36px 0", textAlign: "center", fontFamily: headlineFont, fontSize: 76, color: colors.white }}>{label}</div>
    </Pop>
  );
  return (
    <SceneIn>
      <Pop at={1} style={{ left: 60, right: 60, top: 280, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 96, lineHeight: 1.05, color: colors.white }}>
          NA SUA CIDADE
          <br />
          <span style={{ color: colors.gold }}>TÁ COMO?</span>
        </div>
      </Pop>
      {opt("+ CALOR", WARM, 70, 6)}
      {opt("+ CHUVA", COLD, 590, 10)}
      <Pop at={cue("Comenta")} from="scale" style={{ left: 190, top: 900, width: 700 }}>
        <div style={{ borderRadius: 999, padding: "24px 0", textAlign: "center", background: colors.red, boxShadow: glow(colors.red, interpolate(Math.sin(frame / 5), [-1, 1], [0.5, 1.1])), fontFamily: bodyFont, fontWeight: 900, fontSize: 44, color: colors.white }}>
          COMENTA + SEGUE
        </div>
      </Pop>
    </SceneIn>
  );
};
