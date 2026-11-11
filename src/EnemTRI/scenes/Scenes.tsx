import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Card, Chip, Pop, SceneIn } from "../../EnemSUS/ui";
import { bodyFont, clamp, colors, glow, headlineFont } from "../../EnemSUS/theme";
import { at, useCue } from "../data";

const Student: React.FC<{ name: string; color: string; score: string; reveal: boolean }> = ({ name, color, score, reveal }) => (
  <Card color={color} style={{ width: 430, padding: "26px 0", textAlign: "center" }}>
    <div style={{ fontWeight: 900, fontSize: 34, color, letterSpacing: 2 }}>{name}</div>
    <div style={{ fontFamily: headlineFont, fontSize: 96, color: colors.white, lineHeight: 1.05 }}>30</div>
    <div style={{ fontWeight: 800, fontSize: 30, color: colors.muted }}>acertos</div>
    <div style={{ marginTop: 14, fontFamily: headlineFont, fontSize: 64, color: reveal ? color : "#ffffff55" }}>{reveal ? score : "nota ?"}</div>
  </Card>
);

/** Hook: fully visible on frame 0. */
export const Scene1Hook: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  const frame = useCurrentFrame();
  const reveal = frame >= cue("diferentes") - 4;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center" }}>
        <Chip color={colors.gold} size={36}>Como o Enem calcula sua nota</Chip>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 340, textAlign: "center", fontFamily: headlineFont, fontSize: 92, lineHeight: 1.05, color: colors.white }}>
        MESMOS ACERTOS,
        <br />
        <span style={{ color: colors.redNeon }}>NOTAS DIFERENTES?</span>
      </div>
      <div style={{ position: "absolute", left: 70, top: 600, display: "flex", gap: 80 }}>
        <Student name="CANDIDATO A" color={colors.green} score="maior" reveal={reveal} />
        <Student name="CANDIDATO B" color={colors.redNeon} score="menor" reveal={reveal} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1010, textAlign: "center", fontFamily: bodyFont, fontWeight: 700, fontSize: 24, color: colors.muted }}>exemplo ilustrativo</div>
      <Pop at={cue("Segue")} from="scale" style={{ left: 0, right: 0, top: 1070, textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "14px 40px", borderRadius: 999, background: colors.red, boxShadow: glow(colors.red, 0.8), fontFamily: bodyFont, fontWeight: 900, fontSize: 38, color: colors.white }}>
          + SEGUE pra entender
        </div>
      </Pop>
    </>
  );
};

/** What TRI is: not "how many", but "which". */
export const Scene2TRI: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  const cross = interpolate(frame, [cue("quantas"), cue("quantas") + 8], [0, 1], clamp);
  return (
    <SceneIn>
      <Pop at={1} from="scale" style={{ left: 0, right: 0, top: 260, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 260, lineHeight: 1, color: colors.gold, textShadow: glow(colors.gold, 0.6) }}>TRI</div>
      </Pop>
      <Pop at={cue("Teoria")} style={{ left: 0, right: 0, top: 540, textAlign: "center" }}>
        <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 46, color: colors.white }}>Teoria de Resposta ao Item</div>
      </Pop>
      <Pop at={cue("quantas")} from="left" style={{ left: 120, top: 700, width: 840 }}>
        <div style={{ position: "relative", fontFamily: headlineFont, fontSize: 84, color: colors.muted, textAlign: "center" }}>
          QUANTAS você acertou
          <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 10, background: colors.redNeon, scale: `${cross} 1`, transformOrigin: "0 50%" }} />
        </div>
      </Pop>
      <Pop at={cue("quais")} from="scale" style={{ left: 120, top: 860, width: 840 }}>
        <div style={{ fontFamily: headlineFont, fontSize: 96, color: colors.green, textAlign: "center", textShadow: glow(colors.green, 0.5) }}>QUAIS você acertou</div>
      </Pop>
    </SceneIn>
  );
};

