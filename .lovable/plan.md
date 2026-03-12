

## Plano: Corrigir Erros de Build (Radix UI + Dependências)

### Diagnóstico

O problema central é que as versões instaladas dos pacotes Radix UI são **mais recentes** do que as declaradas no `package.json`. As versões v2+ do Radix removeram `className`, `children` e `asChild` dos tipos TypeScript (agora usam `data-*` attributes e Slots). O lockfile (`bun.lock`) ficou dessincronizado.

### Estratégia

Em vez de tentar fazer downgrade dos pacotes (que falhou anteriormente), vamos **reescrever os componentes UI** para serem compatíveis com as versões actuais, usando casting de tipos onde necessário. Isto é mais resiliente.

### Alterações

#### 1. Todos os componentes UI com Radix — adicionar cast de props

Ficheiros afectados: `accordion.tsx`, `alert-dialog.tsx`, `avatar.tsx`, `dialog.tsx`, `scroll-area.tsx`, `sheet.tsx`, `slider.tsx`, `tooltip.tsx`

Solução: Substituir `React.ComponentPropsWithoutRef<typeof X>` por `React.ComponentPropsWithoutRef<typeof X> & React.HTMLAttributes<HTMLElement>` para permitir `className` e `children`. Ou mais simples: usar type assertion inline.

Abordagem escolhida — **cast genérico**: Cada componente Radix que recebe `className` passa a usar o tipo explícito `React.HTMLAttributes<HTMLElement>` intersectado, garantindo compatibilidade sem mudar a API.

#### 2. `TooltipTrigger asChild` — 4 infographics

Ficheiros: `AgricultureChart.tsx`, `DigitalDivideChart.tsx`, `EmploymentGapChart.tsx`, `FinancialExclusionChart.tsx`

Solução: Remover `asChild` do `TooltipTrigger` e envolver o conteúdo num `<button>` ou `<span>` nativo.

#### 3. `AdminSidebar.tsx` — `signOut`

Linha 46: `supabase.auth.signOut()` — se o tipo não reconhece, usar: `await (supabase.auth as any).signOut()`

#### 4. `ConfirmDialog.tsx` — props `onClick`, `children` em AlertDialog

Mesma causa que os outros Radix. Corrigido automaticamente quando alert-dialog.tsx for actualizado.

#### 5. `ImageUploader.tsx` — `htmlFor` em Label

Mesma causa. Corrigido quando o componente Label aceitar HTMLAttributes.

#### 6. `App.tsx` — `QueryClient` e `react-helmet-async`

`QueryClient` e `react-helmet-async` estão no `package.json` mas podem não estar instalados. Se o problema persistir após rebuild, remover `HelmetProvider` temporariamente ou usar import dinâmico.

### Ficheiros a modificar

| Ficheiro | Alteração |
|----------|-----------|
| `src/components/ui/accordion.tsx` | Props type cast para aceitar className/children |
| `src/components/ui/alert-dialog.tsx` | Props type cast |
| `src/components/ui/avatar.tsx` | Props type cast |
| `src/components/ui/dialog.tsx` | Props type cast |
| `src/components/ui/scroll-area.tsx` | Props type cast |
| `src/components/ui/sheet.tsx` | Props type cast |
| `src/components/ui/slider.tsx` | Props type cast |
| `src/components/ui/tooltip.tsx` | Props type cast |
| `src/components/ui/label.tsx` | Props type cast para aceitar htmlFor |
| `src/components/home/infographics/*.tsx` (4 ficheiros) | Remover `asChild` do TooltipTrigger |
| `src/components/admin/AdminSidebar.tsx` | Cast `signOut` |
| `src/components/admin/ConfirmDialog.tsx` | Sem alteração directa (resolvido via alert-dialog fix) |

