import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { Sprout, User } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const AgricultureChart = () => {
  const { t } = useLanguage();
  const { ref, isInView } = useScrollAnimation({ threshold: 0.3 });
  const [isExpanded, setIsExpanded] = useState(false);

  const unpaidPercentage = 41;
  const totalIcons = 10;
  const unpaidIcons = Math.round((unpaidPercentage / 100) * totalIcons);

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
        style={{ transitionDelay: '100ms' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Sprout className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">
              {t('stats.agriculture.title')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('stats.agriculture.subtitle')}
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {t('stats.agriculture.description')}
        </p>

        {/* Icons Grid */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {Array.from({ length: totalIcons }).map((_, index) => {
                const isUnpaid = index >= totalIcons - unpaidIcons;
                const delay = isInView ? index * 100 : 0;

                return (
                  <div
                    key={index}
                    className={`
                      p-2 rounded-full transition-all duration-500
                      ${isUnpaid
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-primary/10 text-primary'
                      }
                    `}
                    style={{
                      transitionDelay: `${delay}ms`,
                      opacity: isInView ? 1 : 0,
                      transform: isInView ? 'scale(1)' : 'scale(0.5)',
                    }}
                  >
                    <User className="w-5 h-5" />
                  </div>
                );
              })}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="text-sm">{t('stats.agriculture.tooltip')}</p>
          </TooltipContent>
        </Tooltip>

        {/* Legend */}
        <div className="flex justify-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">
              {t('stats.agriculture.paid')} (59%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted" />
            <span className="text-xs text-muted-foreground">
              {t('stats.agriculture.unpaid')} (41%)
            </span>
          </div>
        </div>

        {/* Comparison Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center px-3 py-1 bg-green-500/10 rounded-full">
            <span className="text-xs font-medium text-green-700">
              {t('stats.agriculture.compare')}
            </span>
          </div>
        </div>

        {/* Expanded Details */}
        <div
          className={`
            overflow-hidden transition-all duration-300
            ${isExpanded ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/10">
            <p className="text-sm text-muted-foreground">
              {t('stats.agriculture.tooltip')}
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

export default AgricultureChart;
