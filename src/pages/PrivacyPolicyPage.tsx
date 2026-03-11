import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import SectionHeader from '@/components/ui/section-header';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{language === 'en' ? 'Privacy Policy' : 'Política de Privacidade'} | AEFEM</title>
      </Helmet>

      <Layout>
        <section className="pt-32 pb-16 gradient-hero">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              subtitle="AEFEM"
              title={language === 'en' ? 'Privacy Policy' : 'Política de Privacidade'}
              description={language === 'en' ? 'How we protect your data' : 'Como protegemos os seus dados'}
            />
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto prose prose-lg">
              {language === 'en' ? (
                <>
                  <h2 className="font-display text-2xl font-bold mb-4">Data Collection</h2>
                  <p className="text-muted-foreground mb-6">
                    AEFEM collects only the personal data necessary to provide our services, including name and email address when you subscribe to our newsletter or contact us.
                  </p>

                  <h2 className="font-display text-2xl font-bold mb-4">Use of Data</h2>
                  <p className="text-muted-foreground mb-6">
                    Your data is used exclusively to communicate with you about AEFEM's activities, respond to your enquiries, and send newsletters if you have subscribed.
                  </p>

                  <h2 className="font-display text-2xl font-bold mb-4">Data Protection</h2>
                  <p className="text-muted-foreground mb-6">
                    We implement appropriate security measures to protect your personal data against unauthorised access, alteration, or destruction.
                  </p>

                  <h2 className="font-display text-2xl font-bold mb-4">Your Rights</h2>
                  <p className="text-muted-foreground mb-6">
                    You have the right to access, correct, or request deletion of your personal data at any time by contacting us at info@aefem.org.mz.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-bold mb-4">Recolha de Dados</h2>
                  <p className="text-muted-foreground mb-6">
                    A AEFEM recolhe apenas os dados pessoais necessários para prestar os nossos serviços, incluindo nome e endereço de email quando subscreve a nossa newsletter ou nos contacta.
                  </p>

                  <h2 className="font-display text-2xl font-bold mb-4">Utilização dos Dados</h2>
                  <p className="text-muted-foreground mb-6">
                    Os seus dados são utilizados exclusivamente para comunicar consigo sobre as actividades da AEFEM, responder às suas questões e enviar newsletters caso tenha subscrito.
                  </p>

                  <h2 className="font-display text-2xl font-bold mb-4">Protecção de Dados</h2>
                  <p className="text-muted-foreground mb-6">
                    Implementamos medidas de segurança adequadas para proteger os seus dados pessoais contra acesso não autorizado, alteração ou destruição.
                  </p>

                  <h2 className="font-display text-2xl font-bold mb-4">Os Seus Direitos</h2>
                  <p className="text-muted-foreground mb-6">
                    Tem o direito de aceder, corrigir ou solicitar a eliminação dos seus dados pessoais a qualquer momento, contactando-nos em info@aefem.org.mz.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
