
## Plano: Criar Harmonia Visual entre Seccoes da Homepage

### Problema Actual
Varias seccoes consecutivas usam o mesmo fundo (`bg-secondary/30` ou `bg-muted/30`), criando uma aparencia monotona sem distincao clara entre seccoes. Faltam contrastes visuais alternados.

### Solucao
Criar um ritmo visual alternado usando a paleta existente do site (magenta, roxo, lavanda, branco), garantindo que cada seccao se distingue da anterior sem sair da identidade visual.

### Esquema de Fundos (de cima para baixo)

| # | Seccao | Fundo Actual | Novo Fundo |
|---|--------|-------------|------------|
| 1 | HeroSlider | imagens (inalterado) | Sem alteracao |
| 2 | AboutSection | branco + gradiente sutil | Sem alteracao |
| 3 | StatisticsSection | `bg-muted/30` | **Fundo escuro** - gradiente primary-to-accent escuro com texto claro |
| 4 | ImpactStorySection | gradientes subtis | Sem alteracao (ja tem decoracoes proprias) |
| 5 | PillarsSection | branco | **`bg-secondary/40`** com borda superior sutil |
| 6 | ActivitiesSection | `bg-secondary/30` | **Branco** (fundo limpo, sem background) |
| 7 | VideosSection | `bg-muted/30` | **Fundo escuro** - gradiente escuro do foreground/accent |
| 8 | TeamSection | `bg-secondary/30` | **Branco** (fundo limpo) |
| 9 | PartnersSection | `bg-secondary/30` | **`bg-muted/20`** com borda superior sutil |

### Detalhes das Alteracoes

#### 1. StatisticsSection - Fundo Escuro Dramatico
- Fundo: gradiente de `hsl(280 30% 15%)` (foreground escuro) para `hsl(288 55% 25%)`
- Texto do titulo e subtitulo: branco (`text-white`)
- Badge: fundo `bg-white/10` com texto branco
- Cards mantêm o estilo actual (ja têm `bg-card`)
- Fonte de dados: `bg-white/10` com texto `text-white/70`
- Cria impacto visual forte apos a seccao About

#### 2. PillarsSection - Lavanda Suave
- Adicionar `bg-secondary/40` ao section
- Manter tudo o resto igual
- Contrasta com a ImpactStorySection (branca com gradientes) acima

#### 3. ActivitiesSection - Fundo Branco Limpo
- Remover `bg-secondary/30`, deixar fundo branco
- Contrasta com PillarsSection (lavanda) acima

#### 4. VideosSection - Fundo Escuro
- Fundo: gradiente escuro similar ao StatisticsSection mas ligeiramente diferente
- Texto e titulos em branco
- Cards de video: bordas mais visíveis com `border-white/10`
- Botao play: manter o estilo actual (ja esta bom)
- Cria drama visual e destaca os videos

#### 5. TeamSection - Fundo Branco
- Remover `bg-secondary/30`, deixar fundo branco
- Cards dos membros ja têm `bg-card` proprio

#### 6. PartnersSection - Muted Suave
- Alterar de `bg-secondary/30` para `bg-muted/20`
- Adicionar borda superior decorativa sutil

### Padrao Visual Resultante
```text
Branco -> ESCURO -> Branco/Sutil -> Lavanda -> Branco -> ESCURO -> Branco -> Muted
```

Este ritmo cria alternancia visual clara, usando a paleta existente sem introduzir cores novas.

### Ficheiros a Modificar
- `src/components/home/StatisticsSection.tsx` - fundo escuro + ajuste de cores de texto
- `src/components/home/PillarsSection.tsx` - adicionar fundo lavanda
- `src/components/home/ActivitiesSection.tsx` - remover fundo
- `src/components/home/VideosSection.tsx` - fundo escuro + ajuste de cores
- `src/components/home/TeamSection.tsx` - remover fundo
- `src/components/home/PartnersSection.tsx` - alterar fundo
- `src/components/ui/section-header.tsx` - aceitar prop opcional para texto claro em fundos escuros
