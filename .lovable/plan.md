

## Plano: Actualização de Contactos, Redes Sociais e Canal WhatsApp

### 1. Corrigir links de redes sociais (3 ficheiros)

**`src/config/seo.ts`** — Actualizar URLs oficiais:
- Facebook: `https://www.facebook.com/profile.php?id=61577015711119`
- Instagram: `https://www.instagram.com/aefemmoz/`

**`src/components/layout/Footer.tsx`** — Actualizar `socialLinks` com os URLs correctos + adicionar link WhatsApp nos contactos.

**`src/pages/ContactPage.tsx`** — Actualizar `contactInfo` + adicionar ícones sociais.

### 2. Actualizar informação de contacto real

Em **Footer.tsx** e **ContactPage.tsx**, substituir dados placeholder por:
- Telefone: `+258 86 356 6904` (com link `tel:` e link WhatsApp)
- Endereço: `Av. Samora Machel, Prédio Rubi, Entrada Ara-Sul, 2.º Andar, n.º 7, Maputo – Moçambique`
- Email: manter `info@aefem.org.mz`

### 3. Adicionar ícones sociais à ContactPage

Na sidebar da ContactPage (antes do mapa placeholder), adicionar ícones Facebook + Instagram clicáveis, com o mesmo estilo do footer (círculos com hover magenta).

### 4. Secção WhatsApp Channel — novo componente

Criar **`src/components/home/WhatsAppChannelSection.tsx`**:
- Fundo verde WhatsApp (`#25D366`) com padrão subtil
- Ícone WhatsApp (SVG inline, pois Lucide não tem ícone WhatsApp de brand)
- Texto: "Fique mais perto da AEFEM" + descrição
- Botão CTA branco: "Seguir canal no WhatsApp" → `https://whatsapp.com/channel/0029Vb66czs5K3za7nzBpf2W`
- Responsivo, visualmente destacado

Adicionar esta secção na **homepage** (`Index.tsx`) antes do `JoinSection`, e também no final da **ContactPage** antes do closing `</Layout>`.

### 5. Ficheiros a alterar

1. `src/config/seo.ts` — URLs correctos
2. `src/components/layout/Footer.tsx` — socialLinks, contactos reais
3. `src/pages/ContactPage.tsx` — contactos reais, ícones sociais, secção WhatsApp
4. `src/components/home/WhatsAppChannelSection.tsx` — novo componente
5. `src/pages/Index.tsx` — incluir WhatsAppChannelSection

