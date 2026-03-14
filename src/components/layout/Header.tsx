import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
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
  const [memberName, setMemberName] = useState<string | null>(null);
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const navLinks = getNavLinks(t);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch member name when user is logged in
  useEffect(() => {
    if (user) {
      supabase
        .from('members')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setMemberName(data.full_name.split(' ')[0]);
          }
        });
    } else {
      setMemberName(null);
    }
  }, [user]);

  const isLoggedIn = !!user && !!memberName;

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
            
            {isLoggedIn ? (
              <Link to="/membro" className="hidden sm:flex items-center gap-2">
                <Button
                  variant="outline"
                  className="font-medium transition-all duration-300 hover:scale-105 text-sm px-4 xl:px-5 gap-2"
                >
                  <User className="h-4 w-4" />
                  {memberName}
                  <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </Link>
            ) : (
              <Link to="/tornar-se-membro" className="hidden sm:block">
                <Button
                  className="gradient-primary text-primary-foreground font-medium shadow-brand-sm hover:shadow-brand-md transition-all duration-300 hover:scale-105 text-sm px-4 xl:px-6"
                >
                  {t('nav.become_member')}
                </Button>
              </Link>
            )}

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
            isMobileMenuOpen ? 'max-h-[80vh] opacity-100 mt-4' : 'max-h-0 opacity-0'
          )}
        >
          <div className="bg-card rounded-xl p-4 shadow-brand-md space-y-2 overflow-y-auto max-h-[70vh]">
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
            {isLoggedIn ? (
              <Link to="/membro" className="block pt-2">
                <Button variant="outline" className="w-full gap-2">
                  <User className="h-4 w-4" />
                  {memberName}
                  <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </Link>
            ) : (
              <Link to="/tornar-se-membro" className="block pt-2">
                <Button className="w-full gradient-primary text-primary-foreground">
                  {t('nav.become_member')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
