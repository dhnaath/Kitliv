import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center font-sans">
      <div className={cn("w-full w-full max-w-6xl mx-auto bg-white min-h-screen border-x border-slate-200 shadow-sm relative overflow-hidden flex flex-col", className)}>
        {children}
      </div>
    </div>
  );
}
