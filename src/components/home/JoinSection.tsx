import { Link } from 'react-router-dom';
import { UserPlus, Users, GraduationCap, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/ui/section-header';
import { useLanguage } from '@/contexts/LanguageContext';

const benefits = [
  {
    icon: Users,
    title_pt: 'Rede de Apoio',
    title_en: 'Support Network',
    desc_pt: 'Conecte-se com mulheres empreendedoras e líderes comunitárias em todo o país.',
    desc_en: 'Connect with women entrepreneurs and community leaders across the country.',
  },
  {
    icon: GraduationCap,
    title_pt: 'Capacitação',
    title_en: 'Training',
    desc_pt: 'Acesso a formações, workshops e programas de desenvolvimento profissional.',
    desc_en: 'Access to training, workshops and professional development programs.',
  },
  {
    icon: Megaphone,
    title_pt: 'Voz Activa',
    title_en: 'Active Voice',
    desc_pt: 'Participe nas decisões e iniciativas que impactam a vida das mulheres moçambicanas.',
    desc_en: 'Participate in decisions and initiatives that impact Mozambican women\'s lives.',
  },
];

export default function JoinSection() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  return (
    <section className="py-20 md:py-28 gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subtitle={isEn ? 'Become a Member' : 'Tornar-se Membro'}
          title={isEn ? 'Join the AEFEM' : 'Junte-se à AEFEM'}
          description={
            isEn
              ? 'Any person can join our community. Together we are stronger.'
              : 'Qualquer pessoa pode juntar-se à nossa comunidade. Juntos somos mais fortes.'
          }
        />

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12 mb-12">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="bg-card/80 backdrop-blur-sm rounded-xl p-6 text-center border border-border/50"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <b.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                {isEn ? b.title_en : b.title_pt}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {isEn ? b.desc_en : b.desc_pt}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/tornar-se-membro">
            <Button size="lg" className="gradient-primary text-lg px-10 h-14">
              <UserPlus className="mr-2 h-5 w-5" />
              {isEn ? 'Join Now' : 'Juntar-me Agora'}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
