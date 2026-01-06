import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Download, UserMinus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export default function NewsletterList() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
      setFilteredSubscribers(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar subscritores.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredSubscribers(subscribers);
      return;
    }
    
    const filtered = subscribers.filter(sub => 
      sub.email.toLowerCase().includes(query.toLowerCase()) ||
      sub.name?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSubscribers(filtered);
  };

  const handleDeactivate = async () => {
    if (!deactivateId) return;

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ 
          is_active: false,
          unsubscribed_at: new Date().toISOString()
        })
        .eq('id', deactivateId);

      if (error) throw error;

      setSubscribers(subscribers.map(sub => 
        sub.id === deactivateId 
          ? { ...sub, is_active: false, unsubscribed_at: new Date().toISOString() }
          : sub
      ));
      setFilteredSubscribers(filteredSubscribers.map(sub => 
        sub.id === deactivateId 
          ? { ...sub, is_active: false, unsubscribed_at: new Date().toISOString() }
          : sub
      ));

      toast({
        title: 'Sucesso',
        description: 'Subscritor desactivado.'
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao desactivar subscritor.',
        variant: 'destructive'
      });
    } finally {
      setDeactivateId(null);
    }
  };

  const exportToCSV = () => {
    const activeSubscribers = subscribers.filter(sub => sub.is_active);
    const csv = [
      ['Email', 'Nome', 'Data de Subscrição'].join(','),
      ...activeSubscribers.map(sub => [
        sub.email,
        sub.name || '',
        format(new Date(sub.subscribed_at), 'yyyy-MM-dd')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `subscritores-newsletter-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();

    toast({
      title: 'Sucesso',
      description: `Exportados ${activeSubscribers.length} subscritores.`
    });
  };

  const columns: Column<Subscriber>[] = [
    {
      key: 'email',
      header: 'Email',
      render: (sub) => <span className="font-medium">{sub.email}</span>
    },
    {
      key: 'name',
      header: 'Nome',
      render: (sub) => (
        <span className="text-muted-foreground">{sub.name || '—'}</span>
      )
    },
    {
      key: 'subscribed_at',
      header: 'Data',
      render: (sub) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(sub.subscribed_at), "d MMM yyyy", { locale: pt })}
        </span>
      )
    },
    {
      key: 'is_active',
      header: 'Estado',
      render: (sub) => (
        <Badge variant={sub.is_active ? 'default' : 'secondary'}>
          {sub.is_active ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    }
  ];

  const activeCount = subscribers.filter(s => s.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Newsletter</h1>
          <p className="text-muted-foreground mt-1">
            {activeCount} subscritores activos de {subscribers.length} total
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline" disabled={activeCount === 0}>
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      <DataTable
        data={filteredSubscribers}
        columns={columns}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Pesquisar por email ou nome..."
        onSearch={handleSearch}
        emptyMessage="Ainda não existem subscritores."
        actions={(subscriber) => (
          subscriber.is_active && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setDeactivateId(subscriber.id)}
              title="Desactivar"
            >
              <UserMinus className="h-4 w-4" />
            </Button>
          )
        )}
      />

      <ConfirmDialog
        open={!!deactivateId}
        onOpenChange={() => setDeactivateId(null)}
        title="Desactivar Subscritor"
        description="Tem a certeza que deseja desactivar este subscritor? Não receberá mais emails da newsletter."
        confirmText="Desactivar"
        onConfirm={handleDeactivate}
        variant="destructive"
      />
    </div>
  );
}
