import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { User, CreditCard, Bell, LogOut, Loader2, Briefcase, Pencil, MessageCircle, UserX } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface MemberData {
  id: string;
  full_name: string;
  province: string;
  whatsapp_number: string;
  status: string;
  created_at: string;
  profession: string | null;
  age: number | null;
}

interface Quota {
  id: string;
  amount: number;
  reference_month: string;
  payment_status: string | null;
  payment_date: string | null;
}

const provinces = [
  'Maputo Cidade', 'Maputo Província', 'Gaza', 'Inhambane',
  'Sofala', 'Manica', 'Tete', 'Zambézia', 'Nampula', 'Niassa', 'Cabo Delgado',
];

export default function MemberDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [member, setMember] = useState<MemberData | null>(null);
  const [quotas, setQuotas] = useState<Quota[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [whatsappGroupLink, setWhatsappGroupLink] = useState('');
  const [editForm, setEditForm] = useState({ full_name: '', profession: '', whatsapp_number: '', province: '' });

  useEffect(() => {
    if (!authLoading && !user) navigate('/membro/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchMemberData();
  }, [user]);

  const fetchMemberData = async () => {
    if (!user) return;
    const [memberRes, settingsRes] = await Promise.all([
      supabase.from('members').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('site_settings' as any).select('value').eq('key', 'whatsapp_group_link').maybeSingle(),
    ]);

    if (memberRes.data) {
      const m = memberRes.data;
      setMember(m);
      setEditForm({ full_name: m.full_name, profession: m.profession || '', whatsapp_number: m.whatsapp_number, province: m.province });
      const { data: quotaData } = await supabase
        .from('member_quotas').select('*').eq('member_id', m.id)
        .order('reference_month', { ascending: false }).limit(12);
      setQuotas(quotaData || []);
    }
    if (settingsRes.data) setWhatsappGroupLink((settingsRes.data as any).value || '');
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleEditProfile = async () => {
    if (!member) return;
    setIsUpdating(true);
    const { error } = await supabase.from('members').update({
      full_name: editForm.full_name.trim(),
      profession: editForm.profession.trim() || null,
      whatsapp_number: editForm.whatsapp_number.trim(),
      province: editForm.province,
    }).eq('id', member.id);
    if (!error) {
      setMember({ ...member, ...editForm, profession: editForm.profession || null });
      setEditOpen(false);
    }
    setIsUpdating(false);
  };

  const handleLeave = async () => {
    if (!member) return;
    await supabase.from('members').update({ status: 'inactive' }).eq('id', member.id);
    await supabase.auth.signOut();
    navigate('/');
  };

  if (authLoading || isLoading) {
    return <Layout><div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  }

  if (!member) {
    return (
      <Layout>
        <div className="pt-32 pb-20 min-h-screen">
          <div className="container mx-auto px-4 text-center space-y-4">
            <h1 className="font-display text-2xl font-bold">Perfil de membro não encontrado</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              A sua conta de utilizador não está associada a um perfil de membro.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/tornar-se-membro')}>Completar Registo</Button>
              <Button variant="outline" onClick={handleLogout}>Sair</Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet><title>Painel de Membro | AEFEM</title></Helmet>
      <Layout>
        <section className="pt-28 pb-20 min-h-screen bg-secondary/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold">
                  Olá, {member.full_name.split(' ')[0]}!
                </h1>
                <p className="text-muted-foreground">Bem-vindo à sua área de membro</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />Sair
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Profile */}
              <Card className="md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />O Meu Perfil
                    </span>
                    <Button size="sm" variant="ghost" onClick={() => setEditOpen(true)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{member.full_name}</p>
                  </div>
                  {member.profession && (
                    <div>
                      <p className="text-sm text-muted-foreground">Profissão</p>
                      <p className="font-medium flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" /> {member.profession}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {member.age && (
                      <div>
                        <p className="text-sm text-muted-foreground">Idade</p>
                        <p className="font-medium">{member.age} anos</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Província</p>
                      <p className="font-medium">{member.province}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">WhatsApp</p>
                      <p className="font-medium">{member.whatsapp_number}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Membro desde</p>
                    <p className="font-medium">
                      {format(new Date(member.created_at), "MMMM 'de' yyyy", { locale: pt })}
                    </p>
                  </div>
                  <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                    {member.status === 'active' ? 'Activo' : 'Pendente'}
                  </Badge>
                </CardContent>
              </Card>

              {/* Quotas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />Quotas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {quotas.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma quota registada.</p>
                  ) : (
                    <div className="space-y-3">
                      {quotas.slice(0, 6).map((q) => (
                        <div key={q.id} className="flex justify-between items-center">
                          <span className="text-sm">{format(new Date(q.reference_month), 'MMM yyyy', { locale: pt })}</span>
                          <Badge variant={q.payment_status === 'paid' ? 'default' : 'destructive'}>
                            {q.payment_status === 'paid' ? 'Pago' : 'Pendente'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-4">Quota mensal: 500 MT</p>
                </CardContent>
              </Card>

              {/* Info + WhatsApp Community */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />Informações
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>Para a manutenção das actividades da AEFEM, o pagamento da quota mensal de 500 MT deve ser efectuado entre os dias 25 e 5 do mês seguinte.</p>
                  <p className="text-xs">Integração M-Pesa em breve disponível.</p>
                </CardContent>
              </Card>
            </div>

            {/* WhatsApp Community */}
            {whatsappGroupLink && (
              <Card className="mt-6 border-[#25D366]/30 bg-[#25D366]/5">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <MessageCircle className="h-10 w-10 text-[#25D366] flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-lg">Comunidade AEFEM</h3>
                      <p className="text-sm text-muted-foreground">
                        Junte-se ao grupo oficial de WhatsApp das membros da AEFEM, onde mulheres de todo o país partilham experiências, conhecimento e oportunidades para o empoderamento feminino.
                      </p>
                    </div>
                    <a href={whatsappGroupLink} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-[#25D366] hover:bg-[#1da851] text-white">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Entrar no Grupo
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leave association */}
            <div className="mt-12 text-center">
              <button
                onClick={() => setLeaveOpen(true)}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors underline"
              >
                <UserX className="h-3 w-3 inline mr-1" />
                Deixar de ser membro
              </button>
            </div>
          </div>
        </section>
      </Layout>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>Actualize os seus dados pessoais</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={editForm.full_name} onChange={(e) => setEditForm(f => ({ ...f, full_name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Profissão</Label>
              <Input value={editForm.profession} onChange={(e) => setEditForm(f => ({ ...f, profession: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input value={editForm.whatsapp_number} onChange={(e) => setEditForm(f => ({ ...f, whatsapp_number: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Província</Label>
              <Select value={editForm.province} onValueChange={(v) => setEditForm(f => ({ ...f, province: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {provinces.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleEditProfile} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Confirmation */}
      <ConfirmDialog
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        title="Deixar de ser membro"
        description="Tem a certeza que deseja deixar de ser membro da AEFEM? A sua conta será desactivada e perderá acesso à área de membro."
        confirmText="Sim, desejo sair"
        onConfirm={handleLeave}
        variant="destructive"
      />
    </>
  );
}
