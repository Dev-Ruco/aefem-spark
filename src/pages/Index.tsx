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
import JoinSection from '@/components/home/JoinSection';
import { SEO } from '@/config/seo';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Empoderamento Feminino em Moçambique | AEFEM</title>
        <meta 
          name="description" 
          content="A AEFEM promove o empoderamento feminino em Moçambique através de programas de capacitação económica, liderança e direitos das mulheres." 
        />
        <meta name="keywords" content="empoderamento feminino, mulheres moçambique, igualdade género, capacitação, empreendedorismo feminino" />
        <link rel="canonical" href={`${SEO.siteUrl}/`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SEO.siteUrl}/`} />
        <meta property="og:title" content="Empoderamento Feminino em Moçambique | AEFEM" />
        <meta property="og:description" content="A AEFEM promove o empoderamento feminino em Moçambique." />
        <meta property="og:image" content={SEO.defaultImage} />
        <meta property="og:site_name" content="AEFEM" />
        <meta property="og:locale" content="pt_MZ" />

        {/* Schema.org */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "NGO",
                "@id": "${SEO.siteUrl}/#organization",
                "name": "AEFEM",
                "alternateName": "Associação do Empoderamento Feminino de Moçambique",
                "url": "${SEO.siteUrl}",
                "logo": {
                  "@type": "ImageObject",
                  "url": "${SEO.siteUrl}/logo.png"
                },
                "areaServed": "Mozambique",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Maputo",
                  "addressCountry": "MZ"
                },
                "sameAs": [
                  "${SEO.facebookUrl}",
                  "${SEO.instagramUrl}"
                ]
              },
              {
                "@type": "WebSite",
                "@id": "${SEO.siteUrl}/#website",
                "url": "${SEO.siteUrl}",
                "name": "AEFEM",
                "publisher": {
                  "@id": "${SEO.siteUrl}/#organization"
                },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "${SEO.siteUrl}/noticias?q={search_term_string}"
                  },
                  "query-input": "required name=search_term_string"
                }
              }
            ]
          }
        `}</script>
      </Helmet>
      
      <Layout>
        <HeroSlider />
        <AboutSection />
        <StatisticsSection />
        <ImpactStorySection />
        <PillarsSection />
        <ActivitiesSection />
        <VideosSection />
        <JoinSection />
        <TeamSection />
        <PartnersSection />
      </Layout>
    </>
  );
};

export default Index;
