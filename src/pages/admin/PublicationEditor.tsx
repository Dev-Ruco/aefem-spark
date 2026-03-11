import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function PublicationEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [fileUrl, setFileUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      supabase.from('publications').select('*').eq('id', id).single().then(({ data, error }) => {
        if (error || !data) return;
        setTitle(data.title);
        setTitleEn(data.title_en || '');
        setDescription(data.description || '');
        setDescriptionEn(data.description_en || '');
        setIsActive(data.is_active);
        setFileUrl(data.file_url);
        setThumbnailUrl(data.thumbnail_url || '');
      });
    }
  }, [id, isEditing]);

  const uploadFile = async (file: File, folder: string) => {
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}.${ext}`;
    setUploading(true);
    const { error } = await supabase.storage.from('publications').upload(fileName, file);
    setUploading(false);
    if (error) { toast.error('Erro no upload'); return null; }
    const { data } = supabase.storage.from('publications').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, 'pdfs');
    if (url) setFileUrl(url);
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, 'thumbnails');
    if (url) setThumbnailUrl(url);
  };

  const handleSave = async () => {
    if (!title || !fileUrl) {
      toast.error('Título e ficheiro PDF são obrigatórios');
      return;
    }

    setSaving(true);
    const payload = {
      title,
      title_en: titleEn || null,
      description: description || null,
      description_en: descriptionEn || null,
      file_url: fileUrl,
      thumbnail_url: thumbnailUrl || null,
      is_active: isActive,
    };

    let error;
    if (isEditing) {
      ({ error } = await supabase.from('publications').update(payload).eq('id', id));
    } else {
      ({ error } = await supabase.from('publications').insert(payload));
    }

    setSaving(false);
    if (error) {
      toast.error('Erro ao guardar publicação');
    } else {
      toast.success(isEditing ? 'Publicação actualizada' : 'Publicação criada');
      navigate('/admin/publicacoes');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/publicacoes')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-display font-bold">
          {isEditing ? 'Editar Publicação' : 'Nova Publicação'}
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Detalhes</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Título (PT) *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título da publicação" />
              </div>
              <div>
                <Label>Título (EN)</Label>
                <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="Publication title" />
              </div>
              <div>
                <Label>Descrição (PT)</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descrição da publicação" rows={3} />
              </div>
              <div>
                <Label>Descrição (EN)</Label>
                <Textarea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} placeholder="Brief description" rows={3} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Ficheiro PDF *</CardTitle></CardHeader>
            <CardContent>
              {fileUrl ? (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mb-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-sm truncate flex-1">PDF carregado</span>
                </div>
              ) : null}
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{uploading ? 'A carregar...' : 'Carregar PDF'}</span>
                <input type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" disabled={uploading} />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Thumbnail</CardTitle></CardHeader>
            <CardContent>
              {thumbnailUrl && (
                <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-32 object-cover rounded-lg mb-3" />
              )}
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{uploading ? 'A carregar...' : 'Carregar imagem'}</span>
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" disabled={uploading} />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Definições</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label>Publicação activa</Label>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={saving} className="w-full gradient-primary text-primary-foreground">
            {saving ? 'A guardar...' : 'Guardar Publicação'}
          </Button>
        </div>
      </div>
    </div>
  );
}
