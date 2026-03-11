

## Correcao da Formatacao de Artigos

### Problema
O plugin `@tailwindcss/typography` esta instalado como dependencia mas **nao esta registado** no array `plugins` do `tailwind.config.ts`. Isto significa que todas as classes `prose` usadas no `ArticlePage.tsx` (como `prose-lg`, `prose-p:mb-6`, `prose-p:leading-relaxed`, etc.) **nao produzem qualquer CSS**. O resultado e texto sem espacamentos, paragrafos colados uns aos outros.

### Solucao

**1. `tailwind.config.ts`** — Adicionar o plugin de typography:
```ts
plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
```

**2. `src/pages/ArticlePage.tsx`** — Reforcar os estilos prose para garantir formatacao editorial premium:
- Manter as classes prose existentes
- Adicionar `prose-blockquote:border-primary` e `prose-strong:text-foreground` para citacoes e negrito
- Adicionar `prose-li:text-muted-foreground` para listas

**3. `src/index.css`** — Adicionar overrides opcionais para o prose, garantindo que os paragrafos `<p>` dentro de `.prose` tenham margem inferior adequada e que paragrafos vazios (`<p></p>` gerados pelo TipTap) criem espacamento visual.

### Resultado
Os artigos passarao a ter paragrafos bem espacados, texto legivel, citacoes destacadas e formatacao editorial profissional — sem alterar o conteudo existente na base de dados.

