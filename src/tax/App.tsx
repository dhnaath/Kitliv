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
  ChevronRight,
  Receipt,
  ShoppingCart,
  Percent
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
  const { save: savePPh21, status: statusPPh21 } = useSaveCalculation('pajak_pph21');
  const { save: saveSaham, status: statusSaham } = useSaveCalculation('pajak_saham');
  const { save: saveProperti, status: statusProperti } = useSaveCalculation('pajak_properti');
  const { save: savePpn, status: statusPpn } = useSaveCalculation('pajak_ppn');

  // Calculator states
  const [annualIncome, setAnnualIncome] = useState<number>(100000000);
  const [stockTransaction, setStockTransaction] = useState<number>(0);
  const [dividendIncome, setDividendIncome] = useState<number>(0);
  
  // Properti State
  const [propertyTransactionValue, setPropertyTransactionValue] = useState<number>(1000000000);
  const [npoptkp, setNpoptkp] = useState<number>(60000000); 
  const [propertyRentValue, setPropertyRentValue] = useState<number>(100000000);
  
  // PPN State
  const [vatTransaction, setVatTransaction] = useState<number>(100000000);

  // Tools mock data
  const tools = [
    {
      id: "pph21",
      title: "PPh 21",
      category: "Personal",
      group: "Kalkulator Utama",
      icon: Calculator,
      description: "Hitung Pajak Penghasilan (PPh 21) Dasar dengan tarif progresif terbaru.",
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      id: "saham",
      title: "PPh Saham & Dividen",
      category: "Personal",
      group: "Kalkulator Utama",
      icon: TrendingUp,
      description: "Kalkulasi pajak final atas penjualan saham dan pendapatan dividen.",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      id: "properti",
      title: "Pajak Properti",
      category: "Business",
      group: "Kalkulator Utama",
      icon: Briefcase,
      description: "Hitung PPh Jual Beli, BPHTB, dan Pajak Sewa Properti.",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50"
    },
    {
      id: "ppn",
      title: "PPN (Pajak Pertambahan Nilai)",
      category: "Business",
      group: "Kalkulator Tambahan",
      icon: ShoppingCart,
      description: "Kalkulator PPN 11% berdasarkan Undang-Undang HPP.",
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    }
  ];

  const filteredTools = activeView === "all" ? tools : tools.filter(t => t.category.toLowerCase() === activeView);

  // Perhitungan PPh 21 (Simulasi Progresif Dasar)
  const calculatePPh21 = (income: number) => {
    const ptkp = 54000000; // PTKP Dasar (TK/0)
    let pkp = income - ptkp;
    if (pkp <= 0) return { tax: 0, ptkp, pkp: 0 };
    
    let tax = 0;
    
    // Tier 1: 5% (0 - 60 Juta)
    if (pkp > 0) {
      const tier1 = Math.min(pkp, 60000000);
      tax += tier1 * 0.05;
      pkp -= tier1;
    }
    // Tier 2: 15% (60 Juta - 250 Juta)
    if (pkp > 0) {
      const tier2 = Math.min(pkp, 190000000);
      tax += tier2 * 0.15;
      pkp -= tier2;
    }
    // Tier 3: 25% (250 Juta - 500 Juta)
    if (pkp > 0) {
      const tier3 = Math.min(pkp, 250000000);
      tax += tier3 * 0.25;
      pkp -= tier3;
    }
    // Tier 4: 30% (500 Juta - 5 Miliar)
    if (pkp > 0) {
      const tier4 = Math.min(pkp, 4500000000);
      tax += tier4 * 0.30;
      pkp -= tier4;
    }
    // Tier 5: 35% (> 5 Miliar)
    if (pkp > 0) {
      tax += pkp * 0.35;
    }
    
    return { tax, ptkp, pkp: income - ptkp };
  };

  const incomeTaxResult = calculatePPh21(annualIncome);
  const stockTaxResult = stockTransaction * 0.001; // PPh Final 0.1% untuk penjualan saham
  const dividendTaxResult = dividendIncome * 0.1; // PPh Final 10% untuk dividen

  // Perhitungan Pajak Properti & PPN
  const pphPenjualanProperti = propertyTransactionValue * 0.025; // 2.5% PPh Final Jual Beli
  const bphtbProperti = Math.max(0, propertyTransactionValue - npoptkp) * 0.05; // 5% BPHTB (Pembeli)
  const pphSewaProperti = propertyRentValue * 0.10; // 10% PPh Final Sewa
  
  const ppnResult = vatTransaction * 0.11; // 11% PPN

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
            <div className="w-7 h-7 bg-red-600 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-sm">
              T
            </div>
            <span className="ml-2 font-semibold text-sm">Kalkulator Pajak</span>
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
            count={tools.filter(t => t.category === "Personal").length}
            active={activeView === "personal"}
            onClick={() => setActiveView("personal")}
          />
          <NavItem
            icon={Folder}
            label="Business"
            color="text-blue-500"
            count={tools.filter(t => t.category === "Business").length}
            active={activeView === "business"}
            onClick={() => setActiveView("business")}
          />
        </div>
      </div>

      {/* Pane 2: Tools List (Kolom Tengah) */}
      <div className={cn(
        "flex flex-col bg-white border-r border-slate-200 transition-all",
        selectedTool ? "hidden lg:flex lg:w-[320px]" : "w-full md:flex-1 lg:w-[320px] shrink-0"
      )}>
        <div className="h-14 flex items-center justify-between px-4 md:px-6 shrink-0 border-b border-transparent">
          <div className="flex items-center gap-2 md:hidden">
            {onBack && (
              <button onClick={onBack} className="p-1 -ml-1 text-slate-500 hover:bg-slate-100 rounded-md">
                <ChevronLeft size={20} />
              </button>
            )}
            <h2 className="text-lg font-bold capitalize">{activeView} Pajak</h2>
          </div>
          <h2 className="hidden md:block text-xl font-bold capitalize">{activeView} Alat Pajak</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLayoutMode("list")}
              className={cn("p-1.5 rounded-md transition-colors", layoutMode === "list" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600")}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setLayoutMode("grid")}
              className={cn("p-1.5 rounded-md transition-colors", layoutMode === "grid" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600")}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-20 md:pb-6">
          {["Kalkulator Utama", "Kalkulator Tambahan"].map(group => {
            const groupTools = filteredTools.filter(t => t.group === group);
            if (groupTools.length === 0) return null;

            return (
              <div key={group} className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-slate-800">{group}</h3>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{groupTools.length}</span>
                </div>
                <div className={cn(
                  "grid gap-3",
                  layoutMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1" : "grid-cols-1"
                )}>
                  {groupTools.map(tool => (
                    <div
                      key={tool.id}
                      onClick={() => setSelectedTool(tool)}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md",
                        selectedTool?.id === tool.id ? "border-blue-500 ring-1 ring-blue-500/20 bg-blue-50/10" : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={cn("p-2.5 rounded-lg", tool.bgColor, tool.color)}>
                          <tool.icon size={20} />
                        </div>
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-1">{tool.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{tool.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pane 3: Tool Detail (Kolom Kanan) */}
      <AnimatePresence>
        {selectedTool && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-10 flex flex-col bg-white lg:static lg:flex-1 border-l border-slate-200"
          >
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100 shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedTool(null)}
                  className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Folder size={14} />
                  <span>{selectedTool.category}</span>
                </div>
              </div>
              <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className={cn("p-3 rounded-xl", selectedTool.bgColor, selectedTool.color)}>
                    <selectedTool.icon size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedTool.title}</h2>
                    <p className="text-slate-500 text-sm mt-1">{selectedTool.description}</p>
                  </div>
                </div>

                {/* --- CALCULATOR VIEWS --- */}
                
                {selectedTool.id === "pph21" && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Penghasilan Bruto Setahun</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                        <input
                          type="number"
                          value={annualIncome || ''}
                          onChange={(e) => setAnnualIncome(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium text-slate-800"
                        />
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-500">Total Penghasilan</span>
                        <span className="font-semibold text-slate-800">{formatIDR(annualIncome)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-500">PTKP Dasar (TK/0)</span>
                        <span className="font-semibold text-slate-800">{formatIDR(incomeTaxResult.ptkp)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-500">Penghasilan Kena Pajak (PKP)</span>
                        <span className="font-semibold text-slate-800">{formatIDR(Math.max(0, incomeTaxResult.pkp))}</span>
                      </div>
                      <div className="mt-6 p-5 bg-red-50 rounded-xl border border-red-100 flex justify-between items-center">
                        <div>
                          <span className="block text-red-600 font-semibold mb-1">Total PPh 21 Setahun</span>
                          <span className="text-xs text-red-500">Estimasi berdasar tarif progresif</span>
                        </div>
                        <span className="text-2xl font-bold text-red-700">{formatIDR(incomeTaxResult.tax)}</span>
                      </div>

                      {user && annualIncome > 0 && (
                        <button
                          onClick={() => savePPh21(`PPh 21 — ${formatIDR(incomeTaxResult.tax)}`, { annualIncome }, { tax: incomeTaxResult.tax })}
                          disabled={statusPPh21 !== 'idle'}
                          className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                          {statusPPh21 === 'idle' && <><Save className="w-4 h-4" /> Simpan Perhitungan</>}
                          {statusPPh21 === 'saving' && 'Menyimpan...'}
                          {statusPPh21 === 'saved' && <><Check className="w-4 h-4" /> Tersimpan</>}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {selectedTool.id === "saham" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4">Pajak Penjualan Saham (PPh Final 0.1%)</h3>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Nilai Transaksi Jual</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                          <input
                            type="number"
                            value={stockTransaction || ''}
                            onChange={(e) => setStockTransaction(Number(e.target.value))}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium text-slate-800"
                          />
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50 flex justify-between items-center">
                        <span className="text-slate-600 font-medium">PPh Final (0.1%)</span>
                        <span className="text-xl font-bold text-blue-600">{formatIDR(stockTaxResult)}</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4">Pajak Dividen (PPh Final 10%)</h3>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Pendapatan Dividen</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                          <input
                            type="number"
                            value={dividendIncome || ''}
                            onChange={(e) => setDividendIncome(Number(e.target.value))}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium text-slate-800"
                          />
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50 flex justify-between items-center">
                        <span className="text-slate-600 font-medium">PPh Final (10%)</span>
                        <span className="text-xl font-bold text-blue-600">{formatIDR(dividendTaxResult)}</span>
                      </div>
                    </div>

                    {user && (stockTransaction > 0 || dividendIncome > 0) && (
                      <button
                        onClick={() => saveSaham(`Pajak Saham — ${formatIDR(stockTaxResult + dividendTaxResult)}`, { stockTransaction, dividendIncome }, { stockTaxResult, dividendTaxResult })}
                        disabled={statusSaham !== 'idle'}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                      >
                        {statusSaham === 'idle' && <><Save className="w-4 h-4" /> Simpan Hasil</>}
                        {statusSaham === 'saving' && 'Menyimpan...'}
                        {statusSaham === 'saved' && <><Check className="w-4 h-4" /> Tersimpan</>}
                      </button>
                    )}
                  </div>
                )}

                {selectedTool.id === "properti" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 bg-emerald-50/30">
                        <h3 className="font-bold text-emerald-800 mb-6">Jual Beli Properti</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nilai Transaksi (Harga Jual)</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                              <input
                                type="number"
                                value={propertyTransactionValue || ''}
                                onChange={(e) => setPropertyTransactionValue(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none font-medium text-slate-800"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">NPOPTKP (Tergantung Daerah)</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                              <input
                                type="number"
                                value={npoptkp || ''}
                                onChange={(e) => setNpoptkp(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none font-medium text-slate-800"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 space-y-4 bg-white">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-500">PPh Final Penjual (2.5%)</span>
                          <span className="font-bold text-emerald-700">{formatIDR(pphPenjualanProperti)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-500">BPHTB Pembeli (5%)</span>
                          <span className="font-bold text-emerald-700">{formatIDR(bphtbProperti)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 bg-emerald-50/30">
                        <h3 className="font-bold text-emerald-800 mb-6">Sewa Properti</h3>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nilai Sewa Keseluruhan</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                          <input
                            type="number"
                            value={propertyRentValue || ''}
                            onChange={(e) => setPropertyRentValue(Number(e.target.value))}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none font-medium text-slate-800"
                          />
                        </div>
                      </div>
                      <div className="p-6 bg-white flex justify-between items-center">
                        <span className="text-slate-600 font-medium">PPh Final Sewa (10%)</span>
                        <span className="text-xl font-bold text-emerald-600">{formatIDR(pphSewaProperti)}</span>
                      </div>
                    </div>

                    {user && (propertyTransactionValue > 0 || propertyRentValue > 0) && (
                      <button
                        onClick={() => saveProperti(`Pajak Properti — ${formatIDR(pphPenjualanProperti + bphtbProperti + pphSewaProperti)}`, { propertyTransactionValue, npoptkp, propertyRentValue }, { pphPenjualanProperti, bphtbProperti, pphSewaProperti })}
                        disabled={statusProperti !== 'idle'}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                      >
                        {statusProperti === 'idle' && <><Save className="w-4 h-4" /> Simpan Hasil</>}
                        {statusProperti === 'saving' && 'Menyimpan...'}
                        {statusProperti === 'saved' && <><Check className="w-4 h-4" /> Tersimpan</>}
                      </button>
                    )}
                  </div>
                )}

                {selectedTool.id === "ppn" && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-orange-50/50">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Dasar Pengenaan Pajak (DPP)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                        <input
                          type="number"
                          value={vatTransaction || ''}
                          onChange={(e) => setVatTransaction(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none font-medium text-slate-800"
                        />
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-500">Nilai Transaksi (DPP)</span>
                        <span className="font-semibold text-slate-800">{formatIDR(vatTransaction)}</span>
                      </div>
                      <div className="mt-6 p-5 bg-orange-50 rounded-xl border border-orange-100 flex justify-between items-center">
                        <div>
                          <span className="block text-orange-600 font-semibold mb-1">Nilai PPN (11%)</span>
                          <span className="text-xs text-orange-500">Sesuai UU HPP</span>
                        </div>
                        <span className="text-2xl font-bold text-orange-700">{formatIDR(ppnResult)}</span>
                      </div>
                      <div className="flex justify-between items-center py-4 px-2">
                        <span className="text-slate-600 font-semibold">Total Tagihan</span>
                        <span className="text-xl font-bold text-slate-800">{formatIDR(vatTransaction + ppnResult)}</span>
                      </div>

                      {user && vatTransaction > 0 && (
                        <button
                          onClick={() => savePpn(`PPN 11% — ${formatIDR(ppnResult)}`, { vatTransaction }, { ppnResult, total: vatTransaction + ppnResult })}
                          disabled={statusPpn !== 'idle'}
                          className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                          {statusPpn === 'idle' && <><Save className="w-4 h-4" /> Simpan Hasil</>}
                          {statusPpn === 'saving' && 'Menyimpan...'}
                          {statusPpn === 'saved' && <><Check className="w-4 h-4" /> Tersimpan</>}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
      {count !== undefined && (
        <span
          className={cn(
            "text-xs px-2 py-0.5 rounded-full transition-colors",
            active
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-600",
          )}
        >
          {count}
        </span>
      )}
    </div>
  );
}
