import { cn } from '@/lib/utils';
import SectionHeader from '@/components/ui/section-header';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';

export function AboutSection() {
  const { ref, isInView } = useScrollAnimation();
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-secondary/50 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            ref={ref}
            className={cn(
              'relative transition-all duration-700',
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            )}
          >
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-brand-lg">
                <div className="w-full h-full gradient-primary opacity-90 flex items-center justify-center">
                  <div className="text-center text-primary-foreground p-8">
                    <h3 className="font-display text-4xl font-bold mb-4">AEFEM</h3>
                    <p className="text-lg opacity-90">{t('about.economic_empowerment')}</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-card rounded-xl shadow-brand-md p-6 animate-float">
                <div className="text-center">
                  <span className="block text-4xl font-bold gradient-text">+1000</span>
                  <span className="text-sm text-muted-foreground">{t('about.women_empowered')}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              'transition-all duration-700 delay-200',
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            )}
          >
            <SectionHeader
              subtitle={t('about.subtitle')}
              title={t('about.title')}
              align="left"
              className="mb-8"
            />
            
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: t('about.p1') }} />
              <p className="leading-relaxed">{t('about.p2')}</p>
              <p className="leading-relaxed">{t('about.p3')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
