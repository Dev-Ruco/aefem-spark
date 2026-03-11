import { useState } from 'react';
import { Play } from 'lucide-react';
import SectionHeader from '@/components/ui/section-header';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

const YOUTUBE_VIDEO_ID = 'E0uI8f-2P3E';

export function VideosSection() {
  const { ref, isInView } = useScrollAnimation();
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(280 25% 12%), hsl(288 45% 20%))' }}>
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle={t('videos.subtitle')}
          title={t('videos.title')}
          description={t('videos.description')}
          light
        />

        <div
          ref={ref}
          className={cn(
            'max-w-4xl mx-auto transition-all duration-700',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {!isPlaying ? (
              <button
                onClick={() => setIsPlaying(true)}
                className="relative w-full h-full group cursor-pointer"
                aria-label="Reproduzir vídeo"
              >
                <img
                  src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`}
                  alt="AEFEM Video"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                    <Play className="w-9 h-9 ml-1" fill="currentColor" />
                  </div>
                </div>
              </button>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="AEFEM Video"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default VideosSection;
