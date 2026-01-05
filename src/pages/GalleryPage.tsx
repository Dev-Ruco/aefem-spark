import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import SectionHeader from '@/components/ui/section-header';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface GalleryEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  cover_image: string | null;
  gallery_images: { id: string; image_url: string; caption: string | null }[];
}

export default function GalleryPage() {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [selectedImage, setSelectedImage] = useState<{ url: string; caption: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('gallery_events')
        .select(`
          id,
          title,
          description,
          event_date,
          cover_image,
          gallery_images (id, image_url, caption)
        `)
        .order('event_date', { ascending: false });

      if (error) {
        console.error('Error fetching gallery:', error);
      } else {
        setEvents(data || []);
      }
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <>
      <Helmet>
        <title>Galeria | AEFEM</title>
        <meta name="description" content="Veja fotos dos nossos eventos, formações e actividades de empoderamento feminino." />
      </Helmet>

      <Layout>
        {/* Hero */}
        <section className="pt-32 pb-16 gradient-hero">
          <div className="container mx-auto px-4">
            <SectionHeader
              subtitle="Momentos"
              title="Galeria de Eventos"
              description="Fotografias das nossas actividades, formações e eventos de empoderamento"
            />
          </div>
        </section>

        {/* Gallery */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <CardContent className="p-6 space-y-2">
                      <div className="h-6 bg-muted rounded w-2/3" />
                      <div className="h-4 bg-muted rounded w-1/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : events.length > 0 ? (
              <div className="space-y-16">
                {events.map((event, eventIndex) => (
                  <EventGallery
                    key={event.id}
                    event={event}
                    index={eventIndex}
                    onImageClick={setSelectedImage}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">Nenhuma galeria disponível de momento.</p>
              </div>
            )}
          </div>
        </section>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-background hover:bg-background/10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="max-w-5xl max-h-[90vh] flex flex-col items-center">
              <img
                src={selectedImage.url}
                alt={selectedImage.caption || 'Imagem da galeria'}
                className="max-h-[80vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              {selectedImage.caption && (
                <p className="text-background/80 mt-4 text-center">{selectedImage.caption}</p>
              )}
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}

function EventGallery({
  event,
  index,
  onImageClick,
}: {
  event: GalleryEvent;
  index: number;
  onImageClick: (image: { url: string; caption: string | null }) => void;
}) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      {/* Event Header */}
      <div className="mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">{event.title}</h2>
        {event.event_date && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={event.event_date}>
              {format(new Date(event.event_date), "d 'de' MMMM, yyyy", { locale: pt })}
            </time>
          </div>
        )}
        {event.description && (
          <p className="text-muted-foreground mt-2">{event.description}</p>
        )}
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {event.gallery_images.map((image, imageIndex) => (
          <button
            key={image.id}
            onClick={() => onImageClick({ url: image.image_url, caption: image.caption })}
            className="aspect-square overflow-hidden rounded-lg group cursor-pointer relative"
            style={{ animationDelay: `${imageIndex * 50}ms` }}
          >
            <img
              src={image.image_url}
              alt={image.caption || `Imagem ${imageIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
          </button>
        ))}
      </div>
    </div>
  );
}
