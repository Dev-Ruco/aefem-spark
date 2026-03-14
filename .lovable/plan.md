

## Plano: Auditoria Técnica e Correcções do Website AEFEM

Este é um plano abrangente que cobre os 10 pontos da auditoria. Dado o volume, será implementado em fases prioritárias.

---

### 1. Correcção Crítica de Autenticação (Admin)

**Problema identificado:** A página Settings (`Settings.tsx`) pede o UUID do utilizador para adicionar roles — isto é impraticável. Além disso, o registo de membros tenta inserir role `'member'` na tabela `user_roles`, mas o enum `app_role` só tem `admin`, `moderator`, `user` — o que causa erro silencioso.

**Correcções:**
- **`Settings.tsx`**: Redesenhar para aceitar **email** em vez de UUID. Criar uma edge function ou query que busca o `user_id` a partir do email na tabela `auth.users` (via service role). Remover referência ao "Supabase Dashboard".
- **Migração DB**: Adicionar valor `'member'` ao enum `app_role` se necessário, OU remover a tentativa de inserir role `member` no registo (membros não precisam de role na `user_roles` — são identificados pela tabela `members`).
- **`MemberRegistration.tsx`**: Remover a inserção na `user_roles` com role `member` (linhas 143-150), pois causa erro e não é necessário.

### 2. Melhorar Dashboard do Administrador

**`Dashboard.tsx`**: Adicionar card financeiro de quotas:
- Total quotas pagas no mês actual (MZN)
- Filtros: 3, 6, 12 meses e histórico completo
- Cards: quotas pagas, pendentes, total
- Buscar dados da tabela `member_quotas`

**`MembersList.tsx`**: Adicionar funcionalidades:
- Botão **Eliminar membro** (com confirmação)
- Botão **Editar membro** (dialog com formulário)
- **Detalhes expandidos**: ao clicar no membro, mostrar página/dialog com informações completas + histórico de quotas (pagas, pendentes, meses em atraso)

### 3. Melhorar Experiência de Registo

**`MemberRegistration.tsx`**: Após registo bem-sucedido, em vez de mostrar ecrã de sucesso com link para login:
- Redirecionar automaticamente para `/membro` (o utilizador já tem sessão activa por causa do auto-confirm)
- Remover o ecrã `showSuccess` e usar `navigate('/membro')` directamente

### 4. Painel do Membro — Melhorias

**`MemberDashboard.tsx`**:
- Adicionar opção **"Deixar de ser membro"** (botão discreto no final) que:
  - Mostra dialog de confirmação
  - Altera status para `inactive` e faz sign out
- Adicionar secção **"Comunidade AEFEM"** com botão para grupo WhatsApp
  - Link gerido via tabela `site_settings` (chave `whatsapp_group_link`)
- Adicionar **editar perfil** (dialog para alterar nome, profissão, WhatsApp, província)

**Admin — Gestão do link WhatsApp:**
- Adicionar campo na página `Settings.tsx` para editar o link do grupo WhatsApp (guardar em `site_settings`)

### 5. Correcção de Partilha de Artigos (OG Tags)

**`ArticlePage.tsx`**: Já tem OG tags mas falta `og:description`. Adicionar:
```html
<meta property="og:description" content={getExcerpt()} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={getTitle()} />
<meta name="twitter:description" content={getExcerpt()} />
<meta name="twitter:image" content={article.featured_image} />
```

**Nota:** Como é SPA (React), crawlers de redes sociais podem não executar JS. O `<noscript>` fallback no `index.html` e o SSR-like approach com `react-helmet-async` são a melhor solução possível sem SSR.

### 6. Correcção do Nome Oficial

Substituir **"Associação de Empoderamento Feminino"** por **"Associação do Empoderamento Feminino"** em:
- `src/contexts/LanguageContext.tsx` (linha 14 e 373)
- `src/components/layout/Header.tsx` (linha 45: "Associação de" → "Associação do")
- `src/components/home/WhatsAppChannelSection.tsx` (linha 32)

### 7. Correcção do Menu Mobile

**`Header.tsx`**: O menu mobile usa `max-h-96` que pode não ser suficiente. Corrigir:
- Mudar para `max-h-[80vh] overflow-y-auto` para permitir scroll
- Garantir que o botão "Tornar-se Membro" aparece sempre (já existe, mas o `max-h` pode cortá-lo)
- Adicionar link para "Área de Membro" no mobile quando o utilizador já está logado

### 8. Botão de Conta do Utilizador no Header

**`Header.tsx`**: Verificar se existe sessão activa + perfil de membro:
- Se **logado como membro**: substituir botão "Tornar-se Membro" pelo **primeiro nome** do utilizador com link para `/membro`
- Adicionar ícone de sino (Bell) para notificações futuras
- No mobile, o mesmo comportamento

Criar hook ou usar `useAuth` existente + query à tabela `members` para obter o nome.

### 9. Secção "Tornar-se Membro" na Homepage

**`JoinSection.tsx`**: Adicionar a imagem fornecida (duas mulheres com camisetas AEFEM):
- Copiar imagem para `src/assets/`
- Redesenhar a secção com layout split: imagem à esquerda, texto + CTA à direita
- Manter os 3 cards de benefícios abaixo
- Garantir harmonia visual com o gradiente existente

### 10. Optimização de Imagens

- Adicionar `loading="lazy"` a todas as imagens fora da dobra (muitas já têm)
- Verificar que imagens de artigos/galeria do Supabase Storage usam transformações de tamanho
- Adicionar `width` e `height` explícitos onde possível para reduzir CLS

---

### Ficheiros a criar/alterar (resumo)

| Ficheiro | Acção |
|---|---|
| `src/pages/admin/Settings.tsx` | Redesenhar para aceitar email; adicionar gestão link WhatsApp |
| `src/pages/admin/Dashboard.tsx` | Adicionar card financeiro de quotas |
| `src/pages/admin/MembersList.tsx` | Adicionar eliminar, editar membro, histórico quotas expandido |
| `src/pages/MemberRegistration.tsx` | Auto-redirect após registo |
| `src/pages/member/MemberDashboard.tsx` | Editar perfil, sair da associação, comunidade WhatsApp |
| `src/pages/ArticlePage.tsx` | Completar OG + Twitter tags |
| `src/components/layout/Header.tsx` | Nome correcto, botão conta utilizador, fix mobile menu |
| `src/components/home/JoinSection.tsx` | Adicionar imagem, redesenhar layout |
| `src/components/home/WhatsAppChannelSection.tsx` | Corrigir nome |
| `src/contexts/LanguageContext.tsx` | Corrigir "de" → "do" |
| Edge function (nova) | Buscar user_id por email para Settings |
| Migração DB | Remover inserção de role `member` / verificar enum |

### Prioridade de implementação
1. Auth fix + nome correcto (crítico)
2. Registo auto-redirect + header user button
3. Dashboard financeiro + member management
4. OG tags + mobile menu fix
5. JoinSection redesign + WhatsApp community
6. Image optimisation

