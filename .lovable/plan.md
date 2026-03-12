

## Plano: Scroll-to-Top Global + Artigos Relacionados

### Problema 1: Páginas abrem a partir do fundo
Não existe um componente `ScrollToTop` — ao navegar entre rotas, o scroll mantém a posição anterior.

### Solução
Criar `src/components/ScrollToTop.tsx` que usa `useLocation()` + `useEffect` para chamar `window.scrollTo(0, 0)` em cada mudança de rota. Inserir dentro do `<BrowserRouter>` em `App.tsx`.

### Problema 2: Sem artigos relacionados no final do artigo
O leitor termina o artigo e não tem sugestões para continuar a ler.

### Solução
Adicionar uma secção "Artigos Relacionados" no final de `ArticlePage.tsx`:
- Buscar até 6 artigos da mesma categoria (excluindo o actual); se não houver suficientes, completar com artigos recentes
- Apresentar em carrossel horizontal com auto-scroll (Embla Carousel, já instalado)
- Cards com imagem, categoria, data e título — mesmo estilo do `NewsSection`
- Links apontam para `/noticias/:slug`

### Ficheiros a alterar/criar

1. **`src/components/ScrollToTop.tsx`** (novo) — componente que faz scroll to top em cada navegação
2. **`src/App.tsx`** — adicionar `<ScrollToTop />` dentro do `<BrowserRouter>`
3. **`src/pages/ArticlePage.tsx`** — adicionar secção de artigos relacionados com carrossel auto-scroll após o corpo do artigo

