import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logo from '@/assets/logo-aefem.png';

const quickLinks = [
  { href: '/', label: 'Início' },
  { href: '/sobre', label: 'Sobre Nós' },
  { href: '/noticias', label: 'Notícias' },
  { href: '/galeria', label: 'Galeria' },
  { href: '/doacoes', label: 'Doações' },
  { href: '/contacto', label: 'Contacto' },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email });

      if (error) {
        if (error.code === '23505') {
          toast.error('Este email já está subscrito na newsletter.');
        } else {
          throw error;
        }
      } else {
        toast.success('Subscrição realizada com sucesso!');
        setEmail('');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Erro ao subscrever. Tente novamente.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter Section */}
      <div className="gradient-primary py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-display font-bold text-primary-foreground mb-2">
                Junte-se à Nossa Newsletter
              </h3>
              <p className="text-primary-foreground/80">
                Receba as últimas notícias e actualizações da AEFEM
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-3 w-full md:w-auto">
              <Input
                type="email"
                placeholder="O seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/20 border-background/30 text-primary-foreground placeholder:text-primary-foreground/60 min-w-[250px]"
                required
              />
              <Button
                type="submit"
                disabled={isSubscribing}
                className="bg-background text-primary hover:bg-background/90 font-medium"
              >
                {isSubscribing ? 'A subscrever...' : 'Subscrever'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* About */}
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-3">
                <img src={logo} alt="AEFEM Logo" className="h-12 w-auto brightness-0 invert" />
                <span className="font-display text-xl font-bold">AEFEM</span>
              </Link>
              <p className="text-background/70 text-sm leading-relaxed">
                A AEFEM promove o empoderamento económico das mulheres como base para a igualdade, a dignidade e o desenvolvimento sustentável em Moçambique.
              </p>
              <p className="text-background/70 text-sm italic">
                Quando uma mulher prospera, toda a comunidade avança.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display text-lg font-semibold mb-6">Links Rápidos</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-background/70 hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display text-lg font-semibold mb-6">Contactos</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-background/70 text-sm">
                    Maputo, Moçambique
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <a href="tel:+258840000000" className="text-background/70 hover:text-primary transition-colors text-sm">
                    +258 84 000 0000
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href="mailto:info@aefem.org.mz" className="text-background/70 hover:text-primary transition-colors text-sm">
                    info@aefem.org.mz
                  </a>
                </li>
              </ul>
            </div>

            {/* Social & Support */}
            <div>
              <h4 className="font-display text-lg font-semibold mb-6">Siga-nos</h4>
              <div className="flex gap-3 mb-8">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
              <Link to="/doacoes">
                <Button className="w-full gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300">
                  <Heart className="h-4 w-4 mr-2" />
                  Apoiar a AEFEM
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/60">
            <p>© {new Date().getFullYear()} AEFEM - Associação do Empoderamento Feminino. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link to="/admin" className="hover:text-primary transition-colors">
                Admin
              </Link>
              <a href="#" className="hover:text-primary transition-colors">
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
