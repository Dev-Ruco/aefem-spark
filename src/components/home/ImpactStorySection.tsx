import { GraduationCap, Apple, Users, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import impactImage from '@/assets/impact-story.jpg';

const impactPoints = [
  { icon: GraduationCap, key: 'impact.point1' },
  { icon: Apple, key: 'impact.point2' },
  { icon: Users, key: 'impact.point3' },
] as const;

export function ImpactStorySection() {
  const { t } = useLanguage();
  const { ref: sectionRef, isInView } = useScrollAnimation({ threshold: 0.15 });
  const { ref: imageRef, isInView: imageInView } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Image Column */}
          <div
            ref={imageRef}
            className={cn(
              'lg:col-span-7 transition-all duration-1000',
              imageInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            )}
          >
            <div className="relative group">
              {/* Decorative frame */}
              <div className="absolute -inset-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-sm opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={impactImage}
                  alt={t('impact.title')}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 md:bottom-6 md:right-6 bg-card border border-border rounded-xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">AEFEM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div
            ref={sectionRef}
            className={cn(
              'lg:col-span-5 transition-all duration-1000 delay-200',
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            )}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
              {t('impact.badge')}
            </Badge>

            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              <span className="gradient-text">{t('impact.title')}</span>
            </h2>

            <p className="text-primary font-semibold text-lg mb-4">
              {t('impact.subtitle')}
            </p>

            <p className="text-muted-foreground leading-relaxed mb-6">
              {t('impact.description')}
            </p>

            <p className="text-sm text-muted-foreground mb-4 font-medium">
              {t('impact.location')}
            </p>

            {/* Impact Points */}
            <div className="space-y-4 mb-6">
              {impactPoints.map(({ icon: Icon, key }, index) => (
                <div
                  key={key}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-xl bg-card/60 border border-border/50 transition-all duration-500',
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  )}
                  style={{ transitionDelay: `${400 + index * 150}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium pt-1.5">
                    {t(key)}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed border-l-2 border-primary/30 pl-4">
              {t('impact.closing')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ImpactStorySection;
