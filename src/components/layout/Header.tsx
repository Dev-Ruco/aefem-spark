import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo-aefem.png';

const getNavLinks = (t: (key: string) => string) => [
  { href: '/', label: t('nav.home') },
  { href: '/sobre', label: t('nav.about') },
  { href: '/noticias', label: t('nav.news') },
  { href: '/galeria', label: t('nav.gallery') },
  { href: '/doacoes', label: t('nav.donations') },
  { href: '/contacto', label: t('nav.contact') },
  { href: '/tornar-se-membro', label: t('nav.become_member') },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  
  const navLinks = getNavLinks(t);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-brand-sm py-2'
          : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="AEFEM Logo"
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <span className="font-display text-xl font-bold gradient-text">
                AEFEM
              </span>
              <p className="text-xs text-muted-foreground">
                Empoderamento Feminino
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'relative text-sm font-medium transition-colors duration-200',
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

          {/* CTA Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <Link to="/doacoes" className="hidden sm:block">
              <Button
                className="gradient-primary text-primary-foreground font-medium shadow-brand-sm hover:shadow-brand-md transition-all duration-300 hover:scale-105"
              >
                Apoiar a AEFEM
              </Button>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
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
            <Link to="/doacoes" className="block pt-2">
              <Button className="w-full gradient-primary text-primary-foreground">
                Apoiar a AEFEM
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
