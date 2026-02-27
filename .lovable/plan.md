
## Plano: Corrigir Sistema de Traducao Bilingue (PT/EN)

### Problema Identificado

O site tem um sistema de traducao (`useLanguage` + `t()`) mas a maioria dos componentes tem textos fixos em portugues, sem usar o sistema de traducao. Alem disso, o editor de artigos nao permite inserir versoes em ingles dos conteudos.

### Ambito das Alteracoes

#### 1. Adicionar campos EN no Editor de Artigos
**Ficheiro:** `src/pages/admin/ArticleEditor.tsx`

- Adicionar campos `title_en`, `excerpt_en` e `content_en` ao formulario
- A base de dados ja suporta estas colunas na tabela `articles`
- Adicionar uma seccao "Traducao (Ingles)" com os 3 campos
- Guardar os valores na base de dados ao submeter

#### 2. Traduzir ArticlePage (pagina de artigo individual)
**Ficheiro:** `src/pages/ArticlePage.tsx`

- Importar `useLanguage`
- Buscar `title_en`, `content_en`, `excerpt_en` da base de dados
- Mostrar versao EN quando idioma e ingles
- Traduzir textos fixos ("Artigo nao encontrado", "Voltar as Noticias", "Partilhar", formato de data)

#### 3. Traduzir NewsPage (pagina de noticias)
**Ficheiro:** `src/pages/NewsPage.tsx`

- Importar `useLanguage`
- Buscar `title_en`, `excerpt_en`
- Mostrar versao EN dos artigos
- Traduzir textos fixos ("Noticias", "Pesquisar", "Todas", "Ler mais", "Nenhuma noticia")

#### 4. Traduzir NewsSection (seccao homepage)
**Ficheiro:** `src/components/home/NewsSection.tsx`

- Importar `useLanguage`
- Buscar `title_en`, `excerpt_en`
- Traduzir textos fixos

#### 5. Traduzir Footer
**Ficheiro:** `src/components/layout/Footer.tsx`

- Importar `useLanguage` e usar `t()` para todos os textos
- Traduzir links rapidos, contactos, newsletter, etc.

#### 6. Traduzir paginas estaticas
**Ficheiros:**
- `src/components/home/AboutSection.tsx`
- `src/components/home/PurposeSection.tsx`
- `src/components/home/PillarsSection.tsx`
- `src/components/home/HowWeWorkSection.tsx`
- `src/components/home/SupportSection.tsx`
- `src/components/home/PartnersSection.tsx`
- `src/pages/AboutPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/pages/DonationsPage.tsx`

Cada ficheiro: importar `useLanguage`, substituir textos hardcoded por `t('chave')`

#### 7. Adicionar todas as traducoes em falta
**Ficheiro:** `src/contexts/LanguageContext.tsx`

Adicionar chaves para:
- About section (~10 chaves)
- Purpose section (~8 chaves)
- Pillars section (~12 chaves)
- How We Work section (~10 chaves)
- Support section (~10 chaves)
- Partners section (~5 chaves)
- News section (~5 chaves)
- Footer (~15 chaves)
- Contact page (~10 chaves)
- Donations page (~20 chaves)
- Article page (~5 chaves)

### Prioridade de Implementacao

1. **Traducoes no LanguageContext** (base para tudo)
2. **Editor de artigos** (permitir inserir conteudo EN)
3. **ArticlePage + NewsPage + NewsSection** (mostrar conteudo EN dos artigos)
4. **Footer** (visivel em todas as paginas)
5. **Restantes seccoes e paginas**

### Resultado Esperado

- Todas as paginas respondem a troca de idioma PT/EN
- Artigos podem ser criados com versao inglesa
- Quando o idioma e EN mas nao ha traducao, mostra a versao PT como fallback
- ~150 novas chaves de traducao
