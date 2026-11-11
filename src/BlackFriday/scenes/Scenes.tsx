import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Card, Chip, Pop, SceneIn } from "../../EnemSUS/ui";
import { bodyFont, clamp, colors, glow, headlineFont } from "../../EnemSUS/theme";
import { at, useCue } from "../data";
import { PromptPill } from "../../shared/PromptPill";

const BF = { black: "#0b0b0d", yellow: "#ffd23c", orange: "#ff8a00" };

/** Black Friday background: near-black with slow diagonal gold stripes. */
export const BFBackground: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 35%, #1d1a10 0%, ${BF.black} 70%)` }}>
      <AbsoluteFill
        style={{
          opacity: 0.07,
          backgroundImage: `repeating-linear-gradient(135deg, ${BF.yellow} 0 26px, transparent 26px 90px)`,
          backgroundPosition: `${(frame * 0.8) % 127}px 0px`,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.8) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Hook: fully visible on frame 0. */
export const Scene1Hook: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const stamp = 1 + 0.06 * Math.sin(frame / 3) + interpolate(frame, [cue("falso") - 2, cue("falso") + 6], [0, 0.25], { ...clamp, easing: Easing.out(Easing.back(2)) }) * (frame < cue("falso") + 6 ? 1 : 0);
  const stampOn = true;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center" }}>
        <Chip color={BF.yellow} size={38}>Black Friday · 27/11</Chip>
      </div>
      <div style={{ position: "absolute", left: 140, top: 380, width: 800, rotate: "-4deg" }}>
        <div style={{ background: BF.yellow, borderRadius: 36, padding: "40px 30px", textAlign: "center", boxShadow: glow(BF.yellow, 0.6) }}>
          <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 52, color: "#5a4a00", textDecoration: "line-through" }}>DE R$ 1.000</div>
          <div style={{ fontFamily: headlineFont, fontSize: 170, lineHeight: 1, color: BF.black }}>R$ 500</div>
          <div style={{ display: "inline-block", marginTop: 10, padding: "6px 30px", borderRadius: 16, background: colors.red, fontFamily: headlineFont, fontSize: 80, color: colors.white }}>−50%</div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 820,
          textAlign: "center",
          opacity: stampOn ? 1 : 0,
          scale: stamp,
          rotate: "-10deg",
        }}
      >
        <span style={{ display: "inline-block", border: `10px solid ${colors.redNeon}`, borderRadius: 24, padding: "4px 40px", fontFamily: headlineFont, fontSize: 150, color: colors.redNeon, background: "rgba(0,0,0,0.6)" }}>
          FALSO?
        </span>
      </div>
    </>
  );
};

const Header: React.FC<{ n: string; title: string }> = ({ n, title }) => (
  <Pop at={1} from="left" style={{ left: 70, right: 70, top: 230 }}>
    <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 34, color: BF.yellow, letterSpacing: 4 }}>GOLPE Nº {n}</div>
    <div style={{ fontFamily: headlineFont, fontSize: 110, lineHeight: 1, color: colors.white }}>{title}</div>
  </Pop>
);

/** Golpe 1: price chart that doubles before Black Friday, then "-50%". */
export const Scene2Dobro: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const up = cue("sobe");
  const down = cue("anuncia");
  const W = 900;
  const H = 360;
  const pts = [
    [0, 500],
    [0.45, 500],
    [0.55, 1000],
    [0.85, 1000],
    [0.93, 500],
    [1, 500],
  ] as const;
  const progress = interpolate(frame, [up - 20, up + 10, down, down + 20], [0.2, 0.7, 0.88, 1], clamp);
  const y = (v: number) => H - ((v - 300) / 800) * H;
  const path = pts.map(([x, v], i) => `${i ? "L" : "M"}${x * W} ${y(v)}`).join(" ");
  return (
    <SceneIn>
      <Header n="1" title="A METADE DO DOBRO" />
      <PromptPill at={6}>+ SEGUE pra não cair em golpe</PromptPill>
      <div style={{ position: "absolute", left: 90, top: 520, width: W, height: H }}>
        <svg width={W} height={H + 60} style={{ overflow: "visible" }}>
          <line x1={0} y1={y(500)} x2={W} y2={y(500)} stroke="#ffffff22" strokeDasharray="10 10" strokeWidth={3} />
          <path d={path} fill="none" stroke={BF.yellow} strokeWidth={10} strokeLinejoin="round" strokeDasharray={3000} strokeDashoffset={3000 * (1 - progress)} />
          <text x={0} y={y(500) - 20} fill={colors.white} fontFamily="sans-serif" fontWeight={900} fontSize={34}>R$ 500</text>
          {progress > 0.6 ? <text x={W * 0.56} y={y(1000) - 22} fill={colors.redNeon} fontFamily="sans-serif" fontWeight={900} fontSize={34}>R$ 1.000 (semanas antes)</text> : null}
          <text x={0} y={H + 50} fill={colors.muted} fontFamily="sans-serif" fontWeight={800} fontSize={28}>outubro</text>
          <text x={W - 170} y={H + 50} fill={BF.yellow} fontFamily="sans-serif" fontWeight={900} fontSize={28}>Black Friday</text>
        </svg>
      </div>
      <Pop at={down} from="scale" style={{ left: 600, top: 680 }}>
        <div style={{ padding: "8px 24px", borderRadius: 16, background: colors.red, fontFamily: headlineFont, fontSize: 60, color: colors.white, rotate: "6deg" }}>−50%!?</div>
      </Pop>
      <Pop at={cue("histórico")} from="up" style={{ left: 70, top: 1010, width: 940 }}>
        <Card color={colors.green} style={{ padding: "22px 30px", display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ fontSize: 64 }}>✓</div>
          <div style={{ fontWeight: 900, fontSize: 36, lineHeight: 1.25 }}>
            Veja o <span style={{ color: colors.green }}>histórico de preço</span> em comparadores (Zoom, Buscapé)
          </div>
        </Card>
      </Pop>
    </SceneIn>
  );
};

