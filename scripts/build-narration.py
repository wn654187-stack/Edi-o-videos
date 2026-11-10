"""Builds a narration mp3 + word-timing JSON from an ElevenLabs take.

Usage:
  python3 scripts/build-narration.py <take.mp3> <words.json> [tempo]
      [--audio public/narracao.mp3] [--json src/Eleicoes/narration.json]

The audio is sped up by `tempo` (pitch preserved) and word timestamps are scaled
to match. Spelled-out numbers are turned back into digits for the captions.
"""
import argparse
import json
import re
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument("take")
parser.add_argument("words")
parser.add_argument("tempo", nargs="?", type=float, default=1.1)
parser.add_argument("--audio", default="public/narracao.mp3")
parser.add_argument("--json", default="src/Eleicoes/narration.json")
args = parser.parse_args()
tempo = args.tempo

subprocess.run(
    ["ffmpeg", "-y", "-loglevel", "error", "-i", args.take, "-af", f"atempo={tempo}",
     "-b:a", "192k", args.audio],
    check=True,
)

raw = [w for w in json.load(open(args.words))["words"]
       if w.get("type", "word") == "word" and not re.fullmatch(r"\[.*\]", w["text"])]
words = [{"text": w["text"], "start": w["start"] / tempo, "end": w["end"] / tempo} for w in raw]

# Spelled-out numbers merged into digits (caption display only). Longest first.
NUMBERS = [
    (["quinhentos", "e", "trinta", "e", "oito"], "538"),
    (["cento", "e", "noventa", "e", "seis"], "196"),
    (["oito", "mil", "e", "oitenta"], "8.080"),
    (["cento", "e", "noventa"], "190"),
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
           ("trinta", "segundos"): "30"}


def norm(t):
    return re.sub(r"[^\wà-ú]", "", t.lower())


out, i = [], 0
while i < len(words):
    merged = False
    for seq, digit in NUMBERS:
        if [norm(w["text"]) for w in words[i:i + len(seq)]] == seq:
            last = words[i + len(seq) - 1]
            tail = re.sub(r"[\wÀ-ú]", "", last["text"])
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
