import { Search, BookOpen, Rocket, LineChart } from 'lucide-react';
import SectionHeader from '@/components/ui/section-header';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export function HowWeWorkSection() {
  const { t } = useLanguage();

  const steps = [
    { icon: Search, number: '01', title: t('howwework.step1_title'), description: t('howwework.step1_desc') },
    { icon: BookOpen, number: '02', title: t('howwework.step2_title'), description: t('howwework.step2_desc') },
    { icon: Rocket, number: '03', title: t('howwework.step3_title'), description: t('howwework.step3_desc') },
    { icon: LineChart, number: '04', title: t('howwework.step4_title'), description: t('howwework.step4_desc') },
  ];

  return (
    <section className="py-20 md:py-28 bg-foreground text-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          subtitle={t('howwework.subtitle')}
          title={t('howwework.title')}
          description={t('howwework.description')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} totalSteps={steps.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
  totalSteps,
}: {
  step: { icon: any; number: string; title: string; description: string };
  index: number;
  totalSteps: number;
}) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={cn(
        'relative text-center group transition-all duration-500',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {index < totalSteps - 1 && (
        <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
      )}

      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-background/10 backdrop-blur-sm mb-6 relative group-hover:bg-primary/20 transition-colors duration-300">
        <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
          {step.number}
        </span>
        <step.icon className="h-10 w-10 text-primary" />
      </div>

      <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
        {step.title}
      </h3>
      <p className="text-background/70 text-sm leading-relaxed">
        {step.description}
      </p>
    </div>
  );
}

export default HowWeWorkSection;
