

## Diagnostico: Porque o Registo Falha

Identifiquei **3 problemas criticos** ao analisar a base de dados e os logs:

### Problema 1: Email requer confirmacao — bloqueia tudo
Os logs mostram que quando PAULA MACAVE se registou, o sistema enviou `user_confirmation_requested`. O utilizador auth e criado mas **sem sessao activa** (porque nao confirmou email). O codigo tenta inserir na tabela `members` logo a seguir, mas sem sessao activa, `auth.uid()` e `null` — a politica RLS bloqueia o INSERT. Resultado: auth user criado, mas membro **nunca** guardado.

### Problema 2: CHECK constraints bloqueiam dados
A tabela `members` tem CHECK constraints da migracao original:
- `gender CHECK (gender IN ('masculino', 'feminino', 'outro'))` — o form envia `null`
- `birth_year CHECK (birth_year >= 1940 AND birth_year <= 2010)` — o form envia `null`  
- `status CHECK (status IN ('pending', 'active', 'suspended'))` — o admin usa `'inactive'` que viola o CHECK

Embora `null` passe CHECKs em PostgreSQL, o valor `'inactive'` no status falha.

### Problema 3: Tabela members VAZIA
Confirmado pela query directa: **0 registos** na tabela `members`. A candidatura aprovada de FELISBERTO RUCO existe em `membership_applications` com status "approved" mas nunca foi copiada para `members` (provavelmente falhou pelo mesmo motivo de RLS/constraints).

### Dados actuais na BD
- `members`: 0 registos
- `membership_applications`: 1 registo (FELISBERTO RUCO, aprovado)
- `user_roles`: 1 admin (felisberto.ruco10@gmail.com)
- Auth: PAULA MACAVE registou-se mas nao confirmou email

---

### Plano de Correcao

#### 1. Activar auto-confirmacao de email
O utilizador quer entrada imediata. Activar auto-confirm para que apos signUp, o utilizador tenha sessao activa imediatamente — sem esperar email de confirmacao.

#### 2. Remover CHECK constraints restritivos
Migracao para remover os CHECKs antigos em `gender`, `birth_year` e `status` que impedem os novos fluxos de funcionar.

#### 3. Corrigir `MemberRegistration.tsx`
- Adicionar logging detalhado nos erros de insert
- Verificar se a sessao esta activa antes de inserir
- Mostrar mensagem de erro real ao utilizador

#### 4. Corrigir `MembersList.tsx` — aprovacao funcional
- A funcao `confirmApproveApplication` envia `user_id: null as any` mas a politica RLS exige `auth.uid() = user_id OR is_admin_or_editor()`. Como o admin esta autenticado, a segunda condicao deveria funcionar. Verificar e garantir que funciona.

#### 5. Migrar dados existentes
Inserir a candidatura aprovada de FELISBERTO RUCO na tabela `members`.

---

### Ficheiros

| Ficheiro | Alteracao |
|----------|-----------|
| **Auth config** | Activar auto-confirm email |
| **Migracao BD** | Remover CHECKs em gender, birth_year, status |
| **Insert dados** | Copiar candidatura aprovada para members |
| `src/pages/MemberRegistration.tsx` | Melhorar tratamento de erros e logging |

### Sequencia
1. Activar auto-confirm
2. Migracao: remover CHECK constraints
3. Inserir dados pendentes
4. Corrigir codigo de registo

