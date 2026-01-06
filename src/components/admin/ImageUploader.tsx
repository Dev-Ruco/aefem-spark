import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  bucket: string;
  currentImage?: string | null;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide';
}

export function ImageUploader({ 
  bucket, 
  currentImage, 
  onUpload, 
  onRemove,
  className,
  aspectRatio = 'video'
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const { toast } = useToast();

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[3/1]'
  };

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erro',
        description: 'Por favor selecione uma imagem válida.',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: 'A imagem não pode exceder 5MB.',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onUpload(publicUrl);

      toast({
        title: 'Sucesso',
        description: 'Imagem carregada com sucesso.',
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao carregar imagem.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  }, [bucket, onUpload, toast]);

  const handleRemove = () => {
    setPreview(null);
    onRemove?.();
  };

  return (
    <div className={cn("space-y-2", className)}>
      {preview ? (
        <div className={cn("relative rounded-lg overflow-hidden border border-border bg-muted", aspectClasses[aspectRatio])}>
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Label 
          htmlFor="image-upload" 
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors",
            aspectClasses[aspectRatio],
            isUploading && "pointer-events-none opacity-50"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">A carregar...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-primary/10">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Clique para carregar</p>
                <p className="text-xs text-muted-foreground">PNG, JPG ou WebP (max. 5MB)</p>
              </div>
            </div>
          )}
        </Label>
      )}
      <Input
        id="image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
}
