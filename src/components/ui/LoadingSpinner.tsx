import aefemIcon from '@/assets/aefem-icon-optimized.png';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: 'w-8 h-8', ring: 'w-12 h-12', border: 'border-2' },
  md: { icon: 'w-14 h-14', ring: 'w-20 h-20', border: 'border-[3px]' },
  lg: { icon: 'w-20 h-20', ring: 'w-28 h-28', border: 'border-4' },
};

export function LoadingSpinner({ size = 'md', fullScreen = false, className }: LoadingSpinnerProps) {
  const s = sizeMap[size];

  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className="relative flex items-center justify-center">
        {/* Rotating ring */}
        <div
          className={cn(
            s.ring,
            s.border,
            'rounded-full animate-spin border-transparent',
            'border-t-[hsl(328,85%,52%)] border-r-[hsl(288,55%,35%)]'
          )}
          style={{ animationDuration: '2.5s' }}
        />
        {/* Pulsing icon */}
        <img
          src={aefemIcon}
          alt=""
          className={cn(s.icon, 'absolute animate-pulse object-contain')}
          style={{ animationDuration: '2s' }}
        />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}
