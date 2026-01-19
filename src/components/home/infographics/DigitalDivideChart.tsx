import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { Wifi, Smartphone, Signal } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const DigitalDivideChart = () => {
  const { t } = useLanguage();
  const { ref, isInView } = useScrollAnimation({ threshold: 0.3 });
  const [isExpanded, setIsExpanded] = useState(false);

  const menPercentage = 33;
  const womenPercentage = 20;
  const smartphonePercentage = 22;
  const totalBars = 10;

  const menBars = Math.round((menPercentage / 100) * totalBars);
  const womenBars = Math.round((womenPercentage / 100) * totalBars);

  const SignalBars = ({ active, total, color }: { active: number; total: number; color: string }) => (
    <div className="flex items-end gap-1 justify-center h-12">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index < active;
        const height = 12 + (index * 4); // Progressive height
        const delay = isInView ? index * 80 : 0;

        return (
          <div
            key={index}
            className={`
              w-2 rounded-sm transition-all duration-500
              ${isActive ? color : 'bg-muted'}
            `}
            style={{
              height: isInView ? `${height}px` : '4px',
              transitionDelay: `${delay}ms`,
            }}
          />
        );
      })}
    </div>
  );

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
        style={{ transitionDelay: '300ms' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Wifi className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-foreground text-lg">
            {t('stats.digital.title')}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {t('stats.digital.description')}
        </p>

        {/* Signal Bars Comparison */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="grid grid-cols-2 gap-6 mb-4">
              {/* Men */}
              <div className="text-center">
                <SignalBars active={menBars} total={totalBars} color="bg-blue-500" />
                <div className="mt-2">
                  <span className="text-2xl font-bold text-blue-500">
                    {isInView ? menPercentage : 0}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('stats.digital.men')}
                </p>
              </div>

              {/* Women */}
              <div className="text-center">
                <SignalBars active={womenBars} total={totalBars} color="bg-primary" />
                <div className="mt-2">
                  <span className="text-2xl font-bold text-primary">
                    {isInView ? womenPercentage : 0}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('stats.digital.women')}
                </p>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="text-sm">{t('stats.digital.tooltip')}</p>
          </TooltipContent>
        </Tooltip>

        {/* Gap Indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-semibold text-destructive px-2">
            {t('stats.digital.gap')} 13%
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Smartphone Badge */}
        <div
          className={`
            flex items-center justify-center gap-2 p-3 rounded-xl
            bg-purple-500/10 transition-all duration-500
          `}
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'scale(1)' : 'scale(0.9)',
            transitionDelay: '600ms',
          }}
        >
          <Smartphone className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-700">
            {smartphonePercentage}% {t('stats.digital.smartphone')}
          </span>
        </div>

        {/* Expanded Details */}
        <div
          className={`
            overflow-hidden transition-all duration-300
            ${isExpanded ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/10">
            <p className="text-sm text-muted-foreground">
              {t('stats.digital.tooltip')}
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

export default DigitalDivideChart;
