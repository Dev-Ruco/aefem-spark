

## Auditoria Tecnica - 4 Correcoes

### 1. Flash no Hero Section (carregamento duplicado)

**Causa:** O HeroSlider tem dois renders completamente diferentes - um hero estatico (linhas 71-112) enquanto `isLoading` e `true`, e depois o slider real. Quando a pagina carrega, o estado `isLoading` comeca como `true`, mostrando o hero estatico com gradiente e texto. Quando os artigos chegam da base de dados (milissegundos depois), o componente troca abruptamente para o slider com imagens. Isto cria o efeito de "flash" ou sobreposicao.

**Solucao:** Remover o hero estatico como estado de loading. Em vez disso:
- Mostrar um placeholder escuro com skeleton/spinner discreto enquanto carrega
- Manter o hero estatico apenas quando `articles.length === 0` (sem artigos na BD), nao durante o loading
- Adicionar `min-h-[500px] h-[70vh]` ao placeholder para evitar layout shift

**Ficheiro:** `src/components/home/HeroSlider.tsx`

---

### 2. Imagens cortam rostos no Hero

**Causa:** As imagens usam `bg-cover bg-top` (linha 144). O `bg-top` alinha a imagem ao topo, o que pode cortar conteudo central dependendo da proporcao da imagem.

**Solucao:** Alterar de `background-image` com `bg-cover bg-top` para um elemento `<img>` com:
- `object-fit: cover` e `object-position: center 20%` (prioriza a zona superior-central onde ficam os rostos)
- Isto garante que rostos nao sao cortados na maioria dos casos
- Usar tag `<img>` em vez de `background-image` para melhor semantica e lazy loading nativo

**Ficheiro:** `src/components/home/HeroSlider.tsx`

---

### 3. Erro 404 em acesso directo a rotas

**Causa:** Este e um projecto React SPA (Single Page Application) com React Router. Quando se acede directamente a uma rota como `/sobre`, o servidor tenta encontrar um ficheiro `/sobre/index.html` que nao existe. O Lovable precisa de um ficheiro de rewrite para servir `index.html` em todas as rotas.

**Solucao:** Este problema e resolvido na plataforma de hosting. Para o Lovable/Netlify, verificar se existe um `_redirects` ou configuracao equivalente. No Vite, nao ha nada a fazer no codigo - e uma questao de configuracao do servidor. Vou criar um ficheiro `public/_redirects` com a regra `/* /index.html 200` para garantir que todas as rotas sao servidas correctamente.

**Ficheiro novo:** `public/_redirects`

---

### 4. Substituir cards de video por video YouTube unico

**Solucao:** Reescrever completamente o `VideosSection`:
- Remover o array de 4 videos Facebook e o modal Dialog
- Colocar um unico video YouTube embed com ID `E0uI8f-2P3E`
- Mostrar thumbnail do YouTube (`https://img.youtube.com/vi/E0uI8f-2P3E/maxresdefault.jpg`) como preview
- Botao play central sobre a thumbnail
- Ao clicar, substituir a thumbnail pelo iframe do YouTube com autoplay
- Aspect ratio 16:9 responsivo usando `aspect-video`
- Manter o fundo escuro e o SectionHeader existentes
- Largura maxima do video: `max-w-4xl` centrado

**Ficheiro:** `src/components/home/VideosSection.tsx`

---

### Resumo de Ficheiros

| Ficheiro | Accao |
|----------|-------|
| `src/components/home/HeroSlider.tsx` | Corrigir flash de loading + centralizar imagens |
| `src/components/home/VideosSection.tsx` | Reescrever com video YouTube unico |
| `public/_redirects` | Criar para resolver 404 em rotas directas |

