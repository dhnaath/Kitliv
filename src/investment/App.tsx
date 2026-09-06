import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Inbox,
  Calendar,
  Sun,
  CalendarDays,
  Hash,
  Folder,
  MoreHorizontal,
  X,
  Plus,
  Check,
  Circle,
  AlignLeft,
  ListTodo,
  Activity,
  Flag,
  Search,
  Bell,
  LayoutGrid,
  ChevronLeft,
  List,
  Grid,
  TrendingUp,
  Calculator,
  PieChart,
  Save,
  Wallet,
  Briefcase,
  ChevronRight
} from "lucide-react";
import { cn } from "../wira/lib/utils";
import { useAuth } from '../syariah/lib/AuthContext';
import { useSaveCalculation } from '../syariah/lib/useSaveCalculation';

interface TickTickLayoutProps {
  onBack?: () => void;
}

export default function App({ onBack }: TickTickLayoutProps = {}) {
  const [selectedTool, setSelectedTool] = useState<any | null>(null);
  const [activeView, setActiveView] = useState<"all" | "personal" | "business">("all");
  const [layoutMode, setLayoutMode] = useState<"list" | "grid">("grid");
  
  // Auth and Save context
  const { user } = useAuth();
  const { save: saveCompound, status: statusCompound } = useSaveCalculation('investasi_bunga_majemuk');
  const { save: saveRoi, status: statusRoi } = useSaveCalculation('investasi_roi');

  // Calculator states
  const [compoundState, setCompoundState] = useState({
    principal: 10000000,
    monthlyContribution: 1000000,
    years: 10,
    annualReturn: 8
  });

  const [roiState, setRoiState] = useState({
    initialInvestment: 50000000,
    finalValue: 65000000,
    investmentDuration: 2
  });

  // Tools mock data
  const tools = [
    {
      id: "compound",
      title: "Bunga Majemuk",
      category: "Personal",
      group: "Kalkulator Utama",
      icon: TrendingUp,
      description: "Hitung potensi pertumbuhan investasi Anda dari waktu ke waktu dengan efek bunga berbunga.",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50"
    },
    {
      id: "roi",
      title: "Return on Investment",
      category: "Business",
      group: "Kalkulator Utama",
      icon: Calculator,
      description: "Evaluasi kinerja investasi Anda dengan menghitung total ROI dan Annualized ROI.",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      id: "portfolio",
      title: "Simulasi Portofolio",
      category: "Personal",
      group: "Alat Tambahan",
      icon: PieChart,
      description: "Rencanakan alokasi aset yang optimal sesuai dengan profil risiko Anda.",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    }
  ];

  const filteredTools = activeView === "all" ? tools : tools.filter(t => t.category.toLowerCase() === activeView);

  const calculateCompoundInterest = () => {
    let total = compoundState.principal;
    let totalInvested = compoundState.principal;
    const monthlyRate = compoundState.annualReturn / 100 / 12;
    const totalMonths = compoundState.years * 12;

    for (let i = 0; i < totalMonths; i++) {
      total = total * (1 + monthlyRate) + compoundState.monthlyContribution;
      totalInvested += compoundState.monthlyContribution;
    }
    return { total, totalInvested, interestEarned: total - totalInvested };
  };

  const calculateROI = () => {
    const profit = roiState.finalValue - roiState.initialInvestment;
    const roi = (profit / roiState.initialInvestment) * 100;
    const annualizedROI = ((Math.pow(roiState.finalValue / roiState.initialInvestment, 1 / (roiState.investmentDuration || 1))) - 1) * 100;
    
    return { profit, roi, annualizedROI };
  };

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex h-full w-full bg-white text-slate-800 overflow-hidden font-sans relative">
      {/* Pane 1: Narrow Sidebar (Kolom Kiri) */}
      <div className="hidden md:flex w-[240px] shrink-0 bg-[#F9F9F9] border-r border-slate-200 flex-col transition-all">
        {onBack && (
          <div
            onClick={onBack}
            className="h-10 flex items-center px-4 cursor-pointer hover:bg-slate-200/50 transition-colors text-slate-500 border-b border-slate-200"
          >
            <ChevronLeft size={16} className="mr-1" />
            <span className="text-[13px] font-medium">Back to Hub</span>
          </div>
        )}

        {/* Profile / Header */}
        <div className="h-14 flex items-center justify-between px-4 mb-2 shrink-0">
          <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-indigo-600 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-sm">
              I
            </div>
            <span className="ml-2 font-semibold text-sm">Investasi</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors">
              <Search size={16} />
            </button>
            <button className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors">
              <Bell size={16} />
            </button>
          </div>
        </div>

        {/* Nav Items */}
        <div className="px-3 space-y-0.5 flex-1 overflow-y-auto scrollbar-hide pb-6">
          <NavItem
            icon={LayoutGrid}
            label="Semua Alat"
            count={tools.length}
            active={activeView === "all"}
            onClick={() => setActiveView("all")}
          />
          
          <div className="mt-6 mb-2 px-2 text-xs font-semibold text-slate-400 flex items-center justify-between group cursor-pointer">
            KATEGORI
            <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <NavItem
            icon={Folder}
            label="Personal"
            color="text-emerald-500"
            active={activeView === "personal"}
            onClick={() => setActiveView("personal")}
          />
          <NavItem
            icon={Folder}
            label="Business"
            color="text-blue-500"
            active={activeView === "business"}
            onClick={() => setActiveView("business")}
          />

          <div className="mt-6 mb-2 px-2 text-xs font-semibold text-slate-400 flex items-center justify-between group cursor-pointer">
            STATUS
            <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <NavItem icon={Hash} label="Tersimpan" color="text-purple-500" />
          <NavItem icon={Hash} label="Simulasi" color="text-amber-500" />
        </div>
      </div>

      {/* Pane 2: Tools List View (Kolom Tengah) */}
      <div
        className={cn(
          "flex-1 flex-col md:min-w-[320px] bg-white transition-all relative",
          selectedTool ? "hidden md:flex" : "flex",
        )}
      >
        <div className="h-14 flex items-center justify-between px-4 md:px-8 border-b border-transparent shrink-0">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-slate-900 capitalize">
              {activeView === "all" ? "Semua Alat" : activeView}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-md">
              <button
                onClick={() => setLayoutMode("list")}
                className={cn("p-1.5 rounded text-slate-500 transition-colors", layoutMode === "list" ? "bg-white text-slate-800 shadow-sm" : "hover:text-slate-700")}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setLayoutMode("grid")}
                className={cn("p-1.5 rounded text-slate-500 transition-colors", layoutMode === "grid" ? "bg-white text-slate-800 shadow-sm" : "hover:text-slate-700")}
              >
                <Grid size={16} />
              </button>
            </div>
            <button className="text-slate-400 hover:text-slate-800 transition-colors ml-2">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 pb-24">
          {/* Tool Groups */}
          {["Kalkulator Utama", "Alat Tambahan"].map((group) => {
            const groupTools = filteredTools.filter((t) => t.group === group);
            if (groupTools.length === 0) return null;

            return (
              <div
                key={group}
                className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <h3 className="text-sm font-bold mb-4 flex items-center border-b border-slate-200 pb-2 text-slate-800">
                  {group}
                  <span className="ml-2 bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full font-medium">
                    {groupTools.length}
                  </span>
                </h3>
                
                {layoutMode === "list" ? (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {groupTools.map((tool) => (
                        <ToolListItem
                          key={tool.id}
                          tool={tool}
                          isSelected={selectedTool?.id === tool.id}
                          onClick={() => setSelectedTool(tool)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {groupTools.map((tool) => (
                        <ToolGridItem
                          key={tool.id}
                          tool={tool}
                          isSelected={selectedTool?.id === tool.id}
                          onClick={() => setSelectedTool(tool)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pane 3: Detail Panel (Kolom Kanan) */}
      <div
        className={cn(
          "bg-white border-l border-slate-200 flex-col transition-all duration-300 ease-in-out shrink-0",
          "fixed inset-0 md:static md:inset-auto z-50 md:z-auto",
          selectedTool
            ? "md:w-[450px] lg:w-[500px] translate-x-0 opacity-100 flex"
            : "w-0 translate-x-full opacity-0 border-none hidden md:flex",
        )}
      >
        {selectedTool && (
          <>
            <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 shrink-0">
              <div className="flex items-center text-slate-400 gap-1">
                <button
                  className="md:hidden p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors mr-2"
                  onClick={() => setSelectedTool(null)}
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="text-sm font-medium text-slate-600 flex items-center gap-2">
                   <div className={cn("p-1 rounded-md", selectedTool.bgColor, selectedTool.color)}>
                     <selectedTool.icon size={16} />
                   </div>
                   {selectedTool.title}
                </div>
              </div>
              <button
                onClick={() => setSelectedTool(null)}
                className="hidden md:block p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-[#F9F9F9]">
              {selectedTool.id === 'compound' && (
                <div className="space-y-6">
                   <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center"><Calculator size={18} className="mr-2 text-slate-400" /> Parameter Investasi</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Modal Awal (Rp)</label>
                          <input
                            type="number"
                            value={compoundState.principal || ''}
                            onChange={(e) => setCompoundState({...compoundState, principal: Number(e.target.value)})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Kontribusi Bulanan (Rp)</label>
                          <input
                            type="number"
                            value={compoundState.monthlyContribution || ''}
                            onChange={(e) => setCompoundState({...compoundState, monthlyContribution: Number(e.target.value)})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Durasi (Tahun)</label>
                            <input
                              type="number"
                              value={compoundState.years || ''}
                              onChange={(e) => setCompoundState({...compoundState, years: Number(e.target.value)})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Return per Tahun (%)</label>
                            <input
                              type="number"
                              value={compoundState.annualReturn || ''}
                              onChange={(e) => setCompoundState({...compoundState, annualReturn: Number(e.target.value)})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                   </div>

                   {/* Result */}
                   <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-md">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Estimasi Nilai Akhir</span>
                      <div className="text-3xl font-bold mb-6">
                        {formatIDR(calculateCompoundInterest().total)}
                      </div>

                      <div className="space-y-3 pt-4 border-t border-slate-700 text-sm">
                        <div className="flex justify-between text-slate-300">
                          <span>Total Modal (Disetor)</span>
                          <span className="font-medium text-white">{formatIDR(calculateCompoundInterest().totalInvested)}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Proyeksi Imbal Hasil</span>
                          <span className="font-medium text-emerald-400">+{formatIDR(calculateCompoundInterest().interestEarned)}</span>
                        </div>
                      </div>

                      {user && calculateCompoundInterest().total > 0 && (
                        <button
                          onClick={() => saveCompound(`Bunga Majemuk — ${formatIDR(calculateCompoundInterest().total)}`, compoundState, calculateCompoundInterest())}
                          disabled={statusCompound !== 'idle'}
                          className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 border border-white/10"
                        >
                          {statusCompound === 'idle' && <><Save size={16} /> Simpan Hasil</>}
                          {statusCompound === 'saving' && 'Menyimpan...'}
                          {statusCompound === 'saved' && <><Check size={16} /> Tersimpan</>}
                        </button>
                      )}
                   </div>
                </div>
              )}

              {selectedTool.id === 'roi' && (
                <div className="space-y-6">
                   <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center"><Activity size={18} className="mr-2 text-slate-400" /> Parameter Investasi</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nilai Investasi Awal (Rp)</label>
                          <input
                            type="number"
                            value={roiState.initialInvestment || ''}
                            onChange={(e) => setRoiState({...roiState, initialInvestment: Number(e.target.value)})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nilai Investasi Akhir (Rp)</label>
                          <input
                            type="number"
                            value={roiState.finalValue || ''}
                            onChange={(e) => setRoiState({...roiState, finalValue: Number(e.target.value)})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Durasi (Tahun)</label>
                          <input
                            type="number"
                            value={roiState.investmentDuration || ''}
                            onChange={(e) => setRoiState({...roiState, investmentDuration: Number(e.target.value)})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          />
                        </div>
                      </div>
                   </div>

                   {/* Result */}
                   <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-md">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Total Keuntungan / Kerugian</span>
                      <div className={cn("text-2xl font-bold mb-6", calculateROI().profit >= 0 ? "text-emerald-400" : "text-rose-400")}>
                        {calculateROI().profit >= 0 ? "+" : ""}{formatIDR(calculateROI().profit)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total ROI</span>
                          <div className={cn("text-xl font-bold", calculateROI().roi >= 0 ? "text-white" : "text-rose-400")}>
                            {calculateROI().roi >= 0 ? "+" : ""}{calculateROI().roi.toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Annualized ROI</span>
                          <div className={cn("text-xl font-bold", calculateROI().annualizedROI >= 0 ? "text-white" : "text-rose-400")}>
                            {calculateROI().annualizedROI >= 0 ? "+" : ""}{calculateROI().annualizedROI.toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      {user && (
                        <button
                          onClick={() => saveRoi(`ROI — ${calculateROI().roi.toFixed(2)}%`, roiState, calculateROI())}
                          disabled={statusRoi !== 'idle'}
                          className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 border border-white/10"
                        >
                          {statusRoi === 'idle' && <><Save size={16} /> Simpan Hasil</>}
                          {statusRoi === 'saving' && 'Menyimpan...'}
                          {statusRoi === 'saved' && <><Check size={16} /> Tersimpan</>}
                        </button>
                      )}
                   </div>
                </div>
              )}

              {selectedTool.id === 'portfolio' && (
                <div className="text-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                   <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                     <PieChart size={32} className="text-slate-400" />
                   </div>
                   <h3 className="font-bold text-slate-800 mb-2">Segera Hadir</h3>
                   <p className="text-sm text-slate-500">Fitur simulasi portofolio sedang dalam tahap pengembangan.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, count, active, color, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors group",
        active
          ? "bg-blue-50/50 text-blue-600 font-medium"
          : "hover:bg-slate-100 border border-transparent",
      )}
    >
      <Icon
        size={16}
        className={cn(
          "mr-3",
          color ||
            (active
              ? "text-blue-600"
              : "text-slate-500 group-hover:text-slate-700 transition-colors"),
        )}
      />
      <span
        className={cn(
          "flex-1 text-[13px]",
          active ? "font-semibold" : "text-slate-700",
        )}
      >
        {label}
      </span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "text-xs font-bold px-1.5 rounded-full",
            active
              ? "bg-blue-100 text-blue-600"
              : "text-slate-400 group-hover:bg-slate-200",
          )}
        >
          {count}
        </span>
      )}
    </div>
  );
}

function ToolGridItem({ tool, isSelected, onClick }: any) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col p-5 rounded-2xl cursor-pointer transition-all border outline-none overflow-hidden bg-white shadow-sm hover:shadow-md",
        isSelected ? "border-blue-500 ring-1 ring-blue-500" : "border-slate-200 hover:border-slate-300",
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl border border-black/5", tool.bgColor, tool.color)}>
           <tool.icon size={20} />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <h4 className="font-bold text-slate-800 leading-snug mb-2 text-lg">
          {tool.title}
        </h4>
        <p className="text-sm text-slate-500 line-clamp-2">
          {tool.description}
        </p>
      </div>
    </motion.div>
  );
}

function ToolListItem({ tool, isSelected, onClick }: any) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 2 }}
      onClick={onClick}
      className={cn(
        "group relative flex items-center p-4 rounded-xl cursor-pointer transition-all border outline-none bg-white hover:shadow-sm",
        isSelected ? "border-blue-500 ring-1 ring-blue-500" : "border-slate-200 hover:border-slate-300",
      )}
    >
      <div className={cn("p-2 rounded-lg border border-black/5 mr-4", tool.bgColor, tool.color)}>
         <tool.icon size={18} />
      </div>
      
      <div className="flex-1 flex flex-col">
        <h4 className="font-semibold text-slate-800 leading-snug">
          {tool.title}
        </h4>
        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 hidden sm:block">
          {tool.description}
        </p>
      </div>
      
      <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors ml-4" />
    </motion.div>
  );
}
