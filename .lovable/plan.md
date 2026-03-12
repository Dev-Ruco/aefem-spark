

## Plano: Header Responsivo + Hero Institucional + Auditoria Completa

### Diagnóstico do Problema do Header

**Causa raiz do overflow**: O header usa a classe `container` do Tailwind que tem `padding: 2rem` (32px por lado) configurado em `tailwind.config.ts`, **mais** um `px-4` adicional (16px por lado). Isto significa **48px de padding por lado** = 96px consumidos antes de qualquer conteúdo.

Em 1024px (breakpoint `lg` onde a nav desktop aparece):
- Espaço útil: ~928px (após padding do container + px-4)
- Logo + texto "AEFEM": ~180px
- Language selector + botão CTA: ~200px
- Restam ~548px para **8 links** com `gap-8` (32px entre cada = 7×32px = 224px de espaçamento)
- Cada link precisa ~40-60px de texto → 8×50px = 400px
- Total necessário: 624px > 548px disponíveis → **overflow**

**Solução estrutural**:
1. Remover "Tornar-se Membro" do array de links (7 links em vez de 8)
2. Substituir `container mx-auto px-4` por `w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8` — elimina o padding duplo
3. Usar gaps responsivos: `gap-3 lg:gap-4 xl:gap-6`
4. Fonte compacta: `text-xs lg:text-[13px] xl:text-sm`
5. Botão CTA mais compacto em `lg`: `text-sm px-4 xl:px-6`

### Alterações por Ficheiro

#### 1. `src/components/layout/Header.tsx`

**Nav links** — remover linha 18 (`/tornar-se-membro`):
```
const getNavLinks = (t) => [
  { href: '/', label: t('nav.home') },
  { href: '/sobre', label: t('nav.about') },
  { href: '/projectos', label: t('nav.projects') },
  { href: '/noticias', label: t('nav.news') },
  { href: '/publicacoes', label: t('nav.publications') },
  { href: '/galeria', label: t('nav.gallery') },
  { href: '/contacto', label: t('nav.contact') },
];
```

**Container** — linha 36: substituir `container mx-auto px-4` por `w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8`

**Desktop nav** — linha 56: `gap-8` → `gap-3 lg:gap-4 xl:gap-6`

**Link font** — linha 62: `text-sm` → `text-xs lg:text-[13px] xl:text-sm`

**Logo img** — linha 43: `h-12` → `h-10 lg:h-11 xl:h-12` (escala com viewport)

**Logo text** — linha 45: `hidden sm:block` → `hidden xl:block` (esconde texto do logo em ecrãs apertados, mostra só a partir de xl)

**CTA button** — adicionar classes responsivas: `text-sm px-4 xl:px-6`

**Mobile menu** — remover o link "Tornar-se Membro" duplicado do menu mobile (linhas 111-123 já listam todos os navLinks, e o botão CTA no final já cobre a acção)

#### 2. `src/components/home/HeroSlider.tsx`

**Área esquerda do slide** — linha 163:
- `bg-background` → `gradient-primary`
- Diagonal edge (linha 256): `bg-background` → cor sólida `bg-[hsl(288,55%,35%)]` (roxo do fim do gradiente, para transição suave)

**Título** — linha 186: `text-foreground` → `text-white`

**Badge categoria** — linha 168-180: adicionar classes `bg-white/15 text-white border-white/20`

**Data** — linha 211: `text-muted-foreground` → `text-white/70`

**Calendar icon** — herda a cor do parent (`text-white/70`)

**Link "Ler Mais"** — linha 220: `text-primary` → `text-white font-bold hover:text-white/80`

**Progress dots**:
- Dot activo (linha 237): `bg-primary/20` → `bg-white/25`
- Dot fill animado (linha 244): `bg-primary` → `bg-white`
- Dots inactivos (linha 238): `bg-muted-foreground/20 hover:bg-muted-foreground/40` → `bg-white/20 hover:bg-white/40`

**Seta prev** — linha 287: ajustar para `bg-white/15 text-white hover:bg-white/25` (está sobre fundo magenta)

**Loading skeleton** — linha 83: `bg-background` → `gradient-primary`, placeholders: `bg-muted` → `bg-white/20`

**Fallback estático** — manter como está (gradiente institucional próprio)

### Breakpoints Validados

| Largura | Header | Hero |
|---------|--------|------|
| 1440px | 7 links com gap-6, logo com texto, CTA com padding generoso | Split 40/60, título xl:text-5xl |
| 1366px | 7 links com gap-5, logo com texto, tudo visível | Idem |
| 1280px | 7 links com gap-4, logo com texto (xl:block), CTA compacto | Idem |
| 1024px | 7 links com gap-3, logo sem texto, font 13px, CTA text-sm | Idem, título lg:text-4xl |
| 768px | Menu hamburger, nav colapsada | Flex-col, imagem em cima |
| 430/390px | Menu hamburger, botão CTA no menu | Imagem 250px, título 2xl |

### Ficheiros a Modificar

| Ficheiro | Acção |
|----------|-------|
| `src/components/layout/Header.tsx` | Remover link redundante, corrigir container, gaps e fontes responsivas |
| `src/components/home/HeroSlider.tsx` | Fundo magenta, texto branco, dots brancos, seta adaptada |

