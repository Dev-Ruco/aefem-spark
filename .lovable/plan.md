

## Diagnostico e Plano de Correcao

### Problemas Identificados

**1. Login falha com "credenciais invalidas"**
Os logs mostram que apos registar (felisberto.ruco@gmail.com / ALZIRA GUETSE), o login falhou com `invalid_credentials`. Isto pode acontecer porque:
- O utilizador usou uma password diferente no login vs registo
- O utilizador anterior `steliomucavelee@gmail.com` nunca confirmou o email (auto-confirm nao estava activo quando se registou) — este utilizador nao consegue fazer login

**Solucao**: No `MemberLogin.tsx`, apos login com sucesso, verificar se existe registo na tabela `members`. Tambem melhorar mensagens de erro para orientar o utilizador.

**2. No admin, membros registados nao aparecem correctamente**
A tabela `members` tem 2 registos: ALZIRA GUETSE (com user_id) e FELISBERTO RUCO (sem user_id, migrado de candidatura). Estes **devem** aparecer no admin. Se nao aparecem, pode ser problema de cache no browser.

**3. Admin precisa de poder inativar/ativar membros (sem apagar)**
O admin quer controlo total sobre membros: mudar estado entre Activo e Inactivo. Ja existe o Select no `MembersList.tsx` mas precisa de ser mais claro e funcional.

### Plano de Implementacao

#### 1. Corrigir MemberDashboard para tratar membros sem perfil
Quando o utilizador faz login mas nao tem registo em `members` (ex: conta antiga), mostrar mensagem clara em vez de pagina vazia.

#### 2. Melhorar MembersList no Admin
- Remover opcao "Apagar" — usar apenas Activo/Inactivo
- Adicionar botao claro de "Inativar" e "Activar" nas accoes de cada membro
- Mostrar estado de quota mais visivel
- No dialog de detalhes, adicionar accoes de gestao de quotas

#### 3. Corrigir utilizador bloqueado (steliomucavelee@gmail.com)
Este utilizador registou-se antes do auto-confirm estar activo. Confirmar o email manualmente na BD para desbloquear.

#### 4. Melhorar fluxo de login do membro
- Adicionar mensagem mais descritiva quando credenciais falham
- Apos login bem-sucedido, redirecionar para `/membro` apenas se existir perfil de membro

---

### Ficheiros a Modificar

| Ficheiro | Alteracao |
|----------|-----------|
| **Fix BD** | Confirmar email de `steliomucavelee@gmail.com` |
| `src/pages/admin/MembersList.tsx` | Substituir logica de apagar por inativar/activar; melhorar UI de gestao |
| `src/pages/member/MemberDashboard.tsx` | Melhorar tratamento de membro sem perfil |
| `src/pages/member/MemberLogin.tsx` | Melhorar mensagens de erro |

### Sequencia
1. Confirmar email do utilizador bloqueado
2. Actualizar MembersList com inativar/activar
3. Melhorar login e dashboard do membro

