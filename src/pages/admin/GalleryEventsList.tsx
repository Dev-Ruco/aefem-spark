import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Plus, Edit, Trash2, Images, Calendar, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface GalleryEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  cover_image: string | null;
  created_at: string;
  image_count?: number;
}

export default function GalleryEventsList() {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_events')
        .select(`
          *,
          gallery_images (id)
        `)
        .order('event_date', { ascending: false });

      if (error) throw error;

      const eventsWithCount = data?.map(event => ({
        ...event,
        image_count: event.gallery_images?.length || 0
      })) || [];

      setEvents(eventsWithCount);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar eventos.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      // First delete associated images
      await supabase
        .from('gallery_images')
        .delete()
        .eq('event_id', deleteId);

      // Then delete the event
      const { error } = await supabase
        .from('gallery_events')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setEvents(events.filter(e => e.id !== deleteId));
      toast({
        title: 'Sucesso',
        description: 'Evento eliminado com sucesso.'
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao eliminar evento.',
        variant: 'destructive'
      });
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Galeria</h1>
          <p className="text-muted-foreground mt-1">Gerir eventos e imagens da galeria</p>
        </div>
        <Button asChild>
          <Link to="/admin/galeria/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Images className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Ainda não existem eventos na galeria.</p>
            <Button asChild className="mt-4">
              <Link to="/admin/galeria/novo">Criar Primeiro Evento</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-brand-md transition-shadow">
              <div className="aspect-video relative bg-muted">
                {event.cover_image ? (
                  <img 
                    src={event.cover_image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Images className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button variant="secondary" size="icon" asChild className="h-8 w-8">
                    <Link to={`/admin/galeria/${event.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setDeleteId(event.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                {event.description && (
                  <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Images className="h-4 w-4" />
                    <span>{event.image_count} imagens</span>
                  </div>
                  {event.event_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(event.event_date), "d MMM yyyy", { locale: pt })}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Eliminar Evento"
        description="Tem a certeza que deseja eliminar este evento? Todas as imagens associadas serão também eliminadas."
        confirmText="Eliminar"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
