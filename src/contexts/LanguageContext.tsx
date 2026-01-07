import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.about': 'Sobre Nós',
    'nav.news': 'Notícias',
    'nav.gallery': 'Galeria',
    'nav.donations': 'Doações',
    'nav.contact': 'Contacto',
    'nav.become_member': 'Tornar-se Membro',
    'nav.member_area': 'Área de Membro',
    
    // Hero
    'hero.featured': 'Notícia em Destaque',
    'hero.read_more': 'Ler Mais',
    'hero.tagline': 'Associação do Empoderamento Feminino',
    'hero.title': 'Empoderar economicamente as mulheres',
    'hero.title_highlight': 'para transformar famílias, comunidades e o país.',
    'hero.description': 'A AEFEM é uma organização da sociedade civil que promove o empoderamento económico das mulheres em Moçambique, através da educação, capacitação, defesa de direitos e criação de oportunidades sustentáveis.',
    'hero.cta_work': 'Conheça o nosso trabalho',
    'hero.cta_support': 'Apoiar a AEFEM',
    
    // Sections
    'activities.subtitle': 'Actividades Recentes',
    'activities.title': 'Últimas Actividades',
    'activities.description': 'Fique a par das últimas novidades, eventos e actividades da AEFEM',
    'activities.view_all': 'Ver Todas as Actividades',
    'activities.empty': 'Nenhuma actividade disponível de momento.',
    
    // Footer
    'footer.newsletter_title': 'Junte-se à Nossa Newsletter',
    'footer.newsletter_desc': 'Receba as últimas notícias e actualizações da AEFEM',
    'footer.subscribe': 'Subscrever',
    'footer.subscribing': 'A subscrever...',
    'footer.quick_links': 'Links Rápidos',
    'footer.contacts': 'Contactos',
    'footer.follow_us': 'Siga-nos',
    'footer.support': 'Apoiar a AEFEM',
    'footer.privacy': 'Política de Privacidade',
    'footer.rights': 'Todos os direitos reservados.',
    
    // Member Area
    'member.register_title': 'Tornar-se Membro da AEFEM',
    'member.register_desc': 'Junte-se à nossa comunidade e faça parte da mudança',
    'member.full_name': 'Nome Completo',
    'member.gender': 'Género',
    'member.gender_male': 'Masculino',
    'member.gender_female': 'Feminino',
    'member.gender_other': 'Outro',
    'member.birth_year': 'Ano de Nascimento',
    'member.province': 'Província',
    'member.whatsapp': 'Número de WhatsApp',
    'member.email': 'Email',
    'member.password': 'Palavra-passe',
    'member.register_btn': 'Registar como Membro',
    'member.registering': 'A registar...',
    'member.already_member': 'Já é membro?',
    'member.login': 'Entrar',
    'member.quota_message': 'Para a manutenção das actividades da AEFEM, o membro deve efectuar o pagamento da quota mensal de 500 MT, no período de 25 até 5 do mês seguinte.',
    'member.dashboard': 'Painel do Membro',
    'member.profile': 'O Meu Perfil',
    'member.quotas': 'As Minhas Quotas',
    'member.notifications': 'Notificações',
    'member.activities': 'Actividades',
    'member.logout': 'Sair',
    
    // Common
    'common.loading': 'A carregar...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.add': 'Adicionar',
    'common.back': 'Voltar',
    'common.read_more': 'Ler mais',
    'common.share': 'Partilhar',
    
    // Team
    'team.title': 'Nossa Equipa',
    'team.subtitle': 'Conheça a equipa',
    'team.description': 'Os colaboradores que trabalham para promover o empoderamento feminino em Moçambique',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.news': 'News',
    'nav.gallery': 'Gallery',
    'nav.donations': 'Donations',
    'nav.contact': 'Contact',
    'nav.become_member': 'Become a Member',
    'nav.member_area': 'Member Area',
    
    // Hero
    'hero.featured': 'Featured News',
    'hero.read_more': 'Read More',
    'hero.tagline': 'Association for Women\'s Empowerment',
    'hero.title': 'Economically empowering women',
    'hero.title_highlight': 'to transform families, communities and the country.',
    'hero.description': 'AEFEM is a civil society organization that promotes the economic empowerment of women in Mozambique, through education, training, advocacy and creating sustainable opportunities.',
    'hero.cta_work': 'Learn about our work',
    'hero.cta_support': 'Support AEFEM',
    
    // Sections
    'activities.subtitle': 'Recent Activities',
    'activities.title': 'Latest Activities',
    'activities.description': 'Stay up to date with the latest news, events and activities from AEFEM',
    'activities.view_all': 'View All Activities',
    'activities.empty': 'No activities available at the moment.',
    
    // Footer
    'footer.newsletter_title': 'Join Our Newsletter',
    'footer.newsletter_desc': 'Receive the latest news and updates from AEFEM',
    'footer.subscribe': 'Subscribe',
    'footer.subscribing': 'Subscribing...',
    'footer.quick_links': 'Quick Links',
    'footer.contacts': 'Contacts',
    'footer.follow_us': 'Follow Us',
    'footer.support': 'Support AEFEM',
    'footer.privacy': 'Privacy Policy',
    'footer.rights': 'All rights reserved.',
    
    // Member Area
    'member.register_title': 'Become an AEFEM Member',
    'member.register_desc': 'Join our community and be part of the change',
    'member.full_name': 'Full Name',
    'member.gender': 'Gender',
    'member.gender_male': 'Male',
    'member.gender_female': 'Female',
    'member.gender_other': 'Other',
    'member.birth_year': 'Birth Year',
    'member.province': 'Province',
    'member.whatsapp': 'WhatsApp Number',
    'member.email': 'Email',
    'member.password': 'Password',
    'member.register_btn': 'Register as Member',
    'member.registering': 'Registering...',
    'member.already_member': 'Already a member?',
    'member.login': 'Login',
    'member.quota_message': 'To support AEFEM activities, members must pay the monthly fee of 500 MT, between the 25th and 5th of the following month.',
    'member.dashboard': 'Member Dashboard',
    'member.profile': 'My Profile',
    'member.quotas': 'My Quotas',
    'member.notifications': 'Notifications',
    'member.activities': 'Activities',
    'member.logout': 'Logout',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.back': 'Back',
    'common.read_more': 'Read more',
    'common.share': 'Share',
    
    // Team
    'team.title': 'Our Team',
    'team.subtitle': 'Meet the team',
    'team.description': 'The collaborators working to promote women\'s empowerment in Mozambique',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('aefem-language');
    if (saved === 'pt' || saved === 'en') return saved;
    
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('pt')) return 'pt';
    if (browserLang.startsWith('en')) return 'en';
    
    // Default to Portuguese
    return 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('aefem-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['pt'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
