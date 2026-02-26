import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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
    'nav.mutiyane': 'Mutiyane',
    
    // Hero
    'hero.featured': 'Notícia em Destaque',
    'hero.read_more': 'Ler Mais',
    'hero.activities_label': 'Actividades Recentes',
    'hero.view_activity': 'Ver Actividade',
    'hero.our_work': 'O nosso trabalho no terreno',
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

    // Mutiyane Project
    'mutiyane.tagline': 'Projecto AEFEM',
    'mutiyane.subtitle': 'Chat inteligente de orientação em saúde da mulher',
    'mutiyane.description': 'O Mutiyane é um projecto da AEFEM que utiliza Inteligência Artificial de forma responsável para ampliar o acesso das mulheres e raparigas a informação fiável, segura e digna sobre saúde da mulher.',
    'mutiyane.badge_confidential': 'Confidencial',
    'mutiyane.badge_respectful': 'Respeitoso',
    'mutiyane.badge_responsible': 'IA Responsável',
    'mutiyane.cta_try': 'Experimentar Mutiyane',
    'mutiyane.cta_support': 'Apoiar o Projecto',
    
    // Mutiyane - What is
    'mutiyane.section_what': 'O Projecto',
    'mutiyane.what_title': 'O que é o Mutiyane?',
    'mutiyane.what_description': 'Um chat interactivo, simples e confidencial para orientação em saúde da mulher',
    'mutiyane.what_full_description': 'O Mutiyane funciona como um chat interactivo, simples e confidencial, onde as utilizadoras podem colocar perguntas e receber respostas claras e orientadoras, baseadas em fontes institucionais e educativas previamente validadas. A tecnologia é usada como ferramenta de apoio à informação, nunca como substituto da relação humana ou dos serviços de saúde.',
    'mutiyane.disclaimer_title': 'Aviso importante',
    'mutiyane.disclaimer_text': 'O Mutiyane não substitui profissionais de saúde, não faz diagnósticos nem prescreve tratamentos.',
    
    // Mutiyane - How it works
    'mutiyane.section_how': 'Como Funciona',
    'mutiyane.how_title': 'Inteligência Artificial Responsável',
    'mutiyane.how_description': 'A IA do Mutiyane é supervisionada e delimitada, garantindo respostas seguras e fiáveis',
    'mutiyane.step1_title': 'A utilizadora pergunta',
    'mutiyane.step1_desc': 'Coloca a sua questão no chat de forma simples e natural',
    'mutiyane.step2_title': 'IA processa',
    'mutiyane.step2_desc': 'O sistema interpreta a pergunta com inteligência artificial supervisionada',
    'mutiyane.step3_title': 'Consulta a base',
    'mutiyane.step3_desc': 'A resposta é construída exclusivamente com base validada',
    'mutiyane.step4_title': 'Resposta clara',
    'mutiyane.step4_desc': 'A utilizadora recebe orientação responsável e fundamentada',
    
    // Mutiyane - Limitations
    'mutiyane.what_not': 'O que a IA NÃO faz',
    'mutiyane.limit_internet': 'Não pesquisa a internet em tempo real',
    'mutiyane.limit_learn': 'Não aprende com as conversas das utilizadoras',
    'mutiyane.limit_create': 'Não cria informação livremente',
    'mutiyane.limit_base': 'Responde APENAS da base de conhecimento validada',
    
    // Mutiyane - Security
    'mutiyane.security_title': 'Garantias de Segurança',
    'mutiyane.security_no_id': 'Não é exigida identificação pessoal',
    'mutiyane.security_no_data': 'Não são recolhidos dados pessoais',
    'mutiyane.security_no_track': 'Conversas não são associadas a identidades',
    
    // Mutiyane - Gallery
    'mutiyane.section_gallery': 'Galeria do App',
    'mutiyane.gallery_title': 'Conheça a Interface',
    'mutiyane.gallery_description': 'Veja como o Mutiyane foi desenhado para ser intuitivo e acessível',
    
    // Mutiyane - Sources
    'mutiyane.section_sources': 'Fontes de Informação',
    'mutiyane.sources_title': 'De Onde Vem a Informação',
    'mutiyane.sources_description': 'As respostas baseiam-se numa base de conhecimento estruturada e validada',
    'mutiyane.source_institutional': 'Fontes Institucionais',
    'mutiyane.source_inst_1': 'Materiais de organizações internacionais de referência em saúde da mulher',
    'mutiyane.source_inst_2': 'Guias técnicos de programas de saúde e género',
    'mutiyane.source_educational': 'Fontes Educativas',
    'mutiyane.source_edu_1': 'Materiais de educação para a saúde',
    'mutiyane.source_edu_2': 'Conteúdos de organizações com trabalho reconhecido',
    'mutiyane.source_aefem': 'Contributos da AEFEM',
    'mutiyane.source_aefem_1': 'Conteúdos desenvolvidos com base na experiência de terreno',
    'mutiyane.source_aefem_2': 'Materiais produzidos em parceria com entidades',
    'mutiyane.not_used_title': 'O que o Mutiyane NÃO utiliza',
    'mutiyane.not_unverified': 'Conteúdos não verificados',
    'mutiyane.not_personal': 'Dados pessoais das utilizadoras',
    'mutiyane.not_internet': 'Informação da internet',
    
    // Mutiyane - Status
    'mutiyane.status_badge': 'Em Desenvolvimento',
    'mutiyane.status_title': 'Estado do Projecto',
    'mutiyane.status_description': 'O Mutiyane encontra-se em fase de desenvolvimento e implementação progressiva, com foco na qualidade da informação e segurança das utilizadoras.',
    'mutiyane.status_complete': 'concluído',
    
    // Mutiyane - CTA
    'mutiyane.cta_title': 'Quer apoiar o Mutiyane?',
    'mutiyane.cta_description': 'Junte-se a nós num uso responsável da tecnologia em prol das mulheres.',
    'mutiyane.cta_learn': 'Conhecer a AEFEM',
    'mutiyane.cta_donate': 'Apoiar o Projecto',
    'mutiyane.cta_partner': 'Parcerias Institucionais',
    
    // Mutiyane - Preview Section
    'mutiyane.preview_badge': 'Novo Projecto',
    'mutiyane.preview_description': 'Um chat interactivo, simples e confidencial, onde as utilizadoras podem colocar perguntas e receber respostas claras sobre saúde da mulher.',
    'mutiyane.preview_cta': 'Conhecer o Mutiyane',

    // Statistics Section
    'stats.badge': 'Dados Reais',
    'stats.title': 'A Realidade da Mulher em Moçambique',
    'stats.subtitle': 'Dados que mostram porque o empoderamento económico é urgente',
    'stats.source': 'Fonte: Inquérito Demográfico e de Saúde 2022-23 e IV Recenseamento Geral da População (INE)',
    'stats.click_expand': 'Clique para expandir',

    // Employment Gap
    'stats.employment.title': 'O Fosso do Trabalho Remunerado',
    'stats.employment.question': 'Quem tem emprego em Moçambique?',
    'stats.employment.men': 'Homens Empregados',
    'stats.employment.women': 'Mulheres Empregadas',
    'stats.employment.tooltip': 'Apenas 3 em cada 10 mulheres têm emprego formal, criando uma dependência económica severa.',

    // Agriculture
    'stats.agriculture.title': 'Trabalhar de Graça?',
    'stats.agriculture.subtitle': 'A Realidade Agrícola',
    'stats.agriculture.description': 'Mulheres na Agricultura',
    'stats.agriculture.paid': 'Recebem pagamento',
    'stats.agriculture.unpaid': 'Sem pagamento',
    'stats.agriculture.compare': 'Outras áreas: apenas 5% sem pagamento',
    'stats.agriculture.tooltip': 'A agricultura é o maior empregador da mulher, mas quase metade trabalha sem receber um único metical.',

    // Financial Exclusion
    'stats.financial.title': 'Exclusão Financeira',
    'stats.financial.description': 'Acesso a Contas e Serviços Financeiros',
    'stats.financial.men': 'Homens',
    'stats.financial.women': 'Mulheres',
    'stats.financial.rural': 'Mulheres Rurais',
    'stats.financial.tooltip': 'Sem acesso a bancos ou M-Pesa, a mulher não consegue poupar nem investir no seu negócio.',

    // Digital Divide
    'stats.digital.title': 'O Fosso Digital',
    'stats.digital.description': 'Quem está conectado à Internet?',
    'stats.digital.men': 'Homens conectados',
    'stats.digital.women': 'Mulheres conectadas',
    'stats.digital.gap': 'Fosso de',
    'stats.digital.smartphone': 'das mulheres possuem smartphone',
    'stats.digital.tooltip': 'A AEFEM luta para colocar a tecnologia nas mãos das mulheres, reduzindo o fosso de 13% que nos separa dos homens.',
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
    'nav.mutiyane': 'Mutiyane',
    
    // Hero
    'hero.featured': 'Featured News',
    'hero.read_more': 'Read More',
    'hero.activities_label': 'Recent Activities',
    'hero.view_activity': 'View Activity',
    'hero.our_work': 'Our work in the field',
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

    // Mutiyane Project
    'mutiyane.tagline': 'AEFEM Project',
    'mutiyane.subtitle': 'Intelligent women\'s health guidance chat',
    'mutiyane.description': 'Mutiyane is an AEFEM project that uses Artificial Intelligence responsibly to expand women\'s and girls\' access to reliable, safe, and dignified information about women\'s health.',
    'mutiyane.badge_confidential': 'Confidential',
    'mutiyane.badge_respectful': 'Respectful',
    'mutiyane.badge_responsible': 'Responsible AI',
    'mutiyane.cta_try': 'Try Mutiyane',
    'mutiyane.cta_support': 'Support the Project',
    
    // Mutiyane - What is
    'mutiyane.section_what': 'The Project',
    'mutiyane.what_title': 'What is Mutiyane?',
    'mutiyane.what_description': 'An interactive, simple and confidential chat for women\'s health guidance',
    'mutiyane.what_full_description': 'Mutiyane works as an interactive, simple and confidential chat, where users can ask questions and receive clear, guiding answers, based on previously validated institutional and educational sources. Technology is used as a tool to support information, never as a substitute for human relationships or health services.',
    'mutiyane.disclaimer_title': 'Important notice',
    'mutiyane.disclaimer_text': 'Mutiyane does not replace healthcare professionals, does not make diagnoses or prescribe treatments.',
    
    // Mutiyane - How it works
    'mutiyane.section_how': 'How It Works',
    'mutiyane.how_title': 'Responsible Artificial Intelligence',
    'mutiyane.how_description': 'Mutiyane\'s AI is supervised and bounded, ensuring safe and reliable answers',
    'mutiyane.step1_title': 'User asks',
    'mutiyane.step1_desc': 'Ask your question in the chat simply and naturally',
    'mutiyane.step2_title': 'AI processes',
    'mutiyane.step2_desc': 'The system interprets the question with supervised artificial intelligence',
    'mutiyane.step3_title': 'Queries the base',
    'mutiyane.step3_desc': 'The answer is built exclusively from validated knowledge base',
    'mutiyane.step4_title': 'Clear answer',
    'mutiyane.step4_desc': 'User receives responsible and grounded guidance',
    
    // Mutiyane - Limitations
    'mutiyane.what_not': 'What AI does NOT do',
    'mutiyane.limit_internet': 'Does not search the internet in real time',
    'mutiyane.limit_learn': 'Does not learn from user conversations',
    'mutiyane.limit_create': 'Does not create information freely',
    'mutiyane.limit_base': 'Responds ONLY from validated knowledge base',
    
    // Mutiyane - Security
    'mutiyane.security_title': 'Security Guarantees',
    'mutiyane.security_no_id': 'No personal identification required',
    'mutiyane.security_no_data': 'No personal data collected',
    'mutiyane.security_no_track': 'Conversations not linked to identities',
    
    // Mutiyane - Gallery
    'mutiyane.section_gallery': 'App Gallery',
    'mutiyane.gallery_title': 'Discover the Interface',
    'mutiyane.gallery_description': 'See how Mutiyane was designed to be intuitive and accessible',
    
    // Mutiyane - Sources
    'mutiyane.section_sources': 'Information Sources',
    'mutiyane.sources_title': 'Where the Information Comes From',
    'mutiyane.sources_description': 'Answers are based on a structured and validated knowledge base',
    'mutiyane.source_institutional': 'Institutional Sources',
    'mutiyane.source_inst_1': 'Materials from international reference organizations in women\'s health',
    'mutiyane.source_inst_2': 'Technical guides from health and gender programs',
    'mutiyane.source_educational': 'Educational Sources',
    'mutiyane.source_edu_1': 'Health education materials',
    'mutiyane.source_edu_2': 'Content from organizations with recognized work',
    'mutiyane.source_aefem': 'AEFEM Contributions',
    'mutiyane.source_aefem_1': 'Content developed based on field experience',
    'mutiyane.source_aefem_2': 'Materials produced in partnership with entities',
    'mutiyane.not_used_title': 'What Mutiyane does NOT use',
    'mutiyane.not_unverified': 'Unverified content',
    'mutiyane.not_personal': 'User personal data',
    'mutiyane.not_internet': 'Internet information',
    
    // Mutiyane - Status
    'mutiyane.status_badge': 'In Development',
    'mutiyane.status_title': 'Project Status',
    'mutiyane.status_description': 'Mutiyane is in the development and progressive implementation phase, focusing on information quality and user safety.',
    'mutiyane.status_complete': 'complete',
    
    // Mutiyane - CTA
    'mutiyane.cta_title': 'Want to support Mutiyane?',
    'mutiyane.cta_description': 'Join us in responsible use of technology for women.',
    'mutiyane.cta_learn': 'Learn about AEFEM',
    'mutiyane.cta_donate': 'Support the Project',
    'mutiyane.cta_partner': 'Institutional Partnerships',
    
    // Mutiyane - Preview Section
    'mutiyane.preview_badge': 'New Project',
    'mutiyane.preview_description': 'An interactive, simple and confidential chat, where users can ask questions and receive clear answers about women\'s health.',
    'mutiyane.preview_cta': 'Discover Mutiyane',

    // Statistics Section
    'stats.badge': 'Real Data',
    'stats.title': 'The Reality of Women in Mozambique',
    'stats.subtitle': 'Data showing why economic empowerment is urgent',
    'stats.source': 'Source: Demographic and Health Survey 2022-23 and IV General Population Census (INE)',
    'stats.click_expand': 'Click to expand',

    // Employment Gap
    'stats.employment.title': 'The Paid Work Gap',
    'stats.employment.question': 'Who has employment in Mozambique?',
    'stats.employment.men': 'Men Employed',
    'stats.employment.women': 'Women Employed',
    'stats.employment.tooltip': 'Only 3 in 10 women have formal employment, creating severe economic dependence.',

    // Agriculture
    'stats.agriculture.title': 'Working for Free?',
    'stats.agriculture.subtitle': 'The Agricultural Reality',
    'stats.agriculture.description': 'Women in Agriculture',
    'stats.agriculture.paid': 'Receive payment',
    'stats.agriculture.unpaid': 'No payment',
    'stats.agriculture.compare': 'Other areas: only 5% unpaid',
    'stats.agriculture.tooltip': 'Agriculture is the largest employer of women, but almost half work without receiving a single metical.',

    // Financial Exclusion
    'stats.financial.title': 'Financial Exclusion',
    'stats.financial.description': 'Access to Accounts and Financial Services',
    'stats.financial.men': 'Men',
    'stats.financial.women': 'Women',
    'stats.financial.rural': 'Rural Women',
    'stats.financial.tooltip': 'Without access to banks or M-Pesa, women cannot save or invest in their business.',

    // Digital Divide
    'stats.digital.title': 'The Digital Divide',
    'stats.digital.description': 'Who is connected to the Internet?',
    'stats.digital.men': 'Men connected',
    'stats.digital.women': 'Women connected',
    'stats.digital.gap': 'Gap of',
    'stats.digital.smartphone': 'of women own a smartphone',
    'stats.digital.tooltip': 'AEFEM fights to put technology in the hands of women, reducing the 13% gap that separates us from men.',
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
