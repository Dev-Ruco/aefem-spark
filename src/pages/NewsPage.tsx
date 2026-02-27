import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';
import SectionHeader from '@/components/ui/section-header';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { pt, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
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

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { language, t } = useLanguage();

  const dateLocale = language === 'en' ? enUS : pt;
  const dateFormat = language === 'en' ? "MMMM d, yyyy" : "d 'de' MMMM, yyyy";

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name');
      setCategories(data || []);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      let query = supabase
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
        .order('published_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('categories.slug', selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching articles:', error);
      } else {
        let filteredArticles = data || [];
        
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          filteredArticles = filteredArticles.filter(
            (article) =>
              article.title.toLowerCase().includes(lowerQuery) ||
              article.title_en?.toLowerCase().includes(lowerQuery) ||
              article.excerpt?.toLowerCase().includes(lowerQuery) ||
              article.excerpt_en?.toLowerCase().includes(lowerQuery)
          );
        }
        
        if (selectedCategory) {
          filteredArticles = filteredArticles.filter(
            (article) => article.categories?.slug === selectedCategory
          );
        }
        
        setArticles(filteredArticles);
      }
      setIsLoading(false);
    };

    fetchArticles();
  }, [selectedCategory, searchQuery]);

  const getArticleTitle = (article: Article) => {
    return (language === 'en' && article.title_en) ? article.title_en : article.title;
  };

  const getArticleExcerpt = (article: Article) => {
    return (language === 'en' && article.excerpt_en) ? article.excerpt_en : article.excerpt;
  };

  return (
    <>
      <Helmet>
        <title>{t('newspage.title')} | AEFEM</title>
        <meta name="description" content={t('newspage.meta_desc')} />
      </Helmet>

      <Layout>
        {/* Hero */}
        <section className="pt-32 pb-16 gradient-hero">
          <div className="container mx-auto px-4">
            <SectionHeader
              subtitle={t('newspage.subtitle')}
              title={t('newspage.title')}
              description={t('newspage.description')}
            />

            {/* Search & Filter */}
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('newspage.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {categories.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant={selectedCategory === null ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    {t('newspage.all')}
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.slug ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.slug)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <CardContent className="p-6 space-y-4">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-6 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <Link key={article.id} to={`/noticias/${article.slug}`}>
                    <Card className="overflow-hidden group cursor-pointer h-full transition-all duration-300 hover:shadow-brand-lg">
                      <div className="aspect-video overflow-hidden relative">
                        {article.featured_image ? (
                          <img
                            src={article.featured_image}
                            alt={getArticleTitle(article)}
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
                              {format(new Date(article.published_at), dateFormat, { locale: dateLocale })}
                            </time>
                          </div>
                        )}
                        <h2 className="font-display text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {getArticleTitle(article)}
                        </h2>
                        {getArticleExcerpt(article) && (
                          <p className="text-muted-foreground line-clamp-2 text-sm">
                            {getArticleExcerpt(article)}
                          </p>
                        )}
                        <div className="mt-4 flex items-center text-primary font-medium text-sm">
                          {t('news.read_more')}
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">{t('newspage.no_results')}</p>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
}
