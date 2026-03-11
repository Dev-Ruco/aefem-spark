

## Plano: Layout Editorial de Artigos + Sistema de Adesao de Membros

### Parte 1: Redesign da Pagina de Artigos (ArticlePage.tsx)

**Problema actual:** A imagem de capa corta rostos (50vh com object-cover), o conteudo esta dentro de um card branco com `-mt-32` que sobrepoe a imagem, e o texto nao tem largura editorial confortavel.

**Novo layout editorial:**

```text
┌─────────────────────────────────────────┐
│  ← Voltar as Noticias    [Parcerias]    │  (nav bar)
│                                         │
│  TITULO DO ARTIGO GRANDE                │
│  📅 12 de Marco, 2026    [Partilhar]    │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │   IMAGEM DE CAPA COMPLETA      │    │  aspect-[16/9]
│  │   (sem corte, bem enquadrada)   │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌───────── max-w-[720px] ─────────┐    │
│  │  Paragrafo 1 com bom line-height│    │
│  │                                 │    │
│  │  Paragrafo 2 bem separado       │    │
│  │                                 │    │
│  │  Paragrafo 3...                 │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

**Alteracoes no `src/pages/ArticlePage.tsx`:**
- Remover o card branco com `-mt-32` que sobrepoe a imagem
- Mover categoria, titulo e metadata para ANTES da imagem
- Imagem de capa: `aspect-[16/9]` com `object-cover object-center`, `rounded-xl`, dentro do container (`max-w-4xl`)
- Corpo do artigo: `max-w-[720px] mx-auto` com `prose prose-lg`
- Adicionar estilos editoriais: `leading-relaxed`, paragrafos com `mb-6`, headings com `mt-10 mb-4`
- Remover fundo de card - usar fundo limpo da pagina

---

### Parte 2: Sistema de Adesao de Membros

#### 2A: Seccao "Tornar-se Membro" na Homepage

Adicionar uma nova seccao no `src/pages/Index.tsx` entre VideosSection e TeamSection. Criar componente `src/components/home/JoinSection.tsx`:

- Fundo com gradiente suave (gradient-hero)
- Icone UserPlus, titulo "Junte-se a AEFEM", descricao breve
- 3 beneficios em cards simples (rede de apoio, capacitacao, voz activa)
- Botao CTA grande "Juntar-me Agora" que navega para `/tornar-se-membro`

#### 2B: Simplificar Formulario de Registo

O formulario actual pede: nome, genero, ano nascimento, provincia, WhatsApp, email, password.

O utilizador quer campos mais simples: **nome completo, profissao, idade, WhatsApp, provincia, codigo de acesso**.

**Problema:** A tabela `members` actual tem colunas `gender`, `birth_year`, `whatsapp_number` mas NAO tem `profissao` nem `codigo_acesso`. Tambem nao tem `idade` (tem `birth_year`).

**Solucao tecnica:**
1. Adicionar colunas `profession` (text, nullable) e `access_code` (text, nullable) a tabela `members`
2. Tornar `gender` e `birth_year` nullable (para nao quebrar registos existentes), substituir `birth_year` por campo `age` (integer, nullable)
3. Remover campos email/password do formulario visivel - criar registo SEM autenticacao (guardar como candidatura simples)

**Decisao importante:** O sistema actual cria um utilizador auth + member + role. O utilizador quer um formulario simples sem email/password. A melhor abordagem e:
- Criar uma tabela `membership_applications` separada (sem auth) para inscricoes publicas
- Campos: `full_name`, `profession`, `age`, `whatsapp_number`, `province`, `access_code`, `status`, `created_at`
- RLS: INSERT publico, SELECT/UPDATE/DELETE so admins
- O formulario grava directamente nesta tabela sem necessidade de autenticacao
- Manter a pagina actual de registo com auth para membros que querem acesso ao painel

#### 2C: Reescrever `MemberRegistration.tsx`

- Formulario limpo com 6 campos: Nome completo, Profissao, Idade (input numerico), WhatsApp, Provincia (select), Codigo de acesso
- Campos grandes, labels claras em portugues
- Sem email, sem password
- Botao "Submeter Inscricao"
- Mensagem de sucesso: "A sua inscricao foi recebida com sucesso. Em breve entraremos em contacto."
- Mobile-first: inputs `h-12`, texto `text-base`, espacamento generoso

---

### Ficheiros

| Ficheiro | Accao |
|----------|-------|
| `src/pages/ArticlePage.tsx` | Redesign completo com layout editorial |
| `src/components/home/JoinSection.tsx` | **Criar** - seccao "Tornar-se Membro" na home |
| `src/pages/Index.tsx` | Adicionar JoinSection |
| `src/pages/MemberRegistration.tsx` | Simplificar formulario (sem auth) |
| **Migracao BD** | Criar tabela `membership_applications` |

### Sequencia

1. Criar tabela `membership_applications` na base de dados
2. Redesign do ArticlePage com layout editorial
3. Criar JoinSection para homepage
4. Reescrever formulario de registo simplificado

