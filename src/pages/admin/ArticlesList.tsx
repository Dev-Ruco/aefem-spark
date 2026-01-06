import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Plus, Edit, Trash2, Eye, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Article {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled';
  is_featured: boolean;
  created_at: string;
  published_at: string | null;
  category_id: string | null;
  categories?: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
}

export default function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = [...articles];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(a => a.category_id === categoryFilter);
    }
    
    setFilteredArticles(filtered);
  }, [articles, statusFilter, categoryFilter]);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id, title, slug, status, is_featured, created_at, published_at, category_id,
          categories (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
      setFilteredArticles(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar artigos.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');
    setCategories(data || []);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setArticles(articles.filter(a => a.id !== deleteId));
      toast({
        title: 'Sucesso',
        description: 'Artigo eliminado com sucesso.'
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao eliminar artigo.',
        variant: 'destructive'
      });
    } finally {
      setDeleteId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      published: 'default',
      draft: 'secondary',
      scheduled: 'outline'
    };
    const labels: Record<string, string> = {
      published: 'Publicado',
      draft: 'Rascunho',
      scheduled: 'Agendado'
    };
    return <Badge variant={variants[status] || 'secondary'}>{labels[status] || status}</Badge>;
  };

  const columns: Column<Article>[] = [
    {
      key: 'title',
      header: 'Título',
      render: (article) => (
        <div className="flex items-center gap-2">
          {article.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
          <span className="font-medium">{article.title}</span>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Categoria',
      render: (article) => (
        <span className="text-muted-foreground">
          {article.categories?.name || '—'}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Estado',
      render: (article) => getStatusBadge(article.status)
    },
    {
      key: 'created_at',
      header: 'Data',
      render: (article) => (
        <span className="text-muted-foreground text-sm">
          {format(new Date(article.created_at), "d MMM yyyy", { locale: pt })}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Artigos</h1>
          <p className="text-muted-foreground mt-1">Gerir notícias e artigos do site</p>
        </div>
        <Button asChild>
          <Link to="/admin/artigos/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo Artigo
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os estados</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
            <SelectItem value="draft">Rascunhos</SelectItem>
            <SelectItem value="scheduled">Agendados</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={filteredArticles}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Ainda não existem artigos."
        actions={(article) => (
          <>
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/artigo/${article.slug}`} target="_blank">
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/admin/artigos/${article.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDeleteId(article.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Eliminar Artigo"
        description="Tem a certeza que deseja eliminar este artigo? Esta acção é irreversível."
        confirmText="Eliminar"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
