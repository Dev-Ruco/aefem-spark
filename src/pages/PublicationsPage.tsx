import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Download, Eye, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Publication {
  id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  file_url: string;
  thumbnail_url: string | null;
  published_at: string | null;
  is_active: boolean;
}

export default function PublicationsPage() {
  const { t, language } = useLanguage();
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);

  const { data: publications = [], isLoading } = useQuery({
    queryKey: ['publications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .eq('is_active', true)
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data as Publication[];
    },
  });

  const getTitle = (pub: Publication) => (language === 'en' && pub.title_en ? pub.title_en : pub.title);
  const getDescription = (pub: Publication) => (language === 'en' && pub.description_en ? pub.description_en : pub.description);

  return (
    <>
      <Helmet>
        <title>Publicações | AEFEM</title>
        <meta name="description" content="Relatórios, estudos e publicações da AEFEM sobre empoderamento feminino e género em Moçambique." />
        <link rel="canonical" href="https://www.aefem.org.mz/publicacoes" />
        <meta property="og:url" content="https://www.aefem.org.mz/publicacoes" />
      </Helmet>

      <Layout>
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <BookOpen className="w-4 h-4 mr-2" />
              {t('publications.badge')}
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {t('publications.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('publications.description')}
            </p>
          </div>
        </section>

        {/* Publications Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-48 bg-muted rounded-lg mb-4" />
                      <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : publications.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">{t('publications.empty')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {publications.map((pub) => (
                  <Card key={pub.id} className="group hover:shadow-brand-md transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden">
                    <CardContent className="p-0">
                      {/* Thumbnail or icon */}
                      <div className="h-48 bg-muted/50 flex items-center justify-center relative overflow-hidden">
                        {pub.thumbnail_url ? (
                          <img src={pub.thumbnail_url} alt={getTitle(pub)} className="w-full h-full object-cover" />
                        ) : (
                          <FileText className="w-16 h-16 text-primary/30" />
                        )}
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button variant="secondary" size="sm" onClick={() => setSelectedPub(pub)}>
                            <Eye className="w-4 h-4 mr-2" />
                            {t('publications.preview')}
                          </Button>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {getTitle(pub)}
                        </h3>
                        {getDescription(pub) && (
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{getDescription(pub)}</p>
                        )}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedPub(pub)} className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            {t('publications.preview')}
                          </Button>
                          <a href={pub.file_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button size="sm" className="w-full gradient-primary text-primary-foreground">
                              <Download className="w-4 h-4 mr-2" />
                              {t('publications.download')}
                            </Button>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* PDF Preview Dialog */}
        <Dialog open={!!selectedPub} onOpenChange={() => setSelectedPub(null)}>
          <DialogContent className="max-w-4xl h-[85vh]">
            <DialogHeader>
              <DialogTitle>{selectedPub && getTitle(selectedPub)}</DialogTitle>
            </DialogHeader>
            {selectedPub && (
              <div className="flex-1 min-h-0">
                <iframe
                  src={selectedPub.file_url}
                  className="w-full h-full rounded-lg border border-border"
                  style={{ minHeight: 'calc(85vh - 100px)' }}
                  title={getTitle(selectedPub)}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Layout>
    </>
  );
}
