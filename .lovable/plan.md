## Plano: Redesign Mobile — Header e Hero

### 1. Header Mobile — Proposta

**Problema actual:** No mobile, o nome da associação está escondido (`hidden lg:block`), o logo fica pequeno e solto, e o selector de idioma com o menu hamburger ficam apertados sem hierarquia clara.

**Nova estrutura mobile (< 1024px):**

```text
┌─────────────────────────────────────────┐
│  [Logo 40px] AEFEM    🇵🇹|🇬🇧  [☰]  │
│   ↑ esquerda           ↑ direita        │
└─────────────────────────────────────────┘
```

Alterações em `Header.tsx`:

- Mostrar o nome abreviado "AEFEM" ao lado do logo em todas as resoluções (não apenas `lg:block`). Usar texto pequeno (`text-xs sm:text-sm`) em mobile, e o nome completo apenas em `xl:`.
- Logo: manter `h-10` em mobile com `rounded-full`.
- LanguageSelector: versão compacta em mobile — apenas as bandeiras sem texto (já faz isso parcialmente com `hidden sm:inline`). Reduzir padding para `px-1.5 py-0.5`.
- Menu hamburger: adicionar `rounded-full bg-secondary/50` para dar peso visual coerente, tamanho `h-5 w-5` para o ícone.
- Garantir `px-4` lateral e `py-2.5` vertical no header mobile para boa respiração.
- No menu dropdown mobile: manter o design actual (já está bem com card arredondado e shadow).

**Desktop inalterado:** Todas as alterações condicionadas a breakpoints `< lg`.

---

### 2. Hero Mobile — Proposta (Cards com Carousel)

**Problema actual:** O hero split (magenta esquerda + imagem direita com clip-path) funciona bem em desktop mas em mobile o texto ocupa toda a área, a imagem quase desaparece, e o impacto visual perde-se.

**Nova abordagem:** Manter o layout split para `lg:` (desktop inalterado). Para mobile (`< lg`), renderizar um carousel Embla de cards editoriais.

**Estrutura de cada card mobile:**

```text
┌──────────────────────────────┐
│                              │
│     IMAGEM (60% altura)      │
│     aspect-[16/10]           │
│                              │
├──────────────────────────────┤
│  gradient overlay sutil      │
│  ┌──────────────────────┐    │
│  │ CATEGORIA  •  DATA   │    │
│  │ Título da Publicação │    │
│  │ (line-clamp-2)       │    │
│  │         Ler Mais →   │    │
│  └──────────────────────┘    │
└──────────────────────────────┘
```

- Imagem ocupa a parte superior do card (~60%) com `object-cover`
- Gradiente escuro na base da imagem para proteger texto
- Categoria como badge magenta pequeno
- Título com `line-clamp-2`, font-display bold
- Data discreta
- CTA "Ler Mais" com seta
- Card com `rounded-2xl`, `shadow-brand-md`, margens laterais de `mx-4`
- Dots de paginação abaixo dos cards
- Auto-scroll a cada 5s + swipe manual via Embla

**Alterações em `HeroSlider.tsx`:**

- Importar `useIsMobile` hook
- Renderização condicional: `isMobile ? <MobileHeroCards /> : <DesktopHeroSplit />`
- Desktop: código actual intacto (o bloco split com clip-path)
- Mobile: usar Embla carousel (já instalado) com cards

**Loading skeleton mobile:** Card skeleton em vez do split skeleton.

**Fallback (sem artigos):** Manter o fallback actual mas com padding ajustado para mobile.

---

### 3. Lógica Responsiva


| Breakpoint          | Header                                 | Hero                   |
| ------------------- | -------------------------------------- | ---------------------- |
| < 768px (mobile)    | Logo + "AEFEM" + bandeiras + hamburger | Cards carousel         |
| 768-1023px (tablet) | Igual mobile (menu hamburger)          | Cards carousel         |
| ≥ 1024px (desktop)  | Layout completo actual                 | Split magenta + imagem |


---

### 4. Ficheiros a alterar

1. `**src/components/layout/Header.tsx**` — Mostrar nome abreviado em mobile, refinar espaçamentos e pesos visuais do selector de idioma e hamburger
2. `**src/components/home/HeroSlider.tsx**` — Adicionar renderização condicional mobile com cards Embla carousel, manter desktop intacto
3. `**src/index.css**` — Nenhuma alteração necessária (utilitários existentes são suficientes)

Sem alterações de cores, tipografia base, ou identidade visual.  
  
  
Preciso ajustar o **header do site** para melhorar a leitura e o equilíbrio visual da marca **Associação de Empoderamento Feminino**.

### 1. Versão Desktop

O nome da organização está **demasiado longo numa única linha**.  
Quero que o texto seja **quebrado em duas linhas**, mantendo boa hierarquia tipográfica.

Estrutura desejada:

Associação de  
Empoderamento Feminino

Regras:

- A quebra deve acontecer **depois de “Associação de”**.
- A segunda linha (**Empoderamento Feminino**) deve ter **mais destaque tipográfico**.
- O alinhamento deve ficar **equilibrado ao lado do logótipo**.
- Manter boa distância entre **logótipo e texto**.
- Evitar que o header fique demasiado horizontal.

### 2. Versão Mobile

No **mobile não mostrar o nome completo da organização no header**.

Mostrar apenas:

- **logótipo**
- **menu hamburger**

Objectivo:

- header **mais limpo**
- melhor uso do espaço
- evitar que o topo fique apertado ou desproporcional.

### 3. Ajustes visuais

Verificar também:

- altura do header
- espaçamento lateral
- alinhamento vertical do logótipo
- responsividade entre desktop / tablet / mobile.

O resultado deve parecer **institucional, moderno e equilibrado**, semelhante a sites de organizações internacionais.