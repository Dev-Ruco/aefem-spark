

## Hero Editorial — Carrossel Split por Publicação

### Conceito
Cada slide = 1 publicação. Lado esquerdo branco com título. Lado direito com imagem. Tudo muda junto no carrossel.

### Estrutura de cada slide

```text
┌────────────────────┬────────────────────────────────┐
│                    │                                │
│   Fundo branco     │   Imagem destacada             │
│                    │   do artigo                    │
│   [Categoria]      │                                │
│                    │                                │
│   TÍTULO DO        │                                │
│   ARTIGO           │                                │
│                    │                                │
│   data · Ler mais →│                                │
│                    │                                │
│   ● ● ● ○ ○       │                                │
│                    │                                │
└────────────────────┴────────────────────────────────┘
        ~40%                    ~60%
```

Mobile: empilhado — imagem em cima (50% altura), título em baixo sobre fundo branco.

### Implementacao

**`src/components/home/HeroSlider.tsx`** — reescrita completa:

- Mesma query existente: `articles` published, order by `published_at DESC`, limit 8
- Filtrar artigos sem `featured_image` (ou fallback com gradient)
- Cada slide: `div` com flex row (desktop) / flex col (mobile)
  - Esquerda: fundo branco, titulo grande (`font-display`, 3xl-6xl), categoria como badge pequeno com cor primaria, data formatada, link "Ler mais" com seta
  - Direita: imagem `object-cover` a 100% da area, com leve overlay gradiente na borda esquerda para transicao suave
- Transicao entre slides: fade + translateX suave (700ms)
- Auto-advance a cada 6s, pausa no hover
- Setas de navegacao: posicionadas centradas verticalmente, estilo clean
- Progress dots: na area esquerda, em baixo, com animacao de progresso
- Loading skeleton: split layout com placeholders
- Fallback sem artigos: hero institucional estatico (manter o existente)

**`src/index.css`** — sem alteracoes necessarias (keyframes existentes suficientes)

**`src/contexts/LanguageContext.tsx`** — adicionar traducao `hero.read_more_article` se necessario (ja existe `hero.read_more`)

### Detalhes visuais
- Separacao entre areas: borda diagonal sutil ou clip-path na imagem para efeito premium
- Titulo: `font-display` bold, cor `foreground`, tamanho grande
- Categoria: badge pequeno magenta/roxo, uppercase, tracking wide
- Data: texto muted, tamanho pequeno
- Link "Ler mais": texto primario com seta animada no hover
- Imagem: `object-cover`, `object-position: center 20%` para priorizar rostos
- Cantos: arredondados suaves onde aplicavel

### Responsivo
- Desktop (lg+): flex-row, 40/60 split
- Tablet (md): flex-row, 45/55 split
- Mobile: flex-col, imagem em cima (250px altura), texto em baixo

### Ficheiros
| Ficheiro | Alteracao |
|----------|-----------|
| `src/components/home/HeroSlider.tsx` | Reescrita completa — carrossel editorial split |

