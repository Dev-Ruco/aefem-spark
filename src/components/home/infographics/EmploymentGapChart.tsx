import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { Briefcase, Users } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const EmploymentGapChart = () => {
  const { t } = useLanguage();
  const { ref, isInView } = useScrollAnimation({ threshold: 0.3 });
  const [isExpanded, setIsExpanded] = useState(false);

  const menPercentage = 81;
  const womenPercentage = 30;

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
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground text-lg">
            {t('stats.employment.title')}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {t('stats.employment.question')}
        </p>

        {/* Men Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-foreground">
                {t('stats.employment.men')}
              </span>
            </div>
            <span className="text-lg font-bold text-blue-500">
              {isInView ? menPercentage : 0}%
            </span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: isInView ? `${menPercentage}%` : '0%',
                transitionDelay: '200ms',
              }}
            />
          </div>
        </div>

        {/* Women Bar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {t('stats.employment.women')}
                  </span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {isInView ? womenPercentage : 0}%
                </span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: isInView ? `${womenPercentage}%` : '0%',
                    transitionDelay: '400ms',
                  }}
                />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="text-sm">{t('stats.employment.tooltip')}</p>
          </TooltipContent>
        </Tooltip>

        {/* Expanded Details */}
        <div
          className={`
            overflow-hidden transition-all duration-300
            ${isExpanded ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <p className="text-sm text-muted-foreground">
              {t('stats.employment.tooltip')}
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

export default EmploymentGapChart;
