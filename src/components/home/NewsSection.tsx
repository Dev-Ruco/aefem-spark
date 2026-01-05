import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SectionHeader from '@/components/ui/section-header';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  slug: string;
  published_at: string | null;
  categories: { name: string; slug: string } | null;
}

export function NewsSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          excerpt,
          featured_image,
          slug,
          published_at,
          categories (name, slug)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching articles:', error);
      } else {
        setArticles(data || []);
      }
      setIsLoading(false);
    };

    fetchArticles();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle="Actualizações"
          title="Últimas Notícias"
          description="Fique a par das últimas novidades, eventos e actividades da AEFEM"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loading
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-6 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : articles.length > 0 ? (
            articles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Nenhuma notícia disponível de momento.</p>
            </div>
          )}
        </div>

        {articles.length > 0 && (
          <div className="mt-12 text-center">
            <Link to="/noticias">
              <Button variant="outline" size="lg" className="group">
                Ver Todas as Notícias
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <Link to={`/noticias/${article.slug}`}>
      <Card
        ref={ref}
        className={cn(
          'overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-brand-lg',
          isInView
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        )}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <div className="aspect-video overflow-hidden relative">
          {article.featured_image ? (
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full gradient-primary opacity-80" />
          )}
          {article.categories && (
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
              {article.categories.name}
            </Badge>
          )}
        </div>
        <CardContent className="p-6">
          {article.published_at && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
              <Calendar className="h-4 w-4" />
              <time dateTime={article.published_at}>
                {format(new Date(article.published_at), "d 'de' MMMM, yyyy", { locale: pt })}
              </time>
            </div>
          )}
          <h3 className="font-display text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {article.excerpt}
            </p>
          )}
          <div className="mt-4 flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
            Ler mais
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default NewsSection;
