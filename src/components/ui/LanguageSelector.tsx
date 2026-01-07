import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LanguageSelector({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('pt')}
        className={cn(
          'px-2 py-1 text-xs font-medium',
          language === 'pt' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
        )}
      >
        PT
      </Button>
      <span className="text-muted-foreground/50">|</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('en')}
        className={cn(
          'px-2 py-1 text-xs font-medium',
          language === 'en' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
        )}
      >
        EN
      </Button>
    </div>
  );
}
