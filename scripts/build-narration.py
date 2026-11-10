"""Builds a narration mp3 + word-timing JSON from an ElevenLabs take.

Usage:
  python3 scripts/build-narration.py <take.mp3> <words.json> [tempo]
      [--audio public/narracao.mp3] [--json src/Eleicoes/narration.json]
      [--pause "fica?:2.0" --pause "duas?:2.0" ...]

The audio is sped up by `tempo` (pitch preserved) and word timestamps are scaled
to match. Spelled-out numbers are turned back into digits for the captions.
--pause inserts silence after a spoken word (matched in order, case-insensitive,
punctuation included), e.g. to leave "thinking time" after a quiz question.
"""
import argparse
import json
import re
import os
import subprocess
import tempfile

parser = argparse.ArgumentParser()
parser.add_argument("take")
parser.add_argument("words")
parser.add_argument("tempo", nargs="?", type=float, default=1.1)
parser.add_argument("--audio", default="public/narracao.mp3")
parser.add_argument("--json", default="src/Eleicoes/narration.json")
parser.add_argument("--pause", action="append", default=[], help="WORD:SECONDS")
args = parser.parse_args()
tempo = args.tempo

raw = [dict(w) for w in json.load(open(args.words))["words"]
       if w.get("type", "word") == "word" and not re.fullmatch(r"\[.*\]", w["text"])]

# Pause points (seconds in the original take) and the shift they cause.
pauses, k = [], 0
for spec in args.pause:
    token, secs = spec.rsplit(":", 1)
    while k < len(raw) and raw[k]["text"].lower() != token.lower():
        k += 1
    if k == len(raw):
        raise SystemExit(f"pause word not found: {token}")
    cut = (raw[k]["end"] + raw[k + 1]["start"]) / 2 if k + 1 < len(raw) else raw[k]["end"]
    pauses.append((cut, float(secs)))
    k += 1

with tempfile.TemporaryDirectory() as tmp:
    source = args.take
    if pauses:
        parts, prev = [], 0.0
        for n, (cut, secs) in enumerate(pauses):
            seg, sil = os.path.join(tmp, f"s{n}.wav"), os.path.join(tmp, f"p{n}.wav")
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", args.take, "-ss", str(prev),
                            "-to", str(cut), "-ac", "1", "-ar", "44100", seg], check=True)
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i",
                            "anullsrc=r=44100:cl=mono", "-t", str(secs), sil], check=True)
            parts += [seg, sil]
            prev = cut
        last = os.path.join(tmp, "last.wav")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", args.take, "-ss", str(prev),
                        "-ac", "1", "-ar", "44100", last], check=True)
        parts.append(last)
        listfile = os.path.join(tmp, "list.txt")
        open(listfile, "w").write("".join(f"file '{p}'\n" for p in parts))
        source = os.path.join(tmp, "joined.wav")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0",
                        "-i", listfile, source], check=True)
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", source, "-af", f"atempo={tempo}",
         "-b:a", "192k", args.audio],
        check=True,
    )

for w in raw:
    shift = sum(secs for cut, secs in pauses if w["start"] >= cut)
    w["start"] += shift
    w["end"] += shift
words = [{"text": w["text"], "start": w["start"] / tempo, "end": w["end"] / tempo} for w in raw]

# Spelled-out numbers merged into digits (caption display only). Longest first.
NUMBERS = [
    (["quinhentos", "e", "trinta", "e", "oito"], "538"),
    (["cento", "e", "noventa", "e", "seis"], "196"),
    (["noventa", "e", "seis", "reais"], "R$ 96"),
    (["vinte", "por", "cento"], "20%"),
    (["cem", "reais"], "R$ 100"),
    (["um", "quarto"], "1/4"),
    (["oito", "mil", "e", "oitenta"], "8.080"),
    (["cento", "e", "cinquenta", "quilowattshora"], "150 kWh"),
    (["cento", "e", "noventa"], "190"),
    (["cinco", "mil", "watts"], "5.000 W"),
    (["dez", "por", "cento"], "10%"),
    (["três", "pra", "um"], "3:1"),
    (["cê", "ó", "ó", "agá"], "COOH"),
    (["ó", "agá"], "OH"),
    (["sessenta", "e", "sete"], "67"),
    (["duzentos", "e", "setenta"], "270"),
    (["noventa", "segundos"], "90 segundos"),
    (["oitava"], "8ª"),
    (["cinquenta"], "50"),
]
# Single words turned into digits only when followed by a given word.
CONTEXT = {("trinta", "delegados"): "30", ("um", "voto"): "1",
           ("sete", "em"): "7", ("dez", "brasileiros"): "10",
           ("setenta", "quilos"): "70", ("cinco", "toneladas"): "5",
           ("trinta", "segundos"): "30", ("doze", "dias"): "12",
           ("três", "pedreiros"): "3", ("seis", "pedreiros"): "6"}


def norm(t):
    return re.sub(r"[^\wà-ú]", "", t.lower())


out, i = [], 0
while i < len(words):
    merged = False
    for seq, digit in NUMBERS:
        if [norm(w["text"]) for w in words[i:i + len(seq)]] == seq:
            last = words[i + len(seq) - 1]
            tail = re.search(r"[.,!?:;…]*$", last["text"]).group()
            out.append({"text": digit + tail, "start": words[i]["start"], "end": last["end"]})
            i += len(seq)
            merged = True
            break
    if merged:
        continue
    w = dict(words[i])
    nxt = norm(words[i + 1]["text"]) if i + 1 < len(words) else ""
    digit = CONTEXT.get((norm(w["text"]), nxt))
    if digit:
        w["text"] = digit + re.sub(r"[\wÀ-ú]", "", w["text"])
    out.append(w)
    i += 1

for w in out:
    w["start"], w["end"] = round(w["start"], 3), round(w["end"], 3)

json.dump({"tempo": tempo, "words": out}, open(args.json, "w"), ensure_ascii=False, indent=0)
print(len(out), "words; last ends at", out[-1]["end"])
