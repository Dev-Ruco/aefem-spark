import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MessageCircle, Shield, Sparkles } from 'lucide-react';
import mockupHome from '@/assets/mutiyane/mockup-home.png';

export function MutiyanePreviewSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <Badge variant="secondary" className="font-medium">
                {t('mutiyane.preview_badge')}
              </Badge>
            </div>
            
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Mutiyane
            </h2>
            
            <p className="text-xl text-muted-foreground mb-2">
              {t('mutiyane.subtitle')}
            </p>
            
            <p className="text-muted-foreground mb-6">
              {t('mutiyane.preview_description')}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-green-500" />
                <span>{t('mutiyane.badge_confidential')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span>{t('mutiyane.badge_responsible')}</span>
              </div>
            </div>

            <Link to="/mutiyane">
              <Button
                size="lg"
                className="gradient-primary text-primary-foreground font-medium shadow-brand-md hover:shadow-brand-lg transition-all duration-300"
              >
                {t('mutiyane.preview_cta')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Phone Mockup */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl opacity-50 rounded-full" />
              
              {/* Phone Frame */}
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-2 shadow-2xl max-w-[250px]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-gray-900 rounded-b-xl z-10" />
                <div className="relative bg-black rounded-[2rem] overflow-hidden">
                  <img
                    src={mockupHome}
                    alt="Mutiyane App"
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/50 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
