import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import HeroSlider from '@/components/home/HeroSlider';
import ActivitiesSection from '@/components/home/ActivitiesSection';
import AboutSection from '@/components/home/AboutSection';
import ImpactStorySection from '@/components/home/ImpactStorySection';
import PillarsSection from '@/components/home/PillarsSection';
import PartnersSection from '@/components/home/PartnersSection';
import StatisticsSection from '@/components/home/StatisticsSection';
import TeamSection from '@/components/home/TeamSection';
import VideosSection from '@/components/home/VideosSection';

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
        <PillarsSection />
        <ActivitiesSection />
        <VideosSection />
        <TeamSection />
        <PartnersSection />
      </Layout>
    </>
  );
};

export default Index;
