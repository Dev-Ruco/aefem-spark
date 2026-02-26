

## Plano: Ajustar Hero Section - Altura e Fotos Completas

### Problema Actual
1. O hero ocupa `min-h-screen` (100% da altura do ecra), forcando-o a encher toda a tela
2. As imagens usam `bg-cover bg-center`, o que corta cabecas e partes importantes das fotos
3. O header fixo sobrepoe-se ao topo das imagens

### Alteracoes

**Ficheiro:** `src/components/home/HeroSlider.tsx`

#### 1. Reduzir altura do Hero
- Mudar `min-h-screen` para uma altura fixa mais curta: `h-[70vh]` ou `min-h-[500px] max-h-[75vh]`
- Isto deixa espaco branco em baixo, permitindo ver a proxima seccao
- Aplicar tanto no slider activo como no fallback estatico

#### 2. Fotos completas sem cortar cabecas
- Mudar `bg-cover bg-center` para `bg-contain bg-center` nao funciona bem para hero
- Melhor abordagem: usar `bg-cover bg-top` em vez de `bg-center` - isto prioriza o topo da foto (onde estao as cabecas)
- Adicionar `mt-[72px]` ou `pt-[72px]` para compensar o header fixo, garantindo que a foto comeca abaixo do header

#### 3. Compensar header fixo
- Adicionar `mt-[72px]` na section principal para que o conteudo comece abaixo do header
- Ajustar o padding interno do conteudo de `pt-20` para `pt-8` ja que o margin-top compensa

### Resumo das alteracoes CSS

| De | Para | Razao |
|----|------|-------|
| `min-h-screen` | `min-h-[500px] h-[70vh]` | Hero nao enche toda a tela |
| `bg-cover bg-center` | `bg-cover bg-top` | Prioriza topo da foto (cabecas) |
| sem margin-top | `mt-[72px]` | Foto nao fica escondida pelo header |
| `pt-20` | `pt-8` | Ajuste de padding interno |

### Ficheiro a modificar
- `src/components/home/HeroSlider.tsx`
