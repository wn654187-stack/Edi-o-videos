"""Synthesises the Terras Raras soundtrack: public/terras-raras-trilha.mp3.

Usage: python3 scripts/build-music.py
Cinematic ambient score (pads, sub hits, risers, bells and a pulse in the
application scene) timed to the scene cuts in src/TerrasRaras/data.ts.
Needs numpy, scipy and ffmpeg.
"""
import subprocess
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
DUR = 43.0
CUTS = [0, 8, 14, 20, 26.5, 33.5]
N = int(SR * DUR)
rng = np.random.default_rng(7)


def hz(note):
    names = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    name, octave = note[:-1], int(note[-1])
    return 440.0 * 2 ** ((names[name] + 12 * (octave + 1) - 69) / 12)


def t_axis(n):
    return np.arange(n) / SR


def env_adsr(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def lowpass(x, cutoff, order=2):
    return sosfilt(butter(order, cutoff, fs=SR, output="sos"), x)


def place(buf, sig, start):
    i = int(start * SR)
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def pad(notes, start, end, level=0.12, cutoff=(500, 1600), attack=1.5, release=2.0):
    """Detuned saw pad with a filter sweep."""
    n = int((end - start + release) * SR)
    t = t_axis(n)
    sig = np.zeros(n)
    for note in notes:
        f = hz(note)
        for det in (-0.12, 0.0, 0.11):
            ph = rng.random()
            sig += 2 * (((f * 2 ** (det / 12)) * t + ph) % 1.0) - 1
    sig /= len(notes) * 3
    # sweep cutoff in blocks
    out = np.zeros(n)
    blocks = 40
    edges = np.linspace(0, n, blocks + 1).astype(int)
    for b in range(blocks):
        c = cutoff[0] + (cutoff[1] - cutoff[0]) * (b / blocks)
        seg = sig[max(0, edges[b] - 2000): edges[b + 1]]
        out[edges[b]: edges[b + 1]] = lowpass(seg, c)[-(edges[b + 1] - edges[b]):]
    env = env_adsr(n, attack, release)
    return out * env * level


def sub_hit(level=0.6):
    n = int(2.5 * SR)
    t = t_axis(n)
    f = 30 + 50 * np.exp(-t * 6)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 1.6) * level


def riser(length, level=0.25):
    n = int(length * SR)
    t = np.linspace(0, 1, n)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    edges = np.linspace(0, n, 30).astype(int)
    for b in range(29):
        c = 300 + 6000 * (b / 29) ** 2
        out[edges[b]: edges[b + 1]] = lowpass(noise[edges[b]: edges[b + 1]], c)
    return out * t ** 2.5 * level


def bell(note, length=2.5, level=0.12):
    n = int(length * SR)
    t = t_axis(n)
    f = hz(note)
    sig = np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 3) + 0.2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 6)
    return sig * np.exp(-t * 2.2) * env_adsr(n, 0.004, 0.05) * level


def pluck(note, length=0.35, level=0.1):
    n = int(length * SR)
    t = t_axis(n)
    f = hz(note)
    sig = 2 * ((f * t) % 1.0) - 1
    return lowpass(sig, 2500) * np.exp(-t * 9) * env_adsr(n, 0.003, 0.03) * level


def kick(level=0.55):
    n = int(0.45 * SR)
    t = t_axis(n)
    f = 45 + 110 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) * level


def hat(level=0.05):
    n = int(0.08 * SR)
    t = t_axis(n)
    x = rng.standard_normal(n)
    x = x - lowpass(x, 7000)
    return x * np.exp(-t * 60) * level


dry = np.zeros(N)
wet_send = np.zeros(N)

# --- Pads (chord per scene) -------------------------------------------------
chords = [
    (["A1", "E2", "A2", "C3", "E3"], (250, 900), 0.13),       # A Origem: dark Am
    (["F1", "C2", "F2", "A2", "C3"], (400, 1300), 0.13),       # A Escala: F
    (["C2", "G2", "C3", "E3", "G3"], (600, 1500), 0.12),       # A Alquimia: C
    (["G1", "D2", "G2", "B2", "D3"], (600, 1800), 0.12),       # O Poder: G
    (["A1", "E2", "A2", "C3", "E3"], (900, 2400), 0.13),       # A Aplicação: Am, brighter
    (["C2", "G2", "C3", "E3", "G3", "C4"], (700, 2600), 0.15),  # O Futuro: C major
]
ends = CUTS[1:] + [DUR]
for (notes, cut, lvl), s, e in zip(chords, CUTS, ends):
    p = pad(notes, s, e, level=lvl, cutoff=cut, attack=1.2 if s else 3.0, release=1.6)
    place(dry, p, s)
    place(wet_send, p * 0.8, s)

