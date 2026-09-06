with open('src/valuation/App.tsx', 'w') as f:
    f.write("""import React, { useState } from 'react';
import { Building, ChevronLeft, Menu, X, LayoutDashboard } from 'lucide-react';
import ValuationTools from '../syariah/components/ValuationTools';
import { cn } from '../syariah/lib/utils';

export default function App({ onBack }: { onBack?: () => void } = {}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const activeTab = 'dashboard';

  const TABS = [
    { id: 'dashboard', label: 'Dashboard Valuasi', icon: LayoutDashboard },
  ];

  return (
    <div className="flex h-full w-full bg-white text-slate-800 overflow-hidden font-sans relative">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex w-[240px] shrink-0 bg-[#F9F9F9] border-r border-slate-200 flex-col transition-all">
        {onBack && (
          <div
            onClick={onBack}
            className="h-10 flex items-center px-4 cursor-pointer hover:bg-slate-200/50 transition-colors text-slate-500 border-b border-slate-200"
          >
            <ChevronLeft size={16} className="mr-1" />
            <span className="text-[13px] font-medium">Kembali</span>
          </div>
        )}

        <div className="h-14 flex items-center px-4 mb-2 shrink-0 border-b border-slate-200">
          <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-blue-600 rounded-lg text-white flex items-center justify-center shadow-sm">
              <Building size={16} strokeWidth={2.5} />
            </div>
            <span className="ml-3 font-bold text-[15px] text-slate-800 tracking-tight">Valuasi MAPPI</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
          {TABS.map((tab) => (
            <NavItem
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-[280px] h-full bg-white border-r border-slate-200 flex flex-col shadow-2xl animate-in slide-in-from-left">
            <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 bg-white">
              <div className="flex items-center">
                <div className="w-7 h-7 bg-blue-600 rounded-lg text-white flex items-center justify-center shadow-sm">
                  <Building size={16} strokeWidth={2.5} />
                </div>
                <span className="ml-3 font-bold text-[15px] text-slate-800">Valuasi MAPPI</span>
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
                  onClick={() => setIsSidebarOpen(false)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
        <div className="h-14 border-b border-slate-200 flex items-center px-4 sm:px-6 bg-white shrink-0 sticky top-0 z-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 -ml-2 mr-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-slate-800">
              {TABS.find(t => t.id === activeTab)?.label}
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-hide bg-slate-50/50">
          <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="animate-in fade-in duration-500">
              <ValuationTools />
            </div>
            
            <footer className="pt-8 mt-12 border-t border-slate-200 text-center text-xs text-slate-400 flex flex-col md:flex-row justify-between items-center gap-2">
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
        "flex items-center px-3 py-2.5 rounded-xl cursor-pointer transition-colors group",
        active
          ? "bg-blue-50/80 text-blue-700 font-semibold"
          : "hover:bg-slate-100 border border-transparent text-slate-600",
      )}
    >
      <Icon
        size={18}
        className={cn(
          "mr-3",
          active
            ? "text-blue-600"
            : "text-slate-400 group-hover:text-slate-600 transition-colors",
        )}
      />
      <span className="flex-1 text-[13px]">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-full",
            active
              ? "bg-blue-100 text-blue-700"
              : "text-slate-400 group-hover:bg-slate-200",
          )}
        >
          {count}
        </span>
      )}
    </div>
  );
}
""")
