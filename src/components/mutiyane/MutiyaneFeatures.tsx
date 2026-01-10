import { useLanguage } from '@/contexts/LanguageContext';
import { Building2, GraduationCap, Heart, BookOpen, Users, FileText } from 'lucide-react';

export function MutiyaneFeatures() {
  const { t } = useLanguage();

  const sources = [
    {
      icon: Building2,
      title: t('mutiyane.source_institutional'),
      items: [
        t('mutiyane.source_inst_1'),
        t('mutiyane.source_inst_2'),
      ],
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      icon: GraduationCap,
      title: t('mutiyane.source_educational'),
      items: [
        t('mutiyane.source_edu_1'),
        t('mutiyane.source_edu_2'),
      ],
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Heart,
      title: t('mutiyane.source_aefem'),
      items: [
        t('mutiyane.source_aefem_1'),
        t('mutiyane.source_aefem_2'),
      ],
      gradient: 'from-rose-500 to-orange-500',
    },
  ];

  const notUsed = [
    { icon: FileText, text: t('mutiyane.not_unverified') },
    { icon: Users, text: t('mutiyane.not_personal') },
    { icon: BookOpen, text: t('mutiyane.not_internet') },
  ];

  return (
    <div className="w-full">
      {/* Sources Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {sources.map((source, index) => (
          <div
            key={index}
            className="bg-card rounded-2xl p-6 shadow-brand-sm hover:shadow-brand-md transition-all duration-300 border border-border/50"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${source.gradient} flex items-center justify-center mb-4 shadow-lg`}>
              <source.icon className="w-7 h-7 text-white" />
            </div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-3">
              {source.title}
            </h4>
            <ul className="space-y-2">
              {source.items.map((item, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* What is NOT used */}
      <div className="bg-muted/50 rounded-2xl p-6 border border-border">
        <h4 className="font-display text-lg font-semibold text-foreground mb-4">
          {t('mutiyane.not_used_title')}
        </h4>
        <div className="grid sm:grid-cols-3 gap-4">
          {notUsed.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-background rounded-xl p-4 border border-border/50"
            >
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-sm text-muted-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
