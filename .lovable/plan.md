
## Plano: Mover secção "Nossa Equipa" para antes de "Parceiros"

Alteração simples na ordem das secções em `src/pages/Index.tsx`.

### Ordem actual:
1. HeroSlider
2. AboutSection
3. StatisticsSection
4. ImpactStorySection
5. PillarsSection
6. **TeamSection**
7. ActivitiesSection
8. VideosSection
9. PartnersSection

### Nova ordem:
1. HeroSlider
2. AboutSection
3. StatisticsSection
4. ImpactStorySection
5. PillarsSection
6. ActivitiesSection
7. VideosSection
8. **TeamSection** (movida para aqui)
9. PartnersSection

### Ficheiro a modificar
- `src/pages/Index.tsx` -- mover `<TeamSection />` da linha 31 para depois de `<VideosSection />` (antes de `<PartnersSection />`).
