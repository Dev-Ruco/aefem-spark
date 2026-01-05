import { Helmet } from 'react-helmet-async';
import { Heart, CreditCard, Smartphone, Building, Users, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import SectionHeader from '@/components/ui/section-header';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

const donationMethods = [
  {
    icon: Building,
    title: 'Transferência Bancária',
    description: 'Faça uma transferência directa para a nossa conta.',
    details: 'Banco: Millennium BIM\nNIB: 0001 0000 0000 0000 0001\nTitular: AEFEM',
  },
  {
    icon: Smartphone,
    title: 'M-Pesa',
    description: 'Envie a sua doação através do M-Pesa.',
    details: 'Número: 84 000 0000\nNome: AEFEM',
  },
  {
    icon: CreditCard,
    title: 'Cartão de Crédito',
    description: 'Em breve: doações online por cartão.',
    details: 'Esta funcionalidade estará disponível em breve.',
    comingSoon: true,
  },
];

const impactItems = [
  {
    value: '100 MZN',
    description: 'Fornece material escolar para uma mulher em formação',
  },
  {
    value: '500 MZN',
    description: 'Financia uma sessão de formação em literacia financeira',
  },
  {
    value: '1.000 MZN',
    description: 'Apoia o arranque de um pequeno negócio',
  },
  {
    value: '5.000 MZN',
    description: 'Financia um programa completo de capacitação',
  },
];

export default function DonationsPage() {
  return (
    <>
      <Helmet>
        <title>Doações | AEFEM</title>
        <meta name="description" content="Apoie o empoderamento económico das mulheres em Moçambique. A sua doação faz a diferença." />
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
                Apoie o{' '}
                <span className="gradient-text">Empoderamento Feminino</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Cada contribuição ajuda a transformar vidas. Junte-se a nós na missão de empoderar economicamente as mulheres em Moçambique.
              </p>
            </div>
          </div>
        </section>

        {/* Donation Methods */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <SectionHeader
              subtitle="Como Doar"
              title="Métodos de Doação"
              description="Escolha a forma mais conveniente para fazer a sua contribuição"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {donationMethods.map((method, index) => (
                <DonationMethodCard key={method.title} method={method} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <SectionHeader
              subtitle="O Seu Impacto"
              title="O Que a Sua Doação Pode Fazer"
              description="Veja como a sua contribuição pode fazer a diferença"
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
              subtitle="Outras Formas"
              title="Mais Formas de Apoiar"
              description="Para além de doações financeiras, existem outras formas de contribuir"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="bg-background/10 border-background/20">
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-3">Voluntariado</h3>
                  <p className="text-background/70 mb-6">
                    Partilhe o seu tempo, conhecimento e experiência para ajudar mulheres a alcançar a independência económica.
                  </p>
                  <Button variant="outline" className="border-background/30 text-background hover:bg-background/10">
                    Torne-se Voluntário
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-background/10 border-background/20">
                <CardContent className="p-8 text-center">
                  <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-3">Parcerias</h3>
                  <p className="text-background/70 mb-6">
                    Empresas e organizações podem estabelecer parcerias estratégicas para apoiar os nossos programas.
                  </p>
                  <Button variant="outline" className="border-background/30 text-background hover:bg-background/10">
                    Seja Parceiro
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
              Pronto para Fazer a Diferença?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Quando uma mulher prospera, toda a comunidade avança. Junte-se a nós nesta missão.
            </p>
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 hover:scale-105 px-12"
            >
              <Heart className="mr-2 h-5 w-5" />
              Doar Agora
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
}: {
  method: (typeof donationMethods)[0];
  index: number;
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
          Em breve
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
  item: (typeof impactItems)[0];
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
