import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { PhoneMockup } from '@/components/mutiyane/PhoneMockup';
import { AIArchitectureDiagram } from '@/components/mutiyane/AIArchitectureDiagram';
import { MutiyaneFeatures } from '@/components/mutiyane/MutiyaneFeatures';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Shield, Heart, Lock, MessageCircle, Sparkles, ChevronLeft, ChevronRight, FolderOpen } from 'lucide-react';

import mockupHome from '@/assets/mutiyane/mockup-home.png';
import mockupChat from '@/assets/mutiyane/mockup-chat.png';
import mockupFotoGuia from '@/assets/mutiyane/mockup-foto-guia.png';
import mockupWelcome from '@/assets/mutiyane/mockup-welcome.png';

export default function ProjectsPage() {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t('projects.title')} - AEFEM</title>
        <meta name="description" content={t('projects.meta_desc')} />
      </Helmet>

      <Layout>
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <FolderOpen className="w-4 h-4 mr-2" />
              {t('projects.badge')}
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {t('projects.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('projects.description')}
            </p>
          </div>
        </section>

        {/* Projects List */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="mutiyane" className="w-full">
              <TabsList className="w-full justify-start mb-8 bg-muted/50 p-1.5 rounded-xl">
                <TabsTrigger value="mutiyane" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-6 py-2.5 font-medium">
                  Mutiyane
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mutiyane">
                <MutiyaneProject />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </Layout>
    </>
  );
}

function MutiyaneProject() {
  const { t } = useLanguage();
  const [currentMockup, setCurrentMockup] = useState(0);

  const mockups = [
    { src: mockupHome, alt: 'Mutiyane - Ecrã inicial' },
    { src: mockupChat, alt: 'Mutiyane - Chat interactivo' },
    { src: mockupFotoGuia, alt: 'Mutiyane - Guia de saúde' },
    { src: mockupWelcome, alt: 'Mutiyane - Boas-vindas' },
  ];

  const badges = [
    { icon: Shield, text: t('mutiyane.badge_confidential') },
    { icon: Heart, text: t('mutiyane.badge_respectful') },
    { icon: Lock, text: t('mutiyane.badge_responsible') },
  ];

  const nextMockup = () => setCurrentMockup((prev) => (prev + 1) % mockups.length);
  const prevMockup = () => setCurrentMockup((prev) => (prev - 1 + mockups.length) % mockups.length);

  return (
    <div className="space-y-20">
      {/* Intro */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">{t('mutiyane.tagline')}</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Mutiyane
          </h2>
          
          <p className="text-xl text-muted-foreground mb-4 font-medium">
            {t('mutiyane.subtitle')}
          </p>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-xl">
            {t('mutiyane.description')}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="px-4 py-2 text-sm font-medium flex items-center gap-2">
                <badge.icon className="w-4 h-4 text-primary" />
                {badge.text}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="gradient-primary text-primary-foreground font-medium shadow-brand-md hover:shadow-brand-lg transition-all duration-300">
              <MessageCircle className="w-5 h-5 mr-2" />
              {t('mutiyane.cta_try')}
            </Button>
            <Link to="/tornar-se-membro">
              <Button size="lg" variant="outline" className="font-medium">
                {t('mutiyane.cta_support')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative">
          <PhoneMockup imageSrc={mockups[currentMockup].src} alt={mockups[currentMockup].alt} className="w-64 md:w-72 lg:w-80" />
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4">
            <button onClick={prevMockup} className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-background transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMockup} className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-background transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {mockups.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMockup(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentMockup ? 'w-8 bg-primary' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* What is Mutiyane */}
      <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
        <SectionHeader subtitle={t('mutiyane.section_what')} title={t('mutiyane.what_title')} description={t('mutiyane.what_description')} />
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-card rounded-2xl p-8 shadow-brand-md border border-border/50">
            <p className="text-lg text-muted-foreground leading-relaxed">{t('mutiyane.what_full_description')}</p>
            <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
              <p className="text-sm text-muted-foreground italic">
                <strong className="text-foreground">{t('mutiyane.disclaimer_title')}</strong>: {t('mutiyane.disclaimer_text')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Architecture */}
      <div>
        <SectionHeader subtitle={t('mutiyane.section_how')} title={t('mutiyane.how_title')} description={t('mutiyane.how_description')} />
        <div className="mt-12">
          <AIArchitectureDiagram />
        </div>
      </div>

      {/* App Gallery */}
      <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
        <SectionHeader subtitle={t('mutiyane.section_gallery')} title={t('mutiyane.gallery_title')} description={t('mutiyane.gallery_description')} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {mockups.map((mockup, index) => (
            <div key={index} onClick={() => setCurrentMockup(index)} className="cursor-pointer group">
              <div className="bg-card rounded-2xl p-4 shadow-brand-sm hover:shadow-brand-lg transition-all duration-300 border border-border/50 group-hover:-translate-y-2">
                <img src={mockup.src} alt={mockup.alt} className="w-full h-auto rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Information Sources */}
      <div>
        <SectionHeader subtitle={t('mutiyane.section_sources')} title={t('mutiyane.sources_title')} description={t('mutiyane.sources_description')} />
        <div className="mt-12">
          <MutiyaneFeatures />
        </div>
      </div>

      {/* Project Status */}
      <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium border-primary/50 text-primary">
            {t('mutiyane.status_badge')}
          </Badge>
          <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{t('mutiyane.status_title')}</h3>
          <p className="text-lg text-muted-foreground mb-8">{t('mutiyane.status_description')}</p>
          <div className="w-full bg-muted rounded-full h-3 mb-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000" style={{ width: '65%' }} />
          </div>
          <p className="text-sm text-muted-foreground">65% {t('mutiyane.status_complete')}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-2xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{t('mutiyane.cta_title')}</h3>
          <p className="text-lg text-muted-foreground mb-8">{t('mutiyane.cta_description')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sobre">
              <Button size="lg" variant="outline" className="font-medium">{t('mutiyane.cta_learn')}</Button>
            </Link>
            <Link to="/tornar-se-membro">
              <Button size="lg" className="gradient-primary text-primary-foreground font-medium shadow-brand-md hover:shadow-brand-lg">
                {t('nav.become_member')}
                <Heart className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contacto">
              <Button size="lg" variant="outline" className="font-medium">{t('mutiyane.cta_partner')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
