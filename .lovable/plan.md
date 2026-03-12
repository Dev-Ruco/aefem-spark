

## Situação actual

Todas as canonical tags, titles e meta descriptions já estão implementadas nas 4 páginas (AboutPage, ProjectsPage, NewsPage, ContactPage). A única tarefa pendente é a criação da imagem OG.

## Plano: Criar placeholder OG image

### Abordagem
Não é possível gerar ficheiros binários (JPG) directamente no código. Existem duas alternativas:

**Opção A — SVG placeholder** (implementável agora)
Criar `public/og-image.svg` como placeholder com as cores da AEFEM, o nome "AEFEM" e o texto "Associação do Empoderamento Feminino de Moçambique" em dimensões 1200x630. Actualizar as referências em `Index.tsx` e `seo.ts` para apontar para `.svg`.

**Opção B — Imagem real** (recomendado)
Tu carregas manualmente um ficheiro `og-image.jpg` (1200x630px) criado no Canva ou similar, com o logo real da AEFEM. As referências no código já apontam para `https://www.aefem.org.mz/og-image.jpg`.

### Recomendação
A Opção A dá-te um placeholder funcional imediatamente. A Opção B é o ideal para redes sociais (Facebook/LinkedIn preferem JPG/PNG). Posso implementar a Opção A agora e substituís depois pelo JPG real.

### Alterações (Opção A)
1. **Criar** `public/og-image.svg` — imagem 1200x630 com fundo gradiente nas cores do site, texto "AEFEM" e subtítulo
2. **Editar** `src/pages/Index.tsx` — mudar `og-image.jpg` → `og-image.svg`
3. **Editar** `src/config/seo.ts` — mudar `og-image.jpg` → `og-image.svg`

