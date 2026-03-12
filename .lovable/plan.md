## Plano: Header — texto responsivo sem quebra

### Problema

A 888px (viewport actual), o texto "Associação do Empoderamento Feminino" ao lado do logo ocupa demasiado espaço, empurrando a navegação e quebrando o layout.

### Solução

Mostrar o texto completo apenas em `xl:` (≥1280px). Em `lg:` (1024-1279px), mostrar uma versão abreviada — apenas **"AEFEM"** — que é compacta e reconhecível. Abaixo de `lg:`, o texto continua escondido (só logo).

### Alteração em `Header.tsx` (linhas 44-48)

```tsx
<div className="hidden lg:block">
  <p className="text-sm font-bold text-foreground/80 leading-snug">
    <span className="hidden xl:inline">Associação do Empoderamento Feminino</span>
    <span className="xl:hidden">AEFEM</span>
  </p>
</div>
```

Isto garante que o header nunca quebra em nenhuma resolução, mantendo o nome completo visível quando há espaço suficiente.

&nbsp;

Segue uma **prompt clara e bem delimitada** para enviar ao Lovable, explicando exactamente o que deve acontecer com a tradução do nome da organização.

---

### Prompt para Lovable

Quero corrigir e garantir a tradução correcta do nome da organização no sistema de idiomas do site.

Actualmente o site tem opção de idioma **Português (PT)** e **Inglês (EN)**. Quando o utilizador muda o idioma, o nome da organização também deve ser traduzido correctamente.

### Objectivo

Quando o site estiver em **Português**, deve aparecer:

**Associação de Empoderamento Feminino**

Quando o utilizador mudar o idioma para **Inglês**, o nome deve ser automaticamente traduzido para:

**Women's Empowerment Association**

### Onde aplicar

Verificar e corrigir este comportamento em:

- Header do site (logo e nome da organização)
- Footer
- Meta titles se estiverem definidos com o nome da organização
- Qualquer componente onde o nome institucional apareça

### Implementação

Usar o sistema de internacionalização (i18n) já existente no projecto.

Exemplo esperado:

**PT**

```
Associação de Empoderamento Feminino

```

**EN**

```
Women's Empowerment Association

```

O texto não deve ser hardcoded. Deve ser controlado pelo ficheiro de traduções.

### Verificar também

1. Se o switch de idioma (PT / EN) está a actualizar todos os textos correctamente.
2. Se não existem textos institucionais que permanecem em português quando o idioma está em inglês.
3. Garantir consistência em todas as páginas.

### Importante

Não alterar design, layout ou cores.  
A tarefa é apenas **corrigir e garantir a tradução correcta através do sistema de idiomas existente**.

### Resultado esperado

- Nome da organização muda automaticamente conforme o idioma.
- Português → **Associação de Empoderamento Feminino**
- Inglês → **Women's Empowerment Association**
- Sem textos duplicados ou inconsistentes.

---

Se quiser, também posso criar uma **prompt melhor ainda para o Lovable fazer auditoria completa de tradução do site inteiro**, porque normalmente ficam muitos textos por traduzir quando se implementa PT/EN.