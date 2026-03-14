import { Link } from 'react-router-dom';
import { UserPlus, Users, GraduationCap, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/ui/section-header';
import { useLanguage } from '@/contexts/LanguageContext';
import joinImage from '@/assets/join-members.jpg';

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
        {/* Split layout: image + text */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-brand-lg">
            <img
              src={joinImage}
              alt={isEn ? 'AEFEM members together' : 'Membros da AEFEM juntas'}
              className="w-full h-[400px] lg:h-[480px] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Text + CTA */}
          <div className="space-y-6">
            <SectionHeader
              subtitle={isEn ? 'Become a Member' : 'Tornar-se Membro'}
              title={isEn ? 'Join the AEFEM' : 'Junte-se à AEFEM'}
              align="left"
            />
            <p className="text-muted-foreground text-lg leading-relaxed">
              {isEn
                ? 'Be part of a community of women who share experiences, knowledge and opportunities for female empowerment. Together, we are transforming Mozambique.'
                : 'Faça parte de uma comunidade de mulheres que partilham experiências, conhecimento e oportunidades para o empoderamento feminino. Juntas, estamos a transformar Moçambique.'}
            </p>
            <Link to="/tornar-se-membro">
              <Button size="lg" className="gradient-primary text-lg px-10 h-14 mt-2">
                <UserPlus className="mr-2 h-5 w-5" />
                {isEn ? 'Join Now' : 'Juntar-me Agora'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Benefits cards */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
      </div>
    </section>
  );
}
