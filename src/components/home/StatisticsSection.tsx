import { useLanguage } from '@/contexts/LanguageContext';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import EmploymentGapChart from './infographics/EmploymentGapChart';
import AgricultureChart from './infographics/AgricultureChart';
import FinancialExclusionChart from './infographics/FinancialExclusionChart';
import DigitalDivideChart from './infographics/DigitalDivideChart';
import { BarChart3 } from 'lucide-react';

const StatisticsSection = () => {
  const { t } = useLanguage();
  const { ref, isInView } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div
          ref={ref}
          className={`
            text-center max-w-3xl mx-auto mb-12
            transition-all duration-700
            ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t('stats.badge')}
            </span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t('stats.title')}
          </h2>
          
          <p className="text-lg text-muted-foreground">
            {t('stats.subtitle')}
          </p>
        </div>

        {/* Infographics Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-8">
          <EmploymentGapChart />
          <AgricultureChart />
          <FinancialExclusionChart />
          <DigitalDivideChart />
        </div>

        {/* Source Footer */}
        <div
          className={`
            text-center p-4 bg-card rounded-lg border border-border
            transition-all duration-700 delay-500
            ${isInView ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <p className="text-xs text-muted-foreground">
            {t('stats.source')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
