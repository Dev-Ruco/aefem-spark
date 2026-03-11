import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Search, Download, Eye, Loader2, Users, UserCheck, Clock, UserPlus, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface Member {
  id: string;
  full_name: string;
  gender: string | null;
  birth_year: number | null;
  province: string;
  whatsapp_number: string;
  status: string | null;
  created_at: string;
  user_id: string | null;
  profession: string | null;
  age: number | null;
}

interface MemberQuota {
  id: string;
  member_id: string;
  payment_status: string | null;
  reference_month: string;
  amount: number;
}

interface Application {
  id: string;
  full_name: string;
  profession: string | null;
  age: number | null;
  whatsapp_number: string;
  province: string;
  access_code: string | null;
  status: string | null;
  created_at: string;
}

const provinces = [
  'Todas', 'Maputo Cidade', 'Maputo Província', 'Gaza', 'Inhambane',
  'Sofala', 'Manica', 'Tete', 'Zambézia', 'Nampula', 'Niassa', 'Cabo Delgado'
];

export default function MembersList() {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [quotas, setQuotas] = useState<MemberQuota[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [appToApprove, setAppToApprove] = useState<Application | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchTerm, provinceFilter, statusFilter]);

  const fetchData = async () => {
    const [membersRes, appsRes, quotasRes] = await Promise.all([
      supabase.from('members').select('*').order('created_at', { ascending: false }),
      supabase.from('membership_applications').select('*').order('created_at', { ascending: false }),
      supabase.from('member_quotas').select('id, member_id, payment_status, reference_month, amount').order('reference_month', { ascending: false }),
    ]);

    setMembers(membersRes.data || []);
    setApplications(appsRes.data || []);
    setQuotas(quotasRes.data || []);
    setIsLoading(false);
  };

  const getLatestQuotaStatus = (memberId: string): { status: string; label: string } => {
    const memberQuotas = quotas.filter(q => q.member_id === memberId);
    if (memberQuotas.length === 0) return { status: 'none', label: 'Sem quota' };
    const latest = memberQuotas[0]; // already sorted desc
    if (latest.payment_status === 'paid') return { status: 'paid', label: 'Paga' };
    if (latest.payment_status === 'pending') return { status: 'pending', label: 'Pendente' };
    return { status: 'overdue', label: 'Em atraso' };
  };

  const filterMembers = () => {
    let filtered = [...members];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(m =>
        m.full_name.toLowerCase().includes(term) || m.whatsapp_number.includes(term)
      );
    }
    if (provinceFilter !== 'Todas') filtered = filtered.filter(m => m.province === provinceFilter);
    if (statusFilter !== 'all') filtered = filtered.filter(m => m.status === statusFilter);
    setFilteredMembers(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Profissão', 'Idade', 'Província', 'WhatsApp', 'Estado', 'Quota', 'Data Registo'];
    const rows = filteredMembers.map(m => {
      const quota = getLatestQuotaStatus(m.id);
      return [
        m.full_name, m.profession || '', m.age?.toString() || '', m.province,
        m.whatsapp_number, m.status || 'pending', quota.label,
        format(new Date(m.created_at), 'dd/MM/yyyy')
      ];
    });
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `membros_aefem_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    toast({ title: 'Exportado', description: `${filteredMembers.length} membros exportados.` });
  };

  const updateStatus = async (memberId: string, newStatus: string) => {
    const { error } = await supabase.from('members').update({ status: newStatus }).eq('id', memberId);
    if (!error) {
      toast({ title: 'Actualizado', description: 'Estado do membro alterado.' });
      fetchData();
    }
  };

  const handleApproveApplication = (app: Application) => {
    setAppToApprove(app);
    setApproveDialogOpen(true);
  };

  const confirmApproveApplication = async () => {
    if (!appToApprove) return;
    setIsApproving(true);

    try {
      // 1. Insert into members table (without user_id — member can link later via auth)
      const { error: memberError } = await supabase.from('members').insert({
        user_id: null as any,
        full_name: appToApprove.full_name,
        profession: appToApprove.profession,
        age: appToApprove.age,
        whatsapp_number: appToApprove.whatsapp_number,
        province: appToApprove.province,
        status: 'active',
      });

      if (memberError) {
        console.error('Error creating member:', memberError);
        toast({ title: 'Erro', description: 'Não foi possível criar o membro.', variant: 'destructive' });
        return;
      }

      // 2. Update application status
      await supabase
        .from('membership_applications')
        .update({ status: 'approved' } as any)
        .eq('id', appToApprove.id);

      toast({ title: 'Candidatura aprovada', description: `${appToApprove.full_name} foi adicionado(a) como membro.` });
      setApproveDialogOpen(false);
      setAppToApprove(null);
      fetchData();
    } catch (err) {
      console.error('Approve error:', err);
      toast({ title: 'Erro', description: 'Erro inesperado.', variant: 'destructive' });
    } finally {
      setIsApproving(false);
    }
  };

  const updateAppStatus = async (appId: string, newStatus: string) => {
    // If approving, use the full approve flow
    const app = applications.find(a => a.id === appId);
    if (newStatus === 'approved' && app) {
      handleApproveApplication(app);
      return;
    }

    const { error } = await supabase
      .from('membership_applications')
      .update({ status: newStatus } as any)
      .eq('id', appId);
    if (!error) {
      toast({ title: 'Actualizado', description: 'Estado da candidatura alterado.' });
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

  const pendingApps = applications.filter(a => a.status === 'pending' || !a.status);
  const quotaBadgeVariant = (status: string) => {
    if (status === 'paid') return 'default';
    if (status === 'pending') return 'secondary';
    return 'outline';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Membros</h1>
          <p className="text-muted-foreground mt-1">
            {members.length} membros registados · {pendingApps.length} candidaturas pendentes
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{members.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{members.filter(m => m.status === 'active').length}</p>
                <p className="text-xs text-muted-foreground">Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{members.filter(m => m.status === 'pending' || !m.status).length}</p>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {quotas.filter(q => q.payment_status === 'paid').length}
                </p>
                <p className="text-xs text-muted-foreground">Quotas pagas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Membros Registados</TabsTrigger>
          <TabsTrigger value="applications">
            Candidaturas {pendingApps.length > 0 && <Badge variant="destructive" className="ml-2 text-xs">{pendingApps.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Pesquisar por nome ou WhatsApp..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                </div>
                <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                  <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Província" /></SelectTrigger>
                  <SelectContent>{provinces.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Estado" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Members Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">Profissão</TableHead>
                      <TableHead className="hidden md:table-cell">Província</TableHead>
                      <TableHead className="hidden sm:table-cell">WhatsApp</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Quota</TableHead>
                      <TableHead className="hidden lg:table-cell">Data</TableHead>
                      <TableHead className="text-right">Acções</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          Nenhum membro encontrado.
                        </TableCell>
                      </TableRow>
                    ) : filteredMembers.map((member) => {
                      const quota = getLatestQuotaStatus(member.id);
                      return (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            <div>
                              <p>{member.full_name}</p>
                              <p className="text-xs text-muted-foreground md:hidden">{member.province}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{member.profession || '—'}</TableCell>
                          <TableCell className="hidden md:table-cell">{member.province}</TableCell>
                          <TableCell className="hidden sm:table-cell">{member.whatsapp_number}</TableCell>
                          <TableCell>
                            <Select value={member.status || 'pending'} onValueChange={(v) => updateStatus(member.id, v)}>
                              <SelectTrigger className="w-28">
                                <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                                  {member.status === 'active' ? 'Activo' : member.status === 'inactive' ? 'Inactivo' : 'Pendente'}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Activo</SelectItem>
                                <SelectItem value="pending">Pendente</SelectItem>
                                <SelectItem value="inactive">Inactivo</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Badge variant={quotaBadgeVariant(quota.status)}>
                              {quota.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {format(new Date(member.created_at), "dd MMM yyyy", { locale: pt })}
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button size="sm" variant="ghost" onClick={() => { setSelectedMember(member); setDetailsOpen(true); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {member.status === 'active' ? (
                              <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-300 hover:bg-yellow-50" onClick={() => updateStatus(member.id, 'inactive')}>
                                Inativar
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50" onClick={() => updateStatus(member.id, 'active')}>
                                Activar
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">Profissão</TableHead>
                      <TableHead className="hidden md:table-cell">Província</TableHead>
                      <TableHead className="hidden sm:table-cell">WhatsApp</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="hidden lg:table-cell">Data</TableHead>
                      <TableHead className="text-right">Acções</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Nenhuma candidatura recebida.
                        </TableCell>
                      </TableRow>
                    ) : applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p>{app.full_name}</p>
                            {app.age && <p className="text-xs text-muted-foreground">{app.age} anos</p>}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{app.profession || '—'}</TableCell>
                        <TableCell className="hidden md:table-cell">{app.province}</TableCell>
                        <TableCell className="hidden sm:table-cell">{app.whatsapp_number}</TableCell>
                        <TableCell>
                          <Badge variant={app.status === 'approved' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'}>
                            {app.status === 'approved' ? 'Aprovada' : app.status === 'rejected' ? 'Rejeitada' : 'Pendente'}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {format(new Date(app.created_at), "dd MMM yyyy", { locale: pt })}
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          {(app.status === 'pending' || !app.status) && (
                            <>
                              <Button size="sm" variant="default" onClick={() => handleApproveApplication(app)}>
                                <UserPlus className="h-4 w-4 mr-1" />
                                Aprovar
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => updateAppStatus(app.id, 'rejected')}>
                                Rejeitar
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approve Confirmation Dialog */}
      <ConfirmDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        title="Aprovar Candidatura"
        description={appToApprove ? `Tem a certeza que deseja aprovar a candidatura de ${appToApprove.full_name}? Os dados serão copiados para a lista de membros registados com estado "Activo".` : ''}
        confirmText={isApproving ? 'A aprovar...' : 'Sim, Aprovar'}
        cancelText="Cancelar"
        onConfirm={confirmApproveApplication}
      />

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Membro</DialogTitle>
            <DialogDescription>Informações completas</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome Completo</p>
                  <p className="font-medium">{selectedMember.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profissão</p>
                  <p className="font-medium">{selectedMember.profession || '—'}</p>
                </div>
                {selectedMember.age && (
                  <div>
                    <p className="text-sm text-muted-foreground">Idade</p>
                    <p className="font-medium">{selectedMember.age} anos</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Província</p>
                  <p className="font-medium">{selectedMember.province}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="font-medium">{selectedMember.whatsapp_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge variant={selectedMember.status === 'active' ? 'default' : 'secondary'}>
                    {selectedMember.status === 'active' ? 'Activo' : 'Pendente'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quota</p>
                  {(() => {
                    const q = getLatestQuotaStatus(selectedMember.id);
                    return <Badge variant={quotaBadgeVariant(q.status)}>{q.label}</Badge>;
                  })()}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conta de login</p>
                  <p className="font-medium">{selectedMember.user_id ? 'Sim' : 'Não'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Data de Registo</p>
                  <p className="font-medium">
                    {format(new Date(selectedMember.created_at), "dd 'de' MMMM 'de' yyyy", { locale: pt })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
