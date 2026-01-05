import { cn } from '@/lib/utils';
import useScrollAnimation from '@/hooks/useScrollAnimation';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  description,
  align = 'center',
  className,
}: SectionHeaderProps) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={cn(
        'mb-12 transition-all duration-700',
        align === 'center' ? 'text-center' : 'text-left',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className
      )}
    >
      {subtitle && (
        <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          {subtitle}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        <span className="gradient-text">{title}</span>
      </h2>
      {description && (
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;
