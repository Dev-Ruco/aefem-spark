import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatsCard } from '@/components/admin/StatsCard';
import { FileText, Users, Mail, MessageSquare, Eye, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { pt } from 'date-fns/locale';

interface Stats {
  articles: { total: number; published: number; draft: number };
  subscribers: number;
  partners: number;
  unreadMessages: number;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch articles stats
      const { data: articles } = await supabase
        .from('articles')
        .select('id, status, created_at');
      
      const published = articles?.filter(a => a.status === 'published').length || 0;
      const draft = articles?.filter(a => a.status === 'draft').length || 0;

      // Fetch subscribers count
      const { count: subscribersCount } = await supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch partners count
      const { count: partnersCount } = await supabase
        .from('partners')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch unread messages count
      const { count: unreadCount } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      // Fetch recent articles
      const { data: recent } = await supabase
        .from('articles')
        .select('id, title, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Generate chart data (last 6 months)
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        
        const count = articles?.filter(a => {
          const createdAt = new Date(a.created_at);
          return createdAt >= start && createdAt <= end;
        }).length || 0;

        monthlyData.push({
          month: format(date, 'MMM', { locale: pt }),
          articles: count
        });
      }

      setStats({
        articles: { total: articles?.length || 0, published, draft },
        subscribers: subscribersCount || 0,
        partners: partnersCount || 0,
        unreadMessages: unreadCount || 0
      });
      setRecentArticles(recent || []);
      setChartData(monthlyData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-yellow-100 text-yellow-700',
      scheduled: 'bg-blue-100 text-blue-700'
    };
    const labels = {
      published: 'Publicado',
      draft: 'Rascunho',
      scheduled: 'Agendado'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.draft}`}>
        {labels[status as keyof typeof labels] || status}
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
        <StatsCard
          title="Total de Artigos"
          value={stats.articles.total}
          icon={FileText}
          description={`${stats.articles.published} publicados, ${stats.articles.draft} rascunhos`}
        />
        <StatsCard
          title="Subscritores Newsletter"
          value={stats.subscribers}
          icon={Mail}
        />
        <StatsCard
          title="Parceiros Activos"
          value={stats.partners}
          icon={Users}
        />
        <StatsCard
          title="Mensagens Não Lidas"
          value={stats.unreadMessages}
          icon={MessageSquare}
          className={stats.unreadMessages > 0 ? 'border-primary/50' : ''}
        />
      </div>

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
                  <Area 
                    type="monotone" 
                    dataKey="articles" 
                    stroke="hsl(328, 85%, 52%)" 
                    fillOpacity={1} 
                    fill="url(#colorArticles)" 
                    name="Artigos"
                  />
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
                  <div 
                    key={article.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-foreground truncate">
                        {article.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(article.created_at), "d 'de' MMM, yyyy", { locale: pt })}
                      </p>
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(article.status)}
                    </div>
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
