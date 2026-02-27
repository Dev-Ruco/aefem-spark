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
import { pt, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';

interface Article {
  id: string;
  title: string;
  title_en: string | null;
  excerpt: string | null;
  excerpt_en: string | null;
  featured_image: string | null;
  slug: string;
  published_at: string | null;
  categories: { name: string; slug: string } | null;
}

export function ActivitiesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          title_en,
          excerpt,
          excerpt_en,
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
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subtitle={t('activities.subtitle')}
          title={t('activities.title')}
          description={t('activities.description')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {isLoading ? (
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
              <ArticleCard key={article.id} article={article} index={index} language={language} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">{t('activities.empty')}</p>
            </div>
          )}
        </div>

        {articles.length > 0 && (
          <div className="mt-12 text-center">
            <Link to="/noticias">
              <Button variant="outline" size="lg" className="group">
                {t('activities.view_all')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function ArticleCard({ article, index, language }: { article: Article; index: number; language: string }) {
  const { ref, isInView } = useScrollAnimation();
  const { t } = useLanguage();
  
  const title = language === 'en' && article.title_en ? article.title_en : article.title;
  const excerpt = language === 'en' && article.excerpt_en ? article.excerpt_en : article.excerpt;
  const dateLocale = language === 'en' ? enUS : pt;

  return (
    <Link to={`/noticias/${article.slug}`}>
      <Card
        ref={ref}
        className={cn(
          'overflow-hidden group cursor-pointer h-full flex flex-col transition-all duration-500 hover:shadow-brand-lg',
          isInView
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        )}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <div className="aspect-video overflow-hidden relative flex-shrink-0">
          {article.featured_image ? (
            <img
              src={article.featured_image}
              alt={title}
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
        <CardContent className="p-6 flex flex-col flex-grow">
          {article.published_at && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
              <Calendar className="h-4 w-4" />
              <time dateTime={article.published_at}>
                {format(new Date(article.published_at), "d 'de' MMMM, yyyy", { locale: dateLocale })}
              </time>
            </div>
          )}
          {/* Title without line-clamp to show full title */}
          <h3 className="font-display text-lg sm:text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {excerpt && (
            <p className="text-muted-foreground line-clamp-3 text-sm flex-grow">
              {excerpt}
            </p>
          )}
          <div className="mt-4 flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
            {t('common.read_more')}
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default ActivitiesSection;
