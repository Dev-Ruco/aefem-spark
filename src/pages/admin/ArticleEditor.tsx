import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Category {
  id: string;
  name: string;
}

interface ArticleForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category_id: string;
  status: 'draft' | 'published' | 'scheduled';
  is_featured: boolean;
  scheduled_at: string;
}

export default function ArticleEditor() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<ArticleForm>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category_id: '',
    status: 'draft',
    is_featured: false,
    scheduled_at: ''
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchArticle();
    }
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');
    setCategories(data || []);
  };

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setForm({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || '',
        content: data.content || '',
        featured_image: data.featured_image || '',
        category_id: data.category_id || '',
        status: data.status,
        is_featured: data.is_featured || false,
        scheduled_at: data.scheduled_at || ''
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Artigo não encontrado.',
        variant: 'destructive'
      });
      navigate('/admin/artigos');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title)
    }));
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

    if (!form.slug.trim()) {
      toast({
        title: 'Erro',
        description: 'O slug é obrigatório.',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);

    try {
      const articleData = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        content: form.content || null,
        featured_image: form.featured_image || null,
        category_id: form.category_id || null,
        status: form.status,
        is_featured: form.is_featured,
        scheduled_at: form.status === 'scheduled' ? form.scheduled_at : null,
        published_at: form.status === 'published' ? new Date().toISOString() : null,
        author_id: user?.id || ''
      };

      if (isEditing) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([articleData]);

        if (error) {
          if (error.code === '23505') {
            toast({
              title: 'Erro',
              description: 'Já existe um artigo com este slug.',
              variant: 'destructive'
            });
            return;
          }
          throw error;
        }
      }

      toast({
        title: 'Sucesso',
        description: isEditing ? 'Artigo actualizado com sucesso.' : 'Artigo criado com sucesso.'
      });
      navigate('/admin/artigos');
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao guardar artigo.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
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
          <Link to="/admin/artigos">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            {isEditing ? 'Editar Artigo' : 'Novo Artigo'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? 'Actualizar informações do artigo' : 'Criar um novo artigo'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Título do artigo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-do-artigo"
                />
                <p className="text-xs text-muted-foreground">
                  URL: /artigo/{form.slug || 'slug-do-artigo'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  value={form.excerpt}
                  onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Breve descrição do artigo"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Conteúdo</Label>
                <RichTextEditor
                  content={form.content}
                  onChange={(content) => setForm(prev => ({ ...prev, content }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={form.status}
                  onValueChange={(value: 'draft' | 'published' | 'scheduled') => 
                    setForm(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.status === 'scheduled' && (
                <div className="space-y-2">
                  <Label htmlFor="scheduled_at">Data de Publicação</Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    value={form.scheduled_at}
                    onChange={(e) => setForm(prev => ({ ...prev, scheduled_at: e.target.value }))}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={form.category_id}
                  onValueChange={(value) => setForm(prev => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured">Artigo em Destaque</Label>
                <Switch
                  id="is_featured"
                  checked={form.is_featured}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, is_featured: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imagem de Destaque</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                bucket="articles"
                currentImage={form.featured_image}
                onUpload={(url) => setForm(prev => ({ ...prev, featured_image: url }))}
                onRemove={() => setForm(prev => ({ ...prev, featured_image: '' }))}
              />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                A guardar...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Actualizar' : 'Criar'} Artigo
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
