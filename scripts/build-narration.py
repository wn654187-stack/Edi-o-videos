"""Builds public/narracao.mp3 and src/Eleicoes/narration.json from an ElevenLabs take.

Usage: python3 scripts/build-narration.py <take.mp3> <words.json> [tempo]
The audio is sped up by `tempo` (pitch preserved) and word timestamps are scaled
to match. Spelled-out numbers are turned back into digits for the captions.
"""
import json
import re
import subprocess
import sys

src, words_path = sys.argv[1], sys.argv[2]
tempo = float(sys.argv[3]) if len(sys.argv) > 3 else 1.1

subprocess.run(
    ["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-af", f"atempo={tempo}",
     "-b:a", "192k", "public/narracao.mp3"],
    check=True,
)

raw = [w for w in json.load(open(words_path))["words"]
       if w.get("type", "word") == "word" and not re.fullmatch(r"\[.*\]", w["text"])]
words = [{"text": w["text"], "start": w["start"] / tempo, "end": w["end"] / tempo} for w in raw]

# Merge spelled-out numbers into digits (caption display only)
NUMBERS = [
    (["quinhentos", "e", "trinta", "e", "oito"], "538"),
    (["duzentos", "e", "setenta"], "270"),
    (["cinquenta"], "50"),
    (["trinta", "delegados"], None),  # handled below: "trinta" -> "30"
]

def norm(t):
    return re.sub(r"[^\wà-ú]", "", t.lower())

out, i = [], 0
while i < len(words):
    merged = False
    for seq, digit in NUMBERS:
        if digit and [norm(w["text"]) for w in words[i:i + len(seq)]] == seq:
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
    if norm(w["text"]) == "trinta" and nxt == "delegados":
        w["text"] = "30"
    if norm(w["text"]) == "um" and nxt == "voto":
        w["text"] = "1"
    out.append(w)
    i += 1

for w in out:
    w["start"], w["end"] = round(w["start"], 3), round(w["end"], 3)

json.dump({"tempo": tempo, "words": out}, open("src/Eleicoes/narration.json", "w"),
          ensure_ascii=False, indent=0)
print(len(out), "words; last ends at", out[-1]["end"])
