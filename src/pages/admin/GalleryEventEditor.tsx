import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { ArrowLeft, Save, Loader2, Upload, X, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
}

interface EventForm {
  title: string;
  description: string;
  event_date: string;
  cover_image: string;
}

export default function GalleryEventEditor() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>({
    title: '',
    description: '',
    event_date: '',
    cover_image: ''
  });

  useEffect(() => {
    if (isEditing) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setForm({
        title: data.title,
        description: data.description || '',
        event_date: data.event_date || '',
        cover_image: data.cover_image || ''
      });

      // Fetch images
      const { data: imagesData } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('event_id', id)
        .order('display_order');

      setImages(imagesData || []);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Evento não encontrado.',
        variant: 'destructive'
      });
      navigate('/admin/galeria');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast({
        title: 'Erro',
        description: 'O título é obrigatório.',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);

    try {
      const eventData = {
        title: form.title,
        description: form.description || null,
        event_date: form.event_date || null,
        cover_image: form.cover_image || null
      };

      if (isEditing) {
        const { error } = await supabase
          .from('gallery_events')
          .update(eventData)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('gallery_events')
          .insert(eventData)
          .select()
          .single();

        if (error) throw error;

        // Redirect to edit page to add images
        toast({
          title: 'Sucesso',
          description: 'Evento criado. Agora pode adicionar imagens.'
        });
        navigate(`/admin/galeria/${data.id}`);
        return;
      }

      toast({
        title: 'Sucesso',
        description: 'Evento actualizado com sucesso.'
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao guardar evento.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !id) return;

    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: 'Aviso',
            description: `${file.name} excede 5MB e foi ignorado.`,
            variant: 'destructive'
          });
          continue;
        }

        // Upload to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(fileName);

        // Insert into database
        const { data: imageData, error: insertError } = await supabase
          .from('gallery_images')
          .insert({
            event_id: id,
            image_url: publicUrl,
            display_order: images.length + i
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setImages(prev => [...prev, imageData]);
      }

      toast({
        title: 'Sucesso',
        description: 'Imagens carregadas com sucesso.'
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar imagens.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteImage = async () => {
    if (!deleteImageId) return;

    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', deleteImageId);

      if (error) throw error;

      setImages(images.filter(img => img.id !== deleteImageId));
      toast({
        title: 'Sucesso',
        description: 'Imagem eliminada.'
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao eliminar imagem.',
        variant: 'destructive'
      });
    } finally {
      setDeleteImageId(null);
    }
  };

  const updateCaption = async (imageId: string, caption: string) => {
    try {
      await supabase
        .from('gallery_images')
        .update({ caption })
        .eq('id', imageId);

      setImages(images.map(img => 
        img.id === imageId ? { ...img, caption } : img
      ));
    } catch (error: any) {
      console.error('Error updating caption:', error);
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/galeria">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            {isEditing ? 'Editar Evento' : 'Novo Evento'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? 'Actualizar evento e gerir imagens' : 'Criar um novo evento na galeria'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Details */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Detalhes do Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nome do evento"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do evento"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_date">Data do Evento</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={form.event_date}
                  onChange={(e) => setForm(prev => ({ ...prev, event_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Imagem de Capa</Label>
                <ImageUploader
                  bucket="gallery"
                  currentImage={form.cover_image}
                  onUpload={(url) => setForm(prev => ({ ...prev, cover_image: url }))}
                  onRemove={() => setForm(prev => ({ ...prev, cover_image: '' }))}
                  aspectRatio="video"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    A guardar...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? 'Actualizar' : 'Criar'} Evento
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Images */}
        {isEditing && (
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Imagens ({images.length})</CardTitle>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                <Button disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      A carregar...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Carregar Imagens
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {images.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Ainda não existem imagens neste evento.</p>
                  <p className="text-sm mt-1">Carregue imagens usando o botão acima.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="group relative">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={image.image_url} 
                          alt={image.caption || ''}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setDeleteImageId(image.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Input
                        value={image.caption || ''}
                        onChange={(e) => updateCaption(image.id, e.target.value)}
                        placeholder="Legenda"
                        className="mt-2 text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteImageId}
        onOpenChange={() => setDeleteImageId(null)}
        title="Eliminar Imagem"
        description="Tem a certeza que deseja eliminar esta imagem?"
        confirmText="Eliminar"
        onConfirm={handleDeleteImage}
        variant="destructive"
      />
    </div>
  );
}
