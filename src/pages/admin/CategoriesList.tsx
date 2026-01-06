import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DataTable, Column } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar categorias.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const openDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setForm({
        name: category.name,
        slug: category.slug,
        description: category.description || ''
      });
    } else {
      setEditingCategory(null);
      setForm({ name: '', slug: '', description: '' });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.slug.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome e slug são obrigatórios.',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);

    try {
      const categoryData = {
        name: form.name,
        slug: form.slug,
        description: form.description || null
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert(categoryData);

        if (error) {
          if (error.code === '23505') {
            toast({
              title: 'Erro',
              description: 'Já existe uma categoria com este slug.',
              variant: 'destructive'
            });
            return;
          }
          throw error;
        }
      }

      toast({
        title: 'Sucesso',
        description: editingCategory ? 'Categoria actualizada.' : 'Categoria criada.'
      });
      setDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao guardar categoria.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setCategories(categories.filter(c => c.id !== deleteId));
      toast({
        title: 'Sucesso',
        description: 'Categoria eliminada.'
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao eliminar categoria. Verifique se não existem artigos associados.',
        variant: 'destructive'
      });
    } finally {
      setDeleteId(null);
    }
  };

  const columns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Nome',
      render: (cat) => <span className="font-medium">{cat.name}</span>
    },
    {
      key: 'slug',
      header: 'Slug',
      render: (cat) => <code className="text-sm bg-muted px-2 py-1 rounded">{cat.slug}</code>
    },
    {
      key: 'description',
      header: 'Descrição',
      render: (cat) => (
        <span className="text-muted-foreground text-sm truncate max-w-xs block">
          {cat.description || '—'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Categorias</h1>
          <p className="text-muted-foreground mt-1">Gerir categorias de artigos</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <DataTable
        data={categories}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Ainda não existem categorias."
        actions={(category) => (
          <>
            <Button variant="ghost" size="icon" onClick={() => openDialog(category)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDeleteId(category.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      />

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm(prev => ({
                  ...prev,
                  name: e.target.value,
                  slug: editingCategory ? prev.slug : generateSlug(e.target.value)
                }))}
                placeholder="Nome da categoria"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="slug-da-categoria"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição opcional"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    A guardar...
                  </>
                ) : (
                  editingCategory ? 'Actualizar' : 'Criar'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Eliminar Categoria"
        description="Tem a certeza que deseja eliminar esta categoria? Artigos associados perderão a categoria."
        confirmText="Eliminar"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
