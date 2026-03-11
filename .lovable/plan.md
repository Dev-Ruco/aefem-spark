

## Auditoria e Correcao do Sistema de Membros

### Problema Critico Identificado

O sistema tem **dois fluxos desconectados**:

1. **Formulario publico** (`MemberRegistration.tsx`) grava na tabela `membership_applications` — sem autenticacao
2. **Admin MembersList** (`MembersList.tsx`) le da tabela `members` — que requer auth (email+password)

Resultado: candidaturas submetidas no site **nunca aparecem** no painel admin porque sao tabelas diferentes. O admin ve `members` (vazio) e ignora `membership_applications`.

### Plano de Correcao

#### 1. Unificar o fluxo: registo com autenticacao

Reescrever `MemberRegistration.tsx` para incluir **email e password** no formulario, criando um fluxo completo:
- Campos: Nome completo, Profissao, Idade, WhatsApp, Provincia, Email, Password
- Remover campo "Codigo de acesso" (confuso e sem uso real)
- Ao submeter: `supabase.auth.signUp()` com metadata → trigger `handle_new_user` cria perfil → inserir na tabela `members`
- Mensagem de sucesso com instrucao para verificar email

#### 2. Corrigir a tabela `members` para aceitar novos campos

Migracao BD:
- Adicionar coluna `profession` (text, nullable) a tabela `members`
- Adicionar coluna `age` (integer, nullable) a tabela `members`
- Tornar `gender` nullable (ja nao sera pedido no formulario)
- Tornar `birth_year` nullable (substituido por `age`)

#### 3. Actualizar Admin MembersList para mostrar todos os dados

O `MembersList.tsx` ja le de `members` — com as novas colunas, os registos aparecerao automaticamente. Adicionar:
- Mostrar profissao e idade nas colunas/detalhes
- Adicionar tab ou seccao para ver `membership_applications` pendentes (candidaturas sem auth)

#### 4. Melhorar MemberLogin com link de recuperacao de password

Adicionar:
- Link "Esqueci a minha palavra-passe" no login
- Criar pagina `/membro/recuperar-password` com formulario de reset

#### 5. Melhorar MemberDashboard

Actualizar para mostrar profissao e informacao completa do membro. Ja funciona correctamente com a tabela `members`.

#### 6. Admin: criar pagina de candidaturas pendentes

Criar pagina admin para gerir `membership_applications` — aprovar (converter em membro com auth) ou rejeitar. Adicionar ao sidebar como sub-item de Membros.

---

### Ficheiros

| Ficheiro | Accao |
|----------|-------|
| `src/pages/MemberRegistration.tsx` | Reescrever com email+password+signUp |
| `src/pages/member/MemberLogin.tsx` | Adicionar recuperacao de password |
| `src/pages/member/ResetPassword.tsx` | **Criar** pagina de reset password |
| `src/pages/admin/MembersList.tsx` | Mostrar profissao/idade + tab candidaturas |
| `src/pages/member/MemberDashboard.tsx` | Mostrar profissao |
| `src/App.tsx` | Adicionar rota `/membro/recuperar-password` |
| **Migracao BD** | Adicionar `profession`, `age` a `members`; tornar `gender`, `birth_year` nullable |

### Sequencia

1. Migracao BD (adicionar colunas)
2. Reescrever formulario de registo com auth
3. Actualizar admin MembersList
4. Adicionar recuperacao de password
5. Actualizar dashboard do membro

