import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { pt, enUS } from 'date-fns/locale';

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

export function HeroSlider() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const { t, language } = useLanguage();
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, title_en, excerpt, excerpt_en, featured_image, slug, published_at, categories (name, slug)')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(8);

      if (error) {
        console.error('Error fetching articles:', error);
      } else {
        setArticles(data || []);
      }
      setIsLoading(false);
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    if (articles.length === 0 || isPaused || prefersReducedMotion.current) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % articles.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [articles.length, isPaused]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % articles.length);
  }, [articles.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
  }, [articles.length]);

  const dateLocale = language === 'en' ? enUS : pt;
  const dateFormat = language === 'en' ? "MMMM d, yyyy" : "d 'de' MMMM, yyyy";

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="relative mt-[72px] min-h-[500px] h-[70vh]">
        <div className="h-full flex flex-col lg:flex-row">
          <div className="lg:w-[40%] w-full gradient-primary flex items-center justify-center p-8 lg:p-16">
            <div className="space-y-6 w-full max-w-md animate-pulse">
              <div className="h-5 w-24 bg-white/20 rounded-full" />
              <div className="space-y-3">
                <div className="h-10 bg-white/20 rounded w-full" />
                <div className="h-10 bg-white/20 rounded w-3/4" />
              </div>
              <div className="h-4 w-40 bg-white/20 rounded" />
            </div>
          </div>
          <div className="lg:w-[60%] w-full bg-muted flex-1" />
        </div>
      </section>
    );
  }

  // Static fallback when no articles
  if (articles.length === 0) {
    return (
      <section className="relative min-h-[500px] h-[70vh] mt-[72px] flex items-center justify-center overflow-hidden gradient-hero">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-3xl animate-float delay-300" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4 animate-fade-down">
              {t('hero.tagline')}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 animate-fade-up leading-tight">
              {t('hero.title')}{' '}
              <span className="gradient-text">{t('hero.title_highlight')}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-up delay-200 leading-relaxed">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-300">
              <Link to="/sobre">
                <Button size="lg" className="w-full sm:w-auto gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 hover:scale-105 px-8">
                  {t('hero.cta_work')}
                </Button>
              </Link>
              <Link to="/tornar-se-membro">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/50 hover:bg-primary/10 px-8">
                  {t('nav.become_member')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative mt-[72px] min-h-[500px] h-[70vh] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {articles.map((article, index) => {
        const title = language === 'en' && article.title_en ? article.title_en : article.title;
        const isActive = index === currentSlide;

        return (
          <div
            key={article.id}
            className={cn(
              'absolute inset-0',
              prefersReducedMotion.current
                ? (isActive ? 'opacity-100 z-10' : 'opacity-0 z-0')
                : cn(
                    'transition-all duration-700 ease-in-out',
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  )
            )}
          >
            <div className="h-full relative">
              {/* Background — Image on the right side with partial overlap */}
              <div className="absolute top-0 bottom-0 right-0 w-full lg:w-[65%]">
                {article.featured_image ? (
                  <img
                    src={article.featured_image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: 'center 20%' }}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                ) : (
                  <div className="absolute inset-0 gradient-primary opacity-80" />
                )}
              </div>

              {/* Left — Magenta gradient overlay with diagonal cut (desktop only) */}
              <div
                className="relative lg:absolute lg:inset-y-0 lg:left-0 lg:w-[50%] w-full gradient-primary flex items-center z-10 lg:[clip-path:polygon(0_0,100%_0,75%_100%,0_100%)]"
              >
                <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 py-8 lg:py-0">
                  <div className="max-w-lg mx-auto lg:mx-0 space-y-5">
                    {/* Category badge */}
                    {article.categories && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs uppercase tracking-widest font-semibold bg-white/15 text-white border-white/20',
                          prefersReducedMotion.current
                            ? ''
                            : cn(
                                'transition-all duration-500 delay-200',
                                isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                              )
                        )}
                      >
                        {article.categories.name}
                      </Badge>
                    )}

                    {/* Title */}
                    <h1
                      className={cn(
                        'font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight',
                        prefersReducedMotion.current
                          ? ''
                          : cn(
                              'transition-all duration-700 delay-300',
                              isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                            )
                      )}
                    >
                      {title}
                    </h1>

                    {/* Date + Read more */}
                    <div
                      className={cn(
                        'flex items-center gap-4 text-sm',
                        prefersReducedMotion.current
                          ? ''
                          : cn(
                              'transition-all duration-500 delay-500',
                              isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            )
                      )}
                    >
                      {article.published_at && (
                        <span className="flex items-center gap-1.5 text-white/70">
                          <Calendar className="h-3.5 w-3.5" />
                          <time dateTime={article.published_at}>
                            {format(new Date(article.published_at), dateFormat, { locale: dateLocale })}
                          </time>
                        </span>
                      )}
                      <Link
                        to={`/artigo/${article.slug}`}
                        className="inline-flex items-center gap-1 text-white font-bold hover:text-white/80 transition-all duration-300 group"
                      >
                        {t('hero.read_more')}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>

                    {/* Progress dots */}
                    {articles.length > 1 && (
                      <div className="flex gap-2.5 pt-4">
                        {articles.map((_, dotIndex) => (
                          <button
                            key={dotIndex}
                            onClick={() => setCurrentSlide(dotIndex)}
                            className={cn(
                              'h-2 rounded-full transition-all duration-300 relative overflow-hidden',
                              dotIndex === currentSlide
                                ? 'w-10 bg-white/25'
                                : 'w-2 bg-white/20 hover:bg-white/40'
                            )}
                            aria-label={`Go to slide ${dotIndex + 1}`}
                          >
                            {dotIndex === currentSlide && !prefersReducedMotion.current && (
                              <span
                                className="absolute inset-0 bg-white origin-left animate-progress rounded-full"
                                style={{ animationDuration: '6s' }}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {articles.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 lg:left-[calc(40%-60px)] top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center text-background hover:bg-background/40 transition-all duration-300 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </section>
  );
}

export default HeroSlider;
