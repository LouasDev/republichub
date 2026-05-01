import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface ShellProps {
  children: ReactNode;
  onNotifications?: () => void;
  unreadCount?: number;
}

export function Shell({ children, onNotifications, unreadCount = 0 }: ShellProps) {
  return (
    <div className="min-h-screen bg-bg-app">
      <Sidebar onNotifications={onNotifications} unreadCount={unreadCount} />
      <main className="lg:ml-[260px] max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 pb-24 lg:pb-8">
        {children}
      </main>
      <BottomNav unreadCount={unreadCount} />
    </div>
  );
}
