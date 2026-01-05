import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  slug: string;
}

export function HeroSlider() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, excerpt, featured_image, slug')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching featured articles:', error);
      } else {
        setArticles(data || []);
      }
      setIsLoading(false);
    };

    fetchFeaturedArticles();
  }, []);

  useEffect(() => {
    if (articles.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % articles.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [articles.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
  };

  // Default hero content when no articles
  if (isLoading || articles.length === 0) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-3xl animate-float delay-300" />
        </div>

        <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4 animate-fade-down">
              Associação do Empoderamento Feminino
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 animate-fade-up">
              Empoderar economicamente as mulheres{' '}
              <span className="gradient-text">para transformar famílias, comunidades e o país.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-up delay-200">
              A AEFEM é uma organização da sociedade civil que promove o empoderamento económico das mulheres em Moçambique, através da educação, capacitação, defesa de direitos e criação de oportunidades sustentáveis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-300">
              <Link to="/sobre">
                <Button size="lg" className="gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 hover:scale-105 px-8">
                  Conheça o nosso trabalho
                </Button>
              </Link>
              <Link to="/doacoes">
                <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10 px-8">
                  Apoiar a AEFEM
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Slides */}
      {articles.map((article, index) => (
        <div
          key={article.id}
          className={cn(
            'absolute inset-0 transition-all duration-700 ease-in-out',
            index === currentSlide
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
          )}
        >
          {/* Background Image */}
          {article.featured_image && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${article.featured_image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
            </div>
          )}
          {!article.featured_image && (
            <div className="absolute inset-0 gradient-primary opacity-90" />
          )}

          {/* Content */}
          <div className="relative h-full flex items-center justify-center pt-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center text-background">
                <span className="inline-block text-sm font-semibold uppercase tracking-wider mb-4 opacity-90">
                  Notícia em Destaque
                </span>
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                    {article.excerpt}
                  </p>
                )}
                <Link to={`/noticias/${article.slug}`}>
                  <Button
                    size="lg"
                    className="bg-background text-primary hover:bg-background/90 hover:scale-105 transition-all duration-300 px-8"
                  >
                    Ler Mais
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {articles.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-background hover:bg-background/30 transition-all duration-300 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-background hover:bg-background/30 transition-all duration-300 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {articles.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === currentSlide
                  ? 'w-8 bg-background'
                  : 'w-2 bg-background/50 hover:bg-background/75'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default HeroSlider;