const Flag: React.FC<{ at: number; text: string; top: number }> = ({ at: start, text, top }) => (
  <Pop at={start} from="left" style={{ left: 90, top, width: 900 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 26, fontFamily: bodyFont, fontWeight: 900, fontSize: 52, color: colors.white }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: colors.red, boxShadow: glow(colors.red, 0.7), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50 }}>✗</div>
      {text}
    </div>
  </Pop>
);

/** Golpe 2: fake store red flags. */
export const Scene3Site: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <SceneIn>
      <Header n="2" title="SITE FALSO" />
      <PromptPill at={6} color={colors.gold} textColor="#0b0b0d">COMENTA: já caiu num desses?</PromptPill>
      <Flag at={cue("bom")} text="Preço bom demais" top={520} />
      <Flag at={cue("Pix")} text="Só aceita Pix" top={640} />
      <Flag at={cue("CNPJ")} text="Sem CNPJ no site" top={760} />
      <Pop at={cue("Fuja")} from="scale" style={{ left: 0, right: 0, top: 880, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 110, color: colors.redNeon }}>FUJA!</div>
      </Pop>
      <Pop at={cue("Reclame")} from="up" style={{ left: 70, top: 1040, width: 940 }}>
        <Card color={colors.green} style={{ padding: "20px 30px", textAlign: "center", fontWeight: 900, fontSize: 40 }}>
          Pesquise a loja no <span style={{ color: colors.green }}>Reclame Aqui</span>
        </Card>
      </Pop>
    </SceneIn>
  );
};

/** Direito de arrependimento: 7 dias (CDC art. 49). */
export const Scene4Direito: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCue(from);
  const seven = cue("7", at("tem", from));
  const s = spring({ frame: frame - seven, fps, config: { damping: 9, stiffness: 160 } });
  return (
    <SceneIn>
      <Pop at={1} style={{ left: 60, right: 60, top: 240, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 96, lineHeight: 1.05, color: colors.white }}>
          COMPROU ONLINE E
          <br />
          <span style={{ color: BF.yellow }}>SE ARREPENDEU?</span>
        </div>
      </Pop>
      <Pop at={cue("Código")} style={{ left: 0, right: 0, top: 500, textAlign: "center" }}>
        <Chip color={colors.susNeon} size={34}>Código de Defesa do Consumidor · Art. 49</Chip>
      </Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center", opacity: interpolate(s, [0, 0.3], [0, 1], clamp), scale: interpolate(s, [0, 1], [0.4, 1]) }}>
        <div style={{ fontFamily: headlineFont, fontSize: 300, lineHeight: 1, color: BF.yellow, textShadow: glow(BF.yellow, 0.6) }}>7 DIAS</div>
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 44, color: colors.white }}>pra desistir da compra</div>
      </div>
      <Pop at={cue("dinheiro")} from="up" style={{ left: 70, top: 1030, width: 940 }}>
        <Card color={colors.green} style={{ padding: "20px 30px", textAlign: "center", fontWeight: 900, fontSize: 40 }}>
          Dinheiro de volta <span style={{ color: colors.green }}>+ frete</span>
        </Card>
      </Pop>
    </SceneIn>
  );
};

export const Scene5Final: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  return (
    <SceneIn>
      <Pop at={1} from="scale" style={{ left: 290, top: 260, width: 500 }}>
        <Card color={BF.yellow} style={{ overflow: "hidden", textAlign: "center" }}>
          <div style={{ background: BF.yellow, color: BF.black, fontWeight: 900, fontSize: 36, padding: "10px 0", letterSpacing: 3 }}>BLACK FRIDAY</div>
          <div style={{ fontFamily: headlineFont, fontSize: 170, lineHeight: 1.1 }}>27/11</div>
        </Card>
      </Pop>
      <Pop at={cue("Manda") + 4} style={{ left: 60, right: 60, top: 660, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 92, lineHeight: 1.05, color: colors.white }}>
          MANDA PRA QUEM
          <br />
          <span style={{ color: BF.yellow }}>VAI ÀS COMPRAS</span>
        </div>
      </Pop>
      <Pop at={cue("Manda") + 10} from="scale" style={{ left: 140, top: 950, width: 800 }}>
        <div style={{ borderRadius: 999, padding: "26px 0", textAlign: "center", background: colors.green, color: BF.black, boxShadow: glow(colors.green, interpolate(Math.sin(frame / 5), [-1, 1], [0.5, 1.1])), fontFamily: bodyFont, fontWeight: 900, fontSize: 44 }}>
          ↗ COMPARTILHAR
        </div>
      </Pop>
    </SceneIn>
  );
};
