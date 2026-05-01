import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, ShoppingCart, ListChecks, MoreHorizontal } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Início', path: '/' },
  { icon: Wallet, label: 'Finanças', path: '/financas' },
  { icon: ShoppingCart, label: 'Compras', path: '/compras' },
  { icon: ListChecks, label: 'Tarefas', path: '/tarefas' },
  { icon: MoreHorizontal, label: 'Mais', path: '/visao-geral' },
];

interface BottomNavProps {
  unreadCount?: number;
}

export function BottomNav({ unreadCount = 0 }: BottomNavProps) {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-border-light z-40 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-full transition-colors ${
                isActive ? 'text-accent' : 'text-text-muted'
              }`}
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {item.path === '/' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-accent-red rounded-full ring-2 ring-white" />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
