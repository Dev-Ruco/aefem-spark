import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Images, 
  Users, 
  UserCheck,
  CreditCard,
  Briefcase,
  Mail, 
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import logo from '@/assets/logo-aefem.png';

const menuItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/artigos', icon: FileText, label: 'Artigos' },
  { to: '/admin/categorias', icon: FolderOpen, label: 'Categorias' },
  { to: '/admin/galeria', icon: Images, label: 'Galeria' },
  { to: '/admin/equipa', icon: Briefcase, label: 'Equipa' },
  { to: '/admin/membros', icon: UserCheck, label: 'Membros' },
  { to: '/admin/quotas', icon: CreditCard, label: 'Quotas' },
  { to: '/admin/parceiros', icon: Users, label: 'Parceiros' },
  { to: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
  { to: '/admin/mensagens', icon: MessageSquare, label: 'Mensagens' },
];

export function AdminSidebar() {
  const { role, user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside className={cn(
      "h-screen bg-sidebar sticky top-0 flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <img src={logo} alt="AEFEM" className="h-8 w-auto" />
            <span className="font-display font-semibold text-sidebar-foreground">Admin</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent/20"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = item.exact 
            ? location.pathname === item.to 
            : location.pathname.startsWith(item.to);
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/20",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          );
        })}

        {role === 'admin' && (
          <NavLink
            to="/admin/configuracoes"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/20",
              location.pathname === '/admin/configuracoes' && "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
            )}
            title={collapsed ? 'Configurações' : undefined}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">Configurações</span>}
          </NavLink>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
            <p className="text-xs font-medium text-sidebar-primary capitalize">{role}</p>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start gap-3 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/20",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? 'Sair' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </aside>
  );
}
