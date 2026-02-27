import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import HeroSlider from '@/components/home/HeroSlider';
import ActivitiesSection from '@/components/home/ActivitiesSection';
import AboutSection from '@/components/home/AboutSection';
import PurposeSection from '@/components/home/PurposeSection';
import ImpactStorySection from '@/components/home/ImpactStorySection';
import PillarsSection from '@/components/home/PillarsSection';
import HowWeWorkSection from '@/components/home/HowWeWorkSection';
import PartnersSection from '@/components/home/PartnersSection';
import SupportSection from '@/components/home/SupportSection';
import StatisticsSection from '@/components/home/StatisticsSection';
import TeamSection from '@/components/home/TeamSection';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>AEFEM - Associação do Empoderamento Feminino | Moçambique</title>
        <meta 
          name="description" 
          content="A AEFEM promove o empoderamento económico das mulheres em Moçambique através da educação, capacitação e criação de oportunidades sustentáveis." 
        />
        <meta name="keywords" content="empoderamento feminino, mulheres moçambique, igualdade género, capacitação, empreendedorismo feminino" />
      </Helmet>
      
      <Layout>
        <HeroSlider />
        <AboutSection />
        <StatisticsSection />
        <ImpactStorySection />
        <PurposeSection />
        <PillarsSection />
        <HowWeWorkSection />
        <PartnersSection />
        <TeamSection />
        <ActivitiesSection />
        <SupportSection />
      </Layout>
    </>
  );
};

export default Index;
