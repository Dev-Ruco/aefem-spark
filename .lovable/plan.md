

## Plano: Corrigir erro de build — noscript no head

### Problema
O build falha porque `<noscript>` dentro de `<head>` não pode conter elementos de bloco como `<p>`. O parse5 rejeita isto com o erro `disallowed-content-in-noscript-in-head`.

### Solução
Mover o bloco `<noscript>` de dentro do `<head>` para dentro do `<body>`, antes do `<div id="root">`.

### Ficheiro: `index.html`

- **Remover** linhas 30-35 (o `<noscript>` dentro do `<head>`)
- **Adicionar** o mesmo bloco dentro do `<body>`, antes de `<div id="root">`

```html
<body>
  <noscript>
    <p>AEFEM — Associação do Empoderamento Feminino de Moçambique. 
    Promovemos o empoderamento feminino através de programas de 
    capacitação económica, liderança e direitos das mulheres em Moçambique.</p>
  </noscript>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

Apenas 1 ficheiro a alterar. Sem impacto visual ou funcional.

