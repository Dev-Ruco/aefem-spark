import { useEffect, useState } from 'react';
import SectionHeader from '@/components/ui/section-header';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface TeamMember {
  id: string;
  full_name: string;
  position: string;
  position_en: string | null;
  photo_url: string | null;
  bio: string | null;
  bio_en: string | null;
}

export function TeamSection() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) {
        console.error('Error fetching team members:', error);
      } else {
        setMembers(data || []);
      }
      setIsLoading(false);
    };

    fetchMembers();
  }, []);

  if (isLoading || members.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subtitle={t('team.subtitle')}
          title={t('team.title')}
          description={t('team.description')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {members.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} language={language} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamMemberCard({ member, index, language }: { member: TeamMember; index: number; language: string }) {
  const { ref, isInView } = useScrollAnimation();
  
  const position = language === 'en' && member.position_en ? member.position_en : member.position;

  return (
    <div
      ref={ref}
      className={cn(
        'bg-card rounded-xl overflow-hidden shadow-brand-sm hover:shadow-brand-md transition-all duration-500 group',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="aspect-square overflow-hidden relative">
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={member.full_name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full gradient-primary opacity-80 flex items-center justify-center">
            <span className="text-4xl font-display font-bold text-primary-foreground">
              {member.full_name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="p-5 text-center">
        <h3 className="font-display text-lg font-semibold mb-1">{member.full_name}</h3>
        <p className="text-primary text-sm font-medium">{position}</p>
      </div>
    </div>
  );
}

export default TeamSection;
