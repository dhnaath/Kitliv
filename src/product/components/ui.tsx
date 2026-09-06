import React from 'react';
import { cn } from '../utils';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-white p-6 rounded-3xl border border-slate-100 shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}

export function Button({ className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }) {
  const base = "inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg shadow-blue-500/20",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500",
    ghost: "hover:bg-slate-100 text-slate-700 focus:ring-slate-500",
  };
  const sizes = "px-6 py-2 text-sm";
  
  return (
    <button className={cn(base, variants[variant], sizes, className)} {...props} />
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex w-full bg-slate-100 border-none rounded-full py-2 px-6 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex w-full bg-slate-100 border-none rounded-full py-2 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("block text-sm font-medium text-slate-700 mb-1.5", className)} {...props} />
  );
}

export function Badge({ className, variant = 'default', children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'success' | 'warning' | 'danger' }) {
  const variants = {
    default: "bg-slate-100 text-slate-600",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
  };
  return (
    <span className={cn("inline-flex items-center px-3 py-1 text-[10px] font-bold rounded-full uppercase", variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
