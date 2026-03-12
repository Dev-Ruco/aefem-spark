

## Plano: Animação de Carregamento com Símbolo AEFEM

### Conceito
Criar um componente `LoadingSpinner` reutilizável que usa o ícone do logótipo AEFEM (`aefem-icon-optimized.png`) com uma animação suave de pulse + fade. Usar também como splash screen inicial da app.

### Componentes a criar/alterar

1. **`src/components/ui/LoadingSpinner.tsx`** (novo)
   - Exibe o ícone AEFEM centrado com animação pulse-glow + fade-in
   - Anel circular animado (border spin) à volta do ícone, nas cores magenta/roxo da marca
   - Props: `size` (sm/md/lg), `fullScreen` (boolean para overlay de página inteira)
   - Usado em estados de carregamento em todo o site

2. **`src/App.tsx`** — Adicionar um estado de loading inicial (splash screen de ~1s) que mostra o `LoadingSpinner` em fullScreen antes de renderizar as rotas. Transição suave com fade-out.

3. **Substituir spinners genéricos existentes** — Nos ficheiros que usam `<Loader2 className="animate-spin" />` ou divs de loading simples (ArticlePage, GalleryPage, admin pages), substituir pelo novo `LoadingSpinner` para coerência visual.

### Animação
- Ícone AEFEM ao centro com `animate-pulse` suave (escala 0.95→1.05)
- Anel circular à volta com `animate-spin` lento (3s) em gradiente magenta→roxo
- Fundo branco semi-transparente em modo fullScreen
- Fade-out suave ao terminar o carregamento

### Ficheiros a alterar
1. `src/components/ui/LoadingSpinner.tsx` — novo componente
2. `src/App.tsx` — splash screen inicial
3. `src/pages/ArticlePage.tsx` — usar LoadingSpinner
4. `src/pages/GalleryPage.tsx` — usar LoadingSpinner
5. `src/pages/NewsPage.tsx` — usar LoadingSpinner
6. Páginas admin com loading states — usar LoadingSpinner

