"""Builds a narration mp3 + word-timing JSON from an ElevenLabs take.

Usage:
  python3 scripts/build-narration.py <take.mp3> <words.json> [tempo]
      [--audio public/narracao.mp3] [--json src/Eleicoes/narration.json]
      [--pause "fica?:2.0" ...] [--cut "Segue,..mais!" ...]

The audio is sped up by `tempo` (pitch preserved) and word timestamps are scaled
to match. Spelled-out numbers are turned back into digits for the captions.
--pause inserts silence after a spoken word (matched in order, case-insensitive,
punctuation included), e.g. to leave "thinking time" after a quiz question.
--cut removes the spoken span from word A through word B (first match, same
matching rules), e.g. to drop an intro line without regenerating the take.
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
parser.add_argument("--cut", action="append", default=[], help="FIRST..LAST")
args = parser.parse_args()
tempo = args.tempo

raw = [dict(w) for w in json.load(open(args.words))["words"]
       if w.get("type", "word") == "word" and not re.fullmatch(r"\[.*\]", w["text"])]


def find(token, start=0):
    for i in range(start, len(raw)):
        if raw[i]["text"].lower() == token.lower():
            return i
    raise SystemExit(f"word not found: {token}")


# Cuts: [start of FIRST, start of the word after LAST), in take seconds.
cuts, removed = [], set()
for spec in args.cut:
    a, b = spec.split("..")
    ia = find(a)
    ib = find(b, ia)
    t0 = max(0.0, raw[ia]["start"] - 0.04)
    t1 = raw[ib + 1]["start"] - 0.1 if ib + 1 < len(raw) else raw[ib]["end"]
    cuts.append((t0, max(t0, t1)))
    removed.update(range(ia, ib + 1))

# Pauses: silence inserted between a word and the next one.
pauses, k = [], 0
for spec in args.pause:
    token, secs = spec.rsplit(":", 1)
    k = find(token, k)
    at = (raw[k]["end"] + raw[k + 1]["start"]) / 2 if k + 1 < len(raw) else raw[k]["end"]
    pauses.append((at, float(secs)))
    k += 1

duration = float(subprocess.run(
    ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", args.take],
    capture_output=True, text=True, check=True).stdout.strip())

# Timeline of pieces: ("a", start, end) audio spans and ("s", secs) silences.
points = sorted({0.0, duration, *[t for c in cuts for t in c], *[t for t, _ in pauses]})
pieces = []
for t0, t1 in zip(points, points[1:]):
    if any(t0 >= c0 and t1 <= c1 for c0, c1 in cuts) or t1 - t0 < 1e-3:
        continue
    pieces.append(("a", t0, t1))
    for at, secs in pauses:
        if abs(at - t1) < 1e-6:
            pieces.append(("s", secs))


def remap(t):
    """Original take time -> edited time (before tempo)."""
    acc = 0.0
    for p in pieces:
        if p[0] == "a":
            _, a, b = p
            if t < a:
                return acc
            if t <= b:
                return acc + (t - a)
            acc += b - a
        else:
            acc += p[1]
    return acc


with tempfile.TemporaryDirectory() as tmp:
    source = args.take
    if cuts or pauses:
        parts = []
        for n, p in enumerate(pieces):
            f = os.path.join(tmp, f"p{n}.wav")
            if p[0] == "a":
                subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", args.take, "-ss", str(p[1]),
                                "-to", str(p[2]), "-ac", "1", "-ar", "44100", f], check=True)
            else:
                subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i",
                                "anullsrc=r=44100:cl=mono", "-t", str(p[1]), f], check=True)
            parts.append(f)
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

kept = [w for i, w in enumerate(raw) if i not in removed]
for w in kept:
    s0, e0 = w["start"], w["end"]
    w["start"] = remap(s0 + 1e-6)
    w["end"] = max(w["start"], remap(e0 - 1e-6))
raw = kept
words = [{"text": w["text"], "start": w["start"] / tempo, "end": w["end"] / tempo} for w in raw]

# Spelled-out numbers merged into digits (caption display only). Longest first.
NUMBERS = [
    (["dia", "trinta", "de", "novembro"], "dia 30/11"),
    (["vinte", "de", "dezembro"], "20/12"),
    (["três", "mil", "reais"], "R$ 3.000"),
    (["mil", "e", "quinhentos"], "R$ 1.500"),
    (["um", "doze", "avos"], "1/12"),
    (["décimo", "terceiro"], "13º"),
    (["dia", "trinta"], "dia 30"),
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
    (["cinquenta", "por", "cento"], "50%"),
    (["vinte", "e", "sete"], "27"),
    (["quarenta", "segundos"], "40 segundos"),
    (["trinta", "e", "oito", "microssegundos"], "38 µs"),
    (["vinte", "mil", "quilômetros"], "20.000 km"),
    (["dez", "quilômetros"], "10 km"),
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
           ("trinta", "segundos"): "30", ("doze", "dias"): "12", ("sete", "dias"): "7", ("quatro", "lances"): "4", ("quatro", "satélites"): "4", ("trinta", "questões"): "30", ("três", "coisas"): "3", ("quinze", "dias"): "15", ("seis", "meses"): "6",
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
