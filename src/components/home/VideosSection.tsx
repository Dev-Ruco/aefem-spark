import { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import SectionHeader from '@/components/ui/section-header';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

const videos = [
  {
    id: '1',
    url: 'https://www.facebook.com/share/v/1CH26Yw5y8/',
    embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fv%2F1CH26Yw5y8%2F&show_text=false',
    titlePt: 'Actividade AEFEM',
    titleEn: 'AEFEM Activity',
  },
  {
    id: '2',
    url: 'https://www.facebook.com/share/r/1BZxss749r/',
    embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fr%2F1BZxss749r%2F&show_text=false',
    titlePt: 'Reel AEFEM',
    titleEn: 'AEFEM Reel',
  },
  {
    id: '3',
    url: 'https://www.facebook.com/share/v/1AoVs95wid/',
    embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fv%2F1AoVs95wid%2F&show_text=false',
    titlePt: 'Actividade AEFEM',
    titleEn: 'AEFEM Activity',
  },
  {
    id: '4',
    url: 'https://www.facebook.com/share/v/1DFvUVYdj7/',
    embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fv%2F1DFvUVYdj7%2F&show_text=false',
    titlePt: 'Actividade AEFEM',
    titleEn: 'AEFEM Activity',
  },
];

export function VideosSection() {
  const { ref, isInView } = useScrollAnimation();
  const { t, language } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null);

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle={t('videos.subtitle')}
          title={t('videos.title')}
          description={t('videos.description')}
        />

        <div
          ref={ref}
          className={cn(
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {videos.map((video, index) => (
            <div
              key={video.id}
              className={cn(
                'group relative cursor-pointer rounded-2xl overflow-hidden bg-card border shadow-sm hover:shadow-lg transition-all duration-500',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: isInView ? `${index * 150}ms` : '0ms' }}
              onClick={() => setSelectedVideo(video)}
            >
              {/* Video thumbnail area with 9:16 aspect ratio */}
              <div className="relative aspect-[9/16] bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-16 h-16 border-2 border-primary/30 rounded-full" />
                  <div className="absolute bottom-8 right-6 w-12 h-12 border-2 border-primary/20 rounded-full" />
                  <div className="absolute top-1/3 right-4 w-8 h-8 bg-primary/10 rounded-full" />
                </div>

                {/* Play button overlay */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                    <Play className="w-7 h-7 ml-1" fill="currentColor" />
                  </div>
                  <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                    {t('videos.watch')}
                  </span>
                </div>

                {/* Facebook badge */}
                <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full p-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </div>

              {/* Video title */}
              <div className="p-4">
                <p className="text-sm font-medium text-foreground truncate">
                  {language === 'pt' ? video.titlePt : video.titleEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-sm sm:max-w-md p-0 bg-black border-none overflow-hidden">
          <DialogTitle className="sr-only">
            {selectedVideo ? (language === 'pt' ? selectedVideo.titlePt : selectedVideo.titleEn) : ''}
          </DialogTitle>
          {selectedVideo && (
            <div className="relative aspect-[9/16] w-full">
              <iframe
                src={selectedVideo.embedUrl}
                className="absolute inset-0 w-full h-full"
                style={{ border: 'none', overflow: 'hidden' }}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default VideosSection;
