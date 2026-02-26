import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
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
    const fetchRecentActivities = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, title_en, excerpt, excerpt_en, featured_image, slug, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching activities:', error);
      } else {
        setArticles(data || []);
      }
      setIsLoading(false);
    };

    fetchRecentActivities();
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

  // Default hero content when no articles
  if (isLoading || articles.length === 0) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
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
              <Link to="/doacoes">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/50 hover:bg-primary/10 px-8">
                  {t('hero.cta_support')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
          <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {articles.map((article, index) => {
        const title = language === 'en' && article.title_en ? article.title_en : article.title;
        const excerpt = language === 'en' && article.excerpt_en ? article.excerpt_en : article.excerpt;
        
        return (
          <div
            key={article.id}
            className={cn(
              'absolute inset-0',
              prefersReducedMotion.current
                ? (index === currentSlide ? 'opacity-100' : 'opacity-0')
                : cn(
                    'transition-all duration-700 ease-in-out',
                    index === currentSlide
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105'
                  )
            )}
          >
            {/* Background Image with lazy loading */}
            {article.featured_image && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${article.featured_image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/70 to-foreground/85" />
              </div>
            )}
            {!article.featured_image && (
              <div className="absolute inset-0 gradient-primary opacity-90" />
            )}

            {/* Content */}
            <div className="relative h-full flex items-center justify-center pt-20">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center text-background">
                  {/* Institutional micro-copy */}
                  <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2 text-background/70">
                    {t('hero.our_work')}
                  </span>
                  
                  {/* Activities badge */}
                  <span className="block text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 bg-primary/90 text-primary-foreground px-4 py-1.5 rounded-full shadow-lg mx-auto w-fit">
                    {t('hero.activities_label')}
                  </span>
                  
                  {/* Title */}
                  <h1 
                    className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight px-2"
                    style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
                  >
                    {title}
                  </h1>
                  
                  {excerpt && (
                    <p 
                      className="text-base sm:text-lg md:text-xl opacity-95 mb-8 max-w-2xl mx-auto leading-relaxed px-4"
                      style={{ textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}
                    >
                      {excerpt}
                    </p>
                  )}
                  
                  <Link to={`/noticias/${article.slug}`}>
                    <Button
                      size="lg"
                      className="bg-background text-primary hover:bg-background/90 hover:scale-105 transition-all duration-300 px-8 shadow-xl"
                    >
                      {t('hero.view_activity')}
                    </Button>
                  </Link>
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
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center text-background hover:bg-background/40 transition-all duration-300 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center text-background hover:bg-background/40 transition-all duration-300 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </>
      )}

      {/* Progress dots */}
      {articles.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300 relative overflow-hidden',
                index === currentSlide
                  ? 'w-10 bg-background/30'
                  : 'w-2 bg-background/50 hover:bg-background/75'
              )}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentSlide && !prefersReducedMotion.current && (
                <span 
                  className="absolute inset-0 bg-background origin-left animate-progress"
                  style={{ animationDuration: '6s' }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default HeroSlider;
