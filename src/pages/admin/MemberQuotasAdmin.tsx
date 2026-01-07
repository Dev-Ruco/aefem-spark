import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, addMonths, startOfMonth } from 'date-fns';
import { pt } from 'date-fns/locale';

interface QuotaWithMember {
  id: string;
  member_id: string;
  amount: number;
  reference_month: string;
  payment_status: string | null;
  payment_date: string | null;
  payment_reference: string | null;
  member: {
    full_name: string;
    province: string;
  };
}

interface Member {
  id: string;
  full_name: string;
}

export default function MemberQuotasAdmin() {
  const { toast } = useToast();
  const [quotas, setQuotas] = useState<QuotaWithMember[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [newQuota, setNewQuota] = useState({
    member_id: '',
    reference_month: format(startOfMonth(new Date()), 'yyyy-MM'),
    amount: 500,
    payment_status: 'pending'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [quotasRes, membersRes] = await Promise.all([
      supabase
        .from('member_quotas')
        .select(`
          *,
          member:members(full_name, province)
        `)
        .order('reference_month', { ascending: false }),
      supabase
        .from('members')
        .select('id, full_name')
        .eq('status', 'active')
        .order('full_name')
    ]);

    if (!quotasRes.error) {
      setQuotas(quotasRes.data as QuotaWithMember[] || []);
    }
    if (!membersRes.error) {
      setMembers(membersRes.data || []);
    }
    setIsLoading(false);
  };

  const filteredQuotas = quotas.filter(q => {
    const matchesSearch = q.member?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || q.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: quotas.reduce((acc, q) => acc + q.amount, 0),
    paid: quotas.filter(q => q.payment_status === 'paid').reduce((acc, q) => acc + q.amount, 0),
    pending: quotas.filter(q => q.payment_status !== 'paid').reduce((acc, q) => acc + q.amount, 0),
    count: quotas.length
  };

  const handleAddQuota = async () => {
    if (!newQuota.member_id) {
      toast({ title: 'Erro', description: 'Seleccione um membro.', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('member_quotas')
        .insert({
          member_id: newQuota.member_id,
          reference_month: newQuota.reference_month + '-01',
          amount: newQuota.amount,
          payment_status: newQuota.payment_status,
          payment_date: newQuota.payment_status === 'paid' ? new Date().toISOString() : null
        });

      if (error) throw error;

      toast({ title: 'Sucesso', description: 'Quota registada.' });
      setDialogOpen(false);
      setNewQuota({
        member_id: '',
        reference_month: format(startOfMonth(new Date()), 'yyyy-MM'),
        amount: 500,
        payment_status: 'pending'
      });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const markAsPaid = async (quotaId: string) => {
    const { error } = await supabase
      .from('member_quotas')
      .update({
        payment_status: 'paid',
        payment_date: new Date().toISOString()
      })
      .eq('id', quotaId);

    if (!error) {
      toast({ title: 'Actualizado', description: 'Quota marcada como paga.' });
      fetchData();
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Quotas</h1>
          <p className="text-muted-foreground mt-1">Gestão de quotas dos membros</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Registar Quota
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.count}</p>
                <p className="text-xs text-muted-foreground">Total Quotas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-2xl font-bold">{stats.paid.toLocaleString()} MT</p>
              <p className="text-xs text-muted-foreground">Recebido</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-2xl font-bold">{stats.pending.toLocaleString()} MT</p>
              <p className="text-xs text-muted-foreground">Pendente</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-2xl font-bold">{stats.total.toLocaleString()} MT</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="paid">Pagos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membro</TableHead>
                  <TableHead>Mês Referência</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhuma quota encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuotas.map((quota) => (
                    <TableRow key={quota.id}>
                      <TableCell className="font-medium">
                        {quota.member?.full_name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {format(new Date(quota.reference_month), 'MMMM yyyy', { locale: pt })}
                      </TableCell>
                      <TableCell className="text-right">
                        {quota.amount.toLocaleString()} MT
                      </TableCell>
                      <TableCell>
                        <Badge variant={quota.payment_status === 'paid' ? 'default' : 'destructive'}>
                          {quota.payment_status === 'paid' ? 'Pago' : 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {quota.payment_status !== 'paid' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsPaid(quota.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Marcar Pago
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Quota Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registar Nova Quota</DialogTitle>
            <DialogDescription>Adicionar pagamento de quota de um membro</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Membro *</Label>
              <Select
                value={newQuota.member_id}
                onValueChange={(value) => setNewQuota(prev => ({ ...prev, member_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar membro" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mês de Referência</Label>
              <Input
                type="month"
                value={newQuota.reference_month}
                onChange={(e) => setNewQuota(prev => ({ ...prev, reference_month: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Valor (MT)</Label>
              <Input
                type="number"
                value={newQuota.amount}
                onChange={(e) => setNewQuota(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={newQuota.payment_status}
                onValueChange={(value) => setNewQuota(prev => ({ ...prev, payment_status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddQuota} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Registar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
