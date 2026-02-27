

## Plano: Criar Seccao "Historias de Impacto" entre Estatisticas e Proposito

### Objectivo
Criar uma nova seccao visualmente atraente entre `StatisticsSection` e `PurposeSection` que destaque a historia de impacto da AEFEM com o conteudo fornecido e a foto carregada.

### Design da Seccao
Layout em duas colunas (desktop): imagem a esquerda com a foto do evento AEFEM, texto a direita com o conteudo fornecido. Fundo com gradiente subtil para se destacar. Inclui badge de destaque, titulo principal, subtitulo, paragrafo descritivo e lista de pontos de impacto com icones. Responsivo: em mobile fica em coluna unica.

### Alteracoes

#### 1. Copiar imagem para o projecto
- Copiar `user-uploads://505302907_...jpg` para `src/assets/impact-story.jpg`

#### 2. Criar componente `ImpactStorySection`
**Ficheiro:** `src/components/home/ImpactStorySection.tsx`

- Layout split: imagem (60%) + conteudo (40%) em desktop
- Imagem com cantos arredondados, sombra, e leve overlay decorativo
- Titulo "Empoderar e Criar Oportunidades" com estilo gradient-text
- Subtitulo em destaque
- Paragrafo descritivo
- Lista de 3 pontos com icones (GraduationCap, Apple, Users)
- Paragrafo final sobre areas de formacao
- Animacoes de scroll (useScrollAnimation)
- Totalmente bilingue com `t()` keys

#### 3. Adicionar traducoes
**Ficheiro:** `src/contexts/LanguageContext.tsx`

Novas chaves (~12):
- `impact.badge` - "Historia de Destaque" / "Featured Story"
- `impact.title` - "Empoderar e Criar Oportunidades" / "Empowering Through Opportunities"
- `impact.subtitle` - subtitulo PT/EN
- `impact.description` - paragrafo principal PT/EN
- `impact.point1` - "Bolsas de formacao tecnica" / "Technical training scholarships"
- `impact.point2` - "Apoio alimentar solidario" / "Solidarity food support"
- `impact.point3` - "Ligacao a redes de oportunidades e mentoria" / "Connection to opportunity networks and mentoring"
- `impact.closing` - paragrafo final sobre areas de formacao PT/EN
- `impact.location` - "Em Maputo..." PT/EN

#### 4. Integrar na homepage
**Ficheiro:** `src/pages/Index.tsx`

- Importar `ImpactStorySection`
- Colocar entre `StatisticsSection` e `PurposeSection`

### Ficheiros a criar/modificar
- **Criar:** `src/components/home/ImpactStorySection.tsx`
- **Copiar:** imagem para `src/assets/impact-story.jpg`
- **Modificar:** `src/contexts/LanguageContext.tsx` (adicionar ~12 chaves)
- **Modificar:** `src/pages/Index.tsx` (adicionar import e componente)

