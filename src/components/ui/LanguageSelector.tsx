import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export function LanguageSelector({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button
        onClick={() => setLanguage('pt')}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all',
          language === 'pt' ? 'bg-primary/10 ring-1 ring-primary/30' : 'opacity-60 hover:opacity-100'
        )}
        aria-label="Português"
      >
        <span className="text-base leading-none">🇵🇹</span>
        <span className="hidden sm:inline">PT</span>
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all',
          language === 'en' ? 'bg-primary/10 ring-1 ring-primary/30' : 'opacity-60 hover:opacity-100'
        )}
        aria-label="English"
      >
        <span className="text-base leading-none">🇬🇧</span>
        <span className="hidden sm:inline">EN</span>
      </button>
    </div>
  );
}
