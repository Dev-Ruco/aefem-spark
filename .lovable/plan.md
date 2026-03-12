# Plano de Acção Completo — AEFEM SEO

Tudo organizado por ordem de execução. Faz do topo para baixo.

---

## 🔴 FASE 1 — Crítico (fazer hoje)

### 1. `public/robots.txt`

Substitui o conteúdo actual por:

```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://www.aefem.org.mz/sitemap.xml

```

---

### 2. `public/sitemap.xml`

Cria este ficheiro do zero:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.aefem.org.mz/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.aefem.org.mz/sobre</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.aefem.org.mz/noticias</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.aefem.org.mz/projectos</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.aefem.org.mz/publicacoes</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.aefem.org.mz/galeria</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.aefem.org.mz/contacto</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://www.aefem.org.mz/privacidade</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>

```

---

### 3. `src/config/seo.ts` — criar ficheiro novo

```typescript
export const SEO = {
  siteUrl: 'https://www.aefem.org.mz',
  siteName: 'AEFEM',
  locale: 'pt_MZ',
  defaultTitle: 'Empoderamento Feminino em Moçambique | AEFEM',
  defaultDescription: 'A AEFEM promove o empoderamento feminino em Moçambique através de programas de capacitação económica, liderança e direitos das mulheres.',
  defaultImage: 'https://www.aefem.org.mz/og-image.jpg',
  facebookUrl: '', // preenche com URL real
  instagramUrl: '', // preenches com URL real
};

```

---

### 4. `index.html` — substituir bloco de fonts e adicionar meta base

Encontra o `<head>` e substitui qualquer `@import` de Google Fonts por isto:

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#ffffff" />

<!-- Google Fonts — não bloqueante -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap" />

<!-- Fallback para crawlers sem JS -->
<noscript>
  <p>AEFEM — Associação do Empoderamento Feminino de Moçambique. 
  Promovemos o empoderamento feminino através de programas de 
  capacitação económica, liderança e direitos das mulheres em Moçambique.</p>
</noscript>

```

> Substitui `YOUR_FONT` pelo nome da fonte que o site já usa.

---

### 5. `src/pages/Index.tsx` — Schema + canonical + title

Adiciona dentro do `<Helmet>`:

```tsx
<Helmet>
  <title>Empoderamento Feminino em Moçambique | AEFEM</title>
  <meta name="description" content="A AEFEM promove o empoderamento feminino em Moçambique através de programas de capacitação económica, liderança e direitos das mulheres." />
  <link rel="canonical" href="https://www.aefem.org.mz/" />

  {/* Open Graph */}
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.aefem.org.mz/" />
  <meta property="og:title" content="Empoderamento Feminino em Moçambique | AEFEM" />
  <meta property="og:description" content="A AEFEM promove o empoderamento feminino em Moçambique." />
  <meta property="og:image" content="https://www.aefem.org.mz/og-image.jpg" />
  <meta property="og:site_name" content="AEFEM" />
  <meta property="og:locale" content="pt_MZ" />

  {/* Schema.org */}
  <script type="application/ld+json">{`
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "NGO",
          "@id": "https://www.aefem.org.mz/#organization",
          "name": "AEFEM",
          "alternateName": "Associação do Empoderamento Feminino de Moçambique",
          "url": "https://www.aefem.org.mz",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.aefem.org.mz/logo.png"
          },
          "areaServed": "Mozambique",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Maputo",
            "addressCountry": "MZ"
          },
          "sameAs": [
            "https://www.facebook.com/AEFEM",
            "https://www.instagram.com/AEFEM"
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://www.aefem.org.mz/#website",
          "url": "https://www.aefem.org.mz",
          "name": "AEFEM",
          "publisher": {
            "@id": "https://www.aefem.org.mz/#organization"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.aefem.org.mz/noticias?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        }
      ]
    }
  `}</script>
</Helmet>

```

---

### 6. Páginas internas — canonical + meta em cada uma

Padrão a aplicar em **cada página** (`AboutPage`, `ContactPage`, `NewsPage`, etc.):

`src/pages/AboutPage.tsx`

