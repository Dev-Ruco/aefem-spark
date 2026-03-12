import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, type Locale } from 'date-fns';
import { pt, enUS } from 'date-fns/locale';
import useEmblaCarousel from 'embla-carousel-react';

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

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);
  return isMobile;
}

// ─── Mobile Hero: Editorial Cards Carousel ───────────────────────────

function MobileHeroCards({
  articles,
  language,
  t,
  dateLocale,
  dateFormat,
}: {
  articles: Article[];
  language: string;
  t: (key: string) => string;
  dateLocale: Locale;
  dateFormat: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(timer);
  }, [emblaApi]);

  return (
    <section className="mt-[72px]">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {articles.map((article, index) => {
            const title = language === 'en' && article.title_en ? article.title_en : article.title;
            return (
              <div
                key={article.id}
                className="flex-[0_0_100%] min-w-0"
              >
                <Link to={`/artigo/${article.slug}`} className="block">
                  {/* Image */}
                  <div className="relative aspect-[16/10]">
                    {article.featured_image ? (
                      <img
                        src={article.featured_image}
                        alt={title}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    ) : (
                      <div className="w-full h-full gradient-primary" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
                    {article.categories && (
                      <Badge className="absolute top-3 left-4 text-[10px] uppercase tracking-widest font-semibold gradient-primary text-primary-foreground border-0 shadow-sm">
                        {article.categories.name}
                      </Badge>
                    )}
                  </div>

                  {/* Content block */}
                  <div className="gradient-primary px-5 py-4 space-y-2">
                    <h2 className="font-display text-lg sm:text-xl font-bold text-white leading-snug line-clamp-2">
                      {title}
                    </h2>
                    <div className="flex items-center justify-between text-xs text-white/70">
                      {article.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <time dateTime={article.published_at}>
                            {format(new Date(article.published_at), dateFormat, { locale: dateLocale })}
                          </time>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-white font-semibold">
                        {t('hero.read_more')}
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>

                    {/* Dots inside the gradient block */}
                    {articles.length > 1 && (
                      <div className="flex justify-center gap-1.5 pt-2">
                        {articles.map((_, i) => (
                          <button
                            key={i}
                            onClick={(e) => { e.preventDefault(); emblaApi?.scrollTo(i); }}
                            className={cn(
                              'h-1.5 rounded-full transition-all duration-300',
                              i === selectedIndex
                                ? 'w-6 bg-white'
                                : 'w-1.5 bg-white/30 hover:bg-white/50'
                            )}
                            aria-label={`Go to slide ${i + 1}`}
                          />
                        ))}
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

// ─── Desktop Hero: Split Layout (existing) ───────────────────────────

function DesktopHeroSplit({
  articles,
  currentSlide,
  setCurrentSlide,
  language,
  t,
  dateLocale,
  dateFormat,
  isPaused,
  setIsPaused,
  prefersReducedMotion,
  nextSlide,
  prevSlide,
}: {
  articles: Article[];
  currentSlide: number;
  setCurrentSlide: (n: number) => void;
  language: string;
  t: (key: string) => string;
  dateLocale: Locale;
  dateFormat: string;
  isPaused: boolean;
  setIsPaused: (v: boolean) => void;
  prefersReducedMotion: boolean;
  nextSlide: () => void;
  prevSlide: () => void;
}) {
  return (
    <section
      className="relative mt-[72px] min-h-[500px] h-[70vh] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {articles.map((article, index) => {
        const title = language === 'en' && article.title_en ? article.title_en : article.title;
        const isActive = index === currentSlide;

        return (
          <div
            key={article.id}
            className={cn(
              'absolute inset-0',
              prefersReducedMotion
                ? (isActive ? 'opacity-100 z-10' : 'opacity-0 z-0')
                : cn(
                    'transition-all duration-700 ease-in-out',
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  )
            )}
          >
            <div className="h-full relative">
              <div className="absolute top-0 bottom-0 right-0 w-[65%]">
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

              <div className="absolute inset-y-0 left-0 w-[50%] gradient-primary flex items-center z-10 [clip-path:polygon(0_0,100%_0,75%_100%,0_100%)]">
                <div className="w-full px-14 xl:px-20">
                  <div className="max-w-lg space-y-5">
                    {article.categories && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs uppercase tracking-widest font-semibold bg-white/15 text-white border-white/20',
                          !prefersReducedMotion && cn(
                            'transition-all duration-500 delay-200',
                            isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                          )
                        )}
                      >
                        {article.categories.name}
                      </Badge>
                    )}

                    <h1
                      className={cn(
                        'font-display text-4xl xl:text-5xl font-bold text-white leading-tight',
                        !prefersReducedMotion && cn(
                          'transition-all duration-700 delay-300',
                          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        )
                      )}
                    >
                      {title}
                    </h1>

                    <div
                      className={cn(
                        'flex items-center gap-4 text-sm',
                        !prefersReducedMotion && cn(
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
                            {dotIndex === currentSlide && !prefersReducedMotion && (
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

      {articles.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-[calc(40%-60px)] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center text-background hover:bg-background/40 transition-all duration-300 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </section>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export function HeroSlider() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const { t, language } = useLanguage();
  const prefersReducedMotion = useRef(false);
  const isMobile = useIsMobile();

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

  // Desktop auto-slide
  useEffect(() => {
    if (isMobile || articles.length === 0 || isPaused || prefersReducedMotion.current) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % articles.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [articles.length, isPaused, isMobile]);

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
    return isMobile ? (
      <section className="mt-[72px] pt-4 pb-6 bg-secondary/30">
        <div className="px-4">
          <div className="rounded-2xl overflow-hidden bg-card shadow-brand-md animate-pulse">
            <div className="aspect-[16/10] bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        </div>
      </section>
    ) : (
      <section className="relative mt-[72px] min-h-[500px] h-[70vh]">
        <div className="h-full flex">
          <div className="w-[40%] gradient-primary flex items-center justify-center p-16">
            <div className="space-y-6 w-full max-w-md animate-pulse">
              <div className="h-5 w-24 bg-white/20 rounded-full" />
              <div className="space-y-3">
                <div className="h-10 bg-white/20 rounded w-full" />
                <div className="h-10 bg-white/20 rounded w-3/4" />
              </div>
              <div className="h-4 w-40 bg-white/20 rounded" />
            </div>
          </div>
          <div className="w-[60%] bg-muted flex-1" />
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
              Empoderamento Feminino{' '}
              <span className="gradient-text">em Moçambique</span>
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

  // ─── Render ────────────────────────────────────────────────────────

  if (isMobile) {
    return (
      <MobileHeroCards
        articles={articles}
        language={language}
        t={t}
        dateLocale={dateLocale}
        dateFormat={dateFormat}
      />
    );
  }

  return (
    <DesktopHeroSplit
      articles={articles}
      currentSlide={currentSlide}
      setCurrentSlide={setCurrentSlide}
      language={language}
      t={t}
      dateLocale={dateLocale}
      dateFormat={dateFormat}
      isPaused={isPaused}
      setIsPaused={setIsPaused}
      prefersReducedMotion={prefersReducedMotion.current}
      nextSlide={nextSlide}
      prevSlide={prevSlide}
    />
  );
}

export default HeroSlider;
