import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, FileText, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function PublicationsList() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: publications = [], isLoading } = useQuery({
    queryKey: ['admin-publications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('publications').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-publications'] });
      toast.success('Publicação eliminada');
      setDeleteId(null);
    },
    onError: () => toast.error('Erro ao eliminar publicação'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Publicações</h1>
          <p className="text-muted-foreground">Gerir documentos PDF e publicações</p>
        </div>
        <Link to="/admin/publicacoes/novo">
          <Button className="gradient-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Nova Publicação
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">A carregar...</div>
      ) : publications.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma publicação encontrada</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 font-medium text-sm">Título</th>
                <th className="text-left p-4 font-medium text-sm hidden md:table-cell">Data</th>
                <th className="text-left p-4 font-medium text-sm">Estado</th>
                <th className="text-right p-4 font-medium text-sm">Acções</th>
              </tr>
            </thead>
            <tbody>
              {publications.map((pub) => (
                <tr key={pub.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="font-medium">{pub.title}</span>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-sm text-muted-foreground">
                    {pub.published_at ? format(new Date(pub.published_at), 'dd/MM/yyyy') : '-'}
                  </td>
                  <td className="p-4">
                    <Badge variant={pub.is_active ? 'default' : 'secondary'}>
                      {pub.is_active ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <a href={pub.file_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon"><ExternalLink className="w-4 h-4" /></Button>
                      </a>
                      <Link to={`/admin/publicacoes/${pub.id}`}>
                        <Button variant="ghost" size="icon"><Pencil className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteId(pub.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Eliminar Publicação"
        description="Tem a certeza que deseja eliminar esta publicação? Esta acção não pode ser revertida."
      />
    </div>
  );
}
