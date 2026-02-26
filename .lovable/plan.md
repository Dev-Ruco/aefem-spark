

## Plano: Reestruturar Header e Hero da Homepage AEFEM

### Resumo

Duas alteracoes principais: (1) Header sempre com fundo branco e estilo institucional, (2) Hero transformado numa montra de actividades recentes com linguagem de ONG em vez de portal de noticias.

---

### 1. Header - Fundo Branco Permanente

**Ficheiro:** `src/components/layout/Header.tsx`

Alteracoes:
- Remover a logica condicional `isScrolled ? ... : 'bg-transparent'`
- Header SEMPRE com `bg-white shadow-sm` (ou `bg-background`)
- Manter `fixed top-0 z-50`
- Padding consistente (`py-3`) em todos os estados
- Remover o hook `useEffect` de scroll e o estado `isScrolled` (ja nao sao necessarios)
- Estilo limpo e sobrio: sem gradientes no header

---

### 2. Hero - Montra Institucional de Actividades

**Ficheiro:** `src/components/home/HeroSlider.tsx`

Alteracoes conceptuais:
- Badge muda de "Destaque" para **"Actividades Recentes"** / "AEFEM em Accao"
- Remover `is_featured` filter - carregar os **ultimos artigos publicados** (ordenados por data)
- Aumentar limit de 3 para **5** slides
- Remover linguagem de "noticias" (sem "Ler mais" no estilo jornalistico)
- CTA muda para **"Saber Mais"** ou **"Ver Actividade"**
- Micro-copy institucional acima do titulo: "O nosso trabalho no terreno"
- Overlay mais subtil e com gradiente institucional (manter legibilidade)
- Pause no hover (adicionar `onMouseEnter`/`onMouseLeave` para pausar auto-scroll)
- Respeitar `prefers-reduced-motion` (desactivar auto-scroll e transicoes)
- Lazy loading na imagem de fundo

Alteracoes no fallback (sem artigos):
- Manter o hero estatico actual como fallback
- Ajustar `pt-24` para `pt-20` dado o novo header mais compacto

---

### 3. Traducoes

**Ficheiro:** `src/contexts/LanguageContext.tsx`

Novas chaves:
- `hero.activities_label` → PT: "Actividades Recentes" / EN: "Recent Activities"
- `hero.view_activity` → PT: "Ver Actividade" / EN: "View Activity"
- `hero.our_work` → PT: "O nosso trabalho no terreno" / EN: "Our work in the field"

---

### Ficheiros a Modificar

| Ficheiro | Alteracao |
|----------|-----------|
| `src/components/layout/Header.tsx` | Fundo branco permanente, remover logica de scroll |
| `src/components/home/HeroSlider.tsx` | Linguagem institucional, carregar ultimos artigos, pause on hover, a11y |
| `src/contexts/LanguageContext.tsx` | Novas traducoes |

---

### Resultado Final

- Header branco, estavel e institucional em todos os contextos
- Hero como montra viva das actividades reais da AEFEM
- Tom de organizacao da sociedade civil, nao de orgao de comunicacao
- Acessibilidade e performance respeitadas

