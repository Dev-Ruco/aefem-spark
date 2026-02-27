

## Plano: Adicionar foto do grupo AEFEM na secção "Sobre Nós"

### Alteração

Substituir o placeholder com gradiente (linhas 24-31 do `AboutSection.tsx`) pela foto real do grupo AEFEM que foi carregada.

### Passos

#### 1. Copiar a imagem para o projecto
- Copiar `user-uploads://505158538_...jpg` para `src/assets/about-group.jpg`

#### 2. Actualizar o componente AboutSection
**Ficheiro:** `src/components/home/AboutSection.tsx`

- Importar a imagem: `import aboutImage from '@/assets/about-group.jpg'`
- Substituir o `div` com gradiente e texto placeholder por uma tag `<img>` com a foto real
- Manter o aspect-ratio, cantos arredondados, sombra e o card flutuante "+1000"

