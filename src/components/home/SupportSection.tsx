import { Link } from 'react-router-dom';
import { Users, Heart, Handshake, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from '@/components/ui/section-header';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export function SupportSection() {
  const { t } = useLanguage();

  const supportOptions = [
    { icon: UserPlus, title: t('support.member_title'), description: t('support.member_desc') },
    { icon: Heart, title: t('support.donate_title'), description: t('support.donate_desc') },
    { icon: Handshake, title: t('support.partner_title'), description: t('support.partner_desc') },
    { icon: Users, title: t('support.volunteer_title'), description: t('support.volunteer_desc') },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />
      
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          subtitle={t('support.subtitle')}
          title={t('support.title')}
          description={t('support.description')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {supportOptions.map((option, index) => (
            <SupportCard key={index} option={option} index={index} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/doacoes">
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 hover:scale-105 px-12"
            >
              <Heart className="mr-2 h-5 w-5" />
              {t('support.cta')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function SupportCard({
  option,
  index,
}: {
  option: { icon: any; title: string; description: string };
  index: number;
}) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <Card
      ref={ref}
      className={cn(
        'group text-center transition-all duration-500 hover:shadow-brand-md border-border/50 hover:border-primary/30',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 group-hover:bg-primary/20 mb-4 transition-colors">
          <option.icon className="h-7 w-7 text-primary" />
        </div>
        <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {option.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {option.description}
        </p>
      </CardContent>
    </Card>
  );
}

export default SupportSection;
