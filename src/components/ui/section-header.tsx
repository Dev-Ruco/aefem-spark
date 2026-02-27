import { cn } from '@/lib/utils';
import useScrollAnimation from '@/hooks/useScrollAnimation';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  light?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  description,
  align = 'center',
  className,
  light = false,
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
        <span className={cn(
          "inline-block text-sm font-semibold uppercase tracking-wider mb-3",
          light ? "text-white/80" : "text-primary"
        )}>
          {subtitle}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        <span className={light ? "text-white" : "gradient-text"}>{title}</span>
      </h2>
      {description && (
        <p className={cn(
          "text-lg max-w-2xl mx-auto",
          light ? "text-white/70" : "text-muted-foreground"
        )}>
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;
