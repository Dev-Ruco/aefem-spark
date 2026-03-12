import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { pt, enUS } from 'date-fns/locale';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import RelatedArticles from '@/components/RelatedArticles';

interface Article {
  id: string;
  title: string;
  title_en: string | null;
  content: string | null;
  content_en: string | null;
  excerpt: string | null;
  excerpt_en: string | null;
  featured_image: string | null;
  published_at: string | null;
  categories: { name: string; slug: string } | null;
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from('articles')
        .select(`
          id, title, title_en, content, content_en,
          excerpt, excerpt_en, featured_image, published_at,
          categories (name, slug)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) {
        console.error('Error fetching article:', error);
      } else {
        setArticle(data);
      }
      setIsLoading(false);
    };

    fetchArticle();
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: article?.title, url: window.location.href });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t('article.link_copied'));
    }
  };

  const getTitle = () => {
    if (!article) return '';
    return (language === 'en' && article.title_en) ? article.title_en : article.title;
  };

  const getContent = () => {
    if (!article) return '';
    return (language === 'en' && article.content_en) ? article.content_en : (article.content || '');
  };

  const getExcerpt = () => {
    if (!article) return '';
    return (language === 'en' && article.excerpt_en) ? article.excerpt_en : (article.excerpt || '');
  };

  const dateLocale = language === 'en' ? enUS : pt;
  const dateFormat = language === 'en' ? "MMMM d, yyyy" : "d 'de' MMMM, yyyy";

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-32 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto animate-pulse space-y-8">
              <div className="h-6 bg-muted rounded w-1/4" />
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="aspect-[16/9] bg-muted rounded-xl" />
              <div className="max-w-[720px] mx-auto space-y-4">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="pt-32 pb-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold mb-4">{t('article.not_found_title')}</h1>
            <p className="text-muted-foreground mb-6">{t('article.not_found_desc')}</p>
            <Link to="/noticias">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('article.back')}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${getTitle()} | AEFEM`}</title>
        <meta name="description" content={getExcerpt()} />
        <link rel="canonical" href={`https://www.aefem.org.mz/artigo/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.aefem.org.mz/artigo/${slug}`} />
        <meta property="og:title" content={getTitle()} />
        {article.featured_image && <meta property="og:image" content={article.featured_image} />}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": getTitle(),
          "image": article.featured_image || undefined,
          "datePublished": article.published_at || undefined,
          "publisher": {
            "@type": "NGO",
            "name": "AEFEM",
            "url": "https://www.aefem.org.mz"
          }
        })}</script>
      </Helmet>

      <Layout>
        <article className="pt-32 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Back button */}
              <Link
                to="/noticias"
                className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors text-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('article.back')}
              </Link>

              {/* Category */}
              {article.categories && (
                <Badge className="mb-4">{article.categories.name}</Badge>
              )}

              {/* Title */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                {getTitle()}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-10">
                {article.published_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={article.published_at}>
                      {format(new Date(article.published_at), dateFormat, { locale: dateLocale })}
                    </time>
                  </div>
                )}
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  {t('article.share')}
                </Button>
              </div>

              {/* Featured Image */}
              {article.featured_image && (
                <div className="mb-12">
                  <img
                    src={article.featured_image}
                    alt={getTitle()}
                    className="w-full aspect-[16/9] object-cover object-center rounded-xl"
                  />
                </div>
              )}

              {/* Article Body */}
              <div
                className="max-w-[720px] mx-auto prose prose-lg prose-headings:font-display prose-headings:text-foreground prose-headings:mt-10 prose-headings:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6 prose-a:text-primary prose-img:rounded-lg prose-img:my-8 prose-blockquote:border-primary prose-strong:text-foreground prose-li:text-muted-foreground prose-ul:my-4 prose-ol:my-4"
                dangerouslySetInnerHTML={{ __html: getContent() }}
              />
            </div>
          </div>
        </article>
      </Layout>
    </>
  );
}
