import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { toast } from 'sonner';

interface Article {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  categories: { name: string; slug: string } | null;
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          content,
          excerpt,
          featured_image,
          published_at,
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
        await navigator.share({
          title: article?.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado!');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="aspect-video bg-muted rounded-xl" />
              <div className="space-y-3">
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
        <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Artigo não encontrado</h1>
            <p className="text-muted-foreground mb-6">O artigo que procura não existe ou foi removido.</p>
            <Link to="/noticias">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar às Notícias
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
        <title>{article.title} | AEFEM</title>
        <meta name="description" content={article.excerpt || ''} />
      </Helmet>

      <Layout>
        <article className="pt-24 pb-16">
          {/* Hero */}
          <div className="relative">
            {article.featured_image ? (
              <div className="h-[50vh] relative">
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              </div>
            ) : (
              <div className="h-48 gradient-primary" />
            )}
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 -mt-32 relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-2xl shadow-brand-lg p-8 md:p-12">
                {/* Back button */}
                <Link to="/noticias" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar às Notícias
                </Link>

                {/* Category */}
                {article.categories && (
                  <Badge className="mb-4">{article.categories.name}</Badge>
                )}

                {/* Title */}
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  {article.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8 pb-8 border-b">
                  {article.published_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={article.published_at}>
                        {format(new Date(article.published_at), "d 'de' MMMM, yyyy", { locale: pt })}
                      </time>
                    </div>
                  )}
                  {article.profiles?.full_name && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{article.profiles.full_name}</span>
                    </div>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleShare} className="ml-auto">
                    <Share2 className="h-4 w-4 mr-2" />
                    Partilhar
                  </Button>
                </div>

                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary"
                  dangerouslySetInnerHTML={{ __html: article.content || '' }}
                />
              </div>
            </div>
          </div>
        </article>
      </Layout>
    </>
  );
}
