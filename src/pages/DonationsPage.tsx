import { Helmet } from 'react-helmet-async';
import { Heart, CreditCard, Smartphone, Building, Users, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import SectionHeader from '@/components/ui/section-header';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DonationsPage() {
  const { t } = useLanguage();

  const donationMethods = [
    {
      icon: Building,
      title: t('donations.bank_title'),
      description: t('donations.bank_desc'),
      details: t('donations.bank_details'),
    },
    {
      icon: Smartphone,
      title: t('donations.mpesa_title'),
      description: t('donations.mpesa_desc'),
      details: t('donations.mpesa_details'),
    },
    {
      icon: CreditCard,
      title: t('donations.card_title'),
      description: t('donations.card_desc'),
      details: t('donations.card_details'),
      comingSoon: true,
    },
  ];

  const impactItems = [
    { value: '100 MZN', description: t('donations.impact_1') },
    { value: '500 MZN', description: t('donations.impact_2') },
    { value: '1.000 MZN', description: t('donations.impact_3') },
    { value: '5.000 MZN', description: t('donations.impact_4') },
  ];

  return (
    <>
      <Helmet>
        <title>{t('donations.title')} | AEFEM</title>
        <meta name="description" content={t('donations.meta_desc')} />
      </Helmet>

      <Layout>
        {/* Hero */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 gradient-primary opacity-10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary mb-8 animate-pulse-glow">
                <Heart className="h-10 w-10 text-primary-foreground" />
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {t('donations.hero_title_prefix')}{' '}
                <span className="gradient-text">{t('donations.hero_title_highlight')}</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {t('donations.hero_desc')}
              </p>
            </div>
          </div>
        </section>

        {/* Donation Methods */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <SectionHeader
              subtitle={t('donations.methods_subtitle')}
              title={t('donations.methods_title')}
              description={t('donations.methods_desc')}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {donationMethods.map((method, index) => (
                <DonationMethodCard key={index} method={method} index={index} comingSoonLabel={t('donations.coming_soon')} />
              ))}
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <SectionHeader
              subtitle={t('donations.impact_subtitle')}
              title={t('donations.impact_title')}
              description={t('donations.impact_desc')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {impactItems.map((item, index) => (
                <ImpactCard key={item.value} item={item} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Other Ways to Support */}
        <section className="py-20 bg-foreground text-background">
          <div className="container mx-auto px-4">
            <SectionHeader
              subtitle={t('donations.other_subtitle')}
              title={t('donations.other_title')}
              description={t('donations.other_desc')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="bg-background/10 border-background/20">
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-3">{t('donations.volunteer_title')}</h3>
                  <p className="text-background/70 mb-6">
                    {t('donations.volunteer_desc')}
                  </p>
                  <Button variant="outline" className="border-background/30 text-background hover:bg-background/10">
                    {t('donations.volunteer_cta')}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-background/10 border-background/20">
                <CardContent className="p-8 text-center">
                  <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-3">{t('donations.partnerships_title')}</h3>
                  <p className="text-background/70 mb-6">
                    {t('donations.partnerships_desc')}
                  </p>
                  <Button variant="outline" className="border-background/30 text-background hover:bg-background/10">
                    {t('donations.partnerships_cta')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              {t('donations.cta_title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('donations.cta_desc')}
            </p>
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 hover:scale-105 px-12"
            >
              <Heart className="mr-2 h-5 w-5" />
              {t('donations.cta_button')}
            </Button>
          </div>
        </section>
      </Layout>
    </>
  );
}

function DonationMethodCard({
  method,
  index,
  comingSoonLabel,
}: {
  method: { icon: any; title: string; description: string; details: string; comingSoon?: boolean };
  index: number;
  comingSoonLabel: string;
}) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <Card
      ref={ref}
      className={cn(
        'relative overflow-hidden transition-all duration-500',
        method.comingSoon && 'opacity-60',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {method.comingSoon && (
        <div className="absolute top-4 right-4 bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
          {comingSoonLabel}
        </div>
      )}
      <CardContent className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-6">
          <method.icon className="h-8 w-8 text-primary-foreground" />
        </div>
        <h3 className="font-display text-xl font-semibold mb-3">{method.title}</h3>
        <p className="text-muted-foreground mb-4">{method.description}</p>
        <div className="bg-secondary/50 rounded-lg p-4 text-sm whitespace-pre-line text-left">
          {method.details}
        </div>
      </CardContent>
    </Card>
  );
}

function ImpactCard({
  item,
  index,
}: {
  item: { value: string; description: string };
  index: number;
}) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <Card
      ref={ref}
      className={cn(
        'text-center transition-all duration-500 hover:shadow-brand-md',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <span className="block text-3xl font-bold gradient-text mb-3">{item.value}</span>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
    </Card>
  );
}
