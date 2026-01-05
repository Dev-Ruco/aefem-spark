import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import SectionHeader from '@/components/ui/section-header';
import AboutSection from '@/components/home/AboutSection';
import PurposeSection from '@/components/home/PurposeSection';
import PillarsSection from '@/components/home/PillarsSection';
import HowWeWorkSection from '@/components/home/HowWeWorkSection';

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Sobre Nós | AEFEM</title>
        <meta name="description" content="Conheça a AEFEM - Associação do Empoderamento Feminino. Trabalhamos pelo empoderamento económico das mulheres em Moçambique." />
      </Helmet>

      <Layout>
        {/* Hero */}
        <section className="pt-32 pb-16 gradient-hero">
          <div className="container mx-auto px-4">
            <SectionHeader
              subtitle="AEFEM"
              title="Sobre Nós"
              description="Empoderamento Económico da Mulher como Motor de Transformação Social"
            />
          </div>
        </section>

        <AboutSection />
        <PurposeSection />
        <PillarsSection />
        <HowWeWorkSection />
      </Layout>
    </>
  );
}
