import { TrendingUp, GraduationCap, Scale, Users, Handshake } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from '@/components/ui/section-header';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

const pillars = [
  {
    icon: TrendingUp,
    title: 'Empoderamento Económico e Geração de Rendimento',
    description: 'Apoio ao empreendedorismo feminino, formação em gestão de pequenos negócios e promoção da inclusão económica.',
  },
  {
    icon: GraduationCap,
    title: 'Educação e Capacitação',
    description: 'Alfabetização funcional e financeira, educação para o empreendedorismo e formação técnica profissional.',
  },
  {
    icon: Scale,
    title: 'Direitos Económicos e Sociais',
    description: 'Sensibilização sobre direitos económicos e laborais, apoio à igualdade de acesso a recursos e serviços.',
  },
  {
    icon: Users,
    title: 'Liderança Feminina',
    description: 'Formação em liderança, promoção de redes de mulheres empreendedoras e participação em fóruns económicos.',
  },
  {
    icon: Handshake,
    title: 'Advocacia e Parcerias',
    description: 'Diálogo com instituições públicas e privadas, parcerias estratégicas para o desenvolvimento económico.',
  },
];

export function PillarsSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle="Pilares de Actuação"
          title="Áreas de Actuação"
          description="Trabalhamos em cinco pilares fundamentais para promover o empoderamento económico das mulheres"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => (
            <PillarCard key={pillar.title} pillar={pillar} index={index} />
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
  pillar: (typeof pillars)[0];
  index: number;
}) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <Card
      ref={ref}
      className={cn(
        'group transition-all duration-500 hover:shadow-brand-md border-border/50 hover:border-primary/30',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        index === 4 && 'lg:col-start-2' // Center the last card on desktop
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
