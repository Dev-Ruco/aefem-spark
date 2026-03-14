import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatsCard } from '@/components/admin/StatsCard';
import { FileText, Users, Mail, MessageSquare, TrendingUp, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { pt } from 'date-fns/locale';

interface Stats {
  articles: { total: number; published: number; draft: number };
  subscribers: number;
  partners: number;
  unreadMessages: number;
}

interface QuotaData {
  id: string;
  amount: number;
  payment_status: string | null;
  reference_month: string;
  payment_date: string | null;
}

interface RecentArticle {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    articles: { total: 0, published: 0, draft: 0 },
    subscribers: 0,
    partners: 0,
    unreadMessages: 0
  });
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [chartData, setChartData] = useState<{ month: string; articles: number }[]>([]);
  const [allQuotas, setAllQuotas] = useState<QuotaData[]>([]);
  const [quotaPeriod, setQuotaPeriod] = useState('1');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [articlesRes, subscribersRes, partnersRes, unreadRes, recentRes, quotasRes] = await Promise.all([
        supabase.from('articles').select('id, status, created_at'),
        supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('partners').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('articles').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('member_quotas').select('id, amount, payment_status, reference_month, payment_date'),
      ]);

      const articles = articlesRes.data || [];
      const published = articles.filter(a => a.status === 'published').length;
      const draft = articles.filter(a => a.status === 'draft').length;

      // Chart data
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        const count = articles.filter(a => {
          const d = new Date(a.created_at);
          return d >= start && d <= end;
        }).length;
        monthlyData.push({ month: format(date, 'MMM', { locale: pt }), articles: count });
      }

      setStats({
        articles: { total: articles.length, published, draft },
        subscribers: subscribersRes.count || 0,
        partners: partnersRes.count || 0,
        unreadMessages: unreadRes.count || 0
      });
      setRecentArticles(recentRes.data || []);
      setChartData(monthlyData);
      setAllQuotas(quotasRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Compute quota stats based on period
  const getQuotaStats = () => {
    const now = new Date();
    const months = parseInt(quotaPeriod);
    let filtered = allQuotas;

    if (months > 0) {
      const cutoff = subMonths(now, months);
      filtered = allQuotas.filter(q => new Date(q.reference_month) >= cutoff);
    }

    const paid = filtered.filter(q => q.payment_status === 'paid');
    const pending = filtered.filter(q => q.payment_status === 'pending');
    const totalPaid = paid.reduce((sum, q) => sum + Number(q.amount), 0);
    const totalPending = pending.reduce((sum, q) => sum + Number(q.amount), 0);

    return { paid: paid.length, pending: pending.length, totalPaid, totalPending };
  };

  const quotaStats = getQuotaStats();

  const currentMonthLabel = format(new Date(), 'MMMM yyyy', { locale: pt });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-yellow-100 text-yellow-700',
      scheduled: 'bg-blue-100 text-blue-700'
    };
    const labels: Record<string, string> = {
      published: 'Publicado',
      draft: 'Rascunho',
      scheduled: 'Agendado'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral do painel administrativo</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total de Artigos" value={stats.articles.total} icon={FileText} description={`${stats.articles.published} publicados, ${stats.articles.draft} rascunhos`} />
        <StatsCard title="Subscritores Newsletter" value={stats.subscribers} icon={Mail} />
        <StatsCard title="Parceiros Activos" value={stats.partners} icon={Users} />
        <StatsCard title="Mensagens Não Lidas" value={stats.unreadMessages} icon={MessageSquare} className={stats.unreadMessages > 0 ? 'border-primary/50' : ''} />
      </div>

      {/* Financial Card */}
      <Card className="border-primary/30">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Quotas de Membros
              </CardTitle>
              <CardDescription>Resumo financeiro — {currentMonthLabel}</CardDescription>
            </div>
            <Select value={quotaPeriod} onValueChange={setQuotaPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Mês actual</SelectItem>
                <SelectItem value="3">Últimos 3 meses</SelectItem>
                <SelectItem value="6">Últimos 6 meses</SelectItem>
                <SelectItem value="12">Últimos 12 meses</SelectItem>
                <SelectItem value="0">Histórico completo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                {quotaStats.totalPaid.toLocaleString('pt-MZ')} MZN
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Pago</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                {quotaStats.totalPending.toLocaleString('pt-MZ')} MZN
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Pendente</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{quotaStats.paid}</p>
              <p className="text-xs text-muted-foreground mt-1">Quotas Pagas</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{quotaStats.pending}</p>
              <p className="text-xs text-muted-foreground mt-1">Quotas Pendentes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Artigos por Mês
            </CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(328, 85%, 52%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(328, 85%, 52%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="articles" stroke="hsl(328, 85%, 52%)" fillOpacity={1} fill="url(#colorArticles)" name="Artigos" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Artigos Recentes
            </CardTitle>
            <CardDescription>Últimos 5 artigos criados</CardDescription>
          </CardHeader>
          <CardContent>
            {recentArticles.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                Ainda não existem artigos.
              </p>
            ) : (
              <div className="space-y-3">
                {recentArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-foreground truncate">{article.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(article.created_at), "d 'de' MMM, yyyy", { locale: pt })}
                      </p>
                    </div>
                    <div className="ml-4">{getStatusBadge(article.status)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
