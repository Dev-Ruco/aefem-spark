

## Plano: Hero com imagem à direita + Header simplificado

### 1. Hero — Imagem à direita com sobreposição parcial

**Problema actual**: A imagem cobre todo o slide (`absolute inset-0`), ficando excessivamente cortada. O utilizador quer a imagem apenas no lado direito, estendendo-se ligeiramente para trás da diagonal magenta para evitar áreas brancas.

**Solução**: Voltar a um layout com dois layers posicionados:

```text
┌───────────────────────────────────────────┐
│ GRADIENT (50%)  ╲                         │
│ com clip-path    ╲   IMAGEM (65%)         │
│ diagonal          ╲  (sobrepõe 15%        │
│                    ╲  por trás)            │
└───────────────────────────────────────────┘
```

- **Imagem**: `absolute top-0 bottom-0 right-0 w-[65%]` — posicionada à direita mas larga o suficiente para se estender ~15% por trás do gradiente diagonal. Sem `inset-0`, sem cobrir tudo.
- **Gradiente**: `absolute inset-y-0 left-0 w-[50%]` com `clip-path: polygon(0 0, 100% 0, 75% 100%, 0 100%)` — diagonal suave.
- A sobreposição de 15% garante que não há fundo branco visível entre o gradiente e a imagem.
- Em mobile (< lg): sem clip-path, layout empilhado (gradiente em cima, imagem em baixo).

**Ficheiro**: `src/components/home/HeroSlider.tsx` (linhas 160-180)

### 2. Header — Texto simplificado

- Remover "(AEFEM)" e a segunda linha
- Mostrar apenas: **"Associação do Empoderamento Feminino"** numa linha
- Classes: `text-sm font-bold text-foreground/80`
- Visível a partir de `lg:` (em vez de `xl:`)

**Ficheiro**: `src/components/layout/Header.tsx` (linhas 44-51)

### Ficheiros a modificar

| Ficheiro | Alteração |
|----------|-----------|
| `src/components/home/HeroSlider.tsx` | Imagem `w-[65%] right-0` + gradiente `w-[50%] left-0` com clip-path |
| `src/components/layout/Header.tsx` | Texto simplificado, visível a partir de lg: |

