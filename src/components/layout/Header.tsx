import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/aefem-icon-optimized.png';

const getNavLinks = (t: (key: string) => string) => [
  { href: '/', label: t('nav.home') },
  { href: '/sobre', label: t('nav.about') },
  { href: '/projectos', label: t('nav.projects') },
  { href: '/noticias', label: t('nav.news') },
  { href: '/publicacoes', label: t('nav.publications') },
  { href: '/galeria', label: t('nav.gallery') },
  { href: '/contacto', label: t('nav.contact') },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  
  const navLinks = getNavLinks(t);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm py-3">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo + Org Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="AEFEM Logo"
              className="h-10 lg:h-12 xl:h-14 w-auto rounded-full transition-transform duration-300 group-hover:scale-105"
            />
            {/* Desktop: two-line org name */}
            <div className="hidden lg:block leading-tight">
              <p className="text-xs xl:text-sm text-muted-foreground font-medium">
                Associação do
              </p>
              <p className="text-sm xl:text-base font-bold text-foreground tracking-tight">
                Empoderamento Feminino
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3 lg:gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'relative text-xs lg:text-[13px] xl:text-sm font-medium transition-colors duration-200',
                  'hover:text-primary',
                  location.pathname === link.href
                    ? 'text-primary'
                    : 'text-foreground/80',
                  'after:absolute after:bottom-[-4px] after:left-0 after:h-0.5',
                  'after:w-0 after:bg-primary after:transition-all after:duration-300',
                  'hover:after:w-full',
                  location.pathname === link.href && 'after:w-full'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Language + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            <Link to="/tornar-se-membro" className="hidden sm:block">
              <Button
                className="gradient-primary text-primary-foreground font-medium shadow-brand-sm hover:shadow-brand-md transition-all duration-300 hover:scale-105 text-sm px-4 xl:px-6"
              >
                {t('nav.become_member')}
              </Button>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full bg-secondary/60 hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          )}
        >
          <div className="bg-card rounded-xl p-4 shadow-brand-md space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'block py-3 px-4 rounded-lg font-medium transition-all duration-200',
                  location.pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-secondary'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-2 px-4">
              <LanguageSelector />
            </div>
            <Link to="/tornar-se-membro" className="block pt-2">
              <Button className="w-full gradient-primary text-primary-foreground">
                {t('nav.become_member')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
