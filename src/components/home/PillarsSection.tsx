import { TrendingUp, GraduationCap, Scale, Users, Handshake } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from '@/components/ui/section-header';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export function PillarsSection() {
  const { t } = useLanguage();

  const pillars = [
    { icon: TrendingUp, title: t('pillars.economic_title'), description: t('pillars.economic_desc') },
    { icon: GraduationCap, title: t('pillars.education_title'), description: t('pillars.education_desc') },
    { icon: Scale, title: t('pillars.rights_title'), description: t('pillars.rights_desc') },
    { icon: Users, title: t('pillars.leadership_title'), description: t('pillars.leadership_desc') },
    { icon: Handshake, title: t('pillars.advocacy_title'), description: t('pillars.advocacy_desc') },
  ];

  return (
    <section className="py-20 md:py-28 bg-secondary/40">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle={t('pillars.subtitle')}
          title={t('pillars.title')}
          description={t('pillars.description')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => (
            <PillarCard key={index} pillar={pillar} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({
  pillar,
  index,
}: {
  pillar: { icon: any; title: string; description: string };
  index: number;
}) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <Card
      ref={ref}
      className={cn(
        'group transition-all duration-500 hover:shadow-brand-md border-border/50 hover:border-primary/30',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        index === 4 && 'lg:col-start-2'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-brand-sm group-hover:shadow-brand-md transition-shadow">
            <pillar.icon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
              {pillar.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {pillar.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PillarsSection;
