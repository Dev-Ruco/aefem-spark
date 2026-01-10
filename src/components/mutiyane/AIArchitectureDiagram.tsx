import { useLanguage } from '@/contexts/LanguageContext';
import { MessageSquare, Brain, Database, CheckCircle, XCircle, Shield, Lock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AIArchitectureDiagram() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: MessageSquare,
      title: t('mutiyane.step1_title'),
      description: t('mutiyane.step1_desc'),
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Brain,
      title: t('mutiyane.step2_title'),
      description: t('mutiyane.step2_desc'),
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: Database,
      title: t('mutiyane.step3_title'),
      description: t('mutiyane.step3_desc'),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: CheckCircle,
      title: t('mutiyane.step4_title'),
      description: t('mutiyane.step4_desc'),
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const limitations = [
    { icon: XCircle, text: t('mutiyane.limit_internet'), color: 'text-red-500' },
    { icon: XCircle, text: t('mutiyane.limit_learn'), color: 'text-red-500' },
    { icon: XCircle, text: t('mutiyane.limit_create'), color: 'text-red-500' },
    { icon: CheckCircle, text: t('mutiyane.limit_base'), color: 'text-green-500' },
  ];

  const security = [
    { icon: Shield, text: t('mutiyane.security_no_id') },
    { icon: Lock, text: t('mutiyane.security_no_data') },
    { icon: Eye, text: t('mutiyane.security_no_track') },
  ];

  return (
    <div className="w-full">
      {/* Main Flow Diagram */}
      <div className="relative">
        {/* Connection Lines (Desktop) */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-accent/40 to-primary/20 -translate-y-1/2 z-0" />
        
        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Arrow (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                  <div className="w-6 h-6 border-t-2 border-r-2 border-primary/40 rotate-45" />
                </div>
              )}
              
              <div className="bg-card rounded-2xl p-6 shadow-brand-md hover:shadow-brand-lg transition-all duration-300 hover:-translate-y-1 border border-border/50">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={cn(
                  "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg",
                  step.color
                )}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Limitations & Security Box */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        {/* What AI Does NOT Do */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-2xl p-6 border border-red-200/50 dark:border-red-800/50">
          <h4 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            {t('mutiyane.what_not')}
          </h4>
          <div className="space-y-3">
            {limitations.map((limit, index) => (
              <div key={index} className="flex items-center gap-3">
                <limit.icon className={cn("w-5 h-5 flex-shrink-0", limit.color)} />
                <span className="text-sm text-muted-foreground">{limit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Guarantees */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-800/50">
          <h4 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            {t('mutiyane.security_title')}
          </h4>
          <div className="space-y-3">
            {security.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <item.icon className="w-5 h-5 flex-shrink-0 text-green-500" />
                <span className="text-sm text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
