

## Plano: Criar Pagina Projectos, Pagina Publicacoes, Remover Doacoes

### Resumo das Alteracoes

**3 grandes mudancas:**
1. **Criar pagina `/projectos`** — com Mutiyane como primeiro projecto (conteudo actual migrado)
2. **Remover pagina `/doacoes`** — substituir botao "Apoiar" por "Tornar-se Membro" em todo o site
3. **Criar pagina `/publicacoes`** — para documentos PDF com preview integrado

### Estrutura da Pagina de Projectos

A pagina `/projectos` tera um layout com lista de projectos. Inicialmente apenas o Mutiyane, mas extensivel para futuros projectos.

- Hero com titulo "Projectos da AEFEM"
- Cards dos projectos com imagem, nome e breve descricao
- Ao clicar num projecto, expande ou navega para seccao com o conteudo completo (accordion/tabs)
- Todo o conteudo actual de `MutiyanePage.tsx` sera integrado como seccao do projecto Mutiyane dentro desta pagina

### Estrutura da Pagina de Publicacoes

A pagina `/publicacoes` mostrara documentos PDF carregados no sistema:
- Criar tabela `publications` na BD (titulo, descricao, ficheiro PDF URL, data, thumbnail)
- Na pagina publica: grid de cards com preview do PDF (primeira pagina como thumbnail ou icone PDF)
- Ao clicar: abre preview inline com `<iframe>` ou `<embed>` para visualizar o PDF
- Botao de download disponivel
- Storage bucket `publications` para uploads
- No admin: pagina para gerir publicacoes (CRUD)

### Remocao de Doacoes

- Eliminar `src/pages/DonationsPage.tsx`
- Remover rota `/doacoes` do `App.tsx`
- Remover import de `DonationsPage`

### Substituicao do Botao "Apoiar"

Em todos os ficheiros que referenciam `/doacoes`:

| Ficheiro | Alteracao |
|----------|-----------|
| `Header.tsx` | Botao CTA: `/doacoes` → `/tornar-se-membro`, label "Apoiar" → "Tornar-se Membro" |
| `Footer.tsx` | Botao e quick link: remover `/doacoes`, botao → `/tornar-se-membro` |
| `HeroSlider.tsx` | Link `/doacoes` → `/tornar-se-membro` |
| `SupportSection.tsx` | CTA `/doacoes` → `/tornar-se-membro` |

### Navegacao Actualizada

Menu principal:
- Inicio | Sobre Nos | **Projectos** | Noticias | **Publicacoes** | Galeria | Contacto | Tornar-se Membro

(Remover "Mutiyane" e "Doacoes" do menu, adicionar "Projectos" e "Publicacoes")

### Migracoes BD

1. Criar tabela `publications`:
   - id, title, title_en, description, description_en, file_url, thumbnail_url, published_at, created_at, is_active
   - RLS: publico pode ler activas, admin pode gerir

2. Criar bucket `publications` (publico)

### Ficheiros a Criar/Modificar

| Ficheiro | Accao |
|----------|-------|
| `src/pages/ProjectsPage.tsx` | **Criar** — pagina de projectos com Mutiyane integrado |
| `src/pages/PublicationsPage.tsx` | **Criar** — pagina de publicacoes com preview PDF |
| `src/pages/admin/PublicationsList.tsx` | **Criar** — admin CRUD de publicacoes |
| `src/pages/admin/PublicationEditor.tsx` | **Criar** — editor de publicacao (upload PDF + thumbnail) |
| `src/App.tsx` | Remover rota doacoes, adicionar rotas projectos/publicacoes/admin |
| `src/components/layout/Header.tsx` | Actualizar nav: remover doacoes/mutiyane, adicionar projectos/publicacoes, botao CTA → membro |
| `src/components/layout/Footer.tsx` | Remover ref doacoes, botao → tornar-se-membro |
| `src/components/home/HeroSlider.tsx` | Link doacoes → tornar-se-membro |
| `src/components/home/SupportSection.tsx` | CTA → tornar-se-membro |
| `src/components/admin/AdminSidebar.tsx` | Adicionar item "Publicacoes" |
| `src/contexts/LanguageContext.tsx` | Adicionar traducoes projectos/publicacoes, actualizar nav |
| `src/pages/DonationsPage.tsx` | **Eliminar** |
| `src/pages/MutiyanePage.tsx` | **Eliminar** (conteudo migrado para ProjectsPage) |
| Migracao SQL | Criar tabela publications + bucket storage |

### Sequencia de Implementacao
1. Migracao BD (tabela + bucket + RLS)
2. Criar ProjectsPage com conteudo Mutiyane
3. Criar PublicationsPage com preview PDF
4. Criar admin PublicationsList + PublicationEditor
5. Actualizar navegacao (Header, Footer, AdminSidebar)
6. Actualizar traducoes
7. Actualizar App.tsx (rotas)
8. Remover ficheiros obsoletos (DonationsPage, MutiyanePage)
9. Limpar todas as referencias a `/doacoes`

