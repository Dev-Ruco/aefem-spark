

## Auditoria Completa: Navegação, Rotas e Layout

### Parte 1: Problemas de Navegação e Rotas Identificados

#### Problema Critico 1: Links de artigos apontam para rota inexistente
- **HeroSlider.tsx (linha 198):** `<Link to={/noticias/${article.slug}}>` — rota **inexistente**
- **ActivitiesSection.tsx (linha 118):** `<Link to={/noticias/${article.slug}}>` — rota **inexistente**
- **NewsPage.tsx (linha 195):** `<Link to={/noticias/${article.slug}}>` — rota **inexistente**
- **Rota real no App.tsx:** `/artigo/:slug` (não `/noticias/:slug`)
- **Resultado:** Todos os links de artigos geram 404

**Correcao:** Alterar todos os links para `/artigo/${article.slug}` OU adicionar a rota `/noticias/:slug` no App.tsx. A melhor opcao e adicionar uma segunda rota no App.tsx para `/noticias/:slug` que aponte para ArticlePage, mantendo compatibilidade.

#### Problema 2: Footer — Link de "Privacidade" aponta para `#`
- **Footer.tsx (linha 190):** `<a href="#">` — link morto

**Correcao:** Criar uma pagina simples de Politica de Privacidade ou remover o link.

#### Problema 3: Footer — Redes sociais apontam para `#`
- **Footer.tsx:** Todos os `socialLinks` têm `href: '#'`

**Correcao:** Manter os links mas remover o `href="#"` e usar `cursor-default` ou abrir numa nova aba quando URLs reais forem adicionadas via admin.

#### Problema 4: Botoes sem destino na pagina de Doacoes
- **DonationsPage.tsx (linha 121):** Botao "Voluntariado" sem link — nao navega para lado nenhum
- **DonationsPage.tsx (linha 134):** Botao "Parcerias" sem link — nao navega para lado nenhum
- **DonationsPage.tsx (linha 152):** Botao CTA final "Doar Agora" sem link — nao navega para lado nenhum

**Correcao:** Ligar Voluntariado e Parcerias ao `/contacto`, e o CTA final deve fazer scroll para a seccao de metodos de doacao.

#### Problema 5: PartnersSection — Link com `href: '#'` quando parceiro nao tem website
- **PartnersSection.tsx (linha 59):** `href={partner.website_url || '#'}`

**Correcao:** Quando nao ha URL, usar `<span>` em vez de `<a>`.

#### Problema 6: Vercel config para SPA routing
- **vercel.json** ja foi corrigido no ultimo diff com `{ "handle": "filesystem" }` — OK
- **public/_redirects** existe para Netlify — OK

---

### Parte 2: Melhorias de Layout e Espacamento

#### 2.1 Container e margens laterais
O site ja usa `container mx-auto px-4` na maioria das seccoes. O Tailwind `container` tem `max-width: 1280px` por defeito, o que e adequado. Algumas seccoes usam `px-4` apenas — vou padronizar para `px-4 sm:px-6 lg:px-8` em todas.

#### 2.2 Espacamento vertical entre seccoes
Actualmente o `py-20 md:py-28` e usado em muitas seccoes, o que e bom. Vou padronizar:
- Seccoes normais: `py-20 md:py-28`
- Sub-seccoes internas (hero de pagina): `pt-32 pb-16` (ja usado)

#### 2.3 Mobile — conteudo encosta as bordas
Vou adicionar padding lateral mais generoso (`px-5 sm:px-6 lg:px-8`) para evitar que conteudo encoste as bordas em mobile.

#### 2.4 App.css — código morto
O ficheiro `src/App.css` contem estilos Vite default que nao sao usados. Sera limpo.

---

### Ficheiros a Modificar

| Ficheiro | Alteracoes |
|----------|-----------|
| `src/App.tsx` | Adicionar rota `/noticias/:slug` para ArticlePage |
| `src/components/home/HeroSlider.tsx` | Corrigir link de `/noticias/` para `/artigo/` |
| `src/components/home/ActivitiesSection.tsx` | Corrigir link de `/noticias/` para `/artigo/` |
| `src/pages/NewsPage.tsx` | Corrigir link de `/noticias/` para `/artigo/` |
| `src/components/layout/Footer.tsx` | Remover link `#` de privacidade, corrigir redes sociais |
| `src/pages/DonationsPage.tsx` | Ligar botoes a destinos reais (`/contacto`) |
| `src/components/home/PartnersSection.tsx` | Nao usar `<a>` quando parceiro nao tem URL |
| `src/App.css` | Limpar estilos Vite nao usados |
| `src/components/home/AboutSection.tsx` | Padronizar padding lateral |
| `src/components/home/ImpactStorySection.tsx` | Padronizar padding lateral |
| `src/components/home/PillarsSection.tsx` | Padronizar padding lateral |
| `src/components/home/StatisticsSection.tsx` | Padronizar padding lateral |
| `src/components/home/VideosSection.tsx` | Padronizar padding lateral |
| `src/pages/DonationsPage.tsx` | Padronizar padding lateral |
| `src/pages/ContactPage.tsx` | Padronizar padding lateral |
| `src/pages/NewsPage.tsx` | Padronizar padding lateral |

### Ficheiros a Criar

| Ficheiro | Descricao |
|----------|-----------|
| `src/pages/PrivacyPolicyPage.tsx` | Pagina simples de politica de privacidade |

### Sequencia

1. Corrigir todas as rotas de artigos (bug critico)
2. Adicionar rota no App.tsx + pagina de privacidade
3. Corrigir botoes sem destino (Doacoes, Footer, Partners)
4. Padronizar padding lateral em todas as seccoes
5. Limpar App.css

