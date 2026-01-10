import { cn } from '@/lib/utils';

interface PhoneMockupProps {
  imageSrc: string;
  alt: string;
  className?: string;
}

export function PhoneMockup({ imageSrc, alt, className }: PhoneMockupProps) {
  return (
    <div className={cn("relative mx-auto", className)}>
      {/* Phone Frame */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-2 shadow-2xl">
        {/* Top Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-2xl z-10" />
        
        {/* Screen */}
        <div className="relative bg-black rounded-[2.5rem] overflow-hidden">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-black/50 z-20 flex items-center justify-between px-6">
            <span className="text-white text-xs">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 bg-white/80 rounded-sm" />
              <div className="w-3 h-3 border-2 border-white/80 rounded-full" />
            </div>
          </div>
          
          {/* App Content */}
          <img
            src={imageSrc}
            alt={alt}
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/50 rounded-full" />
      </div>
      
      {/* Reflection/Glow Effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-2xl opacity-50 -z-10 rounded-full" />
    </div>
  );
}
