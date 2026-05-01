import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContext = React.createContext<{ value: string; onValueChange: (value: string) => void }>({
  value: '',
  onValueChange: () => {},
});

const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className }) => (
  <TabsContext.Provider value={{ value, onValueChange }}>
    <div className={cn('', className)}>{children}</div>
  </TabsContext.Provider>
);

const TabsList: React.FC<TabsListProps> = ({ children, className }) => (
  <div className={cn('flex bg-bg-soft rounded-xl p-1 gap-0.5 overflow-x-auto scrollbar-hide', className)}>
    {children}
  </div>
);

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className }) => {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
  const isActive = value === selectedValue;

  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn(
        'px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 whitespace-nowrap',
        isActive
          ? 'bg-white text-text-primary shadow-sm'
          : 'text-text-muted hover:text-text-secondary',
        className
      )}
    >
      {children}
    </button>
  );
};

const TabsContent: React.FC<TabsContentProps> = ({ value, children, className }) => {
  const { value: selectedValue } = React.useContext(TabsContext);
  if (value !== selectedValue) return null;

  return <div className={cn('mt-4', className)}>{children}</div>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
