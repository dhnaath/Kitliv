import React, { useState } from 'react';
import { Building, ChevronLeft, Menu, X, Briefcase } from 'lucide-react';
import ValuationTools from './components/ValuationTools';
import { cn } from '../syariah/lib/utils';

export default function App({ onBack }: { onBack?: () => void } = {}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'property' | 'business'>('property');

  const TABS = [
    { id: 'property', label: 'Valuasi Properti', icon: Building },
    { id: 'business', label: 'Valuasi Bisnis', icon: Briefcase },
  ];

  return (
    <div className="flex h-full w-full bg-slate-50 text-slate-900 overflow-hidden font-sans relative">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex w-[240px] shrink-0 bg-white border-r border-slate-200 flex-col shadow-sm transition-all z-20">
        {onBack && (
          <div
            onClick={onBack}
            className="h-14 flex items-center px-4 cursor-pointer hover:bg-slate-50 transition-colors text-slate-500 border-b border-slate-200"
          >
            <ChevronLeft size={18} className="mr-2" />
            <span className="text-[14px] font-medium">Kembali ke Hub</span>
          </div>
        )}

        <div className="h-20 flex items-center px-6 mb-4 shrink-0 border-b border-slate-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl text-white flex items-center justify-center shadow-md">
              <Building size={20} strokeWidth={2.5} />
            </div>
            <div className="ml-3">
              <span className="block font-bold text-[16px] text-slate-900 leading-tight">Valuasi MAPPI</span>
              <span className="block text-xs font-medium text-slate-500">Penilaian & Analisis</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1 scrollbar-hide">
          {TABS.map((tab) => (
            <NavItem
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as any)}
            />
          ))}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-[280px] h-full bg-white border-r border-slate-200 flex flex-col shadow-2xl animate-in slide-in-from-left">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 bg-white">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg text-white flex items-center justify-center shadow-sm">
                  <Building size={16} strokeWidth={2.5} />
                </div>
                <span className="ml-3 font-bold text-[15px] text-slate-900">Valuasi MAPPI</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 -mr-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {TABS.map((tab) => (
                <NavItem
                  key={tab.id}
                  icon={tab.icon}
                  label={tab.label}
                  active={activeTab === tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsSidebarOpen(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50 relative">
        <div className="h-16 border-b border-slate-200 flex items-center px-4 sm:px-8 bg-white shrink-0 sticky top-0 z-10 shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 -ml-2 mr-3 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-slate-800 text-lg">
              {TABS.find(t => t.id === activeTab)?.label}
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-hide">
          <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <ValuationTools activeTab={activeTab} />
            
            <footer className="pt-8 mt-12 border-t border-slate-200 text-center text-sm font-medium text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span>© 2024 Valuasi MAPPI</span>
              <span>Pasar Muamalah Global</span>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, count, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 group",
        active
          ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm border border-indigo-100/50"
          : "hover:bg-white hover:shadow-sm border border-transparent text-slate-600 hover:text-slate-900",
      )}
    >
      <Icon
        size={18}
        className={cn(
          "mr-3",
          active
            ? "text-indigo-600"
            : "text-slate-400 group-hover:text-indigo-500 transition-colors",
        )}
      />
      <span className="flex-1 text-[14px]">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-full",
            active
              ? "bg-indigo-100 text-indigo-700"
              : "text-slate-400 group-hover:bg-slate-100",
          )}
        >
          {count}
        </span>
      )}
    </div>
  );
}
