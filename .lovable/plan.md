

## Plano: Hero Mobile Full-Screen Slides

### Problema
O hero mobile actual usa cards com margens laterais e fundo claro — não preenche o ecrã. O utilizador quer um hero que ocupe toda a largura, com a imagem a preencher o painel e o título/metadata sobre um bloco de cor (estilo do desktop adaptado).

### Nova estrutura mobile

```text
┌─────────────────────────────────┐
│                                 │
│      IMAGEM FULL-WIDTH          │
│      (preenche ~60% altura)     │
│      com gradient overlay       │
│      [CATEGORIA badge]          │
│                                 │
├─────────────────────────────────┤
│  ████ BLOCO GRADIENT-PRIMARY ███│
│  Título da Publicação           │
│  (line-clamp-2, branco)         │
│  📅 Data       Ler Mais →      │
│  ● ● ● ● ●  (dots)             │
│  ███████████████████████████████│
└─────────────────────────────────┘
```

### Alterações em `HeroSlider.tsx` — componente `MobileHeroCards`

1. **Remover o estilo card** — eliminar `rounded-2xl`, `shadow-brand-md`, `bg-card`, margens laterais `px-4`, `gap-4`, e `flex-[0_0_85%]`
2. **Full-width slides** — cada slide ocupa `flex-[0_0_100%]`, sem gap entre slides
3. **Secção full-bleed** — remover `pt-4 pb-6 bg-secondary/30`, manter apenas `mt-[72px]`
4. **Imagem full-width** — manter `aspect-[16/10]` ou usar altura fixa (`h-[55vh]`) para maior impacto
5. **Bloco de texto com gradient-primary** — substituir o `p-4 bg-card` por um bloco com `gradient-primary` (magenta→roxo), texto branco, padding generoso
6. **Mover dots para dentro do bloco colorido** — ficam integrados no painel
7. **Embla config** — mudar `align: 'center'` para `align: 'start'`, manter `loop: true`
8. **Auto-scroll e swipe** — manter comportamento actual

### Ficheiro a alterar
- `src/components/home/HeroSlider.tsx` — apenas o componente `MobileHeroCards` (linhas 39-145)
- Desktop inalterado

