import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import useCountUp from '@/hooks/useCountUp';
import { Landmark, Smartphone } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const FinancialExclusionChart = () => {
  const { t } = useLanguage();
  const { ref, isInView } = useScrollAnimation({ threshold: 0.3 });
  const [isExpanded, setIsExpanded] = useState(false);

  const menCount = useCountUp(46, isInView, { duration: 2000, delay: 200 });
  const womenCount = useCountUp(30, isInView, { duration: 2000, delay: 400 });
  const ruralCount = useCountUp(14, isInView, { duration: 2000, delay: 600 });

  const stats = [
    {
      label: t('stats.financial.men'),
      value: menCount,
      target: 46,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      icon: Landmark,
    },
    {
      label: t('stats.financial.women'),
      value: womenCount,
      target: 30,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      icon: Landmark,
    },
    {
      label: t('stats.financial.rural'),
      value: ruralCount,
      target: 14,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      icon: Smartphone,
      highlight: true,
    },
  ];

  return (
    <TooltipProvider>
      <div
        ref={ref}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          bg-card rounded-2xl p-6 shadow-lg border border-border
          transition-all duration-500 cursor-pointer
          hover:shadow-xl hover:translate-y-[-4px] hover:border-primary/30
          ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
        style={{ transitionDelay: '200ms' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Landmark className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="font-semibold text-foreground text-lg">
            {t('stats.financial.title')}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {t('stats.financial.description')}
        </p>

        {/* Counters Grid */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`
                    text-center p-4 rounded-xl transition-all duration-500
                    ${stat.bgColor}
                    ${stat.highlight ? 'ring-2 ring-amber-500/30' : ''}
                  `}
                  style={{
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${index * 150}ms`,
                  }}
                >
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="text-sm">{t('stats.financial.tooltip')}</p>
          </TooltipContent>
        </Tooltip>

        {/* Expanded Details */}
        <div
          className={`
            overflow-hidden transition-all duration-300
            ${isExpanded ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="p-4 bg-amber-500/5 rounded-lg border border-amber-500/10">
            <p className="text-sm text-muted-foreground">
              {t('stats.financial.tooltip')}
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          {t('stats.click_expand')}
        </p>
      </div>
    </TooltipProvider>
  );
};

export default FinancialExclusionChart;
