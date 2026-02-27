import { useEffect, useState } from 'react';
import SectionHeader from '@/components/ui/section-header';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
}

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const { ref, isInView } = useScrollAnimation();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchPartners = async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('id, name, logo_url, website_url')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching partners:', error);
      } else {
        setPartners(data || []);
      }
    };

    fetchPartners();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-muted/20 border-t border-border/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle={t('partners.subtitle')}
          title={t('partners.title')}
          description={t('partners.description')}
        />

        <div
          ref={ref}
          className={cn(
            'transition-all duration-700',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {partners.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {partners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.website_url || '#'}
                  target={partner.website_url ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group"
                >
                  {partner.logo_url ? (
                    <img
                      src={partner.logo_url}
                      alt={partner.name}
                      className="h-16 w-auto grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="h-16 px-6 bg-muted rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                      {partner.name}
                    </div>
                  )}
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl">
              <p className="text-muted-foreground mb-4">
                {t('partners.interested')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('partners.based_on')}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;
