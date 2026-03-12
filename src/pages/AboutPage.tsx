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
        <title>Sobre a AEFEM | Empoderamento Feminino em Moçambique</title>
        <meta name="description" content="Conheça a AEFEM, a nossa missão, visão e equipa dedicada ao empoderamento feminino em Moçambique." />
        <link rel="canonical" href="https://www.aefem.org.mz/sobre" />
        <meta property="og:url" content="https://www.aefem.org.mz/sobre" />
        <meta property="og:title" content="Sobre a AEFEM | Empoderamento Feminino em Moçambique" />
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
