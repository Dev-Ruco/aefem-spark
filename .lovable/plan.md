

## Plano: Mover "Sobre Nós / Quem Somos" para cima da foto no mobile

### Problema
No mobile (1 coluna), a secção mostra primeiro a foto e depois o título "Sobre Nós / Quem Somos" — o utilizador quer o título acima da foto para coerência visual ao descer na página.

### Solução
Em `AboutSection.tsx`, adicionar um `SectionHeader` duplicado visível apenas em mobile (`lg:hidden`) antes da imagem, e esconder o `SectionHeader` actual em mobile (`hidden lg:block`).

### Alterações em `src/components/home/AboutSection.tsx`

1. **Antes do grid**, adicionar:
   ```jsx
   <SectionHeader subtitle={...} title={...} align="left" className="mb-8 lg:hidden" />
   ```

2. **No SectionHeader existente** (linha 50), adicionar `className="mb-8 hidden lg:block"` para que só apareça em desktop (ao lado do texto).

### Resultado
- **Mobile**: Título → Foto → Texto
- **Desktop**: Layout lado-a-lado inalterado (foto esquerda, título+texto direita)

