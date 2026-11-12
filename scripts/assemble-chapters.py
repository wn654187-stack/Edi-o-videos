"""Joins several narration takes into one track with a pause at every chapter boundary.

Usage: python3 scripts/assemble-chapters.py <spec.json> <out.mp3> <out-narration.json>

spec.json: {"pause": 0.8, "segments": [{"audio": "a.mp3", "words": "a.json",
            "chapters": [{"id": "1", "title": "...", "first": ["Existe"]}, ...]}, ...]}
Each chapter's "first" is the word sequence that opens it inside that take.
Writes {"words": [...], "chapters": [{"id", "title", "start"}]} in output time.
"""
import json, os, re, subprocess, sys, tempfile

spec_path, out_audio, out_json = sys.argv[1:4]
spec = json.load(open(spec_path))
pause = spec.get("pause", 0.8)
norm = lambda t: re.sub(r"[^\wà-ú]", "", t.lower())

pieces, words_out, chapters_out, t_out = [], [], [], 0.0
for seg in spec["segments"]:
    ws = [w for w in json.load(open(seg["words"]))["words"] if w.get("type", "word") == "word" and not re.fullmatch(r"\[.*\]", w["text"])]
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", seg["audio"]], capture_output=True, text=True).stdout)
    # chapter start indices inside this take
    idx = []
    k = 0
    for ch in seg["chapters"]:
        seq = [norm(x) for x in ch["first"]]
        while [norm(w["text"]) for w in ws[k:k + len(seq)]] != seq:
            k += 1
            if k >= len(ws):
                raise SystemExit(f"chapter start not found: {ch['first']}")
        idx.append(k)
        k += 1
    # cut points: middle of the gap before each chapter (except the first, which starts at 0)
    cuts = [0.0] + [(ws[i - 1]["end"] + ws[i]["start"]) / 2 for i in idx[1:]] + [dur]
    for c, ch in enumerate(seg["chapters"]):
        a, b = cuts[c], cuts[c + 1]
        if pieces:
            pieces.append(("s", pause))
            t_out += pause
        chapters_out.append({"id": ch["id"], "title": ch["title"], "start": round(t_out, 3)})
        pieces.append(("a", seg["audio"], a, b))
        for w in ws:
            if a <= w["start"] < b:
                words_out.append({"text": w["text"], "start": round(t_out + w["start"] - a, 3), "end": round(t_out + w["end"] - a, 3)})
        t_out += b - a

with tempfile.TemporaryDirectory() as tmp:
    files = []
    for n, p in enumerate(pieces):
        f = os.path.join(tmp, f"p{n}.wav")
        if p[0] == "a":
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", p[1], "-ss", str(p[2]), "-to", str(p[3]), "-ac", "1", "-ar", "44100", f], check=True)
        else:
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", str(p[1]), f], check=True)
        files.append(f)
    lst = os.path.join(tmp, "l.txt")
    open(lst, "w").write("".join(f"file '{f}'\n" for f in files))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-b:a", "192k", out_audio], check=True)

# caption-only merges
merged, i = [], 0
while i < len(words_out):
    trio = [norm(w["text"]) for w in words_out[i:i + 3]]
    if trio == ["três", "ponto", "quatro"]:
        tail = re.search(r"[.,!?:;]*$", words_out[i + 2]["text"]).group()
        merged.append({"text": "3.4" + tail, "start": words_out[i]["start"], "end": words_out[i + 2]["end"]})
        i += 3
        continue
    merged.append(words_out[i])
    i += 1
json.dump({"words": merged, "chapters": chapters_out}, open(out_json, "w"), ensure_ascii=False, indent=0)
print(len(merged), "words;", len(chapters_out), "chapters; ends", merged[-1]["end"])
for c in chapters_out:
    print(f"  {int(c['start'] // 60)}:{int(c['start'] % 60):02d} {c['title']}")
