

## Plano: Corrigir barra branca no Hero

### Problema

O `clip-path` no painel esquerdo **recorta** o gradiente magenta, expondo o fundo branco da página por trás. A imagem à direita não se estende para cobrir essa área.

### Solução

Inverter a abordagem: em vez de recortar o painel esquerdo, fazer a **imagem ocupar toda a largura** e sobrepor o gradiente magenta **por cima** da imagem com um diagonal via clip-path. Assim nunca há fundo branco visível.

**Estrutura do slide (desktop)**:
```text
┌─────────────────────────────────────────┐
│  IMAGEM (absolute, inset-0, full)       │
│  ┌──────────────┐                       │
│  │ GRADIENT     │╲                      │
│  │ OVERLAY      │ ╲  (clip-path)        │
│  │ (z-10)       │  ╲                    │
│  │ com texto    │   ╲                   │
│  └──────────────┘    ╲                  │
└─────────────────────────────────────────┘
```

### Alterações em `HeroSlider.tsx`

1. **Imagem**: passa a `absolute inset-0 w-full h-full` — cobre todo o slide
2. **Painel esquerdo**: posição `absolute inset-y-0 left-0 w-[50%]` com `clip-path: polygon(0 0, 100% 0, 80% 100%, 0 100%)` e `gradient-primary`, sobreposto à imagem com `z-10`
3. Remove a separação `flex` entre esquerdo/direito — ambos são layers sobrepostos
4. Em mobile: sem clip-path, layout empilhado normal

