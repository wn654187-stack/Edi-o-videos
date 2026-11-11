"""Approximate word timings for a narration when no transcription service is available.

Usage: python3 scripts/align-local.py <audio.mp3> <script.txt> <out-words.json>

The script text must be exactly what is spoken (audio tags like [excited] are
ignored). Pauses are detected with ffmpeg's silencedetect; phrase boundaries
(punctuation) are snapped to the nearest pause, and words inside each phrase
are spread by length. Output matches the ElevenLabs Scribe "words" format so
it can be fed to build-narration.py.
"""
import json
import re
import subprocess
import sys

audio, script_path, out_path = sys.argv[1:4]
text = re.sub(r"\[[^\]]*\]", " ", open(script_path, encoding="utf-8").read())
tokens = text.split()

probe = subprocess.run(
    ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", audio],
    capture_output=True, text=True, check=True,
)
duration = float(probe.stdout.strip())
log = subprocess.run(
    ["ffmpeg", "-i", audio, "-af", "silencedetect=noise=-35dB:d=0.12", "-f", "null", "-"],
    capture_output=True, text=True,
).stderr
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
silences = list(zip(starts, ends))

# Speech span: skip leading/trailing silence.
speech_start = silences[0][1] if silences and silences[0][0] < 0.05 else 0.0
speech_end = silences[-1][0] if silences and silences[-1][1] >= duration - 0.05 else duration
inner = [(s, e) for s, e in silences if s > speech_start + 0.05 and e < speech_end - 0.05]

# Phrases end at punctuation.
phrases, cur = [], []
for t in tokens:
    cur.append(t)
    if re.search(r"[.,!?:;…]$", t):
        phrases.append(cur)
        cur = []
if cur:
    phrases.append(cur)

weight = lambda ws: sum(len(w) + 1 for w in ws)
total = sum(weight(p) for p in phrases)
span = speech_end - speech_start

# Expected boundary after each phrase, snapped to the nearest unused pause.
bounds, acc, used = [], 0, set()
for p in phrases[:-1]:
    acc += weight(p)
    expected = speech_start + span * acc / total
    best, best_d = None, 1.2
    for i, (s, e) in enumerate(inner):
        if i in used:
            continue
        d = abs((s + e) / 2 - expected)
        if d < best_d:
            best, best_d = i, d
    if best is not None:
        used.add(best)
        bounds.append(inner[best])
    else:
        bounds.append((expected, expected))
bounds.sort()

words, seg_start = [], speech_start
for i, p in enumerate(phrases):
    seg_end = bounds[i][0] if i < len(bounds) else speech_end
    seg_w = weight(p)
    t = seg_start
    for w in p:
        d = (seg_end - seg_start) * (len(w) + 1) / seg_w
        words.append({"text": w, "type": "word", "start": round(t, 3), "end": round(t + d * 0.92, 3)})
        t += d
    seg_start = bounds[i][1] if i < len(bounds) else seg_end

json.dump({"words": words, "aligned": "local-silence"}, open(out_path, "w"), ensure_ascii=False, indent=0)
print(f"{len(words)} words, {len(phrases)} phrases, {len(inner)} pauses, speech {speech_start:.2f}-{speech_end:.2f}s")
