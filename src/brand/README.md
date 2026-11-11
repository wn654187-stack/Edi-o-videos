# Padrão visual "Will Te Explica"

Todos os vídeos novos usam este kit (`src/brand/`).

- **Paleta do perfil** (`theme.ts`): fundo quase preto `#07070b`, texto off-white `#f3f1ea`,
  lima `#d8ff3e`, azul elétrico `#3b3bff`, laranja `#ff5a1f`. Fonte: Sora.
- **Estrutura de cena** (`Scene.tsx` / `Glass.tsx`): card de vidro no topo com rótulo pequeno,
  ícone colorido e título grande; legendas grandes em Sora com palavras-chave coloridas.
- **Objeto herói** (`GlassObject.tsx`): cada vídeo cria o SEU objeto temático com o material de
  vidro (luz colorida em movimento dentro, reflexo, borda clara, glow). Ex.: termômetro + sol
  (clima), estrela (Natal), medidor e gabarito (Enem), etiqueta de preço e escudo (consumidor).
  Não usar uma esfera genérica com órbitas: o objeto deve ter relação com o tema.
- `BrandVideo.tsx` monta fundo, cenas, barra de progresso, tag, legendas e áudio.
