"""Builds a shorter narration from an assembled one by keeping word ranges.

Usage: python3 scripts/cut-narration.py <narration.json> <audio.mp3> <ranges.json> <out.mp3> <out.json>
ranges.json: {"gap": 0.25, "scenes": [{"id": "hook", "ranges": [["Existe", "Niño."], ...]}, ...]}
Each range is [opening phrase, closing phrase] (first match at/after the previous range).
Output json: {"words": [...], "chapters": [{"id", "title", "start"}]} in the new timeline.
"""
import json, os, re, subprocess, sys, tempfile

src_json, src_audio, ranges_path, out_audio, out_json = sys.argv[1:6]
words = json.load(open(src_json))["words"]
spec = json.load(open(ranges_path))
gap = spec.get("gap", 0.25)
norm = lambda t: re.sub(r"[^\wà-ú.0-9]", "", t.lower()).strip(".")

def find(phrase, start, end_of=False):
    """Index of the first (or, with end_of, last) word of `phrase` at/after `start`."""
    seq = [norm(x) for x in phrase.split()]
    for i in range(start, len(words) - len(seq) + 1):
        if [norm(w["text"]) for w in words[i:i + len(seq)]] == seq:
            return i + len(seq) - 1 if end_of else i
    raise SystemExit(f"not found: {phrase!r} after {start}")

pieces, out_words, chapters, t, cursor = [], [], [], 0.0, 0
for sc in spec["scenes"]:
    chapters.append({"id": sc["id"], "title": sc.get("title", sc["id"]), "start": round(t, 3)})
    for first, last in sc["ranges"]:
        a = find(first, cursor)
        b = find(last, a, end_of=True)
        cursor = b + 1
        t0 = max(0.0, words[a]["start"] - 0.05)
        t1 = words[b]["end"] + 0.12
        pieces.append((t0, t1))
        for w in words[a:b + 1]:
            out_words.append({"text": w["text"], "start": round(t + w["start"] - t0, 3), "end": round(t + w["end"] - t0, 3)})
        t += (t1 - t0) + gap

with tempfile.TemporaryDirectory() as tmp:
    files = []
    for n, (a, b) in enumerate(pieces):
        f = os.path.join(tmp, f"p{n}.wav")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src_audio, "-ss", str(a), "-to", str(b), "-ac", "1", "-ar", "44100", f], check=True)
        g = os.path.join(tmp, f"g{n}.wav")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", str(gap), g], check=True)
        files += [f, g]
    lst = os.path.join(tmp, "l.txt")
    open(lst, "w").write("".join(f"file '{f}'\n" for f in files))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-b:a", "192k", out_audio], check=True)

json.dump({"words": out_words, "chapters": chapters}, open(out_json, "w"), ensure_ascii=False, indent=0)
print(len(out_words), "words; ends", out_words[-1]["end"])
for c in chapters:
    print(f"  {c['start']:6.2f} {c['id']}")