/** Difficulty ladder: incoherent (guess) vs coherent pattern. */
const Row: React.FC<{ label: string; pattern: boolean[]; color: string; tag: string; tagColor: string; at: number; tagAt: number; top: number }> = ({ label, pattern, color, tag, tagColor, at: start, tagAt, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - tagAt, fps, config: { damping: 10, stiffness: 180 } });
  return (
    <div style={{ position: "absolute", left: 60, top, width: 960 }}>
      <div style={{ fontFamily: bodyFont, fontWeight: 900, fontSize: 32, color }}>{label}</div>
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        {pattern.map((ok, i) => {
          const on = frame >= start + i * 3;
          return (
            <div
              key={i}
              style={{
                width: 82,
                height: 82,
                borderRadius: 14,
                background: on ? (ok ? `${colors.green}cc` : `${colors.redNeon}cc`) : "#ffffff14",
                border: "3px solid #ffffff33",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: headlineFont,
                fontSize: 46,
                color: colors.white,
              }}
            >
              {on ? (ok ? "✓" : "✗") : ""}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 12, opacity: interpolate(t, [0, 0.3], [0, 1], clamp), scale: interpolate(t, [0, 1], [0.6, 1]), transformOrigin: "0 50%" }}>
        <span style={{ display: "inline-block", padding: "8px 24px", borderRadius: 14, background: tagColor, fontFamily: headlineFont, fontSize: 48, color: colors.bg }}>{tag}</span>
      </div>
    </div>
  );
};

export const Scene3Coerencia: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  const guess = [false, false, false, true, true, true, true, true, true, true];
  const coherent = [true, true, true, true, true, true, true, false, false, false];
  return (
    <SceneIn>
      <Pop at={1} style={{ left: 60, right: 60, top: 230, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 80, color: colors.white, lineHeight: 1 }}>
          CADA QUESTÃO TEM UM <span style={{ color: colors.gold }}>NÍVEL</span>
        </div>
      </Pop>
      <Pop at={cue("dificuldade")} style={{ left: 60, top: 340, width: 960 }}>
        <div style={{ height: 22, borderRadius: 11, background: `linear-gradient(90deg, ${colors.green}, ${colors.gold}, ${colors.purple})` }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: bodyFont, fontWeight: 900, fontSize: 30, marginTop: 6 }}>
          <span style={{ color: colors.green }}>FÁCIL</span>
          <span style={{ color: colors.purple }}>DIFÍCIL</span>
        </div>
      </Pop>
      <Row label="7 acertos: errou fáceis, acertou difíceis" pattern={guess} color={colors.redNeon} tag="CHUTE? NOTA SOBE MENOS" tagColor={colors.redNeon} at={cue("erra")} tagAt={cue("chute")} top={480} />
      <Row label="7 acertos: acertou fáceis, errou difíceis" pattern={coherent} color={colors.green} tag="COERENTE: GANHA MAIS" tagColor={colors.green} at={cue("acerta", at("Já", from))} tagAt={cue("coerência")} top={790} />
    </SceneIn>
  );
};

const Tip: React.FC<{ at: number; text: React.ReactNode; top: number; color: string }> = ({ at: start, text, top, color }) => (
  <Pop at={start} from="left" style={{ left: 70, top, width: 940 }}>
    <Card color={color} style={{ padding: "24px 30px", display: "flex", alignItems: "center", gap: 24, fontWeight: 900, fontSize: 44 }}>
      <div style={{ width: 70, height: 70, flexShrink: 0, borderRadius: "50%", background: color, color: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>✓</div>
      <div>{text}</div>
    </Card>
  </Pop>
);

export const Scene4Dicas: React.FC<{ from: number }> = ({ from }) => {
  const cue = useCue(from);
  return (
    <SceneIn>
      <Pop at={1} style={{ left: 60, right: 60, top: 230, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 96, color: colors.white, lineHeight: 1 }}>
          NO <span style={{ color: colors.gold }}>DOMINGO</span>:
        </div>
      </Pop>
      <Tip at={cue("capricha")} top={420} color={colors.green} text={<>Capricha nas <span style={{ color: colors.green }}>fáceis</span></>} />
      <Tip at={cue("branco")} top={610} color={colors.gold} text={<>Não deixa <span style={{ color: colors.gold }}>nenhuma em branco</span></>} />
      <Tip at={cue("Errar")} top={800} color={colors.susNeon} text={<>Errar <span style={{ color: colors.susNeon }}>não tira ponto</span></>} />
    </SceneIn>
  );
};

export const Scene5Final: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const cue = useCue(from);
  return (
    <SceneIn>
      <Pop at={1} style={{ left: 60, right: 60, top: 300, textAlign: "center" }}>
        <div style={{ fontFamily: headlineFont, fontSize: 100, lineHeight: 1.05, color: colors.white }}>
          JÁ CONFERIU
          <br />
          <span style={{ color: colors.gold }}>SEU GABARITO?</span>
        </div>
      </Pop>
      <Pop at={cue("Comenta")} from="scale" style={{ left: 140, top: 640, width: 800 }}>
        <div style={{ borderRadius: 999, padding: "26px 0", textAlign: "center", background: colors.red, boxShadow: glow(colors.red, interpolate(Math.sin(frame / 5), [-1, 1], [0.5, 1.1])), fontFamily: bodyFont, fontWeight: 900, fontSize: 42, color: colors.white }}>
          COMENTA QUANTAS ACERTOU
        </div>
      </Pop>
    </SceneIn>
  );
};