```tsx
<Helmet>
  <title>Sobre a AEFEM | Empoderamento Feminino em Moçambique</title>
  <meta name="description" content="Conheça a AEFEM, a nossa missão, visão e equipa dedicada ao empoderamento feminino em Moçambique." />
  <link rel="canonical" href="https://www.aefem.org.mz/sobre" />
  <meta property="og:url" content="https://www.aefem.org.mz/sobre" />
  <meta property="og:title" content="Sobre a AEFEM | Empoderamento Feminino em Moçambique" />
</Helmet>

```

`src/pages/NewsPage.tsx`

```tsx
<Helmet>
  <title>Notícias | AEFEM</title>
  <meta name="description" content="Acompanha as últimas notícias e publicações da AEFEM sobre empoderamento feminino em Moçambique." />
  <link rel="canonical" href="https://www.aefem.org.mz/noticias" />
  <meta property="og:url" content="https://www.aefem.org.mz/noticias" />
</Helmet>

```

`src/pages/ProjectsPage.tsx`

```tsx
<Helmet>
  <title>Projectos | AEFEM</title>
  <meta name="description" content="Descobre os projectos da AEFEM de capacitação económica, liderança feminina e direitos das mulheres em Moçambique." />
  <link rel="canonical" href="https://www.aefem.org.mz/projectos" />
  <meta property="og:url" content="https://www.aefem.org.mz/projectos" />
</Helmet>

```

`src/pages/PublicationsPage.tsx`

```tsx
<Helmet>
  <title>Publicações | AEFEM</title>
  <meta name="description" content="Relatórios, estudos e publicações da AEFEM sobre empoderamento feminino e género em Moçambique." />
  <link rel="canonical" href="https://www.aefem.org.mz/publicacoes" />
  <meta property="og:url" content="https://www.aefem.org.mz/publicacoes" />
</Helmet>

```

`src/pages/ContactPage.tsx`

```tsx
<Helmet>
  <title>Contacto | AEFEM</title>
  <meta name="description" content="Entre em contacto com a AEFEM em Maputo, Moçambique." />
  <link rel="canonical" href="https://www.aefem.org.mz/contacto" />
  <meta property="og:url" content="https://www.aefem.org.mz/contacto" />
</Helmet>

```

---

### 7. `src/pages/ArticlePage.tsx` — Schema de artigo

```tsx
// Dentro do componente, após carregar o artigo do Supabase:
<Helmet>
  <title>{`${article.title} | AEFEM`}</title>
  <meta name="description" content={article.excerpt || article.title} />
  <link rel="canonical" href={`https://www.aefem.org.mz/noticias/${article.slug}`} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={`https://www.aefem.org.mz/noticias/${article.slug}`} />
  <meta property="og:title" content={article.title} />
  <meta property="og:image" content={article.image_url} />
  <script type="application/ld+json">{`
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${article.title}",
      "image": "${article.image_url}",
      "datePublished": "${article.created_at}",
      "publisher": {
        "@type": "NGO",
        "name": "AEFEM",
        "url": "https://www.aefem.org.mz"
      }
    }
  `}</script>
</Helmet>

```

---

## 🟡 FASE 2 — Alto impacto (esta semana)

### 8. `src/components/home/HeroSlider.tsx` — H1 estático

Localiza o fallback do slider e garante que existe sempre um H1 com keyword:

```tsx
// Quando não há artigos do Supabase (fallback):
<h1 className="...">
  Empoderamento Feminino em Moçambique
</h1>

```

---

### 9. Imagens — adicionar width, height, alt

Em `AboutSection.tsx`, `ImpactStorySection.tsx` e qualquer `<img>` estática:

```tsx
// Antes:
<img src="/about-group.jpg" />

// Depois:
<img 
  src="/about-group.jpg" 
  alt="Mulheres da AEFEM em sessão de capacitação em Maputo"
  width={800} 
  height={600}
  loading="lazy"
/>

```

---

### 10. `src/components/layout/Footer.tsx` — limpar dados falsos

Localiza e substitui:

```tsx
// Remover ou substituir:
"+258 84 000 0000"  →  contacto real ou remover

// Remover links de redes sociais com href vazio:
// Twitter e LinkedIn — remover do array se não tiverem URL real

```

---

