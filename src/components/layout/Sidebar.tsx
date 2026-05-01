import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, ShoppingCart, ListChecks, Target, Eye, Users, Settings, Bell } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Wallet, label: 'Finanças', path: '/financas' },
  { icon: ShoppingCart, label: 'Compras', path: '/compras' },
  { icon: ListChecks, label: 'Tarefas', path: '/tarefas' },
  { icon: Target, label: 'Metas', path: '/metas' },
  { icon: Eye, label: 'Visão Geral', path: '/visao-geral' },
  { icon: Users, label: 'Moradores', path: '/moradores' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' },
];

interface SidebarProps {
  onNotifications?: () => void;
  unreadCount?: number;
}

export function Sidebar({ onNotifications, unreadCount = 0 }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-[260px] lg:bg-white lg:border-r lg:border-border-light">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border-light">
        <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
          <Home className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h1 className="text-[15px] font-bold text-text-primary tracking-tight">RepublicHub</h1>
          <p className="text-[11px] text-text-muted font-medium">Gestão colaborativa</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-secondary hover:bg-bg-soft hover:text-text-primary'
              }`}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Notifications */}
      {onNotifications && (
        <div className="px-3 pb-4">
          <button
            onClick={onNotifications}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-soft hover:text-text-primary transition-all duration-150"
          >
            <div className="relative">
              <Bell className="w-[18px] h-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-red rounded-full ring-2 ring-white" />
              )}
            </div>
            <span>Notificações</span>
          </button>
        </div>
      )}
    </aside>
  );
}
