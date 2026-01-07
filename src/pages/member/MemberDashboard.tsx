import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { User, CreditCard, Bell, Calendar, LogOut, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface MemberData {
  id: string;
  full_name: string;
  gender: string;
  birth_year: number;
  province: string;
  whatsapp_number: string;
  status: string;
  created_at: string;
}

interface Quota {
  id: string;
  amount: number;
  reference_month: string;
  payment_status: string;
  payment_date: string | null;
}

export default function MemberDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [member, setMember] = useState<MemberData | null>(null);
  const [quotas, setQuotas] = useState<Quota[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/membro/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchMemberData();
    }
  }, [user]);

  const fetchMemberData = async () => {
    if (!user) return;

    const { data: memberData } = await supabase
      .from('members')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (memberData) {
      setMember(memberData);
      
      const { data: quotaData } = await supabase
        .from('member_quotas')
        .select('*')
        .eq('member_id', memberData.id)
        .order('reference_month', { ascending: false })
        .limit(6);
      
      setQuotas(quotaData || []);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!member) {
    return (
      <Layout>
        <div className="pt-32 pb-20 min-h-screen">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Perfil não encontrado</h1>
            <Button onClick={() => navigate('/tornar-se-membro')}>Completar Registo</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Painel de Membro | AEFEM</title>
      </Helmet>
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
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    O Meu Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{member.full_name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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

              {/* Quotas Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Quotas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {quotas.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma quota registada.</p>
                  ) : (
                    <div className="space-y-3">
                      {quotas.slice(0, 3).map((quota) => (
                        <div key={quota.id} className="flex justify-between items-center">
                          <span className="text-sm">
                            {format(new Date(quota.reference_month), 'MMM yyyy', { locale: pt })}
                          </span>
                          <Badge variant={quota.payment_status === 'paid' ? 'default' : 'destructive'}>
                            {quota.payment_status === 'paid' ? 'Pago' : 'Pendente'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-4">
                    Quota mensal: 500 MT
                  </p>
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Informações
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Para a manutenção das actividades da AEFEM, o pagamento da quota mensal de 500 MT deve ser efectuado entre os dias 25 e 5 do mês seguinte.
                  </p>
                  <p className="text-xs">
                    Integração M-Pesa em breve disponível.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
