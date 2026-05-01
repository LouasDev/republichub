import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => onOpenChange(false)}>
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-lg animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DialogHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('flex items-center justify-between px-6 pt-6 pb-4', className)}>
    {children}
  </div>
);

const DialogTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h2 className={cn('text-lg font-semibold', className)}>{children}</h2>
);

const DialogClose: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="p-1.5 hover:bg-bg-soft rounded-lg transition-colors">
    <X className="w-5 h-5 text-text-muted" />
  </button>
);

const DialogContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('px-6 pb-6 space-y-4', className)}>{children}</div>
);

const DialogFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('flex gap-2 pt-2', className)}>{children}</div>
);

export { Dialog, DialogHeader, DialogTitle, DialogClose, DialogContent, DialogFooter };
