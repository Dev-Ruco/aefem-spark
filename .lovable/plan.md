

## Plano: Logo do Header + Coerência de Cores no Hero

### 1. Header — Novo logótipo e texto

**Problema**: O logo actual (`logo-aefem.png`) é menos detalhado. O texto lateral diz apenas "AEFEM / Empoderamento Feminino".

**Solução**:
- Copiar `aefem_otimizado_icon_512x512.png` para `src/assets/`
- Substituir o import do logo no `Header.tsx`
- Alterar o texto lateral para duas linhas:
  - Linha 1: **"Associação do Empoderamento Feminino"** (font-semibold, text-sm)
  - Linha 2: **(AEFEM)** em gradient-text, font-bold

**Ficheiro**: `src/components/layout/Header.tsx` (linhas 8, 38-51)

### 2. Hero — Incoerência de cores na diagonal

**Problema identificado**: A área esquerda do hero usa a classe `gradient-primary` que aplica um gradiente a **135°** (diagonal), mas o recorte diagonal (clip-path, linha 256-261) usa um gradiente inline a **180°** (vertical) com cores ligeiramente diferentes. Esta diferença de ângulo e tonalidade cria uma costura visível — como se houvesse duas camadas sobrepostas com cores que não batem.

**Solução**:
- Remover o `div` do recorte diagonal separado (linhas 256-261)
- Em vez disso, aplicar o recorte diagonal directamente no container esquerdo usando `clip-path` no próprio `div` pai, garantindo que o gradiente é **um só** sem costuras
- O clip-path do container esquerdo passa a ser: `polygon(0 0, 100% 0, 85% 100%, 0 100%)` em desktop, criando a diagonal sem elemento sobreposto
- A largura do painel esquerdo aumenta ligeiramente (`lg:w-[45%]`) para compensar o recorte

**Ficheiro**: `src/components/home/HeroSlider.tsx` (linhas 162, 255-261)

### Ficheiros a modificar

| Ficheiro | Alteração |
|----------|-----------|
| `src/components/layout/Header.tsx` | Novo logo + texto "Associação do Empoderamento Feminino (AEFEM)" |
| `src/components/home/HeroSlider.tsx` | Eliminar div diagonal sobreposto, usar clip-path no container principal |
| Copiar asset | `aefem_otimizado_icon_512x512.png` → `src/assets/` |

