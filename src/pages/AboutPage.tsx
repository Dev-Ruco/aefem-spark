import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import SectionHeader from '@/components/ui/section-header';
import AboutSection from '@/components/home/AboutSection';
import PurposeSection from '@/components/home/PurposeSection';
import PillarsSection from '@/components/home/PillarsSection';
import HowWeWorkSection from '@/components/home/HowWeWorkSection';
import TeamSection from '@/components/home/TeamSection';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t('aboutpage.title')} | AEFEM</title>
        <meta name="description" content={t('aboutpage.meta_desc')} />
      </Helmet>

      <Layout>
        <section className="pt-32 pb-16 gradient-hero">
          <div className="container mx-auto px-4">
            <SectionHeader
              subtitle="AEFEM"
              title={t('aboutpage.title')}
              description={t('aboutpage.hero_desc')}
            />
          </div>
        </section>

        <AboutSection />
        <PurposeSection />
        <PillarsSection />
        <HowWeWorkSection />
        <TeamSection />
      </Layout>
    </>
  );
}
