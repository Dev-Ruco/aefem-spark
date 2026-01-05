import { Target, Eye, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from '@/components/ui/section-header';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

const purposeCards = [
  {
    icon: Target,
    title: 'Missão',
    content: 'Promover o empoderamento económico das mulheres em Moçambique, através da educação, capacitação, empreendedorismo e defesa de direitos, criando condições para a sua autonomia, participação activa e desenvolvimento sustentável.',
  },
  {
    icon: Eye,
    title: 'Visão',
    content: 'Um Moçambique onde as mulheres tenham independência económica, acesso equitativo a oportunidades e capacidade de decisão sobre as suas vidas, contribuindo plenamente para o desenvolvimento social e económico do país.',
  },
  {
    icon: Heart,
    title: 'Valores',
    content: 'Autonomia • Igualdade de oportunidades • Integridade • Transparência • Participação • Sustentabilidade',
  },
];

export function PurposeSection() {
  return (
    <section className="py-20 md:py-28 gradient-hero">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle="O Nosso Propósito"
          title="O Que Nos Move"
          description="Guiados por valores sólidos, trabalhamos para construir um futuro mais justo e igualitário"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {purposeCards.map((card, index) => (
            <PurposeCard key={card.title} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PurposeCard({
  card,
  index,
}: {
  card: (typeof purposeCards)[0];
  index: number;
}) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <Card
      ref={ref}
      className={cn(
        'group relative overflow-hidden transition-all duration-500 hover:shadow-brand-lg border-none',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="relative p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-background/20 mb-6 transition-colors duration-500">
          <card.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
        </div>
        <h3 className="font-display text-2xl font-bold mb-4 group-hover:text-primary-foreground transition-colors duration-500">
          {card.title}
        </h3>
        <p className="text-muted-foreground group-hover:text-primary-foreground/90 transition-colors duration-500 leading-relaxed">
          {card.content}
        </p>
      </CardContent>
    </Card>
  );
}

export default PurposeSection;
