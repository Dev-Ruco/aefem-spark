

## Plano: Simplificar Homepage e Adicionar Seccao de Videos

### Resumo
Reduzir a quantidade de conteudo na homepage removendo seccoes redundantes, reorganizar a ordem, e adicionar uma nova seccao de videos verticais do Facebook.

### Alteracoes na Homepage

**Ficheiro:** `src/pages/Index.tsx`

Nova ordem das seccoes:
1. HeroSlider
2. AboutSection
3. StatisticsSection
4. ImpactStorySection
5. PillarsSection
6. TeamSection
7. ActivitiesSection
8. **VideosSection** (NOVA)
9. PartnersSection (ultima antes do footer)

Seccoes removidas da homepage:
- PurposeSection (ja existe na pagina Sobre Nos)
- HowWeWorkSection (ja existe na pagina Sobre Nos)
- SupportSection (removida)

### Nova Seccao: VideosSection

**Ficheiro a criar:** `src/components/home/VideosSection.tsx`

Design:
- Titulo: "Acompanhe as Nossas Actividades" com subtitulo
- Grid de 4 videos em layout responsivo (2x2 em desktop, 1 coluna em mobile)
- Cada video mostra uma thumbnail/preview com botao de play no centro
- Ao clicar, abre o video do Facebook num modal ou redireciona para o Facebook
- Formato vertical (aspect-ratio 9:16) para videos verticais do Facebook
- Scroll animations consistentes com o resto do site
- Os 4 links de video do Facebook serao hardcoded como dados estaticos

Abordagem tecnica para os videos do Facebook:
- Usar iframes do Facebook Video Embed dentro de um modal (Dialog)
- Converter os links de partilha para URLs de embed do Facebook
- Cada card tera um overlay com icone de play e titulo descritivo
- Fundo escuro no modal para destaque do video

### Traducoes

**Ficheiro:** `src/contexts/LanguageContext.tsx`

Novas chaves (~5):
- `videos.subtitle`: "Multimidia" / "Multimedia"
- `videos.title`: "Acompanhe as Nossas Actividades" / "Follow Our Activities"
- `videos.description`: "Veja os momentos mais marcantes..." / "Watch the most remarkable moments..."
- `videos.watch`: "Assistir Video" / "Watch Video"

### Ficheiros a modificar/criar
- **Criar:** `src/components/home/VideosSection.tsx`
- **Modificar:** `src/pages/Index.tsx` (reorganizar seccoes)
- **Modificar:** `src/contexts/LanguageContext.tsx` (adicionar chaves de traducao)