# Final scene: F -> C cadence on top
place(dry, pad(["F2", "A2", "C3", "F3"], 38.5, 41.0, level=0.07, cutoff=(800, 2200)), 38.5)

# --- Sub hits on each cut, risers into them ----------------------------------
for c in CUTS:
    place(dry, sub_hit(0.55 if c else 0.4), c)
for c in CUTS[1:]:
    r = riser(1.6, 0.18)
    place(dry, r, c - 1.6)
    place(wet_send, r * 0.6, c - 1.6)

# --- Bells: crystal glints (S1), magnetism arpeggio (S4), finale motif (S6) ---
for t0, note in [(1.5, "E5"), (3.5, "A5"), (5.5, "C6"), (6.8, "B5")]:
    place(wet_send, bell(note, 3, 0.08), t0)
for i, note in enumerate(["G4", "B4", "D5", "G5", "D5", "B4"] * 4):
    t0 = 20.3 + i * 0.25
    if t0 < 26.3:
        b = bell(note, 1.5, 0.05)
        place(dry, b * 0.5, t0)
        place(wet_send, b, t0)
for t0, note in [(34.0, "E5"), (35.0, "G5"), (36.0, "C6"), (37.5, "B5"), (38.5, "A5"), (39.5, "G5"), (40.5, "C6")]:
    b = bell(note, 3.5, 0.09)
    place(dry, b * 0.5, t0)
    place(wet_send, b, t0)

# --- Lab scene: soft 8th-note arpeggio ---------------------------------------
arp = ["C4", "G4", "E4", "G4"]
for i in range(int(6 / 0.25)):
    t0 = 14.2 + i * 0.25
    if t0 < 20:
        place(dry, pluck(arp[i % 4], level=0.06), t0)
        place(wet_send, pluck(arp[i % 4], level=0.05), t0)

# --- Application scene: driving pulse at 120 bpm -----------------------------
beat = 0.5
bass_line = ["A1", "A1", "A1", "A1", "F1", "F1", "G1", "G1"]
for i in range(int(7 / beat)):
    t0 = 26.5 + i * beat
    if t0 >= 33.3:
        break
    place(dry, kick(0.5), t0)
    place(dry, hat(), t0 + beat / 2)
    place(dry, pluck(bass_line[(i // 2) % 8], 0.45, 0.16), t0)
    place(dry, pluck(bass_line[(i // 2) % 8], 0.3, 0.08), t0 + beat / 2)
    for k, note in enumerate(["A4", "C5", "E5", "C5"]):
        place(wet_send, pluck(note, 0.25, 0.035), t0 + k * beat / 4)

# --- Reverb ------------------------------------------------------------------
def ir(seed, length=3.2):
    r = np.random.default_rng(seed)
    n = int(length * SR)
    t = t_axis(n)
    return lowpass(r.standard_normal(n), 6000) * np.exp(-t * 2.0) * 0.05


wet_l = fftconvolve(wet_send, ir(1))[:N]
wet_r = fftconvolve(wet_send, ir(2))[:N]
left = dry + wet_l + wet_send * 0.3
right = dry + wet_r + wet_send * 0.3

mix = np.stack([left, right], axis=1)
# fade in/out, soft limit, normalise
fade = np.ones(N)
fade[: int(0.5 * SR)] = np.linspace(0, 1, int(0.5 * SR))
fade[-int(2.5 * SR):] *= np.linspace(1, 0, int(2.5 * SR))
mix *= fade[:, None]
mix = np.tanh(mix * 1.6)
mix /= np.max(np.abs(mix)) / 0.89

pcm = (mix * 32767).astype(np.int16)
tmp = "/tmp/terras-raras-trilha.wav"
with wave.open(tmp, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp, "-b:a", "192k", "public/terras-raras-trilha.mp3"], check=True)
print("wrote public/terras-raras-trilha.mp3", DUR, "s")
