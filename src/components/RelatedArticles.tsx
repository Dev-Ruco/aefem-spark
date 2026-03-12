import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { pt, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import useEmblaCarousel from 'embla-carousel-react';

interface RelatedArticle {
  id: string;
  title: string;
  title_en: string | null;
  slug: string;
  excerpt: string | null;
  excerpt_en: string | null;
  featured_image: string | null;
  published_at: string | null;
  categories: { name: string; slug: string } | null;
}

interface Props {
  currentArticleId: string;
  categoryId: string | null;
}

export default function RelatedArticles({ currentArticleId, categoryId }: Props) {
  const [articles, setArticles] = useState<RelatedArticle[]>([]);
  const { language, t } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 });

  useEffect(() => {
    const fetchRelated = async () => {
      let results: RelatedArticle[] = [];

      // First try same category
      if (categoryId) {
        const { data } = await supabase
          .from('articles')
          .select('id, title, title_en, slug, excerpt, excerpt_en, featured_image, published_at, categories(name, slug)')
          .eq('status', 'published')
          .eq('category_id', categoryId)
          .neq('id', currentArticleId)
          .order('published_at', { ascending: false })
          .limit(6);
        if (data) results = data as unknown as RelatedArticle[];
      }

      // Fill with recent if needed
      if (results.length < 6) {
        const existingIds = [currentArticleId, ...results.map(a => a.id)];
        const { data } = await supabase
          .from('articles')
          .select('id, title, title_en, slug, excerpt, excerpt_en, featured_image, published_at, categories(name, slug)')
          .eq('status', 'published')
          .not('id', 'in', `(${existingIds.join(',')})`)
          .order('published_at', { ascending: false })
          .limit(6 - results.length);
        if (data) results = [...results, ...(data as unknown as RelatedArticle[])];
      }

      setArticles(results);
    };

    fetchRelated();
  }, [currentArticleId, categoryId]);

  // Auto-scroll
  useEffect(() => {
    if (!emblaApi || articles.length <= 1) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [emblaApi, articles.length]);

  if (articles.length === 0) return null;

  const dateLocale = language === 'en' ? enUS : pt;
  const dateFormat = language === 'en' ? "MMM d, yyyy" : "d MMM yyyy";

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8 text-foreground">
        {language === 'en' ? 'Related Articles' : 'Artigos Relacionados'}
      </h2>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {articles.map((article) => {
            const title = (language === 'en' && article.title_en) ? article.title_en : article.title;
            return (
              <div
                key={article.id}
                className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3 pl-4"
              >
                <Link
                  to={`/noticias/${article.slug}`}
                  className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow h-full"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    {article.featured_image ? (
                      <img
                        src={article.featured_image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        AEFEM
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    {article.categories && (
                      <Badge variant="secondary" className="w-fit text-xs">
                        {article.categories.name}
                      </Badge>
                    )}
                    <h3 className="font-display font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    {article.published_at && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={article.published_at}>
                          {format(new Date(article.published_at), dateFormat, { locale: dateLocale })}
                        </time>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
