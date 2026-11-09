# Terras Raras: roteiro e prompts

Composição Remotion: `TerrasRaras` (1920×1080, 30 fps, 43 s), em `src/TerrasRaras/`.
Cada cena abaixo é recriada em código (SVG/CSS animados). Os prompts em inglês
continuam aqui para gerar versões "live action" em Sora, Runway, Pika ou Luma, se quiser
trocar alguma cena por um clipe gerado.

**Estilo base** (adicione ao fim de todos os prompts):
`cinematic, 8k resolution, photorealistic, Unreal Engine 5 render, highly detailed, vivid colors, dramatic lighting, masterpiece, depth of field.`

| Cena | Tempo | Componente | Movimento de câmera |
| --- | --- | --- | --- |
| 1. A Origem | 0–8 s | `S1Origem` | slow zoom in |
| 2. A Escala | 8–14 s | `S2Escala` | drone flyover / pan |
| 3. A Alquimia | 14–20 s | `S3Alquimia` | slow tracking shot (parallax) |
| 4. O Poder | 20–26,5 s | `S4Poder` | slow orbit |
| 5. A Aplicação | 26,5–33,5 s | `S5Aplicacao` | speed ramp: chip → turbina → carro |
| 6. O Futuro | 33,5–43 s | `S6Futuro` | pull back / zoom out |

## Prompts

1. `Extreme macro photography of a raw, glowing Neodymium crystal embedded in dark, rugged volcanic rock. Bioluminescent ethereal blue and purple hues radiating from the mineral. Cinematic lighting, dust particles floating in the air, hyper-detailed textures, 8k, photorealistic.`
2. `Cinematic drone shot of a massive, futuristic open-pit mine at golden hour. Giant high-tech excavators moving glowing neon-green earth. Volumetric dust illuminated by the setting sun. Epic scale, cinematic composition, highly detailed industrial landscape.`
3. `Inside a sterile, ultra-modern laboratory. A robotic arm gently holding a glowing liquid silver orb. Complex glass tubes filled with luminescent cyan liquids in the background. Lens flares, cinematic shallow depth of field, neon lighting, highly technical atmosphere.`
4. `Visualizing magnetic fields. A polished, perfect silver metallic cube floating in mid-air above a glowing high-tech pedestal. Invisible magnetic waves visualized as glowing golden dust swirling around the cube. Hypnotic, futuristic, 8k, ultra-realistic.`
5. `Fast-paced transition: A glowing microchip transforming into a massive, sleek wind turbine spinning gracefully on a misty mountain, which then transforms into a futuristic electric sports car speeding through a cyberpunk city at night. Motion blur, neon reflections, cinematic lighting.`
6. `A glowing, ethereal holographic projection of the periodic table, with the 'Rare Earth Elements' row glowing brilliantly in gold. The hologram is glowing over a futuristic, clean, utopian green city powered by renewable energy. Beautiful sunset, inspiring atmosphere.`

## Narração

Voz sugerida: documentário, grave, inspiradora.

1. "Elas não são raras por escassez, mas por sua timidez em se revelar. Escondidas no coração da rocha..."
2. "As terras raras são a força invisível que move o mundo moderno."
3. "Do magnetismo que gira as turbinas de vento aos motores dos nossos carros elétricos..."
4. "Dezessete elementos da tabela periódica. Uma revolução silenciosa. O poder do nosso futuro."

As legendas (`CUES` em `src/TerrasRaras/data.ts`) seguem tempos fixos alinhados às cenas.
Para adicionar a voz, coloque o MP3 em `public/` e passe o nome no prop `narration`.
Se o ritmo da gravação for diferente, ajuste os tempos de `CUES` e `SCENES`.

## Renderizar

```bash
npx remotion render TerrasRaras out/terras-raras.mp4
```

Com trilha e narração:

```bash
npx remotion render TerrasRaras out/terras-raras.mp4 --props='{"narration":"terras-raras-narracao.mp3","music":"trilha.mp3","musicVolume":0.3,"showCaptions":true}'
```
