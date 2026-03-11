

## Problemas Identificados e Plano de Correcao

### 3 Problemas Criticos

**1. Registos de membros falham porque os signups estao desactivados**
Os logs de autenticacao mostram `signup_disabled` (erro 422). O formulario chama `supabase.auth.signUp()` mas o sistema de autenticacao nao permite novos registos. Todos os registos falham silenciosamente.

**2. Aprovar candidatura nao cria membro**
Quando o admin aprova uma candidatura na tab "Candidaturas", o codigo so muda o campo `status` na tabela `membership_applications`. Nao cria utilizador auth nem insere na tabela `members`. Por isso, candidaturas aprovadas nunca aparecem na tab "Membros Registados".

**3. Admin nao ve estado de quotas na lista de membros**
A pagina de membros nao mostra informacao sobre pagamento de quotas. O admin tem de ir a uma pagina separada (Quotas) sem ligacao directa ao membro.

---

### Plano de Correcao

#### 1. Activar signups na autenticacao
Usar `configure_auth` para activar registo de novos utilizadores. Isto resolve o erro 422 no formulario de registo.

#### 2. Reescrever `MemberRegistration.tsx` para tratar erros correctamente
Melhorar o tratamento de erro para mostrar a mensagem real quando o signup falha (incluindo "Signups not allowed").

#### 3. Adicionar funcionalidade de "aprovar candidatura" real no `MembersList.tsx`
Quando o admin clica "Aprovada" numa candidatura:
- Mostrar um dialog a pedir email e password temporaria (ou gerar automaticamente)
- OU: mover a candidatura para a tabela `members` sem auth (membro sem login)
- **Melhor opcao**: Como candidaturas sao registos sem auth (formulario antigo), o admin deve poder converter manualmente: copiar dados para `members` com status "active" — sem criar conta auth (o membro pode depois registar-se com auth se quiser aceder ao painel)

**Decisao tecnica**: Criar uma funcao no admin que ao aprovar uma candidatura, insere automaticamente na tabela `members` (sem user_id, que sera nullable) e marca a candidatura como "approved". Isto requer tornar `user_id` nullable na tabela `members` OU criar o registo com um placeholder.

**Melhor abordagem**: Tornar `user_id` nullable na tabela `members` para permitir membros sem conta de login. Quando o membro quiser aceder ao painel, regista-se com auth e o admin liga os registos.

#### 4. Mostrar estado de quotas na lista de membros
Adicionar ao `MembersList.tsx` uma coluna ou indicador visual do estado da ultima quota de cada membro, fazendo join com `member_quotas`.

---

### Ficheiros a Modificar

| Ficheiro | Alteracao |
|----------|-----------|
| **Auth config** | Activar signups |
| **Migracao BD** | Tornar `members.user_id` nullable |
| `src/pages/MemberRegistration.tsx` | Melhorar tratamento de erros |
| `src/pages/admin/MembersList.tsx` | Adicionar accao "Aprovar e criar membro" nas candidaturas + mostrar estado de quotas nos membros |

### Sequencia
1. Activar signups na autenticacao
2. Migracao BD: `user_id` nullable
3. Actualizar MembersList com aprovacao funcional e quotas
4. Melhorar tratamento de erros no registo

